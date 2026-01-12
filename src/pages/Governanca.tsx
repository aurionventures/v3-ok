import { Link } from "react-router-dom";
import { 
  ArrowRight, CheckCircle, Users, Shield, Vote, FileText,
  Target, Award, BarChart, Building, Heart, GraduationCap,
  Factory, ShoppingCart, Cpu, Landmark, ClipboardCheck, Bell
} from "lucide-react";
import { MegaFooter } from "@/components/footer";
import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Governanca = () => {
  const engagementFeatures = [
    {
      icon: Vote,
      title: "Aprovações e Votação",
      description: "Sistema seguro de votação online com registro completo, controle de quórum e gestão de impedimentos.",
      features: ["Votação assíncrona", "Registro auditável", "Declaração de conflitos"]
    },
    {
      icon: Users,
      title: "Gestão de Membros",
      description: "Perfis completos de conselheiros e executivos com histórico, mandatos, skills e avaliações.",
      features: ["Perfis detalhados", "Controle de mandatos", "Skills tracking"]
    },
    {
      icon: FileText,
      title: "Notas e Anotações",
      description: "Sistema de anotações privadas durante reuniões, compartilhamento seletivo e histórico completo.",
      features: ["Notas privadas", "Compartilhamento seguro", "Histórico completo"]
    },
    {
      icon: Bell,
      title: "Alertas Inteligentes",
      description: "Notificações proativas sobre vencimentos, deadlines, mudanças regulatórias e riscos emergentes.",
      features: ["Alertas personalizados", "Lembretes automáticos", "Notificações push"]
    }
  ];

  const continuityFeatures = [
    {
      icon: Award,
      title: "Avaliação do Board",
      description: "Avaliação 360° de desempenho do conselho, comitês e conselheiros individuais.",
      features: ["Avaliação 360°", "Benchmarks setoriais", "PDI integrado"]
    },
    {
      icon: BarChart,
      title: "Relatórios de Diversidade",
      description: "Métricas de diversidade do board, tracking de metas e compliance regulatório.",
      features: ["Métricas DE&I", "Metas de diversidade", "Relatórios regulatórios"]
    },
    {
      icon: ClipboardCheck,
      title: "Gestão de Papéis e Termos",
      description: "Controle de mandatos, renovações, succession planning e documentação legal.",
      features: ["Controle de mandatos", "Alertas de renovação", "Documentação legal"]
    },
    {
      icon: Target,
      title: "Pesquisas e Surveys",
      description: "Criação e aplicação de pesquisas para conselheiros, executivos e stakeholders.",
      features: ["Templates prontos", "Análise automática", "Benchmark setorial"]
    }
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: "Certificações Compliance",
      description: "SOC 2 Type II, ISO 27001, LGPD compliant, GDPR ready.",
      features: ["SOC 2 Type II", "ISO 27001", "LGPD/GDPR"]
    },
    {
      icon: Shield,
      title: "Segurança da Plataforma",
      description: "Criptografia AES-256, TLS 1.3, backup diário, logs imutáveis.",
      features: ["Criptografia E2E", "Backup automático", "Audit trail"]
    }
  ];

  const industries = [
    { icon: Building, name: "Associações e ONGs" },
    { icon: Landmark, name: "Serviços Financeiros" },
    { icon: Landmark, name: "Governo e Público" },
    { icon: Heart, name: "Healthcare e Pharma" },
    { icon: GraduationCap, name: "Educação Superior" },
    { icon: Cpu, name: "Tecnologia e Startups" },
    { icon: ShoppingCart, name: "Varejo e Alimentos" },
    { icon: Factory, name: "Indústria e Manufatura" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <MegaMenuHeader />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#1B263B]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Governança Integrada
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Engajamento do conselho, continuidade do board e segurança enterprise 
              em uma única plataforma. Governança de excelência para qualquer setor.
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

      {/* Engagement Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#0A1628]">
                Engajamento do Conselho
              </h2>
              <p className="text-lg text-gray-600">
                Ferramentas para maximizar a participação e efetividade dos conselheiros
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {engagementFeatures.map((feature, index) => (
                <Card key={index} className="border border-gray-200 hover:border-[#C0A062]/30 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-[#0A1628]/5 rounded-xl flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-[#0A1628]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0A1628] mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-1">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-[#0A1628]">
                          <CheckCircle className="h-3 w-3 text-[#C0A062]" />
                          {item}
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

      {/* Continuity Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#0A1628]">
                Continuidade do Board
              </h2>
              <p className="text-lg text-gray-600">
                Gestão de longo prazo, avaliações e desenvolvimento contínuo
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {continuityFeatures.map((feature, index) => (
                <Card key={index} className="border border-gray-200 bg-white hover:border-[#C0A062]/30 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-[#C0A062]/10 rounded-xl flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-[#C0A062]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0A1628] mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-1">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-[#0A1628]">
                          <CheckCircle className="h-3 w-3 text-[#C0A062]" />
                          {item}
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

      {/* Security */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#0A1628]">
                Segurança Enterprise
              </h2>
              <p className="text-lg text-gray-600">
                Certificações e compliance de nível mundial
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => (
                <Card key={index} className="border border-gray-200 hover:border-[#C0A062]/30 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-[#0A1628]/5 rounded-xl flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-[#0A1628]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0A1628] mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-1">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-[#0A1628]">
                          <CheckCircle className="h-3 w-3 text-[#C0A062]" />
                          {item}
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

      {/* Industries */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#0A1628]">
                Governança para Qualquer Setor
              </h2>
              <p className="text-lg text-gray-600">
                Soluções adaptadas às necessidades específicas de cada indústria
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {industries.map((industry, index) => (
                <div key={index} className="flex flex-col items-center p-6 bg-white rounded-xl border border-gray-200 hover:border-[#C0A062]/30 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-[#0A1628]/5 rounded-full flex items-center justify-center mb-3">
                    <industry.icon className="h-6 w-6 text-[#0A1628]" />
                  </div>
                  <span className="text-sm font-medium text-center text-[#0A1628]">{industry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#1B263B]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Pronto para Elevar sua Governança?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Agende uma demonstração e veja como a Legacy OS transforma a governança da sua empresa
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

export default Governanca;
