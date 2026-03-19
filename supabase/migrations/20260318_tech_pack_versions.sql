CREATE TABLE IF NOT EXISTS tech_pack_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  notes TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  factory_acknowledged_at TIMESTAMPTZ,
  factory_acknowledged_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE tech_pack_versions ENABLE ROW LEVEL SECURITY;

-- Brand can insert and read versions on their own orders
CREATE POLICY "brand can manage tech pack versions"
  ON tech_pack_versions FOR ALL
  USING (
    order_id IN (SELECT id FROM orders WHERE brand_user_id = auth.uid())
  );

-- Factory can read and acknowledge versions on their assigned orders
CREATE POLICY "factory can read tech pack versions"
  ON tech_pack_versions FOR SELECT
  USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN factory_users fm ON fm.factory_id = o.factory_id
      WHERE fm.user_id = auth.uid()
    )
  );

CREATE POLICY "factory can acknowledge tech pack versions"
  ON tech_pack_versions FOR UPDATE
  USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN factory_users fm ON fm.factory_id = o.factory_id
      WHERE fm.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_tech_pack_versions_order_id ON tech_pack_versions(order_id);
