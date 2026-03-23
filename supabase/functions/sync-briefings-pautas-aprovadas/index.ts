/**
 * Sincroniza pre-briefings para pautas já aprovadas (cria/atualiza briefings para membros alocados).
 * Útil para pautas que foram aprovadas antes da correção ou quando briefings não foram criados.
 * Rota: POST /functions/v1/sync-briefings-pautas-aprovadas
 * Body: { empresa_id } – processa todas as pautas aprovadas da empresa
 *    ou { pauta_id } – processa apenas essa pauta
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
  const { data: alocacoes } = await supabase
    .from("alocacoes_membros")
    .select("membro_id, cargo")
    .eq(campo, orgaoId)
    .eq("ativo", true);
  if (!alocacoes?.length) return [];
  const membroIds = [...new Set(alocacoes.map((a: { membro_id: string }) => a.membro_id))];
  const cargoByMembro = new Map<string, string | null>();
  for (const a of alocacoes) cargoByMembro.set(a.membro_id, a.cargo ?? null);
  const { data: membros } = await supabase
    .from("membros_governanca")
    .select("id, nome, email")
    .eq("empresa_id", empresaId)
    .in("id", membroIds);
  if (!membros) return [];
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
  const { data: alocacoes } = await supabase
    .from("alocacoes_membros")
    .select("membro_id, cargo")
    .in(campo, orgaoIds)
    .eq("ativo", true);
  if (!alocacoes?.length) return [];
  const membroIds = [...new Set(alocacoes.map((a: { membro_id: string }) => a.membro_id))];
  const cargoByMembro = new Map<string, string | null>();
  for (const a of alocacoes) cargoByMembro.set(a.membro_id, a.cargo ?? null);
  const { data: membros } = await supabase
    .from("membros_governanca")
    .select("id, nome, email")
    .eq("empresa_id", empresaId)
    .in("id", membroIds);
  if (!membros) return [];
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
  if (reuniao.conselho_id) {
    const membros = await fetchMembrosPorOrgao(supabase, empresaId, "conselho", reuniao.conselho_id);
    for (const m of membros) if (!seen.has(m.id)) { seen.add(m.id); result.push(m); }
  }
  if (reuniao.comite_id) {
    const membros = await fetchMembrosPorOrgao(supabase, empresaId, "comite", reuniao.comite_id);
    for (const m of membros) if (!seen.has(m.id)) { seen.add(m.id); result.push(m); }
  }
  if (reuniao.comissao_id) {
    const membros = await fetchMembrosPorOrgao(supabase, empresaId, "comissao", reuniao.comissao_id);
    for (const m of membros) if (!seen.has(m.id)) { seen.add(m.id); result.push(m); }
  }
  if (result.length > 0) return result;
  const vt = reuniao.virtual_tipo;
  if (vt === "conselho" || vt === "comite" || vt === "comissao") {
    return fetchMembrosPorVirtualTipo(supabase, empresaId, vt);
  }
  return result;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
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
    const empresaId = (body.empresa_id ?? body.empresaId ?? "").toString().trim();
    const pautaId = (body.pauta_id ?? body.pautaId ?? "").toString().trim();

    if (!empresaId && !pautaId) {
      return new Response(
        JSON.stringify({ error: "empresa_id ou pauta_id é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    let pautas: { id: string; reuniao_id: string; empresa_id: string; output_2a: unknown; output_2b: unknown }[] = [];
    if (pautaId) {
      const { data } = await supabase
        .from("pauta_sugerida_ia")
        .select("id, reuniao_id, empresa_id, output_2a, output_2b")
        .eq("id", pautaId)
        .eq("status", "aprovada");
      pautas = (data ?? []) as typeof pautas;
    } else {
      const { data } = await supabase
        .from("pauta_sugerida_ia")
        .select("id, reuniao_id, empresa_id, output_2a, output_2b")
        .eq("empresa_id", empresaId)
        .eq("status", "aprovada");
      pautas = (data ?? []) as typeof pautas;
    }

    let totalBriefings = 0;
    for (const pauta of pautas) {
      const meetingAgenda = (pauta.output_2a as { meeting_agenda?: Array<Record<string, unknown>> })?.meeting_agenda ?? [];
      const briefingsIA = (pauta.output_2b as { member_briefings?: Array<Record<string, unknown>> })?.member_briefings ?? [];
      const briefingByMembro = new Map<string, Record<string, unknown>>();
      for (const b of briefingsIA) {
        const id = b.membro_id;
        if (id && typeof id === "string") briefingByMembro.set(id, b);
      }

      const { data: reuniao } = await supabase
        .from("reunioes")
        .select("id, conselho_id, comite_id, comissao_id, virtual_tipo")
        .eq("id", pauta.reuniao_id)
        .maybeSingle();

      const membrosAlocados = reuniao
        ? await fetchMembrosPorReuniao(supabase, pauta.empresa_id, {
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

      const dadosCompletos = meetingAgenda.length > 0 ? { meeting_agenda: meetingAgenda } : undefined;
      for (const membro of membrosParaBriefing) {
        const b = briefingByMembro.get(membro.id);
        const resumo = b ? ((b.resumo_executivo ?? "") as string) : "";
        const perguntas = b && Array.isArray(b.perguntas_criticas) ? (b.perguntas_criticas as string[]) : [];
        const seuFoco = b ? ((b.seu_foco ?? "") as string) : "";
        const preparacao = b ? ((b.preparacao_recomendada ?? "") as string) : "";
        const alertas = b ? ((b.alertas_contextuais ?? "") as string) : "";
        const temConteudo = resumo || perguntas.length > 0 || seuFoco || preparacao || alertas || (dadosCompletos?.meeting_agenda?.length ?? 0) > 0;

        const { data: existing } = await supabase
          .from("membro_briefing")
          .select("id")
          .eq("membro_id", membro.id)
          .eq("reuniao_id", pauta.reuniao_id)
          .maybeSingle();

        const payload = {
          membro_id: membro.id,
          empresa_id: pauta.empresa_id,
          reuniao_id: pauta.reuniao_id,
          titulo: temConteudo ? `Briefing - Reunião ${new Date().toLocaleDateString("pt-BR")}` : null,
          resumo_executivo: resumo || null,
          perguntas_criticas: perguntas.length > 0 ? perguntas : [],
          seu_foco: seuFoco || null,
          preparacao_recomendada: preparacao || null,
          alertas_contextuais: alertas || null,
          dados_completos: dadosCompletos ?? null,
          updated_at: new Date().toISOString(),
        };

        if (existing?.id) {
          await supabase.from("membro_briefing").update(payload).eq("id", existing.id);
        } else {
          await supabase.from("membro_briefing").insert({ ...payload, created_at: new Date().toISOString() });
        }
        totalBriefings++;
      }
    }

    return new Response(
      JSON.stringify({ ok: true, pautasProcessadas: pautas.length, briefingsCriadosOuAtualizados: totalBriefings }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[sync-briefings-pautas-aprovadas]", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Erro ao processar" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
