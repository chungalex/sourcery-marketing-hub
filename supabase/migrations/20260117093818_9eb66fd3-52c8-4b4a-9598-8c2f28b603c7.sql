-- PHASE 1: Doctrine Implementation
-- =====================================================

-- 1. Add 'cancelled' to milestone_status enum (prerequisite for unfreeze logic)
ALTER TYPE public.milestone_status ADD VALUE IF NOT EXISTS 'cancelled';

-- 2. Create partial unique index for one open dispute per order
CREATE UNIQUE INDEX IF NOT EXISTS idx_order_disputes_one_open 
ON public.order_disputes (order_id) 
WHERE status = 'open';

-- 3. Add Stripe tracking columns to order_milestones (Phase 2 prep)
ALTER TABLE public.order_milestones
ADD COLUMN IF NOT EXISTS stripe_checkout_session_id text,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;

-- Add unique constraint for Stripe idempotency (Adjustment #2)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uniq_stripe_payment_intent'
  ) THEN
    ALTER TABLE public.order_milestones
    ADD CONSTRAINT uniq_stripe_payment_intent 
    UNIQUE (stripe_payment_intent_id);
  END IF;
END $$;

-- 4. Update transition_order_status function with:
--    - QC partner assignment check (Adjustment #1)
--    - Milestone unfreeze logic for dispute resolution
CREATE OR REPLACE FUNCTION public.transition_order_status(
  p_order_id uuid, 
  p_new_status order_status, 
  p_actor_id uuid, 
  p_reason text DEFAULT NULL::text, 
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_order record;
  v_old_status public.order_status;
  v_valid_transitions public.order_status[];
  v_actor_type text;
  v_allowed_actor_types text[];
  v_qc_report_exists boolean;
BEGIN
  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF v_order IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;

  v_old_status := v_order.status;
  v_actor_type := public.get_order_actor_type(p_actor_id, p_order_id);

  IF v_actor_type IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Actor has no access to this order');
  END IF;

  -- Allowed transitions (updated: cancelled path + restricted disputes)
  v_valid_transitions := CASE v_old_status
    WHEN 'draft' THEN ARRAY['po_issued','cancelled']::public.order_status[]
    WHEN 'po_issued' THEN ARRAY['po_accepted','cancelled']::public.order_status[]
    WHEN 'po_accepted' THEN ARRAY['in_production','cancelled']::public.order_status[]
    WHEN 'in_production' THEN ARRAY['qc_scheduled','cancelled']::public.order_status[]
    WHEN 'qc_scheduled' THEN ARRAY['qc_uploaded','cancelled']::public.order_status[]
    WHEN 'qc_uploaded' THEN ARRAY['qc_pass','qc_fail']::public.order_status[]
    WHEN 'qc_pass' THEN ARRAY['ready_to_ship','disputed']::public.order_status[]
    WHEN 'qc_fail' THEN ARRAY['in_production']::public.order_status[]
    WHEN 'ready_to_ship' THEN ARRAY['shipped','disputed']::public.order_status[]
    WHEN 'shipped' THEN ARRAY['closed','disputed']::public.order_status[]
    WHEN 'closed' THEN ARRAY[]::public.order_status[]
    WHEN 'disputed' THEN ARRAY['ready_to_ship','shipped','closed']::public.order_status[]
    WHEN 'cancelled' THEN ARRAY['closed']::public.order_status[]
    ELSE ARRAY[]::public.order_status[]
  END;

  IF NOT (p_new_status = ANY(v_valid_transitions)) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Invalid transition: %s -> %s', v_old_status, p_new_status)
    );
  END IF;

  -- =====================================================
  -- QC PARTNER ASSIGNMENT CHECK (Adjustment #1 - DB level enforcement)
  -- =====================================================
  IF p_new_status = 'qc_scheduled' THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.order_qc_assignments
      WHERE order_id = p_order_id
    ) THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'Cannot schedule QC: no QC partner assigned'
      );
    END IF;
  END IF;

  -- QC result requires an actual QC report
  IF v_old_status = 'qc_uploaded' AND p_new_status IN ('qc_pass','qc_fail') THEN
    SELECT EXISTS (
      SELECT 1 FROM public.order_qc_reports WHERE order_id = p_order_id
    ) INTO v_qc_report_exists;

    IF NOT v_qc_report_exists THEN
      RETURN jsonb_build_object('success', false, 'error', 'Cannot set QC result without a QC report');
    END IF;
  END IF;

  -- Prevent cancellation after payment released
  IF p_new_status = 'cancelled' THEN
    IF EXISTS (
      SELECT 1 FROM public.order_milestones
      WHERE order_id = p_order_id
      AND status = 'released'
    ) THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'Cannot cancel after payments released. Open a dispute or contact support.'
      );
    END IF;
  END IF;

  -- Milestone gating: cannot mark ready to ship without released milestone
  IF p_new_status = 'ready_to_ship' THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.order_milestones
      WHERE order_id = p_order_id
      AND status = 'released'
    ) THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'Cannot mark ready to ship: at least one milestone payment must be released'
      );
    END IF;
  END IF;

  -- Who can do what (updated actor permissions)
  v_allowed_actor_types := CASE
    WHEN (v_old_status = 'draft' AND p_new_status = 'po_issued') THEN ARRAY['buyer','admin']
    WHEN (v_old_status = 'po_issued' AND p_new_status = 'po_accepted') THEN ARRAY['factory','admin']
    WHEN (v_old_status = 'po_accepted' AND p_new_status = 'in_production') THEN ARRAY['factory','admin']
    WHEN (v_old_status = 'in_production' AND p_new_status = 'qc_scheduled') THEN ARRAY['factory','buyer','admin']
    WHEN (v_old_status = 'qc_scheduled' AND p_new_status = 'qc_uploaded') THEN ARRAY['qc','admin']
    WHEN (v_old_status = 'qc_uploaded' AND p_new_status IN ('qc_pass','qc_fail')) THEN ARRAY['qc','admin']
    WHEN (v_old_status = 'qc_pass' AND p_new_status = 'ready_to_ship') THEN ARRAY['factory','admin']
    WHEN (v_old_status = 'ready_to_ship' AND p_new_status = 'shipped') THEN ARRAY['factory','admin']
    WHEN (v_old_status = 'shipped' AND p_new_status = 'closed') THEN ARRAY['buyer','admin']
    WHEN (p_new_status = 'disputed') THEN ARRAY['buyer','factory','admin']
    WHEN (v_old_status = 'disputed' AND p_new_status IN ('ready_to_ship','shipped','closed')) THEN ARRAY['admin']
    WHEN (v_old_status = 'qc_fail' AND p_new_status = 'in_production') THEN ARRAY['factory','admin']
    WHEN (p_new_status = 'cancelled') THEN ARRAY['buyer','admin']
    WHEN (v_old_status = 'cancelled' AND p_new_status = 'closed') THEN ARRAY['admin']
    ELSE ARRAY['admin']
  END;

  IF NOT (v_actor_type = ANY(v_allowed_actor_types)) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Actor type %s not allowed for transition %s -> %s', v_actor_type, v_old_status, p_new_status)
    );
  END IF;

  -- Update order status
  UPDATE public.orders
  SET status = p_new_status,
      updated_at = now()
  WHERE id = p_order_id;

  -- Write immutable history
  INSERT INTO public.order_state_history(order_id, from_status, to_status, changed_by, reason, metadata)
  VALUES (p_order_id, v_old_status, p_new_status, p_actor_id, p_reason, p_metadata);

  -- =====================================================
  -- MILESTONE FREEZE: If disputed, freeze unreleased milestones
  -- =====================================================
  IF p_new_status = 'disputed' THEN
    UPDATE public.order_milestones
    SET status = 'disputed'
    WHERE order_id = p_order_id
      AND status IN ('pending','eligible');
  END IF;

  -- =====================================================
  -- MILESTONE UNFREEZE: When dispute resolves
  -- =====================================================
  -- When dispute resolves to ready_to_ship or shipped, restore frozen milestones
  IF v_old_status = 'disputed' AND p_new_status IN ('ready_to_ship', 'shipped') THEN
    UPDATE public.order_milestones
    SET status = 'eligible'
    WHERE order_id = p_order_id
      AND status = 'disputed';
  END IF;

  -- When dispute resolves to closed, mark frozen milestones as cancelled
  IF v_old_status = 'disputed' AND p_new_status = 'closed' THEN
    UPDATE public.order_milestones
    SET status = 'cancelled'
    WHERE order_id = p_order_id
      AND status = 'disputed';
  END IF;

  -- Milestone eligibility: Sequence 1 becomes eligible at po_accepted
  IF p_new_status = 'po_accepted' THEN
    UPDATE public.order_milestones
    SET status = 'eligible',
        eligible_at = now()
    WHERE order_id = p_order_id
      AND sequence_order = 1
      AND status = 'pending';
  END IF;

  -- Sequence 2 becomes eligible at qc_pass
  IF p_new_status = 'qc_pass' THEN
    UPDATE public.order_milestones
    SET status = 'eligible',
        eligible_at = now()
    WHERE order_id = p_order_id
      AND sequence_order = 2
      AND status = 'pending';
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'old_status', v_old_status,
    'new_status', p_new_status,
    'actor_type', v_actor_type
  );
END;
$function$;