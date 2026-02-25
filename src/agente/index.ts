/**
 * Agente genérico – ponto de extensão para novos agentes ou orquestração.
 * Pode ser usado como base para registro e execução de agentes.
 */

export const AGENTE_GENERICO_ID = "agente";

export interface AgenteConfig {
  id: string;
  nome: string;
  descricao: string;
  promptPadrao?: string;
  ativo: boolean;
}

export interface ExecucaoAgente<TEntrada, TSaida> {
  agenteId: string;
  entrada: TEntrada;
  saida?: TSaida;
  erro?: string;
  duracaoMs?: number;
}

/**
 * Executa um agente genérico (placeholder para orquestração).
 */
export function executarAgente<TEntrada, TSaida>(
  _config: AgenteConfig,
  _entrada: TEntrada,
  _executor: (e: TEntrada) => Promise<TSaida>
): Promise<ExecucaoAgente<TEntrada, TSaida>> {
  return Promise.resolve({
    agenteId: _config.id,
    entrada: _entrada,
  });
}
