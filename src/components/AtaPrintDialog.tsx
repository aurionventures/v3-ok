import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Save } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AtaPrintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titulo: string;
  dataReuniao: Date | null;
  conteudo: string;
  onSave?: () => Promise<void>;
  saving?: boolean;
}

const AtaPrintDialog: React.FC<AtaPrintDialogProps> = ({
  open,
  onOpenChange,
  titulo,
  dataReuniao,
  conteudo,
  onSave,
  saving,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
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
          <p class="meta">${dataReuniao ? format(dataReuniao, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "—"}</p>
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 print:max-w-none print:max-h-none print:h-auto">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0 print:hidden">
          <DialogTitle className="text-xl">Pauta/ATA da Reunião</DialogTitle>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            {onSave && (
              <Button size="sm" onClick={onSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar na biblioteca de ATAs"}
              </Button>
            )}
          </div>
        </DialogHeader>
        <div
          ref={contentRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 bg-white print:p-8 print:overflow-visible"
        >
          <style>{`
            @media print {
              @page { size: A4; margin: 2cm; }
              body * { visibility: hidden; }
              [data-ata-print], [data-ata-print] * { visibility: visible; }
              [data-ata-print] { position: absolute; left: 0; top: 0; width: 100%; }
            }
          `}</style>
          <div data-ata-print className="ata-pagina">
            <h1 className="text-xl font-semibold mb-1">{titulo}</h1>
            <p className="text-sm text-muted-foreground mb-6">
              {dataReuniao ? format(dataReuniao, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "—"}
            </p>
            <div className="text-sm whitespace-pre-wrap leading-relaxed">{conteudo}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AtaPrintDialog;
