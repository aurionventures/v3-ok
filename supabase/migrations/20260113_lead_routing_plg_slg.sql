-- Migration: Lead Routing PLG/SLG
-- Descrição: Implementa encaminhamento automático de leads para PLG ou SLG baseado em score
-- Data: 2026-01-13

-- =============================================================================
-- ALTERAÇÕES NA TABELA plg_leads
-- =============================================================================

-- Adicionar campo para indicar o path do lead (PLG self-service ou SLG sales-led)
ALTER TABLE public.plg_leads 
ADD COLUMN IF NOT EXISTS lead_path TEXT DEFAULT 'plg' 
CHECK (lead_path IN ('plg', 'slg'));

-- Adicionar campo para indicar se o lead foi "capturado" pelo comercial
ALTER TABLE public.plg_leads 
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id);

-- Adicionar campo para indicar quando foi atribuído ao comercial
ALTER TABLE public.plg_leads 
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ;

-- Adicionar campo para notas do comercial
ALTER TABLE public.plg_leads 
ADD COLUMN IF NOT EXISTS sales_notes TEXT;

-- Adicionar campo para status de contato comercial
ALTER TABLE public.plg_leads 
ADD COLUMN IF NOT EXISTS sales_status TEXT DEFAULT 'pending'
CHECK (sales_status IN (
    'pending',           -- Aguardando contato
    'contacted',         -- Primeiro contato feito
    'in_negotiation',    -- Em negociação
    'proposal_sent',     -- Proposta enviada
    'won',               -- Convertido via SLG
    'lost',              -- Perdido
    'returned_to_plg'    -- Devolvido para PLG (self-service)
));

-- Adicionar campo para prioridade do lead SLG
ALTER TABLE public.plg_leads 
ADD COLUMN IF NOT EXISTS slg_priority TEXT DEFAULT 'normal'
CHECK (slg_priority IN ('low', 'normal', 'high', 'urgent'));

-- Índices para queries de SLG
CREATE INDEX IF NOT EXISTS idx_plg_leads_lead_path ON public.plg_leads(lead_path);
CREATE INDEX IF NOT EXISTS idx_plg_leads_assigned_to ON public.plg_leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_plg_leads_sales_status ON public.plg_leads(sales_status);
CREATE INDEX IF NOT EXISTS idx_plg_leads_slg_priority ON public.plg_leads(slg_priority);

-- =============================================================================
-- TABELA: lead_routing_rules
-- Descrição: Regras configuráveis para encaminhamento de leads
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.lead_routing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identificação
    name TEXT NOT NULL,
    description TEXT,
    
    -- Condições (todas devem ser atendidas)
    min_govmetrix_score INTEGER,          -- Score mínimo para ativar regra
    max_govmetrix_score INTEGER,          -- Score máximo para ativar regra
    faturamento_ranges TEXT[],             -- Faixas de faturamento que ativam
    has_conselho BOOLEAN,                  -- Se tem conselho
    has_sucessao BOOLEAN,                  -- Se tem plano de sucessão
    
    -- Resultado
    target_path TEXT NOT NULL CHECK (target_path IN ('plg', 'slg')),
    slg_priority TEXT DEFAULT 'normal' CHECK (slg_priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Ordenação (regras com maior prioridade são avaliadas primeiro)
    priority INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS trigger_lead_routing_rules_updated_at ON public.lead_routing_rules;
CREATE TRIGGER trigger_lead_routing_rules_updated_at
    BEFORE UPDATE ON public.lead_routing_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_plg_updated_at();

-- =============================================================================
-- FUNCTION: determine_lead_path
-- Descrição: Função que determina se lead vai para PLG ou SLG
-- =============================================================================
CREATE OR REPLACE FUNCTION public.determine_lead_path(
    p_govmetrix_score INTEGER,
    p_faturamento TEXT DEFAULT NULL,
    p_has_conselho BOOLEAN DEFAULT NULL,
    p_has_sucessao BOOLEAN DEFAULT NULL
) RETURNS TABLE (
    lead_path TEXT,
    slg_priority TEXT,
    matched_rule_id UUID,
    matched_rule_name TEXT
) AS $$
DECLARE
    v_rule RECORD;
BEGIN
    -- Buscar regras ativas ordenadas por prioridade
    FOR v_rule IN 
        SELECT * FROM public.lead_routing_rules 
        WHERE is_active = true 
        ORDER BY priority DESC
    LOOP
        -- Verificar condições da regra
        IF (v_rule.min_govmetrix_score IS NULL OR p_govmetrix_score >= v_rule.min_govmetrix_score) AND
           (v_rule.max_govmetrix_score IS NULL OR p_govmetrix_score <= v_rule.max_govmetrix_score) AND
           (v_rule.faturamento_ranges IS NULL OR p_faturamento = ANY(v_rule.faturamento_ranges)) AND
           (v_rule.has_conselho IS NULL OR v_rule.has_conselho = p_has_conselho) AND
           (v_rule.has_sucessao IS NULL OR v_rule.has_sucessao = p_has_sucessao)
        THEN
            -- Regra matched!
            RETURN QUERY SELECT 
                v_rule.target_path,
                v_rule.slg_priority,
                v_rule.id,
                v_rule.name;
            RETURN;
        END IF;
    END LOOP;
    
    -- Default: PLG
    RETURN QUERY SELECT 'plg'::TEXT, 'normal'::TEXT, NULL::UUID, 'Default (PLG)'::TEXT;
    RETURN;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- REGRAS PADRÃO DE ENCAMINHAMENTO
-- =============================================================================

INSERT INTO public.lead_routing_rules (name, description, min_govmetrix_score, max_govmetrix_score, faturamento_ranges, target_path, slg_priority, priority, is_active)
VALUES 
    -- Regra 1: Empresas grandes sempre vão para SLG (independente do score)
    (
        'Empresa Grande - SLG Urgente',
        'Empresas com faturamento acima de R$300M vão direto para SLG com prioridade urgente',
        NULL,
        NULL,
        ARRAY['300m_4_8b', 'acima_4_8b'],
        'slg',
        'urgent',
        100,
        true
    ),
    
    -- Regra 2: Score alto (>= 70) + Faturamento médio = SLG High Priority
    (
        'Score Alto + Média Empresa',
        'Empresas com score >= 70 e faturamento entre R$30M-300M vão para SLG com alta prioridade',
        70,
        NULL,
        ARRAY['30m_300m'],
        'slg',
        'high',
        90,
        true
    ),
    
    -- Regra 3: Score muito alto (>= 80) = SLG Normal (qualquer faturamento)
    (
        'Score Muito Alto',
        'Leads com score >= 80 indicam alta maturidade e complexidade, ideal para SLG',
        80,
        NULL,
        NULL,
        'slg',
        'normal',
        80,
        true
    ),
    
    -- Regra 4: Score médio-alto (60-79) + tem conselho = SLG Normal
    (
        'Score Médio-Alto + Conselho',
        'Empresas com score 60-79 que já têm conselho estruturado vão para SLG',
        60,
        79,
        NULL,
        'slg',
        'normal',
        70,
        true
    ),
    
    -- Regra 5: Default - todos os outros vão para PLG
    (
        'Default PLG',
        'Regra padrão: leads que não se encaixam em outras regras vão para PLG (self-service)',
        NULL,
        NULL,
        NULL,
        'plg',
        'normal',
        0,
        true
    )
ON CONFLICT DO NOTHING;

-- =============================================================================
-- VIEW: Leads SLG para Dashboard Comercial
-- =============================================================================
CREATE OR REPLACE VIEW public.v_slg_leads_dashboard AS
SELECT 
    l.id,
    l.name,
    l.email,
    l.company,
    l.phone,
    l.govmetrix_score,
    l.govmetrix_stage,
    l.quiz_faturamento,
    l.quiz_tem_conselho,
    l.quiz_tem_sucessao,
    l.recommended_plan,
    l.lead_path,
    l.slg_priority,
    l.sales_status,
    l.assigned_to,
    l.assigned_at,
    l.sales_notes,
    l.funnel_stage,
    l.created_at,
    l.updated_at,
    -- Calcular tempo desde criação
    EXTRACT(EPOCH FROM (NOW() - l.created_at)) / 3600 as hours_since_created,
    -- Calcular tempo desde atribuição
    CASE 
        WHEN l.assigned_at IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (NOW() - l.assigned_at)) / 3600 
        ELSE NULL 
    END as hours_since_assigned,
    -- Flag de urgência
    CASE
        WHEN l.slg_priority = 'urgent' THEN 1
        WHEN l.slg_priority = 'high' THEN 2
        WHEN l.slg_priority = 'normal' THEN 3
        ELSE 4
    END as priority_order
FROM public.plg_leads l
WHERE l.lead_path = 'slg'
ORDER BY 
    priority_order ASC,
    l.created_at DESC;

-- =============================================================================
-- VIEW: Métricas SLG
-- =============================================================================
CREATE OR REPLACE VIEW public.v_slg_metrics AS
SELECT 
    COUNT(*) FILTER (WHERE lead_path = 'slg') as total_slg_leads,
    COUNT(*) FILTER (WHERE lead_path = 'slg' AND sales_status = 'pending') as pending_contact,
    COUNT(*) FILTER (WHERE lead_path = 'slg' AND sales_status = 'contacted') as contacted,
    COUNT(*) FILTER (WHERE lead_path = 'slg' AND sales_status = 'in_negotiation') as in_negotiation,
    COUNT(*) FILTER (WHERE lead_path = 'slg' AND sales_status = 'proposal_sent') as proposal_sent,
    COUNT(*) FILTER (WHERE lead_path = 'slg' AND sales_status = 'won') as won,
    COUNT(*) FILTER (WHERE lead_path = 'slg' AND sales_status = 'lost') as lost,
    COUNT(*) FILTER (WHERE lead_path = 'slg' AND slg_priority = 'urgent') as urgent_leads,
    COUNT(*) FILTER (WHERE lead_path = 'slg' AND slg_priority = 'high') as high_priority_leads,
    AVG(govmetrix_score) FILTER (WHERE lead_path = 'slg') as avg_slg_score,
    -- Taxa de conversão SLG
    ROUND(
        (COUNT(*) FILTER (WHERE lead_path = 'slg' AND sales_status = 'won')::numeric / 
         NULLIF(COUNT(*) FILTER (WHERE lead_path = 'slg'), 0) * 100), 2
    ) as slg_conversion_rate
FROM public.plg_leads;

-- =============================================================================
-- TRIGGER: Auto-route lead on ISCA completion
-- =============================================================================
CREATE OR REPLACE FUNCTION public.auto_route_lead()
RETURNS TRIGGER AS $$
DECLARE
    v_routing RECORD;
BEGIN
    -- Só executar quando score é atualizado
    IF NEW.govmetrix_score IS NOT NULL AND (OLD.govmetrix_score IS NULL OR NEW.govmetrix_score != OLD.govmetrix_score) THEN
        -- Determinar path do lead
        SELECT * INTO v_routing FROM public.determine_lead_path(
            NEW.govmetrix_score,
            NEW.quiz_faturamento,
            NEW.quiz_tem_conselho = 'sim',
            NEW.quiz_tem_sucessao = 'sim'
        );
        
        -- Atualizar lead com path determinado
        NEW.lead_path := v_routing.lead_path;
        NEW.slg_priority := v_routing.slg_priority;
        
        -- Log para debug
        RAISE NOTICE 'Lead % routed to % with priority % (rule: %)', 
            NEW.email, v_routing.lead_path, v_routing.slg_priority, v_routing.matched_rule_name;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger
DROP TRIGGER IF EXISTS trigger_auto_route_lead ON public.plg_leads;
CREATE TRIGGER trigger_auto_route_lead
    BEFORE UPDATE ON public.plg_leads
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_route_lead();

-- =============================================================================
-- AUTOMAÇÃO: Notificação para novos leads SLG
-- =============================================================================
INSERT INTO public.plg_automations (name, description, trigger_event, trigger_conditions, action_type, action_config, delay_minutes, is_active)
VALUES 
    (
        'Slack - Novo Lead SLG Urgente',
        'Notifica equipe no Slack quando lead é encaminhado para SLG com prioridade urgente',
        'isca_completed',
        '{"lead_path": "slg", "slg_priority": "urgent"}',
        'slack',
        '{"channel": "#vendas-urgente", "message_template": "slg_urgent_lead"}',
        0,
        true
    ),
    (
        'Slack - Novo Lead SLG High Priority',
        'Notifica equipe no Slack quando lead é encaminhado para SLG com alta prioridade',
        'isca_completed',
        '{"lead_path": "slg", "slg_priority": "high"}',
        'slack',
        '{"channel": "#vendas", "message_template": "slg_high_lead"}',
        0,
        true
    ),
    (
        'Email - Alerta Lead SLG para Comercial',
        'Envia email para equipe comercial quando novo lead SLG chega',
        'isca_completed',
        '{"lead_path": "slg"}',
        'email',
        '{"template": "slg_new_lead_alert", "to": "comercial@legacy.gov.br"}',
        0,
        true
    )
ON CONFLICT DO NOTHING;

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

-- Policies para lead_routing_rules (apenas admins podem gerenciar)
ALTER TABLE public.lead_routing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on lead_routing_rules" ON public.lead_routing_rules
    FOR ALL USING (true) WITH CHECK (true);

-- =============================================================================
-- COMENTÁRIOS
-- =============================================================================

COMMENT ON TABLE public.lead_routing_rules IS 'Regras configuráveis para encaminhamento automático de leads PLG/SLG';
COMMENT ON COLUMN public.plg_leads.lead_path IS 'Indica se lead segue fluxo PLG (self-service) ou SLG (sales-led)';
COMMENT ON COLUMN public.plg_leads.slg_priority IS 'Prioridade para atendimento comercial (urgent, high, normal, low)';
COMMENT ON COLUMN public.plg_leads.sales_status IS 'Status do atendimento comercial para leads SLG';
COMMENT ON FUNCTION public.determine_lead_path IS 'Determina automaticamente se lead vai para PLG ou SLG baseado em regras';
