
import { useState, useEffect } from "react";
import { Settings, Bot, Check, AlertCircle, ChevronDown, ChevronUp, Shield, Users, BookOpen, Leaf, Trash2, Edit, Save, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

// Agent configuration interface
interface Agent {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  integrations: string[];
  status: "active" | "inactive";
  type: string;
  capabilities: string[];
  maxTokens: number;
  model: string;
  temperature: number;
  isSystemDefault: boolean;
}

// Sample agent data
const initialAgents: Agent[] = [
  {
    id: 1,
    name: "Consilium",
    description: "Assistente especialista em organização e condução de Conselhos e Comitês.",
    icon: "Shield",
    color: "#8b5cf6",
    integrations: ["Conselhos", "Comitês", "Rituais"],
    status: "active",
    type: "governance",
    capabilities: [
      "Gerar automaticamente pautas e atas de reuniões formais",
      "Sugerir boas práticas de governança conforme porte e complexidade",
      "Alertar sobre prazos legais e obrigações do conselho"
    ],
    maxTokens: 4096,
    model: "gpt-4",
    temperature: 0.7,
    isSystemDefault: true
  },
  {
    id: 2,
    name: "Succession Mentor",
    description: "Orientador e coach digital para a gestão da sucessão e desenvolvimento dos herdeiros.",
    icon: "Users",
    color: "#3b82f6",
    integrations: ["Sucessão", "Indivíduos-Chave", "Desenvolvimento Familiar"],
    status: "active",
    type: "succession",
    capabilities: [
      "Sugerir trilhas de capacitação para herdeiros conforme perfil",
      "Aplicar avaliações periódicas de prontidão sucessória",
      "Gerar relatórios sobre o andamento dos planos sucessórios"
    ],
    maxTokens: 4096,
    model: "gpt-4",
    temperature: 0.5,
    isSystemDefault: true
  },
  {
    id: 3,
    name: "Legacy Curator",
    description: "Curador do legado familiar, preserva, organiza e sugere ações ligadas ao propósito e cultura familiar.",
    icon: "BookOpen",
    color: "#f59e0b",
    integrations: ["Existencial", "Legado", "Rituais"],
    status: "active",
    type: "succession",
    capabilities: [
      "Facilitar a escrita e atualização do Manifesto de Legado",
      "Sugerir rituais e celebrações alinhados à identidade familiar",
      "Organizar Timeline do Legado com marcos históricos importantes"
    ],
    maxTokens: 4096,
    model: "gpt-4",
    temperature: 0.6,
    isSystemDefault: true
  },
  {
    id: 4,
    name: "ESG Advisor",
    description: "Consultor para estruturação, monitoramento e evolução das práticas ESG.",
    icon: "Leaf",
    color: "#10b981",
    integrations: ["ESG", "Diagnóstico Sistêmico"],
    status: "active",
    type: "esg",
    capabilities: [
      "Sugerir políticas e práticas ESG adequadas ao perfil da empresa",
      "Gerar relatórios ESG a partir dos dados da plataforma",
      "Propor metas e indicadores com base em benchmarks"
    ],
    maxTokens: 4096,
    model: "gpt-4",
    temperature: 0.4,
    isSystemDefault: true
  }
];

const modelOptions = [
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "gpt-4", label: "GPT-4" },
  { value: "claude-3-opus", label: "Claude 3 Opus" },
  { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
  { value: "llama-3", label: "Llama 3" }
];

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

const AdminAgentConfig = () => {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newCapability, setNewCapability] = useState<string>("");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Create new agent dialog state
  const [showCreateAgentDialog, setShowCreateAgentDialog] = useState(false);
  const [newAgent, setNewAgent] = useState<Omit<Agent, 'id'>>({
    name: "",
    description: "",
    icon: "Bot",
    color: "#8b5cf6",
    integrations: [],
    status: "inactive",
    type: "governance",
    capabilities: [""],
    maxTokens: 4096,
    model: "gpt-4",
    temperature: 0.7,
    isSystemDefault: false
  });

  // Get available icon components
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Shield":
        return <Shield />;
      case "Users":
        return <Users />;
      case "BookOpen":
        return <BookOpen />;
      case "Leaf":
        return <Leaf />;
      default:
        return <Bot />;
    }
  };

  // Filter agents based on search term, status filter and type filter
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || agent.status === statusFilter;
    
    const matchesType =
      typeFilter === "all" || agent.type === typeFilter;
      
    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle toggle agent status
  const handleToggleStatus = (agentId: number) => {
    setAgents(
      agents.map((agent) => {
        if (agent.id === agentId) {
          const newStatus = agent.status === "active" ? "inactive" : "active";
          return { ...agent, status: newStatus };
        }
        return agent;
      })
    );
    
    toast({
      title: "Status atualizado",
      description: "O status do agente foi alterado com sucesso.",
    });
  };

  // Handle edit agent
  const handleEditAgent = (agent: Agent) => {
    setEditingAgent({ ...agent });
    setShowEditDialog(true);
  };

  // Handle save edited agent
  const handleSaveAgent = () => {
    if (!editingAgent) return;
    
    setAgents(
      agents.map((agent) => {
        if (agent.id === editingAgent.id) {
          return editingAgent;
        }
        return agent;
      })
    );
    
    setShowEditDialog(false);
    setEditingAgent(null);
    
    toast({
      title: "Agente atualizado",
      description: "As configurações do agente foram atualizadas com sucesso.",
    });
  };

  // Handle delete agent
  const handleDeleteAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setShowDeleteDialog(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (!editingAgent) return;
    
    setAgents(agents.filter((agent) => agent.id !== editingAgent.id));
    setShowDeleteDialog(false);
    setEditingAgent(null);
    
    toast({
      title: "Agente removido",
      description: "O agente foi removido com sucesso.",
    });
  };

  // Handle add capability to edit form
  const handleAddCapability = () => {
    if (!editingAgent) return;
    
    setEditingAgent({
      ...editingAgent,
      capabilities: [...editingAgent.capabilities, newCapability]
    });
    
    setNewCapability("");
  };

  // Handle remove capability from edit form
  const handleRemoveCapability = (index: number) => {
    if (!editingAgent) return;
    
    const newCapabilities = [...editingAgent.capabilities];
    newCapabilities.splice(index, 1);
    
    setEditingAgent({
      ...editingAgent,
      capabilities: newCapabilities
    });
  };

  // Handle add integration
  const handleToggleIntegration = (moduleName: string) => {
    if (!editingAgent) return;
    
    const isSelected = editingAgent.integrations.includes(moduleName);
    
    if (isSelected) {
      setEditingAgent({
        ...editingAgent,
        integrations: editingAgent.integrations.filter((i) => i !== moduleName)
      });
    } else {
      setEditingAgent({
        ...editingAgent,
        integrations: [...editingAgent.integrations, moduleName]
      });
    }
  };

  // Handle create new agent
  const handleCreateAgent = () => {
    // Validation
    if (!newAgent.name || !newAgent.description) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const newId = Math.max(...agents.map(a => a.id)) + 1;
    
    setAgents([...agents, { ...newAgent, id: newId }]);
    setShowCreateAgentDialog(false);
    
    // Reset form
    setNewAgent({
      name: "",
      description: "",
      icon: "Bot",
      color: "#8b5cf6",
      integrations: [],
      status: "inactive",
      type: "governance",
      capabilities: [""],
      maxTokens: 4096,
      model: "gpt-4",
      temperature: 0.7,
      isSystemDefault: false
    });
    
    toast({
      title: "Agente criado",
      description: "O novo agente foi criado com sucesso.",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Configuração de Agentes" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configuração de Agentes</h1>
              <p className="text-gray-600 mt-1">
                Gerencie os agentes de IA disponíveis na plataforma
              </p>
            </div>
            <Button onClick={() => setShowCreateAgentDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Novo Agente
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Busca</label>
                  <Input
                    placeholder="Buscar agentes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as "all" | "active" | "inactive")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="inactive">Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tipo</label>
                  <Select
                    value={typeFilter}
                    onValueChange={(value) => setTypeFilter(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="governance">Governança</SelectItem>
                      <SelectItem value="succession">Sucessão</SelectItem>
                      <SelectItem value="esg">ESG e Riscos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {filteredAgents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                <Bot className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">Nenhum agente encontrado</h3>
                <p className="mt-1 text-gray-500">
                  Nenhum agente corresponde aos critérios de filtro selecionados.
                </p>
              </div>
            ) : (
              filteredAgents.map((agent) => (
                <Accordion type="single" collapsible key={agent.id}>
                  <AccordionItem value={`item-${agent.id}`}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-4 w-full">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${agent.color}20` }}
                        >
                          {getIconComponent(agent.icon)}
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-medium text-lg">{agent.name}</h3>
                          <p className="text-gray-500 text-sm">{agent.description}</p>
                        </div>
                        <Badge variant={agent.status === "active" ? "default" : "outline"}>
                          {agent.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Detalhes Técnicos</h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm text-gray-500">Modelo: </span>
                              <span className="font-medium">{agent.model}</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Max Tokens: </span>
                              <span className="font-medium">{agent.maxTokens}</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Temperatura: </span>
                              <span className="font-medium">{agent.temperature}</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Tipo: </span>
                              <span className="font-medium capitalize">{agent.type}</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Padrão do Sistema: </span>
                              <span className="font-medium">{agent.isSystemDefault ? "Sim" : "Não"}</span>
                            </div>
                          </div>
                          
                          <h4 className="font-medium mt-6 mb-2">Integrações com Módulos</h4>
                          <div className="flex flex-wrap gap-2">
                            {agent.integrations.map((integration, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {integration}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Capacidades</h4>
                          <ul className="space-y-2 pl-5 list-disc">
                            {agent.capabilities.map((capability, i) => (
                              <li key={i}>{capability}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="p-4 border-t mt-4 flex justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Status:</span>
                          <Switch
                            checked={agent.status === "active"}
                            onCheckedChange={() => handleToggleStatus(agent.id)}
                          />
                          <span className="text-sm text-gray-500">
                            {agent.status === "active" ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditAgent(agent)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          {!agent.isSystemDefault && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteAgent(agent)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remover
                            </Button>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Edit Agent Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Agente</DialogTitle>
            <DialogDescription>
              Altere as configurações do agente selecionado.
            </DialogDescription>
          </DialogHeader>
          
          {editingAgent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nome</label>
                  <Input
                    value={editingAgent.name}
                    onChange={(e) => 
                      setEditingAgent({
                        ...editingAgent,
                        name: e.target.value
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Cor</label>
                  <Input
                    type="color"
                    value={editingAgent.color}
                    onChange={(e) => 
                      setEditingAgent({
                        ...editingAgent,
                        color: e.target.value
                      })
                    }
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Descrição</label>
                <Textarea
                  value={editingAgent.description}
                  onChange={(e) => 
                    setEditingAgent({
                      ...editingAgent,
                      description: e.target.value
                    })
                  }
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Tipo</label>
                <Select
                  value={editingAgent.type}
                  onValueChange={(value) => 
                    setEditingAgent({
                      ...editingAgent,
                      type: value
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="governance">Governança</SelectItem>
                    <SelectItem value="succession">Sucessão</SelectItem>
                    <SelectItem value="esg">ESG e Riscos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Modelo de IA</label>
                <Select
                  value={editingAgent.model}
                  onValueChange={(value) => 
                    setEditingAgent({
                      ...editingAgent,
                      model: value
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Max Tokens</label>
                  <Input
                    type="number"
                    value={editingAgent.maxTokens}
                    onChange={(e) => 
                      setEditingAgent({
                        ...editingAgent,
                        maxTokens: parseInt(e.target.value)
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Temperatura</label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={editingAgent.temperature}
                    onChange={(e) => 
                      setEditingAgent({
                        ...editingAgent,
                        temperature: parseFloat(e.target.value)
                      })
                    }
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Integrações com Módulos</label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                  {availableModules.map((module) => (
                    <Badge
                      key={module.value}
                      variant={editingAgent.integrations.includes(module.label) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleToggleIntegration(module.label)}
                    >
                      {module.label}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Capacidades</label>
                </div>
                <div className="space-y-3">
                  {editingAgent.capabilities.map((capability, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={capability}
                        onChange={(e) => {
                          const newCapabilities = [...editingAgent.capabilities];
                          newCapabilities[index] = e.target.value;
                          setEditingAgent({
                            ...editingAgent,
                            capabilities: newCapabilities
                          });
                        }}
                        className="flex-1"
                      />
                      {editingAgent.capabilities.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCapability(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nova capacidade..."
                      value={newCapability}
                      onChange={(e) => setNewCapability(e.target.value)}
                    />
                    <Button onClick={handleAddCapability} disabled={!newCapability.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAgent}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este agente? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Sim, remover agente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Agent Dialog */}
      <Dialog open={showCreateAgentDialog} onOpenChange={setShowCreateAgentDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Agente</DialogTitle>
            <DialogDescription>
              Configure um novo agente de IA para a plataforma.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Nome</label>
                <Input
                  value={newAgent.name}
                  onChange={(e) => 
                    setNewAgent({
                      ...newAgent,
                      name: e.target.value
                    })
                  }
                  placeholder="Ex: Finance Advisor"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Cor</label>
                <Input
                  type="color"
                  value={newAgent.color}
                  onChange={(e) => 
                    setNewAgent({
                      ...newAgent,
                      color: e.target.value
                    })
                  }
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Descrição</label>
              <Textarea
                value={newAgent.description}
                onChange={(e) => 
                  setNewAgent({
                    ...newAgent,
                    description: e.target.value
                  })
                }
                placeholder="Descreva a função e especialidade deste agente..."
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Tipo</label>
              <Select
                value={newAgent.type}
                onValueChange={(value) => 
                  setNewAgent({
                    ...newAgent,
                    type: value
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="governance">Governança</SelectItem>
                  <SelectItem value="succession">Sucessão</SelectItem>
                  <SelectItem value="esg">ESG e Riscos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* More configuration fields would be added here similar to the edit form */}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateAgentDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateAgent}>
              Criar Agente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAgentConfig;
