-- FASE 1: Adicionar suporte para Comitês e Comissões

-- 1.1. Modificar tabela councils para suportar tipos de órgãos
ALTER TABLE councils ADD COLUMN IF NOT EXISTS organ_type TEXT DEFAULT 'conselho' CHECK (organ_type IN ('conselho', 'comite', 'comissao'));
ALTER TABLE councils ADD COLUMN IF NOT EXISTS hierarchy_level INTEGER DEFAULT 1;
ALTER TABLE councils ADD COLUMN IF NOT EXISTS access_config JSONB DEFAULT '{
  "public_view": false,
  "member_upload": true,
  "guest_upload": false,
  "require_approval": false
}'::jsonb;

-- Índice para melhor performance em queries por tipo
CREATE INDEX IF NOT EXISTS idx_councils_organ_type ON councils(organ_type);
CREATE INDEX IF NOT EXISTS idx_councils_company_organ_type ON councils(company_id, organ_type);

-- 1.2. Expandir tabela meeting_participants para convidados especiais
ALTER TABLE meeting_participants ADD COLUMN IF NOT EXISTS participant_type TEXT DEFAULT 'member' CHECK (participant_type IN ('member', 'guest', 'external'));
ALTER TABLE meeting_participants ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{
  "can_view_agenda": true,
  "can_upload_documents": false,
  "can_comment": false,
  "can_vote": false,
  "view_restricted_items": false
}'::jsonb;

-- Índice para queries de permissões
CREATE INDEX IF NOT EXISTS idx_meeting_participants_type ON meeting_participants(participant_type);

-- 1.3. Comentários para documentação
COMMENT ON COLUMN councils.organ_type IS 'Tipo de órgão: conselho (Conselho Administrativo/Fiscal), comite (Comitê de Auditoria, etc), comissao (Comissão temporária)';
COMMENT ON COLUMN councils.hierarchy_level IS 'Nível hierárquico: 1=mais alto (conselhos), 2=intermediário (comitês), 3=operacional (comissões)';
COMMENT ON COLUMN councils.access_config IS 'Configurações de acesso e permissões do órgão';
COMMENT ON COLUMN meeting_participants.participant_type IS 'Tipo de participante: member (membro permanente), guest (convidado com permissões especiais), external (externo temporário)';
COMMENT ON COLUMN meeting_participants.permissions IS 'Permissões granulares do participante';