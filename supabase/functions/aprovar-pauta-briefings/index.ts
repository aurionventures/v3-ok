/**
 * Aprova pauta sugerida pela IA e distribui pre-briefings aos membros alocados.
 * Usa service role para garantir inserção no banco, evitando problemas de RLS.
 * Rota: POST /functions/v1/aprovar-pauta-briefings
 * Body: { pauta_id, empresa_id, reuniao_id }
 */

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

type MembroAlocado = { id: string; nome: string; email: string | null; cargo: string | null };

async function fetchMembrosPorOrgao(
  supabase: ReturnType<typeof createClient>,
  empresaId: string,
  tipo: "conselho" | "comite" | "comissao",
  orgaoId: string
): Promise<MembroAlocado[]> {
  const campo = tipo === "conselho" ? "conselho_id" : tipo === "comite" ? "comite_id" : "comissao_id";
  const { data: alocacoes, error: errA } = await supabase
    .from("alocacoes_membros")
    .select("membro_id, cargo")
    .eq(campo, orgaoId)
    .eq("ativo", true);
  if (errA || !alocacoes?.length) return [];
  const membroIds = [...new Set(alocacoes.map((a: { membro_id: string }) => a.membro_id))];
  const cargoByMembro = new Map<string, string | null>();
  for (const a of alocacoes) cargoByMembro.set(a.membro_id, a.cargo ?? null);
  const { data: membros, error: errM } = await supabase
    .from("membros_governanca")
    .select("id, nome, email")
    .eq("empresa_id", empresaId)
    .in("id", membroIds);
  if (errM || !membros) return [];
  return membros.map((m: { id: string; nome: string; email?: string | null }) => ({
    id: m.id,
    nome: m.nome,
    email: m.email ?? null,
    cargo: cargoByMembro.get(m.id) ?? null,
  }));
}

async function fetchMembrosPorVirtualTipo(
  supabase: ReturnType<typeof createClient>,
  empresaId: string,
  vt: "conselho" | "comite" | "comissao"
): Promise<MembroAlocado[]> {
  const campo = vt === "conselho" ? "conselho_id" : vt === "comite" ? "comite_id" : "comissao_id";
  const tabela = vt === "conselho" ? "conselhos" : vt === "comite" ? "comites" : "comissoes";
  const { data: orgaos } = await supabase.from(tabela).select("id").eq("empresa_id", empresaId).eq("ativo", true);
  const orgaoIds = (orgaos ?? []).map((o: { id: string }) => o.id);
  if (orgaoIds.length === 0) return [];
  const { data: alocacoes, error: errA } = await supabase
    .from("alocacoes_membros")
    .select("membro_id, cargo")
    .in(campo, orgaoIds)
    .eq("ativo", true);
  if (errA || !alocacoes?.length) return [];
  const membroIds = [...new Set(alocacoes.map((a: { membro_id: string }) => a.membro_id))];
  const cargoByMembro = new Map<string, string | null>();
  for (const a of alocacoes) cargoByMembro.set(a.membro_id, a.cargo ?? null);
  const { data: membros, error: errM } = await supabase
    .from("membros_governanca")
    .select("id, nome, email")
    .eq("empresa_id", empresaId)
    .in("id", membroIds);
  if (errM || !membros) return [];
  return membros.map((m: { id: string; nome: string; email?: string | null }) => ({
    id: m.id,
    nome: m.nome,
    email: m.email ?? null,
    cargo: cargoByMembro.get(m.id) ?? null,
  }));
}

async function fetchMembrosPorReuniao(
  supabase: ReturnType<typeof createClient>,
  empresaId: string,
  reuniao: {
    conselho_id?: string | null;
    comite_id?: string | null;
    comissao_id?: string | null;
    virtual_tipo?: string | null;
  }
): Promise<MembroAlocado[]> {
  const seen = new Set<string>();
  const result: MembroAlocado[] = [];
  const vt = reuniao.virtual_tipo;

  if (reuniao.conselho_id) {
    const membros = await fetchMembrosPorOrgao(supabase, empresaId, "conselho", reuniao.conselho_id);
    for (const m of membros) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        result.push(m);
      }
    }
  }
  if (reuniao.comite_id) {
    const membros = await fetchMembrosPorOrgao(supabase, empresaId, "comite", reuniao.comite_id);
    for (const m of membros) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        result.push(m);
      }
    }
  }
  if (reuniao.comissao_id) {
    const membros = await fetchMembrosPorOrgao(supabase, empresaId, "comissao", reuniao.comissao_id);
    for (const m of membros) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        result.push(m);
      }
    }
  }

  if (result.length > 0) return result;

  if (vt === "conselho" || vt === "comite" || vt === "comissao") {
    return fetchMembrosPorVirtualTipo(supabase, empresaId, vt);
  }

  return result;
}

function upsertBriefing(
  supabase: ReturnType<typeof createClient>,
  p: {
    membro_id: string;
    empresa_id: string;
    reuniao_id: string;
    titulo?: string | null;
    resumo_executivo?: string | null;
    perguntas_criticas?: string[];
    seu_foco?: string | null;
    preparacao_recomendada?: string | null;
    alertas_contextuais?: string | null;
    dados_completos?: Record<string, unknown> | null;
  }
): Promise<{ error: string | null }> {
  return (async () => {
    const { data: existing } = await supabase
      .from("membro_briefing")
      .select("id")
      .eq("membro_id", p.membro_id)
      .eq("reuniao_id", p.reuniao_id)
      .maybeSingle();

    const payload = {
      membro_id: p.membro_id,
      empresa_id: p.empresa_id,
      reuniao_id: p.reuniao_id,
      titulo: p.titulo ?? null,
      resumo_executivo: p.resumo_executivo ?? null,
      perguntas_criticas: p.perguntas_criticas ?? [],
      seu_foco: p.seu_foco ?? null,
      preparacao_recomendada: p.preparacao_recomendada ?? null,
      alertas_contextuais: p.alertas_contextuais ?? null,
      dados_completos: p.dados_completos ?? null,
      updated_at: new Date().toISOString(),
    };

    if (existing?.id) {
      const { error } = await supabase.from("membro_briefing").update(payload).eq("id", existing.id);
      return { error: error?.message ?? null };
    }

    const { error } = await supabase.from("membro_briefing").insert({
      ...payload,
      created_at: new Date().toISOString(),
    });
    return { error: error?.message ?? null };
  })();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método não permitido" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Configuração do servidor incompleta" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const pautaId = (body.pauta_id ?? body.pautaId ?? "").toString().trim();
    const empresaId = (body.empresa_id ?? body.empresaId ?? "").toString().trim();
    const reuniaoId = (body.reuniao_id ?? body.reuniaoId ?? "").toString().trim();

    if (!pautaId || !empresaId || !reuniaoId) {
      return new Response(
        JSON.stringify({ error: "pauta_id, empresa_id e reuniao_id são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: pauta, error: fetchErr } = await supabase
      .from("pauta_sugerida_ia")
      .select("output_2a, output_2b, status")
      .eq("id", pautaId)
      .eq("empresa_id", empresaId)
      .maybeSingle();

    if (fetchErr || !pauta) {
      return new Response(
        JSON.stringify({ error: fetchErr?.message ?? "Pauta não encontrada" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (pauta.status !== "pendente") {
      return new Response(
        JSON.stringify({ error: "Pauta já foi processada" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const briefingsIA = (pauta.output_2b as { member_briefings?: Array<Record<string, unknown>> })?.member_briefings ?? [];
    const meetingAgenda = (pauta.output_2a as { meeting_agenda?: Array<Record<string, unknown>> })?.meeting_agenda ?? [];
    const briefingByMembro = new Map<string, Record<string, unknown>>();
    for (const b of briefingsIA) {
      const id = b.membro_id;
      if (id && typeof id === "string") briefingByMembro.set(id, b);
    }

    const { data: reuniao } = await supabase
      .from("reunioes")
      .select("id, conselho_id, comite_id, comissao_id, virtual_tipo")
      .eq("id", reuniaoId)
      .maybeSingle();

    const membrosAlocados = reuniao
      ? await fetchMembrosPorReuniao(supabase, empresaId, {
          conselho_id: reuniao.conselho_id,
          comite_id: reuniao.comite_id,
          comissao_id: reuniao.comissao_id,
          virtual_tipo: reuniao.virtual_tipo,
        })
      : [];

    const membrosParaBriefing =
      membrosAlocados.length > 0
        ? membrosAlocados
        : briefingsIA
            .filter((b) => b.membro_id && typeof b.membro_id === "string")
            .map((b) => ({ id: b.membro_id as string, nome: "", email: null, cargo: null }));

    if (membrosParaBriefing.length === 0) {
      console.warn("[aprovar-pauta-briefings] Nenhum membro alocado encontrado para reuniao_id:", reuniaoId);
    }

    // 1. Preencher pautas
    if (meetingAgenda.length > 0) {
      await supabase.from("pautas").delete().eq("reuniao_id", reuniaoId);
      for (let ordem = 0; ordem < meetingAgenda.length; ordem++) {
        const item = meetingAgenda[ordem];
        const titulo = (item?.titulo ?? `Item ${ordem + 1}`) as string;
        const partes: string[] = [];
        if (item?.materiais) partes.push(`Materiais: ${item.materiais}`);
        if (item?.decisao_esperada) partes.push(`Decisão esperada: ${item.decisao_esperada}`);
        if (item?.conexao) partes.push(`Conexão: ${item.conexao}`);
        if (Array.isArray(item?.perguntas) && (item.perguntas as string[]).length > 0) {
          partes.push(`Perguntas: ${(item.perguntas as string[]).join("; ")}`);
        }
        const descricao = partes.length > 0 ? partes.join("\n\n") : null;
        await supabase.from("pautas").insert({
          reuniao_id: reuniaoId,
          titulo,
          ordem,
          tempo_estimado_min: 25,
          descricao: descricao ?? null,
          apresentador: (item?.apresentador as string) ?? null,
          tipo: (item?.tipo as string) ?? "informativo",
        });
      }
    }

    // 2. Atualizar status da reunião
    await supabase.from("reunioes").update({ status: "pauta_definida", updated_at: new Date().toISOString() }).eq("id", reuniaoId);

    // 3. Criar/atualizar briefings para cada membro
    const dadosCompletos = meetingAgenda.length > 0 ? { meeting_agenda: meetingAgenda } : undefined;
    let briefingsCriados = 0;
    for (const membro of membrosParaBriefing) {
      const b = briefingByMembro.get(membro.id);
      const resumo = b ? ((b.resumo_executivo ?? "") as string) : "";
      const perguntas = b && Array.isArray(b.perguntas_criticas) ? (b.perguntas_criticas as string[]) : [];
      const seuFoco = b ? ((b.seu_foco ?? "") as string) : "";
      const preparacao = b ? ((b.preparacao_recomendada ?? "") as string) : "";
      const alertas = b ? ((b.alertas_contextuais ?? "") as string) : "";
      const temConteudo = resumo || perguntas.length > 0 || seuFoco || preparacao || alertas || (dadosCompletos?.meeting_agenda?.length ?? 0) > 0;

      const err = await upsertBriefing(supabase, {
        membro_id: membro.id,
        empresa_id: empresaId,
        reuniao_id: reuniaoId,
        titulo: temConteudo ? `Briefing - Reunião ${new Date().toLocaleDateString("pt-BR")}` : undefined,
        resumo_executivo: resumo || undefined,
        perguntas_criticas: perguntas.length > 0 ? perguntas : undefined,
        seu_foco: seuFoco || undefined,
        preparacao_recomendada: preparacao || undefined,
        alertas_contextuais: alertas || undefined,
        dados_completos: dadosCompletos,
      });

      if (!err.error) briefingsCriados++;
      else console.error("[aprovar-pauta-briefings] upsertBriefing:", err.error);
    }

    // 4. Marcar pauta como aprovada
    await supabase
      .from("pauta_sugerida_ia")
      .update({ status: "aprovada", updated_at: new Date().toISOString() })
      .eq("id", pautaId);

    return new Response(
      JSON.stringify({ ok: true, briefingsCriados }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[aprovar-pauta-briefings]", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Erro ao processar" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
