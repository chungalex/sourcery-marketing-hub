-- Sample submissions: factory uploads sample details for brand review
CREATE TABLE IF NOT EXISTS sample_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES auth.users(id),
  round INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  measurements JSONB,
  photo_urls TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'revision_requested')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sample revisions: brand's feedback when requesting changes
CREATE TABLE IF NOT EXISTS sample_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_submission_id UUID NOT NULL REFERENCES sample_submissions(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  requested_by UUID NOT NULL REFERENCES auth.users(id),
  revision_notes TEXT NOT NULL,
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE sample_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sample_revisions ENABLE ROW LEVEL SECURITY;

-- sample_submissions: factory (submitted_by) can insert/read their own
-- brand can read submissions for their orders
CREATE POLICY "factory can manage own submissions"
  ON sample_submissions
  FOR ALL
  USING (submitted_by = auth.uid());

CREATE POLICY "brand can read submissions on their orders"
  ON sample_submissions
  FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE brand_user_id = auth.uid()
    )
  );

CREATE POLICY "brand can update submission status"
  ON sample_submissions
  FOR UPDATE
  USING (
    order_id IN (
      SELECT id FROM orders WHERE brand_user_id = auth.uid()
    )
  );

-- sample_revisions: brand can insert, factory can read
CREATE POLICY "brand can create revisions"
  ON sample_revisions
  FOR INSERT
  WITH CHECK (requested_by = auth.uid());

CREATE POLICY "all parties can read revisions on their orders"
  ON sample_revisions
  FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE brand_user_id = auth.uid()
    )
    OR
    requested_by = auth.uid()
    OR
    order_id IN (
      SELECT o.id FROM orders o
      JOIN factory_users fm ON fm.factory_id = o.factory_id
      WHERE fm.user_id = auth.uid()
    )
  );

CREATE POLICY "factory can acknowledge revisions"
  ON sample_revisions
  FOR UPDATE
  USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN factory_users fm ON fm.factory_id = o.factory_id
      WHERE fm.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sample_submissions_order_id ON sample_submissions(order_id);
CREATE INDEX IF NOT EXISTS idx_sample_revisions_order_id ON sample_revisions(order_id);
CREATE INDEX IF NOT EXISTS idx_sample_revisions_submission_id ON sample_revisions(sample_submission_id);
