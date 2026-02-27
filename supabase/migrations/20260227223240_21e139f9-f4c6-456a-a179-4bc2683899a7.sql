
-- Commission configuration table for milestone-based monetization
CREATE TABLE public.commission_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  commission_rate numeric NOT NULL DEFAULT 0,
  commission_active boolean NOT NULL DEFAULT false,
  activation_threshold integer NOT NULL DEFAULT 1000,
  commission_activated_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert default config (0% commission, inactive)
INSERT INTO public.commission_config (commission_rate, commission_active, activation_threshold)
VALUES (0, false, 1000);

-- RLS policies
ALTER TABLE public.commission_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read commission config"
  ON public.commission_config FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage commission config"
  ON public.commission_config FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to get total registered users count
CREATE OR REPLACE FUNCTION public.get_user_count()
  RETURNS integer
  LANGUAGE sql
  STABLE SECURITY DEFINER
  SET search_path TO 'public'
AS $$
  SELECT count(*)::integer FROM public.profiles;
$$;
