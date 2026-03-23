import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Send, Loader2, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCurrentMembro } from "@/hooks/useCurrentMembro";
import { fetchBriefingMembro } from "@/services/membroBriefing";
import { perguntarComBriefing } from "@/services/memberCopiloto";

type ChatEntry = { role: "user" | "assistant"; content: string };

const MemberCopiloto = () => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const { data: membro } = useCurrentMembro();
  const { data: briefingRes } = useQuery({
    queryKey: ["member", "briefing", membro?.id],
    queryFn: () => fetchBriefingMembro(membro!.id),
    enabled: !!membro?.id,
  });

  const briefing = briefingRes?.data ?? null;
  const temBriefing =
    briefing &&
    (briefing.resumo_executivo ||
      (briefing.perguntas_criticas?.length ?? 0) > 0 ||
      !!briefing.seu_foco ||
      !!briefing.preparacao_recomendada ||
      !!briefing.alertas_contextuais ||
      ((briefing.dados_completos as { meeting_agenda?: unknown[] })?.meeting_agenda?.length ?? 0) > 0);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = question.trim();
    if (!q || isAsking) return;

    setLastError(null);
    setChatHistory((prev) => [...prev, { role: "user", content: q }]);
    setQuestion("");
    setIsAsking(true);

    const { content, error } = await perguntarComBriefing(briefing, q);

    setIsAsking(false);
    if (error) {
      setLastError(error);
      setChatHistory((prev) => [...prev, { role: "assistant", content: `Erro: ${error}` }]);
      return;
    }
    if (content) {
      setChatHistory((prev) => [...prev, { role: "assistant", content }]);
    }
  };

  return (
    <div className="flex flex-col py-6 px-4 max-w-3xl mx-auto">
      <div className="flex flex-col items-center mb-6">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Copiloto IA</h3>
        <p className="text-sm text-muted-foreground text-center mt-1">
          {temBriefing
            ? "Faça perguntas sobre seu briefing, os temas da pauta ou governança. A IA usará seu briefing como base para sugerir abordagens."
            : "Pergunte sobre governança. Quando seu briefing estiver disponível, a IA usará seu conteúdo para respostas mais contextualizadas."}
        </p>
      </div>

      {chatHistory.length > 0 ? (
        <div className="space-y-4 mb-6">
          {chatHistory.map((entry, i) => (
            <Card key={i} className={entry.role === "user" ? "ml-8 bg-muted/30" : "mr-8"}>
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <div className="shrink-0 mt-0.5">
                    {entry.role === "user" ? (
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      {entry.role === "user" ? "Você" : "Copiloto IA"}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{entry.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder={
            temBriefing
              ? "Ex: Como devo abordar as perguntas críticas na reunião?"
              : "Faça uma pergunta sobre governança..."
          }
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            setLastError(null);
          }}
          className="flex-1 bg-muted/50"
          disabled={isAsking}
        />
        <Button type="submit" size="icon" className="shrink-0" disabled={isAsking || !question.trim()}>
          {isAsking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>

      {lastError && (
        <p className="text-sm text-destructive mt-2">Não foi possível obter resposta. Tente novamente.</p>
      )}
    </div>
  );
};

export default MemberCopiloto;
