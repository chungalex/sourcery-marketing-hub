import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NOTIFICATION_TEMPLATES: Record<string, { title: string; body: (ctx: Record<string, string>) => string }> = {
  po_accepted:            { title: "PO accepted",               body: c => `${c.factory_name} accepted your PO for order ${c.order_number}.` },
  sample_submitted:       { title: "Sample ready for review",   body: c => `${c.factory_name} submitted a sample (round ${c.round}) on order ${c.order_number}.` },
  sample_approved:        { title: "Sample approved",           body: c => `Sample approved on order ${c.order_number}. Production can begin.` },
  sample_revision:        { title: "Revision requested",        body: c => `You requested a revision on order ${c.order_number}. Factory has been notified.` },
  revision_acknowledged:  { title: "Revision acknowledged",     body: c => `${c.factory_name} acknowledged the revision on order ${c.order_number}.` },
  qc_uploaded:            { title: "QC report uploaded",        body: c => `QC report uploaded on order ${c.order_number}. Result: ${c.result}.` },
  payment_released:       { title: "Payment released",          body: c => `Milestone "${c.milestone}" released on order ${c.order_number}.` },
  factory_no_response:    { title: "Factory hasn't responded",  body: c => `${c.factory_name} hasn't responded on order ${c.order_number} in 24h.` },
  order_shipped:          { title: "Order shipped",             body: c => `Order ${c.order_number} has been marked as shipped by ${c.factory_name}.` },
  dispute_resolved:       { title: "Dispute resolved",          body: c => `The dispute on order ${c.order_number} has been resolved.` },
  tech_pack_acknowledged: { title: "Tech pack confirmed",       body: c => `${c.factory_name} confirmed they're on tech pack v${c.version} for order ${c.order_number}.` },
  new_inquiry:            { title: "New inquiry",               body: c => `${c.brand_name} sent an inquiry about ${c.product_type || "your factory"}.` },
  po_issued:              { title: "New PO to review",          body: c => `${c.brand_name} issued a PO on order ${c.order_number}. Review and accept or decline.` },
  brand_approved_sample:  { title: "Sample approved",           body: c => `${c.brand_name} approved your sample on order ${c.order_number}. Ready for bulk production.` },
  brand_revision_request: { title: "Revision requested",        body: c => `${c.brand_name} requested changes on order ${c.order_number}.` },
  milestone_released:     { title: "Payment released",          body: c => `Milestone "${c.milestone}" released on order ${c.order_number}.` },
  defect_filed:           { title: "Defect report filed",       body: c => `${c.brand_name} filed a ${c.severity} defect report on order ${c.order_number}. Response required.` },
  tech_pack_uploaded:     { title: "New tech pack version",     body: c => `${c.brand_name} uploaded tech pack v${c.version} for order ${c.order_number}. Please confirm.` },
  dispute_filed:          { title: "Dispute opened",            body: c => `${c.brand_name} opened a dispute on order ${c.order_number}.` },
  approval_requested:     { title: "Approval needed",           body: c => `${c.factory_name} is requesting your approval: ${c.subject} on order ${c.order_number}.` },
  admin_dispute:          { title: "Dispute requires review",   body: c => `Dispute filed on order ${c.order_number} between ${c.brand_name} and ${c.factory_name}.` },
};

// Zalo OA notification helper
async function sendZaloNotification(phone: string, message: string, zaloOAToken: string) {
  try {
    // Zalo OA API v2.0 — send text message to user by phone
    // NOTE: Requires Zalo OA account + user to have interacted with OA first
    const res = await fetch("https://openapi.zalo.me/v2.0/oa/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": zaloOAToken,
      },
      body: JSON.stringify({
        recipient: { user_id: phone }, // Zalo maps phone to user_id in OA API
        message: {
          text: message,
        },
      }),
    });
    const data = await res.json();
    return data.error === 0;
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { type, user_id, order_id, context = {} } = body;

    if (!type || !user_id) {
      return new Response(JSON.stringify({ error: "Missing type or user_id" }), { status: 400, headers: corsHeaders });
    }

    const template = NOTIFICATION_TEMPLATES[type];
    if (!template) {
      return new Response(JSON.stringify({ error: `Unknown notification type: ${type}` }), { status: 400, headers: corsHeaders });
    }

    const userIds = Array.isArray(user_id) ? user_id : [user_id];
    const rows = userIds.map(uid => ({
      user_id: uid,
      order_id: order_id || null,
      type,
      title: template.title,
      body: template.body(context),
    }));

    const { data, error } = await serviceClient.from("notifications").insert(rows).select();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    const zaloOAToken = Deno.env.get("ZALO_OA_TOKEN");
    const siteUrl = Deno.env.get("SITE_URL") || "https://sourcery.so";

    if (data) {
      await Promise.allSettled(data.map(async (notif: { user_id: string; title: string; body: string }) => {
        const { data: userData } = await serviceClient.auth.admin.getUserById(notif.user_id);
        const email = userData?.user?.email;
        const phone = userData?.user?.user_metadata?.phone || userData?.user?.phone;
        const country = userData?.user?.user_metadata?.country;

        // Email via Resend
        if (resendKey && email) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "Sourcery <notifications@sourcery.so>",
              to: [email],
              subject: notif.title,
              html: `
                <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#111">
                  <p style="font-size:13px;font-weight:600;color:#666;text-transform:uppercase;letter-spacing:.06em;margin:0 0 24px">Sourcery</p>
                  <h2 style="font-size:18px;font-weight:600;margin:0 0 12px;color:#111">${notif.title}</h2>
                  <p style="font-size:15px;line-height:1.6;color:#444;margin:0 0 24px">${notif.body}</p>
                  ${order_id ? `<a href="${siteUrl}/orders/${order_id}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:500">View order →</a>` : ""}
                  <p style="font-size:12px;color:#999;margin-top:40px;border-top:1px solid #eee;padding-top:16px">
                    You're receiving this because you have an active order on Sourcery.
                  </p>
                </div>
              `,
            }),
          });
        }

        // Zalo for Vietnam factories (country === "VN" or phone present)
        // Only send if OA token is configured and it's a factory user in Vietnam
        if (zaloOAToken && phone && (country === "VN" || country === "Vietnam")) {
          const zaloMsg = `[Sourcery] ${notif.title}\n${notif.body}${order_id ? `\n\nXem đơn hàng: ${siteUrl}/orders/${order_id}` : ""}`;
          await sendZaloNotification(phone, zaloMsg, zaloOAToken);
        }
      }));
    }

    return new Response(JSON.stringify({ success: true, count: data?.length }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
