import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Package, CheckCircle, AlertCircle, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCard {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color?: string;
}

export default function Analytics() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    closedOrders: 0,
    totalSpend: 0,
    avgOrderValue: 0,
    qcPassRate: 0,
    avgLeadWeeks: 0,
    disputedOrders: 0,
    currency: "USD",
  });
  const [factoryBreakdown, setFactoryBreakdown] = useState<{ name: string; orders: number; spend: number }[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const { data: orders } = await supabase
        .from("orders")
        .select("id, status, total_amount, unit_price, quantity, currency, delivery_window_start, delivery_window_end, factories(name), created_at")
        .eq("buyer_id", user!.id);

      if (!orders) { setLoading(false); return; }

      const all = orders as any[];
      const closed = all.filter(o => o.status === "closed");
      const active = all.filter(o => !["closed", "cancelled", "draft"].includes(o.status));
      const disputed = all.filter(o => o.status === "disputed");
      const totalSpend = all.reduce((s, o) => s + (o.total_amount || o.unit_price * o.quantity || 0), 0);
      const avgValue = all.length > 0 ? totalSpend / all.length : 0;

      // Lead time calculation from orders with both dates
      const withDates = all.filter(o => o.delivery_window_start && o.delivery_window_end && o.status === "closed");
      const avgLeadWeeks = withDates.length > 0
        ? withDates.reduce((s, o) => {
            const weeks = (new Date(o.delivery_window_end).getTime() - new Date(o.delivery_window_start).getTime()) / (1000 * 60 * 60 * 24 * 7);
            return s + weeks;
          }, 0) / withDates.length
        : 0;

      // Factory breakdown
      const factoryMap: Record<string, { orders: number; spend: number }> = {};
      all.forEach(o => {
        const name = o.factories?.name || "Unknown factory";
        if (!factoryMap[name]) factoryMap[name] = { orders: 0, spend: 0 };
        factoryMap[name].orders++;
        factoryMap[name].spend += o.total_amount || o.unit_price * o.quantity || 0;
      });
      const breakdown = Object.entries(factoryMap)
        .map(([name, d]) => ({ name, ...d }))
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 5);

      setStats({
        totalOrders: all.length,
        activeOrders: active.length,
        closedOrders: closed.length,
        totalSpend,
        avgOrderValue: avgValue,
        qcPassRate: closed.length > 0 ? 100 : 0,
        avgLeadWeeks: Math.round(avgLeadWeeks * 10) / 10,
        disputedOrders: disputed.length,
        currency: all[0]?.currency || "USD",
      });
      setFactoryBreakdown(breakdown);
      setLoading(false);
    }
    load();
  }, [user]);

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: stats.currency, maximumFractionDigits: 0 }).format(n);

  const statCards: StatCard[] = [
    { label: "Total orders", value: stats.totalOrders, icon: Package },
    { label: "Active orders", value: stats.activeOrders, sub: "in progress", icon: Clock, color: "text-amber-600" },
    { label: "Closed orders", value: stats.closedOrders, sub: "completed", icon: CheckCircle, color: "text-green-600" },
    { label: "Total production spend", value: fmt(stats.totalSpend), icon: TrendingUp },
    { label: "Average order value", value: fmt(stats.avgOrderValue), icon: BarChart3 },
    { label: "Disputes", value: stats.disputedOrders, sub: stats.disputedOrders > 0 ? "requires attention" : "none", icon: AlertCircle, color: stats.disputedOrders > 0 ? "text-rose-600" : "text-green-600" },
  ];

  return (
    <Layout>
      <SEO title="Analytics — Sourcery" description="Production analytics and order history." />
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Production history across all orders and factories</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
              </div>
            ) : stats.totalOrders === 0 ? (
              <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">No data yet</p>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Analytics build from real order history. Create your first order to start tracking production data.</p>
                <Link to="/orders/create">
                  <button className="text-sm text-primary hover:underline">Create an order →</button>
                </Link>
              </div>
            ) : (
              <>
                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {statCards.map((card, i) => (
                    <motion.div key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card border border-border rounded-xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-xs text-muted-foreground">{card.label}</p>
                        <card.icon className={cn("h-4 w-4 text-muted-foreground", card.color)} />
                      </div>
                      <p className={cn("text-2xl font-semibold text-foreground", card.color)}>{card.value}</p>
                      {card.sub && <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>}
                    </motion.div>
                  ))}
                </div>

                {/* Factory breakdown */}
                {factoryBreakdown.length > 0 && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-sm font-semibold text-foreground mb-4">Factory breakdown</h2>
                    <div className="space-y-3">
                      {factoryBreakdown.map((f, i) => (
                        <div key={f.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                            <span className="text-sm font-medium text-foreground">{f.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{f.orders} order{f.orders !== 1 ? "s" : ""}</span>
                            <span className="font-medium text-foreground">{fmt(f.spend)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {stats.avgLeadWeeks > 0 && (
                  <div className="mt-4 bg-card border border-border rounded-xl p-5 flex items-center gap-4">
                    <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Average lead time</p>
                      <p className="text-xs text-muted-foreground">{stats.avgLeadWeeks} weeks across closed orders</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
