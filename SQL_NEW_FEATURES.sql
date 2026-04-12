
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
