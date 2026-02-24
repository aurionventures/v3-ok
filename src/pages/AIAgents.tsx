
import { useState } from "react";
import { Bot, MessageSquare, AlertCircle, FileText, Settings, Shield, BookOpen, Brain, Users, Leaf, Plus, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Agent data with specialized integrations
const agentsData = [
  {
    id: 1,
    name: "Consilium",
    description: "Assistente especialista em organização e condução de Conselhos e Comitês.",
    icon: <Shield className="h-6 w-6" />,
    color: "#8b5cf6",
    integrations: ["Conselhos", "Comitês", "Rituais"],
    status: "active",
    type: "governance",
    capabilities: [
      "Gerar automaticamente pautas e atas de reuniões formais",
      "Sugerir boas práticas de governança conforme porte e complexidade",
      "Alertar sobre prazos legais e obrigações do conselho",
      "Auxiliar na criação de agendas inteligentes considerando prioridades"
    ]
  },
  {
    id: 2,
    name: "Succession Mentor",
    description: "Orientador e coach digital para a gestão da sucessão e desenvolvimento dos herdeiros.",
    icon: <Users className="h-6 w-6" />,
    color: "#3b82f6",
    integrations: ["Sucessão", "Indivíduos-Chave", "Desenvolvimento Familiar"],
    status: "active",
    type: "succession",
    capabilities: [
      "Sugerir trilhas de capacitação para herdeiros conforme perfil",
      "Aplicar avaliações periódicas de prontidão sucessória",
      "Gerar relatórios sobre o andamento dos planos sucessórios",
      "Fornecer conteúdos sobre liderança, legado e transição familiar"
    ]
  },
  {
    id: 3,
    name: "Legacy Curator",
    description: "Curador do legado familiar, preserva, organiza e sugere ações ligadas ao propósito e cultura familiar.",
    icon: <BookOpen className="h-6 w-6" />,
    color: "#f59e0b",
    integrations: ["Existencial", "Legado", "Rituais"],
    status: "active",
    type: "succession",
    capabilities: [
      "Facilitar a escrita e atualização do Manifesto de Legado",
      "Sugerir rituais e celebrações alinhados à identidade familiar",
      "Organizar Timeline do Legado com marcos históricos importantes",
      "Analisar coerência entre valores declarados e práticas familiares"
    ]
  },
  {
    id: 4,
    name: "ESG Advisor",
    description: "Consultor para estruturação, monitoramento e evolução das práticas ESG.",
    icon: <Leaf className="h-6 w-6" />,
    color: "#10b981",
    integrations: ["ESG", "Diagnóstico Sistêmico"],
    status: "active",
    type: "esg",
    capabilities: [
      "Sugerir políticas e práticas ESG adequadas ao perfil da empresa",
      "Gerar relatórios ESG a partir dos dados da plataforma",
      "Propor metas e indicadores com base em benchmarks",
      "Alertar sobre tendências regulatórias e oportunidades"
    ]
  },
  {
    id: 5,
    name: "Risk Sentinel",
    description: "Guardião da identificação e monitoramento de riscos sistêmicos nos pilares do Método CR.",
    icon: <AlertCircle className="h-6 w-6" />,
    color: "#ef4444",
    integrations: ["Diagnóstico de Subsistemas", "Monitoramento Sistêmico"],
    status: "active",
    type: "esg",
    capabilities: [
      "Coletar inputs de percepção de risco em cinco dimensões",
      "Gerar automaticamente a Matriz de Riscos Sistêmicos",
      "Alertar para riscos críticos ou recorrentes",
      "Sugerir planos de mitigação baseados em boas práticas"
    ]
  }
];

// Available module integrations for new agents
const availableModules = [
  { value: "conselhos", label: "Conselhos" },
  { value: "comites", label: "Comitês" },
  { value: "rituais", label: "Rituais" },
  { value: "sucessao", label: "Sucessão" },
  { value: "individuos-chave", label: "Indivíduos-Chave" },
  { value: "desenvolvimento-familiar", label: "Desenvolvimento Familiar" },
  { value: "existencial", label: "Existencial" },
  { value: "legado", label: "Legado" },
  { value: "esg", label: "ESG" },
  { value: "diagnostico-sistemico", label: "Diagnóstico Sistêmico" },
  { value: "diagnostico-subsistemas", label: "Diagnóstico de Subsistemas" },
  { value: "monitoramento-sistemico", label: "Monitoramento Sistêmico" }
];

const AIAgents = () => {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [chatMode, setChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  
  // State for new agent form
  const [newAgent, setNewAgent] = useState({
    name: "",
    description: "",
    type: "governance",
    color: "#8b5cf6",
    integrations: [] as string[],
    capabilities: [""] as string[]
  });

  const filteredAgents = agentsData.filter(agent => 
    (agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterType === "all" || agent.type === filterType)
  );

  const handleOpenAgent = (agent: any) => {
    setSelectedAgent(agent);
    setChatMessages([
      {
        role: "assistant",
        content: `Olá! Eu sou o ${agent.name}. ${agent.description} Como posso ajudar você hoje?`
      }
    ]);
    setChatMode(false);
  };

  const handleCloseAgent = () => {
    setSelectedAgent(null);
    setChatMessages([]);
    setMessageInput("");
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    // Add user message
    const newMessages = [
      ...chatMessages,
      { role: "user", content: messageInput }
    ];
    
    setChatMessages(newMessages);
    setMessageInput("");
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const responseMessage = {
        role: "assistant",
        content: `Como ${selectedAgent.name}, estou processando sua solicitação sobre "${messageInput}". Esta é uma demonstração - em uma implementação completa, eu utilizaria dados dos módulos integrados (${selectedAgent.integrations.join(", ")}) para fornecer uma resposta personalizada.`
      };
      
      setChatMessages(prev => [...prev, responseMessage]);
    }, 1500);
  };

  const handleActivateAgent = (agentId: number) => {
    toast({
      title: "Agente ativado",
      description: "O agente foi ativado com sucesso e já está disponível para uso.",
    });
  };
  
  const handleAddCapability = () => {
    setNewAgent({
      ...newAgent,
      capabilities: [...newAgent.capabilities, ""]
    });
  };
  
  const handleRemoveCapability = (index: number) => {
    const updatedCapabilities = [...newAgent.capabilities];
    updatedCapabilities.splice(index, 1);
    setNewAgent({
      ...newAgent,
      capabilities: updatedCapabilities
    });
  };
  
  const handleCapabilityChange = (index: number, value: string) => {
    const updatedCapabilities = [...newAgent.capabilities];
    updatedCapabilities[index] = value;
    setNewAgent({
      ...newAgent,
      capabilities: updatedCapabilities
    });
  };
  
  const handleCreateAgent = () => {
    // Validation
    if (!newAgent.name || !newAgent.description || newAgent.capabilities.some(cap => !cap.trim())) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, would save to backend
    toast({
      title: "Agente criado",
      description: `O agente ${newAgent.name} foi criado com sucesso.`,
    });
    
    // Reset form
    setNewAgent({
      name: "",
      description: "",
      type: "governance",
      color: "#8b5cf6",
      integrations: [],
      capabilities: [""]
    });
    
    setShowCreateAgent(false);
  };

  const toggleCreateAgentForm = () => {
    setShowCreateAgent(!showCreateAgent);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header title="Agentes de IA" />
        
        <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Agentes Especialistas</h1>
                <p className="text-gray-600 mt-1">
                  Assistentes inteligentes especializados em governança familiar e empresarial
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Buscar agentes..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-60"
                />
                <Button variant="outline" onClick={() => window.location.href = "/ai-config"}>
                  <Settings className="h-4 w-4 mr-2" /> Configurar
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Filtrar por tipo: {filterType === "all" ? "Todos os Agentes" : 
                                      filterType === "governance" ? "Governança" : 
                                      filterType === "succession" ? "Sucessão" : 
                                      "ESG e Riscos"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterType("all")}>
                    Todos os Agentes {filterType === "all" && <Check className="ml-2 h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("governance")}>
                    Governança {filterType === "governance" && <Check className="ml-2 h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("succession")}>
                    Sucessão {filterType === "succession" && <Check className="ml-2 h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("esg")}>
                    ESG e Riscos {filterType === "esg" && <Check className="ml-2 h-4 w-4" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button onClick={toggleCreateAgentForm}>
              <Plus className="h-4 w-4 mr-2" /> Criar novo agente
            </Button>
          </div>

          {showCreateAgent && (
            <Card className="mb-8 border-t-4 border-blue-500">
              <CardHeader>
                <CardTitle>Criar Novo Agente</CardTitle>
                <CardDescription>Configure as características e capacidades do novo agente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Nome do Agente</label>
                      <Input 
                        id="name"
                        value={newAgent.name}
                        onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                        placeholder="Ex: Financial Advisor"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium mb-1">Tipo</label>
                      <Select 
                        value={newAgent.type} 
                        onValueChange={(value) => setNewAgent({...newAgent, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="governance">Governança</SelectItem>
                          <SelectItem value="succession">Sucessão</SelectItem>
                          <SelectItem value="esg">ESG e Riscos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">Descrição</label>
                    <Textarea 
                      id="description"
                      value={newAgent.description}
                      onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
                      placeholder="Descreva brevemente a função deste agente..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="color" className="block text-sm font-medium mb-1">Cor</label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="color"
                        type="color"
                        value={newAgent.color}
                        onChange={(e) => setNewAgent({...newAgent, color: e.target.value})}
                        className="w-16 h-10"
                      />
                      <span className="text-sm text-gray-500">Cor para identificação visual do agente</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Integração com Módulos</label>
                    <div className="flex flex-wrap gap-2">
                      {availableModules.map((module) => (
                        <Badge 
                          key={module.value}
                          variant={newAgent.integrations.includes(module.label) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const updatedIntegrations = newAgent.integrations.includes(module.label) 
                              ? newAgent.integrations.filter(i => i !== module.label)
                              : [...newAgent.integrations, module.label];
                            setNewAgent({...newAgent, integrations: updatedIntegrations});
                          }}
                        >
                          {module.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">Capacidades</label>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddCapability}>
                        <Plus className="h-4 w-4 mr-1" /> Adicionar
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {newAgent.capabilities.map((capability, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input 
                            value={capability}
                            onChange={(e) => handleCapabilityChange(index, e.target.value)}
                            placeholder="Descreva uma capacidade deste agente..."
                            className="flex-1"
                          />
                          {newAgent.capabilities.length > 1 && (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveCapability(index)}
                            >
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={toggleCreateAgentForm}>Cancelar</Button>
                <Button onClick={handleCreateAgent}>Criar Agente</Button>
              </CardFooter>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map(agent => (
              <Card key={agent.id} className="overflow-hidden border-t-4" style={{ borderTopColor: agent.color }}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                          style={{ backgroundColor: `${agent.color}20` }}>
                        {agent.icon}
                      </div>
                      <CardTitle>{agent.name}</CardTitle>
                    </div>
                    <Badge variant={agent.status === "active" ? "default" : "outline"}>
                      {agent.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <CardDescription className="mt-2">{agent.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Integração com Módulos</h4>
                      <div className="flex flex-wrap gap-1">
                        {agent.integrations.map((integration, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {integration}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Capacidades</h4>
                      <ul className="text-sm space-y-1">
                        {agent.capabilities.slice(0, 2).map((capability, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-xs mt-1">•</span>
                            <span>{capability}</span>
                          </li>
                        ))}
                        {agent.capabilities.length > 2 && (
                          <li className="text-xs text-gray-500">
                            + {agent.capabilities.length - 2} mais capacidades...
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleActivateAgent(agent.id)}>
                    Ativar
                  </Button>
                  <Button onClick={() => handleOpenAgent(agent)}>
                    <MessageSquare className="h-4 w-4 mr-2" /> Conversar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredAgents.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-center border rounded-lg shadow-sm bg-white">
              <Bot className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">Nenhum agente encontrado</h3>
              <p className="text-gray-500 mt-2 max-w-md">
                Não encontramos agentes que correspondam à sua pesquisa. Tente outros termos ou limpe a busca.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                Limpar pesquisa
              </Button>
            </div>
          )}
        </main>
      </div>
      
      {/* Agent Dialog */}
      {selectedAgent && (
        <Dialog open={!!selectedAgent} onOpenChange={handleCloseAgent}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                    style={{ backgroundColor: `${selectedAgent.color}20` }}>
                  {selectedAgent.icon}
                </div>
                <div>
                  <DialogTitle>{selectedAgent.name}</DialogTitle>
                  <DialogDescription className="max-w-sm">{selectedAgent.description}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <Tabs value={chatMode ? "chat" : "info"} onValueChange={(value) => setChatMode(value === "chat")} className="mt-4">
              <TabsList className="w-full">
                <TabsTrigger value="info" className="flex-1">Informações</TabsTrigger>
                <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4 pt-2 max-h-[60vh] overflow-y-auto">
                <div>
                  <h3 className="font-medium mb-2">Capacidades</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedAgent.capabilities.map((capability: string, idx: number) => (
                      <li key={idx}>{capability}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Integração com Módulos</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.integrations.map((integration: string, idx: number) => (
                      <Badge key={idx} variant="outline">{integration}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Como utilizar este agente</h3>
                  <p className="text-gray-600">
                    Para melhor aproveitamento do {selectedAgent.name}, forneça informações específicas sobre 
                    sua empresa familiar e desafios atuais. O agente utilizará dados já inseridos na 
                    plataforma para contextualizar suas respostas e recomendações.
                  </p>
                </div>
                
                <div className="border rounded-md p-4 bg-gray-50">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Relatórios e Documentos
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Este agente pode gerar automaticamente os seguintes documentos:
                  </p>
                  <div className="space-y-2">
                    {selectedAgent.id === 1 && (
                      <>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" /> Modelo de pauta para reunião de conselho
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" /> Template de ata de reunião
                        </Button>
                      </>
                    )}
                    {selectedAgent.id === 2 && (
                      <>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" /> Plano de desenvolvimento de herdeiros
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" /> Avaliação de prontidão sucessória
                        </Button>
                      </>
                    )}
                    {selectedAgent.id === 3 && (
                      <>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" /> Modelo de Manifesto de Legado
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" /> Sugestão de rituais familiares
                        </Button>
                      </>
                    )}
                    {selectedAgent.id === 4 && (
                      <>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" /> Relatório ESG simplificado
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" /> Modelo de política ESG
                        </Button>
                      </>
                    )}
                    {selectedAgent.id === 5 && (
                      <>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" /> Matriz de Riscos Sistêmicos
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" /> Plano de mitigação de riscos
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="chat" className="flex flex-col h-[60vh]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 border rounded-md bg-gray-50">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === "assistant" 
                          ? `bg-white border shadow-sm` 
                          : `bg-blue-500 text-white`
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={`Digite sua mensagem para ${selectedAgent.name}...`}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage}>Enviar</Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleCloseAgent}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AIAgents;
