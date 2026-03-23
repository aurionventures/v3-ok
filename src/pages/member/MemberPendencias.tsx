import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GuiaLegacyButton from "@/components/GuiaLegacyButton";
import NotificationBell from "@/components/NotificationBell";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, AlertTriangle, Eye, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCurrentMembro } from "@/hooks/useCurrentMembro";
import { fetchReunioes } from "@/services/agenda";
import { fetchAtasPendentesMembro } from "@/services/ataAprovacoes";

function responsavelCoincideComMembro(responsavel: string, nomeMembro: string): boolean {
  const r = (responsavel ?? "").trim().toLowerCase();
  const n = (nomeMembro ?? "").trim().toLowerCase();
  if (!r || !n) return false;
  return r.includes(n) || n.includes(r) || n.split(/\s+/)[0] === r || r.split(/\s+/)[0] === n;
}

const MemberPendencias = () => {
  const { data: membro } = useCurrentMembro();
  const { data: pendencias = [] } = useQuery({
    queryKey: ["member", "pendencias", membro?.id, membro?.empresa_id, membro?.nome],
    enabled: !!membro?.id && !!membro?.empresa_id,
    queryFn: async (): Promise<Array<{ id: string; title: string; prazo: string | null; origem: string; tipo: "ata" | "tarefa" }>> => {
      if (!membro?.id || !membro.empresa_id || !supabase) return [];
      const { data: todasReunioes } = await fetchReunioes(membro.empresa_id);
      const { data: alocacoes } = await supabase
        .from("alocacoes_membros")
        .select("conselho_id, comite_id, comissao_id")
        .eq("membro_id", membro.id)
        .eq("ativo", true);
      const conselhoIds = new Set((alocacoes ?? []).map((a) => a.conselho_id).filter(Boolean));
      const comiteIds = new Set((alocacoes ?? []).map((a) => a.comite_id).filter(Boolean));
      const comissaoIds = new Set((alocacoes ?? []).map((a) => a.comissao_id).filter(Boolean));
      const reunioesDoMembro = todasReunioes.filter(
        (r) =>
          (r.conselho_id && conselhoIds.has(r.conselho_id)) ||
          (r.comite_id && comiteIds.has(r.comite_id)) ||
          (r.comissao_id && comissaoIds.has(r.comissao_id))
      );
      const reuniaoIds = reunioesDoMembro.map((r) => r.id);
      const reuniaoMap = new Map(todasReunioes.map((r) => [r.id, r]));

      const { data: atasPendentes } = await fetchAtasPendentesMembro(membro.id);
      const pendAta = atasPendentes.map((a) => ({
        id: `ata-${a.id}-${a.acao}`,
        title: a.acao === "aprovacao" ? `Aprovar ATA - ${a.titulo}` : `Assinar ATA - ${a.titulo}`,
        prazo: a.data_reuniao,
        origem: a.reuniao_titulo ?? a.titulo,
        tipo: "ata" as const,
      }));

      let pendTarefas: Array<{ id: string; title: string; prazo: string | null; origem: string; tipo: "tarefa" }> = [];
      if (reuniaoIds.length > 0) {
        const { data: tarefas } = await supabase
          .from("reuniao_tarefas")
          .select("id, nome, responsavel, reuniao_id, data_conclusao")
          .in("reuniao_id", reuniaoIds)
          .is("data_conclusao", null);
        pendTarefas = (tarefas ?? [])
          .filter((t) => responsavelCoincideComMembro(t.responsavel, membro.nome))
          .map((t) => ({
            id: `tarefa-${t.id}`,
            title: t.nome,
            prazo: t.data_conclusao,
            origem: reuniaoMap.get(t.reuniao_id)?.titulo ?? "Tarefa e Combinado",
            tipo: "tarefa" as const,
          }));
      }

      return [...pendAta, ...pendTarefas];
    },
  });

  const total = pendencias.length;
  const urgentes = useMemo(() => pendencias.filter((p) => p.prazo && new Date(p.prazo) <= new Date()).length, [pendencias]);

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
          <div className="flex items-center gap-2">
            <GuiaLegacyButton />
            <NotificationBell />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" /> Tarefas Pendentes
          </h2>
          <Badge variant="secondary">{total} pendentes</Badge>
        </div>
        <div className="space-y-4">
          {pendencias.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={`h-12 w-12 rounded-full ${t.tipo === "ata" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"} flex items-center justify-center shrink-0`}>
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{t.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Prazo: {t.prazo ? new Date(t.prazo).toLocaleDateString("pt-BR") : "Não definido"}
                  </p>
                  <p className="text-sm text-muted-foreground">Origem: {t.origem}</p>
                </div>
                <Badge className={`${t.tipo === "ata" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-800"} w-fit shrink-0`}>
                  {t.tipo === "ata" ? "Ação em ATA" : "Tarefa e Combinado"}
                </Badge>
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
          {pendencias.length === 0 && (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Você não possui pendências no momento.
              </CardContent>
            </Card>
          )}
        </div>
        {urgentes > 0 && <p className="text-sm text-red-600 mt-3">{urgentes} pendência(s) urgente(s).</p>}
      </div>
    </>
  );
};

export default MemberPendencias;
