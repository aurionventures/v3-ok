/**
 * SLGClientWizard - Sales-Led Growth Client Registration Wizard
 * 
 * Wizard completo de 5 etapas para cadastro manual de clientes:
 * 1. Tipo de Cliente + Dados da Empresa
 * 2. Administrador Principal
 * 3. Porte + Plano (usando Matriz de Pricing)
 * 4. Add-ons (Default ou Customizado)
 * 5. Condições de Contrato + Ativação
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  Building2, User, Settings, CheckCircle, ArrowRight, ArrowLeft, 
  Loader2, Mail, Phone, Briefcase, Search, Zap, Crown, Shield,
  FileText, Send, CalendarDays, Package, Sparkles, DollarSign,
  Users, Building, Globe, Factory, Home, CreditCard, Receipt
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { usePricingConfig } from '@/hooks/usePricingConfig';
import { supabase } from '@/lib/supabase';
import { InputCNPJ, InputPhone, type CompanyData } from '@/components/ui/input-masked';

// ==========================================
// TYPES
// ==========================================

type ClientType = 'direto' | 'parceiro' | 'holding';
type ContractDuration = 12 | 24 | 36;
type PaymentFrequency = 'mensal' | 'anual';

interface SLGClientWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Step1Data {
  clientType: ClientType;
  companyName: string;
  cnpj: string;
  razaoSocial: string;
  sector: string;
  porte: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  partnerId?: string;
}

interface Step2Data {
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminRole: string;
}

interface Step3Data {
  companySizeId: string;
  planId: string;
}

interface Step4Data {
  configType: 'default' | 'custom';
  selectedAddons: string[];
}

interface Step5Data {
  contractDuration: ContractDuration;
  paymentFrequency: PaymentFrequency;
  isTrial: boolean;
  trialDays: number;
  discount: number;
  setupFeeWaived: boolean;
  commercialNotes: string;
  sendMagicLink: boolean;
  sendContract: boolean;
  acceptedTerms: boolean;
}

// ==========================================
// CONSTANTS
// ==========================================

const CLIENT_TYPES: { value: ClientType; label: string; description: string; icon: typeof Building }[] = [
  { value: 'direto', label: 'Cliente Direto', description: 'Venda direta ao cliente final', icon: Building },
  { value: 'parceiro', label: 'Via Parceiro', description: 'Indicação ou revenda de parceiro', icon: Users },
  { value: 'holding', label: 'Holding/Grupo', description: 'Grupo empresarial ou holding familiar', icon: Factory },
];

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
  'Private Equity',
  'Outro'
];

const ADMIN_ROLES = [
  'CEO',
  'CFO',
  'COO',
  'Diretor(a)',
  'Secretário(a) de Governança',
  'Conselheiro(a)',
  'Gerente',
  'Outro'
];

const CONTRACT_DURATIONS: { value: ContractDuration; label: string; discount: number }[] = [
  { value: 12, label: '12 meses', discount: 0 },
  { value: 24, label: '24 meses', discount: 10 },
  { value: 36, label: '36 meses', discount: 15 },
];

const STEPS = [
  { number: 1, label: 'Empresa', icon: Building2 },
  { number: 2, label: 'Admin', icon: User },
  { number: 3, label: 'Plano', icon: Package },
  { number: 4, label: 'Add-ons', icon: Sparkles },
  { number: 5, label: 'Contrato', icon: FileText },
];

// Helper para inferir setor a partir do CNAE
function inferSectorFromCNAE(cnae: number): string | null {
  const cnaeStr = String(cnae);
  const divisao = cnaeStr.slice(0, 2);
  
  const CNAE_TO_SECTOR: Record<string, string> = {
    // Agricultura, pecuária
    '01': 'Agronegócio',
    '02': 'Agronegócio',
    '03': 'Agronegócio',
    // Indústria Extrativa
    '05': 'Energia',
    '06': 'Energia',
    '07': 'Indústria',
    '08': 'Indústria',
    '09': 'Energia',
    // Indústria de Transformação
    '10': 'Indústria',
    '11': 'Indústria',
    '12': 'Indústria',
    '13': 'Indústria',
    '14': 'Indústria',
    '15': 'Indústria',
    '16': 'Indústria',
    '17': 'Indústria',
    '18': 'Indústria',
    '19': 'Indústria',
    '20': 'Indústria',
    '21': 'Saúde',
    '22': 'Indústria',
    '23': 'Indústria',
    '24': 'Indústria',
    '25': 'Indústria',
    '26': 'Tecnologia',
    '27': 'Tecnologia',
    '28': 'Indústria',
    '29': 'Indústria',
    '30': 'Indústria',
    '31': 'Indústria',
    '32': 'Indústria',
    '33': 'Indústria',
    // Energia
    '35': 'Energia',
    // Construção
    '41': 'Construção Civil',
    '42': 'Construção Civil',
    '43': 'Construção Civil',
    // Comércio
    '45': 'Varejo',
    '46': 'Varejo',
    '47': 'Varejo',
    // Transporte
    '49': 'Serviços',
    '50': 'Serviços',
    '51': 'Serviços',
    '52': 'Serviços',
    '53': 'Serviços',
    // Alojamento e alimentação
    '55': 'Serviços',
    '56': 'Serviços',
    // Informação e comunicação
    '58': 'Tecnologia',
    '59': 'Tecnologia',
    '60': 'Tecnologia',
    '61': 'Tecnologia',
    '62': 'Tecnologia',
    '63': 'Tecnologia',
    // Financeiro
    '64': 'Financeiro',
    '65': 'Financeiro',
    '66': 'Financeiro',
    // Imobiliárias
    '68': 'Serviços',
    // Atividades profissionais
    '69': 'Serviços',
    '70': 'Holding Familiar',
    '71': 'Serviços',
    '72': 'Tecnologia',
    '73': 'Serviços',
    '74': 'Serviços',
    '75': 'Serviços',
    // Administração pública
    '84': 'Serviços',
    // Educação
    '85': 'Educação',
    // Saúde
    '86': 'Saúde',
    '87': 'Saúde',
    '88': 'Saúde',
  };
  
  return CNAE_TO_SECTOR[divisao] || null;
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export function SLGClientWizard({ isOpen, onClose, onSuccess }: SLGClientWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchingLead, setIsSearchingLead] = useState(false);
  const [plgLead, setPlgLead] = useState<any>(null);

  // Pricing config from hook
  const { 
    companySizes, 
    subscriptionPlans, 
    pricingMatrix, 
    addons: addonsCatalog,
    getPricing 
  } = usePricingConfig();

  // Step data states
  const [step1, setStep1] = useState<Step1Data>({
    clientType: 'direto',
    companyName: '',
    cnpj: '',
    razaoSocial: '',
    sector: '',
    porte: '',
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      cep: '',
    },
  });

  const [step2, setStep2] = useState<Step2Data>({
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    adminRole: '',
  });

  const [step3, setStep3] = useState<Step3Data>({
    companySizeId: '',
    planId: '',
  });

  const [step4, setStep4] = useState<Step4Data>({
    configType: 'default',
    selectedAddons: [],
  });

  const [step5, setStep5] = useState<Step5Data>({
    contractDuration: 12,
    paymentFrequency: 'mensal',
    isTrial: false,
    trialDays: 14,
    discount: 0,
    setupFeeWaived: false,
    commercialNotes: '',
    sendMagicLink: true,
    sendContract: true,
    acceptedTerms: false,
  });

  // Get selected size and plan
  const selectedSize = useMemo(() => 
    companySizes.find(s => s.id === step3.companySizeId),
    [companySizes, step3.companySizeId]
  );

  const selectedPlan = useMemo(() => 
    subscriptionPlans.find(p => p.id === step3.planId),
    [subscriptionPlans, step3.planId]
  );

  // Get pricing for selected combination
  const selectedPricing = useMemo(() => {
    if (!step3.companySizeId || !step3.planId) return null;
    return getPricing(step3.companySizeId, step3.planId);
  }, [step3.companySizeId, step3.planId, getPricing]);

  // Calculate add-ons total
  const addonsTotal = useMemo(() => {
    if (step4.configType === 'default') return 0;
    return step4.selectedAddons.reduce((sum, addonId) => {
      const addon = addonsCatalog.find(a => a.id === addonId);
      if (!addon) return sum;
      return sum + (step5.paymentFrequency === 'anual' ? addon.annual_price : addon.monthly_price);
    }, 0);
  }, [step4.configType, step4.selectedAddons, addonsCatalog, step5.paymentFrequency]);

  // Calculate final price
  const finalPrice = useMemo(() => {
    if (!selectedPricing) return { monthly: 0, annual: 0, setup: 0, total: 0 };

    const basePrice = step5.paymentFrequency === 'anual' 
      ? selectedPricing.annual_price 
      : selectedPricing.monthly_price;
    
    const addonsPrice = step4.configType === 'custom' ? addonsTotal : 0;
    
    // Contract duration discount
    const durationDiscount = CONTRACT_DURATIONS.find(d => d.value === step5.contractDuration)?.discount || 0;
    
    // Total discount (contract duration + manual discount)
    const totalDiscount = durationDiscount + step5.discount;
    
    const subtotal = basePrice + addonsPrice;
    const discountAmount = subtotal * (totalDiscount / 100);
    const finalMonthly = subtotal - discountAmount;
    
    const setupFee = step5.setupFeeWaived ? 0 : selectedPricing.setup_fee;

    // Total contract value
    const totalContract = step5.paymentFrequency === 'anual' 
      ? finalMonthly + setupFee
      : (finalMonthly * step5.contractDuration) + setupFee;

    return {
      monthly: step5.paymentFrequency === 'anual' ? selectedPricing.monthly_price : finalMonthly,
      annual: step5.paymentFrequency === 'anual' ? finalMonthly : finalMonthly * 12,
      setup: setupFee,
      total: totalContract,
      discount: totalDiscount,
    };
  }, [selectedPricing, step5, addonsTotal, step4.configType]);

  // Initialize default size and plan when data loads
  useEffect(() => {
    if (companySizes.length > 0 && !step3.companySizeId) {
      setStep3(prev => ({ ...prev, companySizeId: companySizes[0].id }));
    }
    if (subscriptionPlans.length > 0 && !step3.planId) {
      // Find recommended plan or default to first
      const recommended = pricingMatrix.find(p => p.is_recommended);
      setStep3(prev => ({ 
        ...prev, 
        planId: recommended?.plan_id || subscriptionPlans[0].id 
      }));
    }
  }, [companySizes, subscriptionPlans, pricingMatrix]);

  // Set included addons when plan changes
  useEffect(() => {
    if (selectedPlan && step4.configType === 'default') {
      // Set default addons based on plan's included_addons count
      const defaultAddons = addonsCatalog
        .slice(0, selectedPlan.included_addons)
        .map(a => a.id);
      setStep4(prev => ({ ...prev, selectedAddons: defaultAddons }));
    }
  }, [selectedPlan, step4.configType, addonsCatalog]);

  // Search PLG lead by email
  const searchPLGLead = async () => {
    if (!step2.adminEmail) {
      toast.error('Informe o email para buscar');
      return;
    }

    setIsSearchingLead(true);
    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from('plg_leads')
        .select('*')
        .eq('email', step2.adminEmail)
        .single();

      if (data && !error) {
        setPlgLead(data);
        setStep1(prev => ({
          ...prev,
          companyName: data.company || prev.companyName,
        }));
        setStep2(prev => ({
          ...prev,
          adminName: data.name || prev.adminName,
          adminPhone: data.whatsapp || prev.adminPhone,
        }));
        toast.success('Lead PLG encontrado! Dados pré-populados.');
        return;
      }

      // Fallback to localStorage
      const plgLeadsStr = localStorage.getItem('plg_leads') || '[]';
      const plgLeads = JSON.parse(plgLeadsStr);
      const lead = plgLeads.find((l: any) => l.email === step2.adminEmail);

      if (lead) {
        setPlgLead(lead);
        setStep1(prev => ({
          ...prev,
          companyName: lead.company || prev.companyName,
        }));
        setStep2(prev => ({
          ...prev,
          adminName: lead.name || prev.adminName,
          adminPhone: lead.phone || prev.adminPhone,
        }));
        toast.success('Lead PLG encontrado! Dados pré-populados.');
      } else {
        toast.info('Nenhum lead PLG encontrado com este email.');
      }
    } catch (error) {
      console.error('Erro ao buscar lead:', error);
      toast.info('Nenhum lead PLG encontrado.');
    } finally {
      setIsSearchingLead(false);
    }
  };

  // Validations
  const isStep1Valid = () => step1.companyName.trim() !== '' && step1.sector !== '';
  const isStep2Valid = () => step2.adminName.trim() !== '' && step2.adminEmail.includes('@');
  const isStep3Valid = () => step3.companySizeId !== '' && step3.planId !== '';
  const isStep4Valid = () => true; // Always valid
  const isStep5Valid = () => step5.acceptedTerms;

  const canProceed = () => {
    switch (currentStep) {
      case 1: return isStep1Valid();
      case 2: return isStep2Valid();
      case 3: return isStep3Valid();
      case 4: return isStep4Valid();
      case 5: return isStep5Valid();
      default: return false;
    }
  };

  // Handle client creation
  const handleCreateClient = async () => {
    setIsSubmitting(true);
    try {
      const clientId = crypto.randomUUID();
      const now = new Date().toISOString();

      // 1. Save client
      const demoClientsStr = localStorage.getItem('demo_clients') || '[]';
      const demoClients = JSON.parse(demoClientsStr);
      
      const newClient = {
        id: clientId,
        name: step2.adminName,
        email: step2.adminEmail,
        company: step1.companyName,
        sector: step1.sector,
        phone: step2.adminPhone,
        cnpj: step1.cnpj,
        role: step2.adminRole,
        client_type: step1.clientType,
        partner_id: step1.partnerId,
        origin: plgLead ? 'plg' : 'comercial',
        created_at: now
      };
      demoClients.push(newClient);
      localStorage.setItem('demo_clients', JSON.stringify(demoClients));

      // 2. Save plan configuration
      const planConfigsStr = localStorage.getItem('client_plan_configs') || '{}';
      const planConfigs = JSON.parse(planConfigsStr);

      planConfigs[clientId] = {
        id: crypto.randomUUID(),
        user_id: clientId,
        company_size_id: step3.companySizeId,
        company_size_key: selectedSize?.key,
        plan_id: step3.planId,
        plan_key: selectedPlan?.key,
        config_type: step4.configType,
        enabled_addons: step4.selectedAddons,
        contract_duration: step5.contractDuration,
        payment_frequency: step5.paymentFrequency,
        monthly_price: finalPrice.monthly,
        annual_price: finalPrice.annual,
        setup_fee: finalPrice.setup,
        total_contract_value: finalPrice.total,
        discount_percent: finalPrice.discount,
        status: step5.isTrial ? 'trial' : 'active',
        is_trial: step5.isTrial,
        trial_days: step5.trialDays,
        trial_ends_at: step5.isTrial 
          ? new Date(Date.now() + step5.trialDays * 24 * 60 * 60 * 1000).toISOString()
          : null,
        activated_at: now,
        commercial_notes: step5.commercialNotes,
        created_at: now,
        updated_at: now
      };
      localStorage.setItem('client_plan_configs', JSON.stringify(planConfigs));

      // 3. Update PLG lead if exists
      if (plgLead) {
        try {
          await supabase
            .from('plg_leads')
            .update({
              current_funnel_stage: 'activation_completed',
              updated_at: now,
            })
            .eq('email', step2.adminEmail);
        } catch (e) {
          // Fallback localStorage
          const plgLeadsStr = localStorage.getItem('plg_leads') || '[]';
          const plgLeads = JSON.parse(plgLeadsStr);
          const leadIndex = plgLeads.findIndex((l: any) => l.email === step2.adminEmail);
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
      }

      // 4. Save to companies list
      const companiesStr = localStorage.getItem('legacy_companies') || '[]';
      const companies = JSON.parse(companiesStr);
      companies.push({
        id: clientId,
        name: step1.companyName,
        type: 'cliente',
        sector: step1.sector,
        plan: selectedPlan?.name || 'N/A',
        size: selectedSize?.name || 'N/A',
        status: 'active',
        contact: step2.adminName,
        contactEmail: step2.adminEmail,
        contactPhone: step2.adminPhone,
        paymentStatus: step5.isTrial ? 'Trial' : 'Aguardando',
        contractDuration: step5.contractDuration,
        totalContractValue: finalPrice.total,
        created_at: now
      });
      localStorage.setItem('legacy_companies', JSON.stringify(companies));

      // 5. Simulate sending magic link
      if (step5.sendMagicLink) {
        console.log('Enviando Magic Link para:', step2.adminEmail);
        // In production: call Edge Function send-magic-link
        toast.info(`Magic Link enviado para ${step2.adminEmail}`);
      }

      // 6. Simulate sending contract
      if (step5.sendContract) {
        console.log('Enviando contrato para:', step2.adminEmail);
        // In production: generate PDF and send via email
        toast.info('Contrato enviado para assinatura digital');
      }

      toast.success(`Cliente "${step1.companyName}" cadastrado com sucesso!`);
      
      resetWizard();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast.error('Erro ao cadastrar cliente. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset wizard
  const resetWizard = () => {
    setCurrentStep(1);
    setStep1({ 
      clientType: 'direto', 
      companyName: '', 
      cnpj: '', 
      razaoSocial: '',
      sector: '',
      porte: '',
      endereco: {
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        cep: '',
      },
    });
    setStep2({ adminName: '', adminEmail: '', adminPhone: '', adminRole: '' });
    setStep3({ companySizeId: companySizes[0]?.id || '', planId: subscriptionPlans[0]?.id || '' });
    setStep4({ configType: 'default', selectedAddons: [] });
    setStep5({
      contractDuration: 12,
      paymentFrequency: 'mensal',
      isTrial: false,
      trialDays: 14,
      discount: 0,
      setupFeeWaived: false,
      commercialNotes: '',
      sendMagicLink: true,
      sendContract: true,
      acceptedTerms: false,
    });
    setPlgLead(null);
  };

  // Navigation
  const goNext = () => { if (currentStep < 5) setCurrentStep(currentStep + 1); };
  const goBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // ==========================================
  // RENDER STEP 1 - Tipo + Empresa
  // ==========================================
  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Client Type */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Tipo de Cliente</Label>
        <RadioGroup
          value={step1.clientType}
          onValueChange={(v) => setStep1(prev => ({ ...prev, clientType: v as ClientType }))}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {CLIENT_TYPES.map((type) => (
            <div
              key={type.value}
              className={cn(
                "relative flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                step1.clientType === type.value
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => setStep1(prev => ({ ...prev, clientType: type.value }))}
            >
              <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <type.icon className="h-4 w-4 text-primary" />
                  <Label htmlFor={type.value} className="font-medium cursor-pointer text-sm">
                    {type.label}
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Partner selection if Via Parceiro */}
      {step1.clientType === 'parceiro' && (
        <div className="space-y-2 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <Label htmlFor="partnerId" className="text-sm">Parceiro Responsável</Label>
          <Input
            id="partnerId"
            placeholder="Nome ou ID do parceiro"
            value={step1.partnerId || ''}
            onChange={(e) => setStep1(prev => ({ ...prev, partnerId: e.target.value }))}
          />
        </div>
      )}

      <Separator />

      {/* Company Data */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Dados da Empresa
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome Fantasia *</Label>
            <Input
              id="companyName"
              placeholder="Ex: Grupo ABC"
              value={step1.companyName}
              onChange={(e) => setStep1(prev => ({ ...prev, companyName: e.target.value }))}
            />
          </div>
          <InputCNPJ
            id="cnpj"
            label="CNPJ"
            value={step1.cnpj}
            onChange={(value, company) => {
              setStep1(prev => ({ ...prev, cnpj: value }));
            }}
            onCompanyLoaded={(company: CompanyData) => {
              // Auto-preenche campos da empresa com dados da Receita Federal
              setStep1(prev => ({
                ...prev,
                companyName: company.nomeFantasia || prev.companyName,
                razaoSocial: company.razaoSocial,
                porte: company.porte,
                sector: inferSectorFromCNAE(company.atividadePrincipal.codigo) || prev.sector,
                endereco: {
                  logradouro: company.endereco.logradouro,
                  numero: company.endereco.numero,
                  complemento: company.endereco.complemento,
                  bairro: company.endereco.bairro,
                  cidade: company.endereco.cidade,
                  uf: company.endereco.uf,
                  cep: company.endereco.cep,
                },
              }));
              // Se houver telefone, preenche no step2
              if (company.telefone1) {
                setStep2(prev => ({
                  ...prev,
                  adminPhone: company.telefone1 || prev.adminPhone,
                }));
              }
              toast.success('Dados da empresa carregados automaticamente!');
            }}
            autoFetch={true}
            showSearchButton={true}
            showCompanyPreview={true}
          />
        </div>

        {step1.razaoSocial && (
          <div className="space-y-2">
            <Label htmlFor="razaoSocial">Razão Social</Label>
            <Input
              id="razaoSocial"
              value={step1.razaoSocial}
              onChange={(e) => setStep1(prev => ({ ...prev, razaoSocial: e.target.value }))}
              className="bg-muted/50"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="sector">Setor de Atuação *</Label>
          <Select 
            value={step1.sector}
            onValueChange={(value) => setStep1(prev => ({ ...prev, sector: value }))}
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

        {/* Endereço (preenchido automaticamente ou manual) */}
        {step1.endereco.cidade && (
          <div className="p-3 bg-muted/50 rounded-lg space-y-2">
            <Label className="text-xs text-muted-foreground">Endereço (via CNPJ)</Label>
            <p className="text-sm">
              {step1.endereco.logradouro}, {step1.endereco.numero}
              {step1.endereco.complemento && ` - ${step1.endereco.complemento}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {step1.endereco.bairro} - {step1.endereco.cidade}/{step1.endereco.uf}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // ==========================================
  // RENDER STEP 2 - Admin Principal
  // ==========================================
  const renderStep2 = () => (
    <div className="space-y-6">
      {/* PLG Lead Search */}
      <Card className="border-dashed border-primary/30 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Importar Lead PLG (opcional)</span>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Digite o email do lead..."
              value={step2.adminEmail}
              onChange={(e) => setStep2(prev => ({ ...prev, adminEmail: e.target.value }))}
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
                Lead PLG encontrado! Score: {plgLead.score || plgLead.govmetrix_score || 'N/A'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Admin Data */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <User className="h-4 w-4" />
          Administrador Principal
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adminName">Nome Completo *</Label>
            <Input
              id="adminName"
              placeholder="Ex: João Silva"
              value={step2.adminName}
              onChange={(e) => setStep2(prev => ({ ...prev, adminName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Email Corporativo *</Label>
            <Input
              id="adminEmail"
              type="email"
              placeholder="joao@empresa.com"
              value={step2.adminEmail}
              onChange={(e) => setStep2(prev => ({ ...prev, adminEmail: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputPhone
            id="adminPhone"
            label="Telefone/Celular"
            value={step2.adminPhone}
            onChange={(value) => setStep2(prev => ({ ...prev, adminPhone: value }))}
          />
          <div className="space-y-2">
            <Label htmlFor="adminRole">Cargo</Label>
            <Select 
              value={step2.adminRole}
              onValueChange={(value) => setStep2(prev => ({ ...prev, adminRole: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent>
                {ADMIN_ROLES.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // RENDER STEP 3 - Porte + Plano
  // ==========================================
  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Company Size Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Porte da Empresa
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {companySizes.filter(s => s.is_active).map((size) => (
            <Card
              key={size.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                step3.companySizeId === size.id
                  ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => setStep3(prev => ({ ...prev, companySizeId: size.id }))}
            >
              <CardContent className="p-4 text-center">
                <div className="font-semibold text-sm">{size.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {size.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Plan Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Package className="h-4 w-4" />
          Plano de Assinatura
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {subscriptionPlans.filter(p => p.is_active).map((plan) => {
            const pricing = getPricing(step3.companySizeId, plan.id);
            const isRecommended = pricing?.is_recommended;
            
            return (
              <Card
                key={plan.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md relative",
                  step3.planId === plan.id
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => setStep3(prev => ({ ...prev, planId: plan.id }))}
              >
                {isRecommended && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px]">
                    Recomendado
                  </Badge>
                )}
                <CardContent className="p-4 text-center">
                  <div className="font-semibold text-sm">{plan.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {plan.included_addons} add-ons
                  </div>
                  {pricing && (
                    <div className="mt-2 text-primary font-bold">
                      {formatCurrency(pricing.monthly_price)}
                      <span className="text-xs font-normal text-muted-foreground">/mês</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Pricing Summary */}
      {selectedPricing && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-muted-foreground">Mensal</div>
                <div className="font-bold text-lg">{formatCurrency(selectedPricing.monthly_price)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Anual</div>
                <div className="font-bold text-lg text-primary">{formatCurrency(selectedPricing.annual_price)}</div>
                <div className="text-xs text-green-600">2 meses grátis</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Setup</div>
                <div className="font-bold text-lg">{formatCurrency(selectedPricing.setup_fee)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // ==========================================
  // RENDER STEP 4 - Add-ons
  // ==========================================
  const renderStep4 = () => (
    <div className="space-y-6">
      {/* Config Type Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Configuração de Módulos</Label>
        <RadioGroup
          value={step4.configType}
          onValueChange={(v) => setStep4(prev => ({ ...prev, configType: v as 'default' | 'custom' }))}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <div
            className={cn(
              "relative flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
              step4.configType === 'default'
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => setStep4(prev => ({ ...prev, configType: 'default' }))}
          >
            <RadioGroupItem value="default" id="default" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <Label htmlFor="default" className="font-medium cursor-pointer">
                  Plano Default (Core)
                </Label>
                <Badge variant="secondary" className="text-xs">Recomendado</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                13 módulos core + {selectedPlan?.included_addons || 0} add-ons inclusos no plano
              </p>
            </div>
          </div>

          <div
            className={cn(
              "relative flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
              step4.configType === 'custom'
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => setStep4(prev => ({ ...prev, configType: 'custom' }))}
          >
            <RadioGroupItem value="custom" id="custom" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <Label htmlFor="custom" className="font-medium cursor-pointer">
                  Customizado
                </Label>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Core + selecione add-ons adicionais
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Add-ons Selection (only in custom mode) */}
      {step4.configType === 'custom' && (
        <>
          <Separator />
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Add-ons Premium
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
              {addonsCatalog.filter(a => a.is_active && a.is_visible).map((addon) => {
                const isSelected = step4.selectedAddons.includes(addon.id);
                const isIncluded = step4.selectedAddons.indexOf(addon.id) < (selectedPlan?.included_addons || 0);
                
                return (
                  <Card
                    key={addon.id}
                    className={cn(
                      "cursor-pointer transition-all",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    )}
                    onClick={() => {
                      if (isSelected) {
                        setStep4(prev => ({
                          ...prev,
                          selectedAddons: prev.selectedAddons.filter(id => id !== addon.id)
                        }));
                      } else {
                        setStep4(prev => ({
                          ...prev,
                          selectedAddons: [...prev.selectedAddons, addon.id]
                        }));
                      }
                    }}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <Checkbox checked={isSelected} className="pointer-events-none" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{addon.name}</span>
                          {isIncluded && (
                            <Badge variant="outline" className="text-[10px] border-green-500/50 text-green-600">
                              Incluso
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {isIncluded ? 'Incluso no plano' : `+${formatCurrency(addon.monthly_price)}/mês`}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Summary */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Configuração selecionada</div>
              <div className="font-semibold">
                {step4.configType === 'default' ? 'Plano Default' : 'Customizado'} - {step4.selectedAddons.length} add-ons
              </div>
            </div>
            {step4.configType === 'custom' && addonsTotal > 0 && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Add-ons extras</div>
                <div className="font-bold text-amber-600">+{formatCurrency(addonsTotal)}/mês</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ==========================================
  // RENDER STEP 5 - Contrato + Ativação
  // ==========================================
  const renderStep5 = () => (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold">{step1.companyName}</div>
              <div className="text-sm text-muted-foreground">{step2.adminEmail}</div>
            </div>
            <Badge>{selectedSize?.name} - {selectedPlan?.name}</Badge>
          </div>
          <Separator className="my-3" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Setor:</span> {step1.sector}
            </div>
            <div>
              <span className="text-muted-foreground">Add-ons:</span> {step4.selectedAddons.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Duration */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Vigência do Contrato
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {CONTRACT_DURATIONS.map((duration) => (
            <Card
              key={duration.value}
              className={cn(
                "cursor-pointer transition-all text-center",
                step5.contractDuration === duration.value
                  ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => setStep5(prev => ({ ...prev, contractDuration: duration.value }))}
            >
              <CardContent className="p-4">
                <div className="font-semibold">{duration.label}</div>
                {duration.discount > 0 && (
                  <Badge variant="secondary" className="mt-1 text-green-600">
                    -{duration.discount}%
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Frequency */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Forma de Pagamento
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <Card
            className={cn(
              "cursor-pointer transition-all text-center",
              step5.paymentFrequency === 'mensal'
                ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => setStep5(prev => ({ ...prev, paymentFrequency: 'mensal' }))}
          >
            <CardContent className="p-4">
              <Receipt className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <div className="font-semibold">Mensal</div>
              <div className="text-xs text-muted-foreground">Cobrança mês a mês</div>
            </CardContent>
          </Card>
          <Card
            className={cn(
              "cursor-pointer transition-all text-center",
              step5.paymentFrequency === 'anual'
                ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => setStep5(prev => ({ ...prev, paymentFrequency: 'anual' }))}
          >
            <CardContent className="p-4">
              <DollarSign className="h-5 w-5 mx-auto mb-2 text-green-600" />
              <div className="font-semibold">Anual</div>
              <div className="text-xs text-green-600">2 meses grátis</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-4">
        {/* Trial */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label>Período de Trial</Label>
            <p className="text-xs text-muted-foreground">Ativar com período de teste</p>
          </div>
          <div className="flex items-center gap-4">
            <Switch
              checked={step5.isTrial}
              onCheckedChange={(checked) => setStep5(prev => ({ ...prev, isTrial: checked }))}
            />
            {step5.isTrial && (
              <Select 
                value={String(step5.trialDays)}
                onValueChange={(value) => setStep5(prev => ({ ...prev, trialDays: Number(value) }))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 dias</SelectItem>
                  <SelectItem value="14">14 dias</SelectItem>
                  <SelectItem value="30">30 dias</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Setup Fee Waived */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label>Isentar Taxa de Setup</Label>
            <p className="text-xs text-muted-foreground">
              Setup original: {formatCurrency(selectedPricing?.setup_fee || 0)}
            </p>
          </div>
          <Switch
            checked={step5.setupFeeWaived}
            onCheckedChange={(checked) => setStep5(prev => ({ ...prev, setupFeeWaived: checked }))}
          />
        </div>

        {/* Manual Discount */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label>Desconto Adicional (%)</Label>
            <p className="text-xs text-muted-foreground">Desconto negociado manualmente</p>
          </div>
          <Input
            type="number"
            min={0}
            max={50}
            value={step5.discount}
            onChange={(e) => setStep5(prev => ({ ...prev, discount: Number(e.target.value) }))}
            className="w-20 text-center"
          />
        </div>

        {/* Magic Link */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Enviar Magic Link
            </Label>
            <p className="text-xs text-muted-foreground">Email para definir senha de acesso</p>
          </div>
          <Switch
            checked={step5.sendMagicLink}
            onCheckedChange={(checked) => setStep5(prev => ({ ...prev, sendMagicLink: checked }))}
          />
        </div>

        {/* Send Contract */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Enviar Contrato
            </Label>
            <p className="text-xs text-muted-foreground">Contrato para assinatura digital</p>
          </div>
          <Switch
            checked={step5.sendContract}
            onCheckedChange={(checked) => setStep5(prev => ({ ...prev, sendContract: checked }))}
          />
        </div>
      </div>

      {/* Commercial Notes */}
      <div className="space-y-2">
        <Label>Notas Comerciais (interno)</Label>
        <Textarea
          placeholder="Observações sobre a negociação, condições especiais, etc."
          value={step5.commercialNotes}
          onChange={(e) => setStep5(prev => ({ ...prev, commercialNotes: e.target.value }))}
          className="min-h-[60px]"
        />
      </div>

      {/* Final Price Summary */}
      <Card className="bg-primary/5 border-primary/30">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Plano Base ({selectedPlan?.name})</span>
              <span>{formatCurrency(selectedPricing?.monthly_price || 0)}/mês</span>
            </div>
            {step4.configType === 'custom' && addonsTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span>Add-ons Extras</span>
                <span>+{formatCurrency(addonsTotal)}/mês</span>
              </div>
            )}
            {finalPrice.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Desconto Total</span>
                <span>-{finalPrice.discount}%</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Valor Mensal Final</span>
              <span className="text-primary">{formatCurrency(finalPrice.monthly)}</span>
            </div>
            {!step5.setupFeeWaived && (
              <div className="flex justify-between text-sm">
                <span>Taxa de Setup (única)</span>
                <span>{formatCurrency(finalPrice.setup)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Valor Total do Contrato</span>
              <span className="text-primary">{formatCurrency(finalPrice.total)}</span>
            </div>
            <div className="text-xs text-muted-foreground text-right">
              ({step5.contractDuration} meses - {step5.paymentFrequency === 'anual' ? 'Anual' : 'Mensal'})
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accept Terms */}
      <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/50">
        <Checkbox
          id="acceptTerms"
          checked={step5.acceptedTerms}
          onCheckedChange={(checked) => setStep5(prev => ({ ...prev, acceptedTerms: checked as boolean }))}
        />
        <div className="space-y-1">
          <Label htmlFor="acceptTerms" className="cursor-pointer">
            Confirmo os valores e condições acima
          </Label>
          <p className="text-xs text-muted-foreground">
            O contrato será gerado e enviado para assinatura digital.
          </p>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Cadastrar Cliente (Venda Direta)
          </DialogTitle>
          <DialogDescription>
            Complete as etapas para cadastrar e ativar um novo cliente na plataforma
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between px-2 py-3 bg-muted/30 rounded-lg">
          {STEPS.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={cn(
                "flex items-center gap-2",
                currentStep >= step.number ? "text-primary" : "text-muted-foreground"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                  currentStep > step.number 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : currentStep === step.number 
                      ? "border-primary text-primary"
                      : "border-muted-foreground"
                )}>
                  {currentStep > step.number ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                <span className="text-xs font-medium hidden lg:inline">{step.label}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={cn(
                  "w-8 lg:w-16 h-0.5 mx-1 lg:mx-2",
                  currentStep > step.number ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto py-4 px-1">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
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

          {currentStep < 5 ? (
            <Button
              onClick={goNext}
              disabled={!canProceed()}
            >
              Próximo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleCreateClient}
              disabled={isSubmitting || !canProceed()}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Cadastrar e Ativar
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SLGClientWizard;
