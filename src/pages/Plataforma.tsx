import { Link } from "react-router-dom";
import { 
  ArrowRight, CheckCircle, Brain, Shield, Users, FileText, 
  BarChart, Leaf, Target, Calendar, ClipboardCheck, Search,
  Plug, Lock, Eye, Zap
} from "lucide-react";
import { MegaFooter } from "@/components/footer";
import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Plataforma = () => {
  // Módulos da plataforma
  const modulos = [
    {
      icon: Calendar,
      title: "Gestão de Reuniões",
      description: "Ciclo completo: convocação, pauta, materiais, deliberações, atas e follow-up automatizado.",
      features: ["Convocação automática", "Pauta inteligente com IA", "Gestão de quórum", "Atas geradas automaticamente"]
    },
    {
      icon: FileText,
      title: "Pauta Inteligente",
      description: "IA monitora 20+ fontes e gera pautas contextualizadas em 30 minutos.",
      features: ["Monitoramento de signals", "Análise de histórico", "Priorização automática", "Briefings personalizados"]
    },
    {
      icon: ClipboardCheck,
      title: "Gestão de Atas",
      description: "Transcrição automática, sumário executivo e action items identificados pela IA.",
      features: ["Transcrição automática", "Sumário executivo", "Action items", "Assinatura eletrônica"]
    },
    {
      icon: Shield,
      title: "Gestão de Riscos",
      description: "Matriz de riscos automatizada com alertas inteligentes e planos de mitigação.",
      features: ["Matriz de riscos", "Alertas inteligentes", "Simulação de cenários", "Planos de mitigação"]
    },
    {
      icon: Leaf,
      title: "ESG & Sustentabilidade",
      description: "Framework GRI/SASB integrado com relatórios prontos para CVM 193/2023.",
      features: ["Framework GRI/SASB", "Tracking de KPIs", "Benchmarks setoriais", "Relatórios CVM 193"]
    },
    {
      icon: Users,
      title: "Gestão de Membros",
      description: "Controle completo de conselheiros, comitês, mandatos e responsabilidades.",
      features: ["Cadastro de membros", "Gestão de mandatos", "Perfis e competências", "Declarações de conflito"]
    },
    {
      icon: BarChart,
      title: "Avaliação de Desempenho",
      description: "Ciclos de avaliação 360° para conselhos, comitês e conselheiros individuais.",
      features: ["Avaliação 360°", "Autoavaliação", "PDI integrado", "Relatórios consolidados"]
    },
    {
      icon: Target,
      title: "Projetos Estratégicos",
      description: "Acompanhamento de iniciativas estratégicas com indicadores e milestones.",
      features: ["Gestão de projetos", "Indicadores de progresso", "Milestones", "Reportes ao conselho"]
    },
    {
      icon: Search,
      title: "Busca Inteligente",
      description: "Encontre qualquer decisão, ata ou documento em segundos com IA.",
      features: ["Busca por contexto", "Filtros avançados", "Resultados ranqueados", "Histórico completo"]
    },
    {
      icon: Brain,
      title: "AI Engine CORE",
      description: "O cérebro da plataforma: IA nativa que automatiza e otimiza toda a governança.",
      features: ["85+ prompts otimizados", "Aprende com seu conselho", "Geração automática", "Insights preditivos"]
    },
    {
      icon: Plug,
      title: "Integrações Enterprise",
      description: "Conecte com Microsoft 365, Google Workspace, Slack, Zoom e sistemas ERP.",
      features: ["Microsoft 365", "Google Workspace", "Slack & Teams", "API robusta"]
    },
    {
      icon: Lock,
      title: "Segurança & Compliance",
      description: "Infraestrutura enterprise com certificações SOC 2, ISO 27001 e LGPD.",
      features: ["Criptografia AES-256", "2FA + SSO", "Audit trail completo", "LGPD compliant"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <MegaMenuHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#1B263B]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Conheça a Plataforma Legacy OS
            </h1>
            <p className="text-xl text-white/80 mb-8">
              13 módulos integrados nativamente para gestão completa de governança corporativa. 
              Tudo que seu conselho precisa em uma única plataforma.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-[#C0A062] text-[#0A1628] hover:bg-[#C0A062]/90 font-semibold"
                asChild
              >
                <Link to="/pricing">
                  Ver Planos e Preços
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                className="bg-transparent border-2 border-[#C0A062] text-[#C0A062] hover:bg-[#C0A062]/10 font-semibold"
                asChild
              >
                <Link to="/contato">Agendar Demonstração</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0A1628]">13</div>
              <div className="text-sm text-gray-500">Módulos Integrados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0A1628]">-93%</div>
              <div className="text-sm text-gray-500">Tempo de Preparação</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0A1628]">85+</div>
              <div className="text-sm text-gray-500">Prompts de IA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0A1628]">Ilimitados</div>
              <div className="text-sm text-gray-500">Usuários</div>
            </div>
          </div>
        </div>
      </section>

      {/* Módulos Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0A1628] mb-4">
                13 Módulos Nativamente Integrados
              </h2>
              <p className="text-lg text-gray-600">
                Cada módulo foi projetado para trabalhar em conjunto, eliminando silos e fragmentação de dados
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modulos.map((modulo, index) => (
                <Card key={index} className="border border-gray-200 hover:shadow-lg transition-all hover:border-[#C0A062]/30">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-[#0A1628]/5 rounded-xl flex items-center justify-center mb-4">
                      <modulo.icon className="h-6 w-6 text-[#0A1628]" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-[#0A1628]">{modulo.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{modulo.description}</p>
                    <ul className="space-y-1">
                      {modulo.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
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

      {/* AI Engine Highlight */}
      <section className="py-20 bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#1B263B] text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-[#C0A062]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="h-8 w-8 text-[#C0A062]" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              AI Engine CORE: O Diferencial
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Não é IA "bolt-on" adicionada depois. É IA nativa, construída no DNA da plataforma desde o dia 1. 
              Monitora 20+ fontes, analisa histórico e gera pautas completas automaticamente.
            </p>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[
                { icon: Zap, label: "-93% Tempo", desc: "Preparação" },
                { icon: Brain, label: "85+", desc: "Prompts IA" },
                { icon: Eye, label: "20+", desc: "Fontes Monitoradas" },
                { icon: Target, label: "100%", desc: "Contexto Automático" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="h-6 w-6 text-[#C0A062]" />
                  </div>
                  <div className="text-xl font-bold text-[#C0A062]">{stat.label}</div>
                  <div className="text-sm text-white/60">{stat.desc}</div>
                </div>
              ))}
            </div>
            <Button 
              size="lg" 
              className="bg-[#C0A062] text-[#0A1628] hover:bg-[#C0A062]/90 font-semibold"
              asChild
            >
              <Link to="/pricing">
                Conhecer Planos com AI Engine
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#0A1628] mb-4">
              Pronto para conhecer a Legacy OS?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Agende uma demonstração personalizada e veja como a plataforma pode transformar 
              a governança da sua organização.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-[#C0A062] text-[#0A1628] hover:bg-[#C0A062]/90 font-semibold"
                asChild
              >
                <Link to="/contato">
                  <Calendar className="h-5 w-5 mr-2" />
                  Agendar Demonstração
                </Link>
              </Button>
              <Button 
                size="lg" 
                className="bg-[#0A1628] text-white hover:bg-[#0A1628]/90"
                asChild
              >
                <Link to="/pricing">Ver Planos e Preços</Link>
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
