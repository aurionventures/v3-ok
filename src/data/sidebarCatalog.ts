import { LucideIcon } from "lucide-react";
import { 
  ActivitySquare, BarChart3, Calendar, FileText, LayoutDashboard, 
  Leaf, Settings, Shield, Users, BookText, 
  Activity, Bot, Play, Send, TrendingUp, Target, Zap, BookOpen, AlertCircle
} from "lucide-react";
import { ModuleKey } from "@/types/organization";

export interface SidebarItem {
  key: ModuleKey;
  label: string;
  path: string;
  icon: LucideIcon;
  premium?: boolean;
}

export interface SidebarSection {
  key: string;
  label: string;
  icon: LucideIcon;
  color: string;
  premium?: boolean;
  items: SidebarItem[];
}

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    key: 'inicio',
    label: 'Início',
    icon: Target,
    color: 'text-blue-400',
    items: [
      { key: 'start', label: 'Comece Aqui', path: '/start', icon: Play },
      { key: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { key: 'settings', label: 'Configurações', path: '/settings', icon: Settings },
    ]
  },
  {
    key: 'parametrizacao',
    label: 'PARAMETRIZAÇÃO',
    icon: Zap,
    color: 'text-green-400',
    items: [
      { key: 'structure', label: 'Estrutura Societária', path: '/shareholder-structure', icon: Users },
      { key: 'cap_table', label: 'Cap Table', path: '/cap-table', icon: BarChart3 },
      { key: 'gov_maturity', label: 'Maturidade de Governança', path: '/maturity', icon: BarChart3 },
      { key: 'legacy_rituals', label: 'Legado e Rituais', path: '/legacy', icon: BookText },
    ]
  },
  {
    key: 'preparacao',
    label: 'Preparação',
    icon: BookOpen,
    color: 'text-blue-400',
    items: [
      { key: 'checklist', label: 'Checklist', path: '/document-checklist', icon: FileText },
      { key: 'interviews', label: 'Entrevistas', path: '/interviews', icon: ActivitySquare },
      { key: 'analysis_actions', label: 'Análise e Ações', path: '/initial-report', icon: BarChart3 },
    ]
  },
  {
    key: 'estruturacao',
    label: 'Estruturação',
    icon: Shield,
    color: 'text-purple-400',
    items: [
      { key: 'annual_agenda', label: 'Agenda Anual', path: '/annual-agenda', icon: Calendar },
      { key: 'gov_config', label: 'Órgãos de Governança', path: '/governance-config', icon: Shield },
      { key: 'secretariat', label: 'Painel do Secretariado', path: '/secretariat', icon: Shield },
      { key: 'councils', label: 'Conselhos', path: '/councils', icon: Shield },
      { key: 'project_submission', label: 'Submeter Projetos', path: '/submit-projects', icon: Send },
    ]
  },
  {
    key: 'desenvolvimento',
    label: 'Desenvolvimento',
    icon: Activity,
    color: 'text-orange-400',
    items: [
      { key: 'leadership_performance', label: 'Gestão de Pessoas & Governança', path: '/people-management', icon: Users },
    ]
  },
  {
    key: 'monitoramento',
    label: 'Monitoramento',
    icon: AlertCircle,
    color: 'text-red-400',
    items: [
      { key: 'risks', label: 'Gestão de Riscos de Governança', path: '/governance-risk-management', icon: Shield },
      { key: 'activities', label: 'Atividades', path: '/activities', icon: ActivitySquare },
    ]
  },
  {
    key: 'esg',
    label: 'ESG',
    icon: Leaf,
    color: 'text-emerald-400',
    premium: true,
    items: [
      { key: 'esg_maturity', label: 'Maturidade ESG', path: '/esg', icon: Leaf, premium: true },
    ]
  },
  {
    key: 'inteligencia_mercado',
    label: 'Inteligência de Mercado',
    icon: TrendingUp,
    color: 'text-cyan-400',
    premium: true,
    items: [
      { key: 'market_intel', label: 'Inteligência de Mercado', path: '/market-intelligence', icon: TrendingUp, premium: true },
      { key: 'benchmarking', label: 'Benchmarking Global', path: '/benchmarking', icon: BarChart3, premium: true },
    ]
  },
  {
    key: 'otimizacao',
    label: 'Otimização',
    icon: Zap,
    color: 'text-yellow-400',
    premium: true,
    items: [
      { key: 'ai_agents', label: 'Agentes de IA', path: '/ai-agents', icon: Bot, premium: true },
    ]
  }
];
