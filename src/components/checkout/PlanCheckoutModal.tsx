import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  FileText, 
  QrCode, 
  CreditCard, 
  ArrowRight, 
  Percent,
  CheckCircle2
} from 'lucide-react';
import { PLANS, ADDONS, revealPricing, mapFaturamentoToPorte } from '@/data/pricingData';
import { CONTRACT_TERM_OPTIONS, PAYMENT_CYCLE_OPTIONS } from '@/types/billing';
import { toast } from 'sonner';

interface PlanCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  porte: string;
  calculatedPrice?: number;
  selectedAddons?: string[];
}

type CheckoutStep = 'prazo' | 'pagamento';

export function PlanCheckoutModal({
  open,
  onOpenChange,
  planId,
  porte,
  calculatedPrice,
  selectedAddons = []
}: PlanCheckoutModalProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('prazo');
  
  // Configuração do contrato
  const [contractTerm, setContractTerm] = useState<12 | 24 | 36>(12);
  const [paymentCycle, setPaymentCycle] = useState<'monthly' | 'quarterly' | 'semi_annual' | 'annual'>('monthly');
  const [billingType, setBillingType] = useState<'BOLETO' | 'PIX'>('BOLETO');

  // Dados do plano
  const plan = PLANS.find((p) => p.id === planId) || PLANS[1];
  const pricing = revealPricing(planId, porte, calculatedPrice);
  const addons = ADDONS.filter((a) => selectedAddons.includes(a.id));

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
        billing: billingType,
        source: 'modal',
      });

      if (calculatedPrice) {
        params.set('calculatedPrice', calculatedPrice.toString());
      }

      if (selectedAddons.length > 0) {
        params.set('addons', selectedAddons.join(','));
      }

      onOpenChange(false);
      navigate(`/checkout-contrato?${params.toString()}`);
    }
  };

  const handleBack = () => {
    if (currentStep === 'pagamento') {
      setCurrentStep('prazo');
    } else {
      onOpenChange(false);
    }
  };

  // Reset ao fechar
  useEffect(() => {
    if (!open) {
      setCurrentStep('prazo');
      setContractTerm(12);
      setPaymentCycle('monthly');
      setBillingType('BOLETO');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Contratar Plano</DialogTitle>
          <DialogDescription>
            Configure o prazo do contrato e escolha a forma de pagamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Resumo do Plano */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">{plan.nome}</h3>
                  <p className="text-sm text-muted-foreground">{plan.descricao}</p>
                </div>
                <Badge className="text-sm px-3 py-1">
                  {formatCurrency(baseMonthly)}/mês
                </Badge>
              </div>
              {addons.length > 0 && (
                <>
                  <Separator className="my-2" />
                  <div className="space-y-1">
                    {addons.map(addon => (
                      <div key={addon.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">+ {addon.nome}</span>
                        <span className="font-medium">{formatCurrency(addon.precoMensal)}/mês</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Step 1: Prazo do Contrato */}
          {currentStep === 'prazo' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Prazo do Contrato</Label>
                  {termDiscount > 0 && (
                    <Badge variant="secondary" className="text-sm text-green-600 bg-green-50 dark:bg-green-950">
                      Desconto: {termDiscount}%
                    </Badge>
                  )}
                </div>
                <RadioGroup 
                  value={String(contractTerm)} 
                  onValueChange={(v) => setContractTerm(Number(v) as 12 | 24 | 36)}
                  className="grid grid-cols-3 gap-3"
                >
                  {CONTRACT_TERM_OPTIONS.map(option => {
                    const isSelected = contractTerm === option.value;
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
                          <Calendar className={`h-6 w-6 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className={`font-bold text-xl ${isSelected ? 'text-primary' : 'text-foreground'}`}>
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

              {/* Resumo de Valores */}
              {termDiscount > 0 && (
                <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-300 mb-2">
                      <Percent className="h-4 w-4" />
                      <span className="font-medium text-sm">
                        Desconto aplicado: {termDiscount}%
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
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
            </div>
          )}

          {/* Step 2: Tipo de Pagamento */}
          {currentStep === 'pagamento' && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Forma de Pagamento</Label>
              <RadioGroup 
                value={billingType} 
                onValueChange={(v) => setBillingType(v as 'BOLETO' | 'PIX')}
                className="space-y-3"
              >
                <div>
                  <RadioGroupItem value="BOLETO" id="boleto" className="peer sr-only" />
                  <Label 
                    htmlFor="boleto"
                    className="flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-orange-500" />
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
                      <QrCode className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">PIX</p>
                        <p className="text-sm text-muted-foreground">Aprovação instantânea</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-green-600">5% OFF</Badge>
                  </Label>
                </div>
              </RadioGroup>

              {/* Resumo Final */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-3">Resumo do Contrato</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prazo</span>
                      <span className="font-medium">{contractTerm} meses</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor mensal</span>
                      <span className="font-medium">{formatCurrency(discountedMonthly)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor total do contrato</span>
                      <span className="font-bold">{formatCurrency(totalContractValue)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">1ª Cobrança</span>
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(firstPayment)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Setup ({formatCurrency(setupFee)}) + {PAYMENT_CYCLE_OPTIONS.find(c => c.value === paymentCycle)?.label.toLowerCase()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Botões */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleBack}>
              {currentStep === 'prazo' ? 'Cancelar' : 'Voltar'}
            </Button>
            <Button onClick={handleContinue} className="min-w-[120px]">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
