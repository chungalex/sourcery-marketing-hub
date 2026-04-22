import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, addDays, isThisMonth, isFuture, addMonths, isSameMonth } from "date-fns";
const isNextMonth = (d: Date) => isSameMonth(d, addMonths(new Date(), 1));
import { DollarSign, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MilestonePayment {
  id: string;
  label: string;
  amount: number;
  currency: string;
  status: string;
  order_number: string;
  order_id: string;
  product_name: string | null;
  factory_name: string | null;
  estimated_date: string | null;
}

export function CashFlowCalendar() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<MilestonePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  async function load() {
    const { data } = await (supabase as any)
      .from("order_milestones")
      .select(`
        id, label, amount, status, sequence_order,
        orders!inner(
          id, order_number, buyer_id, currency, delivery_window_end,
          specifications, factories(name)
        )
      `)
      .eq("orders.buyer_id", user!.id)
      .in("status", ["pending", "eligible"])
      .not("orders.status", "in", '("closed","cancelled","draft")')
      .order("sequence_order", { ascending: true });

    if (data) {
      const mapped = data.map((m: any) => ({
        id: m.id,
        label: m.label,
        amount: m.amount || 0,
        currency: m.orders?.currency || "USD",
        status: m.status,
        order_number: m.orders?.order_number || "",
        order_id: m.orders?.id || "",
        product_name: (m.orders?.specifications as any)?.product_name || null,
        factory_name: m.orders?.factories?.name || null,
        estimated_date: m.orders?.delivery_window_end || null,
      }));
      setPayments(mapped);
    }
    setLoading(false);
  }

  if (loading) return null;
  if (payments.length === 0) return null;

  const totalPending = payments.reduce((s, p) => s + p.amount, 0);
  const thisMonthPayments = payments.filter(p => p.status === "eligible");
  const upcomingPayments = payments.filter(p => p.status === "pending");
  const thisMonthtotal = thisMonthPayments.reduce((s, p) => s + p.amount, 0);

  const fmt = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <DollarSign className="h-4 w-4 text-primary" />
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">
              Production cash flow
            </p>
            <p className="text-xs text-muted-foreground">
              {fmt(totalPending, payments[0]?.currency || "USD")} in pending milestone payments
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {thisMonthPayments.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-400/30 font-medium">
              {thisMonthPayments.length} ready to release
            </span>
          )}
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border">
          {/* Ready to release */}
          {thisMonthPayments.length > 0 && (
            <div className="p-4 border-b border-border">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
                Ready to release — {fmt(thisMonthtotal, payments[0]?.currency || "USD")}
              </p>
              {thisMonthPayments.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.product_name || p.order_number}
                      {p.factory_name ? ` · ${p.factory_name}` : ""}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{fmt(p.amount, p.currency)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming */}
          {upcomingPayments.length > 0 && (
            <div className="p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Upcoming payments — {fmt(upcomingPayments.reduce((s,p) => s + p.amount, 0), payments[0]?.currency || "USD")}
              </p>
              {upcomingPayments.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm text-foreground">{p.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.product_name || p.order_number}
                      {p.factory_name ? ` · ${p.factory_name}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{fmt(p.amount, p.currency)}</p>
                    {p.estimated_date && (
                      <p className="text-xs text-muted-foreground">by {format(new Date(p.estimated_date), "MMM d")}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
