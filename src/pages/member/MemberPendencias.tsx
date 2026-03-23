import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GuiaLegacyButton from "@/components/GuiaLegacyButton";
import NotificationBell from "@/components/NotificationBell";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardList, AlertTriangle, Eye, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCurrentMembro } from "@/hooks/useCurrentMembro";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { fetchReunioes } from "@/services/agenda";
import { concluirTarefa } from "@/services/gestaoReuniao";

function responsavelCoincideComMembro(
  responsavel: string,
  nomeMembro: string,
  emailMembro?: string | null
): boolean {
  const r = (responsavel ?? "").trim().toLowerCase();
  const n = (nomeMembro ?? "").trim().toLowerCase();
  if (!r) return false;
  if (n && (r.includes(n) || n.includes(r) || n.split(/\s+/)[0] === r || r.split(/\s+/)[0] === n)) return true;
  const emailLocal = (emailMembro ?? "").split("@")[0].toLowerCase().replace(/[._-]/g, "");
  if (emailLocal && (r.includes(emailLocal) || emailLocal.includes(r))) return true;
  return false;
}

const MemberPendencias = () => {
  const { data: membro } = useCurrentMembro();
  const { data: pendencias = [] } = useQuery({
    queryKey: ["member", "pendencias", membro?.id, membro?.empresa_id, membro?.nome, membro?.email],
    enabled: !!membro?.id && !!membro?.empresa_id,
    queryFn: async (): Promise<Array<{ id: string; tarefaId: string; title: string; prazo: string | null; origem: string; tipo: "tarefa" }>> => {
      if (!membro?.id || !membro.empresa_id || !supabase) return [];
      const todasReunioes = await fetchReunioes(membro.empresa_id);
      const { data: alocacoes } = await supabase
        .from("alocacoes_membros")
        .select("conselho_id, comite_id, comissao_id")
        .eq("membro_id", membro.id)
        .eq("ativo", true);
      const conselhoIds = new Set((alocacoes ?? []).map((a) => a.conselho_id).filter(Boolean));
      const comiteIds = new Set((alocacoes ?? []).map((a) => a.comite_id).filter(Boolean));
      const comissaoIds = new Set((alocacoes ?? []).map((a) => a.comissao_id).filter(Boolean));
      const temAlocacao = conselhoIds.size > 0 || comiteIds.size > 0 || comissaoIds.size > 0;
      const reunioesDoMembro =
        temAlocacao
          ? todasReunioes.filter(
              (r) =>
                (r.conselho_id && conselhoIds.has(r.conselho_id)) ||
                (r.comite_id && comiteIds.has(r.comite_id)) ||
                (r.comissao_id && comissaoIds.has(r.comissao_id)) ||
                (!r.conselho_id && !r.comite_id && !r.comissao_id)
            )
          : todasReunioes;
      const reuniaoIds = reunioesDoMembro.map((r) => r.id);
      const reuniaoMap = new Map(todasReunioes.map((r) => [r.id, r]));

      let pendTarefas: Array<{ id: string; tarefaId: string; title: string; prazo: string | null; origem: string; tipo: "tarefa" }> = [];
      if (reuniaoIds.length > 0) {
        const { data: tarefas } = await supabase
          .from("reuniao_tarefas")
          .select("id, nome, responsavel, reuniao_id, data_conclusao")
          .in("reuniao_id", reuniaoIds);
        const tarefasDoMembro = (tarefas ?? []).filter(
          (t) =>
            !t.data_conclusao &&
            responsavelCoincideComMembro(t.responsavel, membro.nome ?? "", membro.email)
        );
        pendTarefas = tarefasDoMembro.map((t) => ({
          id: `tarefa-${t.id}`,
          tarefaId: t.id,
          title: t.nome,
          prazo: t.data_conclusao,
          origem: reuniaoMap.get(t.reuniao_id)?.titulo ?? reuniaoMap.get(t.reuniao_id)?.comite_nome ?? reuniaoMap.get(t.reuniao_id)?.comissao_nome ?? reuniaoMap.get(t.reuniao_id)?.conselho_nome ?? "Tarefa e Combinado",
          tipo: "tarefa" as const,
        }));
      }

      return pendTarefas;
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
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white"
            title={`${total} pendentes`}
          >
            {total}
          </span>
        </div>
        <div className="space-y-4">
          {pendencias.length > 0 ? (
            pendencias.map((t) => (
              <Card key={t.id}>
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{t.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Prazo: {t.prazo ? new Date(t.prazo).toLocaleDateString("pt-BR") : "Não definido"}
                    </p>
                    <p className="text-sm text-muted-foreground">Origem: {t.origem}</p>
                  </div>
                  <Badge className="bg-gray-200 text-gray-800 w-fit shrink-0">
                    Tarefa e Combinado
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
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground space-y-2">
                <p>Você não possui tarefas pendentes no momento.</p>
                <p>
                  ATAs aguardando aprovação ou assinatura estão em{" "}
                  <Link to="/member/atas-pendentes" className="text-primary underline underline-offset-2">
                    ATAs Pendentes
                  </Link>
                  .
                </p>
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
