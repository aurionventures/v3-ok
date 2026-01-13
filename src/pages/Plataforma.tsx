import { Link } from "react-router-dom";
import { 
  ArrowRight, CheckCircle, Brain, Target, FileText, 
  BarChart, Users, Shield, Calendar, ClipboardCheck,
  Search, Plug, Leaf, Bell, MessageSquare, Vote,
  FolderOpen, PenTool, LineChart
} from "lucide-react";
import { MegaFooter } from "@/components/footer";
import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeroSection, SectionHeader, FeatureCard, CTASection } from "@/components/landing";

const Plataforma = () => {
  const coreModules = [
    {
      icon: FileText,
      title: "Pauta Inteligente",
      description: "IA monitora 20+ fontes e gera pautas completas em 30 minutos com contexto, recomendações e perguntas-chave.",
      features: ["Monitoramento automático", "Sugestões de temas", "Briefings contextualizados"]
    },
    {
      icon: ClipboardCheck,
      title: "Atas Automáticas",
      description: "Transcrição automática, sumário executivo e action items identificados. Pronto para assinatura eletrônica.",
      features: ["Transcrição IA", "Sumário executivo", "Assinatura digital"]
    },
    {
      icon: Calendar,
      title: "Gestão de Reuniões",
      description: "Calendário integrado, convites automáticos, confirmação de presença e gestão de quórum.",
      features: ["Calendário integrado", "Convites automáticos", "Controle de quórum"]
    },
    {
      icon: Vote,
      title: "Votações e Deliberações",
      description: "Sistema de votação seguro com registro de votos, abstenções e declarações de impedimento.",
      features: ["Votação online", "Registro auditável", "Declaração de conflitos"]
    },
    {
      icon: FolderOpen,
      title: "Biblioteca de Documentos",
      description: "Repositório centralizado com versionamento, permissões granulares e busca inteligente.",
      features: ["Versionamento", "Permissões por pasta", "Busca por conteúdo"]
    },
    {
      icon: Users,
      title: "Gestão de Membros",
      description: "Perfis completos, mandatos, skills, histórico de participação e avaliação de desempenho.",
      features: ["Perfis detalhados", "Controle de mandatos", "Skills tracking"]
    }
  ];

  const advancedModules = [
    {
      icon: Leaf,
      title: "ESG & Sustentabilidade",
      description: "Framework GRI/SASB integrado, KPIs de sustentabilidade, benchmarks setoriais e relatórios CVM 193.",
      features: ["Framework GRI/SASB", "KPIs automatizados", "Relatórios regulatórios"]
    },
    {
      icon: Shield,
      title: "Gestão de Riscos",
      description: "Matriz de riscos automatizada, alertas inteligentes, simulação de cenários e planos de mitigação.",
      features: ["Matriz automatizada", "Alertas proativos", "Simulação de cenários"]
    },
    {
      icon: Target,
      title: "Projetos Estratégicos",
      description: "Acompanhamento de iniciativas estratégicas, OKRs, milestones e integração com decisões do conselho.",
      features: ["Tracking de OKRs", "Milestones", "Decisões vinculadas"]
    },
    {
      icon: LineChart,
      title: "Performance do Board",
      description: "Avaliação 360° de conselheiros, PDI individualizado, métricas de participação e engajamento.",
      features: ["Avaliação 360°", "PDI integrado", "Métricas de engajamento"]
    },
    {
      icon: Bell,
      title: "Alertas Inteligentes",
      description: "Notificações contextualizadas sobre mudanças regulatórias, vencimentos, deadlines e riscos emergentes.",
      features: ["Alertas regulatórios", "Lembretes de prazo", "Riscos emergentes"]
    },
    {
      icon: MessageSquare,
      title: "Comunicação Segura",
      description: "Mensageiro criptografado para comunicação confidencial entre membros do conselho.",
      features: ["Criptografia E2E", "Mensagens temporárias", "Grupos privados"]
    }
  ];

  const aiFeatures = [
    { icon: Brain, title: "Análise de Contexto", desc: "IA entende o histórico do seu conselho" },
    { icon: Search, title: "Busca Inteligente", desc: "Encontre qualquer decisão em segundos" },
    { icon: PenTool, title: "Geração de Conteúdo", desc: "Pautas, resumos e briefings automáticos" },
    { icon: BarChart, title: "Insights Preditivos", desc: "Identifica padrões e tendências" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MegaMenuHeader />

      {/* Hero */}
      <HeroSection
        title="Plataforma Legacy OS"
        subtitle="13 módulos nativamente integrados para governança corporativa completa. Tudo o que você precisa em uma única plataforma."
        primaryCTA={{ label: "Ver Planos e Preços", href: "/pricing" }}
        secondaryCTA={{ label: "Agendar Demo", href: "/contato" }}
      />

      {/* AI Engine Highlight */}
      <section className="py-16 bg-accent/10 border-b border-accent/20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              title="AI Engine CORE: O Diferencial Legacy"
              subtitle="IA nativa construída no DNA da plataforma, não adicionada depois"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="h-7 w-7 text-accent" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Módulos Core"
              subtitle="Funcionalidades essenciais para o ciclo completo de reuniões e deliberações"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreModules.map((module, index) => (
                <FeatureCard
                  key={index}
                  icon={module.icon}
                  title={module.title}
                  description={module.description}
                  features={module.features}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Modules */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Módulos Avançados"
              subtitle="Funcionalidades para governança madura e compliance regulatório"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advancedModules.map((module, index) => (
                <FeatureCard
                  key={index}
                  icon={module.icon}
                  title={module.title}
                  description={module.description}
                  features={module.features}
                  variant="accent"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <SectionHeader
              title="Integrações Enterprise"
              subtitle="Conecte a Legacy OS com as ferramentas que você já usa"
            />

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {["Microsoft 365", "Google Workspace", "Slack", "Zoom", "SAP", "Salesforce"].map((integration) => (
                <div key={integration} className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                  <Plug className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="font-medium text-foreground">{integration}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link to="/pricing">
                Começar Agora
                <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Pronto para Conhecer a Plataforma?"
        subtitle="Agende uma demonstração personalizada e veja a Legacy OS em ação"
        primaryCTA={{ label: "Agendar Demonstração", href: "/contato" }}
        secondaryCTA={{ label: "Ver Planos", href: "/pricing" }}
      />

      <MegaFooter />
    </div>
  );
};

export default Plataforma;
