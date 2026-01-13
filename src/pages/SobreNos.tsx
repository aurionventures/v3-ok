import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { MegaFooter } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Users, Shield, Sparkles } from "lucide-react";
import { HeroSection, SectionHeader } from "@/components/landing";

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
    <div className="min-h-screen bg-background">
      <MegaMenuHeader />
      
      {/* Hero Section */}
      <HeroSection
        title="Sobre a Legacy OS"
        subtitle="Transformando a governança corporativa de empresas familiares e de controle concentrado através de tecnologia de ponta e inteligência artificial."
      />

      {/* Quem Somos */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 font-heading">Quem Somos</h2>
              <div className="w-24 h-1 bg-accent mx-auto" />
            </div>
            
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed mb-6">
                A <strong className="text-foreground">Legacy OS</strong> nasceu da necessidade real de empresas familiares 
                e de controle concentrado terem acesso a ferramentas de governança corporativa de classe mundial, 
                sem a complexidade e os custos proibitivos das soluções tradicionais.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Somos uma empresa de tecnologia brasileira, fundada por profissionais com décadas de experiência 
                em governança corporativa, tecnologia e gestão empresarial. Nosso time combina expertise em 
                conselhos de administração, compliance, gestão de riscos e inteligência artificial para entregar 
                a plataforma mais completa e acessível do mercado.
              </p>
              <p className="text-lg leading-relaxed">
                Acreditamos que toda empresa, independentemente do seu porte ou estágio de maturidade, 
                merece ter acesso às melhores práticas de governança. Por isso, desenvolvemos o primeiro 
                <strong className="text-foreground"> Sistema Operacional de Governança</strong> com IA nativa 
                do Brasil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 font-heading">Nossa Essência</h2>
            <div className="w-24 h-1 bg-accent mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Missão */}
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-accent">Missão</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Democratizar o acesso à governança corporativa de excelência, 
                  capacitando empresas familiares e de controle concentrado a 
                  perpetuarem seu legado através de práticas sustentáveis e 
                  tecnologia de ponta.
                </p>
              </CardContent>
            </Card>

            {/* Visão */}
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-accent">Visão</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ser a plataforma de governança corporativa líder na América Latina, 
                  reconhecida por transformar a forma como empresas familiares 
                  gerenciam seus conselhos, riscos e processos decisórios com 
                  apoio de inteligência artificial.
                </p>
              </CardContent>
            </Card>

            {/* Valores */}
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-accent">Valores</h3>
                <p className="text-muted-foreground leading-relaxed">
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
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 font-heading">Por que a Legacy OS?</h2>
            <div className="w-24 h-1 bg-accent mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {diferenciais.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MegaFooter />
    </div>
  );
}
