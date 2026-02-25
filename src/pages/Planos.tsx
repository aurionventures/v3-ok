import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, Compass, ArrowRight, FileText } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import { PlanDiscoveryFlow } from "@/components/planos/PlanDiscoveryFlow";
import { CheckoutFlow } from "@/components/planos/CheckoutFlow";
import type { CalculatedPlan } from "@/components/planos/PlanDiscoveryFlow";

const CORE_FEATURES = [
  "Estrutura Societária",
  "Gestão de Conselhos",
  "Reuniões e ATAS",
  "Gestão de Documentos",
  "Agenda Anual",
  "Tarefas e Pendências",
  "Portal do Membro",
];

const LIMITES_DATA = [
  { feature: "Empresas (por CNPJ)", e1: "1 Empresa", e2: "1 Empresa", e3: "1 Empresa", e4: "1 Empresa" },
  { feature: "Usuários", e1: "Ilimitados", e2: "Ilimitados", e3: "Ilimitados", e4: "Ilimitados" },
  { feature: "Armazenamento", e1: "10 GB", e2: "50 GB", e3: "200 GB", e4: "Ilimitado" },
  { feature: "Add-ons Inclusos", e1: "0", e2: "3", e3: "5", e4: "Todos (7)" },
];

const SUPORTE_DATA = [
  { feature: "Email", e1: true, e2: true, e3: true, e4: true },
  { feature: "Chat", e1: false, e2: true, e3: true, e4: true },
  { feature: "Telefone", e1: false, e2: false, e3: true, e4: true },
  { feature: "Gerente Dedicado", e1: false, e2: false, e3: false, e4: true },
  { feature: "SLA Garantido", e1: "48h", e2: "24h", e3: "8h", e4: "4h" },
];

const SEGURANCA_DATA = [
  { feature: "2FA", e1: true, e2: true, e3: true, e4: true },
  { feature: "Audit Log", e1: true, e2: true, e3: true, e4: true },
  { feature: "SSO/SAML", e1: false, e2: false, e3: true, e4: true },
  { feature: "IP Whitelist", e1: false, e2: false, e3: false, e4: true },
  { feature: "Ambiente Dedicado", e1: false, e2: false, e3: false, e4: true },
];

const PLANOS_FAQ = [
  { q: "Qual plano é ideal para minha empresa?", a: "Recomendamos o diagnóstico de maturidade em governança. Em 2 minutos você descobre o plano recomendado com base no tamanho da empresa, complexidade e necessidades de conselho e documentação." },
  { q: "Os planos cobram por usuário?", a: "Não. Todos os planos incluem usuários ilimitados. Acreditamos que governança eficaz requer participação de todos os stakeholders relevantes, sem custo por assento." },
  { q: "Posso fazer upgrade do meu plano posteriormente?", a: "Sim. Você pode fazer upgrade a qualquer momento. O valor já pago será considerado de forma proporcional na nova mensalidade." },
  { q: "Existe período de teste gratuito?", a: "Oferecemos demonstração guiada e diagnóstico gratuito. Entre em contato para agendar uma apresentação da plataforma e validar o plano ideal." },
  { q: "Como funcionam os módulos add-on?", a: "Os módulos add-on (Desempenho de Conselho, PDI, Inteligência de Mercado) podem ser contratados conforme necessidade. Os planos Profissional, Business e Enterprise já incluem uma quantidade de add-ons inclusos." },
];

const Planos = () => {
  const navigate = useNavigate();
  const [discoveryOpen, setDiscoveryOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<CalculatedPlan | null>(null);

  const scrollToPlanos = () => {
    document.getElementById("tabela-planos")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenDiscovery = () => setDiscoveryOpen(true);
  const handleContract = (plan: CalculatedPlan) => setCheckoutPlan(plan);
  const handleCloseCheckout = () => setCheckoutPlan(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#0A1628]">
      <LandingNav activeLink="planos" />
      {checkoutPlan && (
        <CheckoutFlow plan={checkoutPlan} onClose={handleCloseCheckout} />
      )}
      <PlanDiscoveryFlow
        open={discoveryOpen}
        onOpenChange={setDiscoveryOpen}
        onContract={handleContract}
      />
      <main className="flex-1">
        {/* Hero */}
        <section className="legacy-gradient text-white py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Planos Personalizados.{" "}
                <span className="text-legacy-gold">Usuários Ilimitados.</span>
              </h1>
              <p className="font-lato text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-4">
                Descubra o investimento ideal para sua empresa em 2 minutos.
              </p>
              <p className="font-lato text-base text-white/70 italic mb-10">
                &ldquo;Cada empresa é única. Nosso preço também.&rdquo;
              </p>
              <Button
                className="bg-legacy-gold text-legacy-500 hover:brightness-110 font-montserrat font-semibold text-base px-8 py-6 h-auto"
                onClick={handleOpenDiscovery}
              >
                <Compass className="h-5 w-5 mr-2" />
                Descobrir Meu Plano e Investimento
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Intro tabela */}
        <section className="py-12 text-white text-center">
          <div className="container mx-auto px-6">
            <h2 className="font-montserrat text-3xl md:text-4xl font-bold mb-4">
              Escolha o Plano Ideal para sua{" "}
              <span className="text-legacy-gold">Governança</span>
            </h2>
            <p className="font-lato text-lg text-white/80 max-w-2xl mx-auto">
              Todos os planos incluem usuários ilimitados e os 04 módulos core da plataforma + IA assistida.
            </p>
          </div>
        </section>

        {/* Tabela CORE */}
        <section id="tabela-planos" className="pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto overflow-x-auto rounded-lg border border-white/10 bg-white shadow-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    <th className="px-6 py-4 font-montserrat font-semibold text-gray-900">Funcionalidade</th>
                    <th className="px-6 py-4 font-montserrat font-semibold text-gray-900 text-center min-w-[120px]">Essencial</th>
                    <th className="px-6 py-4 font-montserrat font-semibold text-gray-900 text-center min-w-[120px]">Profissional</th>
                    <th className="px-6 py-4 font-montserrat font-semibold text-gray-900 text-center min-w-[120px]">Business</th>
                    <th className="px-6 py-4 font-montserrat font-semibold text-gray-900 text-center min-w-[120px]">Enterprise</th>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    <td className="px-6 py-3" />
                    <td className="px-6 py-3 text-center">
                      <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">Ver Preço</Button>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">Ver Preço</Button>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">Ver Preço</Button>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">Consultar</Button>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td colSpan={5} className="px-6 py-2 font-montserrat font-bold text-gray-900">CORE</td>
                  </tr>
                  {CORE_FEATURES.map((name) => (
                    <tr key={name} className="border-b border-gray-100">
                      <td className="px-6 py-3 font-lato text-gray-800">{name}</td>
                      <td className="px-6 py-3 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                      <td className="px-6 py-3 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                      <td className="px-6 py-3 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                      <td className="px-6 py-3 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Tabela Limites / Suporte / Segurança */}
        <section className="pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto overflow-x-auto rounded-lg border border-white/10 bg-white shadow-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-[#0A1628] text-white">
                    <th className="px-6 py-3 font-montserrat font-semibold">LIMITES</th>
                    <th className="px-6 py-3 text-center min-w-[100px]">Essencial</th>
                    <th className="px-6 py-3 text-center min-w-[100px]">Profissional</th>
                    <th className="px-6 py-3 text-center min-w-[100px]">Business</th>
                    <th className="px-6 py-3 text-center min-w-[100px]">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {LIMITES_DATA.map((row) => (
                    <tr key={row.feature} className="border-b border-gray-100">
                      <td className="px-6 py-3 font-lato text-gray-800">{row.feature}</td>
                      <td className="px-6 py-3 text-center font-lato text-gray-700">{row.e1}</td>
                      <td className="px-6 py-3 text-center font-lato text-gray-700">{row.e2}</td>
                      <td className="px-6 py-3 text-center font-lato text-gray-700">{row.e3}</td>
                      <td className="px-6 py-3 text-center font-lato text-gray-700">{row.e4}</td>
                    </tr>
                  ))}
                </tbody>
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-[#0A1628] text-white">
                    <th className="px-6 py-3 font-montserrat font-semibold">SUPORTE</th>
                    <th className="px-6 py-3" colSpan={4} />
                  </tr>
                </thead>
                <tbody>
                  {SUPORTE_DATA.map((row) => (
                    <tr key={row.feature} className="border-b border-gray-100">
                      <td className="px-6 py-3 font-lato text-gray-800">{row.feature}</td>
                      <td className="px-6 py-3 text-center">
                        {typeof row.e1 === "boolean" ? (row.e1 ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />) : row.e1}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {typeof row.e2 === "boolean" ? (row.e2 ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />) : row.e2}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {typeof row.e3 === "boolean" ? (row.e3 ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />) : row.e3}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {typeof row.e4 === "boolean" ? (row.e4 ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />) : row.e4}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-[#0A1628] text-white">
                    <th className="px-6 py-3 font-montserrat font-semibold">SEGURANÇA</th>
                    <th className="px-6 py-3" colSpan={4} />
                  </tr>
                </thead>
                <tbody>
                  {SEGURANCA_DATA.map((row) => (
                    <tr key={row.feature} className="border-b border-gray-100">
                      <td className="px-6 py-3 font-lato text-gray-800">{row.feature}</td>
                      <td className="px-6 py-3 text-center">
                        {row.e1 ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {row.e2 ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {row.e3 ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {row.e4 ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white font-montserrat font-bold">?</span>
                <h2 className="font-montserrat text-3xl md:text-4xl font-bold">
                  Perguntas Frequentes
                </h2>
              </div>
              <p className="font-lato text-white/80 text-center mb-12">
                Tire suas dúvidas sobre nossos planos e preços
              </p>
              <Accordion type="single" collapsible className="space-y-3">
                {PLANOS_FAQ.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="bg-white/5 border border-white/10 rounded-lg px-6 data-[state=open]:border-legacy-gold/30"
                  >
                    <AccordionTrigger className="text-left font-montserrat font-semibold text-white hover:text-legacy-gold transition-colors py-5">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="font-lato text-white/80 leading-relaxed pb-5">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-20 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-montserrat text-3xl md:text-4xl font-bold mb-4">
              Pronto para transformar sua{" "}
              <span className="text-legacy-gold">governança?</span>
            </h2>
            <p className="font-lato text-lg text-white/80 max-w-xl mx-auto mb-10">
              Descubra em 2 minutos qual plano é ideal para sua empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-legacy-gold text-legacy-500 hover:brightness-110 font-montserrat font-semibold px-8 py-6 h-auto"
                onClick={handleOpenDiscovery}
              >
                <FileText className="h-5 w-5 mr-2" />
                Descobrir Meu Investimento
              </Button>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
};

export default Planos;
