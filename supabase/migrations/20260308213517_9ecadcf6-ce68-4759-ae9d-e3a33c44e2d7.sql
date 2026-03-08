
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  referred_email TEXT,
  referred_vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Vendors can view their own referrals
CREATE POLICY "Vendors can view own referrals"
  ON public.referrals FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.vendors WHERE vendors.id = referrals.referrer_vendor_id AND vendors.user_id = auth.uid()
  ));

-- Vendors can insert referrals
CREATE POLICY "Vendors can insert referrals"
  ON public.referrals FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.vendors WHERE vendors.id = referrals.referrer_vendor_id AND vendors.user_id = auth.uid()
  ));

-- Admins manage all
CREATE POLICY "Admins manage referrals"
  ON public.referrals FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow authenticated users to insert (for signup flow recording referral)
CREATE POLICY "Auth users can record referral on signup"
  ON public.referrals FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
