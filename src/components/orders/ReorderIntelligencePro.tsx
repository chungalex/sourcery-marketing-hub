import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { differenceInDays, addDays, format, isPast } from "date-fns";
import { RefreshCw, AlertCircle, CheckCircle, TrendingUp, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ReorderSignal {
  factoryId: string;
  factoryName: string;
  factorySlug: string | null;
  lastProductName: string;
  lastOrderId: string;
  avgLeadTimeDays: number;
  lastDeliveryDate: string | null;
  suggestedPODate: Date;
  urgency: "overdue" | "urgent" | "upcoming" | "on_track";
  weeksUntilPO: number;
  reasoning: string;
}

interface ReorderIntelligenceProProps {
  className?: string;
}

export function ReorderIntelligencePro({ className }: ReorderIntelligenceProProps) {
  const { user } = useAuth();
  const [signals, setSignals] = useState<ReorderSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!user) return;
    analyse();
  }, [user]);

  async function analyse() {
    setLoading(true);
    try {
      // Fetch all completed orders with factory and delivery data
      const { data: orders } = await (supabase as any)
        .from("orders")
        .select("id, order_number, status, factory_id, created_at, delivery_window_start, delivery_window_end, specifications, factories(id, name, slug)")
        .eq("buyer_id", user!.id)
        .in("status", ["closed", "shipped", "in_production", "ready_to_ship"])
        .order("created_at", { ascending: false });

      if (!orders?.length) { setLoading(false); return; }

      // Group by factory and calculate average lead times
      const factoryMap: Record<string, any[]> = {};
      orders.forEach((o: any) => {
        const fid = o.factory_id;
        if (!fid) return;
        if (!factoryMap[fid]) factoryMap[fid] = [];
        factoryMap[fid].push(o);
      });

      const signalList: ReorderSignal[] = [];

      for (const [factoryId, factoryOrders] of Object.entries(factoryMap)) {
        const factory = factoryOrders[0].factories;
        if (!factory) continue;

        // Calculate average lead time from orders that have both dates
        const ordersWithDates = factoryOrders.filter(
          (o: any) => o.created_at && o.delivery_window_end && o.status === "closed"
        );

        let avgLeadTimeDays = 98; // Default 14 weeks
        if (ordersWithDates.length > 0) {
          const leadTimes = ordersWithDates.map((o: any) =>
            differenceInDays(new Date(o.delivery_window_end), new Date(o.created_at))
          );
          avgLeadTimeDays = Math.round(leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length);
        }

        // Most recent order with this factory
        const lastOrder = factoryOrders[0];
        const lastDelivery = lastOrder.delivery_window_end;
        const specs = lastOrder.specifications as any;
        const productName = specs?.product_name || lastOrder.order_number;

        // Calculate when to issue next PO
        // Logic: if last delivery was X months ago, next season order should have started
        // Lead time = avgLeadTimeDays. Add 4 weeks buffer before that.
        const now = new Date();
        const lastDeliveryDate = lastDelivery ? new Date(lastDelivery) : null;

        let suggestedPODate: Date;
        let reasoning: string;

        if (lastDeliveryDate) {
          // Suggest PO 6 months after last delivery (assumes 2 seasons/year)
          // minus lead time minus 4 week buffer
          const nextSeasonTarget = addDays(lastDeliveryDate, 182);
          suggestedPODate = addDays(nextSeasonTarget, -(avgLeadTimeDays + 28));
          reasoning = `Based on your ${Math.round(avgLeadTimeDays / 7)}-week average lead time with ${factory.name}. To deliver by ${format(nextSeasonTarget, "MMM yyyy")}, issue PO by this date.`;
        } else {
          // No delivery date — suggest based on order age
          suggestedPODate = addDays(new Date(lastOrder.created_at), 182 - avgLeadTimeDays - 28);
          reasoning = `Estimated from your average ${Math.round(avgLeadTimeDays / 7)}-week lead time with ${factory.name}.`;
        }

        const daysUntilPO = differenceInDays(suggestedPODate, now);
        const weeksUntilPO = Math.round(daysUntilPO / 7);

        let urgency: ReorderSignal["urgency"];
        if (daysUntilPO < 0) urgency = "overdue";
        else if (daysUntilPO < 14) urgency = "urgent";
        else if (daysUntilPO < 42) urgency = "upcoming";
        else urgency = "on_track";

        // Only surface if meaningful (skip if >6 months away)
        if (daysUntilPO > 180) continue;

        signalList.push({
          factoryId,
          factoryName: factory.name,
          factorySlug: factory.slug,
          lastProductName: productName,
          lastOrderId: lastOrder.id,
          avgLeadTimeDays,
          lastDeliveryDate: lastDelivery,
          suggestedPODate,
          urgency,
          weeksUntilPO,
          reasoning,
        });
      }

      // Sort by urgency
      const urgencyOrder = { overdue: 0, urgent: 1, upcoming: 2, on_track: 3 };
      signalList.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
      setSignals(signalList);
    } catch (e) {
      console.error("Reorder intelligence error:", e);
    }
    setLoading(false);
  }

  if (loading || signals.length === 0) return null;

  const urgentCount = signals.filter(s => ["overdue", "urgent"].includes(s.urgency)).length;

  const URGENCY_CONFIG = {
    overdue: { label: "Overdue", color: "bg-rose-500/10 text-rose-700 border-rose-400/30", icon: AlertCircle, iconColor: "text-rose-600" },
    urgent: { label: "Issue soon", color: "bg-amber-500/10 text-amber-700 border-amber-400/30", icon: AlertCircle, iconColor: "text-amber-600" },
    upcoming: { label: "Plan ahead", color: "bg-blue-500/10 text-blue-700 border-blue-400/30", icon: Calendar, iconColor: "text-blue-600" },
    on_track: { label: "On track", color: "bg-green-500/10 text-green-700 border-green-500/20", icon: CheckCircle, iconColor: "text-green-600" },
  };

  return (
    <div className={cn("bg-card border border-border rounded-xl overflow-hidden", className)}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Production intelligence</p>
              {urgentCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-400/30 font-medium">
                  {urgentCount} need{urgentCount === 1 ? "s" : ""} attention
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Reorder timing based on your factory lead time history
            </p>
          </div>
        </div>
        <TrendingUp className={cn("h-4 w-4 transition-transform", expanded ? "rotate-180" : "", "text-muted-foreground")} />
      </button>

      {expanded && (
        <div className="border-t border-border divide-y divide-border">
          {signals.map(signal => {
            const cfg = URGENCY_CONFIG[signal.urgency];
            const Icon = cfg.icon;
            return (
              <div key={signal.factoryId} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-semibold text-foreground">{signal.factoryName}</p>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", cfg.color)}>
                        <Icon className={cn("h-3 w-3 inline mr-1", cfg.iconColor)} />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Last: {signal.lastProductName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {signal.urgency === "overdue" ? (
                      <p className="text-sm font-bold text-rose-600">
                        {Math.abs(signal.weeksUntilPO)}w overdue
                      </p>
                    ) : (
                      <p className="text-sm font-bold text-foreground">
                        {signal.weeksUntilPO}w away
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      PO by {format(signal.suggestedPODate, "MMM d")}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-3 bg-secondary/40 rounded-lg px-3 py-2">
                  {signal.reasoning}
                </p>

                <div className="flex gap-2">
                  <Button asChild size="sm" className="gap-1.5 flex-1">
                    <Link to={`/orders/create?factory=${signal.factoryId}&reorder=${signal.lastOrderId}`}>
                      <RefreshCw className="h-3.5 w-3.5" />
                      Start reorder
                    </Link>
                  </Button>
                  {signal.factorySlug && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/directory/${signal.factorySlug}`}>Factory profile</Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          <div className="px-5 py-3 bg-primary/5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">How this works:</span> Sourcery calculates your average lead time per factory from your order history, then estimates when to issue your next PO to hit a seasonal delivery target. The more orders you complete on Sourcery, the more accurate this becomes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
