
-- Create product_submissions table
CREATE TABLE public.product_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  image_url TEXT,
  brand TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID
);

-- Enable RLS
ALTER TABLE public.product_submissions ENABLE ROW LEVEL SECURITY;

-- Vendors can insert their own submissions
CREATE POLICY "Vendors can insert own submissions"
  ON public.product_submissions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.vendors WHERE vendors.id = product_submissions.vendor_id AND vendors.user_id = auth.uid()
  ));

-- Vendors can view own submissions
CREATE POLICY "Vendors can view own submissions"
  ON public.product_submissions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.vendors WHERE vendors.id = product_submissions.vendor_id AND vendors.user_id = auth.uid()
  ));

-- Admins can manage all submissions
CREATE POLICY "Admins manage submissions"
  ON public.product_submissions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));
