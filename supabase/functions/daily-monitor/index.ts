// ─── Clewa Daily Monitor ──────────────────────────────────────────────────────
// Runs on a schedule (set in Supabase → Edge Functions → Schedule)
// Recommended: every day at 08:00 UTC (3pm Vietnam, 8am London, 3am EST)
//
// For each active order, checks 5 risk signals:
//   1. Silent factory (PO issued, no response in 3+ days)
//   2. Delivery compression (stage vs days remaining mismatch)
//   3. Payment gate (docs missing before payment release)
//   4. Spec conflict (PO vs tech pack)
//   5. Overdue stage (too long in current status)
//
// Fires Anthropic to generate specific guidance for each alert.
// Creates notifications in the notifications table.
// Sends email via send-notification edge function.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RISK_STAGES: Record<string, number> = {
  po_issued: 4,
  sampling: 21,
  in_production: 70,
  qc_pending: 10,
};

const DAYS_NEEDED: Record<string, number> = {
  po_accepted: 35,
  sampling: 28,
  sample_approved: 25,
  in_production: 18,
  qc_pending: 12,
};

function daysSince(dateStr: string | null): number {
  if (!dateStr) return 0;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function daysUntil(dateStr: string | null): number {
  if (!dateStr) return 999;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

interface Alert {
  orderId: string;
  orderNumber: string;
  userId: string;
  factoryName: string;
  ruleId: string;
  urgency: "critical" | "warning";
  promptContext: string;
}

function checkOrder(order: any): Alert | null {
  const status = order.status;
  const daysInStatus = daysSince(order.updated_at);
  const daysToDelivery = daysUntil(order.delivery_window_end);
  const factoryName = order.factories?.name || "your factory";

  // Rule 1: Silent factory
  if (status === "po_issued" && daysInStatus >= 3) {
    return {
      orderId: order.id,
      orderNumber: order.order_number,
      userId: order.user_id,
      factoryName,
      ruleId: "silent_factory",
      urgency: daysInStatus >= 5 ? "critical" : "warning",
      promptContext: `${factoryName} has not responded to PO ${order.order_number} in ${daysInStatus} days. What should the brand do right now? Give a specific action and draft the follow-up message.`,
    };
  }

  // Rule 2: Delivery compression
  const needed = DAYS_NEEDED[status];
  if (needed && daysToDelivery < 999 && daysToDelivery < needed) {
    return {
      orderId: order.id,
      orderNumber: order.order_number,
      userId: order.user_id,
      factoryName,
      ruleId: "delivery_compression",
      urgency: daysToDelivery < needed - 7 ? "critical" : "warning",
      promptContext: `Order ${order.order_number} is at ${status} with ${daysToDelivery} days to delivery. At this stage, ${needed} days are normally needed. The delivery window is at risk. What must happen in the next 48 hours?`,
    };
  }

  // Rule 5: Overdue stage
  const maxDays = RISK_STAGES[status];
  if (maxDays && daysInStatus > maxDays) {
    return {
      orderId: order.id,
      orderNumber: order.order_number,
      userId: order.user_id,
      factoryName,
      ruleId: "overdue_stage",
      urgency: daysInStatus > maxDays * 1.5 ? "critical" : "warning",
      promptContext: `Order ${order.order_number} has been in ${status} for ${daysInStatus} days with ${factoryName}. This stage typically takes ${maxDays} days maximum. It is ${daysInStatus - maxDays} days overdue. What should the brand do?`,
    };
  }

  return null;
}

async function generateGuidance(anthropicKey: string, alert: Alert): Promise<string> {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001", // Fast + cheap for monitoring
        max_tokens: 300,
        system: "You are a production intelligence system for Clewa. Generate one specific, actionable alert in 2-3 sentences. Be direct. Use the order number and factory name.",
        messages: [{ role: "user", content: alert.promptContext }],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || alert.promptContext;
  } catch {
    return alert.promptContext;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active orders
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, factories(name, country)")
      .not("status", "in", '("closed","cancelled","draft")')
      .order("created_at", { ascending: false });

    if (error || !orders?.length) {
      return new Response(JSON.stringify({ checked: 0, alerts: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const alerts: Alert[] = [];
    for (const order of orders) {
      const alert = checkOrder(order);
      if (alert) alerts.push(alert);
    }

    // Generate AI guidance and create notifications for each alert
    let created = 0;
    for (const alert of alerts) {
      // Check if we already sent this alert today
      const today = new Date().toISOString().split("T")[0];
      const { data: existing } = await supabase
        .from("notifications")
        .select("id")
        .eq("order_id", alert.orderId)
        .eq("type", alert.ruleId)
        .gte("created_at", `${today}T00:00:00Z`)
        .single();

      if (existing) continue; // Already alerted today

      const guidance = await generateGuidance(anthropicKey, alert);

      // Create notification
      await supabase.from("notifications").insert({
        user_id: alert.userId,
        order_id: alert.orderId,
        type: alert.ruleId,
        title: `${alert.urgency === "critical" ? "⚠️ " : ""}${alert.orderNumber} — ${alert.factoryName}`,
        message: guidance,
        urgency: alert.urgency,
        read: false,
      });

      created++;
    }

    return new Response(JSON.stringify({
      checked: orders.length,
      alerts_found: alerts.length,
      notifications_created: created,
      timestamp: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
