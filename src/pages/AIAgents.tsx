import { useState } from "react";
import { 
  FileSearch,
  Building2,
  Brain,
  Settings, 
  Play, 
  Sparkles,
  Save,
  Bot,
  MessageCircle,
  Zap,
  BarChart3,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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

// AI Engine Agents - Sistema de IA especializado
const moatAgents = [
  {
    id: "analista-documentos",
    name: "Analista de Documentos",
    shortName: "Analista de Documentos",
    icon: FileSearch,
    color: "#3b82f6",
    status: "active",
    description: "Especialista em análise inteligente de documentos corporativos. Utiliza OCR avançado, classificação automática e validação para acelerar o processo de due diligence.",
    capabilities: [
      "OCR e extração de dados de documentos complexos",
      "Classificação automática por tipo e categoria",
      "Validação de conformidade documental",
      "Detecção de inconsistências e gaps",
      "Geração de resumos executivos automáticos"
    ],
    integrations: ["Checklist de Documentos", "Upload", "Análise Documental"],
    metrics: { documentos: 342, processados: 298, insights: 67 }
  },
  {
    id: "assistente-governanca",
    name: "Assistente de Governança",
    shortName: "Assistente de Governança",
    icon: Building2,
    color: "#6366f1",
    status: "active",
    description: "Assistente prático para estruturação de conselhos e governança corporativa. Especializado em apoiar a organização de reuniões, agenda anual e processos decisórios eficazes.",
    capabilities: [
      "Apoio na estruturação de conselhos e comitês",
      "Organização de processos decisórios e reuniões",
      "Geração automática de pautas otimizadas",
      "Preparação de materiais de apoio",
      "Acompanhamento de deliberações e pendências"
    ],
    integrations: ["Conselhos", "Projetos", "Agenda Anual", "Rituais"],
    metrics: { reunioes: 45, pautas: 89, deliberacoes: 156 }
  },
  {
    id: "inteligencia-estrategica",
    name: "Inteligência Estratégica",
    shortName: "Inteligência Estratégica",
    icon: Brain,
    color: "#ec4899",
    status: "active",
    description: "Inteligência estratégica unificada para monitoramento e otimização contínua. Consolida análise de riscos IBGC, métricas ESG, maturidade e inteligência competitiva.",
    capabilities: [
      "Análise preditiva de riscos usando machine learning",
      "Monitoramento ESG em tempo real com benchmarking automático",
      "Avaliação contínua de maturidade de governança",
      "Inteligência competitiva e de mercado",
      "Geração de alertas e recomendações proativas"
    ],
    integrations: ["Riscos IBGC", "ESG", "Maturidade", "Atividades", "Alertas"],
    metrics: { riscos: 23, alertas: 15, recomendacoes: 42 }
  }
];

interface AgentCardProps {
  agent: typeof moatAgents[0];
  onConfigure: () => void;
  onExecute: () => void;
}

const AgentCard = ({ agent, onConfigure, onExecute }: AgentCardProps) => {
  const Icon = agent.icon;
  const metricsLabels: Record<string, string> = {
    documentos: "Documentos",
    processados: "Processados",
    insights: "Insights",
    reunioes: "Reuniões",
    pautas: "Pautas",
    deliberacoes: "Deliberações",
    riscos: "Riscos",
    alertas: "Alertas",
    recomendacoes: "Recomendações"
  };

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
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <Badge 
                variant={agent.status === "active" ? "default" : "outline"}
                className="mt-1"
              >
                {agent.status === "active" ? "Ativo" : "Inativo"}
              </Badge>
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
        
        {/* Integrações */}
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
            <Zap className="h-4 w-4 text-amber-500" />
            Integrações
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
          {Object.entries(agent.metrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <p className="text-lg font-bold" style={{ color: agent.color }}>{value}</p>
              <p className="text-xs text-muted-foreground">{metricsLabels[key] || key}</p>
            </div>
          ))}
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

const AIAgents = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [weights, setWeights] = useState<Record<string, number>>({
    "analista-documentos": 80,
    "assistente-governanca": 70,
    "inteligencia-estrategica": 90
  });
  
  const [selectedAgent, setSelectedAgent] = useState<typeof moatAgents[0] | null>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string; content: string}[]>([]);
  const [messageInput, setMessageInput] = useState("");

  const handleConfigure = (agent: typeof moatAgents[0]) => {
    setSelectedAgent(agent);
    setShowConfigDialog(true);
  };

  const handleExecute = (agent: typeof moatAgents[0]) => {
    setSelectedAgent(agent);
    setChatMessages([
      {
        role: "assistant",
        content: `Olá! Eu sou o ${agent.name}. ${agent.description}\n\nComo posso ajudar você hoje?`
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
        content: `Estou analisando sua solicitação: "${messageInput}".\n\nCom base nas minhas integrações (${selectedAgent.integrations.join(", ")}), posso fornecer insights relevantes. Em uma implementação completa, eu conectaria aos dados reais do sistema para uma resposta personalizada.`
      };
      
      setChatMessages(prev => [...prev, responseMessage]);
    }, 1500);
  };

  const handleSaveWeights = () => {
    toast({
      title: "Configuração salva",
      description: "Os pesos dos agentes foram atualizados com sucesso.",
    });
  };

  const handleSaveAgentConfig = () => {
    toast({
      title: "Agente configurado",
      description: `As configurações do ${selectedAgent?.name} foram salvas.`,
    });
    setShowConfigDialog(false);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header title="Agentes de IA" />
        
        <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Agentes de IA - AI Engine</h1>
                <p className="text-muted-foreground">
                  Acesso completo aos agentes especializados de inteligência artificial
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="mt-2">
              <Sparkles className="h-3 w-3 mr-1" />
              Módulo Premium
            </Badge>
          </div>

          {/* Grid de Agentes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {moatAgents.map(agent => (
              <AgentCard 
                key={agent.id}
                agent={agent}
                onConfigure={() => handleConfigure(agent)}
                onExecute={() => handleExecute(agent)}
              />
            ))}
          </div>

          {/* Configuração de Pesos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuração de Pesos
              </CardTitle>
              <CardDescription>
                Ajuste a influência de cada agente nas análises do AI Engine
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {moatAgents.map(agent => {
                const Icon = agent.icon;
                return (
                  <div key={agent.id} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" style={{ color: agent.color }} />
                        {agent.shortName}
                      </span>
                      <span className="font-medium">{weights[agent.id]}%</span>
                    </div>
                    <Slider 
                      value={[weights[agent.id]]} 
                      onValueChange={([v]) => setWeights({...weights, [agent.id]: v})}
                      max={100}
                      step={5}
                      className="cursor-pointer"
                    />
                  </div>
                );
              })}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSaveWeights}>
                <Save className="h-4 w-4 mr-2" /> Salvar Configuração
              </Button>
            </CardFooter>
          </Card>

          {/* Dialog de Configuração */}
          <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedAgent && (
                    <>
                      <selectedAgent.icon 
                        className="h-5 w-5" 
                        style={{ color: selectedAgent.color }} 
                      />
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
                  <TabsTrigger value="integrations">Integrações</TabsTrigger>
                  <TabsTrigger value="metrics">Métricas</TabsTrigger>
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
                
                <TabsContent value="integrations" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {selectedAgent?.integrations.map((integration, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Zap className="h-5 w-5 text-amber-500" />
                        <span className="text-sm font-medium">{integration}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="metrics" className="space-y-4 mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    {selectedAgent && Object.entries(selectedAgent.metrics).map(([key, value]) => (
                      <Card key={key}>
                        <CardContent className="pt-6 text-center">
                          <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-2xl font-bold" style={{ color: selectedAgent.color }}>
                            {value}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">{key}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveAgentConfig}>
                  <Save className="h-4 w-4 mr-2" /> Salvar Configurações
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
                      <selectedAgent.icon 
                        className="h-5 w-5" 
                        style={{ color: selectedAgent.color }} 
                      />
                      {selectedAgent.name}
                    </>
                  )}
                </DialogTitle>
                <DialogDescription>
                  Interaja com o agente para obter insights e análises
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
