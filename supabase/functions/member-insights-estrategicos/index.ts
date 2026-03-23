/**
 * Insights estratégicos para membros – evita Invalid JWT ao buscar dados com service role.
 * Rota: POST /functions/v1/member-insights-estrategicos
 * Body: { "empresa_id": string, "access_token": string }
 */

import { corsHeaders } from "../_shared/cors.ts";
import { runAgent } from "../_shared/openai.ts";
import { PROMPT_AGENTE_INSIGHTS_ESTRATEGICOS } from "../agente-insights-estrategicos/prompt.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

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
    const body = await req.json();
    const empresaId = body.empresa_id?.trim();
    const accessToken = body.access_token?.trim();

    if (!empresaId || !accessToken) {
      return new Response(
        JSON.stringify({ error: "empresa_id e access_token são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Sessão inválida. Faça logout e entre novamente." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: membro } = await supabase
      .from("membros")
      .select("id, empresa_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membro || membro.empresa_id !== empresaId) {
      return new Response(
        JSON.stringify({ error: "Acesso não autorizado a esta empresa." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const [conselhos, comites, comissoes] = await Promise.all([
      supabase.from("conselhos").select("id").eq("empresa_id", empresaId),
      supabase.from("comites").select("id").eq("empresa_id", empresaId),
      supabase.from("comissoes").select("id").eq("empresa_id", empresaId),
    ]);

    const conselhoIds = (conselhos.data ?? []).map((c: { id: string }) => c.id);
    const comiteIds = (comites.data ?? []).map((c: { id: string }) => c.id);
    const comissaoIds = (comissoes.data ?? []).map((c: { id: string }) => c.id);

    const orClauses: string[] = [`empresa_id.eq.${empresaId}`];
    if (conselhoIds.length) orClauses.push(`conselho_id.in.(${conselhoIds.join(",")})`);
    if (comiteIds.length) orClauses.push(`comite_id.in.(${comiteIds.join(",")})`);
    if (comissaoIds.length) orClauses.push(`comissao_id.in.(${comissaoIds.join(",")})`);

    const { data: reunioesRows } = await supabase
      .from("reunioes")
      .select("id, data_reuniao")
      .or(orClauses.join(","));

    const reunioes = (reunioesRows ?? []) as { id: string; data_reuniao: string | null }[];
    const reuniaoIds = reunioes.map((r) => r.id);

    const { data: tarefasRows } = await supabase
      .from("tarefas_reuniao")
      .select("id, data_conclusao")
      .in("reuniao_id", reuniaoIds.length ? reuniaoIds : ["__none__"]);

    const tarefas = (tarefasRows ?? []) as { id: string; data_conclusao: string | null }[];
    const tarefasResolvidas = tarefas.filter((t) => t.data_conclusao).length;
    const tarefasTotal = tarefas.length;
    const tarefasPendentes = tarefasTotal - tarefasResolvidas;
    const taxaResolucao = tarefasTotal > 0 ? Math.round((tarefasResolvidas / tarefasTotal) * 100) : 0;

    const { count: riscosTotal } = await supabase
      .from("riscos")
      .select("id", { count: "exact", head: true })
      .eq("empresa_id", empresaId);
    const { count: riscosCriticosCount } = await supabase
      .from("riscos")
      .select("id", { count: "exact", head: true })
      .eq("empresa_id", empresaId)
      .or("severidade.eq.critico,severidade.eq.crítico,severidade.eq.alto");

    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    const reunioesEsteMes = reunioes.filter((r) => (r.data_reuniao ?? "").slice(0, 10) >= inicioMes).length;

    const { data: pautasRows } = reuniaoIds.length
      ? await supabase.from("pautas").select("reuniao_id").in("reuniao_id", reuniaoIds)
      : { data: [] };
    const reunioesComPautas = new Set((pautasRows ?? []).map((p: { reuniao_id: string }) => p.reuniao_id)).size;

    const { data: atasRows } = reuniaoIds.length
      ? await supabase.from("atas").select("id, status").in("reuniao_id", reuniaoIds)
      : { data: [] };
    const atasList = (atasRows ?? []) as { id: string; status: string | null }[];
    const totalAtas = atasList.length;
    const pautasDefinidasPct = reunioes.length > 0 ? Math.round((reunioesComPautas / reunioes.length) * 100) : 0;
    const atasGeradasPct = reunioes.length > 0 ? Math.round((totalAtas / reunioes.length) * 100) : 0;
    const atasPendentes = atasList.filter(
      (a) => a.status === "aguardando_aprovacao" || a.status === "aguardando_assinatura"
    ).length;

    const orgaosSet = new Set<string>();
    const { data: reunioesFull } = await supabase
      .from("reunioes")
      .select("conselho_id, comite_id, comissao_id, conselhos(nome), comites(nome), comissoes(nome)")
      .or(orClauses.join(","));
    for (const r of (reunioesFull ?? []) as Array<{ conselhos?: { nome: string } | null; comites?: { nome: string } | null; comissoes?: { nome: string } | null }>) {
      if (r.conselhos?.nome) orgaosSet.add(r.conselhos.nome);
      if (r.comites?.nome) orgaosSet.add(r.comites.nome);
      if (r.comissoes?.nome) orgaosSet.add(r.comissoes.nome);
    }

    const indicadoresTexto = [
      `Indicadores da empresa:`,
      `- Riscos críticos: ${riscosCriticosCount ?? 0}, Total de riscos: ${riscosTotal ?? 0}`,
      `- Tarefas pendentes: ${tarefasPendentes}, Total: ${tarefasTotal}, Taxa de resolução: ${taxaResolucao}%`,
      `- Pautas definidas: ${pautasDefinidasPct}%, ATAs geradas: ${atasGeradasPct}%`,
      `- ATAs pendentes: ${atasPendentes}, Reuniões este mês: ${reunioesEsteMes}, Órgãos ativos: ${orgaosSet.size}`,
    ].join("\n");

    const { data: riscosRows } = await supabase
      .from("riscos")
      .select("descricao, severidade")
      .eq("empresa_id", empresaId);
    const riscosTexto =
      (riscosRows ?? []).length > 0
        ? (riscosRows ?? [])
            .map(
              (r: { descricao?: string; severidade?: string }) =>
                `- ${r.descricao ?? ""} (Severidade: ${r.severidade ?? "não informada"})`
            )
            .join("\n")
        : "Nenhum risco cadastrado.";

    const { data: atasComConteudo } = reuniaoIds.length
      ? await supabase
          .from("atas")
          .select("conteudo, reunioes(titulo, data_reuniao)")
          .in("reuniao_id", reuniaoIds)
          .order("created_at", { ascending: false })
          .limit(10)
      : { data: [] };
    const atasTexto =
      (atasComConteudo ?? []).length > 0
        ? (atasComConteudo ?? [])
            .map(
              (a: { conteudo?: string | null; reunioes?: { titulo?: string; data_reuniao?: string } | null }) =>
                `--- ATA: ${(a.reunioes as { titulo?: string; data_reuniao?: string })?.titulo ?? "—"} (${(a.reunioes as { titulo?: string; data_reuniao?: string })?.data_reuniao ?? "—"}) ---\n${((a.conteudo ?? "") as string).slice(0, 2000)}`
            )
            .join("\n\n")
        : "Nenhuma ata disponível.";

    const { data: empresaRow } = await supabase
      .from("empresas")
      .select("setor, segmento, porte, areas_atuacao, descricao, missao")
      .eq("id", empresaId)
      .maybeSingle();

    const emp = empresaRow as { setor?: string; segmento?: string; porte?: string; areas_atuacao?: string; descricao?: string; missao?: string } | null;
    const contextoEmpresa =
      emp && (emp.setor || emp.segmento || emp.descricao || emp.areas_atuacao)
        ? [
            "Contexto da empresa (setor, atuação):",
            emp.setor ? `- Setor: ${emp.setor}` : "",
            emp.segmento ? `- Segmento: ${emp.segmento}` : "",
            emp.porte ? `- Porte: ${emp.porte}` : "",
            emp.areas_atuacao ? `- Áreas de atuação: ${emp.areas_atuacao}` : "",
            emp.descricao ? `- Descrição: ${emp.descricao}` : "",
            emp.missao ? `- Missão: ${emp.missao}` : "",
          ]
            .filter(Boolean)
            .join("\n")
        : "";

    const input = [
      contextoEmpresa ? `${contextoEmpresa}\n\n` : "",
      indicadoresTexto,
      "",
      "Riscos cadastrados:",
      riscosTexto,
      "",
      "Resumos das atas recentes:",
      atasTexto,
    ].join("\n");

    const result = await runAgent({
      systemPrompt: PROMPT_AGENTE_INSIGHTS_ESTRATEGICOS,
      userContent: input,
      agentKey: "INSIGHTS_ESTRATEGICOS",
    });

    return new Response(
      JSON.stringify({ insights: result, raw: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message ?? "Erro ao processar" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
