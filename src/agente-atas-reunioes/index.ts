/**
 * Agente para geração de atas de reuniões.
 * Focado na produção do documento formal de ata (integrado ao agente-ata e prompts).
 */

export const AGENTE_ATAS_REUNIOES_ID = "agente-atas-reunioes";

export interface ReuniaoParaAta {
  id: string;
  data: string;
  tipo: string;
  pautas: Array<{ titulo: string; deliberacao?: string }>;
  participantes: string[];
  observacoes?: string;
}

export interface AtaReuniao {
  identificacao: string;
  corpo: string;
  deliberacoes: Array<{ pauta: string; decisao: string }>;
  assinaturas?: string[];
}

/**
 * Gera ata formal da reunião a partir dos dados da reunião.
 */
export function gerarAtaReuniao(_reuniao: ReuniaoParaAta): Promise<AtaReuniao> {
  return Promise.resolve({
    identificacao: "",
    corpo: "",
    deliberacoes: [],
  });
}
