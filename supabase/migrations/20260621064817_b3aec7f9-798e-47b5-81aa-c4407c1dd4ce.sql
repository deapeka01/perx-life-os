
-- Switch next_invoice_number to SECURITY INVOKER and grant sequence usage instead
CREATE OR REPLACE FUNCTION public.next_invoice_number()
RETURNS text LANGUAGE sql VOLATILE SECURITY INVOKER SET search_path = public AS $$
  SELECT 'PER-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.invoice_number_seq')::text, 6, '0')
$$;
GRANT USAGE ON SEQUENCE public.invoice_number_seq TO authenticated, service_role;

-- Add explicit DELETE policy on invoices (parties may cancel by deleting drafts)
CREATE POLICY "parties delete invoices" ON public.invoices FOR DELETE TO authenticated
  USING ((payer_user_id = auth.uid() OR payee_user_id = auth.uid()) AND status IN ('pending', 'cancelled'));
