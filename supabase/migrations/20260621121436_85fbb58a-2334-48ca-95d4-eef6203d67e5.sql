CREATE TABLE public.offer_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id uuid NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (offer_id, user_id)
);

GRANT SELECT, INSERT, DELETE ON public.offer_likes TO authenticated;
GRANT ALL ON public.offer_likes TO service_role;

ALTER TABLE public.offer_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone signed-in can read likes"
  ON public.offer_likes FOR SELECT TO authenticated USING (true);

CREATE POLICY "users like for themselves"
  ON public.offer_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "users unlike their own"
  ON public.offer_likes FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE INDEX idx_offer_likes_offer ON public.offer_likes(offer_id);
CREATE INDEX idx_offer_likes_user ON public.offer_likes(user_id);