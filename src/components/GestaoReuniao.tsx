import React from "react";
import { Check, X, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  deriveChecklist,
  allChecksDone,
  type ReuniaoGestao,
} from "@/types/gestaoReuniao";
import { cn } from "@/lib/utils";

const CHECK_ITEMS: {
  key: keyof ReturnType<typeof deriveChecklist>;
  label: string;
}[] = [
  { key: "statusConcluido", label: "Status da reunião deve ser 'Concluída'" },
  { key: "temPauta", label: "Pauta da reunião" },
  { key: "temDocumentosPrevios", label: "Documentos prévios" },
  { key: "temGravacao", label: "Gravação da reunião" },
  { key: "participantesConfirmados", label: "Participantes confirmados" },
];

interface GestaoReuniaoProps {
  reuniao: ReuniaoGestao | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGerarPautaIA?: () => void;
}

const GestaoReuniao: React.FC<GestaoReuniaoProps> = ({
  reuniao,
  open,
  onOpenChange,
  onGerarPautaIA,
}) => {
  const checklist = reuniao ? deriveChecklist(reuniao) : null;
  const canGerar = checklist ? allChecksDone(checklist) : false;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl overflow-y-auto flex flex-col"
      >
        <SheetHeader>
          <SheetTitle>{reuniao?.titulo ?? "Gestão de Reunião"}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 flex flex-col pt-6 space-y-6 overflow-y-auto">
          {/* Conteúdo principal da reunião - placeholder para seções */}
          {reuniao && (
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Data: {reuniao.data_reuniao ?? "—"} • Tipo: {reuniao.tipo ?? "—"}
              </p>
              <p className="text-sm text-muted-foreground">
                Status: {reuniao.status ?? "—"}
              </p>
            </div>
          )}

          {/* Rodapé: requisitos para gerar pauta */}
          <div className="mt-auto pt-4 space-y-4">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800 p-4">
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-3">
                Preencha todos os requisitos para gerar a pauta com IA
              </p>
              <div className="flex flex-col gap-2">
                {CHECK_ITEMS.map(({ key, label }) => {
                  const done = checklist?.[key] ?? false;
                  return (
                    <div
                      key={key}
                      className={cn(
                        "flex items-center gap-2 text-sm",
                        done ? "text-green-700 dark:text-green-400" : "text-yellow-800 dark:text-yellow-300"
                      )}
                    >
                      {done ? (
                        <Check className="h-4 w-4 shrink-0 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 shrink-0 text-amber-600" />
                      )}
                      <span>{label}</span>
                      {done && (
                        <span className="ml-auto text-xs font-medium">Concluído</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={!canGerar}
              onClick={() => {
                if (canGerar && onGerarPautaIA) onGerarPautaIA();
              }}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Gerar pauta com IA
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default GestaoReuniao;
