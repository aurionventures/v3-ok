/**
 * Serviço de insights estratégicos.
 * Usa o agente-insights-estrategicos com contexto real (indicadores, atas, riscos).
 */

import { supabase } from "@/lib/supabase";
import { invokeEdgeFunction } from "@/lib/supabase";
import { fetchDashboardIndicadores } from "@/services/secretariado";
import { fetchAtas } from "@/services/atas";
import { fetchReunioes } from "@/services/agenda";
import { fetchEmpresaDados } from "@/services/empresas";

export interface InsightCardItem {
  id: string;
  title: string;
  description: string;
  statusTags: { label: string; variant: string; bgClass: string; textClass: string }[];
  actions: { label: string; href?: string }[];
  accentColor: string;
}

export interface InsightsEstrategicosResult {
  riscos: InsightCardItem[];
  ameacas: InsightCardItem[];
  oportunidades: InsightCardItem[];
  resumo: string;
  error?: string;
}

interface ParsedInsights {
  riscos?: Array<{ titulo?: string; descricao?: string; severidade?: string; acoes?: string[] }>;
  ameacas?: Array<{ titulo?: string; descricao?: string; tags?: string[]; acoes?: string[] }>;
  oportunidades?: Array<{ titulo?: string; descricao?: string; tags?: string[]; acoes?: string[] }>;
  resumo?: string;
}

const TAG_STYLES: Record<string, { bgClass: string; textClass: string }> = {
  critico: { bgClass: "bg-red-600", textClass: "text-white" },
  crítico: { bgClass: "bg-red-600", textClass: "text-white" },
  alto: { bgClass: "bg-orange-500", textClass: "text-white" },
  medio: { bgClass: "bg-amber-500", textClass: "text-white" },
  médio: { bgClass: "bg-amber-500", textClass: "text-white" },
  baixo: { bgClass: "bg-gray-500", textClass: "text-white" },
  imediato: { bgClass: "bg-red-600", textClass: "text-white" },
  "30 dias": { bgClass: "bg-orange-500", textClass: "text-white" },
  regulatorio: { bgClass: "bg-white border border-orange-500", textClass: "text-orange-600" },
  operacional: { bgClass: "bg-white border border-orange-500", textClass: "text-orange-600" },
  estrategica: { bgClass: "bg-green-600", textClass: "text-white" },
  estratégica: { bgClass: "bg-green-600", textClass: "text-white" },
};

function toCardItem(
  item: ParsedInsights["riscos"][0] | ParsedInsights["ameacas"][0] | ParsedInsights["oportunidades"][0],
  index: number,
  type: "risco" | "ameaca" | "oportunidade"
): InsightCardItem {
  const id = `${type}-${index}`;
  const title = item?.titulo ?? "Item sem título";
  const description = item?.descricao ?? "";
  const accentColor =
    type === "oportunidade" ? "text-green-600" : type === "ameaca" ? "text-orange-600" : "text-red-600";

  let statusTags: InsightCardItem["statusTags"] = [];
  if (item?.severidade) {
    const key = item.severidade.toLowerCase();
    const style = TAG_STYLES[key] ?? { bgClass: "bg-gray-500", textClass: "text-white" };
    statusTags = [{ label: item.severidade, variant: key, bgClass: style.bgClass, textClass: style.textClass }];
  }
  if (item && "tags" in item && Array.isArray(item.tags)) {
    for (const t of item.tags) {
      const key = String(t).toLowerCase();
      const style = TAG_STYLES[key] ?? { bgClass: "bg-gray-500", textClass: "text-white" };
      statusTags.push({ label: String(t), variant: key, bgClass: style.bgClass, textClass: style.textClass });
    }
  }
  if (statusTags.length === 0 && type === "oportunidade") {
    statusTags = [{ label: "Estratégica", variant: "strategic", bgClass: "bg-green-600", textClass: "text-white" }];
  }

  const actions = (item?.acoes ?? []).map((a) => ({ label: String(a) }));

  return { id, title, description, statusTags, actions, accentColor };
}

function parseInsightsResponse(raw: string): InsightsEstrategicosResult | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let jsonStr = trimmed;
  const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonStr = jsonMatch[1].trim();
  else {
    const braceStart = trimmed.indexOf("{");
    if (braceStart >= 0) jsonStr = trimmed.slice(braceStart);
  }

  try {
    const parsed = JSON.parse(jsonStr) as ParsedInsights;
    const riscos = (parsed.riscos ?? []).slice(0, 2).map((r, i) => toCardItem(r, i, "risco"));
    const ameacas = (parsed.ameacas ?? []).slice(0, 2).map((a, i) => toCardItem(a, i, "ameaca"));
    const oportunidades = (parsed.oportunidades ?? []).slice(0, 2).map((o, i) => toCardItem(o, i, "oportunidade"));
    return {
      riscos,
      ameacas,
      oportunidades,
      resumo: parsed.resumo ?? "",
    };
  } catch {
    return null;
  }
}

/**
 * Busca insights para membros via Edge Function server-side.
 * Evita Invalid JWT ao usar service role no servidor.
 */
export async function fetchInsightsEstrategicosMember(
  empresaId: string,
  accessToken: string
): Promise<InsightsEstrategicosResult> {
  const empty: InsightsEstrategicosResult = {
    riscos: [],
    ameacas: [],
    oportunidades: [],
    resumo: "",
  };

  try {
    const { data, error } = await invokeEdgeFunction<{
      insights?: string;
      raw?: string;
      resultado?: string;
      error?: string;
    }>(
      "member-insights-estrategicos",
      { empresa_id: empresaId, access_token: accessToken },
      { useAnonKey: true }
    );

    if (error) {
      return { ...empty, error: error.message };
    }

    const rawResult = data?.insights ?? data?.raw ?? data?.resultado ?? "";
    if (rawResult.toLowerCase().includes("openai_api_key") || rawResult.includes("Configure")) {
      return {
        ...empty,
        error:
          "Configure OPENAI_API_KEY no Supabase (Project Settings → Edge Functions → Secrets) para gerar insights com IA.",
      };
    }
    const parsed = parseInsightsResponse(rawResult);
    if (parsed) return parsed;

    return empty;
  } catch (err) {
    console.error("[insightsEstrategicos] fetchMember:", err);
    return { ...empty, error: err instanceof Error ? err.message : "Erro ao buscar insights" };
  }
}

/**
 * Busca insights estratégicos com dados reais da empresa (indicadores, atas, riscos).
 * Usa o agente-insights-estrategicos para gerar riscos, ameaças e oportunidades.
 */
export async function fetchInsightsEstrategicos(
  empresaId: string | null
): Promise<InsightsEstrategicosResult> {
  const empty: InsightsEstrategicosResult = {
    riscos: [],
    ameacas: [],
    oportunidades: [],
    resumo: "",
  };

  if (!empresaId) return empty;

  try {
    const [indicadores, reunioes, { data: atasData }, empresaDados] = await Promise.all([
      fetchDashboardIndicadores(empresaId),
      fetchReunioes(empresaId),
      fetchAtas(),
      fetchEmpresaDados(empresaId),
    ]);

    const reuniaoIds = new Set(reunioes.map((r) => r.id));
    const atas = (atasData ?? []).filter((a) => reuniaoIds.has(a.reuniao_id));

    let riscosTexto = "";
    if (supabase) {
      const { data: riscosRows } = await supabase
        .from("riscos")
        .select("descricao, severidade")
        .eq("empresa_id", empresaId);
      if (riscosRows && riscosRows.length > 0) {
        riscosTexto = riscosRows
          .map((r) => `- ${r.descricao ?? ""} (Severidade: ${r.severidade ?? "não informada"})`)
          .join("\n");
      }
    }

    const indicadoresTexto = [
      `Indicadores da empresa:`,
      `- Riscos críticos: ${indicadores.riscosCriticos}, Total de riscos: ${indicadores.riscosTotal}`,
      `- Tarefas pendentes: ${indicadores.tarefasPendentes}, Total: ${indicadores.tarefasTotal}, Taxa de resolução: ${indicadores.taxaResolucao}%`,
      `- Pautas definidas: ${indicadores.pautasDefinidasPct}%, ATAs geradas: ${indicadores.atasGeradasPct}%`,
      `- ATAs pendentes: ${indicadores.atasPendentes}, Reuniões este mês: ${indicadores.reunioesEsteMes}, Órgãos ativos: ${indicadores.orgaosAtivos}`,
    ].join("\n");

    const atasTexto =
      atas.length > 0
        ? atas
            .slice(0, 10)
            .map(
              (a) =>
                `--- ATA: ${a.reunioes?.titulo ?? "—"} (${a.reunioes?.data_reuniao ?? "—"}) ---\n${(a.conteudo ?? "").slice(0, 2000)}`
            )
            .join("\n\n")
        : "Nenhuma ata disponível.";

    const contextoEmpresa =
      empresaDados &&
      (empresaDados.setor || empresaDados.segmento || empresaDados.descricao || empresaDados.areas_atuacao)
        ? [
            "Contexto da empresa (setor, atuação):",
            empresaDados.setor ? `- Setor: ${empresaDados.setor}` : "",
            empresaDados.segmento ? `- Segmento: ${empresaDados.segmento}` : "",
            empresaDados.porte ? `- Porte: ${empresaDados.porte}` : "",
            empresaDados.areas_atuacao ? `- Áreas de atuação: ${empresaDados.areas_atuacao}` : "",
            empresaDados.descricao ? `- Descrição: ${empresaDados.descricao}` : "",
            empresaDados.missao ? `- Missão: ${empresaDados.missao}` : "",
          ]
            .filter(Boolean)
            .join("\n")
        : "";

    const input = [
      contextoEmpresa ? `${contextoEmpresa}\n\n` : "",
      indicadoresTexto,
      "",
      "Riscos cadastrados:",
      riscosTexto || "Nenhum risco cadastrado.",
      "",
      "Resumos das atas recentes:",
      atasTexto,
    ].join("\n");

    const { data, error } = await invokeEdgeFunction<{ insights?: string; raw?: string; error?: string }>(
      "agente-insights-estrategicos",
      { input },
      { useAnonKey: true }
    );

    if (error) {
      return { ...empty, error: error.message };
    }

    const rawResult = data?.insights ?? data?.raw ?? data?.resultado ?? "";
    if (rawResult.toLowerCase().includes("openai_api_key") || rawResult.includes("Configure")) {
      return {
        ...empty,
        error: "Configure OPENAI_API_KEY no Supabase (Project Settings → Edge Functions → Secrets) para gerar insights com IA.",
      };
    }
    const parsed = parseInsightsResponse(rawResult);
    if (parsed) return parsed;

    return empty;
  } catch (err) {
    console.error("[insightsEstrategicos] fetch:", err);
    return { ...empty, error: err instanceof Error ? err.message : "Erro ao buscar insights" };
  }
}
