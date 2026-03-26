// ============================================================================
// TIPOS PARA ARQUITETURA DE IA - LEGACY OS
// ============================================================================
// Estrutura de 3 camadas: Copilotos → Agentes → Serviços
// ============================================================================

import { LucideIcon } from 'lucide-react';

// ============================================================================
// CAMADA 1: SERVIÇOS (Funções atômicas reutilizáveis)
// ============================================================================

export type ServiceStatus = 'active' | 'inactive' | 'beta' | 'deprecated';

export interface AIService {
  id: string;
  name: string;
  description: string;
  category: 'document' | 'analysis' | 'generation' | 'search' | 'scoring';
  status: ServiceStatus;
  
  // Configuração do modelo
  model: string;
  temperature: number;
  maxTokens: number;
  
  // Métricas
  metrics: {
    totalExecutions: number;
    avgLatencyMs: number;
    avgTokensUsed: number;
    avgCostUsd: number;
    successRate: number;
    avgQualityScore: number;
  };
  
  // Metadados
  version: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// CAMADA 2: AGENTES (Especialistas em domínios específicos)
// ============================================================================

export type AgentType = 
  | 'collector'      // Coleta de dados externos
  | 'classifier'     // Classificação e categorização
  | 'analyzer'       // Análise profunda
  | 'pattern'        // Detecção de padrões
  | 'scorer'         // Cálculo de scores
  | 'prioritizer'    // Priorização
  | 'generator'      // Geração de conteúdo
  | 'advisor'        // Consultor especializado
  | 'orchestrator';  // Orquestrador de inteligência (Agent H)

export type AgentScope = 'system' | 'council' | 'organization' | 'member';
export type ImpactLevel = 'critical' | 'high' | 'medium' | 'low';

export interface AIAgent {
  id: string;
  code: string;           // Ex: 'A', 'B', 'C', 'D'
  name: string;
  shortName: string;
  description: string;
  executiveDescription: string;
  
  // Visual
  icon: string;           // Nome do ícone Lucide
  color: string;          // Cor hex
  
  // Tipo e escopo
  type: AgentType;
  scope: AgentScope;
  impactLevel: ImpactLevel;
  status: ServiceStatus;
  
  // Capacidades
  capabilities: string[];
  
  // Prompts associados
  prompts: AIAgentPrompt[];
  
  // Integrações com módulos da plataforma
  integrations: string[];
  
  // Métricas agregadas
  metrics: {
    totalExecutions: number;
    avgLatencyMs: number;
    successRate: number;
    avgQualityScore: number;
  };
  
  // Dependências de outros agentes
  dependsOn: string[];    // IDs de agentes que este consome
  usedBy: string[];       // IDs de agentes/copilotos que usam este
}

export interface AIAgentPrompt {
  id: string;
  name: string;
  type: 'system' | 'user';
  version: string;
  status: ServiceStatus;
  impactLevel: ImpactLevel;
  
  // Métricas do prompt
  metrics: {
    executions: number;
    successRate: number;
    avgQualityScore: number;
  };
}

// ============================================================================
// CAMADA 3: COPILOTOS (Interfaces de alto nível para usuário)
// ============================================================================

export type CopilotScope = 'council' | 'system' | 'organization';

export interface AICopilot {
  id: string;
  name: string;
  description: string;
  executiveDescription: string;
  
  // Visual
  icon: string;
  color: string;
  gradient?: string;      // Gradiente CSS para destaque
  
  // Escopo
  scope: CopilotScope;
  status: ServiceStatus;
  
  // Agentes que compõem este copiloto
  agents: string[];       // IDs dos agentes
  
  // Prompts conectados
  connectedPrompts: string[];
  
  // Serviços utilizados
  connectedServices: string[];
  
  // Versão
  version: string;
  
  // Métricas
  metrics: {
    totalUsage: number;
    avgResponseTime: number;
    userSatisfaction: number;
  };
}

// ============================================================================
// ESTRUTURA COMPLETA DO MOTOR DE IA
// ============================================================================

export interface AIEngineArchitecture {
  copilots: AICopilot[];
  agents: AIAgent[];
  services: AIService[];
}

// ============================================================================
// DADOS DE CONFIGURAÇÃO VISUAL PARA UI
// ============================================================================

export interface AgentDisplayConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  badges: {
    critical: number;
    active: number;
  };
  prompts: {
    id: string;
    name: string;
    version: string;
    impactLevel: ImpactLevel;
    status: ServiceStatus;
  }[];
  scope: string;
  dependentAgents: string[];
}

export interface CopilotDisplayConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  scope: string;
  connectedAgents: string[];
  connectedPrompts: {
    name: string;
    version: string;
  }[];
}
