-- Migration: Contract Management System
-- Descrição: Sistema de gestão de contratos com templates, assinatura eletrônica e automação
-- Data: 2026-01-13

-- =============================================================================
-- TABELA: contract_templates (Minutas de Contrato)
-- Descrição: Templates/Minutas de contrato configuráveis pelo admin
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.contract_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identificação
    name TEXT NOT NULL,
    description TEXT,
    version TEXT DEFAULT '1.0',
    
    -- Conteúdo da Minuta (HTML com placeholders)
    content TEXT NOT NULL,
    
    -- Variáveis disponíveis para substituição
    -- Ex: {{cliente_nome}}, {{cliente_cnpj}}, {{plano_nome}}, {{valor_mensal}}, etc.
    available_variables JSONB DEFAULT '[]',
    
    -- Configurações
    plan_types TEXT[] DEFAULT ARRAY['core', 'governance_plus', 'people_esg', 'legacy_360'],
    requires_witness BOOLEAN DEFAULT false,
    witness_count INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    
    -- Metadados
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_contract_templates_active ON public.contract_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_contract_templates_default ON public.contract_templates(is_default);

-- =============================================================================
-- TABELA: contracts (Contratos Gerados)
-- Descrição: Contratos gerados a partir de templates, vinculados a clientes
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Número do contrato (gerado automaticamente)
    contract_number TEXT NOT NULL UNIQUE,
    
    -- Referências
    template_id UUID REFERENCES public.contract_templates(id),
    organization_id TEXT, -- ID da organização/empresa
    lead_id UUID REFERENCES public.plg_leads(id),
    
    -- Dados do Cliente
    client_name TEXT NOT NULL,
    client_document TEXT NOT NULL, -- CNPJ ou CPF
    client_email TEXT NOT NULL,
    client_phone TEXT,
    client_address TEXT,
    
    -- Representante Legal
    signatory_name TEXT NOT NULL,
    signatory_role TEXT NOT NULL, -- Ex: "Diretor", "Sócio-Administrador"
    signatory_email TEXT NOT NULL,
    signatory_document TEXT, -- CPF do signatário
    
    -- Dados do Plano
    plan_type TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    addons TEXT[] DEFAULT ARRAY[]::TEXT[],
    monthly_value DECIMAL(10,2) NOT NULL,
    total_value DECIMAL(10,2),
    
    -- Vigência
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_months INTEGER NOT NULL,
    
    -- Conteúdo Final do Contrato (HTML renderizado)
    content_html TEXT NOT NULL,
    content_hash TEXT, -- Hash do conteúdo para validação de integridade
    
    -- Status do Contrato
    status TEXT DEFAULT 'draft' CHECK (status IN (
        'draft',           -- Rascunho
        'pending_signature', -- Aguardando assinatura do cliente
        'pending_counter_signature', -- Aguardando contra-assinatura (Legacy)
        'active',          -- Ativo
        'expired',         -- Expirado
        'cancelled',       -- Cancelado
        'suspended'        -- Suspenso
    )),
    
    -- Assinatura do Cliente
    client_signature_token TEXT UNIQUE, -- Token único para link de assinatura
    client_signature_token_expires_at TIMESTAMPTZ,
    client_signed_at TIMESTAMPTZ,
    client_signature_ip TEXT,
    client_signature_user_agent TEXT,
    client_signature_hash TEXT, -- Hash da assinatura (nome + timestamp + IP)
    
    -- Contra-assinatura (Legacy OS)
    counter_signed_at TIMESTAMPTZ,
    counter_signed_by UUID REFERENCES auth.users(id),
    counter_signature_hash TEXT,
    
    -- Testemunhas (se necessário)
    witnesses JSONB DEFAULT '[]',
    
    -- Histórico de envios
    sent_at TIMESTAMPTZ,
    sent_count INTEGER DEFAULT 0,
    last_reminder_at TIMESTAMPTZ,
    
    -- Metadados
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_contracts_number ON public.contracts(contract_number);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_client_email ON public.contracts(client_email);
CREATE INDEX IF NOT EXISTS idx_contracts_signature_token ON public.contracts(client_signature_token);
CREATE INDEX IF NOT EXISTS idx_contracts_organization ON public.contracts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contracts_created_at ON public.contracts(created_at DESC);

-- =============================================================================
-- TABELA: contract_events (Histórico de Eventos do Contrato)
-- Descrição: Log de todas as ações realizadas no contrato
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.contract_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    
    event_type TEXT NOT NULL CHECK (event_type IN (
        'created',
        'sent',
        'viewed',
        'signed',
        'counter_signed',
        'reminder_sent',
        'expired',
        'cancelled',
        'activated',
        'downloaded',
        'updated'
    )),
    
    -- Dados do evento
    actor_type TEXT CHECK (actor_type IN ('system', 'admin', 'client', 'witness')),
    actor_id UUID,
    actor_email TEXT,
    actor_ip TEXT,
    actor_user_agent TEXT,
    
    -- Metadados adicionais
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contract_events_contract ON public.contract_events(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_events_type ON public.contract_events(event_type);

-- =============================================================================
-- TABELA: contract_email_queue (Fila de Emails de Contrato)
-- Descrição: Fila para envio de emails de contrato
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.contract_email_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    
    email_type TEXT NOT NULL CHECK (email_type IN (
        'signature_request',   -- Solicitação de assinatura
        'reminder',            -- Lembrete
        'signed_confirmation', -- Confirmação de assinatura
        'contract_copy',       -- Cópia do contrato assinado
        'expiration_warning'   -- Aviso de expiração
    )),
    
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
    error_message TEXT,
    
    -- Timestamps
    scheduled_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contract_email_queue_status ON public.contract_email_queue(status);
CREATE INDEX IF NOT EXISTS idx_contract_email_queue_scheduled ON public.contract_email_queue(scheduled_at);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Função para gerar número de contrato sequencial
CREATE OR REPLACE FUNCTION generate_contract_number()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    sequence_num INTEGER;
    new_number TEXT;
BEGIN
    year_part := TO_CHAR(NOW(), 'YYYY');
    
    -- Buscar último número do ano
    SELECT COALESCE(MAX(
        CAST(SPLIT_PART(contract_number, '-', 2) AS INTEGER)
    ), 0) + 1
    INTO sequence_num
    FROM public.contracts
    WHERE contract_number LIKE 'CONT-' || year_part || '-%';
    
    -- Formatar número
    new_number := 'CONT-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Função para gerar token de assinatura
CREATE OR REPLACE FUNCTION generate_signature_token()
RETURNS TEXT AS $$
BEGIN
    RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Função para gerar hash de integridade
CREATE OR REPLACE FUNCTION generate_content_hash(content TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(digest(content, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Trigger para auto-gerar número do contrato
CREATE OR REPLACE FUNCTION set_contract_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.contract_number IS NULL OR NEW.contract_number = '' THEN
        NEW.contract_number := generate_contract_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_contract_number ON public.contracts;
CREATE TRIGGER trigger_set_contract_number
    BEFORE INSERT ON public.contracts
    FOR EACH ROW
    EXECUTE FUNCTION set_contract_number();

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_contract_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_contracts_updated_at ON public.contracts;
CREATE TRIGGER trigger_contracts_updated_at
    BEFORE UPDATE ON public.contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_contract_updated_at();

DROP TRIGGER IF EXISTS trigger_contract_templates_updated_at ON public.contract_templates;
CREATE TRIGGER trigger_contract_templates_updated_at
    BEFORE UPDATE ON public.contract_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_contract_updated_at();

-- =============================================================================
-- VIEWS
-- =============================================================================

-- View: Contratos com status resumido
CREATE OR REPLACE VIEW public.v_contracts_summary AS
SELECT 
    c.id,
    c.contract_number,
    c.client_name,
    c.client_document,
    c.client_email,
    c.plan_name,
    c.monthly_value,
    c.status,
    c.start_date,
    c.end_date,
    c.duration_months,
    c.sent_at,
    c.client_signed_at,
    c.counter_signed_at,
    c.created_at,
    t.name as template_name,
    CASE 
        WHEN c.status = 'pending_signature' AND c.client_signature_token_expires_at < NOW() 
        THEN true 
        ELSE false 
    END as is_token_expired,
    EXTRACT(DAY FROM (c.end_date - CURRENT_DATE)) as days_to_expiry
FROM public.contracts c
LEFT JOIN public.contract_templates t ON c.template_id = t.id
ORDER BY c.created_at DESC;

-- View: Métricas de contratos
CREATE OR REPLACE VIEW public.v_contracts_metrics AS
SELECT 
    COUNT(*) as total_contracts,
    COUNT(*) FILTER (WHERE status = 'draft') as drafts,
    COUNT(*) FILTER (WHERE status = 'pending_signature') as pending_signature,
    COUNT(*) FILTER (WHERE status = 'active') as active,
    COUNT(*) FILTER (WHERE status = 'expired') as expired,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
    SUM(monthly_value) FILTER (WHERE status = 'active') as active_mrr,
    AVG(duration_months) FILTER (WHERE status = 'active') as avg_duration,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as created_last_30_days,
    COUNT(*) FILTER (WHERE client_signed_at > NOW() - INTERVAL '30 days') as signed_last_30_days
FROM public.contracts;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_email_queue ENABLE ROW LEVEL SECURITY;

-- Policies para service_role (Edge Functions)
CREATE POLICY "Service role full access on contract_templates" ON public.contract_templates
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on contracts" ON public.contracts
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on contract_events" ON public.contract_events
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on contract_email_queue" ON public.contract_email_queue
    FOR ALL USING (true) WITH CHECK (true);

-- =============================================================================
-- DADOS INICIAIS: Template de Contrato Padrão
-- =============================================================================

INSERT INTO public.contract_templates (
    name, 
    description, 
    version,
    content, 
    available_variables,
    is_active,
    is_default
) VALUES (
    'Contrato de Prestação de Serviços SaaS - Padrão',
    'Modelo padrão de contrato para assinatura de planos Legacy OS',
    '1.0',
    E'<div class="contract">
    <h1 style="text-align: center; font-size: 18px; margin-bottom: 30px;">
        CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE SOFTWARE COMO SERVIÇO (SaaS)<br/>
        PLATAFORMA LEGACY OS
    </h1>
    
    <p style="text-align: center; margin-bottom: 30px;">
        <strong>Contrato nº {{contrato_numero}}</strong>
    </p>

    <h2>PARTES</h2>
    
    <p><strong>CONTRATADA:</strong> LEGACY GOVERNANÇA LTDA., pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 00.000.000/0001-00, com sede na cidade de São Paulo, Estado de São Paulo, neste ato representada na forma de seu Contrato Social, doravante denominada simplesmente "LEGACY".</p>
    
    <p><strong>CONTRATANTE:</strong> {{cliente_nome}}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº {{cliente_cnpj}}, com sede em {{cliente_endereco}}, neste ato representada por {{signatario_nome}}, {{signatario_cargo}}, portador(a) do CPF nº {{signatario_cpf}}, doravante denominada simplesmente "CONTRATANTE".</p>

    <p>As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços de Software como Serviço (SaaS), que se regerá pelas cláusulas seguintes e pelas condições descritas no presente.</p>

    <h2>CLÁUSULA 1ª - DO OBJETO</h2>
    
    <p>1.1. O presente contrato tem por objeto a prestação de serviços de acesso e uso da plataforma de governança corporativa "LEGACY OS", na modalidade Software como Serviço (SaaS), conforme plano contratado.</p>
    
    <p>1.2. <strong>Plano Contratado:</strong> {{plano_nome}}</p>
    
    <p>1.3. <strong>Módulos Inclusos:</strong> {{modulos_inclusos}}</p>
    
    <p>1.4. <strong>Add-ons Contratados:</strong> {{addons}}</p>

    <h2>CLÁUSULA 2ª - DO PRAZO</h2>
    
    <p>2.1. O presente contrato terá vigência de {{duracao_meses}} ({{duracao_extenso}}) meses, com início em {{data_inicio}} e término em {{data_fim}}.</p>
    
    <p>2.2. Findo o prazo de vigência, o contrato será automaticamente renovado por igual período, salvo manifestação contrária de qualquer das partes, com antecedência mínima de 30 (trinta) dias.</p>

    <h2>CLÁUSULA 3ª - DO PREÇO E FORMA DE PAGAMENTO</h2>
    
    <p>3.1. Pela prestação dos serviços objeto deste contrato, a CONTRATANTE pagará à LEGACY o valor mensal de <strong>R$ {{valor_mensal}}</strong> ({{valor_mensal_extenso}}).</p>
    
    <p>3.2. O valor total do contrato para o período de vigência é de <strong>R$ {{valor_total}}</strong> ({{valor_total_extenso}}).</p>
    
    <p>3.3. O pagamento será realizado mensalmente, até o dia 10 (dez) de cada mês, mediante boleto bancário ou PIX, conforme preferência indicada pela CONTRATANTE.</p>
    
    <p>3.4. Em caso de atraso no pagamento, incidirão multa de 2% (dois por cento) sobre o valor devido, acrescida de juros de mora de 1% (um por cento) ao mês.</p>

    <h2>CLÁUSULA 4ª - DAS OBRIGAÇÕES DA LEGACY</h2>
    
    <p>4.1. Disponibilizar acesso à plataforma LEGACY OS conforme plano contratado;</p>
    <p>4.2. Garantir disponibilidade mínima de 99,5% (noventa e nove vírgula cinco por cento) mensal;</p>
    <p>4.3. Prestar suporte técnico via chat, email e telefone em horário comercial;</p>
    <p>4.4. Manter backup diário dos dados da CONTRATANTE;</p>
    <p>4.5. Implementar e manter medidas de segurança adequadas à proteção dos dados.</p>

    <h2>CLÁUSULA 5ª - DAS OBRIGAÇÕES DA CONTRATANTE</h2>
    
    <p>5.1. Efetuar os pagamentos nas datas acordadas;</p>
    <p>5.2. Utilizar a plataforma de acordo com as políticas de uso aceitável;</p>
    <p>5.3. Manter atualizados seus dados cadastrais;</p>
    <p>5.4. Não compartilhar credenciais de acesso com terceiros;</p>
    <p>5.5. Zelar pela confidencialidade das informações acessadas.</p>

    <h2>CLÁUSULA 6ª - DA PROTEÇÃO DE DADOS (LGPD)</h2>
    
    <p>6.1. As partes se comprometem a cumprir a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</p>
    <p>6.2. A LEGACY atua como operadora dos dados pessoais inseridos pela CONTRATANTE na plataforma.</p>
    <p>6.3. Os dados serão tratados exclusivamente para as finalidades previstas neste contrato.</p>

    <h2>CLÁUSULA 7ª - DA RESCISÃO</h2>
    
    <p>7.1. O presente contrato poderá ser rescindido:</p>
    <p>a) Por acordo entre as partes;</p>
    <p>b) Por inadimplemento de qualquer cláusula, mediante notificação prévia de 15 dias;</p>
    <p>c) Por solicitação de qualquer das partes, com aviso prévio de 30 dias.</p>
    
    <p>7.2. Em caso de rescisão antecipada pela CONTRATANTE, será devido o valor proporcional ao período utilizado.</p>

    <h2>CLÁUSULA 8ª - DAS DISPOSIÇÕES GERAIS</h2>
    
    <p>8.1. Este contrato é celebrado eletronicamente, com validade jurídica nos termos da Lei nº 14.063/2020.</p>
    <p>8.2. A assinatura eletrônica deste contrato equivale à assinatura manuscrita para todos os fins legais.</p>
    <p>8.3. Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias.</p>

    <div style="margin-top: 50px; text-align: center;">
        <p>São Paulo, {{data_contrato}}</p>
    </div>
    
    <div style="margin-top: 50px; display: flex; justify-content: space-between;">
        <div style="width: 45%; text-align: center;">
            <p style="border-top: 1px solid #000; padding-top: 10px;">
                <strong>LEGACY GOVERNANÇA LTDA.</strong><br/>
                CNPJ: 00.000.000/0001-00
            </p>
        </div>
        <div style="width: 45%; text-align: center;">
            <p style="border-top: 1px solid #000; padding-top: 10px;">
                <strong>{{cliente_nome}}</strong><br/>
                CNPJ: {{cliente_cnpj}}<br/>
                {{signatario_nome}}<br/>
                {{signatario_cargo}}
            </p>
        </div>
    </div>
</div>',
    '[
        {"key": "contrato_numero", "label": "Número do Contrato", "type": "text"},
        {"key": "cliente_nome", "label": "Nome do Cliente", "type": "text"},
        {"key": "cliente_cnpj", "label": "CNPJ do Cliente", "type": "text"},
        {"key": "cliente_endereco", "label": "Endereço do Cliente", "type": "text"},
        {"key": "signatario_nome", "label": "Nome do Signatário", "type": "text"},
        {"key": "signatario_cargo", "label": "Cargo do Signatário", "type": "text"},
        {"key": "signatario_cpf", "label": "CPF do Signatário", "type": "text"},
        {"key": "plano_nome", "label": "Nome do Plano", "type": "text"},
        {"key": "modulos_inclusos", "label": "Módulos Inclusos", "type": "text"},
        {"key": "addons", "label": "Add-ons Contratados", "type": "text"},
        {"key": "duracao_meses", "label": "Duração em Meses", "type": "number"},
        {"key": "duracao_extenso", "label": "Duração por Extenso", "type": "text"},
        {"key": "data_inicio", "label": "Data de Início", "type": "date"},
        {"key": "data_fim", "label": "Data de Término", "type": "date"},
        {"key": "valor_mensal", "label": "Valor Mensal", "type": "currency"},
        {"key": "valor_mensal_extenso", "label": "Valor Mensal por Extenso", "type": "text"},
        {"key": "valor_total", "label": "Valor Total", "type": "currency"},
        {"key": "valor_total_extenso", "label": "Valor Total por Extenso", "type": "text"},
        {"key": "data_contrato", "label": "Data do Contrato", "type": "date"}
    ]'::jsonb,
    true,
    true
) ON CONFLICT DO NOTHING;

-- =============================================================================
-- COMENTÁRIOS
-- =============================================================================

COMMENT ON TABLE public.contract_templates IS 'Templates/Minutas de contrato configuráveis pelo admin';
COMMENT ON TABLE public.contracts IS 'Contratos gerados e assinados';
COMMENT ON TABLE public.contract_events IS 'Histórico de eventos de cada contrato';
COMMENT ON TABLE public.contract_email_queue IS 'Fila de emails de contrato para processamento';
COMMENT ON FUNCTION generate_contract_number IS 'Gera número sequencial de contrato no formato CONT-YYYY-XXXX';
