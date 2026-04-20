import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, addWeeks, isAfter } from "date-fns";
import { CreditCard, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Payment {
  order_number: string;
  order_id: string;
  label: string;
  amount: number;
  currency: string;
  status: string;
  estimated_date: string | null;
  factory_name: string;
}

export function PaymentCalendar() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  async function load() {
    const { data: orders } = await (supabase as any)
      .from("orders")
      .select("id, order_number, currency, delivery_window_end, factories(name), order_milestones(id, label, amount, percentage, status, sequence_order)")
      .eq("buyer_id", user!.id)
      .not("status", "in", '("closed","cancelled","draft")')
      .order("created_at", { ascending: false })
      .limit(10);

    if (!orders) { setLoading(false); return; }

    const upcoming: Payment[] = [];
    orders.forEach((o: any) => {
      const milestones = (o.order_milestones || [])
        .filter((m: any) => m.status === "pending" || m.status === "eligible")
        .sort((a: any, b: any) => a.sequence_order - b.sequence_order);
      
      milestones.forEach((m: any, idx: number) => {
        // Estimate payment date: delivery date minus weeks remaining proportionally
        let estimatedDate = null;
        if (o.delivery_window_end) {
          const delivery = new Date(o.delivery_window_end);
          const weeksBack = (milestones.length - idx) * 3;
          const est = addWeeks(delivery, -weeksBack);
          if (isAfter(est, new Date())) {
            estimatedDate = est.toISOString();
          }
        }
        
        upcoming.push({
          order_number: o.order_number,
          order_id: o.id,
          label: m.label,
          amount: m.amount || 0,
          currency: o.currency || "USD",
          status: m.status,
          estimated_date: estimatedDate,
          factory_name: o.factories?.name || "Factory",
        });
      });
    });

    // Sort by estimated date
    upcoming.sort((a, b) => {
      if (!a.estimated_date) return 1;
      if (!b.estimated_date) return -1;
      return new Date(a.estimated_date).getTime() - new Date(b.estimated_date).getTime();
    });

    setPayments(upcoming.slice(0, 8));
    setLoading(false);
  }

  const totalPending = payments.reduce((s, p) => s + p.amount, 0);
  const currency = payments[0]?.currency || "USD";
  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);

  if (loading) return null;
  if (payments.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <CreditCard className="h-4 w-4 text-primary" />
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">Upcoming payments</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {payments.length} milestone{payments.length !== 1 ? "s" : ""} pending · {fmt(totalPending)} total
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="border-t border-border divide-y divide-border">
          {payments.map((p, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{p.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{p.order_number} · {p.factory_name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{fmt(p.amount)}</p>
                {p.estimated_date && (
                  <p className="text-xs text-muted-foreground">~{format(new Date(p.estimated_date), "MMM d")}</p>
                )}
                {p.status === "eligible" && (
                  <span className="text-xs text-primary font-medium">Ready to release</span>
                )}
              </div>
            </div>
          ))}
          <div className="px-5 py-3 flex justify-between bg-secondary/30">
            <span className="text-sm text-muted-foreground">Total pending</span>
            <span className="text-sm font-semibold text-foreground">{fmt(totalPending)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
