-- Fix infinite recursion in RLS policies on public.factory_users
-- The previous policies referenced public.factory_users from within RLS expressions, triggering PostgREST error 42P17.
-- For MVP: keep "select own" + "admin manage" policies; remove self-referential org policies.

DROP POLICY IF EXISTS "factory_users_select_same_factory" ON public.factory_users;
DROP POLICY IF EXISTS "factory_admins_delete_members" ON public.factory_users;
DROP POLICY IF EXISTS "factory_admins_insert_members" ON public.factory_users;
DROP POLICY IF EXISTS "factory_admins_update_members" ON public.factory_users;