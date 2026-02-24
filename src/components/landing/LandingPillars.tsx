import { Lightbulb, ShieldAlert, Users } from "lucide-react";

const pillars = [
  {
    icon: <Lightbulb className="h-10 w-10" />,
    title: "Clareza Decisória",
    description: "Transforme complexidade em insights acionáveis. Cada reunião com contexto estratégico pronto.",
  },
  {
    icon: <ShieldAlert className="h-10 w-10" />,
    title: "Antecipação Estratégica",
    description: "Identifique riscos antes que se tornem crises. IA monitora sinais de alerta continuamente.",
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: "Alinhamento Contínuo",
    description: "Garanta que todos decidam com a mesma base de informação. Governança sem fragmentação.",
  },
];

const LandingPillars = () => {
  return (
    <section className="py-20 bg-[hsl(210,33%,98%)]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-foreground mb-4">
            Decisões Melhores. Governança Mais Clara.
          </h2>
          <p className="font-lato text-lg text-muted-foreground">
            Três pilares que transformam a forma como conselhos operam.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-legacy-gold/10 text-legacy-gold mb-5">
                {pillar.icon}
              </div>
              <h3 className="font-montserrat text-xl font-bold text-foreground mb-3">
                {pillar.title}
              </h3>
              <p className="font-lato text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingPillars;
