-- Estende pautas com campos usados na Definição de Pauta (GestaoReuniao)
ALTER TABLE pautas
  ADD COLUMN IF NOT EXISTS descricao text,
  ADD COLUMN IF NOT EXISTS apresentador text,
  ADD COLUMN IF NOT EXISTS tipo text DEFAULT 'informativo';
