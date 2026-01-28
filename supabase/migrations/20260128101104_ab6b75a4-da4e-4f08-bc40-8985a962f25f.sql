-- Ensure RLS is enabled
ALTER TABLE public.qc_partner_users ENABLE ROW LEVEL SECURITY;

-- Drop recursive/problematic policies
DROP POLICY IF EXISTS "qc_partner_users_select_same_org" ON public.qc_partner_users;
DROP POLICY IF EXISTS "qc_partner_users_select_own" ON public.qc_partner_users;
DROP POLICY IF EXISTS "qc_partner_admins_insert_members" ON public.qc_partner_users;
DROP POLICY IF EXISTS "qc_partner_admins_update_members" ON public.qc_partner_users;
DROP POLICY IF EXISTS "qc_partner_admins_delete_members" ON public.qc_partner_users;

-- Recreate safe SELECT policy: own rows or platform admin
CREATE POLICY "qc_partner_users_select_own"
ON public.qc_partner_users
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);

-- NOTE: Mutations remain admin-only via existing admin_manage_qc_partner_users policy (ALL command)