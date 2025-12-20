import { useState } from "react";
import { Building2, Settings2, CheckCircle, ArrowRight, ArrowLeft, Mail, Phone, Briefcase, User, Check, Loader2, MoreVertical, Edit, Power, PowerOff, FileText, Hash, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useClientPlanConfig, ClientWithPlan, ConfigMode } from "@/hooks/useClientPlanConfig";
import { ModuleConfigurator } from "@/components/admin/ModuleConfigurator";
import { PLAN_PRICES, ADDON_PRICES, BASE_MODULES, ALL_ADDON_MODULES } from "@/utils/moduleMatrix";
import type { CompanySize, ModuleKey } from "@/types/organization";
import { cn } from "@/lib/utils";
const SIZE_OPTIONS: {
  value: CompanySize;
  label: string;
  description: string;
}[] = [{
  value: 'startup',
  label: 'Startup',
  description: 'Até 10 colaboradores'
}, {
  value: 'small',
  label: 'Pequena',
  description: '10-50 colaboradores'
}, {
  value: 'medium',
  label: 'Média',
  description: '50-250 colaboradores'
}, {
  value: 'large',
  label: 'Grande',
  description: '250-1000 colaboradores'
}, {
  value: 'listed',
  label: 'Listada',
  description: 'Capital aberto ou +1000 colaboradores'
}];
const ADDON_OPTIONS: {
  key: string;
  label: string;
  description: string;
}[] = [{
  key: 'esg_maturity',
  label: 'ESG',
  description: 'Ambiental, Social e Governança'
}, {
  key: 'market_intel',
  label: 'Inteligência de Mercado',
  description: 'Análise de mercado e benchmarking'
}, {
  key: 'ai_agents',
  label: 'Agentes de IA',
  description: 'Automação com inteligência artificial'
}, {
  key: 'leadership_performance',
  label: 'Gestão de Pessoas',
  description: 'Desenvolvimento e PDI'
}, {
  key: 'project_submission',
  label: 'Submeter Projetos',
  description: 'Fluxo de aprovação de projetos'
}, {
  key: 'risks',
  label: 'Gestão de Riscos',
  description: 'Monitoramento e mitigação de riscos'
}];
export default function AdminClientManagement() {
  const {
    clients,
    loading,
    createClient,
    savePlanConfig,
    activateClient,
    suspendClient
  } = useClientPlanConfig();

  // Main tab state
  const [activeTab, setActiveTab] = useState('cadastrar');

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Empresa + Admin data
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    cnpj: '',
    sector: '',
    companySize: 'startup' as CompanySize,
    adminName: '',
    adminEmail: '',
    adminPhone: ''
  });
  const [createdClientId, setCreatedClientId] = useState<string | null>(null);

  // Step 2: Plan config with module configurator
  const [configMode, setConfigMode] = useState<ConfigMode>('automatic');
  const [selectedModules, setSelectedModules] = useState<ModuleKey[]>(BASE_MODULES['startup']);
  const [enabledAddons, setEnabledAddons] = useState<string[]>([]);

  // Filter state for "Empresas Cadastradas" tab
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Edit Plan Modal state
  const [editPlanOpen, setEditPlanOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientWithPlan | null>(null);
  const [editSelectedSize, setEditSelectedSize] = useState<CompanySize>('startup');
  const [editEnabledAddons, setEditEnabledAddons] = useState<string[]>([]);

  // "Plano Contratado" tab state
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const selectedCompany = clients.find(c => c.id === selectedCompanyId);

  // New price calculation with modules and mode
  const calculateModulePrice = (size: CompanySize, modules: ModuleKey[], mode: ConfigMode) => {
    if (mode === 'automatic') {
      return PLAN_PRICES[size];
    }
    const basePrice = PLAN_PRICES[size];
    const includedInBase = BASE_MODULES[size];
    const addonsPrice = modules.filter(m => ALL_ADDON_MODULES.includes(m) && !includedInBase.includes(m)).reduce((sum, addon) => sum + (ADDON_PRICES[addon] || 0), 0);
    return basePrice + addonsPrice;
  };

  // Legacy price calculation for edit modal (uses addons array)
  const calculateTotalPrice = (size: CompanySize, addons: string[]) => {
    const basePrice = PLAN_PRICES[size];
    const addonsPrice = addons.reduce((sum, addon) => {
      return sum + (ADDON_PRICES[addon] || 0);
    }, 0);
    return basePrice + addonsPrice;
  };
  const resetWizard = () => {
    setCurrentStep(1);
    setCompanyForm({
      companyName: '',
      cnpj: '',
      sector: '',
      companySize: 'startup',
      adminName: '',
      adminEmail: '',
      adminPhone: ''
    });
    setCreatedClientId(null);
    setConfigMode('automatic');
    setSelectedModules(BASE_MODULES['startup']);
    setEnabledAddons([]);
  };
  const handleCreateCompany = async () => {
    if (!companyForm.companyName || !companyForm.adminEmail || !companyForm.adminName || !companyForm.sector) {
      return;
    }
    setIsSubmitting(true);
    try {
      const newClient = await createClient({
        name: companyForm.adminName,
        email: companyForm.adminEmail,
        company: companyForm.companyName,
        sector: companyForm.sector,
        phone: companyForm.adminPhone
      });
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

    // Extract enabled addons from selected modules
    const addonsFromModules = selectedModules.filter(m => ALL_ADDON_MODULES.includes(m));
    setIsSubmitting(true);
    try {
      await savePlanConfig(createdClientId, {
        company_size: companyForm.companySize,
        config_mode: configMode,
        enabled_modules: selectedModules,
        enabled_addons: addonsFromModules,
        total_price: calculateModulePrice(companyForm.companySize, selectedModules, configMode)
      });
      setCurrentStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleActivateCompany = async () => {
    if (!createdClientId) return;
    setIsSubmitting(true);
    try {
      await activateClient(createdClientId);
      resetWizard();
      setActiveTab('empresas');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const toggleAddon = (addon: string) => {
    setEnabledAddons(prev => prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]);
  };

  // Edit Plan functions
  const handleEditPlan = (client: ClientWithPlan) => {
    setEditingClient(client);
    setEditSelectedSize(client.plan_config?.company_size || 'startup');
    setEditEnabledAddons(client.plan_config?.enabled_addons || []);
    setEditPlanOpen(true);
  };
  const handleSaveEditedPlan = async () => {
    if (!editingClient) return;
    setIsSubmitting(true);
    try {
      await savePlanConfig(editingClient.id, {
        company_size: editSelectedSize,
        enabled_addons: editEnabledAddons,
        total_price: calculateTotalPrice(editSelectedSize, editEnabledAddons),
        status: editingClient.plan_config?.status || 'pending'
      });
      setEditPlanOpen(false);
      setEditingClient(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const toggleEditAddon = (addon: string) => {
    setEditEnabledAddons(prev => prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]);
  };
  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>;
      case 'suspended':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Inativo</Badge>;
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
    return <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Gestão de Empresas" />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>;
  }
  return <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestão de Empresas" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold">Gestão de Empresas</h1>
              <p className="text-muted-foreground">Cadastre empresas, configure planos e gerencie acessos</p>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl">
                <TabsTrigger value="cadastrar" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Cadastrar Empresa</span>
                  <span className="sm:hidden">Cadastrar</span>
                </TabsTrigger>
                <TabsTrigger value="plano" className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Plano Contratado</span>
                  <span className="sm:hidden">Plano</span>
                </TabsTrigger>
                <TabsTrigger value="empresas" className="gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Empresas Cadastradas</span>
                  <span className="sm:hidden">Empresas</span>
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: Cadastrar Empresa */}
              <TabsContent value="cadastrar" className="space-y-6">
                <Card className="border-2 border-primary/20">
                  <CardHeader className="pb-4">
                    <CardTitle>Cadastrar Nova Empresa</CardTitle>
                    <CardDescription>Preencha os dados para criar uma nova empresa no sistema</CardDescription>
                    
                    {/* Stepper */}
                    <div className="flex items-center gap-2 mt-4">
                      {[{
                      step: 1,
                      label: 'Empresa + Admin',
                      icon: Building2
                    }, {
                      step: 2,
                      label: 'Configurar Plano',
                      icon: Settings2
                    }, {
                      step: 3,
                      label: 'Ativar Empresa',
                      icon: CheckCircle
                    }].map(({
                      step,
                      label,
                      icon: Icon
                    }, index) => <div key={step} className="flex items-center">
                          <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors", currentStep === step ? "bg-primary text-primary-foreground" : currentStep > step ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground")}>
                            {currentStep > step ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                            <span className="hidden sm:inline">{label}</span>
                          </div>
                          {index < 2 && <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />}
                        </div>)}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Step 1: Empresa + Admin */}
                    {currentStep === 1 && <div className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                          {/* Coluna 1: Dados da Empresa */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground border-b pb-2">
                              <Building2 className="h-4 w-4" />
                              DADOS DA EMPRESA
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="companyName">Nome da Empresa *</Label>
                              <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="companyName" placeholder="Empresa LTDA" className="pl-10" value={companyForm.companyName} onChange={e => setCompanyForm(prev => ({
                              ...prev,
                              companyName: e.target.value
                            }))} />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="cnpj">CNPJ (opcional)</Label>
                              <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="cnpj" placeholder="00.000.000/0001-00" className="pl-10" value={companyForm.cnpj} onChange={e => setCompanyForm(prev => ({
                              ...prev,
                              cnpj: e.target.value
                            }))} />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="sector">Setor *</Label>
                              <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="sector" placeholder="Tecnologia, Indústria, Serviços..." className="pl-10" value={companyForm.sector} onChange={e => setCompanyForm(prev => ({
                              ...prev,
                              sector: e.target.value
                            }))} />
                              </div>
                            </div>

                            
                          </div>

                          {/* Coluna 2: Dados do Admin */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground border-b pb-2">
                              <User className="h-4 w-4" />
                              ADMINISTRADOR DA EMPRESA
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="adminName">Nome do Responsável *</Label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="adminName" placeholder="João Silva" className="pl-10" value={companyForm.adminName} onChange={e => setCompanyForm(prev => ({
                              ...prev,
                              adminName: e.target.value
                            }))} />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="adminEmail">Email *</Label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="adminEmail" type="email" placeholder="admin@empresa.com" className="pl-10" value={companyForm.adminEmail} onChange={e => setCompanyForm(prev => ({
                              ...prev,
                              adminEmail: e.target.value
                            }))} />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="adminPhone">Telefone (opcional)</Label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="adminPhone" placeholder="(11) 99999-9999" className="pl-10" value={companyForm.adminPhone} onChange={e => setCompanyForm(prev => ({
                              ...prev,
                              adminPhone: e.target.value
                            }))} />
                              </div>
                            </div>

                          </div>
                        </div>
                        
                        <div className="flex justify-end pt-4 border-t">
                          <Button onClick={handleCreateCompany} disabled={!companyForm.companyName || !companyForm.adminEmail || !companyForm.adminName || !companyForm.sector || isSubmitting} className="gap-2">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>
                                Próximo
                                <ArrowRight className="h-4 w-4" />
                              </>}
                          </Button>
                        </div>
                      </div>}

                    {/* Step 2: Configurar Plano com ModuleConfigurator */}
                    {currentStep === 2 && <div className="space-y-6">
                        {/* Resumo do porte selecionado */}
                        <Card className="bg-primary/5 border-primary/20">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-muted-foreground">Porte selecionado</div>
                                <div className="font-semibold">
                                  {SIZE_OPTIONS.find(s => s.value === companyForm.companySize)?.label} - {SIZE_OPTIONS.find(s => s.value === companyForm.companySize)?.description}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">Preço base</div>
                                <div className="text-xl font-bold text-primary">
                                  R$ {PLAN_PRICES[companyForm.companySize].toLocaleString('pt-BR')}/mês
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Module Configurator */}
                        <ModuleConfigurator companySize={companyForm.companySize} mode={configMode} onModeChange={setConfigMode} selectedModules={selectedModules} onModulesChange={setSelectedModules} />

                        <div className="flex justify-between pt-4 border-t">
                          <Button variant="outline" onClick={() => setCurrentStep(1)} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar
                          </Button>
                          <Button onClick={handleSavePlan} disabled={isSubmitting} className="gap-2">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>
                                Próximo
                                <ArrowRight className="h-4 w-4" />
                              </>}
                          </Button>
                        </div>
                      </div>}

                    {/* Step 3: Ativar Empresa */}
                    {currentStep === 3 && <div className="space-y-6">
                        <div className="text-center py-6">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4">
                            <CheckCircle className="h-8 w-8" />
                          </div>
                          <h3 className="text-xl font-semibold">Pronto para ativar!</h3>
                          <p className="text-muted-foreground mt-1">Revise as informações antes de ativar a empresa</p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          {/* Resumo da empresa */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                Dados da Empresa
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Nome:</span>
                                <span className="font-medium">{companyForm.companyName}</span>
                              </div>
                              {companyForm.cnpj && <div className="flex justify-between">
                                  <span className="text-muted-foreground">CNPJ:</span>
                                  <span className="font-medium">{companyForm.cnpj}</span>
                                </div>}
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Setor:</span>
                                <span className="font-medium">{companyForm.sector}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Porte:</span>
                                <span className="font-medium">
                                  {SIZE_OPTIONS.find(s => s.value === companyForm.companySize)?.label}
                                </span>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Resumo do admin */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Administrador
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Nome:</span>
                                <span className="font-medium">{companyForm.adminName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-medium">{companyForm.adminEmail}</span>
                              </div>
                              {companyForm.adminPhone && <div className="flex justify-between">
                                  <span className="text-muted-foreground">Telefone:</span>
                                  <span className="font-medium">{companyForm.adminPhone}</span>
                                </div>}
                            </CardContent>
                          </Card>
                        </div>

                        {/* Resumo do plano */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Settings2 className="h-4 w-4" />
                              Configuração do Plano
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Preço base:</span>
                              <span className="font-medium">
                                R$ {PLAN_PRICES[companyForm.companySize].toLocaleString('pt-BR')}/mês
                              </span>
                            </div>
                            {selectedModules.filter(m => ALL_ADDON_MODULES.includes(m)).length > 0 && <div className="pt-2 border-t">
                                <span className="text-muted-foreground">Módulos selecionados:</span>
                                <div className="mt-1">
                                  <Badge variant="outline">
                                    {selectedModules.length} módulos ({configMode === 'automatic' ? 'Automático' : 'Manual'})
                                  </Badge>
                                </div>
                              </div>}
                            <div className="pt-2 border-t flex justify-between font-bold">
                              <span>Total:</span>
                              <span className="text-primary">
                                R$ {calculateModulePrice(companyForm.companySize, selectedModules, configMode).toLocaleString('pt-BR')}/mês
                              </span>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="flex justify-between pt-4">
                          <Button variant="outline" onClick={() => setCurrentStep(2)} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar
                          </Button>
                          <Button onClick={handleActivateCompany} disabled={isSubmitting} className="gap-2 bg-green-600 hover:bg-green-700">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>
                                <Power className="h-4 w-4" />
                                Ativar Empresa
                              </>}
                          </Button>
                        </div>
                      </div>}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB 2: Plano Contratado */}
              <TabsContent value="plano" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Gerenciar Plano de Empresa
                    </CardTitle>
                    <CardDescription>Selecione uma empresa para visualizar e editar o plano contratado</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Seletor de empresa */}
                    <div className="space-y-2">
                      <Label>Selecione a Empresa</Label>
                      <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                        <SelectTrigger className="w-full max-w-md">
                          <SelectValue placeholder="Escolha uma empresa..." />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map(client => <SelectItem key={client.id} value={client.id}>
                              {client.company || client.name} {client.plan_config ? '' : '(Sem plano)'}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Detalhes do plano */}
                    {selectedCompany ? <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          {/* Info da empresa */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                Dados da Empresa
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Empresa:</span>
                                <span className="font-medium">{selectedCompany.company || '-'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Responsável:</span>
                                <span className="font-medium">{selectedCompany.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-medium">{selectedCompany.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Setor:</span>
                                <span className="font-medium">{selectedCompany.sector || '-'}</span>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Info do plano */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <Settings2 className="h-4 w-4" />
                                Plano Atual
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                              {selectedCompany.plan_config ? <>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status:</span>
                                    {getStatusBadge(selectedCompany.plan_config.status)}
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Porte:</span>
                                    <span className="font-medium">
                                      {SIZE_OPTIONS.find(s => s.value === selectedCompany.plan_config?.company_size)?.label || selectedCompany.plan_config.company_size}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Add-ons:</span>
                                    <span className="font-medium">
                                      {selectedCompany.plan_config.enabled_addons?.length || 0} módulo(s)
                                    </span>
                                  </div>
                                  <div className="flex justify-between pt-2 border-t">
                                    <span className="text-muted-foreground font-semibold">Valor:</span>
                                    <span className="font-bold text-primary">
                                      R$ {selectedCompany.plan_config.total_price.toLocaleString('pt-BR')}/mês
                                    </span>
                                  </div>
                                </> : <div className="text-center py-4 text-muted-foreground">
                                  Esta empresa ainda não possui um plano configurado.
                                </div>}
                            </CardContent>
                          </Card>
                        </div>

                        {/* Add-ons ativos */}
                        {selectedCompany.plan_config && selectedCompany.plan_config.enabled_addons?.length > 0 && <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Módulos Habilitados</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-2">
                                {selectedCompany.plan_config.enabled_addons.map(addon => <Badge key={addon} variant="secondary" className="px-3 py-1">
                                    {ADDON_OPTIONS.find(a => a.key === addon)?.label || addon}
                                  </Badge>)}
                              </div>
                            </CardContent>
                          </Card>}

                        {/* Botões de ação */}
                        <div className="flex gap-3 pt-4">
                          <Button onClick={() => handleEditPlan(selectedCompany)} className="gap-2">
                            <Edit className="h-4 w-4" />
                            Editar Plano
                          </Button>
                          {selectedCompany.plan_config?.status === 'active' ? <Button variant="outline" className="gap-2 text-amber-600 border-amber-600 hover:bg-amber-600/10" onClick={() => suspendClient(selectedCompany.id)}>
                              <PowerOff className="h-4 w-4" />
                              Inativar
                            </Button> : selectedCompany.plan_config?.status === 'pending' || selectedCompany.plan_config?.status === 'suspended' ? <Button variant="outline" className="gap-2 text-green-600 border-green-600 hover:bg-green-600/10" onClick={() => activateClient(selectedCompany.id)}>
                              <Power className="h-4 w-4" />
                              Ativar
                            </Button> : null}
                        </div>
                      </div> : <div className="text-center py-12 text-muted-foreground">
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Selecione uma empresa para visualizar os detalhes do plano</p>
                      </div>}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB 3: Empresas Cadastradas */}
              <TabsContent value="empresas" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Empresas Cadastradas</CardTitle>
                        <CardDescription>{clients.length} empresa(s) no sistema</CardDescription>
                      </div>
                      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                        <TabsList>
                          <TabsTrigger value="all">Todas</TabsTrigger>
                          <TabsTrigger value="active">Ativas</TabsTrigger>
                          <TabsTrigger value="pending">Pendentes</TabsTrigger>
                          <TabsTrigger value="suspended">Inativas</TabsTrigger>
                          <TabsTrigger value="no-plan">Sem Plano</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Administrador</TableHead>
                          <TableHead>Empresa</TableHead>
                          <TableHead>Setor</TableHead>
                          <TableHead>Plano</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClients.length === 0 ? <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              Nenhuma empresa encontrada
                            </TableCell>
                          </TableRow> : filteredClients.map(client => <TableRow key={client.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{client.name}</div>
                                  <div className="text-xs text-muted-foreground">{client.email}</div>
                                </div>
                              </TableCell>
                              <TableCell>{client.company || '-'}</TableCell>
                              <TableCell>{client.sector || '-'}</TableCell>
                              <TableCell>
                                {client.plan_config ? <Badge variant="outline">
                                    {SIZE_OPTIONS.find(s => s.value === client.plan_config?.company_size)?.label || client.plan_config.company_size}
                                  </Badge> : <span className="text-muted-foreground text-sm">-</span>}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(client.plan_config?.status)}
                              </TableCell>
                              <TableCell className="text-right">
                                {client.plan_config ? <span className="font-medium">
                                    R$ {client.plan_config.total_price.toLocaleString('pt-BR')}/mês
                                  </span> : <span className="text-muted-foreground">-</span>}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="gap-2" onClick={() => handleEditPlan(client)}>
                                      <Edit className="h-4 w-4" />
                                      Editar Plano
                                    </DropdownMenuItem>
                                    {client.plan_config?.status === 'active' ? <DropdownMenuItem className="gap-2 text-amber-600" onClick={() => suspendClient(client.id)}>
                                        <PowerOff className="h-4 w-4" />
                                        Inativar
                                      </DropdownMenuItem> : client.plan_config?.status === 'pending' || client.plan_config?.status === 'suspended' ? <DropdownMenuItem className="gap-2 text-green-600" onClick={() => activateClient(client.id)}>
                                        <Power className="h-4 w-4" />
                                        Ativar
                                      </DropdownMenuItem> : null}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>)}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Modal de Edição de Plano */}
      <Dialog open={editPlanOpen} onOpenChange={setEditPlanOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Plano</DialogTitle>
            <DialogDescription>
              {editingClient?.company} - {editingClient?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Seletor de porte */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Porte da Empresa</Label>
              <div className="grid gap-2">
                {SIZE_OPTIONS.map(option => <button key={option.value} onClick={() => setEditSelectedSize(option.value)} className={cn("p-3 rounded-lg border text-left transition-all flex justify-between items-center", editSelectedSize === option.value ? "border-primary bg-primary/10 ring-2 ring-primary/20" : "border-border hover:border-primary/50")}>
                    <div>
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                    <div className="text-sm font-bold text-primary">
                      R$ {PLAN_PRICES[option.value].toLocaleString('pt-BR')}/mês
                    </div>
                  </button>)}
              </div>
            </div>

            {/* Add-ons */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Módulos Adicionais (Add-ons)</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {ADDON_OPTIONS.map(addon => <div key={addon.key} className={cn("p-3 rounded-lg border transition-all", editEnabledAddons.includes(addon.key) ? "border-primary bg-primary/5" : "border-border")}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{addon.label}</div>
                        <div className="text-xs text-muted-foreground">{addon.description}</div>
                        <div className="text-sm font-semibold text-primary mt-1">
                          +R$ {(ADDON_PRICES[addon.key] || 0).toLocaleString('pt-BR')}/mês
                        </div>
                      </div>
                      <Switch checked={editEnabledAddons.includes(addon.key)} onCheckedChange={() => toggleEditAddon(addon.key)} />
                    </div>
                  </div>)}
              </div>
            </div>

            {/* Resumo de preço */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Total mensal</div>
                    <div className="text-2xl font-bold text-primary">
                      R$ {calculateTotalPrice(editSelectedSize, editEnabledAddons).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>Base: R$ {PLAN_PRICES[editSelectedSize].toLocaleString('pt-BR')}</div>
                    {editEnabledAddons.length > 0 && <div>+ {editEnabledAddons.length} add-on(s)</div>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPlanOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEditedPlan} disabled={isSubmitting} className="gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>
                  <Check className="h-4 w-4" />
                  Salvar Alterações
                </>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}