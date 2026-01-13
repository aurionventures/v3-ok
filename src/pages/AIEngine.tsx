import { Link } from "react-router-dom";
import { 
  ArrowRight, CheckCircle, Brain, Search, FileText, Target,
  BarChart, Sparkles, Lightbulb, Zap, AlertTriangle, Users,
  Leaf, Globe, Clock, TrendingUp
} from "lucide-react";
import { MegaFooter } from "@/components/footer";
import { FAQSection, aiEngineFAQs } from "@/components/footer/FAQSection";
import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AIEngine = () => {
  const agents = [
    {
      icon: Search,
      title: "Agentes Especializados",
      description: "Agentes de IA treinados especificamente para governança corporativa e compliance."
    },
    {
      icon: FileText,
      title: "Análise de Documentos",
      description: "Processamento inteligente de atas, relatórios, contratos e documentos corporativos."
    },
    {
      icon: Brain,
      title: "Análise de Sentimento",
      description: "Identificação de tom, contexto e nuances em comunicações e deliberações."
    },
    {
      icon: Sparkles,
      title: "Briefings Personalizados",
      description: "Resumos executivos contextualizados para cada membro do conselho."
    },
    {
      icon: Target,
      title: "Busca Inteligente (Semântica)",
      description: "Encontre qualquer decisão, documento ou discussão em segundos."
    },
    {
      icon: Zap,
      title: "Classificação Automática",
      description: "Categorização inteligente de temas, riscos e oportunidades."
    },
    {
      icon: Globe,
      title: "Extração de Entidades",
      description: "Identificação automática de pessoas, empresas, datas e valores."
    },
    {
      icon: FileText,
      title: "Geração de ATAs",
      description: "Transcrição e geração automática de atas com action items identificados."
    },
    {
      icon: Users,
      title: "Geração de PDI",
      description: "Planos de desenvolvimento individualizados baseados em avaliações."
    },
    {
      icon: AlertTriangle,
      title: "Identificação de GAPs",
      description: "Análise automática de lacunas em compliance, governança e ESG."
    },
    {
      icon: Lightbulb,
      title: "Insights Preditivos",
      description: "Identificação de padrões e tendências antes que se tornem problemas."
    },
    {
      icon: TrendingUp,
      title: "Inteligência de Mercado",
      description: "Monitoramento de concorrentes, regulação e tendências setoriais."
    },
    {
      icon: BarChart,
      title: "OCR e Extração de Dados",
      description: "Digitalização e estruturação de documentos físicos e scans."
    },
    {
      icon: FileText,
      title: "Sugestões de Pauta",
      description: "Recomendações inteligentes de temas baseadas em contexto e histórico."
    }
  ];

  const benefits = [
    { icon: Clock, stat: "-93%", label: "Tempo de Preparação", desc: "De 8 horas para 30 minutos" },
    { icon: Brain, stat: "85+", label: "Prompts Otimizados", desc: "Específicos para governança" },
    { icon: TrendingUp, stat: "20+", label: "Fontes Monitoradas", desc: "Economia, regulação, setor" },
    { icon: Users, stat: "50+", label: "Validações", desc: "Por líderes de governança" }
  ];

  return (
    <div className="min-h-screen bg-corporate-dark">
      <MegaMenuHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(192,160,98,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-6">
              <Brain className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="text-sm font-medium text-accent">IA Nativa - Não Bolt-On</span>
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 leading-tight font-heading">
              AI Engine CORE
            </h1>
            <p className="text-xl lg:text-2xl mb-12 text-white/80 leading-relaxed max-w-3xl mx-auto">
              O cérebro da Legacy OS. 14 agentes inteligentes que monitoram, analisam, 
              priorizam e geram conteúdo automaticamente. IA construída no DNA da plataforma.
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

      {/* 14 Agents */}
      <section className="py-20 bg-corporate-mid">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">14 Agentes Inteligentes</h2>
              <p className="text-lg text-white/70">Cada agente é especializado em uma função específica da governança corporativa</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {agents.map((agent, index) => (
                <Card key={index} className="bg-white/5 border-border/20 hover:border-accent/30 hover:bg-white/10 transition-all">
                  <CardContent className="p-5">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center mb-3">
                      <agent.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">{agent.title}</h3>
                    <p className="text-xs text-white/60">{agent.description}</p>
                  </CardContent>
                </Card>
              ))}
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
