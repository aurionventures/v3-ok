import { useState, useMemo } from 'react';
import { 
  Code, 
  Plus, 
  Search, 
  Brain,
  CheckCircle2,
  AlertCircle,
  Archive,
  Bot,
  Settings2,
  Eye,
  Edit3,
  Copy,
  MoreVertical,
  Shield,
  Target,
  Users,
  LayoutDashboard,
  Layers,
  History,
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
  AlertTriangle
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
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { PromptDetailView } from '@/components/admin/PromptDetailView';
import { PromptEditor } from '@/components/admin/PromptEditor';
import { ClientPromptsList } from '@/components/admin/ClientPromptsList';
import { usePrompts, AIPrompt, StrategicType, ImpactLevel, PromptScope, AgentType } from '@/hooks/usePrompts';
import { cn } from '@/lib/utils';

// Import new componentized cards
import {
  KPICard,
  AgentCard,
  CriticalPromptsCard,
  RecentChangesCard,
  GovernanceMapCard,
  AGENT_CONFIGS as NEW_AGENT_CONFIGS,
  KPI_CONFIGS,
  getVariantStyles,
  getImpactConfig,
  getStatusConfig,
  type ImpactLevel as AIImpactLevel,
  type ColorVariant,
} from '@/components/admin/ai-engine';

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
    variant: 'primary' as ColorVariant,
  },
  { 
    id: 'agent_b',
    name: 'Agent B', 
    label: 'Analise & Padroes',
    description: 'Analisa historico de governanca e detecta padroes de recorrencia',
    function: 'Memoria Institucional',
    categories: ['agent_b_analyzer', 'agent_b_pattern_detector'],
    variant: 'warning' as ColorVariant,
  },
  { 
    id: 'agent_c',
    name: 'Agent C', 
    label: 'Scoring & Priorizacao',
    description: 'Calcula priority scores e prioriza temas para agenda do conselho',
    function: 'Priorizacao Estrategica',
    categories: ['agent_c_scorer', 'agent_c_prioritizer'],
    variant: 'success' as ColorVariant,
  },
  { 
    id: 'agent_d',
    name: 'Agent D', 
    label: 'Geracao de Conteudo',
    description: 'Gera pautas estruturadas e briefings personalizados',
    function: 'Producao de Documentos',
    categories: ['agent_d_agenda_generator', 'agent_d_briefing_generator'],
    variant: 'accent' as ColorVariant,
  },
  { 
    id: 'agent_e',
    name: 'Agent E', 
    label: 'Analise de Governanca',
    description: 'Analisa documentos e entrevistas para diagnostico de governanca',
    function: 'Diagnostico Inicial',
    categories: ['agent_e_doc_analyzer', 'agent_e_interview_analyzer', 'agent_e_incongruence_detector', 'agent_e_action_planner'],
    variant: 'info' as ColorVariant,
  },
  { 
    id: 'agent_f',
    name: 'Agent F', 
    label: 'Secretariado Inteligente',
    description: 'Busca inteligente em documentos e ATAs com compreensao contextual',
    function: 'Busca e Consulta',
    categories: ['agent_f_search_intent', 'agent_f_search_response'],
    variant: 'accent' as ColorVariant,
  },
  { 
    id: 'agent_g',
    name: 'Agent G', 
    label: 'Geracao de ATAs',
    description: 'Gera ATAs formais e profissionais a partir de dados de reunioes',
    function: 'Documentacao',
    categories: ['agent_g_ata_generator'],
    variant: 'success' as ColorVariant,
  },
  { 
    id: 'agent_h',
    name: 'Agent H', 
    label: 'Insights Preditivos',
    description: 'Gera insights estrategicos de governanca (riscos, ameacas, oportunidades)',
    function: 'Analise Preditiva',
    categories: ['agent_h_governance_insights'],
    variant: 'warning' as ColorVariant,
  },
  { 
    id: 'agent_i',
    name: 'Agent I', 
    label: 'Desenvolvimento Individual',
    description: 'Gera PDIs personalizados para membros de conselhos',
    function: 'Desenvolvimento de Pessoas',
    categories: ['agent_i_pdi_generator'],
    variant: 'info' as ColorVariant,
  },
  { 
    id: 'agent_j',
    name: 'Agent J', 
    label: 'Processamento de Documentos',
    description: 'Processa e analisa documentos corporativos extraindo entidades e historico',
    function: 'Processamento de Dados',
    categories: ['agent_j_doc_processor', 'agent_j_governance_extractor'],
    variant: 'primary' as ColorVariant,
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
    strategic: 'bg-primary/10 text-primary border-primary/20',
    governance: 'bg-accent/50 text-accent-foreground border-accent/30',
    operational: 'bg-muted/50 text-muted-foreground border-muted/30'
  };
  return styles[type] || 'bg-muted/50 text-muted-foreground';
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
  const config = getImpactConfig(impact as AIImpactLevel);
  const styles = getVariantStyles(config.variant);
  const icons: Record<ImpactLevel, React.ReactNode> = {
    critical: <AlertTriangle className="h-3 w-3" />,
    high: <ArrowUpRight className="h-3 w-3" />,
    medium: <CircleDot className="h-3 w-3" />,
    low: <ArrowDownRight className="h-3 w-3" />
  };
  return { ...styles, icon: icons[impact] };
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
  const config = getStatusConfig(status as 'active' | 'inactive' | 'beta' | 'deprecated');
  const styles = getVariantStyles(config.variant);
  
  switch (status) {
    case 'active':
      return <Badge className={cn(styles.bg, styles.text, styles.border)}>Ativo</Badge>;
    case 'testing':
      return <Badge className={cn('bg-warning/10 text-warning border-warning/20')}>Teste</Badge>;
    case 'deprecated':
      return <Badge className={cn(styles.bg, styles.text, styles.border)}>Depreciado</Badge>;
    default:
      return <Badge className={cn('bg-info/10 text-info border-info/20')}>Rascunho</Badge>;
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
    'agent_e_doc_analyzer': 'Document Analyzer',
    'agent_e_interview_analyzer': 'Interview Analyzer',
    'agent_e_incongruence_detector': 'Incongruence Detector',
    'agent_e_action_planner': 'Action Planner',
    'agent_f_search_intent': 'Search Intent',
    'agent_f_search_response': 'Search Response',
    'agent_g_ata_generator': 'ATA Generator',
    'agent_h_governance_insights': 'Governance Insights',
    'agent_i_pdi_generator': 'PDI Generator',
    'agent_j_doc_processor': 'Document Processor',
    'agent_j_governance_extractor': 'Governance Extractor',
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
    <div className="bg-background border-b">
      <div className="px-6 py-6">
        {/* KPI Cards - Using new componentized cards */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard 
            title="Total Prompts" 
            value={stats.total} 
            icon={Code} 
            variant="primary" 
          />
          <KPICard 
            title="Ativos" 
            value={stats.active} 
            icon={CheckCircle2} 
            variant="success" 
          />
          <KPICard 
            title="Críticos" 
            value={stats.critical} 
            icon={AlertTriangle} 
            variant="destructive" 
          />
          <KPICard 
            title="Agentes" 
            value={AGENT_CONFIGS.length} 
            icon={Bot} 
            variant="accent" 
          />
        </div>
      </div>
    </div>
  );

  // ============================================
  // RENDER: TAB - OVERVIEW
  // ============================================

  const renderOverviewTab = () => {
    // Prepare data for CriticalPromptsCard
    const criticalPromptsData = criticalPrompts.slice(0, 5).map(prompt => ({
      id: prompt.id,
      name: getCategoryLabel(prompt.category),
      agentName: getAgentForCategory(prompt.category)?.name || '',
      impactLevel: prompt.impact_level as AIImpactLevel,
      version: prompt.version
    }));

    // Prepare data for RecentChangesCard
    const recentChangesData = recentChanges.map(prompt => ({
      id: prompt.id,
      name: getCategoryLabel(prompt.category),
      agentName: getAgentForCategory(prompt.category)?.name || '',
      changeType: 'updated' as const,
      timestamp: new Date(prompt.updated_at).toLocaleDateString('pt-BR'),
      version: prompt.version
    }));

    return (
      <div className="p-6 space-y-6">
        {/* Governance Map */}
        <GovernanceMapCard 
          agentsCount={AGENT_CONFIGS.length}
          servicesCount={SERVICE_CONFIGS.length}
        />

        {/* Agent Cards Grid */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-primary" />
              Agentes de IA
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
                const activeCount = agentPrompts.filter(p => p.status === 'active').length;
                const agentConfig = NEW_AGENT_CONFIGS.find(a => a.id === agent.id);
                const Icon = agentConfig?.icon || Bot;
                
                return (
                  <AgentCard
                    key={agent.id}
                    code={agentConfig?.code || agent.id.split('_')[1].toUpperCase()}
                    name={agent.function}
                    shortName={agent.name}
                    description={agent.description}
                    icon={Icon}
                    variant={agent.variant}
                    criticalCount={criticalCount}
                    activeCount={activeCount}
                    isSelected={selectedAgent === agent.id}
                    onClick={() => {
                      setActiveTab('agents');
                      setSelectedAgent(agent.id);
                    }}
                    prompts={agentPrompts.map(p => ({
                      id: p.id,
                      name: getCategoryLabel(p.category),
                      impactLevel: p.impact_level as AIImpactLevel
                    }))}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          {/* Critical Prompts - Using new component */}
          <CriticalPromptsCard
            prompts={criticalPromptsData}
            onPromptClick={handlePromptSelect}
            onViewAll={() => setActiveTab('library')}
          />

          {/* Recent Changes - Using new component */}
          <RecentChangesCard
            changes={recentChangesData}
            onChangeClick={handlePromptSelect}
            onViewAll={() => setActiveTab('audit')}
          />
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card className="border-warning/30 bg-warning/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertCircle className="h-5 w-5" />
                Alertas de Governanca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alerts.map((alert, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded bg-warning/10">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <p className="text-sm text-warning">{alert.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

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
          const agentConfig = NEW_AGENT_CONFIGS.find(a => a.id === agent.id);
          const Icon = agentConfig?.icon || Bot;
          const styles = getVariantStyles(agent.variant);
          
          return (
            <Card 
              key={agent.id}
              className={cn(
                "transition-all hover:shadow-lg cursor-pointer border-2",
                selectedAgent === agent.id && "ring-2 ring-primary",
                styles.border
              )}
              onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
            >
              <CardHeader className={cn("rounded-t-lg", styles.bg)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-3 rounded-xl", styles.bg, "border", styles.border)}>
                      <Icon className={cn("h-6 w-6", styles.text)} />
                    </div>
                    <div>
                      <CardTitle className={cn("text-xl", styles.text)}>{agent.name}</CardTitle>
                      <CardDescription className="text-sm">{agent.label}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {criticalCount > 0 && (
                      <Badge className="bg-destructive text-destructive-foreground">{criticalCount} Critico</Badge>
                    )}
                    <Badge variant="outline" className={cn("border-2", styles.border, styles.text)}>
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
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
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
                            prompt.status === 'active' ? 'text-success' : 'text-muted-foreground'
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
  // RENDER: TAB - SERVICES
  // ============================================

  const renderServicesTab = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICE_CONFIGS.map(service => {
          const servicePrompts = filteredPrompts.filter(p => service.prompts.includes(p.category));
          const Icon = service.icon;
          
          return (
            <Card key={service.id} className="hover:shadow-md transition-all bg-card/50">
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
      <Card className="bg-card/50">
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
      <Card className="bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico de Versões
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
                <TableHead>Versão</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Alterações</TableHead>
                <TableHead className="text-right">Ações</TableHead>
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
                <TabsList className="h-12">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Visao Geral
                  </TabsTrigger>
                  <TabsTrigger value="agents" className="data-[state=active]:bg-primary/10">
                    <Bot className="h-4 w-4 mr-2" />
                    Agentes de IA
                  </TabsTrigger>
                  <TabsTrigger value="services" className="data-[state=active]:bg-primary/10">
                    <Settings2 className="h-4 w-4 mr-2" />
                    Servicos
                  </TabsTrigger>
                  <TabsTrigger value="library" className="data-[state=active]:bg-primary/10">
                    <Code className="h-4 w-4 mr-2" />
                    Biblioteca de Prompts
                  </TabsTrigger>
                  <TabsTrigger value="clients" className="data-[state=active]:bg-primary/10">
                    <Building2 className="h-4 w-4 mr-2" />
                    Prompts por Cliente
                  </TabsTrigger>
                  <TabsTrigger value="audit" className="data-[state=active]:bg-primary/10">
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
                {activeTab === 'services' && renderServicesTab()}
                {activeTab === 'library' && renderLibraryTab()}
                {activeTab === 'clients' && (
                  <div className="p-6">
                    <ClientPromptsList 
                      agentCategory={selectedAgent ? AGENT_CONFIGS.find(a => a.id === selectedAgent)?.categories[0] : undefined}
                      agentName={selectedAgent ? AGENT_CONFIGS.find(a => a.id === selectedAgent)?.name : undefined}
                      basePrompt={prompts?.find(p => p.category === (selectedAgent ? AGENT_CONFIGS.find(a => a.id === selectedAgent)?.categories[0] : ''))?.system_prompt}
                    />
                  </div>
                )}
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
