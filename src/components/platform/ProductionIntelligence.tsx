import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, addWeeks, differenceInWeeks, differenceInDays, isPast } from "date-fns";
import { AlertTriangle, CheckCircle, Clock, TrendingUp, RefreshCw, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface OrderSignal {
  id: string;
  order_number: string;
  factory_name: string;
  product_name: string;
  status: string;
  delivery_window_end: string | null;
  created_at: string;
  quantity: number;
}

interface ProductionAlert {
  type: "reorder_now" | "reorder_soon" | "slot_risk" | "overdue_gate" | "on_track";
  order_id: string | null;
  order_number?: string;
  product_name?: string;
  factory_name?: string;
  message: string;
  action: string;
  action_href: string;
  urgency: "high" | "medium" | "low";
  days?: number;
}

export function ProductionIntelligence({ className }: { className?: string }) {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<ProductionAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgLeadWeeks, setAvgLeadWeeks] = useState(14);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => { if (user) loadIntelligence(); }, [user]);

  async function loadIntelligence() {
    setLoading(true);
    try {
      // Load all orders
      const { data: orders } = await (supabase as any)
        .from("orders")
        .select("id, order_number, status, created_at, delivery_window_end, quantity, specifications, factories(name)")
        .eq("buyer_id", user!.id)
        .neq("status", "cancelled")
        .order("created_at", { ascending: false })
        .limit(20);

      if (!orders?.length) { setLoading(false); return; }

      const all = orders as any[];
      const closed = all.filter(o => o.status === "closed" && o.delivery_window_end && o.created_at);

      // Calculate platform average lead time
      const leadTimes = closed.map(o =>
        differenceInWeeks(new Date(o.delivery_window_end), new Date(o.created_at))
      ).filter(w => w > 4 && w < 32);
      const avg = leadTimes.length > 0
        ? Math.round(leadTimes.reduce((a,b) => a+b, 0) / leadTimes.length)
        : 14;
      setAvgLeadWeeks(avg);

      const now = new Date();
      const newAlerts: ProductionAlert[] = [];

      // 1. REORDER INTELLIGENCE: for each closed order, should they be reordering?
      closed.slice(0, 3).forEach(o => {
        const delivery = new Date(o.delivery_window_end);
        // Suggest next order ~16 weeks after last delivery (typical season gap)
        const suggestedNextDelivery = addWeeks(delivery, 16);
        const suggestedPODate = addWeeks(suggestedNextDelivery, -avg);
        const weeksUntilPO = differenceInWeeks(suggestedPODate, now);
        const pName = (o.specifications as any)?.product_name || o.order_number;
        const fName = o.factories?.name || "your factory";

        if (weeksUntilPO <= 0 && weeksUntilPO > -8) {
          newAlerts.push({
            type: "reorder_now",
            order_id: null,
            order_number: o.order_number,
            product_name: pName,
            factory_name: fName,
            message: `Based on your ${avg}-week lead time with ${fName}, your ${pName} reorder PO is ${Math.abs(weeksUntilPO)}w overdue to hit ${format(suggestedNextDelivery, "MMM yyyy")} delivery.`,
            action: "Start reorder",
            action_href: `/orders/create`,
            urgency: "high",
            days: Math.abs(weeksUntilPO) * 7,
          });
        } else if (weeksUntilPO > 0 && weeksUntilPO <= 4) {
          newAlerts.push({
            type: "reorder_soon",
            order_id: null,
            order_number: o.order_number,
            product_name: pName,
            factory_name: fName,
            message: `Suggested PO date for ${pName} reorder: ${format(suggestedPODate, "MMM d")} (${weeksUntilPO}w away). Targets ${format(suggestedNextDelivery, "MMM yyyy")} delivery with ${fName}.`,
            action: "Reserve factory slot",
            action_href: `/orders/create`,
            urgency: "medium",
            days: weeksUntilPO * 7,
          });
        }
      });

      // 2. ACTIVE ORDER HEALTH: check each active order for overdue gates
      const active = all.filter(o => !["closed","cancelled","draft"].includes(o.status));
      active.forEach(o => {
        const pName = (o.specifications as any)?.product_name || o.order_number;
        const fName = o.factories?.name || "factory";

        if (o.delivery_window_end) {
          const delivery = new Date(o.delivery_window_end);
          const daysToDelivery = differenceInDays(delivery, now);
          const weeksToDelivery = daysToDelivery / 7;

          // Check if PO hasn't been accepted yet but we're already behind
          if (o.status === "po_issued" && daysToDelivery < avg * 7) {
            newAlerts.push({
              type: "overdue_gate",
              order_id: o.id,
              order_number: o.order_number,
              product_name: pName,
              factory_name: fName,
              message: `${pName}: PO not yet accepted but only ${Math.round(weeksToDelivery)}w until target delivery. Factory needs to confirm urgently.`,
              action: "Message factory",
              action_href: `/orders/${o.id}`,
              urgency: "high",
              days: daysToDelivery,
            });
          }

          // On-time flag for orders looking good
          if (["in_production","sample_approved"].includes(o.status) && daysToDelivery > 21) {
            newAlerts.push({
              type: "on_track",
              order_id: o.id,
              order_number: o.order_number,
              product_name: pName,
              factory_name: fName,
              message: `${pName} is in production with ${Math.round(weeksToDelivery)}w to target delivery — on track.`,
              action: "View order",
              action_href: `/orders/${o.id}`,
              urgency: "low",
            });
          }
        }
      });

      // Sort: high urgency first
      newAlerts.sort((a,b) => {
        const rank = { high:0, medium:1, low:2 };
        return rank[a.urgency] - rank[b.urgency];
      });

      setAlerts(newAlerts);
    } catch(e) {
      console.error("ProductionIntelligence:", e);
    }
    setLoading(false);
  }

  const highCount = alerts.filter(a => a.urgency === "high").length;
  const medCount = alerts.filter(a => a.urgency === "medium").length;

  if (loading) return null;
  if (!alerts.length) return null;

  return (
    <div className={cn("bg-card border border-border rounded-xl overflow-hidden", className)}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Zap className="h-4 w-4 text-primary" />
          <div className="text-left">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Production intelligence</p>
              {highCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 border border-rose-400/30 font-medium">
                  {highCount} urgent
                </span>
              )}
              {medCount > 0 && highCount === 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-400/30 font-medium">
                  {medCount} upcoming
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Based on your {avgLeadWeeks}-week average lead time
            </p>
          </div>
        </div>
        <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {expanded && (
        <div className="border-t border-border divide-y divide-border">
          {alerts.map((alert, i) => {
            const Icon = alert.urgency === "high" ? AlertTriangle
              : alert.urgency === "medium" ? Clock
              : CheckCircle;
            const colors = {
              high: "text-rose-600 bg-rose-500/10",
              medium: "text-amber-600 bg-amber-500/10",
              low: "text-green-600 bg-green-500/10",
            };
            return (
              <div key={i} className="px-5 py-3.5 flex items-start gap-3">
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", colors[alert.urgency])}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-relaxed">{alert.message}</p>
                  <Link
                    to={alert.action_href}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium mt-1"
                  >
                    {alert.action} →
                  </Link>
                </div>
              </div>
            );
          })}
          <div className="px-5 py-3 bg-secondary/30">
            <p className="text-xs text-muted-foreground">
              Intelligence is based on your order history. The more orders you complete on Sourcery, the more accurate these signals become.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
