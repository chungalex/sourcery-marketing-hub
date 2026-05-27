// ─── Clewa Production Assistant ──────────────────────────────────────────────
// The core AI edge function. Powers:
//   - Production Intelligence workspace (chat)
//   - Proactive guidance alerts
//   - Tech pack analysis
//   - Quote normalisation
//   - Message drafting
//   - Post-order debrief
//   - Daily monitoring alerts
//
// Accepts: { messages, system, context_type, order_id, max_tokens }
// Returns: Anthropic API response

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─── Context builders ─────────────────────────────────────────────────────────

async function buildOrderContext(supabase: any, orderId: string): Promise<string> {
  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      factories(name, country, otif_score),
      brand_profiles(brand_name),
      milestones(*),
      order_skus(*),
      defect_reports(*),
      shipment_tracking(*),
      messages(content, role, created_at)
    `)
    .eq("id", orderId)
    .single();

  if (!order) return "";

  const daysToDelivery = order.delivery_window_end
    ? Math.ceil((new Date(order.delivery_window_end).getTime() - Date.now()) / 86400000)
    : null;

  const milestoneStatus = (order.milestones || [])
    .sort((a: any, b: any) => a.sequence_order - b.sequence_order)
    .map((m: any) => `${m.label}: ${m.status} (${m.percentage}% — $${m.amount})`).join(", ");

  const recentMessages = (order.messages || [])
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map((m: any) => `[${m.role}] ${m.content?.substring(0, 100)}`).join("\n");

  return `
ORDER DETAIL:
  Order: ${order.order_number || orderId}
  Product: ${order.product_name || "Not specified"}
  Factory: ${order.factories?.name || "Unknown"} (${order.factories?.country || "Unknown"})
  Factory OTIF: ${order.factories?.otif_score ? `${order.factories.otif_score}%` : "Not yet scored"}
  Status: ${order.status}
  Quantity: ${order.quantity || "?"} units
  Days to delivery: ${daysToDelivery !== null ? `${daysToDelivery} days` : "Not set"}
  Total value: ${order.currency || "USD"} ${order.total_value || "?"}
  Incoterms: ${order.incoterms || "Not set"}
  AQL standard: ${order.aql_standard || "2.5"}
  Milestones: ${milestoneStatus || "None set"}
  Recent messages: ${recentMessages || "None"}
`;
}

async function buildBrandContext(supabase: any, userId: string): Promise<string> {
  const { data: orders } = await supabase
    .from("orders")
    .select("order_number, product_name, status, delivery_window_end, factories(name), updated_at, quantity")
    .eq("user_id", userId)
    .not("status", "in", '("closed","cancelled")')
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: profile } = await supabase
    .from("brand_profiles")
    .select("brand_name, product_category, stage")
    .eq("user_id", userId)
    .single();

  const { data: closedOrders } = await supabase
    .from("orders")
    .select("order_number, product_name, factories(name)")
    .eq("user_id", userId)
    .eq("status", "closed")
    .limit(5);

  const now = Date.now();
  const orderSummaries = (orders || []).map((o: any) => {
    const days = o.delivery_window_end
      ? Math.ceil((new Date(o.delivery_window_end).getTime() - now) / 86400000)
      : null;
    return `- ${o.order_number}: ${o.product_name || "Product"} | ${o.factories?.name || "Factory"} | ${o.status} | ${o.quantity || "?"} units${days ? ` | ${days} days to delivery` : ""}`;
  }).join("\n");

  return `
BRAND: ${profile?.brand_name || "Brand"}
CATEGORY: ${profile?.product_category || "Apparel/accessories"}
STAGE: ${profile?.stage || "Not set"}
ACTIVE ORDERS (${(orders || []).length}):
${orderSummaries || "No active orders"}
COMPLETED ORDERS: ${(closedOrders || []).length}
`;
}

// ─── System prompts per context type ─────────────────────────────────────────

const SYSTEM_PROMPTS: Record<string, string> = {
  intelligence: `You are the Production Intelligence AI for Clewa — factory relationship infrastructure for physical product brands. You are a senior sourcing director with 15+ years managing overseas production in Vietnam, Bangladesh, and China. You know this brand's specific operation — their orders, factories, history. You speak directly, give specific advice (not generic guidance), use their actual order numbers and factory names. Manufacturing vocabulary: PP sample, TOP, AQL, GSM, OTIF, FOB, incoterms. Never pad with caveats. Be specific.`,

  tech_pack_review: `You are a technical product developer reviewing a tech pack for overseas production. Your job: identify what is missing or ambiguous that will cause a revision round or production error. Be specific about what is missing and what the consequence is if it stays missing. Rate completeness 1-10. List every gap. Prioritise by impact on production. Use: fabric composition + GSM, construction details + stitch counts, colourway references (Pantone or swatch), size grading, trim specs, wash/finishing, packaging.`,

  quote_analysis: `You are a sourcing analyst comparing factory quotes. Your job: normalise the quotes (identify what each includes vs excludes), calculate the real price difference, flag when one factory's terms create hidden costs, and recommend based on price + OTIF history + risk. Be specific about numbers. Never say "it depends" — give a recommendation.`,

  message_draft: `You are drafting a professional factory communication for a brand founder. The tone must be: clear, professional, specific to the situation, firm but relationship-preserving. You understand Vietnamese business communication norms. Include both an English and a Vietnamese version. Be direct. No filler sentences.`,

  order_debrief: `You are writing a post-order debrief for a brand founder. Analyse the completed order: what happened vs what was planned, what caused any delays or quality issues, what this now tells us about this factory, and what to do differently next time. Be specific. Use the real numbers. This becomes the factory's permanent record.`,

  daily_monitor: `You are checking a brand's active orders for risks. For each order, assess: delivery window risk, factory responsiveness, payment gate status, QC readiness, and any spec conflicts. Return structured JSON with: order_id, risk_level (critical/warning/ok), issue, recommended_action. Be brief and specific.`,

  rfq_generate: `You are creating a professional RFQ (Request for Quotation) brief for overseas factories. The brief must include: product description, materials, construction, quantity tiers, quality standard (AQL), packaging, delivery terms, required documentation. Make it specific enough that a factory can quote accurately without follow-up questions.`,
};

// ─── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured in Supabase secrets" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const {
      messages,
      system: customSystem,
      context_type = "intelligence",
      order_id,
      user_id,
      max_tokens = 1200,
    } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Build context
    let contextBlock = "";
    if (order_id) {
      contextBlock = await buildOrderContext(supabase, order_id);
    } else if (user_id) {
      contextBlock = await buildBrandContext(supabase, user_id);
    }

    // Assemble system prompt
    const baseSystem = SYSTEM_PROMPTS[context_type] || SYSTEM_PROMPTS.intelligence;
    const systemPrompt = customSystem
      ? `${baseSystem}\n\n${customSystem}${contextBlock ? `\n\nCURRENT CONTEXT:\n${contextBlock}` : ""}`
      : `${baseSystem}${contextBlock ? `\n\nCURRENT CONTEXT:\n${contextBlock}` : ""}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens,
        system: systemPrompt,
        messages,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || "API error" }), {
        status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
