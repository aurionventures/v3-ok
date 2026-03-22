export type SeveridadeAPI = "critical" | "high" | "medium" | "low";
export type SeveridadeUI = "Alta" | "Média" | "Baixa";

export interface ResumoExecutivo {
  statusDocumentos?: { completos: number; incompletos: number; divergentes: number };
  analiseEntrevistas?: { alinhamentoGeral: number; totalEntrevistas: number; totalConflitos: number };
  governanceHealthScore?: number;
}

export interface Incongruencia {
  id?: number;
  titulo: string;
  refs: string[];
  severidade: SeveridadeAPI;
  recomendacao?: string;
}

export interface GapsCategoria {
  categoria: string;
  items: string[];
  severidade: SeveridadeAPI;
}

export interface AcaoPlano {
  titulo: string;
  prazo: "imediato" | "curto" | "medio" | "longo";
  categoria: string;
  responsavelSugerido?: string;
  metricasSucesso?: string;
}

export interface AnaliseAcoesResult {
  resumoExecutivo?: ResumoExecutivo;
  incongruencias?: Incongruencia[];
  gapsCategorias?: GapsCategoria[];
  planoAcao?: { acoes?: AcaoPlano[] };
  raw?: string;
}

export function mapSeveridade(s: SeveridadeAPI): SeveridadeUI {
  if (s === "critical" || s === "high") return "Alta";
  if (s === "medium") return "Média";
  return "Baixa";
}
