-- Factory performance scores table
CREATE TABLE IF NOT EXISTS factory_performance_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factory_id UUID NOT NULL REFERENCES factories(id) ON DELETE CASCADE,
  -- Core metrics (0-100 each)
  qc_pass_rate NUMERIC(5,2) DEFAULT 0,
  on_time_rate NUMERIC(5,2) DEFAULT 0,
  response_time_score NUMERIC(5,2) DEFAULT 0,
  defect_rate_score NUMERIC(5,2) DEFAULT 0,
  revision_frequency_score NUMERIC(5,2) DEFAULT 0,
  brand_retention_score NUMERIC(5,2) DEFAULT 0,
  -- Weighted composite
  overall_score NUMERIC(5,2) DEFAULT 0,
  -- Tier derived from overall_score
  tier TEXT NOT NULL DEFAULT 'new' CHECK (tier IN ('new','monitored','verified','elite')),
  -- Raw counts used for calculation
  total_orders INTEGER DEFAULT 0,
  completed_orders INTEGER DEFAULT 0,
  qc_passes INTEGER DEFAULT 0,
  qc_fails INTEGER DEFAULT 0,
  critical_defects INTEGER DEFAULT 0,
  total_defect_reports INTEGER DEFAULT 0,
  avg_response_hours NUMERIC(8,2),
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(factory_id)
);

ALTER TABLE factory_performance_scores ENABLE ROW LEVEL SECURITY;

-- Factories can read their own score
CREATE POLICY "factory can read own score"
  ON factory_performance_scores FOR SELECT
  USING (
    factory_id IN (
      SELECT factory_id FROM factory_users WHERE user_id = auth.uid()
    )
  );

-- Brands can read scores for factories they work with
CREATE POLICY "brand can read scores for their factories"
  ON factory_performance_scores FOR SELECT
  USING (
    factory_id IN (
      SELECT factory_id FROM orders WHERE buyer_id = auth.uid()
    )
  );

-- Service role manages scores
CREATE POLICY "service role manages scores"
  ON factory_performance_scores FOR ALL
  USING (true);

CREATE INDEX IF NOT EXISTS idx_factory_scores_factory_id ON factory_performance_scores(factory_id);
CREATE INDEX IF NOT EXISTS idx_factory_scores_tier ON factory_performance_scores(tier);
CREATE INDEX IF NOT EXISTS idx_factory_scores_overall ON factory_performance_scores(overall_score DESC);

-- Add performance_score column to factories for directory sorting
ALTER TABLE factories ADD COLUMN IF NOT EXISTS performance_score NUMERIC(5,2) DEFAULT NULL;
ALTER TABLE factories ADD COLUMN IF NOT EXISTS score_tier TEXT DEFAULT NULL;
