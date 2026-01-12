import { useState } from 'react';
import { 
  Code, 
  Plus, 
  Search, 
  Brain,
  ChevronDown,
  ChevronRight,
  Circle,
  CheckCircle2,
  AlertCircle,
  Archive,
  Sparkles,
  Cpu,
  Zap,
  FileText,
  Settings2,
  Play,
  Copy,
  MoreVertical,
  Eye,
  Edit3,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { usePrompts } from '@/hooks/usePrompts';

// Agent configuration with enhanced metadata
const AGENT_CATEGORIES = [
  { 
    id: 'agent_a',
    agent: 'Agent A', 
    label: 'Coleta & Classificação',
    description: 'Coleta sinais externos e classifica informações relevantes',
    categories: ['agent_a_collector', 'agent_a_classifier'],
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    icon: Sparkles
  },
  { 
    id: 'agent_b',
    agent: 'Agent B', 
    label: 'Análise & Padrões',
    description: 'Analisa dados e detecta padrões de governança',
    categories: ['agent_b_analyzer', 'agent_b_pattern_detector'],
    color: 'bg-purple-500',
    textColor: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    icon: Cpu
  },
  { 
    id: 'agent_c',
    agent: 'Agent C', 
    label: 'Scoring & Priorização',
    description: 'Pontua e prioriza itens para a agenda',
    categories: ['agent_c_scorer', 'agent_c_prioritizer'],
    color: 'bg-green-500',
    textColor: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    icon: Zap
  },
  { 
    id: 'agent_d',
    agent: 'Agent D', 
    label: 'Geração de Conteúdo',
    description: 'Gera pautas, briefings e documentos',
    categories: ['agent_d_agenda_generator', 'agent_d_briefing_generator'],
    color: 'bg-amber-500',
    textColor: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    icon: FileText
  },
  { 
    id: 'copilot',
    agent: 'Copiloto', 
    label: 'Insights Preditivos',
    description: 'Integra Agent A + B para gerar insights de governança para clientes',
    categories: ['agent_copilot_insights'],
    color: 'bg-indigo-500',
    textColor: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    icon: Brain
  },
  { 
    id: 'system_services',
    agent: 'Servicos', 
    label: 'Servicos do Sistema',
    description: 'Prompts de servicos auxiliares do sistema (PDI, Busca, Insights)',
    categories: ['pdi_generator', 'secretariat_search_intent', 'secretariat_search_response', 'predictive_insights_edge'],
    color: 'bg-slate-500',
    textColor: 'text-slate-500',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/30',
    icon: Settings2
  },
];

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
    // System Services
    'pdi_generator': 'PDI Generator',
    'secretariat_search_intent': 'Secretariat Search - Intent',
    'secretariat_search_response': 'Secretariat Search - Response',
    'predictive_insights_edge': 'Predictive Insights (Edge)',
  };
  return labels[category] || category;
};

const getCategoryDescription = (category: string) => {
  const descriptions: Record<string, string> = {
    'agent_a_collector': 'Coleta dados de fontes externas e internas',
    'agent_a_classifier': 'Classifica e categoriza informações coletadas',
    'agent_b_analyzer': 'Analisa dados para extrair insights',
    'agent_b_pattern_detector': 'Detecta padrões e anomalias nos dados',
    'agent_c_scorer': 'Calcula scores de relevância e urgência',
    'agent_c_prioritizer': 'Ordena e prioriza itens para decisão',
    'agent_d_agenda_generator': 'Gera pautas automaticas para reunioes',
    'agent_d_briefing_generator': 'Cria briefings executivos e relatorios',
    'agent_copilot_insights': 'Gera insights preditivos de governanca usando Agent A + B',
    // System Services
    'pdi_generator': 'Gera Planos de Desenvolvimento Individual para membros',
    'secretariat_search_intent': 'Extrai intencao de busca do usuario',
    'secretariat_search_response': 'Gera respostas conversacionais para buscas',
    'predictive_insights_edge': 'Gera insights preditivos via edge function',
  };
  return descriptions[category] || '';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'testing':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'deprecated':
      return <Archive className="h-4 w-4 text-gray-500" />;
    default:
      return <Circle className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>;
    case 'testing':
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Teste</Badge>;
    case 'deprecated':
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Depreciado</Badge>;
    default:
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Rascunho</Badge>;
  }
};

export default function AdminPromptLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeAgent, setActiveAgent] = useState('agent_a');
  
  const { prompts, isLoading, refetch } = usePrompts();

  const filteredPrompts = prompts?.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getPromptsForAgent = (agentId: string) => {
    const agentConfig = AGENT_CATEGORIES.find(a => a.id === agentId);
    if (!agentConfig) return [];
    return filteredPrompts.filter(p => agentConfig.categories.includes(p.category));
  };

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

  const currentAgentConfig = AGENT_CATEGORIES.find(a => a.id === activeAgent);
  const currentAgentPrompts = getPromptsForAgent(activeAgent);
  const AgentIcon = currentAgentConfig?.icon || Brain;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="AI Engine" />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation - Agent Tabs */}
          <div className="border-b border-border bg-card">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">MOAT Engine</h1>
                    <p className="text-sm text-muted-foreground">
                      Gerencie os prompts de IA dos 4 agentes do sistema
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar prompts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button onClick={handleCreateNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Prompt
                  </Button>
                </div>
              </div>

              {/* Agent Tabs */}
              <Tabs value={activeAgent} onValueChange={setActiveAgent}>
                <TabsList className="h-auto p-1 bg-muted/50 gap-1">
                  {AGENT_CATEGORIES.map(agent => {
                    const Icon = agent.icon;
                    const agentPrompts = getPromptsForAgent(agent.id);
                    const activeCount = agentPrompts.filter(p => p.status === 'active').length;
                    
                    return (
                      <TabsTrigger
                        key={agent.id}
                        value={agent.id}
                        className={`flex items-center gap-2 px-4 py-2.5 data-[state=active]:${agent.bgColor} data-[state=active]:${agent.textColor} data-[state=active]:shadow-sm`}
                      >
                        <div className={`w-2 h-2 rounded-full ${agent.color}`} />
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{agent.agent}</span>
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {agentPrompts.length}
                        </Badge>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
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
              <ScrollArea className="h-full">
                <div className="p-6">
                  {/* Agent Info Header */}
                  <div className={`rounded-xl p-6 mb-6 ${currentAgentConfig?.bgColor} border ${currentAgentConfig?.borderColor}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${currentAgentConfig?.color}`}>
                          <AgentIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className={`text-2xl font-bold ${currentAgentConfig?.textColor}`}>
                            {currentAgentConfig?.agent}
                          </h2>
                          <p className="text-lg text-muted-foreground">
                            {currentAgentConfig?.label}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {currentAgentConfig?.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{currentAgentPrompts.length}</div>
                          <div className="text-muted-foreground">Prompts</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">
                            {currentAgentPrompts.filter(p => p.status === 'active').length}
                          </div>
                          <div className="text-muted-foreground">Ativos</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prompts Grid */}
                  {currentAgentPrompts.length === 0 ? (
                    <Card className="border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <Code className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          Nenhum prompt encontrado
                        </h3>
                        <p className="text-muted-foreground text-center max-w-md mb-6">
                          {searchQuery 
                            ? `Nenhum prompt corresponde à busca "${searchQuery}"`
                            : `Crie o primeiro prompt para ${currentAgentConfig?.agent}`
                          }
                        </p>
                        <Button onClick={handleCreateNew}>
                          <Plus className="h-4 w-4 mr-2" />
                          Criar Prompt
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentAgentPrompts.map(prompt => (
                        <Card 
                          key={prompt.id}
                          className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${
                            selectedPromptId === prompt.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => handlePromptSelect(prompt.id)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(prompt.status)}
                                <CardTitle className="text-base">
                                  {getCategoryLabel(prompt.category)}
                                </CardTitle>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handlePromptSelect(prompt.id);
                                  }}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Visualizar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditPrompt(prompt.id);
                                  }}>
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Play className="h-4 w-4 mr-2" />
                                    Testar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <CardDescription className="text-xs mt-1">
                              {getCategoryDescription(prompt.category)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between mb-3">
                              {getStatusBadge(prompt.status)}
                              {prompt.is_default && (
                                <Badge variant="outline" className="text-xs">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Code className="h-3 w-3" />
                                v{prompt.version}
                              </span>
                              <span className="truncate">{prompt.model}</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-border">
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {prompt.system_prompt?.substring(0, 100)}...
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        {/* Prompt Editor Modal */}
        <PromptEditor
          open={editorOpen}
          onClose={handleEditorClose}
          promptId={selectedPromptId}
        />
      </div>
    </div>
  );
}
