import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Sparkles, Clock, AlertTriangle, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { format, addWeeks, differenceInDays, isPast, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReorderIntelligenceProps {
  orderId: string;
  factoryId?: string;
  factoryName?: string;
}

interface Intelligence {
  shouldReorder: boolean;
  urgency: "immediate" | "soon" | "planning" | "not_yet";
  message: string;
  poDeadline: Date | null;
  targetDelivery: Date | null;
  avgLeadWeeks: number;
  reasoning: string;
  factoryOrders?: number;
}

export function ReorderIntelligence({ orderId, factoryId, factoryName }: ReorderIntelligenceProps) {
  const [intel, setIntel] = useState<Intelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    analyse();
  }, [orderId]);

  async function analyse() {
    setLoading(true);
    try {
      // Fetch this order
      const { data: order } = await (supabase as any)
        .from("orders")
        .select("id, order_number, status, delivery_window_end, created_at, factory_id, factories(id, name)")
        .eq("id", orderId)
        .single();

      if (!order || order.status !== "closed") {
        setLoading(false);
        return;
      }

      const fId = factoryId || order.factory_id || order.factories?.id;
      const fName = factoryName || order.factories?.name || "your factory";

      // Get all historical closed orders with this factory to calculate avg lead time
      const { data: history } = await (supabase as any)
        .from("orders")
        .select("id, created_at, delivery_window_end, status")
        .eq("factory_id", fId)
        .eq("status", "closed")
        .not("delivery_window_end", "is", null)
        .not("created_at", "is", null)
        .order("created_at", { ascending: false })
        .limit(5);

      // Calculate average lead time from history
      let avgLeadWeeks = 14; // sensible default
      if (history && history.length >= 1) {
        const leadTimes = history
          .filter((o: any) => o.created_at && o.delivery_window_end)
          .map((o: any) => {
            const days = differenceInDays(
              new Date(o.delivery_window_end),
              new Date(o.created_at)
            );
            return days / 7;
          })
          .filter((w: number) => w > 2 && w < 52); // sanity check
        
        if (leadTimes.length > 0) {
          avgLeadWeeks = Math.round(leadTimes.reduce((a: number, b: number) => a + b, 0) / leadTimes.length);
        }
      }

      // Get factory's current active order count (capacity signal)
      const { count: factoryActiveOrders } = await (supabase as any)
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("factory_id", fId)
        .in("status", ["po_issued", "po_accepted", "in_production", "sample_sent", "sample_approved"]);

      // Calculate when to reorder
      // Logic: last delivery date + typical sell-through period = when you'll want more stock
      // Typical sell-through for apparel: 60-90 days before reorder needed
      const lastDelivery = order.delivery_window_end ? new Date(order.delivery_window_end) : new Date(order.created_at);
      const sellThroughDays = 75; // 10-11 weeks sell-through assumption
      const suggestedPODate = addDays(lastDelivery, sellThroughDays - (avgLeadWeeks * 7));
      const suggestedDelivery = addWeeks(suggestedPODate, avgLeadWeeks);
      const daysUntilPO = differenceInDays(suggestedPODate, new Date());

      let urgency: Intelligence["urgency"] = "not_yet";
      let message = "";
      let reasoning = "";

      if (isPast(suggestedPODate)) {
        urgency = "immediate";
        message = `Your next PO with ${fName} is overdue`;
        reasoning = `Based on your ${avgLeadWeeks}-week average lead time, you should have issued this PO ${Math.abs(daysUntilPO)} days ago to maintain stock continuity.`;
      } else if (daysUntilPO <= 14) {
        urgency = "soon";
        message = `Issue your next PO within ${daysUntilPO} days`;
        reasoning = `Your ${avgLeadWeeks}-week lead time with ${fName} means a PO now delivers by ${format(suggestedDelivery, "MMM d, yyyy")}.`;
      } else if (daysUntilPO <= 45) {
        urgency = "planning";
        message = `Start planning your next order with ${fName}`;
        reasoning = `Optimal PO date is ${format(suggestedPODate, "MMM d")} — ${daysUntilPO} days away. That delivers by ${format(suggestedDelivery, "MMM d, yyyy")} based on your ${avgLeadWeeks}-week average.`;
      } else {
        setLoading(false);
        return; // Too early to show anything useful
      }

      setIntel({
        shouldReorder: true,
        urgency,
        message,
        poDeadline: suggestedPODate,
        targetDelivery: suggestedDelivery,
        avgLeadWeeks,
        reasoning,
        factoryOrders: factoryActiveOrders || 0,
      });
    } catch (e) {
      console.error("Reorder analysis:", e);
    }
    setLoading(false);
  }

  if (loading) return (
    <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      Analysing order history...
    </div>
  );

  if (!intel || !intel.shouldReorder || dismissed) return null;

  const urgencyConfig = {
    immediate: { color: "border-rose-400/40 bg-rose-500/5", icon: AlertTriangle, iconColor: "text-rose-500", badge: "bg-rose-500/10 text-rose-700 border-rose-400/30" },
    soon: { color: "border-amber-400/40 bg-amber-500/5", icon: Clock, iconColor: "text-amber-500", badge: "bg-amber-500/10 text-amber-700 border-amber-400/30" },
    planning: { color: "border-primary/20 bg-primary/5", icon: Sparkles, iconColor: "text-primary", badge: "bg-primary/10 text-primary border-primary/20" },
    not_yet: { color: "border-border bg-card", icon: CheckCircle, iconColor: "text-muted-foreground", badge: "" },
  };

  const cfg = urgencyConfig[intel.urgency];
  const Icon = cfg.icon;

  return (
    <div className={cn("rounded-xl border p-5 mb-4", cfg.color)}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4 flex-shrink-0", cfg.iconColor)} />
          <p className="text-sm font-semibold text-foreground">{intel.message}</p>
        </div>
        <button onClick={() => setDismissed(true)} className="text-xs text-muted-foreground hover:text-foreground flex-shrink-0">Dismiss</button>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-4">{intel.reasoning}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {intel.poDeadline && (
          <div className="bg-background/60 rounded-lg p-2.5">
            <p className="text-xs text-muted-foreground mb-0.5">Issue PO by</p>
            <p className="text-sm font-semibold text-foreground">{format(intel.poDeadline, "MMM d, yyyy")}</p>
          </div>
        )}
        {intel.targetDelivery && (
          <div className="bg-background/60 rounded-lg p-2.5">
            <p className="text-xs text-muted-foreground mb-0.5">Target delivery</p>
            <p className="text-sm font-semibold text-foreground">{format(intel.targetDelivery, "MMM d, yyyy")}</p>
          </div>
        )}
        <div className="bg-background/60 rounded-lg p-2.5">
          <p className="text-xs text-muted-foreground mb-0.5">Your avg lead time</p>
          <p className="text-sm font-semibold text-foreground">{intel.avgLeadWeeks} weeks</p>
        </div>
      </div>

      {(intel.factoryOrders || 0) > 2 && (
        <p className="text-xs text-amber-700 bg-amber-500/10 border border-amber-400/20 rounded-lg px-3 py-2 mb-4">
          Factory is managing {intel.factoryOrders} active orders — book your slot early.
        </p>
      )}

      <Button asChild size="sm" className="gap-1.5">
        <Link to="/orders/create">Start next order <ArrowRight className="h-3.5 w-3.5" /></Link>
      </Button>
    </div>
  );
}
