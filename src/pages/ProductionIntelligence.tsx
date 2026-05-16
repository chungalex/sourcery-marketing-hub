import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, Loader2, AlertTriangle, TrendingUp, Package, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface OrderSummary {
  id: string;
  status: string;
  product_name?: string;
  delivery_window_end?: string | null;
  factories?: { name: string } | null;
  quantity?: number;
}

export default function ProductionIntelligence() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [contextLoading, setContextLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) loadContext();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadContext() {
    setContextLoading(true);
    const { data: orderData } = await (supabase as any)
      .from("orders")
      .select("id, status, product_name, delivery_window_end, quantity, factories(name)")
      .eq("brand_id", user?.id)
      .not("status", "eq", "cancelled")
      .order("updated_at", { ascending: false })
      .limit(10);

    if (orderData) {
      setOrders(orderData);
      // Generate opening message
      await generateOpeningMessage(orderData);
    }
    setContextLoading(false);
  }

  async function generateOpeningMessage(orderData: OrderSummary[]) {
    const { data: { session } } = await supabase.auth.getSession();

    const activeOrders = orderData.filter(o => !["closed", "draft"].includes(o.status));
    const closedOrders = orderData.filter(o => o.status === "closed");

    // Build context summary
    const contextSummary = activeOrders.length > 0
      ? `Brand has ${activeOrders.length} active orders: ${activeOrders.map(o =>
          `${o.product_name || "Order"} with ${o.factories?.name || "factory"} — status: ${o.status.replace(/_/g, " ")}${o.delivery_window_end ? `, delivery: ${format(new Date(o.delivery_window_end), "MMM d")}` : ""}`
        ).join("; ")}`
      : "Brand has no active orders yet.";

    const prompt = `You are the Sourcery Production Intelligence AI. You are the expert sourcing director inside the Sourcery platform — deeply knowledgeable about overseas manufacturing, Vietnam garment production, factory relationships, quality control, payment protection, and production management.

Current brand context:
${contextSummary}
${closedOrders.length > 0 ? `Completed orders: ${closedOrders.length}` : "No completed orders yet."}

Generate a short, specific opening message (3-5 sentences) that:
1. Acknowledges the brand's current production situation specifically
2. Identifies the single most important thing they should be thinking about RIGHT NOW
3. Offers to help with something specific
4. Sounds like an experienced sourcing director — direct, knowledgeable, not generic

If they have no orders yet, focus on helping them get started with their first factory relationship.
Do not use bullet points. Write in first person. Be specific, not generic.`;

    try {
      const { data, error } = await (supabase as any).functions.invoke("production-assistant", {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined,
        body: {
          system: "You are the Sourcery Production Intelligence AI — an expert sourcing director with deep knowledge of overseas manufacturing. Be direct, specific, and genuinely helpful. Never be generic.",
          messages: [{ role: "user", content: prompt }],
        },
      });

      if (!error && data?.content?.[0]?.text) {
        setMessages([{
          role: "assistant",
          content: data.content[0].text,
          timestamp: new Date(),
        }]);
      }
    } catch (e) {
      setMessages([{
        role: "assistant",
        content: "I'm ready to help you navigate your production. What's on your mind — a specific order, a factory question, or something you're trying to figure out?",
        timestamp: new Date(),
      }]);
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage, timestamp: new Date() }]);
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Build full order context
      const activeOrders = orders.filter(o => !["closed", "draft", "cancelled"].includes(o.status));
      const orderContext = activeOrders.length > 0
        ? `Active orders: ${activeOrders.map(o =>
            `${o.product_name || "unnamed"} | ${o.factories?.name || "unknown factory"} | status: ${o.status} | qty: ${o.quantity || "unknown"} | delivery: ${o.delivery_window_end ? format(new Date(o.delivery_window_end), "MMM d, yyyy") : "not set"}`
          ).join("\n")}`
        : "No active orders.";

      const systemPrompt = `You are the Sourcery Production Intelligence AI — an expert sourcing director embedded in the Sourcery manufacturing platform.

You have deep expertise in:
- Overseas garment manufacturing (Vietnam, Bangladesh, China, Indonesia)
- Factory relationships and how to manage them professionally  
- QC processes, AQL standards, defect management
- Payment protection and milestone structures
- Production timelines, backward scheduling, critical path
- Vietnamese manufacturing culture and communication norms
- Tariffs, incoterms, landed cost calculations
- Fabric and materials sourcing
- The production lifecycle from PO to delivery

Current brand's production context:
${orderContext}

Guidelines:
- Be specific to their actual situation, not generic
- When they mention a specific order issue, give concrete actionable advice
- Reference their actual factories and order details when relevant
- If you don't know something specific, say so and give the best general guidance
- Write like an experienced sourcing director — direct, knowledgeable, no fluff
- Use manufacturing terminology correctly (PP sample, TOP sample, AQL, FOB, etc.)
- Vietnamese manufacturing context: Tet timing, HCMC factories, local norms
- Never recommend things that create liability or are outside the platform's scope`;

      // Build conversation history
      const conversationHistory = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const { data, error } = await (supabase as any).functions.invoke("production-assistant", {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined,
        body: {
          system: systemPrompt,
          messages: [...conversationHistory, { role: "user", content: userMessage }],
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
        content: "Something went wrong. Try again — if it persists, the production assistant edge function may need checking.",
        timestamp: new Date(),
      }]);
    }
    setLoading(false);
  }

  const activeOrders = orders.filter(o => !["closed", "draft", "cancelled"].includes(o.status));
  const draftOrders = orders.filter(o => o.status === "draft");

  return (
    <Layout appMode>
      <SEO title="Production Intelligence — Sourcery" description="Your AI production director" />
      <div className="flex h-[calc(100vh-64px)]">

        {/* Left panel — context */}
        <div className="w-72 flex-shrink-0 border-r border-border bg-card/40 flex flex-col hidden lg:flex">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Production Intelligence</p>
                <p className="text-xs text-muted-foreground">Watching your orders</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {contextLoading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading your production context...
              </div>
            ) : (
              <>
                {activeOrders.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-1.5">
                      Active orders
                    </p>
                    {activeOrders.map(order => {
                      const daysLeft = order.delivery_window_end
                        ? Math.ceil((new Date(order.delivery_window_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                        : null;
                      const isUrgent = daysLeft !== null && daysLeft < 21;

                      return (
                        <Link
                          key={order.id}
                          to={`/orders/${order.id}`}
                          className="block p-2.5 rounded-lg hover:bg-secondary/50 transition-colors group"
                        >
                          <div className="flex items-start justify-between gap-1 mb-0.5">
                            <p className="text-xs font-medium text-foreground leading-tight truncate">
                              {order.product_name || "Unnamed order"}
                            </p>
                            {isUrgent && (
                              <AlertTriangle className="h-3 w-3 text-amber-500 flex-shrink-0 mt-0.5" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {order.factories?.name || "No factory"} · {order.status.replace(/_/g, " ")}
                          </p>
                          {daysLeft !== null && (
                            <p className={cn("text-xs mt-0.5", isUrgent ? "text-amber-600 font-medium" : "text-muted-foreground")}>
                              {daysLeft > 0 ? `${daysLeft}d to delivery` : "Delivery overdue"}
                            </p>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}

                {draftOrders.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-1.5">
                      Drafts
                    </p>
                    {draftOrders.map(order => (
                      <Link
                        key={order.id}
                        to={`/orders/${order.id}`}
                        className="block p-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <p className="text-xs font-medium text-foreground truncate">
                          {order.product_name || "Unnamed draft"}
                        </p>
                        <p className="text-xs text-muted-foreground">Draft — not issued</p>
                      </Link>
                    ))}
                  </div>
                )}

                {orders.length === 0 && (
                  <div className="p-3 rounded-lg bg-secondary/40 text-center">
                    <Package className="h-5 w-5 text-muted-foreground mx-auto mb-1.5" />
                    <p className="text-xs text-muted-foreground">No orders yet</p>
                    <Link to="/orders/create" className="text-xs text-primary hover:underline">
                      Create first order →
                    </Link>
                  </div>
                )}

                {/* Quick prompts */}
                <div className="pt-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-1.5">
                    Ask about
                  </p>
                  {[
                    "What should I focus on today?",
                    "How do I handle a late factory?",
                    "What questions to ask a new factory?",
                    "How do I read a factory quote?",
                    "What is AQL and how do I use it?",
                    "When should I release payment?",
                  ].map(prompt => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setInput(prompt)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right panel — conversation */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="border-b border-border px-6 py-3 flex items-center justify-between flex-shrink-0">
            <div>
              <p className="text-sm font-semibold text-foreground">Production Intelligence</p>
              <p className="text-xs text-muted-foreground">
                Your AI sourcing director — knows your orders, your factories, your situation
              </p>
            </div>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {contextLoading && messages.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Reading your production context...
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-2xl rounded-2xl px-4 py-3",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <p className={cn(
                      "text-xs mt-1.5",
                      msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"
                    )}>
                      {format(msg.timestamp, "h:mm a")}
                    </p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="bg-card border border-border rounded-2xl px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{animationDelay:"0ms"}} />
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{animationDelay:"150ms"}} />
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{animationDelay:"300ms"}} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border px-6 py-4 flex-shrink-0">
            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask about your orders, your factories, or any production decision..."
                className="flex-1 resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[48px] max-h-32"
                rows={1}
                disabled={loading}
              />
              <Button
                size="sm"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="h-12 w-12 p-0 rounded-xl"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Knows your current orders and factory history · Press Enter to send
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
