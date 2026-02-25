/**
 * Agente que gera PDIs (Planos de Desenvolvimento Individual) personalizados para membros de conselhos.
 */

export const AGENTE_PDI_CONSELHO_ID = "agente-pdi-conselho";

export interface PerfilMembro {
  nome: string;
  cargo: string;
  areasAtuacao: string[];
  lacunasIdentificadas?: string[];
  avaliacoesAnteriores?: Record<string, number>;
}

export interface PDI {
  membro: string;
  objetivos: Array<{ objetivo: string; prazo: string; indicador: string }>;
  acoesDesenvolvimento: Array<{ acao: string; tipo: "curso" | "mentoria" | "leitura" | "pratica" }>;
  metasCurtoPrazo: string[];
  metasMedioPrazo: string[];
  dataCriacao: string;
}

/**
 * Gera PDI personalizado para um membro do conselho.
 */
export function gerarPDIPersonalizado(_perfil: PerfilMembro): Promise<PDI> {
  return Promise.resolve({
    membro: "",
    objetivos: [],
    acoesDesenvolvimento: [],
    metasCurtoPrazo: [],
    metasMedioPrazo: [],
    dataCriacao: new Date().toISOString(),
  });
}
