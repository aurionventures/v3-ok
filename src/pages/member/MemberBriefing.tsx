import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Download, HelpCircle, FileCheck, BookOpen, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCurrentMembro } from "@/hooks/useCurrentMembro";
import { fetchBriefingMembro } from "@/services/membroBriefing";

const MemberBriefing = () => {
  const { data: membro } = useCurrentMembro();
  const [confirmacaoLeitura, setConfirmacaoLeitura] = useState(false);
  const [abriuAnexos, setAbriuAnexos] = useState(false);

  const { data: briefing, isLoading } = useQuery({
    queryKey: ["member", "briefing", membro?.id],
    queryFn: () => fetchBriefingMembro(membro!.id),
    enabled: !!membro?.id,
  });

  const temBriefing = briefing?.data && (briefing.data.resumo_executivo || (briefing.data.perguntas_criticas?.length ?? 0) > 0);
  const progresso = temBriefing ? (confirmacaoLeitura ? 50 : 0) + (abriuAnexos ? 50 : 0) : 0;

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
            O briefing de preparação para as reuniões será disponibilizado aqui assim que for gerado pela área administrativa.
          </p>
        </CardContent>
      </Card>
    );
  }

  const b = briefing!.data!;
  const perguntas = Array.isArray(b.perguntas_criticas) ? b.perguntas_criticas : [];

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
    </div>
  );
};

export default MemberBriefing;
