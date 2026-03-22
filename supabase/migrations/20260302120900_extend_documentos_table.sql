-- Estende documentos com campos úteis para o checklist
ALTER TABLE documentos
  ADD COLUMN IF NOT EXISTS tamanho bigint,
  ADD COLUMN IF NOT EXISTS categoria text,
  ADD COLUMN IF NOT EXISTS descricao text;
