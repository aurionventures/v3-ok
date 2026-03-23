-- Status da ATA no fluxo de aprovação/assinatura
ALTER TABLE atas ADD COLUMN IF NOT EXISTS status text DEFAULT 'aguardando_aprovacao'
  CHECK (status IN ('aguardando_aprovacao', 'aguardando_assinatura', 'finalizada'));
-- ATAs existentes (criadas antes do fluxo) são consideradas finalizadas
UPDATE atas SET status = 'finalizada';

-- Aprovações da ATA por membro (fase 1)
CREATE TABLE IF NOT EXISTS ata_aprovacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ata_id uuid NOT NULL REFERENCES atas(id) ON DELETE CASCADE,
  membro_id uuid NOT NULL REFERENCES membros_governanca(id) ON DELETE CASCADE,
  aprovado_em timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(ata_id, membro_id)
);
CREATE INDEX IF NOT EXISTS idx_ata_aprovacoes_ata ON ata_aprovacoes(ata_id);
CREATE INDEX IF NOT EXISTS idx_ata_aprovacoes_membro ON ata_aprovacoes(membro_id);

-- Assinaturas da ATA por membro (fase 2 - após todas aprovações)
CREATE TABLE IF NOT EXISTS ata_assinaturas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ata_id uuid NOT NULL REFERENCES atas(id) ON DELETE CASCADE,
  membro_id uuid NOT NULL REFERENCES membros_governanca(id) ON DELETE CASCADE,
  assinado_em timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(ata_id, membro_id)
);
CREATE INDEX IF NOT EXISTS idx_ata_assinaturas_ata ON ata_assinaturas(ata_id);
CREATE INDEX IF NOT EXISTS idx_ata_assinaturas_membro ON ata_assinaturas(membro_id);
