-- Migration: Adicionar tracking de parceiro afiliado em contratos e faturas
-- Descrição: Integra o sistema PLG de afiliados com contratos e faturas
-- Data: 2026-01-18

-- =============================================================================
-- ALTERAÇÕES NA TABELA contracts
-- =============================================================================

-- Adicionar campos para rastrear parceiro afiliado
ALTER TABLE public.contracts 
ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES auth.users(id);

ALTER TABLE public.contracts 
ADD COLUMN IF NOT EXISTS affiliate_token TEXT;

ALTER TABLE public.contracts 
ADD COLUMN IF NOT EXISTS origin TEXT DEFAULT 'PLG' CHECK (origin IN ('PLG', 'SLG', 'DIRECT'));

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_contracts_partner_id ON public.contracts(partner_id);
CREATE INDEX IF NOT EXISTS idx_contracts_affiliate_token ON public.contracts(affiliate_token);
CREATE INDEX IF NOT EXISTS idx_contracts_origin ON public.contracts(origin);

-- Comentários
COMMENT ON COLUMN public.contracts.partner_id IS 'ID do parceiro afiliado que trouxe o lead (via PLG)';
COMMENT ON COLUMN public.contracts.affiliate_token IS 'Token de afiliado usado para rastrear a origem (backup caso partner_id seja NULL)';
COMMENT ON COLUMN public.contracts.origin IS 'Origem do contrato: PLG (Product-Led Growth), SLG (Sales-Led Growth), ou DIRECT (venda direta)';

-- =============================================================================
-- ALTERAÇÕES NA TABELA invoices (se existir)
-- =============================================================================

-- Adicionar campos para rastrear parceiro afiliado em faturas
-- Nota: A tabela invoices pode não existir ainda, então usamos IF NOT EXISTS
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'invoices') THEN
    ALTER TABLE public.invoices 
    ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES auth.users(id);

    ALTER TABLE public.invoices 
    ADD COLUMN IF NOT EXISTS affiliate_token TEXT;

    ALTER TABLE public.invoices 
    ADD COLUMN IF NOT EXISTS origin TEXT DEFAULT 'PLG' CHECK (origin IN ('PLG', 'SLG', 'DIRECT'));

    CREATE INDEX IF NOT EXISTS idx_invoices_partner_id ON public.invoices(partner_id);
    CREATE INDEX IF NOT EXISTS idx_invoices_affiliate_token ON public.invoices(affiliate_token);
    CREATE INDEX IF NOT EXISTS idx_invoices_origin ON public.invoices(origin);

    COMMENT ON COLUMN public.invoices.partner_id IS 'ID do parceiro afiliado que trouxe o lead (via PLG)';
    COMMENT ON COLUMN public.invoices.affiliate_token IS 'Token de afiliado usado para rastrear a origem (backup caso partner_id seja NULL)';
    COMMENT ON COLUMN public.invoices.origin IS 'Origem da fatura: PLG (Product-Led Growth), SLG (Sales-Led Growth), ou DIRECT (venda direta)';
  END IF;
END $$;

-- =============================================================================
-- VIEW: Contratos por Parceiro (para analytics)
-- =============================================================================

CREATE OR REPLACE VIEW public.v_contracts_by_partner AS
SELECT 
  ps.user_id as partner_id,
  ps.company_name,
  ps.affiliate_token,
  COUNT(DISTINCT c.id) as total_contracts,
  COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'active') as active_contracts,
  COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'pending_signature') as pending_contracts,
  SUM(c.monthly_value) FILTER (WHERE c.status = 'active') as total_mrr,
  SUM(c.total_value) FILTER (WHERE c.status = 'active') as total_contract_value,
  MIN(c.created_at) FILTER (WHERE c.status = 'active') as first_contract_date,
  MAX(c.created_at) FILTER (WHERE c.status = 'active') as last_contract_date
FROM public.partner_settings ps
LEFT JOIN public.contracts c ON ps.user_id = c.partner_id OR ps.affiliate_token = c.affiliate_token
GROUP BY ps.user_id, ps.company_name, ps.affiliate_token;

-- =============================================================================
-- VIEW: Faturas por Parceiro (para analytics - se tabela invoices existir)
-- =============================================================================

DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'invoices') THEN
    EXECUTE '
      CREATE OR REPLACE VIEW public.v_invoices_by_partner AS
      SELECT 
        ps.user_id as partner_id,
        ps.company_name,
        ps.affiliate_token,
        COUNT(DISTINCT i.id) as total_invoices,
        COUNT(DISTINCT i.id) FILTER (WHERE i.status = ''paid'') as paid_invoices,
        COUNT(DISTINCT i.id) FILTER (WHERE i.status = ''pending'') as pending_invoices,
        SUM(i.total) FILTER (WHERE i.status = ''paid'') as total_revenue,
        SUM(i.total) FILTER (WHERE i.status = ''pending'') as pending_revenue,
        MIN(i.created_at) FILTER (WHERE i.status = ''paid'') as first_payment_date,
        MAX(i.created_at) FILTER (WHERE i.status = ''paid'') as last_payment_date
      FROM public.partner_settings ps
      LEFT JOIN public.invoices i ON ps.user_id = i.partner_id OR ps.affiliate_token = i.affiliate_token
      GROUP BY ps.user_id, ps.company_name, ps.affiliate_token;
    ';
  END IF;
END $$;

-- =============================================================================
-- VIEW: Métricas PLG vs SLG (para dashboard)
-- =============================================================================

CREATE OR REPLACE VIEW public.v_plg_vs_slg_metrics AS
SELECT 
  'PLG' as source_type,
  COUNT(DISTINCT c.id) as total_contracts,
  COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'active') as active_contracts,
  SUM(c.monthly_value) FILTER (WHERE c.status = 'active') as total_mrr,
  SUM(c.total_value) FILTER (WHERE c.status = 'active') as total_value,
  COUNT(DISTINCT c.partner_id) as unique_partners
FROM public.contracts c
WHERE c.origin = 'PLG' OR c.affiliate_token IS NOT NULL

UNION ALL

SELECT 
  'SLG' as source_type,
  COUNT(DISTINCT c.id) as total_contracts,
  COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'active') as active_contracts,
  SUM(c.monthly_value) FILTER (WHERE c.status = 'active') as total_mrr,
  SUM(c.total_value) FILTER (WHERE c.status = 'active') as total_value,
  COUNT(DISTINCT c.created_by) as unique_sales_reps
FROM public.contracts c
WHERE c.origin = 'SLG' AND (c.affiliate_token IS NULL OR c.affiliate_token = '');
