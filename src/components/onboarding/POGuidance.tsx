// ─── Inline PO Wizard Guidance ────────────────────────────────────────────────
// Contextual guidance that appears inside the PO creation wizard.
// Not tooltips. Not help articles. Specific guidance at the exact decision point.
// Dismissable. Remembers dismissal per field after first completed order.

import { useState } from "react";
import { Info, X, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuidanceCardProps {
  id: string; // Unique ID for localStorage persistence
  type?: "info" | "warning" | "tip";
  headline: string;
  body: string;
  detail?: string; // Expandable additional detail
  dismissible?: boolean;
}

export function GuidanceCard({
  id,
  type = "info",
  headline,
  body,
  detail,
  dismissible = true,
}: GuidanceCardProps) {
  const storageKey = `guidance_dismissed_${id}`;
  const [dismissed, setDismissed] = useState(
    dismissible ? !!localStorage.getItem(storageKey) : false
  );
  const [expanded, setExpanded] = useState(false);

  if (dismissed) return null;

  const colors = {
    info: "bg-secondary/60 border-border",
    warning: "bg-amber-500/8 border-amber-400/25",
    tip: "bg-green-500/5 border-green-400/20",
  };

  const iconColors = {
    info: "text-primary",
    warning: "text-amber-600",
    tip: "text-green-600",
  };

  function dismiss() {
    if (dismissible) localStorage.setItem(storageKey, "1");
    setDismissed(true);
  }

  return (
    <div className={cn("rounded-xl border px-3.5 py-3 mb-3", colors[type])}>
      <div className="flex items-start gap-2.5">
        <Info className={cn("h-3.5 w-3.5 flex-shrink-0 mt-0.5", iconColors[type])} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground mb-0.5">{headline}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
          {detail && (
            <>
              <button
                type="button"
                onClick={() => setExpanded(v => !v)}
                className="text-xs text-primary font-medium mt-1 flex items-center gap-1 hover:underline"
              >
                {expanded ? "Less" : "More detail"}
                {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
              {expanded && (
                <p className="text-xs text-muted-foreground leading-relaxed mt-1.5 pt-1.5 border-t border-border/50">
                  {detail}
                </p>
              )}
            </>
          )}
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={dismiss}
            className="flex-shrink-0 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Specific guidance cards for the PO wizard ───────────────────────────────

export function IncotermsGuidance() {
  return (
    <GuidanceCard
      id="incoterms_explainer"
      type="info"
      headline="Which incoterms should I choose?"
      body="For your first Vietnam order, FOB (Free On Board) is standard. Your factory is responsible until goods are loaded on the vessel in Vietnam. You arrange freight from the Vietnamese port to your destination."
      detail="EXW means you collect from the factory — more control, more complexity. CIF means the factory arranges shipping — less visibility, harder to dispute. DDP means the factory handles everything including customs — only use this if your factory is highly experienced with your destination market. For first orders with Vietnam factories: choose FOB."
    />
  );
}

export function AQLGuidance({ orderQty }: { orderQty?: number }) {
  const sampleSize = orderQty ? Math.round(orderQty * 0.13) : null;
  const aql25Allowance = sampleSize ? Math.floor(sampleSize * 0.025) : null;
  const aql40Allowance = sampleSize ? Math.floor(sampleSize * 0.04) : null;

  return (
    <GuidanceCard
      id="aql_explainer"
      type="info"
      headline="What does AQL mean for your order?"
      body={`AQL (Acceptable Quality Level) sets the defect rate that triggers a QC failure. AQL 2.5 means up to 2.5% defects are acceptable. Your final payment is blocked if QC fails this standard.${orderQty && aql25Allowance ? ` For your ${orderQty}-unit order: AQL 2.5 allows up to ${aql25Allowance} defective units. AQL 4.0 allows up to ${aql40Allowance}.` : ""}`}
      detail="AQL 1.0 — premium products, luxury, medical: very strict. AQL 2.5 — recommended standard for fashion and apparel. AQL 4.0 — basics, promotional items: more lenient. Setting AQL 2.5 now means your factory knows the standard before they produce. It gives you a documented, enforceable basis to reject or request rework."
    />
  );
}

export function MilestoneGuidance() {
  return (
    <GuidanceCard
      id="milestone_explainer"
      type="tip"
      headline="How milestone payments protect you"
      body="Each milestone releases only when the condition is met. Nothing moves without your manual confirmation."
      detail="Deposit (30%): Covers the factory's raw material purchase. Standard across Vietnam manufacturing. You release this when the PO is issued. Sample gate (40%): Released only after you formally approve the sample. This is your most important protection — bulk cannot start until you approve. Final (30%): Released only after QC passes your agreed AQL standard. If QC fails, you hold this until the issue is resolved. This structure gives your factory every incentive to deliver correctly — they only get paid when they do."
    />
  );
}

export function TetWarning({ deliveryDate }: { deliveryDate?: Date | null }) {
  if (!deliveryDate) return null;

  // Check if delivery falls near Tet (typically late Jan to mid Feb)
  const month = deliveryDate.getMonth() + 1; // 1-12
  const day = deliveryDate.getDate();
  const isNearTet = (month === 1 && day >= 15) || (month === 2 && day <= 20);
  const isNearGoldenWeek = (month === 4 && day >= 25) || (month === 5 && day <= 5);
  const isNearNationalDay = month === 9 && day >= 1 && day <= 7;

  if (!isNearTet && !isNearGoldenWeek && !isNearNationalDay) return null;

  const holiday = isNearTet
    ? "Tết (Lunar New Year)"
    : isNearGoldenWeek
    ? "Reunification Day / Labour Day Golden Week"
    : "National Day";

  const shutdownDays = isNearTet ? "7-14 days" : "5-7 days";

  return (
    <GuidanceCard
      id={`holiday_warning_${holiday.replace(/\s/g, "_")}`}
      type="warning"
      dismissible={false}
      headline={`⚠ Your delivery window falls near ${holiday}`}
      body={`Vietnamese factories close ${shutdownDays} for ${holiday}. Your actual available production time is shorter than it appears. Consider moving your delivery window 2 weeks later or confirming the production schedule with your factory accounts for the shutdown.`}
    />
  );
}

export function TechPackGuidance({ hasUpload }: { hasUpload: boolean }) {
  if (hasUpload) return null; // Don't show if they've already uploaded

  return (
    <GuidanceCard
      id="tech_pack_importance"
      type="warning"
      headline="A complete tech pack prevents expensive revision rounds"
      body="Factories produce what the tech pack specifies — if information is missing, they guess. One revision round typically costs 2-3 weeks and $500-2,000 in additional sampling."
      detail="Your tech pack should include: fabric composition and weight (GSM), construction details and stitch counts, colourway references with Pantone or approved swatch, size grading and measurements, trim specifications (zippers, buttons, labels), wash/finishing instructions, and packaging requirements. If any of these are missing, add them before issuing the PO."
    />
  );
}

export function FirstMessageGuidance() {
  return (
    <GuidanceCard
      id="first_message_tip"
      type="tip"
      headline="Your first message sets the tone for the relationship"
      body="A professional, specific first message signals to the factory that you know what you're doing. Vague or casual messages get treated accordingly."
    />
  );
}
