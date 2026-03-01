
-- Create a function to get total products count
CREATE OR REPLACE FUNCTION public.get_products_count()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT count(*)::integer FROM public.products WHERE is_active = true;
$$;

-- Create a function to get orders by status
CREATE OR REPLACE FUNCTION public.get_orders_by_status()
RETURNS TABLE(status text, count bigint, total_revenue numeric)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT status::text, count(*), coalesce(sum(total_price), 0)
  FROM public.orders
  GROUP BY status;
$$;
