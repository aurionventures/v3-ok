-- Migration: Sistema de Convites e Contratos para Parceiros/Afiliados
-- Descrição: Fluxo completo: Convite → Cadastro → Aprovação → Contrato → Assinatura
-- Data: 2026-01-19

-- =============================================================================
-- TABELA: partner_invitations
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.partner_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Dados do convite
    invitation_token TEXT NOT NULL UNIQUE,
    invitation_level TEXT NOT NULL CHECK (invitation_level IN ('afiliado_basico', 'afiliado_avancado', 'parceiro')),
    
    -- Dados do parceiro (preenchidos no cadastro)
    email TEXT,
    name TEXT,
    company_name TEXT,
    cnpj TEXT,
    phone TEXT,
    
    -- Status do convite
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending',      -- Link gerado, aguardando cadastro
        'submitted',    -- Parceiro se cadastrou, aguardando aprovação
        'approved',     -- Aprovado pelo Super ADM
        'rejected',     -- Rejeitado pelo Super ADM
        'expired',      -- Link expirado
        'used'          -- Já foi usado para criar parceiro
    )),
    
    -- Controle de expiração
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ,
    
    -- Quem criou o convite
    created_by UUID REFERENCES auth.users(id),
    
    -- Dados adicionais do cadastro (quando submitted)
    form_data JSONB DEFAULT '{}',
    
    -- Aprovação
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    -- Dados do parceiro criado (quando approved e usado)
    partner_user_id UUID REFERENCES auth.users(id),
    partner_settings_id UUID,
    
    -- Contrato associado
    partner_contract_id UUID
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_partner_invitations_token ON public.partner_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_partner_invitations_status ON public.partner_invitations(status);
CREATE INDEX IF NOT EXISTS idx_partner_invitations_email ON public.partner_invitations(email);
CREATE INDEX IF NOT EXISTS idx_partner_invitations_created_by ON public.partner_invitations(created_by);
CREATE INDEX IF NOT EXISTS idx_partner_invitations_expires_at ON public.partner_invitations(expires_at);
CREATE INDEX IF NOT EXISTS idx_partner_invitations_partner_user_id ON public.partner_invitations(partner_user_id);

-- Função para gerar token único
CREATE OR REPLACE FUNCTION generate_partner_invitation_token()
RETURNS TEXT AS $$
DECLARE
  token TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Gerar token no formato: inv_part_XXXXXXXXXXXX (16 caracteres alfanuméricos)
    token := 'inv_part_' || upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 16));
    
    -- Verificar se token já existe
    SELECT EXISTS(SELECT 1 FROM public.partner_invitations WHERE invitation_token = token) INTO exists_check;
    
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN token;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TABELA: partner_contracts
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.partner_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Referência ao parceiro
    partner_user_id UUID NOT NULL REFERENCES auth.users(id),
    partner_invitation_id UUID REFERENCES public.partner_invitations(id),
    
    -- Número e dados do contrato
    contract_number TEXT NOT NULL UNIQUE,
    contract_type TEXT DEFAULT 'partner_agreement' CHECK (contract_type IN ('partner_agreement', 'affiliate_agreement')),
    contract_level TEXT NOT NULL CHECK (contract_level IN ('afiliado_basico', 'afiliado_avancado', 'parceiro')),
    
    -- Dados do parceiro
    partner_name TEXT NOT NULL,
    partner_email TEXT NOT NULL,
    partner_company_name TEXT NOT NULL,
    partner_cnpj TEXT,
    partner_phone TEXT,
    
    -- Modelo de contrato usado
    contract_template_id UUID,
    content_html TEXT,
    content_pdf_url TEXT,
    
    -- Valores e termos
    commission_setup DECIMAL(10, 2), -- % de comissão sobre setup
    commission_recurring DECIMAL(10, 2), -- % de comissão sobre MRR
    recurring_commission_months INTEGER DEFAULT 12, -- Meses de comissão recorrente
    
    -- Período do contrato
    start_date DATE NOT NULL,
    end_date DATE,
    duration_months INTEGER,
    auto_renew BOOLEAN DEFAULT false,
    
    -- Status e assinaturas
    status TEXT DEFAULT 'draft' CHECK (status IN (
        'draft',                    -- Rascunho (criado mas não enviado)
        'pending_signature',        -- Aguardando assinatura do parceiro
        'partner_signed',           -- Parceiro assinou
        'counter_signed',           -- Legacy OS assinou (contrato ativo)
        'expired',                  -- Expirado
        'terminated',               -- Terminado
        'cancelled'                 -- Cancelado
    )),
    
    -- Token de assinatura
    partner_signature_token TEXT UNIQUE,
    partner_signature_token_expires_at TIMESTAMPTZ,
    
    -- Assinatura do parceiro
    partner_signed_at TIMESTAMPTZ,
    partner_signed_by TEXT,
    partner_signature_ip TEXT,
    partner_signature_user_agent TEXT,
    partner_signature_hash TEXT,
    
    -- Assinatura da Legacy OS
    legacy_signed_at TIMESTAMPTZ,
    legacy_signed_by UUID REFERENCES auth.users(id),
    legacy_signature_hash TEXT,
    
    -- Metadados
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_partner_contracts_partner_user_id ON public.partner_contracts(partner_user_id);
CREATE INDEX IF NOT EXISTS idx_partner_contracts_status ON public.partner_contracts(status);
CREATE INDEX IF NOT EXISTS idx_partner_contracts_contract_number ON public.partner_contracts(contract_number);
CREATE INDEX IF NOT EXISTS idx_partner_contracts_signature_token ON public.partner_contracts(partner_signature_token);
CREATE INDEX IF NOT EXISTS idx_partner_contracts_invitation_id ON public.partner_contracts(partner_invitation_id);

-- Função para gerar número de contrato
CREATE OR REPLACE FUNCTION generate_partner_contract_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year_part TEXT;
  seq_num INTEGER;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  
  -- Buscar próximo número sequencial do ano
  SELECT COALESCE(MAX(CAST(SUBSTRING(contract_number FROM 15) AS INTEGER)), 0) + 1
  INTO seq_num
  FROM public.partner_contracts
  WHERE contract_number LIKE 'CONTR-PAR-%' || year_part || '-%';
  
  new_number := 'CONTR-PAR-' || year_part || '-' || LPAD(seq_num::TEXT, 6, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TABELA: partner_contract_templates
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.partner_contract_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identificação do template
    name TEXT NOT NULL,
    description TEXT,
    contract_level TEXT NOT NULL CHECK (contract_level IN ('afiliado_basico', 'afiliado_avancado', 'parceiro')),
    
    -- Conteúdo do template
    content_html TEXT NOT NULL,
    content_variables JSONB DEFAULT '{}', -- Variáveis disponíveis no template
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    
    -- Versão
    version INTEGER DEFAULT 1,
    previous_version_id UUID REFERENCES public.partner_contract_templates(id),
    
    -- Metadados
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Índice para templates ativos por nível
CREATE INDEX IF NOT EXISTS idx_partner_contract_templates_level_active ON public.partner_contract_templates(contract_level, is_active, is_default);

-- Garantir apenas um template default por nível
CREATE UNIQUE INDEX IF NOT EXISTS idx_partner_contract_templates_default_level 
ON public.partner_contract_templates(contract_level) 
WHERE is_default = true AND is_active = true;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_partner_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_partner_invitations_updated_at
    BEFORE UPDATE ON public.partner_invitations
    FOR EACH ROW
    EXECUTE FUNCTION update_partner_updated_at();

CREATE TRIGGER trigger_partner_contracts_updated_at
    BEFORE UPDATE ON public.partner_contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_partner_updated_at();

CREATE TRIGGER trigger_partner_contract_templates_updated_at
    BEFORE UPDATE ON public.partner_contract_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_partner_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- RLS para partner_invitations
ALTER TABLE public.partner_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super ADM can view all partner invitations" ON public.partner_invitations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Super ADM can create partner invitations" ON public.partner_invitations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Super ADM can update partner invitations" ON public.partner_invitations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- RLS para partner_contracts
ALTER TABLE public.partner_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super ADM can manage all partner contracts" ON public.partner_contracts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Partners can view own contracts" ON public.partner_contracts
    FOR SELECT USING (
        partner_user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'parceiro'
        )
    );

-- RLS para partner_contract_templates
ALTER TABLE public.partner_contract_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage contract templates" ON public.partner_contract_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Política para permitir leitura pública de templates ativos (para assinatura)
CREATE POLICY "Anyone can read active contract templates" ON public.partner_contract_templates
    FOR SELECT USING (is_active = true);

-- =============================================================================
-- COMENTÁRIOS
-- =============================================================================

COMMENT ON TABLE public.partner_invitations IS 'Convites para parceiros/afiliados se cadastrarem através de link';
COMMENT ON COLUMN public.partner_invitations.invitation_level IS 'Nível do parceiro: afiliado_basico (N1), afiliado_avancado (N2), parceiro (N3)';
COMMENT ON COLUMN public.partner_invitations.form_data IS 'Dados do formulário preenchido pelo parceiro (JSON)';

COMMENT ON TABLE public.partner_contracts IS 'Contratos de parceiros/afiliados com a Legacy OS';
COMMENT ON COLUMN public.partner_contracts.contract_level IS 'Nível do contrato: afiliado_basico, afiliado_avancado, parceiro';
COMMENT ON COLUMN public.partner_contracts.partner_signature_token IS 'Token único para assinatura digital do contrato pelo parceiro';

COMMENT ON TABLE public.partner_contract_templates IS 'Templates de contratos para parceiros/afiliados';
COMMENT ON COLUMN public.partner_contract_templates.contract_level IS 'Nível para qual o template se aplica';
COMMENT ON COLUMN public.partner_contract_templates.content_variables IS 'Variáveis disponíveis no template (ex: {partner_name}, {commission_rate}, etc.)';
