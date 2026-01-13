import { Link } from "react-router-dom";
import { 
  ArrowRight, CheckCircle, Brain, Target, FileText, 
  BarChart, Users, Shield, Calendar, ClipboardCheck,
  Search, Plug, Leaf, Bell, MessageSquare, Vote,
  FolderOpen, PenTool, LineChart
} from "lucide-react";
import { MegaFooter } from "@/components/footer";
import { FAQSection, plataformaFAQs } from "@/components/footer/FAQSection";
import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="min-h-screen bg-corporate-dark">
      <MegaMenuHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(192,160,98,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 leading-tight font-heading">
              Plataforma Legacy OS
            </h1>
            <p className="text-xl lg:text-2xl mb-12 text-white/80 leading-relaxed max-w-3xl mx-auto">
              13 módulos nativamente integrados para governança corporativa completa. 
              Tudo o que você precisa em uma única plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold text-lg px-8" asChild>
                <Link to="/pricing">Ver Planos e Preços</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8" asChild>
                <Link to="/contato">Agendar Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Engine Highlight */}
      <section className="py-20 bg-corporate-mid border-b border-accent/20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">AI Engine CORE: O Diferencial Legacy</h2>
              <p className="text-lg text-white/70">IA nativa construída no DNA da plataforma, não adicionada depois</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="h-7 w-7 text-accent" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-white/70">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules */}
      <section className="py-20 bg-corporate-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Módulos Core</h2>
              <p className="text-lg text-white/70">Funcionalidades essenciais para o ciclo completo de reuniões e deliberações</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreModules.map((module, index) => (
                <Card key={index} className="bg-white/5 border-border/20 hover:border-accent/30 transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                      <module.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{module.title}</h3>
                    <p className="text-sm text-white/70 mb-4">{module.description}</p>
                    <ul className="space-y-1">
                      {module.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-white/60">
                          <CheckCircle className="h-4 w-4 text-accent" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Modules */}
      <section className="py-20 bg-corporate-mid">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Módulos Avançados</h2>
              <p className="text-lg text-white/70">Funcionalidades para governança matura e compliance regulatório</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advancedModules.map((module, index) => (
                <Card key={index} className="bg-accent/10 border-accent/30 hover:border-accent/50 transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                      <module.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{module.title}</h3>
                    <p className="text-sm text-white/70 mb-4">{module.description}</p>
                    <ul className="space-y-1">
                      {module.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-white/60">
                          <CheckCircle className="h-4 w-4 text-accent" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
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
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Pronto para Conhecer a Plataforma?</h2>
            <p className="text-xl text-white/80 mb-8">Agende uma demonstração personalizada e veja a Legacy OS em ação</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold text-lg px-8" asChild>
                <Link to="/contato">Agendar Demonstração</Link>
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
        subtitle="Dúvidas sobre a plataforma Legacy OS"
        faqs={plataformaFAQs}
      />

      <MegaFooter />
    </div>
  );
};

export default Plataforma;
