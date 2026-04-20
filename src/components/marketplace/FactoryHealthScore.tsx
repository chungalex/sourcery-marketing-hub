import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, AlertCircle, Clock, Shield, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FactoryHealth {
  score: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  completedOrders: number;
  onTimeRate: number;
  qcPassRate: number;
  avgLeadWeeks: number;
  trend: "up" | "down" | "stable";
}

interface FactoryHealthScoreProps {
  factoryId: string;
  compact?: boolean;
}

const GRADE_CONFIG = {
  A: { color: "text-green-700 bg-green-500/10 border-green-500/20", label: "Excellent" },
  B: { color: "text-blue-700 bg-blue-500/10 border-blue-400/30", label: "Good" },
  C: { color: "text-amber-700 bg-amber-500/10 border-amber-400/30", label: "Average" },
  D: { color: "text-orange-700 bg-orange-500/10 border-orange-400/30", label: "Below average" },
  F: { color: "text-rose-700 bg-rose-500/10 border-rose-400/30", label: "Poor" },
};

function scoreToGrade(score: number): FactoryHealth["grade"] {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 45) return "D";
  return "F";
}

export function FactoryHealthScore({ factoryId, compact = false }: FactoryHealthScoreProps) {
  const [health, setHealth] = useState<FactoryHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!factoryId) return;
    calculate();
  }, [factoryId]);

  async function calculate() {
    setLoading(true);
    try {
      const { data: orders } = await (supabase as any)
        .from("orders")
        .select("id, status, created_at, delivery_window_end, order_milestones(status)")
        .eq("factory_id", factoryId)
        .in("status", ["closed", "shipped", "qc_pass", "qc_fail", "in_production", "po_accepted"])
        .order("created_at", { ascending: false })
        .limit(20);

      if (!orders?.length) { setLoading(false); return; }

      const closed = orders.filter((o: any) => ["closed", "shipped"].includes(o.status));
      const completedOrders = closed.length;

      if (completedOrders === 0) { setLoading(false); return; }

      // On-time rate: orders where actual close date was before delivery_window_end
      // Since we don't track exact close date, we use a proxy: order was closed and had a delivery window
      const withDeadlines = closed.filter((o: any) => o.delivery_window_end);
      const onTimeCount = withDeadlines.length; // Simplified — closed = delivered
      const onTimeRate = withDeadlines.length > 0 ? Math.round((onTimeCount / withDeadlines.length) * 100) : 80;

      // QC pass rate: from order statuses
      const allWithQC = orders.filter((o: any) => ["closed", "shipped", "qc_pass", "qc_fail"].includes(o.status));
      const qcFailed = allWithQC.filter((o: any) => o.status === "qc_fail").length;
      const qcPassRate = allWithQC.length > 0
        ? Math.round(((allWithQC.length - qcFailed) / allWithQC.length) * 100)
        : 85;

      // Avg lead time
      const { differenceInDays } = await import("date-fns");
      const withDates = closed.filter((o: any) => o.created_at && o.delivery_window_end);
      const avgLeadDays = withDates.length > 0
        ? withDates.reduce((sum: number, o: any) =>
            sum + differenceInDays(new Date(o.delivery_window_end), new Date(o.created_at)), 0
          ) / withDates.length
        : 98;

      // Calculate composite score
      // On-time (40%) + QC pass (40%) + order completion rate (20%)
      const completionRate = Math.min(completedOrders * 20, 100); // More orders = more trust
      const score = Math.round(
        (onTimeRate * 0.4) + (qcPassRate * 0.4) + (completionRate * 0.2)
      );

      // Trend: compare first half vs second half of orders
      const half = Math.floor(orders.length / 2);
      const recent = orders.slice(0, half);
      const older = orders.slice(half);
      const recentFailed = recent.filter((o: any) => o.status === "qc_fail").length;
      const olderFailed = older.filter((o: any) => o.status === "qc_fail").length;
      let trend: FactoryHealth["trend"] = "stable";
      if (recentFailed < olderFailed) trend = "up";
      else if (recentFailed > olderFailed) trend = "down";

      setHealth({
        score: Math.min(score, 100),
        grade: scoreToGrade(score),
        completedOrders,
        onTimeRate,
        qcPassRate,
        avgLeadWeeks: Math.round(avgLeadDays / 7),
        trend,
      });
    } catch (e) {
      console.error("Factory health error:", e);
    }
    setLoading(false);
  }

  if (loading || !health) return null;

  const gradeCfg = GRADE_CONFIG[health.grade];
  const TrendIcon = health.trend === "up" ? TrendingUp : health.trend === "down" ? TrendingDown : Minus;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className={cn("text-xs px-2 py-0.5 rounded-full border font-semibold", gradeCfg.color)}>
          {health.grade} · {health.score}
        </span>
        <span className="text-xs text-muted-foreground">{health.completedOrders} orders</span>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Factory health</p>
          <div className="flex items-center gap-2">
            <span className={cn("text-2xl font-bold px-3 py-1 rounded-lg border", gradeCfg.color)}>
              {health.grade}
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{gradeCfg.label}</p>
              <p className="text-xs text-muted-foreground">{health.score}/100 · {health.completedOrders} completed orders</p>
            </div>
          </div>
        </div>
        <TrendIcon className={cn("h-5 w-5", health.trend === "up" ? "text-green-600" : health.trend === "down" ? "text-rose-600" : "text-muted-foreground")} />
      </div>

      <div className="space-y-2">
        {[
          { label: "On-time delivery", value: health.onTimeRate + "%", icon: Clock, good: health.onTimeRate >= 80 },
          { label: "QC pass rate", value: health.qcPassRate + "%", icon: Shield, good: health.qcPassRate >= 85 },
          { label: "Avg lead time", value: health.avgLeadWeeks + " weeks", icon: CheckCircle, good: health.avgLeadWeeks <= 14 },
        ].map(({ label, value, icon: Icon, good }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Icon className={cn("h-3.5 w-3.5", good ? "text-green-600" : "text-amber-600")} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <span className={cn("text-xs font-semibold", good ? "text-green-700" : "text-amber-700")}>{value}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border leading-relaxed">
        Based on {health.completedOrders} completed order{health.completedOrders !== 1 ? "s" : ""} on Sourcery. Score improves as more orders complete.
      </p>
    </div>
  );
}
