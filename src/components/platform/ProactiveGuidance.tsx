import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, X, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ProactiveGuidanceProps {
  orderId: string;
  orderStatus: string;
  deliveryWindowEnd?: string | null;
  factoryName?: string;
  qcStandard?: string;
}

interface Guidance {
  type: "warning" | "action" | "info";
  headline: string;
  body: string;
  action?: { label: string; href: string };
  urgency: "high" | "medium" | "low";
}

export function ProactiveGuidance({
  orderId,
  orderStatus,
  deliveryWindowEnd,
  factoryName,
  qcStandard,
}: ProactiveGuidanceProps) {
  const [guidance, setGuidance] = useState<Guidance | null>(null);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    // Check if dismissed for this order+status combo
    const key = `guidance_dismissed_${orderId}_${orderStatus}`;
    if (localStorage.getItem(key)) {
      setDismissed(true);
      return;
    }
    generateGuidance();
  }, [orderId, orderStatus]);

  async function generateGuidance() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Build context from order state
      const daysToDelivery = deliveryWindowEnd
        ? Math.ceil((new Date(deliveryWindowEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;

      const statusContext: Record<string, string> = {
        draft: "The order is in draft. The PO has not been issued yet.",
        po_issued: `The PO has been issued to ${factoryName || "the factory"} but not yet accepted.`,
        po_accepted: `${factoryName || "The factory"} has accepted the PO. Production has not started yet.`,
        sampling: `Sampling is in progress with ${factoryName || "the factory"}.`,
        sample_approved: "The sample has been approved. Bulk production can start.",
        in_production: `Bulk production is underway with ${factoryName || "the factory"}.`,
        qc_pending: "Production is complete. QC inspection is pending.",
        qc_approved: "QC has passed. Ready for payment release and shipping.",
        ready_to_ship: "Goods are ready to ship. Awaiting shipping arrangements.",
        shipped: "Goods are in transit.",
        closed: "Order is complete.",
      };

      const prompt = `You are a production intelligence system for Sourcery, a manufacturing platform. 
Analyse this order situation and generate ONE specific, actionable guidance alert.

Order context:
- Status: ${orderStatus}
- Situation: ${statusContext[orderStatus] || orderStatus}
- Days to delivery: ${daysToDelivery !== null ? daysToDelivery + " days" : "not set"}
- Factory: ${factoryName || "not specified"}
- QC standard: ${qcStandard || "not specified"}

Return ONLY a JSON object with this exact structure:
{
  "type": "warning" | "action" | "info",
  "urgency": "high" | "medium" | "low",
  "headline": "short, specific headline (max 10 words)",
  "body": "specific guidance — what to do right now, why it matters (2-3 sentences max)",
  "action": { "label": "CTA text (4 words max)", "href": "/relevant-path" } or null
}

Rules:
- Be specific to the exact situation, not generic
- If days to delivery is under 14 and status is early, urgency is high
- If PO has been issued but not accepted for more than 3 days, flag it
- Don't mention Sourcery features by name — speak like an experienced sourcing director
- If the situation is fine, return type "info" with a reassuring observation
- Always tell them the most important thing they should be thinking about RIGHT NOW`;

      const { data, error } = await (supabase as any).functions.invoke("production-assistant", {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined,
        body: {
          system: "You are a production intelligence system. Return only valid JSON.",
          messages: [{ role: "user", content: prompt }],
        },
      });

      if (!error && data?.content?.[0]?.text) {
        const text = data.content[0].text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(text);
        setGuidance(parsed);
        setGenerated(true);
      }
    } catch (e) {
      // Silently fail — guidance is additive, not critical
    }
    setLoading(false);
  }

  function dismiss() {
    const key = `guidance_dismissed_${orderId}_${orderStatus}`;
    localStorage.setItem(key, "1");
    setDismissed(true);
  }

  if (dismissed || (!loading && !guidance)) return null;

  const colors = {
    warning: "bg-amber-500/8 border-amber-400/30",
    action: "bg-primary/5 border-primary/25",
    info: "bg-card border-border",
  };

  const dotColors = {
    warning: "bg-amber-500",
    action: "bg-primary",
    info: "bg-muted-foreground/40",
  };

  const urgencyPulse = guidance?.urgency === "high" ? "animate-pulse" : "";

  return (
    <div className={cn(
      "rounded-xl border px-4 py-3 mb-3 flex items-start gap-3",
      guidance ? colors[guidance.type] : "bg-card border-border"
    )}>
      {loading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground py-0.5">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Reading your order situation...
        </div>
      ) : guidance ? (
        <>
          <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
            <div className={cn("w-2 h-2 rounded-full flex-shrink-0", dotColors[guidance.type], urgencyPulse)} />
            <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground mb-0.5">{guidance.headline}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{guidance.body}</p>
            {guidance.action && (
              <Link
                to={guidance.action.href}
                className="text-xs text-primary font-medium hover:underline mt-1 inline-flex items-center gap-1"
              >
                {guidance.action.label} <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="flex-shrink-0 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </>
      ) : null}
    </div>
  );
}
