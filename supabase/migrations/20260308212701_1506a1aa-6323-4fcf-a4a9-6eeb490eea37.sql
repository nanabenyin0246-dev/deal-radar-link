
CREATE OR REPLACE FUNCTION public.get_vendor_count()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT count(*)::integer FROM public.vendors;
$$;

CREATE OR REPLACE FUNCTION public.get_country_count()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT count(DISTINCT country)::integer FROM public.vendors;
$$;
