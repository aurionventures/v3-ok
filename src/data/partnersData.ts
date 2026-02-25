/**
 * Dados de parceiros para a tela de Gestão de Parceiros.
 * Em produção, substituir por chamadas à API.
 */

export type PartnerType = "Afiliado" | "Consultoria" | "Revenda" | "Integrador" | "Parceiro";
export type PartnerStatus = "Ativo" | "Pendente";

export interface Partner {
  id: string;
  companyName: string;
  document: string;
  type: PartnerType;
  status: PartnerStatus;
}

export const MOCK_PARTNERS: Partner[] = [
  { id: "1", companyName: "Parceiro Demo Legacy", document: "11.222.333/0001-44", type: "Afiliado", status: "Ativo" },
  { id: "2", companyName: "Consultoria Alfa Governance", document: "12.345.678/0001-90", type: "Consultoria", status: "Ativo" },
  { id: "3", companyName: "Integrador Delta Tech", document: "33.444.555/0001-22", type: "Integrador", status: "Pendente" },
  { id: "4", companyName: "Revenda Beta Solutions", document: "44.555.666/0001-33", type: "Revenda", status: "Ativo" },
  { id: "5", companyName: "Parceiro Gamma Corp", document: "55.666.777/0001-44", type: "Parceiro", status: "Ativo" },
  { id: "6", companyName: "Afiliado Epsilon", document: "66.777.888/0001-55", type: "Afiliado", status: "Ativo" },
];

export interface PartnersMetrics {
  total: number;
  ativos: number;
  pendentes: number;
  comissaoMedia: string;
  convitesPendentes: number;
  contratosPendentes: number;
}

export function getPartnersMetrics(partners: Partner[]): PartnersMetrics {
  const ativos = partners.filter((p) => p.status === "Ativo").length;
  const pendentes = partners.filter((p) => p.status === "Pendente").length;
  return {
    total: partners.length,
    ativos,
    pendentes,
    comissaoMedia: "17%",
    convitesPendentes: 0,
    contratosPendentes: 0,
  };
}
