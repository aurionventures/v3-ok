import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NotificationBell from "@/components/NotificationBell";
import { ClipboardList, AlertTriangle, Eye, CheckCircle } from "lucide-react";

const TAREFAS = [
  {
    id: 1,
    title: "Elaborar parecer sobre proposta de M&A",
    prazo: "26/02/2026",
    restante: "2 dias restantes",
    restanteClass: "text-red-600",
    origem: "Conselho Admin 25/11",
    prioridade: "Prioridade Alta",
    prioridadeClass: "bg-red-600 text-white",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: 2,
    title: "Revisar código de ética atualizado",
    prazo: "05/03/2026",
    restante: "9 dias restantes",
    restanteClass: "text-green-600",
    origem: "Comissão de Ética 20/11",
    prioridade: "Prioridade Média",
    prioridadeClass: "bg-gray-200 text-gray-800",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: 3,
    title: "Avaliar relatório de riscos Q3",
    prazo: "11/03/2026",
    restante: "15 dias restantes",
    restanteClass: "text-green-600",
    origem: "Comitê de Auditoria 18/11",
    prioridade: "Prioridade Média",
    prioridadeClass: "bg-gray-200 text-gray-800",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
];

const MemberPendencias = () => {
  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <ClipboardList className="h-5 w-5" /> Minhas Pendências
            </h1>
            <p className="text-sm text-muted-foreground">Tarefas atribuídas a você</p>
          </div>
          <NotificationBell />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" /> Tarefas Pendentes
          </h2>
          <Badge variant="secondary">3 pendentes</Badge>
        </div>
        <div className="space-y-4">
          {TAREFAS.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={`h-12 w-12 rounded-full ${t.iconBg} flex items-center justify-center shrink-0 ${t.iconColor}`}>
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{t.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Prazo: {t.prazo} <span className={t.restanteClass}>({t.restante})</span>
                  </p>
                  <p className="text-sm text-muted-foreground">Origem: {t.origem}</p>
                </div>
                <Badge className={t.prioridadeClass + " w-fit shrink-0"}>{t.prioridade}</Badge>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" /> Ver Detalhes
                  </Button>
                  <Button size="sm">
                    <CheckCircle className="h-4 w-4 mr-2" /> Resolver
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default MemberPendencias;
