-- Reprovação por membro (com comentário) e revisão pelo ADM
ALTER TABLE ata_aprovacoes
  ADD COLUMN IF NOT EXISTS reprovado_em timestamptz,
  ADD COLUMN IF NOT EXISTS reprovacao_comentario text,
  ADD COLUMN IF NOT EXISTS admin_revisao text DEFAULT 'pendente'
    CHECK (admin_revisao IN ('pendente', 'aceito', 'reprovado')),
  ADD COLUMN IF NOT EXISTS admin_revisao_em timestamptz,
  ADD COLUMN IF NOT EXISTS admin_revisao_por uuid;
