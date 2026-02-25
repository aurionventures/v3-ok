/**
 * Agente de processamento de documentos.
 * Extração de texto, metadados e estrutura de arquivos (PDF, DOCX, etc.).
 */

export const AGENTE_PROCESSAMENTO_DOCUMENTOS_ID = "agente-processamento-documentos";

export interface DocumentoProcessado {
  id: string;
  nomeOriginal: string;
  tipoMime: string;
  textoExtraido: string;
  metadados: Record<string, string>;
  estrutura?: Array<{ nivel: number; titulo: string; conteudo?: string }>;
  dataProcessamento: string;
}

export interface OpcoesProcessamento {
  extrairEstrutura?: boolean;
  idioma?: string;
  ocrSeNecessario?: boolean;
}

/**
 * Processa um documento (arquivo ou buffer) e retorna texto e metadados.
 */
export function processarDocumento(
  _entrada: { buffer?: ArrayBuffer; url?: string; base64?: string },
  _opcoes?: OpcoesProcessamento
): Promise<DocumentoProcessado> {
  return Promise.resolve({
    id: "",
    nomeOriginal: "",
    tipoMime: "",
    textoExtraido: "",
    metadados: {},
    dataProcessamento: new Date().toISOString(),
  });
}
