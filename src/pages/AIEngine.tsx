import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  ArrowRight, CheckCircle, Brain, Search, FileText, Target,
  BarChart, Sparkles, Lightbulb, Zap, AlertTriangle, Users,
  Globe, Clock, TrendingUp, ChevronRight, X
} from "lucide-react";
import { MegaFooter } from "@/components/footer";
import { FAQSection, aiEngineFAQs } from "@/components/footer/FAQSection";
import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Capability {
  id: string;
  name: string;
  description: string;
  deliverables: string[];
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const capabilities: Capability[] = [
  {
    id: "doc_analysis",
    name: "Análise de Documentos",
    description: "Processamento inteligente de documentos estratégicos.",
    deliverables: [
      "Leitura contextual automática",
      "Identificação de riscos e padrões",
      "Base estruturada para decisões"
    ],
    category: "Documentos & Memória",
    icon: FileText
  },
  {
    id: "briefings",
    name: "Briefings Personalizados",
    description: "Resumos executivos contextualizados para cada membro.",
    deliverables: [
      "Contexto individual por conselheiro",
      "Priorização inteligente de temas",
      "Histórico de participação integrado"
    ],
    category: "Decisão & Conselho",
    icon: Sparkles
  },
  {
    id: "semantic_search",
    name: "Busca Semântica",
    description: "Encontre qualquer decisão ou documento em segundos.",
    deliverables: [
      "Busca por significado, não palavras",
      "Conexão entre temas relacionados",
      "Histórico completo acessível"
    ],
    category: "Documentos & Memória",
    icon: Search
  },
  {
    id: "risk_detection",
    name: "Detecção de Riscos",
    description: "Identificação proativa de ameaças e oportunidades.",
    deliverables: [
      "Monitoramento contínuo 24/7",
      "Alertas contextualizados",
      "Priorização por impacto"
    ],
    category: "Risco & Compliance",
    icon: AlertTriangle
  },
  {
    id: "ata_generation",
    name: "Geração de ATAs",
    description: "Transcrição e estruturação automática de deliberações.",
    deliverables: [
      "Transcrição inteligente",
      "Action items identificados",
      "Responsáveis e prazos definidos"
    ],
    category: "Documentos & Memória",
    icon: FileText
  },
  {
    id: "predictive_insights",
    name: "Insights Preditivos",
    description: "Identificação de padrões antes que virem problemas.",
    deliverables: [
      "Análise de tendências históricas",
      "Previsão de cenários",
      "Recomendações proativas"
    ],
    category: "Decisão & Conselho",
    icon: Lightbulb
  },
  {
    id: "market_intelligence",
    name: "Inteligência de Mercado",
    description: "Monitoramento de concorrentes e tendências setoriais.",
    deliverables: [
      "20+ fontes monitoradas",
      "Alertas de mudanças regulatórias",
      "Benchmark competitivo"
    ],
    category: "Mercado & Contexto",
    icon: Globe
  },
  {
    id: "performance_analysis",
    name: "Análise de Performance",
    description: "Avaliação contínua de efetividade do conselho.",
    deliverables: [
      "Métricas de engajamento",
      "Evolução de maturidade",
      "PDIs automatizados"
    ],
    category: "Pessoas & Performance",
    icon: Users
  }
];

const AIEngine = () => {
  const [selectedCapability, setSelectedCapability] = useState<Capability>(capabilities[0]);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const benefits = [
    { icon: Clock, stat: "-93%", label: "Tempo de Preparação", desc: "De 8 horas para 30 minutos" },
    { icon: Brain, stat: "85+", label: "Prompts Otimizados", desc: "Específicos para governança" },
    { icon: TrendingUp, stat: "20+", label: "Fontes Monitoradas", desc: "Economia, regulação, setor" },
    { icon: Users, stat: "50+", label: "Validações", desc: "Por líderes de governança" }
  ];

  const handleCapabilityClick = (capability: Capability) => {
    setSelectedCapability(capability);
    // On mobile, open sheet
    if (window.innerWidth < 1024) {
      setMobileSheetOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-corporate-dark">
      <MegaMenuHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(192,160,98,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 leading-tight font-heading">
              AI Engine CORE
            </h1>
            <p className="text-xl lg:text-2xl mb-12 text-white/80 leading-relaxed max-w-3xl mx-auto">
              O cérebro da Legacy OS. Uma arquitetura multi-agentes que monitora, analisa, 
              prioriza e gera conteúdo automaticamente. IA construída no DNA da plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold text-lg px-8" asChild>
                <Link to="/standalone-quiz">Fazer Diagnóstico Gratuito</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8" asChild>
                <Link to="/contato">Ver Demo da IA</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Stats */}
      <section className="py-20 bg-corporate-mid border-b border-accent/20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <benefit.icon className="h-7 w-7 text-accent" aria-hidden="true" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{benefit.stat}</div>
                  <div className="text-sm font-semibold text-white mb-1">{benefit.label}</div>
                  <div className="text-xs text-white/60">{benefit.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-corporate-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Como o AI Engine Funciona</h2>
              <p className="text-lg text-white/70">Não é IA adicionada depois. É IA construída no núcleo da plataforma desde o dia 1.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Before */}
              <Card className="border border-destructive/30 bg-destructive/10">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-destructive mb-4">ANTES: Preparação Manual</h3>
                  <div className="text-4xl font-bold text-destructive mb-4">8 horas</div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <span className="text-destructive font-bold">1.</span>
                      Ler atas das últimas 6 reuniões (2h)
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <span className="text-destructive font-bold">2.</span>
                      Consolidar relatórios financeiros, ESG, projetos (3h)
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <span className="text-destructive font-bold">3.</span>
                      Escrever pauta do zero (2h)
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <span className="text-destructive font-bold">4.</span>
                      Criar briefings individuais por conselheiro (1h)
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* After */}
              <Card className="border border-green-500/30 bg-green-500/10">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-green-500 mb-4">DEPOIS: AI Engine CORE</h3>
                  <div className="text-4xl font-bold text-green-500 mb-4">30 minutos</div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      IA lê histórico completo automaticamente
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      IA consolida 20+ fontes em dashboard único
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      IA gera 3 versões de pauta prontas (15 min)
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      IA cria briefings contextualizados (15 min)
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Savings Banner */}
            <div className="mt-8 p-6 bg-accent rounded-xl text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                Economia estimada: R$ 180.000/ano por conselho
              </div>
              <p className="text-sm text-primary/80">
                Base: 12 reuniões/ano × 90h economizadas × R$ 2.000/h (custo total secretário executivo)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Agent Architecture */}
      <section className="py-20 bg-corporate-mid">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Arquitetura Multi-Agentes de Governança
              </h2>
              <p className="text-lg text-white/70 max-w-3xl mx-auto mb-6">
                Um ecossistema de inteligências especializadas operando de forma coordenada 
                para apoiar decisões estratégicas, riscos, compliance e performance.
              </p>
              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-sm font-medium text-accent">
                  AI-First Core
                </span>
                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white/80">
                  Especialização Funcional
                </span>
                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white/80">
                  Decisão Assistida por IA
                </span>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-8 items-start">
              {/* Capabilities Orbit (Left) */}
              <div className="lg:col-span-2">
                <div className="relative">
                  {/* Central Core */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border-2 border-accent/50 flex items-center justify-center shadow-[0_0_60px_rgba(192,160,98,0.3)]">
                        <Brain className="w-16 h-16 text-accent" />
                      </div>
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <span className="text-xs text-white/60 bg-corporate-dark/80 px-3 py-1 rounded-full">
                          Orquestração Central
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Capability Chips Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
                    {capabilities.map((cap) => {
                      const isSelected = selectedCapability.id === cap.id;
                      return (
                        <button
                          key={cap.id}
                          onClick={() => handleCapabilityClick(cap)}
                          className={`
                            p-4 rounded-xl border transition-all duration-200 text-left
                            ${isSelected 
                              ? 'border-accent bg-accent/20 shadow-[0_0_20px_rgba(192,160,98,0.2)]' 
                              : 'border-white/10 bg-white/5 hover:border-accent/30 hover:bg-white/10'
                            }
                          `}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${isSelected ? 'bg-accent/30' : 'bg-white/10'}`}>
                            <cap.icon className={`w-5 h-5 ${isSelected ? 'text-accent' : 'text-white/70'}`} />
                          </div>
                          <h4 className={`text-sm font-semibold mb-1 ${isSelected ? 'text-white' : 'text-white/80'}`}>
                            {cap.name}
                          </h4>
                          <span className="text-xs text-white/50">{cap.category}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Detail Panel (Right) */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 p-6 rounded-2xl bg-gradient-to-b from-accent/10 to-transparent border border-accent/20">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-medium text-accent/80 bg-accent/10 px-2 py-1 rounded">
                      Agente Especializado
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                    <selectedCapability.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{selectedCapability.name}</h3>
                  <p className="text-sm text-white/70 mb-6">{selectedCapability.description}</p>
                  
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Entregas</span>
                    {selectedCapability.deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-white/80">{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Layout */}
            <div className="lg:hidden">
              {/* Compact Core */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border-2 border-accent/50 flex items-center justify-center shadow-[0_0_40px_rgba(192,160,98,0.3)]">
                  <Brain className="w-12 h-12 text-accent" />
                </div>
              </div>
              <p className="text-center text-sm text-white/60 mb-8">
                Orquestração central de inteligências especializadas
              </p>

              {/* Horizontal Scroll Carousel */}
              <div className="overflow-x-auto pb-4 -mx-6 px-6">
                <div className="flex gap-3" style={{ width: 'max-content' }}>
                  {capabilities.map((cap) => {
                    const isSelected = selectedCapability.id === cap.id;
                    return (
                      <button
                        key={cap.id}
                        onClick={() => handleCapabilityClick(cap)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl border transition-all whitespace-nowrap
                          ${isSelected 
                            ? 'border-accent bg-accent/20' 
                            : 'border-white/10 bg-white/5'
                          }
                        `}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-accent/30' : 'bg-white/10'}`}>
                          <cap.icon className={`w-4 h-4 ${isSelected ? 'text-accent' : 'text-white/70'}`} />
                        </div>
                        <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-white/70'}`}>
                          {cap.name}
                        </span>
                        <ChevronRight className="w-4 h-4 text-white/40" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Indicator */}
              <div className="text-center mt-6">
                <span className="inline-flex items-center gap-2 text-xs text-white/50 bg-white/5 px-3 py-1.5 rounded-full">
                  <Zap className="w-3 h-3 text-accent" />
                  Arquitetura Multi-Agentes Ativa
                </span>
              </div>
            </div>

            {/* Mobile Bottom Sheet */}
            <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
              <SheetContent side="bottom" className="bg-corporate-dark border-t border-accent/20 rounded-t-3xl">
                <SheetHeader className="text-left">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-accent/80 bg-accent/10 px-2 py-1 rounded">
                      Agente Especializado
                    </span>
                    <button 
                      onClick={() => setMobileSheetOpen(false)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <X className="w-4 h-4 text-white/70" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                      <selectedCapability.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <SheetTitle className="text-lg font-bold text-white">{selectedCapability.name}</SheetTitle>
                      <span className="text-xs text-white/50">{selectedCapability.category}</span>
                    </div>
                  </div>
                </SheetHeader>
                
                <p className="text-sm text-white/70 mb-6">{selectedCapability.description}</p>
                
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Entregas</span>
                  {selectedCapability.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/80">{deliverable}</span>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* CTA */}
            <div className="text-center mt-12">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold" asChild>
                <Link to="/governanca">
                  Ver como a IA apoia decisões de governança
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-20 bg-corporate-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Arquitetura IA Nativa</h2>
              <p className="text-lg text-white/70">Enquanto competidores adicionaram IA como feature depois, a Legacy OS foi construída desde o início com IA no núcleo.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Brain,
                  title: "Monitoramento 24/7",
                  description: "20+ fontes monitoradas continuamente: economia, política, regulação, setor. Alertas proativos sobre mudanças relevantes."
                },
                {
                  icon: BarChart,
                  title: "Análise de Histórico",
                  description: "Padrões, gaps, questões recorrentes identificadas automaticamente. Aprende com cada reunião do seu conselho."
                },
                {
                  icon: Target,
                  title: "Priorização Inteligente",
                  description: "Ranqueia temas por urgência, impacto estratégico e maturidade. Foco no que realmente importa."
                },
                {
                  icon: FileText,
                  title: "Geração Automática",
                  description: "Pauta, briefings, contexto e recomendações prontos para aprovação. Você revisa, a IA trabalha."
                }
              ].map((feature, index) => (
                <Card key={index} className="bg-accent/10 border-accent/30 hover:border-accent/50 transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/70">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Experimente o AI Engine</h2>
            <p className="text-xl text-white/80 mb-8">Faça o diagnóstico gratuito e veja o poder da IA aplicada à governança</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold text-lg px-8" asChild>
                <Link to="/standalone-quiz">
                  Fazer Diagnóstico Gratuito
                  <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8" asChild>
                <Link to="/pricing">Ver Planos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FAQSection 
        title="Perguntas Frequentes"
        subtitle="Dúvidas sobre o AI Engine"
        faqs={aiEngineFAQs}
      />

      <MegaFooter />
    </div>
  );
};

export default AIEngine;
