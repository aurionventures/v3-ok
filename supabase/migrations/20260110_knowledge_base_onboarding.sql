-- =====================================================
-- LEGACY OS - KNOWLEDGE BASE & ONBOARDING SYSTEM
-- Migration: Tabelas para Cold Start Solution
-- Data: 2026-01-10
-- =====================================================

-- Enable vector extension for embeddings (if not already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- =====================================================
-- 1. TABELA: company_profile (Expandida)
-- Armazena perfil completo da empresa para MOAT Engine
-- =====================================================
CREATE TABLE IF NOT EXISTS public.company_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL,
  
  -- FASE 1: Dados Basicos
  legal_name TEXT NOT NULL,
  trade_name TEXT,
  tax_id TEXT NOT NULL,
  founded_date DATE,
  company_size TEXT CHECK (company_size IN (
    'startup',
    'small',
    'medium',
    'large',
    'enterprise'
  )),
  
  -- Setor e Industria
  primary_sector TEXT NOT NULL,
  secondary_sectors TEXT[],
  industry_vertical TEXT,
  naics_code TEXT,
  
  -- Geografia
  headquarters_country TEXT DEFAULT 'BR',
  headquarters_state TEXT,
  headquarters_city TEXT,
  operating_countries TEXT[],
  operating_states TEXT[],
  
  -- Financeiro
  annual_revenue_range TEXT CHECK (annual_revenue_range IN (
    'under_1m',
    '1m_10m',
    '10m_50m',
    '50m_200m',
    '200m_1b',
    'over_1b'
  )),
  is_publicly_traded BOOLEAN DEFAULT false,
  stock_ticker TEXT,
  
  -- Estrutura
  ownership_structure TEXT CHECK (ownership_structure IN (
    'family_owned',
    'private_equity',
    'publicly_traded',
    'cooperative',
    'state_owned',
    'mixed'
  )),
  number_of_shareholders INT,
  
  -- Produtos e Servicos
  products_services JSONB,
  target_markets TEXT[],
  customer_segments TEXT[],
  
  -- Sistemas e Tecnologia
  erp_system TEXT,
  crm_system TEXT,
  bi_tools TEXT[],
  other_systems JSONB,
  
  -- Dados Disponiveis
  has_financial_data BOOLEAN DEFAULT false,
  has_operational_data BOOLEAN DEFAULT false,
  has_hr_data BOOLEAN DEFAULT false,
  has_sales_data BOOLEAN DEFAULT false,
  has_compliance_data BOOLEAN DEFAULT false,
  data_systems_integrated TEXT[],
  
  -- Compliance e Certificacoes
  certifications TEXT[],
  regulatory_bodies TEXT[],
  compliance_frameworks TEXT[],
  
  -- Onboarding Status
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_completed_at TIMESTAMP WITH TIME ZONE,
  knowledge_base_score INT DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_company_profile UNIQUE(company_id)
);

CREATE INDEX IF NOT EXISTS idx_company_profile_sector ON public.company_profile(primary_sector);
CREATE INDEX IF NOT EXISTS idx_company_profile_size ON public.company_profile(company_size);
CREATE INDEX IF NOT EXISTS idx_company_profile_company_id ON public.company_profile(company_id);

-- =====================================================
-- 2. TABELA: company_strategic_context
-- Contexto estrategico para Agent C do MOAT
-- =====================================================
CREATE TABLE IF NOT EXISTS public.company_strategic_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL,
  
  -- FASE 3: Contexto Estrategico
  mission TEXT,
  vision TEXT,
  values TEXT[],
  
  -- Estrategia de Negocio
  business_model TEXT,
  competitive_advantages TEXT[],
  key_success_factors TEXT[],
  
  -- Objetivos Estrategicos
  strategic_objectives JSONB,
  okrs JSONB,
  planning_horizon TEXT CHECK (planning_horizon IN (
    '1_year',
    '3_years',
    '5_years',
    '10_years'
  )),
  
  -- Stakeholders
  key_stakeholders JSONB,
  customer_concentration TEXT CHECK (customer_concentration IN ('low', 'medium', 'high')),
  top_customers_percentage DECIMAL(5,2),
  supplier_concentration TEXT CHECK (supplier_concentration IN ('low', 'medium', 'high')),
  
  -- Mercado e Competicao
  market_position TEXT CHECK (market_position IN (
    'market_leader',
    'challenger',
    'follower',
    'niche_player'
  )),
  main_competitors TEXT[],
  competitive_intensity TEXT CHECK (competitive_intensity IN (
    'low',
    'moderate',
    'high',
    'very_high'
  )),
  
  -- Riscos Conhecidos
  known_risks JSONB,
  risk_appetite TEXT CHECK (risk_appetite IN (
    'conservative',
    'moderate',
    'aggressive'
  )),
  
  -- M&A e Investimentos
  recent_acquisitions JSONB,
  expansion_plans TEXT,
  investment_priorities TEXT[],
  
  -- ESG
  esg_commitments TEXT[],
  sustainability_goals JSONB,
  social_programs TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_company_strategic UNIQUE(company_id)
);

CREATE INDEX IF NOT EXISTS idx_strategic_context_company ON public.company_strategic_context(company_id);

-- =====================================================
-- 3. TIPO ENUM: document_category
-- Categorias de documentos para a biblioteca
-- =====================================================
DO $$ BEGIN
  CREATE TYPE document_category AS ENUM (
    'governance',
    'financial',
    'strategic',
    'operational',
    'legal',
    'minutes',
    'compliance',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 4. TABELA: document_library
-- Biblioteca de documentos com embeddings
-- =====================================================
CREATE TABLE IF NOT EXISTS public.document_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL,
  
  -- Documento
  title TEXT NOT NULL,
  category document_category NOT NULL,
  file_path TEXT NOT NULL,
  file_size INT,
  file_type TEXT,
  
  -- Metadados
  document_date DATE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by UUID,
  
  -- Processamento
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN (
    'pending',
    'processing',
    'completed',
    'failed'
  )),
  processed_at TIMESTAMP WITH TIME ZONE,
  
  -- Conteudo Extraido
  extracted_text TEXT,
  text_embedding vector(1536),
  
  -- Entidades Reconhecidas
  entities_detected JSONB,
  topics JSONB,
  sentiment_score DECIMAL(5,2),
  
  -- Relevancia para MOAT
  relevant_for_agent_a BOOLEAN DEFAULT false,
  relevant_for_agent_b BOOLEAN DEFAULT true,
  relevant_for_agent_c BOOLEAN DEFAULT false,
  relevant_for_agent_d BOOLEAN DEFAULT false,
  
  -- Indexacao
  is_indexed BOOLEAN DEFAULT false,
  index_last_updated TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_document_company ON public.document_library(company_id);
CREATE INDEX IF NOT EXISTS idx_document_category ON public.document_library(category);
CREATE INDEX IF NOT EXISTS idx_document_status ON public.document_library(processing_status);

-- =====================================================
-- 5. TABELA: governance_history_seed
-- Historico de governanca extraido de documentos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.governance_history_seed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL,
  
  -- Tipo de Registro Historico
  record_type TEXT CHECK (record_type IN (
    'decision',
    'risk',
    'task',
    'meeting',
    'policy',
    'incident'
  )),
  
  -- Dados do Registro
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  
  -- Decisao (se aplicavel)
  decision_outcome TEXT,
  decision_rationale TEXT,
  
  -- Risco (se aplicavel)
  risk_category TEXT,
  risk_severity TEXT CHECK (risk_severity IN ('low', 'medium', 'high', 'critical')),
  risk_status TEXT CHECK (risk_status IN ('open', 'mitigated', 'accepted', 'closed')),
  
  -- Impacto
  impact_financial DECIMAL(15,2),
  impact_operational TEXT,
  impact_reputational TEXT,
  
  -- Relacionamentos
  related_to UUID[],
  
  -- Status
  status TEXT DEFAULT 'completed',
  
  -- Metadados
  source TEXT,
  source_document_id UUID REFERENCES public.document_library(id) ON DELETE SET NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_history_seed_company ON public.governance_history_seed(company_id);
CREATE INDEX IF NOT EXISTS idx_history_seed_type ON public.governance_history_seed(record_type);
CREATE INDEX IF NOT EXISTS idx_history_seed_date ON public.governance_history_seed(date DESC);

-- =====================================================
-- 6. TABELA: onboarding_progress
-- Progresso do onboarding por empresa
-- =====================================================
CREATE TABLE IF NOT EXISTS public.onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL,
  
  -- Fases
  phase_1_basic_setup BOOLEAN DEFAULT false,
  phase_1_completed_at TIMESTAMP WITH TIME ZONE,
  
  phase_2_document_upload BOOLEAN DEFAULT false,
  phase_2_completed_at TIMESTAMP WITH TIME ZONE,
  
  phase_3_strategic_context BOOLEAN DEFAULT false,
  phase_3_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Scores de Completude
  basic_setup_score INT DEFAULT 0,
  document_upload_score INT DEFAULT 0,
  strategic_context_score INT DEFAULT 0,
  overall_score INT DEFAULT 0,
  
  -- Documentos Uploaded
  documents_uploaded INT DEFAULT 0,
  documents_processed INT DEFAULT 0,
  
  -- Dados Preenchidos
  fields_completed INT DEFAULT 0,
  fields_total INT DEFAULT 50,
  
  -- Status Geral
  status TEXT DEFAULT 'not_started' CHECK (status IN (
    'not_started',
    'in_progress',
    'completed',
    'needs_review'
  )),
  
  -- Recomendacoes
  next_steps JSONB,
  missing_critical_data TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_onboarding_company UNIQUE(company_id)
);

CREATE INDEX IF NOT EXISTS idx_onboarding_company ON public.onboarding_progress(company_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_status ON public.onboarding_progress(status);

-- =====================================================
-- 7. EXPANDIR: council_members
-- Adicionar campos de perfil expandido
-- =====================================================
ALTER TABLE public.council_members ADD COLUMN IF NOT EXISTS expertise_areas TEXT[];
ALTER TABLE public.council_members ADD COLUMN IF NOT EXISTS industry_experience TEXT[];
ALTER TABLE public.council_members ADD COLUMN IF NOT EXISTS previous_boards TEXT[];
ALTER TABLE public.council_members ADD COLUMN IF NOT EXISTS certifications TEXT[];
ALTER TABLE public.council_members ADD COLUMN IF NOT EXISTS languages TEXT[];
ALTER TABLE public.council_members ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.council_members ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.council_members ADD COLUMN IF NOT EXISTS key_strengths TEXT[];
ALTER TABLE public.council_members ADD COLUMN IF NOT EXISTS development_areas TEXT[];

-- =====================================================
-- 8. TRIGGERS para updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_company_profile_updated_at ON public.company_profile;
CREATE TRIGGER update_company_profile_updated_at
  BEFORE UPDATE ON public.company_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_updated_at();

DROP TRIGGER IF EXISTS update_strategic_context_updated_at ON public.company_strategic_context;
CREATE TRIGGER update_strategic_context_updated_at
  BEFORE UPDATE ON public.company_strategic_context
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_updated_at();

DROP TRIGGER IF EXISTS update_onboarding_progress_updated_at ON public.onboarding_progress;
CREATE TRIGGER update_onboarding_progress_updated_at
  BEFORE UPDATE ON public.onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_updated_at();

-- =====================================================
-- 9. RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.company_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_strategic_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_history_seed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Company Profile Policies
CREATE POLICY "Users can view their company profile" ON public.company_profile
  FOR SELECT USING (
    company_id IN (SELECT company FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert their company profile" ON public.company_profile
  FOR INSERT WITH CHECK (
    company_id IN (SELECT company FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their company profile" ON public.company_profile
  FOR UPDATE USING (
    company_id IN (SELECT company FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can manage all company profiles" ON public.company_profile
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Strategic Context Policies
CREATE POLICY "Users can view their company strategic context" ON public.company_strategic_context
  FOR SELECT USING (
    company_id IN (SELECT company FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert their company strategic context" ON public.company_strategic_context
  FOR INSERT WITH CHECK (
    company_id IN (SELECT company FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their company strategic context" ON public.company_strategic_context
  FOR UPDATE USING (
    company_id IN (SELECT company FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can manage all strategic contexts" ON public.company_strategic_context
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Document Library Policies
CREATE POLICY "Users can view their company documents" ON public.document_library
  FOR SELECT USING (
    company_id IN (SELECT company FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can upload documents to their company" ON public.document_library
  FOR INSERT WITH CHECK (
    company_id IN (SELECT company FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their company documents" ON public.document_library
  FOR UPDATE USING (
    company_id IN (SELECT company FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can delete their company documents" ON public.document_library
  FOR DELETE USING (
    company_id IN (SELECT company FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can manage all documents" ON public.document_library
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Governance History Seed Policies
CREATE POLICY "Users can view their company governance history" ON public.governance_history_seed
  FOR SELECT USING (
    company_id IN (SELECT company FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert governance history" ON public.governance_history_seed
  FOR INSERT WITH CHECK (
    company_id IN (SELECT company FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can manage all governance history" ON public.governance_history_seed
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Onboarding Progress Policies
CREATE POLICY "Users can view their company onboarding progress" ON public.onboarding_progress
  FOR SELECT USING (
    company_id IN (SELECT company FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert their company onboarding progress" ON public.onboarding_progress
  FOR INSERT WITH CHECK (
    company_id IN (SELECT company FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their company onboarding progress" ON public.onboarding_progress
  FOR UPDATE USING (
    company_id IN (SELECT company FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can manage all onboarding progress" ON public.onboarding_progress
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =====================================================
-- 10. FUNCAO: calculate_knowledge_base_score
-- Calcula o score do Knowledge Base
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_knowledge_base_score(p_company_id TEXT)
RETURNS INT AS $$
DECLARE
  basic_score INT := 0;
  doc_score INT := 0;
  strategic_score INT := 0;
  total_score INT := 0;
  profile_record RECORD;
  strategic_record RECORD;
  doc_count INT := 0;
BEGIN
  -- Calcular score basico (30%)
  SELECT * INTO profile_record FROM public.company_profile WHERE company_id = p_company_id;
  
  IF FOUND THEN
    IF profile_record.legal_name IS NOT NULL THEN basic_score := basic_score + 10; END IF;
    IF profile_record.tax_id IS NOT NULL THEN basic_score := basic_score + 10; END IF;
    IF profile_record.primary_sector IS NOT NULL THEN basic_score := basic_score + 10; END IF;
    IF profile_record.company_size IS NOT NULL THEN basic_score := basic_score + 10; END IF;
    IF profile_record.headquarters_country IS NOT NULL THEN basic_score := basic_score + 10; END IF;
    IF profile_record.annual_revenue_range IS NOT NULL THEN basic_score := basic_score + 10; END IF;
    IF profile_record.ownership_structure IS NOT NULL THEN basic_score := basic_score + 10; END IF;
    IF profile_record.products_services IS NOT NULL THEN basic_score := basic_score + 10; END IF;
    IF profile_record.target_markets IS NOT NULL THEN basic_score := basic_score + 10; END IF;
    IF profile_record.certifications IS NOT NULL THEN basic_score := basic_score + 10; END IF;
  END IF;
  
  -- Calcular score de documentos (40%)
  SELECT COUNT(*) INTO doc_count FROM public.document_library 
  WHERE company_id = p_company_id AND processing_status = 'completed';
  
  doc_score := LEAST(doc_count * 10, 100);
  
  -- Calcular score estrategico (30%)
  SELECT * INTO strategic_record FROM public.company_strategic_context WHERE company_id = p_company_id;
  
  IF FOUND THEN
    IF strategic_record.mission IS NOT NULL THEN strategic_score := strategic_score + 15; END IF;
    IF strategic_record.vision IS NOT NULL THEN strategic_score := strategic_score + 15; END IF;
    IF strategic_record.values IS NOT NULL THEN strategic_score := strategic_score + 10; END IF;
    IF strategic_record.strategic_objectives IS NOT NULL THEN strategic_score := strategic_score + 15; END IF;
    IF strategic_record.key_stakeholders IS NOT NULL THEN strategic_score := strategic_score + 15; END IF;
    IF strategic_record.market_position IS NOT NULL THEN strategic_score := strategic_score + 10; END IF;
    IF strategic_record.known_risks IS NOT NULL THEN strategic_score := strategic_score + 20; END IF;
  END IF;
  
  -- Calcular score total ponderado
  total_score := (basic_score * 30 + doc_score * 40 + strategic_score * 30) / 100;
  
  -- Atualizar company_profile
  UPDATE public.company_profile 
  SET knowledge_base_score = total_score 
  WHERE company_id = p_company_id;
  
  -- Atualizar onboarding_progress
  UPDATE public.onboarding_progress 
  SET 
    basic_setup_score = basic_score,
    document_upload_score = doc_score,
    strategic_context_score = strategic_score,
    overall_score = total_score
  WHERE company_id = p_company_id;
  
  RETURN total_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE public.company_profile IS 'Perfil completo da empresa para o MOAT Engine - resolve o Cold Start Problem';
COMMENT ON TABLE public.company_strategic_context IS 'Contexto estrategico da empresa - missao, visao, objetivos, riscos';
COMMENT ON TABLE public.document_library IS 'Biblioteca de documentos com embeddings para busca semantica';
COMMENT ON TABLE public.governance_history_seed IS 'Historico de governanca extraido de documentos antigos';
COMMENT ON TABLE public.onboarding_progress IS 'Progresso do onboarding por empresa';

