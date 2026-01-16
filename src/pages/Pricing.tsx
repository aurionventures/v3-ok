import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { MegaMenuHeader } from '@/components/header/MegaMenuHeader';
import { MegaFooter } from '@/components/footer';
import { FAQSection, pricingFAQs } from '@/components/footer/FAQSection';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Calculator,
  Check,
  X,
  Star,
  Lock,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  ClipboardList,
  ShieldAlert,
  Leaf,
  Globe,
  BarChart3,
  Bot,
  LineChart,
  Phone,
  TrendingUp,
  Zap,
  Target,
  Crown,
  ChevronDown,
  FileText,
  CreditCard,
} from 'lucide-react';
import legacyLogo from '@/assets/legacy-logo-new.png';
import { usePricingConfig } from '@/hooks/usePricingConfig';

import {
  PLANS,
  ADDONS,
  COMPARISON_FEATURES,
  PRICING_FAQ,
  FATURAMENTO_OPTIONS,
  MATURITY_OPTIONS,
  calculateComplexityScore,
  getComplexityLevel,
  recommendPlan,
  revealPricing,
  generateJustification,
  calculateROI,
  getWhatsAppUrl,
  getCalculatorWhatsAppMessage,
  calculatePlanPrice,
  mapFaturamentoToPorte,
} from '@/data/pricingData';

// Componente de Visualização Circular da Complexidade
function ComplexityCircle({ 
  score, 
  level 
}: { 
  score: number; 
  level: ReturnType<typeof getComplexityLevel>;
}) {
  // Normalizar score: mínimo visual de 10, máximo de 100
  // Se score < 10, mostra como 10% do círculo, mas mantém o valor real exibido
  const normalizedScore = Math.max(score, 10);
  const displayScore = score; // Valor real para exibição
  
  const circumference = 2 * Math.PI * 40; // raio 40
  const strokeDashoffset = circumference - ((normalizedScore / 100) * circumference);
  
  const getScoreColor = () => {
    if (level.level === 'Baixa') return 'text-green-600';
    if (level.level === 'Moderada') return 'text-yellow-600';
    if (level.level === 'Alta') return 'text-orange-600';
    return 'text-red-600';
  };
  
  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90 sm:w-28 sm:h-28">
        {/* Círculo de fundo */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-muted/30"
        />
        {/* Círculo de progresso */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn('transition-all duration-1000', getScoreColor())}
        />
      </svg>
      <div className="absolute text-center">
        <span className={cn('text-2xl sm:text-3xl font-bold block leading-none', getScoreColor())}>
          {displayScore.toFixed(1)}
        </span>
        <span className={cn('text-[9px] sm:text-[10px] font-medium mt-0.5 block', getScoreColor())}>
          {level.level}
        </span>
      </div>
    </div>
  );
}

// Mapeamento de ícones para add-ons
const ADDON_ICONS: Record<string, React.ElementType> = {
  ClipboardList,
  Users,
  Star,
  ShieldAlert,
  Leaf,
  Globe,
  BarChart3,
  Bot,
  LineChart,
};

// Tipo para os inputs da calculadora
interface CalculatorInputs {
  faturamento: string;
  numEmpresas: number;
  numConselhos: number;
  numComites: number;
  reunioesAno: number;
  numUsuarios: number;
  maturidade: string;
}

// Tipo para o resultado da calculadora
interface CalculatorResult {
  complexityScore: number;
  complexityLevel: ReturnType<typeof getComplexityLevel>;
  planoId: string;
  pricing: ReturnType<typeof revealPricing>;
  justificativa: string;
  roi: ReturnType<typeof calculateROI>;
  addOnsSugeridos: typeof ADDONS;
}

export default function Pricing() {
  const navigate = useNavigate();
  const { addons: addonsFromConfig, suggestedAddons } = usePricingConfig();
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calculatorResult, setCalculatorResult] = useState<CalculatorResult | null>(null);
  const [calculatorInputs, setCalculatorInputs] = useState<CalculatorInputs>({
    faturamento: '',
    numEmpresas: 0,
    numConselhos: 0,
    numComites: 0,
    reunioesAno: 0,
    numUsuarios: 0,
    maturidade: '',
  });

  // Estado para add-ons selecionados
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Mapear add-ons de usePricingConfig para formato usado no componente
  // Mapeamento: key do usePricingConfig -> id do pricingData
  const addonKeyToIdMap: Record<string, string> = {
    'desempenho_conselho': 'desempenho',
    'maturidade_esg': 'esg',
    'riscos': 'riscos',
    'inteligencia_mercado': 'inteligencia',
  };

  // Função para converter add-on de usePricingConfig para formato ADDONS
  const convertAddonFromConfig = (addon: typeof addonsFromConfig[0]): typeof ADDONS[0] | null => {
    const addonId = addonKeyToIdMap[addon.key];
    if (!addonId) return null;

    const baseAddon = ADDONS.find(a => a.id === addonId);
    if (!baseAddon) return null;

    // Retornar add-on com preços atualizados de usePricingConfig
    return {
      ...baseAddon,
      precoMensal: addon.monthly_price,
      precoAnual: addon.annual_price,
    };
  };

  // Toggle seleção de add-on
  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  // Calcular total com add-ons usando dados de usePricingConfig
  const calculateTotalWithAddons = useMemo(() => {
    if (!calculatorResult?.pricing.mensal) return null;

    const addonsMensal = selectedAddons.reduce((sum, addonId) => {
      // Buscar primeiro no formato convertido (se estiver nos sugeridos)
      const suggestedAddon = calculatorResult.addOnsSugeridos.find((a) => a.id === addonId);
      if (suggestedAddon) {
        return sum + (suggestedAddon.precoMensal || 0);
      }
      // Buscar no configurador de planos (usePricingConfig)
      const baseAddon = ADDONS.find((a) => a.id === addonId);
      if (baseAddon) {
        const addonFromConfig = addonsFromConfig.find((a) => {
          const mappedId = addonKeyToIdMap[a.key];
          return mappedId === addonId;
        });
        if (addonFromConfig) {
          return sum + (addonFromConfig.monthly_price || 0);
        }
      }
      // Fallback para ADDONS original (apenas se não encontrar no configurador)
      const addon = ADDONS.find((a) => a.id === addonId);
      return sum + (addon?.precoMensal || 0);
    }, 0);

    const addonsAnual = selectedAddons.reduce((sum, addonId) => {
      // Buscar primeiro no formato convertido (se estiver nos sugeridos)
      const suggestedAddon = calculatorResult.addOnsSugeridos.find((a) => a.id === addonId);
      if (suggestedAddon) {
        return sum + (suggestedAddon.precoAnual || 0);
      }
      // Buscar no configurador de planos (usePricingConfig)
      const baseAddon = ADDONS.find((a) => a.id === addonId);
      if (baseAddon) {
        const addonFromConfig = addonsFromConfig.find((a) => {
          const mappedId = addonKeyToIdMap[a.key];
          return mappedId === addonId;
        });
        if (addonFromConfig) {
          return sum + (addonFromConfig.annual_price || 0);
        }
      }
      // Fallback para ADDONS original (apenas se não encontrar no configurador)
      const addon = ADDONS.find((a) => a.id === addonId);
      return sum + (addon?.precoAnual || 0);
    }, 0);

    return {
      mensal: calculatorResult.pricing.mensal + addonsMensal,
      anual: calculatorResult.pricing.anual! + addonsAnual,
      mensalFormatted: `R$ ${(calculatorResult.pricing.mensal + addonsMensal).toLocaleString('pt-BR')}`,
      anualFormatted: `R$ ${(calculatorResult.pricing.anual! + addonsAnual).toLocaleString('pt-BR')}`,
      addonsMensal,
      addonsAnual,
    };
  }, [calculatorResult, selectedAddons, addonsFromConfig]);

  // Validação dos inputs da calculadora
  const canCalculate = useMemo(() => {
    return (
      calculatorInputs.faturamento &&
      calculatorInputs.numEmpresas >= 1 &&
      calculatorInputs.maturidade
    );
  }, [calculatorInputs]);

  // Função para calcular e mostrar resultado
  const handleCalculate = () => {
    const score = calculateComplexityScore({
      numEmpresas: calculatorInputs.numEmpresas,
      numConselhos: calculatorInputs.numConselhos,
      numComites: calculatorInputs.numComites,
      reunioesAno: calculatorInputs.reunioesAno,
    });

    // Usar valores padrão se não informados
    const numConselhos = calculatorInputs.numConselhos || 1;
    const reunioesAno = calculatorInputs.reunioesAno || 12;
    const numUsuarios = calculatorInputs.numUsuarios || 10;
    const maturidade = calculatorInputs.maturidade || 'basico';

    // Calcular preço usando nova lógica
    const calculatedPrice = calculatePlanPrice(
      calculatorInputs.faturamento,
      maturidade,
      numConselhos,
      calculatorInputs.numComites || 0,
      reunioesAno,
      numUsuarios
    );

    // Determinar plano baseado no preço calculado
    const planoId = recommendPlan(
      score, 
      calculatorInputs.faturamento,
      calculatorInputs.numComites,
      numUsuarios,
      maturidade,
      numConselhos,
      reunioesAno
    );

    // Mapear faturamento para porte
    const porte = mapFaturamentoToPorte(calculatorInputs.faturamento);
    
    // Revelar pricing com preço calculado
    const pricing = revealPricing(planoId, porte, calculatedPrice);
    
    const complexityLevel = getComplexityLevel(score);
    const justificativa = generateJustification({
      numEmpresas: calculatorInputs.numEmpresas,
      numConselhos: numConselhos,
      numComites: calculatorInputs.numComites || 0,
      reunioesAno: reunioesAno,
      planoId,
    });
    const roi = calculateROI(planoId);

    // Sugerir add-ons usando configuração do admin (sempre 3: ESG, Desempenho, Inteligência)
    // Usar dados de usePricingConfig ao invés de valores fixos
    const addOnsSugeridos: typeof ADDONS = [];
    
    // Usar configuração de suggested addons (padrão: ESG, Desempenho, Inteligência)
    const addonKeysToSuggest = suggestedAddons.enabled || ['maturidade_esg', 'desempenho_conselho', 'inteligencia_mercado'];
    
    // Garantir ordem específica usando dados de usePricingConfig
    addonKeysToSuggest.forEach(key => {
      const addonFromConfig = addonsFromConfig.find(a => a.key === key && a.is_active && a.is_visible);
      if (addonFromConfig) {
        const convertedAddon = convertAddonFromConfig(addonFromConfig);
        if (convertedAddon) {
          addOnsSugeridos.push(convertedAddon);
        }
      }
    });

    setCalculatorResult({
      complexityScore: score,
      complexityLevel,
      planoId,
      pricing,
      justificativa,
      roi,
      addOnsSugeridos,
    });

    // Salvar resultado para uso posterior
    localStorage.setItem(
      'calculator_result',
      JSON.stringify({
        ...calculatorInputs,
        complexityScore: score,
        planoId,
        pricing,
        timestamp: new Date().toISOString(),
      })
    );
  };

  // Função para abrir WhatsApp add-on
  const handleAddonConsultar = (addon: (typeof ADDONS)[0]) => {
    window.open(getWhatsAppUrl(addon.whatsappMessage), '_blank');
    toast.success('Abrindo WhatsApp...');
  };

  // Função para ir para checkout Stripe
  const handleStartTrial = () => {
    if (!calculatorResult) return;

    // Calcular preço total com add-ons
    const totalAnual = calculateTotalWithAddons?.anual || calculatorResult.pricing.anual || 0;

    const params = new URLSearchParams({
      plan: calculatorResult.planoId,
      price: totalAnual.toString(),
      source: 'calculator',
    });

    // Adicionar add-ons selecionados se houver
    if (selectedAddons.length > 0) {
      params.set('addons', selectedAddons.join(','));
    }

    // Redirecionar para checkout Stripe
    navigate(`/checkout?${params.toString()}`);
  };

  // Função para ir para checkout com contrato (Asaas)
  const handleContractCheckout = () => {
    if (!calculatorResult) return;

    const params = new URLSearchParams({
      plan: calculatorResult.planoId,
      porte: calculatorInputs.faturamento,
      source: 'calculator',
    });

    // Adicionar add-ons selecionados se houver
    if (selectedAddons.length > 0) {
      params.set('addons', selectedAddons.join(','));
    }

    // Redirecionar para checkout com contrato
    navigate(`/checkout-contrato?${params.toString()}`);
  };

  // Função para falar com especialista
  const handleContactSpecialist = () => {
    const message = calculatorResult
      ? getCalculatorWhatsAppMessage(
          calculatorResult.complexityScore,
          calculatorResult.planoId
        )
      : 'Olá! Gostaria de falar com um especialista sobre os planos da Legacy.';

    window.open(getWhatsAppUrl(message), '_blank');
  };

  // Renderizar ícone do add-on
  const renderAddonIcon = (iconName: string) => {
    const Icon = ADDON_ICONS[iconName] || ClipboardList;
    return <Icon className="h-8 w-8" />;
  };

  // Renderizar valor na tabela de comparação
  const renderFeatureValue = (value: boolean | string) => {
    if (value === true) {
      return <Check className="h-5 w-5 text-green-600 mx-auto" />;
    }
    if (value === false) {
      return <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />;
    }
    if (value === 'Escolher') {
      return (
        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
          Escolher
        </span>
      );
    }
    if (value === 'Comprar') {
      return (
        <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
          Comprar
        </span>
      );
    }
    return <span className="text-sm">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-corporate-dark">
      {/* Header */}
      <MegaMenuHeader />

      {/* Hero Section - com padding-top para compensar o header fixo */}
      <section className="relative overflow-hidden bg-gradient-hero pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(192,160,98,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[length:60px_60px]" />

        <div className="relative container mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight font-heading">
              Planos Personalizados.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/80">
                Usuários Ilimitados.
              </span>
            </h1>

            <p className="text-xl lg:text-2xl mb-4 text-white/90 leading-relaxed max-w-3xl mx-auto">
              Descubra o investimento ideal para sua empresa em 2 minutos.
            </p>

            <p className="text-lg text-white/70 mb-8">
              "Cada empresa é única. Nosso preço também."
            </p>

            <Button
              size="lg"
              onClick={() => setCalculatorOpen(true)}
              className="bg-accent text-primary hover:bg-accent/90 text-base md:text-lg px-6 md:px-8 py-4 md:py-3 h-auto min-h-[48px] md:h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 whitespace-normal"
            >
              <Target className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="text-center">Descobrir Meu Plano e Investimento</span>
              <ArrowRight className="h-5 w-5 ml-2 flex-shrink-0" />
            </Button>
          </div>
        </div>
      </section>

      {/* Planos e Add-ons Section - Visão Unificada */}
      <section className="py-20 bg-corporate-mid">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              Escolha o Plano Ideal para sua{' '}
              <span className="text-accent">Governança</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Todos os planos incluem usuários ilimitados e os 13 módulos core
              da plataforma.
            </p>
          </div>

          {/* Tabela de Comparação Unificada - Planos + Add-ons */}
          <div className="max-w-6xl mx-auto overflow-x-auto">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr>
                        <th className="text-left p-4 font-medium min-w-[200px]">
                          Funcionalidade
                        </th>
                        {PLANS.map((plan) => (
                          <th
                            key={plan.id}
                            className="text-center p-4 font-medium min-w-[120px]"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span>{plan.nome}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 mt-1"
                                onClick={() =>
                                  plan.isEnterprise
                                    ? handleContactSpecialist()
                                    : setCalculatorOpen(true)
                                }
                              >
                                {plan.isEnterprise ? 'Consultar' : 'Ver Preço'}
                              </Button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {['Core', 'Add-ons', 'Limites', 'Suporte', 'Segurança'].map(
                        (categoria) => (
                          <React.Fragment key={categoria}>
                            {/* Categoria Header */}
                            <tr
                              className={`bg-muted/30 border-t-2 ${
                                categoria === 'Add-ons' 
                                  ? 'border-accent/40 bg-accent/5' 
                                  : 'border-primary/20'
                              }`}
                            >
                              <td
                                colSpan={5}
                                className={`p-3 font-semibold text-sm uppercase tracking-wide flex items-center gap-2 ${
                                  categoria === 'Add-ons' 
                                    ? 'text-accent' 
                                    : 'text-primary'
                                }`}
                              >
                                {categoria === 'Add-ons' && <Crown className="h-4 w-4" />}
                                {categoria}
                                {categoria === 'Add-ons' && (
                                  <span className="text-xs font-normal text-muted-foreground ml-2">
                                    (Módulos Premium)
                                  </span>
                                )}
                              </td>
                            </tr>
                            {/* Features da categoria */}
                            {COMPARISON_FEATURES.filter(
                              (f) => f.categoria === categoria
                            ).map((feature, idx) => (
                              <tr
                                key={`${categoria}-${idx}`}
                                className={`border-t hover:bg-muted/20 ${
                                  categoria === 'Add-ons' ? 'bg-accent/[0.02]' : ''
                                }`}
                              >
                                <td className="p-4 text-sm">
                                  {feature.nome}
                                </td>
                                <td className="p-4 text-center">
                                  {renderFeatureValue(feature.essencial)}
                                </td>
                                <td className="p-4 text-center">
                                  {renderFeatureValue(feature.profissional)}
                                </td>
                                <td className="p-4 text-center">
                                  {renderFeatureValue(feature.business)}
                                </td>
                                <td className="p-4 text-center">
                                  {renderFeatureValue(feature.enterprise)}
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>


      {/* FAQ Section */}
      <FAQSection 
        title="Perguntas Frequentes"
        subtitle="Tire suas dúvidas sobre nossos planos e preços"
        faqs={pricingFAQs}
      />

      {/* CTA Final Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Pronto para transformar sua{' '}
              <span className="text-accent">governança</span>?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Descubra em 2 minutos qual plano é ideal para sua empresa.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setCalculatorOpen(true)}
                className="bg-accent text-primary hover:bg-accent/90 text-lg px-8 py-3 h-12 rounded-lg"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Descobrir Meu Investimento
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleContactSpecialist}
                className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8 py-3 h-12 rounded-lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Falar com Especialista
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <MegaFooter />

      {/* Modal Calculadora */}
      <Dialog open={calculatorOpen} onOpenChange={setCalculatorOpen}>
        <DialogContent className="max-w-4xl sm:max-w-5xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          {!calculatorResult ? (
            <>
              <DialogHeader className="pb-2">
                <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Descubra Seu Plano Ideal
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Responda as perguntas abaixo (leva 2 minutos).
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-2">
                {/* Faturamento e Maturidade - Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="faturamento" className="text-xs sm:text-sm">
                      Faturamento anual *
                    </Label>
                    <Select
                      value={calculatorInputs.faturamento}
                      onValueChange={(value) =>
                        setCalculatorInputs((prev) => ({
                          ...prev,
                          faturamento: value,
                        }))
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {FATURAMENTO_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="maturidade" className="text-xs sm:text-sm">
                      Maturidade da governança *
                    </Label>
                    <Select
                      value={calculatorInputs.maturidade}
                      onValueChange={(value) =>
                        setCalculatorInputs((prev) => ({
                          ...prev,
                          maturidade: value,
                        }))
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {MATURITY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Campos numéricos em grid compacto */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="numEmpresas" className="text-xs">Empresas *</Label>
                    <Input
                      id="numEmpresas"
                      type="number"
                      min={1}
                      max={50}
                      placeholder="1"
                      className="h-9"
                      value={calculatorInputs.numEmpresas || ''}
                      onChange={(e) =>
                        setCalculatorInputs((prev) => ({
                          ...prev,
                          numEmpresas: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="numConselhos" className="text-xs">Conselhos</Label>
                    <Input
                      id="numConselhos"
                      type="number"
                      min={0}
                      max={20}
                      placeholder="0"
                      className="h-9"
                      value={calculatorInputs.numConselhos || ''}
                      onChange={(e) =>
                        setCalculatorInputs((prev) => ({
                          ...prev,
                          numConselhos: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="numComites" className="text-xs">Comitês</Label>
                    <Input
                      id="numComites"
                      type="number"
                      min={0}
                      max={50}
                      placeholder="0"
                      className="h-9"
                      value={calculatorInputs.numComites || ''}
                      onChange={(e) =>
                        setCalculatorInputs((prev) => ({
                          ...prev,
                          numComites: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="reunioesAno" className="text-xs">Reuniões/ano</Label>
                    <Input
                      id="reunioesAno"
                      type="number"
                      min={0}
                      max={300}
                      placeholder="12"
                      className="h-9"
                      value={calculatorInputs.reunioesAno || ''}
                      onChange={(e) =>
                        setCalculatorInputs((prev) => ({
                          ...prev,
                          reunioesAno: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-1 col-span-2 sm:col-span-2">
                    <Label htmlFor="numUsuarios" className="text-xs">
                      Usuários esperados
                      <span className="text-muted-foreground ml-1">(ilimitados)</span>
                    </Label>
                    <Input
                      id="numUsuarios"
                      type="number"
                      min={1}
                      max={500}
                      placeholder="40"
                      className="h-9"
                      value={calculatorInputs.numUsuarios || ''}
                      onChange={(e) =>
                        setCalculatorInputs((prev) => ({
                          ...prev,
                          numUsuarios: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCalculate}
                  disabled={!canCalculate}
                  className="w-full bg-accent hover:bg-accent/90 text-primary-foreground mt-2"
                  size="default"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Calcular Plano e Investimento
                </Button>
              </div>
            </>
          ) : (
            <>
              <DialogHeader className="pb-2">
                <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="truncate">Seu Plano Ideal</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Layout em 2 colunas para desktop, 1 coluna para mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                  {/* Coluna Esquerda: Plano Recomendado */}
                  <Card className="border-2 border-accent bg-accent/5">
                    <CardContent className="pt-3 pb-3 sm:pt-4 sm:pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Crown className="h-5 w-5 text-accent" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold truncate">
                            {
                              PLANS.find((p) => p.id === calculatorResult.planoId)
                                ?.nome
                            }
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            Ideal para sua empresa
                          </Badge>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3 mb-3">
                        <p className="text-xs text-muted-foreground mb-3 text-center font-medium">
                          Índice de Complexidade
                        </p>
                        
                        {/* Visualização Circular da Complexidade */}
                        <div className="flex flex-col items-center gap-3 mb-2">
                          {/* Círculo Progressivo */}
                          <ComplexityCircle 
                            score={calculatorResult.complexityScore}
                            level={calculatorResult.complexityLevel}
                          />
                          
                          {/* Barra de Progresso com Marcadores */}
                          <div className="w-full">
                            <div className="relative">
                              {/* Normalizar: mínimo 10% visualmente, mas manter escala 0-100 */}
                              <div className="border border-border rounded-full overflow-hidden mb-2">
                                <Progress 
                                  value={Math.min(Math.max((Math.max(calculatorResult.complexityScore, 10) / 100) * 100, 10), 100)} 
                                  className="h-3"
                                />
                              </div>
                              {/* Marcadores de Níveis */}
                              <div className="relative flex justify-between px-1 mt-1">
                                <div className="flex flex-col items-center">
                                  <div className="w-1 h-1 rounded-full bg-green-600"></div>
                                  <span className="text-[8px] text-muted-foreground mt-0.5">Baixa</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-1 h-1 rounded-full bg-yellow-600"></div>
                                  <span className="text-[8px] text-muted-foreground mt-0.5">Moderada</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-1 h-1 rounded-full bg-orange-600"></div>
                                  <span className="text-[8px] text-muted-foreground mt-0.5">Alta</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-1 h-1 rounded-full bg-red-600"></div>
                                  <span className="text-[8px] text-muted-foreground mt-0.5">Muito Alta</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {calculatorResult.justificativa}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Coluna Direita: Preço Revelado */}
                  <Card className="border-2 border-green-500/30 bg-green-50/50">
                    <CardContent className="pt-3 pb-3 sm:pt-4 sm:pb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <h4 className="font-semibold text-green-800 text-sm">
                          SEU INVESTIMENTO
                        </h4>
                      </div>

                      {calculatorResult.pricing.mensal ? (
                        <div className="space-y-2.5">
                          {/* Preço Mensal e Anual - Anual alinhado à direita */}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[10px] text-muted-foreground mb-0.5">Mensal</p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-foreground">
                                  {calculatorResult.pricing.mensalFormatted}
                                </span>
                                <span className="text-xs text-muted-foreground">/mês</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-muted-foreground mb-0.5">Anual</p>
                              <div className="flex items-baseline gap-1 justify-end">
                                <span className="text-xl font-bold text-foreground">
                                  {calculatorResult.pricing.anualFormatted}
                                </span>
                                <span className="text-xs text-muted-foreground">/ano</span>
                              </div>
                            </div>
                          </div>

                          {calculatorResult.pricing.economiaFormatted && (
                            <Badge className="bg-green-600 text-white text-xs w-full justify-center">
                              {calculatorResult.pricing.economiaFormatted} (2 meses)
                            </Badge>
                          )}

                          {/* Setup Fee - Compacto */}
                          {calculatorResult.pricing.setup && calculatorResult.pricing.setup > 0 && (
                            <div className="pt-2 border-t border-dashed">
                              <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-medium">Taxa de Setup</p>
                                  <p className="text-[10px] text-muted-foreground">
                                    Única vez
                                  </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <span className="text-base font-bold">{calculatorResult.pricing.setupFormatted}</span>
                                  <p className="text-[10px] text-green-600">
                                    50% OFF anual
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-3">
                          <p className="text-sm font-medium text-foreground mb-1">
                            Pricing Personalizado
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Entre em contato para uma proposta sob medida.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Add-ons Sugeridos - Grid compacto */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                    <Crown className="h-3.5 w-3.5 text-accent" />
                    Add-ons Sugeridos
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Selecione os add-ons para adicionar ao seu plano:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {calculatorResult.addOnsSugeridos.map((addon) => {
                      const isSelected = selectedAddons.includes(addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon.id)}
                          className={`flex items-center justify-between p-2.5 border rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'border-accent bg-accent/5 ring-1 ring-accent'
                              : 'hover:border-accent/50'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? 'bg-accent border-accent'
                                  : 'border-muted-foreground/30'
                              }`}
                            >
                              {isSelected && (
                                <Check className="h-2.5 w-2.5 text-white" />
                              )}
                            </div>
                            <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                              {renderAddonIcon(addon.icone)}
                            </div>
                            <span className="font-medium text-xs truncate">
                              {addon.nome}
                            </span>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <p className="font-semibold text-xs whitespace-nowrap">
                              R$ {addon.precoMensal.toLocaleString('pt-BR')}/mês
                            </p>
                            <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                              R$ {addon.precoAnual.toLocaleString('pt-BR')}/ano
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total com Add-ons - Compacto */}
                  {selectedAddons.length > 0 && calculateTotalWithAddons && (
                    <div className="mt-3 p-3 bg-accent/10 rounded-lg border border-accent/30">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium">
                          Plano + {selectedAddons.length} add-on
                          {selectedAddons.length > 1 ? 's' : ''}:
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-accent">
                          {calculateTotalWithAddons.mensalFormatted}
                        </span>
                        <span className="text-xs text-muted-foreground">/mês</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-base font-semibold">
                          {calculateTotalWithAddons.anualFormatted}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          /ano
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTAs - Compacto */}
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    onClick={handleContractCheckout}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="default"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Contratar com Boleto/PIX
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleStartTrial}
                      variant="outline"
                      size="default"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pagar com Cartão
                    </Button>
                    <Button
                      onClick={handleContactSpecialist}
                      variant="outline"
                      size="default"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Falar com Especialista
                    </Button>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setCalculatorResult(null);
                    setSelectedAddons([]);
                  }}
                  className="w-full text-xs"
                  size="sm"
                >
                  <ArrowRight className="h-3 w-3 mr-2 rotate-180" />
                  Refazer cálculo
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
