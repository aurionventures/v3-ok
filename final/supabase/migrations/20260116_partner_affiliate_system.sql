-- Migration: Sistema de Afiliados para Parceiros
-- Descrição: Adiciona suporte a links de afiliados e rastreamento de vendas por parceiro
-- Data: 2026-01-16

-- =============================================================================
-- ALTERAÇÕES NA TABELA partner_settings
-- =============================================================================

-- Adicionar campo para token de afiliado
ALTER TABLE public.partner_settings 
ADD COLUMN IF NOT EXISTS affiliate_token TEXT;

-- Criar índice único para affiliate_token
CREATE UNIQUE INDEX IF NOT EXISTS idx_partner_settings_affiliate_token 
ON public.partner_settings(affiliate_token) 
WHERE affiliate_token IS NOT NULL;

-- Função para gerar token único de afiliado
CREATE OR REPLACE FUNCTION generate_affiliate_token()
RETURNS TEXT AS $$
DECLARE
  token TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Gerar token no formato: aff_XXXXXXXXXXXX (12 caracteres alfanuméricos)
    token := 'aff_' || upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 12));
    
    -- Verificar se token já existe
    SELECT EXISTS(SELECT 1 FROM public.partner_settings WHERE affiliate_token = token) INTO exists_check;
    
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN token;
END;
$$ LANGUAGE plpgsql;

-- Gerar tokens para parceiros existentes que não têm token
UPDATE public.partner_settings
SET affiliate_token = generate_affiliate_token()
WHERE affiliate_token IS NULL;

-- =============================================================================
-- ALTERAÇÕES NA TABELA plg_leads
-- =============================================================================

-- Adicionar campo para rastrear qual parceiro trouxe o lead
ALTER TABLE public.plg_leads 
ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES auth.users(id);

-- Adicionar campo para token de afiliado (backup caso partner_id seja NULL)
ALTER TABLE public.plg_leads 
ADD COLUMN IF NOT EXISTS affiliate_token TEXT;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_plg_leads_partner_id ON public.plg_leads(partner_id);
CREATE INDEX IF NOT EXISTS idx_plg_leads_affiliate_token ON public.plg_leads(affiliate_token);

-- =============================================================================
-- TABELA: partner_commissions
-- Descrição: Registro de comissões por vendas atribuídas a parceiros
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.partner_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Referência ao parceiro
    partner_id UUID NOT NULL REFERENCES auth.users(id),
    affiliate_token TEXT, -- Token usado para atribuir a venda
    
    -- Referência ao lead/conversão
    lead_id UUID REFERENCES public.plg_leads(id),
    user_id UUID REFERENCES auth.users(id), -- Usuário convertido
    org_id TEXT, -- ID da organização criada
    
    -- Dados da venda
    plan_name TEXT NOT NULL,
    plan_value DECIMAL(10, 2) NOT NULL, -- Valor total do contrato (anual)
    billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    billing_term INTEGER DEFAULT 12, -- Meses de contrato (ex: 12, 24, 36)
    
    -- Cálculo de comissão
    commission_rate DECIMAL(5, 2) NOT NULL, -- Percentual de comissão (ex: 15.00)
    commission_amount DECIMAL(10, 2) NOT NULL, -- Valor da comissão calculada
    
    -- Status da comissão
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending',      -- Aguardando confirmação de pagamento
        'confirmed',    -- Venda confirmada, comissão aprovada
        'paid',         -- Comissão paga ao parceiro
        'cancelled'     -- Venda cancelada, comissão não devida
    )),
    
    -- Datas importantes
    sale_date TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Data da venda
    payment_date TIMESTAMPTZ, -- Data em que o pagamento foi confirmado
    commission_paid_date TIMESTAMPTZ, -- Data em que a comissão foi paga
    
    -- Metadados
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_partner_commissions_partner_id ON public.partner_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_commissions_status ON public.partner_commissions(status);
CREATE INDEX IF NOT EXISTS idx_partner_commissions_sale_date ON public.partner_commissions(sale_date DESC);
CREATE INDEX IF NOT EXISTS idx_partner_commissions_lead_id ON public.partner_commissions(lead_id);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger para atualizar updated_at em partner_commissions
CREATE TRIGGER trigger_partner_commissions_updated_at
    BEFORE UPDATE ON public.partner_commissions
    FOR EACH ROW
    EXECUTE FUNCTION update_plg_updated_at();

-- =============================================================================
-- VIEWS para Analytics
-- =============================================================================

-- View: Resumo de comissões por parceiro
CREATE OR REPLACE VIEW public.v_partner_commissions_summary AS
SELECT 
    ps.user_id as partner_id,
    ps.company_name,
    ps.affiliate_token,
    COUNT(DISTINCT pc.id) as total_sales,
    COUNT(DISTINCT pc.id) FILTER (WHERE pc.status = 'confirmed') as confirmed_sales,
    COUNT(DISTINCT pc.id) FILTER (WHERE pc.status = 'paid') as paid_sales,
    SUM(pc.commission_amount) FILTER (WHERE pc.status IN ('confirmed', 'paid')) as total_commission_pending,
    SUM(pc.commission_amount) FILTER (WHERE pc.status = 'paid') as total_commission_paid,
    SUM(pc.plan_value) FILTER (WHERE pc.status IN ('confirmed', 'paid')) as total_revenue_generated,
    MIN(pc.sale_date) FILTER (WHERE pc.status IN ('confirmed', 'paid')) as first_sale_date,
    MAX(pc.sale_date) FILTER (WHERE pc.status IN ('confirmed', 'paid')) as last_sale_date
FROM public.partner_settings ps
LEFT JOIN public.partner_commissions pc ON ps.user_id = pc.partner_id
GROUP BY ps.user_id, ps.company_name, ps.affiliate_token;

-- View: Comissões por período
CREATE OR REPLACE VIEW public.v_partner_commissions_by_period AS
SELECT 
    DATE_TRUNC('month', sale_date) as month,
    partner_id,
    COUNT(*) as sales_count,
    SUM(commission_amount) FILTER (WHERE status IN ('confirmed', 'paid')) as commission_pending,
    SUM(commission_amount) FILTER (WHERE status = 'paid') as commission_paid,
    SUM(plan_value) FILTER (WHERE status IN ('confirmed', 'paid')) as revenue
FROM public.partner_commissions
GROUP BY DATE_TRUNC('month', sale_date), partner_id
ORDER BY month DESC, partner_id;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Habilitar RLS na tabela partner_commissions
ALTER TABLE public.partner_commissions ENABLE ROW LEVEL SECURITY;

-- Política: Service role tem acesso total
CREATE POLICY "Service role full access on partner_commissions" ON public.partner_commissions
    FOR ALL USING (true) WITH CHECK (true);

-- Política: Parceiros podem ver apenas suas próprias comissões
CREATE POLICY "Partners can view own commissions" ON public.partner_commissions
    FOR SELECT USING (
        auth.uid() = partner_id AND 
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'parceiro'
        )
    );

-- =============================================================================
-- COMENTÁRIOS
-- =============================================================================

COMMENT ON TABLE public.partner_commissions IS 'Registro de comissões por vendas atribuídas a parceiros afiliados';
COMMENT ON COLUMN public.partner_settings.affiliate_token IS 'Token único de afiliado usado para rastrear vendas';
COMMENT ON COLUMN public.plg_leads.partner_id IS 'ID do parceiro que trouxe este lead através do link de afiliado';
COMMENT ON COLUMN public.plg_leads.affiliate_token IS 'Token de afiliado usado para rastrear este lead (backup do partner_id)';