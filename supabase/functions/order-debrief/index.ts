// ─── Clewa Order Debrief ──────────────────────────────────────────────────────
// Triggered when an order status changes to "closed"
// Reads the full order history and generates an AI debrief:
//   - What was planned vs what happened
//   - Root cause of any delays or quality issues
//   - What this tells us about this factory
//   - What to do differently next time
// Saves to factory_notes table (creates or appends)
// Creates a notification for the brand

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { order_id } = await req.json();
    if (!order_id) {
      return new Response(JSON.stringify({ error: "order_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the full order record
    const { data: order } = await supabase
      .from("orders")
      .select(`
        *,
        factories(id, name, country, otif_score),
        milestones(*),
        defect_reports(*),
        order_skus(*),
        messages(content, role, created_at)
      `)
      .eq("id", order_id)
      .single();

    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Calculate actuals
    const plannedLeadWeeks = order.delivery_window_end && order.created_at
      ? Math.ceil((new Date(order.delivery_window_end).getTime() - new Date(order.created_at).getTime()) / (86400000 * 7))
      : null;
    const actualLeadWeeks = order.updated_at && order.created_at
      ? Math.ceil((new Date(order.updated_at).getTime() - new Date(order.created_at).getTime()) / (86400000 * 7))
      : null;

    const defects = order.defect_reports || [];
    const totalDefects = defects.reduce((sum: number, d: any) => sum + (d.quantity || 0), 0);
    const defectRate = order.quantity ? ((totalDefects / order.quantity) * 100).toFixed(1) : null;

    const messageCount = (order.messages || []).length;
    const factoryMessages = (order.messages || []).filter((m: any) => m.role === "factory").length;

    const prompt = `Generate a post-order debrief for order ${order.order_number}.

ORDER FACTS:
- Product: ${order.product_name || "Not specified"}
- Factory: ${order.factories?.name} (${order.factories?.country})
- Quantity: ${order.quantity} units
- Planned lead time: ${plannedLeadWeeks ? `${plannedLeadWeeks} weeks` : "not tracked"}
- Actual lead time: ${actualLeadWeeks ? `${actualLeadWeeks} weeks` : "not tracked"}
- Total value: ${order.currency || "USD"} ${order.total_value || "?"}
- AQL standard: ${order.aql_standard || "2.5"}
- Defects found: ${totalDefects} (${defectRate ? `${defectRate}%` : "?"} defect rate)
- Messages exchanged: ${messageCount} total, ${factoryMessages} from factory
- Incoterms: ${order.incoterms || "Not set"}
- Final status: ${order.status}

Write a debrief with four sections:
1. WHAT HAPPENED (2-3 sentences: actual vs planned)
2. FACTORY ASSESSMENT (2-3 sentences: what this order tells us about this factory)
3. WHAT TO DO DIFFERENTLY NEXT TIME (3 specific bullet points)
4. NEXT ORDER RECOMMENDATION (1 sentence: when to reorder, what to change)

Be specific. Use the real numbers. This becomes the factory's permanent record.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        system: "You are writing a post-order debrief for a brand founder who sources from overseas factories. Be specific, honest, and practical. Use the real data.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const aiData = await res.json();
    const debrief = aiData.content?.[0]?.text || "Debrief generation failed.";

    // Save to factory_notes
    const noteContent = `## Order ${order.order_number} Debrief — ${new Date().toLocaleDateString()}

**Lead time:** ${actualLeadWeeks ? `${actualLeadWeeks} weeks` : "Not tracked"} (planned: ${plannedLeadWeeks ? `${plannedLeadWeeks} weeks` : "not tracked"})
**Defect rate:** ${defectRate ? `${defectRate}%` : "No defects logged"}
**Quantity:** ${order.quantity} units
**Value:** ${order.currency || "USD"} ${order.total_value || "?"}

${debrief}`;

    // Upsert factory notes
    const { data: existingNote } = await supabase
      .from("factory_notes")
      .select("id, content")
      .eq("factory_id", order.factory_id)
      .eq("user_id", order.user_id)
      .single();

    if (existingNote) {
      await supabase
        .from("factory_notes")
        .update({
          content: existingNote.content + "\n\n---\n\n" + noteContent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingNote.id);
    } else {
      await supabase.from("factory_notes").insert({
        factory_id: order.factory_id,
        user_id: order.user_id,
        content: noteContent,
      });
    }

    // Create notification
    await supabase.from("notifications").insert({
      user_id: order.user_id,
      order_id: order.id,
      type: "order_debrief",
      title: `${order.order_number} closed — debrief ready`,
      message: `Your post-order debrief for ${order.product_name || order.order_number} with ${order.factories?.name} is ready. ${actualLeadWeeks ? `Lead time: ${actualLeadWeeks} weeks.` : ""} ${defectRate ? `Defect rate: ${defectRate}%.` : ""}`,
      urgency: "info",
      read: false,
    });

    return new Response(JSON.stringify({ success: true, debrief }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
