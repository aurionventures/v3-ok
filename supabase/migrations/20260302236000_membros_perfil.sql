-- Perfil estendido do membro: formação, LinkedIn, certificados, bio
ALTER TABLE membros_governanca
  ADD COLUMN IF NOT EXISTS formacao text,
  ADD COLUMN IF NOT EXISTS linkedin text,
  ADD COLUMN IF NOT EXISTS certificados text,
  ADD COLUMN IF NOT EXISTS bio text;
