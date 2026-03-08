
-- Function to log price changes
CREATE OR REPLACE FUNCTION public.log_price_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only log if price actually changed or it's a new row
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.price IS DISTINCT FROM NEW.price) THEN
    INSERT INTO public.price_history (vendor_offer_id, price, currency)
    VALUES (NEW.id, NEW.price, NEW.currency);
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger on vendor_offers
CREATE TRIGGER trg_log_price_change
  AFTER INSERT OR UPDATE ON public.vendor_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.log_price_change();
