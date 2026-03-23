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

export interface PartnersMetrics {
  total: number;
  ativos: number;
  pendentes: number;
  comissaoMedia: string;
  convitesPendentes: string;
  contratosPendentes: string;
}

export function getPartnersMetrics(partners: Partner[]): PartnersMetrics {
  const ativos = partners.filter((p) => p.status === "Ativo").length;
  const pendentes = partners.filter((p) => p.status === "Pendente").length;
  return {
    total: partners.length,
    ativos,
    pendentes,
    comissaoMedia: "—",
    convitesPendentes: "—",
    contratosPendentes: "—",
  };
}
