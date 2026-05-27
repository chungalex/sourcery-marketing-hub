// ─── Clewa Tech Pack Analyzer ─────────────────────────────────────────────────
// Called when a tech pack is uploaded to an order.
// Uses Anthropic's vision API to:
//   1. Extract all specification fields from the PDF/image
//   2. Identify what is missing or ambiguous
//   3. Compare against the order's PO (if exists)
//   4. Return structured data + completeness score

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { order_id, file_url, file_type = "application/pdf" } = await req.json();

    if (!order_id || !file_url) {
      return new Response(JSON.stringify({ error: "order_id and file_url required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get order context for comparison
    const { data: order } = await supabase
      .from("orders")
      .select("*, factories(name)")
      .eq("id", order_id)
      .single();

    // Fetch the file content for vision analysis
    const fileResponse = await fetch(file_url);
    const fileBuffer = await fileResponse.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

    const analysisPrompt = `Analyze this tech pack for an overseas production order.

ORDER CONTEXT:
- Product: ${order?.product_name || "Not specified"}
- Factory: ${order?.factories?.name || "Unknown"}
- Quantity: ${order?.quantity || "?"} units
- AQL: ${order?.aql_standard || "2.5"}

INSTRUCTIONS:
Extract and evaluate every specification field. Return a JSON object with this exact structure:
{
  "completeness_score": <1-10>,
  "extracted_specs": {
    "fabric_composition": "<value or null>",
    "fabric_weight_gsm": "<value or null>",
    "construction_details": "<value or null>",
    "stitch_count": "<value or null>",
    "colourway_references": "<value or null>",
    "size_grading": "<value or null>",
    "trim_specs": "<value or null>",
    "wash_instructions": "<value or null>",
    "packaging_requirements": "<value or null>",
    "label_specs": "<value or null>"
  },
  "missing_fields": [
    {
      "field": "<field name>",
      "consequence": "<what goes wrong if this stays missing>",
      "severity": "critical|warning|minor"
    }
  ],
  "conflicts_with_po": [
    {
      "field": "<field>",
      "tech_pack_value": "<value>",
      "po_value": "<value>",
      "recommendation": "<what to do>"
    }
  ],
  "summary": "<2 sentence honest assessment>"
}

Return ONLY valid JSON, no other text.`;

    const isImage = file_type.startsWith("image/");
    const contentBlock = isImage
      ? { type: "image", source: { type: "base64", media_type: file_type, data: base64 } }
      : { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } };

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "pdfs-2024-09-25",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: "You are a technical production specialist analyzing tech packs for overseas manufacturing. Return only valid JSON as specified.",
        messages: [{
          role: "user",
          content: [
            contentBlock,
            { type: "text", text: analysisPrompt }
          ]
        }],
      }),
    });

    const aiData = await res.json();
    const rawText = aiData.content?.[0]?.text || "{}";

    let analysis;
    try {
      analysis = JSON.parse(rawText.replace(/```json\n?|```/g, "").trim());
    } catch {
      analysis = { error: "Parse failed", raw: rawText };
    }

    // Save analysis to tech_pack_versions
    await supabase
      .from("tech_pack_versions")
      .update({
        ai_analysis: analysis,
        completeness_score: analysis.completeness_score || null,
        analyzed_at: new Date().toISOString(),
      })
      .eq("order_id", order_id)
      .order("created_at", { ascending: false })
      .limit(1);

    // If critical fields are missing, create a notification
    const criticalMissing = (analysis.missing_fields || []).filter((f: any) => f.severity === "critical");
    if (criticalMissing.length > 0) {
      await supabase.from("notifications").insert({
        user_id: order?.user_id,
        order_id: order_id,
        type: "tech_pack_gaps",
        title: `Tech pack: ${criticalMissing.length} critical gap${criticalMissing.length > 1 ? "s" : ""} found`,
        message: `Missing: ${criticalMissing.map((f: any) => f.field).join(", ")}. Fix before issuing PO to avoid revision rounds.`,
        urgency: "critical",
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
