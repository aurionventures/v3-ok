import { supabase } from "@/lib/supabase";

export type AtaStatus = "aguardando_aprovacao" | "aguardando_assinatura" | "finalizada";

export interface AtaPendenteMembro {
  id: string;
  reuniao_id: string;
  titulo: string;
  data_reuniao: string | null;
  conteudo: string | null;
  status: AtaStatus;
  acao: "aprovacao" | "assinatura";
  totalMembros: number;
  concluidos: number;
  reuniao_titulo?: string;
}

/**
 * Inicializa os registros de aprovação para cada membro participante da reunião.
 * Chamado ao salvar a ATA pela primeira vez (após geração com IA).
 */
export async function initAtaAprovacoes(
  ataId: string,
  membroIds: string[]
): Promise<{ error: string | null }> {
  if (!supabase || membroIds.length === 0) return { error: null };

  const rows = membroIds.map((membro_id) => ({ ata_id: ataId, membro_id }));
  const { error } = await supabase.from("ata_aprovacoes").upsert(rows, {
    onConflict: "ata_id,membro_id",
    ignoreDuplicates: true,
  });
  if (error) {
    console.error("[ataAprovacoes] init:", error);
    return { error: error.message };
  }
  return { error: null };
}

/**
 * Membro aprova a ATA.
 * Se todos aprovaram, cria ata_assinaturas e atualiza status para aguardando_assinatura.
 */
export async function aprovarAta(ataId: string, membroId: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };

  const { error: updError } = await supabase
    .from("ata_aprovacoes")
    .update({ aprovado_em: new Date().toISOString() })
    .eq("ata_id", ataId)
    .eq("membro_id", membroId);
  if (updError) {
    console.error("[ataAprovacoes] aprovar:", updError);
    return { error: updError.message };
  }

  const { data: aprovs } = await supabase
    .from("ata_aprovacoes")
    .select("membro_id, aprovado_em")
    .eq("ata_id", ataId);
  const total = (aprovs ?? []).length;
  const aprovados = (aprovs ?? []).filter((a: { aprovado_em: string | null }) => a.aprovado_em);
  if (aprovados.length < total) return { error: null };

  const ids = [...new Set((aprovs ?? []).map((a: { membro_id: string }) => a.membro_id))];
  const assinaturasRows = ids.map((membro_id) => ({ ata_id: ataId, membro_id }));
  await supabase.from("ata_assinaturas").upsert(assinaturasRows, {
    onConflict: "ata_id,membro_id",
    ignoreDuplicates: true,
  });
  await supabase.from("atas").update({ status: "aguardando_assinatura" }).eq("id", ataId);
  return { error: null };
}

/**
 * Membro assina a ATA.
 * Se todos assinaram, atualiza status para finalizada.
 */
export async function assinarAta(ataId: string, membroId: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };

  const { error: updError } = await supabase
    .from("ata_assinaturas")
    .update({ assinado_em: new Date().toISOString() })
    .eq("ata_id", ataId)
    .eq("membro_id", membroId);
  if (updError) {
    console.error("[ataAprovacoes] assinar:", updError);
    return { error: updError.message };
  }

  const { data: assins } = await supabase
    .from("ata_assinaturas")
    .select("assinado_em")
    .eq("ata_id", ataId);
  const total = (assins ?? []).length;
  const assinados = (assins ?? []).filter((a: { assinado_em: string | null }) => a.assinado_em);
  if (assinados.length >= total) {
    await supabase.from("atas").update({ status: "finalizada" }).eq("id", ataId);
  }
  return { error: null };
}

/**
 * Busca ATAs pendentes de ação para um membro (aprovação ou assinatura).
 */
export async function fetchAtasPendentesMembro(
  membroId: string
): Promise<{ data: AtaPendenteMembro[]; error: string | null }> {
  if (!supabase) return { data: [], error: "Supabase não configurado" };

  const result: AtaPendenteMembro[] = [];

  const { data: aprovPendentes } = await supabase
    .from("ata_aprovacoes")
    .select("ata_id")
    .eq("membro_id", membroId)
    .is("aprovado_em", null);
  const ataIdsAprovacao = [...new Set((aprovPendentes ?? []).map((r: { ata_id: string }) => r.ata_id))];

  const { data: assinPendentes } = await supabase
    .from("ata_assinaturas")
    .select("ata_id")
    .eq("membro_id", membroId)
    .is("assinado_em", null);
  const ataIdsAssinatura = [...new Set((assinPendentes ?? []).map((r: { ata_id: string }) => r.ata_id))];

  const ataIdsTodos = [...new Set([...ataIdsAprovacao, ...ataIdsAssinatura])];
  if (ataIdsTodos.length === 0) return { data: [], error: null };

  const { data: atasData, error: errAtas } = await supabase
    .from("atas")
    .select("id, reuniao_id, conteudo, status, reunioes(titulo, data_reuniao)")
    .in("id", ataIdsTodos);

  if (errAtas || !atasData) {
    console.error("[ataAprovacoes] fetchAtasPendentesMembro:", errAtas);
    return { data: [], error: errAtas?.message ?? null };
  }

  for (const ata of atasData as Array<{
    id: string;
    reuniao_id: string;
    conteudo: string | null;
    status: string;
    reunioes?: { titulo: string; data_reuniao: string | null } | null;
  }>) {
    const reuniao = ata.reunioes;
    const titulo = reuniao?.titulo ?? "ATA";
    const dataReuniao = reuniao?.data_reuniao ?? null;

    if (ataIdsAprovacao.includes(ata.id)) {
      const { data: aprovs } = await supabase
        .from("ata_aprovacoes")
        .select("aprovado_em")
        .eq("ata_id", ata.id);
      const total = (aprovs ?? []).length;
      const concluidos = (aprovs ?? []).filter((a: { aprovado_em: string | null }) => a.aprovado_em).length;
      result.push({
        id: ata.id,
        reuniao_id: ata.reuniao_id,
        titulo,
        data_reuniao: dataReuniao,
        conteudo: ata.conteudo,
        status: ata.status as AtaStatus,
        acao: "aprovacao",
        totalMembros: total,
        concluidos,
        reuniao_titulo: titulo,
      });
    } else if (ataIdsAssinatura.includes(ata.id)) {
      const { data: assins } = await supabase
        .from("ata_assinaturas")
        .select("assinado_em")
        .eq("ata_id", ata.id);
      const total = (assins ?? []).length;
      const concluidos = (assins ?? []).filter((a: { assinado_em: string | null }) => a.assinado_em).length;
      result.push({
        id: ata.id,
        reuniao_id: ata.reuniao_id,
        titulo,
        data_reuniao: dataReuniao,
        conteudo: ata.conteudo,
        status: ata.status as AtaStatus,
        acao: "assinatura",
        totalMembros: total,
        concluidos,
        reuniao_titulo: titulo,
      });
    }
  }

  result.sort((a, b) => {
    const dA = a.data_reuniao ?? "";
    const dB = b.data_reuniao ?? "";
    return dB.localeCompare(dA);
  });

  return { data: result, error: null };
}
