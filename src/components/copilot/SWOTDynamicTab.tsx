import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  RefreshCw,
  Clock,
  TrendingUp,
  Target,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useDynamicSWOT } from "@/hooks/useMockCopilot";
import { SWOTQuadrant } from "./SWOTQuadrant";
import { ChangesTimeline } from "./ChangesTimeline";

export function SWOTDynamicTab() {
  const { swot, isUpdating, updateSWOT } = useDynamicSWOT();

  const handleManualUpdate = () => {
    updateSWOT("manual");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Análise SWOT Dinâmica</h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Clock className="h-4 w-4" />
            Atualizada{" "}
            {formatDistanceToNow(new Date(swot.generatedAt), {
              addSuffix: true,
              locale: ptBR,
            })}
            <Badge variant="outline" className="text-[10px]">
              {swot.triggerSource === "weekly"
                ? "Semanal"
                : swot.triggerSource === "manual"
                ? "Manual"
                : swot.triggerSource === "pre_meeting"
                ? "Pré-reunião"
                : swot.triggerSource}
            </Badge>
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleManualUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Atualizando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Agora
            </>
          )}
        </Button>
      </div>

      {/* Changes Alert */}
      {swot.changesSinceLastWeek.length > 0 && (
        <Alert className="border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-800">
          <TrendingUp className="h-4 w-4 text-indigo-600" />
          <AlertTitle className="text-indigo-700 dark:text-indigo-400">
            {swot.changesSinceLastWeek.length} Mudanças na Última Semana
          </AlertTitle>
          <AlertDescription className="mt-3">
            <ChangesTimeline changes={swot.changesSinceLastWeek} />
          </AlertDescription>
        </Alert>
      )}

      {/* SWOT Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SWOTQuadrant
          title="Forças"
          category="strength"
          items={swot.strengths}
        />
        <SWOTQuadrant
          title="Fraquezas"
          category="weakness"
          items={swot.weaknesses}
        />
        <SWOTQuadrant
          title="Oportunidades"
          category="opportunity"
          items={swot.opportunities}
        />
        <SWOTQuadrant
          title="Ameaças"
          category="threat"
          items={swot.threats}
        />
      </div>

      {/* Strategic Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            Recomendações Estratégicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {swot.strategicRecommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border"
              >
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full flex-shrink-0">
                  <Target className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <div className="text-3xl font-bold text-green-700 dark:text-green-400">
            {swot.strengths.length}
          </div>
          <div className="text-sm text-green-600/80">Forças</div>
        </Card>
        <Card className="p-4 text-center bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <div className="text-3xl font-bold text-red-700 dark:text-red-400">
            {swot.weaknesses.length}
          </div>
          <div className="text-sm text-red-600/80">Fraquezas</div>
        </Card>
        <Card className="p-4 text-center bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
            {swot.opportunities.length}
          </div>
          <div className="text-sm text-blue-600/80">Oportunidades</div>
        </Card>
        <Card className="p-4 text-center bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
          <div className="text-3xl font-bold text-orange-700 dark:text-orange-400">
            {swot.threats.length}
          </div>
          <div className="text-sm text-orange-600/80">Ameaças</div>
        </Card>
      </div>

      {/* High Impact Items Warning */}
      {(swot.threats.filter((t) => t.impact === "high").length > 0 ||
        swot.weaknesses.filter((w) => w.impact === "high").length > 0) && (
        <Alert variant="destructive" className="border-red-300 dark:border-red-700">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Pontos de Atenção</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              Existem{" "}
              {swot.threats.filter((t) => t.impact === "high").length +
                swot.weaknesses.filter((w) => w.impact === "high").length}{" "}
              itens de alto impacto que requerem atenção imediata:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              {swot.threats
                .filter((t) => t.impact === "high")
                .map((t) => (
                  <li key={t.id}>
                    <strong>Ameaça:</strong> {t.title}
                  </li>
                ))}
              {swot.weaknesses
                .filter((w) => w.impact === "high")
                .map((w) => (
                  <li key={w.id}>
                    <strong>Fraqueza:</strong> {w.title}
                  </li>
                ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default SWOTDynamicTab;




