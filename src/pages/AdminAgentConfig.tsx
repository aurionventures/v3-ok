import { useState } from "react";
import { 
  Settings, 
  Bot, 
  Check, 
  AlertCircle, 
  Shield, 
  Users, 
  BookOpen, 
  Leaf, 
  Edit, 
  Save,
  Sparkles,
  Target,
  Zap,
  FileText,
  Brain,
  TrendingUp,
  Eye,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { 
  aiAgents, 
  aiCopilots,
  aiServices,
  getEngineStats,
} from "@/data/aiEngineData";
import type { AIAgent } from "@/types/aiArchitecture";
import { Link } from "react-router-dom";

// Mapeamento de ícones
const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Target,
  Zap,
  FileText,
  Brain,
  TrendingUp,
  Bot,
  Shield,
  Users,
  BookOpen,
  Leaf,
};

// Opções de modelo
const modelOptions = [
  { value: "google/gemini-3-flash-preview", label: "Gemini 3 Flash Preview" },
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-4", label: "GPT-4" },
  { value: "claude-3-opus", label: "Claude 3 Opus" },
  { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
];

// ============================================================================
// COMPONENTES
// ============================================================================

interface AgentConfigCardProps {
  agent: AIAgent;
  onEdit: () => void;
  onViewPrompts: () => void;
}

function AgentConfigCard({ agent, onEdit, onViewPrompts }: AgentConfigCardProps) {
  const Icon = iconMap[agent.icon] || Sparkles;
  const [isEnabled, setIsEnabled] = useState(agent.status === 'active');
  
  const handleToggle = () => {
    setIsEnabled(!isEnabled);
    toast({
      title: isEnabled ? "Agente desativado" : "Agente ativado",
      description: `${agent.name} foi ${isEnabled ? 'desativado' : 'ativado'} com sucesso.`,
    });
  };

  return (
    <Card className="border-l-4" style={{ borderLeftColor: agent.color }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${agent.color}15` }}
            >
              <Icon className="h-6 w-6" style={{ color: agent.color }} />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <span style={{ color: agent.color }}>{agent.name}</span>
                <Badge variant="outline" className="text-xs">
                  {agent.code}
                </Badge>
              </CardTitle>
              <CardDescription>{agent.shortName}</CardDescription>
            </div>
          </div>
          <Switch 
            checked={isEnabled} 
            onCheckedChange={handleToggle}
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{agent.description}</p>
        
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant="outline"
            className={cn(
              agent.impactLevel === 'critical' && 'bg-red-50 text-red-700 border-red-200',
              agent.impactLevel === 'high' && 'bg-amber-50 text-amber-700 border-amber-200',
              agent.impactLevel === 'medium' && 'bg-blue-50 text-blue-700 border-blue-200'
            )}
          >
            {agent.impactLevel === 'critical' ? 'Impacto Critico' : 
             agent.impactLevel === 'high' ? 'Impacto Alto' : 'Impacto Medio'}
          </Badge>
          <Badge variant="secondary">
            {agent.scope === 'council' ? 'Conselho' : 
             agent.scope === 'system' ? 'Sistema' : 'Organizacao'}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {agent.prompts.length} prompts
          </Badge>
        </div>
        
        {/* Prompts Preview */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase">Prompts</p>
          {agent.prompts.map(prompt => (
            <div 
              key={prompt.id}
              className="flex items-center justify-between p-2 rounded bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <Badge 
                  className={cn(
                    "h-5 w-5 p-0 flex items-center justify-center text-[10px]",
                    prompt.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  )}
                >
                  ✓
                </Badge>
                <span className="text-sm">{prompt.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    prompt.impactLevel === 'critical' && 'bg-red-50 text-red-700',
                    prompt.impactLevel === 'high' && 'bg-amber-50 text-amber-700'
                  )}
                >
                  {prompt.impactLevel === 'critical' ? 'Critico' : 'Alto'}
                </Badge>
                <span className="text-xs text-muted-foreground">v{prompt.version}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Métricas */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t">
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: agent.color }}>
              {agent.metrics.totalExecutions}
            </p>
            <p className="text-xs text-muted-foreground">Execucoes</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: agent.color }}>
              {agent.metrics.successRate.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">Sucesso</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: agent.color }}>
              {(agent.metrics.avgLatencyMs / 1000).toFixed(1)}s
            </p>
            <p className="text-xs text-muted-foreground">Latencia</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: agent.color }}>
              {agent.metrics.avgQualityScore.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">Qualidade</p>
          </div>
        </div>
        
        {/* Ações */}
        <div className="flex gap-2 pt-3 border-t">
          <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={onViewPrompts}>
            <Eye className="h-4 w-4 mr-2" />
            Ver Prompts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CopilotConfigCard({ copilot }: { copilot: typeof aiCopilots[0] }) {
  const Icon = iconMap[copilot.icon] || Brain;
  const [isEnabled, setIsEnabled] = useState(copilot.status === 'active');
  
  const connectedAgentNames = copilot.agents.map(agentId => {
    const agent = aiAgents.find(a => a.id === agentId);
    return agent?.name || agentId;
  });
  
  const handleToggle = () => {
    setIsEnabled(!isEnabled);
    toast({
      title: isEnabled ? "Copiloto desativado" : "Copiloto ativado",
      description: `${copilot.name} foi ${isEnabled ? 'desativado' : 'ativado'} com sucesso.`,
    });
  };

  return (
    <Card className="border-l-4" style={{ borderLeftColor: copilot.color }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className={cn(
                "p-3 rounded-xl",
                copilot.gradient && `bg-gradient-to-br ${copilot.gradient}`
              )}
              style={!copilot.gradient ? { backgroundColor: `${copilot.color}20` } : undefined}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{copilot.name}</CardTitle>
              <CardDescription>{copilot.description}</CardDescription>
            </div>
          </div>
          <Switch 
            checked={isEnabled} 
            onCheckedChange={handleToggle}
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{copilot.executiveDescription}</p>
        
        <div className="flex gap-2">
          <Badge variant="secondary">
            {copilot.scope === 'council' ? 'Conselho' : 'Sistema'}
          </Badge>
          <Badge variant="outline">v{copilot.version}</Badge>
        </div>
        
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
            Agentes Conectados
          </p>
          <div className="flex flex-wrap gap-1">
            {connectedAgentNames.map((name, i) => (
              <Badge key={i} className="bg-primary/10 text-primary">
                {name}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 pt-3 border-t">
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: copilot.color }}>
              {copilot.metrics.totalUsage}
            </p>
            <p className="text-xs text-muted-foreground">Uso Total</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: copilot.color }}>
              {(copilot.metrics.avgResponseTime / 1000).toFixed(1)}s
            </p>
            <p className="text-xs text-muted-foreground">Resp. Media</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: copilot.color }}>
              {copilot.metrics.userSatisfaction.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">Satisfacao</p>
          </div>
        </div>
        
        <Link to="/governance-copilot">
          <Button variant="outline" size="sm" className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir Copiloto
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function ServiceConfigCard({ service }: { service: typeof aiServices[0] }) {
  const [isEnabled, setIsEnabled] = useState(service.status === 'active');
  
  const handleToggle = () => {
    setIsEnabled(!isEnabled);
    toast({
      title: isEnabled ? "Servico desativado" : "Servico ativado",
      description: `${service.name} foi ${isEnabled ? 'desativado' : 'ativado'} com sucesso.`,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="font-semibold">{service.name}</h4>
            <p className="text-sm text-muted-foreground">{service.description}</p>
          </div>
          <Switch 
            checked={isEnabled} 
            onCheckedChange={handleToggle}
          />
        </div>
        
        <div className="flex gap-2 mb-4">
          <Badge variant="outline">{service.category}</Badge>
          <Badge variant="secondary">{service.model}</Badge>
        </div>
        
        <div className="grid grid-cols-4 gap-2 pt-3 border-t">
          <div className="text-center">
            <p className="text-sm font-bold">{service.metrics.totalExecutions}</p>
            <p className="text-xs text-muted-foreground">Execucoes</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold">{service.metrics.successRate}%</p>
            <p className="text-xs text-muted-foreground">Sucesso</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold">{service.metrics.avgLatencyMs}ms</p>
            <p className="text-xs text-muted-foreground">Latencia</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold">{service.metrics.avgQualityScore}</p>
            <p className="text-xs text-muted-foreground">Qualidade</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const AdminAgentConfig = () => {
  const stats = getEngineStats();
  const [activeTab, setActiveTab] = useState("agents");
  const [searchTerm, setSearchTerm] = useState("");
  const [impactFilter, setImpactFilter] = useState("all");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPromptsDialog, setShowPromptsDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  
  // Configurações editáveis
  const [editConfig, setEditConfig] = useState({
    temperature: 0.7,
    maxTokens: 4096,
    model: "google/gemini-3-flash-preview",
  });
  
  // Filtrar agentes
  const filteredAgents = aiAgents.filter(agent => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesImpact = 
      impactFilter === "all" || agent.impactLevel === impactFilter;
      
    return matchesSearch && matchesImpact;
  });
  
  const handleEditAgent = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setEditConfig({
      temperature: 0.7,
      maxTokens: 4096,
      model: "google/gemini-3-flash-preview",
    });
    setShowEditDialog(true);
  };

  const handleViewPrompts = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setShowPromptsDialog(true);
  };
  
  const handleSaveConfig = () => {
    toast({
      title: "Configuracao salva",
      description: `As configuracoes do ${selectedAgent?.name} foram atualizadas.`,
    });
    setShowEditDialog(false);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Configuracao de Agentes" />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Stats */}
          <div className="flex items-center justify-end mb-6">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.totalAgents}</p>
                <p className="text-xs text-muted-foreground">Agentes Ativos</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.totalPrompts}</p>
                <p className="text-xs text-muted-foreground">Prompts</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{stats.avgSuccessRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Taxa de Sucesso</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="copilots" className="gap-2">
                <Brain className="h-4 w-4" />
                Copilotos ({aiCopilots.length})
              </TabsTrigger>
              <TabsTrigger value="agents" className="gap-2">
                <Bot className="h-4 w-4" />
                Agentes de IA ({aiAgents.length})
              </TabsTrigger>
              <TabsTrigger value="services" className="gap-2">
                <Zap className="h-4 w-4" />
                Servicos ({aiServices.length})
              </TabsTrigger>
            </TabsList>
            
            {/* Tab Copilotos */}
            <TabsContent value="copilots">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiCopilots.map(copilot => (
                  <CopilotConfigCard key={copilot.id} copilot={copilot} />
                ))}
              </div>
            </TabsContent>
            
            {/* Tab Agentes */}
            <TabsContent value="agents" className="space-y-4">
              {/* Filtros */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar agente..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={impactFilter} onValueChange={setImpactFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Nivel de Impacto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Niveis</SelectItem>
                    <SelectItem value="critical">Critico</SelectItem>
                    <SelectItem value="high">Alto</SelectItem>
                    <SelectItem value="medium">Medio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Grid de Agentes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAgents.map(agent => (
                  <AgentConfigCard 
                    key={agent.id}
                    agent={agent}
                    onEdit={() => handleEditAgent(agent)}
                    onViewPrompts={() => handleViewPrompts(agent)}
                  />
                ))}
              </div>
            </TabsContent>
            
            {/* Tab Serviços */}
            <TabsContent value="services">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiServices.map(service => (
                  <ServiceConfigCard key={service.id} service={service} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Dialog de Edição */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurar {selectedAgent?.name}
                </DialogTitle>
                <DialogDescription>
                  Ajuste os parametros do modelo para este agente
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Modelo */}
                <div className="space-y-2">
                  <Label>Modelo de IA</Label>
                <Select
                    value={editConfig.model} 
                    onValueChange={(value) => setEditConfig({...editConfig, model: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                      {modelOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
                {/* Temperature */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Temperatura</Label>
                    <span className="text-sm text-muted-foreground">
                      {editConfig.temperature.toFixed(2)}
                    </span>
                </div>
                  <Slider
                    value={[editConfig.temperature]}
                    onValueChange={([value]) => setEditConfig({...editConfig, temperature: value})}
                    min={0}
                    max={1}
                    step={0.05}
                  />
                  <p className="text-xs text-muted-foreground">
                    Valores mais baixos = respostas mais focadas. Valores mais altos = mais criatividade.
                  </p>
              </div>
              
                {/* Max Tokens */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Max Tokens</Label>
                    <span className="text-sm text-muted-foreground">
                      {editConfig.maxTokens}
                    </span>
                  </div>
                  <Slider
                    value={[editConfig.maxTokens]}
                    onValueChange={([value]) => setEditConfig({...editConfig, maxTokens: value})}
                    min={1000}
                    max={8000}
                    step={500}
                  />
                  <p className="text-xs text-muted-foreground">
                    Limite maximo de tokens na resposta do modelo.
                  </p>
                </div>
              </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
                <Button onClick={handleSaveConfig}>
              <Save className="h-4 w-4 mr-2" />
                  Salvar Configuracao
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
          {/* Dialog de Prompts */}
          <Dialog open={showPromptsDialog} onOpenChange={setShowPromptsDialog}>
            <DialogContent className="max-w-2xl">
          <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Prompts do {selectedAgent?.name}
                </DialogTitle>
            <DialogDescription>
                  Visualize e gerencie os prompts deste agente
            </DialogDescription>
          </DialogHeader>
          
              <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-4">
                  {selectedAgent?.prompts.map(prompt => (
                    <Card key={prompt.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
              <div>
                            <h4 className="font-semibold">{prompt.name}</h4>
                            <p className="text-xs text-muted-foreground">ID: {prompt.id}</p>
              </div>
                          <div className="flex gap-2">
                            <Badge 
                              className={cn(
                                prompt.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                              )}
                            >
                              {prompt.status === 'active' ? 'Ativo' : 'Inativo'}
                            </Badge>
                            <Badge 
                              variant="outline"
                              className={cn(
                                prompt.impactLevel === 'critical' && 'bg-red-50 text-red-700',
                                prompt.impactLevel === 'high' && 'bg-amber-50 text-amber-700'
                              )}
                            >
                              {prompt.impactLevel === 'critical' ? 'Critico' : 'Alto'}
                            </Badge>
              </div>
            </div>
            
                        <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                          <div className="text-center">
                            <p className="text-lg font-bold">{prompt.metrics.executions}</p>
                            <p className="text-xs text-muted-foreground">Execucoes</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold">{prompt.metrics.successRate.toFixed(1)}%</p>
                            <p className="text-xs text-muted-foreground">Sucesso</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold">{prompt.metrics.avgQualityScore.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">Qualidade</p>
                          </div>
            </div>
            
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Prompt
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
            </div>
                      </CardContent>
                    </Card>
                  ))}
          </div>
              </ScrollArea>
          
          <DialogFooter>
                <Link to="/admin/prompts">
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir Biblioteca de Prompts
            </Button>
                </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </main>
      </div>
    </div>
  );
};

export default AdminAgentConfig;
