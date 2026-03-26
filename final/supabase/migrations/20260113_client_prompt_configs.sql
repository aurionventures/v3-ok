-- ============================================================================
-- Migration: Client Prompt Configs
-- Description: Tabela para armazenar configurações de prompts por cliente/organização
-- ============================================================================

-- Tabela principal de configurações de prompts por cliente
CREATE TABLE IF NOT EXISTS client_prompt_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  agent_category TEXT NOT NULL, -- ex: 'agent_g_ata_generator'
  
  -- Prompt customizado do cliente (null = usa o padrão do Super Admin)
  custom_prompt TEXT,
  uses_default BOOLEAN DEFAULT true,
  
  -- Configurações de estilo
  tone TEXT DEFAULT 'executivo' CHECK (tone IN ('formal', 'semi-formal', 'executivo', 'tecnico')),
  verbal_person TEXT DEFAULT 'terceira' CHECK (verbal_person IN ('terceira', 'primeira_plural')),
  summary_length INTEGER DEFAULT 200 CHECK (summary_length >= 50 AND summary_length <= 1000),
  custom_instructions TEXT,
  
  -- Modo avançado
  advanced_mode BOOLEAN DEFAULT false,
  
  -- Auto-aprovação de ATAs
  auto_approval_days INTEGER CHECK (auto_approval_days IS NULL OR auto_approval_days >= 1),
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID,
  updated_by UUID,
  
  -- Constraint única por organização + categoria de agente
  UNIQUE(organization_id, agent_category)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_client_prompt_configs_org ON client_prompt_configs(organization_id);
CREATE INDEX IF NOT EXISTS idx_client_prompt_configs_category ON client_prompt_configs(agent_category);
CREATE INDEX IF NOT EXISTS idx_client_prompt_configs_org_category ON client_prompt_configs(organization_id, agent_category);

-- Adicionar campo suggested_client_prompt na tabela ai_prompt_library (se existir)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ai_prompt_library') THEN
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'ai_prompt_library' 
                   AND column_name = 'suggested_client_prompt') THEN
      ALTER TABLE ai_prompt_library ADD COLUMN suggested_client_prompt TEXT;
    END IF;
  END IF;
END $$;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_client_prompt_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_client_prompt_configs_updated_at ON client_prompt_configs;
CREATE TRIGGER trigger_update_client_prompt_configs_updated_at
  BEFORE UPDATE ON client_prompt_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_client_prompt_configs_updated_at();

-- RLS (Row Level Security)
ALTER TABLE client_prompt_configs ENABLE ROW LEVEL SECURITY;

-- Política: Super Admin pode ver todas as configurações
CREATE POLICY "Super admins can view all client prompt configs"
  ON client_prompt_configs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

-- Política: Usuários podem ver configurações da própria organização
CREATE POLICY "Users can view own organization prompt configs"
  ON client_prompt_configs
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Política: Admins da organização podem inserir/atualizar
CREATE POLICY "Org admins can insert prompt configs"
  ON client_prompt_configs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Org admins can update prompt configs"
  ON client_prompt_configs
  FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'owner')
    )
  );

-- Comentários na tabela
COMMENT ON TABLE client_prompt_configs IS 'Configurações de prompts customizadas por cliente/organização';
COMMENT ON COLUMN client_prompt_configs.agent_category IS 'Categoria do agente (ex: agent_g_ata_generator)';
COMMENT ON COLUMN client_prompt_configs.custom_prompt IS 'Prompt customizado pelo cliente. Se NULL, usa o prompt padrão do Super Admin';
COMMENT ON COLUMN client_prompt_configs.uses_default IS 'Se TRUE, usa o prompt padrão do ai_prompt_library. Se FALSE, usa custom_prompt';
COMMENT ON COLUMN client_prompt_configs.advanced_mode IS 'Se TRUE, permite edição completa do prompt. Se FALSE, usa modo simplificado com parâmetros';
