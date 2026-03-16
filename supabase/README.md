# Schema e banco de dados – Legacy OS

Estrutura do schema e recursos de banco (Supabase) do projeto Legacy OS.

**Documentação do schema:** [SCHEMA.md](./SCHEMA.md) – tabelas, colunas e relacionamentos.

**Rotas das Edge Functions:** [ROTAS.md](./ROTAS.md) – endpoints, payloads e uso no frontend.

## Estrutura

- **`config.toml`** – Configuração do projeto Supabase (local dev). Omita `project_id` e chaves ao compartilhar.
- **`migrations/`** – Migrações SQL versionadas. Use o formato de nome: `YYYYMMDDHHMMSS_descricao_da_alteracao.sql` (ex.: `20260302120000_create_usuarios.sql`).
- **`functions/`** – Edge Functions do Supabase (funções serverless associadas ao projeto).
  - **`_shared/`** – Código compartilhado entre as functions (helpers, tipos, config).
  - **`openai-proxy/`** – Proxy para chamadas OpenAI/IA usadas pelos agentes.
  - **`pipeline-agentes/`** – Pipeline de orquestração dos agentes de IA.
  - **`run-migration/`** – Utilitário para execução de migrações sob demanda.
  - **Functions por agente** (cada uma com `prompt.ts` com o prompt do agente):
    - **`agente/`** – Agente genérico (orquestração e extensão).
    - **`agente-ata/`** – ATA de reunião (ata formal a partir de transcrição/notas).
    - **`agente-atas-reunioes/`** – ATAs reuniões (documento formal de ata).
    - **`agente-diagnostico-governanca/`** – Diagnóstico de governança (maturidade, lacunas, recomendações).
    - **`agente-sinais-mercado/`** – Sinais de mercado (ambiente externo, ESG, impacto).
    - **`agente-insights-estrategicos/`** – Insights estratégicos (riscos, ameaças, oportunidades).
    - **`agente-processamento-documentos/`** – Processamento de documentos (extração de texto e metadados).
    - **`agente-pdi-conselho/`** – PDI Conselho (plano de desenvolvimento individual).
    - **`agente-historico-padroes/`** – Histórico e padrões (padrões, tendências, alertas).
    - **`agente-prioridade-agenda/`** – Prioridade de agenda (score e ordem de temas).
    - **`agente-pautas-sugestoes/`** – Sugestões de pautas (pautas por tipo de reunião e conselho).
    - **`agente-briefing-pautas/`** – Briefing de pautas (contexto, pontos-chave, recomendações).

## Convenção de migrações

Cada arquivo em `migrations/` deve:

1. Ter o prefixo com data/hora em `YYYYMMDDHHMMSS`.
2. Ter um nome descritivo em snake_case após o prefixo.
3. Conter apenas SQL executável (DDL/DML) e ser idempotente quando possível.

Exemplo: `20260302120000_create_tabela_conselhos.sql`

## Verificação sem banco nem APIs

Para validar o projeto (incluindo a pasta `supabase/`) sem conexão com banco, Supabase ou OpenAI, use os comandos na raiz do repositório:

- **`npm run validate:supabase`** – valida estrutura, convenção de migrações e presença de `prompt.ts` em cada agente.
- **`npm run validate`** – executa `validate:supabase`, `lint` e `build` em sequência.