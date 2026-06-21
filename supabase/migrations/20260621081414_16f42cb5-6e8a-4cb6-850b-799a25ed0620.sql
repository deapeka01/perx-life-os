
-- ─────────────────────────── ENUMS ───────────────────────────
CREATE TYPE public.wallet_kind AS ENUM ('employee','company','provider');
CREATE TYPE public.txn_kind AS ENUM ('topup','allocation','spend','refund','payout','reward','adjustment');
CREATE TYPE public.offer_kind AS ENUM ('single','package','bundle');
CREATE TYPE public.offer_status AS ENUM ('draft','active','archived');
CREATE TYPE public.request_status AS ENUM ('pending','approved','rejected','fulfilled','cancelled');
CREATE TYPE public.verification_status AS ENUM ('pending','verified','rejected');
CREATE TYPE public.quest_scope AS ENUM ('global','company');
CREATE TYPE public.campaign_channel AS ENUM ('instagram','facebook','linkedin','tiktok');
CREATE TYPE public.campaign_status AS ENUM ('draft','scheduled','published');

-- ─────────────────────── COMPANIES extend ────────────────────
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS industry text,
  ADD COLUMN IF NOT EXISTS registration_number text,
  ADD COLUMN IF NOT EXISTS tax_number text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS verification_status public.verification_status NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS monthly_budget_all bigint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS owner_user_id uuid,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
GRANT SELECT ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;

-- Companies policy: any signed-in user can read company directory (names only used widely)
DROP POLICY IF EXISTS "companies_select_all_auth" ON public.companies;
CREATE POLICY "companies_select_all_auth" ON public.companies FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "companies_update_owner" ON public.companies;
CREATE POLICY "companies_update_owner" ON public.companies FOR UPDATE TO authenticated
  USING (owner_user_id = auth.uid()) WITH CHECK (owner_user_id = auth.uid());

-- ─────────────────────────── WALLETS ─────────────────────────
CREATE TABLE public.wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind public.wallet_kind NOT NULL,
  balance_all bigint NOT NULL DEFAULT 0,
  monthly_allowance_all bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_user_id, kind)
);
GRANT SELECT, INSERT, UPDATE ON public.wallets TO authenticated;
GRANT ALL ON public.wallets TO service_role;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wallets_owner_read" ON public.wallets FOR SELECT TO authenticated USING (owner_user_id = auth.uid());
CREATE POLICY "wallets_owner_update" ON public.wallets FOR UPDATE TO authenticated USING (owner_user_id = auth.uid()) WITH CHECK (owner_user_id = auth.uid());
CREATE TRIGGER trg_wallets_updated BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  kind public.txn_kind NOT NULL,
  amount_all bigint NOT NULL,
  balance_after bigint NOT NULL,
  description text NOT NULL,
  related_request_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_wallet_txn_wallet ON public.wallet_transactions(wallet_id, created_at DESC);
GRANT SELECT, INSERT ON public.wallet_transactions TO authenticated;
GRANT ALL ON public.wallet_transactions TO service_role;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "txn_owner_read" ON public.wallet_transactions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.wallets w WHERE w.id = wallet_id AND w.owner_user_id = auth.uid()));

-- ─────────────────────────── BENEFIT DNA ─────────────────────
CREATE TABLE public.benefit_dna (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  primary_archetype text NOT NULL,
  secondary_archetype text,
  archetypes jsonb NOT NULL DEFAULT '[]'::jsonb,
  goals jsonb NOT NULL DEFAULT '[]'::jsonb,
  interests jsonb NOT NULL DEFAULT '[]'::jsonb,
  recommended_categories jsonb NOT NULL DEFAULT '[]'::jsonb,
  raw jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.benefit_dna TO authenticated;
GRANT ALL ON public.benefit_dna TO service_role;
ALTER TABLE public.benefit_dna ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dna_self" ON public.benefit_dna FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER trg_dna_updated BEFORE UPDATE ON public.benefit_dna FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────── PROVIDERS ───────────────────────
CREATE TABLE public.providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  category text NOT NULL,
  description text,
  logo_url text,
  cover_url text,
  registration_number text,
  tax_number text,
  social jsonb NOT NULL DEFAULT '{}'::jsonb,
  brand jsonb NOT NULL DEFAULT '{}'::jsonb,
  verification_status public.verification_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.providers TO authenticated;
GRANT INSERT, UPDATE ON public.providers TO authenticated;
GRANT ALL ON public.providers TO service_role;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "providers_read_all_auth" ON public.providers FOR SELECT TO authenticated USING (true);
CREATE POLICY "providers_owner_write" ON public.providers FOR INSERT TO authenticated WITH CHECK (owner_user_id = auth.uid());
CREATE POLICY "providers_owner_update" ON public.providers FOR UPDATE TO authenticated USING (owner_user_id = auth.uid()) WITH CHECK (owner_user_id = auth.uid());
CREATE TRIGGER trg_providers_updated BEFORE UPDATE ON public.providers FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────── OFFERS ──────────────────────────
CREATE TABLE public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  price_all bigint NOT NULL,
  kind public.offer_kind NOT NULL DEFAULT 'single',
  status public.offer_status NOT NULL DEFAULT 'active',
  image_url text,
  capacity int,
  bookings int NOT NULL DEFAULT 0,
  tags text[] NOT NULL DEFAULT '{}',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_offers_provider ON public.offers(provider_id);
CREATE INDEX idx_offers_status ON public.offers(status);
GRANT SELECT ON public.offers TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.offers TO authenticated;
GRANT ALL ON public.offers TO service_role;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "offers_read_active_or_owner" ON public.offers FOR SELECT TO authenticated
  USING (status = 'active' OR EXISTS (SELECT 1 FROM public.providers p WHERE p.id = provider_id AND p.owner_user_id = auth.uid()));
CREATE POLICY "offers_owner_write" ON public.offers FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.providers p WHERE p.id = provider_id AND p.owner_user_id = auth.uid()));
CREATE POLICY "offers_owner_update" ON public.offers FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.providers p WHERE p.id = provider_id AND p.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.providers p WHERE p.id = provider_id AND p.owner_user_id = auth.uid()));
CREATE POLICY "offers_owner_delete" ON public.offers FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.providers p WHERE p.id = provider_id AND p.owner_user_id = auth.uid()));
CREATE TRIGGER trg_offers_updated BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────── BENEFIT REQUESTS ────────────────────
CREATE TABLE public.benefit_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  offer_id uuid REFERENCES public.offers(id) ON DELETE SET NULL,
  provider_id uuid REFERENCES public.providers(id) ON DELETE SET NULL,
  title text NOT NULL,
  amount_all bigint NOT NULL,
  status public.request_status NOT NULL DEFAULT 'pending',
  employee_message text,
  ai_note text,
  decision_note text,
  decided_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  decided_at timestamptz,
  fulfilled_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_req_employee ON public.benefit_requests(employee_user_id, created_at DESC);
CREATE INDEX idx_req_company ON public.benefit_requests(company_id, status, created_at DESC);
CREATE INDEX idx_req_provider ON public.benefit_requests(provider_id, status, created_at DESC);
GRANT SELECT, INSERT, UPDATE ON public.benefit_requests TO authenticated;
GRANT ALL ON public.benefit_requests TO service_role;
ALTER TABLE public.benefit_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "req_employee_read" ON public.benefit_requests FOR SELECT TO authenticated
  USING (employee_user_id = auth.uid()
      OR EXISTS (SELECT 1 FROM public.companies c WHERE c.id = company_id AND c.owner_user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM public.providers p WHERE p.id = provider_id AND p.owner_user_id = auth.uid()));
CREATE POLICY "req_employee_insert" ON public.benefit_requests FOR INSERT TO authenticated
  WITH CHECK (employee_user_id = auth.uid());
CREATE POLICY "req_company_decide" ON public.benefit_requests FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.companies c WHERE c.id = company_id AND c.owner_user_id = auth.uid())
      OR employee_user_id = auth.uid())
  WITH CHECK (true);
CREATE TRIGGER trg_req_updated BEFORE UPDATE ON public.benefit_requests FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────────── NOTIFICATIONS ───────────────────
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  title text NOT NULL,
  body text,
  read boolean NOT NULL DEFAULT false,
  action_url text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_notif_user ON public.notifications(user_id, read, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_self" ON public.notifications FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ─────────────────────────── QUESTS ──────────────────────────
CREATE TABLE public.quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope public.quest_scope NOT NULL DEFAULT 'global',
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text,
  reward_all bigint NOT NULL DEFAULT 0,
  badge_emoji text,
  target_progress int NOT NULL DEFAULT 100,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.quests TO authenticated;
GRANT ALL ON public.quests TO service_role;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quests_read_all_auth" ON public.quests FOR SELECT TO authenticated USING (active);

CREATE TABLE public.quest_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id uuid NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  progress int NOT NULL DEFAULT 0,
  completed_at timestamptz,
  claimed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, quest_id)
);
GRANT SELECT, INSERT, UPDATE ON public.quest_progress TO authenticated;
GRANT ALL ON public.quest_progress TO service_role;
ALTER TABLE public.quest_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qp_self" ON public.quest_progress FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER trg_qp_updated BEFORE UPDATE ON public.quest_progress FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────── DEMAND INSIGHTS ─────────────────────
CREATE TABLE public.demand_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES public.providers(id) ON DELETE CASCADE,
  category text NOT NULL,
  segment text NOT NULL,
  employees_interested int NOT NULL DEFAULT 0,
  trend text,
  headline text,
  recommendation text,
  generated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.demand_insights TO authenticated;
GRANT ALL ON public.demand_insights TO service_role;
ALTER TABLE public.demand_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "demand_read_all_auth" ON public.demand_insights FOR SELECT TO authenticated USING (true);

-- ─────────────────────── MARKETING CAMPAIGNS ─────────────────
CREATE TABLE public.marketing_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  title text NOT NULL,
  channel public.campaign_channel NOT NULL,
  content text NOT NULL,
  image_url text,
  status public.campaign_status NOT NULL DEFAULT 'draft',
  scheduled_for timestamptz,
  analytics jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_camp_provider ON public.marketing_campaigns(provider_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketing_campaigns TO authenticated;
GRANT ALL ON public.marketing_campaigns TO service_role;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "camp_owner" ON public.marketing_campaigns FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.providers p WHERE p.id = provider_id AND p.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.providers p WHERE p.id = provider_id AND p.owner_user_id = auth.uid()));
CREATE TRIGGER trg_camp_updated BEFORE UPDATE ON public.marketing_campaigns FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─────────────────────── STRATEGY REPORTS ────────────────────
CREATE TABLE public.strategy_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  kind text NOT NULL,
  title text NOT NULL,
  summary text,
  insights jsonb NOT NULL DEFAULT '[]'::jsonb,
  generated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_report_company ON public.strategy_reports(company_id, generated_at DESC);
GRANT SELECT, INSERT ON public.strategy_reports TO authenticated;
GRANT ALL ON public.strategy_reports TO service_role;
ALTER TABLE public.strategy_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "report_company_owner" ON public.strategy_reports FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.companies c WHERE c.id = company_id AND c.owner_user_id = auth.uid()));

-- ─────────────── AUTO-PROVISION WALLET ON ROLE ───────────────
CREATE OR REPLACE FUNCTION public.provision_wallet_for_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _allowance bigint := 0;
  _starting bigint := 0;
BEGIN
  IF NEW.role::text = 'employee' THEN
    _allowance := 50000;
    _starting := 50000;
  END IF;
  INSERT INTO public.wallets (owner_user_id, kind, balance_all, monthly_allowance_all)
  VALUES (NEW.user_id, NEW.role::text::public.wallet_kind, _starting, _allowance)
  ON CONFLICT (owner_user_id, kind) DO NOTHING;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_provision_wallet ON public.user_roles;
CREATE TRIGGER trg_provision_wallet AFTER INSERT ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.provision_wallet_for_role();

-- Backfill wallets for existing users
INSERT INTO public.wallets (owner_user_id, kind, balance_all, monthly_allowance_all)
SELECT ur.user_id, ur.role::text::public.wallet_kind,
       CASE WHEN ur.role::text = 'employee' THEN 50000 ELSE 0 END,
       CASE WHEN ur.role::text = 'employee' THEN 50000 ELSE 0 END
FROM public.user_roles ur
ON CONFLICT (owner_user_id, kind) DO NOTHING;

-- ───────────────────────── SEED DATA ─────────────────────────

-- Companies
INSERT INTO public.companies (id, name, industry, registration_number, tax_number, description, verification_status, monthly_budget_all)
VALUES
  (gen_random_uuid(),'DigitSapiens','Software & AI','L82130456A','J92130456C','Albania''s leading AI consultancy.','verified',9400000),
  (gen_random_uuid(),'AlbTelecom','Telecom','K11824001B','M11824001D','National telecommunications operator.','verified',12500000),
  (gen_random_uuid(),'Balfin Group','Conglomerate','K01624503N','J01624503P','Diversified holdings across retail, energy, real estate.','verified',18000000),
  (gen_random_uuid(),'Tirana Bank','Banking','J62903407T','K62903407U','Retail and corporate banking serving Albania.','verified',15400000),
  (gen_random_uuid(),'Kantina Berat','Hospitality','L31204599Q','M31204599R','Boutique winery & restaurant group.','pending',3200000)
ON CONFLICT DO NOTHING;

-- Providers
WITH p AS (
  INSERT INTO public.providers (name, category, description, verification_status) VALUES
    ('Bamboo Spa','Wellness','Thermal spa and recovery in central Tirana.','verified'),
    ('Mullixhiu','Dining','Organic Albanian tasting menu.','verified'),
    ('Yoga House Tirana','Wellness','Vinyasa, restorative & breathwork.','verified'),
    ('Dajti Express','Adventure','Cable car experiences above Tirana.','verified'),
    ('Tirana AI School','Learning','Applied AI and prompt engineering courses.','verified'),
    ('Albania Trips Co.','Travel','Curated trips along the Riviera and Alps.','verified'),
    ('Destil Creative Hub','Workspace','Coworking with espresso & community.','verified'),
    ('Artisanal Clay Hub','Workshop','Pottery masterclasses and ceramics.','verified'),
    ('Lift Tirana','Lifestyle','Rooftop dining and weekend brunch.','verified'),
    ('Jazz Klub Blloku','Lifestyle','Live jazz nights with curated pairings.','verified'),
    ('Theth Trails','Adventure','Guided hikes through the Albanian Alps.','verified'),
    ('Mediterranea Cooking','Workshop','Cook traditional Albanian recipes.','verified')
  RETURNING id, name
)
INSERT INTO public.offers (provider_id, title, description, category, price_all, kind, image_url)
SELECT id, t.title, t.description, t.category, t.price_all, t.kind::public.offer_kind, NULL
FROM p
JOIN (VALUES
  ('Bamboo Spa','Thermal Spa Day','Pools, sauna, recovery lounge.','Wellness',7500,'single'),
  ('Bamboo Spa','Couples Recovery','90 min for two.','Wellness',12000,'package'),
  ('Mullixhiu','3-Course Organic Dinner','Local farm-to-table menu.','Dining',6500,'single'),
  ('Mullixhiu','Chef''s Table for 2','Multi-course with wine pairing.','Dining',14000,'package'),
  ('Yoga House Tirana','Vinyasa Class','60 min, all levels.','Wellness',4000,'single'),
  ('Yoga House Tirana','10-Class Pack','Use anytime.','Wellness',32000,'bundle'),
  ('Dajti Express','Sunset Cable Car + Dinner','VIP cabin + dinner at 1,613m.','Adventure',9500,'package'),
  ('Tirana AI School','Prompt Engineering Lab','3-hour intensive.','Learning',5400,'single'),
  ('Tirana AI School','Applied AI Bootcamp','4 evenings, hands-on.','Learning',28000,'bundle'),
  ('Albania Trips Co.','Riviera Day Trip','Sea, salt, long lunch.','Travel',11000,'package'),
  ('Destil Creative Hub','All-Day Pass + Coffee','Quiet workspace.','Workspace',1200,'single'),
  ('Destil Creative Hub','Monthly Hot Desk','Unlimited weekday access.','Workspace',18000,'bundle'),
  ('Artisanal Clay Hub','Pottery Masterclass','Two hours, take home your piece.','Workshop',3500,'single'),
  ('Lift Tirana','Rooftop Brunch for 2','Sunday slow morning.','Lifestyle',6400,'package'),
  ('Jazz Klub Blloku','Jazz Night + Wine','Live trio.','Lifestyle',4200,'single'),
  ('Theth Trails','Sunrise Hike','Small group, guided.','Adventure',8500,'single'),
  ('Theth Trails','Weekend Alpine Trip','2-day itinerary.','Adventure',24000,'bundle'),
  ('Mediterranea Cooking','Mediterranean Cooking Class','Cook & dine in Blloku.','Workshop',4800,'single')
) AS t(pname,title,description,category,price_all,kind) ON t.pname = p.name;

-- Quests (global)
INSERT INTO public.quests (scope, title, description, category, reward_all, badge_emoji, target_progress) VALUES
  ('global','AI Literacy Quest','Complete 3 AI-related learning experiences.','Learning',5000,'🤖',3),
  ('global','Mindful Albania','Attend 4 wellness sessions this month.','Wellness',4000,'🌿',4),
  ('global','Team Player','Join 2 team adventures.','Social',3000,'🤝',2),
  ('global','Explorer','Try experiences in 3 different categories.','Discovery',4500,'🧭',3),
  ('global','Leadership Path','Finish the leadership course pack.','Growth',6000,'🚀',1),
  ('global','Weekend Warrior','Redeem 2 weekend perks.','Lifestyle',3500,'🔥',2);

-- Demand insights
INSERT INTO public.demand_insights (category, segment, employees_interested, trend, headline, recommendation) VALUES
  ('Wellness','Spa & recovery',124,'+18%','Demand for wellness peaks Thursday–Sunday','Add a Friday-evening recovery package.'),
  ('Learning','Applied AI courses',87,'+34%','AI upskilling is the fastest-growing category','Launch a 4-week evening bootcamp.'),
  ('Adventure','Weekend outdoor trips',76,'+12%','Theth & Riviera lead repeat bookings','Bundle transport + guide for groups of 6.'),
  ('Dining','Long lunches & tasting menus',58,'+9%','Companies book tasting menus for team rituals','Create a corporate tasting package.'),
  ('Lifestyle','Family-friendly weekends',47,'+15%','Family bundles are under-supplied','Pilot a Sunday family rate.');
