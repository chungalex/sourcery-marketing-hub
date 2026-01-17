import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UploadRequest {
  order_id: string;
  file_type: "evidence" | "qc_report" | "tech_pack" | "bom" | "po_document";
  file_name: string;
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
    console.log(`[get-signed-upload-url] User ${actorId} requesting upload URL`);

    // Parse request body
    const body: UploadRequest = await req.json();
    const { order_id, file_type, file_name } = body;

    if (!order_id || !file_type || !file_name) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: order_id, file_type, file_name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate file_type
    const validFileTypes = ["evidence", "qc_report", "tech_pack", "bom", "po_document"];
    if (!validFileTypes.includes(file_type)) {
      return new Response(
        JSON.stringify({ error: `Invalid file_type. Must be one of: ${validFileTypes.join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify user has access to order
    const { data: hasAccess, error: accessError } = await userClient
      .rpc("user_has_order_access", { _order_id: order_id, _user_id: actorId });

    if (accessError) {
      console.error("[get-signed-upload-url] Access check error:", accessError);
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

    // Sanitize filename
    const sanitizedFileName = file_name
      .replace(/[^a-zA-Z0-9._-]/g, "_") // Replace special chars with underscore
      .replace(/_{2,}/g, "_") // Replace multiple underscores with single
      .slice(0, 100); // Limit length

    // Generate unique storage key
    const uuid = crypto.randomUUID();
    const storageKey = `orders/${order_id}/${file_type}/${uuid}_${sanitizedFileName}`;

    console.log(`[get-signed-upload-url] Generating signed URL for: ${storageKey}`);

    // Create signed upload URL
    const { data: signedUrlData, error: signedUrlError } = await serviceClient
      .storage
      .from("order-files")
      .createSignedUploadUrl(storageKey);

    if (signedUrlError) {
      console.error("[get-signed-upload-url] Signed URL error:", signedUrlError);
      return new Response(
        JSON.stringify({ error: "Failed to generate upload URL", details: signedUrlError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        storage_key: storageKey,
        signed_url: signedUrlData.signedUrl,
        token: signedUrlData.token,
        expires_in: 3600, // 1 hour
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[get-signed-upload-url] Unexpected error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal server error", details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
