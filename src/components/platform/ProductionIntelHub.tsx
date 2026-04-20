import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { AlertCircle, Clock, TrendingUp, CheckCircle, RefreshCw, Zap, ArrowRight } from "lucide-react";
import { format, addWeeks, differenceInWeeks, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

interface IntelSignal {
  orderId: string;
  orderNumber: string;
  productName: string;
  type: "reorder_overdue" | "reorder_soon" | "delivery_at_risk" | "qc_pending" | "po_waiting" | "reorder_reserve";
  message: string;
  urgency: "high" | "medium" | "low";
  action: string;
  actionHref: string;
}

interface ProductionIntelHubProps {
  userId: string;
}

export function ProductionIntelHub({ userId }: ProductionIntelHubProps) {
  const [signals, setSignals] = useState<IntelSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [userId]);

  async function load() {
    setLoading(true);
    try {
      // Fetch all orders for this user
      const { data: orders } = await (supabase as any)
        .from("orders")
        .select(`
          id, order_number, status, created_at,
          delivery_window_end, quantity, factory_id,
          specifications, order_milestones(id, status, label)
        `)
        .eq("buyer_id", userId)
        .not("status", "in", "(cancelled)")
        .order("created_at", { ascending: false })
        .limit(20);

      if (!orders) { setLoading(false); return; }

      const now = new Date();
      const newSignals: IntelSignal[] = [];

      // Get closed orders for lead time calculation
      const closed = orders.filter((o: any) => o.status === "closed" && o.delivery_window_end);
      const avgLeadWeeks = closed.length >= 2
        ? Math.round(closed.slice(0, 5).reduce((sum: number, o: any) => {
            const weeks = differenceInWeeks(new Date(o.delivery_window_end), new Date(o.created_at));
            return sum + (weeks > 4 && weeks < 32 ? weeks : 14);
          }, 0) / Math.min(closed.length, 5))
        : 14;

      // For each active order — generate signals
      for (const order of orders) {
        const specs = order.specifications as any;
        const productName = specs?.product_name || order.order_number;
        const delivery = order.delivery_window_end ? new Date(order.delivery_window_end) : null;

        // 1. Delivery at risk (active orders with delivery < 3 weeks away and not shipped)
        if (delivery && !["shipped", "closed", "draft"].includes(order.status)) {
          const daysToDelivery = differenceInDays(delivery, now);
          if (daysToDelivery < 21 && daysToDelivery > 0) {
            if (!["ready_to_ship", "shipped"].includes(order.status)) {
              newSignals.push({
                orderId: order.id,
                orderNumber: order.order_number,
                productName,
                type: "delivery_at_risk",
                message: `Delivery due ${format(delivery, "MMM d")} — ${daysToDelivery} days away. Status: ${order.status.replace(/_/g, " ")}.`,
                urgency: daysToDelivery < 7 ? "high" : "medium",
                action: "View order",
                actionHref: `/orders/${order.id}`,
              });
            }
          }
        }

        // 2. PO waiting > 48h for factory acceptance
        if (order.status === "po_issued") {
          const hoursSinceIssue = differenceInDays(now, new Date(order.created_at)) * 24;
          if (hoursSinceIssue > 48) {
            newSignals.push({
              orderId: order.id,
              orderNumber: order.order_number,
              productName,
              type: "po_waiting",
              message: `PO issued ${differenceInDays(now, new Date(order.created_at))} days ago and not yet accepted.`,
              urgency: hoursSinceIssue > 120 ? "high" : "medium",
              action: "Follow up",
              actionHref: `/orders/${order.id}`,
            });
          }
        }

        // 3. QC report uploaded but not reviewed
        if (order.status === "qc_uploaded") {
          newSignals.push({
            orderId: order.id,
            orderNumber: order.order_number,
            productName,
            type: "qc_pending",
            message: "QC report is ready for your review. Final payment releases on approval.",
            urgency: "medium",
            action: "Review QC",
            actionHref: `/orders/${order.id}`,
          });
        }

        // 4. Reorder intelligence for closed orders
        if (order.status === "closed" && delivery) {
          // Calculate when reorder PO should be issued
          const suggestedNextDelivery = addWeeks(delivery, 26); // roughly 2 seasons ahead
          const suggestedPODate = addWeeks(suggestedNextDelivery, -avgLeadWeeks);
          const weeksUntilPO = differenceInWeeks(suggestedPODate, now);

          if (weeksUntilPO <= 0) {
            newSignals.push({
              orderId: order.id,
              orderNumber: order.order_number,
              productName,
              type: "reorder_overdue",
              message: `Based on your ${avgLeadWeeks}-week lead time, the PO for your next ${productName} run should have been issued ${Math.abs(weeksUntilPO)} week${Math.abs(weeksUntilPO) !== 1 ? "s" : ""} ago.`,
              urgency: "high",
              action: "Start reorder",
              actionHref: `/orders/create?reorder=${order.id}`,
            });
          } else if (weeksUntilPO <= 4) {
            newSignals.push({
              orderId: order.id,
              orderNumber: order.order_number,
              productName,
              type: "reorder_soon",
              message: `Suggested PO date for next ${productName} run: ${format(suggestedPODate, "MMM d, yyyy")}. That's ${weeksUntilPO} week${weeksUntilPO !== 1 ? "s" : ""} away.`,
              urgency: "medium",
              action: "Start reorder",
              actionHref: `/orders/create?reorder=${order.id}`,
            });
          } else if (weeksUntilPO <= 8) {
            newSignals.push({
              orderId: order.id,
              orderNumber: order.order_number,
              productName,
              type: "reorder_reserve",
              message: `Suggested PO date: ${format(suggestedPODate, "MMM d, yyyy")} (${weeksUntilPO} weeks). Consider reserving your factory slot now.`,
              urgency: "low",
              action: "Reserve slot",
              actionHref: `/orders/${order.id}`,
            });
          }
        }
      }

      // Sort by urgency
      const urgencyOrder = { high: 0, medium: 1, low: 2 };
      newSignals.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
      setSignals(newSignals.slice(0, 6)); // max 6 signals
    } catch (e) {
      console.error("ProductionIntelHub error:", e);
    }
    setLoading(false);
  }

  if (loading) return null;
  if (signals.length === 0) return null;

  const ICONS = {
    reorder_overdue: AlertCircle,
    reorder_soon: RefreshCw,
    delivery_at_risk: AlertCircle,
    qc_pending: CheckCircle,
    po_waiting: Clock,
    reorder_reserve: TrendingUp,
  };

  const COLORS = {
    high: "border-rose-400/30 bg-rose-500/5 text-rose-600",
    medium: "border-amber-400/30 bg-amber-500/5 text-amber-600",
    low: "border-blue-400/30 bg-blue-500/5 text-blue-600",
  };

  const highCount = signals.filter(s => s.urgency === "high").length;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">Production intelligence</p>
        {highCount > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-400/30 font-medium">
            {highCount} need{highCount === 1 ? "s" : ""} action
          </span>
        )}
      </div>

      <div className="space-y-2">
        {signals.map((signal, i) => {
          const Icon = ICONS[signal.type];
          const colorClass = COLORS[signal.urgency];

          return (
            <div
              key={`${signal.orderId}-${signal.type}`}
              className={cn("flex items-start gap-3 p-3 rounded-xl border", colorClass.split(" ")[0], colorClass.split(" ")[1])}
            >
              <Icon className={cn("h-4 w-4 flex-shrink-0 mt-0.5", colorClass.split(" ")[2])} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <p className="text-xs font-semibold text-foreground">{signal.productName}</p>
                  <span className="text-xs text-muted-foreground font-mono">{signal.orderNumber}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{signal.message}</p>
              </div>
              <Link
                to={signal.actionHref}
                className={cn("text-xs font-medium flex-shrink-0 flex items-center gap-1 hover:underline", colorClass.split(" ")[2])}
              >
                {signal.action} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-2 text-center">
        Intelligence is calculated from your order history on Sourcery
      </p>
    </div>
  );
}
