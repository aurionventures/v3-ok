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
import { InputCNPJ, InputCEP, InputPhone } from '@/components/ui/input-masked';
import { isValidPhone, isValidCEP, isValidCNPJ } from '@/utils/masks';
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
  AlertCircle,
  XCircle,
  Ticket,
} from 'lucide-react';
import { PLANS, ADDONS, revealPricing, PRICING_MATRIX } from '@/data/pricingData';
import { CONTRACT_TERM_OPTIONS, PAYMENT_CYCLE_OPTIONS, ClientBilling } from '@/types/billing';
import { asaasService } from '@/services/asaasService';
import legacyLogo from "@/assets/legacy-logo-new.png";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { CompanyData } from '@/hooks/useCNPJ';
import type { AddressData } from '@/hooks/useCEP';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DiscountCoupon,
  calculateCouponDiscount,
  validateCoupon,
} from '@/types/discountCoupon';

type Step = 'dados' | 'contrato' | 'confirmacao';
type BillingType = 'BOLETO' | 'PIX';

export default function ContractCheckout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Parâmetros da URL
  const planSlug = searchParams.get('plan') || 'profissional';
  const porteParam = searchParams.get('porte') || 'smb_plus';
  const addonsFromUrl = searchParams.get('addons')?.split(',').filter(Boolean) || [];
  const calculatedPriceFromUrl = searchParams.get('calculatedPrice');
  const termFromUrl = searchParams.get('term');
  const cycleFromUrl = searchParams.get('cycle');
  const billingFromUrl = searchParams.get('billing');
  
  // Estado
  const [currentStep, setCurrentStep] = useState<Step>('dados');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Recuperar preço calculado do localStorage se não vier na URL
  const [calculatedPrice, setCalculatedPrice] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    // Se não veio na URL, tentar recuperar do localStorage
    if (!calculatedPriceFromUrl) {
      try {
        const calculatorResult = localStorage.getItem('calculator_result');
        if (calculatorResult) {
          const data = JSON.parse(calculatorResult);
          // O pricing já contém o preço mensal calculado
          if (data.pricing?.mensal) {
            setCalculatedPrice(data.pricing.mensal);
          }
        }
      } catch (error) {
        console.error('Erro ao recuperar preço calculado:', error);
      }
    } else {
      // Se veio na URL, usar diretamente
      const price = parseFloat(calculatedPriceFromUrl);
      if (!isNaN(price)) {
        setCalculatedPrice(price);
      }
    }
  }, [calculatedPriceFromUrl]);
  
  // Dados do plano
  const plan = PLANS.find((p) => p.id === planSlug) || PLANS[1];
  // Usar preço calculado se disponível, caso contrário usar matriz estática
  const pricing = revealPricing(planSlug, porteParam, calculatedPrice);
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
  
  // Configuração do contrato (com valores da URL se disponíveis)
  // Ciclo de pagamento fixo como mensal para previsibilidade de caixa
  const [contractConfig, setContractConfig] = useState({
    term: (termFromUrl ? Number(termFromUrl) : 12) as 12 | 24 | 36,
    paymentCycle: 'monthly' as const, // Sempre mensal
    billingType: (billingFromUrl || 'BOLETO') as BillingType,
  });
  
  // Cupom de desconto
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Aceites
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptContract, setAcceptContract] = useState(false);
  
  // Calcular valores
  const termDiscount = CONTRACT_TERM_OPTIONS.find(t => t.value === contractConfig.term)?.discount || 0;
  // Removido cycleDiscount - sempre mensal, sem desconto por ciclo
  const pixDiscount = contractConfig.billingType === 'PIX' ? 5 : 0; // 5% de desconto para PIX
  
  const baseMonthly = pricing.mensal || 0;
  const addonsMonthly = selectedAddons.reduce((sum, a) => sum + a.precoMensal, 0);
  const totalMonthly = baseMonthly + addonsMonthly;
  
  // Aplicar descontos progressivos (primeiro termo e PIX, depois cupom)
  const baseDiscount = termDiscount + pixDiscount;
  const monthlyAfterBaseDiscount = totalMonthly * (1 - baseDiscount / 100);
  
  // Calcular desconto do cupom sobre o valor já com desconto base
  const couponDiscountAmount = appliedCoupon
    ? calculateCouponDiscount(appliedCoupon, monthlyAfterBaseDiscount)
    : 0;
  
  const discountedMonthly = monthlyAfterBaseDiscount - couponDiscountAmount;
  const totalDiscountPercentage = baseDiscount + (couponDiscountAmount > 0 ? (couponDiscountAmount / totalMonthly) * 100 : 0);
  
  // Sempre mensal (1 mês)
  const paymentValue = discountedMonthly;
  const totalContractValue = discountedMonthly * contractConfig.term;
  const setupFee = pricing.setup || 0;
  const firstPayment = setupFee + paymentValue;
  
  // Estado para rastrear campos preenchidos automaticamente
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set());

  // Função para validar e aplicar cupom
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Digite um código de cupom');
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError(null);

    try {
      // Buscar cupons do localStorage
      const storedCoupons = localStorage.getItem('discount_coupons');
      if (!storedCoupons) {
        setCouponError('Cupom não encontrado');
        setIsValidatingCoupon(false);
        return;
      }

      const coupons: DiscountCoupon[] = JSON.parse(storedCoupons);
      const coupon = coupons.find(
        (c) => c.token.toUpperCase() === couponCode.trim().toUpperCase()
      );

      if (!coupon) {
        setCouponError('Cupom não encontrado');
        setIsValidatingCoupon(false);
        return;
      }

      // Validar cupom (usar totalMonthly para validação de valor mínimo)
      const validation = validateCoupon(
        coupon,
        totalMonthly,
        plan.id,
        porteParam
      );

      if (!validation.valid) {
        setCouponError(validation.error || 'Cupom inválido');
        setIsValidatingCoupon(false);
        return;
      }

      // Aplicar cupom
      setAppliedCoupon(coupon);
      setCouponError(null);
      toast.success('Cupom aplicado com sucesso!');
    } catch (error) {
      console.error('Erro ao validar cupom:', error);
      setCouponError('Erro ao validar cupom. Tente novamente.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
    toast.info('Cupom removido');
  };

  // Handlers para auto-preenchimento
  const handleCNPJLoaded = (company: CompanyData) => {
    const filledFields = new Set<string>();
    
    // Preencher dados da empresa
    if (company.razaoSocial) {
      filledFields.add('companyName');
    }
    if (company.nomeFantasia) {
      filledFields.add('tradingName');
    }

    // Preencher endereço se disponível
    if (company.endereco?.logradouro) {
      filledFields.add('street');
    }
    if (company.endereco?.numero) {
      filledFields.add('number');
    }
    if (company.endereco?.complemento) {
      filledFields.add('complement');
    }
    if (company.endereco?.bairro) {
      filledFields.add('neighborhood');
    }
    if (company.endereco?.cidade) {
      filledFields.add('city');
    }
    if (company.endereco?.uf) {
      filledFields.add('state');
    }
    if (company.endereco?.cep) {
      filledFields.add('zip');
    }
    
    setFormData(prev => ({
      ...prev,
      cnpj: company.cnpj || prev.cnpj,
      companyName: company.razaoSocial || prev.companyName,
      tradingName: company.nomeFantasia || prev.tradingName,
      street: company.endereco?.logradouro || prev.street,
      number: company.endereco?.numero || prev.number,
      complement: company.endereco?.complemento || prev.complement,
      neighborhood: company.endereco?.bairro || prev.neighborhood,
      city: company.endereco?.cidade || prev.city,
      state: company.endereco?.uf || prev.state,
      zip: company.endereco?.cep || prev.zip,
    }));

    setAutoFilledFields(filledFields);
    toast.success('Dados da empresa carregados automaticamente! Você pode revisar e editar se necessário.', { duration: 2000 });
  };

  const handleCEPLoaded = (address: AddressData) => {
    const filledFields = new Set<string>();
    
    setFormData(prev => {
      const updated = { ...prev, zip: address.cep };
      
      if (address.street) {
        updated.street = address.street;
        filledFields.add('street');
      }
      if (address.complement) {
        updated.complement = address.complement;
        filledFields.add('complement');
      }
      if (address.neighborhood) {
        updated.neighborhood = address.neighborhood;
        filledFields.add('neighborhood');
      }
      if (address.city) {
        updated.city = address.city;
        filledFields.add('city');
      }
      if (address.state) {
        updated.state = address.state;
        filledFields.add('state');
      }
      
      return updated;
    });

    // Adicionar campos preenchidos pelo CEP ao set existente
    setAutoFilledFields(prev => {
      const newSet = new Set(prev);
      filledFields.forEach(field => newSet.add(field));
      return newSet;
    });
    
    toast.success('Endereço preenchido automaticamente! Você pode revisar e editar se necessário.', { duration: 2000 });
  };

  // Validações melhoradas
  // Validação de email: apenas formato válido (sem restrição de domínio)
  const isValidEmail = formData.contactEmail 
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail) 
    : false;
  const isValidPhoneNumber = formData.contactPhone ? isValidPhone(formData.contactPhone) : false;
  const isValidCNPJNumber = formData.cnpj ? isValidCNPJ(formData.cnpj) : false;
  const isValidCEPNumber = formData.zip ? isValidCEP(formData.zip) : false;
  
  const isStep1Valid = 
    formData.companyName.length >= 3 &&
    isValidCNPJNumber &&
    formData.street.length >= 3 &&
    formData.city.length >= 2 &&
    formData.state.length === 2 &&
    isValidCEPNumber &&
    formData.contactName.length >= 3 &&
    isValidEmail &&
    isValidPhoneNumber;
  
  const steps: { id: Step; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'dados', label: 'Dados', icon: Building2 },
    { id: 'contrato', label: 'Contrato', icon: FileSignature },
    { id: 'confirmacao', label: 'Confirmação', icon: CheckCircle2 },
  ];
  
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  
  const handleNext = () => {
    const stepOrder: Step[] = ['dados', 'contrato', 'confirmacao'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };
  
  const handleBack = () => {
    const stepOrder: Step[] = ['dados', 'contrato', 'confirmacao'];
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
      // 1. Gerar ID temporário para o cliente (será criado quando se cadastrar)
      // Não criamos usuário na tabela users aqui devido às políticas RLS
      // O usuário será criado quando se cadastrar ou quando o contrato for processado
      const tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // 2. Processar checkout (localStorage - manter para compatibilidade)
      const clientData: ClientBilling = {
        id: tempUserId,
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

      // 3. Criar contrato (localStorage - contracts table doesn't exist)
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + contractConfig.term);

      // Load template from localStorage - usar template ativo do tipo 'client'
      const storedTemplates = localStorage.getItem('contract_templates');
      const templates = storedTemplates ? JSON.parse(storedTemplates) : [];
      // Buscar template ativo do tipo 'client' (ou padrão se não houver tipo especificado)
      const defaultTemplate = templates.find((t: any) => 
        t.is_active && (t.contract_type === 'client' || (!t.contract_type && t.is_default))
      ) || templates.find((t: any) => t.is_default && t.is_active);

      // Gerar conteúdo do contrato usando template completo ou fallback
      let contractContent = defaultTemplate?.content || '<p>Contrato de Prestação de Serviços SaaS</p>';
      
      // Preparar dados para substituição de variáveis
      const contractNumber = `CTR-${Date.now()}`;
      const clientAddress = `${formData.street}, ${formData.number}${formData.complement ? ` - ${formData.complement}` : ''}, ${formData.neighborhood} - ${formData.city}/${formData.state} - CEP: ${formData.zip}`;
      const signatoryRole = formData.contactRole || 'Representante Legal';
      const planValueFormatted = discountedMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const planValueExtenso = `R$ ${discountedMonthly.toFixed(2).replace('.', ',')}`; // Simplificado
      const durationExtenso = contractConfig.term === 12 ? 'doze' : contractConfig.term === 24 ? 'vinte e quatro' : contractConfig.term === 36 ? 'trinta e seis' : contractConfig.term.toString();
      const addonsInclusos = selectedAddons.length > 0 ? selectedAddons.map(a => a.nome).join(', ') : 'Nenhum add-on contratado';
      const modulosInclusos = plan.descricao || 'Módulos do plano contratado';
      
      // Substituir todas as variáveis do template
      const variables: Record<string, string> = {
        'contrato_numero': contractNumber,
        'cliente_nome': formData.companyName,
        'cliente_cnpj': formData.cnpj,
        'cliente_endereco': clientAddress,
        'cliente_email': formData.contactEmail,
        'cliente_telefone': formData.contactPhone || '',
        'signatario_nome': formData.contactName,
        'signatario_cargo': signatoryRole,
        'signatario_cpf': '', // Será coletado na página de assinatura
        'plano_nome': plan.nome,
        'plano_tipo': plan.id,
        'modulos_inclusos': modulosInclusos,
        'addons_inclusos': addonsInclusos,
        'duracao_meses': contractConfig.term.toString(),
        'duracao_extenso': durationExtenso,
        'data_inicio': format(startDate, 'dd/MM/yyyy', { locale: ptBR }),
        'data_fim': format(endDate, 'dd/MM/yyyy', { locale: ptBR }),
        'plano_valor': planValueFormatted,
        'plano_valor_extenso': planValueExtenso,
        'forma_pagamento': contractConfig.billingType === 'PIX' ? 'PIX' : 'Boleto Bancário',
        'dia_vencimento': '05',
        'data_contrato': format(new Date(), 'dd/MM/yyyy', { locale: ptBR }),
        'cidade_assinatura': `${formData.city} - ${formData.state}`,
        // Variáveis antigas para compatibilidade
        'valor_mensal': planValueFormatted,
      };
      
      // Substituir todas as variáveis no conteúdo
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        contractContent = contractContent.replace(regex, value);
      });

      // Gerar token de assinatura para o cliente
      const signatureToken = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '');
      const tokenExpiresAt = new Date();
      tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 7); // 7 dias de validade

      // Create contract in localStorage
      const newContract = {
        id: crypto.randomUUID(),
        contract_number: contractNumber,
        template_id: defaultTemplate?.id || null,
        client_name: formData.companyName,
        client_document: formData.cnpj.replace(/\D/g, ''),
        client_email: formData.contactEmail,
        client_phone: formData.contactPhone,
        client_address: `${formData.street}, ${formData.number}${formData.complement ? ` - ${formData.complement}` : ''}, ${formData.neighborhood} - ${formData.city}/${formData.state} - CEP: ${formData.zip}`,
        signatory_name: formData.contactName,
        signatory_cpf: '', // CPF será coletado na página de assinatura
        signatory_role: formData.contactRole || 'Representante Legal',
        signatory_email: formData.contactEmail,
        plan_type: plan.id,
        plan_name: plan.nome,
        addons: selectedAddons.map(a => a.id),
        monthly_value: discountedMonthly,
        total_value: totalContractValue,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        duration_months: contractConfig.term,
        content_html: contractContent,
        status: 'pending_signature',
        client_signature_token: signatureToken,
        client_signature_token_expires_at: tokenExpiresAt.toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save to localStorage
      const storedContracts = localStorage.getItem('contracts') || '[]';
      const contracts = JSON.parse(storedContracts);
      contracts.push(newContract);
      localStorage.setItem('contracts', JSON.stringify(contracts));

      // Registrar uso do cupom se aplicado
      if (appliedCoupon) {
        try {
          // Atualizar contador de usos do cupom
          const storedCoupons = localStorage.getItem('discount_coupons');
          if (storedCoupons) {
            const coupons: DiscountCoupon[] = JSON.parse(storedCoupons);
            const updatedCoupons = coupons.map((c) =>
              c.id === appliedCoupon.id
                ? { ...c, currentUses: c.currentUses + 1, updatedAt: new Date().toISOString() }
                : c
            );
            localStorage.setItem('discount_coupons', JSON.stringify(updatedCoupons));
          }

          // Registrar uso no histórico
          const usageRecord = {
            id: crypto.randomUUID(),
            couponId: appliedCoupon.id,
            couponToken: appliedCoupon.token,
            usedBy: formData.cnpj.replace(/\D/g, ''),
            usedAt: new Date().toISOString(),
            orderValue: totalContractValue,
            discountApplied: couponDiscountAmount * contractConfig.term,
            contractId: newContract.id,
          };

          const storedUsage = localStorage.getItem('coupon_usage') || '[]';
          const usage: any[] = JSON.parse(storedUsage);
          usage.push(usageRecord);
          localStorage.setItem('coupon_usage', JSON.stringify(usage));
        } catch (error) {
          console.error('Erro ao registrar uso do cupom:', error);
          // Não bloquear o checkout se houver erro ao registrar o cupom
        }
      }

      // 4. Simulate email sending
      try {
        console.log('Would send contract email to:', formData.contactEmail);
        toast.success('Contrato gerado com sucesso!', { duration: 2000 });
      } catch (emailErr) {
        console.error('Erro ao enviar e-mail:', emailErr);
      }

      // 5. Salvar resultado para próxima página
      localStorage.setItem('checkout_result', JSON.stringify({
        ...result,
        planName: plan.nome,
        totalMonthly: discountedMonthly,
        totalContractValue,
        firstPayment,
        contractId: newContract.id,
        contractNumber: newContract.contract_number,
        signatureToken: signatureToken, // Token para assinatura
      }));
      
      toast.success(`Cliente "${formData.companyName}" cadastrado com sucesso!`, { duration: 2000 });
      setCurrentStep('confirmacao');
      
    } catch (error: any) {
      console.error('Erro no checkout:', error);
      toast.error(error.message || 'Erro ao processar. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatCurrency = (value: number | undefined | null) => {
    const numValue = Number(value) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={legacyLogo} alt="Legacy" className="h-7" />
              <Separator orientation="vertical" className="h-5" />
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-primary" />
                <span className="font-semibold text-base">Contratar Plano</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <WhatsAppButton variant="default" size="sm" className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200" />
              <Button variant="ghost" size="sm" onClick={() => navigate('/pricing')} className="h-8">
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-sm">Voltar</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = currentStepIndex > index;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-1.5 ${isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-primary text-white' : 
                      isCompleted ? 'bg-green-100 text-green-600' : 
                      'bg-gray-100'
                    }`}>
                      {isCompleted ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                    </div>
                    <span className="text-xs font-medium hidden sm:inline">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 sm:w-16 h-0.5 mx-1.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Step 1: Dados da Empresa */}
            {currentStep === 'dados' && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Building2 className="h-5 w-5" />
                    Dados de Faturamento
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    Informações para emissão de NF e contrato
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* CNPJ como primeiro campo - Destaque especial */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-primary to-primary/90 rounded-lg border-2 border-primary shadow-lg shadow-primary/20 flex-shrink-0 mt-6">
                        <Sparkles className="h-5 w-5 text-white animate-pulse" />
                        <span className="text-sm font-semibold text-white whitespace-nowrap">Comece digitando o CNPJ</span>
                      </div>
                      <div className="flex-1">
                        <InputCNPJ
                          id="cnpj"
                          label="CNPJ *"
                          value={formData.cnpj}
                          onChange={(value, companyData) => {
                            setFormData({...formData, cnpj: value});
                            // Limpar campos auto-preenchidos se CNPJ mudar ou for incompleto
                            if (!value || value.length < 18) {
                              setAutoFilledFields(new Set());
                              // Limpar campos se CNPJ for removido ou alterado
                              if (!value || value.length < 18) {
                                setFormData(prev => ({
                                  ...prev,
                                  companyName: '',
                                  tradingName: '',
                                  street: '',
                                  number: '',
                                  complement: '',
                                  neighborhood: '',
                                  city: '',
                                  state: '',
                                  zip: '',
                                }));
                              }
                            }
                            // Se companyData foi passado, preencher automaticamente
                            if (companyData) {
                              handleCNPJLoaded(companyData);
                            }
                          }}
                          onCompanyLoaded={handleCNPJLoaded}
                          autoFetch={true}
                          showSearchButton={true}
                          showCompanyPreview={true}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dados da Empresa - Grid mais compacto */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">EMPRESA</h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="companyName" className="text-xs flex items-center gap-1.5">
                          Razão Social *
                          {autoFilledFields.has('companyName') && (
                            <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-green-500 text-green-600">
                              Preenchido
                            </Badge>
                          )}
                        </Label>
                        <Input 
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => {
                            setFormData({...formData, companyName: e.target.value});
                            // Remover do set de auto-preenchidos se editado manualmente
                            if (autoFilledFields.has('companyName')) {
                              const newSet = new Set(autoFilledFields);
                              newSet.delete('companyName');
                              setAutoFilledFields(newSet);
                            }
                          }}
                          placeholder={autoFilledFields.has('companyName') ? '' : 'Digite a razão social'}
                          className={`h-9 text-sm transition-all ${
                            autoFilledFields.has('companyName') 
                              ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800' 
                              : ''
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="tradingName" className="text-xs flex items-center gap-1.5">
                          Nome Fantasia
                          {autoFilledFields.has('tradingName') && (
                            <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-green-500 text-green-600">
                              Preenchido
                            </Badge>
                          )}
                        </Label>
                        <Input 
                          id="tradingName"
                          value={formData.tradingName}
                          onChange={(e) => {
                            setFormData({...formData, tradingName: e.target.value});
                            if (autoFilledFields.has('tradingName')) {
                              const newSet = new Set(autoFilledFields);
                              newSet.delete('tradingName');
                              setAutoFilledFields(newSet);
                            }
                          }}
                          placeholder={autoFilledFields.has('tradingName') ? '' : 'Digite o nome fantasia'}
                          className={`h-9 text-sm transition-all ${
                            autoFilledFields.has('tradingName') 
                              ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800' 
                              : ''
                          }`}
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="stateRegistration" className="text-xs">Inscrição Estadual</Label>
                        <Input 
                          id="stateRegistration"
                          value={formData.stateRegistration}
                          onChange={(e) => setFormData({...formData, stateRegistration: e.target.value})}
                          placeholder="Isento ou número"
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  {/* Endereço - Grid otimizado */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      ENDEREÇO DE FATURAMENTO
                    </h4>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1.5">
                        <Label htmlFor="street" className="text-xs flex items-center gap-1.5">
                          Logradouro *
                          {autoFilledFields.has('street') && (
                            <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-green-500 text-green-600">
                              Preenchido
                            </Badge>
                          )}
                        </Label>
                        <Input 
                          id="street"
                          value={formData.street}
                          onChange={(e) => {
                            setFormData({...formData, street: e.target.value});
                            if (autoFilledFields.has('street')) {
                              const newSet = new Set(autoFilledFields);
                              newSet.delete('street');
                              setAutoFilledFields(newSet);
                            }
                          }}
                          placeholder={autoFilledFields.has('street') ? '' : 'Digite o logradouro'}
                          className={`h-9 text-sm transition-all ${
                            autoFilledFields.has('street') 
                              ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800' 
                              : ''
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="number" className="text-xs flex items-center gap-1.5">
                          Número *
                          {autoFilledFields.has('number') && (
                            <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-green-500 text-green-600">
                              Preenchido
                            </Badge>
                          )}
                        </Label>
                        <Input 
                          id="number"
                          value={formData.number}
                          onChange={(e) => {
                            setFormData({...formData, number: e.target.value});
                            if (autoFilledFields.has('number')) {
                              const newSet = new Set(autoFilledFields);
                              newSet.delete('number');
                              setAutoFilledFields(newSet);
                            }
                          }}
                          placeholder={autoFilledFields.has('number') ? '' : 'Digite o número'}
                          className={`h-9 text-sm transition-all ${
                            autoFilledFields.has('number') 
                              ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800' 
                              : ''
                          }`}
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-4 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="complement" className="text-xs flex items-center gap-1.5">
                          Complemento
                          {autoFilledFields.has('complement') && (
                            <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-green-500 text-green-600">
                              Preenchido
                            </Badge>
                          )}
                        </Label>
                        <Input 
                          id="complement"
                          value={formData.complement}
                          onChange={(e) => {
                            setFormData({...formData, complement: e.target.value});
                            if (autoFilledFields.has('complement')) {
                              const newSet = new Set(autoFilledFields);
                              newSet.delete('complement');
                              setAutoFilledFields(newSet);
                            }
                          }}
                          placeholder={autoFilledFields.has('complement') ? '' : 'Digite o complemento'}
                          className={`h-9 text-sm transition-all ${
                            autoFilledFields.has('complement') 
                              ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800' 
                              : ''
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="neighborhood" className="text-xs flex items-center gap-1.5">
                          Bairro *
                          {autoFilledFields.has('neighborhood') && (
                            <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-green-500 text-green-600">
                              Preenchido
                            </Badge>
                          )}
                        </Label>
                        <Input 
                          id="neighborhood"
                          value={formData.neighborhood}
                          onChange={(e) => {
                            setFormData({...formData, neighborhood: e.target.value});
                            if (autoFilledFields.has('neighborhood')) {
                              const newSet = new Set(autoFilledFields);
                              newSet.delete('neighborhood');
                              setAutoFilledFields(newSet);
                            }
                          }}
                          placeholder={autoFilledFields.has('neighborhood') ? '' : 'Digite o bairro'}
                          className={`h-9 text-sm transition-all ${
                            autoFilledFields.has('neighborhood') 
                              ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800' 
                              : ''
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="city" className="text-xs flex items-center gap-1.5">
                          Cidade *
                          {autoFilledFields.has('city') && (
                            <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-green-500 text-green-600">
                              Preenchido
                            </Badge>
                          )}
                        </Label>
                        <Input 
                          id="city"
                          value={formData.city}
                          onChange={(e) => {
                            setFormData({...formData, city: e.target.value});
                            if (autoFilledFields.has('city')) {
                              const newSet = new Set(autoFilledFields);
                              newSet.delete('city');
                              setAutoFilledFields(newSet);
                            }
                          }}
                          placeholder={autoFilledFields.has('city') ? '' : 'Digite a cidade'}
                          className={`h-9 text-sm transition-all ${
                            autoFilledFields.has('city') 
                              ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800' 
                              : ''
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="state" className="text-xs flex items-center gap-1.5">
                          UF *
                          {autoFilledFields.has('state') && (
                            <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-green-500 text-green-600">
                              Preenchido
                            </Badge>
                          )}
                        </Label>
                        <Input 
                          id="state"
                          value={formData.state}
                          onChange={(e) => {
                            setFormData({...formData, state: e.target.value.toUpperCase()});
                            if (autoFilledFields.has('state')) {
                              const newSet = new Set(autoFilledFields);
                              newSet.delete('state');
                              setAutoFilledFields(newSet);
                            }
                          }}
                          placeholder={autoFilledFields.has('state') ? '' : 'SP'}
                          maxLength={2}
                          className={`h-9 text-sm transition-all ${
                            autoFilledFields.has('state') 
                              ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800' 
                              : ''
                          }`}
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Label htmlFor="zip" className="flex items-center gap-1.5">
                            CEP *
                            {autoFilledFields.has('zip') && (
                              <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-green-500 text-green-600">
                                Preenchido
                              </Badge>
                            )}
                          </Label>
                        </div>
                        <InputCEP
                          id="zip"
                          label=""
                          value={formData.zip}
                          onChange={(value, address) => {
                            setFormData({...formData, zip: value});
                            if (address) {
                              handleCEPLoaded(address);
                            }
                            if (autoFilledFields.has('zip')) {
                              const newSet = new Set(autoFilledFields);
                              newSet.delete('zip');
                              setAutoFilledFields(newSet);
                            }
                          }}
                          onAddressLoaded={handleCEPLoaded}
                          autoFetch={true}
                          showSearchButton={true}
                          required
                          inputClassName={autoFilledFields.has('zip') 
                            ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800' 
                            : ''
                          }
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  {/* Contato Principal - Grid otimizado */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <User className="h-3.5 w-3.5" />
                      CONTATO PRINCIPAL
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="contactName" className="text-xs">Nome Completo *</Label>
                        <Input 
                          id="contactName"
                          value={formData.contactName}
                          onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                          placeholder="João Silva"
                          className="h-9 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="contactRole" className="text-xs">Cargo</Label>
                        <Input 
                          id="contactRole"
                          value={formData.contactRole}
                          onChange={(e) => setFormData({...formData, contactRole: e.target.value})}
                          placeholder="Diretor de Governança"
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="contactEmail" className="flex items-center gap-1.5 text-xs">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          Email *
                        </Label>
                        <div className="relative">
                          <Input 
                            id="contactEmail"
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                            placeholder="joao@empresa.com.br"
                            className={`h-9 text-sm pr-9 ${
                              formData.contactEmail && isValidEmail 
                                ? 'border-green-500 focus-visible:ring-green-500' 
                                : formData.contactEmail && !isValidEmail
                                ? 'border-red-500 focus-visible:ring-red-500'
                                : ''
                            }`}
                          />
                          {formData.contactEmail && isValidEmail && (
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            </div>
                          )}
                          {formData.contactEmail && !isValidEmail && (
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                              <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {formData.contactEmail && !isValidEmail && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Email inválido
                          </p>
                        )}
                        {formData.contactEmail && isValidEmail && (
                          <p className="text-xs text-green-600 dark:text-green-500 flex items-center gap-1.5 mt-1">
                            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>E-mail válido para receber o contrato</span>
                          </p>
                        )}
                      </div>
                      <InputPhone
                        id="contactPhone"
                        label="Telefone"
                        value={formData.contactPhone}
                        onChange={(value) => setFormData({...formData, contactPhone: value})}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4">
                  <Button onClick={handleNext} disabled={!isStep1Valid} size="default" className="w-full sm:w-auto">
                    Continuar
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* Step 2: Configuração do Contrato */}
            {currentStep === 'contrato' && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileSignature className="h-5 w-5" />
                    Configuração do Contrato
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    Configure o prazo e forma de pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Prazo do Contrato */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Prazo do Contrato</Label>
                      {termDiscount > 0 && (
                        <Badge variant="secondary" className="text-xs text-green-600 bg-green-50 dark:bg-green-950">
                          Desconto: {termDiscount}%
                        </Badge>
                      )}
                    </div>
                    <RadioGroup 
                      value={String(contractConfig.term)} 
                      onValueChange={(v) => setContractConfig({...contractConfig, term: Number(v) as 12 | 24 | 36})}
                      className="grid grid-cols-3 gap-3"
                    >
                      {CONTRACT_TERM_OPTIONS.map(option => {
                        const isSelected = contractConfig.term === option.value;
                        return (
                          <div key={option.value}>
                            <RadioGroupItem value={String(option.value)} id={`term-${option.value}`} className="peer sr-only" />
                            <Label 
                              htmlFor={`term-${option.value}`}
                              className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                isSelected 
                                  ? 'border-primary bg-primary/10 shadow-md' 
                                  : 'border-gray-200 hover:border-primary/50 hover:bg-muted/50'
                              }`}
                            >
                              <Calendar className={`h-5 w-5 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className={`font-bold text-lg ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                {option.value}
                              </span>
                              <span className="text-xs text-muted-foreground mb-1">meses</span>
                              {option.discount > 0 && (
                                <Badge 
                                  variant={isSelected ? "default" : "secondary"} 
                                  className={`text-xs px-2 py-0.5 mt-1 ${
                                    isSelected 
                                      ? 'bg-green-600 text-white' 
                                      : 'text-green-600 bg-green-50 dark:bg-green-950'
                                  }`}
                                >
                                  -{option.discount}% OFF
                                </Badge>
                              )}
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground">
                      Contratos de 24 e 36 meses oferecem descontos progressivos.
                    </p>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  {/* Forma de Pagamento */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Forma de Pagamento</Label>
                    <RadioGroup 
                      value={contractConfig.billingType} 
                      onValueChange={(v) => setContractConfig({...contractConfig, billingType: v as BillingType})}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="BOLETO" id="boleto" />
                        <Label htmlFor="boleto" className="flex items-center gap-2.5 cursor-pointer flex-1">
                          <FileText className="h-5 w-5 text-orange-500 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm">Boleto Bancário</p>
                            <p className="text-xs text-muted-foreground">Vencimento em 5 dias úteis</p>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="PIX" id="pix" />
                        <Label htmlFor="pix" className="flex items-center gap-2.5 cursor-pointer flex-1">
                          <QrCode className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm">PIX</p>
                            <p className="text-xs text-muted-foreground">QR Code ou Copia e Cola</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  {/* Cupom de Desconto */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Ticket className="h-4 w-4" />
                      Cupom de Desconto
                    </Label>
                    {!appliedCoupon ? (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite o código do cupom"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            setCouponError(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleApplyCoupon();
                            }
                          }}
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={handleApplyCoupon}
                          disabled={isValidatingCoupon || !couponCode.trim()}
                        >
                          {isValidatingCoupon ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Aplicar'
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                              Cupom: {appliedCoupon.token}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveCoupon}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400">
                          Desconto: {appliedCoupon.discountType === 'percentage' 
                            ? `${appliedCoupon.discountValue}%` 
                            : formatCurrency(appliedCoupon.discountValue)}
                        </div>
                      </div>
                    )}
                    {couponError && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {couponError}
                      </p>
                    )}
                  </div>
                  
                  {/* Resumo de Descontos */}
                  {totalDiscountPercentage > 0 && (
                    <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-300 mb-2">
                        <Percent className="h-4 w-4" />
                        <span className="font-medium text-sm">
                          Desconto total: {totalDiscountPercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-green-600 dark:text-green-400">
                        {termDiscount > 0 && (
                          <p>• {termDiscount}% por contrato de {contractConfig.term} meses</p>
                        )}
                        {pixDiscount > 0 && (
                          <p>• {pixDiscount}% por pagamento via PIX</p>
                        )}
                        {couponDiscountAmount > 0 && appliedCoupon && (
                          <p>• Desconto cupom: {appliedCoupon.discountType === 'percentage' 
                            ? `${appliedCoupon.discountValue}%` 
                            : formatCurrency(appliedCoupon.discountValue)}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <Separator className="my-3" />
                  
                  {/* Termos */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2.5">
                      <Checkbox 
                        id="terms" 
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                        className="mt-0.5"
                      />
                      <Label htmlFor="terms" className="text-xs cursor-pointer leading-relaxed">
                        Li e aceito os <a href="/termos" target="_blank" className="text-primary underline">Termos de Uso</a> e a{' '}
                        <a href="/privacidade" target="_blank" className="text-primary underline">Política de Privacidade</a> da Legacy OS.
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-2.5">
                      <Checkbox 
                        id="contract" 
                        checked={acceptContract}
                        onCheckedChange={(checked) => setAcceptContract(checked as boolean)}
                        className="mt-0.5"
                      />
                      <Label htmlFor="contract" className="text-xs cursor-pointer leading-relaxed">
                        Concordo com os termos do contrato de prestação de serviços SaaS, 
                        incluindo vigência de {contractConfig.term} meses e fidelidade contratual.
                      </Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleFinalize} 
                    disabled={!acceptTerms || !acceptContract || isProcessing}
                    className="min-w-[200px] w-full sm:w-auto"
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
            
            {/* Step 3: Confirmação */}
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
                    Enviamos uma cópia do contrato para o email <strong>{formData.contactEmail}</strong>.
                  </p>
                  <p className="text-green-700 dark:text-green-300 mb-6 max-w-md mx-auto">
                    Clique no botão abaixo para visualizar e assinar seu contrato eletronicamente, e acessar a Legacy OS.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto mt-8">
                    <Button variant="outline" onClick={() => navigate('/pricing')}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar ao Site
                    </Button>
                    <Button onClick={() => {
                      // Buscar token do contrato do localStorage
                      const checkoutResult = localStorage.getItem('checkout_result');
                      if (checkoutResult) {
                        const result = JSON.parse(checkoutResult);
                        if (result.signatureToken) {
                          // Redirecionar para página de assinatura com o token
                          navigate(`/contract/sign/${result.signatureToken}`);
                        } else {
                          toast.error('Token de assinatura não encontrado');
                        }
                      } else {
                        toast.error('Dados do checkout não encontrados');
                      }
                    }}>
                      Ver e Assinar Contrato
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
              <CardContent className="space-y-3">
                {/* Plano */}
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm font-medium">{plan.nome}</span>
                  <span className="text-sm font-semibold">{formatCurrency(baseMonthly)}/mês</span>
                </div>
                
                {/* Add-ons */}
                {selectedAddons.length > 0 && (
                  <>
                    {selectedAddons.map(addon => (
                      <div key={addon.id} className="flex justify-between text-xs py-0.5">
                        <span className="text-muted-foreground">+ {addon.nome}</span>
                        <span className="text-xs">{formatCurrency(addon.precoMensal)}/mês</span>
                      </div>
                    ))}
                    <Separator className="my-2" />
                  </>
                )}
                
                {/* Cupom de Desconto */}
                <div className="space-y-2">
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Código do cupom"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleApplyCoupon();
                          }
                        }}
                        className="h-8 text-xs"
                      />
                      <Button
                        size="sm"
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponCode.trim()}
                        className="h-8 px-3"
                      >
                        {isValidatingCoupon ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          'Aplicar'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="p-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">
                            Cupom: {appliedCoupon.token}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveCoupon}
                          className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        Desconto: {appliedCoupon.discountType === 'percentage' 
                          ? `${appliedCoupon.discountValue}%` 
                          : formatCurrency(appliedCoupon.discountValue)}
                      </div>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {couponError}
                    </p>
                  )}
                </div>

                <Separator className="my-2" />

                {/* Subtotal e Desconto - Compacto */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal mensal</span>
                    <span>{formatCurrency(totalMonthly)}</span>
                  </div>
                  {baseDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto base ({baseDiscount.toFixed(1)}%)</span>
                      <span>-{formatCurrency(totalMonthly - monthlyAfterBaseDiscount)}</span>
                    </div>
                  )}
                  {couponDiscountAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Desconto cupom</span>
                      <span>-{formatCurrency(couponDiscountAmount)}</span>
                    </div>
                  )}
                </div>
                
                <Separator className="my-2" />
                
                {/* Total Mensal */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold">Valor mensal</span>
                    {totalDiscountPercentage > 0 ? (
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground line-through">
                          {formatCurrency(totalMonthly)}
                        </span>
                        <span className="text-base font-bold text-primary">
                          {formatCurrency(discountedMonthly)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-base font-bold text-primary">{formatCurrency(discountedMonthly)}</span>
                    )}
                  </div>
                  {totalDiscountPercentage > 0 && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Percent className="h-3 w-3" />
                      <span>Desconto de {totalDiscountPercentage.toFixed(1)}% aplicado</span>
                    </div>
                  )}
                </div>
                
                {/* Detalhes do Contrato - Compacto */}
                <div className="p-2.5 bg-muted/50 rounded-lg space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prazo</span>
                    <span className="font-medium">{contractConfig.term} meses</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ciclo</span>
                    <span className="font-medium">Mensal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Setup</span>
                    <span className="font-medium">{formatCurrency(setupFee)}</span>
                  </div>
                </div>
                
                <Separator className="my-2" />
                
                {/* Valor do Contrato */}
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground">Valor total do contrato</span>
                  <span className="text-sm font-bold">{formatCurrency(totalContractValue)}</span>
                </div>
                
                {/* Primeiro Pagamento - Compacto */}
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold">1ª Cobrança</p>
                      <p className="text-xs text-muted-foreground">Setup + Mensal</p>
                    </div>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(firstPayment)}
                    </span>
                  </div>
                </div>
                
                {/* Segurança */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Ambiente seguro com SSL</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
