import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  FileCheck,
  Users,
  FileText,
  Bell,
  Award,
  BarChart3,
  Target,
  Shield,
  Lock,
  Building2,
  Landmark,
  Building,
  Heart,
  GraduationCap,
  Cpu,
  ShoppingCart,
  Factory,
  Check,
} from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

const ENGAJAMENTO_CARDS = [
  {
    icon: FileCheck,
    title: "Aprovações e Votação",
    description: "Sistema seguro de votação online com registro completo, controle de quórum e gestão de impedimentos.",
    items: ["Votação assíncrona", "Registro auditável", "Declaração de conflitos"],
  },
  {
    icon: Users,
    title: "Gestão de Membros",
    description: "Perfis completos de conselheiros e executivos com histórico, mandatos, skills e avaliações.",
    items: ["Perfis detalhados", "Controle de mandatos", "Skills tracking"],
  },
  {
    icon: FileText,
    title: "Notas e Anotações",
    description: "Sistema de anotações privadas durante reuniões, compartilhamento seletivo e histórico completo.",
    items: ["Notas privadas", "Compartilhamento seguro", "Histórico completo"],
  },
  {
    icon: Bell,
    title: "Alertas Inteligentes",
    description: "Notificações proativas sobre vencimentos, deadlines, mudanças regulatórias e riscos emergentes.",
    items: ["Alertas personalizados", "Lembretes automáticos", "Notificações push"],
  },
];

const CONTINUIDADE_CARDS = [
  {
    icon: Award,
    title: "Avaliação do Board",
    description: "Avaliação 360° de desempenho do conselho, comitês e conselheiros individuais.",
    items: ["Avaliação 360°", "Benchmarks setoriais", "PDI integrado"],
  },
  {
    icon: BarChart3,
    title: "Relatórios de Diversidade",
    description: "Métricas de diversidade do board, tracking de metas e compliance regulatório.",
    items: ["Métricas DE&I", "Metas de diversidade", "Relatórios regulatórios"],
  },
  {
    icon: FileCheck,
    title: "Gestão de Papéis e Termos",
    description: "Controle de mandatos, renovações, succession planning e documentação legal.",
    items: ["Controle de mandatos", "Alertas de renovação", "Documentação legal"],
  },
  {
    icon: Target,
    title: "Pesquisas e Surveys",
    description: "Criação e aplicação de pesquisas para conselheiros, executivos e stakeholders.",
    items: ["Templates prontos", "Análise automática", "Benchmark setorial"],
  },
];

const SETORES = [
  { icon: Building2, label: "Associações e ONGs" },
  { icon: Landmark, label: "Serviços Financeiros" },
  { icon: Building, label: "Governo e Público" },
  { icon: Heart, label: "Healthcare e Pharma" },
  { icon: GraduationCap, label: "Educação Superior" },
  { icon: Cpu, label: "Tecnologia e Startups" },
  { icon: ShoppingCart, label: "Varejo e Alimentos" },
  { icon: Factory, label: "Indústria e Manufatura" },
];

const FAQ_ITEMS = [
  { q: "Como funciona o sistema de votação online?", a: "O sistema permite votações assíncronas com registro auditável, controle de quórum e gestão de impedimentos. Cada voto é registrado de forma segura e pode ser auditado." },
  { q: "A plataforma atende empresas de todos os setores?", a: "Sim. A Legacy OS oferece governança adaptada para diversos setores: associações, serviços financeiros, governo, healthcare, educação, tecnologia, varejo e indústria." },
  { q: "Como funciona a avaliação 360° do board?", a: "A avaliação 360° analisa o desempenho do conselho, comitês e conselheiros individuais, com benchmarks setoriais e PDI integrado para desenvolvimento contínuo." },
  { q: "Quais certificações de segurança a plataforma possui?", a: "SOC 2 Type II, ISO 27001, conformidade LGPD e preparação para GDPR. Criptografia AES-256, TLS 1.3, backup diário e logs imutáveis." },
  { q: "Como funcionam os alertas inteligentes?", a: "Notificações proativas sobre vencimentos, deadlines, mudanças regulatórias e riscos emergentes, com alertas personalizados e lembretes automáticos." },
];

const ModulosGovernanca = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#0A1628]">
      <LandingNav />
      <main className="flex-1 text-white">
        {/* Governança Integrada Hero */}
        <section className="py-16 md:py-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="font-montserrat text-4xl md:text-5xl font-bold mb-6">
              Governança Integrada
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Engajamento do conselho, continuidade do board e segurança enterprise em uma única plataforma. Governança de excelência para qualquer setor.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                className="bg-legacy-gold text-legacy-500 hover:brightness-110 focus:bg-legacy-gold focus:text-legacy-500 active:bg-legacy-gold active:text-legacy-500 font-montserrat font-semibold px-6 py-6 h-auto"
                onClick={() => navigate("/planos")}
              >
                Ver Planos e Preços
              </Button>
            </div>
          </div>
        </section>

        {/* Engajamento do Conselho */}
        <section className="py-12 md:py-16 px-6 border-t border-white/10">
          <div className="container mx-auto max-w-5xl">
            <h2 className="font-montserrat text-3xl font-bold text-center mb-2">
              Engajamento do Conselho
            </h2>
            <p className="text-center text-white/80 mb-10">
              Ferramentas para maximizar a participação e efetividade dos conselheiros
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ENGAJAMENTO_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <card.icon className="h-10 w-10 text-white mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                  <p className="text-sm text-white/80 mb-4">{card.description}</p>
                  <ul className="space-y-2">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-white/90">
                        <Check className="h-4 w-4 text-legacy-gold shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Continuidade do Board */}
        <section className="py-12 md:py-16 px-6 border-t border-white/10">
          <div className="container mx-auto max-w-5xl">
            <h2 className="font-montserrat text-3xl font-bold text-center mb-2">
              Continuidade do Board
            </h2>
            <p className="text-center text-white/80 mb-10">
              Gestão de longo prazo, avaliações e desenvolvimento contínuo
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CONTINUIDADE_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <card.icon className="h-10 w-10 text-white mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                  <p className="text-sm text-white/80 mb-4">{card.description}</p>
                  <ul className="space-y-2">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-white/90">
                        <Check className="h-4 w-4 text-legacy-gold shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Segurança Enterprise */}
        <section className="py-12 md:py-16 px-6 border-t border-white/10">
          <div className="container mx-auto max-w-5xl">
            <h2 className="font-montserrat text-3xl font-bold text-center mb-2">
              Segurança Enterprise
            </h2>
            <p className="text-center text-white/80 mb-10">
              Certificações e compliance de nível mundial
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <Shield className="h-10 w-10 text-legacy-gold mb-4" />
                <h3 className="font-semibold text-lg mb-2">Certificações Compliance</h3>
                <p className="text-sm text-white/80 mb-4">SOC 2 Type II, ISO 27001, LGPD compliant, GDPR ready.</p>
                <ul className="space-y-2">
                  {["SOC 2 Type II", "ISO 27001", "LGPD/GDPR"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-white/90">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <Lock className="h-10 w-10 text-legacy-gold mb-4" />
                <h3 className="font-semibold text-lg mb-2">Segurança da Plataforma</h3>
                <p className="text-sm text-white/80 mb-4">Criptografia AES-256, TLS 1.3, backup diário, logs imutáveis.</p>
                <ul className="space-y-2">
                  {["Criptografia E2E", "Backup automático", "Audit trail"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-white/90">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <h2 className="font-montserrat text-3xl font-bold text-center mb-2 mt-16">
              Governança para Qualquer Setor
            </h2>
            <p className="text-center text-white/80 mb-10">
              Soluções adaptadas às necessidades específicas de cada indústria
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SETORES.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm text-center hover:bg-white/10 transition-colors"
                >
                  <s.icon className="h-8 w-8 text-legacy-gold mx-auto mb-2" />
                  <span className="text-sm font-medium text-white">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Pronto para Elevar + FAQ */}
        <section className="py-16 md:py-20 px-6 border-t border-white/10">
          <div className="container mx-auto max-w-3xl text-center mb-12">
            <h2 className="font-montserrat text-3xl font-bold mb-4">
              Pronto para Elevar sua Governança?
            </h2>
            <p className="text-white/80 mb-8">
              Agende uma demonstração e veja como a Legacy OS transforma a governança da sua empresa
            </p>
            <Button
              className="bg-legacy-gold text-legacy-500 hover:brightness-110 font-montserrat font-semibold px-6 py-6 h-auto"
              onClick={() => navigate("/login")}
            >
              Agendar Demonstração
            </Button>
          </div>

          <div className="container mx-auto max-w-3xl">
            <h2 className="font-montserrat text-2xl font-bold text-center mb-2">
              Perguntas Frequentes
            </h2>
            <p className="text-center text-white/80 mb-8">
              Dúvidas sobre governança integrada
            </p>
            <Accordion type="single" collapsible className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-lg border border-white/10 bg-white/5 px-6 data-[state=open]:border-legacy-gold/30"
                >
                  <AccordionTrigger className="text-left text-white hover:text-legacy-gold py-4">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 pb-4">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
};

export default ModulosGovernanca;
