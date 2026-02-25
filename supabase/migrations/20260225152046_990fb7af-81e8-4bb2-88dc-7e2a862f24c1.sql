
-- Order status enum
CREATE TYPE public.order_status AS ENUM (
  'pending', 'paid', 'shipped', 'delivered', 'completed', 'disputed', 'refunded', 'cancelled'
);

-- Dispute status enum
CREATE TYPE public.dispute_status AS ENUM (
  'open', 'vendor_responded', 'admin_review', 'resolved_buyer', 'resolved_vendor', 'resolved_split', 'closed'
);

-- Orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL,
  vendor_offer_id uuid REFERENCES public.vendor_offers(id) NOT NULL,
  vendor_id uuid REFERENCES public.vendors(id) NOT NULL,
  product_id uuid REFERENCES public.products(id) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  currency text NOT NULL DEFAULT 'GHS',
  commission_rate numeric NOT NULL DEFAULT 0.08,
  commission_amount numeric NOT NULL DEFAULT 0,
  status order_status NOT NULL DEFAULT 'pending',
  payment_method text, -- 'whatsapp', 'momo_mtn', 'momo_vodafone', 'momo_airteltigo', 'card', 'paystack'
  payment_reference text,
  payment_phone_hash text, -- hashed mobile money phone
  shipping_address text,
  tracking_number text,
  delivered_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Buyers see own orders
CREATE POLICY "Buyers can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = buyer_id);

-- Vendors see orders for their products
CREATE POLICY "Vendors can view their orders" ON public.orders
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM vendors WHERE vendors.id = orders.vendor_id AND vendors.user_id = auth.uid()
  ));

-- Admins manage all orders
CREATE POLICY "Admins can manage orders" ON public.orders
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can create orders
CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Vendors can update order status
CREATE POLICY "Vendors can update order status" ON public.orders
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM vendors WHERE vendors.id = orders.vendor_id AND vendors.user_id = auth.uid()
  ));

-- Disputes table
CREATE TABLE public.disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) NOT NULL,
  opened_by uuid NOT NULL,
  reason text NOT NULL,
  description text,
  status dispute_status NOT NULL DEFAULT 'open',
  vendor_response text,
  admin_decision text,
  resolution_amount numeric,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dispute parties can view" ON public.disputes
  FOR SELECT USING (
    auth.uid() = opened_by 
    OR EXISTS (
      SELECT 1 FROM orders o JOIN vendors v ON v.id = o.vendor_id 
      WHERE o.id = disputes.order_id AND v.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can open disputes" ON public.disputes
  FOR INSERT WITH CHECK (auth.uid() = opened_by);

CREATE POLICY "Vendors can respond to disputes" ON public.disputes
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM orders o JOIN vendors v ON v.id = o.vendor_id 
    WHERE o.id = disputes.order_id AND v.user_id = auth.uid()
  ));

CREATE POLICY "Admins manage disputes" ON public.disputes
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Audit log for all significant actions
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL, -- 'order', 'dispute', 'vendor', 'product'
  entity_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log" ON public.audit_log
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert audit log" ON public.audit_log
  FOR INSERT WITH CHECK (true);

-- Vendor agreement acceptance log
CREATE TABLE public.vendor_agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES public.vendors(id) NOT NULL,
  user_id uuid NOT NULL,
  agreement_version text NOT NULL DEFAULT '1.0',
  accepted_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text
);

ALTER TABLE public.vendor_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view own agreements" ON public.vendor_agreements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Vendors can insert agreement" ON public.vendor_agreements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all agreements" ON public.vendor_agreements
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Commission tracking table
CREATE TABLE public.commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) NOT NULL,
  vendor_id uuid REFERENCES public.vendors(id) NOT NULL,
  gross_amount numeric NOT NULL,
  commission_rate numeric NOT NULL DEFAULT 0.08,
  commission_amount numeric NOT NULL,
  vendor_payout numeric NOT NULL,
  currency text NOT NULL DEFAULT 'GHS',
  vat_amount numeric DEFAULT 0,
  vat_rate numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'pending', -- pending, paid, settled
  settled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view own commissions" ON public.commissions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM vendors WHERE vendors.id = commissions.vendor_id AND vendors.user_id = auth.uid()
  ));

CREATE POLICY "Admins manage commissions" ON public.commissions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Prohibited items checklist for vendor onboarding
CREATE TABLE public.prohibited_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.prohibited_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view prohibited items" ON public.prohibited_items
  FOR SELECT USING (true);

CREATE POLICY "Admins manage prohibited items" ON public.prohibited_items
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add fraud_flagged to vendors
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS fraud_flagged boolean DEFAULT false;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS suspended_at timestamptz;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS suspension_reason text;
