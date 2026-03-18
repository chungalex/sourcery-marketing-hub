import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingUp, Shield, Clock, AlertCircle, RotateCcw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FactoryScore {
  overall_score: number;
  tier: string;
  qc_pass_rate: number;
  on_time_rate: number;
  response_time_score: number;
  defect_rate_score: number;
  revision_frequency_score: number;
  brand_retention_score: number;
  total_orders: number;
  completed_orders: number;
  critical_defects: number;
  avg_response_hours: number | null;
  calculated_at: string;
}

const TIER_CONFIG: Record<string, { label: string; cls: string; desc: string }> = {
  new:       { label: "New",       cls: "bg-secondary text-muted-foreground border-border",         desc: "Fewer than 3 completed orders — building track record" },
  monitored: { label: "Monitored", cls: "bg-amber-500/10 text-amber-700 border-amber-500/20",      desc: "Score below 75 — on watch list" },
  verified:  { label: "Verified",  cls: "bg-blue-500/10 text-blue-700 border-blue-500/20",         desc: "Score 75–89 — standard network member" },
  elite:     { label: "Elite",     cls: "bg-green-500/10 text-green-700 border-green-500/20",      desc: "Score 90+ — featured placement, priority matching" },
};

const METRICS = [
  { key: "qc_pass_rate",             label: "QC pass rate",        icon: Shield,      weight: "30%" },
  { key: "defect_rate_score",        label: "Defect rate",         icon: AlertCircle, weight: "20%" },
  { key: "on_time_rate",             label: "On-time delivery",    icon: TrendingUp,  weight: "20%" },
  { key: "response_time_score",      label: "Response time",       icon: Clock,       weight: "15%" },
  { key: "revision_frequency_score", label: "Revision frequency",  icon: RotateCcw,   weight: "10%" },
  { key: "brand_retention_score",    label: "Brand retention",     icon: Users,       weight: "5%"  },
];

function ScoreBar({ value }: { value: number }) {
  const pct = Math.min(100, value);
  const color = pct >= 80 ? "#3B6D11" : pct >= 60 ? "#BA7517" : "#A32D2D";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-medium text-foreground w-8 text-right">{Math.round(value)}</span>
    </div>
  );
}

export function FactoryScoreCard({ factoryId, isOwner = false }: { factoryId: string; isOwner?: boolean }) {
  const [score, setScore] = useState<FactoryScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => { load(); }, [factoryId]);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("factory_performance_scores").select("*").eq("factory_id", factoryId).maybeSingle();
    setScore(data as FactoryScore | null);
    setLoading(false);
  }

  async function recalculate() {
    setRecalculating(true);
    try {
      const { error } = await supabase.functions.invoke("calculate-factory-score", { body: { factory_id: factoryId } });
      if (error) throw new Error(error.message);
      await load();
      toast.success("Score recalculated.");
    } catch (e: any) { toast.error(e.message || "Failed."); }
    finally { setRecalculating(false); }
  }

  if (loading) return <div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  if (!score) return (
    <div className="py-8 text-center space-y-3">
      <p className="text-sm text-muted-foreground">No score yet — needs completed orders.</p>
      {isOwner && <Button size="sm" variant="outline" onClick={recalculate} disabled={recalculating}>{recalculating && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}Calculate Score</Button>}
    </div>
  );

  const tierCfg = TIER_CONFIG[score.tier] || TIER_CONFIG.new;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16">
            <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
              <circle cx="32" cy="32" r="26" fill="none" stroke="var(--color-border-tertiary)" strokeWidth="5" />
              <circle cx="32" cy="32" r="26" fill="none"
                stroke={score.overall_score >= 90 ? "#3B6D11" : score.overall_score >= 75 ? "#185FA5" : score.overall_score >= 60 ? "#BA7517" : "#A32D2D"}
                strokeWidth="5"
                strokeDasharray={`${(score.overall_score / 100) * 163.4} 163.4`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-foreground">{score.overall_score}</span>
            </div>
          </div>
          <div>
            <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border", tierCfg.cls)}>{tierCfg.label}</span>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">{tierCfg.desc}</p>
          </div>
        </div>
        {isOwner && (
          <Button size="sm" variant="ghost" onClick={recalculate} disabled={recalculating} className="text-xs text-muted-foreground">
            {recalculating ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[{label:"Orders",value:score.total_orders},{label:"Completed",value:score.completed_orders},{label:"Critical defects",value:score.critical_defects}].map(s => (
          <div key={s.label} className="bg-secondary/50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {isOwner ? (
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Score breakdown</p>
          {METRICS.map(m => {
            const Icon = m.icon;
            const val = score[m.key as keyof FactoryScore] as number;
            return (
              <div key={m.key} className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-foreground">{m.label}</span>
                  <span className="text-xs text-muted-foreground">({m.weight})</span>
                </div>
                <ScoreBar value={val} />
              </div>
            );
          })}
          {score.avg_response_hours !== null && (
            <p className="text-xs text-muted-foreground pt-1">Avg response: {score.avg_response_hours.toFixed(1)}h</p>
          )}
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-secondary/50 border border-border">
          <p className="text-xs text-muted-foreground">
            Calculated from QC pass rate, response time, defect history, on-time delivery, and brand retention across {score.completed_orders} completed order{score.completed_orders !== 1 ? "s" : ""}.
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">Last calculated {new Date(score.calculated_at).toLocaleDateString()}</p>
    </div>
  );
}
