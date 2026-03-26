import { Link } from "react-router-dom";
import { 
  ArrowRight, CheckCircle, Brain, Target, FileText, 
  BarChart, Users, Shield, Zap, Clock, Calendar
} from "lucide-react";
import { MegaFooter } from "@/components/footer";
import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ComoFunciona = () => {
  const steps = [
    {
      number: "01",
      title: "Diagnóstico Inicial",
      description: "Em 5 minutos, você responde um questionário que avalia a maturidade da governança da sua empresa. Recebe um score e recomendações personalizadas.",
      icon: Target,
      features: ["Score de maturidade", "Gaps identificados", "Recomendações práticas"]
    },
    {
      number: "02",
      title: "Configuração da Plataforma",
      description: "Nossa equipe configura a Legacy OS para sua realidade: estrutura societária, conselhos, comitês, membros e permissões de acesso.",
      icon: Users,
      features: ["Onboarding guiado", "Importação de dados", "Configuração personalizada"]
    },
    {
      number: "03",
      title: "IA Aprende Seu Contexto",
      description: "O AI Engine analisa documentos históricos, atas anteriores, relatórios e contexto do seu setor para gerar insights relevantes.",
      icon: Brain,
      features: ["Análise de histórico", "Contexto setorial", "Aprendizado contínuo"]
    },
    {
      number: "04",
      title: "Pautas Geradas Automaticamente",
      description: "A cada reunião, a IA monitora fontes externas e internas, identifica temas prioritários e gera pautas completas em 30 minutos.",
      icon: FileText,
      features: ["Monitoramento 24/7", "Priorização inteligente", "Briefings contextualizados"]
    },
    {
      number: "05",
      title: "Reuniões Eficientes",
      description: "Durante a reunião, registre decisões, votações e action items. A IA transcreve e gera atas automaticamente.",
      icon: Calendar,
      features: ["Registro em tempo real", "Atas automáticas", "Acompanhamento de tarefas"]
    },
    {
      number: "06",
      title: "Governança Contínua",
      description: "Dashboards de ESG, riscos, projetos e performance do conselho. Relatórios prontos para stakeholders e reguladores.",
      icon: BarChart,
      features: ["Dashboards executivos", "Relatórios automáticos", "Compliance contínuo"]
    }
  ];

  const benefits = [
    { icon: Clock, title: "-93% Tempo", desc: "Preparação de reuniões de 8h para 30min" },
    { icon: Users, title: "Usuários Ilimitados", desc: "Todos podem participar sem custo extra" },
    { icon: Shield, title: "Segurança Enterprise", desc: "SOC 2, ISO 27001, LGPD compliant" },
    { icon: Zap, title: "IA Nativa", desc: "Construída no DNA, não adicionada depois" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <MegaMenuHeader />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#1B263B]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Como a Legacy OS Funciona
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Da primeira reunião à governança madura em 6 passos simples. 
              Entenda como nossa plataforma transforma a gestão do seu conselho.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-[#C0A062] text-[#0A1628] hover:bg-[#C0A062]/90 font-semibold" asChild>
                <Link to="/standalone-quiz">Fazer Diagnóstico Gratuito</Link>
              </Button>
              <Button size="lg" className="bg-transparent border-2 border-[#C0A062] text-[#C0A062] hover:bg-[#C0A062]/10 font-semibold" asChild>
                <Link to="/contato">Falar com Especialista</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#0A1628]">
                6 Passos para Governança de Excelência
              </h2>
              <p className="text-lg text-gray-600">
                Do diagnóstico inicial à governança contínua, cada etapa foi desenhada para maximizar resultados
              </p>
            </div>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <Card key={index} className={`border ${index % 2 === 0 ? 'border-[#C0A062]/20' : 'border-gray-200'} overflow-hidden`}>
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Number */}
                      <div className={`lg:w-32 p-6 flex items-center justify-center ${index % 2 === 0 ? 'bg-[#C0A062]/10' : 'bg-gray-100'}`}>
                        <span className="text-4xl font-bold text-[#C0A062]">{step.number}</span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-[#0A1628]/5 rounded-xl flex items-center justify-center shrink-0">
                            <step.icon className="h-6 w-6 text-[#0A1628]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#0A1628] mb-2">{step.title}</h3>
                            <p className="text-gray-600 mb-4">{step.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {step.features.map((feature, i) => (
                                <span key={i} className="inline-flex items-center gap-1 text-sm text-[#0A1628] bg-[#C0A062]/10 px-3 py-1 rounded-full">
                                  <CheckCircle className="h-3 w-3 text-[#C0A062]" />
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#0A1628]">
                Por Que Escolher a Legacy OS
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center border border-gray-200 hover:border-[#C0A062]/30 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-[#C0A062]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="h-7 w-7 text-[#C0A062]" />
                    </div>
                    <h3 className="font-bold text-[#0A1628] mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" className="bg-[#0A1628] text-white hover:bg-[#0A1628]/90" asChild>
                <Link to="/pricing">
                  Ver Planos e Preços
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#1B263B]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Pronto para Começar?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Faça o diagnóstico gratuito e descubra como a Legacy OS pode transformar sua governança
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-[#C0A062] text-[#0A1628] hover:bg-[#C0A062]/90 font-semibold" asChild>
                <Link to="/standalone-quiz">Fazer Diagnóstico Gratuito</Link>
              </Button>
              <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold" asChild>
                <Link to="/contato">Agendar Demonstração</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <MegaFooter />
    </div>
  );
};

export default ComoFunciona;
