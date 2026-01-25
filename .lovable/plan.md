

# Plano: Reestruturar Agent H como Orquestrador de Inteligência

## Resumo Executivo

Transformar o Agent H de um gerador standalone de insights em um **Orquestrador de Inteligência** que sintetiza dados de 4 agentes especializados (A, B, C, D) para produzir insights estrategicos mais ricos e contextualizados.

---

## Arquitetura Atual vs Nova

```text
ANTES (Standalone):
┌─────────────────┐
│ SystemData      │ ──▶ Agent H ──▶ Insights
│ (riscos apenas) │
└─────────────────┘

DEPOIS (Orquestrador):
┌──────────────────────────────────────────────────────┐
│                   CAMADA DE COLETA                   │
├─────────────┬─────────────┬─────────────┬───────────┤
│   Agent A   │   Agent B   │   Agent C   │  Agent D  │
│  (Mercado)  │ (Memoria)   │ (Scoring)   │(Conteudo) │
└──────┬──────┴──────┬──────┴──────┬──────┴─────┬─────┘
       │             │             │            │
       ▼             ▼             ▼            ▼
┌──────────────────────────────────────────────────────┐
│              CAMADA DE ORQUESTRAÇÃO                  │
│                     Agent H                          │
│          predictive-insights (edge fn)               │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│                 SAÍDAS ESTRUTURADAS                  │
├──────────────────┬─────────────────┬─────────────────┤
│ 2 Riscos         │ 2 Ameaças       │ 2 Oportunidades │
│ Estratégicos     │ Operacionais    │ Estratégicas    │
└──────────────────┴─────────────────┴─────────────────┘
```

---

## Etapas de Implementação

### Etapa 1: Criar Tipos para Dados dos Agentes

**Arquivo**: `src/types/agentIntelligence.ts` (novo)

Definir interfaces TypeScript para estruturar os dados de cada agente:
- `AgentAData` - Sinais de mercado e ESG
- `AgentBData` - Padrões históricos e gaps
- `AgentCData` - Scores de prioridade
- `AgentDData` - Contexto de reuniões/deliberações
- `OrchestratorPayload` - Payload consolidado para Agent H

---

### Etapa 2: Atualizar Edge Function predictive-insights

**Arquivo**: `supabase/functions/predictive-insights/index.ts`

Modificar a edge function para:

1. **Aceitar payload expandido** com dados de todos os 4 agentes
2. **Construir prompt orquestrador** que referencia cada fonte
3. **Exigir citação de fontes** em cada insight gerado
4. **Manter retrocompatibilidade** com formato antigo

**Novo System Prompt**:
```
Você é o Agent H - Orquestrador de Inteligência Estratégica da Legacy OS.

Você recebe dados estruturados de 4 agentes especializados:

AGENT A (Coleta & Classificação):
{{agent_a_data}}

AGENT B (Memória Institucional):  
{{agent_b_data}}

AGENT C (Scoring & Priorização):
{{agent_c_data}}

AGENT D (Contexto de Reuniões):
{{agent_d_data}}

SUA MISSÃO:
Correlacionar inteligências de múltiplas fontes para gerar insights 
estratégicos acionáveis para o conselho de administração.

REGRA CRÍTICA:
Cada insight DEVE citar qual(is) agente(s) forneceu(ram) os dados-base.

GERAR EXATAMENTE:
- 2 Riscos Estratégicos
- 2 Ameaças Operacionais  
- 2 Oportunidades Estratégicas
```

---

### Etapa 3: Atualizar Hook usePredictiveInsights

**Arquivo**: `src/hooks/usePredictiveInsights.ts`

Modificar o hook para:

1. **Adicionar função de coleta de dados** dos módulos existentes
2. **Agregar dados** antes de chamar a edge function
3. **Expor fonte dos insights** na resposta

**Novas funções**:
- `collectAgentAData()` - Buscar dados de marketIntelligenceData
- `collectAgentBData()` - Buscar dados de mockHistoricalData  
- `collectAgentCData()` - Extrair scores de prioridade
- `collectAgentDData()` - Buscar contexto de reuniões recentes

---

### Etapa 4: Atualizar Interfaces de Resposta

**Arquivo**: `src/types/agentIntelligence.ts`

Adicionar campo `sources` às interfaces de insight:

```typescript
export interface EnhancedStrategicRisk {
  title: string;
  context: string;
  priority: "critical" | "high" | "medium";
  actions: InsightAction;
  sources: ("agent_a" | "agent_b" | "agent_c" | "agent_d")[];
}
```

---

### Etapa 5: Atualizar Prompt no Banco de Dados

**Ação**: Atualizar registro na tabela `ai_prompt_library` para categoria `agent_h_governance_insights` com o novo system prompt orquestrador.

---

### Etapa 6: Atualizar Metadados do Agent H

**Arquivo**: `src/data/aiEngineData.ts`

Atualizar a definição do Agent H para refletir:
- Novo papel de orquestrador
- Dependências explícitas de A, B, C, D
- Novas capabilities

---

## Detalhamento Técnico

### Estrutura do Payload Expandido

```typescript
interface OrchestratorPayload {
  // Dados existentes (retrocompatibilidade)
  risks: RiskData[];
  maturityScore: number;
  esgScore: number;
  pendingTasks: number;
  overduesTasks: number;
  criticalRisks: number;
  
  // NOVOS: Dados dos agentes
  agentAData: {
    marketThreats: MarketThreat[];
    marketOpportunities: MarketOpportunity[];
    sectorTrends: SectorTrend[];
  };
  agentBData: {
    historicalPatterns: HistoricalPattern[];
    executionGaps: ExecutionGap[];
    recurringIssues: RecurringIssue[];
  };
  agentCData: {
    priorityScores: PriorityScore[];
    urgencyMatrix: UrgencyItem[];
  };
  agentDData: {
    recentDeliberations: Deliberation[];
    upcomingMeetings: Meeting[];
    pendingActions: Action[];
  };
}
```

### Fluxo de Dados na Edge Function

```text
1. Receber payload consolidado
2. Validar presença de dados dos agentes
3. Formatar dados como seções do prompt
4. Chamar Lovable AI com prompt orquestrador
5. Parsear resposta com tool calling
6. Adicionar metadados de fonte a cada insight
7. Retornar insights enriquecidos
```

---

## Arquivos a Serem Modificados/Criados

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `src/types/agentIntelligence.ts` | Criar | Tipos para dados dos agentes e payload |
| `supabase/functions/predictive-insights/index.ts` | Modificar | Novo prompt e parsing expandido |
| `src/hooks/usePredictiveInsights.ts` | Modificar | Coleta e agregação de dados |
| `src/data/aiEngineData.ts` | Modificar | Atualizar metadados do Agent H |
| `src/data/mockPromptsData.ts` | Modificar | Atualizar prompt mock |

---

## Benefícios da Nova Arquitetura

1. **Insights mais contextualizados** - Correlação de múltiplas fontes
2. **Rastreabilidade** - Cada insight cita sua origem
3. **Escalabilidade** - Fácil adicionar novos agentes no futuro
4. **Manutenibilidade** - Separação clara de responsabilidades
5. **Qualidade** - Decisões baseadas em visão 360°

---

## Considerações de Segurança

- Todos os dados são processados server-side na edge function
- Nenhuma informação sensível é exposta no frontend
- Rate limiting e tratamento de erros mantidos

