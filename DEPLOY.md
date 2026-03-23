# Deploy Completo – Legacy OS (Backend + Frontend)

Guia para colocar o projeto em funcionamento em **um novo servidor Supabase**. O projeto é portável: basta substituir 2 credenciais.

---

## 🔑 Credenciais a substituir (handover)

| # | Credencial | Onde configurar | Onde obter |
|---|------------|-----------------|------------|
| 1 | **Project URL + Anon Key** | `.env` na raiz | Supabase → Settings → API |
| 2 | **OpenAI API Key** | Supabase Secrets | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |

---

## Checklist – O que você precisa

- [ ] Conta Supabase (gratuita)
- [ ] Chave da API OpenAI
- [ ] Node.js 18+
- [ ] Supabase CLI: `npm install -g supabase`

---

## Passo a passo (em ordem)

### 1. Clonar e instalar dependências

```bash
git clone <repo>
cd legacy-gov-github-aurion  # ou nome do projeto
npm install
```

### 2. Criar projeto no Supabase

1. Acesse [app.supabase.com](https://app.supabase.com) → **New Project**
2. Anote: **Project URL** e **anon key** (Settings → API)
3. O **Project Ref** está na URL: `https://xxxxx.supabase.co` → `xxxxx`

### 3. Aplicar migrações

```bash
supabase link --project-ref SEU_PROJECT_REF
supabase db push
```

### 4. Configurar frontend (credencial 1)

```bash
cp .env.example .env
```

Edite `.env`:

```env
VITE_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Configurar OpenAI (credencial 2)

**Via CLI:**

```bash
supabase secrets set OPENAI_API_KEY=sk-proj-sua-chave-aqui
```

**Via Dashboard:** Project Settings → Edge Functions → Secrets → `OPENAI_API_KEY`

### 6. Deploy das Edge Functions

```bash
supabase functions deploy
```

### 7. Rodar o frontend

```bash
npm run dev
```

Acesse `http://localhost:5173`.

---

## Testar o backend

Substitua `SEU_PROJECT_REF` e `SUA_ANON_KEY` pelos valores do `.env`:

```bash
curl -X POST "https://SEU_PROJECT_REF.supabase.co/functions/v1/openai-proxy" \
  -H "Authorization: Bearer SUA_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Olá"}],"model":"gpt-4o-mini"}'
```

Se retornar JSON com `content`, o backend está funcionando.

---

## Desenvolvimento local das Edge Functions

```bash
# Crie supabase/.env.local:
# OPENAI_API_KEY=sk-proj-...

supabase functions serve --env-file ./supabase/.env.local
```

Funções em `http://localhost:54321/functions/v1/`. Para o frontend usar o local, altere `VITE_SUPABASE_URL` para `http://localhost:54321`.

---

## Resumo – Componentes do projeto

| Componente | Localização | Observação |
|------------|-------------|------------|
| Banco de dados | `supabase/migrations/` | Migrações na ordem do nome do arquivo |
| Edge Functions | `supabase/functions/` | Inclui `openai-proxy` (Copiloto IA) |
| Rotas/API | [supabase/ROTAS.md](./supabase/ROTAS.md) | Documentação completa |
| Cliente Supabase | `src/lib/supabase.ts` | Conecta frontend ao backend |
| Config local | `supabase/config.toml` | Configuração do projeto |

---

## Próximos passos

- **Setup detalhado:** [SETUP.md](./SETUP.md)
- **Rotas e payloads:** [supabase/ROTAS.md](./supabase/ROTAS.md)
- **Deploy de funções:** [supabase/DEPLOY_FUNCTIONS.md](./supabase/DEPLOY_FUNCTIONS.md)
- **Schema do banco:** [supabase/SCHEMA.md](./supabase/SCHEMA.md)
