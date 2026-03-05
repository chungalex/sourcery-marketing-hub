-- Messages table for in-order communication between brands and factories
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('brand', 'factory', 'admin')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Index for fast order message lookups
CREATE INDEX IF NOT EXISTS messages_order_id_idx ON public.messages(order_id, created_at);

-- RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages on orders they have access to
CREATE POLICY "Users can read messages on their orders"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = messages.order_id
        AND (o.buyer_id = auth.uid() OR o.factory_id IN (
          SELECT factory_id FROM public.factory_users WHERE user_id = auth.uid()
        ))
    )
  );

-- Users can insert messages on orders they have access to
CREATE POLICY "Users can send messages on their orders"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = messages.order_id
        AND (o.buyer_id = auth.uid() OR o.factory_id IN (
          SELECT factory_id FROM public.factory_users WHERE user_id = auth.uid()
        ))
    )
  );

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Factory reviews table
CREATE TABLE IF NOT EXISTS public.factory_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factory_id UUID NOT NULL REFERENCES public.factories(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  review_text TEXT,
  would_reorder BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(order_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS reviews_factory_id_idx ON public.factory_reviews(factory_id);

ALTER TABLE public.factory_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Reviews are publicly readable"
  ON public.factory_reviews FOR SELECT USING (true);

-- Only the order buyer can write a review
CREATE POLICY "Buyers can review their completed orders"
  ON public.factory_reviews FOR INSERT
  WITH CHECK (
    reviewer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = factory_reviews.order_id
        AND o.buyer_id = auth.uid()
        AND o.status IN ('closed', 'shipped', 'qc_pass', 'ready_to_ship')
    )
  );
