import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NotificationBell from "@/components/NotificationBell";
import { Shield, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react";

const RISCOS_ESTRATEGICOS = [
  {
    title: "Vulnerabilidade na Sucessão",
    description: "Plano de sucessão não atualizado há 18 meses. CEO completará 65 anos em 2027.",
    status: "Crítico",
    statusClass: "bg-red-600 text-white",
    actions: ["Revisar e atualizar plano de sucessão", "Mapear potenciais sucessores internos e externos"],
  },
  {
    title: "Exposição a Riscos ESG",
    description: "Índice de conformidade ESG abaixo da média do setor em 15 pontos percentuais.",
    status: "Alto",
    statusClass: "bg-orange-500 text-white",
    actions: ["Implementar programa ESG estruturado", "Contratar consultoria especializada"],
  },
];

const AMEACAS_OPERACIONAIS = [
  {
    title: "Pressão Regulatória ESG",
    description: "Novas regulamentações de divulgação ESG entram em vigor em 6 meses.",
    tag: "Regulatório",
    badge: "30 dias",
    badgeClass: "bg-amber-500 text-white",
    actions: ["Atualizar politicas de compliance", "Treinar equipe jurídica"],
  },
  {
    title: "Concentração de Fornecedores",
    description: "70% do suprimento crítico vem de 2 fornecedores.",
    tag: "Operacional",
    badge: "Imediato",
    badgeClass: "bg-red-600 text-white",
    actions: ["Diversificar base de fornecedores", "Negociar contratos de longo prazo"],
  },
];

const OPORTUNIDADES = [
  {
    title: "Cultura de Compliance Fortalecida",
    description: "Implementação de programa de integridade aumentou engajamento em 40%.",
    tag: "Estratégica",
    actions: ["Expandir programa para subsidiárias", "Certificar ISO 37001"],
  },
  {
    title: "Transformação Digital",
    description: "Oportunidade de digitalização de processos de governança.",
    tag: "Estratégica",
    actions: ["Implementar plataforma digital de governança", "Automatizar relatórios de compliance"],
  },
];

const MemberRiscos = () => {
  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Gestão de Riscos</h1>
            <p className="text-sm text-muted-foreground">Visão geral dos riscos, ameaças e oportunidades da governança</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" /> Atualizar
            </Button>
            <NotificationBell />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">Painel de Inteligência</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 border border-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-800">Riscos Estratégicos</span>
              <Badge variant="secondary" className="ml-auto bg-red-200 text-red-800">2</Badge>
            </div>
            {RISCOS_ESTRATEGICOS.map((item) => (
              <Card key={item.title}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <Badge className={item.statusClass}>{item.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div>
                    <p className="text-xs font-semibold uppercase text-red-600 mb-1">Ações Recomendadas</p>
                    <ul className="space-y-1 text-sm list-disc pl-4">
                      {item.actions.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 border border-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="font-semibold text-amber-800">Ameaças Operacionais</span>
              <Badge variant="secondary" className="ml-auto bg-amber-200 text-amber-800">2</Badge>
            </div>
            {AMEACAS_OPERACIONAIS.map((item) => (
              <Card key={item.title}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <Badge className={item.badgeClass}>{item.badge}</Badge>
                  </div>
                  <Badge variant="outline" className="w-fit mt-1">{item.tag}</Badge>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div>
                    <p className="text-xs font-semibold uppercase text-amber-700 mb-1">Ações Recomendadas</p>
                    <ul className="space-y-1 text-sm list-disc pl-4">
                      {item.actions.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 border border-blue-100">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Oportunidades Estratégicas</span>
              <Badge variant="secondary" className="ml-auto bg-blue-200 text-blue-800">2</Badge>
            </div>
            {OPORTUNIDADES.map((item) => (
              <Card key={item.title}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <Badge className="bg-blue-100 text-blue-800">{item.tag}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div>
                    <p className="text-xs font-semibold uppercase text-blue-600 mb-1">Ações Recomendadas</p>
                    <ul className="space-y-1 text-sm list-disc pl-4">
                      {item.actions.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberRiscos;
