import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqItems = [
  {
    q: "O que é o Legacy OS?",
    a: "Legacy OS é o primeiro Sistema Operacional de Governança Corporativa com IA nativa. Ele monitora riscos, antecipa cenários e prioriza decisões estratégicas, transformando dados dispersos em pautas inteligentes para conselhos.",
  },
  {
    q: "Como a IA nativa funciona?",
    a: "A IA é construída no DNA da plataforma — não é um add-on. Ela monitora sinais de mercado, regulação e economia 24/7, identifica riscos e oportunidades, e organiza tudo em pautas priorizadas por impacto.",
  },
  {
    q: "Qual a diferença entre Legacy OS e outras soluções?",
    a: "Enquanto alternativas focam em operação e secretariado como board portals tradicionais, o Legacy OS é infraestrutura decisória para conselhos, com IA nativa e modelo de Sistema Operacional integrado.",
  },
  {
    q: "Quantos usuários posso ter?",
    a: "Todos os planos incluem usuários ilimitados. Não cobramos por assento — acreditamos que governança eficaz requer a participação de todos os stakeholders relevantes.",
  },
  {
    q: "Como funciona o onboarding?",
    a: "Oferecemos suporte premium durante o onboarding com validação contínua. Nossa equipe acompanha a configuração inicial e garante que sua governança esteja rodando com excelência.",
  },
];

const LandingFAQ = () => {
  return (
    <section id="faq" className="py-20 bg-[hsl(210,33%,98%)]">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-foreground mb-4">
              Perguntas Frequentes
            </h2>
            <p className="font-lato text-lg text-muted-foreground">
              Tire suas dúvidas sobre o Legacy OS
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card border border-border rounded-lg px-6 data-[state=open]:border-legacy-gold/30"
              >
                <AccordionTrigger className="text-left font-montserrat font-semibold text-foreground hover:text-legacy-gold transition-colors">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="font-lato text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default LandingFAQ;
