import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain,
  Send,
  User,
  Sparkles,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAICopilotChat } from "@/hooks/useMockCopilot";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CopilotChatProps {
  meetingId?: string;
  className?: string;
}

const suggestedQuestions = [
  "Quais são os principais riscos da próxima reunião?",
  "Me explique o contexto da aquisição em pauta",
  "Qual deve ser minha posição sobre o plano estratégico?",
  "Resuma os pontos críticos do briefing",
];

export function CopilotChat({ meetingId, className }: CopilotChatProps) {
  const { messages, isLoading, sendMessage, clearMessages } = useAICopilotChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (question: string) => {
    sendMessage(question);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className={cn("flex flex-col h-[500px]", className)}>
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <Brain className="h-4 w-4 text-white" />
            </div>
            Copiloto de Governança
          </CardTitle>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              className="text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 mb-4">
                <Sparkles className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-lg mb-2">
                Como posso ajudar?
              </h4>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                Faça perguntas sobre a próxima reunião, riscos, oportunidades ou
                qualquer tema de governança.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedQuestions.map((q, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleSuggestionClick(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="p-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 h-8 w-8 flex items-center justify-center flex-shrink-0">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      message.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div
                      className={cn(
                        "flex items-center justify-between mt-2 pt-2 border-t",
                        message.role === "user"
                          ? "border-white/20"
                          : "border-border"
                      )}
                    >
                      <span
                        className={cn(
                          "text-[10px]",
                          message.role === "user"
                            ? "text-white/60"
                            : "text-muted-foreground"
                        )}
                      >
                        {format(new Date(message.timestamp), "HH:mm", {
                          locale: ptBR,
                        })}
                      </span>

                      {message.role === "assistant" && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(message.content)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-green-600"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-600"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <div className="p-2 rounded-full bg-muted h-8 w-8 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 h-8 w-8 flex items-center justify-center">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Analisando...
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Faça uma pergunta sobre governança..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Powered by IA - Respostas baseadas nos dados da sua empresa
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default CopilotChat;




