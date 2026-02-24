import { Radar, TrendingUp, Globe, ListOrdered } from "lucide-react";

const features = [
  {
    icon: <Radar className="h-8 w-8" />,
    title: "Monitoramento Contínuo",
    description: "IA construída no DNA da plataforma monitora sinais de mercado, regulação e economia 24/7.",
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Antecipação de Cenários",
    description: "Identifica riscos e oportunidades antes que se tornem urgentes para o conselho.",
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Visão 360° Integrada",
    description: "Consolida dados dispersos em insights acionáveis com contexto estratégico completo.",
  },
  {
    icon: <ListOrdered className="h-8 w-8" />,
    title: "Priorização Inteligente",
    description: "Transforma complexidade em pautas claras com decisões ordenadas por impacto.",
  },
];

const LandingFeatures = () => {
  return (
    <section id="como-funciona" className="legacy-gradient text-white py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="font-montserrat text-3xl md:text-4xl font-bold mb-4">
            IA Nativa: O Diferencial Fundamental
          </h2>
          <p className="font-lato text-lg text-white/70 max-w-3xl mx-auto">
            Não é IA "bolt-on" adicionada depois. É inteligência artificial construída no DNA da plataforma desde o primeiro dia, 
            pensada para decisores de alto nível.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              className="legacy-gold-card p-6 hover:border-legacy-gold/50 transition-all group"
            >
              <div className="text-legacy-gold mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-montserrat text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="font-lato text-sm text-white/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
