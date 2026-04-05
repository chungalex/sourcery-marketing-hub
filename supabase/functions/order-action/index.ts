import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type OrderAction =
  | "create_order"
  | "issue_po"
  | "accept_po"
  | "submit_sample"
  | "approve_sample"
  | "request_sample_revision"
  | "acknowledge_revision"
  | "submit_revision_round"
  | "acknowledge_revision_round"
  | "dispute_revision_round"
  | "resolve_revision_round"
  | "upload_tech_pack_version"
  | "acknowledge_tech_pack_version"
  | "file_defect_report"
  | "respond_to_defect"
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
  | "add_evidence"
  | "cancel_order";

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
  resolve_to_status?: "ready_to_ship" | "shipped" | "closed";
  // cancel_order fields
  cancellation_reason?: string;
  // assign_qc_partner fields
  qc_partner_id?: string;
  // add_evidence fields
  evidence?: {
    file_name: string;
    file_type: string;
    storage_key: string;
    file_size_bytes?: number;
  };
  // sampling fields
  sample?: {
    notes?: string;
    measurements?: Record<string, unknown>;
    photo_urls?: string[];
  };
  revision_notes?: string;
  sample_submission_id?: string;
  // revision round fields
  revision_round_id?: string;
  revision_description?: string;
  impact_timeline?: string;
  impact_cost?: string;
  // dispute_reason already declared above
  resolution?: string;
  // tech pack fields
  tech_pack?: {
    file_url: string;
    file_name: string;
    notes?: string;
  };
  tech_pack_version_id?: string;
  // defect report fields
  defect?: {
    defect_type: string;
    severity: string;
    quantity_affected: number;
    percentage_affected?: number;
    description: string;
    photo_urls?: string[];
  };
  defect_report_id?: string;
  factory_response?: string;
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

    // Helper: fire-and-forget notification (never blocks the action)
    const notify = async (type: string, userIds: string | string[], ctx: Record<string, string> = {}, notifyOrderId?: string) => {
      try {
        // Call send-notification which handles both DB write and email delivery
        await serviceClient.functions.invoke("send-notification", {
          body: {
            type,
            user_id: Array.isArray(userIds) ? userIds : [userIds],
            order_id: notifyOrderId || orderId || null,
            context: ctx,
          },
        });
      } catch (e) {
        console.error("[order-action] notify failed silently:", e);
      }
    };

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

        // Notify factory of new PO to review
        try {
          const { data: issuedOrder } = await serviceClient
            .from("orders")
            .select("order_number, factories(id, name), profiles:buyer_id(full_name)")
            .eq("id", orderId)
            .single();
          
          if (issuedOrder?.factories) {
            // Get factory members to notify
            const { data: factoryMembers } = await serviceClient
              .from("factory_members")
              .select("user_id")
              .eq("factory_id", (issuedOrder.factories as any).id);
            
            const factoryUserIds = (factoryMembers || []).map((m: any) => m.user_id);
            if (factoryUserIds.length > 0) {
              await notify("po_issued", factoryUserIds, {
                order_number: issuedOrder.order_number,
                brand_name: (issuedOrder.profiles as any)?.full_name || "The brand",
              });
            }
          }
        } catch (e) {
          console.error("[order-action] po_issued notify failed:", e);
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

        // Notify brand
        const { data: poOrder } = await serviceClient.from("orders").select("buyer_id, order_number, factories(name)").eq("id", orderId).single();
        if (poOrder?.buyer_id) {
          await notify("po_accepted", poOrder.buyer_id, {
            order_number: poOrder.order_number,
            factory_name: (poOrder.factories as any)?.name || "Your factory",
          });
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

        // Pre-check: Verify QC partner is assigned (UX improvement - DB also enforces this)
        const { data: qcAssignment } = await userClient
          .from("order_qc_assignments")
          .select("qc_partner_id")
          .eq("order_id", orderId)
          .maybeSingle();

        if (!qcAssignment) {
          console.log(`[order-action] schedule_qc blocked: no QC partner assigned for order ${orderId}`);
          return new Response(
            JSON.stringify({ error: "Cannot schedule QC: no QC partner assigned. Please assign a QC partner first." }),
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

        // QC partner or admin can set QC result (database RPC enforces this too)
        const { data: transitionResult, error: transitionError } = await userClient
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

        // DISPUTE FINALITY GUARD: Check if any dispute (open or resolved) already exists
        const { data: existingDisputes, error: disputeCheckError } = await userClient
          .from("order_disputes")
          .select("id, status")
          .eq("order_id", orderId);

        if (disputeCheckError) {
          console.error("[order-action] Dispute check error:", disputeCheckError);
          return new Response(
            JSON.stringify({ error: "Failed to check dispute status" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (existingDisputes && existingDisputes.length > 0) {
          const openDispute = existingDisputes.find(d => d.status === "open");
          const resolvedDispute = existingDisputes.find(d => d.status === "resolved");
          
          if (openDispute) {
            console.log(`[order-action] open_dispute blocked: dispute already open for order ${orderId}`);
            return new Response(
              JSON.stringify({ error: "A dispute is already open for this order." }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          
          if (resolvedDispute) {
            console.log(`[order-action] open_dispute blocked: dispute already resolved for order ${orderId}`);
            return new Response(
              JSON.stringify({ error: "Dispute resolution is final. Cannot reopen disputes." }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
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
          // Check if it's a unique constraint violation (one open dispute per order)
          if (disputeError.code === "23505") {
            return new Response(
              JSON.stringify({ error: "A dispute is already open for this order." }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
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

      case "cancel_order": {
        if (!orderId || !body.cancellation_reason) {
          return new Response(
            JSON.stringify({ error: "Missing order_id or cancellation_reason" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: transitionResult, error: transitionError } = await userClient
          .rpc("transition_order_status", {
            p_order_id: orderId,
            p_new_status: "cancelled",
            p_actor_id: actorId,
            p_reason: body.cancellation_reason,
            p_metadata: { cancellation_reason: body.cancellation_reason, ...body.metadata },
          });

        if (transitionError || !transitionResult?.success) {
          return new Response(
            JSON.stringify({ error: transitionResult?.error || transitionError?.message || "Failed to cancel order" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = transitionResult;
        break;
      }

      case "submit_sample": {
        if (!orderId || !body.sample) {
          return new Response(
            JSON.stringify({ error: "Missing order_id or sample data" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Get current round (count existing submissions + 1)
        const { count } = await userClient
          .from("sample_submissions")
          .select("*", { count: "exact", head: true })
          .eq("order_id", orderId);

        const round = (count || 0) + 1;

        const { data: submission, error: subError } = await userClient
          .from("sample_submissions")
          .insert({
            order_id: orderId,
            submitted_by: actorId,
            round,
            notes: body.sample.notes || null,
            measurements: body.sample.measurements || null,
            photo_urls: body.sample.photo_urls || [],
            status: "pending",
          })
          .select()
          .single();

        if (subError) {
          return new Response(
            JSON.stringify({ error: subError.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Transition order to sample_sent
        const { data: transitionResult, error: transitionError } = await userClient
          .rpc("transition_order_status", {
            p_order_id: orderId,
            p_new_status: "sample_sent",
            p_actor_id: actorId,
            p_reason: `Sample round ${round} submitted`,
            p_metadata: { sample_submission_id: submission.id, round },
          });

        if (transitionError || !transitionResult?.success) {
          return new Response(
            JSON.stringify({ error: transitionResult?.error || transitionError?.message || "Failed to update order status" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Notify brand that sample was submitted
        const { data: sampleOrder } = await serviceClient.from("orders").select("buyer_id, order_number, factories(name)").eq("id", orderId).single();
        if (sampleOrder?.buyer_id) {
          await notify("sample_submitted", sampleOrder.buyer_id, {
            order_number: sampleOrder.order_number,
            factory_name: (sampleOrder.factories as any)?.name || "Your factory",
            round: String(round),
          });
        }

        result = { message: "Sample submitted successfully", submission };
        break;
      }

      case "approve_sample": {
        if (!orderId || !body.sample_submission_id) {
          return new Response(
            JSON.stringify({ error: "Missing order_id or sample_submission_id" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error: updateError } = await userClient
          .from("sample_submissions")
          .update({
            status: "approved",
            reviewed_by: actorId,
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", body.sample_submission_id)
          .eq("order_id", orderId);

        if (updateError) {
          return new Response(
            JSON.stringify({ error: updateError.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Transition order to sample_approved → gates bulk production
        const { data: transitionResult, error: transitionError } = await userClient
          .rpc("transition_order_status", {
            p_order_id: orderId,
            p_new_status: "sample_approved",
            p_actor_id: actorId,
            p_reason: "Sample approved by brand",
            p_metadata: { sample_submission_id: body.sample_submission_id },
          });

        if (transitionError || !transitionResult?.success) {
          return new Response(
            JSON.stringify({ error: transitionResult?.error || transitionError?.message || "Failed to update order status" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Notify factory that sample was approved
        const { data: approveOrder } = await serviceClient.from("orders").select("order_number, factory_id, factories(name), factory_users(user_id)").eq("id", orderId).single();
        const factoryUsers = (approveOrder as any)?.factory_users?.map((m: any) => m.user_id) || [];
        if (factoryUsers.length) {
          await notify("brand_approved_sample", factoryUsers, {
            order_number: (approveOrder as any)?.order_number || "",
            brand_name: "Brand",
          });
        }

        result = { message: "Sample approved. Production can now begin." };
        break;
      }

      case "request_sample_revision": {
        if (!orderId || !body.sample_submission_id || !body.revision_notes) {
          return new Response(
            JSON.stringify({ error: "Missing order_id, sample_submission_id, or revision_notes" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Get round from submission
        const { data: submission } = await userClient
          .from("sample_submissions")
          .select("round")
          .eq("id", body.sample_submission_id)
          .single();

        // Mark submission as revision_requested
        await userClient
          .from("sample_submissions")
          .update({
            status: "revision_requested",
            reviewed_by: actorId,
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", body.sample_submission_id);

        // Create revision record
        const { data: revision, error: revError } = await userClient
          .from("sample_revisions")
          .insert({
            sample_submission_id: body.sample_submission_id,
            order_id: orderId,
            round: submission?.round || 1,
            requested_by: actorId,
            revision_notes: body.revision_notes,
          })
          .select()
          .single();

        if (revError) {
          return new Response(
            JSON.stringify({ error: revError.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Transition order to sample_revision
        const { data: transitionResult, error: transitionError } = await userClient
          .rpc("transition_order_status", {
            p_order_id: orderId,
            p_new_status: "sample_revision",
            p_actor_id: actorId,
            p_reason: "Brand requested sample revision",
            p_metadata: { revision_id: revision.id },
          });

        if (transitionError || !transitionResult?.success) {
          return new Response(
            JSON.stringify({ error: transitionResult?.error || transitionError?.message || "Failed to update order status" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = { message: "Revision requested. Factory has been notified.", revision };
        break;
      }

      case "acknowledge_revision": {
        if (!orderId || !body.sample_submission_id) {
          return new Response(
            JSON.stringify({ error: "Missing order_id or sample_submission_id" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error: ackError } = await userClient
          .from("sample_revisions")
          .update({
            acknowledged_by: actorId,
            acknowledged_at: new Date().toISOString(),
          })
          .eq("sample_submission_id", body.sample_submission_id)
          .is("acknowledged_at", null);

        if (ackError) {
          return new Response(
            JSON.stringify({ error: ackError.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = { message: "Revision acknowledged. Submit your updated sample when ready." };
        break;
      }

      case "submit_revision_round": {
        if (!orderId || !body.revision_description) {
          return new Response(
            JSON.stringify({ error: "Missing order_id or revision_description" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Get current round count
        const { count } = await userClient
          .from("revision_rounds")
          .select("*", { count: "exact", head: true })
          .eq("order_id", orderId);

        const { data: revision, error: revError } = await userClient
          .from("revision_rounds")
          .insert({
            order_id: orderId,
            initiated_by: actorId,
            round_number: (count || 0) + 1,
            description: body.revision_description,
            impact_timeline: body.impact_timeline || null,
            impact_cost: body.impact_cost || null,
            status: "pending",
          })
          .select()
          .single();

        if (revError) {
          return new Response(
            JSON.stringify({ error: revError.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Log to order state history
        await userClient.rpc("transition_order_status", {
          p_order_id: orderId,
          p_new_status: "in_production",
          p_actor_id: actorId,
          p_reason: `Revision round ${revision.round_number} submitted`,
          p_metadata: { revision_round_id: revision.id, round: revision.round_number },
        });

        // Notify factory of revision
        const { data: revOrder } = await serviceClient.from("orders").select("order_number, factory_users(user_id)").eq("id", orderId).single();
        const revFactoryUsers = (revOrder as any)?.factory_users?.map((m: any) => m.user_id) || [];
        if (revFactoryUsers.length) {
          await notify("brand_revision_request", revFactoryUsers, {
            order_number: (revOrder as any)?.order_number || "",
            brand_name: "Brand",
            round: String(revision.round_number),
          });
        }

        result = { message: "Revision submitted. Factory must acknowledge before production continues.", revision };
        break;
      }

      case "acknowledge_revision_round": {
        if (!orderId || !body.revision_round_id) {
          return new Response(
            JSON.stringify({ error: "Missing order_id or revision_round_id" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error: ackError } = await userClient
          .from("revision_rounds")
          .update({
            status: "acknowledged",
            factory_acknowledged_by: actorId,
            factory_acknowledged_at: new Date().toISOString(),
          })
          .eq("id", body.revision_round_id)
          .eq("order_id", orderId);

        if (ackError) {
          return new Response(
            JSON.stringify({ error: ackError.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = { message: "Revision acknowledged. Production continues with updated spec." };
        break;
      }

      case "dispute_revision_round": {
        if (!orderId || !body.revision_round_id || !body.dispute_reason) {
          return new Response(
            JSON.stringify({ error: "Missing order_id, revision_round_id, or dispute_reason" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error: dispError } = await userClient
          .from("revision_rounds")
          .update({
            status: "disputed",
            dispute_reason: body.dispute_reason,
          })
          .eq("id", body.revision_round_id)
          .eq("order_id", orderId);

        if (dispError) {
          return new Response(
            JSON.stringify({ error: dispError.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Escalate — log to state history as disputed
        await userClient.rpc("transition_order_status", {
          p_order_id: orderId,
          p_new_status: "disputed",
          p_actor_id: actorId,
          p_reason: "Revision round disputed by factory",
          p_metadata: { revision_round_id: body.revision_round_id, dispute_reason: body.dispute_reason },
        });

        result = { message: "Revision disputed. Escalated to admin mediation before production continues." };
        break;
      }

      case "resolve_revision_round": {
        if (!orderId || !body.revision_round_id || !body.resolution) {
          return new Response(
            JSON.stringify({ error: "Missing order_id, revision_round_id, or resolution" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error: resError } = await userClient
          .from("revision_rounds")
          .update({
            status: "resolved",
            resolution: body.resolution,
            resolved_by: actorId,
            resolved_at: new Date().toISOString(),
          })
          .eq("id", body.revision_round_id)
          .eq("order_id", orderId);

        if (resError) {
          return new Response(
            JSON.stringify({ error: resError.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = { message: "Revision resolved. Production can continue." };
        break;
      }

      case "upload_tech_pack_version": {
        if (!orderId || !body.tech_pack?.file_url || !body.tech_pack?.file_name) {
          return new Response(
            JSON.stringify({ error: "Missing order_id, file_url, or file_name" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { count } = await userClient
          .from("tech_pack_versions")
          .select("*", { count: "exact", head: true })
          .eq("order_id", orderId);

        const versionNumber = (count || 0) + 1;

        const { data: version, error: verError } = await userClient
          .from("tech_pack_versions")
          .insert({
            order_id: orderId,
            version_number: versionNumber,
            file_url: body.tech_pack.file_url,
            file_name: body.tech_pack.file_name,
            notes: body.tech_pack.notes || null,
            uploaded_by: actorId,
          })
          .select()
          .single();

        if (verError) {
          return new Response(
            JSON.stringify({ error: verError.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Also update the top-level tech_pack_url on the order for backwards compat
        await userClient
          .from("orders")
          .update({ tech_pack_url: body.tech_pack.file_url })
          .eq("id", orderId);

        // Notify factory of new tech pack
        const { data: tpOrder } = await serviceClient.from("orders").select("order_number, factory_users(user_id)").eq("id", orderId).single();
        const tpFactoryUsers = (tpOrder as any)?.factory_users?.map((m: any) => m.user_id) || [];
        if (tpFactoryUsers.length) {
          await notify("tech_pack_uploaded", tpFactoryUsers, {
            order_number: (tpOrder as any)?.order_number || "",
            brand_name: "Brand",
            version: String(versionNumber),
          });
        }

        result = { message: `Tech pack v${versionNumber} uploaded. Factory has been notified.`, version };
        break;
      }

      case "acknowledge_tech_pack_version": {
        if (!orderId || !body.tech_pack_version_id) {
          return new Response(
            JSON.stringify({ error: "Missing order_id or tech_pack_version_id" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error: ackError } = await userClient
          .from("tech_pack_versions")
          .update({
            factory_acknowledged_by: actorId,
            factory_acknowledged_at: new Date().toISOString(),
          })
          .eq("id", body.tech_pack_version_id)
          .eq("order_id", orderId);

        if (ackError) {
          return new Response(
            JSON.stringify({ error: ackError.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = { message: "Tech pack acknowledged. You're confirmed on the current version." };
        break;
      }

      case "file_defect_report": {
        if (!orderId || !body.defect) {
          return new Response(
            JSON.stringify({ error: "Missing order_id or defect data" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const { defect_type, severity, quantity_affected, percentage_affected, description, photo_urls } = body.defect;
        if (!defect_type || !severity || !description || quantity_affected === undefined) {
          return new Response(
            JSON.stringify({ error: "Missing required defect fields: defect_type, severity, quantity_affected, description" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: report, error: repError } = await userClient
          .from("defect_reports")
          .insert({
            order_id: orderId,
            reported_by: actorId,
            defect_type,
            severity,
            quantity_affected,
            percentage_affected: percentage_affected ?? null,
            description,
            photo_urls: photo_urls || [],
            status: "open",
          })
          .select()
          .single();

        if (repError) {
          return new Response(
            JSON.stringify({ error: repError.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Notify factory of defect report
        const { data: defOrder } = await serviceClient.from("orders").select("order_number, factory_users(user_id)").eq("id", orderId).single();
        const defFactoryUsers = (defOrder as any)?.factory_users?.map((m: any) => m.user_id) || [];
        if (defFactoryUsers.length) {
          await notify("defect_filed", defFactoryUsers, {
            order_number: (defOrder as any)?.order_number || "",
            brand_name: "Brand",
            severity,
          });
        }

        result = { message: "Defect report filed. Factory has been notified.", report };
        break;
      }

      case "respond_to_defect": {
        if (!orderId || !body.defect_report_id || !body.factory_response) {
          return new Response(
            JSON.stringify({ error: "Missing order_id, defect_report_id, or factory_response" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error: resError } = await userClient
          .from("defect_reports")
          .update({
            factory_response: body.factory_response,
            factory_responded_by: actorId,
            factory_responded_at: new Date().toISOString(),
            status: "acknowledged",
          })
          .eq("id", body.defect_report_id)
          .eq("order_id", orderId);

        if (resError) {
          return new Response(
            JSON.stringify({ error: resError.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        result = { message: "Response submitted." };
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
