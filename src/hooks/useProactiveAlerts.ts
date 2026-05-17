import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ProactiveAlert {
  id: string;
  type: "warning" | "action" | "info";
  urgency: "high" | "medium" | "low";
  headline: string;
  body: string;
  action?: { label: string; href: string };
  rule: string;
}

interface OrderData {
  id: string;
  status: string;
  delivery_window_end?: string | null;
  created_at: string;
  updated_at: string;
  specifications?: any;
  quantity?: number;
  factories?: { name: string } | null;
}

// ── The five rule engine ──────────────────────────────────────────────────────

function checkRules(order: OrderData): ProactiveAlert | null {
  const now = Date.now();
  const status = order.status;
  const orderId = order.id;
  const factoryName = order.factories?.name || "your factory";

  // Dismiss key — don't show same alert twice for same status
  const dismissKey = `alert_dismissed_${orderId}_${status}`;
  if (typeof window !== "undefined" && localStorage.getItem(dismissKey)) {
    return null;
  }

  // ── Rule 1: Silent factory ────────────────────────────────────────────────
  // PO issued but no factory response after 3 days
  if (status === "po_issued") {
    const updatedAt = new Date(order.updated_at).getTime();
    const daysSinceUpdate = (now - updatedAt) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate >= 3) {
      const days = Math.floor(daysSinceUpdate);
      return {
        id: `silent_factory_${orderId}`,
        type: "warning",
        urgency: "high",
        headline: `${factoryName} hasn't confirmed the PO — follow up today`,
        body: `Factories miss emails more than they ignore them. One direct message asking for PO confirmation usually gets a same-day response. If there's still nothing after 24 hours, that's a different problem — and you want to know now, not at the end of the week.`,
        action: { label: "Draft follow-up message", href: `?action=message` },
        rule: "silent_factory",
      };
    }
  }

  // ── Rule 2: Delivery window compression ──────────────────────────────────
  // Days remaining vs current production stage
  if (order.delivery_window_end && !["draft", "closed", "cancelled"].includes(status)) {
    const daysToDelivery = Math.ceil(
      (new Date(order.delivery_window_end).getTime() - now) / (1000 * 60 * 60 * 24)
    );

    // Stage-based minimum days needed
    const minDaysNeeded: Record<string, number> = {
      po_issued: 70,
      po_accepted: 65,
      sampling: 55,
      sample_approved: 45,
      in_production: 25,
      qc_pending: 18,
      qc_approved: 12,
      ready_to_ship: 8,
    };

    const needed = minDaysNeeded[status] || 0;
    if (needed > 0 && daysToDelivery < needed && daysToDelivery > 0) {
      const daysShort = needed - daysToDelivery;
      const stageLabel = status.replace(/_/g, " ");
      return {
        id: `delivery_compression_${orderId}`,
        type: "warning",
        urgency: daysShort > 14 ? "high" : "medium",
        headline: `Timeline is ${daysShort} days tighter than this stage needs`,
        body: `You're at ${stageLabel} with ${daysToDelivery} days to delivery. This stage typically needs ${needed} days from here. That gap doesn't fix itself — it becomes either a conversation now, or air freight later. Ask ${factoryName} for their current completion percentage and whether the original ship date is still on.`,
        action: { label: "Message factory now", href: `?action=message` },
        rule: "delivery_compression",
      };
    }
  }

  // ── Rule 3: Payment gate — documents missing ──────────────────────────────
  // QC approved but trying to release payment without documents
  if (status === "qc_approved") {
    const specs = order.specifications as any;
    const missingDocs = [];
    if (!specs?.qc_report_uploaded) missingDocs.push("QC report");
    if (!specs?.packing_list_uploaded) missingDocs.push("packing list");
    if (!specs?.commercial_invoice_uploaded) missingDocs.push("commercial invoice");

    if (missingDocs.length > 0) {
      const docList = missingDocs.join(", ");
      return {
        id: `missing_docs_${orderId}`,
        type: "action",
        urgency: "high",
        headline: `Hold final payment — ${missingDocs.length === 1 ? "one document" : `${missingDocs.length} documents`} still missing`,
        body: `You're still missing: ${docList}. Once the goods ship, these are your only leverage on a short-shipment or damage claim. The factory needs your final payment — use that to get them first. Release when everything is uploaded here.`,
        action: { label: "Request documents from factory", href: `?action=message` },
        rule: "payment_gate",
      };
    }
  }

  // ── Rule 4: Spec conflict ─────────────────────────────────────────────────
  // Order quantity is 0 or not set but status has moved past draft
  if (!["draft", "closed", "cancelled"].includes(status)) {
    if (!order.quantity || order.quantity === 0) {
      const stageLabel = status.replace(/_/g, " ");
      return {
        id: `spec_conflict_${orderId}`,
        type: "warning",
        urgency: "medium",
        headline: "Quantity not confirmed — production is on a verbal agreement",
        body: `Your order is at ${stageLabel} stage but no quantity is locked into this record. If something goes wrong, "we agreed on 500 units" becomes a dispute with no paper trail. Update this to match what was actually agreed before the bulk cut.`,
        rule: "spec_conflict",
      };
    }
  }

  // ── Rule 5: Overdue stage ─────────────────────────────────────────────────
  // Order has been in the same status longer than typical
  const typicalDays: Record<string, number> = {
    po_issued: 4,       // factory should accept within 4 days
    sampling: 21,       // samples typically take 3 weeks
    in_production: 70,  // bulk production typically under 10 weeks
    qc_pending: 7,      // QC should happen within a week
  };

  if (typicalDays[status]) {
    const updatedAt = new Date(order.updated_at).getTime();
    const daysInStatus = (now - updatedAt) / (1000 * 60 * 60 * 24);
    const typical = typicalDays[status];

    if (daysInStatus > typical * 1.3) {
      const daysOver = Math.floor(daysInStatus - typical);
      const daysTotal = Math.floor(daysInStatus);

      // Stage-specific body copy — each stage has a different implication
      const stageBodyMap: Record<string, string> = {
        po_issued: `Most factories confirm or push back within 4 days. You're at ${daysTotal} days. This is either a communication miss or a capacity problem — one direct message to ${factoryName} will tell you which.`,
        sampling: `Three weeks is standard for sampling. You're at ${daysTotal} days. Ask ${factoryName} for the current sample status and expected submission date — sampling delays compress the production window directly, and the sooner you know, the better your options.`,
        in_production: `Bulk production typically runs 8–10 weeks. You're ${daysTotal} days in (${Math.round(daysTotal / 7)} weeks). Ask ${factoryName} for their current cut/sew percentage and whether the original ship date is still achievable. If the answer is vague, push for a concrete number.`,
        qc_pending: `QC inspections typically complete within a week. Yours has been pending ${daysTotal} days — the inspection either hasn't been scheduled, the factory isn't ready, or there's a result they haven't shared. Ask ${factoryName} directly: when is the inspection, and what is the current status?`,
      };

      const body = stageBodyMap[status] || `${daysTotal} days in ${status.replace(/_/g, " ")} — ${daysOver} days longer than typical. Check in with ${factoryName} to confirm where things stand.`;

      return {
        id: `overdue_stage_${orderId}`,
        type: "warning",
        urgency: daysOver > 14 ? "high" : "medium",
        headline: `${daysOver} days over typical for this stage`,
        body,
        action: { label: "Check in with factory", href: `?action=message` },
        rule: "overdue_stage",
      };
    }
  }

  return null;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useProactiveAlerts(order: OrderData | null) {
  const [alert, setAlert] = useState<ProactiveAlert | null>(null);

  useEffect(() => {
    if (!order) return;
    const result = checkRules(order);
    setAlert(result);
  }, [order?.id, order?.status, order?.updated_at]);

  function dismiss() {
    if (!order || !alert) return;
    const dismissKey = `alert_dismissed_${order.id}_${order.status}`;
    localStorage.setItem(dismissKey, "1");
    setAlert(null);
  }

  return { alert, dismiss };
}
