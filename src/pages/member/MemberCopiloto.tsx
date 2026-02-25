import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send } from "lucide-react";

const SUGGESTIONS = [
  "Quais são os principais riscos da próxima reunião?",
  "Me explique o contexto da aquisição em pauta",
  "Qual deve ser minha posição sobre o plano estratégico?",
  "Resuma os pontos críticos do briefing",
];

const MemberCopiloto = () => {
  const [question, setQuestion] = useState("");

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">Como posso ajudar?</h3>
          <p className="text-sm text-muted-foreground">
            Faça perguntas sobre a próxima reunião, riscos, oportunidades ou qualquer tema de governança.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {SUGGESTIONS.map((s) => (
            <Button
              key={s}
              variant="secondary"
              size="sm"
              className="text-left max-w-full sm:max-w-[240px]"
              onClick={() => setQuestion(s)}
            >
              {s}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Faça uma pergunta sobre governança..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 bg-muted/50"
          />
          <Button size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Powered by IA - Respostas baseadas nos dados da sua empresa
        </p>
      </div>
    </div>
  );
};

export default MemberCopiloto;
