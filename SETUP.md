# Setup do Legacy OS – Supabase

Este guia permite que um desenvolvedor ative o projeto Legacy OS no Supabase: criar o banco, aplicar as migrações e configurar as variáveis de ambiente.

---

## Pré-requisitos

- **Node.js** 18+ e npm
- **Conta Supabase** – [supabase.com](https://supabase.com) (gratuito)
- **Supabase CLI** (opcional, para aplicar migrações via terminal): `npm install -g supabase`

---

## 1. Criar projeto no Supabase

1. Acesse [app.supabase.com](https://app.supabase.com) e faça login
2. Clique em **New Project**
3. Preencha:
   - **Name:** `legacy-os` (ou outro nome)
   - **Database Password:** guarde em local seguro (será usado para conexão direta)
   - **Region:** escolha a mais próxima
4. Aguarde a criação do projeto (1–2 minutos)

---

## 2. Obter credenciais

No painel do projeto:

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex.: `https://xxxxx.supabase.co`)
   - **anon public** (chave pública, segura para o frontend)

Guarde essas variáveis para o próximo passo.

---

## 3. Aplicar migrações (criar tabelas)

As migrações estão em `supabase/migrations/` e devem ser executadas **na ordem**:

| Ordem | Arquivo |
|-------|---------|
| 1 | `20260302120000_create_empresas_usuarios.sql` |
| 2 | `20260302120100_create_conselhos_comites.sql` |
| 3 | `20260302120200_create_reunioes_pautas_atas.sql` |
| 4 | `20260302120300_create_documentos_estrutura_familiar.sql` |
| 5 | `20260302120400_create_maturidade_entrevistas.sql` |
| 6 | `20260302120500_create_agenda_rituais_riscos.sql` |
| 7 | `20260302120600_add_historico_agentes_insights.sql` |

### Opção A: Via Supabase Dashboard (SQL Editor)

1. No painel do projeto, vá em **SQL Editor**
2. Para cada arquivo em `supabase/migrations/` (na ordem acima):
   - Abra o arquivo no editor
   - Copie todo o conteúdo SQL
   - Cole no SQL Editor do Supabase
   - Clique em **Run**
3. Aguarde a execução de cada migração antes de prosseguir

### Opção B: Via Supabase CLI

```bash
# Na raiz do projeto
supabase init

# Vincular ao projeto remoto (substitua PROJECT_REF pelo ID do projeto)
supabase link --project-ref SEU_PROJECT_REF

# Aplicar todas as migrações
supabase db push
```

O `project-ref` está na URL do projeto: `https://app.supabase.com/project/SEU_PROJECT_REF` ou em **Settings** → **General**.

---

## 4. Variáveis de ambiente

Copie o arquivo de exemplo e preencha com as credenciais do passo 2:

```bash
cp .env.example .env
```

Edite `.env` e substitua pelos valores obtidos no passo 2:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

**Importante:** O `.env` não deve ser commitado (já está no `.gitignore`).

---

## 5. Cliente Supabase (frontend)

O cliente já está em `src/lib/supabase.ts`. O pacote `@supabase/supabase-js` é instalado com `npm install`. Nenhuma ação extra necessária.

---

## 6. Validar estrutura

```bash
npm run validate:supabase
```

---

## 7. Edge Functions (backend de IA)

Para os agentes de IA funcionarem:

1. **Vincule o projeto** (se ainda não fez): `supabase link --project-ref SEU_PROJECT_REF`
2. **Configure a chave OpenAI:**
   - **Via CLI:** `supabase secrets set OPENAI_API_KEY=sk-proj-...`
   - **Via Dashboard:** Project Settings → Edge Functions → Secrets → adicione `OPENAI_API_KEY`
3. **Deploy das funções:** `supabase functions deploy`
4. **Teste local (opcional):** copie `supabase/.env.local.example` para `supabase/.env.local`, preencha `OPENAI_API_KEY`, e rode `supabase functions serve --env-file ./supabase/.env.local`

Consulte [supabase/ROTAS.md](./supabase/ROTAS.md) para a lista de rotas e payloads. Para um guia completo de deploy, veja [DEPLOY.md](./DEPLOY.md).

## 8. Rodar o projeto

```bash
npm install
npm run dev
```

O frontend usa `src/lib/supabase.ts` para conectar ao Supabase e `invokeEdgeFunction()` para chamar as Edge Functions. Com `.env` configurado, as chamadas aos agentes funcionam. Sem Supabase, o app continua com dados mock e autenticação simulada.

---

## Referências

- **Schema:** [supabase/SCHEMA.md](./supabase/SCHEMA.md) – tabelas, colunas e relacionamentos
- **Estrutura Supabase:** [supabase/README.md](./supabase/README.md) – estrutura de pastas, migrações e Edge Functions

---

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Erro `auth.users` não existe | A primeira migração referencia `auth.users`. Certifique-se de que o projeto Supabase está criado e que o Auth está habilitado. |
| Erro de FK em migrações | Execute as migrações na ordem exata. Tabelas que referenciam outras (ex.: `empresas`) precisam existir antes. |
| `supabase db push` falha | Verifique se `supabase link` foi executado com o `project-ref` correto. |
| Variáveis não carregam no Vite | Reinicie o servidor (`npm run dev`) após alterar o `.env`. |
