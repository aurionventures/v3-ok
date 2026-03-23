import { useState } from "react";
import { Link } from "react-router-dom";
import { X, MessageCircle, Send, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  links?: { href: string; label: string }[];
}

interface LegacyGuideChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_PROMPTS = [
  "Por onde começar?",
  "Como configuro a governança?",
  "Como gero uma pauta ou ATA?",
  "Como agendo uma reunião?",
  "Como uso o Copiloto de IA?",
];

const RESPONSE_MAP: Record<string, { text: string; links: { href: string; label: string }[] }> = {
  "por onde começar?": {
    text: "Sugiro começar pela parametrização: cadastre a estrutura societária, os documentos e depois avance para configurar os órgãos de governança.",
    links: [
      { href: "/family-structure", label: "Estrutura Societária" },
      { href: "/documents", label: "Checklist de Documentos" },
      { href: "/councils", label: "Config. de Governança" },
    ],
  },
  "como configuro a governança?": {
    text: "Configure conselhos, comitês e comissões em Config. de Governança, depois defina membros e a estrutura de reuniões.",
    links: [
      { href: "/councils", label: "Config. de Governança" },
      { href: "/agenda", label: "Agenda" },
      { href: "/secretariado", label: "Secretariado" },
    ],
  },
  "como gero uma pauta ou ata?": {
    text: "Use o Copiloto de IA para gerar pautas sugeridas ou vá ao Secretariado e, na reunião desejada, gere a pauta/ATA com IA a partir dos itens definidos.",
    links: [
      { href: "/copiloto-governanca", label: "Copiloto de IA" },
      { href: "/secretariado", label: "Secretariado" },
    ],
  },
  "como agendo uma reunião?": {
    text: "Na Agenda, crie reuniões vinculadas aos órgãos de governança. Defina data, participantes e itens da pauta.",
    links: [
      { href: "/agenda", label: "Agenda" },
      { href: "/councils", label: "Config. de Governança" },
    ],
  },
  "como uso o copiloto de ia?": {
    text: "O Copiloto gera pautas sugeridas com IA a partir de riscos e oportunidades. Aprove as pautas para enviar briefings aos membros e sincronizar com a agenda.",
    links: [
      { href: "/copiloto-governanca", label: "Copiloto de IA" },
    ],
  },
};

function findResponse(userText: string): { text: string; links: { href: string; label: string }[] } {
  const normalized = userText.trim().toLowerCase().replace(/\?/g, "");
  for (const [key, value] of Object.entries(RESPONSE_MAP)) {
    const keyNorm = key.replace(/\?/g, "").toLowerCase();
    if (normalized.includes(keyNorm) || keyNorm.includes(normalized)) return value;
  }
  return {
    text: "Olá, sou o Guia Legacy, e irei te guiar no uso da plataforma. Abaixo as opções para começar.",
    links: [
      { href: "/family-structure", label: "Estrutura Societária" },
      { href: "/documents", label: "Checklist de Documentos" },
      { href: "/councils", label: "Config. de Governança" },
      { href: "/agenda", label: "Agenda" },
      { href: "/secretariado", label: "Secretariado" },
      { href: "/copiloto-governanca", label: "Copiloto de IA" },
    ],
  };
}

const LegacyGuideChat = ({ isOpen, onClose }: LegacyGuideChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const response = findResponse(trimmed);
    if (response) {
      setTimeout(() => {
        const assistantMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: response.text,
          links: response.links,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }, 400);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/25 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-[360px] sm:w-[400px] bg-card border-l shadow-xl z-50",
          "flex flex-col animate-in slide-in-from-right duration-300"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-base">Guia da Plataforma</h2>
              <p className="text-xs text-muted-foreground">Como posso ajudar?</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Escolha uma pergunta ou digite a sua para que eu te guie na jornada da Legacy:
              </p>
              <div className="flex flex-col gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className={cn(
                      "flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg",
                      "border border-border bg-muted/30 hover:bg-muted/60",
                      "text-sm font-medium transition-colors"
                    )}
                  >
                    <span className="flex-1">{prompt}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col gap-2",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[90%] rounded-2xl px-4 py-2.5 text-sm",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {msg.text}
                  </div>
                  {msg.links && msg.links.length > 0 && (
                    <div className="flex flex-wrap gap-2 max-w-[90%]">
                      {msg.links.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={onClose}
                          className={cn(
                            "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg",
                            "text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20",
                            "transition-colors"
                          )}
                        >
                          {link.label}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 min-w-0 px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" size="icon" className="shrink-0" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </aside>
    </>
  );
};

export default LegacyGuideChat;
