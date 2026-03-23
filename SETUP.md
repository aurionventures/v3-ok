# Setup do Legacy OS – Onboarding de Desenvolvedor

Este guia permite que um desenvolvedor **assuma o projeto** e o coloque em funcionamento em **outro servidor Supabase**. Basta substituir 2 credenciais.

---

## 🔑 O que você precisa substituir (handover)

| Item | Onde | Como obter |
|------|------|------------|
| **1. Project Ref + Anon Key** | Arquivo `.env` na raiz do projeto | Novo projeto Supabase → Settings → API |
| **2. OpenAI API Key** | Secrets do Supabase | Supabase Dashboard → Project Settings → Edge Functions → Secrets |

**Nada mais.** O código, migrações e Edge Functions são portáveis. O projeto funcionará em qualquer projeto Supabase com essas credenciais configuradas.

---

## Pré-requisitos

- **Node.js** 18+ e npm
- **Conta Supabase** – [supabase.com](https://supabase.com) (plano gratuito)
- **Chave da API OpenAI** – [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Supabase CLI** (opcional): `npm install -g supabase`

---

## 1. Criar projeto no Supabase

1. Acesse [app.supabase.com](https://app.supabase.com) e faça login
2. Clique em **New Project**
3. Preencha:
   - **Name:** `legacy-os` (ou outro nome)
   - **Database Password:** guarde em local seguro
   - **Region:** escolha a mais próxima
4. Aguarde a criação do projeto (1–2 minutos)

---

## 2. Obter credenciais do Supabase (Item 1)

No painel do projeto:

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex.: `https://xxxxx.supabase.co`) → esse é o **Project Ref** (`xxxxx`)
   - **anon public** (chave pública, segura para o frontend)

Guarde para o passo 4.

---

## 3. Aplicar migrações (criar tabelas)

As migrações estão em `supabase/migrations/` e devem ser executadas **na ordem cronológica** (o nome do arquivo define a ordem: `YYYYMMDDHHMMSS_descricao.sql`).

### Opção A: Via Supabase Dashboard (SQL Editor)

1. No painel do projeto, vá em **SQL Editor**
2. Para cada arquivo em `supabase/migrations/` (ordem do mais antigo ao mais recente):
   - Abra o arquivo no editor
   - Copie todo o conteúdo SQL
   - Cole no SQL Editor do Supabase
   - Clique em **Run**
3. Aguarde a execução de cada migração antes de prosseguir

### Opção B: Via Supabase CLI (recomendado)

```bash
# Na raiz do projeto
supabase link --project-ref SEU_PROJECT_REF

# Aplicar todas as migrações
supabase db push
```

O `PROJECT_REF` está na URL do projeto: `https://xxxxx.supabase.co` → `xxxxx` é o ref. Ou em **Settings** → **General** → **Reference ID**.

---

## 4. Configurar variáveis do frontend (Item 1)

```bash
cp .env.example .env
```

Edite `.env` e substitua pelos valores do passo 2:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

**Importante:** O `.env` não deve ser commitado (já está no `.gitignore`).

---

## 5. Configurar OpenAI (Item 2)

### Opção A – Via Supabase Dashboard

1. Supabase Dashboard → **Project Settings** → **Edge Functions** → **Secrets**
2. Adicione: `OPENAI_API_KEY` = `sk-proj-...` (sua chave da OpenAI)
3. Salve

### Opção B – Via CLI

```bash
supabase secrets set OPENAI_API_KEY=sk-proj-sua-chave-aqui
```

---

## 6. Deploy das Edge Functions

```bash
supabase link --project-ref SEU_PROJECT_REF   # se ainda não linkou
supabase functions deploy
```

Isso publica todas as Edge Functions na nuvem. Consulte [supabase/DEPLOY_FUNCTIONS.md](./supabase/DEPLOY_FUNCTIONS.md) para detalhes.

---

## 7. Seed: ADM Empresa Demo (opcional)

Para criar o usuário de teste `empresa@legacy.com` | `123456` como ADM da Empresa Demo:

```bash
curl -X POST "https://SEU_PROJECT_REF.supabase.co/functions/v1/seed-empresa-adm-demo" \
  -H "Authorization: Bearer SUA_ANON_KEY" \
  -H "Content-Type: application/json"
```

---

## 8. Rodar o projeto

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. O frontend usa `src/lib/supabase.ts` para conectar ao Supabase e `invokeEdgeFunction()` para chamar as Edge Functions.

---

## Resumo – Checklist

- [ ] Projeto Supabase criado
- [ ] Migrações aplicadas (`supabase db push` ou SQL Editor)
- [ ] `.env` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- [ ] `OPENAI_API_KEY` configurado nos Secrets do Supabase
- [ ] Edge Functions deployadas (`supabase functions deploy`)
- [ ] `npm run dev` rodando

---

## Referências

- **Deploy completo:** [DEPLOY.md](./DEPLOY.md)
- **Rotas das Edge Functions:** [supabase/ROTAS.md](./supabase/ROTAS.md)
- **Schema do banco:** [supabase/SCHEMA.md](./supabase/SCHEMA.md)
- **Estrutura Supabase:** [supabase/README.md](./supabase/README.md)

---

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Erro `auth.users` não existe | O projeto Supabase deve estar criado e o Auth habilitado |
| Erro de FK em migrações | Execute as migrações na ordem exata (nome do arquivo = ordem) |
| `supabase db push` falha | Verifique `supabase link` com o `project-ref` correto |
| Variáveis não carregam no Vite | Reinicie `npm run dev` após alterar o `.env` |
| "Failed to send request to Edge Function" | Verifique `OPENAI_API_KEY` nos Secrets e se as funções foram deployadas |
