-- Add buyer_id to inquiries for ownership tracking
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS buyer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Ensure RLS is enabled on inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can submit inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can view inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.inquiries;

-- New policies: authenticated-only inserts with ownership
CREATE POLICY "Authenticated users can submit inquiries"
ON public.inquiries FOR INSERT
TO authenticated
WITH CHECK (buyer_id = auth.uid());

-- SELECT: buyers see their own, factory users see theirs, admins see all
CREATE POLICY "Users can view their own inquiries"
ON public.inquiries FOR SELECT
TO authenticated
USING (
  buyer_id = auth.uid() OR
  user_has_factory_access(auth.uid(), factory_id) OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- UPDATE: admins only (factory replies handled via Edge Function)
CREATE POLICY "Admins can update inquiries"
ON public.inquiries FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create contact_submissions table for anonymous contact form
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  company text,
  message text NOT NULL,
  form_type text DEFAULT 'general',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Temporary anon insert (to be replaced by Edge Function with rate limiting)
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions FOR INSERT
WITH CHECK (true);

-- Admins can view/delete contact submissions
CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete contact submissions"
ON public.contact_submissions FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));