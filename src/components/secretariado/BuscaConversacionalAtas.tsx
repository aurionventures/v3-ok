import { useState, useRef } from "react";
import { Bot, Send, Sparkles, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useEmpresas } from "@/hooks/useEmpresas";
import { buscarNasAtas } from "@/services/buscaAtas";
import type { AtaComReuniao } from "@/services/atas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const SUGESTOES_ATAS = [
  "Quais decisões foram tomadas sobre expansão internacional?",
  "Mostre as políticas de governança aprovadas",
  "Como está o planejamento de sucessão executiva?",
  "Quais riscos operacionais foram identificados?",
  "Qual o status de conformidade com LGPD e SOX?",
  "Quais pautas trataram de ESG e sustentabilidade?",
  "Resumo das deliberações sobre orçamento",
  "Encaminhamentos pendentes do último trimestre",
];

interface Mensagem {
  tipo: "assistant" | "user";
  texto: string;
  horario?: string;
  atas?: AtaComReuniao[];
}

function renderMarkdown(texto: string) {
  const lines = texto.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("## ")) {
      return <h3 key={i} className="font-semibold text-gray-900 mt-3 mb-1 first:mt-0">{line.slice(3)}</h3>;
    }
    if (line.startsWith("### ")) {
      return <h4 key={i} className="font-medium text-gray-800 mt-2 mb-0.5">{line.slice(4)}</h4>;
    }
    if (line.startsWith("- ")) {
      return <li key={i} className="ml-4">{line.slice(2)}</li>;
    }
    if (line.trim() === "") return <br key={i} />;
    return <p key={i} className="leading-relaxed">{line}</p>;
  });
}

function AtaCard({
  ata,
  onClick,
}: {
  ata: AtaComReuniao;
  onClick: () => void;
}) {
  const titulo = ata.reunioes?.titulo ?? "ATA";
  const dataStr = ata.reunioes?.data_reuniao
    ? format(new Date(ata.reunioes.data_reuniao), "dd/MM/yyyy", { locale: ptBR })
    : "—";
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors w-full"
    >
      <FileText className="h-5 w-5 shrink-0 text-gray-500" />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900 truncate">{titulo}</p>
        <p className="text-xs text-gray-500">{dataStr}</p>
      </div>
    </button>
  );
}

export function BuscaConversacionalAtas() {
  const { firstEmpresaId } = useEmpresas();
  const [pergunta, setPergunta] = useState("");
  const [viewingAta, setViewingAta] = useState<AtaComReuniao | null>(null);
  const ataPdfRef = useRef<HTMLDivElement | null>(null);
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

  const enviarPergunta = async (texto: string) => {
    const q = texto.trim();
    if (!q) return;
    setMensagens((prev) => [...prev, { tipo: "user", texto: q }]);
    setPergunta("");
    setPensando(true);

    const { resultado, atas, error } = await buscarNasAtas(q, firstEmpresaId);

    const resposta = error
      ? `Não foi possível realizar a busca: ${error}. Verifique se o Supabase está configurado e se a Edge Function \`agente-busca-atas\` está deployada.`
      : resultado;

    setMensagens((prev) => [
      ...prev,
      {
        tipo: "assistant",
        texto: resposta,
        horario: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        atas: error ? undefined : atas,
      },
    ]);
    setPensando(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enviarPergunta(pergunta);
  };

  const exportarPdf = async () => {
    const el = ataPdfRef.current;
    if (!el || !viewingAta) return;
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf().set({
        margin: 10,
        filename: `ata-${viewingAta.reunioes?.titulo ?? "ata"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }).from(el).save();
    } catch (err) {
      console.error("[BuscaConversacionalAtas] exportarPdf:", err);
    }
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
                    {msg.tipo === "assistant" && msg.texto.includes("##") ? (
                      <div className="space-y-1 text-left [&_ul]:list-disc [&_ul]:list-inside">
                        {renderMarkdown(msg.texto)}
                      </div>
                    ) : (
                      msg.texto
                    )}
                  </div>
                  {msg.horario && (
                    <span className="text-xs text-gray-400 mt-1">
                      {msg.horario}
                    </span>
                  )}
                  {msg.tipo === "assistant" && msg.atas && msg.atas.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium text-gray-600">
                        ATAs consultadas:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.atas.map((ata) => (
                          <AtaCard
                            key={ata.id}
                            ata={ata}
                            onClick={() => setViewingAta(ata)}
                          />
                        ))}
                      </div>
                    </div>
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
              Dica: Após cada busca, as ATAs consultadas aparecem como arquivos
              clicáveis. Clique para visualizar ou exportar em PDF.
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

      <Dialog
        open={!!viewingAta}
        onOpenChange={(o) => !o && setViewingAta(null)}
      >
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle>
              {viewingAta?.reunioes?.titulo ?? "ATA"}{" "}
              {viewingAta?.reunioes?.data_reuniao
                ? `— ${format(new Date(viewingAta.reunioes.data_reuniao), "dd/MM/yyyy", { locale: ptBR })}`
                : ""}
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={exportarPdf}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </DialogHeader>
          <div
            ref={ataPdfRef}
            className="flex-1 overflow-y-auto p-6 text-sm whitespace-pre-wrap bg-white"
            style={{ fontFamily: "Georgia, serif", lineHeight: 1.6 }}
          >
            {viewingAta?.conteudo ?? ""}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
