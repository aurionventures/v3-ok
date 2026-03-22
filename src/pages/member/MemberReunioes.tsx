import { Card, CardContent } from "@/components/ui/card";
import GuiaLegacyButton from "@/components/GuiaLegacyButton";
import NotificationBell from "@/components/NotificationBell";
import { Calendar } from "lucide-react";

const REUNIOES = [
  { id: 1, conselho: "Conselho de Administração", data: "10/12/2026", horario: "14:00", tipo: "Ordinária" },
  { id: 2, conselho: "Comitê de Auditoria", data: "15/12/2026", horario: "10:00", tipo: "Extraordinária" },
  { id: 3, conselho: "Conselho de Administração", data: "20/12/2026", horario: "14:00", tipo: "Ordinária" },
];

const MemberReunioes = () => {
  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Próximas Reuniões</h1>
            <p className="text-sm text-muted-foreground">Reuniões agendadas para você</p>
          </div>
          <div className="flex items-center gap-2">
            <GuiaLegacyButton />
            <NotificationBell />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {REUNIOES.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{r.conselho}</h3>
                  <p className="text-sm text-muted-foreground">{r.data} às {r.horario} • {r.tipo}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default MemberReunioes;
