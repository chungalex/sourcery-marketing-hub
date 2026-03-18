CREATE TABLE IF NOT EXISTS revision_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  initiated_by UUID NOT NULL REFERENCES auth.users(id),
  round_number INTEGER NOT NULL DEFAULT 1,
  description TEXT NOT NULL,
  impact_timeline TEXT,
  impact_cost TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'disputed', 'resolved')),
  factory_acknowledged_at TIMESTAMPTZ,
  factory_acknowledged_by UUID REFERENCES auth.users(id),
  dispute_reason TEXT,
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE revision_rounds ENABLE ROW LEVEL SECURITY;

-- Brand can create and read revisions on their own orders
CREATE POLICY "brand can manage revisions on own orders"
  ON revision_rounds FOR ALL
  USING (
    order_id IN (SELECT id FROM orders WHERE brand_user_id = auth.uid())
  );

-- Factory can read and update (acknowledge/dispute) revisions on their orders
CREATE POLICY "factory can read revisions on their orders"
  ON revision_rounds FOR SELECT
  USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN factory_memberships fm ON fm.factory_id = o.factory_id
      WHERE fm.user_id = auth.uid()
    )
  );

CREATE POLICY "factory can acknowledge or dispute revisions"
  ON revision_rounds FOR UPDATE
  USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN factory_memberships fm ON fm.factory_id = o.factory_id
      WHERE fm.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_revision_rounds_order_id ON revision_rounds(order_id);
CREATE INDEX IF NOT EXISTS idx_revision_rounds_status ON revision_rounds(status);
