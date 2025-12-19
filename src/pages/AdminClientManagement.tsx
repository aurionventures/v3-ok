import { useState } from "react";
import { 
  UserPlus, 
  Settings2, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Briefcase,
  User,
  Check,
  Loader2,
  MoreVertical,
  Edit,
  Power,
  PowerOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useClientPlanConfig } from "@/hooks/useClientPlanConfig";
import { PLAN_PRICES, ADDON_PRICES } from "@/utils/moduleMatrix";
import type { CompanySize } from "@/types/organization";
import { cn } from "@/lib/utils";

const SIZE_OPTIONS: { value: CompanySize; label: string; description: string }[] = [
  { value: 'startup', label: 'Startup', description: 'Até 10 colaboradores' },
  { value: 'small', label: 'Pequena', description: '10-50 colaboradores' },
  { value: 'medium', label: 'Média', description: '50-250 colaboradores' },
  { value: 'large', label: 'Grande', description: '250-1000 colaboradores' },
  { value: 'listed', label: 'Listada', description: 'Capital aberto ou +1000 colaboradores' },
];

const ADDON_OPTIONS: { key: string; label: string; description: string }[] = [
  { key: 'esg_maturity', label: 'ESG', description: 'Ambiental, Social e Governança' },
  { key: 'market_intel', label: 'Inteligência de Mercado', description: 'Análise de mercado e benchmarking' },
  { key: 'ai_agents', label: 'Agentes de IA', description: 'Automação com inteligência artificial' },
  { key: 'leadership_performance', label: 'Gestão de Pessoas', description: 'Desenvolvimento e PDI' },
  { key: 'project_submission', label: 'Submeter Projetos', description: 'Fluxo de aprovação de projetos' },
  { key: 'risks', label: 'Gestão de Riscos', description: 'Monitoramento e mitigação de riscos' },
];

export default function AdminClientManagement() {
  const { clients, loading, createClient, savePlanConfig, activateClient, suspendClient } = useClientPlanConfig();
  
  // Wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Step 1: Client data
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    company: '',
    sector: '',
    phone: ''
  });
  const [createdClientId, setCreatedClientId] = useState<string | null>(null);
  
  // Step 2: Plan config
  const [selectedSize, setSelectedSize] = useState<CompanySize>('startup');
  const [enabledAddons, setEnabledAddons] = useState<string[]>([]);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const calculateTotalPrice = () => {
    const basePrice = PLAN_PRICES[selectedSize];
    const addonsPrice = enabledAddons.reduce((sum, addon) => {
      return sum + (ADDON_PRICES[addon] || 0);
    }, 0);
    return basePrice + addonsPrice;
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setClientForm({ name: '', email: '', company: '', sector: '', phone: '' });
    setCreatedClientId(null);
    setSelectedSize('startup');
    setEnabledAddons([]);
    setWizardOpen(false);
  };

  const handleCreateClient = async () => {
    if (!clientForm.name || !clientForm.email || !clientForm.company || !clientForm.sector) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newClient = await createClient(clientForm);
      setCreatedClientId(newClient.id);
      setCurrentStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePlan = async () => {
    if (!createdClientId) return;
    
    setIsSubmitting(true);
    try {
      await savePlanConfig(createdClientId, {
        company_size: selectedSize,
        enabled_addons: enabledAddons,
        total_price: calculateTotalPrice()
      });
      setCurrentStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivateClient = async () => {
    if (!createdClientId) return;
    
    setIsSubmitting(true);
    try {
      await activateClient(createdClientId);
      resetWizard();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAddon = (addon: string) => {
    setEnabledAddons(prev => 
      prev.includes(addon) 
        ? prev.filter(a => a !== addon)
        : [...prev, addon]
    );
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Suspenso</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendente</Badge>;
      default:
        return <Badge variant="outline">Sem plano</Badge>;
    }
  };

  const filteredClients = clients.filter(client => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'no-plan') return !client.plan_config;
    return client.plan_config?.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Gestão de Clientes" />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestão de Clientes" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header com botão de criar */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Gestão de Clientes</h1>
                <p className="text-muted-foreground">Crie, configure planos e ative clientes</p>
              </div>
              <Button onClick={() => setWizardOpen(true)} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Novo Cliente
              </Button>
            </div>

            {/* Wizard de criação */}
            {wizardOpen && (
              <Card className="border-2 border-primary/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>Criar Novo Cliente</CardTitle>
                    <Button variant="ghost" size="sm" onClick={resetWizard}>
                      Cancelar
                    </Button>
                  </div>
                  
                  {/* Stepper */}
                  <div className="flex items-center gap-2 mt-4">
                    {[
                      { step: 1, label: 'Dados do Cliente', icon: UserPlus },
                      { step: 2, label: 'Configurar Plano', icon: Settings2 },
                      { step: 3, label: 'Ativar', icon: CheckCircle }
                    ].map(({ step, label, icon: Icon }, index) => (
                      <div key={step} className="flex items-center">
                        <div className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                          currentStep === step 
                            ? "bg-primary text-primary-foreground" 
                            : currentStep > step 
                              ? "bg-green-500/20 text-green-400"
                              : "bg-muted text-muted-foreground"
                        )}>
                          {currentStep > step ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                          <span className="hidden sm:inline">{label}</span>
                        </div>
                        {index < 2 && (
                          <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Step 1: Dados do Cliente */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome do Responsável</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="name"
                              placeholder="João Silva"
                              className="pl-10"
                              value={clientForm.name}
                              onChange={e => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="joao@empresa.com"
                              className="pl-10"
                              value={clientForm.email}
                              onChange={e => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Nome da Empresa</Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="company"
                              placeholder="Empresa LTDA"
                              className="pl-10"
                              value={clientForm.company}
                              onChange={e => setClientForm(prev => ({ ...prev, company: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sector">Setor</Label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="sector"
                              placeholder="Tecnologia"
                              className="pl-10"
                              value={clientForm.sector}
                              onChange={e => setClientForm(prev => ({ ...prev, sector: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="phone">Telefone (opcional)</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              placeholder="(11) 99999-9999"
                              className="pl-10"
                              value={clientForm.phone}
                              onChange={e => setClientForm(prev => ({ ...prev, phone: e.target.value }))}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button 
                          onClick={handleCreateClient} 
                          disabled={!clientForm.name || !clientForm.email || !clientForm.company || !clientForm.sector || isSubmitting}
                          className="gap-2"
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              Próximo
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Configurar Plano */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      {/* Seletor de porte */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Porte da Empresa</Label>
                        <div className="grid gap-2 sm:grid-cols-5">
                          {SIZE_OPTIONS.map(option => (
                            <button
                              key={option.value}
                              onClick={() => setSelectedSize(option.value)}
                              className={cn(
                                "p-3 rounded-lg border text-left transition-all",
                                selectedSize === option.value
                                  ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <div className="font-medium text-sm">{option.label}</div>
                              <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
                              <div className="text-sm font-bold text-primary mt-2">
                                R$ {PLAN_PRICES[option.value].toLocaleString('pt-BR')}/mês
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Add-ons */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Módulos Adicionais (Add-ons)</Label>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {ADDON_OPTIONS.map(addon => (
                            <div
                              key={addon.key}
                              className={cn(
                                "p-4 rounded-lg border transition-all",
                                enabledAddons.includes(addon.key)
                                  ? "border-primary bg-primary/5"
                                  : "border-border"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-sm">{addon.label}</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">{addon.description}</div>
                                  <div className="text-sm font-semibold text-primary mt-2">
                                    +R$ {(ADDON_PRICES[addon.key] || 0).toLocaleString('pt-BR')}/mês
                                  </div>
                                </div>
                                <Switch
                                  checked={enabledAddons.includes(addon.key)}
                                  onCheckedChange={() => toggleAddon(addon.key)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resumo de preço */}
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-muted-foreground">Total mensal</div>
                              <div className="text-2xl font-bold text-primary">
                                R$ {calculateTotalPrice().toLocaleString('pt-BR')}
                              </div>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <div>Base: R$ {PLAN_PRICES[selectedSize].toLocaleString('pt-BR')}</div>
                              {enabledAddons.length > 0 && (
                                <div>+ {enabledAddons.length} add-on(s)</div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={() => setCurrentStep(1)} className="gap-2">
                          <ArrowLeft className="h-4 w-4" />
                          Voltar
                        </Button>
                        <Button onClick={handleSavePlan} disabled={isSubmitting} className="gap-2">
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              Próximo
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Ativar Cliente */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="text-center py-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4">
                          <CheckCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold">Pronto para ativar!</h3>
                        <p className="text-muted-foreground mt-1">Revise as informações antes de ativar o cliente</p>
                      </div>

                      {/* Resumo do cliente */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Dados do Cliente</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Nome:</span>
                            <span className="font-medium">{clientForm.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">{clientForm.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Empresa:</span>
                            <span className="font-medium">{clientForm.company}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Setor:</span>
                            <span className="font-medium">{clientForm.sector}</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Resumo do plano */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Configuração do Plano</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Porte:</span>
                            <span className="font-medium">
                              {SIZE_OPTIONS.find(s => s.value === selectedSize)?.label}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Preço base:</span>
                            <span className="font-medium">
                              R$ {PLAN_PRICES[selectedSize].toLocaleString('pt-BR')}/mês
                            </span>
                          </div>
                          {enabledAddons.length > 0 && (
                            <div className="pt-2 border-t">
                              <span className="text-muted-foreground">Add-ons:</span>
                              <div className="mt-1 space-y-1">
                                {enabledAddons.map(addon => (
                                  <div key={addon} className="flex justify-between pl-2">
                                    <span>{ADDON_OPTIONS.find(a => a.key === addon)?.label}</span>
                                    <span className="text-primary">
                                      +R$ {(ADDON_PRICES[addon] || 0).toLocaleString('pt-BR')}/mês
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="pt-2 border-t flex justify-between font-bold">
                            <span>Total:</span>
                            <span className="text-primary">
                              R$ {calculateTotalPrice().toLocaleString('pt-BR')}/mês
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={() => setCurrentStep(2)} className="gap-2">
                          <ArrowLeft className="h-4 w-4" />
                          Voltar
                        </Button>
                        <Button onClick={handleActivateClient} disabled={isSubmitting} className="gap-2 bg-green-600 hover:bg-green-700">
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Power className="h-4 w-4" />
                              Ativar Cliente
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Lista de clientes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Clientes Cadastrados</CardTitle>
                    <CardDescription>{clients.length} cliente(s) no sistema</CardDescription>
                  </div>
                  <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                    <TabsList>
                      <TabsTrigger value="all">Todos</TabsTrigger>
                      <TabsTrigger value="active">Ativos</TabsTrigger>
                      <TabsTrigger value="pending">Pendentes</TabsTrigger>
                      <TabsTrigger value="no-plan">Sem Plano</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Setor</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Nenhum cliente encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClients.map(client => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{client.name}</div>
                              <div className="text-xs text-muted-foreground">{client.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{client.company || '-'}</TableCell>
                          <TableCell>{client.sector || '-'}</TableCell>
                          <TableCell>
                            {client.plan_config ? (
                              <Badge variant="outline">
                                {SIZE_OPTIONS.find(s => s.value === client.plan_config?.company_size)?.label || client.plan_config.company_size}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(client.plan_config?.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            {client.plan_config ? (
                              <span className="font-medium">
                                R$ {client.plan_config.total_price.toLocaleString('pt-BR')}/mês
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="gap-2">
                                  <Edit className="h-4 w-4" />
                                  Editar Plano
                                </DropdownMenuItem>
                                {client.plan_config?.status === 'active' ? (
                                  <DropdownMenuItem 
                                    className="gap-2 text-red-500"
                                    onClick={() => suspendClient(client.id)}
                                  >
                                    <PowerOff className="h-4 w-4" />
                                    Suspender
                                  </DropdownMenuItem>
                                ) : client.plan_config?.status === 'pending' ? (
                                  <DropdownMenuItem 
                                    className="gap-2 text-green-500"
                                    onClick={() => activateClient(client.id)}
                                  >
                                    <Power className="h-4 w-4" />
                                    Ativar
                                  </DropdownMenuItem>
                                ) : null}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
