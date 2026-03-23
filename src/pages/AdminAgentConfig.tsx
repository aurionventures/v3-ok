
import { useState, useEffect, useCallback } from "react";
import { Settings, Bot, Check, AlertCircle, ChevronDown, ChevronUp, Shield, Users, BookOpen, Leaf, Trash2, Edit, Save, Plus, FileText, ClipboardList, Calendar, TrendingUp, Target, LayoutGrid, List, Eye, BarChart3, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { invokeEdgeFunction } from "@/lib/supabase";
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
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { PROMPTS_AGENTES } from "@/prompts-agentes/prompts";

// Agent configuration interface (1:1 com chave de PROMPTS_AGENTES)
interface Agent {
  id: number;
  promptKey: string;
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

// Agentes derivados de PROMPTS_AGENTES (1:1 com a biblioteca de prompts)
const AGENT_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];
const AGENT_ICONS = ["Shield", "FileText", "Bot", "TrendingUp", "Target", "BookOpen"];

const initialAgents: Agent[] = Object.entries(PROMPTS_AGENTES).map(([key, text], idx) => {
  const name = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const firstLine = text.split("\n")[0]?.slice(0, 120) || "";
  return {
    id: idx + 1,
    promptKey: key,
    name,
    description: firstLine,
    icon: AGENT_ICONS[idx % AGENT_ICONS.length],
    color: AGENT_COLORS[idx % AGENT_COLORS.length],
    integrations: [],
    status: "active" as const,
    type: "governance",
    capabilities: [firstLine],
    maxTokens: 4096,
    model: "gpt-4",
    temperature: 0.7,
    isSystemDefault: true,
  };
});

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
  const pageTitle = "Configuração de IA";
  const pageDescription = "Gerencie os agentes de IA e a biblioteca de prompts";

  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newCapability, setNewCapability] = useState<string>("");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"mosaico" | "lista">("lista");

  // Biblioteca de prompts - edição
  const [editingPromptKey, setEditingPromptKey] = useState<string | null>(null);
  const [editingPromptText, setEditingPromptText] = useState("");
  const [promptOverrides, setPromptOverrides] = useState<Record<string, string>>({});

  // Consumo de tokens
  const [usageData, setUsageData] = useState<{
    daily: { data: string; total_tokens: number }[];
    total: number;
  } | null>(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const [usagePeriodo, setUsagePeriodo] = useState<"ultimos_30" | "mes">("ultimos_30");
  const [usageMes, setUsageMes] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const fetchUsage = useCallback(async () => {
    setUsageLoading(true);
    const { data, error } = await invokeEdgeFunction<{
      daily: { data: string; total_tokens: number }[];
      total: number;
    }>(
      "usage-openai",
      {
        periodo: usagePeriodo,
        ...(usagePeriodo === "mes" && { mes: usageMes }),
      },
      { useAnonKey: true }
    );
    setUsageLoading(false);
    if (error) {
      const hint = error.message?.includes("Failed to send") || error.message?.includes("Edge Function")
        ? " Verifique se a Edge Function 'usage-openai' está deployada e se a tabela token_usage existe (migração 20260302310000)."
        : "";
      toast({
        title: "Erro ao carregar consumo",
        description: `${error.message}${hint}`,
        variant: "destructive",
      });
      setUsageData(null);
      return;
    }
    setUsageData(data ?? null);
  }, [usagePeriodo, usageMes]);

  // Carrega consumo apenas ao abrir a aba "Consumo de tokens" (evita erro na carga inicial)
  const [activeTab, setActiveTab] = useState("agentes");
  useEffect(() => {
    if (activeTab === "consumo-tokens") fetchUsage();
  }, [activeTab, fetchUsage]);

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
      case "FileText":
        return <FileText />;
      case "ClipboardList":
        return <ClipboardList />;
      case "Calendar":
        return <Calendar />;
      case "TrendingUp":
        return <TrendingUp />;
      case "Target":
        return <Target />;
      default:
        return <Bot />;
    }
  };

  // Lista para o mosaico (1:1 com PROMPTS_AGENTES)
  const mosaicAgents = agents
    .map((a) => ({
      id: String(a.id),
      name: a.name,
      description: a.description,
      status: a.status,
      color: a.color,
      icon: a.icon,
    }))
    .filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  })
    .sort((a, b) => a.name.localeCompare(b.name));

  // Filter agents based on search term, status filter and type filter
  const filteredAgents = agents
    .filter((agent) => {
      const matchesSearch = 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" || agent.status === statusFilter;
      
      const matchesType =
        typeFilter === "all" || agent.type === typeFilter;
        
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

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

  // Abre o configurador para qualquer agente do mosaico (inclui agentes de src como Agent sintético)
  const handleConfigurarMosaicAgent = (
    agent: { id: string; name: string; description: string; status: "active" | "inactive"; color: string; icon: string }
  ) => {
    const fullAgent = agents.find((a) => String(a.id) === agent.id);
    if (fullAgent) handleEditAgent(fullAgent);
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

  const handleVerEditarPrompt = (key: string) => {
    const text = promptOverrides[key] ?? PROMPTS_AGENTES[key as keyof typeof PROMPTS_AGENTES] ?? "";
    setEditingPromptKey(key);
    setEditingPromptText(text);
  };

  const handleSalvarPrompt = () => {
    if (!editingPromptKey) return;
    setPromptOverrides((prev) => ({ ...prev, [editingPromptKey]: editingPromptText }));
    setEditingPromptKey(null);
    setEditingPromptText("");
    toast({ title: "Prompt salvo", description: `"${editingPromptKey}" foi atualizado.` });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitle} />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-gray-600 mt-1">{pageDescription}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="agentes">Agentes</TabsTrigger>
              <TabsTrigger value="biblioteca">Biblioteca de prompts</TabsTrigger>
              <TabsTrigger value="consumo-tokens" className="gap-1.5">
                <BarChart3 className="h-4 w-4" />
                Consumo de tokens
              </TabsTrigger>
            </TabsList>

            <TabsContent value="agentes" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-gray-200 bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("mosaico")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    viewMode === "mosaico" ? "bg-legacy-500 text-white" : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Mosaico
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("lista")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    viewMode === "lista" ? "bg-legacy-500 text-white" : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <List className="h-4 w-4" />
                  Lista
                </button>
              </div>
            </div>
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

          {viewMode === "mosaico" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mosaicAgents.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm border">
                  <Bot className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium">Nenhum agente encontrado</h3>
                  <p className="mt-1 text-gray-500">
                    Nenhum agente corresponde aos critérios de filtro selecionados.
                  </p>
                </div>
              ) : (
                mosaicAgents.map((agent, index) => {
                  const letraRef = String.fromCharCode(65 + index);
                  return (
                  <Card key={agent.id} className="flex flex-col overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm"
                            style={{ backgroundColor: agent.color }}
                            title={`Referência ${letraRef}`}
                          >
                            {letraRef}
                          </div>
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${agent.color}20` }}
                          >
                            {getIconComponent(agent.icon)}
                          </div>
                        </div>
                        <Badge variant={agent.status === "active" ? "default" : "outline"} className="shrink-0">
                          {agent.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <CardTitle className="text-base mt-2 line-clamp-1">{agent.name}</CardTitle>
                      <CardDescription className="line-clamp-2 text-sm">{agent.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleConfigurarMosaicAgent(agent)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Configurar
                      </Button>
                    </CardFooter>
                  </Card>
                  );
                })
              )}
            </div>
          ) : (
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
              filteredAgents.map((agent, index) => {
                const letraRef = String.fromCharCode(65 + index);
                return (
                <Accordion type="single" collapsible key={agent.id}>
                  <AccordionItem value={`item-${agent.id}`}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-4 w-full">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                          style={{ backgroundColor: agent.color }}
                          title={`Referência ${letraRef}`}
                        >
                          {letraRef}
                        </div>
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
                            onClick={() => handleVerEditarPrompt(agent.promptKey)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Ver prompt
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditAgent(agent)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                );
              })
            )}
          </div>
          )}
            </TabsContent>

            <TabsContent value="biblioteca" className="space-y-4">
              <div className="rounded-lg border bg-white">
                <ul className="divide-y divide-gray-200">
                  {[...Object.keys(PROMPTS_AGENTES)].sort((a, b) => a.localeCompare(b)).map((key) => (
                    <li
                      key={key}
                      className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50"
                    >
                      <span className="text-sm font-medium text-gray-900 truncate flex-1">
                        {key.replace(/_/g, " ")}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerEditarPrompt(key)}
                          className="gap-1.5"
                        >
                          <Eye className="h-4 w-4" />
                          Ver e editar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => editingPromptKey === key ? handleSalvarPrompt() : handleVerEditarPrompt(key)}
                          className="gap-1.5"
                        >
                          <Save className="h-4 w-4" />
                          Salvar
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="consumo-tokens" className="space-y-4">
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-lg font-semibold">
                      Uso de Tokens
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex rounded-lg border bg-muted/30 p-0.5">
                        <button
                          type="button"
                          onClick={() => setUsagePeriodo("ultimos_30")}
                          className={cn(
                            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            usagePeriodo === "ultimos_30"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Últimos 30 dias
                        </button>
                        <button
                          type="button"
                          onClick={() => setUsagePeriodo("mes")}
                          className={cn(
                            "rounded-md px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2",
                            usagePeriodo === "mes"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <Calendar className="h-4 w-4" />
                          Mês
                        </button>
                      </div>
                      {usagePeriodo === "mes" && (
                        <div className="flex items-center gap-2">
                          <Input
                            id="usage-mes"
                            type="month"
                            value={usageMes}
                            onChange={(e) => setUsageMes(e.target.value)}
                            className="h-9 w-[145px] rounded-lg border bg-background text-sm"
                          />
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchUsage}
                        disabled={usageLoading}
                        className="h-9 shrink-0"
                      >
                        {usageLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Atualizar"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {usageLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="relative h-[240px]">
                      {(() => {
                        const chartData = (() => {
                          if (usageData?.daily?.length) return usageData.daily;
                          if (usagePeriodo === "mes") {
                            const [y, m] = usageMes.split("-").map(Number);
                            const days = new Date(y, m, 0).getDate();
                            return Array.from({ length: days }, (_, i) => {
                              const data = `${y}-${String(m).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
                              return { data, total_tokens: 0 };
                            });
                          }
                          return Array.from({ length: 30 }, (_, i) => {
                            const d = new Date();
                            d.setDate(d.getDate() - 29 + i);
                            const data = d.toISOString().slice(0, 10);
                            return { data, total_tokens: 0 };
                          });
                        })();
                        const xTicks =
                          chartData.length > 0
                            ? [chartData[0].data, chartData[chartData.length - 1].data]
                            : undefined;
                        return (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 16, left: 0, bottom: 24 }}
                          >
                            <XAxis
                              dataKey="data"
                              tick={{ fontSize: 11, fill: "#6b7280" }}
                              tickLine={false}
                              axisLine={false}
                              ticks={xTicks}
                              tickFormatter={(val) =>
                                new Date(val + "T12:00:00").toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "short",
                                })
                              }
                            />
                          <YAxis hide />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.[0]) return null;
                              const d = payload[0].payload;
                              return (
                                <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
                                  <p className="text-sm font-medium">
                                    {new Date(d.data + "T12:00:00").toLocaleDateString("pt-BR", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {d.total_tokens.toLocaleString("pt-BR")} tokens
                                  </p>
                                </div>
                              );
                            }}
                            cursor={{ fill: "rgba(0,0,0,0.03)" }}
                          />
                            <Bar
                              dataKey="total_tokens"
                              fill="#374151"
                              radius={[4, 4, 0, 0]}
                              barCategoryGap="12%"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                        );
                      })()}
                      {usageData && usageData.total === 0 && usageData.daily?.length > 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                          <p className="text-sm font-medium text-muted-foreground">
                            Nenhum consumo registrado
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Os tokens serão exibidos quando os agentes de IA forem utilizados.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Editar Prompt Dialog */}
      <Dialog open={!!editingPromptKey} onOpenChange={(open) => !open && (setEditingPromptKey(null), setEditingPromptText(""))}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Ver e editar prompt</DialogTitle>
            <DialogDescription>
              {editingPromptKey?.replace(/_/g, " ")}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editingPromptText}
            onChange={(e) => setEditingPromptText(e.target.value)}
            className="flex-1 min-h-[300px] font-mono text-sm resize-none"
            placeholder="Conteúdo do prompt..."
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => (setEditingPromptKey(null), setEditingPromptText(""))}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarPrompt}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
      
    </div>
  );
};

export default AdminAgentConfig;
