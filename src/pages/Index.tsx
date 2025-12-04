import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Play, Building2, TrendingUp, Target, Award, CheckCircle, ArrowRight, Star, 
  Zap, Shield, Brain, Phone, Calendar, Rocket, Sparkles, FileText, BarChart, 
  Gauge, Mail, Lock, Building, ChevronDown, Crown, Users, MessageSquare, 
  FileSearch, Eye, ShieldCheck, Fingerprint, Lightbulb, Clock, Cpu, Search,
  Globe, AlertTriangle, LineChart, Bot
} from "lucide-react";
import DiagnosticModal from "@/components/DiagnosticModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import legacyLogo from "@/assets/legacy-logo-new.png";

const Index = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    role: ""
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Solicitação enviada! Entraremos em contato em até 24h.");
    setFormData({
      name: "",
      email: "",
      organization: "",
      phone: "",
      role: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleWhatsAppDemo = () => {
    window.open("https://wa.me/5547991622220?text=Olá! Gostaria de solicitar uma demonstração personalizada da Legacy.", "_blank");
  };

  // Instituições de autoridade
  const authorityInstitutions = [
    { name: "IBGC", description: "Instituto Brasileiro de Governança Corporativa" },
    { name: "CVM", description: "Comissão de Valores Mobiliários" },
    { name: "B3 Novo Mercado", description: "Mais alto nível de governança" },
    { name: "ISO 37000", description: "Padrão internacional de governança" }
  ];

  // Tripé Legacy - 3 Pilares
  const legacyPillars = [
    {
      icon: Zap,
      title: "Automação e Velocidade",
      subtitle: "Governança Operando no Ritmo do Negócio",
      description: "Elimine fricções: reuniões, pautas, materiais, ATAs, registros, assinaturas e delegações em um fluxo único, padronizado e auditável.",
      highlight: "De minutos para segundos",
      modules: ["Secretariado Digital", "Agenda Anual de Governança", "ATAs e Assinaturas", "Gestão de Tarefas e Pautas"],
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500"
    },
    {
      icon: Users,
      title: "Liderança, Performance e Accountability",
      subtitle: "Governança de Pessoas Conectada à Estratégia",
      description: "Mapeie responsáveis, atribuições, comitês e metas estratégicas. Acompanhe evolução de lideranças com indicadores claros.",
      highlight: "Ciclos de avaliação integrados",
      modules: ["Desenvolvimento & PDI", "Comitês e Responsabilidades", "Métricas de Entrega", "Cultura & Rituais Corporativos"],
      color: "from-emerald-500 to-green-500",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500"
    },
    {
      icon: Brain,
      title: "Inteligência e Decisão Contínua",
      subtitle: "IA para Decisão, Não Só para Organização",
      description: "Dashboards vivos e análises acionáveis: riscos, ESG, maturidade, benchmarking e mercado. A IA orienta a decisão, não apenas informa.",
      highlight: "Governança preditiva",
      modules: ["Gestão de Riscos e Auditoria", "Maturidade ESG e Governança", "Inteligência de Mercado", "Agentes de IA para Decisão"],
      color: "from-purple-500 to-violet-500",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500"
    }
  ];

  // Legacy AI Highlights
  const aiHighlights = [
    {
      icon: FileSearch,
      title: "Análise Executiva de Documentos",
      description: "Contrato, política, regimento, minuta ou compliance: suba o arquivo e receba resumo executivo orientado à decisão, lista de riscos, pendências e recomendações de mitigação.",
      benefit: "Sem ruído, sem leitura manual exaustiva"
    },
    {
      icon: Globe,
      title: "Inteligência de Mercado e Cenários",
      badge: "Premium",
      description: "Configure setor, geografia, concorrência e tendências. A IA entrega em tempo real: Matriz Ameaças x Oportunidades, movimentos competitivos e alertas regulatórios.",
      benefit: "Governança antecipatória, não retroativa"
    },
    {
      icon: MessageSquare,
      title: "Busca Conversacional Estratégica",
      description: "Pergunte como fala com seu conselho: 'Mostre decisões críticas sobre cybersecurity nos últimos 18 meses.' A IA encontra, cruza, interpreta e exibe ATAs, deliberações, políticas e mais.",
      benefit: "Transforme acervo em inteligência"
    }
  ];

  // Security Highlights
  const securityHighlights = [
    {
      icon: Eye,
      title: "Auditoria e Rastreabilidade Total",
      description: "Registro imutável, detalhado e cronológico de toda ação: login, permissões, pautas, ATAs, votos, assinaturas, alterações e anexos.",
      highlight: "Cada decisão é passível de prova e validação"
    },
    {
      icon: ShieldCheck,
      title: "Conformidade ESG e Regulatória",
      description: "Maturidade ESG integrada com avaliações, indicadores e relatórios alinhados a frameworks regulatórios. KPIs auditáveis e exportáveis.",
      highlight: "Governança preparada para supervisão"
    },
    {
      icon: Fingerprint,
      title: "Acesso Seguro e Controles de Identidade",
      description: "2FA, tokens de sessão, magic links seguros, perfis de acesso granular por órgão, pauta e documento. Confidencialidade rastreável.",
      highlight: "Proteção não é barreira — é protocolo"
    }
  ];

  const faqData = [
    {
      question: "O que é governança corporativa?",
      answer: "Governança corporativa é o conjunto de práticas, políticas e estruturas que orientam a gestão e o controle de uma empresa. Para empresas familiares, envolve a criação de órgãos de governança, definição de papéis e responsabilidades, e estabelecimento de processos decisórios transparentes que garantem a continuidade e o crescimento sustentável do negócio."
    },
    {
      question: "Como a Legacy pode ajudar minha empresa?",
      answer: "A Legacy oferece uma plataforma tecnológica completa que digitaliza e organiza todos os aspectos da governança empresarial. Através de diagnósticos automatizados, relatórios executivos, gestão de conselhos e monitoramento contínuo, ajudamos sua empresa a estruturar processos, reduzir riscos e preparar-se para o futuro."
    },
    {
      question: "Qual o tempo necessário para estruturar a governança?",
      answer: "Com a Legacy, o processo de estruturação que tipicamente levava 9+ meses agora pode ser implementado em apenas 6 semanas. Começamos com um diagnóstico gratuito que identifica as principais necessidades, seguido de um plano personalizado com marcos e prazos específicos para sua realidade."
    },
    {
      question: "A plataforma atende empresas de todos os portes?",
      answer: "Sim! Nossa solução é escalável e atende desde startups e empresas familiares de médio porte até grandes corporações e companhias listadas. A plataforma se adapta à complexidade e necessidades específicas de cada organização."
    },
    {
      question: "Como garantir a continuidade da empresa familiar?",
      answer: "A continuidade requer planejamento sucessório estruturado, preparação das próximas gerações, definição clara de valores familiares e criação de órgãos de governança eficazes. Nossa plataforma oferece ferramentas específicas para gestão sucessória, desenvolvimento de herdeiros e monitoramento da evolução da maturidade da governança."
    },
    {
      question: "Quais são os principais riscos de não ter governança?",
      answer: "Empresas sem governança estruturada enfrentam riscos como conflitos familiares, decisões centralizadas inadequadas, falta de transparência, dificuldades na sucessão e perda de competitividade. Estatísticas mostram que 90% das empresas familiares não chegam à terceira geração, sendo a ausência de governança uma das principais causas."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
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

      {/* HERO Section - High Conversion */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[length:60px_60px]" />
        <div className="relative container mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-5xl mx-auto text-center text-white">
            <Badge className="mb-6 bg-accent/20 text-accent border-accent/30 text-sm px-4 py-1">
              <Sparkles className="h-3 w-3 mr-2" />
              Sistema Operacional de Governança
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight font-heading">
              Revolucione a Governança Familiar em{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/80">6 Semanas</span>{" "}
              e Garanta a Perpetuidade do Seu Legado.
            </h1>
            
            <p className="text-xl lg:text-2xl mb-8 text-white/90 leading-relaxed max-w-4xl mx-auto">
              Implemente em 6 semanas o que levava 9+ meses. Acelere a valorização do seu negócio com a{" "}
              <strong className="text-accent">única plataforma que une Governança Corporativa, Sucessão e IA Preditiva.</strong>
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
              <Button 
                size="lg" 
                className="bg-accent text-primary hover:bg-accent/90 text-lg px-8 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate('/standalone-quiz')}
              >
                <Play className="h-5 w-5 mr-2" />
                Fazer Diagnóstico Gratuito
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 h-auto rounded-xl"
                onClick={handleWhatsAppDemo}
              >
                <Phone className="h-5 w-5 mr-2" />
                Solicitar Demonstração
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Authority Section */}
      <section className="py-20 bg-background border-b">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                A Governança que Gera{" "}
                <span className="text-accent">47% Mais Valor</span> de Mercado.
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Empresas com governança estruturada alcançam um valor de mercado 47% superior. 
                A Legacy transforma a complexidade regulatória em vantagem competitiva. 
                Nossa metodologia é endossada e alinhada com as melhores práticas de:
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {authorityInstitutions.map((institution, index) => (
                <Card key={index} className="text-center p-6 border-2 hover:border-accent/30 hover:shadow-lg transition-all duration-300 bg-card">
                  <CardContent className="p-0">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-1">{institution.name}</h3>
                    <p className="text-xs text-muted-foreground">{institution.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-24 bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                <Target className="h-3 w-3 mr-1" />
                O Desafio
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
                O Desafio da Governança Moderna: Por que a maioria das empresas{" "}
                <span className="text-primary">não sustenta crescimento</span> e alinhamento estratégico?
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Problem */}
              <Card className="border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">A Fragmentação</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    A fragmentação entre estratégia, execução, reuniões, responsabilidades, maturidade de riscos, 
                    compliance, ESG e desenvolvimento de lideranças impede a escalabilidade real das organizações.
                  </p>
                  <ul className="space-y-3">
                    {["Decisões dispersas em e-mails", "Governança manual e reativa", "Sem rastreabilidade de deliberações", "Compliance desconectado da estratégia"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-destructive rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Solution */}
              <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">A Solução Legacy</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    A Legacy centraliza governança, decisões, rituais corporativos, métricas de maturidade e 
                    accountability em um único <strong className="text-accent">Sistema Operacional de Governança</strong>.
                  </p>
                  <ul className="space-y-3">
                    {["Integrada", "Contínua", "Mensurada", "Preditiva"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        Governança {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <p className="text-center text-muted-foreground mt-12 text-lg max-w-3xl mx-auto">
              Não importa se a empresa é early-stage, de médio porte ou global: a evolução da governança precisa 
              deixar de ser <span className="line-through">manual, dispersa e reativa</span> — e passar a ser{" "}
              <strong className="text-accent">integrada, contínua e mensurada</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Legacy Tripod Section - 3 Pillars */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
                <Sparkles className="h-3 w-3 mr-1" />
                O Tripé Legacy
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                Três Pilares que Transformam a Governança
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                A Legacy não digitaliza apenas a governança — ela acelera, mensura e aprimora decisões no tempo real da estratégia.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {legacyPillars.map((pillar, index) => (
                <Card key={index} className="relative overflow-hidden border-2 hover:border-accent/30 hover:shadow-xl transition-all duration-300 group">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${pillar.color}`} />
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl ${pillar.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <pillar.icon className={`h-6 w-6 ${pillar.iconColor}`} />
                      </div>
                      <Badge variant="secondary" className="text-xs">{pillar.highlight}</Badge>
                    </div>
                    <CardTitle className="text-xl mb-1">{pillar.title}</CardTitle>
                    <p className="text-sm font-medium text-accent">{pillar.subtitle}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                      {pillar.description}
                    </p>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Módulos de Suporte:</p>
                      {pillar.modules.map((module, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className={`h-3.5 w-3.5 ${pillar.iconColor}`} />
                          <span>{module}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Legacy AI Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                <Bot className="h-3 w-3 mr-1" />
                Legacy AI
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                A Inteligência Artificial que Eleva a Governança ao{" "}
                <span className="text-accent">Nível Estratégico</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Legacy AI não é apenas um motor de busca ou sumarização: é uma <strong>camada de raciocínio institucional</strong>, 
                interpretando contexto, histórico, riscos, metas, indicadores e pautas para sugerir caminhos, 
                priorizar decisões e antecipar impactos.
              </p>
            </div>

            {/* AI Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {aiHighlights.map((highlight, index) => (
                <Card key={index} className="relative border-2 hover:border-primary/30 hover:shadow-xl transition-all duration-300 bg-card">
                  {highlight.badge && (
                    <Badge className="absolute -top-2 right-4 bg-accent text-primary-foreground text-xs">
                      {highlight.badge}
                    </Badge>
                  )}
                  <CardHeader>
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <highlight.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{highlight.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {highlight.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-accent">
                      <Sparkles className="h-4 w-4" />
                      {highlight.benefit}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Message */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-8 text-center">
                <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground max-w-3xl mx-auto">
                  "A Legacy AI não substitui o Conselho. Ela <strong className="text-accent">amplifica a capacidade de pensar, 
                  priorizar e decidir</strong> com rigor, velocidade e visão de futuro."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                <Shield className="h-3 w-3 mr-1" />
                Segurança e Compliance
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                Segurança, Rastreabilidade e Compliance:{" "}
                <span className="text-emerald-600">O Padrão Legacy</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Governança exige confiança, integridade e blindagem institucional. 
                A Legacy opera com infraestrutura de segurança corporativa, trilhas completas de auditoria e conformidade regulatória.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {securityHighlights.map((highlight, index) => (
                <Card key={index} className="border-2 hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                      <highlight.icon className="h-7 w-7 text-emerald-600" />
                    </div>
                    <CardTitle className="text-lg">{highlight.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {highlight.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                      {highlight.highlight}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Security Authority Message */}
            <div className="text-center p-8 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
              <Lock className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground">
                Segurança não é promessa. É arquitetura, auditoria e governança aplicada de ponta a ponta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section id="planos" className="py-24 bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
              <Star className="h-3 w-3 mr-1" />
              Planos Legacy
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
              Planos criados para cada etapa da{" "}
              <span className="text-accent">governança</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A Legacy evolui junto com a sua empresa. Cada plano foi desenvolvido para refletir o nível de complexidade, 
              responsabilidade e maturidade exigido conforme o tamanho e o estágio de desenvolvimento do negócio.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Startup */}
            <Card className="relative flex flex-col border-border/50 bg-gradient-to-br from-card to-blue-500/5 hover:border-blue-500/30 hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Rocket className="h-5 w-5 text-blue-500" />
                  </div>
                  <CardTitle className="text-xl">Startup</CardTitle>
                </div>
                <Badge variant="outline" className="w-fit text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">
                  até R$ 4,8 milhões/ano
                </Badge>
                <p className="text-sm text-muted-foreground mt-3">
                  Para negócios em estágio inicial e investidas que precisam estruturar sua governança desde cedo.
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">R$ 2.990</span>
                  <span className="text-muted-foreground"> / mês</span>
                </div>
                <ul className="space-y-3 mb-6 flex-1">
                  {["Dashboard principal", "Atas e reuniões com assinatura eletrônica", "Checklist documental básico", "Agenda simples", "Estrutura societária inicial", "Biblioteca de documentos"].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}>
                  Assinar Agora
                </Button>
              </CardContent>
            </Card>

            {/* Pequena Empresa */}
            <Card className="relative flex flex-col border-border/50 bg-gradient-to-br from-card to-green-500/5 hover:border-green-500/30 hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Building className="h-5 w-5 text-green-500" />
                  </div>
                  <CardTitle className="text-xl">Pequena Empresa</CardTitle>
                </div>
                <Badge variant="outline" className="w-fit text-xs bg-green-500/10 text-green-600 border-green-500/20">
                  R$ 4,8M a R$ 30M/ano
                </Badge>
                <p className="text-sm text-muted-foreground mt-3">
                  Para empresas que já iniciaram a formalização e precisam ganhar estrutura e controle.
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">R$ 4.990</span>
                  <span className="text-muted-foreground"> / mês</span>
                </div>
                <p className="text-xs font-medium text-green-600 mb-3">Inclui tudo do Startup, mais:</p>
                <ul className="space-y-3 mb-6 flex-1">
                  {["Estrutura societária completa", "Maturidade de governança", "Checklist com IA", "Biblioteca com análise automática", "Agenda anual completa"].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}>
                  Assinar Agora
                </Button>
              </CardContent>
            </Card>

            {/* Média Empresa - Highlighted */}
            <Card className="relative flex flex-col border-2 border-accent bg-gradient-to-br from-card to-accent/10 hover:shadow-2xl transition-all duration-300 scale-[1.02]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-accent text-primary-foreground shadow-lg">
                  <Star className="h-3 w-3 mr-1" />
                  Mais Popular
                </Badge>
              </div>
              <CardHeader className="pb-4 pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Média Empresa</CardTitle>
                </div>
                <Badge variant="outline" className="w-fit text-xs bg-accent/10 text-accent border-accent/30">
                  R$ 30M a R$ 300M/ano
                </Badge>
                <p className="text-sm text-muted-foreground mt-3">
                  Para empresas em profissionalização acelerada com conselhos ou múltiplos órgãos.
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">R$ 9.900</span>
                  <span className="text-muted-foreground"> / mês</span>
                </div>
                <p className="text-xs font-medium text-accent mb-3">Inclui tudo do Pequena, mais:</p>
                <ul className="space-y-3 mb-6 flex-1">
                  {["Entrevistas estruturadas", "Relatório executivo do diagnóstico", "Configuração completa de conselhos", "Painel de secretariado", "Submissão e análise de projetos"].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-accent hover:bg-accent/90 text-primary-foreground" onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}>
                  Assinar Agora
                </Button>
              </CardContent>
            </Card>

            {/* Grande Empresa */}
            <Card className="relative flex flex-col border-border/50 bg-gradient-to-br from-card to-purple-500/5 hover:border-purple-500/30 hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-500" />
                  </div>
                  <CardTitle className="text-xl">Grande Empresa</CardTitle>
                </div>
                <Badge variant="outline" className="w-fit text-xs bg-purple-500/10 text-purple-600 border-purple-500/20">
                  R$ 300M a R$ 4,8B/ano
                </Badge>
                <p className="text-sm text-muted-foreground mt-3">
                  Para empresas com governança madura, sucessão ativa e múltiplas camadas executivas.
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">R$ 19.900</span>
                  <span className="text-muted-foreground"> / mês</span>
                </div>
                <p className="text-xs font-medium text-purple-600 mb-3">Inclui tudo do Média, mais:</p>
                <ul className="space-y-3 mb-6 flex-1">
                  {["Gestão de Pessoas em Governança", "Sucessores e posições-chave", "PDI e trilhas", "Gestão de riscos completa", "ESG básico", "Logs avançados"].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white" onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}>
                  Assinar Agora
                </Button>
              </CardContent>
            </Card>

            {/* Empresa Listada */}
            <Card className="relative flex flex-col border-border/50 bg-gradient-to-br from-card to-primary/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Crown className="h-3 w-3 mr-1" />
                  Enterprise
                </Badge>
              </div>
              <CardHeader className="pb-4 pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Empresa Listada</CardTitle>
                </div>
                <Badge variant="outline" className="w-fit text-xs bg-primary/10 text-primary border-primary/20">
                  acima de R$ 4,8B/ano
                </Badge>
                <p className="text-sm text-muted-foreground mt-3">
                  Para companhias abertas e grupos multissocietários de grande escala.
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">A partir de</span>
                  <br />
                  <span className="text-4xl font-bold text-foreground">R$ 39.900</span>
                  <span className="text-muted-foreground"> / mês</span>
                </div>
                <p className="text-xs font-medium text-primary mb-3">Inclui tudo do Grande, mais:</p>
                <ul className="space-y-3 mb-6 flex-1">
                  {["ESG avançado (CVM 193)", "Inteligência de Mercado completa", "Agentes de IA especializados", "Multi-CNPJ / multi-empresa", "Auditoria corporativa", "Governança multinível"].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}>
                  Fale Conosco
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Form Section */}
      <section id="contato" className="py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 text-white">
              <Badge className="mb-6 bg-white/10 text-white border-white/20">
                <Calendar className="h-3 w-3 mr-1" />
                Demonstração Executiva
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Governança que Escala com o{" "}
                <span className="text-accent">Ritmo da Sua Estratégia.</span>
              </h2>
              <p className="text-xl text-white/90 mb-4 leading-relaxed max-w-3xl mx-auto">
                Sua organização não pode operar decisões críticas com planilhas, e-mails dispersos e rastreabilidade limitada. 
                A Legacy consolida governança, riscos, ESG, liderança e deliberações em uma única estrutura digital.
              </p>
              <p className="text-lg text-white/70">
                Implementada em semanas, não em anos.
              </p>
            </div>
            
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Seu nome completo" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail Corporativo *</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="seu@empresa.com.br" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organização *</Label>
                      <Input 
                        id="organization" 
                        name="organization" 
                        value={formData.organization} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Nome da empresa" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone / WhatsApp *</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        required
                        placeholder="(11) 99999-9999" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Cargo / Função (opcional)</Label>
                    <Input 
                      id="role" 
                      name="role" 
                      value={formData.role} 
                      onChange={handleInputChange} 
                      placeholder="Ex: CEO, CFO, Diretor de Governança..." 
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-primary-foreground text-lg py-6">
                    <Mail className="h-5 w-5 mr-2" />
                    SOLICITAR DEMONSTRAÇÃO EXECUTIVA
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <strong>Implementação guiada</strong>, onboarding assistido e trilha de governança ativada em até 6 semanas.
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
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
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg">
                  <AccordionTrigger className="text-left font-semibold text-lg px-6 py-4 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed px-6 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <img src={legacyLogo} alt="Legacy" className="h-8 w-auto" />
                <p className="text-sm text-muted-foreground">
                  Sistema Operacional de Governança para empresas de controle concentrado.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Soluções</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>Governança Corporativa</div>
                  <div>Estrutura Societária</div>
                  <div>Planejamento Sucessório</div>
                  <div>Gestão de Riscos</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Parcerias</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>Bancas Jurídicas</div>
                  <div>Consultorias</div>
                  <div>Family Offices</div>
                  <div>Auditorias</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Contato</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>contato@governancalegacy.com</div>
                  <div>+55 (47) 99162-2220</div>
                  <div className="leading-relaxed">
                    Av. Brig. Faria Lima, 1811. ESC 1119<br />
                    Jardim Paulistano, São Paulo - SP<br />
                    01452-001, Brasil
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2025 Legacy. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
