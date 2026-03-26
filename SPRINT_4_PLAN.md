# 📋 PLANO DE IMPLEMENTAÇÃO - SPRINT 4: IA E RELATÓRIOS

## 🎯 OBJETIVO
Implementar sistema completo de IA para assistentes especializados em governança e geração automática de relatórios inteligentes usando Lovable AI.

---

## 📦 **PARTE 1: INFRAESTRUTURA DE IA**

### 1.1. Habilitar Lovable AI
- Usar ferramenta `ai_gateway--enable_ai_gateway` para provisionar `LOVABLE_API_KEY`
- Modelo padrão: `google/gemini-2.5-flash`
- Gateway: `https://ai.gateway.lovable.dev/v1/chat/completions`

### 1.2. Criar Tabela `ai_conversations`
```sql
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  assistant_type TEXT NOT NULL CHECK (assistant_type IN ('GOVERNANCE', 'LEGAL', 'ESG', 'ANALYTICS')),
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  context JSONB, -- metadata sobre a mensagem
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_conversations_user ON ai_conversations(user_id, created_at DESC);
CREATE INDEX idx_messages_conversation ON ai_messages(conversation_id, created_at);
```

**RLS Policies:**
- Usuários só veem suas próprias conversas
- Admins veem todas

### 1.3. Criar Tabela `ai_report_generations`
```sql
CREATE TABLE ai_report_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  company_id TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('MEETING_MINUTES', 'EXECUTIVE', 'MATURITY', 'ESG', 'GOVERNANCE')),
  context JSONB NOT NULL, -- dados usados para gerar o relatório
  content TEXT NOT NULL, -- relatório gerado
  format TEXT DEFAULT 'markdown' CHECK (format IN ('markdown', 'html', 'pdf')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('generating', 'completed', 'error')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_report_generations_user_type ON ai_report_generations(user_id, report_type, created_at DESC);
CREATE INDEX idx_report_generations_company ON ai_report_generations(company_id, created_at DESC);
```

**RLS Policies:**
- Usuários veem relatórios da sua empresa
- Admins veem todos

---

## 📦 **PARTE 2: EDGE FUNCTIONS**

### 2.1. Edge Function `ai-governance-chat`

**Arquivo:** `supabase/functions/ai-governance-chat/index.ts`

**Funcionalidades:**
1. **Receber mensagem do usuário** + `assistant_type` + `conversation_id` (opcional)
2. **Buscar contexto relevante** do banco de dados:
   - Se `GOVERNANCE`: buscar conselhos, reuniões, membros
   - Se `LEGAL`: buscar documentos, compliance
   - Se `ESG`: buscar dados ESG, maturidade
   - Se `ANALYTICS`: buscar estatísticas, tendências
3. **Criar/atualizar conversa** na tabela `ai_conversations`
4. **Salvar mensagem do usuário** em `ai_messages`
5. **Chamar Lovable AI** com:
   - System prompt específico por tipo de assistente
   - Histórico da conversa (últimas 10 mensagens)
   - Contexto relevante do banco
6. **Stream da resposta** usando SSE
7. **Salvar resposta do assistente** em `ai_messages`

**System Prompts:**

```typescript
const SYSTEM_PROMPTS = {
  GOVERNANCE: `Você é um assistente especializado em Governança Corporativa no Brasil.
  
  Seu papel é:
  - Orientar sobre melhores práticas de governança
  - Explicar regulamentações (Lei das S.A., CVM, IBGC)
  - Ajudar na estruturação de conselhos
  - Sugerir melhorias nos processos de governança
  
  Contexto da empresa:
  {context}
  
  Seja sempre preciso, objetivo e baseado em regulamentações brasileiras.`,
  
  LEGAL: `Você é um assistente especializado em Compliance e Aspectos Legais.
  
  Seu papel é:
  - Orientar sobre compliance regulatório
  - Explicar obrigações legais (CVM, LGPD, etc)
  - Ajudar na análise de documentos societários
  - Alertar sobre riscos legais
  
  Contexto da empresa:
  {context}
  
  IMPORTANTE: Suas orientações são educacionais. Para questões complexas, recomende consulta a advogado.`,
  
  ESG: `Você é um assistente especializado em ESG (Environmental, Social, Governance).
  
  Seu papel é:
  - Orientar sobre práticas ESG
  - Analisar maturidade ESG
  - Sugerir melhorias em cada pilar
  - Explicar frameworks (GRI, SASB, TCFD)
  
  Contexto da empresa:
  {context}
  
  Seja prático e focado em ações concretas que a empresa pode implementar.`,
  
  ANALYTICS: `Você é um assistente especializado em Análise de Dados de Governança.
  
  Seu papel é:
  - Interpretar métricas e indicadores
  - Identificar tendências e padrões
  - Gerar insights acionáveis
  - Comparar com benchmarks do setor
  
  Contexto da empresa:
  {context}
  
  Use dados concretos e apresente análises claras com recomendações práticas.`
};
```

**Payload de Request:**
```typescript
{
  conversation_id?: string,
  assistant_type: 'GOVERNANCE' | 'LEGAL' | 'ESG' | 'ANALYTICS',
  message: string
}
```

**Resposta (SSE):**
```
data: {"type":"token","content":"texto parcial"}
data: {"type":"done","conversation_id":"uuid"}
```

### 2.2. Edge Function `ai-generate-report`

**Arquivo:** `supabase/functions/ai-generate-report/index.ts`

**Funcionalidades:**
1. **Receber tipo de relatório** + IDs relevantes (meeting_id, etc)
2. **Buscar dados** necessários do banco:
   - `MEETING_MINUTES`: dados da reunião, participantes, itens, ações
   - `EXECUTIVE`: dados gerais da governança
   - `MATURITY`: respostas do quiz, pontuações
   - `ESG`: dados ESG, pontuações
   - `GOVERNANCE`: estrutura, conselhos, membros
3. **Criar registro** em `ai_report_generations` (status: 'generating')
4. **Chamar Lovable AI** com prompt específico para cada tipo
5. **Gerar relatório estruturado** em markdown
6. **Atualizar registro** (status: 'completed', salvar content)
7. **Retornar relatório** + `report_id`

**Tipos de Relatório:**

**A) MEETING_MINUTES (Ata de Reunião):**
```typescript
// Prompt para IA
`Gere uma ata formal de reunião baseada nos seguintes dados:

INFORMAÇÕES DA REUNIÃO:
- Conselho: {council_name}
- Data: {date}
- Horário: {time}
- Local: {location}
- Modalidade: {modalidade}

PARTICIPANTES:
{participants_list}

PAUTA:
{agenda_items}

DECISÕES E AÇÕES:
{actions}

FORMATO DA ATA:
1. Cabeçalho com dados da reunião
2. Lista de presença
3. Ordem do dia (pauta)
4. Deliberações (para cada item da pauta)
5. Encerramento
6. Assinaturas (lista de membros)

Use linguagem formal e objetiva, típica de documentos corporativos brasileiros.`
```

**B) EXECUTIVE (Relatório Executivo de Governança):**
```typescript
`Gere um relatório executivo de governança corporativa:

ESTRUTURA DA EMPRESA:
{corporate_structure}

CONSELHOS E COMITÊS:
{councils_data}

REUNIÕES (últimos 6 meses):
{meetings_summary}

PENDÊNCIAS:
{pending_actions}

DOCUMENTAÇÃO:
{documents_status}

FORMATO DO RELATÓRIO:
1. Executive Summary
2. Estrutura de Governança Atual
3. Atividades do Período
4. Principais Deliberações
5. Status de Pendências
6. Recomendações

Seja objetivo, use métricas concretas e destaque pontos de atenção.`
```

**C) MATURITY (Relatório de Maturidade):**
```typescript
`Analise a maturidade de governança e gere relatório detalhado:

PONTUAÇÃO GERAL: {overall_score}
ESTÁGIO: {maturity_stage}

DIMENSÕES:
{dimensions_scores}

INDICADORES:
{indicators_scores}

FORMATO DO RELATÓRIO:
1. Visão Geral da Maturidade
2. Análise por Dimensão (forças e fraquezas)
3. Comparação com Setor
4. Principais Gaps Identificados
5. Roadmap de Evolução (curto, médio, longo prazo)
6. Quick Wins (ações imediatas)

Use linguagem consultiva e foque em ações práticas.`
```

**D) ESG (Relatório ESG):**
```typescript
`Gere relatório de maturidade ESG:

PONTUAÇÃO GERAL: {overall_score}
NÍVEL: {maturity_level}

PILARES:
- Environmental: {env_score}
- Social: {social_score}
- Governance: {gov_score}
- Strategy: {strategy_score}

SUB-DIMENSÕES:
{subdimensions}

FORMATO DO RELATÓRIO:
1. Executive Summary ESG
2. Análise por Pilar
3. Benchmarking
4. Materialidade
5. Plano de Ação Prioritário
6. Métricas e KPIs Sugeridos

Inclua referências a frameworks (GRI, SASB) quando relevante.`
```

**E) GOVERNANCE (Relatório Geral de Governança):**
```typescript
`Gere relatório completo de governança:

ESTRUTURA:
{structure}

COMPLIANCE:
{compliance_status}

MATURIDADE:
{maturity_data}

RISCOS:
{risks}

FORMATO:
1. Sumário Executivo
2. Estrutura de Governança
3. Avaliação de Maturidade
4. Gestão de Riscos
5. Compliance Regulatório
6. Gaps e Oportunidades
7. Plano de Ação

Relatório deve ser abrangente e adequado para apresentação a stakeholders.`
```

**Payload de Request:**
```typescript
{
  report_type: 'MEETING_MINUTES' | 'EXECUTIVE' | 'MATURITY' | 'ESG' | 'GOVERNANCE',
  context: {
    meeting_id?: string,
    council_id?: string,
    date_range?: { start: string, end: string },
    // outros parâmetros conforme o tipo
  }
}
```

**Resposta:**
```typescript
{
  report_id: string,
  report_type: string,
  content: string, // markdown
  created_at: string
}
```

### 2.3. Edge Function `ai-analyze-document`

**Arquivo:** `supabase/functions/ai-analyze-document/index.ts`

**Funcionalidades:**
1. **Receber URL do documento** (PDF, DOCX, TXT)
2. **Extrair texto** do documento
3. **Chamar Lovable AI** para análise:
   - Tipo de documento
   - Principais cláusulas/pontos
   - Pontos de atenção
   - Conformidade com boas práticas
4. **Retornar análise estruturada**

**System Prompt:**
```typescript
`Você é um especialista em análise de documentos corporativos e de governança.

Analise o documento fornecido e identifique:
1. Tipo de documento (estatuto, ata, contrato, etc)
2. Principais cláusulas e dispositivos
3. Pontos relevantes para governança
4. Conformidade com legislação brasileira
5. Pontos de atenção ou cláusulas atípicas
6. Recomendações

Seja preciso e objetivo. Cite trechos específicos quando relevante.

DOCUMENTO:
{document_text}`
```

---

## 📦 **PARTE 3: HOOKS CUSTOMIZADOS**

### 3.1. Hook `useAIChat(assistantType)`

**Arquivo:** `src/hooks/useAIChat.ts`

**Funcionalidades:**
- Gerenciar estado da conversa
- Enviar mensagens (com streaming)
- Carregar histórico
- Criar nova conversa
- Deletar conversa

**Retorna:**
```typescript
{
  conversations: Conversation[],
  currentConversation: Conversation | null,
  messages: Message[],
  isLoading: boolean,
  isStreaming: boolean,
  sendMessage: (content: string) => Promise<void>,
  createConversation: () => void,
  selectConversation: (id: string) => void,
  deleteConversation: (id: string) => void
}
```

### 3.2. Hook `useAIReportGeneration()`

**Arquivo:** `src/hooks/useAIReportGeneration.ts`

**Funcionalidades:**
- Gerar relatório
- Listar relatórios gerados
- Buscar relatório por ID
- Deletar relatório

**Retorna:**
```typescript
{
  reports: Report[],
  isGenerating: boolean,
  generateReport: (type, context) => Promise<Report>,
  getReport: (id: string) => Report | null,
  deleteReport: (id: string) => Promise<void>
}
```

### 3.3. Hook `useDocumentAnalysis()`

**Arquivo:** `src/hooks/useDocumentAnalysis.ts`

**Funcionalidades:**
- Analisar documento
- Listar análises anteriores

---

## 📦 **PARTE 4: FRONTEND - COMPONENTES**

### 4.1. Atualizar `GovernanceAssistant.tsx`

**Mudanças:**
1. Integrar com `useAIChat()` hook
2. Implementar streaming de respostas
3. Salvar histórico de conversas
4. Sidebar com lista de conversas
5. Botão "Nova Conversa"
6. Seletor de assistente (4 tipos)
7. Markdown rendering para respostas
8. Loading states durante streaming
9. Copiar resposta
10. Exportar conversa

**Layout:**
```
┌──────────────────────────────────────┐
│ [<] Governança IA [v]   [Nova] [×]  │ <- Header com selector
├──────────────────────────────────────┤
│ Histórico | Chat                     │ <- Tabs
├──────────────────────────────────────┤
│                                      │
│ [Bot] Olá! Como posso ajudar?       │
│                                      │
│ [Você] Como estruturar conselho?    │
│                                      │
│ [Bot] Para estruturar um conselho...│
│       [streaming...]                 │
│                                      │
├──────────────────────────────────────┤
│ Digite sua mensagem...        [Send]│
└──────────────────────────────────────┘
```

### 4.2. Criar `AIReportsPage.tsx`

**Arquivo:** `src/pages/AIReports.tsx`

**Funcionalidades:**
- Listar relatórios gerados
- Botão "Gerar Novo Relatório"
- Dialog para selecionar tipo + parâmetros
- Preview do relatório (markdown)
- Download PDF
- Compartilhar relatório
- Deletar relatório

**Layout:**
```
┌────────────────────────────────────────────┐
│ Relatórios de IA        [+ Gerar Novo]    │
├────────────────────────────────────────────┤
│ Filtros: [Todos] [Atas] [Executivo] [ESG]│
├────────────────────────────────────────────┤
│ 📄 Ata - Reunião CA - 15/11/2024          │
│    Gerado há 2 dias  [Ver] [PDF] [🗑]     │
├────────────────────────────────────────────┤
│ 📊 Relatório Executivo - Q4 2024          │
│    Gerado há 1 semana  [Ver] [PDF] [🗑]   │
├────────────────────────────────────────────┤
│ 🌱 Relatório ESG - Anual 2024             │
│    Gerado há 2 semanas  [Ver] [PDF] [🗑]  │
└────────────────────────────────────────────┘
```

**Dialog "Gerar Novo Relatório":**
```
┌─────────────────────────────────────┐
│ Gerar Relatório                     │
├─────────────────────────────────────┤
│ Tipo:                               │
│ ( ) Ata de Reunião                  │
│ ( ) Relatório Executivo             │
│ ( ) Relatório de Maturidade         │
│ ( ) Relatório ESG                   │
│ ( ) Relatório de Governança         │
│                                     │
│ [Se Ata]                            │
│ Reunião: [Select: CA 15/11/2024]   │
│                                     │
│ [Se Executivo/Governança]           │
│ Período: [date] a [date]            │
│                                     │
│          [Cancelar] [Gerar]         │
└─────────────────────────────────────┘
```

### 4.3. Adicionar Seção "Gerar Ata com IA" em `ReuniaoDetalhes.tsx`

**No componente de detalhes da reunião, adicionar botão:**

```
┌────────────────────────────────────┐
│ Ata e Resumo                       │
├────────────────────────────────────┤
│ [ ] Ata Manual                     │
│ [✨ Gerar Ata com IA]              │
│                                    │
│ [Se já gerou]                      │
│ ✅ Ata gerada há 2 horas           │
│ [Ver Ata] [Regenerar] [PDF]       │
└────────────────────────────────────┘
```

**Ao clicar "Gerar Ata com IA":**
1. Mostrar loading
2. Chamar edge function `ai-generate-report`
3. Mostrar ata gerada em modal
4. Opções: Salvar, Editar, Exportar PDF

### 4.4. Criar `DocumentAnalysisDialog.tsx`

**Arquivo:** `src/components/DocumentAnalysisDialog.tsx`

**Funcionalidades:**
- Upload de documento
- Análise com IA
- Exibir resultado da análise
- Salvar análise

**Usado em:** Página de Documentos, detalhes de reunião

### 4.5. Criar Dashboard de Insights `AIInsightsDashboard.tsx`

**Arquivo:** `src/components/AIInsightsDashboard.tsx`

**Funcionalidades:**
- Cards com insights gerados por IA:
  - "Próximas ações recomendadas"
  - "Riscos identificados"
  - "Oportunidades de melhoria"
  - "Comparação com benchmarks"
- Atualização semanal automática
- Expandir para ver detalhes

**Adicionar no Dashboard principal**

---

## 📦 **PARTE 5: CONFIGURAÇÃO**

### 5.1. Habilitar Lovable AI

Usar ferramenta `ai_gateway--enable_ai_gateway`

### 5.2. Atualizar `config.toml`

Adicionar edge functions:
```toml
[functions.ai-governance-chat]
verify_jwt = true

[functions.ai-generate-report]
verify_jwt = true

[functions.ai-analyze-document]
verify_jwt = true
```

### 5.3. Habilitar Realtime

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE ai_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE ai_messages;
```

---

## 📦 **PARTE 6: ROTAS**

Adicionar em `App.tsx`:
```typescript
<Route path="/ia/relatorios" element={<AIReports />} />
<Route path="/ia/assistente" element={<GovernanceAssistant />} />
```

Adicionar links no menu principal (Sidebar/TopMenu):
```typescript
{
  icon: <Sparkles />,
  label: "Assistente IA",
  path: "/ia/assistente"
},
{
  icon: <FileText />,
  label: "Relatórios IA",
  path: "/ia/relatorios"
}
```

---

## 🎯 **ORDEM DE IMPLEMENTAÇÃO**

1. **Habilitar Lovable AI** (ferramenta)
2. **Migrations:** Criar tabelas + RLS
3. **Edge Functions:** 
   - `ai-governance-chat` (mais crítico)
   - `ai-generate-report`
   - `ai-analyze-document`
4. **Hooks:** `useAIChat`, `useAIReportGeneration`, `useDocumentAnalysis`
5. **Frontend:**
   - Atualizar `GovernanceAssistant`
   - Criar `AIReportsPage`
   - Adicionar botão "Gerar Ata" em reuniões
   - Criar `AIInsightsDashboard`
6. **Rotas e Navegação**
7. **Testes e Refinamento**

---

## ✅ **CRITÉRIOS DE SUCESSO**

- ✅ Assistente IA responde com contexto da empresa
- ✅ Streaming de respostas funciona
- ✅ Histórico de conversas é salvo
- ✅ 4 tipos de assistentes (Governança, Legal, ESG, Analytics)
- ✅ Geração automática de atas de reunião
- ✅ Relatórios executivos/maturidade/ESG gerados por IA
- ✅ Análise de documentos com extração de insights
- ✅ Dashboard com insights semanais
- ✅ Exportação de relatórios em PDF
- ✅ Rate limiting respeitado (429/402 tratados)

---

## 🔒 **SEGURANÇA E TRATAMENTO DE ERROS**

### Rate Limiting (Lovable AI)
```typescript
// No edge function, capturar erros
try {
  const response = await fetch("https://ai.gateway.lovable.dev/...", {...});
  
  if (response.status === 429) {
    return new Response(
      JSON.stringify({ 
        error: "Limite de requisições atingido. Aguarde alguns momentos." 
      }),
      { status: 429, headers: corsHeaders }
    );
  }
  
  if (response.status === 402) {
    return new Response(
      JSON.stringify({ 
        error: "Créditos de IA esgotados. Entre em contato com suporte." 
      }),
      { status: 402, headers: corsHeaders }
    );
  }
  
  // processar resposta...
} catch (error) {
  console.error("AI error:", error);
  return new Response(
    JSON.stringify({ 
      error: "Erro ao processar requisição. Tente novamente." 
    }),
    { status: 500, headers: corsHeaders }
  );
}
```

### Frontend
```typescript
// Exibir toast amigável ao usuário
if (error.status === 429) {
  toast.error("Muitas requisições. Aguarde um momento e tente novamente.");
} else if (error.status === 402) {
  toast.error("Limite de uso atingido. Entre em contato com o suporte.");
} else {
  toast.error("Erro ao processar sua requisição. Tente novamente.");
}
```

### RLS
- Usuários só acessam conversas/relatórios da sua empresa
- Validar company_id em todas as queries

---

## 📊 **MÉTRICAS E MONITORAMENTO**

**Tabela para tracking:**
```sql
CREATE TABLE ai_usage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  function_name TEXT NOT NULL,
  tokens_used INTEGER,
  execution_time_ms INTEGER,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Dashboard de uso interno (admin):**
- Total de tokens usados no mês
- Funções mais utilizadas
- Usuários mais ativos
- Taxa de erro
- Tempo médio de resposta

---

## 🚀 **MELHORIAS FUTURAS (Pós-Sprint 4)**

1. **Sugestões Proativas:**
   - IA sugere automaticamente melhorias ao detectar padrões
   - Alertas sobre documentos desatualizados
   
2. **Análise Comparativa:**
   - Comparar governança com empresas similares
   - Benchmarking automático
   
3. **Integração com Reuniões:**
   - Transcrição automática de áudio
   - Extração de action items durante reunião
   - Sugestões de pauta baseadas em histórico
   
4. **Multi-idioma:**
   - Relatórios em inglês para investidores internacionais
   
5. **Fine-tuning:**
   - Treinar modelo específico com dados da empresa (se volume justificar)

---

## 💡 **CONSIDERAÇÕES DE IMPLEMENTAÇÃO**

### Contexto para IA
- Limitar contexto para não exceder limites de tokens
- Priorizar informações mais recentes/relevantes
- Usar embeddings para busca semântica (futuro)

### Qualidade das Respostas
- Testar prompts extensivamente
- Ajustar temperature conforme tipo de tarefa:
  - Relatórios formais: temperature baixa (0.3)
  - Brainstorming: temperature mais alta (0.7)
  
### UX
- Mostrar "thinking..." durante streaming
- Permitir interromper geração
- Feedback do usuário sobre qualidade (👍👎)
- Regenerar resposta se insatisfatória

### Performance
- Cache de respostas comuns
- Lazy loading de conversas antigas
- Pagination em listas de relatórios

---

## 📝 **PROMPT ENGINEERING TIPS**

### Bons Prompts:
✅ "Gere uma ata formal baseada nos dados: [dados estruturados]"
✅ "Analise a maturidade de governança e sugira 3 ações prioritárias"
✅ "Identifique riscos de compliance neste documento: [texto]"

### Evitar:
❌ Prompts vagos: "Me ajude com governança"
❌ Sem contexto: "Gere um relatório"
❌ Muito genéricos: "O que você sabe sobre ESG?"

### Estrutura Ideal:
```
[Papel] Você é um especialista em X
[Tarefa] Analise/Gere/Identifique Y
[Contexto] Baseado nos dados: {...}
[Formato] Retorne em formato Z
[Restrições] Use linguagem formal/objetiva, máximo N palavras, etc
```
