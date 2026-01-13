import { Link } from "react-router-dom";
import { 
  ArrowRight, CheckCircle, Brain, Search, FileText, Target,
  BarChart, Sparkles, Lightbulb, Zap, AlertTriangle, Users,
  Leaf, Globe, Clock, TrendingUp
} from "lucide-react";
import { MegaFooter } from "@/components/footer";
import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeroSection, SectionHeader, FeatureCard, CTASection } from "@/components/landing";

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
    <div className="min-h-screen bg-background">
      <MegaMenuHeader />

      {/* Hero */}
      <HeroSection
        title="AI Engine CORE"
        subtitle="O cérebro da Legacy OS. 14 agentes inteligentes que monitoram, analisam, priorizam e geram conteúdo automaticamente. IA construída no DNA da plataforma."
        primaryCTA={{ label: "Fazer Diagnóstico Gratuito", href: "/standalone-quiz" }}
        secondaryCTA={{ label: "Ver Demo da IA", href: "/contato" }}
        badge={{ icon: <Brain className="h-5 w-5 text-accent" aria-hidden="true" />, text: "IA Nativa - Não Bolt-On" }}
      />

      {/* Benefits Stats */}
      <section className="py-16 bg-accent/10 border-b border-accent/20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <benefit.icon className="h-7 w-7 text-accent" aria-hidden="true" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{benefit.stat}</div>
                  <div className="text-sm font-semibold text-foreground mb-1">{benefit.label}</div>
                  <div className="text-xs text-muted-foreground">{benefit.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              title="Como o AI Engine Funciona"
              subtitle="Não é IA adicionada depois. É IA construída no núcleo da plataforma desde o dia 1."
            />

            <div className="grid md:grid-cols-2 gap-8">
              {/* Before */}
              <Card className="border border-destructive/30 bg-destructive/5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-destructive mb-4">ANTES: Preparação Manual</h3>
                  <div className="text-4xl font-bold text-destructive mb-4">8 horas</div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="text-destructive font-bold">1.</span>
                      Ler atas das últimas 6 reuniões (2h)
                    </li>
                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="text-destructive font-bold">2.</span>
                      Consolidar relatórios financeiros, ESG, projetos (3h)
                    </li>
                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="text-destructive font-bold">3.</span>
                      Escrever pauta do zero (2h)
                    </li>
                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="text-destructive font-bold">4.</span>
                      Criar briefings individuais por conselheiro (1h)
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* After */}
              <Card className="border border-success/30 bg-success/5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-success mb-4">DEPOIS: AI Engine CORE</h3>
                  <div className="text-4xl font-bold text-success mb-4">30 minutos</div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      IA lê histórico completo automaticamente
                    </li>
                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      IA consolida 20+ fontes em dashboard único
                    </li>
                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      IA gera 3 versões de pauta prontas (15 min)
                    </li>
                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="14 Agentes Inteligentes"
              subtitle="Cada agente é especializado em uma função específica da governança corporativa"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {agents.map((agent, index) => (
                <Card key={index} className="border border-border bg-card hover:border-accent/30 hover:shadow-lg transition-all">
                  <CardContent className="p-5">
                    <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center mb-3">
                      <agent.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-2">{agent.title}</h3>
                    <p className="text-xs text-muted-foreground">{agent.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              title="Arquitetura IA Nativa"
              subtitle="Enquanto competidores adicionaram IA como feature depois, a Legacy OS foi construída desde o início com IA no núcleo."
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FeatureCard
                icon={Brain}
                title="Monitoramento 24/7"
                description="20+ fontes monitoradas continuamente: economia, política, regulação, setor. Alertas proativos sobre mudanças relevantes."
                variant="accent"
              />

              <FeatureCard
                icon={BarChart}
                title="Análise de Histórico"
                description="Padrões, gaps, questões recorrentes identificadas automaticamente. Aprende com cada reunião do seu conselho."
                variant="accent"
              />

              <FeatureCard
                icon={Target}
                title="Priorização Inteligente"
                description="Ranqueia temas por urgência, impacto estratégico e maturidade. Foco no que realmente importa."
                variant="accent"
              />

              <FeatureCard
                icon={FileText}
                title="Geração Automática"
                description="Pauta, briefings, contexto e recomendações prontos para aprovação. Você revisa, a IA trabalha."
                variant="accent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Experimente o AI Engine"
        subtitle="Faça o diagnóstico gratuito e veja o poder da IA aplicada à governança"
        primaryCTA={{ 
          label: "Fazer Diagnóstico Gratuito", 
          href: "/standalone-quiz",
          icon: <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
        }}
        secondaryCTA={{ label: "Ver Planos", href: "/pricing" }}
      />

      <MegaFooter />
    </div>
  );
};

export default AIEngine;
