# Deploy das Edge Functions – Gestão de IA / Consumo de Tokens

A página **Gestão de IA** (`/admin/agent-config`) usa a Edge Function `usage-openai` para exibir o consumo de tokens da API OpenAI. Se aparecer o erro *"Erro ao carregar consumo - Failed to send a request to the Edge Function"*, siga os passos abaixo.

## 1. Aplicar a migração (tabela `token_usage`)

A tabela `token_usage` é usada pela função `usage-openai`:

```bash
# Com o projeto linkado
supabase db push

# Ou aplicar migração específica manualmente no Supabase Dashboard (SQL Editor)
# Arquivo: supabase/migrations/20260302310000_token_usage.sql
```

## 2. Deploy da Edge Function `usage-openai`

```bash
# Vincular o projeto (se ainda não estiver)
supabase link --project-ref SEU_PROJECT_REF

# Deploy da função
supabase functions deploy usage-openai
```

## 3. Variáveis de ambiente (Supabase Dashboard)

A função `usage-openai` usa internamente:

- `SUPABASE_URL` – configurado automaticamente
- `SUPABASE_SERVICE_ROLE_KEY` – configurado automaticamente

Não é necessário ajustar nada no Dashboard.

## 4. Teste local (opcional)

```bash
supabase start
supabase functions serve usage-openai
# Em outro terminal: curl -X POST http://localhost:54321/functions/v1/usage-openai \
#   -H "Authorization: Bearer $ANON_KEY" \
#   -H "Content-Type: application/json" \
#   -d '{"periodo":"ultimos_30"}'
```

## Verificação rápida

- **Tabela existe?** No Supabase Dashboard → Table Editor → `token_usage`
- **Função deployada?** Supabase Dashboard → Edge Functions → `usage-openai` aparece na lista
- **URL correta?** `.env` com `VITE_SUPABASE_URL` apontando para o projeto correto
