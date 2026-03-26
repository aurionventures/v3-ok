import { Link } from "react-router-dom";
import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { MegaFooter } from "@/components/footer";
import { FAQSection, sobreFAQs } from "@/components/footer/FAQSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Eye, Heart, Users, Shield, Sparkles, ArrowRight } from "lucide-react";

export default function SobreNos() {
  const diferenciais = [
    {
      icon: Sparkles,
      title: "IA Nativa",
      description: "14 agentes de inteligência artificial construídos desde o dia 1 para otimizar cada aspecto da governança."
    },
    {
      icon: Users,
      title: "Usuários Ilimitados",
      description: "Não cobramos por usuário. Todos os membros da sua organização podem participar sem custos adicionais."
    },
    {
      icon: Shield,
      title: "Segurança Enterprise",
      description: "Certificações SOC 2, ISO 27001 e LGPD. Seus dados protegidos com os mais altos padrões do mercado."
    },
    {
      icon: Target,
      title: "Foco em Empresas Familiares",
      description: "Desenvolvido especificamente para as necessidades únicas de empresas de controle concentrado e familiares."
    },
    {
      icon: Heart,
      title: "Suporte Humanizado",
      description: "Atendimento especializado por profissionais de governança, não apenas técnicos de suporte."
    },
    {
      icon: Eye,
      title: "Transparência Total",
      description: "Preços claros, sem surpresas. ROI comprovado desde o primeiro mês de uso da plataforma."
    }
  ];

  return (
    <div className="min-h-screen bg-corporate-dark">
      <MegaMenuHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(192,160,98,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 leading-tight font-heading">
              Sobre a Legacy OS
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-white/80 leading-relaxed max-w-3xl mx-auto">
              Transformando a governança corporativa de empresas familiares e de controle 
              concentrado através de tecnologia de ponta e inteligência artificial.
            </p>
          </div>
        </div>
      </section>

      {/* Quem Somos */}
      <section className="py-20 bg-corporate-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Quem Somos</h2>
              <div className="w-24 h-1 bg-accent mx-auto" />
            </div>
            
            <div className="space-y-6 text-lg text-white/70 leading-relaxed">
              <p>
                A <strong className="text-white">Legacy OS</strong> nasceu da necessidade real de empresas familiares 
                e de controle concentrado terem acesso a ferramentas de governança corporativa de classe mundial, 
                sem a complexidade e os custos proibitivos das soluções tradicionais.
              </p>
              <p>
                Somos uma empresa de tecnologia brasileira, fundada por profissionais com décadas de experiência 
                em governança corporativa, tecnologia e gestão empresarial. Nosso time combina expertise em 
                conselhos de administração, compliance, gestão de riscos e inteligência artificial para entregar 
                a plataforma mais completa e acessível do mercado.
              </p>
              <p>
                Acreditamos que toda empresa, independentemente do seu porte ou estágio de maturidade, 
                merece ter acesso às melhores práticas de governança. Por isso, desenvolvemos o primeiro 
                <strong className="text-white"> Sistema Operacional de Governança</strong> com IA nativa 
                do Brasil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-20 bg-corporate-mid">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Nossa Essência</h2>
            <div className="w-24 h-1 bg-accent mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Missão */}
            <Card className="bg-white/5 border-border/20">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-accent" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-accent">Missão</h3>
                <p className="text-white/70 leading-relaxed">
                  Democratizar o acesso à governança corporativa de excelência, 
                  capacitando empresas familiares e de controle concentrado a 
                  perpetuarem seu legado através de práticas sustentáveis e 
                  tecnologia de ponta.
                </p>
              </CardContent>
            </Card>

            {/* Visão */}
            <Card className="bg-white/5 border-border/20">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-8 w-8 text-accent" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-accent">Visão</h3>
                <p className="text-white/70 leading-relaxed">
                  Ser a plataforma de governança corporativa líder na América Latina, 
                  reconhecida por transformar a forma como empresas familiares 
                  gerenciam seus conselhos, riscos e processos decisórios com 
                  apoio de inteligência artificial.
                </p>
              </CardContent>
            </Card>

            {/* Valores */}
            <Card className="bg-white/5 border-border/20">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-accent" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-accent">Valores</h3>
                <p className="text-white/70 leading-relaxed">
                  Transparência, Inovação, Excelência, Respeito ao Legado Familiar, 
                  Compromisso com Resultados e Responsabilidade Social. 
                  Guiamos cada decisão por estes princípios fundamentais.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nossos Diferenciais */}
      <section className="py-20 bg-corporate-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Por que a Legacy OS?</h2>
            <div className="w-24 h-1 bg-accent mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {diferenciais.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-white">{item.title}</h4>
                  <p className="text-sm text-white/70">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Conheça Nossa Plataforma</h2>
            <p className="text-xl text-white/80 mb-8">Agende uma demonstração e descubra como a Legacy OS pode transformar sua governança</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold text-lg px-8" asChild>
                <Link to="/contato">
                  Agendar Demonstração
                  <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                </Link>
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
        subtitle="Dúvidas sobre a empresa"
        faqs={sobreFAQs}
      />

      <MegaFooter />
    </div>
  );
}
