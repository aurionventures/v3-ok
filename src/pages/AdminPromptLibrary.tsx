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
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { PromptDetailView } from '@/components/admin/PromptDetailView';
import { PromptEditor } from '@/components/admin/PromptEditor';
import { usePrompts } from '@/hooks/usePrompts';

// Category configuration
const AGENT_CATEGORIES = [
  { 
    agent: 'Agent A', 
    label: 'Coleta & Classificação',
    categories: ['agent_a_collector', 'agent_a_classifier'],
    color: 'bg-blue-500'
  },
  { 
    agent: 'Agent B', 
    label: 'Análise & Padrões',
    categories: ['agent_b_analyzer', 'agent_b_pattern_detector'],
    color: 'bg-purple-500'
  },
  { 
    agent: 'Agent C', 
    label: 'Scoring & Priorização',
    categories: ['agent_c_scorer', 'agent_c_prioritizer'],
    color: 'bg-green-500'
  },
  { 
    agent: 'Agent D', 
    label: 'Geração de Conteúdo',
    categories: ['agent_d_agenda_generator', 'agent_d_briefing_generator'],
    color: 'bg-amber-500'
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
  };
  return labels[category] || category;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <CheckCircle2 className="h-3 w-3 text-green-500" />;
    case 'testing':
      return <AlertCircle className="h-3 w-3 text-yellow-500" />;
    case 'deprecated':
      return <Archive className="h-3 w-3 text-gray-500" />;
    default:
      return <Circle className="h-3 w-3 text-gray-400" />;
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
  const [expandedAgents, setExpandedAgents] = useState<string[]>(AGENT_CATEGORIES.map(a => a.agent));
  
  const { prompts, isLoading, refetch } = usePrompts();

  const toggleAgent = (agent: string) => {
    setExpandedAgents(prev => 
      prev.includes(agent) 
        ? prev.filter(a => a !== agent)
        : [...prev, agent]
    );
  };

  const filteredPrompts = prompts?.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getPromptsForCategories = (categories: string[]) => {
    return filteredPrompts.filter(p => categories.includes(p.category));
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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Configurador de Prompts de IA" />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Categories & Prompts List */}
          <div className="w-80 border-r border-border flex flex-col bg-card">
            <div className="p-4 border-b border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span className="font-semibold">MOAT Engine</span>
                </div>
                <Button size="sm" onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-1" />
                  Novo
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Agents & Prompts List */}
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {AGENT_CATEGORIES.map(agentConfig => {
                  const agentPrompts = getPromptsForCategories(agentConfig.categories);
                  const isExpanded = expandedAgents.includes(agentConfig.agent);
                  
                  return (
                    <div key={agentConfig.agent} className="space-y-1">
                      {/* Agent Header */}
                      <button
                        onClick={() => toggleAgent(agentConfig.agent)}
                        className="w-full flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${agentConfig.color}`} />
                          <span className="font-medium text-sm">{agentConfig.agent}</span>
                          <span className="text-xs text-muted-foreground">({agentConfig.label})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {agentPrompts.length}
                          </Badge>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </button>

                      {/* Prompts List */}
                      {isExpanded && (
                        <div className="ml-4 space-y-1">
                          {agentPrompts.length === 0 ? (
                            <p className="text-xs text-muted-foreground p-2">
                              Nenhum prompt encontrado
                            </p>
                          ) : (
                            agentPrompts.map(prompt => (
                              <button
                                key={prompt.id}
                                onClick={() => handlePromptSelect(prompt.id)}
                                className={`w-full text-left p-2 rounded-lg transition-colors ${
                                  selectedPromptId === prompt.id
                                    ? 'bg-primary/10 border border-primary/30'
                                    : 'hover:bg-accent'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(prompt.status)}
                                  <span className="text-sm font-medium truncate flex-1">
                                    {getCategoryLabel(prompt.category)}
                                  </span>
                                  {prompt.is_default && (
                                    <Badge variant="outline" className="text-[10px] px-1">
                                      Default
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">v{prompt.version}</span>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground truncate">
                                    {prompt.model}
                                  </span>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Stats Footer */}
            <div className="p-3 border-t border-border bg-muted/50">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Total: {prompts?.length || 0} prompts</span>
                <span>
                  {prompts?.filter(p => p.status === 'active').length || 0} ativos
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
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
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <Code className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">MOAT Engine Prompt Library</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Gerencie, versione e teste os prompts de IA dos 4 agentes do sistema MOAT.
                  Selecione um prompt na lista ou crie um novo.
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Novo Prompt
                </Button>
              </div>
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
