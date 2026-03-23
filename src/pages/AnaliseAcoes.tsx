import React, { useState } from "react";
import { FileText, Users, AlertTriangle, Loader2, Play } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useDocumentos } from "@/hooks/useDocumentos";
import { useEntrevistas } from "@/hooks/useEntrevistas";
import { useAnaliseAcoes } from "@/hooks/useAnaliseAcoes";
import type { AnaliseAcoesResult } from "@/types/analiseAcoes";
import { mapSeveridade } from "@/types/analiseAcoes";

type SeveridadeUI = "Alta" | "Média" | "Baixa";

function SeverityBadge({ severity }: { severity: SeveridadeUI }) {
  const styles =
    severity === "Alta"
      ? "bg-red-100 text-red-800"
      : severity === "Média"
        ? "bg-orange-100 text-orange-800"
        : "bg-green-100 text-green-800";
  return <Badge variant="secondary" className={styles}>{severity}</Badge>;
}

const AnaliseAcoes = () => {
  const [resultado, setResultado] = useState<AnaliseAcoesResult | null>(null);

  const { empresas, firstEmpresaId } = useEmpresas();
  const empresaId = firstEmpresaId;
  const { documentos } = useDocumentos(empresaId);
  const { entrevistas } = useEntrevistas(empresaId);
  const { executar, isLoading: analyzing } = useAnaliseAcoes();

  const hasEmpresas = empresas.length > 0;
  const docsComTranscricao = entrevistas.filter((e) => e.transcricao).length;
  const podeAnalisar = documentos.length > 0 || docsComTranscricao > 0;

  const handleExecutarAnalise = async () => {
    if (!podeAnalisar) {
      toast({ title: "Sem dados para analisar", description: "Cadastre documentos (contratos) e/ou entrevistas com transcrição.", variant: "destructive" });
      return;
    }
    const { data, error } = await executar({ documentos, entrevistas });
    if (error) {
      toast({ title: "Erro na análise", description: error, variant: "destructive" });
      return;
    }
    if (data) {
      setResultado(data);
      toast({ title: "Análise concluída" });
    }
  };

  const resumo = resultado?.resumoExecutivo;
  const incongruencias = resultado?.incongruencias ?? [];
  const gapsCategorias = resultado?.gapsCategorias ?? [];
  const acoes = resultado?.planoAcao?.acoes ?? [];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Análise e Ações" />
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-center text-muted-foreground mb-6 max-w-2xl mx-auto">
            Analise documentos do checklist (contratos) e entrevistas para identificar incongruências, gaps e gerar plano de ação.
          </p>

          {!hasEmpresas ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p className="font-medium">Nenhuma empresa cadastrada</p>
                <p className="text-sm mt-1">Cadastre uma empresa para executar a análise.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <Button
                  size="lg"
                  className="bg-legacy-500 hover:bg-legacy-600 text-white gap-2"
                  onClick={handleExecutarAnalise}
                  disabled={!podeAnalisar || analyzing}
                >
                  {analyzing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                  {analyzing ? "Executando análise..." : "Executar Análise"}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-6 text-center">
                {documentos.length} documento(s) • {docsComTranscricao} entrevista(s) com transcrição
              </p>

              {!resultado && !analyzing && (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">Nenhuma análise executada</p>
                    <p className="text-sm mt-1">
                      Clique em &quot;Executar Análise&quot; para analisar documentos e entrevistas com IA.
                    </p>
                  </CardContent>
                </Card>
              )}

              {resultado && (
                <>
                  <Card className="mb-6">
                    <CardHeader>
                      <h2 className="text-lg font-semibold">Resumo Executivo</h2>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-medium">Status dos Documentos</h3>
                          </div>
                          {resumo?.statusDocumentos ? (
                            <>
                              <p className="text-sm text-muted-foreground mb-4">
                                Completos: {resumo.statusDocumentos.completos} • Incompletos: {resumo.statusDocumentos.incompletos} • Divergentes: {resumo.statusDocumentos.divergentes}
                              </p>
                              <div className="space-y-2">
                                <p className="text-sm"><span className="font-medium text-green-600">Completos:</span> {resumo.statusDocumentos.completos}</p>
                                <p className="text-sm"><span className="font-medium text-orange-600">Incompletos:</span> {resumo.statusDocumentos.incompletos}</p>
                                <p className="text-sm"><span className="font-medium text-red-600">Divergentes:</span> {resumo.statusDocumentos.divergentes}</p>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">Dados não disponíveis</p>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-medium">Análise das Entrevistas</h3>
                          </div>
                          {resumo?.analiseEntrevistas ? (
                            <>
                              <div className="space-y-2 mb-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Alinhamento geral</span>
                                  <span className="text-sm font-medium text-green-600">{resumo.analiseEntrevistas.alinhamentoGeral}%</span>
                                </div>
                                <Progress value={resumo.analiseEntrevistas.alinhamentoGeral} className="h-2" />
                              </div>
                              <div className="flex gap-4 mt-4">
                                <span className="text-sm text-muted-foreground">{resumo.analiseEntrevistas.totalEntrevistas} Entrevistas</span>
                                <span className="text-sm"><span className="font-medium text-red-600">{resumo.analiseEntrevistas.totalConflitos} Conflitos</span></span>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">Dados não disponíveis</p>
                          )}
                          {(resumo?.governanceHealthScore != null || resumo?.nivelRiscoGeral) && (
                            <div className="mt-4 pt-4 border-t space-y-2">
                              {resumo?.governanceHealthScore != null && (
                                <>
                                  <p className="text-sm font-medium">Governance Health Score</p>
                                  <p className="text-2xl font-bold text-legacy-500">{resumo.governanceHealthScore}/100</p>
                                </>
                              )}
                              {resumo?.nivelRiscoGeral && (
                                <div>
                                  <p className="text-sm font-medium">Nível de Risco Geral</p>
                                  <Badge
                                    variant="secondary"
                                    className={
                                      resumo.nivelRiscoGeral === "crítico"
                                        ? "bg-red-100 text-red-800"
                                        : resumo.nivelRiscoGeral === "alto"
                                          ? "bg-orange-100 text-orange-800"
                                          : resumo.nivelRiscoGeral === "médio"
                                            ? "bg-amber-100 text-amber-800"
                                            : "bg-green-100 text-green-800"
                                    }
                                  >
                                    {resumo.nivelRiscoGeral.charAt(0).toUpperCase() + resumo.nivelRiscoGeral.slice(1)}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          <h2 className="text-lg font-semibold">Mapa de Incongruências</h2>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {incongruencias.length > 0 ? (
                          <ul className="space-y-4">
                            {incongruencias.map((item, i) => (
                              <li key={i} className="border-b pb-4 last:border-0 last:pb-0">
                                <p className="text-sm font-medium text-foreground mb-2">{item.titulo}</p>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {item.refs?.map((ref, j) => (
                                    <span key={j} className="text-xs text-muted-foreground flex items-center gap-1">
                                      <FileText className="h-3 w-3" />
                                      {ref}
                                    </span>
                                  ))}
                                </div>
                                {item.recomendacao && <p className="text-xs text-muted-foreground mb-2">{item.recomendacao}</p>}
                                <SeverityBadge severity={mapSeveridade(item.severidade)} />
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">Nenhuma incongruência identificada.</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <h2 className="text-lg font-semibold">Gaps de Documentação</h2>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {gapsCategorias.length > 0 ? (
                          <ul className="space-y-4">
                            {gapsCategorias.map((cat, i) => (
                              <li key={i} className="border-b pb-4 last:border-0 last:pb-0">
                                <p className="text-sm font-medium text-foreground mb-2">{cat.categoria}</p>
                                <ul className="list-disc list-inside text-sm text-muted-foreground mb-2 space-y-1">
                                  {cat.items?.map((item, j) => (
                                    <li key={j}>{item}</li>
                                  ))}
                                </ul>
                                <SeverityBadge severity={mapSeveridade(cat.severidade)} />
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">Nenhum gap identificado.</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {acoes.length > 0 && (
                    <Card className="mt-6">
                      <CardHeader>
                        <h2 className="text-lg font-semibold">Plano de Ação</h2>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          {acoes.map((a, i) => (
                            <li key={i} className="border-b pb-4 last:border-0 last:pb-0">
                              <p className="font-medium">{a.titulo}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline">{a.prazo}</Badge>
                                <Badge variant="secondary">{a.categoria}</Badge>
                                {a.responsavelSugerido && <span className="text-sm text-muted-foreground">Responsável: {a.responsavelSugerido}</span>}
                              </div>
                              {a.metricasSucesso && <p className="text-xs text-muted-foreground mt-2">{a.metricasSucesso}</p>}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {resultado?.raw && typeof resultado.raw === "string" && (
                    <Card className="mt-6">
                      <CardHeader>
                        <h2 className="text-lg font-semibold">Resposta Completa (IA)</h2>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs whitespace-pre-wrap bg-muted/50 p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">{resultado.raw}</pre>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnaliseAcoes;
