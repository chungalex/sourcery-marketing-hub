-- Fix 1: Prevent self-role-escalation in factory_users
-- Drop the existing policy and recreate with WITH CHECK preventing self-modification
DROP POLICY IF EXISTS "factory_admins_update_members" ON public.factory_users;

CREATE POLICY "factory_admins_update_members" ON public.factory_users
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.factory_users fu
    WHERE fu.factory_id = factory_users.factory_id
      AND fu.user_id = auth.uid()
      AND fu.role IN ('owner', 'admin')
  )
)
WITH CHECK (
  -- Prevent self-modification of roles
  user_id != auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.factory_users fu
    WHERE fu.factory_id = factory_users.factory_id
      AND fu.user_id = auth.uid()
      AND fu.role IN ('owner', 'admin')
  )
);

-- Fix 1b: Prevent self-role-escalation in qc_partner_users
DROP POLICY IF EXISTS "qc_partner_admins_update_members" ON public.qc_partner_users;

CREATE POLICY "qc_partner_admins_update_members" ON public.qc_partner_users
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.qc_partner_users qpu
    WHERE qpu.qc_partner_id = qc_partner_users.qc_partner_id
      AND qpu.user_id = auth.uid()
      AND qpu.role IN ('owner', 'admin')
  )
)
WITH CHECK (
  -- Prevent self-modification of roles
  user_id != auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.qc_partner_users qpu
    WHERE qpu.qc_partner_id = qc_partner_users.qc_partner_id
      AND qpu.user_id = auth.uid()
      AND qpu.role IN ('owner', 'admin')
  )
);

-- Fix 2: Restrict factory_invites token visibility to invited email + org admins only
DROP POLICY IF EXISTS "factory_invites_select" ON public.factory_invites;

CREATE POLICY "factory_invites_select" ON public.factory_invites
FOR SELECT
USING (
  -- The invited person can see their own invite
  invite_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  -- Factory owners/admins can see invites for their factory
  OR EXISTS (
    SELECT 1 FROM public.factory_users fu
    WHERE fu.user_id = auth.uid()
      AND fu.factory_id = factory_invites.factory_id
      AND fu.role IN ('owner', 'admin')
  )
  -- Platform admins can see all invites
  OR public.has_role(auth.uid(), 'admin')
);

-- Fix 3: Add input validation constraints to prevent spam/abuse
-- Email format validation for factory_applications
ALTER TABLE public.factory_applications
  DROP CONSTRAINT IF EXISTS email_format_check;
  
ALTER TABLE public.factory_applications
  ADD CONSTRAINT email_format_check
  CHECK (submitted_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Email format validation for inquiries
ALTER TABLE public.inquiries
  DROP CONSTRAINT IF EXISTS inquiries_email_format_check;
  
ALTER TABLE public.inquiries
  ADD CONSTRAINT inquiries_email_format_check
  CHECK (requester_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Email format validation for rfqs
ALTER TABLE public.rfqs
  DROP CONSTRAINT IF EXISTS rfqs_email_format_check;
  
ALTER TABLE public.rfqs
  ADD CONSTRAINT rfqs_email_format_check
  CHECK (user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Message length limit for inquiries (5000 chars max)
ALTER TABLE public.inquiries
  DROP CONSTRAINT IF EXISTS inquiries_message_length_check;
  
ALTER TABLE public.inquiries
  ADD CONSTRAINT inquiries_message_length_check
  CHECK (message IS NULL OR length(message) <= 5000);

-- Name length limits
ALTER TABLE public.inquiries
  DROP CONSTRAINT IF EXISTS inquiries_name_length_check;
  
ALTER TABLE public.inquiries
  ADD CONSTRAINT inquiries_name_length_check
  CHECK (length(requester_name) <= 200);

-- Payload size limit for factory_applications (50KB max)
ALTER TABLE public.factory_applications
  DROP CONSTRAINT IF EXISTS payload_size_check;
  
ALTER TABLE public.factory_applications
  ADD CONSTRAINT payload_size_check
  CHECK (pg_column_size(payload) < 50000);

-- RFQ field length limits
ALTER TABLE public.rfqs
  DROP CONSTRAINT IF EXISTS rfqs_description_length_check;
  
ALTER TABLE public.rfqs
  ADD CONSTRAINT rfqs_description_length_check
  CHECK (description IS NULL OR length(description) <= 10000);

ALTER TABLE public.rfqs
  DROP CONSTRAINT IF EXISTS rfqs_additional_req_length_check;
  
ALTER TABLE public.rfqs
  ADD CONSTRAINT rfqs_additional_req_length_check
  CHECK (additional_requirements IS NULL OR length(additional_requirements) <= 5000);