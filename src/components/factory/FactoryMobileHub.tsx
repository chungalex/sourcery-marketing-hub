// ─── Factory Mobile Hub ───────────────────────────────────────────────────────
// Mobile-first interface for factory users.
// Designed to work on a phone in a factory environment.
// Large touch targets. Simple flows. No unnecessary complexity.
// This is what makes factories prefer Clewa over WhatsApp.

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Camera, MessageSquare, CheckCircle, Clock, Package,
  ChevronRight, Upload, AlertCircle, Loader2, Send,
  Image as ImageIcon, FileText, Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FactoryOrder {
  id: string;
  order_number: string;
  product_name?: string;
  status: string;
  quantity?: number;
  delivery_window_end?: string;
  brands?: { brand_name?: string };
  unread_messages?: number;
}

interface FactoryMobileHubProps {
  userId: string;
  factoryId: string;
  onNavigate?: (path: string) => void;
}

// ── Status display config ─────────────────────────────────────────────────────

const STATUS_DISPLAY: Record<string, { label: string; color: string; nextAction: string }> = {
  po_issued:      { label: "Needs review",     color: "bg-amber-500", nextAction: "Review & accept PO" },
  po_accepted:    { label: "Accepted",         color: "bg-blue-500",  nextAction: "Start sampling" },
  sampling:       { label: "Sampling",         color: "bg-purple-500",nextAction: "Submit sample photos" },
  sample_approved:{ label: "Sample approved",  color: "bg-green-500", nextAction: "Start bulk production" },
  in_production:  { label: "In production",    color: "bg-blue-600",  nextAction: "Log production progress" },
  qc_pending:     { label: "QC needed",        color: "bg-amber-500", nextAction: "Submit QC report" },
  qc_approved:    { label: "QC passed",        color: "bg-green-500", nextAction: "Confirm shipping" },
  ready_to_ship:  { label: "Ready to ship",    color: "bg-green-600", nextAction: "Add tracking number" },
  shipped:        { label: "Shipped",          color: "bg-gray-500",  nextAction: "Awaiting delivery" },
  closed:         { label: "Complete",         color: "bg-gray-400",  nextAction: "" },
};

// ── Quick action button ───────────────────────────────────────────────────────

function QuickAction({ 
  icon: Icon, label, sublabel, onClick, urgent, color = "bg-card"
}: { 
  icon: any; label: string; sublabel?: string; onClick: () => void; 
  urgent?: boolean; color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all active:scale-98",
        urgent ? "border-amber-400/40 bg-amber-500/5" : "border-border bg-card",
        "hover:border-primary/30"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
        urgent ? "bg-amber-500/15" : "bg-secondary"
      )}>
        <Icon className={cn("h-5 w-5", urgent ? "text-amber-600" : "text-primary")} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {sublabel && <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
    </button>
  );
}

// ── Production milestone check-in ─────────────────────────────────────────────

function ProductionCheckIn({ orderId, onComplete }: { orderId: string; onComplete: () => void }) {
  const [stage, setStage] = useState("");
  const [percentage, setPercentage] = useState(50);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const stages = [
    { value: "fabric_received", label: "Fabric received" },
    { value: "cutting_started", label: "Cutting started" },
    { value: "cutting_complete", label: "Cutting complete" },
    { value: "sewing_in_progress", label: "Sewing in progress" },
    { value: "sewing_complete", label: "Sewing complete" },
    { value: "finishing", label: "Finishing & trimming" },
    { value: "pressing_packing", label: "Pressing & packing" },
    { value: "ready_for_qc", label: "Ready for QC" },
  ];

  async function submit() {
    if (!stage) { toast.error("Select a production stage"); return; }
    setLoading(true);
    try {
      await (supabase as any).from("order_messages").insert({
        order_id: orderId,
        content: `Production update: ${stages.find(s => s.value === stage)?.label}. Completion: ${percentage}%.${notes ? ` Notes: ${notes}` : ""}`,
        sender_type: "factory",
        message_type: "production_update",
      });
      toast.success("Production update logged");
      onComplete();
    } catch (e) {
      toast.error("Failed to log update");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-base font-semibold text-foreground">Log production progress</h3>
      
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Current stage</p>
        <div className="grid grid-cols-2 gap-2">
          {stages.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStage(s.value)}
              className={cn(
                "px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-all",
                stage === s.value 
                  ? "border-primary bg-secondary/60 text-foreground" 
                  : "border-border text-muted-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Overall completion: <span className="text-foreground font-semibold">{percentage}%</span>
        </p>
        <input 
          type="range" min="0" max="100" value={percentage}
          onChange={e => setPercentage(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0%</span><span>50%</span><span>100%</span>
        </div>
      </div>

      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Any notes for the brand? (optional)"
        className="w-full text-sm border border-border rounded-xl px-3 py-2.5 bg-background resize-none h-16"
      />

      <Button onClick={submit} disabled={loading || !stage} className="w-full gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
        Log update
      </Button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function FactoryMobileHub({ userId, factoryId, onNavigate }: FactoryMobileHubProps) {
  const [orders, setOrders] = useState<FactoryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"home" | "checkin" | "message">("home");
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => { loadOrders(); }, [factoryId]);

  async function loadOrders() {
    const { data } = await (supabase as any)
      .from("orders")
      .select(`
        id, order_number, product_name, status, quantity, delivery_window_end,
        brands:brand_id(brand_name)
      `)
      .eq("factory_id", factoryId)
      .not("status", "in", '("closed","cancelled")')
      .order("created_at", { ascending: false });
    
    setOrders(data || []);
    setLoading(false);
  }

  async function sendMessage() {
    if (!messageText.trim() || !activeOrderId) return;
    setSending(true);
    try {
      await (supabase as any).from("order_messages").insert({
        order_id: activeOrderId,
        content: messageText,
        sender_type: "factory",
        message_type: "general",
      });
      setMessageText("");
      toast.success("Message sent");
      setActiveView("home");
    } catch (e) {
      toast.error("Failed to send");
    }
    setSending(false);
  }

  const urgentOrders = orders.filter(o => 
    ["po_issued", "qc_pending"].includes(o.status)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ── Check-in view ──────────────────────────────────────────────────────────
  if (activeView === "checkin" && activeOrderId) {
    return (
      <div>
        <button 
          type="button"
          onClick={() => setActiveView("home")}
          className="text-xs text-primary mb-4 flex items-center gap-1"
        >
          ← Back
        </button>
        <ProductionCheckIn 
          orderId={activeOrderId} 
          onComplete={() => { loadOrders(); setActiveView("home"); }} 
        />
      </div>
    );
  }

  // ── Quick message view ─────────────────────────────────────────────────────
  if (activeView === "message" && activeOrderId) {
    const order = orders.find(o => o.id === activeOrderId);
    return (
      <div>
        <button 
          type="button"
          onClick={() => setActiveView("home")}
          className="text-xs text-primary mb-4 flex items-center gap-1"
        >
          ← Back
        </button>
        <div className="p-4">
          <h3 className="text-base font-semibold text-foreground mb-1">
            Message {order?.brands?.brand_name || "brand"}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">{order?.order_number}</p>
          <textarea
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="w-full text-sm border border-border rounded-xl px-3 py-3 bg-background resize-none h-32 mb-3"
            autoFocus
          />
          <Button 
            onClick={sendMessage} 
            disabled={sending || !messageText.trim()} 
            className="w-full gap-2"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send message
          </Button>
        </div>
      </div>
    );
  }

  // ── Home view ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Urgent actions */}
      {urgentOrders.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            Needs your attention
          </p>
          <div className="space-y-2">
            {urgentOrders.map(order => {
              const cfg = STATUS_DISPLAY[order.status];
              return (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => onNavigate?.(`/dashboard/factory/order/${order.id}`)}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl border border-amber-400/30 bg-amber-500/5 text-left"
                >
                  <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", cfg.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{order.order_number}</p>
                    <p className="text-xs text-amber-600">{cfg.nextAction}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active orders */}
      {orders.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Active orders ({orders.length})
          </p>
          <div className="space-y-2">
            {orders.filter(o => !["po_issued", "qc_pending"].includes(o.status)).map(order => {
              const cfg = STATUS_DISPLAY[order.status] || { label: order.status, color: "bg-gray-400", nextAction: "" };
              const daysLeft = order.delivery_window_end
                ? Math.ceil((new Date(order.delivery_window_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                : null;
              return (
                <div key={order.id} className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.brands?.brand_name} · {order.quantity} units
                      </p>
                    </div>
                    <span className={cn(
                      "text-xs font-medium px-2.5 py-1 rounded-full text-white",
                      cfg.color
                    )}>
                      {cfg.label}
                    </span>
                  </div>
                  {daysLeft !== null && (
                    <p className={cn(
                      "text-xs mb-3",
                      daysLeft < 14 ? "text-amber-600 font-medium" : "text-muted-foreground"
                    )}>
                      {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days to delivery`}
                    </p>
                  )}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => { setActiveOrderId(order.id); setActiveView("checkin"); }}
                      className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-[10px] text-muted-foreground">Progress</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate?.(`/dashboard/factory/order/${order.id}?tab=photos`)}
                      className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <Camera className="h-4 w-4 text-primary" />
                      <span className="text-[10px] text-muted-foreground">Photos</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveOrderId(order.id); setActiveView("message"); }}
                      className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span className="text-[10px] text-muted-foreground">Message</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {orders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Package className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">No active orders</p>
          <p className="text-xs text-muted-foreground">
            When a brand sends you a purchase order it will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
