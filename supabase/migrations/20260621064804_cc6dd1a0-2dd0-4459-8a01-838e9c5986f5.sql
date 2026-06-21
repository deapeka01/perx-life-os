
-- bank_accounts
CREATE TABLE public.bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text,
  beneficiary_name text NOT NULL,
  iban text NOT NULL,
  swift text,
  bank_name text NOT NULL,
  currency text NOT NULL DEFAULT 'ALL',
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bank_accounts TO authenticated;
GRANT ALL ON public.bank_accounts TO service_role;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner reads bank accounts" ON public.bank_accounts FOR SELECT TO authenticated USING (owner_user_id = auth.uid());
CREATE POLICY "owner writes bank accounts" ON public.bank_accounts FOR INSERT TO authenticated WITH CHECK (owner_user_id = auth.uid());
CREATE POLICY "owner updates bank accounts" ON public.bank_accounts FOR UPDATE TO authenticated USING (owner_user_id = auth.uid()) WITH CHECK (owner_user_id = auth.uid());
CREATE POLICY "owner deletes bank accounts" ON public.bank_accounts FOR DELETE TO authenticated USING (owner_user_id = auth.uid());
CREATE TRIGGER bank_accounts_touch BEFORE UPDATE ON public.bank_accounts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- invoices
CREATE TYPE public.invoice_kind AS ENUM ('wallet_topup', 'perk_claim', 'provider_payout');
CREATE TYPE public.invoice_status AS ENUM ('pending', 'sent', 'paid', 'cancelled');

CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL UNIQUE,
  kind public.invoice_kind NOT NULL,
  status public.invoice_status NOT NULL DEFAULT 'pending',
  amount_all integer NOT NULL CHECK (amount_all > 0),
  reference_code text NOT NULL UNIQUE,
  description text NOT NULL,
  payer_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  payer_label text,
  payee_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  payee_label text NOT NULL,
  bank_snapshot jsonb NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  due_date date,
  sent_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parties read invoices" ON public.invoices FOR SELECT TO authenticated
  USING (payer_user_id = auth.uid() OR payee_user_id = auth.uid());
CREATE POLICY "parties create invoices" ON public.invoices FOR INSERT TO authenticated
  WITH CHECK (payer_user_id = auth.uid() OR payee_user_id = auth.uid());
CREATE POLICY "parties update invoices" ON public.invoices FOR UPDATE TO authenticated
  USING (payer_user_id = auth.uid() OR payee_user_id = auth.uid())
  WITH CHECK (payer_user_id = auth.uid() OR payee_user_id = auth.uid());

CREATE TRIGGER invoices_touch BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX invoices_payer_idx ON public.invoices (payer_user_id, created_at DESC);
CREATE INDEX invoices_payee_idx ON public.invoices (payee_user_id, created_at DESC);

-- helper to generate an invoice number like PER-2026-000123
CREATE SEQUENCE public.invoice_number_seq START 1000;
CREATE OR REPLACE FUNCTION public.next_invoice_number()
RETURNS text LANGUAGE sql VOLATILE SET search_path = public AS $$
  SELECT 'PER-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.invoice_number_seq')::text, 6, '0')
$$;
GRANT EXECUTE ON FUNCTION public.next_invoice_number() TO authenticated, service_role;
