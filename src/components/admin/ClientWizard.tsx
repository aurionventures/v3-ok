/**
 * ClientWizard - Wizard de Cadastro e Ativação de Clientes
 * 
 * Fluxo completo em 3 etapas:
 * 1. Dados da Empresa + Admin
 * 2. Configuração do Plano
 * 3. Ativação
 */

import { useState, useEffect } from 'react';
import { 
  Building2, User, Settings, CheckCircle, ArrowRight, ArrowLeft, 
  Loader2, Mail, Phone, Briefcase, Search, Zap, Crown, Shield
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import type { CompanySize, ModuleKey } from '@/types/organization';
import { ModuleConfigurator, ConfigMode as ModuleConfigMode } from '@/components/admin/ModuleConfigurator';
import { 
  BASE_MODULES, 
  ALL_ADDON_MODULES, 
  PLAN_PRICES,
  calculateTotalPrice
} from '@/utils/moduleMatrix';

// Tipos
export type ConfigMode = 'automatic' | 'manual';
export type ClientOrigin = 'plg' | 'comercial' | 'parceiro' | 'indicacao';

interface ClientFormData {
  // Empresa
  companyName: string;
  cnpj: string;
  sector: string;
  companySize: CompanySize;
  // Admin
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  // Meta
  origin: ClientOrigin;
  partnerId?: string;
}

interface PlanConfig {
  configMode: ConfigMode;
  selectedModules: ModuleKey[];
  enabledAddons: string[];
  totalPrice: number;
}

interface ActivationConfig {
  isTrial: boolean;
  trialDays: number;
  sendWelcomeEmail: boolean;
  commercialNotes: string;
  generateCredentials: boolean;
}

interface ClientWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plgLeadEmail?: string; // Para pré-popular com dados de lead PLG
}

// Setores disponíveis
const SECTORS = [
  'Tecnologia',
  'Indústria',
  'Serviços',
  'Varejo',
  'Financeiro',
  'Saúde',
  'Educação',
  'Agronegócio',
  'Construção Civil',
  'Energia',
  'Holding Familiar',
  'Outro'
];

// Portes de empresa
const COMPANY_SIZES: { value: CompanySize; label: string; description: string }[] = [
  { value: 'startup', label: 'Startup', description: 'Até R$ 4,8M/ano' },
  { value: 'small', label: 'Pequena', description: 'R$ 4,8M - R$ 16M/ano' },
  { value: 'medium', label: 'Média', description: 'R$ 16M - R$ 90M/ano' },
  { value: 'large', label: 'Grande', description: 'R$ 90M - R$ 300M/ano' },
  { value: 'listed', label: 'Listada/Enterprise', description: 'Acima de R$ 300M/ano' }
];

// Origens do cliente
const CLIENT_ORIGINS: { value: ClientOrigin; label: string; icon: any }[] = [
  { value: 'plg', label: 'PLG (Auto-serviço)', icon: Zap },
  { value: 'comercial', label: 'Venda Direta', icon: Briefcase },
  { value: 'parceiro', label: 'Via Parceiro', icon: Crown },
  { value: 'indicacao', label: 'Indicação', icon: User }
];

// Steps do wizard
const STEPS = [
  { number: 1, label: 'Empresa + Admin', icon: Building2 },
  { number: 2, label: 'Configurar Plano', icon: Settings },
  { number: 3, label: 'Ativar Cliente', icon: CheckCircle }
];

export function ClientWizard({ isOpen, onClose, onSuccess, plgLeadEmail }: ClientWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchingLead, setIsSearchingLead] = useState(false);

  // Step 1: Dados da Empresa + Admin
  const [clientForm, setClientForm] = useState<ClientFormData>({
    companyName: '',
    cnpj: '',
    sector: '',
    companySize: 'startup',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    origin: 'comercial'
  });

  // Step 2: Configuração do Plano
  const [planConfig, setPlanConfig] = useState<PlanConfig>({
    configMode: 'automatic',
    selectedModules: BASE_MODULES['startup'],
    enabledAddons: [],
    totalPrice: 0
  });

  // Step 3: Ativação
  const [activationConfig, setActivationConfig] = useState<ActivationConfig>({
    isTrial: false,
    trialDays: 14,
    sendWelcomeEmail: true,
    commercialNotes: '',
    generateCredentials: true
  });

  // Lead PLG encontrado
  const [plgLead, setPlgLead] = useState<any>(null);

  // Atualizar módulos quando porte mudar (modo automático)
  useEffect(() => {
    if (planConfig.configMode === 'automatic') {
      setPlanConfig(prev => ({
        ...prev,
        selectedModules: BASE_MODULES[clientForm.companySize] || BASE_MODULES['startup']
      }));
    }
  }, [clientForm.companySize, planConfig.configMode]);

  // Calcular preço quando módulos mudarem
  useEffect(() => {
    // Calcular add-ons selecionados que não estão na base
    const baseModules = BASE_MODULES[clientForm.companySize] || [];
    const selectedAddons = planConfig.selectedModules.filter(
      m => ALL_ADDON_MODULES.includes(m) && !baseModules.includes(m)
    );
    const price = calculateTotalPrice(clientForm.companySize, selectedAddons);
    setPlanConfig(prev => ({ ...prev, totalPrice: price }));
  }, [clientForm.companySize, planConfig.selectedModules, planConfig.configMode]);

  // Buscar lead PLG pelo email
  const searchPLGLead = async () => {
    if (!clientForm.adminEmail) {
      toast.error('Informe o email para buscar');
      return;
    }

    setIsSearchingLead(true);
    try {
      // Buscar no localStorage (mock) - em produção seria via Supabase
      const plgLeadsStr = localStorage.getItem('plg_leads') || '[]';
      const plgLeads = JSON.parse(plgLeadsStr);
      const lead = plgLeads.find((l: any) => l.email === clientForm.adminEmail);

      if (lead) {
        setPlgLead(lead);
        setClientForm(prev => ({
          ...prev,
          companyName: lead.company || prev.companyName,
          adminName: lead.name || prev.adminName,
          adminPhone: lead.phone || prev.adminPhone,
          origin: 'plg'
        }));

        // Se tem score GovMetrix, sugerir porte
        if (lead.govmetrix_score) {
          let suggestedSize: CompanySize = 'startup';
          if (lead.govmetrix_score >= 80) suggestedSize = 'large';
          else if (lead.govmetrix_score >= 60) suggestedSize = 'medium';
          else if (lead.govmetrix_score >= 40) suggestedSize = 'small';
          
          setClientForm(prev => ({ ...prev, companySize: suggestedSize }));
        }

        toast.success('Lead PLG encontrado! Dados pré-populados.');
      } else {
        toast.info('Nenhum lead PLG encontrado com este email.');
      }
    } catch (error) {
      console.error('Erro ao buscar lead:', error);
      toast.error('Erro ao buscar lead PLG');
    } finally {
      setIsSearchingLead(false);
    }
  };

  // Validação Step 1
  const isStep1Valid = () => {
    return (
      clientForm.companyName.trim() !== '' &&
      clientForm.sector !== '' &&
      clientForm.adminName.trim() !== '' &&
      clientForm.adminEmail.trim() !== '' &&
      clientForm.adminEmail.includes('@')
    );
  };

  // Validação Step 2
  const isStep2Valid = () => {
    return planConfig.selectedModules.length >= 3; // Mínimo de módulos base
  };

  // Handler para criar cliente
  const handleCreateClient = async () => {
    setIsSubmitting(true);
    try {
      // 1. Criar cliente no localStorage (mock)
      const clientId = crypto.randomUUID();
      const now = new Date().toISOString();

      // Salvar cliente
      const demoClientsStr = localStorage.getItem('demo_clients') || '[]';
      const demoClients = JSON.parse(demoClientsStr);
      
      const newClient = {
        id: clientId,
        name: clientForm.adminName,
        email: clientForm.adminEmail,
        company: clientForm.companyName,
        sector: clientForm.sector,
        phone: clientForm.adminPhone,
        cnpj: clientForm.cnpj,
        origin: clientForm.origin,
        created_at: now
      };
      demoClients.push(newClient);
      localStorage.setItem('demo_clients', JSON.stringify(demoClients));

      // 2. Salvar configuração do plano
      const planConfigsStr = localStorage.getItem('client_plan_configs') || '{}';
      const planConfigs = JSON.parse(planConfigsStr);

      const addonsFromModules = planConfig.selectedModules.filter(m => 
        ALL_ADDON_MODULES.includes(m)
      );

      planConfigs[clientId] = {
        id: crypto.randomUUID(),
        user_id: clientId,
        company_size: clientForm.companySize,
        config_mode: planConfig.configMode,
        enabled_modules: planConfig.selectedModules,
        enabled_addons: addonsFromModules,
        total_price: planConfig.totalPrice,
        status: 'active',
        is_trial: activationConfig.isTrial,
        trial_days: activationConfig.trialDays,
        trial_ends_at: activationConfig.isTrial 
          ? new Date(Date.now() + activationConfig.trialDays * 24 * 60 * 60 * 1000).toISOString()
          : null,
        activated_at: now,
        commercial_notes: activationConfig.commercialNotes,
        created_at: now,
        updated_at: now
      };
      localStorage.setItem('client_plan_configs', JSON.stringify(planConfigs));

      // 3. Atualizar lead PLG se existir
      if (plgLead) {
        const plgLeadsStr = localStorage.getItem('plg_leads') || '[]';
        const plgLeads = JSON.parse(plgLeadsStr);
        const leadIndex = plgLeads.findIndex((l: any) => l.email === clientForm.adminEmail);
        if (leadIndex >= 0) {
          plgLeads[leadIndex] = {
            ...plgLeads[leadIndex],
            funnel_stage: 'activation_completed',
            converted_at: now,
            converted_to_client_id: clientId
          };
          localStorage.setItem('plg_leads', JSON.stringify(plgLeads));
        }
      }

      // 4. Salvar na lista de empresas (useCompanies)
      const companiesStr = localStorage.getItem('legacy_companies') || '[]';
      const companies = JSON.parse(companiesStr);
      companies.push({
        id: clientId,
        name: clientForm.companyName,
        type: 'cliente',
        sector: clientForm.sector,
        plan: getSizePlanLabel(clientForm.companySize),
        status: 'active',
        contact: clientForm.adminName,
        contactEmail: clientForm.adminEmail,
        contactPhone: clientForm.adminPhone,
        paymentStatus: activationConfig.isTrial ? 'Trial' : 'Aguardando',
        created_at: now
      });
      localStorage.setItem('legacy_companies', JSON.stringify(companies));

      // 5. Simular envio de email de boas-vindas
      if (activationConfig.sendWelcomeEmail) {
        console.log('Enviando email de boas-vindas para:', clientForm.adminEmail);
        // Em produção: chamar Edge Function send-welcome-email
      }

      toast.success(`Cliente "${clientForm.companyName}" ativado com sucesso!`);
      
      // Reset e fechar
      resetWizard();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast.error('Erro ao ativar cliente. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Converter size para label de plano
  const getSizePlanLabel = (size: CompanySize): string => {
    const labels: Record<CompanySize, string> = {
      'startup': 'Startup',
      'small': 'Pequena',
      'medium': 'Média',
      'large': 'Grande',
      'listed': 'Listada'
    };
    return labels[size] || 'Startup';
  };

  // Reset wizard
  const resetWizard = () => {
    setCurrentStep(1);
    setClientForm({
      companyName: '',
      cnpj: '',
      sector: '',
      companySize: 'startup',
      adminName: '',
      adminEmail: '',
      adminPhone: '',
      origin: 'comercial'
    });
    setPlanConfig({
      configMode: 'automatic',
      selectedModules: BASE_MODULES['startup'],
      enabledAddons: [],
      totalPrice: 0
    });
    setActivationConfig({
      isTrial: false,
      trialDays: 14,
      sendWelcomeEmail: true,
      commercialNotes: '',
      generateCredentials: true
    });
    setPlgLead(null);
  };

  // Navegação
  const goNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Renderizar Step 1 - Dados da Empresa + Admin
  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Busca de Lead PLG */}
      <Card className="border-dashed border-primary/30 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Importar Lead PLG</span>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Digite o email do lead..."
              value={clientForm.adminEmail}
              onChange={(e) => setClientForm(prev => ({ ...prev, adminEmail: e.target.value }))}
            />
            <Button 
              variant="outline" 
              onClick={searchPLGLead}
              disabled={isSearchingLead}
            >
              {isSearchingLead ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          {plgLead && (
            <div className="mt-3 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-md">
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Lead encontrado! Score GovMetrix: {plgLead.govmetrix_score || 'N/A'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Dados da Empresa */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Dados da Empresa
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Empresa *</Label>
            <Input
              id="companyName"
              placeholder="Ex: Tech Solutions Ltda"
              value={clientForm.companyName}
              onChange={(e) => setClientForm(prev => ({ ...prev, companyName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              placeholder="00.000.000/0000-00"
              value={clientForm.cnpj}
              onChange={(e) => setClientForm(prev => ({ ...prev, cnpj: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sector">Setor *</Label>
            <Select 
              value={clientForm.sector}
              onValueChange={(value) => setClientForm(prev => ({ ...prev, sector: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companySize">Porte da Empresa *</Label>
            <Select 
              value={clientForm.companySize}
              onValueChange={(value) => setClientForm(prev => ({ ...prev, companySize: value as CompanySize }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o porte" />
              </SelectTrigger>
              <SelectContent>
                {COMPANY_SIZES.map(size => (
                  <SelectItem key={size.value} value={size.value}>
                    <div className="flex flex-col">
                      <span>{size.label}</span>
                      <span className="text-xs text-muted-foreground">{size.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Dados do Admin */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <User className="h-4 w-4" />
          Administrador Principal
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adminName">Nome Completo *</Label>
            <Input
              id="adminName"
              placeholder="Ex: João Silva"
              value={clientForm.adminName}
              onChange={(e) => setClientForm(prev => ({ ...prev, adminName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Email *</Label>
            <Input
              id="adminEmail"
              type="email"
              placeholder="joao@empresa.com"
              value={clientForm.adminEmail}
              onChange={(e) => setClientForm(prev => ({ ...prev, adminEmail: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adminPhone">Telefone</Label>
            <Input
              id="adminPhone"
              placeholder="(11) 99999-9999"
              value={clientForm.adminPhone}
              onChange={(e) => setClientForm(prev => ({ ...prev, adminPhone: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Origem do Cliente</Label>
            <Select 
              value={clientForm.origin}
              onValueChange={(value) => setClientForm(prev => ({ ...prev, origin: value as ClientOrigin }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLIENT_ORIGINS.map(origin => (
                  <SelectItem key={origin.value} value={origin.value}>
                    <div className="flex items-center gap-2">
                      <origin.icon className="h-4 w-4" />
                      {origin.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar Step 2 - Configuração do Plano
  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Resumo do Cliente */}
      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{clientForm.companyName}</h4>
              <p className="text-sm text-muted-foreground">{clientForm.sector} | {clientForm.adminEmail}</p>
            </div>
            <Badge variant="outline">
              {COMPANY_SIZES.find(s => s.value === clientForm.companySize)?.label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Configurador de Módulos (inclui seletor de modo) */}
      <div className="space-y-3">
        <ModuleConfigurator
          companySize={clientForm.companySize}
          mode={planConfig.configMode}
          onModeChange={(mode) => setPlanConfig(prev => ({ ...prev, configMode: mode }))}
          selectedModules={planConfig.selectedModules}
          onModulesChange={(modules) => setPlanConfig(prev => ({ ...prev, selectedModules: modules }))}
        />
      </div>

    </div>
  );

  // Renderizar Step 3 - Ativação
  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Resumo Completo */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{clientForm.companyName}</h4>
              <p className="text-sm text-muted-foreground">{clientForm.adminEmail}</p>
            </div>
            <Badge>
              {COMPANY_SIZES.find(s => s.value === clientForm.companySize)?.label}
            </Badge>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Módulos</p>
              <p className="font-medium">{planConfig.selectedModules.length} habilitados</p>
            </div>
            <div>
              <p className="text-muted-foreground">Valor Mensal</p>
              <p className="font-medium">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(planConfig.totalPrice / 100)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opções de Ativação */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Opções de Ativação</h3>
        
        {/* Trial */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label>Período de Trial</Label>
            <p className="text-sm text-muted-foreground">Ativar com período de teste gratuito</p>
          </div>
          <div className="flex items-center gap-4">
            <Switch
              checked={activationConfig.isTrial}
              onCheckedChange={(checked) => setActivationConfig(prev => ({ ...prev, isTrial: checked }))}
            />
            {activationConfig.isTrial && (
              <Select 
                value={String(activationConfig.trialDays)}
                onValueChange={(value) => setActivationConfig(prev => ({ ...prev, trialDays: Number(value) }))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 dias</SelectItem>
                  <SelectItem value="14">14 dias</SelectItem>
                  <SelectItem value="30">30 dias</SelectItem>
                  <SelectItem value="60">60 dias</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Email de Boas-vindas */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email de Boas-vindas
            </Label>
            <p className="text-sm text-muted-foreground">Enviar email com instruções de acesso</p>
          </div>
          <Switch
            checked={activationConfig.sendWelcomeEmail}
            onCheckedChange={(checked) => setActivationConfig(prev => ({ ...prev, sendWelcomeEmail: checked }))}
          />
        </div>

        {/* Gerar Credenciais */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Gerar Credenciais
            </Label>
            <p className="text-sm text-muted-foreground">Criar usuário automaticamente no sistema</p>
          </div>
          <Switch
            checked={activationConfig.generateCredentials}
            onCheckedChange={(checked) => setActivationConfig(prev => ({ ...prev, generateCredentials: checked }))}
          />
        </div>
      </div>

      {/* Notas Comerciais */}
      <div className="space-y-2">
        <Label>Notas Comerciais (interno)</Label>
        <Textarea
          placeholder="Observações sobre a negociação, condições especiais, etc."
          value={activationConfig.commercialNotes}
          onChange={(e) => setActivationConfig(prev => ({ ...prev, commercialNotes: e.target.value }))}
          className="min-h-[80px]"
        />
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Cadastrar e Ativar Cliente</DialogTitle>
          <DialogDescription>
            Complete as etapas para cadastrar um novo cliente na plataforma
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30 rounded-lg">
          {STEPS.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center gap-2 ${currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                  currentStep > step.number 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : currentStep === step.number 
                      ? 'border-primary text-primary'
                      : 'border-muted-foreground'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${currentStep > step.number ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto py-4 px-1">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onClose : goBack}
          >
            {currentStep === 1 ? 'Cancelar' : (
              <>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </>
            )}
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={goNext}
              disabled={currentStep === 1 ? !isStep1Valid() : !isStep2Valid()}
            >
              Próximo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleCreateClient}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ativando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Ativar Cliente
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
