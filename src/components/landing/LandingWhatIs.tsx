import { Check, X } from "lucide-react";

const LandingWhatIs = () => {
  const isItems = [
    "Infraestrutura decisória para conselhos",
    "Sistema Operacional de Governança Corporativa",
    "IA que antecipa cenários e prioriza decisões",
    "Clareza estratégica em mundo complexo",
  ];

  const isNotItems = [
    "Ferramenta operacional ou board portal tradicional",
    "Software de produtividade para secretariado",
    "Automação de tarefas administrativas",
    "Mais uma ferramenta isolada no mercado",
  ];

  return (
    <section className="py-20 bg-[hsl(210,33%,98%)]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-foreground mb-4">
            O Que a Legacy OS É — E O Que Não É
          </h2>
          <p className="font-lato text-lg text-muted-foreground max-w-2xl mx-auto">
            Posicionamento claro para decisores que buscam infraestrutura estratégica, não ferramentas operacionais.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* IS */}
          <div className="legacy-gold-card p-8">
            <h3 className="font-montserrat text-xl font-bold text-legacy-gold mb-6">Legacy OS É</h3>
            <ul className="space-y-4">
              {isItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-legacy-gold/20 p-1">
                    <Check className="h-4 w-4 text-legacy-gold" />
                  </div>
                  <span className="font-lato text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* IS NOT */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h3 className="font-montserrat text-xl font-bold text-muted-foreground mb-6">Legacy OS Não É</h3>
            <ul className="space-y-4">
              {isNotItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-destructive/10 p-1">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <span className="font-lato text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingWhatIs;
