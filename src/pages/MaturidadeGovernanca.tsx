import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaturityRadarChart from "@/components/MaturityRadarChart";
import { cn } from "@/lib/utils";

const MATURIDADE_DATA = [
  { name: "Sócios", score: 2.1, sectorAverage: 3.2, fullMark: 5 },
  { name: "Conselho", score: 3, sectorAverage: 2.8, fullMark: 5 },
  { name: "Diretoria", score: 4, sectorAverage: 3, fullMark: 5 },
  { name: "Órgãos de Fiscalização", score: 1, sectorAverage: 2.5, fullMark: 5 },
  { name: "Conduta e Conflitos", score: 1.75, sectorAverage: 2.7, fullMark: 5 },
];

function getMaturityLevel(score: number): { level: string; className: string } {
  if (score >= 4) return { level: "Alto", className: "bg-purple-500 text-white" };
  if (score >= 3) return { level: "Médio", className: "bg-orange-500 text-white" };
  return { level: "Baixo", className: "bg-red-500 text-white" };
}

const MaturidadeGovernanca = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("historico");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Maturidade de Governança" />
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 bg-muted">
              <TabsTrigger value="historico" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                Maturidade e Histórico
              </TabsTrigger>
              <TabsTrigger value="nova" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                Nova Avaliação
              </TabsTrigger>
            </TabsList>

            <TabsContent value="historico" className="mt-0">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Maturidade em Governança
              </h2>
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="h-80 w-full max-w-lg mx-auto mb-4">
                    <MaturityRadarChart data={MATURIDADE_DATA} variant="governanca" />
                  </div>
                  <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#9b87f5] shrink-0" />
                      <span>Sua Empresa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-teal-400/70 shrink-0" />
                      <span>Média do Setor</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MATURIDADE_DATA.map((item) => {
                  const { level, className } = getMaturityLevel(item.score);
                  const gap = item.score - item.sectorAverage;
                  const gapStr = gap >= 0 ? `+${gap.toFixed(1)}` : gap.toFixed(1);
                  return (
                    <Card key={item.name}>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-muted-foreground mb-2">
                          {item.name}
                        </div>
                        <div className="text-2xl font-bold text-foreground mb-2">
                          {item.score}
                        </div>
                        <span
                          className={cn(
                            "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                            className
                          )}
                        >
                          {level}
                        </span>
                        <div className="mt-3 text-xs text-muted-foreground border-t pt-3">
                          Setor: {item.sectorAverage} | Gap: {gapStr}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="nova" className="mt-0">
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    Inicie uma nova avaliação de maturidade em governança com base na metodologia IBGC.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/maturity-quiz")}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-legacy-500 text-white hover:bg-legacy-600 h-10 px-4 py-2"
                  >
                    Iniciar Nova Avaliação
                  </button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MaturidadeGovernanca;
