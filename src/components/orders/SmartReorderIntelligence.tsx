import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { format, addWeeks, subWeeks, differenceInDays, isPast, addDays } from "date-fns";
import { RefreshCw, AlertTriangle, CheckCircle, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrderHistory {
  id: string;
  order_number: string;
  status: string;
  factory_id: string;
  created_at: string;
  delivery_window_end: string | null;
  specifications: any;
  factories: { name: string } | null;
}

interface ReorderSuggestion {
  orderId: string;
  orderNumber: string;
  productName: string;
  factoryName: string;
  factoryId: string;
  avgLeadWeeks: number;
  suggestedPODate: Date;
  urgency: "overdue" | "urgent" | "upcoming" | "on_track";
  daysUntilPO: number;
  targetDelivery: Date;
  reasoning: string;
}

function calcUrgency(daysUntilPO: number): ReorderSuggestion["urgency"] {
  if (daysUntilPO < 0) return "overdue";
  if (daysUntilPO < 14) return "urgent";
  if (daysUntilPO < 42) return "upcoming";
  return "on_track";
}

export function SmartReorderIntelligence() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<ReorderSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTarget, setEditingTarget] = useState<string | null>(null);
  const [targetDates, setTargetDates] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) load();
  }, [user]);

  async function load() {
    setLoading(true);
    try {
      // Get all closed/shipped orders with delivery data
      const { data: orders } = await (supabase as any)
        .from("orders")
        .select("id, order_number, status, factory_id, created_at, delivery_window_end, specifications, factories(name)")
        .eq("buyer_id", user!.id)
        .in("status", ["closed", "shipped"])
        .not("delivery_window_end", "is", null)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!orders?.length) { setLoading(false); return; }

      // Group by factory to calculate avg lead time per factory
      const factoryLeadTimes: Record<string, number[]> = {};
      orders.forEach((o: any) => {
        if (!o.factory_id || !o.delivery_window_end) return;
        const created = new Date(o.created_at);
        const delivered = new Date(o.delivery_window_end);
        const weeks = Math.round((delivered.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 7));
        if (weeks > 4 && weeks < 52) { // sanity check
          if (!factoryLeadTimes[o.factory_id]) factoryLeadTimes[o.factory_id] = [];
          factoryLeadTimes[o.factory_id].push(weeks);
        }
      });

      // Build suggestions from most recent order per factory
      const seenFactories = new Set<string>();
      const suggestions: ReorderSuggestion[] = [];

      for (const order of orders as any[]) {
        if (!order.factory_id || seenFactories.has(order.factory_id)) continue;
        seenFactories.add(order.factory_id);

        const leadTimes = factoryLeadTimes[order.factory_id] || [14];
        const avgLeadWeeks = Math.round(leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length);

        // Target delivery: next logical season
        // Default: 6 months from today, or use user-set target
        const savedTarget = targetDates[order.id];
        const targetDelivery = savedTarget
          ? new Date(savedTarget)
          : addWeeks(new Date(), 26); // 6 months from now

        // Suggested PO date = target delivery minus avg lead time minus 2-week approval buffer
        const suggestedPODate = subWeeks(targetDelivery, avgLeadWeeks + 2);
        const daysUntilPO = differenceInDays(suggestedPODate, new Date());
        const specs = order.specifications as any;

        suggestions.push({
          orderId: order.id,
          orderNumber: order.order_number,
          productName: specs?.product_name || order.order_number,
          factoryName: order.factories?.name || "Unknown factory",
          factoryId: order.factory_id,
          avgLeadWeeks,
          suggestedPODate,
          urgency: calcUrgency(daysUntilPO),
          daysUntilPO,
          targetDelivery,
          reasoning: `Based on your ${leadTimes.length} order${leadTimes.length !== 1 ? "s" : ""} with ${order.factories?.name || "this factory"}, average lead time is ${avgLeadWeeks} weeks. Issue PO by ${format(suggestedPODate, "MMM d")} to hit a ${format(targetDelivery, "MMM yyyy")} delivery.`,
        });
      }

      setSuggestions(suggestions.sort((a, b) => a.daysUntilPO - b.daysUntilPO));
    } finally {
      setLoading(false);
    }
  }

  if (loading) return null;
  if (!suggestions.length) return null;

  const urgent = suggestions.filter(s => ["overdue","urgent"].includes(s.urgency));
  const upcoming = suggestions.filter(s => s.urgency === "upcoming");

  if (!urgent.length && !upcoming.length) return null;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
      <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">Production timing</p>
        <span className="ml-auto text-xs text-muted-foreground">Based on your order history</span>
      </div>

      <div className="divide-y divide-border">
        {[...urgent, ...upcoming].slice(0, 3).map(s => (
          <div key={s.orderId} className={cn(
            "px-5 py-4",
            s.urgency === "overdue" && "bg-rose-500/5",
            s.urgency === "urgent" && "bg-amber-500/5",
          )}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {s.urgency === "overdue" && <AlertTriangle className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />}
                  {s.urgency === "urgent" && <Clock className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />}
                  {s.urgency === "upcoming" && <RefreshCw className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
                  <p className="text-sm font-semibold text-foreground truncate">{s.productName}</p>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0",
                    s.urgency === "overdue" && "bg-rose-500/10 text-rose-700 border-rose-400/30",
                    s.urgency === "urgent" && "bg-amber-500/10 text-amber-700 border-amber-400/30",
                    s.urgency === "upcoming" && "bg-primary/10 text-primary border-primary/20",
                  )}>
                    {s.urgency === "overdue" ? "PO overdue" : s.urgency === "urgent" ? `${s.daysUntilPO}d to issue` : `${s.daysUntilPO}d to issue`}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{s.reasoning}</p>
              </div>
              <Button size="sm" asChild className="flex-shrink-0 gap-1.5">
                <Link to={`/orders/create?prefill=${s.orderId}`}>
                  Reorder <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {suggestions.length > 3 && (
        <div className="px-5 py-2.5 border-t border-border">
          <p className="text-xs text-muted-foreground">{suggestions.length - 3} more products — <Link to="/analytics" className="text-primary hover:underline">view all in analytics</Link></p>
        </div>
      )}
    </div>
  );
}
