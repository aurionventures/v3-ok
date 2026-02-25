import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, Play } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import DiagnosticoIBGCDialog from "@/components/landing/DiagnosticoIBGCDialog";

const AI_CORE_NODES = [
  { label: "Conselho de Administração", x: "15%", y: "18%" },
  { label: "Memória", x: "78%", y: "20%" },
  { label: "Decisão", x: "22%", y: "38%" },
  { label: "Conselheiros", x: "82%", y: "35%" },
  { label: "Risco", x: "88%", y: "55%" },
  { label: "Compliance", x: "75%", y: "78%" },
  { label: "Comissões", x: "50%", y: "88%" },
  { label: "Comitês", x: "18%", y: "72%" },
  { label: "Performance", x: "12%", y: "52%" },
];

const ModulosDiagnostico = () => {
  const navigate = useNavigate();
  const [assessmentOpen, setAssessmentOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0A1628]">
      <LandingNav />
      <main className="flex-1">
        {/* AI Engine CORE Hero */}
        <section className="text-white py-16 md:py-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="font-montserrat text-4xl md:text-5xl font-bold mb-6">
              AI Engine CORE
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              O cérebro da Legacy OS. Uma arquitetura multi-agentes que monitora, analisa, prioriza e gera conteúdo automaticamente. IA construída no DNA da plataforma.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                className="bg-legacy-gold text-legacy-500 hover:brightness-110 font-montserrat font-semibold px-6 py-6 h-auto"
                onClick={() => setAssessmentOpen(true)}
              >
                <Play className="h-4 w-4 mr-2 fill-current" />
                Fazer Diagnóstico Gratuito
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {[
                { value: "-93%", title: "Tempo de Preparação", sub: "De 8 horas para 30 minutos", icon: "clock" },
                { value: "85+", title: "Prompts Otimizados", sub: "Específicos para governança", icon: "brain" },
                { value: "20+", title: "Fontes Monitoradas", sub: "Economia, regulação, setor", icon: "chart" },
                { value: "50+", title: "Validações", sub: "Por líderes de governança", icon: "users" },
              ].map((s) => (
                <div key={s.title} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-white">{s.value}</p>
                  <p className="font-semibold text-white mt-1">{s.title}</p>
                  <p className="text-sm text-white/70">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Diagnóstico: banner + radial + CTA */}
        <section id="diagnostico" className="text-white py-12 md:py-20 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-legacy-gold/20 border border-legacy-gold/40 rounded-lg px-6 py-4 mb-12 text-center">
              <p className="font-semibold text-white">
                Economia estimada: R$ 180.000/ano por conselho
              </p>
              <p className="text-sm text-white/80 mt-1">
                Base: 12 reuniões/ano × 90h economizadas × R$ 2.000/h (custo total secretário executivo)
              </p>
            </div>

            <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-center mb-16">
              O núcleo invisível que governa a governança
            </h2>

            <div className="relative min-h-[420px] md:min-h-[480px] flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-2 border-white/20" />
                <div className="absolute w-36 h-36 md:w-44 md:h-44 rounded-full border-2 border-white/15" />
                <div className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white/10" />
                <div className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full bg-legacy-gold flex items-center justify-center">
                  <Brain className="h-8 w-8 md:h-10 md:w-10 text-legacy-500" />
                </div>
                <span className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 text-xs font-semibold text-white whitespace-nowrap">
                  AI Core
                </span>
              </div>
              {AI_CORE_NODES.map((node) => (
                <div
                  key={node.label}
                  className="absolute rounded-lg border border-white/20 bg-[#0A1628]/90 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
                  style={{ left: node.x, top: node.y, transform: "translate(-50%, -50%)" }}
                >
                  {node.label}
                </div>
              ))}
            </div>

            <p className="text-center text-white/90 italic text-lg md:text-xl mt-8 max-w-2xl mx-auto">
              &ldquo;A inteligência que sustenta todas as decisões&rdquo;
            </p>

            <div className="flex justify-center mt-12">
              <Button
                className="bg-legacy-gold text-legacy-500 hover:brightness-110 font-montserrat font-semibold px-8 py-6 h-auto"
                onClick={() => navigate("/login")}
              >
                Ver como a IA apoia decisões de governança
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Experimente + FAQ breve */}
        <section className="text-white py-16 px-6 border-t border-white/10">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="font-montserrat text-2xl md:text-3xl font-bold mb-4">
              Experimente o AI Engine
            </h2>
            <p className="text-white/80 mb-8">
              Faça o diagnóstico gratuito e veja o poder da IA aplicada à governança
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                className="bg-legacy-gold text-legacy-500 hover:brightness-110 font-montserrat font-semibold"
                onClick={() => setAssessmentOpen(true)}
              >
                <Play className="h-4 w-4 mr-2 fill-current" />
                Fazer Diagnóstico Gratuito
              </Button>
            </div>
          </div>
        </section>
      </main>
      <DiagnosticoIBGCDialog open={assessmentOpen} onOpenChange={setAssessmentOpen} />
      <LandingFooter />
    </div>
  );
};

export default ModulosDiagnostico;
