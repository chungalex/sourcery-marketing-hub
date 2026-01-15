-- ============================================================
-- SOURCERY v1 COMPLETE PRODUCTION MIGRATION (FINAL)
-- Includes: idempotency guards, security hardening, admin-only QC directory
-- Storage path format enforced: orders/<order_id>/<filename>
-- ============================================================

-- ============================================================
-- PHASE 1: ENUMS (IDEMPOTENT)
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.factory_participation AS ENUM ('private', 'listed_unverified', 'listed_verified');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.org_role AS ENUM ('owner', 'admin', 'member');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM (
    'draft','po_issued','po_accepted','in_production',
    'qc_scheduled','qc_uploaded','qc_pass','qc_fail',
    'ready_to_ship','shipped','closed','disputed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.milestone_status AS ENUM ('pending','eligible','released','disputed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.qc_result AS ENUM ('pass','conditional','fail');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('initiated','paid','failed','refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.dispute_status AS ENUM ('open','escalated','resolved');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- PHASE 2: ALTER EXISTING FACTORIES TABLE
-- ============================================================
ALTER TABLE public.factories
  ADD COLUMN IF NOT EXISTS participation public.factory_participation NOT NULL DEFAULT 'listed_unverified',
  ADD COLUMN IF NOT EXISTS bank_account_id uuid;

DROP TRIGGER IF EXISTS set_factories_updated_at ON public.factories;
CREATE TRIGGER set_factories_updated_at
BEFORE UPDATE ON public.factories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- PHASE 3: CREATE TABLES (IDEMPOTENT)
-- ============================================================

-- 3.1 Factory Users
CREATE TABLE IF NOT EXISTS public.factory_users (
  factory_id uuid REFERENCES public.factories(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.org_role NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (factory_id, user_id)
);

-- 3.2 Factory Invites
CREATE TABLE IF NOT EXISTS public.factory_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  factory_id uuid REFERENCES public.factories(id) ON DELETE CASCADE,
  invited_by uuid REFERENCES auth.users(id) NOT NULL,
  invite_email text NOT NULL,
  invite_token text NOT NULL UNIQUE,
  accepted_at timestamptz,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3.3 QC Partners
CREATE TABLE IF NOT EXISTS public.qc_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_verified boolean NOT NULL DEFAULT false,
  location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_qc_partners_updated_at ON public.qc_partners;
CREATE TRIGGER set_qc_partners_updated_at
BEFORE UPDATE ON public.qc_partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 3.4 QC Partner Users
CREATE TABLE IF NOT EXISTS public.qc_partner_users (
  qc_partner_id uuid REFERENCES public.qc_partners(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.org_role NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (qc_partner_id, user_id)
);

-- 3.5 Orders + order numbers
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.order_number := 'SRC-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.order_number_seq')::text, 5, '0');
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL DEFAULT '',
  status public.order_status NOT NULL DEFAULT 'draft',
  buyer_id uuid REFERENCES auth.users(id) NOT NULL,
  factory_id uuid REFERENCES public.factories(id) NOT NULL,
  unit_price numeric NOT NULL,
  quantity int NOT NULL,
  total_amount numeric GENERATED ALWAYS AS (unit_price * quantity) STORED,
  currency text NOT NULL DEFAULT 'USD',
  incoterms text,
  delivery_window_start date,
  delivery_window_end date,
  tech_pack_url text,
  bom_url text,
  measurement_table jsonb,
  specifications jsonb,
  qc_standard jsonb DEFAULT '{"defect_threshold_percent": 2.5, "tolerance_ranges": {}, "allowed_remedies": ["rework", "remake", "discount"]}',
  po_document_url text,
  po_accepted_at timestamptz,
  po_accepted_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT qty_positive CHECK (quantity > 0),
  CONSTRAINT unit_price_nonneg CHECK (unit_price >= 0)
);

DROP TRIGGER IF EXISTS set_order_number ON public.orders;
CREATE TRIGGER set_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
EXECUTE FUNCTION public.generate_order_number();

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 3.6 Order QC Assignments
CREATE TABLE IF NOT EXISTS public.order_qc_assignments (
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  qc_partner_id uuid REFERENCES public.qc_partners(id) ON DELETE CASCADE,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (order_id, qc_partner_id)
);

-- 3.7 Order Milestones
CREATE TABLE IF NOT EXISTS public.order_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  label text NOT NULL,
  percentage numeric NOT NULL,
  amount numeric NOT NULL,
  sequence_order int NOT NULL DEFAULT 1,
  status public.milestone_status NOT NULL DEFAULT 'pending',
  release_condition text,
  eligible_at timestamptz,
  released_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pct_range CHECK (percentage > 0 AND percentage <= 100),
  CONSTRAINT milestone_amount_nonneg CHECK (amount >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_milestone_sequence
ON public.order_milestones(order_id, sequence_order);

-- 3.8 Payments Ledger
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) NOT NULL,
  milestone_id uuid REFERENCES public.order_milestones(id),
  stripe_checkout_session_id text UNIQUE,
  stripe_payment_intent_id text UNIQUE,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  status public.payment_status NOT NULL DEFAULT 'initiated',
  created_by uuid REFERENCES auth.users(id),
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pay_amount_pos CHECK (amount > 0)
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_session_id ON public.payments(stripe_checkout_session_id);

-- 3.9 Order State History (Immutable Audit)
CREATE TABLE IF NOT EXISTS public.order_state_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  from_status public.order_status,
  to_status public.order_status NOT NULL,
  changed_by uuid REFERENCES auth.users(id),
  reason text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_state_transition CHECK (from_status IS NULL OR from_status <> to_status)
);

CREATE INDEX IF NOT EXISTS idx_order_state_history_order_id ON public.order_state_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_state_history_created_at ON public.order_state_history(created_at);

-- Extra safety: no UPDATE/DELETE at privilege level
REVOKE UPDATE, DELETE ON public.order_state_history FROM anon, authenticated;

-- 3.10 Order QC Reports
CREATE TABLE IF NOT EXISTS public.order_qc_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  qc_partner_id uuid REFERENCES public.qc_partners(id),
  result public.qc_result NOT NULL,
  defect_percentage numeric,
  notes text,
  report_storage_key text,
  uploaded_by uuid REFERENCES auth.users(id),
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

-- 3.11 Order Evidence
CREATE TABLE IF NOT EXISTS public.order_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES auth.users(id),
  file_type text NOT NULL,
  file_name text NOT NULL,
  storage_key text NOT NULL,
  file_size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3.12 Order Disputes
CREATE TABLE IF NOT EXISTS public.order_disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  initiated_by uuid REFERENCES auth.users(id),
  reason text NOT NULL,
  status public.dispute_status NOT NULL DEFAULT 'open',
  resolution text,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- PHASE 4: HELPER FUNCTIONS (SECURITY INVOKER)
-- ============================================================
CREATE OR REPLACE FUNCTION public.user_has_factory_access(_user_id uuid, _factory_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.factory_users
    WHERE user_id = _user_id AND factory_id = _factory_id
  )
$$;

CREATE OR REPLACE FUNCTION public.user_has_qc_access(_user_id uuid, _qc_partner_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.qc_partner_users
    WHERE user_id = _user_id AND qc_partner_id = _qc_partner_id
  )
$$;

CREATE OR REPLACE FUNCTION public.user_has_order_access(_user_id uuid, _order_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.orders WHERE id = _order_id AND buyer_id = _user_id
    UNION
    SELECT 1
    FROM public.orders o
    JOIN public.factory_users fu ON fu.factory_id = o.factory_id
    WHERE o.id = _order_id AND fu.user_id = _user_id
    UNION
    SELECT 1
    FROM public.order_qc_assignments oqa
    JOIN public.qc_partner_users qpu ON qpu.qc_partner_id = oqa.qc_partner_id
    WHERE oqa.order_id = _order_id AND qpu.user_id = _user_id
    UNION
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin'
  )
$$;

-- ============================================================
-- PHASE 5: PAYMENT MILESTONE INTEGRITY TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.validate_payment_milestone()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.milestone_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1
      FROM public.order_milestones
      WHERE id = NEW.milestone_id
        AND order_id = NEW.order_id
    ) THEN
      RAISE EXCEPTION 'Milestone % does not belong to order %', NEW.milestone_id, NEW.order_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS check_payment_milestone ON public.payments;
CREATE TRIGGER check_payment_milestone
BEFORE INSERT OR UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.validate_payment_milestone();

-- ============================================================
-- PHASE 6: STATE MACHINE (SERVER-AUTHORITATIVE)
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_order_actor_type(
  p_actor_id uuid,
  p_order_id uuid
) RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order record;
BEGIN
  IF public.has_role(p_actor_id, 'admin') THEN
    RETURN 'admin';
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
  IF v_order IS NULL THEN RETURN NULL; END IF;

  IF v_order.buyer_id = p_actor_id THEN
    RETURN 'buyer';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.factory_users fu
    WHERE fu.factory_id = v_order.factory_id
      AND fu.user_id = p_actor_id
  ) THEN
    RETURN 'factory';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.order_qc_assignments oqa
    JOIN public.qc_partner_users qpu ON qpu.qc_partner_id = oqa.qc_partner_id
    WHERE oqa.order_id = p_order_id
      AND qpu.user_id = p_actor_id
  ) THEN
    RETURN 'qc';
  END IF;

  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.get_order_actor_type(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_actor_type(uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.transition_order_status(
  p_order_id uuid,
  p_new_status public.order_status,
  p_actor_id uuid,
  p_reason text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

  -- Allowed transitions
  v_valid_transitions := CASE v_old_status
    WHEN 'draft' THEN ARRAY['po_issued','disputed']::public.order_status[]
    WHEN 'po_issued' THEN ARRAY['po_accepted','disputed']::public.order_status[]
    WHEN 'po_accepted' THEN ARRAY['in_production','disputed']::public.order_status[]
    WHEN 'in_production' THEN ARRAY['qc_scheduled','disputed']::public.order_status[]
    WHEN 'qc_scheduled' THEN ARRAY['qc_uploaded','disputed']::public.order_status[]
    WHEN 'qc_uploaded' THEN ARRAY['qc_pass','qc_fail','disputed']::public.order_status[]
    WHEN 'qc_pass' THEN ARRAY['ready_to_ship','disputed']::public.order_status[]
    WHEN 'qc_fail' THEN ARRAY['in_production','disputed']::public.order_status[]
    WHEN 'ready_to_ship' THEN ARRAY['shipped','disputed']::public.order_status[]
    WHEN 'shipped' THEN ARRAY['closed','disputed']::public.order_status[]
    WHEN 'closed' THEN ARRAY[]::public.order_status[]
    WHEN 'disputed' THEN ARRAY['in_production','closed']::public.order_status[]
    ELSE ARRAY[]::public.order_status[]
  END;

  IF NOT (p_new_status = ANY(v_valid_transitions)) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Invalid transition: %s -> %s', v_old_status, p_new_status)
    );
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

  -- Who can do what (v1)
  v_allowed_actor_types := CASE
    WHEN (v_old_status = 'draft' AND p_new_status = 'po_issued') THEN ARRAY['buyer','admin']
    WHEN (v_old_status = 'po_issued' AND p_new_status = 'po_accepted') THEN ARRAY['factory','admin']
    WHEN (v_old_status = 'po_accepted' AND p_new_status = 'in_production') THEN ARRAY['factory','admin']
    WHEN (v_old_status = 'in_production' AND p_new_status = 'qc_scheduled') THEN ARRAY['factory','buyer','admin']
    WHEN (v_old_status = 'qc_scheduled' AND p_new_status = 'qc_uploaded') THEN ARRAY['qc','admin']
    WHEN (v_old_status = 'qc_uploaded' AND p_new_status IN ('qc_pass','qc_fail')) THEN ARRAY['admin']
    WHEN (v_old_status = 'qc_pass' AND p_new_status = 'ready_to_ship') THEN ARRAY['factory','admin']
    WHEN (v_old_status = 'ready_to_ship' AND p_new_status = 'shipped') THEN ARRAY['buyer','admin']
    WHEN (v_old_status = 'shipped' AND p_new_status = 'closed') THEN ARRAY['buyer','admin']
    WHEN (p_new_status = 'disputed') THEN ARRAY['buyer','factory','admin']
    WHEN (v_old_status = 'disputed' AND p_new_status IN ('in_production','closed')) THEN ARRAY['admin']
    WHEN (v_old_status = 'qc_fail' AND p_new_status = 'in_production') THEN ARRAY['factory','admin']
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

  -- If disputed, freeze unreleased milestones
  IF p_new_status = 'disputed' THEN
    UPDATE public.order_milestones
    SET status = 'disputed'
    WHERE order_id = p_order_id
      AND status IN ('pending','eligible');
  END IF;

  -- Milestone eligibility (balanced v1):
  -- Sequence 1 becomes eligible at po_accepted
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
$$;

REVOKE ALL ON FUNCTION public.transition_order_status(uuid, public.order_status, uuid, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.transition_order_status(uuid, public.order_status, uuid, text, jsonb) TO authenticated;

-- ============================================================
-- PHASE 7: ENABLE RLS
-- ============================================================
ALTER TABLE public.factory_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.factory_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qc_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qc_partner_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_qc_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_state_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_qc_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_disputes ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PHASE 8: RLS POLICIES (DROP-AND-CREATE SAFE)
-- ============================================================

-- factory_users
DROP POLICY IF EXISTS factory_users_select_own ON public.factory_users;
DROP POLICY IF EXISTS factory_users_select_same_factory ON public.factory_users;
DROP POLICY IF EXISTS factory_users_admin_select ON public.factory_users;
DROP POLICY IF EXISTS factory_admins_insert_members ON public.factory_users;
DROP POLICY IF EXISTS factory_admins_update_members ON public.factory_users;
DROP POLICY IF EXISTS factory_admins_delete_members ON public.factory_users;
DROP POLICY IF EXISTS admin_manage_factory_users ON public.factory_users;

CREATE POLICY factory_users_select_own ON public.factory_users
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY factory_users_select_same_factory ON public.factory_users
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.factory_users fu
    WHERE fu.factory_id = factory_users.factory_id
      AND fu.user_id = auth.uid()
  )
);

CREATE POLICY factory_users_admin_select ON public.factory_users
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY factory_admins_insert_members ON public.factory_users
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.factory_users fu
    WHERE fu.factory_id = factory_users.factory_id
      AND fu.user_id = auth.uid()
      AND fu.role IN ('owner','admin')
  )
);

CREATE POLICY factory_admins_update_members ON public.factory_users
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.factory_users fu
    WHERE fu.factory_id = factory_users.factory_id
      AND fu.user_id = auth.uid()
      AND fu.role IN ('owner','admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.factory_users fu
    WHERE fu.factory_id = factory_users.factory_id
      AND fu.user_id = auth.uid()
      AND fu.role IN ('owner','admin')
  )
);

CREATE POLICY factory_admins_delete_members ON public.factory_users
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.factory_users fu
    WHERE fu.factory_id = factory_users.factory_id
      AND fu.user_id = auth.uid()
      AND fu.role IN ('owner','admin')
  )
);

CREATE POLICY admin_manage_factory_users ON public.factory_users
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- factory_invites
DROP POLICY IF EXISTS factory_invites_select ON public.factory_invites;
DROP POLICY IF EXISTS factory_invites_insert ON public.factory_invites;
DROP POLICY IF EXISTS factory_invites_admin ON public.factory_invites;

CREATE POLICY factory_invites_select ON public.factory_invites
FOR SELECT USING (
  public.user_has_factory_access(auth.uid(), factory_id)
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY factory_invites_insert ON public.factory_invites
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.factory_users fu
    WHERE fu.factory_id = factory_invites.factory_id
      AND fu.user_id = auth.uid()
      AND fu.role IN ('owner','admin')
  )
);

CREATE POLICY factory_invites_admin ON public.factory_invites
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- qc_partners (ADMIN-ONLY)
DROP POLICY IF EXISTS qc_partners_select_admin_only ON public.qc_partners;
DROP POLICY IF EXISTS qc_partners_admin_insert ON public.qc_partners;
DROP POLICY IF EXISTS qc_partners_admin_update ON public.qc_partners;
DROP POLICY IF EXISTS qc_partners_admin_delete ON public.qc_partners;

CREATE POLICY qc_partners_select_admin_only ON public.qc_partners
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY qc_partners_admin_insert ON public.qc_partners
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY qc_partners_admin_update ON public.qc_partners
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY qc_partners_admin_delete ON public.qc_partners
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- qc_partner_users
DROP POLICY IF EXISTS qc_partner_users_select_own ON public.qc_partner_users;
DROP POLICY IF EXISTS qc_partner_users_select_same_org ON public.qc_partner_users;
DROP POLICY IF EXISTS qc_partner_admins_insert_members ON public.qc_partner_users;
DROP POLICY IF EXISTS qc_partner_admins_update_members ON public.qc_partner_users;
DROP POLICY IF EXISTS qc_partner_admins_delete_members ON public.qc_partner_users;
DROP POLICY IF EXISTS admin_manage_qc_partner_users ON public.qc_partner_users;

CREATE POLICY qc_partner_users_select_own ON public.qc_partner_users
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY qc_partner_users_select_same_org ON public.qc_partner_users
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.qc_partner_users qpu
    WHERE qpu.qc_partner_id = qc_partner_users.qc_partner_id
      AND qpu.user_id = auth.uid()
  )
);

CREATE POLICY qc_partner_admins_insert_members ON public.qc_partner_users
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.qc_partner_users qpu
    WHERE qpu.qc_partner_id = qc_partner_users.qc_partner_id
      AND qpu.user_id = auth.uid()
      AND qpu.role IN ('owner','admin')
  )
);

CREATE POLICY qc_partner_admins_update_members ON public.qc_partner_users
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.qc_partner_users qpu
    WHERE qpu.qc_partner_id = qc_partner_users.qc_partner_id
      AND qpu.user_id = auth.uid()
      AND qpu.role IN ('owner','admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.qc_partner_users qpu
    WHERE qpu.qc_partner_id = qc_partner_users.qc_partner_id
      AND qpu.user_id = auth.uid()
      AND qpu.role IN ('owner','admin')
  )
);

CREATE POLICY qc_partner_admins_delete_members ON public.qc_partner_users
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.qc_partner_users qpu
    WHERE qpu.qc_partner_id = qc_partner_users.qc_partner_id
      AND qpu.user_id = auth.uid()
      AND qpu.role IN ('owner','admin')
  )
);

CREATE POLICY admin_manage_qc_partner_users ON public.qc_partner_users
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- orders
DROP POLICY IF EXISTS orders_buyer_select ON public.orders;
DROP POLICY IF EXISTS orders_factory_select ON public.orders;
DROP POLICY IF EXISTS orders_qc_select ON public.orders;
DROP POLICY IF EXISTS orders_admin_select ON public.orders;
DROP POLICY IF EXISTS orders_buyer_insert ON public.orders;
DROP POLICY IF EXISTS orders_buyer_update_draft ON public.orders;
DROP POLICY IF EXISTS orders_admin_all ON public.orders;

CREATE POLICY orders_buyer_select ON public.orders
FOR SELECT USING (buyer_id = auth.uid());

CREATE POLICY orders_factory_select ON public.orders
FOR SELECT USING (public.user_has_factory_access(auth.uid(), factory_id));

CREATE POLICY orders_qc_select ON public.orders
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.order_qc_assignments oqa
    JOIN public.qc_partner_users qpu ON qpu.qc_partner_id = oqa.qc_partner_id
    WHERE oqa.order_id = orders.id
      AND qpu.user_id = auth.uid()
  )
);

CREATE POLICY orders_admin_select ON public.orders
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY orders_buyer_insert ON public.orders
FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY orders_buyer_update_draft ON public.orders
FOR UPDATE
USING (buyer_id = auth.uid() AND status = 'draft')
WITH CHECK (buyer_id = auth.uid() AND status = 'draft');

CREATE POLICY orders_admin_all ON public.orders
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- order_qc_assignments
DROP POLICY IF EXISTS order_qc_assignments_select ON public.order_qc_assignments;
DROP POLICY IF EXISTS order_qc_assignments_admin ON public.order_qc_assignments;

CREATE POLICY order_qc_assignments_select ON public.order_qc_assignments
FOR SELECT USING (public.user_has_order_access(auth.uid(), order_id));

CREATE POLICY order_qc_assignments_admin ON public.order_qc_assignments
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- order_milestones
DROP POLICY IF EXISTS order_milestones_select ON public.order_milestones;
DROP POLICY IF EXISTS order_milestones_buyer_insert ON public.order_milestones;
DROP POLICY IF EXISTS order_milestones_admin ON public.order_milestones;

CREATE POLICY order_milestones_select ON public.order_milestones
FOR SELECT USING (public.user_has_order_access(auth.uid(), order_id));

CREATE POLICY order_milestones_buyer_insert ON public.order_milestones
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_milestones.order_id
      AND o.buyer_id = auth.uid()
      AND o.status = 'draft'
  )
);

CREATE POLICY order_milestones_admin ON public.order_milestones
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- payments (read-only + explicit deny writes)
DROP POLICY IF EXISTS payments_select ON public.payments;
DROP POLICY IF EXISTS payments_no_client_insert ON public.payments;
DROP POLICY IF EXISTS payments_no_client_update ON public.payments;
DROP POLICY IF EXISTS payments_no_client_delete ON public.payments;

CREATE POLICY payments_select ON public.payments
FOR SELECT USING (public.user_has_order_access(auth.uid(), order_id));

CREATE POLICY payments_no_client_insert ON public.payments
FOR INSERT WITH CHECK (false);

CREATE POLICY payments_no_client_update ON public.payments
FOR UPDATE USING (false);

CREATE POLICY payments_no_client_delete ON public.payments
FOR DELETE USING (false);

-- order_state_history (read-only + explicit deny writes)
DROP POLICY IF EXISTS order_state_history_select ON public.order_state_history;
DROP POLICY IF EXISTS history_no_client_insert ON public.order_state_history;
DROP POLICY IF EXISTS history_no_client_update ON public.order_state_history;
DROP POLICY IF EXISTS history_no_client_delete ON public.order_state_history;

CREATE POLICY order_state_history_select ON public.order_state_history
FOR SELECT USING (public.user_has_order_access(auth.uid(), order_id));

CREATE POLICY history_no_client_insert ON public.order_state_history
FOR INSERT WITH CHECK (false);

CREATE POLICY history_no_client_update ON public.order_state_history
FOR UPDATE USING (false);

CREATE POLICY history_no_client_delete ON public.order_state_history
FOR DELETE USING (false);

-- order_qc_reports
DROP POLICY IF EXISTS order_qc_reports_select ON public.order_qc_reports;
DROP POLICY IF EXISTS order_qc_reports_qc_insert ON public.order_qc_reports;
DROP POLICY IF EXISTS order_qc_reports_admin ON public.order_qc_reports;

CREATE POLICY order_qc_reports_select ON public.order_qc_reports
FOR SELECT USING (public.user_has_order_access(auth.uid(), order_id));

CREATE POLICY order_qc_reports_qc_insert ON public.order_qc_reports
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.order_qc_assignments oqa
    JOIN public.qc_partner_users qpu ON qpu.qc_partner_id = oqa.qc_partner_id
    WHERE oqa.order_id = order_qc_reports.order_id
      AND qpu.user_id = auth.uid()
  )
);

CREATE POLICY order_qc_reports_admin ON public.order_qc_reports
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- order_evidence
DROP POLICY IF EXISTS order_evidence_select ON public.order_evidence;
DROP POLICY IF EXISTS order_evidence_insert ON public.order_evidence;
DROP POLICY IF EXISTS order_evidence_admin ON public.order_evidence;

CREATE POLICY order_evidence_select ON public.order_evidence
FOR SELECT USING (public.user_has_order_access(auth.uid(), order_id));

CREATE POLICY order_evidence_insert ON public.order_evidence
FOR INSERT WITH CHECK (public.user_has_order_access(auth.uid(), order_id));

CREATE POLICY order_evidence_admin ON public.order_evidence
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- order_disputes
DROP POLICY IF EXISTS order_disputes_select ON public.order_disputes;
DROP POLICY IF EXISTS order_disputes_insert ON public.order_disputes;
DROP POLICY IF EXISTS order_disputes_admin ON public.order_disputes;

CREATE POLICY order_disputes_select ON public.order_disputes
FOR SELECT USING (public.user_has_order_access(auth.uid(), order_id));

CREATE POLICY order_disputes_insert ON public.order_disputes
FOR INSERT WITH CHECK (public.user_has_order_access(auth.uid(), order_id));

CREATE POLICY order_disputes_admin ON public.order_disputes
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- PHASE 9: PRIVATE STORAGE BUCKET + STORAGE RLS
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-files', 'order-files', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS order_files_select ON storage.objects;
DROP POLICY IF EXISTS order_files_insert ON storage.objects;
DROP POLICY IF EXISTS order_files_update ON storage.objects;
DROP POLICY IF EXISTS order_files_delete ON storage.objects;

CREATE POLICY order_files_select ON storage.objects
FOR SELECT USING (
  bucket_id = 'order-files'
  AND public.user_has_order_access(auth.uid(), (split_part(name, '/', 2))::uuid)
);

CREATE POLICY order_files_insert ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'order-files'
  AND public.user_has_order_access(auth.uid(), (split_part(name, '/', 2))::uuid)
);

CREATE POLICY order_files_update ON storage.objects
FOR UPDATE USING (
  bucket_id = 'order-files'
  AND public.user_has_order_access(auth.uid(), (split_part(name, '/', 2))::uuid)
);

CREATE POLICY order_files_delete ON storage.objects
FOR DELETE USING (
  bucket_id = 'order-files'
  AND public.user_has_order_access(auth.uid(), (split_part(name, '/', 2))::uuid)
);