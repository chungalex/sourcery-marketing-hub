import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Package, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  order_number: string;
  status: string;
  delivery_window_start: string | null;
  delivery_window_end: string | null;
  factories: { name: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted-foreground/20 text-muted-foreground",
  po_issued: "bg-amber-500/20 text-amber-700",
  po_accepted: "bg-blue-500/20 text-blue-700",
  sample_sent: "bg-amber-500/20 text-amber-700",
  sample_approved: "bg-blue-500/20 text-blue-700",
  in_production: "bg-primary/20 text-primary",
  qc_scheduled: "bg-blue-500/20 text-blue-700",
  qc_uploaded: "bg-amber-500/20 text-amber-700",
  qc_pass: "bg-green-500/20 text-green-700",
  qc_fail: "bg-rose-500/20 text-rose-700",
  ready_to_ship: "bg-green-500/20 text-green-700",
  shipped: "bg-green-500/20 text-green-700",
  closed: "bg-muted-foreground/20 text-muted-foreground",
  disputed: "bg-rose-500/20 text-rose-700",
};

const NEEDS_ATTENTION = ["draft", "po_accepted", "sample_sent", "qc_uploaded", "qc_fail", "disputed"];

export default function ProductionCalendar() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const { data } = await supabase
        .from("orders")
        .select("id, order_number, status, delivery_window_start, delivery_window_end, factories(name)")
        .eq("buyer_id", user!.id)
        .not("status", "eq", "closed");
      setOrders((data as any) || []);
      setLoading(false);
    }
    load();
  }, [user]);

  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });

  const ordersOnDay = (day: Date) =>
    orders.filter(o => {
      if (!o.delivery_window_end) return false;
      const end = new Date(o.delivery_window_end);
      const start = o.delivery_window_start ? new Date(o.delivery_window_start) : end;
      return day >= start && day <= end;
    });

  const selectedOrders = selected ? ordersOnDay(selected) : [];

  const startDayOfWeek = startOfMonth(currentMonth).getDay();

  return (
    <Layout>
      <SEO title="Production Calendar — Sourcery" description="Visual timeline of all active orders by delivery window." />
      <section className="section-padding">
        <div className="container-wide max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Production calendar</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Active orders by delivery window</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentMonth(m => subMonths(m, 1))} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-foreground min-w-[120px] text-center">
                  {format(currentMonth, "MMMM yyyy")}
                </span>
                <button onClick={() => setCurrentMonth(m => addMonths(m, 1))} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {loading ? (
              <Skeleton className="h-96 w-full rounded-xl" />
            ) : (
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {/* Day headers */}
                <div className="grid grid-cols-7 border-b border-border">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                    <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7">
                  {/* Offset */}
                  {Array.from({ length: startDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[80px] border-b border-r border-border bg-secondary/20" />
                  ))}

                  {days.map(day => {
                    const dayOrders = ordersOnDay(day);
                    const hasAttention = dayOrders.some(o => NEEDS_ATTENTION.includes(o.status));
                    const isSelected = selected && isSameDay(day, selected);
                    return (
                      <div
                        key={day.toISOString()}
                        onClick={() => setSelected(isSelected ? null : day)}
                        className={cn(
                          "min-h-[80px] border-b border-r border-border p-1.5 cursor-pointer transition-colors",
                          !isSameMonth(day, currentMonth) && "bg-secondary/20",
                          isSelected && "bg-primary/5",
                          dayOrders.length > 0 && "hover:bg-secondary/50"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn(
                            "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                            isToday(day) && "bg-primary text-primary-foreground",
                            !isToday(day) && "text-muted-foreground"
                          )}>
                            {format(day, "d")}
                          </span>
                          {hasAttention && <AlertCircle className="h-3 w-3 text-amber-500" />}
                        </div>
                        <div className="space-y-0.5">
                          {dayOrders.slice(0, 2).map(o => (
                            <div key={o.id} className={cn("text-[10px] px-1.5 py-0.5 rounded truncate", STATUS_COLORS[o.status] || "bg-secondary text-foreground")}>
                              {o.order_number}
                            </div>
                          ))}
                          {dayOrders.length > 2 && (
                            <div className="text-[10px] text-muted-foreground px-1">+{dayOrders.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected day orders */}
            {selected && selectedOrders.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-2">
                <p className="text-sm font-medium text-foreground">{format(selected, "MMMM d, yyyy")}</p>
                {selectedOrders.map(o => (
                  <Link key={o.id} to={`/orders/${o.id}`} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{o.order_number}</p>
                        <p className="text-xs text-muted-foreground">{(o.factories as any)?.name || "Factory"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {NEEDS_ATTENTION.includes(o.status) && <AlertCircle className="h-4 w-4 text-amber-500" />}
                      <span className={cn("text-xs px-2 py-1 rounded-full font-medium", STATUS_COLORS[o.status])}>
                        {o.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}

            {/* No orders state */}
            {!loading && orders.length === 0 && (
              <div className="text-center py-16 bg-card border border-dashed border-border rounded-xl mt-4">
                <Package className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-base font-semibold text-foreground mb-1">No active orders</p>
                <p className="text-sm text-muted-foreground">Orders with delivery windows will appear here.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
