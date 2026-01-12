import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Play, ArrowRight, CheckCircle, Clock, Zap, Shield, Brain, 
  Phone, Calendar, Sparkles, BarChart, Mail, Lock, Users, 
  FileText, Smartphone, Plug, Leaf, Target, X, ChevronDown,
  AlertCircle, Infinity, Eye
} from "lucide-react";
import { MegaFooter } from "@/components/footer";
import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { LGPDConsentBanner } from "@/components/LGPDConsentBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const [showCalculation, setShowCalculation] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Solicitação enviada! Entraremos em contato em até 24h.");
    setFormData({ name: "", email: "", organization: "", phone: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Pain Points Data
  const painPoints = [
    {
      title: "Conselheiros Ignoram Sua Ferramenta Atual?",
      description: "Interface complexa, acesso complicado, zero assistência inteligente. Resultado: voltam ao email e WhatsApp. Investimento desperdiçado.",
      solution: "Legacy: Apps iOS/Android + IA que entrega contexto pronto."
    },
    {
      title: "Perdendo 8h Preparando Cada Reunião?",
      description: "Coletar atas antigas, ler relatórios financeiros, escrever pauta do zero, criar briefings individuais. Manual, cansativo, propenso a erros.",
      solution: "Legacy: Pauta + briefings prontos em 30 min com IA."
    },
    {
      title: "Usando 5 Ferramentas Sem Integração?",
      description: "Board portal + Excel de riscos + consultoria ESG + email + BI externo. Informação dispersa, zero visão 360°, decisões lentas.",
      solution: "Legacy: Reuniões + ESG + Riscos + Projetos em 1 plataforma."
    },
    {
      title: "Relatórios ESG Atrasados ou Incompletos?",
      description: "CVM 193/2023 exige ESG estruturado. Você coleta dados manualmente, sem rastreabilidade, sem histórico, sem benchmarks.",
      solution: "Legacy: Framework GRI/SASB integrado + relatórios prontos."
    }
  ];

  // 3 Pillars Data
  const pillars = [
    {
    icon: Brain,
      title: "AI Engine CORE",
      description: "Não é bolt-on. IA no DNA da plataforma. Arquitetura proprietária monitora signals, analisa histórico, prioriza temas, gera pautas inteligentes.",
      features: ["IA nativa (não adicionada depois)", "85+ prompts otimizados", "-93% tempo preparação", "Aprende com seu conselho"],
      highlight: true,
      link: "/ai-engine",
      linkText: "Conhecer AI Engine CORE"
    },
    {
      icon: Infinity,
      title: "Governança Sem Limites Artificiais",
      description: "Inclua TODOS: sócios, conselheiros, diretoria, sucessores, advisors. Zero custo adicional por pessoa. Porque governança funciona melhor quando todo mundo está dentro.",
      features: ["Usuários ilimitados (todos os planos)", "Apps móveis nativos inclusos", "Convites externos sem cobrança", "Colaboração sem barreiras"],
      highlight: false,
      link: "/pricing",
      linkText: "Ver Planos"
    },
    {
      icon: Target,
      title: "Visão 360° Real",
      description: "Reuniões + ESG + Riscos + Projetos + Pessoas integrados nativamente. 1 ferramenta substitui 5. Zero fragmentação de dados. Decisões mais rápidas e informadas.",
      features: ["Ciclo completo de reuniões", "ESG & Sustentabilidade (CVM 193)", "Gestão de riscos avançada", "Projetos estratégicos integrados"],
      highlight: false,
      link: "/plataforma",
      linkText: "Explorar Plataforma"
    }
  ];

  // Core Features Data
  const coreFeatures = [
    { icon: FileText, title: "Pauta Inteligente em 30 Min", description: "IA monitora economia, regulação, setor e histórico do conselho. Gera pauta pronta com contexto, recomendações e perguntas-chave." },
    { icon: BarChart, title: "Atas Geradas Automaticamente", description: "Transcrição automática + sumário executivo + action items identificados. Pronto para assinatura eletrônica em minutos." },
    { icon: Leaf, title: "ESG Completo & Rastreável", description: "Framework GRI/SASB integrado. Tracking de KPIs, benchmarks setoriais, relatórios prontos para CVM 193/2023." },
    { icon: Shield, title: "Matriz de Riscos Automatizada", description: "Alertas inteligentes, simulação de cenários, planos de mitigação rastreáveis, compliance contínuo." },
    { icon: Smartphone, title: "Apps iOS & Android Nativos", description: "Conselheiros acessam tudo do celular. Sync offline, notificações push, experiência otimizada para mobile." },
    { icon: Plug, title: "Integrações Enterprise", description: "Microsoft 365, Google Workspace, Slack, Zoom, SAP. API robusta + SSO + webhooks." }
  ];

  // Security Badges Data
  const securityBadges = [
    { label: "CVM 193/2023", benefit: "Relatórios ESG compliant prontos para envio" },
    { label: "SOC 2 Type II", benefit: "Auditoria independente anual de segurança de dados" },
    { label: "ISO 27001", benefit: "Gestão de segurança da informação certificada" },
    { label: "LGPD Compliant", benefit: "100% adequado à Lei Geral de Proteção de Dados" },
    { label: "AWS Infrastructure", benefit: "Infraestrutura global com 99,99% uptime garantido" },
    { label: "GDPR Ready", benefit: "Preparado para operações internacionais" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MegaMenuHeader />

      {/* SEÇÃO 1: HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-5xl mx-auto text-center text-white">
            {/* Badge */}
            <Badge className="mb-6 bg-[#C0A062]/20 text-[#C0A062] border-[#C0A062]/30 px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Pautas de Conselho Prontas em 30 Minutos (Não 8 Horas)
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Pare de Perder 8 Horas<br />
              Preparando Cada Reunião de Conselho
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl lg:text-2xl mb-8 text-white/90 leading-relaxed max-w-4xl mx-auto">
              A única plataforma com <strong className="text-[#C0A062]">IA treinada em governança corporativa</strong>. 
              Monitora 20+ fontes (economia, regulação, setor), analisa histórico e gera 
              pautas completas automaticamente. 
              <strong className="text-[#C0A062]"> Validada por 50+ líderes de governança.</strong>
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-[#C0A062] text-primary hover:bg-[#C0A062]/90 text-lg px-8 py-6 h-auto rounded-xl"
                onClick={() => navigate('/standalone-quiz')}
              >
                <Play className="h-5 w-5 mr-2" />
                Fazer Diagnóstico Gratuito (5 min)
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto rounded-xl"
                onClick={() => navigate('/demo')}
              >
                <Eye className="h-5 w-5 mr-2" />
                Ver Como Funciona
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-[#C0A062]">-93%</div>
                <div className="text-sm text-white/70">Tempo de Preparação</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-[#C0A062]">50+</div>
                <div className="text-sm text-white/70">Validações Reais</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-[#C0A062]">13</div>
                <div className="text-sm text-white/70">Módulos Integrados</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: TRUSTED BY */}
      <section className="py-16 bg-muted/30 border-b">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Metodologia Validada por 50+ Líderes de Governança
            </h3>
            <p className="text-muted-foreground mb-8">
              Alinhada com frameworks IBGC, IBRI e melhores práticas globais de governança corporativa
            </p>

            {/* Logos */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              {["IBGC", "IBRI", "AMCHAM"].map((logo) => (
                <div key={logo} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">Metodologia {logo}</span>
                </div>
              ))}
            </div>

            {/* Early Stage Stats */}
            <div className="flex flex-wrap justify-center gap-12 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">3 conselhos</div>
                <div className="text-sm text-muted-foreground">Ativos desde jan/2026</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">47 pautas</div>
                <div className="text-sm text-muted-foreground">Geradas com IA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">12 reuniões</div>
                <div className="text-sm text-muted-foreground">Gerenciadas na plataforma</div>
              </div>
                    </div>

            {/* Transparency Note */}
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] border-l-4 border-[#C0A062] rounded-lg p-4 text-left">
              <p className="text-sm text-gray-800">
                <strong>Early Adopters:</strong> Estamos embarcando os primeiros conselhos agora. 
                Vagas limitadas para garantir suporte premium durante onboarding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: PAIN POINTS */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
              Você ainda está...
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {painPoints.map((pain, index) => (
                <Card key={index} className="border-2 hover:border-destructive/30 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center shrink-0">
                        <X className="h-5 w-5 text-destructive" />
            </div>
                      <h3 className="font-bold text-lg">{pain.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 ml-14">
                      {pain.description}
                    </p>
                    <div className="ml-14 flex items-center gap-2 text-sm font-medium text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                      {pain.solution}
                    </div>
                </CardContent>
              </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: 3 PILARES */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">A Solução: Legacy OS</h2>
              <p className="text-lg text-muted-foreground">
                A primeira plataforma all-in-one com IA nativa para governança corporativa
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {pillars.map((pillar, index) => (
                <Card 
                  key={index} 
                  className={`relative overflow-hidden transition-all hover:shadow-xl ${
                    pillar.highlight ? 'border-2 border-[#C0A062] bg-gradient-to-br from-[#C0A062]/5 to-transparent' : ''
                  }`}
                >
                  {pillar.highlight && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#C0A062]" />
                  )}
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <pillar.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
                    <p className="text-muted-foreground text-sm mb-6">{pillar.description}</p>
                    <ul className="space-y-2 mb-6">
                      {pillar.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-[#C0A062]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to={pillar.link} className="text-[#C0A062] font-medium text-sm hover:underline flex items-center gap-1">
                      {pillar.linkText} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5: AI ENGINE DEEP DIVE */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-white/10 text-white border-white/20">
                <Brain className="h-3 w-3 mr-1" />
                DIFERENCIAL ÚNICO
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                AI Engine CORE: O Cérebro da Legacy OS
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Não é IA "bolt-on" adicionada depois. É IA nativa, 
                construída no DNA da plataforma desde o dia 1.
              </p>
            </div>

            {/* Before/After */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Before */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-white/90">ANTES: Preparação Manual</h3>
                  <div className="text-4xl font-bold text-destructive mb-4">8 horas</div>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li>Ler atas das últimas 6 reuniões (2h)</li>
                    <li>Consolidar relatórios financeiros, ESG, projetos (3h)</li>
                    <li>Escrever pauta do zero (2h)</li>
                    <li>Criar briefings individuais por conselheiro (1h)</li>
                  </ul>
                </CardContent>
              </Card>

              {/* After */}
              <Card className="bg-[#C0A062]/20 border-[#C0A062]/30">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-white/90">DEPOIS: AI Engine CORE</h3>
                  <div className="text-4xl font-bold text-[#C0A062] mb-4">30 minutos</div>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li>IA lê histórico completo automaticamente (0h)</li>
                    <li>IA consolida 20+ fontes em dashboard único (0h)</li>
                    <li>IA gera 3 versões de pauta prontas para escolher (15 min)</li>
                    <li>IA cria briefings contextualizados automaticamente (15 min)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Savings Banner */}
            <div className="bg-[#C0A062] text-primary rounded-xl p-6 text-center mb-8">
              <div className="text-2xl font-bold mb-2">-93% TEMPO</div>
              <div className="text-sm mb-4">Economia estimada: R$ 180k/ano por conselho</div>
              
              <button 
                onClick={() => setShowCalculation(!showCalculation)}
                className="text-sm underline flex items-center gap-2 mx-auto hover:no-underline"
              >
                <BarChart className="h-4 w-4" />
                Base do cálculo
                <ChevronDown className={`h-4 w-4 transition-transform ${showCalculation ? 'rotate-180' : ''}`} />
              </button>
              
              {showCalculation && (
                <div className="mt-4 text-left bg-primary/10 rounded-lg p-4 text-sm">
                  <p className="mb-2"><strong>Premissas:</strong></p>
                  <ul className="list-disc list-inside space-y-1 mb-3">
                    <li>Secretário executivo: custo total R$ 2.000/h (salário + encargos + overhead)</li>
                    <li>Preparação manual: 8h por reunião</li>
                    <li>Frequência: 12 reuniões de conselho por ano (mensal)</li>
                  </ul>
                  <p className="mb-2"><strong>Cálculo:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Antes: 8h/reunião × 12 reuniões = 96h/ano</li>
                    <li>Depois (Legacy): 30 min/reunião × 12 = 6h/ano</li>
                    <li>Economia: 90h/ano × R$ 2.000/h = <strong>R$ 180.000/ano</strong></li>
                  </ul>
                </div>
              )}
            </div>

            {/* Architecture Features */}
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: Brain, title: "Monitoramento 24/7", desc: "20+ fontes (economia, política, regulatório, setor)" },
                { icon: BarChart, title: "Análise Histórico", desc: "Padrões, gaps, questões recorrentes identificadas" },
                { icon: Target, title: "Priorização Inteligente", desc: "Ranqueia temas por urgência, impacto, maturidade" },
                { icon: FileText, title: "Geração Automática", desc: "Pauta + briefings + contexto prontos para aprovação" }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <item.icon className="h-6 w-6 text-[#C0A062]" />
                    </div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-white/70">{item.desc}</p>
                    </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Button size="lg" className="bg-[#C0A062] text-primary hover:bg-[#C0A062]/90" asChild>
                <Link to="/ai-engine">Conhecer AI Engine CORE Completo</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/demo">Ver Demo ao Vivo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: FEATURES GRID */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                As 6 Funcionalidades Que Mais Importam
              </h2>
              <p className="text-lg text-muted-foreground">
                Núcleo da plataforma: o que você vai usar toda semana
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {coreFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-all hover:border-[#C0A062]/30">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" asChild>
                <Link to="/plataforma">
                  Ver Todas as 13 Funcionalidades Nativas
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                + 9 add-ons disponíveis (Inteligência de Mercado, Sucessão, People Analytics, etc.)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 7: COMPARAÇÃO */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Por Que Líderes de Governança Escolhem Legacy
              </h2>
              <p className="text-lg text-muted-foreground">
                Comparação lado a lado: Legacy OS vs soluções tradicionais
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Com Legacy */}
              <Card className="border-2 border-[#C0A062] bg-gradient-to-br from-[#C0A062]/5 to-transparent relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#C0A062] text-primary">RECOMENDADO</Badge>
                </div>
                <CardContent className="p-6 pt-8">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                    <div className="text-3xl">✅</div>
                    <h3 className="text-xl font-bold">Com Legacy OS</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      { title: "Pauta pronta em 30 min", desc: "IA analisa histórico e gera pauta completa" },
                      { title: "Usuários ilimitados (sempre)", desc: "Sócios, conselheiros, diretoria, advisors" },
                      { title: "IA nativa (não add-on)", desc: "Arquitetura construída com IA desde o dia 1" },
                      { title: "All-in-one real (13 módulos)", desc: "Reuniões + ESG + Riscos + Projetos + Pessoas" },
                      { title: "Pricing transparente público", desc: "Calculadora online, sem 'consulte-nos'" },
                      { title: "Diagnóstico gratuito (5 min)", desc: "Score de maturidade sem cartão de crédito" }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block">{item.title}</strong>
                          <span className="text-sm text-muted-foreground">{item.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Com Outros */}
              <Card className="border-2">
                <CardContent className="p-6 pt-8">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                    <div className="text-3xl">❌</div>
                    <h3 className="text-xl font-bold">Com Soluções Tradicionais</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      { title: "Preparação manual (8h+)", desc: "Coletar dados, escrever pauta do zero" },
                      { title: "Custo por usuário", desc: "R$ 300-800/mês por pessoa (50 users = R$ 480k/ano)" },
                      { title: "IA adicionada depois (bolt-on)", desc: "Feature lateral, não integrada ao núcleo" },
                      { title: "Múltiplas ferramentas desintegradas", desc: "Portal + Excel + consultoria ESG + email" },
                      { title: "Pricing sob consulta (opaco)", desc: "Processo de vendas longo, sem clareza de custo" },
                      { title: "Demo obrigatória antes de testar", desc: "Sem self-service, sem transparência" }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <strong className="block">{item.title}</strong>
                          <span className="text-sm text-muted-foreground">{item.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-[#FEF3C7] to-[#FBBF24] rounded-xl p-6">
                <div className="text-xl font-bold mb-2">6/6 Diferenciais Críticos</div>
                <p className="text-sm text-gray-700">Legacy OS entrega o que soluções tradicionais não conseguem ou não querem entregar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 8: VALIDAÇÃO */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Validada por 50+ Líderes de Governança
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Metodologia testada e refinada com especialistas do mercado. 
              Primeiros conselhos embarcando agora.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Validações Realizadas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">Conselhos Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">47</div>
                <div className="text-sm text-muted-foreground">Pautas Geradas com IA</div>
              </div>
                  </div>

            {/* Quote */}
            <Card className="bg-gradient-to-br from-primary/5 to-[#C0A062]/5 border-[#C0A062]/20">
              <CardContent className="p-8">
                <div className="text-5xl text-[#C0A062] mb-4">"</div>
                <p className="text-lg italic text-foreground mb-6">
                  Testamos a pauta gerada pela IA com nosso conselho. 
                  Identificou 3 riscos estratégicos que não estavam na nossa agenda original. 
                  Em 30 minutos, tínhamos material melhor do que preparávamos em 8 horas.
                </p>
                <div>
                  <strong className="block">Head de Governança</strong>
                  <span className="text-sm text-muted-foreground">Holding Familiar, R$ 280M faturamento anual</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SEÇÃO 9: SECURITY & COMPLIANCE */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Segurança Enterprise que Você Pode Confiar
              </h2>
              <p className="text-lg text-muted-foreground">
                Certificações, compliance e proteção de dados nível mundial
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
              {securityBadges.map((badge, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="font-semibold text-sm mb-1">{badge.label}</div>
                    <p className="text-xs text-muted-foreground">{badge.benefit}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Security Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-emerald-600" />
                  Proteção de Dados
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-600" /> Criptografia AES-256 (dados em repouso)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-600" /> TLS 1.3 (dados em trânsito)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-600" /> Backup diário automatizado (90 dias)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600" />
                  Autenticação
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-600" /> Autenticação 2FA + SSO</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-600" /> SAML, OAuth 2.0, OpenID Connect</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-600" /> Permissões granulares por usuário</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-emerald-600" />
                  Auditoria
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-600" /> Logs imutáveis (blockchain)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-600" /> Audit trail completo de todas ações</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-600" /> DRP {"<"} 4h (disaster recovery plan)</li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link to="/seguranca">Ver Trust Center Completo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 10: FINAL CTA */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Pronto para Transformar Sua Governança?
              </h2>
              <p className="text-xl text-white/80">
                Descubra como a Legacy OS pode reduzir 93% do tempo de preparação 
                e elevar a qualidade das decisões do seu conselho
              </p>
            </div>
            
            {/* Form */}
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
                        placeholder="Seu nome" 
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

                  <Button type="submit" size="lg" className="w-full bg-[#C0A062] hover:bg-[#C0A062]/90 text-primary text-lg py-6">
                    <Calendar className="h-5 w-5 mr-2" />
                    Agendar Demonstração
                  </Button>
                </form>

                {/* Features */}
                <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-[#C0A062]" /> Demo personalizada 30 min</span>
                  <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-[#C0A062]" /> Diagnóstico gratuito incluso</span>
                  <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-[#C0A062]" /> Suporte em português</span>
                </div>
              </CardContent>
            </Card>

            {/* Secondary CTA */}
            <div className="text-center mt-8">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/pricing">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Conhecer Planos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <MegaFooter />
      <LGPDConsentBanner />
              </div>
  );
};

export default Index;
