import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TechPackReviewerProps {
  orderId: string;
  techPackUrl?: string | null;
  specifications?: Record<string, any> | null;
}

interface ReviewResult {
  score: number;
  critical_gaps: string[];
  warnings: string[];
  strengths: string[];
  recommendation: string;
}

export function TechPackReviewer({ orderId, techPackUrl, specifications }: TechPackReviewerProps) {
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function runReview() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const specs = specifications || {};
      const specSummary = Object.entries(specs)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");

      const { data, error } = await supabase.functions.invoke("production-assistant", {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined,
        body: {
          system: `You are an expert garment tech pack reviewer with 20 years of experience. Review the provided product specifications and return ONLY a JSON object with:
{
  "score": (0-100, completeness/quality score),
  "critical_gaps": ["list of missing critical info that will cause factory errors"],
  "warnings": ["list of ambiguities that may cause revision rounds"],
  "strengths": ["list of well-specified elements"],
  "recommendation": "one sentence summary of readiness to send to factory"
}
Return ONLY valid JSON, no other text.`,
          messages: [{
            role: "user",
            content: `Review this tech pack / specifications:\n${specSummary}\n${techPackUrl ? `Tech pack file attached: ${techPackUrl}` : "No tech pack file uploaded."}`
          }],
        },
      });

      if (!error && data?.content?.[0]?.text) {
        const text = data.content[0].text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(text);
        setResult(parsed);
        setExpanded(true);
      } else {
        toast.error("Review failed — try again");
      }
    } catch {
      toast.error("Review failed");
    }
    setLoading(false);
  }

  const scoreColor = result
    ? result.score >= 80 ? "text-green-700" : result.score >= 60 ? "text-amber-700" : "text-rose-700"
    : "";

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">AI tech pack review</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {result ? `Score: ${result.score}/100 — ${result.recommendation}` : "Catch gaps before they become revision rounds"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {result && (
            <span className={cn("text-sm font-bold", scoreColor)}>{result.score}/100</span>
          )}
          {result ? (
            <button onClick={() => setExpanded(v => !v)} className="p-1 hover:bg-secondary rounded">
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          ) : (
            <Button size="sm" onClick={runReview} disabled={loading} className="gap-1.5">
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Review
            </Button>
          )}
        </div>
      </div>

      {result && expanded && (
        <div className="border-t border-border p-5 space-y-4">
          {result.critical_gaps.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-rose-700 uppercase tracking-wide mb-2">Critical gaps</p>
              <div className="space-y-1.5">
                {result.critical_gaps.map(gap => (
                  <div key={gap} className="flex items-start gap-2 text-xs text-rose-700">
                    <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                    {gap}
                  </div>
                ))}
              </div>
            </div>
          )}
          {result.warnings.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Warnings</p>
              <div className="space-y-1.5">
                {result.warnings.map(w => (
                  <div key={w} className="flex items-start gap-2 text-xs text-amber-700">
                    <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                    {w}
                  </div>
                ))}
              </div>
            </div>
          )}
          {result.strengths.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Well specified</p>
              <div className="space-y-1.5">
                {result.strengths.map(s => (
                  <div key={s} className="flex items-start gap-2 text-xs text-green-700">
                    <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={runReview} disabled={loading} className="gap-1.5 w-full">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            Re-run review
          </Button>
        </div>
      )}
    </div>
  );
}
