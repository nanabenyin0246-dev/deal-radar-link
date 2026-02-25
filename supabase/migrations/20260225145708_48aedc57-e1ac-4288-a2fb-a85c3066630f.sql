
-- Allow vendors to also select their own offers (even non-visible ones for dashboard)
CREATE POLICY "Vendors can view own offers"
  ON public.vendor_offers
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM vendors
    WHERE vendors.id = vendor_offers.vendor_id
    AND vendors.user_id = auth.uid()
  ));

-- Allow vendors to insert products
CREATE POLICY "Vendors can insert products"
  ON public.products
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'vendor'));

-- Allow vendors to update their own products (via vendor_offers link)
CREATE POLICY "Vendors can update products"
  ON public.products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM vendor_offers vo
      JOIN vendors v ON v.id = vo.vendor_id
      WHERE vo.product_id = products.id AND v.user_id = auth.uid()
    )
  );

-- Allow vendors to view own products (even inactive)
CREATE POLICY "Vendors can view own products"
  ON public.products
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vendor_offers vo
      JOIN vendors v ON v.id = vo.vendor_id
      WHERE vo.product_id = products.id AND v.user_id = auth.uid()
    )
  );
