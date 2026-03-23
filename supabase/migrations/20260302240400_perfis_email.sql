-- Email do ADM em perfis (para exibição na gestão de empresas)
ALTER TABLE perfis
  ADD COLUMN IF NOT EXISTS email text;
