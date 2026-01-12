import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  QrCode, 
  FileText,
  Check,
  ShoppingCart,
  ArrowLeft,
  ArrowRight,
  Lock,
  Calendar,
  Receipt,
  Shield,
  Sparkles,
  CheckCircle2,
  Clock,
  Percent,
  FileSignature,
  Mail,
  Phone,
  User,
  MapPin,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { PLANS, ADDONS, revealPricing, PRICING_MATRIX } from '@/data/pricingData';
import { CONTRACT_TERM_OPTIONS, PAYMENT_CYCLE_OPTIONS, ClientBilling } from '@/types/billing';
import { asaasService } from '@/services/asaasService';
import legacyLogo from "@/assets/legacy-logo-new.png";
import { toast } from 'sonner';

type Step = 'dados' | 'plano' | 'contrato' | 'pagamento' | 'confirmacao';
type BillingType = 'BOLETO' | 'PIX';

export default function ContractCheckout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Parâmetros da URL
  const planSlug = searchParams.get('plan') || 'profissional';
  const porteParam = searchParams.get('porte') || 'smb_plus';
  const addonsFromUrl = searchParams.get('addons')?.split(',').filter(Boolean) || [];
  
  // Estado
  const [currentStep, setCurrentStep] = useState<Step>('dados');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Dados do plano
  const plan = PLANS.find((p) => p.id === planSlug) || PLANS[1];
  const pricing = revealPricing(planSlug, porteParam);
  const selectedAddons = ADDONS.filter((a) => addonsFromUrl.includes(a.id));
  
  // Formulário de dados
  const [formData, setFormData] = useState({
    // Empresa
    companyName: '',
    tradingName: '',
    cnpj: '',
    stateRegistration: '',
    
    // Endereço
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zip: '',
    
    // Contato principal
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactRole: '',
    
    // Contato financeiro
    financeContactName: '',
    financeContactEmail: '',
    financeContactPhone: '',
  });
  
  // Configuração do contrato
  const [contractConfig, setContractConfig] = useState({
    term: 24 as 12 | 24 | 36,
    paymentCycle: 'monthly' as 'monthly' | 'quarterly' | 'semi_annual' | 'annual',
    billingType: 'BOLETO' as BillingType,
  });
  
  // Aceites
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptContract, setAcceptContract] = useState(false);
  
  // Calcular valores
  const termDiscount = CONTRACT_TERM_OPTIONS.find(t => t.value === contractConfig.term)?.discount || 0;
  const cycleDiscount = PAYMENT_CYCLE_OPTIONS.find(c => c.value === contractConfig.paymentCycle)?.discount || 0;
  const totalDiscount = termDiscount + cycleDiscount;
  
  const baseMonthly = pricing.mensal || 0;
  const addonsMonthly = selectedAddons.reduce((sum, a) => sum + a.precoMensal, 0);
  const totalMonthly = baseMonthly + addonsMonthly;
  const discountedMonthly = totalMonthly * (1 - totalDiscount / 100);
  
  const cycleMonths = {
    monthly: 1,
    quarterly: 3,
    semi_annual: 6,
    annual: 12,
  };
  
  const paymentValue = discountedMonthly * cycleMonths[contractConfig.paymentCycle];
  const totalContractValue = discountedMonthly * contractConfig.term;
  const setupFee = pricing.setup || 0;
  const firstPayment = setupFee + paymentValue;
  
  // Validações
  const isStep1Valid = 
    formData.companyName.length >= 3 &&
    formData.cnpj.length >= 14 &&
    formData.street.length >= 3 &&
    formData.city.length >= 2 &&
    formData.state.length === 2 &&
    formData.zip.length >= 8 &&
    formData.contactName.length >= 3 &&
    formData.contactEmail.includes('@') &&
    formData.contactPhone.length >= 10;
  
  const steps: { id: Step; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'dados', label: 'Dados', icon: Building2 },
    { id: 'plano', label: 'Plano', icon: Sparkles },
    { id: 'contrato', label: 'Contrato', icon: FileSignature },
    { id: 'pagamento', label: 'Pagamento', icon: Receipt },
    { id: 'confirmacao', label: 'Confirmação', icon: CheckCircle2 },
  ];
  
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  
  const handleNext = () => {
    const stepOrder: Step[] = ['dados', 'plano', 'contrato', 'pagamento', 'confirmacao'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };
  
  const handleBack = () => {
    const stepOrder: Step[] = ['dados', 'plano', 'contrato', 'pagamento', 'confirmacao'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };
  
  const handleFinalize = async () => {
    if (!acceptTerms || !acceptContract) {
      toast.error('Aceite os termos para continuar');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Montar dados do cliente
      const clientData: ClientBilling = {
        id: `client_${Date.now()}`,
        company_name: formData.companyName,
        trading_name: formData.tradingName || undefined,
        cnpj: formData.cnpj,
        state_registration: formData.stateRegistration || undefined,
        billing_address: {
          street: formData.street,
          number: formData.number,
          complement: formData.complement || undefined,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: 'BR',
        },
        primary_contact: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone,
          role: formData.contactRole || undefined,
        },
        finance_contact: formData.financeContactEmail ? {
          name: formData.financeContactName,
          email: formData.financeContactEmail,
          phone: formData.financeContactPhone,
        } : undefined,
        status: 'pending_contract',
        total_paid: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Processar checkout
      const result = await asaasService.checkout.processCheckout({
        client: clientData,
        planId: plan.id,
        planName: plan.nome,
        addons: selectedAddons.map(a => a.id),
        monthlyValue: discountedMonthly,
        annualValue: discountedMonthly * 12,
        setupFee: setupFee,
        contractTerm: contractConfig.term,
        paymentCycle: contractConfig.paymentCycle,
        billingType: contractConfig.billingType,
      });
      
      // Salvar resultado para próxima página
      localStorage.setItem('checkout_result', JSON.stringify({
        ...result,
        planName: plan.nome,
        totalMonthly: discountedMonthly,
        totalContractValue,
        firstPayment,
      }));
      
      toast.success('Contrato gerado com sucesso!');
      setCurrentStep('confirmacao');
      
    } catch (error) {
      console.error('Erro no checkout:', error);
      toast.error('Erro ao processar. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={legacyLogo} alt="Legacy" className="h-8" />
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span className="font-semibold">Checkout</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/pricing')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = currentStepIndex > index;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-2 ${isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-primary text-white' : 
                      isCompleted ? 'bg-green-100 text-green-600' : 
                      'bg-gray-100'
                    }`}>
                      {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 sm:w-24 h-0.5 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Dados da Empresa */}
            {currentStep === 'dados' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Dados de Faturamento
                  </CardTitle>
                  <CardDescription>
                    Informações para emissão de NF e contrato
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Dados da Empresa */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">EMPRESA</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Razão Social *</Label>
                        <Input 
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                          placeholder="Empresa Exemplo Ltda"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tradingName">Nome Fantasia</Label>
                        <Input 
                          id="tradingName"
                          value={formData.tradingName}
                          onChange={(e) => setFormData({...formData, tradingName: e.target.value})}
                          placeholder="Nome Fantasia"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ *</Label>
                        <Input 
                          id="cnpj"
                          value={formData.cnpj}
                          onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                          placeholder="00.000.000/0000-00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stateRegistration">Inscrição Estadual</Label>
                        <Input 
                          id="stateRegistration"
                          value={formData.stateRegistration}
                          onChange={(e) => setFormData({...formData, stateRegistration: e.target.value})}
                          placeholder="Isento ou número"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Endereço */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      ENDEREÇO DE FATURAMENTO
                    </h4>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="street">Logradouro *</Label>
                        <Input 
                          id="street"
                          value={formData.street}
                          onChange={(e) => setFormData({...formData, street: e.target.value})}
                          placeholder="Av. Paulista"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="number">Número *</Label>
                        <Input 
                          id="number"
                          value={formData.number}
                          onChange={(e) => setFormData({...formData, number: e.target.value})}
                          placeholder="1000"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input 
                          id="complement"
                          value={formData.complement}
                          onChange={(e) => setFormData({...formData, complement: e.target.value})}
                          placeholder="Sala 101"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="neighborhood">Bairro *</Label>
                        <Input 
                          id="neighborhood"
                          value={formData.neighborhood}
                          onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                          placeholder="Bela Vista"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade *</Label>
                        <Input 
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          placeholder="São Paulo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">UF *</Label>
                        <Input 
                          id="state"
                          value={formData.state}
                          onChange={(e) => setFormData({...formData, state: e.target.value.toUpperCase()})}
                          placeholder="SP"
                          maxLength={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">CEP *</Label>
                        <Input 
                          id="zip"
                          value={formData.zip}
                          onChange={(e) => setFormData({...formData, zip: e.target.value})}
                          placeholder="01310-100"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Contato Principal */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      CONTATO PRINCIPAL
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Nome Completo *</Label>
                        <Input 
                          id="contactName"
                          value={formData.contactName}
                          onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                          placeholder="João Silva"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactRole">Cargo</Label>
                        <Input 
                          id="contactRole"
                          value={formData.contactRole}
                          onChange={(e) => setFormData({...formData, contactRole: e.target.value})}
                          placeholder="Diretor de Governança"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email Corporativo *</Label>
                        <Input 
                          id="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                          placeholder="joao@empresa.com.br"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Telefone *</Label>
                        <Input 
                          id="contactPhone"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button onClick={handleNext} disabled={!isStep1Valid}>
                    Continuar
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* Step 2: Confirmação do Plano */}
            {currentStep === 'plano' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Plano Selecionado
                  </CardTitle>
                  <CardDescription>
                    Confirme seu plano e add-ons
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Plano */}
                  <div className="p-4 border rounded-lg bg-primary/5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{plan.nome}</h3>
                        <p className="text-muted-foreground">{plan.descricao}</p>
                      </div>
                      <Badge className="text-lg px-3 py-1">
                        {formatCurrency(baseMonthly)}/mês
                      </Badge>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid sm:grid-cols-2 gap-2">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Add-ons */}
                  {selectedAddons.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Add-ons Selecionados</h4>
                      {selectedAddons.map(addon => (
                        <div key={addon.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{addon.nome}</p>
                              <p className="text-sm text-muted-foreground">{addon.descricao}</p>
                            </div>
                          </div>
                          <span className="font-semibold">
                            +{formatCurrency(addon.precoMensal)}/mês
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                  <Button onClick={handleNext}>
                    Continuar
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* Step 3: Configuração do Contrato */}
            {currentStep === 'contrato' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSignature className="h-5 w-5" />
                    Configuração do Contrato
                  </CardTitle>
                  <CardDescription>
                    Escolha o prazo e ciclo de pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Prazo do Contrato */}
                  <div className="space-y-3">
                    <Label className="text-base">Prazo do Contrato</Label>
                    <RadioGroup 
                      value={String(contractConfig.term)} 
                      onValueChange={(v) => setContractConfig({...contractConfig, term: Number(v) as 12 | 24 | 36})}
                      className="grid grid-cols-3 gap-4"
                    >
                      {CONTRACT_TERM_OPTIONS.map(option => (
                        <div key={option.value}>
                          <RadioGroupItem value={String(option.value)} id={`term-${option.value}`} className="peer sr-only" />
                          <Label 
                            htmlFor={`term-${option.value}`}
                            className="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          >
                            <Calendar className="h-6 w-6 mb-2" />
                            <span className="font-bold text-lg">{option.value}</span>
                            <span className="text-sm text-muted-foreground">meses</span>
                            {option.discount > 0 && (
                              <Badge variant="secondary" className="mt-2 text-green-600">
                                -{option.discount}%
                              </Badge>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  {/* Ciclo de Pagamento */}
                  <div className="space-y-3">
                    <Label className="text-base">Ciclo de Pagamento</Label>
                    <RadioGroup 
                      value={contractConfig.paymentCycle} 
                      onValueChange={(v) => setContractConfig({...contractConfig, paymentCycle: v as any})}
                      className="grid grid-cols-2 gap-4"
                    >
                      {PAYMENT_CYCLE_OPTIONS.map(option => (
                        <div key={option.value}>
                          <RadioGroupItem value={option.value} id={`cycle-${option.value}`} className="peer sr-only" />
                          <Label 
                            htmlFor={`cycle-${option.value}`}
                            className="flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          >
                            <div>
                              <span className="font-medium">{option.label}</span>
                              <p className="text-sm text-muted-foreground">
                                {cycleMonths[option.value]} {cycleMonths[option.value] === 1 ? 'fatura' : 'faturas'}/ano
                              </p>
                            </div>
                            {option.discount && option.discount > 0 && (
                              <Badge variant="secondary" className="text-green-600">
                                -{option.discount}%
                              </Badge>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  {/* Resumo de Descontos */}
                  {totalDiscount > 0 && (
                    <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <Percent className="h-5 w-5" />
                        <span className="font-medium">
                          Desconto total: {totalDiscount}%
                        </span>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Contrato de {contractConfig.term} meses + pagamento {
                          PAYMENT_CYCLE_OPTIONS.find(c => c.value === contractConfig.paymentCycle)?.label.toLowerCase()
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                  <Button onClick={handleNext}>
                    Continuar
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* Step 4: Forma de Pagamento */}
            {currentStep === 'pagamento' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Forma de Pagamento
                  </CardTitle>
                  <CardDescription>
                    Escolha como deseja receber as faturas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup 
                    value={contractConfig.billingType} 
                    onValueChange={(v) => setContractConfig({...contractConfig, billingType: v as BillingType})}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="BOLETO" id="boleto" />
                      <Label htmlFor="boleto" className="flex items-center gap-3 cursor-pointer flex-1">
                        <FileText className="h-6 w-6 text-orange-500" />
                        <div>
                          <p className="font-medium">Boleto Bancário</p>
                          <p className="text-sm text-muted-foreground">Vencimento em 5 dias úteis</p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="PIX" id="pix" />
                      <Label htmlFor="pix" className="flex items-center gap-3 cursor-pointer flex-1">
                        <QrCode className="h-6 w-6 text-green-500" />
                        <div>
                          <p className="font-medium">PIX</p>
                          <p className="text-sm text-muted-foreground">QR Code ou Copia e Cola</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  <Separator />
                  
                  {/* Termos */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="terms" 
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                        Li e aceito os <a href="/termos" target="_blank" className="text-primary underline">Termos de Uso</a> e a{' '}
                        <a href="/privacidade" target="_blank" className="text-primary underline">Política de Privacidade</a> da Legacy OS.
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="contract" 
                        checked={acceptContract}
                        onCheckedChange={(checked) => setAcceptContract(checked as boolean)}
                      />
                      <Label htmlFor="contract" className="text-sm cursor-pointer leading-relaxed">
                        Concordo com os termos do contrato de prestação de serviços SaaS, 
                        incluindo vigência de {contractConfig.term} meses e fidelidade contratual.
                      </Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleFinalize} 
                    disabled={!acceptTerms || !acceptContract || isProcessing}
                    className="min-w-[200px]"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Finalizar Contrato
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* Step 5: Confirmação */}
            {currentStep === 'confirmacao' && (
              <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                    Contrato Gerado com Sucesso!
                  </h2>
                  <p className="text-green-700 dark:text-green-300 mb-6 max-w-md mx-auto">
                    Enviamos os dados de pagamento para o email <strong>{formData.contactEmail}</strong>.
                    Após a confirmação do pagamento, seu acesso será liberado em até 24 horas.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto mt-8">
                    <Button variant="outline" onClick={() => navigate('/pricing')}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar ao Site
                    </Button>
                    <Button onClick={() => navigate('/admin/contratos')}>
                      Ver Meu Contrato
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Plano */}
                <div className="flex justify-between">
                  <span>{plan.nome}</span>
                  <span className="font-medium">{formatCurrency(baseMonthly)}/mês</span>
                </div>
                
                {/* Add-ons */}
                {selectedAddons.map(addon => (
                  <div key={addon.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">+ {addon.nome}</span>
                    <span>{formatCurrency(addon.precoMensal)}/mês</span>
                  </div>
                ))}
                
                <Separator />
                
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span>Subtotal mensal</span>
                  <span>{formatCurrency(totalMonthly)}</span>
                </div>
                
                {/* Desconto */}
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto ({totalDiscount}%)</span>
                    <span>-{formatCurrency(totalMonthly - discountedMonthly)}</span>
                  </div>
                )}
                
                <Separator />
                
                {/* Total Mensal */}
                <div className="flex justify-between font-bold">
                  <span>Valor mensal</span>
                  <span className="text-primary">{formatCurrency(discountedMonthly)}</span>
                </div>
                
                {/* Detalhes do Contrato */}
                <div className="p-3 bg-muted/50 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prazo</span>
                    <span>{contractConfig.term} meses</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ciclo</span>
                    <span>{PAYMENT_CYCLE_OPTIONS.find(c => c.value === contractConfig.paymentCycle)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Setup</span>
                    <span>{formatCurrency(setupFee)}</span>
                  </div>
                </div>
                
                <Separator />
                
                {/* Valor do Contrato */}
                <div className="flex justify-between">
                  <span>Valor total do contrato</span>
                  <span className="font-bold">{formatCurrency(totalContractValue)}</span>
                </div>
                
                {/* Primeiro Pagamento */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">1ª Cobrança</p>
                      <p className="text-xs text-muted-foreground">Setup + {
                        PAYMENT_CYCLE_OPTIONS.find(c => c.value === contractConfig.paymentCycle)?.label
                      }</p>
                    </div>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(firstPayment)}
                    </span>
                  </div>
                </div>
                
                {/* Segurança */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Shield className="h-4 w-4" />
                  <span>Ambiente seguro com criptografia SSL</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
