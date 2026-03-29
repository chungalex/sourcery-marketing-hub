import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, X, Send, Loader2, ChevronDown, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface OrderContext {
  orderNumber?: string;
  status?: string;
  factoryName?: string;
  factoryCountry?: string;
  quantity?: number;
  unitPrice?: number;
  currency?: string;
  totalAmount?: number;
  milestones?: { label: string; status: string; percentage: number }[];
  specifications?: Record<string, unknown>;
}

interface ProductionAssistantProps {
  mode: "order" | "dashboard" | "demo";
  orderContext?: OrderContext;
  className?: string;
}

const SUGGESTED: Record<string, string[]> = {
  order: [
    "Is this lead time realistic?",
    "Summarise this order",
    "What could go wrong here?",
    "What do I need to do next?",
    "Draft a message to the factory",
  ],
  dashboard: [
    "Which orders need my attention?",
    "How is my factory performing?",
    "What's my total production exposure?",
    "When should I reorder?",
  ],
  demo: [
    "What incoterms should I use for Vietnam?",
    "How do I evaluate a factory before wiring money?",
    "What's a realistic lead time for 500 garments?",
    "What documents do I need to import from Vietnam?",
    "How do milestone payments protect me?",
  ],
};

function buildSystem(mode: string, ctx?: OrderContext): string {
  const base = `You are a production assistant for Sourcery — a manufacturing OS for physical product brands. You have deep expertise in garment production, supply chain, incoterms, quality control, freight, and factory management in Asia (primarily Vietnam and China).

Your tone is direct, specific, and confident. You give real answers, not hedged generalities. You are honest when something is a risk. Never use filler like "Great question!" Write like an experienced production consultant who respects the brand's time. Format lists with dashes. Keep responses under 150 words unless a detailed answer is genuinely required.

CRITICAL PRIVACY RULE: You only have access to this brand's own order data. You do not have access to any other brand's orders, prices, factory relationships, or production data. Never imply you are using aggregate platform data or other clients' information to answer questions. Your expertise comes from deep production knowledge — not from other brands' private data.`;

  if (mode === "demo") return `${base}\n\nYou are in demo mode — the person has not yet signed up. Answer production questions genuinely. When relevant, briefly mention how Sourcery handles this on the platform — but never be pushy. Be genuinely useful first.`;

  if (mode === "dashboard") return `${base}\n\nYou are working with a brand's full production operation. Help them understand their active orders, factory relationships, and priorities. Be concise and actionable.`;

  if (mode === "order" && ctx) {
    const ms = ctx.milestones?.map(m => `${m.label} (${m.percentage}%): ${m.status}`).join(", ") || "none";
    const specs = ctx.specifications ? Object.entries(ctx.specifications).slice(0, 5).map(([k, v]) => `${k}: ${v}`).join(", ") : "not specified";
    return `${base}

Order context:
- Order: ${ctx.orderNumber || "unknown"} | Status: ${ctx.status || "unknown"}
- Factory: ${ctx.factoryName || "unknown"} (${ctx.factoryCountry || "unknown"})
- Quantity: ${ctx.quantity || 0} units @ ${ctx.currency || "USD"} ${ctx.unitPrice || 0} = ${ctx.currency || "USD"} ${ctx.totalAmount || 0}
- Milestones: ${ms}
- Specs: ${specs}

Use this context for specific, relevant answers. Answer in context of this actual order. When drafting messages, write for this factory and order.`;
  }

  return base;
}

async function getOrderThread(orderId: string): Promise<string> {
  try {
    const { data } = await (supabase as any)
      .from("messages").select("content, sender_role")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true })
      .limit(20);
    return data?.map((m: any) => `[${m.sender_role.toUpperCase()}]: ${m.content}`).join("\n") || "";
  } catch { return ""; }
}

export function ProductionAssistant({ mode, orderContext, className }: ProductionAssistantProps) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thread, setThread] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, minimized, messages.length]);

  const handleOpen = async () => {
    setOpen(true);
    setMinimized(false);
    if (!thread && mode === "order" && orderContext?.orderNumber) {
      const t = await getOrderThread(orderContext.orderNumber);
      if (t) setThread(t);
    }
  };

  const send = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput("");
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setLoading(true);
    try {
      const system = buildSystem(mode, orderContext) + (thread ? `\n\n[Order thread:\n${thread.slice(0, 1500)}]` : "");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          system,
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data?.content?.[0]?.text || "Something went wrong. Try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Couldn't reach the assistant. Check your connection." }]);
    }
    setLoading(false);
  };

  const greeting = mode === "order"
    ? `Ask me anything about ${orderContext?.orderNumber || "this order"} — risk, timing, next steps, or draft a message to ${orderContext?.factoryName || "the factory"}.`
    : mode === "dashboard"
    ? "Ask me about your production operation — which orders need attention, factory performance, or when to reorder."
    : "Ask me anything about production — finding factories, incoterms, QC, freight, or how Sourcery works.";

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors text-sm font-medium text-primary",
          className
        )}
      >
        <Sparkles className="h-4 w-4 flex-shrink-0" />
        {mode === "demo" ? "Ask a production question" : "Ask the assistant"}
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col bg-card border border-border rounded-2xl overflow-hidden",
        minimized ? "h-12" : "h-[480px]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            {mode === "demo" ? "Production assistant" : mode === "order" ? `Assistant — ${orderContext?.orderNumber || "order"}` : "Production assistant"}
          </span>
          {mode !== "demo" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Pro</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setMinimized(m => !m)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            {minimized ? <ChevronDown className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
          </button>
          <button onClick={() => { setOpen(false); setMessages([]); }} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {/* Greeting */}
            <div className="flex gap-2.5">
              <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="h-3 w-3 text-primary" />
              </div>
              <div className="bg-secondary/50 rounded-xl rounded-tl-sm px-3 py-2.5 flex-1">
                <p className="text-sm text-foreground leading-relaxed">{greeting}</p>
                {messages.length === 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {SUGGESTED[mode]?.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => send(s)}
                        className="text-xs px-2.5 py-1 rounded-full bg-background border border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-2.5", m.role === "user" && "flex-row-reverse")}>
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                  m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-secondary/50 text-foreground rounded-tl-sm"
                )}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-3 w-3 text-primary" />
                </div>
                <div className="bg-secondary/50 rounded-xl rounded-tl-sm px-3 py-2.5">
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-2 border-t border-border flex-shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Ask anything about production..."
                className="flex-1 text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground"
                disabled={loading}
              />
              <Button size="sm" onClick={() => send()} disabled={loading || !input.trim()} className="h-9 w-9 p-0 flex-shrink-0">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
            {mode !== "demo" && (
              <p className="text-xs text-muted-foreground mt-1.5 text-center">Conversations are logged against this order</p>
            )}
            <p className="text-xs text-muted-foreground mt-1 text-center opacity-60">Use with discretion — verify before acting</p>
          </div>
        </>
      )}
    </motion.div>
  );
}
