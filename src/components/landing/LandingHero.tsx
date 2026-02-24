import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye } from "lucide-react";

const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <section className="legacy-gradient text-white py-24 md:py-32 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            A Inteligência por Trás das{" "}
            <span className="text-legacy-gold">Melhores Decisões</span> de Conselho
          </h1>
          <p className="font-lato text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
            Legacy OS é o primeiro Sistema Operacional de Governança Corporativa com IA nativa, 
            que monitora riscos, antecipa cenários e prioriza decisões estratégicas — transformando 
            dados dispersos em pautas inteligentes antes mesmo da reunião acontecer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="legacy-button-primary text-lg px-8 py-6 h-auto"
              onClick={() => navigate("/login")}
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              Fazer Diagnóstico Gratuito (5 min)
            </Button>
            <Button
              variant="outline"
              className="legacy-button-secondary text-lg px-8 py-6 h-auto"
              onClick={() => {
                document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Eye className="h-5 w-5 mr-2" />
              Ver Como Funciona
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
