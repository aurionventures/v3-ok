import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send } from "lucide-react";

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
      </div>
    </div>
  );
};

export default MemberCopiloto;
