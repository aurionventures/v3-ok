import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Download, HelpCircle, FileCheck, BookOpen, FileText, Target, Lightbulb, AlertTriangle, Calendar, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCurrentMembro } from "@/hooks/useCurrentMembro";
import { fetchBriefingMembro } from "@/services/membroBriefing";

interface MemberBriefingProps {
  onProgressChange?: (progress: number) => void;
  /** ID da próxima reunião do membro – prioriza exibir o briefing dessa reunião. */
  reuniaoIdProxima?: string | null;
}

const MemberBriefing = ({ onProgressChange, reuniaoIdProxima }: MemberBriefingProps) => {
  const { data: membro } = useCurrentMembro();
  const [confirmacaoLeitura, setConfirmacaoLeitura] = useState(false);
  const [abriuAnexos, setAbriuAnexos] = useState(false);

  const { data: briefing, isLoading } = useQuery({
    queryKey: ["member", "briefing", membro?.id, reuniaoIdProxima],
    queryFn: () => fetchBriefingMembro(membro!.id, reuniaoIdProxima ?? undefined),
    enabled: !!membro?.id,
  });

  const bData = briefing?.data;
  const meetingAgendaFromData = (bData?.dados_completos as { meeting_agenda?: unknown[] })?.meeting_agenda ?? [];
  const temBriefing =
    bData &&
    (bData.resumo_executivo ||
      (bData.perguntas_criticas?.length ?? 0) > 0 ||
      !!bData.seu_foco ||
      !!bData.preparacao_recomendada ||
      !!bData.alertas_contextuais ||
      meetingAgendaFromData.length > 0);
  const progresso = temBriefing ? (confirmacaoLeitura ? 50 : 0) + (abriuAnexos ? 50 : 0) : 0;

  useEffect(() => {
    onProgressChange?.(progresso);
  }, [progresso, onProgressChange]);

  if (isLoading) {
    return (
      <div className="py-12 flex items-center justify-center gap-2 text-muted-foreground">
        <span className="animate-pulse">Carregando...</span>
      </div>
    );
  }

  if (!temBriefing) {
    return (
      <Card>
        <CardContent className="p-12 text-center text-muted-foreground">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-40" />
          <p className="font-medium text-base">Seu briefing será gerado pelo Secretariado</p>
          <p className="text-sm mt-2 max-w-md mx-auto">
            O briefing será disponibilizado aqui quando o administrador aprovar pautas sugeridas pela IA no Copiloto de Governança. Se você está alocado ao órgão da reunião, receberá a pauta e seu briefing personalizado.
          </p>
        </CardContent>
      </Card>
    );
  }

  const b = briefing!.data!;
  const perguntas = Array.isArray(b.perguntas_criticas) ? b.perguntas_criticas : [];
  const meetingAgenda = (b.dados_completos as { meeting_agenda?: Array<{ horario?: string; titulo?: string; tipo?: string; apresentador?: string; materiais?: string; perguntas?: string[]; decisao_esperada?: string; conexao?: string }> })?.meeting_agenda ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          30 min de leitura
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <p className="text-xs text-muted-foreground mb-1">Progresso de preparação</p>
            <Progress value={progresso} className="h-2" />
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
          <span className="text-sm font-medium">{progresso}%</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-xs text-muted-foreground mb-3">Confirme para atualizar seu progresso</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={confirmacaoLeitura}
                onCheckedChange={(checked) => setConfirmacaoLeitura(checked === true)}
              />
              <span className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                Confirmo que li o briefing
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={abriuAnexos}
                onCheckedChange={(checked) => setAbriuAnexos(checked === true)}
              />
              <span className="flex items-center gap-2 text-sm">
                <FileCheck className="h-4 w-4 text-muted-foreground" />
                Confirmo que abri os anexos
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      {b.titulo && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">{b.titulo}</h3>
          </CardContent>
        </Card>
      )}

      {meetingAgenda.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <List className="h-5 w-5 text-primary" />
              Temas da Pauta
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Estude os temas que serão discutidos na reunião para se preparar.
            </p>
            <div className="space-y-4">
              {meetingAgenda.map((item, idx) => (
                <div key={idx} className="rounded-lg border bg-muted/30 p-4 text-sm">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-medium">{item.titulo ?? "Item"}</span>
                    {item.tipo && (
                      <span className="rounded bg-muted px-2 py-0.5 text-xs">{item.tipo}</span>
                    )}
                    {item.horario && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {item.horario}
                      </span>
                    )}
                    {item.apresentador && (
                      <span className="text-muted-foreground">Apresentador: {item.apresentador}</span>
                    )}
                  </div>
                  {item.materiais && (
                    <p className="text-muted-foreground mb-1"><span className="font-medium">Materiais:</span> {item.materiais}</p>
                  )}
                  {item.decisao_esperada && (
                    <p className="text-muted-foreground mb-1"><span className="font-medium">Decisão esperada:</span> {item.decisao_esperada}</p>
                  )}
                  {item.conexao && (
                    <p className="text-muted-foreground mb-1"><span className="font-medium">Conexão:</span> {item.conexao}</p>
                  )}
                  {Array.isArray(item.perguntas) && item.perguntas.length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-muted-foreground space-y-0.5">
                      {item.perguntas.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {b.resumo_executivo && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Resumo Executivo</h3>
            <div className="space-y-3 text-sm text-gray-700 whitespace-pre-wrap">
              {b.resumo_executivo}
            </div>
          </CardContent>
        </Card>
      )}

      {b.seu_foco && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Seu Foco
            </h3>
            <div className="space-y-3 text-sm text-gray-700 whitespace-pre-wrap">
              {b.seu_foco}
            </div>
          </CardContent>
        </Card>
      )}

      {perguntas.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Perguntas Críticas para Você
            </h3>
            <ul className="space-y-3">
              {perguntas.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {typeof q === "string" ? q : String(q)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {b.preparacao_recomendada && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Preparação Recomendada
            </h3>
            <div className="space-y-3 text-sm text-gray-700 whitespace-pre-wrap">
              {b.preparacao_recomendada}
            </div>
          </CardContent>
        </Card>
      )}

      {b.alertas_contextuais && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Alertas Contextuais
            </h3>
            <div className="space-y-3 text-sm text-gray-700 whitespace-pre-wrap">
              {b.alertas_contextuais}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MemberBriefing;
