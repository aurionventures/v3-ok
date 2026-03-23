# Deploy das Edge Functions – Legacy OS

Este guia cobre o deploy de todas as Edge Functions do projeto. Para o projeto funcionar em outro servidor Supabase, basta configurar `OPENAI_API_KEY` nos Secrets e fazer o deploy.

---

## 🔑 Credencial obrigatória para IA

| Secret | Onde configurar | Obrigatório para |
|--------|-----------------|------------------|
| `OPENAI_API_KEY` | Supabase Dashboard → Project Settings → Edge Functions → Secrets | `openai-proxy`, `agente-*`, etc. |

```bash
supabase secrets set OPENAI_API_KEY=sk-proj-sua-chave-aqui
```

Sem a chave, funções que usam IA retornam erro ou placeholder.

---

## Deploy de todas as funções

```bash
# Vincular o projeto (substitua SEU_PROJECT_REF)
supabase link --project-ref SEU_PROJECT_REF

# Deploy de todas as funções de uma vez
supabase functions deploy
```

### Deploy de função específica

```bash
supabase functions deploy openai-proxy
supabase functions deploy usage-openai
# etc.
```

---

## Funções principais

| Função | Uso | Requer OPENAI_API_KEY |
|--------|-----|------------------------|
| `openai-proxy` | Copiloto IA (chat com briefing do membro) | Sim |
| `agente-copiloto-governanca` | Geração de pautas e briefings | Sim |
| `agente-insights-estrategicos` | Insights estratégicos | Sim |
| `agente-atas-reunioes` | Geração de atas | Sim |
| `usage-openai` | Consumo de tokens (Gestão de IA – Admin) | Sim |
| `seed-empresa-adm-demo` | Seed de usuário teste | Não |
| `criar-membro-acesso` | Criação de membros | Não |
| Outras | Ver [ROTAS.md](./ROTAS.md) | Varia |

---

## Função `usage-openai` (Gestão de IA)

A página **Gestão de IA** (`/admin/agent-config`) usa `usage-openai` para exibir consumo de tokens. Se aparecer *"Erro ao carregar consumo - Failed to send a request to the Edge Function"*:

1. **Tabela `token_usage`:** certifique-se de que a migração foi aplicada (`supabase db push`).
2. **Deploy:** `supabase functions deploy usage-openai`
3. **`.env`:** `VITE_SUPABASE_URL` apontando para o projeto correto

---

## Função `openai-proxy` (Copiloto IA)

Usada pelo Copiloto IA no portal do membro. Chat conversacional com base no briefing. **Deve estar deployada** para o Copiloto funcionar.

```bash
supabase functions deploy openai-proxy
```

Config: `verify_jwt = false` (aceita anon key). Ver [supabase/config.toml](./config.toml).

---

## Teste local (opcional)

```bash
# Criar supabase/.env.local com:
# OPENAI_API_KEY=sk-proj-...

supabase functions serve --env-file ./supabase/.env.local
```

Funções em `http://localhost:54321/functions/v1/`.

---

## Verificação rápida

- **Funções deployadas?** Supabase Dashboard → Edge Functions → lista de funções
- **Secret configurado?** Project Settings → Edge Functions → Secrets → `OPENAI_API_KEY`
- **URL correta?** `.env` com `VITE_SUPABASE_URL` apontando para o projeto
