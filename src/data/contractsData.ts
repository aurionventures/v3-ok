/**
 * Dados de contratos para a tela de Gestão de Contratos.
 * Em produção, substituir por chamadas à API.
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

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: "1",
    number: "CONT-2026-0001",
    clientName: "Empresa ABC Ltda",
    clientEmail: "contrato@empresaabc.com.br",
    status: "Ativo",
    type: "PLG",
  },
  {
    id: "2",
    number: "CONT-2026-0002",
    clientName: "Tech Solutions XYZ S.A.",
    clientEmail: "juridico@techsolutions.com.br",
    status: "Aguardando Assinatura",
    type: "SLG",
  },
  {
    id: "3",
    number: "CONT-2026-0003",
    clientName: "Governança Corporativa Ltda",
    clientEmail: "governanca@governancacorp.com.br",
    status: "Rascunho",
    type: "PLG",
  },
  {
    id: "4",
    number: "CONT-2026-0004",
    clientName: "Inovação Digital S.A.",
    clientEmail: "contratos@inovacaodigital.com.br",
    status: "Aguardando Contra-assinatura",
    type: "SLG",
  },
  {
    id: "5",
    number: "CONT-2025-0045",
    clientName: "Consultoria Estratégica Ltda",
    clientEmail: "admin@consultoriaestrategica.com.br",
    status: "Expirado",
    type: "PLG",
  },
  {
    id: "6",
    number: "CONT-2025-0038",
    clientName: "Gestão Avançada S.A.",
    clientEmail: "compliance@gestaoavancada.com.br",
    status: "Cancelado",
    type: "SLG",
  },
  {
    id: "7",
    number: "CTR-1771708919698",
    clientName: "RM LIGTH ASSET LTDA",
    clientEmail: "contato@rmligth.com.br",
    status: "Aguardando Contra-assinatura",
    type: "SLG",
  },
];

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
