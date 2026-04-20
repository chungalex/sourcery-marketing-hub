import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { differenceInDays, isPast, addDays } from "date-fns";
import { AlertTriangle, CheckCircle, Clock, ChevronRight } from "lucide-react";

interface OrderHealth {
  id: string;
  order_number: string;
  status: string;
  delivery_window_end: string | null;
  factory_name: string;
  health: "on_track" | "at_risk" | "critical";
  reason: string;
  days_to_delivery: number | null;
}

export function OrderHealthDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderHealth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  async function load() {
    const { data } = await (supabase as any)
      .from("orders")
      .select("id, order_number, status, delivery_window_end, created_at, factories(name), order_milestones(status, sequence_order)")
      .eq("buyer_id", user!.id)
      .not("status", "in", '("closed","cancelled","draft")')
      .order("created_at", { ascending: false })
      .limit(8);

    if (!data) { setLoading(false); return; }

    const withHealth: OrderHealth[] = data.map((o: any) => {
      const daysToDelivery = o.delivery_window_end
        ? differenceInDays(new Date(o.delivery_window_end), new Date())
        : null;

      let health: OrderHealth["health"] = "on_track";
      let reason = "Production progressing normally";

      // Critical signals
      if (daysToDelivery !== null && daysToDelivery < 0) {
        health = "critical"; reason = "Delivery window has passed";
      } else if (daysToDelivery !== null && daysToDelivery < 21 && o.status === "po_accepted") {
        health = "critical"; reason = "Less than 3 weeks to delivery, still in early stage";
      } else if (o.status === "po_issued" && daysToDelivery !== null && daysToDelivery < 70) {
        health = "critical"; reason = "PO not yet accepted with under 10 weeks to delivery";
      }
      // At-risk signals
      else if (daysToDelivery !== null && daysToDelivery < 35 && !["qc_pass", "ready_to_ship"].includes(o.status)) {
        health = "at_risk"; reason = "Under 5 weeks to delivery — QC not complete";
      } else if (o.status === "po_accepted" && daysToDelivery !== null && daysToDelivery < 50) {
        health = "at_risk"; reason = "Sample not yet sent with under 7 weeks remaining";
      } else if (daysToDelivery !== null && daysToDelivery < 14) {
        health = "at_risk"; reason = `${daysToDelivery} days to delivery — confirm shipment status`;
      }

      return {
        id: o.id,
        order_number: o.order_number,
        status: o.status,
        delivery_window_end: o.delivery_window_end,
        factory_name: o.factories?.name || "Factory",
        health,
        reason,
        days_to_delivery: daysToDelivery,
      };
    });

    // Sort: critical first, then at_risk, then on_track
    withHealth.sort((a, b) => {
      const order = { critical: 0, at_risk: 1, on_track: 2 };
      return order[a.health] - order[b.health];
    });

    setOrders(withHealth);
    setLoading(false);
  }

  if (loading || orders.length === 0) return null;

  const critical = orders.filter(o => o.health === "critical").length;
  const atRisk = orders.filter(o => o.health === "at_risk").length;

  const healthConfig = {
    critical: { dot: "bg-rose-500", bg: "hover:bg-rose-500/5", badge: "bg-rose-500/10 text-rose-700 border-rose-400/20" },
    at_risk: { dot: "bg-amber-500", bg: "hover:bg-amber-500/5", badge: "bg-amber-500/10 text-amber-700 border-amber-400/20" },
    on_track: { dot: "bg-green-500", bg: "hover:bg-secondary/40", badge: "bg-green-500/10 text-green-700 border-green-400/20" },
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          {critical > 0
            ? <AlertTriangle className="h-4 w-4 text-rose-500" />
            : atRisk > 0
            ? <Clock className="h-4 w-4 text-amber-500" />
            : <CheckCircle className="h-4 w-4 text-green-500" />}
          <div>
            <p className="text-sm font-semibold text-foreground">Order health</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {critical > 0 ? `${critical} critical · ` : ""}{atRisk > 0 ? `${atRisk} at risk · ` : ""}{orders.filter(o => o.health === "on_track").length} on track
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {[
            { count: critical, color: "bg-rose-500" },
            { count: atRisk, color: "bg-amber-500" },
            { count: orders.filter(o => o.health === "on_track").length, color: "bg-green-500" },
          ].filter(d => d.count > 0).map((d, i) => (
            <div key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${d.color}`} />
              {d.count}
            </div>
          ))}
        </div>
      </div>

      <div className="divide-y divide-border">
        {orders.map(order => {
          const cfg = healthConfig[order.health];
          return (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className={`flex items-center gap-3 px-5 py-3 transition-colors ${cfg.bg}`}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot} ${order.health !== "on_track" ? "animate-pulse" : ""}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-foreground">{order.order_number}</span>
                  <span className="text-xs text-muted-foreground">· {order.factory_name}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{order.reason}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {order.days_to_delivery !== null && (
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.badge}`}>
                    {order.days_to_delivery > 0 ? `${order.days_to_delivery}d` : "overdue"}
                  </span>
                )}
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
