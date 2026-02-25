
-- Product translations table for i18n
CREATE TABLE public.product_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  language_code text NOT NULL DEFAULT 'en',
  name text NOT NULL,
  description text,
  auto_translated boolean DEFAULT false,
  approved boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_id, language_code)
);

ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Translations visible to all" ON public.product_translations FOR SELECT USING (true);
CREATE POLICY "Vendors can manage translations" ON public.product_translations FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM vendor_offers vo JOIN vendors v ON v.id = vo.vendor_id WHERE vo.product_id = product_translations.product_id AND v.user_id = auth.uid())
);
CREATE POLICY "Vendors can update translations" ON public.product_translations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM vendor_offers vo JOIN vendors v ON v.id = vo.vendor_id WHERE vo.product_id = product_translations.product_id AND v.user_id = auth.uid())
);
CREATE POLICY "Admins manage translations" ON public.product_translations FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_product_translations_updated_at BEFORE UPDATE ON public.product_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
