import { useState, useMemo } from 'react';
import { 
  Code, 
  Plus, 
  Search, 
  Brain,
  CheckCircle2,
  AlertCircle,
  Archive,
  Sparkles,
  Cpu,
  Zap,
  FileText,
  Settings2,
  Eye,
  Edit3,
  Copy,
  MoreVertical,
  TrendingUp,
  Shield,
  Target,
  Users,
  LayoutDashboard,
  Bot,
  Layers,
  History,
  AlertTriangle,
  Clock,
  GitBranch,
  RefreshCw,
  ChevronRight,
  Filter,
  Download,
  Building2,
  Activity,
  Gauge,
  BookOpen,
  CircleDot,
  ArrowUpRight,
  ArrowDownRight,
  Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { PromptDetailView } from '@/components/admin/PromptDetailView';
import { PromptEditor } from '@/components/admin/PromptEditor';
import { usePrompts, AIPrompt, StrategicType, ImpactLevel, PromptScope, AgentType } from '@/hooks/usePrompts';
import { cn } from '@/lib/utils';

// ============================================
// CONSTANTS & CONFIGURATIONS
// ============================================

const AGENT_CONFIGS = [
  { 
    id: 'agent_a',
    name: 'Agent A', 
    label: 'Coleta & Classificacao',
    description: 'Coleta sinais externos e classifica informacoes relevantes para decisoes estrategicas',
    function: 'Inteligencia de Mercado',
    categories: ['agent_a_collector', 'agent_a_classifier'],
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Sparkles
  },
  { 
    id: 'agent_b',
    name: 'Agent B', 
    label: 'Analise & Padroes',
    description: 'Analisa historico de governanca e detecta padroes de recorrencia',
    function: 'Memoria Institucional',
    categories: ['agent_b_analyzer', 'agent_b_pattern_detector'],
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: Cpu
  },
  { 
    id: 'agent_c',
    name: 'Agent C', 
    label: 'Scoring & Priorizacao',
    description: 'Calcula priority scores e prioriza temas para agenda do conselho',
    function: 'Priorizacao Estrategica',
    categories: ['agent_c_scorer', 'agent_c_prioritizer'],
    color: 'bg-green-500',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: Zap
  },
  { 
    id: 'agent_d',
    name: 'Agent D', 
    label: 'Geracao de Conteudo',
    description: 'Gera pautas estruturadas e briefings personalizados',
    function: 'Producao de Documentos',
    categories: ['agent_d_agenda_generator', 'agent_d_briefing_generator'],
    color: 'bg-amber-500',
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: FileText
  }
];

const COPILOT_CONFIGS = [
  {
    id: 'copilot_governance',
    name: 'Copiloto de Governanca',
    description: 'Interface principal de insights para o conselho',
    scope: 'Conselho de Administracao',
    categories: ['agent_copilot_insights'],
    icon: Brain,
    color: 'bg-indigo-500',
    dependsOn: ['agent_a', 'agent_b']
  },
  {
    id: 'copilot_predictive',
    name: 'Insights Preditivos',
    description: 'Versao serverless para analises em tempo real',
    scope: 'Sistema',
    categories: ['predictive_insights_edge'],
    icon: TrendingUp,
    color: 'bg-cyan-500',
    dependsOn: ['agent_a', 'agent_b']
  }
];

const SERVICE_CONFIGS = [
  {
    id: 'service_collection',
    name: 'Coleta',
    description: 'Servicos de coleta de dados externos e internos',
    prompts: ['agent_a_collector'],
    icon: Layers
  },
  {
    id: 'service_classification',
    name: 'Classificacao',
    description: 'Classificacao e categorizacao de informacoes',
    prompts: ['agent_a_classifier'],
    icon: Filter
  },
  {
    id: 'service_analysis',
    name: 'Analise',
    description: 'Analise de dados e deteccao de padroes',
    prompts: ['agent_b_analyzer', 'agent_b_pattern_detector'],
    icon: Activity
  },
  {
    id: 'service_scoring',
    name: 'Pontuacao',
    description: 'Calculo de scores e priorizacao',
    prompts: ['agent_c_scorer', 'agent_c_prioritizer'],
    icon: Gauge
  },
  {
    id: 'service_synthesis',
    name: 'Sintese Executiva',
    description: 'Geracao de documentos e briefings',
    prompts: ['agent_d_agenda_generator', 'agent_d_briefing_generator'],
    icon: BookOpen
  },
  {
    id: 'service_development',
    name: 'Desenvolvimento',
    description: 'PDIs e planos de desenvolvimento',
    prompts: ['pdi_generator'],
    icon: Users
  },
  {
    id: 'service_search',
    name: 'Busca Inteligente',
    description: 'Busca semantica em documentos',
    prompts: ['secretariat_search_intent', 'secretariat_search_response'],
    icon: Search
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const getStrategicTypeLabel = (type: StrategicType) => {
  const labels: Record<StrategicType, string> = {
    strategic: 'Estrategico',
    governance: 'Governanca',
    operational: 'Operacional'
  };
  return labels[type] || type;
};

const getStrategicTypeBadge = (type: StrategicType) => {
  const styles: Record<StrategicType, string> = {
    strategic: 'bg-blue-100 text-blue-700 border-blue-200',
    governance: 'bg-purple-100 text-purple-700 border-purple-200',
    operational: 'bg-gray-100 text-gray-700 border-gray-200'
  };
  return styles[type] || 'bg-gray-100 text-gray-700';
};

const getImpactLabel = (impact: ImpactLevel) => {
  const labels: Record<ImpactLevel, string> = {
    critical: 'Critico',
    high: 'Alto',
    medium: 'Medio',
    low: 'Baixo'
  };
  return labels[impact] || impact;
};

const getImpactBadge = (impact: ImpactLevel) => {
  const styles: Record<ImpactLevel, { bg: string; text: string; icon: React.ReactNode }> = {
    critical: { bg: 'bg-red-100', text: 'text-red-700', icon: <AlertTriangle className="h-3 w-3" /> },
    high: { bg: 'bg-orange-100', text: 'text-orange-700', icon: <ArrowUpRight className="h-3 w-3" /> },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <CircleDot className="h-3 w-3" /> },
    low: { bg: 'bg-green-100', text: 'text-green-700', icon: <ArrowDownRight className="h-3 w-3" /> }
  };
  return styles[impact] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: null };
};

const getScopeLabel = (scope: PromptScope) => {
  const labels: Record<PromptScope, string> = {
    council: 'Conselho',
    committee: 'Comite',
    operation: 'Operacao',
    system: 'Sistema'
  };
  return labels[scope] || scope;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-700 border-green-200">Ativo</Badge>;
    case 'testing':
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Teste</Badge>;
    case 'deprecated':
      return <Badge className="bg-gray-100 text-gray-500 border-gray-200">Depreciado</Badge>;
    default:
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Rascunho</Badge>;
  }
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    'agent_a_collector': 'Collector',
    'agent_a_classifier': 'Classifier',
    'agent_b_analyzer': 'Analyzer',
    'agent_b_pattern_detector': 'Pattern Detector',
    'agent_c_scorer': 'Scorer',
    'agent_c_prioritizer': 'Prioritizer',
    'agent_d_agenda_generator': 'Agenda Generator',
    'agent_d_briefing_generator': 'Briefing Generator',
    'agent_copilot_insights': 'Copilot Insights',
    'pdi_generator': 'PDI Generator',
    'secretariat_search_intent': 'Search Intent',
    'secretariat_search_response': 'Search Response',
    'predictive_insights_edge': 'Predictive Edge',
  };
  return labels[category] || category;
};

const getAgentForCategory = (category: string) => {
  for (const agent of AGENT_CONFIGS) {
    if (agent.categories.includes(category)) return agent;
  }
  for (const copilot of COPILOT_CONFIGS) {
    if (copilot.categories.includes(category)) return { ...copilot, name: copilot.name };
  }
  return null;
};

// ============================================
// MOCK VERSION HISTORY DATA
// ============================================

const mockVersionHistory = [
  {
    id: 'v1',
    promptId: 'a1-collector-001',
    version: '1.0.0',
    author: 'Admin Master',
    date: '2025-12-15T14:30:00Z',
    reason: 'Versao inicial do Agent A Collector',
    changes: 'Criacao do prompt inicial'
  },
  {
    id: 'v2',
    promptId: 'b1-analyzer-001',
    version: '1.0.0',
    author: 'Admin Master',
    date: '2025-12-14T10:00:00Z',
    reason: 'Adicao de principios de Ray Dalio',
    changes: 'Incluido framework de principios para analise'
  },
  {
    id: 'v3',
    promptId: 'c1-scorer-001',
    version: '1.1.0',
    author: 'AI Team',
    date: '2025-12-13T09:00:00Z',
    reason: 'Ajuste nos pesos do algoritmo',
    changes: 'Modificado peso de urgencia de 20% para 25%'
  },
  {
    id: 'v4',
    promptId: 'd1-agenda-001',
    version: '1.0.0',
    author: 'Admin Master',
    date: '2025-12-12T15:00:00Z',
    reason: 'Versao inicial',
    changes: 'Criacao do gerador de agenda'
  },
  {
    id: 'v5',
    promptId: 'copilot-insights-001',
    version: '1.2.0',
    author: 'AI Team',
    date: '2025-12-11T11:00:00Z',
    reason: 'Melhoria nas categorias de insights',
    changes: 'Adicionado campo timeframe para ameacas operacionais'
  }
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function AdminPromptLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterImpact, setFilterImpact] = useState<string>('all');
  const [filterScope, setFilterScope] = useState<string>('all');
  
  const { prompts, isLoading, refetch } = usePrompts();

  // Computed values
  const stats = useMemo(() => {
    if (!prompts) return { total: 0, active: 0, critical: 0, agents: 0, copilots: 0 };
    
    const activePrompts = prompts.filter(p => p.status === 'active');
    const criticalPrompts = prompts.filter(p => p.impact_level === 'critical');
    const agentPrompts = prompts.filter(p => p.agent_type === 'moat_engine');
    const copilotPrompts = prompts.filter(p => p.agent_type === 'copilot');
    
    return {
      total: prompts.length,
      active: activePrompts.length,
      critical: criticalPrompts.length,
      agents: new Set(agentPrompts.map(p => p.category.split('_')[1])).size,
      copilots: copilotPrompts.length
    };
  }, [prompts]);

  const filteredPrompts = useMemo(() => {
    if (!prompts) return [];
    
    return prompts.filter(p => {
      const matchesSearch = searchQuery === '' || 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.executive_description && p.executive_description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = filterType === 'all' || p.strategic_type === filterType;
      const matchesImpact = filterImpact === 'all' || p.impact_level === filterImpact;
      const matchesScope = filterScope === 'all' || p.scope === filterScope;
      
      return matchesSearch && matchesType && matchesImpact && matchesScope;
    });
  }, [prompts, searchQuery, filterType, filterImpact, filterScope]);

  const getPromptsForAgent = (agentId: string) => {
    const agentConfig = AGENT_CONFIGS.find(a => a.id === agentId);
    if (!agentConfig) return [];
    return filteredPrompts.filter(p => agentConfig.categories.includes(p.category));
  };

  const criticalPrompts = useMemo(() => {
    return filteredPrompts.filter(p => p.impact_level === 'critical' || p.impact_level === 'high');
  }, [filteredPrompts]);

  const recentChanges = useMemo(() => {
    if (!prompts) return [];
    return [...prompts]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5);
  }, [prompts]);

  const alerts = useMemo(() => {
    if (!prompts) return [];
    const alertList: { type: string; message: string; prompt?: AIPrompt }[] = [];
    
    prompts.forEach(p => {
      if (!p.owner) {
        alertList.push({ type: 'warning', message: `Prompt sem responsavel: ${getCategoryLabel(p.category)}`, prompt: p });
      }
      if (p.status === 'deprecated' && p.agent_type === 'moat_engine') {
        alertList.push({ type: 'info', message: `Prompt depreciado em agente ativo: ${getCategoryLabel(p.category)}`, prompt: p });
      }
    });
    
    return alertList.slice(0, 5);
  }, [prompts]);

  // Handlers
  const handleEditorClose = () => {
    setEditorOpen(false);
    refetch();
  };

  const handlePromptSelect = (promptId: string) => {
    setSelectedPromptId(promptId);
  };

  const handleCreateNew = () => {
    setSelectedPromptId(null);
    setEditorOpen(true);
  };

  const handleEditPrompt = (promptId: string) => {
    setSelectedPromptId(promptId);
    setEditorOpen(true);
  };

  // ============================================
  // RENDER: STRATEGIC HEADER
  // ============================================

  const renderStrategicHeader = () => (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div>
              <h1 className="text-2xl font-bold tracking-tight">AI Engine — Governanca de Prompts</h1>
              <p className="text-slate-300 text-sm mt-1">
                Gestao estrategica da inteligencia do Legacy OS
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Download className="h-4 w-4 mr-2" />
              Exportar Auditoria
            </Button>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={handleCreateNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Prompt
                  </Button>
                </div>
              </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 uppercase tracking-wider">Total Prompts</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Code className="h-5 w-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 uppercase tracking-wider">Ativos</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">{stats.active}</p>
                </div>
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 uppercase tracking-wider">Criticos</p>
                  <p className="text-3xl font-bold text-red-400 mt-1">{stats.critical}</p>
                </div>
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 uppercase tracking-wider">Agentes</p>
                  <p className="text-3xl font-bold text-purple-400 mt-1">4</p>
                </div>
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Bot className="h-5 w-5 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 uppercase tracking-wider">Copilotos</p>
                  <p className="text-3xl font-bold text-cyan-400 mt-1">2</p>
                </div>
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Brain className="h-5 w-5 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // ============================================
  // RENDER: TAB - OVERVIEW
  // ============================================

  const renderOverviewTab = () => (
    <div className="p-6 space-y-6">
      {/* Visual Map: Agents -> Prompts -> Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Mapa de Governanca de IA
          </CardTitle>
          <CardDescription>
            Visao sistemica: Agentes, Prompts e Impacto Estrategico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {AGENT_CONFIGS.map(agent => {
                    const agentPrompts = getPromptsForAgent(agent.id);
              const criticalCount = agentPrompts.filter(p => p.impact_level === 'critical').length;
              const Icon = agent.icon;
                    
                    return (
                <div 
                        key={agent.id}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg",
                    agent.bgColor, agent.borderColor
                  )}
                  onClick={() => {
                    setActiveTab('agents');
                    setSelectedAgent(agent.id);
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn("p-2 rounded-lg", agent.color)}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className={cn("font-semibold", agent.textColor)}>{agent.name}</h4>
                      <p className="text-xs text-muted-foreground">{agent.function}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{agentPrompts.length} prompts</span>
                    {criticalCount > 0 && (
                      <Badge className="bg-red-100 text-red-700">{criticalCount} criticos</Badge>
                    )}
                  </div>
                  <div className="mt-3">
                    <Progress 
                      value={(agentPrompts.filter(p => p.status === 'active').length / Math.max(agentPrompts.length, 1)) * 100} 
                      className="h-1.5"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Critical Prompts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Prompts Criticos
            </CardTitle>
            <CardDescription>
              Prompts com impacto critico ou alto que requerem atencao
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalPrompts.slice(0, 5).map(prompt => {
                const impactStyle = getImpactBadge(prompt.impact_level);
                return (
                  <div 
                    key={prompt.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer"
                    onClick={() => handlePromptSelect(prompt.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-1.5 rounded", impactStyle.bg)}>
                        {impactStyle.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{getCategoryLabel(prompt.category)}</p>
                        <p className="text-xs text-muted-foreground">{getAgentForCategory(prompt.category)?.name}</p>
                      </div>
                    </div>
                    <Badge className={cn(impactStyle.bg, impactStyle.text)}>
                      {getImpactLabel(prompt.impact_level)}
                        </Badge>
                  </div>
                    );
                  })}
              {criticalPrompts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum prompt critico identificado
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Changes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Ultimas Alteracoes
            </CardTitle>
            <CardDescription>
              Prompts modificados recentemente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentChanges.map(prompt => (
                <div 
                  key={prompt.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer"
                  onClick={() => handlePromptSelect(prompt.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded bg-blue-100">
                      <Edit3 className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{getCategoryLabel(prompt.category)}</p>
                      <p className="text-xs text-muted-foreground">
                        v{prompt.version} • {new Date(prompt.updated_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
          </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertCircle className="h-5 w-5" />
              Alertas de Governanca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded bg-yellow-100/50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">{alert.message}</p>
              </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // ============================================
  // RENDER: TAB - AGENTS
  // ============================================

  const renderAgentsTab = () => (
                <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {AGENT_CONFIGS.map(agent => {
          const agentPrompts = getPromptsForAgent(agent.id);
          const activeCount = agentPrompts.filter(p => p.status === 'active').length;
          const criticalCount = agentPrompts.filter(p => p.impact_level === 'critical').length;
          const Icon = agent.icon;
          
          return (
            <Card 
              key={agent.id}
              className={cn(
                "transition-all hover:shadow-lg cursor-pointer border-2",
                selectedAgent === agent.id && "ring-2 ring-primary",
                agent.borderColor
              )}
              onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
            >
              <CardHeader className={cn("rounded-t-lg", agent.bgColor)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-3 rounded-xl", agent.color)}>
                      <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                      <CardTitle className={cn("text-xl", agent.textColor)}>{agent.name}</CardTitle>
                      <CardDescription className="text-sm">{agent.label}</CardDescription>
                        </div>
                      </div>
                  <div className="flex items-center gap-2">
                    {criticalCount > 0 && (
                      <Badge className="bg-red-500 text-white">{criticalCount} Critico</Badge>
                    )}
                    <Badge variant="outline" className={cn("border-2", agent.borderColor, agent.textColor)}>
                      {activeCount}/{agentPrompts.length} Ativos
                    </Badge>
                        </div>
                          </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs">
                    <Target className="h-3 w-3 mr-1" />
                    {agent.function}
                  </Badge>
                        </div>

                {selectedAgent === agent.id && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <h4 className="font-medium text-sm">Prompts deste Agente:</h4>
                    {agentPrompts.map(prompt => (
                      <div 
                        key={prompt.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePromptSelect(prompt.id);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className={cn(
                            "h-4 w-4",
                            prompt.status === 'active' ? 'text-green-500' : 'text-gray-400'
                          )} />
                          <div>
                            <p className="font-medium text-sm">{getCategoryLabel(prompt.category)}</p>
                            <p className="text-xs text-muted-foreground">
                              v{prompt.version} • {getImpactLabel(prompt.impact_level)}
                            </p>
                      </div>
                    </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(prompt.status)}
                          <Button variant="ghost" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            handleEditPrompt(prompt.id);
                          }}>
                            <Edit3 className="h-4 w-4" />
                          </Button>
                  </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAgent(agent.id);
                  }}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Prompts
                        </Button>
                  <Button variant="outline" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('audit');
                  }}>
                    <History className="h-4 w-4" />
                  </Button>
                </div>
                      </CardContent>
                    </Card>
          );
        })}
      </div>
    </div>
  );

  // ============================================
  // RENDER: TAB - COPILOTS
  // ============================================

  const renderCopilotsTab = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COPILOT_CONFIGS.map(copilot => {
          const copilotPrompts = filteredPrompts.filter(p => copilot.categories.includes(p.category));
          const Icon = copilot.icon;
          const dependentAgents = AGENT_CONFIGS.filter(a => copilot.dependsOn.includes(a.id));
          
          return (
            <Card key={copilot.id} className="border-2 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={cn("p-3 rounded-xl", copilot.color)}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>{copilot.name}</CardTitle>
                    <CardDescription>{copilot.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Escopo</p>
                    <Badge variant="secondary">
                      <Building2 className="h-3 w-3 mr-1" />
                      {copilot.scope}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Agentes Dependentes</p>
                    <div className="flex flex-wrap gap-2">
                      {dependentAgents.map(agent => {
                        const AgentIcon = agent.icon;
                        return (
                          <Badge key={agent.id} className={cn(agent.bgColor, agent.textColor, "border", agent.borderColor)}>
                            <AgentIcon className="h-3 w-3 mr-1" />
                            {agent.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Prompts Conectados</p>
                    <div className="space-y-2">
                      {copilotPrompts.map(prompt => (
                        <div 
                          key={prompt.id}
                          className="flex items-center justify-between p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted"
                          onClick={() => handlePromptSelect(prompt.id)}
                        >
                              <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">{getCategoryLabel(prompt.category)}</span>
                              </div>
                          <span className="text-xs text-muted-foreground">v{prompt.version}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // ============================================
  // RENDER: TAB - SERVICES
  // ============================================

  const renderServicesTab = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICE_CONFIGS.map(service => {
          const servicePrompts = filteredPrompts.filter(p => service.prompts.includes(p.category));
          const Icon = service.icon;
          
          return (
            <Card key={service.id} className="hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{service.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                <div className="space-y-2">
                  {servicePrompts.map(prompt => (
                    <div 
                      key={prompt.id}
                      className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm cursor-pointer hover:bg-muted"
                      onClick={() => handlePromptSelect(prompt.id)}
                    >
                      <span>{getCategoryLabel(prompt.category)}</span>
                      {getStatusBadge(prompt.status)}
                    </div>
                  ))}
                  {servicePrompts.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      Nenhum prompt associado
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // ============================================
  // RENDER: TAB - LIBRARY (MAIN TABLE)
  // ============================================

  const renderLibraryTab = () => (
    <div className="p-6">
      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, categoria ou descricao..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="strategic">Estrategico</SelectItem>
            <SelectItem value="governance">Governanca</SelectItem>
            <SelectItem value="operational">Operacional</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterImpact} onValueChange={setFilterImpact}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Impacto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Impactos</SelectItem>
            <SelectItem value="critical">Critico</SelectItem>
            <SelectItem value="high">Alto</SelectItem>
            <SelectItem value="medium">Medio</SelectItem>
            <SelectItem value="low">Baixo</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterScope} onValueChange={setFilterScope}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Escopo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Escopos</SelectItem>
            <SelectItem value="council">Conselho</SelectItem>
            <SelectItem value="committee">Comite</SelectItem>
            <SelectItem value="operation">Operacao</SelectItem>
            <SelectItem value="system">Sistema</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Nome do Prompt</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Agente/Copiloto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Impacto</TableHead>
              <TableHead>Escopo</TableHead>
              <TableHead>Versao</TableHead>
              <TableHead>Responsavel</TableHead>
              <TableHead className="text-right">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrompts.map(prompt => {
              const agent = getAgentForCategory(prompt.category);
              const impactStyle = getImpactBadge(prompt.impact_level);
              
              return (
                <TableRow 
                  key={prompt.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handlePromptSelect(prompt.id)}
                >
                  <TableCell className="font-medium">
                    {getCategoryLabel(prompt.category)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStrategicTypeBadge(prompt.strategic_type)}>
                      {getStrategicTypeLabel(prompt.strategic_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{agent?.name || '-'}</TableCell>
                  <TableCell>{getStatusBadge(prompt.status)}</TableCell>
                  <TableCell>
                    <Badge className={cn(impactStyle.bg, impactStyle.text, "border-0")}>
                      {impactStyle.icon}
                      <span className="ml-1">{getImpactLabel(prompt.impact_level)}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getScopeLabel(prompt.scope)}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">v{prompt.version}</TableCell>
                  <TableCell>{prompt.owner || '-'}</TableCell>
                  <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditPrompt(prompt.id);
                                  }}>
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <GitBranch className="h-4 w-4 mr-2" />
                          Versionar
                        </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Archive className="h-4 w-4 mr-2" />
                          Desativar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <History className="h-4 w-4 mr-2" />
                          Auditar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
                            </div>
  );

  // ============================================
  // RENDER: TAB - AUDIT
  // ============================================

  const renderAuditTab = () => (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historico de Versoes
              </CardTitle>
              <CardDescription>
                Auditoria completa de alteracoes em prompts
                            </CardDescription>
                            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Log
            </Button>
                            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prompt</TableHead>
                <TableHead>Versao</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Alteracoes</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVersionHistory.map(version => {
                const prompt = prompts?.find(p => p.id === version.promptId);
                return (
                  <TableRow key={version.id}>
                    <TableCell className="font-medium">
                      {prompt ? getCategoryLabel(prompt.category) : version.promptId}
                    </TableCell>
                    <TableCell className="font-mono text-sm">v{version.version}</TableCell>
                    <TableCell>{version.author}</TableCell>
                    <TableCell>{new Date(version.date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{version.reason}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">
                      {version.changes}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                            </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
                          </CardContent>
                        </Card>
                    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="AI Engine" />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Strategic Header with KPIs */}
          {renderStrategicHeader()}

          {/* Navigation Tabs */}
          <div className="border-b bg-card">
            <div className="px-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="h-12 bg-transparent gap-2 p-0">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Visao Geral
                  </TabsTrigger>
                  <TabsTrigger 
                    value="agents" 
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Agentes de IA
                  </TabsTrigger>
                  <TabsTrigger 
                    value="copilots" 
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Copilotos
                  </TabsTrigger>
                  <TabsTrigger 
                    value="services" 
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4"
                  >
                    <Settings2 className="h-4 w-4 mr-2" />
                    Servicos
                  </TabsTrigger>
                  <TabsTrigger 
                    value="library" 
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Biblioteca de Prompts
                  </TabsTrigger>
                  <TabsTrigger 
                    value="audit" 
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4"
                  >
                    <History className="h-4 w-4 mr-2" />
                    Auditoria
                  </TabsTrigger>
                </TabsList>
              </Tabs>
                </div>
          </div>

          {/* Tab Content */}
          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : selectedPromptId ? (
              <PromptDetailView 
                promptId={selectedPromptId} 
                onEdit={() => handleEditPrompt(selectedPromptId)}
                onRefresh={refetch}
                onBack={() => setSelectedPromptId(null)}
              />
            ) : (
              <>
                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'agents' && renderAgentsTab()}
                {activeTab === 'copilots' && renderCopilotsTab()}
                {activeTab === 'services' && renderServicesTab()}
                {activeTab === 'library' && renderLibraryTab()}
                {activeTab === 'audit' && renderAuditTab()}
              </>
            )}
          </ScrollArea>
        </div>

        {/* Prompt Editor Modal */}
        <PromptEditor
          open={editorOpen}
          onClose={handleEditorClose}
          promptId={selectedPromptId}
        />
      </div>

      {/* Tagline */}
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground italic opacity-60">
        "Quem governa os prompts, governa as decisoes."
      </div>
    </div>
  );
}
