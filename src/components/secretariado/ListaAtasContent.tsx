import React, { useEffect, useState } from "react";
import { FileText, Printer, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchAtas, type AtaComReuniao } from "@/services/atas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ListaAtasContent() {
  const [atas, setAtas] = useState<AtaComReuniao[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<AtaComReuniao | null>(null);

  useEffect(() => {
    fetchAtas().then(({ data }) => {
      setAtas(data);
      setLoading(false);
    });
  }, []);

  const handlePrint = (ata: AtaComReuniao) => {
    const titulo = (ata as AtaComReuniao).reunioes?.titulo ?? "ATA";
    const dataReuniao = (ata as AtaComReuniao).reunioes?.data_reuniao;
    const conteudo = ata.conteudo ?? "";
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>ATA - ${titulo}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Georgia', serif; font-size: 12pt; line-height: 1.6; color: #1a1a1a; max-width: 21cm; margin: 0 auto; padding: 2cm; }
            h1 { font-size: 18pt; margin-bottom: 0.5rem; }
            .meta { font-size: 10pt; color: #666; margin-bottom: 1.5rem; }
            .conteudo { white-space: pre-wrap; }
            @media print { body { padding: 1.5cm; } }
          </style>
        </head>
        <body>
          <h1>ATA - ${titulo}</h1>
          <p class="meta">${dataReuniao ? format(new Date(dataReuniao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "—"}</p>
          <div class="conteudo">${conteudo.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Biblioteca de ATAs</h2>
      <p className="text-sm text-muted-foreground">
        ATAs geradas e salvas. Clique para visualizar ou imprimir.
      </p>
      {atas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma ATA salva ainda.</p>
            <p className="text-sm mt-1">
              Gere uma ATA na Agenda (Gestão da Reunião) e clique em &quot;Salvar na biblioteca de ATAs&quot;.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {atas.map((ata) => {
            const reuniao = ata.reunioes;
            const titulo = reuniao?.titulo ?? "Reunião";
            const dataStr = reuniao?.data_reuniao
              ? format(new Date(reuniao.data_reuniao), "dd/MM/yyyy", { locale: ptBR })
              : "—";
            return (
              <Card key={ata.id} className="hover:bg-muted/30 transition-colors">
                <CardContent className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-10 w-10 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{titulo}</p>
                      <p className="text-sm text-muted-foreground">{dataStr}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewing(ata)}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrint(ata)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle>
              {viewing?.reunioes?.titulo ?? "ATA"}{" "}
              {viewing?.reunioes?.data_reuniao
                ? `— ${format(new Date(viewing.reunioes.data_reuniao), "dd/MM/yyyy", { locale: ptBR })}`
                : ""}
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => viewing && handlePrint(viewing)}
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 text-sm whitespace-pre-wrap">
            {viewing?.conteudo ?? ""}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
