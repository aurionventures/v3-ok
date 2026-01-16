import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  FileText, 
  QrCode, 
  CreditCard, 
  ArrowRight, 
  ArrowLeft,
  Percent,
  CheckCircle2,
  ShoppingCart
} from 'lucide-react';
import { PLANS, ADDONS, revealPricing } from '@/data/pricingData';
import { CONTRACT_TERM_OPTIONS, PAYMENT_CYCLE_OPTIONS } from '@/types/billing';
import legacyLogo from "@/assets/legacy-logo-new.png";

type CheckoutStep = 'prazo' | 'pagamento';

export default function PlanCheckout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('prazo');
  
  // Parâmetros da URL
  const planId = searchParams.get('plan') || 'profissional';
  const porte = searchParams.get('porte') || 'smb_plus';
  const calculatedPrice = searchParams.get('calculatedPrice') ? parseFloat(searchParams.get('calculatedPrice')!) : undefined;
  const selectedAddonsFromUrl = searchParams.get('addons')?.split(',').filter(Boolean) || [];
  
  // Configuração do contrato
  const [contractTerm, setContractTerm] = useState<12 | 24 | 36>(12);
  const [paymentMethod, setPaymentMethod] = useState<'BOLETO' | 'PIX' | 'CARTAO'>('BOLETO');
  const [paymentCycle, setPaymentCycle] = useState<'monthly' | 'quarterly' | 'semi_annual' | 'annual'>('monthly');

  // Dados do plano
  const plan = PLANS.find((p) => p.id === planId) || PLANS[1];
  const pricing = revealPricing(planId, porte, calculatedPrice);
  const addons = ADDONS.filter((a) => selectedAddonsFromUrl.includes(a.id));

  // Calcular valores
  const termDiscount = CONTRACT_TERM_OPTIONS.find(t => t.value === contractTerm)?.discount || 0;
  const cycleDiscount = PAYMENT_CYCLE_OPTIONS.find(c => c.value === paymentCycle)?.discount || 0;
  const totalDiscount = termDiscount + cycleDiscount;

  const baseMonthly = pricing.mensal || 0;
  const addonsMonthly = addons.reduce((sum, a) => sum + a.precoMensal, 0);
  const totalMonthly = baseMonthly + addonsMonthly;
  const discountedMonthly = totalMonthly * (1 - totalDiscount / 100);

  const cycleMonths = {
    monthly: 1,
    quarterly: 3,
    semi_annual: 6,
    annual: 12,
  };

  const paymentValue = discountedMonthly * cycleMonths[paymentCycle];
  const totalContractValue = discountedMonthly * contractTerm;
  const setupFee = pricing.setup || 0;
  const firstPayment = setupFee + paymentValue;

  const formatCurrency = (value: number | undefined | null) => {
    const numValue = Number(value) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  };

  const handleContinue = () => {
    if (currentStep === 'prazo') {
      setCurrentStep('pagamento');
    } else {
      // Redirecionar para checkout completo com os parâmetros
      const params = new URLSearchParams({
        plan: planId,
        porte: porte,
        term: contractTerm.toString(),
        cycle: paymentCycle,
        billing: paymentMethod === 'CARTAO' ? 'CARTAO' : paymentMethod,
        source: 'plan-checkout',
      });

      if (calculatedPrice) {
        params.set('calculatedPrice', calculatedPrice.toString());
      }

      if (selectedAddonsFromUrl.length > 0) {
        params.set('addons', selectedAddonsFromUrl.join(','));
      }

      // Se for cartão, vai para checkout Stripe, senão vai para checkout contrato
      if (paymentMethod === 'CARTAO') {
        navigate(`/checkout?${params.toString()}`);
      } else {
        navigate(`/checkout-contrato?${params.toString()}`);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'pagamento') {
      setCurrentStep('prazo');
    } else {
      navigate('/pricing');
    }
  };

  const progress = currentStep === 'prazo' ? 50 : 100;

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
                <span className="font-semibold text-sm">Contratar Plano</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/pricing')} className="h-8">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">Voltar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center gap-2 ${currentStep === 'prazo' ? 'text-primary' : 'text-green-600'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                currentStep === 'prazo' ? 'bg-primary text-white' : 'bg-green-100 text-green-600'
              }`}>
                {currentStep === 'pagamento' ? <CheckCircle2 className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
              </div>
              <span className="text-sm font-medium">Prazo do Contrato</span>
            </div>
            <div className="flex-1 h-0.5 mx-4 bg-gray-200">
              <div className={`h-full transition-all ${currentStep === 'pagamento' ? 'bg-green-500 w-full' : 'bg-gray-200 w-0'}`} />
            </div>
            <div className={`flex items-center gap-2 ${currentStep === 'pagamento' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                currentStep === 'pagamento' ? 'bg-primary text-white' : 'bg-gray-100'
              }`}>
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Forma de Pagamento</span>
            </div>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Prazo do Contrato */}
            {currentStep === 'prazo' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Prazo do Contrato
                  </CardTitle>
                  <CardDescription>
                    Escolha o prazo do seu contrato. Contratos mais longos oferecem descontos progressivos.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Selecione o Prazo</Label>
                      {termDiscount > 0 && (
                        <Badge variant="secondary" className="text-sm text-green-600 bg-green-50 dark:bg-green-950">
                          Desconto: {termDiscount}%
                        </Badge>
                      )}
                    </div>
                    <RadioGroup 
                      value={String(contractTerm)} 
                      onValueChange={(v) => setContractTerm(Number(v) as 12 | 24 | 36)}
                      className="grid grid-cols-3 gap-4"
                    >
                      {CONTRACT_TERM_OPTIONS.map(option => {
                        const isSelected = contractTerm === option.value;
                        return (
                          <div key={option.value}>
                            <RadioGroupItem value={String(option.value)} id={`term-${option.value}`} className="peer sr-only" />
                            <Label 
                              htmlFor={`term-${option.value}`}
                              className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                                isSelected 
                                  ? 'border-primary bg-primary/10 shadow-lg' 
                                  : 'border-gray-200 hover:border-primary/50 hover:bg-muted/50'
                              }`}
                            >
                              <Calendar className={`h-8 w-8 mb-3 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className={`font-bold text-2xl mb-1 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                {option.value}
                              </span>
                              <span className="text-sm text-muted-foreground mb-2">meses</span>
                              {option.discount > 0 && (
                                <Badge 
                                  variant={isSelected ? "default" : "secondary"} 
                                  className={`text-xs px-3 py-1 mt-1 ${
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
                    <p className="text-sm text-muted-foreground">
                      Contratos de 24 e 36 meses oferecem descontos progressivos sobre o valor mensal.
                    </p>
                  </div>

                  {/* Resumo de Valores */}
                  {termDiscount > 0 && (
                    <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-300 mb-3">
                          <Percent className="h-4 w-4" />
                          <span className="font-medium text-sm">
                            Desconto aplicado: {termDiscount}%
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Valor mensal original</span>
                            <span className="line-through">{formatCurrency(totalMonthly)}</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>Valor mensal com desconto</span>
                            <span className="text-green-600">{formatCurrency(discountedMonthly)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Forma de Pagamento */}
            {currentStep === 'pagamento' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Forma de Pagamento
                  </CardTitle>
                  <CardDescription>
                    Escolha como deseja pagar pelo seu plano
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={(v) => setPaymentMethod(v as 'BOLETO' | 'PIX' | 'CARTAO')}
                    className="space-y-3"
                  >
                    <div>
                      <RadioGroupItem value="BOLETO" id="boleto" className="peer sr-only" />
                      <Label 
                        htmlFor="boleto"
                        className="flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-orange-500" />
                          <div>
                            <p className="font-medium">Boleto Bancário</p>
                            <p className="text-sm text-muted-foreground">Vencimento em 5 dias úteis</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="PIX" id="pix" className="peer sr-only" />
                      <Label 
                        htmlFor="pix"
                        className="flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <QrCode className="h-6 w-6 text-green-500" />
                          <div>
                            <p className="font-medium">PIX</p>
                            <p className="text-sm text-muted-foreground">Aprovação instantânea</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-green-600">5% OFF</Badge>
                      </Label>
                    </div>

                    <div>
                      <RadioGroupItem value="CARTAO" id="cartao" className="peer sr-only" />
                      <Label 
                        htmlFor="cartao"
                        className="flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-6 w-6 text-blue-500" />
                          <div>
                            <p className="font-medium">Cartão de Crédito</p>
                            <p className="text-sm text-muted-foreground">Até 12x sem juros</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Plano */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{plan.nome}</p>
                    <p className="text-xs text-muted-foreground">{plan.descricao}</p>
                  </div>
                  <span className="font-semibold text-sm">{formatCurrency(baseMonthly)}/mês</span>
                </div>
                
                {/* Add-ons */}
                {addons.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      {addons.map(addon => (
                        <div key={addon.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">+ {addon.nome}</span>
                          <span className="font-medium">{formatCurrency(addon.precoMensal)}/mês</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                <Separator />
                
                {/* Valores */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal mensal</span>
                    <span>{formatCurrency(totalMonthly)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto ({totalDiscount}%)</span>
                      <span>-{formatCurrency(totalMonthly - discountedMonthly)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold">Valor mensal</span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(discountedMonthly)}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                {/* Detalhes do Contrato */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prazo</span>
                    <span className="font-medium">{contractTerm} meses</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor total do contrato</span>
                    <span className="font-bold">{formatCurrency(totalContractValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa de Setup</span>
                    <span className="font-medium">{formatCurrency(setupFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">1ª Cobrança</p>
                      <p className="text-xs text-muted-foreground">
                        Setup + {PAYMENT_CYCLE_OPTIONS.find(c => c.value === paymentCycle)?.label.toLowerCase()}
                      </p>
                    </div>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(firstPayment)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botões de Navegação */}
        <div className="max-w-4xl mx-auto mt-6 flex items-center justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 'prazo' ? 'Voltar' : 'Anterior'}
          </Button>
          <Button onClick={handleContinue} size="lg" className="min-w-[200px]">
            {currentStep === 'prazo' ? (
              <>
                Continuar
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Finalizar Contratação
                <CheckCircle2 className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
