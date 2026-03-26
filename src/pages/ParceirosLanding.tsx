import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Scale, ArrowRight, Zap, BarChart, PiggyBank, TrendingUp, Users, Rocket, Building, Target, CheckCircle, Trophy, Clock, DollarSign, Briefcase } from "lucide-react";
import { toast } from "sonner";

const ParceirosLanding = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Solicitação enviada! Entraremos em contato em até 24h.");
  };

  const roiMetrics = [
    {
      icon: DollarSign,
      title: "+300% ROI",
      description: "Aumento médio no faturamento dos parceiros"
    },
    {
      icon: Clock,
      title: "85% menos tempo",
      description: "Redução no tempo de implementação"
    },
    {
      icon: Users,
      title: "+150% clientes",
      description: "Crescimento médio da carteira"
    },
    {
      icon: Trophy,
      title: "95% satisfação",
      description: "Taxa de satisfação dos clientes finais"
    }
  ];

  const partnerBenefits = [
    {
      icon: Rocket,
      title: "Plataforma White Label",
      description: "Personalize com sua marca e metodologia"
    },
    {
      icon: BarChart,
      title: "Dashboard Multi-Cliente",
      description: "Gerencie todos os seus clientes em um só lugar"
    },
    {
      icon: Target,
      title: "Automação Completa",
      description: "Diagnósticos, relatórios e follow-ups automatizados"
    },
    {
      icon: PiggyBank,
      title: "Modelo de Revenue Share",
      description: "Gere receita recorrente com seus clientes"
    }
  ];

  const partnershipLevels = [
    {
      level: "Parceiro Certificado",
      price: "Sob consulta",
      features: [
        "Acesso à plataforma",
        "Treinamento básico",
        "Suporte por email"
      ],
      cta: "Começar Agora"
    },
    {
      level: "Parceiro Premium",
      price: "Sob consulta",
      features: [
        "White label completo",
        "Dashboard multi-cliente",
        "Treinamento avançado",
        "Suporte prioritário"
      ],
      cta: "Solicitar Demo",
      featured: true
    },
    {
      level: "Parceiro Elite",
      price: "Sob consulta",
      features: [
        "Customizações exclusivas",
        "Account manager dedicado",
        "Co-marketing"
      ],
      cta: "Falar com Especialista"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Legacy Partners</span>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Voltar ao Início
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
              Para Bancas Jurídicas
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
              Multiplique seus <span className="text-primary">Resultados</span><br />
              com Governança Digital
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Torne-se um parceiro Legacy e ofereça soluções completas de governança corporativa 
              para seus clientes, aumentando seu faturamento em até 300%.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8 py-6 h-auto rounded-xl">
                <Rocket className="h-6 w-6 mr-3" />
                Solicitar Demo Parceiro
                <ArrowRight className="h-5 w-5 ml-3" />
              </Button>
              
            </div>

          </div>
        </div>
      </section>


      {/* Partner Benefits */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Tudo que você precisa para <span className="text-primary">escalar</span> seu negócio
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {partnerBenefits.map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8">
                    <benefit.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-3">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Levels */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Escolha seu <span className="text-primary">Nível de Parceria</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {partnershipLevels.map((level, index) => (
                <Card key={index} className={`relative ${level.featured ? 'border-primary shadow-xl scale-105' : ''}`}>
                  {level.featured && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                      Mais Popular
                    </Badge>
                  )}
                  <CardContent className="pt-8">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold mb-2">{level.level}</h3>
                      <div className="text-3xl font-bold text-primary">{level.price}</div>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {level.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full" 
                      variant={level.featured ? "default" : "outline"}
                    >
                      {level.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Platform Features */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Seu Novo <span className="text-primary">Arsenal de Ferramentas</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Descubra como nossa plataforma transforma a prática jurídica em governança
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Dashboard Executivo</h3>
                    <p className="text-muted-foreground">Diagnóstico instantâneo da maturidade de governança do cliente</p>
                    <div className="bg-primary/5 p-3 rounded-lg">
                      <div className="text-sm font-medium text-primary">Insights imediatos para consultoria estratégica</div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Automação com IA</h3>
                    <p className="text-muted-foreground">6 agentes especializados em governança, compliance e sucessão</p>
                    <div className="bg-primary/5 p-3 rounded-lg">
                      <div className="text-sm font-medium text-primary">Consultoria especializada 24/7</div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Gestão de Riscos</h3>
                    <p className="text-muted-foreground">Matriz de impacto vs. probabilidade automatizada</p>
                    <div className="bg-primary/5 p-3 rounded-lg">
                      <div className="text-sm font-medium text-primary">Compliance e prevenção proativa</div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">White Label</h3>
                    <p className="text-muted-foreground">Personalize a plataforma com sua marca e metodologia</p>
                    <div className="bg-primary/5 p-3 rounded-lg">
                      <div className="text-sm font-medium text-primary">Sua marca, nossa tecnologia</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Dúvidas <span className="text-primary">Frequentes</span>
              </h2>
            </div>
            
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Como funciona o modelo de parceria?</h3>
                <p className="text-muted-foreground">Oferecemos diferentes níveis de parceria com comissões de 20% a 40% sobre a receita recorrente. Você mantém o relacionamento com o cliente enquanto oferece nossa tecnologia.</p>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Quanto tempo leva para implementar?</h3>
                <p className="text-muted-foreground">A capacitação da sua equipe leva 1-2 semanas. Para seus clientes, a implementação completa da governança leva apenas 6 semanas, comparado aos 9+ meses do método tradicional.</p>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Posso usar minha própria marca?</h3>
                <p className="text-muted-foreground">Sim! Oferecemos opção white label completa nos níveis Premium e Elite, permitindo que você ofereça a plataforma com sua própria identidade visual.</p>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Qual o potencial de receita?</h3>
                <p className="text-muted-foreground">Bancas parceiras relatam aumento de 40% no ticket médio e receita adicional de R$ 50k a R$ 150k/mês, além de maior retenção de clientes (LTV 5-10 anos).</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Pronto para se Tornar um Parceiro?
              </h2>
              <p className="text-xl opacity-90">
                Preencha o formulário e nossa equipe entrará em contato em até 24h
              </p>
            </div>
            
            <Card className="bg-white text-foreground">
              <CardContent className="p-8">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nome Completo</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Escritório/Empresa</label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Mensagem</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Conte-nos sobre seu escritório e como podemos ajudar..."
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full">
                    <Rocket className="h-5 w-5 mr-2" />
                    Solicitar Parceria
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Scale className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Legacy Partners</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transformando bancas jurídicas em líderes de governança corporativa
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ParceirosLanding;