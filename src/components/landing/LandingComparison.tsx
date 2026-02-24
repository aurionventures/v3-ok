import { Check, X } from "lucide-react";

const rows = [
  { aspect: "Arquitetura IA", legacy: "Nativa, construída no DNA", alt: "Bolt-on, adicionada depois" },
  { aspect: "Foco Principal", legacy: "Decisão estratégica do conselho", alt: "Operação e secretariado" },
  { aspect: "Modelo", legacy: "Sistema Operacional integrado", alt: "Ferramenta isolada" },
  { aspect: "Usuários", legacy: "Ilimitados em todos os planos", alt: "Cobrança por assento" },
];

const LandingComparison = () => {
  return (
    <section id="diferenciais" className="legacy-gradient text-white py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="font-montserrat text-3xl md:text-4xl font-bold mb-4">
            O Que Nos Diferencia
          </h2>
          <p className="font-lato text-lg text-white/70">
            Comparação objetiva entre Legacy OS e alternativas tradicionais de mercado.
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/20">
                <th className="font-montserrat text-left py-4 px-4 text-white/60 font-semibold">Aspecto</th>
                <th className="font-montserrat text-left py-4 px-4 text-legacy-gold font-bold">Legacy OS</th>
                <th className="font-montserrat text-left py-4 px-4 text-white/40 font-semibold">Alternativas</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-white/10">
                  <td className="font-lato py-4 px-4 text-white/80 font-medium">{row.aspect}</td>
                  <td className="font-lato py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-legacy-gold flex-shrink-0" />
                      <span className="text-white">{row.legacy}</span>
                    </div>
                  </td>
                  <td className="font-lato py-4 px-4">
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4 text-white/30 flex-shrink-0" />
                      <span className="text-white/50">{row.alt}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default LandingComparison;
