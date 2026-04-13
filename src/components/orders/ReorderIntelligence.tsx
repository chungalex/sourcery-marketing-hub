import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReorderIntelligenceProps {
  orderId: string;
  factoryId?: string;
  factoryName?: string;
}

interface Intelligence {
  issues: string[];
  positives: string[];
  recommendation: string;
}

export function ReorderIntelligence({ orderId, factoryId, factoryName }: ReorderIntelligenceProps) {
  const [data, setData] = useState<Intelligence | null>(null);
  const [loading, setLoading] = useState(false);

  const analyse = async () => {
    setLoading(true);
    try {
      // Fetch previous orders with this factory
      const { data: orders } = await supabase
        .from("orders")
        .select("id, order_number, status, created_at")
        .eq("factory_id", factoryId)
        .eq("status", "closed")
        .order("created_at", { ascending: false })
        .limit(5);

      const { data: defects } = await (supabase as any)
        .from("defect_reports")
        .select("defect_type, severity, quantity_affected")
        .eq("order_id", orderId);

      const { data: revisions } = await (supabase as any)
        .from("revision_rounds")
        .select("status, notes")
        .eq("order_id", orderId);

      const context = `
Previous orders with ${factoryName}: ${orders?.length || 0} closed orders.
Defects on last order: ${defects?.length || 0} reports. ${defects?.map(d => `${d.severity} ${d.defect_type} (${d.quantity_affected} units)`).join(", ") || "None"}
Revision rounds: ${revisions?.length || 0}. ${revisions?.map(r => r.notes).join("; ") || "None"}
      `.trim();

      const response = await supabase.functions.invoke("production-assistant", {
        body: {
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          system: "You are a production intelligence assistant. Return only valid JSON as instructed.",
          messages: [{
            role: "user",
            content: `Based on the production history below, provide reorder intelligence. Return ONLY valid JSON:
{
  "issues": ["issues from last order to flag before reordering"],
  "positives": ["things that went well worth noting"],
  "recommendation": "one sentence recommendation"
}

History: ${context}

Return only JSON.`
          }]
        },
      });

      const result = response.data;
      const text = result?.content?.[0]?.text || "{}";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setData(parsed);
    } catch {
      setData({ issues: [], positives: [], recommendation: "Could not analyse order history." });
    }
    setLoading(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Reorder intelligence</h3>
        </div>
        <Button size="sm" variant="outline" onClick={analyse} disabled={loading} className="text-xs h-7">
          {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
          Analyse
        </Button>
      </div>

      {!data && !loading && (
        <p className="text-xs text-muted-foreground">AI reviews your last order with this factory and flags anything to address before reordering.</p>
      )}

      {data && (
        <div className="space-y-3 mt-2">
          {data.issues.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide mb-1.5">Flag before reordering</p>
              {data.issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground">{issue}</p>
                </div>
              ))}
            </div>
          )}
          {data.positives.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-green-600 uppercase tracking-wide mb-1.5">Worked well</p>
              {data.positives.map((pos, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground">{pos}</p>
                </div>
              ))}
            </div>
          )}
          {data.recommendation && (
            <p className="text-xs text-muted-foreground border-t border-border pt-3 italic">{data.recommendation}</p>
          )}
        </div>
      )}
    </div>
  );
}
