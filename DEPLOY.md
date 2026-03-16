# Deploy Completo – Legacy OS (Backend + Frontend)

**Este projeto possui backend completo.** O backend inclui banco de dados (Supabase), Edge Functions (agentes de IA) e integração com OpenAI. Este guia garante que o desenvolvedor consiga subir tudo funcionando.

---

## Checklist – O que você precisa

- [ ] Conta Supabase (gratuita)
- [ ] Chave da API OpenAI ([platform.openai.com](https://platform.openai.com/api-keys))
- [ ] Node.js 18+
- [ ] Supabase CLI: `npm install -g supabase`

---

## Passo a passo (em ordem)

### 1. Clonar e instalar dependências

```bash
npm install
```

### 2. Criar projeto no Supabase

1. Acesse [app.supabase.com](https://app.supabase.com) → **New Project**
2. Anote: **Project URL** e **anon key** (Settings → API)

### 3. Configurar variáveis do frontend

```bash
cp .env.example .env
```

Edite `.env` e preencha:

```
VITE_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Vincular projeto e aplicar migrações

```bash
supabase link --project-ref SEU_PROJECT_REF
supabase db push
```

O `project-ref` está na URL: `https://app.supabase.com/project/SEU_PROJECT_REF`

### 5. Configurar chave OpenAI e fazer deploy das Edge Functions

**Opção A – Via CLI (recomendado):**

```bash
# Crie um arquivo temporário com a chave (não commite!)
echo "OPENAI_API_KEY=sk-proj-..." > .env.secrets

# Envie os secrets para o Supabase
supabase secrets set --env-file .env.secrets

# Remova o arquivo após o deploy
rm .env.secrets
```

**Opção B – Via Dashboard:**

1. Supabase Dashboard → **Project Settings** → **Edge Functions** → **Secrets**
2. Adicione: `OPENAI_API_KEY` = `sk-proj-...`
3. Salve

**Deploy das funções:**

```bash
supabase functions deploy
```

Isso publica todas as Edge Functions (agente-ata, pipeline-agentes, etc.) na nuvem.

### 6. Rodar o frontend

```bash
npm run dev
```

Acesse `http://localhost:5173`. O assistente de governança (canto inferior direito) usará as Edge Functions quando o Supabase estiver configurado.

---

## Testar o backend

Após o deploy, teste uma Edge Function (substitua `SEU_PROJECT_REF` e `SUA_ANON_KEY` pelos valores do .env):

```bash
curl -X POST "https://SEU_PROJECT_REF.supabase.co/functions/v1/pipeline-agentes" \
  -H "Authorization: Bearer SUA_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agenteId":"agente","input":"O que é governança corporativa?"}'
```

Se retornar JSON com `resultado` ou `raw`, o backend está funcionando. A `SUA_ANON_KEY` é a mesma de `VITE_SUPABASE_ANON_KEY`.

---

## Desenvolvimento local das Edge Functions

Para testar as funções sem deploy:

```bash
# Crie supabase/.env.local com:
# OPENAI_API_KEY=sk-proj-...

supabase functions serve --env-file ./supabase/.env.local
```

As funções ficarão em `http://localhost:54321/functions/v1/`. Para o frontend usar o local, altere temporariamente `VITE_SUPABASE_URL` para `http://localhost:54321` (ou use o projeto remoto).

---

## Resumo – O que o projeto já tem

| Componente | Localização | Status |
|------------|-------------|--------|
| **Banco de dados** | `supabase/migrations/` | Migrações prontas |
| **Edge Functions** | `supabase/functions/` | 14 funções (agentes + proxy + pipeline) |
| **Rotas/API** | `supabase/ROTAS.md` | Documentação completa |
| **Cliente Supabase** | `src/lib/supabase.ts` | Conecta frontend ao backend |
| **Config** | `supabase/config.toml` | Configuração do projeto |

O backend está implementado. Basta configurar credenciais e fazer o deploy.
