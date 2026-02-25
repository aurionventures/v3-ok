import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NotificationBell from "@/components/NotificationBell";
import { FileText, Eye, Check, PenLine } from "lucide-react";

const ATAS = [
  {
    id: 1,
    title: "ATA - Conselho de Administração",
    subtitle: "Reunião Ordinária • 14/02/2026",
    status: "Aguardando sua aprovação (2/4 aprovaram)",
    action: "Aprovar",
    actionIcon: <Check className="h-4 w-4" />,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: 2,
    title: "ATA - Comitê de Auditoria",
    subtitle: "Reunião Extraordinária • 19/02/2026",
    status: "Aguardando sua assinatura (1/3 assinaram)",
    action: "Assinar",
    actionIcon: <PenLine className="h-4 w-4" />,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
];

const MemberAtasPendentes = () => {
  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" /> ATAs Pendentes
            </h1>
            <p className="text-sm text-muted-foreground">ATAs aguardando sua ação</p>
          </div>
          <NotificationBell />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg">ATAs Pendentes de Ação</h2>
              <Badge variant="destructive">2</Badge>
            </div>
            <div className="space-y-4">
              {ATAS.map((ata) => (
                <Card key={ata.id} className="border bg-card">
                  <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className={`h-12 w-12 rounded-full ${ata.iconBg} flex items-center justify-center shrink-0 ${ata.iconColor}`}>
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{ata.title}</h3>
                      <p className="text-sm text-muted-foreground">{ata.subtitle}</p>
                      <Badge variant="secondary" className="mt-2">{ata.status}</Badge>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" /> Ver ATA
                      </Button>
                      <Button size="sm">
                        {ata.actionIcon}
                        <span className="ml-2">{ata.action}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MemberAtasPendentes;
