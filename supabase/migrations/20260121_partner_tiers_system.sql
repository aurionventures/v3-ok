-- Migration: Sistema de Tiers de Parceiros
-- Descrição: Implementa a estrutura de 4 Tiers de parceiros conforme política comercial
-- Data: 2026-01-21

-- =============================================================================
-- 1. TABELA: partner_tier_configs
-- Descrição: Configurações editáveis dos 4 Tiers de parceiros
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.partner_tier_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_key TEXT NOT NULL UNIQUE CHECK (tier_key IN ('tier_1_commercial', 'tier_2_qualified', 'tier_3_simple', 'tier_4_premium')),
    tier_name TEXT NOT NULL,
    tier_description TEXT,
    
    -- Comissões para negócios originados (vendas geradas pelo parceiro)
    originated_setup_commission DECIMAL(5,2) DEFAULT 0,
    originated_recurring_commission DECIMAL(5,2) DEFAULT 0,
    originated_recurring_months INTEGER DEFAULT 3,
    
    -- Comissões para negócios recebidos (vendas conduzidas pelo parceiro mas originadas pela Legacy OS) - apenas Tier 1
    received_setup_commission DECIMAL(5,2) DEFAULT 0,
    received_recurring_commission DECIMAL(5,2) DEFAULT 0,
    received_recurring_months INTEGER DEFAULT 3,
    
    -- Comissão customizada (Tier 4 - porcentagem sobre valor líquido)
    custom_contract_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Responsabilidades do Tier (JSON array)
    responsibilities JSONB DEFAULT '[]'::jsonb,
    
    -- Configurações gerais
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_partner_tier_configs_tier_key ON public.partner_tier_configs(tier_key);
CREATE INDEX IF NOT EXISTS idx_partner_tier_configs_active ON public.partner_tier_configs(is_active);

-- =============================================================================
-- 2. INSERIR CONFIGURAÇÕES PADRÃO DOS 4 TIERS
-- =============================================================================

INSERT INTO public.partner_tier_configs (
    tier_key, 
    tier_name, 
    tier_description, 
    originated_setup_commission, 
    originated_recurring_commission, 
    originated_recurring_months,
    received_setup_commission,
    received_recurring_commission,
    received_recurring_months,
    custom_contract_percentage,
    responsibilities
) VALUES
-- TIER 1: Parceiro Comercial
('tier_1_commercial', 'Parceiro Comercial', 'Atuação completa no ciclo de vendas', 
 15.00, 15.00, 3,  -- Originado: 15% setup + 15% rec 3m
 15.00, 5.00, 3,    -- Recebido: 15% setup + 5% rec 3m
 0.00,
 '["Conduz reuniões comerciais do início ao fim", "Apresenta propostas comerciais e técnicas", "Negocia termos, condições e prazos", "Realiza follow-up estruturado até o fechamento"]'::jsonb),

-- TIER 2: Afiliado Qualificado
('tier_2_qualified', 'Afiliado Qualificado', 'Prospecção ativa e qualificação inicial',
 10.00, 5.00, 3,   -- Originado: 10% setup + 5% rec 3m
 0.00, 0.00, 0,    -- Não aplicável para recebidos
 0.00,
 '["Valida o fit do lead com o perfil ICP", "Realiza apresentação inicial do produto", "Aquece o lead e gera interesse genuíno", "Transfere o lead pronto para o time comercial"]'::jsonb),

-- TIER 3: Afiliado Simples
('tier_3_simple', 'Afiliado Simples', 'Indicação e validação básica',
 0.00, 15.00, 3,   -- Originado: 0% setup + 15% rec 3m
 0.00, 0.00, 0,    -- Não aplicável para recebidos
 0.00,
 '["Indica contatos qualificados da própria rede", "Valida interesse básico do prospect", "Realiza a ponte inicial com o time da Aurion"]'::jsonb),

-- TIER 4: Parceiro Premium
('tier_4_premium', 'Parceiro Premium', 'Posicionamento de mercado e abertura de portas',
 0.00, 0.00, 0,    -- Não usa setup/recurring padrão
 0.00, 0.00, 0,
 10.00,            -- 10% sobre valor líquido do contrato
 '["Atuação como formador de opinião", "Acesso direto a executivos C-level", "Relacionamento com conselhos e comitês", "Geração de negócios de cross-sell", "Validação e posicionamento institucional"]'::jsonb)

ON CONFLICT (tier_key) DO UPDATE
SET 
    tier_name = EXCLUDED.tier_name,
    tier_description = EXCLUDED.tier_description,
    originated_setup_commission = EXCLUDED.originated_setup_commission,
    originated_recurring_commission = EXCLUDED.originated_recurring_commission,
    originated_recurring_months = EXCLUDED.originated_recurring_months,
    received_setup_commission = EXCLUDED.received_setup_commission,
    received_recurring_commission = EXCLUDED.received_recurring_commission,
    received_recurring_months = EXCLUDED.received_recurring_months,
    custom_contract_percentage = EXCLUDED.custom_contract_percentage,
    responsibilities = EXCLUDED.responsibilities,
    updated_at = NOW();

-- =============================================================================
-- 3. ADICIONAR CAMPO partner_tier EM partner_settings
-- =============================================================================

ALTER TABLE public.partner_settings 
ADD COLUMN IF NOT EXISTS partner_tier TEXT DEFAULT 'tier_3_simple'
CHECK (partner_tier IN ('tier_1_commercial', 'tier_2_qualified', 'tier_3_simple', 'tier_4_premium'));

CREATE INDEX IF NOT EXISTS idx_partner_settings_tier ON public.partner_settings(partner_tier);

COMMENT ON COLUMN public.partner_settings.partner_tier IS 'Tier do parceiro conforme política comercial: tier_1_commercial, tier_2_qualified, tier_3_simple, tier_4_premium';

-- =============================================================================
-- 4. ADICIONAR CAMPOS EM partner_commissions
-- =============================================================================

-- Tier do parceiro no momento da venda
ALTER TABLE public.partner_commissions 
ADD COLUMN IF NOT EXISTS partner_tier TEXT;

-- Origem da venda: 'originated' (gerada pelo parceiro) ou 'received' (conduzida pelo parceiro)
ALTER TABLE public.partner_commissions 
ADD COLUMN IF NOT EXISTS sale_origin TEXT DEFAULT 'originated' 
CHECK (sale_origin IN ('originated', 'received'));

-- Valor de setup (para cálculo de comissão de setup)
ALTER TABLE public.partner_commissions 
ADD COLUMN IF NOT EXISTS setup_value DECIMAL(10,2) DEFAULT 0;

-- Comissão de setup calculada
ALTER TABLE public.partner_commissions 
ADD COLUMN IF NOT EXISTS setup_commission DECIMAL(10,2) DEFAULT 0;

-- Comissão recorrente calculada (total dos meses)
ALTER TABLE public.partner_commissions 
ADD COLUMN IF NOT EXISTS recurring_commission DECIMAL(10,2) DEFAULT 0;

-- Meses de recorrência considerados
ALTER TABLE public.partner_commissions 
ADD COLUMN IF NOT EXISTS recurring_months INTEGER DEFAULT 3;

-- Índices
CREATE INDEX IF NOT EXISTS idx_partner_commissions_tier ON public.partner_commissions(partner_tier);
CREATE INDEX IF NOT EXISTS idx_partner_commissions_origin ON public.partner_commissions(sale_origin);

COMMENT ON COLUMN public.partner_commissions.partner_tier IS 'Tier do parceiro no momento da venda';
COMMENT ON COLUMN public.partner_commissions.sale_origin IS 'Origem da venda: originated (gerada pelo parceiro) ou received (conduzida pelo parceiro)';
COMMENT ON COLUMN public.partner_commissions.setup_value IS 'Valor de setup para cálculo de comissão de setup';
COMMENT ON COLUMN public.partner_commissions.setup_commission IS 'Comissão de setup calculada';
COMMENT ON COLUMN public.partner_commissions.recurring_commission IS 'Comissão recorrente calculada (total dos meses)';

-- =============================================================================
-- 5. ADICIONAR CAMPO origin EM plg_leads
-- =============================================================================

ALTER TABLE public.plg_leads 
ADD COLUMN IF NOT EXISTS origin TEXT DEFAULT 'DIRECT' 
CHECK (origin IN ('ISCA', 'DIRECT', 'AFFILIATE'));

CREATE INDEX IF NOT EXISTS idx_plg_leads_origin ON public.plg_leads(origin);

COMMENT ON COLUMN public.plg_leads.origin IS 'Origem do lead: ISCA (via quiz GovMetrix), DIRECT (acesso direto), AFFILIATE (via link de afiliado)';

-- =============================================================================
-- 6. FUNÇÃO: Calcular Comissão Baseada no Tier
-- =============================================================================

CREATE OR REPLACE FUNCTION calculate_commission_by_tier(
    p_partner_tier TEXT,
    p_sale_origin TEXT,
    p_plan_value DECIMAL,
    p_setup_value DECIMAL DEFAULT 0,
    p_billing_term INTEGER DEFAULT 12
)
RETURNS TABLE (
    setup_commission DECIMAL,
    recurring_commission DECIMAL,
    total_commission DECIMAL,
    recurring_months INTEGER
) AS $$
DECLARE
    v_tier_config RECORD;
    v_setup_comm DECIMAL := 0;
    v_recur_comm DECIMAL := 0;
    v_recur_months INTEGER := 3;
    v_monthly_value DECIMAL;
BEGIN
    -- Buscar configuração do Tier
    SELECT * INTO v_tier_config
    FROM public.partner_tier_configs
    WHERE tier_key = p_partner_tier AND is_active = true;
    
    IF NOT FOUND THEN
        -- Se não encontrar, retornar zeros
        RETURN QUERY SELECT 0::DECIMAL, 0::DECIMAL, 0::DECIMAL, 0::INTEGER;
        RETURN;
    END IF;
    
    -- Calcular valor mensal (assumindo que plan_value é anual)
    v_monthly_value := p_plan_value / 12.0;
    
    -- Tier 4: Comissão customizada (porcentagem sobre valor líquido)
    IF p_partner_tier = 'tier_4_premium' THEN
        v_setup_comm := 0;
        v_recur_comm := (p_plan_value * v_tier_config.custom_contract_percentage / 100.0);
        v_recur_months := 0;
    ELSE
        -- Determinar qual configuração usar (originada ou recebida)
        IF p_sale_origin = 'originated' THEN
            -- Comissão de setup (se houver)
            IF v_tier_config.originated_setup_commission > 0 AND p_setup_value > 0 THEN
                v_setup_comm := p_setup_value * v_tier_config.originated_setup_commission / 100.0;
            END IF;
            
            -- Comissão recorrente
            IF v_tier_config.originated_recurring_commission > 0 THEN
                v_recur_months := v_tier_config.originated_recurring_months;
                v_recur_comm := v_monthly_value * v_tier_config.originated_recurring_commission / 100.0 * v_recur_months;
            END IF;
        ELSE
            -- Venda recebida (apenas Tier 1)
            IF p_partner_tier = 'tier_1_commercial' THEN
                -- Comissão de setup (se houver)
                IF v_tier_config.received_setup_commission > 0 AND p_setup_value > 0 THEN
                    v_setup_comm := p_setup_value * v_tier_config.received_setup_commission / 100.0;
                END IF;
                
                -- Comissão recorrente
                IF v_tier_config.received_recurring_commission > 0 THEN
                    v_recur_months := v_tier_config.received_recurring_months;
                    v_recur_comm := v_monthly_value * v_tier_config.received_recurring_commission / 100.0 * v_recur_months;
                END IF;
            END IF;
        END IF;
    END IF;
    
    -- Retornar resultados
    RETURN QUERY SELECT 
        v_setup_comm,
        v_recur_comm,
        v_setup_comm + v_recur_comm,
        v_recur_months;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 7. VIEW: Comissões Calculadas por Tier
-- =============================================================================

CREATE OR REPLACE VIEW v_partner_commissions_by_tier AS
SELECT 
    pc.*,
    ps.partner_tier,
    ps.company_name as partner_company,
    ps.affiliate_token,
    ptc.tier_name,
    ptc.tier_description,
    -- Usar valores calculados da tabela, ou recalcular se necessário
    COALESCE(pc.setup_commission, 0) as calculated_setup_commission,
    COALESCE(pc.recurring_commission, 0) as calculated_recurring_commission,
    COALESCE(pc.setup_commission, 0) + COALESCE(pc.recurring_commission, 0) as calculated_total_commission
FROM partner_commissions pc
JOIN partner_settings ps ON pc.partner_id = ps.user_id
LEFT JOIN partner_tier_configs ptc ON ps.partner_tier = ptc.tier_key;

-- =============================================================================
-- 8. TRIGGER: Atualizar updated_at em partner_tier_configs
-- =============================================================================

CREATE OR REPLACE FUNCTION update_tier_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_partner_tier_configs_updated_at
    BEFORE UPDATE ON public.partner_tier_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_tier_config_updated_at();

-- =============================================================================
-- 9. ROW LEVEL SECURITY
-- =============================================================================

-- Habilitar RLS na tabela partner_tier_configs
ALTER TABLE public.partner_tier_configs ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler configurações ativas
CREATE POLICY "Anyone can read active tier configs" ON public.partner_tier_configs
    FOR SELECT USING (is_active = true);

-- Política: Service role tem acesso total
CREATE POLICY "Service role full access on tier configs" ON public.partner_tier_configs
    FOR ALL USING (true) WITH CHECK (true);

-- Política: Admin pode editar configurações
CREATE POLICY "Admins can manage tier configs" ON public.partner_tier_configs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================================================
-- 10. COMENTÁRIOS
-- =============================================================================

COMMENT ON TABLE public.partner_tier_configs IS 'Configurações dos 4 Tiers de parceiros conforme política comercial';
COMMENT ON COLUMN public.partner_tier_configs.tier_key IS 'Chave do Tier: tier_1_commercial, tier_2_qualified, tier_3_simple, tier_4_premium';
COMMENT ON COLUMN public.partner_tier_configs.originated_setup_commission IS 'Percentual de comissão de setup para vendas originadas pelo parceiro';
COMMENT ON COLUMN public.partner_tier_configs.originated_recurring_commission IS 'Percentual de comissão recorrente (mensal) para vendas originadas';
COMMENT ON COLUMN public.partner_tier_configs.originated_recurring_months IS 'Quantos meses de recorrência considerar para vendas originadas';
COMMENT ON COLUMN public.partner_tier_configs.received_setup_commission IS 'Percentual de comissão de setup para vendas recebidas (apenas Tier 1)';
COMMENT ON COLUMN public.partner_tier_configs.received_recurring_commission IS 'Percentual de comissão recorrente para vendas recebidas (apenas Tier 1)';
COMMENT ON COLUMN public.partner_tier_configs.custom_contract_percentage IS 'Percentual sobre valor líquido para Tier 4 (Parceiro Premium)';
