-- Estende entrevistas com nome, papel, prioridade, status e transcricao
ALTER TABLE entrevistas
  ADD COLUMN IF NOT EXISTS nome_entrevistado text,
  ADD COLUMN IF NOT EXISTS papel text,
  ADD COLUMN IF NOT EXISTS prioridade text DEFAULT 'Média',
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'pendente',
  ADD COLUMN IF NOT EXISTS transcricao text;
