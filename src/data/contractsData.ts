/**
 * Tipos e utilitários para a tela de Gestão de Contratos.
 * Os dados virão da API quando o módulo estiver integrado.
 */

export type ContractStatus =
  | "Rascunho"
  | "Aguardando Assinatura"
  | "Aguardando Contra-assinatura"
  | "Ativo"
  | "Expirado"
  | "Cancelado";

export type ContractType = "PLG" | "SLG";

export interface Contract {
  id: string;
  number: string;
  clientName: string;
  clientEmail: string;
  clientCnpj?: string;
  status: ContractStatus;
  type: ContractType;
}

export interface ContractMetrics {
  total: number;
  rascunhos: number;
  aguardando: number;
  ativos: number;
  expirados: number;
  cancelados: number;
}

export function getContractMetrics(contracts: Contract[]): ContractMetrics {
  const rascunhos = contracts.filter((c) => c.status === "Rascunho").length;
  const aguardando = contracts.filter(
    (c) =>
      c.status === "Aguardando Assinatura" || c.status === "Aguardando Contra-assinatura"
  ).length;
  const ativos = contracts.filter((c) => c.status === "Ativo").length;
  const expirados = contracts.filter((c) => c.status === "Expirado").length;
  const cancelados = contracts.filter((c) => c.status === "Cancelado").length;
  return {
    total: contracts.length,
    rascunhos,
    aguardando,
    ativos,
    expirados,
    cancelados,
  };
}
