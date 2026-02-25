import React from "react";
import { FileText, Users, AlertTriangle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import NotificationBell from "@/components/NotificationBell";

const incongruencias = [
  {
    id: 1,
    title: "Estatuto social define processo decisório diferente do relatado nas entrevistas",
    refs: ["Estatuto Social", "Entrevista CEO"],
    severity: "Alta" as const,
  },
  {
    id: 2,
    title: "Visões divergentes sobre sucessão entre família e executivos",
    refs: ["Entrevista Fundador", "Entrevista Herdeiro"],
    severity: "Média" as const,
  },
  {
    id: 3,
    title: "Política de remuneração não alinhada com acordo de sócios",
    refs: ["Política de Remuneração", "Acordo de Sócios"],
    severity: "Baixa" as const,
  },
];

const gapsCategorias = [
  {
    category: "Governança e Conselho",
    items: ["Regimento Interno do Conselho", "Calendário Anual de Reuniões"],
    severity: "Alta" as const,
  },
  {
    category: "Família Empresária",
    items: ["Protocolo Familiar", "Plano de Sucessão"],
    severity: "Alta" as const,
  },
  {
    category: "Compliance & Conduta",
    items: ["Código de Conduta", "Canal de Denúncias"],
    severity: "Média" as const,
  },
];

function SeverityBadge({ severity }: { severity: "Alta" | "Média" | "Baixa" }) {
  const styles =
    severity === "Alta"
      ? "bg-red-100 text-red-800"
      : severity === "Média"
      ? "bg-orange-100 text-orange-800"
      : "bg-green-100 text-green-800";
  return <Badge variant="secondary" className={styles}>{severity}</Badge>;
}

const AnaliseAcoes = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background px-4 py-3">
          <h1 className="text-xl font-semibold">Análise e Ações</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Guia Legacy</Button>
            <NotificationBell />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Análise completa baseada em documentos e entrevistas coletadas, com insights da IA para melhorar a governança corporativa.
          </p>

          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold">Resumo Executivo</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Status dos Documentos</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Checklist completo · 0%</p>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium text-green-600">Completos:</span> 0</p>
                    <p className="text-sm"><span className="font-medium text-orange-600">Incompletos:</span> 0</p>
                    <p className="text-sm"><span className="font-medium text-red-600">Divergentes:</span> 0</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Análise das Entrevistas</h3>
                  </div>
                  <div className="space-y-2 mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Alinhamento geral</span>
                      <span className="text-sm font-medium text-green-600">81%</span>
                    </div>
                    <Progress value={81} className="h-2" />
                  </div>
                  <div className="flex gap-4 mt-4">
                    <span className="text-sm text-muted-foreground">4 Entrevistas</span>
                    <span className="text-sm"><span className="font-medium text-red-600">2 Conflitos</span></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h2 className="text-lg font-semibold">Mapa de Incongruências</h2>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {incongruencias.map((item) => (
                    <li key={item.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <p className="text-sm font-medium text-foreground mb-2">{item.title}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.refs.map((ref) => (
                          <span key={ref} className="text-xs text-muted-foreground flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {ref}
                          </span>
                        ))}
                      </div>
                      <SeverityBadge severity={item.severity} />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Gaps de Documentação</h2>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {gapsCategorias.map((cat, i) => (
                    <li key={i} className="border-b pb-4 last:border-0 last:pb-0">
                      <p className="text-sm font-medium text-foreground mb-2">{cat.category}</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mb-2 space-y-1">
                        {cat.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <SeverityBadge severity={cat.severity} />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnaliseAcoes;
