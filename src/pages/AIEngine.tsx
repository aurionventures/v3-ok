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
    <div className="min-h-screen bg-white">
      <MegaMenuHeader />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#1B263B]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C0A062]/20 border border-[#C0A062]/30 rounded-full mb-6">
              <Brain className="h-5 w-5 text-[#C0A062]" />
              <span className="text-[#C0A062] font-medium">IA Nativa - Não Bolt-On</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              AI Engine CORE
            </h1>
            <p className="text-xl text-white/70 mb-8">
              O cérebro da Legacy OS. 14 agentes inteligentes que monitoram, analisam, 
              priorizam e geram conteúdo automaticamente. IA construída no DNA da plataforma.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-[#C0A062] text-[#0A1628] hover:bg-[#C0A062]/90 font-semibold" asChild>
                <Link to="/standalone-quiz">Fazer Diagnóstico Gratuito</Link>
              </Button>
              <Button size="lg" className="bg-transparent border-2 border-[#C0A062] text-[#C0A062] hover:bg-[#C0A062]/10 font-semibold" asChild>
                <Link to="/contato">Ver Demo da IA</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Stats */}
      <section className="py-16 bg-[#C0A062]/10 border-b border-[#C0A062]/20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 bg-[#0A1628] rounded-full flex items-center justify-center mx-auto mb-3">
                    <benefit.icon className="h-7 w-7 text-[#C0A062]" />
                  </div>
                  <div className="text-3xl font-bold text-[#0A1628] mb-1">{benefit.stat}</div>
                  <div className="text-sm font-semibold text-[#0A1628] mb-1">{benefit.label}</div>
                  <div className="text-xs text-gray-600">{benefit.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#0A1628]">
                Como o AI Engine Funciona
              </h2>
              <p className="text-lg text-gray-600">
                Não é IA adicionada depois. É IA construída no núcleo da plataforma desde o dia 1.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Before */}
              <Card className="border border-red-200 bg-red-50/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-red-700 mb-4">ANTES: Preparação Manual</h3>
                  <div className="text-4xl font-bold text-red-600 mb-4">8 horas</div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-red-500 font-bold">1.</span>
                      Ler atas das últimas 6 reuniões (2h)
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-red-500 font-bold">2.</span>
                      Consolidar relatórios financeiros, ESG, projetos (3h)
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-red-500 font-bold">3.</span>
                      Escrever pauta do zero (2h)
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-red-500 font-bold">4.</span>
                      Criar briefings individuais por conselheiro (1h)
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* After */}
              <Card className="border border-green-200 bg-green-50/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-green-700 mb-4">DEPOIS: AI Engine CORE</h3>
                  <div className="text-4xl font-bold text-green-600 mb-4">30 minutos</div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      IA lê histórico completo automaticamente
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      IA consolida 20+ fontes em dashboard único
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      IA gera 3 versões de pauta prontas (15 min)
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      IA cria briefings contextualizados (15 min)
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Savings Banner */}
            <div className="mt-8 p-6 bg-[#C0A062] rounded-xl text-center">
              <div className="text-2xl font-bold text-[#0A1628] mb-2">
                Economia estimada: R$ 180.000/ano por conselho
              </div>
              <p className="text-sm text-[#0A1628]/80">
                Base: 12 reuniões/ano × 90h economizadas × R$ 2.000/h (custo total secretário executivo)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 14 Agents */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#0A1628]">
                14 Agentes Inteligentes
              </h2>
              <p className="text-lg text-gray-600">
                Cada agente é especializado em uma função específica da governança corporativa
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {agents.map((agent, index) => (
                <Card key={index} className="border border-gray-200 bg-white hover:border-[#C0A062]/30 hover:shadow-lg transition-all">
                  <CardContent className="p-5">
                    <div className="w-10 h-10 bg-[#0A1628]/5 rounded-lg flex items-center justify-center mb-3">
                      <agent.icon className="h-5 w-5 text-[#0A1628]" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0A1628] mb-2">{agent.title}</h3>
                    <p className="text-xs text-gray-600">{agent.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#0A1628]">
                Arquitetura IA Nativa
              </h2>
              <p className="text-lg text-gray-600">
                Enquanto competidores adicionaram IA como feature depois, 
                a Legacy OS foi construída desde o início com IA no núcleo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#C0A062]/10 rounded-xl flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-[#C0A062]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0A1628] mb-2">Monitoramento 24/7</h3>
                  <p className="text-sm text-gray-600">
                    20+ fontes monitoradas continuamente: economia, política, regulação, setor.
                    Alertas proativos sobre mudanças relevantes.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#C0A062]/10 rounded-xl flex items-center justify-center mb-4">
                    <BarChart className="h-6 w-6 text-[#C0A062]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0A1628] mb-2">Análise de Histórico</h3>
                  <p className="text-sm text-gray-600">
                    Padrões, gaps, questões recorrentes identificadas automaticamente.
                    Aprende com cada reunião do seu conselho.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#C0A062]/10 rounded-xl flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-[#C0A062]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0A1628] mb-2">Priorização Inteligente</h3>
                  <p className="text-sm text-gray-600">
                    Ranqueia temas por urgência, impacto estratégico e maturidade.
                    Foco no que realmente importa.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#C0A062]/10 rounded-xl flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-[#C0A062]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0A1628] mb-2">Geração Automática</h3>
                  <p className="text-sm text-gray-600">
                    Pauta, briefings, contexto e recomendações prontos para aprovação.
                    Você revisa, a IA trabalha.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#1B263B]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Experimente o AI Engine
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Faça o diagnóstico gratuito e veja o poder da IA aplicada à governança
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-[#C0A062] text-[#0A1628] hover:bg-[#C0A062]/90 font-semibold" asChild>
                <Link to="/standalone-quiz">
                  Fazer Diagnóstico Gratuito
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
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

export default AIEngine;
