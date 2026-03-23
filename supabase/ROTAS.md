# Rotas das Edge Functions – Legacy OS

As Edge Functions são expostas automaticamente pelo Supabase em:

```
https://<PROJECT_REF>.supabase.co/functions/v1/<NOME_DA_FUNCAO>
```

Em desenvolvimento local (`supabase functions serve`):

```
http://localhost:54321/functions/v1/<NOME_DA_FUNCAO>
```

---

## Índice de Rotas

| Rota | Método | Descrição |
|------|--------|-----------|
| `/functions/v1/agente` | POST | Agente genérico (orquestração) |
| `/functions/v1/agente-ata` | POST | Gera ATA formal a partir de transcrição |
| `/functions/v1/agente-atas-reunioes` | POST | Documento formal de ata |
| `/functions/v1/agente-diagnostico-governanca` | POST | Diagnóstico de maturidade e recomendações |
| `/functions/v1/agente-sinais-mercado` | POST | Análise de ambiente externo e ESG |
| `/functions/v1/agente-insights-estrategicos` | POST | Riscos, ameaças e oportunidades |
| `/functions/v1/agente-processamento-documentos` | POST | Extração de texto e metadados |
| `/functions/v1/agente-pdi-conselho` | POST | PDI para conselheiros |
| `/functions/v1/agente-historico-padroes` | POST | Padrões, tendências e alertas |
| `/functions/v1/agente-prioridade-agenda` | POST | Prioridade de temas para agenda |
| `/functions/v1/agente-pautas-sugestoes` | POST | Sugestões de pautas |
| `/functions/v1/agente-briefing-pautas` | POST | Briefing por pauta |
| `/functions/v1/pipeline-agentes` | POST | Orquestra qualquer agente por ID |
| `/functions/v1/openai-proxy` | POST | Proxy genérico para OpenAI |

---

## Detalhamento por Função

### agente (genérico)
```json
{ "input": "tarefa ou contexto", "instrucoes": "opcional" }
```

### agente-ata
```json
{
  "input": "transcrição ou notas da reunião",
  "tituloReuniao": "Reunião Ordinária",
  "data": "2025-03-15",
  "participantes": ["João", "Maria"]
}
```

### agente-atas-reunioes
```json
{
  "input": "transcrição ou notas (obrigatório)",
  "systemPrompt": "opcional – prompt customizado (prompts_config)"
}
```
**Nota:** Sem `OPENAI_API_KEY` configurado, retorna um rascunho placeholder. Ao definir o secret no Supabase, a IA será utilizada automaticamente.

### agente-diagnostico-governanca
```json
{
  "documentos": "texto dos documentos",
  "entrevistas": "respostas das entrevistas"
}
```

### agente-sinais-mercado
```json
{ "input": "sinais ou contexto de mercado" }
```

### agente-insights-estrategicos
```json
{ "input": "indicadores, atas, documentos" }
```

### agente-processamento-documentos
```json
{ "input": "texto do documento" }
```

### agente-pdi-conselho
```json
{ "input": "perfil do membro (cargo, áreas, lacunas)" }
```

### agente-historico-padroes
```json
{ "input": "histórico de eventos" }
```

### agente-prioridade-agenda
```json
{ "input": "lista de temas candidatos" }
```

### agente-pautas-sugestoes
```json
{
  "tipoReuniao": "Ordinária",
  "conselho": "Conselho de Administração",
  "ultimasPautas": "opcional"
}
```

### agente-briefing-pautas
```json
{ "input": "pautas para briefing" }
```

### pipeline-agentes
```json
{
  "agenteId": "agente-ata",
  "input": "transcrição ou objeto"
}
```
`agenteId` pode ser qualquer um: `agente`, `agente-ata`, `agente-diagnostico-governanca`, etc.

### openai-proxy
```json
{
  "messages": [{ "role": "user", "content": "..." }],
  "model": "gpt-4o-mini"
}
```

---

## Uso no Frontend

```ts
import { invokeEdgeFunction } from "@/lib/supabase";

const { data, error } = await invokeEdgeFunction("agente-ata", {
  input: "Transcrição da reunião...",
  tituloReuniao: "Reunião Ordinária",
});
```

---

## Deploy das Edge Functions

```bash
supabase functions deploy agente-atas-reunioes
```

Para testar localmente:
```bash
supabase functions serve agente-atas-reunioes
```

## Variáveis de Ambiente

| Variável | Onde | Descrição |
|----------|------|-----------|
| `VITE_SUPABASE_URL` | Frontend (.env) | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Frontend (.env) | Chave anon/public |
| `OPENAI_API_KEY` | Supabase Secrets | Chave da API OpenAI |

**Importante:** Nunca commite `.env` nem chaves. Use `.env.example` como template.

**OPENAI_API_KEY:** As funções `agente-*` funcionam sem a chave (retornam placeholder). Para ativar a IA: Supabase Dashboard → Project Settings → Edge Functions → Secrets → `OPENAI_API_KEY`.
