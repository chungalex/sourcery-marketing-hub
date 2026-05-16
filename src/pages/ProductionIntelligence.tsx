import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useOrders } from "@/hooks/useOrders";
import { 
  Sparkles, Send, Loader2, AlertTriangle, CheckCircle, 
  Clock, Package, TrendingUp, MessageSquare, ChevronRight,
  BarChart3, Zap, Circle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface OrderSignal {
  orderId: string;
  orderNumber: string;
  factoryName: string;
  status: string;
  signal: "critical" | "warning" | "info" | "good";
  message: string;
}

// ─── Order health signals ─────────────────────────────────────────────────────

function getOrderSignals(orders: any[]): OrderSignal[] {
  const signals: OrderSignal[] = [];
  const now = Date.now();

  for (const order of orders) {
    if (["closed", "cancelled"].includes(order.status)) continue;

    const daysToDelivery = order.delivery_window_end
      ? Math.ceil((new Date(order.delivery_window_end).getTime() - now) / (1000 * 60 * 60 * 24))
      : null;

    const daysSinceUpdate = Math.floor(
      (now - new Date(order.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Critical signals
    if (order.status === "po_issued" && daysSinceUpdate >= 4) {
      signals.push({
        orderId: order.id,
        orderNumber: order.order_number,
        factoryName: order.factories?.name || "Factory",
        status: order.status,
        signal: "critical",
        message: `No factory response in ${daysSinceUpdate} days since PO issued`,
      });
    } else if (daysToDelivery !== null && daysToDelivery < 14 && 
               ["sampling", "in_production", "qc_pending"].includes(order.status)) {
      signals.push({
        orderId: order.id,
        orderNumber: order.order_number,
        factoryName: order.factories?.name || "Factory",
        status: order.status,
        signal: "critical",
        message: `${daysToDelivery} days to delivery — at risk`,
      });
    } else if (daysToDelivery !== null && daysToDelivery < 28 && 
               ["po_accepted", "sampling"].includes(order.status)) {
      signals.push({
        orderId: order.id,
        orderNumber: order.order_number,
        factoryName: order.factories?.name || "Factory",
        status: order.status,
        signal: "warning",
        message: `${daysToDelivery} days to delivery — monitor closely`,
      });
    } else if (["qc_approved", "ready_to_ship"].includes(order.status)) {
      signals.push({
        orderId: order.id,
        orderNumber: order.order_number,
        factoryName: order.factories?.name || "Factory",
        status: order.status,
        signal: "info",
        message: "Ready for next action",
      });
    } else {
      signals.push({
        orderId: order.id,
        orderNumber: order.order_number,
        factoryName: order.factories?.name || "Factory",
        status: order.status,
        signal: "good",
        message: daysToDelivery ? `${daysToDelivery} days to delivery` : "On track",
      });
    }
  }

  // Sort: critical first
  return signals.sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2, good: 3 };
    return order[a.signal] - order[b.signal];
  });
}

// ─── Build system context for AI ─────────────────────────────────────────────

function buildSystemContext(orders: any[], profile: any): string {
  const activeOrders = orders.filter(o => !["closed", "cancelled"].includes(o.status));
  const closedOrders = orders.filter(o => o.status === "closed");
  const signals = getOrderSignals(orders);
  const criticalCount = signals.filter(s => s.signal === "critical").length;

  const orderSummaries = activeOrders.map(o => {
    const daysToDelivery = o.delivery_window_end
      ? Math.ceil((new Date(o.delivery_window_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;
    return `- Order ${o.order_number}: ${o.product_name || "Product"} | Factory: ${o.factories?.name || "Unknown"} | Status: ${o.status} | Qty: ${o.quantity || "?"} units${daysToDelivery ? ` | ${daysToDelivery} days to delivery` : ""}`;
  }).join("\n");

  return `You are the Production Intelligence AI for Sourcery — a factory relationship platform for physical product brands.

You are speaking with ${profile?.brand_name || "a brand founder"} who manufactures overseas.

CURRENT OPERATION SNAPSHOT:
- Active orders: ${activeOrders.length}
- Completed orders: ${closedOrders.length}  
- Critical alerts: ${criticalCount}
${activeOrders.length > 0 ? `\nACTIVE ORDERS:\n${orderSummaries}` : "\nNo active orders yet."}
${criticalCount > 0 ? `\nCRITICAL ISSUES:\n${signals.filter(s => s.signal === "critical").map(s => `- ${s.orderNumber} (${s.factoryName}): ${s.message}`).join("\n")}` : ""}

YOUR ROLE:
You are a senior sourcing director with 15+ years managing overseas production in Vietnam, Bangladesh, and China. You speak directly. You give specific advice, not generic guidance. You know the numbers, the stakes, and the cultural context.

You know this brand's specific operation — their orders, their factories, their history. You don't give generic supply chain advice. You give advice specific to THEIR situation as described above.

IMPORTANT:
- Be specific. Use their order numbers, factory names, quantities.
- If there are critical issues, address them directly.
- Don't pad with caveats or disclaimers.
- Speak like a trusted expert colleague, not a customer service bot.
- If you don't know something specific, say so and tell them what question to ask their factory.
- Manufacturing terms: PP sample = pre-production sample, TOP = top of production, AQL = acceptable quality level, GSM = fabric weight, OTIF = on-time in-full.`;
}

// ─── Suggested prompts by situation ──────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  { icon: AlertTriangle, label: "What needs my attention right now?", color: "text-amber-600" },
  { icon: Package, label: "Walk me through my active orders", color: "text-primary" },
  { icon: Clock, label: "Am I going to make my delivery windows?", color: "text-blue-600" },
  { icon: MessageSquare, label: "Help me message my factory about a delay", color: "text-green-600" },
  { icon: TrendingUp, label: "When should I place my next order?", color: "text-purple-600" },
  { icon: BarChart3, label: "How is my factory performing?", color: "text-orange-600" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductionIntelligencePage() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  useEffect(() => {
    if (profile && orders && !initialized) {
      initializeConversation();
      setInitialized(true);
    }
  }, [profile, orders, initialized]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadProfile() {
    const { data } = await (supabase as any)
      .from("brand_profiles")
      .select("*")
      .eq("user_id", user!.id)
      .single();
    setProfile(data);
  }

  async function initializeConversation() {
    const signals = getOrderSignals(orders || []);
    const critical = signals.filter(s => s.signal === "critical");
    const activeOrders = (orders || []).filter(o => !["closed", "cancelled"].includes(o.status));

    let openingMessage = "";

    if (activeOrders.length === 0) {
      openingMessage = `No active orders running yet. When you have orders in production, I'll watch every gate, flag every risk, and tell you what to do before you need to ask.\n\nFor now — what are you working on? I can help you think through factory selection, pricing, your first order structure, or anything else production-related.`;
    } else if (critical.length > 0) {
      openingMessage = `${critical.length === 1 ? "One thing" : `${critical.length} things`} need your attention right now.\n\n${critical.map(s => `**${s.orderNumber}** (${s.factoryName}) — ${s.message}`).join("\n")}\n\nWhere do you want to start?`;
    } else {
      const warningCount = signals.filter(s => s.signal === "warning").length;
      openingMessage = `${activeOrders.length} active ${activeOrders.length === 1 ? "order" : "orders"}. ${warningCount > 0 ? `${warningCount} worth watching.` : "Everything looks on track."}\n\nWhat do you want to think through?`;
    }

    setMessages([{
      role: "assistant",
      content: openingMessage,
      timestamp: new Date(),
    }]);
  }

  async function sendMessage(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setInput("");
    const userMsg: Message = { role: "user", content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const systemContext = buildSystemContext(orders || [], profile);

      const conversationHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const { data, error } = await (supabase as any).functions.invoke("production-assistant", {
        headers: session?.access_token
          ? { Authorization: `Bearer ${session.access_token}` }
          : undefined,
        body: {
          system: systemContext,
          messages: conversationHistory,
        },
      });

      if (!error && data?.content?.[0]?.text) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: data.content[0].text,
          timestamp: new Date(),
        }]);
      } else {
        throw new Error("No response");
      }
    } catch (e) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Something went wrong. Try again.",
        timestamp: new Date(),
      }]);
    }
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const signals = getOrderSignals(orders || []);
  const activeOrders = (orders || []).filter(o => !["closed", "cancelled"].includes(o.status));

  const signalColors = {
    critical: "bg-red-500/10 border-red-400/30 text-red-600",
    warning: "bg-amber-500/10 border-amber-400/30 text-amber-600",
    info: "bg-primary/5 border-primary/20 text-primary",
    good: "bg-green-500/5 border-green-400/20 text-green-600",
  };

  const signalDots = {
    critical: "bg-red-500 animate-pulse",
    warning: "bg-amber-500 animate-pulse",
    info: "bg-primary",
    good: "bg-green-500",
  };

  return (
    <Layout showFooter={false}>
      <SEO
        title="Intelligence — Sourcery"
        description="Your production intelligence workspace. Every order watched. Every risk surfaced. Every question answered."
      />
      <div className="h-[calc(100vh-64px)] flex overflow-hidden">

        {/* ── Left panel: what the AI is watching ── */}
        <div className="w-72 flex-shrink-0 border-r border-border bg-card/50 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Intelligence</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {activeOrders.length === 0
                ? "No active orders yet"
                : `Watching ${activeOrders.length} active ${activeOrders.length === 1 ? "order" : "orders"}`}
            </p>
          </div>

          {/* Order signals */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {signals.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
                  <Package className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No active orders. Create your first order and I'll start watching it.
                </p>
              </div>
            ) : (
              signals.map(signal => (
                <div
                  key={signal.orderId}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 cursor-pointer hover:opacity-80 transition-opacity",
                    signalColors[signal.signal]
                  )}
                  onClick={() => sendMessage(`Tell me about order ${signal.orderNumber} with ${signal.factoryName}`)}
                >
                  <div className="flex items-start gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5", signalDots[signal.signal])} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{signal.orderNumber}</p>
                      <p className="text-xs opacity-80 truncate">{signal.factoryName}</p>
                      <p className="text-xs mt-0.5 opacity-70 leading-snug">{signal.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Stats strip */}
          {activeOrders.length > 0 && (
            <div className="p-3 border-t border-border grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-base font-bold text-foreground">{activeOrders.length}</p>
                <p className="text-[10px] text-muted-foreground">Active</p>
              </div>
              <div className="text-center border-x border-border">
                <p className="text-base font-bold text-red-500">
                  {signals.filter(s => s.signal === "critical").length}
                </p>
                <p className="text-[10px] text-muted-foreground">Critical</p>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-green-500">
                  {signals.filter(s => s.signal === "good").length}
                </p>
                <p className="text-[10px] text-muted-foreground">On track</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Right panel: conversation ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Conversation header */}
          <div className="px-6 py-4 border-b border-border bg-background flex items-center justify-between">
            <div>
              <h1 className="text-sm font-semibold text-foreground">Production Intelligence</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Knows your orders, your factories, your operation. Speaks first.
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[72%] rounded-2xl px-4 py-3",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-card border border-border rounded-tl-sm"
                  )}
                >
                  <p className={cn(
                    "text-sm leading-relaxed whitespace-pre-wrap",
                    msg.role === "user" ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {msg.content}
                  </p>
                  <p className={cn(
                    "text-[10px] mt-1.5",
                    msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"
                  )}>
                    {format(msg.timestamp, "h:mm a")}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center h-5">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{animationDelay: "0ms"}} />
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{animationDelay: "150ms"}} />
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{animationDelay: "300ms"}} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts — show when conversation is short */}
          {messages.length <= 1 && !loading && (
            <div className="px-6 py-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Suggested</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map(prompt => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={prompt.label}
                      type="button"
                      onClick={() => sendMessage(prompt.label)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-xs text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                    >
                      <Icon className={cn("h-3 w-3", prompt.color)} />
                      {prompt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-6 py-4 border-t border-border bg-background">
            <div className="flex items-end gap-3">
              <div className="flex-1 bg-card border border-border rounded-2xl px-4 py-3 focus-within:border-primary/50 transition-colors">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your production…"
                  className="w-full text-sm bg-transparent text-foreground placeholder:text-muted-foreground/60 resize-none outline-none leading-relaxed max-h-32"
                  rows={1}
                  style={{ height: "auto" }}
                  onInput={e => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = Math.min(target.scrollHeight, 128) + "px";
                  }}
                />
              </div>
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                size="sm"
                className="h-10 w-10 rounded-xl p-0 flex-shrink-0"
              >
                {loading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Send className="h-4 w-4" />
                }
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
