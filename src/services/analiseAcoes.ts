import { invokeEdgeFunction } from "@/lib/supabase";
import type { Documento } from "@/types/documentos";
import type { Entrevista } from "@/types/entrevistas";
import type { AnaliseAcoesResult } from "@/types/analiseAcoes";

const CATEGORIAS_CONTRATOS = ["Estatutos e Contratos", "Contratos", "Estatutos"];

function docEhContrato(doc: Documento): boolean {
  const cat = (doc.category ?? "").toLowerCase();
  return (
    CATEGORIAS_CONTRATOS.some((c) => cat.includes(c.toLowerCase())) ||
    cat.includes("contrato") ||
    cat.includes("estatuto")
  );
}

function formatarDocumentos(documentos: Documento[]): string {
  return documentos
    .map((d) => {
      const linhas = [
        `- ${d.name}`,
        `  Categoria: ${d.category ?? "—"}`,
        `  Tipo: ${d.type}`,
        `  Data: ${d.uploadDate}`,
        d.description ? `  Descrição: ${d.description}` : null,
      ].filter(Boolean);
      return linhas.join("\n");
    })
    .join("\n\n");
}

function formatarEntrevistas(entrevistas: Entrevista[]): string {
  return entrevistas
    .filter((e) => e.transcricao)
    .map((e) => {
      const linhas = [
        `## ${e.nome} (${e.papel})`,
        `Prioridade: ${e.prioridade} | Status: ${e.status}`,
        e.dataEntrevista ? `Data: ${e.dataEntrevista}` : null,
        "",
        "Transcrição:",
        e.transcricao,
      ].filter(Boolean);
      return linhas.join("\n");
    })
    .join("\n\n---\n\n");
}

export async function executarAnaliseAcoes(
  documentos: Documento[],
  entrevistas: Entrevista[]
): Promise<{ data: AnaliseAcoesResult | null; error: string | null }> {
  const docsContratos = documentos.filter(docEhContrato);
  const docsTexto = formatarDocumentos(docsContratos.length > 0 ? docsContratos : documentos);
  const entrevistasTexto = formatarEntrevistas(entrevistas);

  if (!docsTexto.trim() && !entrevistasTexto.trim()) {
    return {
      data: null,
      error: "Não há documentos de contratos nem entrevistas com transcrição para analisar.",
    };
  }

  const { data, error } = await invokeEdgeFunction<AnaliseAcoesResult & { error?: string; message?: string }>(
    "agente-analise-acoes",
    {
      documentos: docsTexto || "(Nenhum documento de contrato encontrado. Use os documentos disponíveis.)",
      entrevistas: entrevistasTexto || "(Nenhuma transcrição de entrevista disponível.)",
    }
  );

  if (error) {
    return { data: null, error: "Habilite a API da Open AI" };
  }
  if (data && typeof data === "object" && "error" in data && data.error) {
    return { data: null, error: "Habilite a API da Open AI" };
  }
  return { data: data ?? null, error: null };
}
