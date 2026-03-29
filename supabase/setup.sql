-- Run this in Supabase SQL Editor to fix the directory page and set up missing pieces

-- 1. Create or replace the factory_previews view
CREATE OR REPLACE VIEW factory_previews AS
SELECT 
  id, slug, name, country, city, description,
  factory_type, categories, moq_min, moq_max,
  lead_time_weeks, certifications, is_verified,
  participation, logo_url, gallery_urls,
  performance_score, score_tier,
  year_established, total_employees,
  created_at, updated_at
FROM factories
WHERE participation IN ('listed_verified', 'listed_unverified');

-- Grant public read access
GRANT SELECT ON factory_previews TO anon, authenticated;

-- 2. Create factory_invites table if it doesn't exist
CREATE TABLE IF NOT EXISTS factory_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token UUID UNIQUE NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  factory_name TEXT NOT NULL,
  factory_email TEXT NOT NULL,
  country TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for factory_invites
ALTER TABLE factory_invites ENABLE ROW LEVEL SECURITY;

-- Brand can see their own invites
CREATE POLICY IF NOT EXISTS "brands_see_own_invites" ON factory_invites
  FOR SELECT USING (invited_by = auth.uid());

-- Service role can insert
CREATE POLICY IF NOT EXISTS "service_can_insert_invites" ON factory_invites
  FOR INSERT WITH CHECK (true);

-- 3. Check factories table has correct RLS for authenticated brands
-- Factory should be readable by authenticated users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'factories' 
    AND policyname = 'authenticated_can_read_factories'
  ) THEN
    CREATE POLICY "authenticated_can_read_factories" ON factories
      FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- 4. Verify HU LA Studios is there
SELECT id, name, slug, participation, is_verified FROM factories WHERE slug = 'hu-la-studios';
