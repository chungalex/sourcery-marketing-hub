// ─── Clewa Message Intelligence ──────────────────────────────────────────────
// Called when a new message arrives from a factory.
// Scans the message for:
//   1. Implied spec changes ("we'll use a similar fabric")
//   2. Schedule slippage signals ("running a bit behind")
//   3. Quality concerns
//   4. Pricing disputes
//   5. Requests that should become formal change orders
//
// If any detected: creates an alert notification with one-click change order option

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { message_id, order_id, message_content, user_id } = await req.json();

    if (!message_content || !order_id) {
      return new Response(JSON.stringify({ error: "message_content and order_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: order } = await supabase
      .from("orders")
      .select("order_number, product_name, status, factories(name)")
      .eq("id", order_id)
      .single();

    const prompt = `Analyze this factory message for signals that require the brand's attention.

ORDER: ${order?.order_number} — ${order?.product_name || "Product"} with ${order?.factories?.name}
STATUS: ${order?.status}
MESSAGE: "${message_content}"

Return JSON:
{
  "requires_attention": true/false,
  "signals": [
    {
      "type": "spec_change|schedule_slip|quality_concern|price_dispute|approval_needed|other",
      "detected_text": "<exact phrase that triggered this>",
      "severity": "critical|warning|info",
      "explanation": "<why this matters>",
      "recommended_action": "<specific thing to do>",
      "should_create_change_order": true/false
    }
  ],
  "summary": "<one sentence if requires_attention, else null>"
}

Only flag genuine signals. "We're working hard on it" is not a signal. "We'll use a similar weight fabric" IS a signal.
Return only valid JSON.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: "You analyze factory messages for production risks. Return only valid JSON.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const aiData = await res.json();
    const rawText = aiData.content?.[0]?.text || "{}";

    let analysis;
    try {
      analysis = JSON.parse(rawText.replace(/```json\n?|```/g, "").trim());
    } catch {
      return new Response(JSON.stringify({ requires_attention: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Create notification if attention needed
    if (analysis.requires_attention && analysis.signals?.length > 0) {
      const critical = analysis.signals.filter((s: any) => s.severity === "critical");
      const urgency = critical.length > 0 ? "critical" : "warning";
      const topSignal = analysis.signals[0];

      await supabase.from("notifications").insert({
        user_id,
        order_id,
        type: `message_${topSignal.type}`,
        title: `${order?.order_number}: ${topSignal.type.replace(/_/g, " ")} detected`,
        message: analysis.summary || topSignal.explanation,
        urgency,
        metadata: { signals: analysis.signals, message_id },
        read: false,
      });
    }

    return new Response(JSON.stringify({ success: true, analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
