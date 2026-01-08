import { LucideIcon } from "lucide-react";
import { 
  ActivitySquare, BarChart3, Calendar, FileText, LayoutDashboard, 
  Leaf, Settings, Shield, Users, BookText, 
  Bot, Send, TrendingUp, Target, Zap, BookOpen, AlertCircle, Award
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
export const MODULE_DESCRIPTIONS: Record<string, { description: string; benefits: string[] }> = {
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
  ai_agents: {
    description: 'Agentes de IA para automação de processos de governança.',
    benefits: ['Geração automática de ATAs', 'Análise de documentos', 'Recomendações inteligentes']
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
    color: 'text-blue-400',
    isBase: true,
    items: [
      { key: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    key: 'parametrizacao',
    label: 'PARAMETRIZAÇÃO',
    icon: Zap,
    color: 'text-green-400',
    isBase: true,
    items: [
      { key: 'structure', label: 'Estrutura Societária', path: '/shareholder-structure', icon: Users },
      { key: 'cap_table', label: 'Cap Table', path: '/cap-table', icon: BarChart3 },
      { key: 'gov_maturity', label: 'Maturidade de Governança', path: '/maturity', icon: BarChart3 },
      { key: 'legacy_rituals', label: 'Legado e Rituais', path: '/legacy', icon: BookText },
    ]
  },
  {
    key: 'preparacao',
    label: 'PREPARAÇÃO',
    icon: BookOpen,
    color: 'text-blue-400',
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
    color: 'text-purple-400',
    isBase: true,
    items: [
      { key: 'gov_config', label: 'Config. Governança', path: '/governance-config', icon: Shield },
      { key: 'annual_agenda', label: 'Agenda Anual', path: '/annual-agenda', icon: Calendar },
      { key: 'secretariat', label: 'Secretariado', path: '/secretariat', icon: Shield },
    ]
  },
];

// ==========================================
// SEÇÕES ADD-ON (módulos pagos separadamente)
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
export const FIXED_ITEMS: SidebarItem[] = [
  { key: 'activities', label: 'Atividades', path: '/activities', icon: ActivitySquare },
  { key: 'settings', label: 'Configurações', path: '/settings', icon: Settings },
];

// ==========================================
// ADD-ONS DINÂMICOS (vão para seções específicas quando ativados)
// ==========================================
export const DYNAMIC_ADDONS: Record<string, { targetSection: string; item: SidebarItem }> = {
  ai_agents: {
    targetSection: 'inicio',
    item: { key: 'ai_agents', label: 'Agentes de IA', path: '/ai-agents', icon: Bot, isAddon: true }
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
