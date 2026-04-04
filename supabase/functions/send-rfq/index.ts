import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const siteUrl = Deno.env.get("SITE_URL") || "https://sourcery.so";

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const serviceClient = createClient(supabaseUrl, serviceKey);

    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const body = await req.json();
    const { rfq_id } = body;
    if (!rfq_id) return new Response(JSON.stringify({ error: "rfq_id required" }), { status: 400, headers: corsHeaders });

    // Get RFQ details
    const { data: rfq } = await serviceClient.from("rfqs").select("*").eq("id", rfq_id).single();
    if (!rfq) return new Response(JSON.stringify({ error: "RFQ not found" }), { status: 404, headers: corsHeaders });

    // Get recipients
    const { data: recipients } = await serviceClient.from("rfq_recipients").select("*").eq("rfq_id", rfq_id);
    if (!recipients?.length) return new Response(JSON.stringify({ error: "No recipients" }), { status: 400, headers: corsHeaders });

    const brandName = user.user_metadata?.brand_name || user.email?.split("@")[0] || "A brand";

    let emailsSent = 0;

    for (const recipient of recipients) {
      const responseUrl = `${siteUrl}/rfq/respond?token=${recipient.token}`;
      
      if (resendKey) {
        const emailHtml = `
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,sans-serif;background:#f9f8f6;padding:40px 20px">
  <div style="max-width:560px;margin:0 auto;background:white;border-radius:12px;padding:40px;border:1px solid #e8e5e0">
    <h1 style="font-size:22px;font-weight:600;color:#1a1a1a;margin:0 0 8px">Request for quotation from ${brandName}</h1>
    <p style="color:#666;font-size:15px;margin:0 0 24px;line-height:1.6">
      ${brandName} is looking for a factory to produce the following and would like your quote.
    </p>
    <div style="background:#f5f4f0;border-radius:8px;padding:20px;margin-bottom:24px">
      <p style="font-size:16px;font-weight:600;color:#1a1a1a;margin:0 0 12px">${rfq.title}</p>
      ${rfq.product_category ? `<p style="color:#666;font-size:14px;margin:0 0 8px;text-transform:capitalize">Category: ${rfq.product_category.replace(/_/g,' ')}</p>` : ''}
      ${rfq.quantity_min ? `<p style="color:#666;font-size:14px;margin:0 0 8px">Quantity: ${rfq.quantity_min}${rfq.quantity_max ? `–${rfq.quantity_max}` : '+'} units</p>` : ''}
      ${rfq.target_delivery_weeks ? `<p style="color:#666;font-size:14px;margin:0 0 8px">Target delivery: ${rfq.target_delivery_weeks} weeks</p>` : ''}
      ${rfq.target_price_min ? `<p style="color:#666;font-size:14px;margin:0 0 8px">Target price: ${rfq.currency || 'USD'} ${rfq.target_price_min}${rfq.target_price_max ? `–${rfq.target_price_max}` : '+'}/unit</p>` : ''}
      ${rfq.product_description ? `<p style="color:#444;font-size:14px;margin:12px 0 0;line-height:1.6">${rfq.product_description}</p>` : ''}
      ${rfq.tech_pack_url ? `<p style="margin:12px 0 0"><a href="${rfq.tech_pack_url}" style="color:#8B4513;font-size:14px">View tech pack →</a></p>` : ''}
    </div>
    <a href="${responseUrl}" style="display:block;background:#8B4513;color:white;text-align:center;padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;margin-bottom:16px">
      Submit your quote →
    </a>
    <p style="color:#999;font-size:13px;margin:0;line-height:1.6">
      No account required to respond. If you'd like to manage orders with ${brandName} on Sourcery, you can create a free factory account at any time.
    </p>
  </div>
  <p style="text-align:center;color:#bbb;font-size:12px;margin-top:24px">
    Sourcery — production management for physical product brands
  </p>
</body>
</html>`;

        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${resendKey}` },
          body: JSON.stringify({
            from: "Sourcery <noreply@sourcery.so>",
            to: recipient.factory_email,
            subject: `RFQ from ${brandName}: ${rfq.title}`,
            html: emailHtml,
          }),
        });
        if (emailRes.ok) emailsSent++;
      }

      // Update recipient status to sent
      await serviceClient.from("rfq_recipients").update({ status: "pending" }).eq("id", recipient.id);
    }

    // Update RFQ status
    await serviceClient.from("rfqs").update({ status: "sent" }).eq("id", rfq_id);

    return new Response(JSON.stringify({ success: true, emails_sent: emailsSent, total: recipients.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
