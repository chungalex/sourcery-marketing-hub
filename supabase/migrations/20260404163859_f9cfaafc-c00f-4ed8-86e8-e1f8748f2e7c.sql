
-- Drop existing rfqs table (has old schema with user_email, product_type etc.)
-- and related tables
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS rfqs CASCADE;

-- Recreate rfqs with new schema
CREATE TABLE rfqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  product_category TEXT,
  product_description TEXT,
  quantity_min INTEGER,
  quantity_max INTEGER,
  target_price_min NUMERIC,
  target_price_max NUMERIC,
  currency TEXT DEFAULT 'USD',
  target_delivery_weeks INTEGER,
  tech_pack_url TEXT,
  specifications JSONB DEFAULT '{}',
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brands_manage_own_rfqs" ON rfqs FOR ALL USING (brand_id = auth.uid());

CREATE TABLE rfq_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
  factory_id UUID REFERENCES factories(id) ON DELETE SET NULL,
  factory_name TEXT NOT NULL,
  factory_email TEXT NOT NULL,
  token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  quoted_unit_price NUMERIC,
  quoted_moq INTEGER,
  quoted_lead_time_weeks INTEGER,
  quoted_currency TEXT DEFAULT 'USD',
  quote_notes TEXT,
  responded_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rfq_recipients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brands_see_own_rfq_recipients" ON rfq_recipients FOR ALL
  USING (rfq_id IN (SELECT id FROM rfqs WHERE brand_id = auth.uid()));
CREATE POLICY "public_view_by_token" ON rfq_recipients FOR SELECT USING (true);
CREATE POLICY "public_update_by_token" ON rfq_recipients FOR UPDATE USING (true);
