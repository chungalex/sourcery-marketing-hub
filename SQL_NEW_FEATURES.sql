
-- Run in Supabase SQL editor for new features:

-- SKU tracking
CREATE TABLE IF NOT EXISTS order_skus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  sku_code TEXT NOT NULL,
  colourway TEXT,
  size TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE order_skus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_manage_skus" ON order_skus FOR ALL
  USING (order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid())
    OR order_id IN (SELECT o.id FROM orders o JOIN factory_members fm ON fm.factory_id = o.factory_id WHERE fm.user_id = auth.uid()));

-- Production photos
CREATE TABLE IF NOT EXISTS production_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  caption TEXT,
  uploaded_by_role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE production_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_parties_see_photos" ON production_photos FOR ALL
  USING (order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid())
    OR order_id IN (SELECT o.id FROM orders o JOIN factory_members fm ON fm.factory_id = o.factory_id WHERE fm.user_id = auth.uid()));

-- Approval requests (timezone feature)
CREATE TABLE IF NOT EXISTS approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  requested_by_role TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  brand_timezone TEXT DEFAULT 'America/New_York',
  factory_timezone TEXT DEFAULT 'Asia/Ho_Chi_Minh',
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_parties_manage_approvals" ON approval_requests FOR ALL
  USING (order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid())
    OR order_id IN (SELECT o.id FROM orders o JOIN factory_members fm ON fm.factory_id = o.factory_id WHERE fm.user_id = auth.uid()));

-- Shipment documents
CREATE TABLE IF NOT EXISTS shipment_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE shipment_docs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_parties_manage_shipment_docs" ON shipment_docs FOR ALL
  USING (order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid())
    OR order_id IN (SELECT o.id FROM orders o JOIN factory_members fm ON fm.factory_id = o.factory_id WHERE fm.user_id = auth.uid()));

-- Brand profiles (for onboarding data)
CREATE TABLE IF NOT EXISTS brand_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  brand_name TEXT,
  product_category TEXT,
  stage TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_profile" ON brand_profiles FOR ALL USING (user_id = auth.uid());


-- Bill of materials table
CREATE TABLE IF NOT EXISTS order_bom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'fabric',
  supplier TEXT,
  unit TEXT DEFAULT 'metres',
  qty_per_garment DECIMAL(10,3) DEFAULT 1,
  total_qty DECIMAL(10,3),
  unit_cost DECIMAL(10,2) DEFAULT 0,
  colour_ref TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Shipment tracking table
CREATE TABLE IF NOT EXISTS shipment_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  carrier TEXT NOT NULL,
  tracking_number TEXT NOT NULL,
  status TEXT DEFAULT 'booked',
  origin_port TEXT,
  destination_port TEXT,
  vessel_name TEXT,
  estimated_arrival TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE order_bom ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "order_bom_access" ON order_bom
  USING (order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid() OR factory_id IN (SELECT factory_id FROM factory_members WHERE user_id = auth.uid())));

ALTER TABLE shipment_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "shipment_tracking_access" ON shipment_tracking
  USING (order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid() OR factory_id IN (SELECT factory_id FROM factory_members WHERE user_id = auth.uid())));
