
-- Revoke direct write access where only server-side code should write
REVOKE INSERT, UPDATE ON public.wallets FROM authenticated;
REVOKE INSERT ON public.wallet_transactions FROM authenticated;

-- Tighten benefit_requests update policy (replace WITH CHECK (true))
DROP POLICY IF EXISTS "req_company_decide" ON public.benefit_requests;
CREATE POLICY "req_company_decide" ON public.benefit_requests FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.companies c WHERE c.id = company_id AND c.owner_user_id = auth.uid())
    OR employee_user_id = auth.uid()
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.companies c WHERE c.id = company_id AND c.owner_user_id = auth.uid())
    OR employee_user_id = auth.uid()
  );

-- Lock down SECURITY DEFINER helpers — only service_role / postgres may execute
REVOKE EXECUTE ON FUNCTION public.provision_wallet_for_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.next_invoice_number() FROM PUBLIC, anon, authenticated;
-- redeem_invitation_code MUST stay callable by authenticated users (it's an RPC)
-- has_role is intentionally callable; keep as-is.
