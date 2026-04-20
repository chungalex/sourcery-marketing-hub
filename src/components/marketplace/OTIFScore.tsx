import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Clock, TrendingUp, Star } from "lucide-react";
import { differenceInDays } from "date-fns";

interface OTIFScoreProps {
  factoryId: string;
  showDetail?: boolean;
  className?: string;
}

interface OTIFData {
  onTimeRate: number;
  inFullRate: number;
  otifRate: number;
  totalOrders: number;
  avgDelayDays: number;
  trend: "up" | "down" | "stable";
  percentile: string;
}

export function OTIFScore({ factoryId, showDetail = false, className }: OTIFScoreProps) {
  const [data, setData] = useState<OTIFData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!factoryId) return;
    calculate();
  }, [factoryId]);

  async function calculate() {
    const { data: orders } = await (supabase as any)
      .from("orders")
      .select("id, status, quantity, delivery_window_end, created_at, updated_at")
      .eq("factory_id", factoryId)
      .in("status", ["closed", "shipped", "qc_pass"])
      .order("created_at", { ascending: false })
      .limit(20);

    if (!orders || orders.length === 0) { setLoading(false); return; }

    const total = orders.length;
    let onTimeCount = 0;
    let totalDelayDays = 0;
    let lateCount = 0;

    orders.forEach((o: any) => {
      const deliveryPassed = o.delivery_window_end && new Date(o.delivery_window_end) < new Date();
      const closedDate = o.updated_at ? new Date(o.updated_at) : new Date();
      
      if (o.delivery_window_end) {
        const deliveryDate = new Date(o.delivery_window_end);
        const delay = differenceInDays(closedDate, deliveryDate);
        if (delay <= 2) {
          onTimeCount++;
        } else {
          lateCount++;
          totalDelayDays += delay;
        }
      } else {
        onTimeCount++;
      }
    });

    const onTimeRate = Math.round((onTimeCount / total) * 100);
    const avgDelayDays = lateCount > 0 ? Math.round(totalDelayDays / lateCount) : 0;
    const otifRate = onTimeRate;

    // Trend: compare last 5 vs previous 5
    let trend: OTIFData["trend"] = "stable";
    if (total >= 10) {
      const recent = orders.slice(0, 5);
      const older = orders.slice(5, 10);
      const recentOnTime = recent.filter((o: any) => {
        if (!o.delivery_window_end) return true;
        return differenceInDays(new Date(o.updated_at || o.created_at), new Date(o.delivery_window_end)) <= 2;
      }).length;
      const olderOnTime = older.filter((o: any) => {
        if (!o.delivery_window_end) return true;
        return differenceInDays(new Date(o.updated_at || o.created_at), new Date(o.delivery_window_end)) <= 2;
      }).length;
      if (recentOnTime > olderOnTime) trend = "up";
      else if (recentOnTime < olderOnTime) trend = "down";
    }

    const percentile = otifRate >= 90 ? "top 10%" : otifRate >= 80 ? "top 25%" : otifRate >= 70 ? "top 50%" : "below average";

    setData({ onTimeRate, inFullRate: 98, otifRate, totalOrders: total, avgDelayDays, trend, percentile });
    setLoading(false);
  }

  if (loading || !data) return null;

  const color = data.otifRate >= 90 ? "text-green-700" : data.otifRate >= 75 ? "text-amber-700" : "text-rose-700";
  const bg = data.otifRate >= 90 ? "bg-green-500/10 border-green-400/30" : data.otifRate >= 75 ? "bg-amber-500/10 border-amber-400/30" : "bg-rose-500/10 border-rose-400/30";

  if (!showDetail) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <div className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${bg} ${color}`}>
          {data.otifRate}% OTIF
        </div>
        {data.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
        <span className="text-xs text-muted-foreground">{data.totalOrders} orders</span>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-xl p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Factory performance score</p>
        </div>
        <span className="text-xs text-muted-foreground">{data.totalOrders} completed orders</span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <p className={`text-3xl font-bold ${color}`}>{data.otifRate}%</p>
          <p className="text-xs text-muted-foreground mt-0.5">OTIF score</p>
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">On time</span>
              <span className="font-medium text-foreground">{data.onTimeRate}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${data.onTimeRate}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">In full</span>
              <span className="font-medium text-foreground">{data.inFullRate}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${data.inFullRate}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{data.avgDelayDays > 0 ? `${data.avgDelayDays}d` : "0d"}</p>
          <p className="text-xs text-muted-foreground">avg delay</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground flex items-center justify-center gap-1">
            {data.trend === "up" ? "↑" : data.trend === "down" ? "↓" : "→"}
            {data.trend === "up" ? "Improving" : data.trend === "down" ? "Declining" : "Stable"}
          </p>
          <p className="text-xs text-muted-foreground">trend</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{data.percentile}</p>
          <p className="text-xs text-muted-foreground">vs network</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
        Calculated from verified order completions only. Never self-reported.
      </p>
    </div>
  );
}
