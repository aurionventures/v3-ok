# Schema e banco de dados – Legacy OS

Estrutura do schema e recursos de banco (Supabase) do projeto Legacy OS.

## Estrutura

- **`migrations/`** – Migrações SQL versionadas. Use o formato de nome: `YYYYMMDDHHMMSS_descricao_da_alteracao.sql` (ex.: `20260302120000_create_usuarios.sql`).
- **`functions/`** – Edge Functions do Supabase (funções serverless associadas ao projeto).
  - **`_shared/`** – Código compartilhado entre as functions (helpers, tipos, config).
  - **`openai-proxy/`** – Proxy para chamadas OpenAI/IA usadas pelos agentes.
  - **`pipeline-agentes/`** – Pipeline de orquestração dos agentes de IA.
  - **`run-migration/`** – Utilitário para execução de migrações sob demanda.

## Convenção de migrações

Cada arquivo em `migrations/` deve:

1. Ter o prefixo com data/hora em `YYYYMMDDHHMMSS`.
2. Ter um nome descritivo em snake_case após o prefixo.
3. Conter apenas SQL executável (DDL/DML) e ser idempotente quando possível.

Exemplo: `20260302120000_create_tabela_conselhos.sql`
