import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DownloadRequest {
  order_id: string;
  storage_key: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT and get user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // User client for auth and RPC calls
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Service client for storage operations (bypasses RLS)
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get current user
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authorization token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const actorId = user.id;
    console.log(`[get-signed-download-url] User ${actorId} requesting download URL`);

    // Parse request body
    const body: DownloadRequest = await req.json();
    const { order_id, storage_key } = body;

    if (!order_id || !storage_key) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: order_id, storage_key" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify user has access to order
    const { data: hasAccess, error: accessError } = await userClient
      .rpc("user_has_order_access", { _order_id: order_id, _user_id: actorId });

    if (accessError) {
      console.error("[get-signed-download-url] Access check error:", accessError);
      return new Response(
        JSON.stringify({ error: "Failed to verify order access" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!hasAccess) {
      return new Response(
        JSON.stringify({ error: "You do not have access to this order" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify storage_key belongs to this order (security check)
    const expectedPrefix = `orders/${order_id}/`;
    if (!storage_key.startsWith(expectedPrefix)) {
      console.error(`[get-signed-download-url] Invalid storage key: ${storage_key} doesn't match order ${order_id}`);
      return new Response(
        JSON.stringify({ error: "Storage key does not belong to this order" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[get-signed-download-url] Generating signed URL for: ${storage_key}`);

    // Create signed download URL (1 hour expiry)
    const { data: signedUrlData, error: signedUrlError } = await serviceClient
      .storage
      .from("order-files")
      .createSignedUrl(storage_key, 3600); // 1 hour

    if (signedUrlError) {
      console.error("[get-signed-download-url] Signed URL error:", signedUrlError);
      return new Response(
        JSON.stringify({ error: "Failed to generate download URL", details: signedUrlError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        signed_url: signedUrlData.signedUrl,
        expires_in: 3600, // 1 hour
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[get-signed-download-url] Unexpected error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal server error", details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
