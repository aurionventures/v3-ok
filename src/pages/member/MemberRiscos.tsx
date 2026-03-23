import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GuiaLegacyButton from "@/components/GuiaLegacyButton";
import NotificationBell from "@/components/NotificationBell";
import { useQuery } from "@tanstack/react-query";
import { Shield, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react";
import { useCurrentMembro } from "@/hooks/useCurrentMembro";
import { supabase } from "@/lib/supabase";

const MemberRiscos = () => {
  const { data: membro } = useCurrentMembro();
  const { data: riscos = [] } = useQuery({
    queryKey: ["member", "riscos", membro?.empresa_id],
    enabled: !!membro?.empresa_id && !!supabase,
    queryFn: async (): Promise<Array<{ id: string; descricao: string; severidade: string | null }>> => {
      if (!membro?.empresa_id || !supabase) return [];
      const { data } = await supabase
        .from("riscos")
        .select("id, descricao, severidade")
        .eq("empresa_id", membro.empresa_id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const criticos = riscos.filter((r) => (r.severidade ?? "").toLowerCase().includes("crit"));
  const altos = riscos.filter((r) => (r.severidade ?? "").toLowerCase().includes("alto"));
  const demais = riscos.filter((r) => !criticos.includes(r) && !altos.includes(r));

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Gestão de Riscos</h1>
            <p className="text-sm text-muted-foreground">Visão geral dos riscos, ameaças e oportunidades da governança</p>
          </div>
          <div className="flex items-center gap-2">
            <GuiaLegacyButton />
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
              <Badge variant="secondary" className="ml-auto bg-red-200 text-red-800">{criticos.length}</Badge>
            </div>
            {criticos.map((item) => (
              <Card key={item.title}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm">{item.descricao}</h3>
                    <Badge className="bg-red-600 text-white">{item.severidade ?? "Crítico"}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0" />
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 border border-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="font-semibold text-amber-800">Ameaças Operacionais</span>
              <Badge variant="secondary" className="ml-auto bg-amber-200 text-amber-800">{altos.length}</Badge>
            </div>
            {altos.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm">{item.descricao}</h3>
                    <Badge className="bg-amber-500 text-white">{item.severidade ?? "Alto"}</Badge>
                  </div>
                  <Badge variant="outline" className="w-fit mt-1">Operacional</Badge>
                </CardHeader>
                <CardContent className="pt-0" />
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 border border-blue-100">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Oportunidades Estratégicas</span>
              <Badge variant="secondary" className="ml-auto bg-blue-200 text-blue-800">{demais.length}</Badge>
            </div>
            {demais.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm">{item.descricao}</h3>
                    <Badge className="bg-blue-100 text-blue-800">{item.severidade ?? "Mapeado"}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0" />
              </Card>
            ))}
            {riscos.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-sm text-muted-foreground">
                  Não há riscos cadastrados para sua empresa.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberRiscos;
