import { Card, CardContent } from "@/components/ui/card";
import GuiaLegacyButton from "@/components/GuiaLegacyButton";
import NotificationBell from "@/components/NotificationBell";
import { FileText } from "lucide-react";

const PAUTAS = [
  { id: 1, titulo: "Pauta - Conselho de Administração Abril/2026", data: "01/04/2026" },
  { id: 2, titulo: "Pauta - Comitê de Auditoria Março/2026", data: "15/03/2026" },
];

const MemberPautas = () => {
  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Pautas Virtuais</h1>
            <p className="text-sm text-muted-foreground">Pautas das reuniões disponíveis</p>
          </div>
          <div className="flex items-center gap-2">
            <GuiaLegacyButton />
            <NotificationBell />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {PAUTAS.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{p.titulo}</h3>
                  <p className="text-sm text-muted-foreground">Disponível em {p.data}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default MemberPautas;
