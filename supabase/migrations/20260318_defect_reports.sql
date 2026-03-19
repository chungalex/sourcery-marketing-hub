CREATE TABLE IF NOT EXISTS defect_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES auth.users(id),
  defect_type TEXT NOT NULL CHECK (defect_type IN ('stitching','measurement','colorway','finishing','hardware','packaging','fabric','other')),
  severity TEXT NOT NULL CHECK (severity IN ('minor','major','critical')),
  quantity_affected INTEGER NOT NULL DEFAULT 0,
  percentage_affected NUMERIC(5,2),
  description TEXT NOT NULL,
  photo_urls TEXT[] DEFAULT '{}',
  factory_response TEXT,
  factory_responded_at TIMESTAMPTZ,
  factory_responded_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','acknowledged','disputed','resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE defect_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "brand can create and read defect reports on own orders"
  ON defect_reports FOR ALL
  USING (
    order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid())
  );

CREATE POLICY "factory can read defect reports on their orders"
  ON defect_reports FOR SELECT
  USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN factory_users fm ON fm.factory_id = o.factory_id
      WHERE fm.user_id = auth.uid()
    )
  );

CREATE POLICY "factory can respond to defect reports"
  ON defect_reports FOR UPDATE
  USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN factory_users fm ON fm.factory_id = o.factory_id
      WHERE fm.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_defect_reports_order_id ON defect_reports(order_id);
CREATE INDEX IF NOT EXISTS idx_defect_reports_severity ON defect_reports(severity);
