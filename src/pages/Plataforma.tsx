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
    <div className="min-h-screen bg-white">
      <MegaMenuHeader />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#1B263B]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Plataforma Legacy OS
            </h1>
            <p className="text-xl text-white/70 mb-8">
              13 módulos nativamente integrados para governança corporativa completa. 
              Tudo o que você precisa em uma única plataforma.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-[#C0A062] text-[#0A1628] hover:bg-[#C0A062]/90 font-semibold" asChild>
                <Link to="/pricing">Ver Planos e Preços</Link>
              </Button>
              <Button size="lg" className="bg-transparent border-2 border-[#C0A062] text-[#C0A062] hover:bg-[#C0A062]/10 font-semibold" asChild>
                <Link to="/contato">Agendar Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Engine Highlight */}
      <section className="py-16 bg-[#C0A062]/10 border-b border-[#C0A062]/20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#0A1628] mb-4">
                AI Engine CORE: O Diferencial Legacy
              </h2>
              <p className="text-gray-600">
                IA nativa construída no DNA da plataforma, não adicionada depois
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 bg-[#0A1628] rounded-full flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="h-7 w-7 text-[#C0A062]" />
                  </div>
                  <h3 className="font-semibold text-[#0A1628] mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#0A1628]">
                Módulos Core
              </h2>
              <p className="text-lg text-gray-600">
                Funcionalidades essenciais para o ciclo completo de reuniões e deliberações
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreModules.map((module, index) => (
                <Card key={index} className="border border-gray-200 hover:border-[#C0A062]/30 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-[#0A1628]/5 rounded-xl flex items-center justify-center mb-4">
                      <module.icon className="h-6 w-6 text-[#0A1628]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0A1628] mb-2">{module.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                    <ul className="space-y-1">
                      {module.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-[#0A1628]">
                          <CheckCircle className="h-3 w-3 text-[#C0A062]" />
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#0A1628]">
                Módulos Avançados
              </h2>
              <p className="text-lg text-gray-600">
                Funcionalidades para governança madura e compliance regulatório
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advancedModules.map((module, index) => (
                <Card key={index} className="border border-gray-200 bg-white hover:border-[#C0A062]/30 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-[#C0A062]/10 rounded-xl flex items-center justify-center mb-4">
                      <module.icon className="h-6 w-6 text-[#C0A062]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0A1628] mb-2">{module.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                    <ul className="space-y-1">
                      {module.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-[#0A1628]">
                          <CheckCircle className="h-3 w-3 text-[#C0A062]" />
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

      {/* Integrations */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#0A1628]">
              Integrações Enterprise
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Conecte a Legacy OS com as ferramentas que você já usa
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {["Microsoft 365", "Google Workspace", "Slack", "Zoom", "SAP", "Salesforce"].map((integration) => (
                <div key={integration} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                  <Plug className="h-4 w-4 text-[#0A1628]" />
                  <span className="font-medium text-[#0A1628]">{integration}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-[#0A1628] text-white hover:bg-[#0A1628]/90" asChild>
              <Link to="/pricing">
                Começar Agora
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#1B263B]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Pronto para Conhecer a Plataforma?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Agende uma demonstração personalizada e veja a Legacy OS em ação
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-[#C0A062] text-[#0A1628] hover:bg-[#C0A062]/90 font-semibold" asChild>
                <Link to="/contato">Agendar Demonstração</Link>
              </Button>
              <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold" asChild>
                <Link to="/pricing">Ver Planos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <MegaFooter />
    </div>
  );
};

export default Plataforma;
