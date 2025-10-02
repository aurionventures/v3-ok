-- Create 3 real demo users in auth.users with fixed IDs matching the users table

-- Admin user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'admin@gov.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Admin Demo"}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE
SET encrypted_password = crypt('admin123', gen_salt('bf')),
    email_confirmed_at = now();

-- Partner user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'parceiro@consultor.com',
  crypt('parceiro123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Parceiro Demo","company":"Consultoria Demo"}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE
SET encrypted_password = crypt('parceiro123', gen_salt('bf')),
    email_confirmed_at = now();

-- Client user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000000',
  'cliente@empresa.com',
  crypt('123456', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Cliente Demo","company":"Empresa Demo"}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE
SET encrypted_password = crypt('123456', gen_salt('bf')),
    email_confirmed_at = now();