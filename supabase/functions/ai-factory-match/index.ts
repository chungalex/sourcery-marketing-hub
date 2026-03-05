import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query } = await req.json();

    if (!query?.trim()) {
      return new Response(JSON.stringify({ error: "Missing query" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY")!;

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all factories from DB
    const { data: factories, error: factoriesError } = await serviceClient
      .from("factories")
      .select("id, name, slug, description, categories, country, city, moq_min, moq_max, lead_time_weeks, certifications, is_verified, factory_type")
      .order("created_at", { ascending: false });

    if (factoriesError || !factories?.length) {
      return new Response(JSON.stringify({ error: "No factories found", matches: [] }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build factory context for Claude
    const factoryContext = factories.map((f, i) =>
      `[${i}] ID:${f.id} | Name:${f.name} | Slug:${f.slug} | Country:${f.country}${f.city ? `, ${f.city}` : ""} | Categories:${(f.categories || []).join(", ") || "General"} | MOQ:${f.moq_min ?? "?"}-${f.moq_max ?? "?"} units | Lead time:${f.lead_time_weeks ?? "?"} weeks | Certifications:${(f.certifications || []).join(", ") || "None"} | Verified:${f.is_verified ? "Yes" : "No"} | Type:${f.factory_type || "general"} | Description:${(f.description || "").slice(0, 150)}`
    ).join("\n");

    // Ask Claude to match
    const prompt = `You are a manufacturing sourcing expert. A brand is looking for a factory with this requirement:

"${query}"

Here are the available factories:
${factoryContext}

Return a JSON array of the top 3 best matches. For each match return:
- index: the factory's array index number (integer)
- matchScore: percentage 0-100 (integer)  
- reasons: array of 3 specific reasons why this factory matches (reference actual factory attributes)
- highlights: array of 2-3 short badge labels like "Vietnam-Based", "Low MOQ", "GOTS Certified"

Respond ONLY with a valid JSON array, no markdown, no explanation. Example:
[{"index":0,"matchScore":94,"reasons":["...","...","..."],"highlights":["...","..."]}]`;

    const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!aiResponse.ok) {
      const err = await aiResponse.text();
      console.error("Claude API error:", err);
      return new Response(JSON.stringify({ error: "AI matching failed", matches: [] }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const rawText = aiData.content?.[0]?.text || "[]";

    let matchIndices: { index: number; matchScore: number; reasons: string[]; highlights: string[] }[] = [];
    try {
      matchIndices = JSON.parse(rawText);
    } catch {
      console.error("Failed to parse AI response:", rawText);
      return new Response(JSON.stringify({ error: "Failed to parse AI response", matches: [] }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build full match objects
    const matches = matchIndices
      .filter(m => m.index >= 0 && m.index < factories.length)
      .map(m => ({
        ...factories[m.index],
        matchScore: m.matchScore,
        reasons: m.reasons,
        highlights: m.highlights,
        location: `${factories[m.index].city ? factories[m.index].city + ", " : ""}${factories[m.index].country}`,
        moq: factories[m.index].moq_min ? `${factories[m.index].moq_min} units` : "Contact for MOQ",
        leadTime: factories[m.index].lead_time_weeks ? `${factories[m.index].lead_time_weeks} weeks` : "Contact for lead time",
      }));

    return new Response(JSON.stringify({ matches }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[ai-factory-match] Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error", matches: [] }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
