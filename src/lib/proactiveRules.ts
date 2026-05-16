// ─── Proactive AI Rule Engine ─────────────────────────────────────────────────
// Five specific rules that watch order data and fire when conditions are met.
// Each rule returns null (no alert) or a RuleResult (fire alert).
// The AI generates contextual language from the rule context.
// Rules are checked in priority order. Only the highest-priority fires per load.

export interface OrderContext {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deliveryWindowEnd?: string | null;
  factoryName?: string;
  factoryId?: string;
  poIssuedAt?: string | null;
  sampleApprovedAt?: string | null;
  qcResult?: string | null;
  qcReportUploaded?: boolean;
  packingListUploaded?: boolean;
  cartonPhotosUploaded?: boolean;
  lastFactoryMessage?: string | null;
  lastFactoryMessageAt?: string | null;
  techPackGSM?: string | null;
  techPackFabric?: string | null;
  poFabric?: string | null;
  poGSM?: string | null;
  aqlStandard?: string | null;
  statusUpdatedAt?: string | null;
}

export interface RuleResult {
  ruleId: string;
  urgency: "high" | "medium" | "low";
  type: "warning" | "action" | "info";
  promptContext: string; // What to tell the AI to generate guidance about
  suggestedAction?: string; // Pre-populate message drafter with this situation
  suggestedHref?: string;
}

// ── Utility ───────────────────────────────────────────────────────────────────

function daysSince(dateStr: string | null | undefined): number {
  if (!dateStr) return 0;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function daysUntil(dateStr: string | null | undefined): number {
  if (!dateStr) return 999;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

// ── Rule 1: Silent factory ────────────────────────────────────────────────────
// PO issued but factory has not responded in 3+ days
function ruleSilentFactory(ctx: OrderContext): RuleResult | null {
  if (ctx.status !== "po_issued") return null;
  const daysSincePO = daysSince(ctx.poIssuedAt || ctx.updatedAt);
  if (daysSincePO < 3) return null;

  return {
    ruleId: "silent_factory",
    urgency: daysSincePO >= 5 ? "high" : "medium",
    type: "warning",
    promptContext: `The PO was issued ${daysSincePO} days ago to ${ctx.factoryName || "the factory"} but they have not accepted or responded. This may indicate the message was missed, the factory is at capacity, or there is a communication issue. The brand needs specific guidance on what to do right now — a follow-up message and what to do if there is still no response after 24 hours.`,
    suggestedAction: "status_update",
    suggestedHref: undefined,
  };
}

// ── Rule 2: Delivery window compression ──────────────────────────────────────
// Days remaining vs production stage mismatch
function ruleDeliveryCompression(ctx: OrderContext): RuleResult | null {
  const activeStatuses = ["po_accepted", "sampling", "sample_approved", "in_production", "qc_pending"];
  if (!activeStatuses.includes(ctx.status)) return null;

  const daysRemaining = daysUntil(ctx.deliveryWindowEnd);
  if (daysRemaining > 30) return null; // Not urgent yet

  // Minimum days needed from current status to delivery
  const minimumDaysNeeded: Record<string, number> = {
    po_accepted: 35,     // Still need sampling (10) + production (14) + QC (5) + shipping (10)
    sampling: 28,        // Still need production (14) + QC (5) + shipping (10) + buffer
    sample_approved: 25, // Production (14) + QC (5) + shipping (10)
    in_production: 18,   // QC (5) + shipping (10) + buffer
    qc_pending: 12,      // QC (2-5) + shipping (10) - very tight
  };

  const needed = minimumDaysNeeded[ctx.status] || 14;
  if (daysRemaining > needed) return null;

  const isAtRisk = daysRemaining <= needed;
  const isCritical = daysRemaining <= needed - 7;

  return {
    ruleId: "delivery_compression",
    urgency: isCritical ? "high" : "medium",
    type: "warning",
    promptContext: `The order has ${daysRemaining} days until the delivery window ends. The current status is ${ctx.status}. To complete the remaining production stages and shipping from ${ctx.factoryName || "the factory"}, approximately ${needed} days are needed. The delivery window is ${isAtRisk ? "at risk" : "tight"}. The brand needs specific guidance: what needs to happen in the next 24-48 hours to protect the delivery window, and what to communicate to the factory today.`,
    suggestedAction: "cargo_cutoff",
    suggestedHref: undefined,
  };
}

// ── Rule 3: Payment gate checklist ───────────────────────────────────────────
// Documents missing before payment should be released
function rulePaymentGate(ctx: OrderContext): RuleResult | null {
  if (ctx.status !== "qc_approved" && ctx.status !== "ready_to_ship") return null;

  const missing: string[] = [];
  if (!ctx.qcReportUploaded) missing.push("QC report");
  if (!ctx.packingListUploaded) missing.push("packing list");
  if (!ctx.cartonPhotosUploaded) missing.push("carton photos");

  if (missing.length === 0) return null;

  return {
    ruleId: "payment_gate",
    urgency: "high",
    type: "action",
    promptContext: `The order is at ${ctx.status} status and final payment may be requested soon. The following documents are missing before final payment should be released: ${missing.join(", ")}. This is important — without these documents, the brand has limited recourse if goods arrive damaged, short-shipped, or incorrect. The brand needs specific guidance on why each document matters and how to request them from the factory today.`,
    suggestedAction: "status_update",
    suggestedHref: undefined,
  };
}

// ── Rule 4: Spec conflict detection ──────────────────────────────────────────
// PO fabric/GSM conflicts with tech pack notes
function ruleSpecConflict(ctx: OrderContext): RuleResult | null {
  const relevantStatuses = ["po_accepted", "sampling", "sample_approved"];
  if (!relevantStatuses.includes(ctx.status)) return null;

  // Check for fabric conflict
  if (ctx.poFabric && ctx.techPackFabric) {
    const poFabricNorm = ctx.poFabric.toLowerCase().trim();
    const tpFabricNorm = ctx.techPackFabric.toLowerCase().trim();
    if (poFabricNorm !== tpFabricNorm && !poFabricNorm.includes(tpFabricNorm) && !tpFabricNorm.includes(poFabricNorm)) {
      return {
        ruleId: "spec_conflict_fabric",
        urgency: "high",
        type: "warning",
        promptContext: `There is a conflict between the PO specification and the tech pack. The PO specifies "${ctx.poFabric}" but the tech pack references "${ctx.techPackFabric}". This conflict needs to be resolved before bulk production starts. If the factory produces to the wrong specification, a full revision round will be required — typically costing 2-3 weeks and $500-2000 in additional sample costs. The brand needs specific guidance on how to resolve this conflict with the factory today.`,
        suggestedAction: "spec_change",
        suggestedHref: undefined,
      };
    }
  }

  // Check for GSM conflict
  if (ctx.poGSM && ctx.techPackGSM) {
    if (ctx.poGSM.trim() !== ctx.techPackGSM.trim()) {
      return {
        ruleId: "spec_conflict_gsm",
        urgency: "high",
        type: "warning",
        promptContext: `There is a GSM specification conflict. The PO specifies ${ctx.poGSM}g/m² but the tech pack references ${ctx.techPackGSM}g/m². GSM affects the weight, drape, and durability of the finished garment. The wrong GSM specification reaching the factory will result in a bulk fabric order to the wrong weight. The brand needs to confirm which specification is correct and update both documents before bulk cutting starts.`,
        suggestedAction: "spec_change",
        suggestedHref: undefined,
      };
    }
  }

  return null;
}

// ── Rule 5: Overdue stage ─────────────────────────────────────────────────────
// Order has been in current status longer than typical
function ruleOverdueStage(ctx: OrderContext): RuleResult | null {
  if (!ctx.statusUpdatedAt) return null;

  // Typical maximum days per status before it becomes worth flagging
  const typicalMaxDays: Record<string, number> = {
    po_issued: 5,        // Factory should accept within 2-3 days
    sampling: 21,        // Sampling should not take more than 3 weeks
    in_production: 70,   // Most orders should not be in production over 10 weeks
    qc_pending: 10,      // QC should not take more than 10 days
  };

  const max = typicalMaxDays[ctx.status];
  if (!max) return null;

  const daysInStatus = daysSince(ctx.statusUpdatedAt);
  if (daysInStatus < max) return null;

  return {
    ruleId: "overdue_stage",
    urgency: daysInStatus > max * 1.5 ? "high" : "medium",
    type: "warning",
    promptContext: `The order has been in ${ctx.status} status for ${daysInStatus} days. Typically, this stage should be complete within ${max} days. The order is ${daysInStatus - max} days overdue on this stage with ${ctx.factoryName || "the factory"}. This may indicate a production issue, communication gap, or capacity problem. The brand needs specific guidance on what to ask the factory, what the delay means for their delivery window, and when to escalate.`,
    suggestedAction: "delay",
    suggestedHref: undefined,
  };
}

// ── Main rule checker ─────────────────────────────────────────────────────────
// Runs all rules in priority order, returns the highest-priority result

export function checkProactiveRules(ctx: OrderContext): RuleResult | null {
  const rules = [
    rulePaymentGate,       // Highest priority — money at risk
    ruleSpecConflict,      // High priority — expensive to fix late
    ruleDeliveryCompression, // High priority — season at risk
    ruleSilentFactory,     // Medium-high — relationship signal
    ruleOverdueStage,      // Medium — timeline signal
  ];

  for (const rule of rules) {
    const result = rule(ctx);
    if (result) return result;
  }

  return null;
}
