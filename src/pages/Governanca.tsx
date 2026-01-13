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
import { HeroSection, SectionHeader, FeatureCard, CTASection } from "@/components/landing";

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
    <div className="min-h-screen bg-background">
      <MegaMenuHeader />

      {/* Hero */}
      <HeroSection
        title="Governança Integrada"
        subtitle="Engajamento do conselho, continuidade do board e segurança enterprise em uma única plataforma. Governança de excelência para qualquer setor."
        primaryCTA={{ label: "Ver Planos e Preços", href: "/pricing" }}
        secondaryCTA={{ label: "Agendar Demo", href: "/contato" }}
      />

      {/* Engagement Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Engajamento do Conselho"
              subtitle="Ferramentas para maximizar a participação e efetividade dos conselheiros"
            />

            <div className="grid md:grid-cols-2 gap-6">
              {engagementFeatures.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  features={feature.features}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Continuity Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Continuidade do Board"
              subtitle="Gestão de longo prazo, avaliações e desenvolvimento contínuo"
            />

            <div className="grid md:grid-cols-2 gap-6">
              {continuityFeatures.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  features={feature.features}
                  variant="accent"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              title="Segurança Enterprise"
              subtitle="Certificações e compliance de nível mundial"
            />

            <div className="grid md:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  features={feature.features}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              title="Governança para Qualquer Setor"
              subtitle="Soluções adaptadas às necessidades específicas de cada indústria"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {industries.map((industry, index) => (
                <div key={index} className="flex flex-col items-center p-6 bg-card rounded-xl border border-border hover:border-accent/30 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-3">
                    <industry.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-center text-foreground">{industry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Pronto para Elevar sua Governança?"
        subtitle="Agende uma demonstração e veja como a Legacy OS transforma a governança da sua empresa"
        primaryCTA={{ label: "Agendar Demonstração", href: "/contato" }}
        secondaryCTA={{ label: "Ver Planos", href: "/pricing" }}
      />

      <MegaFooter />
    </div>
  );
};

export default Governanca;
