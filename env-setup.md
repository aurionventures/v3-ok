# Configuração do Supabase

## Arquivo .env

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Environment
NODE_ENV=development
```

## Como obter as credenciais do Supabase:

1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Crie um novo projeto ou acesse um projeto existente
4. Vá para Settings > API
5. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## Estrutura do banco de dados

O projeto espera as seguintes tabelas no Supabase:

### Tabela `users`
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'parceiro', 'cliente')) NOT NULL,
  permissions TEXT[] DEFAULT '{}',
  parceiro_id UUID REFERENCES parceiros(id),
  empresa_id UUID REFERENCES empresas(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela `parceiros`
```sql
CREATE TABLE parceiros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela `empresas`
```sql
CREATE TABLE empresas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  parceiro_id UUID REFERENCES parceiros(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## RLS (Row Level Security)

Configure as políticas RLS para segurança:

```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE parceiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para parceiros
CREATE POLICY "Parceiros can view own data" ON parceiros
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE parceiro_id = parceiros.id));

-- Políticas para empresas
CREATE POLICY "Users can view empresas from their parceiro" ON empresas
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM users 
      WHERE parceiro_id = empresas.parceiro_id
    )
  );
```
