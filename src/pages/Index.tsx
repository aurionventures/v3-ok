import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Play, ArrowRight, CheckCircle, Brain, Eye, 
  Target, TrendingUp, Shield, Zap, Users,
  Calendar, BarChart3, Lightbulb
} from "lucide-react";
import { MegaFooter } from "@/components/footer";
import { FAQSection, indexFAQs } from "@/components/footer/FAQSection";
import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { LGPDConsentBanner } from "@/components/LGPDConsentBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Solicitação enviada! Entraremos em contato em até 24h.");
    setFormData({ name: "", email: "", organization: "", phone: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // AI-First Core capabilities
  const aiCapabilities = [
    {
      icon: Brain,
      title: "Monitoramento Contínuo",
      description: "IA construída no DNA da plataforma monitora sinais de mercado, regulação e economia 24/7."
    },
    {
      icon: TrendingUp,
      title: "Antecipação de Cenários",
      description: "Identifica riscos e oportunidades antes que se tornem urgentes para o conselho."
    },
    {
      icon: Eye,
      title: "Visão 360° Integrada",
      description: "Consolida dados dispersos em insights acionáveis com contexto estratégico completo."
    },
    {
      icon: Target,
      title: "Priorização Inteligente",
      description: "Transforma complexidade em pautas claras com decisões ordenadas por impacto."
    }
  ];

  // Strategic benefits
  const strategicBenefits = [
    {
      icon: Lightbulb,
      title: "Clareza Decisória",
      description: "Transforme complexidade em insights acionáveis. Cada reunião com contexto estratégico pronto."
    },
    {
      icon: Shield,
      title: "Antecipação Estratégica",
      description: "Identifique riscos antes que se tornem crises. IA monitora sinais de alerta continuamente."
    },
    {
      icon: Users,
      title: "Alinhamento Contínuo",
      description: "Garanta que todos decidam com a mesma base de informação. Governança sem fragmentação."
    }
  ];

  // Differentiation table data
  const differentiators = [
    { aspect: "Arquitetura IA", legacy: "Nativa, construída no DNA", others: "Bolt-on, adicionada depois" },
    { aspect: "Foco Principal", legacy: "Decisão estratégica do conselho", others: "Operação e secretariado" },
    { aspect: "Modelo", legacy: "Sistema Operacional integrado", others: "Ferramenta isolada" },
    { aspect: "Usuários", legacy: "Ilimitados em todos os planos", others: "Cobrança por assento" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MegaMenuHeader />

      {/* HERO SECTION - Premium Institutional */}
      <section className="relative overflow-hidden bg-gradient-hero pt-40 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(192,160,98,0.08),transparent_50%)]" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* H1 - Main Headline */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 leading-tight font-heading">
              A Inteligência por Trás das Melhores Decisões de Conselho
            </h1>
            
            {/* H2 - Subtitle */}
            <p className="text-xl lg:text-2xl mb-12 text-white/80 leading-relaxed max-w-3xl mx-auto font-normal">
              Legacy OS é o primeiro Sistema Operacional de Governança Corporativa com IA nativa, 
              que monitora riscos, antecipa cenários e prioriza decisões estratégicas — 
              transformando dados dispersos em pautas inteligentes antes mesmo da reunião acontecer.
            </p>
            
            {/* CTAs - Preserved as requested */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-accent text-primary hover:bg-accent/90 text-lg px-8 py-3 h-14 rounded-lg font-semibold"
                onClick={() => navigate('/standalone-quiz')}
              >
                <Play className="h-5 w-5 mr-2" />
                Fazer Diagnóstico Gratuito (5 min)
              </Button>
              <Button 
                size="lg" 
                className="bg-transparent border-2 border-accent text-accent hover:bg-accent/10 text-lg px-8 py-3 h-14 rounded-lg font-semibold"
                onClick={() => navigate('/como-funciona')}
              >
                <Eye className="h-5 w-5 mr-2" />
                Ver Como Funciona
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* POSITIONING SECTION - What Legacy IS and IS NOT */}
      <section className="py-20 bg-corporate-mid">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-heading">
                O Que a Legacy OS É — E O Que Não É
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Posicionamento claro para decisores que buscam infraestrutura estratégica, não ferramentas operacionais.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* What Legacy IS */}
              <Card className="bg-accent/10 border-accent/30 border-2">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Legacy OS É</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Infraestrutura decisória para conselhos",
                      "Sistema Operacional de Governança Corporativa",
                      "IA que antecipa cenários e prioriza decisões",
                      "Clareza estratégica em mundo complexo"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-white/80">
                        <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* What Legacy IS NOT */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white/60" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Legacy OS Não É</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Ferramenta operacional ou board portal tradicional",
                      "Software de produtividade para secretariado",
                      "Automação de tarefas administrativas",
                      "Mais uma ferramenta isolada no mercado"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-white/50">
                        <div className="w-5 h-5 shrink-0 mt-0.5 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                        </div>
                        <span className="line-through">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* AI-FIRST CORE SECTION */}
      <section className="py-20 bg-corporate-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-heading">
                IA Nativa: O Diferencial Fundamental
              </h2>
              <p className="text-lg text-white/60 max-w-3xl mx-auto">
                Não é IA "bolt-on" adicionada depois. É inteligência artificial construída no DNA 
                da plataforma desde o primeiro dia, pensada para decisores de alto nível.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiCapabilities.map((capability, index) => (
                <Card key={index} className="bg-white/5 border-white/10 hover:border-accent/30 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <capability.icon className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">{capability.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{capability.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STRATEGIC BENEFITS SECTION */}
      <section className="py-20 bg-corporate-light">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-heading">
                Decisões Melhores. Governança Mais Clara.
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Três pilares que transformam a forma como conselhos operam.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {strategicBenefits.map((benefit, index) => (
                <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                      <benefit.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                    <p className="text-white/60 leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATION VS MARKET */}
      <section className="py-20 bg-corporate-mid">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-heading">
                O Que Nos Diferencia
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Comparação objetiva entre Legacy OS e alternativas tradicionais de mercado.
              </p>
            </div>

            <Card className="bg-white/5 border-white/10 overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Aspecto</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Legacy OS</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/50">Alternativas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {differentiators.map((row, index) => (
                        <tr key={index} className="border-b border-white/5 last:border-b-0">
                          <td className="px-6 py-4 text-sm text-white font-medium">{row.aspect}</td>
                          <td className="px-6 py-4 text-sm text-accent">{row.legacy}</td>
                          <td className="px-6 py-4 text-sm text-white/40">{row.others}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / VALIDATION */}
      <section className="py-20 bg-corporate-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-heading">
              Construído com Líderes de Governança
            </h2>
            <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
              Metodologia validada por especialistas e alinhada com os principais frameworks de governança corporativa.
            </p>

            {/* Framework Alignment */}
            <div className="grid grid-cols-3 gap-8 mb-12">
              {["IBGC", "IBRI", "ISO 37000"].map((framework) => (
                <div key={framework} className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="h-7 w-7 text-accent" />
                  </div>
                  <span className="text-sm text-white/60">Alinhado {framework}</span>
                </div>
              ))}
            </div>

            {/* Early Adopters Note */}
            <div className="max-w-2xl mx-auto bg-accent/10 border border-accent/30 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Calendar className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                <div className="text-left">
                  <h4 className="font-semibold text-white mb-1">Early Adopters</h4>
                  <p className="text-sm text-white/70">
                    Estamos embarcando os primeiros conselhos agora. 
                    Vagas limitadas para garantir suporte premium durante onboarding e validação contínua.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 font-heading">
                Pronto para Elevar Sua Governança?
              </h2>
              <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
                Dê o próximo passo em direção a decisões mais claras e governança mais inteligente.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
              {/* CTA Buttons */}
              <div className="space-y-3 md:space-y-4">
                <Button 
                  size="lg" 
                  className="w-full bg-accent text-primary hover:bg-accent/90 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 h-auto rounded-lg font-semibold"
                  onClick={() => navigate('/contato')}
                >
                  <Calendar className="h-5 w-5 mr-2 flex-shrink-0" />
                  Agendar Demonstração
                </Button>
                <Button 
                  size="lg" 
                  className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 h-auto rounded-lg font-semibold"
                  onClick={() => navigate('/plataforma')}
                >
                  <Eye className="h-5 w-5 mr-2 flex-shrink-0" />
                  Conhecer a Legacy OS
                </Button>
                <Button 
                  size="lg" 
                  className="w-full bg-transparent border-2 border-accent text-accent hover:bg-accent/10 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 h-auto rounded-lg font-semibold"
                  onClick={() => navigate('/standalone-quiz')}
                >
                  <Play className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>Fazer Diagnóstico de Governança</span>
                </Button>
              </div>

              {/* Contact Form */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Ou entre em contato</h3>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-white/70 text-sm">Nome</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white/70 text-sm">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="organization" className="text-white/70 text-sm">Organização</Label>
                      <Input
                        id="organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="Nome da sua empresa"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white/70 text-sm">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-accent text-primary hover:bg-accent/90 font-semibold">
                      Enviar Solicitação
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <FAQSection 
        title="Perguntas Frequentes"
        subtitle="Tire suas dúvidas sobre o Legacy OS"
        faqs={indexFAQs}
      />

      <MegaFooter />
      <LGPDConsentBanner />
    </div>
  );
};

export default Index;
