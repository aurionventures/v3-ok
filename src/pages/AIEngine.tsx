import { Link } from "react-router-dom";
import { 
  ArrowRight, Brain, Target,
  BarChart, FileText, Users,
  Clock, TrendingUp, CheckCircle
} from "lucide-react";
import { MegaFooter } from "@/components/footer";
import { FAQSection, aiEngineFAQs } from "@/components/footer/FAQSection";
import { MegaMenuHeader } from "@/components/header/MegaMenuHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AIEngine = () => {

  const benefits = [
    { icon: Clock, stat: "-93%", label: "Tempo de Preparação", desc: "De 8 horas para 30 minutos" },
    { icon: Brain, stat: "85+", label: "Prompts Otimizados", desc: "Específicos para governança" },
    { icon: TrendingUp, stat: "20+", label: "Fontes Monitoradas", desc: "Economia, regulação, setor" },
    { icon: Users, stat: "50+", label: "Validações", desc: "Por líderes de governança" }
  ];


  return (
    <div className="min-h-screen bg-corporate-dark">
      <MegaMenuHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(192,160,98,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 leading-tight font-heading">
              AI Engine CORE
            </h1>
            <p className="text-xl lg:text-2xl mb-12 text-white/80 leading-relaxed max-w-3xl mx-auto">
              O cérebro da Legacy OS. Uma arquitetura multi-agentes que monitora, analisa, 
              prioriza e gera conteúdo automaticamente. IA construída no DNA da plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold text-lg px-8" asChild>
                <Link to="/standalone-quiz">Fazer Diagnóstico Gratuito</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8" asChild>
                <Link to="/contato">Ver Demo da IA</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Stats */}
      <section className="py-20 bg-corporate-mid border-b border-accent/20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <benefit.icon className="h-7 w-7 text-accent" aria-hidden="true" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{benefit.stat}</div>
                  <div className="text-sm font-semibold text-white mb-1">{benefit.label}</div>
                  <div className="text-xs text-white/60">{benefit.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-corporate-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Como o AI Engine Funciona</h2>
              <p className="text-lg text-white/70">Não é IA adicionada depois. É IA construída no núcleo da plataforma desde o dia 1.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Before */}
              <Card className="border border-destructive/30 bg-destructive/10">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-destructive mb-4">ANTES: Preparação Manual</h3>
                  <div className="text-4xl font-bold text-destructive mb-4">8 horas</div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <span className="text-destructive font-bold">1.</span>
                      Ler atas das últimas 6 reuniões (2h)
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <span className="text-destructive font-bold">2.</span>
                      Consolidar relatórios financeiros, ESG, projetos (3h)
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <span className="text-destructive font-bold">3.</span>
                      Escrever pauta do zero (2h)
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <span className="text-destructive font-bold">4.</span>
                      Criar briefings individuais por conselheiro (1h)
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* After */}
              <Card className="border border-green-500/30 bg-green-500/10">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-green-500 mb-4">DEPOIS: AI Engine CORE</h3>
                  <div className="text-4xl font-bold text-green-500 mb-4">30 minutos</div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      IA lê histórico completo automaticamente
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      IA consolida 20+ fontes em dashboard único
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      IA gera 3 versões de pauta prontas (15 min)
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/70">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      IA cria briefings contextualizados (15 min)
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Savings Banner */}
            <div className="mt-8 p-6 bg-accent rounded-xl text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                Economia estimada: R$ 180.000/ano por conselho
              </div>
              <p className="text-sm text-primary/80">
                Base: 12 reuniões/ano × 90h economizadas × R$ 2.000/h (custo total secretário executivo)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Core Visual - Orquestração Conceitual */}
      <section className="py-20 bg-corporate-mid relative overflow-hidden">
        {/* Background Particles Effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
          <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header Minimalista */}
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                O núcleo invisível que governa a governança
              </h2>
            </div>

            {/* Visualização Central - Núcleo + Anéis */}
            <div className="relative flex items-center justify-center min-h-[500px] md:min-h-[600px]">
              {/* Anéis Concêntricos de Influência */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Anel 1 - Decisão */}
                <div className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full border border-accent/20 animate-pulse" style={{ animationDuration: '4s' }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-corporate-mid px-3 py-1 rounded-full border border-accent/30">
                      <span className="text-xs text-accent font-medium">Decisão</span>
                    </div>
                  </div>
                </div>
                
                {/* Anel 2 - Risco */}
                <div className="absolute w-96 h-96 md:w-[28rem] md:h-[28rem] rounded-full border border-accent/15 animate-pulse" style={{ animationDuration: '5s', animationDelay: '0.5s' }}>
                  <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
                    <div className="bg-corporate-mid px-3 py-1 rounded-full border border-accent/30">
                      <span className="text-xs text-accent font-medium">Risco</span>
                    </div>
                  </div>
                </div>

                {/* Anel 3 - Compliance */}
                <div className="absolute w-[32rem] h-[32rem] md:w-[36rem] md:h-[36rem] rounded-full border border-accent/10 animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <div className="bg-corporate-mid px-3 py-1 rounded-full border border-accent/30">
                      <span className="text-xs text-accent font-medium">Compliance</span>
                    </div>
                  </div>
                </div>

                {/* Anel 4 - Performance */}
                <div className="absolute w-[40rem] h-[40rem] md:w-[44rem] md:h-[44rem] rounded-full border border-accent/8 animate-pulse" style={{ animationDuration: '7s', animationDelay: '1.5s' }}>
                  <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-corporate-mid px-3 py-1 rounded-full border border-accent/30">
                      <span className="text-xs text-accent font-medium">Performance</span>
                    </div>
                  </div>
                </div>

                {/* Anel 5 - Memória Organizacional */}
                <div className="absolute w-[48rem] h-[48rem] md:w-[52rem] md:h-[52rem] rounded-full border border-accent/5 animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}>
                  <div className="absolute top-1/4 right-1/4">
                    <div className="bg-corporate-mid px-3 py-1 rounded-full border border-accent/30">
                      <span className="text-xs text-accent font-medium">Memória</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Núcleo Central - AI Core */}
              <div className="relative z-10">
                <div className="relative">
                  {/* Núcleo Pulsante */}
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-accent via-accent/80 to-accent/60 flex items-center justify-center shadow-[0_0_80px_rgba(192,160,98,0.5)] animate-pulse" style={{ animationDuration: '2s' }}>
                    <Brain className="w-16 h-16 md:w-20 md:h-20 text-primary" />
                  </div>
                  
                  {/* Ondas de Energia */}
                  <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
                  
                  {/* Label */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-sm md:text-base font-semibold text-accent bg-corporate-mid/90 px-4 py-2 rounded-full border border-accent/30">
                      AI Core
                    </span>
                  </div>
                </div>
              </div>

              {/* Elementos Orbitais - Conselhos, Conselheiros, Comitês */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Conselho de Administração */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2">
                  <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                    <span className="text-xs text-white/80 font-medium">Conselho de Administração</span>
                  </div>
                </div>

                {/* Conselheiros */}
                <div className="absolute top-24 right-12 md:right-20">
                  <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                    <span className="text-xs text-white/80 font-medium">Conselheiros</span>
                  </div>
                </div>

                {/* Comitês */}
                <div className="absolute bottom-24 left-12 md:left-20">
                  <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                    <span className="text-xs text-white/80 font-medium">Comitês</span>
                  </div>
                </div>

                {/* Comissões */}
                <div className="absolute bottom-12 right-1/2 translate-x-1/2">
                  <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                    <span className="text-xs text-white/80 font-medium">Comissões</span>
                  </div>
                </div>
              </div>

              {/* Linhas de Conexão Energéticas (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {/* Linhas do núcleo para os anéis */}
                <line x1="50%" y1="50%" x2="50%" y2="20%" stroke="rgba(192,160,98,0.2)" strokeWidth="1" strokeDasharray="4,4" className="animate-pulse" style={{ animationDuration: '3s' }} />
                <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="rgba(192,160,98,0.2)" strokeWidth="1" strokeDasharray="4,4" className="animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
                <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="rgba(192,160,98,0.2)" strokeWidth="1" strokeDasharray="4,4" className="animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }} />
                <line x1="50%" y1="50%" x2="20%" y2="50%" stroke="rgba(192,160,98,0.2)" strokeWidth="1" strokeDasharray="4,4" className="animate-pulse" style={{ animationDuration: '3s', animationDelay: '1.5s' }} />
              </svg>
            </div>

            {/* Texto Único Minimalista */}
            <div className="text-center mt-12 md:mt-16">
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto italic">
                "A inteligência que sustenta todas as decisões"
              </p>
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold text-base md:text-lg px-8" asChild>
                <Link to="/governanca" className="flex items-center justify-center gap-2">
                  <span>Ver como a IA apoia decisões de governança</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-20 bg-corporate-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Arquitetura IA Nativa</h2>
              <p className="text-lg text-white/70">Enquanto competidores adicionaram IA como feature depois, a Legacy OS foi construída desde o início com IA no núcleo.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Brain,
                  title: "Monitoramento 24/7",
                  description: "20+ fontes monitoradas continuamente: economia, política, regulação, setor. Alertas proativos sobre mudanças relevantes."
                },
                {
                  icon: BarChart,
                  title: "Análise de Histórico",
                  description: "Padrões, gaps, questões recorrentes identificadas automaticamente. Aprende com cada reunião do seu conselho."
                },
                {
                  icon: Target,
                  title: "Priorização Inteligente",
                  description: "Ranqueia temas por urgência, impacto estratégico e maturidade. Foco no que realmente importa."
                },
                {
                  icon: FileText,
                  title: "Geração Automática",
                  description: "Pauta, briefings, contexto e recomendações prontos para aprovação. Você revisa, a IA trabalha."
                }
              ].map((feature, index) => (
                <Card key={index} className="bg-accent/10 border-accent/30 hover:border-accent/50 transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/70">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Experimente o AI Engine</h2>
            <p className="text-xl text-white/80 mb-8">Faça o diagnóstico gratuito e veja o poder da IA aplicada à governança</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold text-lg px-8" asChild>
                <Link to="/standalone-quiz">
                  Fazer Diagnóstico Gratuito
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
        subtitle="Dúvidas sobre o AI Engine"
        faqs={aiEngineFAQs}
      />

      <MegaFooter />
    </div>
  );
};

export default AIEngine;
