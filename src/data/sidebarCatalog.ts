import { LucideIcon } from "lucide-react";
import { 
  ActivitySquare, BarChart3, Calendar, FileText, LayoutDashboard, 
  Leaf, Settings, Shield, Users, BookText, 
  Brain, Send, TrendingUp, Target, Zap, BookOpen, AlertCircle, Award, Bot, Calculator
} from "lucide-react";
import { ModuleKey } from "@/types/organization";

export interface SidebarItem {
  key: ModuleKey;
  label: string;
  path: string;
  icon: LucideIcon;
  premium?: boolean;
  isAddon?: boolean;
}

export interface SidebarSection {
  key: string;
  label: string;
  icon: LucideIcon;
  color: string;
  premium?: boolean;
  isBase?: boolean;
  isAddon?: boolean;
  items: SidebarItem[];
}

// Descrições de módulos para o UpgradeModal
export const MODULE_DESCRIPTIONS: Record<string, { 
  description: string; 
  benefits: string[];
  pricing?: {
    monthly: number;
    annual: number;
    annualMonthly: number;
    discount: number;
    savingsMonths: number;
  };
  valueProposition?: string;
}> = {
  dashboard: {
    description: 'Painel central com visão geral de todos os indicadores de governança.',
    benefits: ['Métricas em tempo real', 'Alertas de pendências', 'Visão consolidada da governança']
  },
  settings: {
    description: 'Configure preferências da plataforma e gerencie seu plano.',
    benefits: ['Personalização da experiência', 'Gestão de usuários', 'Configurações de notificações']
  },
  structure: {
    description: 'Gerencie a estrutura societária e hierarquia da empresa.',
    benefits: ['Visualização clara da estrutura', 'Gestão de sócios e quotistas', 'Histórico de alterações']
  },
  cap_table: {
    description: 'Controle participações societárias e distribuição de capital.',
    benefits: ['Gestão de participações', 'Simulações de diluição', 'Histórico de rodadas']
  },
  gov_maturity: {
    description: 'Avalie e acompanhe a maturidade de governança da empresa.',
    benefits: ['Diagnóstico IBGC', 'Comparativo setorial', 'Plano de evolução']
  },
  legacy_rituals: {
    description: 'Documente legado familiar e rituais de governança.',
    benefits: ['Preservação de valores', 'Rituais documentados', 'Transmissão intergeracional']
  },
  checklist: {
    description: 'Checklist de documentos essenciais para governança.',
    benefits: ['Organização documental', 'Status de conformidade', 'Alertas de vencimento']
  },
  interviews: {
    description: 'Gerencie entrevistas de diagnóstico de governança.',
    benefits: ['Agenda de entrevistas', 'Transcrições e análises', 'Insights consolidados']
  },
  analysis_actions: {
    description: 'Relatório inicial com análises e plano de ação.',
    benefits: ['Diagnóstico completo', 'Recomendações prioritárias', 'Plano de implementação']
  },
  annual_agenda: {
    description: 'Planeje e gerencie a agenda anual de reuniões.',
    benefits: ['Calendário integrado', 'Convocações automáticas', 'Controle de frequência']
  },
  gov_config: {
    description: 'Configure órgãos de governança da empresa.',
    benefits: ['Criação de conselhos e comitês', 'Definição de competências', 'Gestão de membros']
  },
  secretariat: {
    description: 'Painel completo para gestão da secretaria de governança.',
    benefits: ['Gestão de tarefas', 'Controle de ATAs', 'Relatórios de pendências']
  },
  councils: {
    description: 'Acesso direto aos conselhos configurados.',
    benefits: ['Visualização de membros', 'Histórico de reuniões', 'Documentos do órgão']
  },
  project_submission: {
    description: 'Submeta projetos para deliberação dos órgãos.',
    benefits: ['Fluxo de aprovação', 'Rastreamento de status', 'Histórico de decisões']
  },
  leadership_performance: {
    description: 'Gestão de pessoas e desempenho de liderança.',
    benefits: ['Avaliação de competências', 'Planos de desenvolvimento', 'Sucessão de líderes']
  },
  board_performance: {
    description: 'Avaliação de desempenho dos membros do conselho.',
    benefits: ['Métricas automáticas', 'Avaliações 360°', 'Ranking de performance', 'Alertas de baixo desempenho']
  },
  risks: {
    description: 'Identifique e gerencie riscos de governança.',
    benefits: ['Matriz de riscos', 'Planos de mitigação', 'Monitoramento contínuo']
  },
  activities: {
    description: 'Histórico de atividades e logs da plataforma.',
    benefits: ['Auditoria completa', 'Filtros avançados', 'Exportação de dados']
  },
  esg_maturity: {
    description: 'Avalie a maturidade ESG e gere relatórios de sustentabilidade.',
    benefits: ['Diagnóstico ambiental, social e governança', 'Benchmarking ESG', 'Relatórios para stakeholders']
  },
  market_intel: {
    description: 'Inteligência de mercado com análise de ameaças e oportunidades.',
    benefits: ['Monitoramento de concorrentes', 'Tendências do setor', 'Sugestões de pauta automáticas']
  },
  benchmarking: {
    description: 'Compare sua governança com empresas do setor.',
    benefits: ['Ranking setorial', 'Indicadores comparativos', 'Melhores práticas']
  },
  ai_copilot: {
    description: 'Copiloto de Governança com IA preditiva para decisões estratégicas.',
    benefits: ['Análise preditiva de riscos', 'Identificação de oportunidades', 'Histórico de tendências', 'Ações recomendadas navegáveis']
  },
  ai_agents: {
    description: 'Agentes de IA especializados do MOAT Engine.',
    benefits: ['Agent A: Sinais Externos', 'Agent B: Memória de Governança', 'Agent C: Priorização Inteligente', 'Agent D: Geração de Pautas']
  },
  scenario_simulator: {
    description: 'Simule cenários estratégicos e teste decisões antes de implementá-las no mundo real.',
    benefits: [
      'Simulações Monte Carlo para análise de riscos',
      'Modelagem What-If com múltiplas variáveis',
      'Árvores de Decisão interativas',
      'Análise de Sensibilidade automatizada',
      'Cenários Pré-configurados (otimista, realista, pessimista)',
      'Visualizações 3D de impactos multi-dimensionais',
      'Comparação Lado-a-Lado de alternativas estratégicas',
      'Integração com Dados Reais (financeiros, operacionais, mercado)'
    ],
    pricing: {
      monthly: 697.00,
      annual: 6970.00,
      annualMonthly: 581.67,
      discount: 16.7,
      savingsMonths: 2
    },
    valueProposition: 'Tome decisões estratégicas com confiança, testando cenários e seus impactos antes de implementá-los. Simule fusões, expansões, cortes de custos e mudanças de mercado para visualizar impactos financeiros, operacionais e competitivos antes de comprometer recursos.'
  }
};

// ==========================================
// SEÇÕES BASE (disponíveis para todos os planos)
// ==========================================
export const BASE_SECTIONS: SidebarSection[] = [
  {
    key: 'inicio',
    label: 'INÍCIO',
    icon: Target,
    color: 'text-sidebar-foreground/70',
    isBase: true,
    items: [
      { key: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    key: 'parametrizacao',
    label: 'PARAMETRIZAÇÃO',
    icon: Zap,
    color: 'text-sidebar-foreground/70',
    isBase: true,
    items: [
      { key: 'structure', label: 'Estrutura Societária', path: '/shareholder-structure', icon: Users },
      { key: 'cap_table', label: 'Cap Table', path: '/cap-table', icon: BarChart3 },
      { key: 'gov_maturity', label: 'Maturidade de Governança', path: '/maturity', icon: BarChart3 },
    ]
  },
  {
    key: 'preparacao',
    label: 'PREPARAÇÃO',
    icon: BookOpen,
    color: 'text-sidebar-foreground/70',
    isBase: true,
    items: [
      { key: 'checklist', label: 'Checklist', path: '/document-checklist', icon: FileText },
      { key: 'interviews', label: 'Entrevistas', path: '/interviews', icon: ActivitySquare },
      { key: 'analysis_actions', label: 'Análise e Ações', path: '/initial-report', icon: BarChart3 },
    ]
  },
  {
    key: 'estruturacao',
    label: 'ESTRUTURAÇÃO',
    icon: Shield,
    color: 'text-sidebar-foreground/70',
    isBase: true,
    items: [
      { key: 'gov_config', label: 'Config. Governança', path: '/governance-config', icon: Shield },
      { key: 'annual_agenda', label: 'Agenda Anual', path: '/annual-agenda', icon: Calendar },
      { key: 'secretariat', label: 'Secretariado', path: '/secretariat', icon: Shield },
    ]
  },
];

// ==========================================
// ADD-ONS FLAT LIST (para exibição simples)
// ==========================================
export const ADDON_ITEMS: SidebarItem[] = [
  { key: 'project_submission', label: 'Submeter Projetos', path: '/submit-projects', icon: Send, isAddon: true },
  { key: 'leadership_performance', label: 'Desenvolvimento e PDI', path: '/people-management', icon: Users, isAddon: true },
  { key: 'board_performance', label: 'Desempenho do Conselho', path: '/board-performance', icon: Award, isAddon: true },
  { key: 'risks', label: 'Riscos', path: '/governance-risk-management', icon: Shield, isAddon: true },
  { key: 'esg_maturity', label: 'Maturidade ESG', path: '/esg', icon: Leaf, isAddon: true },
  { key: 'market_intel', label: 'Inteligência de Mercado', path: '/market-intelligence', icon: TrendingUp, isAddon: true },
  { key: 'benchmarking', label: 'Benchmarking Global', path: '/benchmarking', icon: BarChart3, isAddon: true },
  { key: 'ai_agents', label: 'Agentes de IA', path: '/ai-agents', icon: Bot, isAddon: true },
  { key: 'scenario_simulator', label: 'Simulador de Cenários', path: '/simulador-cenarios', icon: Calculator, isAddon: true },
];

// ==========================================
// SEÇÕES ADD-ON (mantido para compatibilidade)
// ==========================================
export const ADDON_SECTIONS: SidebarSection[] = [
  {
    key: 'gestao_pessoas',
    label: 'GESTÃO DE PESSOAS',
    icon: Users,
    color: 'text-orange-400',
    isAddon: true,
    items: [
      { key: 'leadership_performance', label: 'Desenvolvimento e PDI', path: '/people-management', icon: Users, isAddon: true },
      { key: 'board_performance', label: 'Desempenho do Conselho', path: '/board-performance', icon: Award, isAddon: true },
    ]
  },
  {
    key: 'monitoramento',
    label: 'MONITORAMENTO',
    icon: AlertCircle,
    color: 'text-red-400',
    isAddon: true,
    items: [
      { key: 'risks', label: 'Riscos', path: '/governance-risk-management', icon: Shield, isAddon: true },
    ]
  },
  {
    key: 'esg',
    label: 'ESG',
    icon: Leaf,
    color: 'text-emerald-400',
    isAddon: true,
    items: [
      { key: 'esg_maturity', label: 'Maturidade ESG', path: '/esg', icon: Leaf, isAddon: true },
    ]
  },
  {
    key: 'inteligencia_mercado',
    label: 'INTELIGÊNCIA DE MERCADO',
    icon: TrendingUp,
    color: 'text-cyan-400',
    isAddon: true,
    items: [
      { key: 'market_intel', label: 'Inteligência de Mercado', path: '/market-intelligence', icon: TrendingUp, isAddon: true },
      { key: 'benchmarking', label: 'Benchmarking Global', path: '/benchmarking', icon: BarChart3, isAddon: true },
    ]
  },
];

// ==========================================
// ITENS FIXOS (sempre visíveis na base do sidebar)
// ==========================================
export const FIXED_ITEMS: SidebarItem[] = [];

// ==========================================
// ADD-ONS DINÂMICOS (vão para seções específicas quando ativados)
// ==========================================
export const DYNAMIC_ADDONS: Record<string, { targetSection: string; item: SidebarItem }> = {
  ai_copilot: {
    targetSection: 'inicio',
    item: { key: 'ai_copilot', label: 'Copiloto IA', path: '/copiloto-governanca', icon: Brain, isAddon: true }
  },
  project_submission: {
    targetSection: 'estruturacao',
    item: { key: 'project_submission', label: 'Submeter Projetos', path: '/submit-projects', icon: Send, isAddon: true }
  }
};

// ==========================================
// SIDEBAR_SECTIONS (mantido para compatibilidade)
// ==========================================
export const SIDEBAR_SECTIONS: SidebarSection[] = [
  ...BASE_SECTIONS,
  ...ADDON_SECTIONS
];
