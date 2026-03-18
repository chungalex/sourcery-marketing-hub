import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Notification type definitions — every trigger from bible §15
const NOTIFICATION_TEMPLATES: Record<string, { title: string; body: (ctx: Record<string, string>) => string }> = {
  // Brand notifications (§15.1)
  po_accepted:          { title: "PO accepted",           body: c => `${c.factory_name} accepted your PO for order ${c.order_number}.` },
  sample_submitted:     { title: "Sample ready for review", body: c => `${c.factory_name} submitted a sample (round ${c.round}) on order ${c.order_number}.` },
  sample_approved:      { title: "Sample approved",       body: c => `Sample approved on order ${c.order_number}. Production can begin.` },
  sample_revision:      { title: "Revision requested",    body: c => `You requested a revision on order ${c.order_number}. Factory has been notified.` },
  revision_acknowledged: { title: "Revision acknowledged", body: c => `${c.factory_name} acknowledged the revision on order ${c.order_number}.` },
  revision_disputed:    { title: "Revision disputed",     body: c => `${c.factory_name} disputed revision round ${c.round} on order ${c.order_number}. Admin has been notified.` },
  qc_uploaded:          { title: "QC report uploaded",    body: c => `QC report uploaded on order ${c.order_number}. Result: ${c.result}.` },
  payment_released:     { title: "Payment released",      body: c => `Milestone "${c.milestone}" released on order ${c.order_number}.` },
  factory_no_response:  { title: "Factory hasn't responded", body: c => `${c.factory_name} hasn't responded to your message on order ${c.order_number} in 24h.` },
  order_shipped:        { title: "Order shipped",         body: c => `Order ${c.order_number} has been marked as shipped by ${c.factory_name}.` },
  dispute_resolved:     { title: "Dispute resolved",      body: c => `The dispute on order ${c.order_number} has been resolved.` },
  defect_response:      { title: "Defect report response", body: c => `${c.factory_name} responded to your defect report on order ${c.order_number}.` },
  tech_pack_acknowledged: { title: "Tech pack confirmed", body: c => `${c.factory_name} confirmed they're on tech pack v${c.version} for order ${c.order_number}.` },

  // Factory notifications (§15.2)
  new_inquiry:          { title: "New inquiry",           body: c => `${c.brand_name} sent an inquiry about ${c.product_type || "your factory"}.` },
  po_issued:            { title: "New PO to review",      body: c => `${c.brand_name} issued a PO on order ${c.order_number}. Review and accept or decline.` },
  brand_approved_sample: { title: "Sample approved",      body: c => `${c.brand_name} approved your sample on order ${c.order_number}. Ready for bulk production.` },
  brand_revision_request: { title: "Revision requested",  body: c => `${c.brand_name} requested changes on order ${c.order_number}. Acknowledge before production continues.` },
  milestone_released:   { title: "Payment released",      body: c => `Milestone "${c.milestone}" has been released on order ${c.order_number}.` },
  qc_scheduled_factory: { title: "QC scheduled",          body: c => `QC inspection scheduled for order ${c.order_number} on ${c.date}.` },
  defect_filed:         { title: "Defect report filed",   body: c => `${c.brand_name} filed a ${c.severity} defect report on order ${c.order_number}. Response required.` },
  tech_pack_uploaded:   { title: "New tech pack version", body: c => `${c.brand_name} uploaded tech pack v${c.version} for order ${c.order_number}. Please confirm you've seen it.` },
  dispute_filed:        { title: "Dispute opened",        body: c => `${c.brand_name} opened a dispute on order ${c.order_number}. Admin review in progress.` },

  // Admin notifications (§15.3)
  admin_dispute:        { title: "Dispute requires review", body: c => `Dispute filed on order ${c.order_number} between ${c.brand_name} and ${c.factory_name}.` },
  admin_score_drop:     { title: "Factory score dropped",   body: c => `${c.factory_name} score dropped below ${c.threshold}.` },
  admin_revision_dispute: { title: "Revision disputed",     body: c => `${c.factory_name} disputed a revision on order ${c.order_number}. Mediation required.` },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { type, user_id, order_id, context = {} } = body;

    if (!type || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing type or user_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const template = NOTIFICATION_TEMPLATES[type];
    if (!template) {
      return new Response(
        JSON.stringify({ error: `Unknown notification type: ${type}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Support notifying multiple users at once
    const userIds = Array.isArray(user_id) ? user_id : [user_id];

    const rows = userIds.map(uid => ({
      user_id: uid,
      order_id: order_id || null,
      type,
      title: template.title,
      body: template.body(context),
    }));

    const { data, error } = await serviceClient
      .from("notifications")
      .insert(rows)
      .select();

    if (error) {
      console.error("[send-notification] DB error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Future: trigger email via Resend/SendGrid here
    // For now: in-app only via realtime subscription on notifications table

    return new Response(
      JSON.stringify({ success: true, notifications: data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[send-notification] Error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
