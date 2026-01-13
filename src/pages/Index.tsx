import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Play, ArrowRight, CheckCircle, Zap, Shield, Brain, 
  Calendar, BarChart, Lock, Users, 
  FileText, Plug, Leaf, Target, X, ChevronDown,
  Infinity, Eye, Award, ClipboardCheck, Search
} from "lucide-react";
import { MegaFooter } from "@/components/footer";
import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { LGPDConsentBanner } from "@/components/LGPDConsentBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
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
      solution: "Legacy: Plataforma intuitiva + IA que entrega contexto pronto."
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
      link: "/pricing",
      linkText: "Conhecer AI Engine CORE"
    },
    {
      icon: Infinity,
      title: "Governança Sem Limites Artificiais",
      description: "Inclua TODOS: sócios, conselheiros, diretoria, sucessores, advisors. Zero custo adicional por pessoa. Porque governança funciona melhor quando todo mundo está dentro.",
      features: ["Usuários ilimitados (todos os planos)", "Acesso web responsivo", "Convites externos sem cobrança", "Colaboração sem barreiras"],
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

  // Core Features Data - Removido Apps iOS/Android, adicionado Busca Inteligente
  const coreFeatures = [
    { icon: FileText, title: "Pauta Inteligente em 30 Min", description: "IA monitora economia, regulação, setor e histórico do conselho. Gera pauta pronta com contexto, recomendações e perguntas-chave." },
    { icon: ClipboardCheck, title: "Atas Geradas Automaticamente", description: "Transcrição automática + sumário executivo + action items identificados. Pronto para assinatura eletrônica em minutos." },
    { icon: Leaf, title: "ESG Completo & Rastreável", description: "Framework GRI/SASB integrado. Tracking de KPIs, benchmarks setoriais, relatórios prontos para CVM 193/2023." },
    { icon: Shield, title: "Matriz de Riscos Automatizada", description: "Alertas inteligentes, simulação de cenários, planos de mitigação rastreáveis, compliance contínuo." },
    { icon: Search, title: "Busca Inteligente por IA", description: "Encontre qualquer decisão, ata ou documento em segundos. A IA entende contexto e traz resultados relevantes." },
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
      <section className="relative overflow-hidden bg-gradient-hero pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(192,160,98,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-5xl mx-auto text-center text-white">
            {/* Headline */}
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Pare de Perder 8 Horas<br />
              Preparando Cada Reunião de Conselho
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl lg:text-2xl mb-8 text-white/80 leading-relaxed max-w-4xl mx-auto">
              A única plataforma com <strong className="text-accent">IA treinada em governança corporativa</strong>. 
              Monitora 20+ fontes (economia, regulação, setor), analisa histórico e gera 
              pautas completas automaticamente. 
              <strong className="text-accent"> Validada por 50+ líderes de governança.</strong>
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-accent text-primary hover:bg-accent/90 text-lg px-8 py-3 h-12 rounded-lg font-semibold"
                onClick={() => navigate('/standalone-quiz')}
              >
                <Play className="h-5 w-5 mr-2" />
                Fazer Diagnóstico Gratuito (5 min)
              </Button>
              <Button 
                size="lg" 
                className="bg-transparent border-2 border-accent text-accent hover:bg-accent/10 text-lg px-8 py-3 h-12 rounded-lg font-semibold"
                onClick={() => navigate('/como-funciona')}
              >
                <Eye className="h-5 w-5 mr-2" />
                Ver Como Funciona
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-accent">-93%</div>
                <div className="text-sm text-white/60">Tempo de Preparação</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-accent">50+</div>
                <div className="text-sm text-white/60">Validações Reais</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-accent">13</div>
                <div className="text-sm text-white/60">Módulos Integrados</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: TRUSTED BY */}
      <section className="py-16 bg-corporate-mid border-b border-border/20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              Metodologia Validada por 50+ Líderes de Governança
            </h3>
            <p className="text-white/60 mb-8">
              Alinhada com frameworks IBGC, IBRI e melhores práticas globais de governança corporativa
            </p>

            {/* Logos */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              {["IBGC", "IBRI", "AMCHAM"].map((logo) => (
                <div key={logo} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <Award className="h-8 w-8 text-accent" />
                  </div>
                  <span className="text-xs text-white/50">Metodologia {logo}</span>
                </div>
              ))}
            </div>

            {/* Early Stage Stats */}
            <div className="flex flex-wrap justify-center gap-12 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">3 conselhos</div>
                <div className="text-sm text-white/50">Ativos desde jan/2026</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">47 pautas</div>
                <div className="text-sm text-white/50">Geradas com IA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">12 reuniões</div>
                <div className="text-sm text-white/50">Gerenciadas na plataforma</div>
              </div>
            </div>

            {/* Transparency Note */}
            <div className="max-w-2xl mx-auto bg-accent/20 border-l-4 border-accent rounded-r-lg p-4 text-left">
              <p className="text-sm text-white">
                <strong>Early Adopters:</strong> Estamos embarcando os primeiros conselhos agora. 
                Vagas limitadas para garantir suporte premium durante onboarding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: PAIN POINTS */}
      <section className="py-20 bg-corporate-light">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-white">
              Você ainda está...
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {painPoints.map((pain, index) => (
                <Card key={index} className="border border-white/10 bg-white/5 hover:border-destructive/30 transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center shrink-0">
                        <X className="h-5 w-5 text-destructive" />
                      </div>
                      <h3 className="font-bold text-lg text-white">{pain.title}</h3>
                    </div>
                    <p className="text-white/60 text-sm mb-4 ml-14">
                      {pain.description}
                    </p>
                    <div className="ml-14 flex items-center gap-2 text-sm font-medium text-white">
                      <CheckCircle className="h-4 w-4 text-accent" />
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
      <section className="py-20 bg-corporate-mid">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">A Solução: Legacy OS</h2>
              <p className="text-lg text-white/60">
                A primeira plataforma all-in-one com IA nativa para governança corporativa
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {pillars.map((pillar, index) => (
                <Card 
                  key={index} 
                  className={`relative overflow-hidden transition-all hover:shadow-xl border ${
                    pillar.highlight ? 'border-2 border-accent bg-accent/10' : 'border-white/10 bg-white/5'
                  }`}
                >
                  {pillar.highlight && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
                  )}
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                      <pillar.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{pillar.title}</h3>
                    <p className="text-white/60 text-sm mb-6">{pillar.description}</p>
                    <ul className="space-y-2 mb-6">
                      {pillar.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-white">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to={pillar.link} className="text-accent font-medium text-sm hover:underline flex items-center gap-1">
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
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                AI Engine CORE: O Cérebro da Legacy OS
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
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
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-destructive rounded-full" />
                      Ler atas das últimas 6 reuniões (2h)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-destructive rounded-full" />
                      Consolidar relatórios financeiros, ESG, projetos (3h)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-destructive rounded-full" />
                      Escrever pauta do zero (2h)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-destructive rounded-full" />
                      Criar briefings individuais por conselheiro (1h)
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* After */}
              <Card className="bg-accent/20 border-accent/30">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-white/90">DEPOIS: AI Engine CORE</h3>
                  <div className="text-4xl font-bold text-accent mb-4">30 minutos</div>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      IA lê histórico completo automaticamente (0h)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      IA consolida 20+ fontes em dashboard único (0h)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      IA gera 3 versões de pauta prontas para escolher (15 min)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      IA cria briefings contextualizados automaticamente (15 min)
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Savings Banner */}
            <div className="bg-accent text-primary rounded-xl p-6 text-center mb-8">
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
                    <item.icon className="h-6 w-6 text-accent" />
                      </div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-white/60">{item.desc}</p>
                    </div>
              ))}
                    </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Button size="lg" className="bg-accent text-primary hover:bg-accent/90 font-semibold px-8 py-3 h-12" asChild>
                <Link to="/pricing">Conhecer AI Engine CORE Completo</Link>
              </Button>
              <Button size="lg" className="bg-transparent border-2 border-accent text-accent hover:bg-accent/10 font-semibold px-8 py-3 h-12" asChild>
                <Link to="/contato">Agendar Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: FEATURES GRID */}
      <section className="py-20 bg-corporate-light">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
                As 6 Funcionalidades Que Mais Importam
              </h2>
              <p className="text-lg text-white/60">
                Núcleo da plataforma: o que você vai usar toda semana
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {coreFeatures.map((feature, index) => (
                <Card key={index} className="bg-white/5 border border-white/10 hover:shadow-lg transition-all hover:border-accent/30">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-bold mb-2 text-white">{feature.title}</h3>
                    <p className="text-sm text-white/60">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button className="bg-accent text-primary hover:bg-accent/90 px-8 py-3 h-12" size="lg" asChild>
                <Link to="/pricing">
                  Ver Todas as Funcionalidades e Planos
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <p className="text-sm text-white/50 mt-4">
                + 7 add-ons disponíveis (Inteligência de Mercado, Sucessão, People Analytics, etc.)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 7: COMPARAÇÃO */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#0A1628]">
                Por Que Líderes de Governança Escolhem Legacy
              </h2>
              <p className="text-lg text-gray-600">
                Comparação lado a lado: Legacy OS vs soluções tradicionais
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Com Legacy */}
              <Card className="border-2 border-[#C0A062] bg-[#C0A062]/5 relative">
                <CardContent className="p-6 pt-8">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#C0A062]/20">
                    <div className="w-8 h-8 bg-[#C0A062] rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0A1628]">Com Legacy OS</h3>
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
                        <CheckCircle className="h-5 w-5 text-[#C0A062] shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[#0A1628]">{item.title}</strong>
                          <span className="text-sm text-gray-600">{item.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Com Outros */}
              <Card className="border border-gray-200">
                <CardContent className="p-6 pt-8">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <X className="h-5 w-5 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0A1628]">Com Soluções Tradicionais</h3>
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
                        <X className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[#0A1628]">{item.title}</strong>
                          <span className="text-sm text-gray-600">{item.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <div className="inline-block bg-[#C0A062]/10 border border-[#C0A062]/20 rounded-xl p-6">
                <div className="flex items-center justify-center gap-2 text-xl font-bold mb-2 text-[#0A1628]">
                  <Award className="h-6 w-6 text-[#C0A062]" />
                  6/6 Diferenciais Críticos
                </div>
                <p className="text-sm text-gray-600">Legacy OS entrega o que soluções tradicionais não conseguem ou não querem entregar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 8: VALIDAÇÃO */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#0A1628]">
              Validada por 50+ Líderes de Governança
              </h2>
            <p className="text-lg text-gray-600 mb-8">
              Metodologia testada e refinada com especialistas do mercado. 
              Primeiros conselhos embarcando agora.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#0A1628]">50+</div>
                <div className="text-sm text-gray-500">Validações Realizadas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#0A1628]">3</div>
                <div className="text-sm text-gray-500">Conselhos Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#0A1628]">47</div>
                <div className="text-sm text-gray-500">Pautas Geradas com IA</div>
              </div>
            </div>

            {/* Quote */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-[#C0A062]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-[#C0A062]" />
                </div>
                <p className="text-lg italic text-[#0A1628] mb-6">
                  "Testamos a pauta gerada pela IA com nosso conselho. 
                  Identificou 3 riscos estratégicos que não estavam na nossa agenda original. 
                  Em 30 minutos, tínhamos material melhor do que preparávamos em 8 horas."
                </p>
                <div>
                  <strong className="block text-[#0A1628]">Head de Governança</strong>
                  <span className="text-sm text-gray-500">Holding Familiar, R$ 280M faturamento anual</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SEÇÃO 9: SECURITY & COMPLIANCE */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#0A1628]">
                Segurança Enterprise que Você Pode Confiar
              </h2>
              <p className="text-lg text-gray-600">
                Certificações, compliance e proteção de dados nível mundial
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
              {securityBadges.map((badge, index) => (
                <Card key={index} className="text-center border border-gray-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="w-12 h-12 bg-[#0A1628]/5 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-6 w-6 text-[#0A1628]" />
                    </div>
                    <div className="font-semibold text-sm mb-1 text-[#0A1628]">{badge.label}</div>
                    <p className="text-xs text-gray-500">{badge.benefit}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Security Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-[#0A1628]">
                  <Lock className="h-4 w-4 text-[#C0A062]" />
                  Proteção de Dados
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-[#C0A062]" /> Criptografia AES-256 (dados em repouso)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-[#C0A062]" /> TLS 1.3 (dados em trânsito)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-[#C0A062]" /> Backup diário automatizado (90 dias)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-[#0A1628]">
                  <Users className="h-4 w-4 text-[#C0A062]" />
                  Autenticação
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-[#C0A062]" /> Autenticação 2FA + SSO</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-[#C0A062]" /> SAML, OAuth 2.0, OpenID Connect</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-[#C0A062]" /> Permissões granulares por usuário</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-[#0A1628]">
                  <Eye className="h-4 w-4 text-[#C0A062]" />
                  Auditoria
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-[#C0A062]" /> Logs imutáveis (blockchain)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-[#C0A062]" /> Audit trail completo de todas ações</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-[#C0A062]" /> DRP {"<"} 4h (disaster recovery plan)</li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button className="bg-[#0A1628] text-white hover:bg-[#0A1628]/90" asChild>
                <Link to="/privacidade">Ver Trust Center Completo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 10: FINAL CTA */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Pronto para Transformar Sua Governança?
              </h2>
              <p className="text-xl text-white/70">
                Descubra como a Legacy OS pode reduzir 93% do tempo de preparação 
                e elevar a qualidade das decisões do seu conselho
              </p>
            </div>
            
            {/* Form */}
            <Card className="max-w-2xl mx-auto bg-white">
              <CardContent className="p-8">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[#0A1628]">Nome Completo *</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Seu nome"
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#0A1628]">E-mail Corporativo *</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="seu@empresa.com.br"
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization" className="text-[#0A1628]">Organização *</Label>
                      <Input 
                        id="organization" 
                        name="organization" 
                        value={formData.organization} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Nome da empresa"
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#0A1628]">Telefone / WhatsApp *</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="(11) 99999-9999"
                        className="border-gray-300"
                      />
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-[#C0A062] hover:bg-[#C0A062]/90 text-[#0A1628] text-lg py-6 font-semibold">
                    <Calendar className="h-5 w-5 mr-2" />
                    Agendar Demonstração
                  </Button>
                </form>

                {/* Features */}
                <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-[#C0A062]" /> Demo personalizada 30 min</span>
                  <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-[#C0A062]" /> Diagnóstico gratuito incluso</span>
                  <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-[#C0A062]" /> Suporte em português</span>
                </div>
              </CardContent>
            </Card>

            {/* Secondary CTA */}
            <div className="text-center mt-8">
              <Button size="lg" className="bg-transparent border-2 border-[#C0A062] text-[#C0A062] hover:bg-[#C0A062]/10 font-semibold" asChild>
                <Link to="/pricing">
                  <Target className="h-5 w-5 mr-2" />
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
