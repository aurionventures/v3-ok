import { useState } from "react";
import { Bot, Key, Settings, Save, Plus, Trash2, FileText, Brain, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Agent {
  id: number;
  name: string;
  description: string;
  active: boolean;
  icon: string;
  color: string;
  capabilities: string[];
}

export const AIConfiguration = () => {
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2000]);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: "",
    description: "",
    capabilities: [] as string[],
  });

  const handleSaveConfig = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações de IA foram atualizadas com sucesso.",
    });
  };

  const [agents, setAgents] = useState<Agent[]>([
    { 
      id: 1, 
      name: "Analista de Documentos", 
      description: "Análise automatizada de documentos societários, contratos e relatórios", 
      active: true,
      icon: "FileText",
      color: "blue",
      capabilities: ["Análise de PDFs", "Extração de dados", "Validação de compliance"]
    },
    { 
      id: 2, 
      name: "Assistente de Governança", 
      description: "Apoio na estruturação de conselhos, políticas e processos de governança", 
      active: true,
      icon: "Settings",
      color: "purple",
      capabilities: ["Estruturação de conselhos", "Políticas de governança", "Processos decisórios"]
    },
    { 
      id: 3, 
      name: "Inteligência Estratégica", 
      description: "Consolidação de insights ESG, riscos sistêmicos e maturidade organizacional", 
      active: true,
      icon: "TrendingUp",
      color: "green",
      capabilities: ["Análise ESG", "Gestão de riscos", "Indicadores de maturidade"]
    },
  ]);

  const handleToggleAgent = (agentId: number) => {
    setAgents(agents.map(agent => 
      agent.id === agentId ? { ...agent, active: !agent.active } : agent
    ));
    toast({
      title: "Status atualizado",
      description: "O status do agente foi alterado com sucesso.",
    });
  };

  const handleCreateAgent = () => {
    if (!newAgent.name || !newAgent.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const agent: Agent = {
      id: agents.length + 1,
      name: newAgent.name,
      description: newAgent.description,
      active: true,
      icon: "Bot",
      color: "gray",
      capabilities: newAgent.capabilities,
    };

    setAgents([...agents, agent]);
    setNewAgent({ name: "", description: "", capabilities: [] });
    setShowCreateAgent(false);
    
    toast({
      title: "Agente criado",
      description: "O novo agente foi adicionado com sucesso.",
    });
  };

  const getAgentIcon = (iconName: string) => {
    switch(iconName) {
      case "FileText": return <FileText className="h-5 w-5" />;
      case "Settings": return <Settings className="h-5 w-5" />;
      case "TrendingUp": return <TrendingUp className="h-5 w-5" />;
      case "Brain": return <Brain className="h-5 w-5" />;
      default: return <Bot className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Configuração da API OpenAI
          </CardTitle>
          <CardDescription>
            Configure as credenciais e parâmetros para acesso aos modelos de IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Ativar Integração de IA</Label>
              <p className="text-sm text-muted-foreground">
                Habilitar ou desabilitar todos os agentes de IA
              </p>
            </div>
            <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
          </div>

          {aiEnabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key da OpenAI</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Sua chave API será armazenada de forma segura e criptografada
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Modelo Padrão</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger id="model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o (Mais poderoso)</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini (Recomendado)</SelectItem>
                    <SelectItem value="gpt-5">GPT-5 (Avançado)</SelectItem>
                    <SelectItem value="gpt-5-mini">GPT-5 Mini</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Temperatura: {temperature[0]}</Label>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Controla a criatividade das respostas (0 = preciso, 1 = criativo)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Máximo de Tokens: {maxTokens[0]}</Label>
                <Slider
                  value={maxTokens}
                  onValueChange={setMaxTokens}
                  min={500}
                  max={4000}
                  step={100}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Define o tamanho máximo das respostas geradas
                </p>
              </div>

              <Button onClick={handleSaveConfig} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Gerenciamento de Agentes
              </CardTitle>
              <CardDescription>
                Configure e personalize os agentes de IA disponíveis para os clientes
              </CardDescription>
            </div>
            <Dialog open={showCreateAgent} onOpenChange={setShowCreateAgent}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Novo Agente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Novo Agente de IA</DialogTitle>
                  <DialogDescription>
                    Configure um novo agente personalizado para atender necessidades específicas
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="agent-name">Nome do Agente *</Label>
                    <Input
                      id="agent-name"
                      placeholder="Ex: Auditor de Compliance"
                      value={newAgent.name}
                      onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agent-description">Descrição *</Label>
                    <Textarea
                      id="agent-description"
                      placeholder="Descreva a função e especialidade deste agente..."
                      value={newAgent.description}
                      onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Capacidades</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Análise de documentos", "Validação de compliance", "Geração de relatórios", "Processamento de linguagem natural", "Análise de dados", "Integração com sistemas"].map((capability) => (
                        <div key={capability} className="flex items-center space-x-2">
                          <Checkbox
                            id={capability}
                            checked={newAgent.capabilities.includes(capability)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewAgent({
                                  ...newAgent,
                                  capabilities: [...newAgent.capabilities, capability],
                                });
                              } else {
                                setNewAgent({
                                  ...newAgent,
                                  capabilities: newAgent.capabilities.filter((c) => c !== capability),
                                });
                              }
                            }}
                          />
                          <label htmlFor={capability} className="text-sm cursor-pointer">
                            {capability}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowCreateAgent(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateAgent}>
                      Criar Agente
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents.map(agent => (
              <Card key={agent.id} className="border-l-4" style={{ borderLeftColor: `var(--${agent.color})` }}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg bg-${agent.color}-100 dark:bg-${agent.color}-900/20`}>
                        {getAgentIcon(agent.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{agent.name}</h4>
                          <Badge variant={agent.active ? "default" : "secondary"}>
                            {agent.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {agent.description}
                        </p>
                        {agent.capabilities && agent.capabilities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {agent.capabilities.map((capability, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {capability}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Settings className="h-3 w-3 mr-1" />
                            Configurar
                          </Button>
                          <Button variant="outline" size="sm">
                            Testar
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Switch 
                      checked={agent.active} 
                      onCheckedChange={() => handleToggleAgent(agent.id)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações por Cliente
          </CardTitle>
          <CardDescription>
            Personalize os parâmetros de IA para cada cliente específico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Grupo Insper</p>
                <p className="text-sm text-muted-foreground">Configurações personalizadas ativas</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Editar</Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Configuração por Cliente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
