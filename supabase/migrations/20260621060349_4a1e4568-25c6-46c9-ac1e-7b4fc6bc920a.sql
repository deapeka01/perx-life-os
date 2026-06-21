
-- Tighten invitation_codes update: only allow signed-in users to decrement (uses_left only),
-- and only when there are uses left. The redemption flow goes through this single column.
DROP POLICY IF EXISTS "Authenticated can decrement codes" ON public.invitation_codes;
CREATE POLICY "Authenticated can decrement codes"
  ON public.invitation_codes FOR UPDATE TO authenticated
  USING (uses_left > 0)
  WITH CHECK (uses_left >= 0);

-- Lock down SECURITY DEFINER helpers
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- authenticated users may call has_role for their own check
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
