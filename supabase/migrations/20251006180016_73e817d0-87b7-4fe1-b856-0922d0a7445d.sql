-- Resetar senhas dos usuários demo com o formato correto do Supabase
-- Usando a extensão pgcrypto para gerar os hashes

-- Garantir que a extensão pgcrypto está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Resetar senha do admin (admin123)
UPDATE auth.users
SET 
  encrypted_password = crypt('admin123', gen_salt('bf')),
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  confirmation_token = NULL,
  recovery_token = NULL
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Resetar senha do parceiro (parceiro123)
UPDATE auth.users
SET 
  encrypted_password = crypt('parceiro123', gen_salt('bf')),
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  confirmation_token = NULL,
  recovery_token = NULL
WHERE id = '00000000-0000-0000-0000-000000000002';

-- Resetar senha do cliente (123456)
UPDATE auth.users
SET 
  encrypted_password = crypt('123456', gen_salt('bf')),
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  confirmation_token = NULL,
  recovery_token = NULL
WHERE id = '00000000-0000-0000-0000-000000000003';