
-- Product reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id),
  order_id UUID REFERENCES public.orders(id),
  rating INTEGER NOT NULL,
  title TEXT,
  body TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(order_id, user_id)
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews" ON public.product_reviews FOR SELECT USING (true);
CREATE POLICY "Buyers can write reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wishlists table
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own wishlist select" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own wishlist insert" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own wishlist delete" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- Batch platform stats RPC
CREATE OR REPLACE FUNCTION public.get_platform_stats()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT json_build_object(
    'products', (SELECT COUNT(*)::integer FROM products WHERE is_active = true),
    'vendors', (SELECT COUNT(*)::integer FROM vendors WHERE status = 'approved'),
    'countries', (SELECT COUNT(DISTINCT country)::integer FROM vendors WHERE status = 'approved')
  );
$$;

-- Add validation trigger for rating range instead of CHECK constraint
CREATE OR REPLACE FUNCTION public.validate_review_rating()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_review_rating_trigger
  BEFORE INSERT OR UPDATE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.validate_review_rating();
