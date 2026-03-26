-- Migration: PLG Funnel Tables
-- Descrição: Tabelas para rastreamento do funil PLG (Product-Led Growth)
-- Data: 2026-01-13

-- =============================================================================
-- TABELA: plg_leads
-- Descrição: Armazena leads capturados através da ISCA (GovMetrix Quiz)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.plg_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Dados do Lead
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT NOT NULL,
    phone TEXT,
    
    -- Dados do Diagnóstico ISCA (GovMetrix)
    govmetrix_score INTEGER CHECK (govmetrix_score >= 0 AND govmetrix_score <= 100),
    govmetrix_stage TEXT CHECK (govmetrix_stage IN ('Embrionário', 'Inicial', 'Em Desenvolvimento', 'Estruturado', 'Avançado')),
    govmetrix_category_scores JSONB DEFAULT '{}',
    govmetrix_answers JSONB DEFAULT '{}',
    
    -- Dados do Quiz de Descoberta de Plano
    quiz_faturamento TEXT,
    quiz_tem_conselho TEXT,
    quiz_tem_sucessao TEXT,
    quiz_avaliacao_esg TEXT,
    quiz_num_colaboradores TEXT,
    
    -- Plano e Recomendação
    recommended_plan TEXT,
    selected_plan TEXT,
    
    -- Status do Lead no Funil
    funnel_stage TEXT DEFAULT 'isca_started' CHECK (funnel_stage IN (
        'isca_started', 'isca_completed',
        'discovery_started', 'discovery_completed',
        'checkout_started', 'checkout_completed',
        'payment_started', 'payment_completed',
        'activation_started', 'activation_completed',
        'churned', 'converted'
    )),
    
    -- Conversão
    converted_at TIMESTAMPTZ,
    converted_to_user_id UUID REFERENCES auth.users(id),
    converted_to_org_id TEXT,
    
    -- Fonte e Atribuição
    source TEXT DEFAULT 'organic',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    referrer TEXT,
    
    -- Metadados
    ip_address INET,
    user_agent TEXT,
    device_type TEXT,
    browser TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Índices únicos
    CONSTRAINT plg_leads_email_key UNIQUE (email)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_plg_leads_email ON public.plg_leads(email);
CREATE INDEX IF NOT EXISTS idx_plg_leads_funnel_stage ON public.plg_leads(funnel_stage);
CREATE INDEX IF NOT EXISTS idx_plg_leads_created_at ON public.plg_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_plg_leads_govmetrix_score ON public.plg_leads(govmetrix_score);
CREATE INDEX IF NOT EXISTS idx_plg_leads_recommended_plan ON public.plg_leads(recommended_plan);

-- =============================================================================
-- TABELA: plg_funnel_events
-- Descrição: Eventos de rastreamento do funil PLG
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.plg_funnel_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Referência ao Lead
    lead_id UUID REFERENCES public.plg_leads(id) ON DELETE CASCADE,
    lead_email TEXT, -- Para eventos antes da criação do lead
    
    -- Dados do Evento
    event_type TEXT NOT NULL CHECK (event_type IN (
        'isca_started', 'isca_question_answered', 'isca_completed',
        'discovery_started', 'discovery_question_answered', 'discovery_completed',
        'checkout_started', 'checkout_plan_selected', 'checkout_payment_method_selected', 'checkout_completed',
        'payment_started', 'payment_processing', 'payment_completed', 'payment_failed',
        'activation_started', 'activation_step_completed', 'activation_completed',
        'page_view', 'button_click', 'form_submit', 'modal_open', 'modal_close',
        'drop_off', 'return_visit'
    )),
    
    -- Dados adicionais do evento
    event_data JSONB DEFAULT '{}',
    
    -- Contexto da página
    page_url TEXT,
    page_title TEXT,
    
    -- Sessão
    session_id TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para analytics
CREATE INDEX IF NOT EXISTS idx_plg_funnel_events_lead_id ON public.plg_funnel_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_plg_funnel_events_event_type ON public.plg_funnel_events(event_type);
CREATE INDEX IF NOT EXISTS idx_plg_funnel_events_created_at ON public.plg_funnel_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_plg_funnel_events_session ON public.plg_funnel_events(session_id);

-- =============================================================================
-- TABELA: plg_funnel_metrics
-- Descrição: Métricas agregadas do funil (calculadas diariamente)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.plg_funnel_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Período
    date DATE NOT NULL,
    period_type TEXT DEFAULT 'daily' CHECK (period_type IN ('daily', 'weekly', 'monthly')),
    
    -- Métricas de Volume
    total_visitors INTEGER DEFAULT 0,
    isca_started INTEGER DEFAULT 0,
    isca_completed INTEGER DEFAULT 0,
    discovery_started INTEGER DEFAULT 0,
    discovery_completed INTEGER DEFAULT 0,
    checkout_started INTEGER DEFAULT 0,
    checkout_completed INTEGER DEFAULT 0,
    payment_completed INTEGER DEFAULT 0,
    activation_completed INTEGER DEFAULT 0,
    
    -- Taxas de Conversão
    isca_completion_rate DECIMAL(5,2),
    discovery_conversion_rate DECIMAL(5,2),
    checkout_conversion_rate DECIMAL(5,2),
    payment_conversion_rate DECIMAL(5,2),
    activation_conversion_rate DECIMAL(5,2),
    overall_conversion_rate DECIMAL(5,2),
    
    -- Métricas de Tempo (em segundos)
    avg_time_to_isca_complete INTEGER,
    avg_time_to_discovery_complete INTEGER,
    avg_time_to_checkout_complete INTEGER,
    avg_time_to_payment_complete INTEGER,
    avg_time_to_activation_complete INTEGER,
    avg_total_journey_time INTEGER,
    
    -- Métricas de Score
    avg_govmetrix_score DECIMAL(5,2),
    
    -- Métricas por Plano
    plans_recommended JSONB DEFAULT '{}',
    plans_selected JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Índice único por data e tipo
    CONSTRAINT plg_funnel_metrics_date_type_key UNIQUE (date, period_type)
);

CREATE INDEX IF NOT EXISTS idx_plg_funnel_metrics_date ON public.plg_funnel_metrics(date DESC);

-- =============================================================================
-- TABELA: plg_automations
-- Descrição: Configuração de automações de email/notificação
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.plg_automations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identificação
    name TEXT NOT NULL,
    description TEXT,
    
    -- Trigger
    trigger_event TEXT NOT NULL,
    trigger_conditions JSONB DEFAULT '{}',
    
    -- Ação
    action_type TEXT NOT NULL CHECK (action_type IN ('email', 'webhook', 'notification', 'slack')),
    action_config JSONB NOT NULL,
    
    -- Delay (em minutos)
    delay_minutes INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- TABELA: plg_automation_logs
-- Descrição: Log de execução de automações
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.plg_automation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    automation_id UUID REFERENCES public.plg_automations(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.plg_leads(id) ON DELETE SET NULL,
    
    -- Status da execução
    status TEXT CHECK (status IN ('pending', 'processing', 'success', 'failed', 'skipped')),
    error_message TEXT,
    
    -- Dados da execução
    execution_data JSONB DEFAULT '{}',
    
    -- Timestamps
    scheduled_at TIMESTAMPTZ,
    executed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plg_automation_logs_automation ON public.plg_automation_logs(automation_id);
CREATE INDEX IF NOT EXISTS idx_plg_automation_logs_status ON public.plg_automation_logs(status);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_plg_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS trigger_plg_leads_updated_at ON public.plg_leads;
CREATE TRIGGER trigger_plg_leads_updated_at
    BEFORE UPDATE ON public.plg_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_plg_updated_at();

DROP TRIGGER IF EXISTS trigger_plg_funnel_metrics_updated_at ON public.plg_funnel_metrics;
CREATE TRIGGER trigger_plg_funnel_metrics_updated_at
    BEFORE UPDATE ON public.plg_funnel_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_plg_updated_at();

DROP TRIGGER IF EXISTS trigger_plg_automations_updated_at ON public.plg_automations;
CREATE TRIGGER trigger_plg_automations_updated_at
    BEFORE UPDATE ON public.plg_automations
    FOR EACH ROW
    EXECUTE FUNCTION update_plg_updated_at();

-- =============================================================================
-- VIEWS para Analytics
-- =============================================================================

-- View: Funil por dia
CREATE OR REPLACE VIEW public.v_plg_funnel_daily AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) FILTER (WHERE funnel_stage IN ('isca_started', 'isca_completed', 'discovery_started', 'discovery_completed', 'checkout_started', 'checkout_completed', 'payment_started', 'payment_completed', 'activation_started', 'activation_completed')) as total_leads,
    COUNT(*) FILTER (WHERE funnel_stage = 'isca_started') as isca_started,
    COUNT(*) FILTER (WHERE funnel_stage IN ('isca_completed', 'discovery_started', 'discovery_completed', 'checkout_started', 'checkout_completed', 'payment_started', 'payment_completed', 'activation_started', 'activation_completed')) as isca_completed,
    COUNT(*) FILTER (WHERE funnel_stage IN ('discovery_completed', 'checkout_started', 'checkout_completed', 'payment_started', 'payment_completed', 'activation_started', 'activation_completed')) as discovery_completed,
    COUNT(*) FILTER (WHERE funnel_stage IN ('checkout_completed', 'payment_started', 'payment_completed', 'activation_started', 'activation_completed')) as checkout_completed,
    COUNT(*) FILTER (WHERE funnel_stage IN ('payment_completed', 'activation_started', 'activation_completed')) as payment_completed,
    COUNT(*) FILTER (WHERE funnel_stage = 'activation_completed') as activation_completed,
    AVG(govmetrix_score) as avg_score
FROM public.plg_leads
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- View: Leads por estágio atual
CREATE OR REPLACE VIEW public.v_plg_leads_by_stage AS
SELECT 
    funnel_stage,
    COUNT(*) as count,
    AVG(govmetrix_score) as avg_score,
    MIN(created_at) as oldest_lead,
    MAX(created_at) as newest_lead
FROM public.plg_leads
GROUP BY funnel_stage
ORDER BY 
    CASE funnel_stage
        WHEN 'isca_started' THEN 1
        WHEN 'isca_completed' THEN 2
        WHEN 'discovery_started' THEN 3
        WHEN 'discovery_completed' THEN 4
        WHEN 'checkout_started' THEN 5
        WHEN 'checkout_completed' THEN 6
        WHEN 'payment_started' THEN 7
        WHEN 'payment_completed' THEN 8
        WHEN 'activation_started' THEN 9
        WHEN 'activation_completed' THEN 10
    END;

-- View: Drop-off por estágio
CREATE OR REPLACE VIEW public.v_plg_dropoff_analysis AS
WITH stage_counts AS (
    SELECT 
        funnel_stage,
        COUNT(*) as count
    FROM public.plg_leads
    GROUP BY funnel_stage
)
SELECT 
    s1.funnel_stage as stage,
    s1.count as leads_at_stage,
    s2.count as leads_next_stage,
    ROUND(((s1.count - COALESCE(s2.count, 0))::numeric / NULLIF(s1.count, 0) * 100), 2) as dropoff_rate
FROM stage_counts s1
LEFT JOIN stage_counts s2 ON (
    CASE s1.funnel_stage
        WHEN 'isca_started' THEN 'isca_completed'
        WHEN 'isca_completed' THEN 'discovery_started'
        WHEN 'discovery_started' THEN 'discovery_completed'
        WHEN 'discovery_completed' THEN 'checkout_started'
        WHEN 'checkout_started' THEN 'checkout_completed'
        WHEN 'checkout_completed' THEN 'payment_started'
        WHEN 'payment_started' THEN 'payment_completed'
        WHEN 'payment_completed' THEN 'activation_started'
        WHEN 'activation_started' THEN 'activation_completed'
    END = s2.funnel_stage
)
ORDER BY 
    CASE s1.funnel_stage
        WHEN 'isca_started' THEN 1
        WHEN 'isca_completed' THEN 2
        WHEN 'discovery_started' THEN 3
        WHEN 'discovery_completed' THEN 4
        WHEN 'checkout_started' THEN 5
        WHEN 'checkout_completed' THEN 6
        WHEN 'payment_started' THEN 7
        WHEN 'payment_completed' THEN 8
        WHEN 'activation_started' THEN 9
        WHEN 'activation_completed' THEN 10
    END;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Habilitar RLS
ALTER TABLE public.plg_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plg_funnel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plg_funnel_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plg_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plg_automation_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para service_role (Edge Functions)
CREATE POLICY "Service role full access on plg_leads" ON public.plg_leads
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on plg_funnel_events" ON public.plg_funnel_events
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on plg_funnel_metrics" ON public.plg_funnel_metrics
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on plg_automations" ON public.plg_automations
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on plg_automation_logs" ON public.plg_automation_logs
    FOR ALL USING (true) WITH CHECK (true);

-- =============================================================================
-- DADOS INICIAIS: Automações padrão
-- =============================================================================

INSERT INTO public.plg_automations (name, description, trigger_event, trigger_conditions, action_type, action_config, delay_minutes, is_active)
VALUES 
    (
        'Email de Boas-vindas ISCA',
        'Envia email de boas-vindas após completar o diagnóstico GovMetrix',
        'isca_completed',
        '{}',
        'email',
        '{"template": "govmetrix_result", "subject": "Seu Diagnóstico de Governança está pronto!"}',
        0,
        true
    ),
    (
        'Lembrete de Descoberta',
        'Envia lembrete se lead não avançou para descoberta em 24h',
        'isca_completed',
        '{"next_stage_not_reached": "discovery_started", "max_hours": 24}',
        'email',
        '{"template": "discovery_reminder", "subject": "Descubra o plano ideal para sua governança"}',
        1440,
        true
    ),
    (
        'Lembrete de Checkout',
        'Envia lembrete se lead abandonou o checkout',
        'checkout_started',
        '{"next_stage_not_reached": "checkout_completed", "max_hours": 2}',
        'email',
        '{"template": "checkout_reminder", "subject": "Você esqueceu de algo?"}',
        120,
        true
    ),
    (
        'Notificação Slack - Novo Lead',
        'Notifica equipe no Slack quando lead completa ISCA com score alto',
        'isca_completed',
        '{"govmetrix_score_min": 60}',
        'slack',
        '{"channel": "#leads", "message_template": "hot_lead"}',
        0,
        false
    )
ON CONFLICT DO NOTHING;

-- =============================================================================
-- COMENTÁRIOS
-- =============================================================================

COMMENT ON TABLE public.plg_leads IS 'Leads capturados através do funil PLG (ISCA, Discovery, Checkout)';
COMMENT ON TABLE public.plg_funnel_events IS 'Eventos de rastreamento do funil PLG para analytics';
COMMENT ON TABLE public.plg_funnel_metrics IS 'Métricas agregadas do funil PLG calculadas diariamente';
COMMENT ON TABLE public.plg_automations IS 'Configuração de automações de email/notificação do funil PLG';
COMMENT ON TABLE public.plg_automation_logs IS 'Log de execução das automações PLG';
