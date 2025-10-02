import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Play, Users, Building2, TrendingUp, Target, Award, CheckCircle, ArrowRight, Star, Zap, Scale, Shield, Brain, Phone, Calendar, AlertTriangle, Rocket, Sparkles, Frown, Calculator, Clock, Briefcase, FileText, BarChart, Gauge, Mail, Lock, Building, ChevronDown } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import DiagnosticModal from "@/components/DiagnosticModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import legacyLogo from "@/assets/legacy-logo-new.png";
const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("empresas");
  const [roiInputs, setRoiInputs] = useState({
    clientsNumber: [10],
    averageTicket: [50000],
    currentEfficiency: [3]
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    firm: "",
    phone: "",
    message: ""
  });

  const [expandedCase, setExpandedCase] = useState<number | null>(null);
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Solicitação enviada! Entraremos em contato em até 24h.");
    setFormData({
      name: "",
      email: "",
      firm: "",
      phone: "",
      message: ""
    });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ROI Calculator logic
  const calculateROI = () => {
    const clients = roiInputs.clientsNumber[0];
    const ticket = roiInputs.averageTicket[0];
    const efficiency = roiInputs.currentEfficiency[0];
    const currentRevenue = clients * ticket;
    const legacyRevenue = currentRevenue * 1.4; // 40% increase
    const monthlyGain = (legacyRevenue - currentRevenue) / 12;
    const timeReduction = efficiency * 0.75; // 75% time reduction

    return {
      monthlyGain: Math.round(monthlyGain),
      yearlyGain: Math.round(legacyRevenue - currentRevenue),
      timeReduction: Math.round(timeReduction),
      efficiency: Math.round((1 - timeReduction / efficiency) * 100)
    };
  };

  // Instituições que endossam as práticas de governança
  const endorsementInstitutions = [
    'OECD',
    'IFC (World Bank Group)',
    'World Economic Forum (WEF)',
    'ICGN',
    'ISO (ISO 37000)',
    'BSI Group',
    'IBGC',
    'CVM',
    'B3 – Novo Mercado',
    'Banco Central do Brasil'
  ];

  const roiResults = calculateROI();
  const beforeAfterData = [{
    category: "Implementação",
    before: "9+ Meses",
    after: "6 Semanas",
    improvement: "-85%"
  }, {
    category: "Processo",
    before: "Checklists Manuais",
    after: "Automação com IA",
    improvement: "Inteligente"
  }, {
    category: "Documentação",
    before: "Dispersa e Arriscada",
    after: "Centralizada e Segura",
    improvement: "Compliant"
  }, {
    category: "Escalabilidade",
    before: "Alto Custo Operacional",
    after: "+300% de ROI",
    improvement: "Rentável"
  }];
  const platformFeatures = [{
    title: "Dashboard Executivo",
    description: "Diagnóstico instantâneo da maturidade de governança do cliente",
    benefit: "Insights imediatos para consultoria estratégica"
  }, {
    title: "Estrutura Societária",
    description: "Genogramas e cap tables automatizados em minutos",
    benefit: "Elimine semanas de trabalho manual"
  }, {
    title: "Conselhos e Rituais",
    description: "Automação completa de pautas, atas e calendários",
    benefit: "Secretariado digital profissional"
  }, {
    title: "6 Agentes de IA",
    description: "Consilium, Succession Mentor, Risk Sentinel e mais",
    benefit: "Consultoria especializada 24/7"
  }, {
    title: "Gestão de Riscos",
    description: "Matriz de impacto vs. probabilidade automatizada",
    benefit: "Compliance e prevenção proativa"
  }];
  const valueProps = [{
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Aumente seu Faturamento",
    highlight: "+40% no Ticket Médio",
    description: "Crie receita recorrente com comissões de 15% a 30% (whitelabel). Expanda seus serviços para incluir secretariado digital e consultoria especializada.",
    result: "R$ 50k a R$ 150k/mês extras",
    color: "from-green-500 to-emerald-600"
  }, {
    icon: <Users className="h-8 w-8" />,
    title: "Fidelize seus Clientes",
    highlight: "+80% Retenção",
    description: "Aumente o engajamento com uma plataforma moderna que oferece transparência total. Transforme projetos pontuais em relacionamentos de longo prazo.",
    result: "LTV de 5-10 anos",
    color: "from-blue-500 to-indigo-600"
  }, {
    icon: <Award className="h-8 w-8" />,
    title: "Posicione sua Marca",
    highlight: "Vantagem Competitiva Única",
    description: "Seja a única banca na sua região a oferecer uma plataforma de governança com IA. Utilize nossa opção whitelabel para fortalecer sua marca.",
    result: "Líder em Inovação",
    color: "from-purple-500 to-violet-600"
  }];
  const partnershipLevels = [{
    level: "Prata",
    commission: "15-20%",
    benefits: ["Acesso básico à plataforma", "Treinamento inicial", "Suporte por email"],
    requirement: "1-5 clientes ativos"
  }, {
    level: "Ouro",
    commission: "20-25%",
    benefits: ["Recursos avançados", "Gestor dedicado", "Materiais co-branded"],
    requirement: "6-15 clientes ativos"
  }, {
    level: "Platina",
    commission: "25-30%",
    benefits: ["Acesso total", "Suporte prioritário", "Whitelabel completo"],
    requirement: "16+ clientes ativos"
  }];
  const successCases = [{
    company: "Natura &Co",
    industry: "Cosméticos e Bens de Consumo",
    result: "94% de adesão ao Código Brasileiro de Governança",
    challenge: "• Expansão internacional com 4 marcas globais\n• Manter transparência durante integração complexa\n• Acessar mercado de capitais internacional",
    solution: "• Conselho independente e comitês especializados\n• Adesão ao Novo Mercado da B3\n• Frameworks ESG integrados",
    metrics: "94% aderência às práticas IBGC • Líder em transparência ESG • Acesso ampliado a capital internacional"
  }, {
    company: "Vale S.A.",
    industry: "Mineração",
    result: "100% de aderência ao Código Brasileiro de Governança",
    challenge: "• Reconstruir confiança pós-crise reputacional\n• Fortalecer controles de risco operacional\n• Atender stakeholders globais rigorosos",
    solution: "• Reestruturação completa do board\n• Auditoria e compliance independentes\n• Políticas de transparência total",
    metrics: "100% aderência ao Código IBGC • Confiança de investidores restaurada • Financiamento sustentável desbloqueado"
  }, {
    company: "Petrobras",
    industry: "Energia",
    result: "Nota 9,79/10 no Índice de Governança Pública",
    challenge: "• Eliminar riscos de corrupção sistêmica\n• Transparência em empresa estatal mista\n• Compliance rigoroso com regulações",
    solution: "• Compliance independente e automatizado\n• Conselho com maioria independente\n• Auditorias contínuas e transparentes",
    metrics: "9,79/10 em governança pública • Referência em estatais • Zero tolerância a riscos legais"
  }];
  const faqData = [{
    question: "O que é governança corporativa?",
    answer: "Governança corporativa é o conjunto de práticas, políticas e estruturas que orientam a gestão e o controle de uma empresa. Para empresas familiares, envolve a criação de órgãos de governança, definição de papéis e responsabilidades, e estabelecimento de processos decisórios transparentes que garantem a continuidade e o crescimento sustentável do negócio."
  }, {
    question: "Como a Legacy pode ajudar minha empresa?",
    answer: "A Legacy oferece uma plataforma tecnológica completa que digitaliza e organiza todos os aspectos da governança empresarial. Através de diagnósticos automatizados, relatórios executivos, gestão de conselhos e monitoramento contínuo, ajudamos sua empresa a estruturar processos, reduzir riscos e preparar-se para o futuro."
  }, {
    question: "Qual o tempo necessário para estruturar a governança?",
    answer: "O processo de estruturação varia conforme a complexidade da empresa, mas tipicamente leva de 6 a 18 meses para implementação completa. Começamos com um diagnóstico gratuito que identifica as principais necessidades, seguido de um plano personalizado com marcos e prazos específicos para sua realidade."
  }, {
    question: "A plataforma atende empresas de todos os portes?",
    answer: "Sim! Nossa solução é escalável e atende desde empresas familiares de médio porte até grandes corporações. A plataforma se adapta à complexidade e necessidades específicas de cada organização, garantindo que todos os aspectos da governança sejam adequadamente endereçados."
  }, {
    question: "Como garantir a continuidade da empresa familiar?",
    answer: "A continuidade requer planejamento sucessório estruturado, preparação das próximas gerações, definição clara de valores familiares e criação de órgãos de governança eficazes. Nossa plataforma oferece ferramentas específicas para gestão sucessória, desenvolvimento de herdeiros e monitoramento da evolução da maturidade da governança."
  }, {
    question: "Quais são os principais riscos de não ter governança?",
    answer: "Empresas sem governança estruturada enfrentam riscos como conflitos familiares, decisões centralizadas inadequadas, falta de transparência, dificuldades na sucessão e perda de competitividade. Estatísticas mostram que 90% das empresas familiares não chegam à terceira geração, sendo a ausência de governança uma das principais causas."
  }];
  return <div className="min-h-screen bg-background">
      {/* Professional Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={legacyLogo} alt="Legacy" className="h-8 w-auto" />
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => navigate("/login")}>
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Corporate Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[length:60px_60px]" />
        <div className="relative container mx-auto px-6 py-32 lg:py-40">
          <div className="max-w-5xl mx-auto text-center text-white">
            
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight font-heading">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/80">Revolucione sua Governança</span> em 6 Semanas e Gere Vantagem Competitiva.
            </h1>
            
            <h2 className="text-2xl lg:text-3xl mb-10 text-white/90 leading-relaxed font-medium">
              6 semanas para implementar o que levava 9+ meses.
            </h2>
            
            <p className="text-xl mb-12 text-white/85 max-w-4xl mx-auto leading-relaxed">
              Empresas com governança estruturada têm valor <strong className="text-accent">47% maior</strong> no mercado. 
              Acelere essa valorização com nossa plataforma de IA e automação.
            </p>
            
            {/* Botões de Segmentação - Movidos para cá */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
              <Button size="lg" className="bg-accent text-primary hover:bg-accent/90 text-lg px-8 py-6 h-auto rounded-xl flex-1" onClick={() => window.location.href = '/empresas'}>
                <Building2 className="h-6 w-6 mr-3" />
                Sou Empresa
                <ArrowRight className="h-5 w-5 ml-3" />
              </Button>
              
              <Button size="lg" variant="outline" className="border-2 border-accent text-accent hover:bg-accent hover:text-primary text-lg px-8 py-6 h-auto rounded-xl flex-1" onClick={() => window.location.href = '/parceiros'}>
                <Scale className="h-6 w-6 mr-3" />
                Sou Banca Jurídica
                <ArrowRight className="h-5 w-5 ml-3" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Endorsement Section */}
      <section className="py-16 bg-background border-b">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Endossado por Líderes e Referências Globais em Governança Corporativa
            </h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Instituições e organizações que auditam, regulam e recomendam práticas de governança corporativa responsável e em conformidade.
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: false,
              }) as any,
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {endorsementInstitutions.map((institution, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                  <Card className="h-24 flex items-center justify-center hover:scale-105 hover:shadow-md transition-all duration-300 border-muted bg-card/50">
                    <CardContent className="p-4">
                      <p className="text-sm font-medium text-center text-foreground leading-tight">
                        {institution}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* Diagnóstico Gratuito Section */}
      <section className="py-28 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 bg-accent/10 text-accent border-accent/20 text-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              Diagnóstico Gratuito
            </Badge>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-primary leading-tight">
              Descubra o Nível de <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/80">Maturidade da sua Governança</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Em apenas <strong>10 minutos</strong>, obtenha um diagnóstico completo baseado na metodologia IBGC. 
              Empresas com governança estruturada <strong className="text-accent">têm valor 47% maior no mercado</strong>.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="border-accent/20 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gauge className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Análise Completa</h3>
                  <p className="text-muted-foreground text-sm">Avaliação de 5 dimensões baseada no IBGC com insights personalizados</p>
                </CardContent>
              </Card>
              
              <Card className="border-accent/20 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Benchmark de Mercado</h3>
                  <p className="text-muted-foreground text-sm">Compare sua empresa com padrões do setor e melhores práticas</p>
                </CardContent>
              </Card>
              
              <Card className="border-accent/20 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Relatório Executivo</h3>
                  <p className="text-muted-foreground text-sm">Documento profissional com recomendações e próximos passos</p>
                </CardContent>
              </Card>
            </div>

            {/* Diagnostic Button */}
            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate('/standalone-quiz')}
              >
                <Play className="h-5 w-5 mr-2" />
                Fazer Diagnóstico Gratuito
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Market Opportunity - Redesigned */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center mb-20">
            <Badge className="mb-8 bg-primary/10 text-primary border-primary/20">
              <Target className="h-3 w-3 mr-1" />
              Oportunidade de Mercado
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 font-heading">
              O Desafio da <span className="text-accent">Governança das Empresas Brasileiras</span>
            </h2>
            <div className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto space-y-4">
              <p>
                O Brasil conta com mais de 1 milhão de empresas familiares, responsáveis por grande parte da geração de empregos e riqueza no país. Apesar de sua relevância, 90% delas não ultrapassam a 3ª geração, principalmente pela ausência de práticas de governança estruturada.
              </p>
              <p>
                Esse cenário representa um mercado estimado em <strong className="text-accent">R$ 7,4 bilhões anuais</strong>, que demanda soluções consistentes em gestão, governança e tecnologia.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <Card className="text-center p-10 border-2 hover:border-accent/30 hover:shadow-xl transition-all duration-300 bg-gradient-to-b from-white to-secondary/30">
              <CardContent className="pt-6">
                <div className="text-5xl font-bold text-primary mb-4 font-heading">R$ 7,4Bi</div>
                <div className="text-xl font-semibold mb-3 text-accent">Mercado Potencial</div>
                <div className="text-muted-foreground leading-relaxed">Mercado potencial anual em governança de empresas familiares</div>
              </CardContent>
            </Card>
            
            <Card className="text-center p-10 border-2 hover:border-accent/30 hover:shadow-xl transition-all duration-300 bg-gradient-to-b from-white to-secondary/30">
              <CardContent className="pt-6">
                <div className="text-5xl font-bold text-primary mb-4 font-heading">1M+</div>
                <div className="text-xl font-semibold mb-3 text-accent">Empresas Familiares</div>
                <div className="text-muted-foreground leading-relaxed">Empresas familiares que necessitam de estruturação</div>
              </CardContent>
            </Card>
            
            <Card className="text-center p-10 border-2 hover:border-accent/30 hover:shadow-xl transition-all duration-300 bg-gradient-to-b from-white to-secondary/30">
              <CardContent className="pt-6">
                <div className="text-5xl font-bold text-primary mb-4 font-heading">90%</div>
                <div className="text-xl font-semibold mb-3 text-accent">Não Perpetuam</div>
                <div className="text-muted-foreground leading-relaxed">Não chegam à 3ª geração por ausência de governança</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Success Cases */}
      <section id="casos" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6">
                <Award className="h-3 w-3 mr-1" />
                Casos de Sucesso
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Resultados <span className="text-primary">Comprovados</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Conheça empresas que digitalizaram a governança
              </p>
            </div>
            
            {/* Success Cases Bullets */}
            <div className="space-y-4">
              {successCases.map((case_, index) => (
                <Collapsible 
                  key={index}
                  open={expandedCase === index}
                  onOpenChange={() => setExpandedCase(expandedCase === index ? null : index)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`w-full p-6 h-auto justify-between border-2 rounded-lg transition-all duration-300 hover:border-primary/30 hover:shadow-md ${
                        expandedCase === index 
                          ? 'border-primary/50 bg-primary/5' 
                          : 'border-border bg-card hover:bg-accent/5'
                      }`}
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-foreground">{case_.company}</h3>
                            <Badge variant="secondary" className="flex-shrink-0">{case_.industry}</Badge>
                          </div>
                          <div className="text-sm font-medium text-primary">{case_.result}</div>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                          expandedCase === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="mt-2">
                    <Card className="border-l-4 border-l-primary ml-6">
                      <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                              DESAFIO
                            </div>
                            <div className="text-sm text-foreground leading-relaxed">
                              {case_.challenge}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                              SOLUÇÃO
                            </div>
                            <div className="text-sm text-foreground leading-relaxed">
                              {case_.solution}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                              MÉTRICAS
                            </div>
                            <div className="text-sm font-semibold text-primary leading-relaxed">
                              {case_.metrics}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* CTA Form */}
      <section id="contato" className="py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 text-white">
              <Badge className="mb-6 bg-white/10 text-white border-white/20">
                <Shield className="h-3 w-3 mr-1" />
                Comece Sua Parceria
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Seja o Futuro da Governança Corporativa. <br />
                <span className="text-accent">Não Apenas um Espectador.</span>
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Preencha o formulário e nosso Head de Parcerias entrará em contato 
                para desenhar um plano exclusivo para sua banca.
              </p>
            </div>
            
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Seu nome completo" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail Corporativo *</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="seu@escritorio.com.br" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firm">Nome da Banca *</Label>
                      <Input id="firm" name="firm" value={formData.firm} onChange={handleInputChange} required placeholder="Nome do escritório" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="(11) 99999-9999" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Conte-nos sobre sua banca</Label>
                    <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Tamanho da equipe, principais clientes, experiência em governança..." rows={3} />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">
                    <Phone className="h-5 w-5 mr-2" />
                    QUERO SER UM PARCEIRO ESTRATÉGICO
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    Ao enviar, você receberá uma <strong>análise de potencial de receita</strong> para sua carteira de clientes.
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6">
                <Target className="h-3 w-3 mr-1" />
                Dúvidas Frequentes
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Tire suas <span className="text-primary">Dúvidas</span>
              </h2>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg">
                  <AccordionTrigger className="text-left font-semibold text-lg px-6 py-4 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed px-6 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <img src={legacyLogo} alt="Legacy" className="h-8 w-auto" />
                <p className="text-sm text-muted-foreground">
                  Plataforma completa de governança para empresas de controle concentrado.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Soluções</h4>
                <div className="space-y-2 text-sm">
                  <div>Governança Corporativa</div>
                  <div>Estrutura Societária</div>
                  <div>Planejamento Sucessório</div>
                  <div>Gestão de Riscos</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Parcerias</h4>
                <div className="space-y-2 text-sm">
                  <div>Bancas Jurídicas</div>
                  <div>Consultorias</div>
                  <div>Family Offices</div>
                  <div>Auditorias</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Contato</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>parcerias@legacy.com.br</div>
                  <div>+55 (11) 9999-9999</div>
                  <div>São Paulo, SP</div>
                </div>
              </div>
            </div>
            
            <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2024 Legacy. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
};
export default Index;