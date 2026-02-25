import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SUGESTOES_ATAS = [
  "Quais decisões foram tomadas sobre expansão internacional?",
  "Mostre as políticas de governança aprovadas",
  "Como está o planejamento de sucessão executiva?",
  "Quais riscos operacionais foram identificados?",
  "Qual o status de conformidade com LGPD e SOX?",
  "Quantos casos de ética foram analisados?",
];

interface Mensagem {
  tipo: "assistant" | "user";
  texto: string;
  horario?: string;
}

export function BuscaConversacionalAtas() {
  const [pergunta, setPergunta] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      tipo: "assistant",
      texto:
        "Olá! Sou seu assistente de busca em ATAs. Pergunte sobre qualquer tema, decisão ou pauta discutida nas reuniões.",
      horario: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [pensando, setPensando] = useState(false);

  const enviarPergunta = (texto: string) => {
    const q = texto.trim();
    if (!q) return;
    setMensagens((prev) => [
      ...prev,
      { tipo: "user", texto: q },
    ]);
    setPergunta("");
    setPensando(true);
    setTimeout(() => {
      setMensagens((prev) => [
        ...prev,
        {
          tipo: "assistant",
          texto:
            "Em breve você poderá consultar as ATAs por aqui. Por enquanto, utilize a Biblioteca para acessar os documentos completos.",
          horario: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setPensando(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enviarPergunta(pergunta);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Busca conversacional em ATAs
        </h2>
        <p className="text-sm text-gray-500">
          Pesquise e consulte temas, decisões e pautas discutidas nas reuniões.
        </p>
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-0">
          <div className="min-h-[320px] max-h-[420px] overflow-y-auto p-4 space-y-4">
            {mensagens.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2",
                  msg.tipo === "user" && "flex-row-reverse"
                )}
              >
                {msg.tipo === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.tipo === "user" && "items-end"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm",
                      msg.tipo === "assistant"
                        ? "bg-gray-100 text-gray-900 border border-gray-200"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {msg.texto}
                  </div>
                  {msg.horario && (
                    <span className="text-xs text-gray-400 mt-1">
                      {msg.horario}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {pensando && (
              <div className="flex gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-lg px-3 py-2 text-sm bg-gray-100 border border-gray-200 text-gray-500">
                  Pesquisando nas ATAs...
                </div>
              </div>
            )}
          </div>

          <div className="border-t p-4 space-y-3">
            <p className="text-xs text-gray-500">
              Dica: Clique nos cards de ATA na Biblioteca para visualizar o
              documento completo.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="Pergunte sobre qualquer tema nas ATAs... Ex: 'Quais decisões foram tomadas sobre ESG?'"
                value={pergunta}
                onChange={(e) => setPergunta(e.target.value)}
                className="flex-1"
                disabled={pensando}
              />
              <Button type="submit" size="icon" disabled={pensando}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 w-full">Sugestões:</span>
              {SUGESTOES_ATAS.map((s) => (
                <Button
                  key={s}
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="text-xs h-8 rounded-full font-normal"
                  onClick={() => enviarPergunta(s)}
                  disabled={pensando}
                >
                  <Sparkles className="h-3 w-3 mr-1 shrink-0" />
                  {s.length > 45 ? s.slice(0, 45) + "..." : s}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
