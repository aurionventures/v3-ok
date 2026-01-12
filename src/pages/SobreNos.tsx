import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { MegaFooter } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Users, Shield, Sparkles } from "lucide-react";

export default function SobreNos() {
  return (
    <div className="min-h-screen bg-background">
      <MegaMenuHeader />
      
      {/* Hero Section - com padding-top para compensar o header fixo */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#0D1B2A] to-[#1B263B] pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Sobre a Legacy OS
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Transformando a governança corporativa de empresas familiares e de controle concentrado
              através de tecnologia de ponta e inteligência artificial.
            </p>
          </div>
        </div>
      </section>

      {/* Quem Somos */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Quem Somos</h2>
              <div className="w-24 h-1 bg-[#C0A062] mx-auto" />
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
            <h2 className="text-3xl font-bold mb-4">Nossa Essência</h2>
            <div className="w-24 h-1 bg-[#C0A062] mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Missão */}
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-[#C0A062]">Missão</h3>
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
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-[#C0A062]">Visão</h3>
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
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-[#C0A062]">Valores</h3>
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
            <h2 className="text-3xl font-bold mb-4">Por que a Legacy OS?</h2>
            <div className="w-24 h-1 bg-[#C0A062] mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#C0A062]/10 rounded-lg flex items-center justify-center shrink-0">
                <Sparkles className="h-6 w-6 text-[#C0A062]" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">IA Nativa</h4>
                <p className="text-sm text-muted-foreground">
                  14 agentes de inteligência artificial construídos desde o dia 1 
                  para otimizar cada aspecto da governança.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#C0A062]/10 rounded-lg flex items-center justify-center shrink-0">
                <Users className="h-6 w-6 text-[#C0A062]" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usuários Ilimitados</h4>
                <p className="text-sm text-muted-foreground">
                  Não cobramos por usuário. Todos os membros da sua organização 
                  podem participar sem custos adicionais.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#C0A062]/10 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 text-[#C0A062]" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Segurança Enterprise</h4>
                <p className="text-sm text-muted-foreground">
                  Certificações SOC 2, ISO 27001 e LGPD. Seus dados protegidos 
                  com os mais altos padrões do mercado.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#C0A062]/10 rounded-lg flex items-center justify-center shrink-0">
                <Target className="h-6 w-6 text-[#C0A062]" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Foco em Empresas Familiares</h4>
                <p className="text-sm text-muted-foreground">
                  Desenvolvido especificamente para as necessidades únicas de 
                  empresas de controle concentrado e familiares.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#C0A062]/10 rounded-lg flex items-center justify-center shrink-0">
                <Heart className="h-6 w-6 text-[#C0A062]" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Suporte Humanizado</h4>
                <p className="text-sm text-muted-foreground">
                  Atendimento especializado por profissionais de governança, 
                  não apenas técnicos de suporte.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#C0A062]/10 rounded-lg flex items-center justify-center shrink-0">
                <Eye className="h-6 w-6 text-[#C0A062]" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Transparência Total</h4>
                <p className="text-sm text-muted-foreground">
                  Preços claros, sem surpresas. ROI comprovado desde o primeiro 
                  mês de uso da plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MegaFooter />
    </div>
  );
}
