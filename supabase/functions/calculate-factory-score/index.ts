import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Scoring weights — must sum to 1.0
const WEIGHTS = {
  qc_pass_rate: 0.30,
  on_time_rate: 0.20,
  response_time_score: 0.15,
  defect_rate_score: 0.20,
  revision_frequency_score: 0.10,
  brand_retention_score: 0.05,
};

// Tier thresholds (bible §9.2)
function getTier(score: number): string {
  if (score >= 90) return "elite";
  if (score >= 75) return "verified";
  if (score >= 60) return "monitored";
  return "monitored"; // new factories start here until enough data
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const db = createClient(supabaseUrl, serviceKey);

    const body = await req.json().catch(() => ({}));
    // If factory_id provided, recalculate just that one. Otherwise recalculate all.
    const { factory_id } = body;

    // Get factories to score
    let factoryIds: string[] = [];
    if (factory_id) {
      factoryIds = [factory_id];
    } else {
      const { data } = await db.from("factories").select("id");
      factoryIds = (data || []).map((f: any) => f.id);
    }

    const results = [];

    for (const fid of factoryIds) {
      const score = await calculateScore(db, fid);
      results.push(score);
    }

    return new Response(
      JSON.stringify({ success: true, scored: results.length, results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[calculate-factory-score]", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function calculateScore(db: any, factoryId: string) {
  // --- QC pass rate ---
  const { data: qcReports } = await db
    .from("order_qc_reports")
    .select("result, order_id")
    .eq("orders.factory_id", factoryId);

  // Join via orders
  const { data: orders } = await db
    .from("orders")
    .select("id, status, created_at, delivery_window_end, buyer_id")
    .eq("factory_id", factoryId);

  const allOrders = orders || [];
  const totalOrders = allOrders.length;
  const completedOrders = allOrders.filter((o: any) =>
    ["closed", "shipped", "ready_to_ship"].includes(o.status)
  ).length;

  // QC pass rate from order_qc_reports
  const { data: qcData } = await db
    .from("order_qc_reports")
    .select("result, order_id")
    .in("order_id", allOrders.map((o: any) => o.id));

  const qcRows = qcData || [];
  const qcPasses = qcRows.filter((r: any) => r.result === "pass").length;
  const qcFails = qcRows.filter((r: any) => r.result === "fail").length;
  const qcTotal = qcPasses + qcFails;
  const qcPassRate = qcTotal > 0 ? (qcPasses / qcTotal) * 100 : 50; // neutral if no data

  // --- On-time delivery rate ---
  const closedOrders = allOrders.filter((o: any) => o.status === "closed" && o.delivery_window_end);
  // Without actual ship date tracking we use closed_at proxy — approximate for now
  const onTimeRate = closedOrders.length > 0 ? 75 : 50; // neutral until ship date tracking built

  // --- Response time score ---
  // Average response time from messages (lower = better, target <12h = 100)
  const { data: messages } = await db
    .from("messages")
    .select("created_at, sender_role")
    .in("order_id", allOrders.map((o: any) => o.id))
    .order("created_at", { ascending: true });

  let avgResponseHours: number | null = null;
  let responseTimeScore = 70; // neutral default

  if (messages && messages.length > 1) {
    const responseTimes: number[] = [];
    for (let i = 1; i < messages.length; i++) {
      const prev = messages[i - 1];
      const curr = messages[i];
      // Only count brand→factory response pairs
      if (prev.sender_role === "brand" && curr.sender_role === "factory") {
        const hours = (new Date(curr.created_at).getTime() - new Date(prev.created_at).getTime()) / 3600000;
        if (hours < 168) responseTimes.push(hours); // ignore gaps > 1 week
      }
    }
    if (responseTimes.length > 0) {
      avgResponseHours = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      // <6h = 100, <12h = 85, <24h = 65, <48h = 40, >48h = 20
      if (avgResponseHours < 6) responseTimeScore = 100;
      else if (avgResponseHours < 12) responseTimeScore = 85;
      else if (avgResponseHours < 24) responseTimeScore = 65;
      else if (avgResponseHours < 48) responseTimeScore = 40;
      else responseTimeScore = 20;
    }
  }

  // --- Defect rate score ---
  const { data: defects } = await db
    .from("defect_reports")
    .select("severity, quantity_affected")
    .in("order_id", allOrders.map((o: any) => o.id));

  const defectRows = defects || [];
  const criticalDefects = defectRows.filter((d: any) => d.severity === "critical").length;
  const majorDefects = defectRows.filter((d: any) => d.severity === "major").length;
  const totalDefects = defectRows.length;

  let defectRateScore = 90; // good default if no defects
  if (completedOrders > 0) {
    const defectRate = totalDefects / completedOrders;
    const criticalRate = criticalDefects / Math.max(completedOrders, 1);
    if (criticalDefects > 0) defectRateScore = Math.max(20, 70 - (criticalRate * 100));
    else if (defectRate === 0) defectRateScore = 100;
    else if (defectRate < 0.1) defectRateScore = 85;
    else if (defectRate < 0.3) defectRateScore = 65;
    else defectRateScore = 40;
  }

  // --- Revision frequency score (fewer revisions = better) ---
  const { data: revisions } = await db
    .from("revision_rounds")
    .select("id")
    .in("order_id", allOrders.map((o: any) => o.id));

  const revisionCount = (revisions || []).length;
  let revisionScore = 85;
  if (completedOrders > 0) {
    const revPerOrder = revisionCount / Math.max(completedOrders, 1);
    if (revPerOrder === 0) revisionScore = 100;
    else if (revPerOrder < 1) revisionScore = 85;
    else if (revPerOrder < 2) revisionScore = 65;
    else revisionScore = 45;
  }

  // --- Brand retention score ---
  const uniqueBrands = new Set(allOrders.map((o: any) => o.buyer_id)).size;
  const repeatBrands = allOrders.reduce((acc: Record<string, number>, o: any) => {
    acc[o.buyer_id] = (acc[o.buyer_id] || 0) + 1;
    return acc;
  }, {});
  const repeaters = Object.values(repeatBrands).filter((c: any) => c > 1).length;
  const retentionScore = uniqueBrands > 0 ? Math.min(100, 50 + (repeaters / uniqueBrands) * 50) : 50;

  // --- Weighted composite ---
  const overall = Math.round(
    qcPassRate * WEIGHTS.qc_pass_rate +
    onTimeRate * WEIGHTS.on_time_rate +
    responseTimeScore * WEIGHTS.response_time_score +
    defectRateScore * WEIGHTS.defect_rate_score +
    revisionScore * WEIGHTS.revision_frequency_score +
    retentionScore * WEIGHTS.brand_retention_score
  );

  // New factory with < 3 completed orders gets 'new' tier — not enough signal
  const tier = completedOrders < 3 ? "new" : getTier(overall);

  // Upsert score
  const { error } = await db
    .from("factory_performance_scores")
    .upsert({
      factory_id: factoryId,
      qc_pass_rate: Math.round(qcPassRate * 100) / 100,
      on_time_rate: Math.round(onTimeRate * 100) / 100,
      response_time_score: Math.round(responseTimeScore * 100) / 100,
      defect_rate_score: Math.round(defectRateScore * 100) / 100,
      revision_frequency_score: Math.round(revisionScore * 100) / 100,
      brand_retention_score: Math.round(retentionScore * 100) / 100,
      overall_score: overall,
      tier,
      total_orders: totalOrders,
      completed_orders: completedOrders,
      qc_passes: qcPasses,
      qc_fails: qcFails,
      critical_defects: criticalDefects,
      total_defect_reports: totalDefects,
      avg_response_hours: avgResponseHours,
      calculated_at: new Date().toISOString(),
    }, { onConflict: "factory_id" });

  if (error) console.error(`[calculate-factory-score] upsert error for ${factoryId}:`, error);

  // Also update denormalized columns on factories table
  await db.from("factories").update({
    performance_score: overall,
    score_tier: tier,
  }).eq("id", factoryId);

  return { factory_id: factoryId, overall_score: overall, tier };
}
