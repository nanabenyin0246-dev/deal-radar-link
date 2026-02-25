
-- Payment Providers table for provider strategy pattern
CREATE TABLE public.payment_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  supported_currencies text[] NOT NULL DEFAULT '{}',
  supported_countries text[] NOT NULL DEFAULT '{}',
  provider_type text NOT NULL DEFAULT 'payment_gateway',
  config jsonb NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  priority integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Payment providers visible to all" ON public.payment_providers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins manage payment providers" ON public.payment_providers
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Seed initial providers
INSERT INTO public.payment_providers (name, display_name, supported_currencies, supported_countries, provider_type, is_active, priority) VALUES
  ('paystack', 'Paystack', ARRAY['GHS','NGN','ZAR','USD','KES'], ARRAY['GH','NG','ZA','KE'], 'payment_gateway', true, 1),
  ('stripe', 'Stripe', ARRAY['USD','EUR','GBP','CAD','AUD'], ARRAY['US','GB','CA','AU','EU'], 'payment_gateway', false, 2),
  ('flutterwave', 'Flutterwave', ARRAY['GHS','NGN','KES','ZAR','USD'], ARRAY['GH','NG','KE','ZA'], 'payment_gateway', false, 3);

-- Add updated_at trigger
CREATE TRIGGER update_payment_providers_updated_at
  BEFORE UPDATE ON public.payment_providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
