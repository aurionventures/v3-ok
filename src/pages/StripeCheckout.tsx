import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  Mail,
  Phone,
  User,
  Lock,
  CreditCard,
  Shield,
  Sparkles,
  Calendar,
  Receipt,
  Star,
  Loader2,
  CheckCircle,
  Clock,
} from 'lucide-react';
import legacyLogo from '@/assets/legacy-logo-new.png';

import { PLANS, ADDONS, revealPricing } from '@/data/pricingData';
import {
  generateUUID,
  saveUser,
  saveEmpresa,
  savePlano,
  calculateTrialEnd,
  isCorporateEmail,
  formatPhone,
  User as UserType,
  Empresa,
  PlanoAssinatura,
} from '@/data/signupData';

// Mock Stripe checkout - Em produção, usar @stripe/stripe-js
interface CheckoutData {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  cargo: string;
  billingCycle: 'mensal' | 'anual';
}

export default function StripeCheckout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Parâmetros da URL
  const planSlug = searchParams.get('plan') || 'profissional';
  const priceFromUrl = searchParams.get('price');
  const addonsFromUrl = searchParams.get('addons')?.split(',') || [];

  // Dados do plano
  const plan = PLANS.find((p) => p.id === planSlug) || PLANS[1];
  const pricing = revealPricing(planSlug);
  const selectedAddons = ADDONS.filter((a) => addonsFromUrl.includes(a.id));

  // Estado do formulário
  const [formData, setFormData] = useState<CheckoutData>({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    cargo: '',
    billingCycle: 'anual',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');

  // Validação
  const isValidEmail = formData.email && isCorporateEmail(formData.email);
  const canProceed =
    formData.nome.trim().length >= 3 &&
    isValidEmail &&
    formData.empresa.trim().length >= 2;

  // Calcular total
  const basePrice = formData.billingCycle === 'anual' ? pricing.anual : pricing.mensal;
  const economia = formData.billingCycle === 'anual' ? pricing.economia : 0;

  // Handler de input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'telefone') {
      setFormData((prev) => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Prosseguir para pagamento
  const handleProceedToPayment = () => {
    if (!canProceed) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    setStep('payment');
  };

  // Simular checkout Stripe (Mock)
  const handleStripePayment = async () => {
    setIsProcessing(true);

    try {
      // Simular delay do processamento Stripe
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Criar usuário, empresa e plano (mock do que o webhook Stripe faria)
      const userId = generateUUID();
      const empresaId = generateUUID();
      const planoId = generateUUID();
      const now = new Date().toISOString();

      // Criar usuário (sem senha - receberá email para criar)
      const newUser: UserType = {
        id: userId,
        nomeCompleto: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cargo: formData.cargo,
        role: 'admin_cliente',
        isActive: true,
        empresaId,
        // NÃO tem emailConfirmedAt nem onboardingCompletedAt
        // Usuário receberá email para criar senha
      };

      // Criar empresa
      const newEmpresa: Empresa = {
        id: empresaId,
        nome: formData.empresa,
        tipo: 'holding',
        isActive: true,
        createdBy: userId,
      };

      // Criar plano de assinatura (ativo, não trial)
      const newPlano: PlanoAssinatura = {
        id: planoId,
        empresaId,
        planoSlug: planSlug,
        precoMensal: pricing.mensal,
        precoAnual: pricing.anual,
        frequenciaPagamento: formData.billingCycle,
        trialStartedAt: now,
        trialEndsAt: now, // Não é trial, pagou
        isTrial: false, // Pagou, não é trial
        status: 'active', // Ativo!
        limiteEmpresas:
          planSlug === 'essencial'
            ? 1
            : planSlug === 'profissional'
            ? 5
            : planSlug === 'business'
            ? 15
            : null,
        limiteConselhos: null,
      };

      // Salvar no storage (mock do banco de dados)
      saveUser(newUser);
      saveEmpresa(newEmpresa);
      savePlano(newPlano);

      // Salvar dados do checkout para uso posterior
      localStorage.setItem(
        'checkout_result',
        JSON.stringify({
          userId,
          empresaId,
          planoId,
          email: formData.email,
          planSlug,
          billingCycle: formData.billingCycle,
          totalPaid: basePrice,
          stripeSessionId: `cs_mock_${generateUUID().substring(0, 8)}`,
          paidAt: now,
        })
      );

      // Simular envio de email para criar senha
      console.log(`[MOCK EMAIL] Enviando email para ${formData.email} para criar senha de acesso`);

      // Ir para tela de sucesso
      setStep('success');
      toast.success('Pagamento processado com sucesso!');
    } catch (error) {
      console.error('Erro no checkout:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Renderizar step de informações
  const renderInfoStep = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Formulário */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Dados para Faturamento
            </CardTitle>
            <CardDescription>
              Preencha os dados para emissão da nota fiscal e criação da conta.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Nome Completo */}
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Seu nome completo"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Corporativo *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@empresa.com.br"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 ${
                    formData.email &&
                    (isValidEmail
                      ? 'border-green-500 focus-visible:ring-green-500'
                      : 'border-red-500 focus-visible:ring-red-500')
                  }`}
                />
                {formData.email && (
                  <div className="absolute right-3 top-3">
                    {isValidEmail ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-xs text-red-500">Email corporativo</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone / WhatsApp</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="telefone"
                    name="telefone"
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="pl-10"
                    maxLength={15}
                  />
                </div>
              </div>

              {/* Cargo */}
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  name="cargo"
                  placeholder="Ex: CEO, CFO..."
                  value={formData.cargo}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Empresa */}
            <div className="space-y-2">
              <Label htmlFor="empresa">Nome da Empresa *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="empresa"
                  name="empresa"
                  placeholder="Nome da sua empresa"
                  value={formData.empresa}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Ciclo de Cobrança */}
            <div className="space-y-3 pt-4 border-t">
              <Label>Ciclo de Cobrança</Label>
              <RadioGroup
                value={formData.billingCycle}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, billingCycle: value as 'mensal' | 'anual' }))
                }
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="mensal" id="mensal" className="peer sr-only" />
                  <Label
                    htmlFor="mensal"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <span className="text-sm font-medium">Mensal</span>
                    <span className="text-lg font-bold mt-1">{pricing.mensalFormatted}/mês</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="anual" id="anual" className="peer sr-only" />
                  <Label
                    htmlFor="anual"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer relative"
                  >
                    <Badge className="absolute -top-2 right-2 bg-green-500 text-white text-xs">
                      Economia
                    </Badge>
                    <span className="text-sm font-medium">Anual</span>
                    <span className="text-lg font-bold mt-1">{pricing.anualFormatted}/ano</span>
                    {pricing.economiaFormatted && (
                      <span className="text-xs text-green-600 mt-1">{pricing.economiaFormatted}</span>
                    )}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={handleProceedToPayment}
              disabled={!canProceed}
              className="w-full bg-accent hover:bg-accent/90 text-primary-foreground"
              size="lg"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Continuar para Pagamento
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Resumo do Pedido */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Resumo do Pedido
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Plano */}
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{plan.nome}</p>
                <p className="text-sm text-muted-foreground">{plan.descricao}</p>
              </div>
              {plan.isPopular && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>

            <Separator />

            {/* Preço */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Plano {plan.nome}</span>
                <span>
                  {formData.billingCycle === 'anual'
                    ? pricing.anualFormatted
                    : `${pricing.mensalFormatted}/mês`}
                </span>
              </div>

              {formData.billingCycle === 'anual' && economia && economia > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Economia (2 meses)</span>
                  <span>-R$ {economia.toLocaleString('pt-BR')}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  R$ {basePrice?.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formData.billingCycle === 'anual' ? 'cobrado anualmente' : 'cobrado mensalmente'}
                </p>
              </div>
            </div>

            {/* Segurança */}
            <div className="pt-4 border-t space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Pagamento 100% seguro via Stripe</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4 text-green-600" />
                <span>Dados criptografados</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Renderizar step de pagamento (Mock Stripe)
  const renderPaymentStep = () => (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Pagamento Seguro</CardTitle>
          <CardDescription>
            Você será redirecionado para o checkout seguro da Stripe.
            <br />
            (Demonstração - Pagamento simulado)
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Resumo */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plano</span>
              <span className="font-medium">{plan.nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ciclo</span>
              <span className="font-medium">
                {formData.billingCycle === 'anual' ? 'Anual' : 'Mensal'}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">R$ {basePrice?.toLocaleString('pt-BR')}</span>
            </div>
          </div>

          {/* Simulação Stripe */}
          <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                alt="Stripe"
                className="h-8"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Em produção, você seria redirecionado para o checkout seguro da Stripe.
            </p>
            <p className="text-xs text-muted-foreground">
              Para esta demonstração, clique em "Simular Pagamento" para continuar.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            onClick={handleStripePayment}
            disabled={isProcessing}
            className="w-full bg-accent hover:bg-accent/90 text-primary-foreground"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processando pagamento...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Simular Pagamento Stripe
              </>
            )}
          </Button>

          <Button variant="ghost" onClick={() => setStep('info')} disabled={isProcessing}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  // Renderizar step de sucesso
  const renderSuccessStep = () => (
    <div className="max-w-2xl mx-auto">
      <Card className="text-center">
        <CardContent className="py-12">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Pagamento Confirmado!</h2>
          <p className="text-muted-foreground mb-6">
            Obrigado pela confiança. Sua conta foi criada com sucesso.
          </p>

          <div className="bg-muted/50 rounded-lg p-6 mb-6 text-left space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium">Email enviado para: {formData.email}</p>
                <p className="text-sm text-muted-foreground">
                  Enviamos um email com o link para criar sua senha de acesso.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium">Próximos passos:</p>
                <ol className="text-sm text-muted-foreground list-decimal list-inside mt-1 space-y-1">
                  <li>Verifique seu email e clique no link para criar sua senha</li>
                  <li>Acesse o dashboard e complete o onboarding</li>
                  <li>Configure sua empresa e convide membros</li>
                </ol>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Star className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium">Plano ativado: {plan.nome}</p>
                <p className="text-sm text-muted-foreground">
                  Você tem acesso a todos os recursos do plano imediatamente.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-accent hover:bg-accent/90 text-primary-foreground"
            >
              Acessar Minha Conta
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>

            <Button variant="outline" size="lg" onClick={() => navigate('/')}>
              Voltar para Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <img
            src={legacyLogo}
            alt="Legacy"
            className="h-10 mx-auto mb-6 cursor-pointer"
            onClick={() => navigate('/')}
          />

          {step !== 'success' && (
            <>
              <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
              <p className="text-muted-foreground">
                Complete seu pedido para ativar o plano {plan.nome}
              </p>

              {/* Progress */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <div
                  className={`flex items-center gap-2 ${
                    step === 'info' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === 'info' ? 'bg-primary text-white' : 'bg-muted'
                    }`}
                  >
                    1
                  </div>
                  <span className="text-sm font-medium">Dados</span>
                </div>

                <div className="w-12 h-0.5 bg-muted" />

                <div
                  className={`flex items-center gap-2 ${
                    step === 'payment' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === 'payment' ? 'bg-primary text-white' : 'bg-muted'
                    }`}
                  >
                    2
                  </div>
                  <span className="text-sm font-medium">Pagamento</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        {step === 'info' && renderInfoStep()}
        {step === 'payment' && renderPaymentStep()}
        {step === 'success' && renderSuccessStep()}
      </div>
    </div>
  );
}
