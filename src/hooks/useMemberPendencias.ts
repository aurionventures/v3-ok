import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useCurrentMembro } from "@/hooks/useCurrentMembro";
import { fetchReunioes } from "@/services/agenda";

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

export type Pendencia = {
  id: string;
  tarefaId: string;
  title: string;
  prazo: string | null;
  origem: string;
  tipo: "tarefa";
};

export function useMemberPendencias() {
  const { data: membro } = useCurrentMembro();

  return useQuery({
    queryKey: ["member", "pendencias", membro?.id, membro?.empresa_id, membro?.nome, membro?.email],
    enabled: !!membro?.id && !!membro?.empresa_id,
    queryFn: async (): Promise<Pendencia[]> => {
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

      let pendTarefas: Pendencia[] = [];
      if (reuniaoIds.length > 0) {
        const { data: tarefas } = await supabase
          .from("reuniao_tarefas")
          .select("id, nome, responsavel, reuniao_id, data_conclusao, data_prazo")
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
          prazo: (t as { data_prazo?: string | null }).data_prazo ?? null,
          origem: reuniaoMap.get(t.reuniao_id)?.titulo ?? reuniaoMap.get(t.reuniao_id)?.comite_nome ?? reuniaoMap.get(t.reuniao_id)?.comissao_nome ?? reuniaoMap.get(t.reuniao_id)?.conselho_nome ?? "Tarefa e Combinado",
          tipo: "tarefa" as const,
        }));
      }

      return pendTarefas;
    },
  });
}
