import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  FileText,
  Shield,
  AlertTriangle,
  Clock,
  FileCheck,
  ListTodo,
  Brain,
  Sparkles,
  Lightbulb,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import {
  getCurrentMaturityAssessment,
  convertStoredDataToRadarData,
} from "@/utils/maturityStorage";
import { useDashboardIndicadores } from "@/hooks/useSecretariadoIndicadores";
import { useInsightsEstrategicos } from "@/hooks/useInsightsEstrategicos";

const shortLabels: Record<string, string> = {
  "Sócios": "Sócios",
  "Conselho": "Conselho",
  "Diretoria": "Diretoria",
  "Órgãos de fiscalização e controle": "Órgãos fiscalização",
  "Conduta e conflitos de interesses": "Conduta",
  "Empresas Familiares": "Empresas Familiares",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [maturidadeData, setMaturidadeData] = useState(
    convertStoredDataToRadarData(null)
  );
  const { indicadores, hasEmpresa } = useDashboardIndicadores();
  const {
    riscos,
    ameacas,
    oportunidades,
    isLoading: insightsLoading,
    hasEmpresa: hasEmpresaInsights,
  } = useInsightsEstrategicos();

  useEffect(() => {
    const stored = getCurrentMaturityAssessment();
    setMaturidadeData(convertStoredDataToRadarData(stored));
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" />
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Desempenho do Conselho</h1>
          </div>

          {/* Row 1: Overview metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Score Maturidade</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">
                      {maturidadeData.some((d) => d.score > 0)
                        ? (maturidadeData.reduce((s, d) => s + d.score, 0) / maturidadeData.length).toFixed(1)
                        : "—"}
                      <span className="text-gray-400 font-normal"> / 5.0</span>
                    </p>
                  </div>
                  <BarChart3 className="h-5 w-5 text-blue-600 shrink-0" />
                </div>
                <Progress
                  value={
                    maturidadeData.some((d) => d.score > 0)
                      ? (maturidadeData.reduce((s, d) => s + d.score, 0) / maturidadeData.length / 5) * 100
                      : 0
                  }
                  className="h-2 mt-3 bg-blue-100 [&>div]:bg-blue-600"
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Riscos Críticos</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">{indicadores.riscosCriticos}</p>
                  </div>
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                </div>
                <Progress
                  value={indicadores.riscosCriticos > 0 ? Math.min(indicadores.riscosCriticos * 25, 100) : 0}
                  className="h-2 mt-3 bg-red-100 [&>div]:bg-red-500"
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tarefas Pendentes</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">{indicadores.tarefasPendentes}</p>
                  </div>
                  <Clock className="h-5 w-5 text-amber-500 shrink-0" />
                </div>
                <Progress
                  value={indicadores.tarefasPendentes > 0 ? Math.min(indicadores.tarefasPendentes * 10, 100) : 0}
                  className="h-2 mt-3 bg-amber-100 [&>div]:bg-amber-500"
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pautas Definidas</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">{indicadores.pautasDefinidasPct}%</p>
                  </div>
                  <FileText className="h-5 w-5 text-blue-600 shrink-0" />
                </div>
                <Progress
                  value={indicadores.pautasDefinidasPct}
                  className="h-2 mt-3 bg-blue-100 [&>div]:bg-blue-600"
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">ATAs Geradas</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">{indicadores.atasGeradasPct}%</p>
                  </div>
                  <FileCheck className="h-5 w-5 text-green-600 shrink-0" />
                </div>
                <Progress
                  value={indicadores.atasGeradasPct}
                  className="h-2 mt-3 bg-green-100 [&>div]:bg-green-600"
                />
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Tarefas, Indicadores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-gray-600" />
                  <h2 className="text-base font-semibold text-gray-900">Gestão de Tarefas</h2>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {!hasEmpresa ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">Sem empresa selecionada</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-slate-100 px-3 py-2 text-center text-slate-700">
                      <span className="text-lg font-bold">{indicadores.tarefasTotal}</span>
                      <p className="text-xs">Total</p>
                    </div>
                    <div className="rounded-lg bg-green-100 px-3 py-2 text-center text-green-700">
                      <span className="text-lg font-bold">{indicadores.tarefasResolvidas}</span>
                      <p className="text-xs">Concluídas</p>
                    </div>
                    <div className="rounded-lg bg-amber-100 px-3 py-2 text-center text-amber-700">
                      <span className="text-lg font-bold">{indicadores.tarefasPendentes}</span>
                      <p className="text-xs">Pendentes</p>
                    </div>
                    <div className="rounded-lg bg-slate-100 px-3 py-2 text-center text-slate-700">
                      <span className="text-lg font-bold">{indicadores.taxaResolucao}%</span>
                      <p className="text-xs">Resolução</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <h2 className="text-base font-semibold text-gray-900">Indicadores</h2>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {!hasEmpresa ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">Sem empresa selecionada</p>
                ) : (
                  <ul className="space-y-3">
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-600">Reuniões este mês</span>
                      <span className="font-semibold text-gray-900">{indicadores.reunioesEsteMes}</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-600">Órgãos ativos</span>
                      <span className="font-semibold text-gray-900">{indicadores.orgaosAtivos}</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-600">ATAs pendentes</span>
                      <span className="font-semibold text-gray-900">{indicadores.atasPendentes}</span>
                    </li>
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Row 3: Copiloto de Governança | IA Preditiva */}
          <Card className="border-0 shadow-sm mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-violet-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Copiloto de Governança | IA Preditiva <Sparkles className="inline h-4 w-4 text-amber-500 ml-0.5" />
                  </h2>
                </div>
                <Button
                  variant="link"
                  className="text-sm text-violet-600 h-auto p-0"
                  onClick={() => navigate("/copiloto-governanca")}
                >
                  Ver detalhes
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {!hasEmpresaInsights ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Selecione uma empresa para visualizar os insights estratégicos.
                </p>
              ) : insightsLoading ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Gerando insights com IA...
                </p>
              ) : riscos.length === 0 && ameacas.length === 0 && oportunidades.length === 0 ? (
                <div className="rounded-lg border border-dashed bg-gray-50 p-6 text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    Nenhum insight gerado. Acesse o Copiloto de Governança para que a IA analise os dados e identifique riscos, ameaças e oportunidades.
                  </p>
                  <Button
                    variant="outline"
                    className="border-violet-200 text-violet-700 hover:bg-violet-50"
                    onClick={() => navigate("/copiloto-governanca")}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Ir para Copiloto
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border border-red-100 bg-red-50/50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                            <Shield className="h-5 w-5" />
                            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 min-w-[18px] items-center justify-center rounded-full bg-red-600 px-0.5 text-[10px] font-bold text-white">
                              {riscos.length}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Riscos Estratégicos</h3>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {riscos.length > 0
                                ? riscos[0].statusTags.map((t) => t.label).join(" • ") || "—"
                                : "—"}
                            </p>
                            {riscos.length > 0 ? (
                              <>
                                <p className="text-sm text-gray-700 mt-2">{riscos[0].title}</p>
                                <ul className="mt-2 space-y-0.5 text-sm text-gray-600">
                                  {riscos[0].actions.slice(0, 2).map((a) => (
                                    <li key={a.label}>→ {a.label}</li>
                                  ))}
                                </ul>
                              </>
                            ) : (
                              <p className="text-sm text-gray-500 mt-2">Nenhum risco identificado</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-amber-100 bg-amber-50/50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                            <AlertTriangle className="h-5 w-5" />
                            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 min-w-[18px] items-center justify-center rounded-full bg-amber-600 px-0.5 text-[10px] font-bold text-white">
                              {ameacas.length}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Ameaças Operacionais</h3>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {ameacas.length > 0
                                ? ameacas[0].statusTags.map((t) => t.label).join(" • ") || "—"
                                : "—"}
                            </p>
                            {ameacas.length > 0 ? (
                              <>
                                <p className="text-sm text-gray-700 mt-2">{ameacas[0].title}</p>
                                <ul className="mt-2 space-y-0.5 text-sm text-gray-600">
                                  {ameacas[0].actions.slice(0, 2).map((a) => (
                                    <li key={a.label}>→ {a.label}</li>
                                  ))}
                                </ul>
                              </>
                            ) : (
                              <p className="text-sm text-gray-500 mt-2">Nenhuma ameaça identificada</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-blue-100 bg-blue-50/50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <Lightbulb className="h-5 w-5" />
                            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 min-w-[18px] items-center justify-center rounded-full bg-blue-600 px-0.5 text-[10px] font-bold text-white">
                              {oportunidades.length}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Oportunidades Identificadas pela IA</h3>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {oportunidades.length > 0
                                ? oportunidades[0].statusTags.map((t) => t.label).join(" • ") || "Estratégica"
                                : "—"}
                            </p>
                            {oportunidades.length > 0 ? (
                              <>
                                <p className="text-sm text-gray-700 mt-2">{oportunidades[0].title}</p>
                                <ul className="mt-2 space-y-0.5 text-sm text-gray-600">
                                  {oportunidades[0].actions.slice(0, 2).map((a) => (
                                    <li key={a.label}>→ {a.label}</li>
                                  ))}
                                </ul>
                              </>
                            ) : (
                              <p className="text-sm text-gray-500 mt-2">Nenhuma oportunidade identificada</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Row 4: Maturity charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">Maturidade Governança</h2>
                  <Button
                    variant="link"
                    className="text-sm text-blue-600 h-auto p-0"
                    onClick={() => navigate("/maturidade-governanca")}
                  >
                    Ver detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {maturidadeData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-24 shrink-0">
                        {shortLabels[item.name] ?? item.name}
                      </span>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(item.score / item.fullMark) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">
                        {item.score.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <h2 className="text-base font-semibold text-gray-900">Maturidade ESG</h2>
                  </div>
                  <Button
                    variant="link"
                    className="text-sm text-blue-600 h-auto p-0"
                    onClick={() => navigate("/esg")}
                  >
                    Ver detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Sem dados de ESG cadastrados. Acesse a página de ESG para configurar os indicadores.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
