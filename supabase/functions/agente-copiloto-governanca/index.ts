/**
 * Agente Copiloto de Governança – gera pauta de reunião + insights + briefings por membro.
 * Rota: POST /functions/v1/agente-copiloto-governanca
 * Body: { empresa_id, reuniao_id } ou { input } com contexto pré-montado
 */

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { runAgent } from "../_shared/openai.ts";
import { PROMPT_COPILOTO_GOVERNANCA } from "./prompt.ts";

function substitute(template: string, vars: Record<string, string>): string {
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replace(new RegExp(`{{${k}}}`, "g"), v ?? "Não informado");
  }
  return out;
}

async function fetchContext(supabase: ReturnType<typeof createClient>, empresaId: string, reuniaoId: string) {
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  const since = twoYearsAgo.toISOString().slice(0, 10);

  // Empresa
  const { data: empresa } = await supabase
    .from("empresas")
    .select("nome, setor, segmento, porte, areas_atuacao, descricao, missao")
    .eq("id", empresaId)
    .maybeSingle();

  // Reunião
  const { data: reuniao } = await supabase
    .from("reunioes")
    .select("id, titulo, data_reuniao, horario, tipo, conselho_id, comite_id, comissao_id, virtual_tipo")
    .eq("id", reuniaoId)
    .maybeSingle();

  if (!reuniao) throw new Error("Reunião não encontrada");
  const empresaNome = empresa?.nome ?? "Empresa";
  const setor = empresa?.setor ?? empresa?.segmento ?? "Não informado";

  // Membros do órgão
  const membros: { id: string; nome: string; email: string | null; cargo: string | null }[] = [];
  const orgaoIds: string[] = [];
  if (reuniao.conselho_id) orgaoIds.push(reuniao.conselho_id);
  if (reuniao.comite_id) orgaoIds.push(reuniao.comite_id);
  if (reuniao.comissao_id) orgaoIds.push(reuniao.comissao_id);

  if (orgaoIds.length > 0) {
    const campo = reuniao.conselho_id ? "conselho_id" : reuniao.comite_id ? "comite_id" : "comissao_id";
    const { data: alocacoes } = await supabase
      .from("alocacoes_membros")
      .select("membro_id, cargo")
      .in(campo, orgaoIds)
      .eq("ativo", true);
    const membroIds = [...new Set((alocacoes ?? []).map((a: { membro_id: string }) => a.membro_id))];
    const cargoByMembro = new Map<string, string>((alocacoes ?? []).map((a: { membro_id: string; cargo?: string }) => [a.membro_id, a.cargo ?? ""]));
    if (membroIds.length > 0) {
      const { data: mg } = await supabase
        .from("membros_governanca")
        .select("id, nome, email")
        .eq("empresa_id", empresaId)
        .in("id", membroIds);
      for (const m of mg ?? []) {
        membros.push({
          id: m.id,
          nome: m.nome,
          email: m.email ?? null,
          cargo: cargoByMembro.get(m.id) ?? null,
        });
      }
    }
  }

  if (membros.length === 0 && reuniao.virtual_tipo) {
    const vt = reuniao.virtual_tipo as string;
    const tabela = vt === "conselho" ? "conselhos" : vt === "comite" ? "comites" : "comissoes";
    const { data: orgaos } = await supabase.from(tabela).select("id").eq("empresa_id", empresaId).eq("ativo", true);
    const oids = (orgaos ?? []).map((o: { id: string }) => o.id);
    const campo = vt === "conselho" ? "conselho_id" : vt === "comite" ? "comite_id" : "comissao_id";
    if (oids.length > 0) {
      const { data: alocacoes } = await supabase
        .from("alocacoes_membros")
        .select("membro_id, cargo")
        .in(campo, oids)
        .eq("ativo", true);
      const membroIds = [...new Set((alocacoes ?? []).map((a: { membro_id: string }) => a.membro_id))];
      const cargoByMembro = new Map<string, string>((alocacoes ?? []).map((a: { membro_id: string; cargo?: string }) => [a.membro_id, a.cargo ?? ""]));
      if (membroIds.length > 0) {
        const { data: mg } = await supabase
          .from("membros_governanca")
          .select("id, nome, email")
          .eq("empresa_id", empresaId)
          .in("id", membroIds);
        for (const m of mg ?? []) {
          membros.push({ id: m.id, nome: m.nome, email: m.email ?? null, cargo: cargoByMembro.get(m.id) ?? null });
        }
      }
    }
  }

  // Reuniões da empresa (para histórico)
  const { data: conselhos } = await supabase.from("conselhos").select("id").eq("empresa_id", empresaId);
  const { data: comites } = await supabase.from("comites").select("id").eq("empresa_id", empresaId);
  const { data: comissoes } = await supabase.from("comissoes").select("id").eq("empresa_id", empresaId);
  const cIds = (conselhos ?? []).map((c: { id: string }) => c.id);
  const coIds = (comites ?? []).map((c: { id: string }) => c.id);
  const csIds = (comissoes ?? []).map((c: { id: string }) => c.id);

  const { data: reunioesByEmpresa } = await supabase
    .from("reunioes")
    .select("id")
    .eq("empresa_id", empresaId)
    .gte("data_reuniao", since);
  let reuniaoIds = (reunioesByEmpresa ?? []).map((r: { id: string }) => r.id);
  if (reuniaoIds.length === 0 && (cIds.length || coIds.length || csIds.length)) {
    const orParts: string[] = [];
    if (cIds.length) orParts.push(`conselho_id.in.(${cIds.join(",")})`);
    if (coIds.length) orParts.push(`comite_id.in.(${coIds.join(",")})`);
    if (csIds.length) orParts.push(`comissao_id.in.(${csIds.join(",")})`);
    const { data: reunioesByOrg } = await supabase
      .from("reunioes")
      .select("id")
      .or(orParts.join(","))
      .gte("data_reuniao", since);
    reuniaoIds = (reunioesByOrg ?? []).map((r: { id: string }) => r.id);
  }

  // Atas
  let atasTexto = "Nenhuma ata disponível.";
  if (reuniaoIds.length > 0) {
    const { data: atas } = await supabase
      .from("atas")
      .select("id, reuniao_id, conteudo, created_at")
      .in("reuniao_id", reuniaoIds)
      .order("created_at", { ascending: false })
      .limit(20);
    if (atas && atas.length > 0) {
      const { data: reunioesData } = await supabase.from("reunioes").select("id, titulo, data_reuniao").in("id", atas.map((a: { reuniao_id: string }) => a.reuniao_id));
      const reuniaoMap = new Map((reunioesData ?? []).map((r: { id: string; titulo?: string; data_reuniao?: string }) => [r.id, r]));
      atasTexto = atas
        .map(
          (a: { reuniao_id: string; conteudo?: string; created_at?: string }) =>
            `--- ATA: ${(reuniaoMap.get(a.reuniao_id) as { titulo?: string; data_reuniao?: string })?.titulo ?? "—"} (${(reuniaoMap.get(a.reuniao_id) as { data_reuniao?: string })?.data_reuniao ?? "—"}) ---\n${((a.conteudo ?? "").slice(0, 2500))}`
        )
        .join("\n\n");
    }
  }

  // Riscos
  const { data: riscos } = await supabase.from("riscos").select("descricao, severidade").eq("empresa_id", empresaId);
  const riscosTexto =
    riscos && riscos.length > 0
      ? riscos.map((r: { descricao?: string; severidade?: string }) => `- ${r.descricao ?? ""} (Severidade: ${r.severidade ?? "não informada"})`).join("\n")
      : "Nenhum risco cadastrado.";

  // Tarefas
  let tarefasTexto = "Nenhuma tarefa registrada.";
  if (reuniaoIds.length > 0) {
    const { data: tarefas } = await supabase
      .from("reuniao_tarefas")
      .select("titulo, status, data_prazo")
      .in("reuniao_id", reuniaoIds);
    if (tarefas && tarefas.length > 0) {
      tarefasTexto = tarefas
        .map((t: { titulo?: string; status?: string; data_prazo?: string }) => `- ${t.titulo ?? ""} | Status: ${t.status ?? "—"} | Prazo: ${t.data_prazo ?? "—"}`)
        .join("\n");
    }
  }

  // Pautas
  let pautasTexto = "Nenhuma pauta anterior.";
  if (reuniaoIds.length > 0) {
    const { data: pautas } = await supabase.from("pautas").select("titulo, descricao, tipo").in("reuniao_id", reuniaoIds);
    if (pautas && pautas.length > 0) {
      pautasTexto = pautas.map((p: { titulo?: string; descricao?: string; tipo?: string }) => `- ${p.titulo ?? ""} (${p.tipo ?? "informativo"}): ${(p.descricao ?? "").slice(0, 200)}`).join("\n");
    }
  }

  const governanceHistory = [
    "ATAS RECENTES:\n" + atasTexto,
    "\nRISCOS CADASTRADOS:\n" + riscosTexto,
    "\nTAREFAS:\n" + tarefasTexto,
    "\nPAUTAS ANTERIORES:\n" + pautasTexto,
  ].join("\n");

  const councilMembers =
    membros.length > 0
      ? membros
          .map((m) => `- ID: ${m.id} | Nome: ${m.nome} | Cargo: ${m.cargo ?? "—"} | Email: ${m.email ?? "—"}`)
          .join("\n")
      : "Nenhum membro cadastrado no órgão desta reunião. Gere output_1 e output_2a normalmente. Para output_2b, retorne member_briefings como array vazio [].";

  const meetingDate = reuniao.data_reuniao ? new Date(reuniao.data_reuniao).toLocaleDateString("pt-BR") : "Não definida";
  const meetingDuration = "2";
  const meetingFormat = reuniao.tipo ? String(reuniao.tipo) : "Presencial";

  return {
    company_name: empresaNome,
    sector: setor,
    geography: "Não informado",
    revenue: "Não informado",
    key_customers: "Não informado",
    key_suppliers: "Não informado",
    governance_history: governanceHistory,
    council_members: councilMembers,
    meeting_date: meetingDate,
    meeting_duration: meetingDuration,
    meeting_format: meetingFormat,
  };
}

function parseJsonResponse(raw: string): unknown {
  const trimmed = raw.trim();
  let jsonStr = trimmed;
  const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonStr = jsonMatch[1].trim();
  else {
    const braceStart = trimmed.indexOf("{");
    if (braceStart >= 0) jsonStr = trimmed.slice(braceStart);
  }
  return JSON.parse(jsonStr);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const inputPreBuilt = (body.input ?? body.contexto ?? "").trim();
    const empresaId = (body.empresa_id ?? "").trim();
    const reuniaoId = (body.reuniao_id ?? "").trim();

    let userContent: string;
    let vars: Record<string, string>;

    if (inputPreBuilt) {
      userContent = inputPreBuilt;
      vars = {};
    } else if (empresaId && reuniaoId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (!supabaseUrl || !serviceRoleKey) {
        return new Response(
          JSON.stringify({ error: "Configuração do servidor incompleta" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      vars = await fetchContext(supabase, empresaId, reuniaoId);
      userContent = "";
    } else {
      return new Response(
        JSON.stringify({ error: "Informe 'empresa_id' e 'reuniao_id' ou 'input' com contexto" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = vars && Object.keys(vars).length > 0 ? substitute(PROMPT_COPILOTO_GOVERNANCA, vars) : PROMPT_COPILOTO_GOVERNANCA;
    const finalUserContent = userContent || "Gere os outputs conforme o prompt.";

    const result = await runAgent({
      systemPrompt,
      userContent: finalUserContent,
      model: "gpt-4o",
      agentKey: "BUSCA_CONVERSACIONAL_ATAS",
    });

    const parsed = parseJsonResponse(result) as {
      output_1?: { strategic_risks?: unknown[]; operational_threats?: unknown[]; strategic_opportunities?: unknown[] };
      output_2a?: { meeting_agenda?: unknown[] };
      output_2b?: { member_briefings?: unknown[] };
      metadata?: unknown;
    };

    return new Response(
      JSON.stringify({
        output_1: parsed.output_1 ?? null,
        output_2a: parsed.output_2a ?? null,
        output_2b: parsed.output_2b ?? null,
        metadata: parsed.metadata ?? null,
        raw: result,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[agente-copiloto-governanca]", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Erro ao processar" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
