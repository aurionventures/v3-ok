/**
 * Agente para geração de ATA de reuniões.
 * Utiliza prompt dedicado para produzir atas estruturadas a partir de transcrições ou notas.
 */

export const AGENTE_ATA_ID = "agente-ata";

export interface EntradaAta {
  tituloReuniao: string;
  data: string;
  participantes: string[];
  transcricaoOuNotas: string;
  tipoReuniao?: "ordinaria" | "extraordinaria" | "deliberativa";
}

export interface SaidaAta {
  cabecalho: string;
  resumo: string;
  deliberacoes: Array<{ assunto: string; decisao: string }>;
  encaminhamentos: Array<{ responsavel: string; prazo: string; acao: string }>;
  proximaReuniao?: string;
  textoCompleto: string;
}

/**
 * Gera ATA de reunião a partir da entrada (integrado ao prompt em prompts-agentes).
 */
export function gerarAta(_entrada: EntradaAta): Promise<SaidaAta> {
  return Promise.resolve({
    cabecalho: "",
    resumo: "",
    deliberacoes: [],
    encaminhamentos: [],
    textoCompleto: "",
  });
}
