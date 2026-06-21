
-- Lock down invitation_codes: remove broad SELECT/UPDATE; redemption now happens via SECURITY DEFINER RPC.
DROP POLICY IF EXISTS "Authenticated can read codes" ON public.invitation_codes;
DROP POLICY IF EXISTS "Authenticated can decrement codes" ON public.invitation_codes;
REVOKE SELECT, UPDATE ON public.invitation_codes FROM authenticated, anon;

-- Atomic, validated redemption. Runs as definer so caller doesn't need direct access to invitation_codes.
CREATE OR REPLACE FUNCTION public.redeem_invitation_code(_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user uuid := auth.uid();
  _normalized text := upper(trim(_code));
  _invite public.invitation_codes%ROWTYPE;
BEGIN
  IF _user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Not signed in');
  END IF;

  UPDATE public.invitation_codes
     SET uses_left = uses_left - 1
   WHERE code = _normalized
     AND uses_left > 0
  RETURNING * INTO _invite;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Invalid or expired code.');
  END IF;

  UPDATE public.profiles SET company_id = _invite.company_id WHERE id = _user;
  DELETE FROM public.user_roles WHERE user_id = _user;
  INSERT INTO public.user_roles (user_id, role) VALUES (_user, _invite.role);

  RETURN jsonb_build_object('ok', true, 'role', _invite.role);
END;
$$;

REVOKE ALL ON FUNCTION public.redeem_invitation_code(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_invitation_code(text) TO authenticated;

-- Trigger-only functions should not be callable by signed-in users.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
