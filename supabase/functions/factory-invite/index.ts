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

    const serviceClient = createClient(supabaseUrl, serviceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const body = await req.json();
    const { action, factory_name, factory_email, country } = body;

    if (action !== "send") {
      return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: corsHeaders });
    }

    if (!factory_name || !factory_email) {
      return new Response(JSON.stringify({ error: "factory_name and factory_email required" }), { status: 400, headers: corsHeaders });
    }

    // Get the brand name
    const brandName = user.user_metadata?.brand_name || user.email?.split("@")[0] || "A brand";

    // Create invite token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // Store invite
    const { error: dbError } = await serviceClient.from("factory_invites").insert({
      token,
      invited_by: user.id,
      factory_name: factory_name.trim(),
      factory_email: factory_email.trim().toLowerCase(),
      country: country || null,
      expires_at: expiresAt,
      status: "pending",
    });

    if (dbError) {
      // Table may not exist — still send the email
      console.warn("Could not store invite token:", dbError.message);
    }

    const inviteUrl = `${siteUrl}/auth?invite=${token}&factory=1&name=${encodeURIComponent(factory_name)}`;

    // Send email if RESEND is configured
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "Sourcery <noreply@sourcery.so>",
          to: factory_email.trim().toLowerCase(),
          subject: `${brandName} uses Sourcery to manage orders — you're invited`,
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: -apple-system, sans-serif; background: #f9f8f6; margin: 0; padding: 40px 20px;">
  <div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; border: 1px solid #e8e5e0;">
    
    <h1 style="font-size: 22px; font-weight: 600; color: #1a1a1a; margin: 0 0 8px;">You're invited to Sourcery</h1>
    <p style="color: #666; font-size: 15px; margin: 0 0 24px; line-height: 1.6;">
      <strong style="color: #1a1a1a;">${brandName}</strong> uses Sourcery to manage their production orders. 
      They've set up an account for you — it's completely free and takes about 5 minutes to set up.
    </p>

    <div style="background: #f5f4f0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <p style="color: #444; font-size: 14px; margin: 0; line-height: 1.7;">
        ✓ See orders and specs from ${brandName} in one place<br>
        ✓ No more miscommunication over email or WhatsApp<br>
        ✓ Messages can be translated — communicate in your language<br>
        ✓ Free for factories, always
      </p>
    </div>

    <a href="${inviteUrl}" style="display: block; background: #8B4513; color: white; text-align: center; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; margin-bottom: 16px;">
      Accept invitation →
    </a>

    <p style="color: #999; font-size: 13px; margin: 0; line-height: 1.6;">
      This invitation expires in 7 days. If you have questions, reply to this email or contact ${brandName} directly.
    </p>
  </div>
  <p style="text-align: center; color: #bbb; font-size: 12px; margin-top: 24px;">
    Sourcery — production management for physical product brands
  </p>
</body>
</html>
          `,
        }),
      });
    }

    return new Response(
      JSON.stringify({ success: true, invite_url: inviteUrl, email_sent: !!resendKey }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    console.error("factory-invite error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
