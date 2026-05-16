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
      return {
        id: `silent_factory_${orderId}`,
        type: "warning",
        urgency: "high",
        headline: `${factoryName} hasn't responded in ${Math.floor(daysSinceUpdate)} days`,
        body: `Your PO has been waiting for acceptance since ${new Date(order.updated_at).toLocaleDateString()}. Factories sometimes miss emails. A direct follow-up today is the right move — not aggressive, just a confirmation request.`,
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
      return {
        id: `delivery_compression_${orderId}`,
        type: "warning",
        urgency: daysShort > 14 ? "high" : "medium",
        headline: `Delivery window is ${daysShort} days tighter than it should be`,
        body: `At ${status.replace(/_/g, " ")} stage with ${daysToDelivery} days to delivery, you have ${daysShort} fewer days than this stage typically requires. Contact ${factoryName} today to confirm their production timeline.`,
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
      return {
        id: `missing_docs_${orderId}`,
        type: "action",
        urgency: "high",
        headline: `Don't release final payment yet`,
        body: `Before releasing your final payment, make sure you have: ${missingDocs.join(", ")}. Without these documents, you have very limited recourse if goods arrive damaged or short-shipped.`,
        action: { label: "Request documents", href: `?action=message` },
        rule: "payment_gate",
      };
    }
  }

  // ── Rule 4: Spec conflict ─────────────────────────────────────────────────
  // Order quantity is 0 or unit price is 0 but status has moved past draft
  if (!["draft", "closed", "cancelled"].includes(status)) {
    const specs = order.specifications as any;
    if (!order.quantity || order.quantity === 0) {
      return {
        id: `spec_conflict_${orderId}`,
        type: "warning",
        urgency: "medium",
        headline: "Order quantity is not confirmed",
        body: `Your order is at ${status.replace(/_/g, " ")} stage but the quantity hasn't been set. ${factoryName} may be producing to a verbal agreement that isn't documented on this order. Update the order to match what was agreed.`,
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
      // 30% over typical duration
      const daysOver = Math.floor(daysInStatus - typical);
      return {
        id: `overdue_stage_${orderId}`,
        type: "warning",
        urgency: daysOver > 14 ? "high" : "medium",
        headline: `${daysOver} days over typical for this stage`,
        body: `Orders usually move from "${status.replace(/_/g, " ")}" in about ${typical} days. You're ${Math.floor(daysInStatus)} days in. This may be normal for your specific situation — or it may be worth checking in with ${factoryName} to confirm progress.`,
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
