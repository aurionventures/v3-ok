import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useEmpresas } from "@/hooks/useEmpresas";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaturityRadarChart from "@/components/MaturityRadarChart";
import { cn } from "@/lib/utils";
import {
  getCurrentMaturityAssessment,
  getMaturityHistory,
  convertStoredDataToRadarData,
  clearMaturityData,
  type StoredMaturityAssessment,
} from "@/utils/maturityStorage";
import {
  upsertDiagnosticoMaturidade,
  fetchDiagnosticoMaturidade,
  fetchDiagnosticosHistory,
  deleteDiagnosticosMaturidade,
} from "@/services/maturidade";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Trash2, Gauge } from "lucide-react";

function getMaturityLevel(score: number): { level: string; className: string } {
  if (score >= 4) return { level: "Alto", className: "bg-purple-500 text-white" };
  if (score >= 3) return { level: "Médio", className: "bg-orange-500 text-white" };
  return { level: "Baixo", className: "bg-red-500 text-white" };
}

const shortLabels: Record<string, string> = {
  "Sócios": "Sócios",
  "Conselho": "Conselho",
  "Diretoria": "Diretoria",
  "Órgãos de fiscalização e controle": "Órgãos fiscalização",
  "Conduta e conflitos de interesses": "Conduta",
  "Empresas Familiares": "Empresas Familiares",
};

const MaturidadeGovernanca = () => {
  const navigate = useNavigate();
  const { firstEmpresaId } = useEmpresas();
  const [activeTab, setActiveTab] = useState("historico");
  const [maturidadeData, setMaturidadeData] = useState(
    convertStoredDataToRadarData(null)
  );

  const [historyData, setHistoryData] = useState<{ data: string; pontuacao: number; fullDate: Date }[]>([]);
  const [historyAssessments, setHistoryAssessments] = useState<StoredMaturityAssessment[]>([]);
  const [overallScore, setOverallScore] = useState<{ score: number; estagio: string } | null>(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);

  const loadAssessment = (stored: StoredMaturityAssessment | null) => {
    setMaturidadeData(convertStoredDataToRadarData(stored));
    if (stored?.result) {
      const score = Math.round(stored.result.pontuacao_total * 5 * 10) / 10;
      setOverallScore({ score, estagio: stored.result.estagio });
    } else {
      setOverallScore(null);
    }
    setSelectedAssessmentId(stored?.id ?? null);
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!firstEmpresaId) {
        const stored = getCurrentMaturityAssessment();
        loadAssessment(stored);
        const history = getMaturityHistory();
        const sorted = [...history].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setHistoryData(
          sorted.map((a) => ({
            data: new Intl.DateTimeFormat("pt-BR", {
              month: "short",
              year: "numeric",
            }).format(new Date(a.timestamp)),
            pontuacao: Math.round(a.result.pontuacao_total * 5 * 10) / 10,
            fullDate: new Date(a.timestamp),
          }))
        );
        setHistoryAssessments(sorted);
        return;
      }

      const [dbStored, dbHistory] = await Promise.all([
        fetchDiagnosticoMaturidade(firstEmpresaId),
        fetchDiagnosticosHistory(firstEmpresaId),
      ]);

      if (cancelled) return;

      if (dbStored || dbHistory.length > 0) {
        const stored = dbStored ?? dbHistory[0];
        loadAssessment(stored);
        const sorted = [...dbHistory].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setHistoryData(
          sorted.map((a) => ({
            data: new Intl.DateTimeFormat("pt-BR", {
              month: "short",
              year: "numeric",
            }).format(new Date(a.timestamp)),
            pontuacao: Math.round(a.result.pontuacao_total * 5 * 10) / 10,
            fullDate: new Date(a.timestamp),
          }))
        );
        setHistoryAssessments(sorted);
      } else {
        const stored = getCurrentMaturityAssessment();
        loadAssessment(stored);
        if (stored) {
          upsertDiagnosticoMaturidade(firstEmpresaId, stored).then(({ error }) => {
            if (error) console.warn("[MaturidadeGovernanca] sync to DB:", error);
          });
        }
        const history = getMaturityHistory();
        const sorted = [...history].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setHistoryData(
          sorted.map((a) => ({
            data: new Intl.DateTimeFormat("pt-BR", {
              month: "short",
              year: "numeric",
            }).format(new Date(a.timestamp)),
            pontuacao: Math.round(a.result.pontuacao_total * 5 * 10) / 10,
            fullDate: new Date(a.timestamp),
          }))
        );
        setHistoryAssessments(sorted);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [activeTab, firstEmpresaId]);

  const hasData = maturidadeData.some((d) => d.score > 0);

  const handleClearData = async () => {
    if (!window.confirm("Tem certeza que deseja limpar todos os dados de diagnóstico? Será necessário preencher novamente.")) return;
    clearMaturityData();
    if (firstEmpresaId) {
      const { error } = await deleteDiagnosticosMaturidade(firstEmpresaId);
      if (error) console.warn("[MaturidadeGovernanca] delete from DB:", error);
    }
    setMaturidadeData(convertStoredDataToRadarData(null));
    setHistoryData([]);
    setHistoryAssessments([]);
    setOverallScore(null);
    setSelectedAssessmentId(null);
  };

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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Maturidade em Governança
                </h2>
                {hasData && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearData}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpar dados
                  </Button>
                )}
              </div>
              {!hasData ? (
                <Card className="mb-6">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      Nenhum diagnóstico registrado. Inicie uma avaliação para visualizar o radar de maturidade.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate("/maturity-quiz")}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-legacy-500 text-white hover:bg-legacy-600 h-10 px-4 py-2"
                    >
                      Iniciar Diagnóstico
                    </button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <div className="h-80 w-full max-w-lg mx-auto mb-4">
                        <MaturityRadarChart data={maturidadeData} variant="governanca" />
                      </div>
                      <div className="flex justify-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-[#9b87f5] shrink-0" />
                          <span>Sua Empresa</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {overallScore && (
                    <Card className="mb-6 border-2 border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                          <div className="flex items-center gap-3 shrink-0">
                            <div className={cn(
                              "flex h-16 w-16 items-center justify-center rounded-full",
                              getMaturityLevel(overallScore.score).className
                            )}>
                              <Gauge className="h-8 w-8" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Score de Maturidade</p>
                              <p className="text-3xl font-bold text-foreground">{overallScore.score.toFixed(1)}<span className="text-lg font-normal text-muted-foreground">/5.0</span></p>
                            </div>
                          </div>
                          <div className="flex-1 flex flex-wrap items-center gap-2 sm:gap-4">
                            <span className={cn(
                              "inline-block px-3 py-1.5 rounded-full text-sm font-medium",
                              getMaturityLevel(overallScore.score).className
                            )}>
                              {getMaturityLevel(overallScore.score).level}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Estágio: <strong className="text-foreground">{overallScore.estagio}</strong>
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {maturidadeData.map((item) => {
                      const { level, className } = getMaturityLevel(item.score);
                      return (
                        <Card key={item.name}>
                          <CardContent className="p-4">
                            <div className="text-sm font-medium text-muted-foreground mb-2">
                              {item.name}
                            </div>
                            <div className="text-2xl font-bold text-foreground mb-2">
                              {item.score.toFixed(1)}
                            </div>
                            <span
                              className={cn(
                                "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                                className
                              )}
                            >
                              {level}
                            </span>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {historyData.length > 0 && (
                    <Card className="mt-8">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                          Evolução da Maturidade ao Longo do Tempo
                        </h3>
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={historyData}
                              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                            >
                              <defs>
                                <linearGradient id="colorPontuacao" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis
                                dataKey="data"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                              />
                              <YAxis
                                domain={[0, 5]}
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                              />
                              <Tooltip
                                formatter={(value: number) => [`${value}/5.0`, "Pontuação"]}
                                labelFormatter={(label) => `Período: ${label}`}
                              />
                              <Area
                                type="monotone"
                                dataKey="pontuacao"
                                stroke="#7c3aed"
                                strokeWidth={2}
                                fill="url(#colorPontuacao)"
                                dot={{ r: 4, fill: "#7c3aed" }}
                                activeDot={{ r: 6 }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Escala de 0 a 5. Quanto maior, mais avançada a maturidade em governança.
                        </p>

                        <div className="mt-6 pt-4 border-t">
                          <h4 className="text-sm font-semibold text-foreground mb-3">
                            Histórico de avaliações (clique para visualizar)
                          </h4>
                          <ul className="space-y-2">
                            {[...historyAssessments].reverse().map((a) => {
                              const score = Math.round(a.result.pontuacao_total * 5 * 10) / 10;
                              const dataLabel = new Intl.DateTimeFormat("pt-BR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }).format(new Date(a.timestamp));
                              const isSelected = selectedAssessmentId === a.id;
                              const dims = a.result?.pontuacao_dimensoes ?? {};
                              return (
                                <li key={a.id}>
                                  <button
                                    type="button"
                                    onClick={() => loadAssessment(a)}
                                    className={cn(
                                      "w-full text-left rounded-lg border p-3 transition-colors hover:bg-muted/50",
                                      isSelected
                                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                        : "border-border bg-card"
                                    )}
                                  >
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                      <span className="font-medium text-foreground">
                                        {dataLabel}
                                      </span>
                                      <span className="text-sm text-muted-foreground">
                                        Score: <strong className="text-foreground">{score}/5.0</strong>
                                      </span>
                                      <span className={cn(
                                        "text-xs font-medium px-2 py-0.5 rounded-full",
                                        getMaturityLevel(score).className
                                      )}>
                                        {getMaturityLevel(score).level}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {Object.entries(dims).map(([nome, percentual]) => {
                                        const s = Number.isFinite(percentual) ? percentual * 5 : 0;
                                        return (
                                          <span
                                            key={nome}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              loadAssessment(a);
                                            }}
                                            className="inline-flex items-center gap-1 rounded-md bg-muted/80 px-2 py-0.5 text-xs font-medium text-foreground cursor-pointer hover:bg-muted"
                                          >
                                            {shortLabels[nome] ?? nome}: {s.toFixed(1)}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
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
