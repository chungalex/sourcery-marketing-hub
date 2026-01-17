import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type OrderAction =
  | "create_order"
  | "issue_po"
  | "accept_po"
  | "start_production"
  | "schedule_qc"
  | "upload_qc"
  | "set_qc_result"
  | "mark_ready_to_ship"
  | "mark_shipped"
  | "close_order"
  | "open_dispute"
  | "resolve_dispute"
  | "assign_qc_partner"
  | "add_evidence";

interface ActionRequest {
  action: OrderAction;
  order_id?: string;
  // create_order fields
  factory_id?: string;
  quantity?: number;
  unit_price?: number;
  currency?: string;
  specifications?: Record<string, unknown>;
  tech_pack_url?: string;
  bom_url?: string;
  incoterms?: string;
  delivery_window_start?: string;
  delivery_window_end?: string;
  milestones?: Array<{
    label: string;
    percentage: number;
    amount: number;
    release_condition?: string;
  }>;
  // upload_qc fields
  qc_report?: {
    result: "pass" | "conditional" | "fail";
    defect_percentage?: number;
    notes?: string;
    report_storage_key?: string;
  };
  // set_qc_result fields
  qc_result?: "qc_pass" | "qc_fail";
  // dispute fields
  dispute_reason?: string;
  dispute_resolution?: string;
  resolve_to_status?: "in_production" | "closed";
  // assign_qc_partner fields
  qc_partner_id?: string;
  // add_evidence fields
  evidence?: {
    file_name: string;
    file_type: string;
    storage_key: string;
    file_size_bytes?: number;
  };
  // general
  reason?: string;
  metadata?: Record<string, unknown>;
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

    // User client for RLS-respecting operations
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Service client for admin operations
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
    console.log(`[order-action] User ${actorId} making request`);

    // Parse request body
    const body: ActionRequest = await req.json();
    const { action, order_id } = body;

    console.log(`[order-action] Action: ${action}, Order ID: ${order_id || "N/A"}`);

    if (!action) {
      return new Response(
        JSON.stringify({ error: "Missing action parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let orderId = order_id;
    let result: Record<string, unknown> = {};

    // Execute action
    switch (action) {
      case "create_order": {
        if (!body.factory_id || !body.quantity || !body.unit_price) {
          return new Response(
            JSON.stringify({ error: "Missing required fields: factory_id, quantity, unit_price" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const totalAmount = body.quantity * body.unit_price;

        // Insert order
        const { data: newOrder, error: orderError } = await userClient
          .from("orders")
          .insert({
            buyer_id: actorId,
            factory_id: body.factory_id,
            quantity: body.quantity,
            unit_price: body.unit_price,
            total_amount: totalAmount,
            currency: body.currency || "USD",
            specifications: body.specifications || {},
            tech_pack_url: body.tech_pack_url,
            bom_url: body.bom_url,
            incoterms: body.incoterms,
            delivery_window_start: body.delivery_window_start,
            delivery_window_end: body.delivery_window_end,
            status: "draft",
          })
          .select()
          .single();

        if (orderError) {
          console.error("[order-action] Create order error:", orderError);
          return new Response(
            JSON.stringify({ error: "Failed to create order", details: orderError.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        orderId = newOrder.id;

        // Create default milestones if not provided
        const milestones = body.milestones || [
          { label: "Deposit", percentage: 30, amount: totalAmount * 0.3, release_condition: "PO acceptance" },
          { label: "Final Payment", percentage: 70, amount: totalAmount * 0.7, release_condition: "QC pass" },
        ];

        const milestonesData = milestones.map((m, idx) => ({
          order_id: orderId,
          label: m.label,
          percentage: m.percentage,
          amount: m.amount,
          release_condition: m.release_condition,
          sequence_order: idx + 1,
          status: "pending" as const,
        }));

        const { error: milestoneError } = await userClient
          .from("order_milestones")
          .insert(milestonesData);

        if (milestoneError) {
          console.error("[order-action] Create milestones error:", milestoneError);
        }

        result = { message: "Order created successfully" };
        break;
      }

      case "issue_po": {
        if (!orderId) {
          return new Response(
            JSON.stringify({ error: "Missing order_id" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: transitionResult, error: transitionError } = await userClient
          .rpc("transition_order_status", {
            p_order_id: orderId,
            p_new_status: "po_issued",
            p_actor_id: actorId,
            p_reason: body.reason,
            p_metadata: body.metadata || {},
          });

        if (transitionError || !transitionResult?.success) {
          console.error("[order-action] Issue PO error:", transitionError || transitionResult);
          return new Response(
            JSON.stringify({ error: transitionResult?.error || transitionError?.message || "Failed to issue PO" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = transitionResult;
        break;
      }

      case "accept_po": {
        if (!orderId) {
          return new Response(
            JSON.stringify({ error: "Missing order_id" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Transition status
        const { data: transitionResult, error: transitionError } = await userClient
          .rpc("transition_order_status", {
            p_order_id: orderId,
            p_new_status: "po_accepted",
            p_actor_id: actorId,
            p_reason: body.reason,
            p_metadata: body.metadata || {},
          });

        if (transitionError || !transitionResult?.success) {
          console.error("[order-action] Accept PO error:", transitionError || transitionResult);
          return new Response(
            JSON.stringify({ error: transitionResult?.error || transitionError?.message || "Failed to accept PO" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Update PO acceptance fields
        const { error: updateError } = await userClient
          .from("orders")
          .update({
            po_accepted_at: new Date().toISOString(),
            po_accepted_by: actorId,
          })
          .eq("id", orderId);

        if (updateError) {
          console.error("[order-action] Update PO acceptance fields error:", updateError);
        }

        result = transitionResult;
        break;
      }

      case "start_production": {
        if (!orderId) {
          return new Response(
            JSON.stringify({ error: "Missing order_id" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: transitionResult, error: transitionError } = await userClient
          .rpc("transition_order_status", {
            p_order_id: orderId,
            p_new_status: "in_production",
            p_actor_id: actorId,
            p_reason: body.reason,
            p_metadata: body.metadata || {},
          });

        if (transitionError || !transitionResult?.success) {
          return new Response(
            JSON.stringify({ error: transitionResult?.error || transitionError?.message || "Failed to start production" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = transitionResult;
        break;
      }

      case "schedule_qc": {
        if (!orderId) {
          return new Response(
            JSON.stringify({ error: "Missing order_id" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: transitionResult, error: transitionError } = await userClient
          .rpc("transition_order_status", {
            p_order_id: orderId,
            p_new_status: "qc_scheduled",
            p_actor_id: actorId,
            p_reason: body.reason,
            p_metadata: body.metadata || {},
          });

        if (transitionError || !transitionResult?.success) {
          return new Response(
            JSON.stringify({ error: transitionResult?.error || transitionError?.message || "Failed to schedule QC" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = transitionResult;
        break;
      }

      case "upload_qc": {
        if (!orderId || !body.qc_report) {
          return new Response(
            JSON.stringify({ error: "Missing order_id or qc_report" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Get the QC partner assignment for this order
        const { data: assignment } = await userClient
          .from("order_qc_assignments")
          .select("qc_partner_id")
          .eq("order_id", orderId)
          .single();

        // Insert QC report
        const { error: reportError } = await userClient
          .from("order_qc_reports")
          .insert({
            order_id: orderId,
            qc_partner_id: assignment?.qc_partner_id,
            result: body.qc_report.result,
            defect_percentage: body.qc_report.defect_percentage,
            notes: body.qc_report.notes,
            report_storage_key: body.qc_report.report_storage_key,
            uploaded_by: actorId,
          });

        if (reportError) {
          console.error("[order-action] Upload QC report error:", reportError);
          return new Response(
            JSON.stringify({ error: "Failed to upload QC report", details: reportError.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Transition to qc_uploaded
        const { data: transitionResult, error: transitionError } = await userClient
          .rpc("transition_order_status", {
            p_order_id: orderId,
            p_new_status: "qc_uploaded",
            p_actor_id: actorId,
            p_reason: body.reason,
            p_metadata: { qc_result: body.qc_report.result, ...body.metadata },
          });

        if (transitionError || !transitionResult?.success) {
          return new Response(
            JSON.stringify({ error: transitionResult?.error || transitionError?.message || "Failed to upload QC" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = transitionResult;
        break;
      }

      case "set_qc_result": {
        if (!orderId || !body.qc_result) {
          return new Response(
            JSON.stringify({ error: "Missing order_id or qc_result" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Check if user is admin (only admin can set QC result)
        const { data: isAdmin } = await userClient
          .rpc("has_role", { _user_id: actorId, _role: "admin" });

        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Only admins can set QC result" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: transitionResult, error: transitionError } = await serviceClient
          .rpc("transition_order_status", {
            p_order_id: orderId,
            p_new_status: body.qc_result,
            p_actor_id: actorId,
            p_reason: body.reason,
            p_metadata: body.metadata || {},
          });

        if (transitionError || !transitionResult?.success) {
          return new Response(
            JSON.stringify({ error: transitionResult?.error || transitionError?.message || "Failed to set QC result" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = transitionResult;
        break;
      }

      case "mark_ready_to_ship": {
        if (!orderId) {
          return new Response(
            JSON.stringify({ error: "Missing order_id" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: transitionResult, error: transitionError } = await userClient
          .rpc("transition_order_status", {
            p_order_id: orderId,
            p_new_status: "ready_to_ship",
            p_actor_id: actorId,
            p_reason: body.reason,
            p_metadata: body.metadata || {},
          });

        if (transitionError || !transitionResult?.success) {
          return new Response(
            JSON.stringify({ error: transitionResult?.error || transitionError?.message || "Failed to mark ready to ship" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = transitionResult;
        break;
      }

      case "mark_shipped": {
        if (!orderId) {
          return new Response(
            JSON.stringify({ error: "Missing order_id" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: transitionResult, error: transitionError } = await userClient
          .rpc("transition_order_status", {
            p_order_id: orderId,
            p_new_status: "shipped",
            p_actor_id: actorId,
            p_reason: body.reason,
            p_metadata: body.metadata || {},
          });

        if (transitionError || !transitionResult?.success) {
          return new Response(
            JSON.stringify({ error: transitionResult?.error || transitionError?.message || "Failed to mark shipped" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = transitionResult;
        break;
      }

      case "close_order": {
        if (!orderId) {
          return new Response(
            JSON.stringify({ error: "Missing order_id" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: transitionResult, error: transitionError } = await userClient
          .rpc("transition_order_status", {
            p_order_id: orderId,
            p_new_status: "closed",
            p_actor_id: actorId,
            p_reason: body.reason,
            p_metadata: body.metadata || {},
          });

        if (transitionError || !transitionResult?.success) {
          return new Response(
            JSON.stringify({ error: transitionResult?.error || transitionError?.message || "Failed to close order" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = transitionResult;
        break;
      }

      case "open_dispute": {
        if (!orderId || !body.dispute_reason) {
          return new Response(
            JSON.stringify({ error: "Missing order_id or dispute_reason" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Insert dispute record
        const { error: disputeError } = await userClient
          .from("order_disputes")
          .insert({
            order_id: orderId,
            initiated_by: actorId,
            reason: body.dispute_reason,
            status: "open",
          });

        if (disputeError) {
          console.error("[order-action] Create dispute error:", disputeError);
          return new Response(
            JSON.stringify({ error: "Failed to create dispute", details: disputeError.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Transition to disputed
        const { data: transitionResult, error: transitionError } = await userClient
          .rpc("transition_order_status", {
            p_order_id: orderId,
            p_new_status: "disputed",
            p_actor_id: actorId,
            p_reason: body.dispute_reason,
            p_metadata: body.metadata || {},
          });

        if (transitionError || !transitionResult?.success) {
          return new Response(
            JSON.stringify({ error: transitionResult?.error || transitionError?.message || "Failed to open dispute" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = transitionResult;
        break;
      }

      case "resolve_dispute": {
        if (!orderId || !body.resolve_to_status || !body.dispute_resolution) {
          return new Response(
            JSON.stringify({ error: "Missing order_id, resolve_to_status, or dispute_resolution" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Check if user is admin
        const { data: isAdmin } = await userClient
          .rpc("has_role", { _user_id: actorId, _role: "admin" });

        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Only admins can resolve disputes" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Update dispute record
        const { error: disputeUpdateError } = await serviceClient
          .from("order_disputes")
          .update({
            status: "resolved",
            resolution: body.dispute_resolution,
            resolved_at: new Date().toISOString(),
            resolved_by: actorId,
          })
          .eq("order_id", orderId)
          .eq("status", "open");

        if (disputeUpdateError) {
          console.error("[order-action] Update dispute error:", disputeUpdateError);
        }

        // Transition order status
        const { data: transitionResult, error: transitionError } = await serviceClient
          .rpc("transition_order_status", {
            p_order_id: orderId,
            p_new_status: body.resolve_to_status,
            p_actor_id: actorId,
            p_reason: body.dispute_resolution,
            p_metadata: body.metadata || {},
          });

        if (transitionError || !transitionResult?.success) {
          return new Response(
            JSON.stringify({ error: transitionResult?.error || transitionError?.message || "Failed to resolve dispute" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = transitionResult;
        break;
      }

      case "assign_qc_partner": {
        if (!orderId || !body.qc_partner_id) {
          return new Response(
            JSON.stringify({ error: "Missing order_id or qc_partner_id" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Check if user is admin
        const { data: isAdmin } = await userClient
          .rpc("has_role", { _user_id: actorId, _role: "admin" });

        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Only admins can assign QC partners" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Insert QC assignment
        const { error: assignmentError } = await serviceClient
          .from("order_qc_assignments")
          .upsert({
            order_id: orderId,
            qc_partner_id: body.qc_partner_id,
          });

        if (assignmentError) {
          console.error("[order-action] Assign QC partner error:", assignmentError);
          return new Response(
            JSON.stringify({ error: "Failed to assign QC partner", details: assignmentError.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = { message: "QC partner assigned successfully" };
        break;
      }

      case "add_evidence": {
        if (!orderId || !body.evidence) {
          return new Response(
            JSON.stringify({ error: "Missing order_id or evidence" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Verify user has access to order
        const { data: hasAccess } = await userClient
          .rpc("user_has_order_access", { _order_id: orderId, _user_id: actorId });

        if (!hasAccess) {
          return new Response(
            JSON.stringify({ error: "You do not have access to this order" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Insert evidence
        const { error: evidenceError } = await userClient
          .from("order_evidence")
          .insert({
            order_id: orderId,
            file_name: body.evidence.file_name,
            file_type: body.evidence.file_type,
            storage_key: body.evidence.storage_key,
            file_size_bytes: body.evidence.file_size_bytes,
            uploaded_by: actorId,
          });

        if (evidenceError) {
          console.error("[order-action] Add evidence error:", evidenceError);
          return new Response(
            JSON.stringify({ error: "Failed to add evidence", details: evidenceError.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = { message: "Evidence added successfully" };
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // Fetch complete order data to return
    if (orderId) {
      const [orderRes, milestonesRes, paymentsRes, qcReportsRes, evidenceRes, historyRes] = await Promise.all([
        userClient.from("orders").select("*").eq("id", orderId).single(),
        userClient.from("order_milestones").select("*").eq("order_id", orderId).order("sequence_order"),
        userClient.from("payments").select("*").eq("order_id", orderId).order("created_at", { ascending: false }),
        userClient.from("order_qc_reports").select("*").eq("order_id", orderId).order("uploaded_at", { ascending: false }),
        userClient.from("order_evidence").select("*").eq("order_id", orderId).order("created_at", { ascending: false }),
        userClient.from("order_state_history").select("*").eq("order_id", orderId).order("created_at", { ascending: false }).limit(10),
      ]);

      return new Response(
        JSON.stringify({
          success: true,
          ...result,
          order: orderRes.data,
          milestones: milestonesRes.data || [],
          payments: paymentsRes.data || [],
          qc_reports: qcReportsRes.data || [],
          evidence: evidenceRes.data || [],
          state_history: historyRes.data || [],
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, ...result }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[order-action] Unexpected error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal server error", details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
