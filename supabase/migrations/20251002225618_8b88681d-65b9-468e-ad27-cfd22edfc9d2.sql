-- ============================================
-- FASE 1: Criar Estrutura do Banco de Dados
-- ============================================

-- 1.1 Criar Enum para Roles (SEGURANÇA: Roles em tabela separada)
CREATE TYPE public.app_role AS ENUM ('admin', 'parceiro', 'cliente', 'user');

-- 1.2 Criar Tabela Users (SEM campo role direto)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  sector TEXT,
  phone TEXT,
  created_by_partner UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 1.3 Criar Tabela User Roles (SEGURANÇA: Roles separados)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- 1.4 Criar Tabela Access Codes (para convites)
CREATE TABLE public.access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_by_partner UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 1.5 Índices para Performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_created_by_partner ON public.users(created_by_partner);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_access_codes_email ON public.access_codes(email);
CREATE INDEX idx_access_codes_code ON public.access_codes(code);

-- 1.6 Trigger para Updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- FASE 2: Configurar RLS e Funções de Segurança
-- ============================================

-- 2.1 Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- 2.2 Criar Função Security Definer (CRÍTICO: Evita recursão RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 2.3 Função para obter role do usuário
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS public.app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- 2.4 RLS Policies para USERS
CREATE POLICY "Admins can view all users"
ON public.users FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can view their clients"
ON public.users FOR SELECT
USING (
  public.has_role(auth.uid(), 'parceiro')
  AND (id = auth.uid() OR created_by_partner = auth.uid())
);

CREATE POLICY "Users can view themselves"
ON public.users FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Admins can manage all users"
ON public.users FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can create clients"
ON public.users FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'parceiro')
  AND created_by_partner = auth.uid()
);

CREATE POLICY "Partners can update their clients"
ON public.users FOR UPDATE
USING (
  public.has_role(auth.uid(), 'parceiro')
  AND created_by_partner = auth.uid()
);

-- 2.5 RLS Policies para USER_ROLES
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Partners can view client roles"
ON public.user_roles FOR SELECT
USING (
  public.has_role(auth.uid(), 'parceiro')
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_roles.user_id
    AND created_by_partner = auth.uid()
  )
);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 2.6 RLS Policies para ACCESS_CODES
CREATE POLICY "Admins can view all access codes"
ON public.access_codes FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can view their access codes"
ON public.access_codes FOR SELECT
USING (created_by_partner = auth.uid());

CREATE POLICY "Admins can manage all access codes"
ON public.access_codes FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can create access codes"
ON public.access_codes FOR INSERT
WITH CHECK (created_by_partner = auth.uid());

-- ============================================
-- FASE 3: Popular Dados Demo
-- ============================================

-- 3.1 Inserir Admin Demo
INSERT INTO public.users (id, email, name, company)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@gov.com', 'Admin Master', 'Legacy Governance');

INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin');

-- 3.2 Inserir Parceiro Demo
INSERT INTO public.users (id, email, name, company)
VALUES ('00000000-0000-0000-0000-000000000002', 'parceiro@consultor.com', 'Parceiro Demo', 'Consultoria Demo');

INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000002', 'parceiro');

-- 3.3 Inserir Cliente Demo (login principal)
INSERT INTO public.users (id, email, name, company)
VALUES ('00000000-0000-0000-0000-000000000003', 'cliente@empresa.com', 'Cliente Demo', 'Empresa Demo');

INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000003', 'cliente');

-- 3.4 Inserir Clientes Demo criados pelo Parceiro
INSERT INTO public.users (email, name, company, sector, created_by_partner)
VALUES 
  ('cliente1@empresa.com', 'Tech Solutions Ltda', 'Tech Solutions', 'Tecnologia', '00000000-0000-0000-0000-000000000002'),
  ('cliente2@empresa.com', 'Financeira ABC', 'Financeira ABC', 'Financeiro', '00000000-0000-0000-0000-000000000002'),
  ('cliente3@empresa.com', 'Saúde & Vida', 'Saúde & Vida', 'Saúde', '00000000-0000-0000-0000-000000000002'),
  ('cliente4@empresa.com', 'Educação Plus', 'Educação Plus', 'Educação', '00000000-0000-0000-0000-000000000002'),
  ('cliente5@empresa.com', 'Varejo Nacional', 'Varejo Nacional', 'Varejo', '00000000-0000-0000-0000-000000000002');

-- 3.5 Inserir roles dos clientes criados pelo parceiro
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'cliente'::public.app_role
FROM public.users
WHERE email IN (
  'cliente1@empresa.com',
  'cliente2@empresa.com',
  'cliente3@empresa.com',
  'cliente4@empresa.com',
  'cliente5@empresa.com'
);