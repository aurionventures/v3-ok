import { useState } from "react";
import { 
  Bot,
  MessageCircle,
  Settings,
  Play,
  Plus,
  Shield,
  Target,
  Sparkles
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { toast } from "@/hooks/use-toast";

// Agentes padrão
const defaultAgents = [
  {
    id: "governance-assistant",
    name: "Assistente de Governança",
    description: "Assistente especializado em questões de governança corporativa, compliance e boas práticas.",
    icon: Shield,
    color: "#3B82F6"
  },
  {
    id: "strategy-assistant",
    name: "Assistente de Estratégia",
    description: "Assistente focado em planejamento estratégico, análise de cenários e tomada de decisões.",
    icon: Target,
    color: "#10B981"
  }
];

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const AIAgents = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>(defaultAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string; content: string}[]>([]);
  const [messageInput, setMessageInput] = useState("");
  
  // Formulário para criar agente personalizado
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentDescription, setNewAgentDescription] = useState("");

  const handleOpenChat = (agent: Agent) => {
    setSelectedAgent(agent);
    setChatMessages([
      {
        role: "assistant",
        content: `Olá! Eu sou o ${agent.name}. ${agent.description}\n\nComo posso ajudar você hoje?`
      }
    ]);
    setShowChatDialog(true);
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
        content: `Estou processando sua solicitação: "${messageInput}".\n\nEm uma implementação completa, eu conectaria aos dados reais do sistema para fornecer uma resposta personalizada e contextualizada.`
      };
      
      setChatMessages(prev => [...prev, responseMessage]);
    }, 1500);
  };

  const handleCreateAgent = () => {
    if (!newAgentName.trim() || !newAgentDescription.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome e a descrição do agente.",
        variant: "destructive"
      });
      return;
    }

    const newAgent: Agent = {
      id: `custom-${Date.now()}`,
      name: newAgentName,
      description: newAgentDescription,
      icon: Sparkles,
      color: "#8B5CF6"
    };

    setAgents(prev => [...prev, newAgent]);
    setNewAgentName("");
    setNewAgentDescription("");
    setShowCreateDialog(false);
    
    toast({
      title: "Agente criado",
      description: `${newAgentName} foi adicionado com sucesso.`,
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header title="Agentes de IA" />
        
        <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Agentes de IA</h1>
                <p className="text-muted-foreground">
              Assistentes especializados para apoiar suas decisões e análises
            </p>
          </div>

          {/* Grid de Agentes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Agentes existentes */}
            {agents.map(agent => {
              const Icon = agent.icon;
              return (
                <Card key={agent.id} className="border-t-4 flex flex-col" style={{ borderTopColor: agent.color }}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
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
                          <CardDescription className="mt-1">
                            {agent.description}
                          </CardDescription>
              </div>
                      </div>
                  </div>
                  </CardHeader>
                  
                  <CardFooter className="border-t pt-4 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleOpenChat(agent)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" /> 
                      Conversar
                    </Button>
                    <Button 
                      size="sm" 
                                variant="outline"
                      className="flex-1"
                    >
                      <Settings className="h-4 w-4 mr-2" /> 
                      Configurar
                    </Button>
                  </CardFooter>
                      </Card>
              );
            })}

            {/* Card para criar agente personalizado */}
            <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center py-12 h-full min-h-[200px]">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-muted"
                >
                  <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                <CardTitle className="text-lg mb-2">Criar Agente Personalizado</CardTitle>
                <CardDescription className="text-center mb-4">
                  Crie um agente personalizado para suas necessidades específicas
                </CardDescription>
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Agente
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Dialog de Chat */}
          <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
            <DialogContent className="max-w-2xl h-[600px] flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedAgent && (
                    <>
                      {(() => {
                        const Icon = selectedAgent.icon;
                        return <Icon className="h-5 w-5" style={{ color: selectedAgent.color }} />;
                      })()}
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

          {/* Dialog de Criar Agente */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Criar Agente Personalizado
                </DialogTitle>
                <DialogDescription>
                  Defina um novo agente de IA personalizado para suas necessidades
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Nome do Agente
                  </label>
                  <Input 
                    placeholder="Ex: Assistente de Compliance"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Descrição
                  </label>
                  <Textarea 
                    placeholder="Descreva o propósito e as capacidades do agente..."
                    value={newAgentDescription}
                    onChange={(e) => setNewAgentDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => {
                  setShowCreateDialog(false);
                  setNewAgentName("");
                  setNewAgentDescription("");
                }}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateAgent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Agente
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default AIAgents;
