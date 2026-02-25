
-- Fix overly permissive audit_log INSERT policy
DROP POLICY "System can insert audit log" ON public.audit_log;

CREATE POLICY "Authenticated users can insert audit log" ON public.audit_log
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
