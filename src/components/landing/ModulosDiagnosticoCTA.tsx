import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Play } from "lucide-react";

const MODULOS_PATH = "/modulos/ai-engine/governanca/diagnostico";

const ModulosDiagnosticoCTA = () => {
  const navigate = useNavigate();

  return (
    <section id="faq" className="py-20 bg-[#0A1628] text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-legacy-gold/20 text-legacy-gold mb-6">
            <Brain className="h-8 w-8" />
          </div>
          <h2 className="font-montserrat text-3xl md:text-4xl font-bold mb-4">
            Módulos: AI Engine, Governança, Diagnóstico
          </h2>
          <p className="font-lato text-lg text-white/80 mb-8">
            O núcleo invisível que governa a governança. Conheça o AI Engine CORE e faça o diagnóstico gratuito para ver como a IA apoia decisões de governança.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="bg-legacy-gold text-legacy-500 hover:brightness-110 font-montserrat font-semibold px-6 py-6 h-auto"
              onClick={() => navigate(MODULOS_PATH)}
            >
              <Play className="h-4 w-4 mr-2 fill-current" />
              Fazer Diagnóstico Gratuito
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModulosDiagnosticoCTA;
