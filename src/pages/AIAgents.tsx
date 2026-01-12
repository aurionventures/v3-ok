import { useState } from "react";
import { 
  Settings, 
  Play, 
  Sparkles,
  Save,
  Bot,
  MessageCircle,
  Zap,
  BarChart3,
  CheckCircle2,
  Target,
  FileText,
  Brain,
  TrendingUp,
  Eye,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  aiAgents, 
  aiCopilots, 
  getEngineStats,
  type AIAgent 
} from "@/data/aiEngineData";

// Mapeamento de ícones
const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Target,
  Zap,
  FileText,
  Brain,
  TrendingUp,
  Bot,
};

// ============================================================================
// COMPONENTES
// ============================================================================

interface AgentCardProps {
  agent: AIAgent;
  onConfigure: () => void;
  onExecute: () => void;
}

const AgentCard = ({ agent, onConfigure, onExecute }: AgentCardProps) => {
  const Icon = iconMap[agent.icon] || Sparkles;
  
  return (
    <Card className="border-t-4 h-full flex flex-col" style={{ borderTopColor: agent.color }}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${agent.color}15` }}
            >
              <Icon className="h-6 w-6" style={{ color: agent.color }} />
            </div>
            <div>
              <CardTitle className="text-lg" style={{ color: agent.color }}>
                {agent.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{agent.shortName}</p>
              <div className="flex gap-1 mt-1">
                <Badge 
                  variant={agent.status === "active" ? "default" : "outline"}
                  className="text-xs"
                >
                  {agent.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    agent.impactLevel === 'critical' && 'bg-red-50 text-red-700 border-red-200',
                    agent.impactLevel === 'high' && 'bg-amber-50 text-amber-700 border-amber-200'
                  )}
                >
                  {agent.impactLevel === 'critical' ? 'Critico' : 'Alto'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="mt-3">{agent.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        {/* Capacidades */}
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-primary" />
            Capacidades
          </h4>
          <ul className="space-y-1.5">
            {agent.capabilities.slice(0, 3).map((cap, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
                <span>{cap}</span>
              </li>
            ))}
            {agent.capabilities.length > 3 && (
              <li className="text-xs text-muted-foreground pl-5">
                +{agent.capabilities.length - 3} mais capacidades
              </li>
            )}
          </ul>
        </div>
        
        {/* Prompts */}
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
            <FileText className="h-4 w-4 text-purple-500" />
            Prompts ({agent.prompts.length})
          </h4>
          <div className="space-y-1">
            {agent.prompts.map((prompt) => (
              <div 
                key={prompt.id} 
                className="flex items-center justify-between text-sm p-2 rounded bg-muted/50"
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
                  <span>{prompt.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">v{prompt.version}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Integrações */}
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
            <Zap className="h-4 w-4 text-amber-500" />
            Integracoes
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {agent.integrations.map((integration, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {integration}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Métricas */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t">
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
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between gap-2">
        <Button variant="outline" size="sm" onClick={onConfigure} className="flex-1">
          <Settings className="h-4 w-4 mr-2" /> Configurar
        </Button>
        <Button size="sm" onClick={onExecute} className="flex-1">
          <Play className="h-4 w-4 mr-2" /> Executar
        </Button>
      </CardFooter>
    </Card>
  );
};

interface CopilotCardProps {
  copilot: typeof aiCopilots[0];
  onOpen: () => void;
}

const CopilotCard = ({ copilot, onOpen }: CopilotCardProps) => {
  const Icon = iconMap[copilot.icon] || Brain;
  const connectedAgentNames = copilot.agents.map(agentId => {
    const agent = aiAgents.find(a => a.id === agentId);
    return agent?.name || agentId;
  });
  
  return (
    <Card className="border-l-4" style={{ borderLeftColor: copilot.color }}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div 
            className={cn(
              "p-3 rounded-xl",
              copilot.gradient && `bg-gradient-to-br ${copilot.gradient}`
            )}
            style={!copilot.gradient ? { backgroundColor: `${copilot.color}20` } : undefined}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{copilot.name}</h3>
            <p className="text-sm text-muted-foreground">{copilot.description}</p>
            
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                {copilot.scope === 'council' ? 'Conselho' : 'Sistema'}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                v{copilot.version}
              </Badge>
            </div>
            
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Agentes Conectados:</p>
              <div className="flex flex-wrap gap-1">
                {connectedAgentNames.map((name, i) => (
                  <Badge key={i} className="bg-primary/10 text-primary text-xs">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
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
          </div>
        </div>
        
        <Button onClick={onOpen} className="w-full mt-4" variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Abrir Copiloto
        </Button>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================

const AIAgents = () => {
  const { user } = useAuth();
  const stats = getEngineStats();
  
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string; content: string}[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [activeTab, setActiveTab] = useState("agents");

  const handleConfigure = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setShowConfigDialog(true);
  };

  const handleExecute = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setChatMessages([
      {
        role: "assistant",
        content: `Ola! Eu sou o ${agent.name} (${agent.shortName}). ${agent.description}\n\nComo posso ajudar voce hoje?`
      }
    ]);
    setShowExecuteDialog(true);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedAgent) return;

    const newMessages = [
      ...chatMessages,
      { role: "user", content: messageInput }
    ];
    
    setChatMessages(newMessages);
    setMessageInput("");
    
    setTimeout(() => {
      const responseMessage = {
        role: "assistant",
        content: `Estou analisando sua solicitacao: "${messageInput}".\n\nCom base nas minhas integracoes (${selectedAgent.integrations.join(", ")}), posso fornecer insights relevantes. Em uma implementacao completa, eu conectaria aos dados reais do sistema para uma resposta personalizada.`
      };
      
      setChatMessages(prev => [...prev, responseMessage]);
    }, 1500);
  };

  const handleSaveAgentConfig = () => {
    toast({
      title: "Agente configurado",
      description: `As configuracoes do ${selectedAgent?.name} foram salvas.`,
    });
    setShowConfigDialog(false);
  };

  const handleOpenCopilot = (copilotId: string) => {
    if (copilotId === 'copilot-governance') {
      window.location.href = '/governance-copilot';
    } else {
      toast({
        title: "Copiloto",
        description: "Abrindo interface do copiloto...",
      });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header title="Agentes de IA" />
        
        <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header com Estatísticas */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Bot className="h-6 w-6 text-primary" />
                  Motor de IA - MOAT Engine
                </h1>
                <p className="text-muted-foreground">
                  Arquitetura de 3 camadas: Copilotos, Agentes e Servicos
                </p>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-5 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalCopilots}</p>
                      <p className="text-xs text-muted-foreground">Copilotos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalAgents}</p>
                      <p className="text-xs text-muted-foreground">Agentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalPrompts}</p>
                      <p className="text-xs text-muted-foreground">Prompts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalExecutions.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Execucoes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-2xl font-bold">{stats.avgSuccessRate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Sucesso</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="copilots" className="gap-2">
                <Brain className="h-4 w-4" />
                Copilotos
              </TabsTrigger>
              <TabsTrigger value="agents" className="gap-2">
                <Bot className="h-4 w-4" />
                Agentes de IA
              </TabsTrigger>
            </TabsList>

            {/* Tab Copilotos */}
            <TabsContent value="copilots">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiCopilots.map(copilot => (
                  <CopilotCard 
                    key={copilot.id}
                    copilot={copilot}
                    onOpen={() => handleOpenCopilot(copilot.id)}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Tab Agentes */}
            <TabsContent value="agents">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {aiAgents.map(agent => (
                  <AgentCard 
                    key={agent.id}
                    agent={agent}
                    onConfigure={() => handleConfigure(agent)}
                    onExecute={() => handleExecute(agent)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Dialog de Configuração */}
          <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedAgent && (
                    <>
                      {(() => {
                        const Icon = iconMap[selectedAgent.icon] || Sparkles;
                        return <Icon className="h-5 w-5" style={{ color: selectedAgent.color }} />;
                      })()}
                      Configurar {selectedAgent.name}
                    </>
                  )}
                </DialogTitle>
                <DialogDescription>
                  {selectedAgent?.description}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="capabilities" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="capabilities">Capacidades</TabsTrigger>
                  <TabsTrigger value="prompts">Prompts</TabsTrigger>
                  <TabsTrigger value="metrics">Metricas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="capabilities" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    {selectedAgent?.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-sm">{cap}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="prompts" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    {selectedAgent?.prompts.map((prompt) => (
                      <Card key={prompt.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{prompt.name}</h4>
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
                          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="metrics" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedAgent && (
                      <>
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-2xl font-bold" style={{ color: selectedAgent.color }}>
                              {selectedAgent.metrics.totalExecutions}
                            </p>
                            <p className="text-xs text-muted-foreground">Total de Execucoes</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-2xl font-bold" style={{ color: selectedAgent.color }}>
                              {selectedAgent.metrics.successRate.toFixed(1)}%
                            </p>
                            <p className="text-xs text-muted-foreground">Taxa de Sucesso</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <Zap className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-2xl font-bold" style={{ color: selectedAgent.color }}>
                              {selectedAgent.metrics.avgLatencyMs}ms
                            </p>
                            <p className="text-xs text-muted-foreground">Latencia Media</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-2xl font-bold" style={{ color: selectedAgent.color }}>
                              {selectedAgent.metrics.avgQualityScore.toFixed(1)}
                            </p>
                            <p className="text-xs text-muted-foreground">Score de Qualidade</p>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveAgentConfig}>
                  <Save className="h-4 w-4 mr-2" /> Salvar Configuracoes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog de Execução (Chat) */}
          <Dialog open={showExecuteDialog} onOpenChange={setShowExecuteDialog}>
            <DialogContent className="max-w-2xl h-[600px] flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedAgent && (
                    <>
                      {(() => {
                        const Icon = iconMap[selectedAgent.icon] || Sparkles;
                        return <Icon className="h-5 w-5" style={{ color: selectedAgent.color }} />;
                      })()}
                      {selectedAgent.name}
                    </>
                  )}
                </DialogTitle>
                <DialogDescription>
                  Interaja com o agente para obter insights e analises
                </DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="flex-1 pr-4 mt-4">
                <div className="space-y-4">
                  {chatMessages.map((message, i) => (
                    <div 
                      key={i}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === "user" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Input 
                  placeholder="Digite sua mensagem..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default AIAgents;
