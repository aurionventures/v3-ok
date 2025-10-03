-- Adicionar mais 7 clientes fictícios vinculados ao parceiro demo
-- Parceiro ID: 00000000-0000-0000-0000-000000000002

-- Cliente 6: Indústria Metalúrgica
INSERT INTO public.users (
  id,
  email,
  name,
  company,
  sector,
  phone,
  created_by_partner
) VALUES (
  '10000000-0000-0000-0000-000000000006',
  'contato@metalurgicasul.com.br',
  'Roberto Santos',
  'Metalúrgica Sul',
  'Industrial',
  '(51) 3456-7890',
  '00000000-0000-0000-0000-000000000002'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES ('10000000-0000-0000-0000-000000000006', 'cliente')
ON CONFLICT (user_id, role) DO NOTHING;

-- Cliente 7: Construtora
INSERT INTO public.users (
  id,
  email,
  name,
  company,
  sector,
  phone,
  created_by_partner
) VALUES (
  '10000000-0000-0000-0000-000000000007',
  'diretoria@construbase.com.br',
  'Ana Paula Costa',
  'Construbase Engenharia',
  'Construção',
  '(11) 2345-6789',
  '00000000-0000-0000-0000-000000000002'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES ('10000000-0000-0000-0000-000000000007', 'cliente')
ON CONFLICT (user_id, role) DO NOTHING;

-- Cliente 8: Agronegócio
INSERT INTO public.users (
  id,
  email,
  name,
  company,
  sector,
  phone,
  created_by_partner
) VALUES (
  '10000000-0000-0000-0000-000000000008',
  'comercial@agroforte.agr.br',
  'José Carlos Oliveira',
  'AgroForte',
  'Agronegócio',
  '(67) 3234-5678',
  '00000000-0000-0000-0000-000000000002'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES ('10000000-0000-0000-0000-000000000008', 'cliente')
ON CONFLICT (user_id, role) DO NOTHING;

-- Cliente 9: Transportadora
INSERT INTO public.users (
  id,
  email,
  name,
  company,
  sector,
  phone,
  created_by_partner
) VALUES (
  '10000000-0000-0000-0000-000000000009',
  'gerencia@rapidlog.com.br',
  'Marcos Pereira',
  'RapidLog Transportes',
  'Logística',
  '(21) 4567-8901',
  '00000000-0000-0000-0000-000000000002'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES ('10000000-0000-0000-0000-000000000009', 'cliente')
ON CONFLICT (user_id, role) DO NOTHING;

-- Cliente 10: Hospital
INSERT INTO public.users (
  id,
  email,
  name,
  company,
  sector,
  phone,
  created_by_partner
) VALUES (
  '10000000-0000-0000-0000-000000000010',
  'administracao@hospitalvida.med.br',
  'Dra. Patricia Lima',
  'Hospital Vida Plena',
  'Saúde',
  '(41) 3678-9012',
  '00000000-0000-0000-0000-000000000002'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES ('10000000-0000-0000-0000-000000000010', 'cliente')
ON CONFLICT (user_id, role) DO NOTHING;

-- Cliente 11: Rede de Supermercados
INSERT INTO public.users (
  id,
  email,
  name,
  company,
  sector,
  phone,
  created_by_partner
) VALUES (
  '10000000-0000-0000-0000-000000000011',
  'presidencia@supermax.com.br',
  'Fernando Almeida',
  'SuperMax Varejo',
  'Varejo',
  '(85) 2890-1234',
  '00000000-0000-0000-0000-000000000002'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES ('10000000-0000-0000-0000-000000000011', 'cliente')
ON CONFLICT (user_id, role) DO NOTHING;

-- Cliente 12: Instituto de Educação
INSERT INTO public.users (
  id,
  email,
  name,
  company,
  sector,
  phone,
  created_by_partner
) VALUES (
  '10000000-0000-0000-0000-000000000012',
  'reitoria@escolanova.edu.br',
  'Prof. Helena Martins',
  'Instituto Escola Nova',
  'Educação',
  '(31) 3901-2345',
  '00000000-0000-0000-0000-000000000002'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES ('10000000-0000-0000-0000-000000000012', 'cliente')
ON CONFLICT (user_id, role) DO NOTHING;