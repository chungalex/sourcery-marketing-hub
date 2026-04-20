import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { differenceInDays } from "date-fns";
import { AlertTriangle } from "lucide-react";

const HOLIDAYS = [
  { name: "Tết (Vietnamese New Year)", start: new Date("2026-01-28"), end: new Date("2026-02-05"), shutdown: 10, region: "VN", tip: "Factories close 7-14 days. Confirm all active orders are complete or paused. Book any new slots before Jan 15." },
  { name: "Tết (Vietnamese New Year)", start: new Date("2025-01-29"), end: new Date("2025-02-06"), shutdown: 10, region: "VN", tip: "Factories close 7-14 days. Confirm all active orders are complete or paused. Book any new slots before Jan 15." },
  { name: "Chinese New Year", start: new Date("2026-02-17"), end: new Date("2026-02-24"), shutdown: 14, region: "CN", tip: "Chinese factories close 1-3 weeks. If any of your trims or fabrics come from China, order well in advance." },
  { name: "Golden Week (China)", start: new Date("2025-10-01"), end: new Date("2025-10-07"), shutdown: 7, region: "CN", tip: "Chinese suppliers close for 1 week. Plan raw material orders to arrive before Oct 1." },
];

export function HolidayAlert() {
  const { user } = useAuth();
  const [activeOrders, setActiveOrders] = useState(0);
  const [dismissed, setDismissed] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("dismissed_holidays") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    if (!user) return;
    (supabase as any).from("orders").select("id", { count: "exact", head: true })
      .eq("buyer_id", user.id).not("status", "in", '("closed","cancelled","draft")')
      .then(({ count }: any) => setActiveOrders(count || 0));
  }, [user]);

  const today = new Date();
  const upcoming = HOLIDAYS
    .map(h => ({ ...h, daysUntil: differenceInDays(h.start, today) }))
    .filter(h => h.daysUntil >= 0 && h.daysUntil <= 45)
    .filter(h => !dismissed.includes(h.name + h.start.toISOString()));

  if (!upcoming.length || activeOrders === 0) return null;

  const dismiss = (key: string) => {
    const next = [...dismissed, key];
    setDismissed(next);
    localStorage.setItem("dismissed_holidays", JSON.stringify(next));
  };

  return (
    <div className="space-y-2 mb-4">
      {upcoming.map(h => {
        const key = h.name + h.start.toISOString();
        return (
          <div key={key} className="flex items-start gap-3 p-4 rounded-xl border border-amber-400/30 bg-amber-500/5">
            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{h.name} in {h.daysUntil} days</p>
                <button onClick={() => dismiss(key)} className="text-xs text-muted-foreground hover:text-foreground">Dismiss</button>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{h.tip}</p>
              {activeOrders > 0 && (
                <p className="text-xs text-amber-700 mt-1 font-medium">You have {activeOrders} active order{activeOrders > 1 ? "s" : ""} — confirm factory status before this date.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
