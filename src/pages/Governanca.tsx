import { Link } from "react-router-dom";
import { 
  ArrowRight, CheckCircle, Users, Shield, Vote, FileText,
  Target, Award, BarChart, Building, Heart, GraduationCap,
  Factory, ShoppingCart, Cpu, Landmark, ClipboardCheck, Bell
} from "lucide-react";
import { MegaFooter } from "@/components/footer";
import { FAQSection, governancaFAQs } from "@/components/footer/FAQSection";
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
    <div className="min-h-screen bg-corporate-dark">
      <MegaMenuHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(192,160,98,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 leading-tight font-heading">
              Governança Integrada
            </h1>
            <p className="text-xl lg:text-2xl mb-12 text-white/80 leading-relaxed max-w-3xl mx-auto">
              Engajamento do conselho, continuidade do board e segurança enterprise 
              em uma única plataforma. Governança de excelência para qualquer setor.
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

      {/* Engagement Features */}
      <section className="py-20 bg-corporate-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Engajamento do Conselho</h2>
              <p className="text-lg text-white/70">Ferramentas para maximizar a participação e efetividade dos conselheiros</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {engagementFeatures.map((feature, index) => (
                <Card key={index} className="bg-white/5 border-border/20 hover:border-accent/30 transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/70 mb-4">{feature.description}</p>
                    <ul className="space-y-1">
                      {feature.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-white/60">
                          <CheckCircle className="h-4 w-4 text-accent" aria-hidden="true" />
                          {feat}
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
      <section className="py-20 bg-corporate-mid">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Continuidade do Board</h2>
              <p className="text-lg text-white/70">Gestão de longo prazo, avaliações e desenvolvimento contínuo</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {continuityFeatures.map((feature, index) => (
                <Card key={index} className="bg-accent/10 border-accent/30 hover:border-accent/50 transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/70 mb-4">{feature.description}</p>
                    <ul className="space-y-1">
                      {feature.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-white/60">
                          <CheckCircle className="h-4 w-4 text-accent" aria-hidden="true" />
                          {feat}
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
      <section className="py-20 bg-corporate-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Segurança Enterprise</h2>
              <p className="text-lg text-white/70">Certificações e compliance de nível mundial</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => (
                <Card key={index} className="bg-white/5 border-border/20 hover:border-accent/30 transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/70 mb-4">{feature.description}</p>
                    <ul className="space-y-1">
                      {feature.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-white/60">
                          <CheckCircle className="h-4 w-4 text-accent" aria-hidden="true" />
                          {feat}
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
      <section className="py-20 bg-corporate-mid">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Governança para Qualquer Setor</h2>
              <p className="text-lg text-white/70">Soluções adaptadas às necessidades específicas de cada indústria</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {industries.map((industry, index) => (
                <div key={index} className="flex flex-col items-center p-6 bg-white/5 rounded-xl border border-border/20 hover:border-accent/30 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-3">
                    <industry.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-center text-white">{industry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Pronto para Elevar sua Governança?</h2>
            <p className="text-xl text-white/80 mb-8">Agende uma demonstração e veja como a Legacy OS transforma a governança da sua empresa</p>
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
        subtitle="Dúvidas sobre governança integrada"
        faqs={governancaFAQs}
      />

      <MegaFooter />
    </div>
  );
};

export default Governanca;
