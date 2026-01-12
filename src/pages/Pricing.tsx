import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
} from 'lucide-react';
import legacyLogo from '@/assets/legacy-logo-new.png';

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
} from '@/data/pricingData';

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

  // Toggle seleção de add-on
  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  // Calcular total com add-ons
  const calculateTotalWithAddons = useMemo(() => {
    if (!calculatorResult?.pricing.mensal) return null;

    const addonsMensal = selectedAddons.reduce((sum, addonId) => {
      const addon = ADDONS.find((a) => a.id === addonId);
      return sum + (addon?.precoMensal || 0);
    }, 0);

    const addonsAnual = selectedAddons.reduce((sum, addonId) => {
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
  }, [calculatorResult, selectedAddons]);

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

    const planoId = recommendPlan(score, calculatorInputs.faturamento);
    const pricing = revealPricing(planoId);
    const complexityLevel = getComplexityLevel(score);
    const justificativa = generateJustification({
      numEmpresas: calculatorInputs.numEmpresas,
      numConselhos: calculatorInputs.numConselhos,
      numComites: calculatorInputs.numComites,
      reunioesAno: calculatorInputs.reunioesAno,
      planoId,
    });
    const roi = calculateROI(planoId);

    // Sugerir add-ons baseado na maturidade
    const addOnsSugeridos = ADDONS.filter((a) =>
      ['riscos', 'esg', 'inteligencia'].includes(a.id)
    );

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={legacyLogo}
              alt="Legacy"
              className="h-8 w-auto cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Produto
            </button>
            <button className="text-foreground font-medium">Pricing</button>
            <button
              onClick={() => navigate('/#contato')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contato
            </button>
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              size="sm"
              onClick={() => setCalculatorOpen(true)}
              className="bg-accent hover:bg-accent/90 text-primary-foreground"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Descobrir Meu Plano
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[length:60px_60px]" />

        <div className="relative container mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-6 bg-white/10 text-white border-white/20">
              <Sparkles className="h-3 w-3 mr-1" />
              Planos Personalizados
            </Badge>

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
              className="bg-accent text-primary hover:bg-accent/90 text-lg px-8 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Target className="h-5 w-5 mr-2" />
              Descobrir Meu Plano e Investimento
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Planos e Add-ons Section - Visão Unificada */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Escolha o Plano Ideal para sua{' '}
              <span className="text-primary">Governança</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                      {['Core', 'AI Engine', 'Add-ons', 'Limites', 'Suporte', 'Segurança'].map(
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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tire suas dúvidas sobre nossos planos e preços.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {PRICING_FAQ.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border rounded-lg bg-card"
                >
                  <AccordionTrigger className="text-left font-medium px-6 py-4 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed px-6 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90">
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
                className="bg-accent text-primary hover:bg-accent/90 text-lg px-8 py-6 h-auto rounded-xl"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Descobrir Meu Investimento
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleContactSpecialist}
                className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto rounded-xl"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Falar com Especialista
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <img src={legacyLogo} alt="Legacy" className="h-8 w-auto" />
                <p className="text-sm text-muted-foreground">
                  Sistema Operacional de Governança para empresas de controle
                  concentrado.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Soluções</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>Governança Corporativa</div>
                  <div>Estrutura Societária</div>
                  <div>Planejamento Sucessório</div>
                  <div>Gestão de Riscos</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Planos</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>Essencial</div>
                  <div>Profissional</div>
                  <div>Business</div>
                  <div>Enterprise</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Contato</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>contato@governancalegacy.com</div>
                  <div>+55 (47) 99162-2220</div>
                  <div className="leading-relaxed">
                    Av. Brig. Faria Lima, 1811. ESC 1119
                    <br />
                    Jardim Paulistano, São Paulo - SP
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2026 Legacy. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Calculadora */}
      <Dialog open={calculatorOpen} onOpenChange={setCalculatorOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {!calculatorResult ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-primary" />
                  Descubra Seu Plano e Investimento Ideal
                </DialogTitle>
                <DialogDescription>
                  Responda 7 perguntas rápidas e descubra qual plano é perfeito
                  para sua empresa (leva 2 minutos).
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Faturamento */}
                <div className="space-y-2">
                  <Label htmlFor="faturamento">
                    Faturamento anual da empresa *
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
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a faixa de faturamento" />
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

                {/* Número de Empresas */}
                <div className="space-y-2">
                  <Label htmlFor="numEmpresas">Número de empresas do grupo *</Label>
                  <Input
                    id="numEmpresas"
                    type="number"
                    min={1}
                    max={50}
                    placeholder="Ex: 1"
                    value={calculatorInputs.numEmpresas || ''}
                    onChange={(e) =>
                      setCalculatorInputs((prev) => ({
                        ...prev,
                        numEmpresas: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                {/* Número de Conselhos */}
                <div className="space-y-2">
                  <Label htmlFor="numConselhos">Número de conselhos</Label>
                  <Input
                    id="numConselhos"
                    type="number"
                    min={0}
                    max={20}
                    placeholder="Ex: 1"
                    value={calculatorInputs.numConselhos || ''}
                    onChange={(e) =>
                      setCalculatorInputs((prev) => ({
                        ...prev,
                        numConselhos: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                {/* Número de Comitês */}
                <div className="space-y-2">
                  <Label htmlFor="numComites">Número de comitês</Label>
                  <Input
                    id="numComites"
                    type="number"
                    min={0}
                    max={50}
                    placeholder="Ex: 2"
                    value={calculatorInputs.numComites || ''}
                    onChange={(e) =>
                      setCalculatorInputs((prev) => ({
                        ...prev,
                        numComites: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                {/* Reuniões por ano */}
                <div className="space-y-2">
                  <Label htmlFor="reunioesAno">
                    Reuniões estimadas por ano
                  </Label>
                  <Input
                    id="reunioesAno"
                    type="number"
                    min={0}
                    max={300}
                    placeholder="Ex: 12"
                    value={calculatorInputs.reunioesAno || ''}
                    onChange={(e) =>
                      setCalculatorInputs((prev) => ({
                        ...prev,
                        reunioesAno: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                {/* Usuários esperados */}
                <div className="space-y-2">
                  <Label htmlFor="numUsuarios">
                    Usuários esperados (informativo)
                  </Label>
                  <Input
                    id="numUsuarios"
                    type="number"
                    min={1}
                    max={500}
                    value={calculatorInputs.numUsuarios}
                    onChange={(e) =>
                      setCalculatorInputs((prev) => ({
                        ...prev,
                        numUsuarios: parseInt(e.target.value) || 10,
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Todos os planos incluem usuários ilimitados.
                  </p>
                </div>

                {/* Maturidade */}
                <div className="space-y-2">
                  <Label htmlFor="maturidade">
                    Nível de maturidade da governança *
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
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível de maturidade" />
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

                <Button
                  onClick={handleCalculate}
                  disabled={!canCalculate}
                  className="w-full bg-accent hover:bg-accent/90 text-primary-foreground"
                  size="lg"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Calcular Plano e Investimento
                </Button>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <Target className="h-6 w-6 text-green-600" />
                  Seu Plano Ideal:{' '}
                  {PLANS.find((p) => p.id === calculatorResult.planoId)?.nome}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Plano Recomendado */}
                <Card className="border-2 border-accent bg-accent/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                        <Crown className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">
                          {
                            PLANS.find((p) => p.id === calculatorResult.planoId)
                              ?.nome
                          }
                        </h3>
                        <Badge variant="secondary">
                          Ideal para sua empresa
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Índice de Complexidade
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">
                          {calculatorResult.complexityScore}
                        </span>
                        <span
                          className={`text-sm font-medium ${calculatorResult.complexityLevel.color}`}
                        >
                          Complexidade {calculatorResult.complexityLevel.level}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {calculatorResult.justificativa}
                    </p>
                  </CardContent>
                </Card>

                {/* Preço Revelado */}
                <Card className="border-2 border-green-500/30 bg-green-50/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">
                        SEU INVESTIMENTO
                      </h4>
                    </div>

                    {calculatorResult.pricing.mensal ? (
                      <div className="space-y-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-foreground">
                            {calculatorResult.pricing.mensalFormatted}
                          </span>
                          <span className="text-muted-foreground">/mês</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-lg">ou</span>
                          <span className="text-2xl font-bold text-foreground">
                            {calculatorResult.pricing.anualFormatted}
                          </span>
                          <span className="text-muted-foreground">/ano</span>
                        </div>

                        {calculatorResult.pricing.economiaFormatted && (
                          <Badge className="bg-green-600 text-white">
                            {calculatorResult.pricing.economiaFormatted} (2 meses)
                          </Badge>
                        )}

                        {/* Setup Fee - PRD v3.0 */}
                        {calculatorResult.pricing.setup && calculatorResult.pricing.setup > 0 && (
                          <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-dashed">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">Taxa de Setup (única vez)</p>
                                <p className="text-xs text-muted-foreground">
                                  Onboarding personalizado + treinamento
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-bold">{calculatorResult.pricing.setupFormatted}</span>
                                <p className="text-xs text-green-600">
                                  50% OFF no anual à vista
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="pt-4 border-t space-y-2">
                          <p className="text-sm font-medium">Incluso:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              {PLANS.find(
                                (p) => p.id === calculatorResult.planoId
                              )?.limites.empresas === 'ilimitado'
                                ? 'Empresas ilimitadas'
                                : `${PLANS.find((p) => p.id === calculatorResult.planoId)?.limites.empresas} empresas`}
                              , usuários ilimitados
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              AI Engine{' '}
                              {
                                PLANS.find(
                                  (p) => p.id === calculatorResult.planoId
                                )?.limites.aiEngine
                              }
                              , 13 módulos core
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              {
                                PLANS.find(
                                  (p) => p.id === calculatorResult.planoId
                                )?.limites.addonsInclusos
                              }{' '}
                              add-ons à sua escolha
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-lg font-medium text-foreground mb-2">
                          Pricing Personalizado
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Entre em contato para uma proposta sob medida para sua
                          corporação.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Add-ons Sugeridos com Preços e Seleção */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-accent" />
                    Add-ons Sugeridos
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Selecione os add-ons para adicionar ao seu plano:
                  </p>
                  <div className="space-y-2">
                    {calculatorResult.addOnsSugeridos.map((addon) => {
                      const isSelected = selectedAddons.includes(addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon.id)}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'border-accent bg-accent/5 ring-1 ring-accent'
                              : 'hover:border-accent/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                isSelected
                                  ? 'bg-accent border-accent'
                                  : 'border-muted-foreground/30'
                              }`}
                            >
                              {isSelected && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                              {renderAddonIcon(addon.icone)}
                            </div>
                            <span className="font-medium text-sm">
                              {addon.nome}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">
                              R$ {addon.precoMensal.toLocaleString('pt-BR')}/mês
                            </p>
                            <p className="text-xs text-muted-foreground">
                              R$ {addon.precoAnual.toLocaleString('pt-BR')}/ano
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total com Add-ons */}
                  {selectedAddons.length > 0 && calculateTotalWithAddons && (
                    <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Plano + {selectedAddons.length} add-on
                          {selectedAddons.length > 1 ? 's' : ''}:
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-accent">
                          {calculateTotalWithAddons.mensalFormatted}
                        </span>
                        <span className="text-muted-foreground">/mês</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-semibold">
                          {calculateTotalWithAddons.anualFormatted}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          /ano
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleStartTrial}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Começar Agora
                  </Button>
                  <Button
                    onClick={handleContactSpecialist}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Falar com Especialista
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setCalculatorResult(null);
                    setSelectedAddons([]);
                  }}
                  className="w-full"
                >
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
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
