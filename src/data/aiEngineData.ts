// ============================================================================
// DADOS CONSOLIDADOS DO MOTOR DE IA - LEGACY OS
// ============================================================================
// Arquitetura de 3 camadas: Copilotos → Agentes → Serviços
// ============================================================================

import type { 
  AIEngineArchitecture, 
  AICopilot, 
  AIAgent, 
  AIService,
  AgentDisplayConfig,
  CopilotDisplayConfig 
} from '@/types/aiArchitecture';

// ============================================================================
// CAMADA 1: SERVIÇOS (Funções atômicas reutilizáveis)
// ============================================================================

export const aiServices: AIService[] = [
  {
    id: 'service-ocr',
    name: 'OCR e Extração de Dados',
    description: 'Digitalização e estruturação de documentos físicos e scans',
    category: 'document',
    status: 'active',
    model: 'google/gemini-2.5-flash',
    temperature: 0.3,
    maxTokens: 2000,
    metrics: {
      totalExecutions: 1245,
      avgLatencyMs: 1890,
      avgTokensUsed: 890,
      avgCostUsd: 0.0045,
      successRate: 98.2,
      avgQualityScore: 4.6,
    },
    version: '1.0.0',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-15T14:30:00Z',
  },
  {
    id: 'service-search-intent',
    name: 'Extração de Intenção de Busca',
    description: 'Interpreta perguntas em linguagem natural para localizar documentos',
    category: 'search',
    status: 'active',
    model: 'google/gemini-2.5-flash',
    temperature: 0.3,
    maxTokens: 1000,
    metrics: {
      totalExecutions: 523,
      avgLatencyMs: 890,
      avgTokensUsed: 456,
      avgCostUsd: 0.0023,
      successRate: 98.9,
      avgQualityScore: 4.7,
    },
    version: '1.0.0',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-15T14:30:00Z',
  },
  {
    id: 'service-search-response',
    name: 'Geração de Respostas de Busca',
    description: 'Gera respostas conversacionais para buscas em documentos',
    category: 'generation',
    status: 'active',
    model: 'google/gemini-2.5-flash',
    temperature: 0.6,
    maxTokens: 2000,
    metrics: {
      totalExecutions: 489,
      avgLatencyMs: 1234,
      avgTokensUsed: 890,
      avgCostUsd: 0.0045,
      successRate: 97.3,
      avgQualityScore: 4.5,
    },
    version: '1.0.0',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-15T14:30:00Z',
  },
  {
    id: 'service-pdi-generator',
    name: 'Gerador de PDI',
    description: 'Gera Planos de Desenvolvimento Individual personalizados',
    category: 'generation',
    status: 'active',
    model: 'google/gemini-2.5-flash',
    temperature: 0.7,
    maxTokens: 6000,
    metrics: {
      totalExecutions: 156,
      avgLatencyMs: 2890,
      avgTokensUsed: 3890,
      avgCostUsd: 0.0198,
      successRate: 94.2,
      avgQualityScore: 4.4,
    },
    version: '1.0.0',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-15T14:30:00Z',
  },
];

// ============================================================================
// CAMADA 2: AGENTES (Especialistas em domínios específicos)
// ============================================================================

export const aiAgents: AIAgent[] = [
  // ========== AGENT A: Coleta & Classificação ==========
  {
    id: 'agent-a',
    code: 'A',
    name: 'Agent A',
    shortName: 'Coleta & Classificacao',
    description: 'Coleta sinais externos e classifica informacoes relevantes para decisoes estrategicas',
    executiveDescription: 'Agente fundamental para a inteligência competitiva do conselho, coletando sinais externos que antecipam riscos e oportunidades de mercado.',
    icon: 'Sparkles',
    color: '#6366f1',
    type: 'collector',
    scope: 'system',
    impactLevel: 'critical',
    status: 'active',
    capabilities: [
      'Coleta de sinais macroeconomicos',
      'Monitoramento de mudancas regulatorias',
      'Analise de movimentacoes do setor',
      'Identificacao de riscos geopoliticos',
      'Rastreamento de tendencias ESG',
    ],
    prompts: [
      {
        id: 'a1-collector-001',
        name: 'Collector',
        type: 'system',
        version: '1.0.0',
        status: 'active',
        impactLevel: 'critical',
        metrics: { executions: 487, successRate: 97.2, avgQualityScore: 4.3 },
      },
      {
        id: 'a2-classifier-001',
        name: 'Classifier',
        type: 'system',
        version: '1.0.0',
        status: 'active',
        impactLevel: 'high',
        metrics: { executions: 423, successRate: 98.5, avgQualityScore: 4.5 },
      },
    ],
    integrations: ['Inteligencia de Mercado'],
    metrics: {
      totalExecutions: 910,
      avgLatencyMs: 1640,
      successRate: 97.8,
      avgQualityScore: 4.4,
    },
    dependsOn: [],
    usedBy: ['copilot-governance', 'agent-c'],
  },

  // ========== AGENT B: Análise & Padrões ==========
  {
    id: 'agent-b',
    code: 'B',
    name: 'Agent B',
    shortName: 'Analise & Padroes',
    description: 'Analisa historico de governanca e detecta padroes de recorrencia',
    executiveDescription: 'Memória institucional da governança. Identifica padrões crônicos e custos de não-decisão para accountability do conselho.',
    icon: 'Target',
    color: '#f59e0b',
    type: 'analyzer',
    scope: 'council',
    impactLevel: 'critical',
    status: 'active',
    capabilities: [
      'Analise de padroes de recorrencia',
      'Deteccao de gaps de execucao',
      'Calculo de custos de nao-decisao',
      'Identificacao de riscos cronicos',
      'Avaliacao de efetividade de mitigacao',
    ],
    prompts: [
      {
        id: 'b1-analyzer-001',
        name: 'Analyzer',
        type: 'system',
        version: '1.0.0',
        status: 'active',
        impactLevel: 'critical',
        metrics: { executions: 312, successRate: 95.4, avgQualityScore: 4.2 },
      },
      {
        id: 'b2-pattern-001',
        name: 'Pattern Detector',
        type: 'system',
        version: '1.0.0',
        status: 'active',
        impactLevel: 'high',
        metrics: { executions: 278, successRate: 96.8, avgQualityScore: 4.4 },
      },
    ],
    integrations: ['Memoria Institucional'],
    metrics: {
      totalExecutions: 590,
      avgLatencyMs: 2295,
      successRate: 96.1,
      avgQualityScore: 4.3,
    },
    dependsOn: [],
    usedBy: ['copilot-governance', 'agent-c'],
  },

  // ========== AGENT C: Scoring & Priorização ==========
  {
    id: 'agent-c',
    code: 'C',
    name: 'Agent C',
    shortName: 'Scoring & Priorizacao',
    description: 'Calcula priority scores e prioriza temas para agenda do conselho',
    executiveDescription: 'Algoritmo central de priorização. Define quais temas chegam ao conselho e em que ordem.',
    icon: 'Zap',
    color: '#22c55e',
    type: 'scorer',
    scope: 'council',
    impactLevel: 'critical',
    status: 'active',
    capabilities: [
      'Calculo de Priority Score multidimensional',
      'Priorizacao baseada em urgencia e impacto',
      'Balanceamento de tipos de temas',
      'Gestao de interdependencias',
      'Alocacao otimizada de tempo',
    ],
    prompts: [
      {
        id: 'c1-scorer-001',
        name: 'Scorer',
        type: 'system',
        version: '1.0.0',
        status: 'active',
        impactLevel: 'critical',
        metrics: { executions: 256, successRate: 98.1, avgQualityScore: 4.6 },
      },
      {
        id: 'c2-prioritizer-001',
        name: 'Prioritizer',
        type: 'system',
        version: '1.0.0',
        status: 'active',
        impactLevel: 'high',
        metrics: { executions: 234, successRate: 97.9, avgQualityScore: 4.5 },
      },
    ],
    integrations: ['Pauta Estrategica'],
    metrics: {
      totalExecutions: 490,
      avgLatencyMs: 1456,
      successRate: 98.0,
      avgQualityScore: 4.55,
    },
    dependsOn: ['agent-a', 'agent-b'],
    usedBy: ['agent-d'],
  },

  // ========== AGENT D: Geração de Conteúdo ==========
  {
    id: 'agent-d',
    code: 'D',
    name: 'Agent D',
    shortName: 'Geracao de Conteudo',
    description: 'Gera pautas estruturadas e briefings personalizados',
    executiveDescription: 'Geração automática de pautas profissionais. Impacta diretamente a qualidade das reuniões de conselho.',
    icon: 'FileText',
    color: '#ec4899',
    type: 'generator',
    scope: 'council',
    impactLevel: 'critical',
    status: 'active',
    capabilities: [
      'Geracao de pautas estruturadas',
      'Briefings personalizados por membro',
      'Distribuicao inteligente de tempo',
      'Perguntas criticas contextualizadas',
      'Materiais de apoio sugeridos',
    ],
    prompts: [
      {
        id: 'd1-agenda-001',
        name: 'Agenda Generator',
        type: 'system',
        version: '1.0.0',
        status: 'active',
        impactLevel: 'critical',
        metrics: { executions: 198, successRate: 96.5, avgQualityScore: 4.4 },
      },
      {
        id: 'd2-briefing-001',
        name: 'Briefing Generator',
        type: 'system',
        version: '1.0.0',
        status: 'active',
        impactLevel: 'high',
        metrics: { executions: 189, successRate: 95.8, avgQualityScore: 4.7 },
      },
    ],
    integrations: ['Conselhos', 'Reunioes', 'Agenda Anual'],
    metrics: {
      totalExecutions: 387,
      avgLatencyMs: 2962,
      successRate: 96.15,
      avgQualityScore: 4.55,
    },
    dependsOn: ['agent-c'],
    usedBy: ['copilot-governance'],
  },
];

// ============================================================================
// CAMADA 3: COPILOTOS (Interfaces de alto nível para usuário)
// ============================================================================

export const aiCopilots: AICopilot[] = [
  {
    id: 'copilot-governance',
    name: 'Copiloto de Governanca',
    description: 'Interface principal de insights para o conselho',
    executiveDescription: 'Copiloto principal de governança. Interface estratégica que sintetiza inteligência do MOAT Engine para o conselho.',
    icon: 'Brain',
    color: '#6366f1',
    gradient: 'from-indigo-500 to-purple-600',
    scope: 'council',
    status: 'active',
    agents: ['agent-a', 'agent-b', 'agent-d'],
    connectedPrompts: ['copilot-insights-001'],
    connectedServices: ['insights', 'predictive_analysis'],
    version: '1.0.0',
    metrics: {
      totalUsage: 245,
      avgResponseTime: 2156,
      userSatisfaction: 4.5,
    },
  },
  {
    id: 'copilot-predictive',
    name: 'Insights Preditivos',
    description: 'Versao serverless para analises em tempo real',
    executiveDescription: 'Versão serverless do Copiloto. Gera insights preditivos em tempo real para decisões urgentes.',
    icon: 'TrendingUp',
    color: '#14b8a6',
    gradient: 'from-teal-500 to-cyan-600',
    scope: 'system',
    status: 'active',
    agents: ['agent-a', 'agent-b'],
    connectedPrompts: ['predictive-insights-edge-001'],
    connectedServices: ['predictive_analysis', 'edge_computing'],
    version: '1.0.0',
    metrics: {
      totalUsage: 312,
      avgResponseTime: 2345,
      userSatisfaction: 4.3,
    },
  },
];

// ============================================================================
// ARQUITETURA COMPLETA
// ============================================================================

export const aiEngineArchitecture: AIEngineArchitecture = {
  copilots: aiCopilots,
  agents: aiAgents,
  services: aiServices,
};

// ============================================================================
// FUNÇÕES AUXILIARES PARA UI
// ============================================================================

export function getAgentById(id: string): AIAgent | undefined {
  return aiAgents.find(a => a.id === id);
}

export function getAgentByCode(code: string): AIAgent | undefined {
  return aiAgents.find(a => a.code === code);
}

export function getCopilotById(id: string): AICopilot | undefined {
  return aiCopilots.find(c => c.id === id);
}

export function getServiceById(id: string): AIService | undefined {
  return aiServices.find(s => s.id === id);
}

export function getAgentDisplayConfigs(): AgentDisplayConfig[] {
  return aiAgents.map(agent => ({
    id: agent.id,
    name: agent.name,
    shortName: agent.shortName,
    description: agent.description,
    icon: agent.icon,
    color: agent.color,
    badges: {
      critical: agent.prompts.filter(p => p.impactLevel === 'critical').length,
      active: agent.prompts.filter(p => p.status === 'active').length,
    },
    prompts: agent.prompts.map(p => ({
      id: p.id,
      name: p.name,
      version: p.version,
      impactLevel: p.impactLevel,
      status: p.status,
    })),
    scope: agent.scope,
    dependentAgents: agent.usedBy,
  }));
}

export function getCopilotDisplayConfigs(): CopilotDisplayConfig[] {
  return aiCopilots.map(copilot => ({
    id: copilot.id,
    name: copilot.name,
    description: copilot.description,
    icon: copilot.icon,
    color: copilot.color,
    scope: copilot.scope,
    connectedAgents: copilot.agents,
    connectedPrompts: copilot.connectedPrompts.map(promptId => {
      // Buscar o prompt nos agentes
      for (const agent of aiAgents) {
        const prompt = agent.prompts.find(p => p.id === promptId);
        if (prompt) {
          return { name: prompt.name, version: prompt.version };
        }
      }
      return { name: promptId, version: '1.0.0' };
    }),
  }));
}

// ============================================================================
// ESTATÍSTICAS AGREGADAS
// ============================================================================

export function getEngineStats() {
  const totalAgentExecutions = aiAgents.reduce(
    (sum, agent) => sum + agent.metrics.totalExecutions, 
    0
  );
  
  const avgAgentSuccessRate = aiAgents.reduce(
    (sum, agent) => sum + agent.metrics.successRate, 
    0
  ) / aiAgents.length;
  
  const totalPrompts = aiAgents.reduce(
    (sum, agent) => sum + agent.prompts.length, 
    0
  );
  
  const criticalPrompts = aiAgents.reduce(
    (sum, agent) => sum + agent.prompts.filter(p => p.impactLevel === 'critical').length, 
    0
  );

  return {
    totalCopilots: aiCopilots.length,
    totalAgents: aiAgents.length,
    totalServices: aiServices.length,
    totalPrompts,
    criticalPrompts,
    totalExecutions: totalAgentExecutions,
    avgSuccessRate: avgAgentSuccessRate,
    activeAgents: aiAgents.filter(a => a.status === 'active').length,
  };
}
