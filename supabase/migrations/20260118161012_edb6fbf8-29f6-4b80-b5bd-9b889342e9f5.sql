-- Phase 1: Marketplace Foundation + Inquiry Funnel
-- With all CTO adjustments + performance indexes

-- 1. Create inquiry_conversion_status enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inquiry_conversion_status') THEN
    CREATE TYPE public.inquiry_conversion_status AS ENUM ('new', 'replied', 'converted', 'declined');
  END IF;
END$$;

-- 2. Create factory_pricing_bands table
CREATE TABLE public.factory_pricing_bands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  factory_id uuid NOT NULL REFERENCES public.factories(id) ON DELETE CASCADE,
  min_quantity integer NOT NULL,
  max_quantity integer NOT NULL,
  price_range_low numeric NOT NULL,
  price_range_high numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  unit text NOT NULL DEFAULT 'per_piece',
  assumptions jsonb NOT NULL DEFAULT '{}'::jsonb,
  effective_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT min_less_than_max CHECK (min_quantity < max_quantity),
  CONSTRAINT low_less_than_high CHECK (price_range_low <= price_range_high),
  CONSTRAINT uniq_factory_band UNIQUE (factory_id, min_quantity, max_quantity, currency, unit)
);

-- Performance index
CREATE INDEX IF NOT EXISTS idx_factory_pricing_bands_factory_id
ON public.factory_pricing_bands (factory_id);

-- Enable RLS on factory_pricing_bands
ALTER TABLE public.factory_pricing_bands ENABLE ROW LEVEL SECURITY;

-- RLS: Authenticated users only can view pricing bands
CREATE POLICY "Authenticated users can view pricing bands"
  ON public.factory_pricing_bands FOR SELECT
  TO authenticated
  USING (true);

-- RLS: Factory owners/admins can insert pricing bands
CREATE POLICY "Factory owners can insert pricing bands"
  ON public.factory_pricing_bands FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.factory_users fu
      WHERE fu.factory_id = factory_pricing_bands.factory_id
        AND fu.user_id = auth.uid()
        AND fu.role IN ('owner', 'admin')
    )
    OR public.has_role(auth.uid(), 'admin')
  );

-- RLS: Factory owners/admins can update pricing bands
CREATE POLICY "Factory owners can update pricing bands"
  ON public.factory_pricing_bands FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.factory_users fu
      WHERE fu.factory_id = factory_pricing_bands.factory_id
        AND fu.user_id = auth.uid()
        AND fu.role IN ('owner', 'admin')
    )
    OR public.has_role(auth.uid(), 'admin')
  );

-- RLS: Factory owners/admins can delete pricing bands
CREATE POLICY "Factory owners can delete pricing bands"
  ON public.factory_pricing_bands FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.factory_users fu
      WHERE fu.factory_id = factory_pricing_bands.factory_id
        AND fu.user_id = auth.uid()
        AND fu.role IN ('owner', 'admin')
    )
    OR public.has_role(auth.uid(), 'admin')
  );

-- 3. Add inquiry conversion tracking columns
ALTER TABLE public.inquiries 
  ADD COLUMN IF NOT EXISTS order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS conversion_status public.inquiry_conversion_status NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS converted_at timestamptz;

-- Performance indexes for inquiry queries
CREATE INDEX IF NOT EXISTS idx_inquiries_conversion_status
ON public.inquiries (conversion_status);

-- 4. RLS Tightening: Remove buyer INSERT on order_milestones
DROP POLICY IF EXISTS "order_milestones_buyer_insert" ON public.order_milestones;