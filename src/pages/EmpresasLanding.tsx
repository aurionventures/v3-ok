import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DiagnosticModal from "@/components/DiagnosticModal";
import { Building, ArrowRight, Zap, BarChart, Lock, CheckCircle, Shield, Award, TrendingUp, Target, Globe, Users, FileText, Rocket, ChevronRight, Factory, Palette, Fuel, Plane, ShoppingCart, Beef, Wifi, Car, Home, Crown } from "lucide-react";

const EmpresasLanding = () => {
  const [activeTab, setActiveTab] = useState("grandes");
  const [activeCaseFilter, setActiveCaseFilter] = useState("publicas");

  const empresaCases = {
    publicas: [
      {
        company: "Natura &Co",
        industry: "Cosméticos",
        type: "publica",
        challenge: "Expansão internacional e integração de marcas",
        result: "94%",
        metrics: "aderência ao Código IBGC",
        improvements: ["Melhor acesso a capital internacional", "Transparência ESG"],
        icon: Palette
      },
      {
        company: "Vale S.A.",
        industry: "Mineração",
        type: "publica", 
        challenge: "Reconstruir confiança após crises reputacionais",
        result: "100%",
        metrics: "aderência ao Código IBGC",
        improvements: ["Reconquista da confiança global", "Fortalecimento compliance"],
        icon: Factory
      },
      {
        company: "Petrobras",
        industry: "Energia",
        type: "publica",
        challenge: "Compliance e transparência pós-crise",
        result: "85%",
        metrics: "melhoria em transparência",
        improvements: ["Redução de riscos operacionais", "Governança robusta"],
        icon: Fuel
      },
      {
        company: "Embraer",
        industry: "Aeroespacial",
        type: "publica",
        challenge: "Governança para expansão global",
        result: "92%",
        metrics: "aderência internacional",
        improvements: ["Acesso a mercados globais", "Parcerias estratégicas"],
        icon: Plane
      },
      {
        company: "Magazine Luiza",
        industry: "E-commerce",
        type: "publica",
        challenge: "Digitalização e práticas ESG",
        result: "89%",
        metrics: "aderência ESG",
        improvements: ["Liderança em diversidade", "Inovação digital"],
        icon: ShoppingCart
      },
      {
        company: "JBS",
        industry: "Alimentos",
        type: "publica",
        challenge: "Reconstrução reputacional via governança",
        result: "78%",
        metrics: "melhoria reputacional",
        improvements: ["Processos de compliance", "Transparência operacional"],
        icon: Beef
      }
    ],
    privadas: [
      {
        company: "FiBrasil",
        industry: "Infraestrutura",
        type: "privada",
        challenge: "Co-controle e transparência entre sócios",
        result: "95%",
        metrics: "satisfação dos sócios",
        improvements: ["Decisões estratégicas otimizadas", "Redução de conflitos"],
        icon: Wifi
      },
      {
        company: "Grupo GR",
        industry: "Segurança",
        type: "privada",
        challenge: "Reorganização de liderança executiva",
        result: "88%",
        metrics: "eficiência operacional",
        improvements: ["Processos internos robustos", "Definição clara de papéis"],
        icon: Shield
      },
      {
        company: "Movida",
        industry: "Mobilidade",
        type: "privada",
        challenge: "Governança para preparação de IPO",
        result: "90%",
        metrics: "preparação para abertura",
        improvements: ["Credibilidade no mercado", "Escalabilidade operacional"],
        icon: Car
      },
      {
        company: "Pif Paf Alimentos",
        industry: "Alimentação",
        type: "privada",
        challenge: "Conselho formal e profissionalização",
        result: "86%",
        metrics: "profissionalização",
        improvements: ["Delegação eficiente", "Controles internos formais"],
        icon: Beef
      },
      {
        company: "Empresas Familiares",
        industry: "Construção Civil",
        type: "privada",
        challenge: "Separação família/negócio",
        result: "82%",
        metrics: "redução de conflitos",
        improvements: ["Maior resiliência", "Gestão profissionalizada"],
        icon: Home
      }
    ]
  };

  const benefits = [
    {
      icon: Shield,
      title: "Compliance Automatizada",
      description: "Atenda automaticamente às exigências do IBGC, CVM e ESG"
    },
    {
      icon: BarChart,
      title: "Dashboard Executivo",
      description: "Visão completa da maturidade de governança em tempo real"
    },
    {
      icon: FileText,
      title: "Relatórios Profissionais",
      description: "Documentação completa para auditorias e stakeholders"
    },
    {
      icon: Target,
      title: "Gestão de Riscos",
      description: "Identificação e mitigação proativa de riscos corporativos"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Legacy</span>
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
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Para Empresas
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
              Digitalize a <span className="text-primary">Governança</span><br />
              da Sua Empresa
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Plataforma completa para empresas que querem implementar governança corporativa 
              de classe mundial, seguindo as melhores práticas do IBGC e padrões ESG.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <DiagnosticModal>
                <Button size="lg" className="text-lg px-8 py-6 h-auto rounded-xl">
                  <Rocket className="h-6 w-6 mr-3" />
                  Começar Diagnóstico Gratuito
                  <ArrowRight className="h-5 w-5 ml-3" />
                </Button>
              </DiagnosticModal>
              
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto rounded-xl">
                <Users className="h-6 w-6 mr-3" />
                Agendar Demo Executiva
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Tudo que sua empresa precisa para uma 
                <span className="text-primary"> governança de excelência</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
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

      {/* Success Cases */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Empresas que <span className="text-primary">Digitalizaram</span> a Governança
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Resultados reais de empresas que investiram em governança corporativa
              </p>
              
              {/* Filter Tabs */}
              <div className="flex justify-center mb-12">
                <div className="flex bg-muted rounded-lg p-1">
                  <Button
                    variant={activeCaseFilter === "publicas" ? "default" : "ghost"}
                    onClick={() => setActiveCaseFilter("publicas")}
                    className="rounded-md px-6"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Empresas Públicas
                  </Button>
                  <Button
                    variant={activeCaseFilter === "privadas" ? "default" : "ghost"}
                    onClick={() => setActiveCaseFilter("privadas")}
                    className="rounded-md px-6"
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Empresas Privadas
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Cases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {empresaCases[activeCaseFilter].map((caso, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <caso.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{caso.company}</h3>
                          <p className="text-sm text-muted-foreground">{caso.industry}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20 font-bold">
                        {caso.result}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">{caso.challenge}</p>
                        <p className="text-sm font-medium text-primary">{caso.metrics}</p>
                      </div>
                      
                      <div className="space-y-1">
                        {caso.improvements.map((improvement, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <p className="text-xs text-muted-foreground">{improvement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">11+</div>
                <p className="text-sm text-muted-foreground">Casos de Sucesso Documentados</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">89%</div>
                <p className="text-sm text-muted-foreground">Melhoria Média em Governança</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">6-12</div>
                <p className="text-sm text-muted-foreground">Meses para Implementação</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Pronto para Digitalizar sua Governança?
            </h2>
            <p className="text-xl mb-12 opacity-90">
              Junte-se a centenas de empresas que já transformaram sua governança corporativa
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <DiagnosticModal>
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto rounded-xl">
                  <Rocket className="h-6 w-6 mr-3" />
                  Fazer Diagnóstico Gratuito
                  <ArrowRight className="h-5 w-5 ml-3" />
                </Button>
              </DiagnosticModal>
              
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6 h-auto rounded-xl">
                <Users className="h-6 w-6 mr-3" />
                Falar com Especialista
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Legacy</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Digitalizando a governança corporativa brasileira
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmpresasLanding;