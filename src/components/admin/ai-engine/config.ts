import { 
  Sparkles, 
  Target, 
  Zap, 
  FileText, 
  Brain, 
  Bot, 
  Code, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  type LucideIcon 
} from 'lucide-react';

// ============================================================================
// VARIANT CONFIGURATIONS
// ============================================================================

export type ColorVariant = 'primary' | 'success' | 'destructive' | 'warning' | 'info' | 'accent' | 'muted';

export const VARIANT_STYLES: Record<ColorVariant, { bg: string; text: string; border: string }> = {
  primary: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/20',
  },
  success: {
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success/20',
  },
  destructive: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive/20',
  },
  warning: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/20',
  },
  info: {
    bg: 'bg-info/10',
    text: 'text-info',
    border: 'border-info/20',
  },
  accent: {
    bg: 'bg-accent/50',
    text: 'text-accent-foreground',
    border: 'border-accent/30',
  },
  muted: {
    bg: 'bg-muted/50',
    text: 'text-muted-foreground',
    border: 'border-muted/30',
  },
};

// ============================================================================
// IMPACT LEVEL CONFIGURATIONS
// ============================================================================

export type ImpactLevel = 'critical' | 'high' | 'medium' | 'low';

export const IMPACT_CONFIG: Record<ImpactLevel, { variant: ColorVariant; label: string }> = {
  critical: { variant: 'destructive', label: 'Crítico' },
  high: { variant: 'warning', label: 'Alto' },
  medium: { variant: 'info', label: 'Médio' },
  low: { variant: 'success', label: 'Baixo' },
};

// ============================================================================
// STATUS CONFIGURATIONS
// ============================================================================

export type StatusType = 'active' | 'inactive' | 'beta' | 'deprecated';

export const STATUS_CONFIG: Record<StatusType, { variant: ColorVariant; label: string }> = {
  active: { variant: 'success', label: 'Ativo' },
  inactive: { variant: 'muted', label: 'Inativo' },
  beta: { variant: 'info', label: 'Beta' },
  deprecated: { variant: 'warning', label: 'Depreciado' },
};

// ============================================================================
// AGENT CONFIGURATIONS
// ============================================================================

export interface AgentConfig {
  id: string;
  code: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  variant: ColorVariant;
  description: string;
}

export const AGENT_CONFIGS: AgentConfig[] = [
  {
    id: 'agent_a',
    code: 'A',
    name: 'Agente Coletor de Inteligência',
    shortName: 'Agent A',
    icon: Sparkles,
    variant: 'primary',
    description: 'Coleta e processa dados de múltiplas fontes',
  },
  {
    id: 'agent_b',
    code: 'B',
    name: 'Agente Analista de Padrões',
    shortName: 'Agent B',
    icon: Target,
    variant: 'warning',
    description: 'Detecta padrões e tendências nos dados',
  },
  {
    id: 'agent_c',
    code: 'C',
    name: 'Agente Gerador de Insights',
    shortName: 'Agent C',
    icon: Zap,
    variant: 'success',
    description: 'Gera insights acionáveis a partir de análises',
  },
  {
    id: 'agent_d',
    code: 'D',
    name: 'Agente Consultor Especializado',
    shortName: 'Agent D',
    icon: FileText,
    variant: 'accent',
    description: 'Fornece recomendações especializadas',
  },
];

// ============================================================================
// KPI CONFIGURATIONS
// ============================================================================

export interface KPIConfig {
  id: string;
  title: string;
  icon: LucideIcon;
  variant: ColorVariant;
}

export const KPI_CONFIGS: KPIConfig[] = [
  { id: 'total', title: 'Total Prompts', icon: Code, variant: 'primary' },
  { id: 'active', title: 'Ativos', icon: CheckCircle2, variant: 'success' },
  { id: 'critical', title: 'Críticos', icon: AlertTriangle, variant: 'destructive' },
  { id: 'agents', title: 'Agentes', icon: Bot, variant: 'accent' },
  { id: 'copilots', title: 'Copilotos', icon: Brain, variant: 'info' },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getVariantStyles = (variant: ColorVariant) => VARIANT_STYLES[variant];
export const getImpactConfig = (level: ImpactLevel) => IMPACT_CONFIG[level];
export const getStatusConfig = (status: StatusType) => STATUS_CONFIG[status];
export const getAgentConfig = (id: string) => AGENT_CONFIGS.find(a => a.id === id);
