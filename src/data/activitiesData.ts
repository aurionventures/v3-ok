export type PrioridadeProjeto = "Alta" | "Média" | "Baixa";
export type StatusProjeto =
  | "Aguardando Análise"
  | "Analisado por IA"
  | "Aprovado"
  | "Rejeitado";
export type NivelRisco = "Baixo" | "Médio" | "Alto" | null;

export interface ProjetoParaVotacao {
  id: string;
  titulo: string;
  descricao: string;
  submetidoPor: string;
  dataSubmissao: string;
  conselho: string;
  prioridade: PrioridadeProjeto;
  status: StatusProjeto;
  analiseIAProgresso: number | null;
  analiseIANivelRisco: NivelRisco;
}

/**
 * Projetos para a página Submeter Projetos (votação e histórico).
 */
export const projetosParaVotacao: ProjetoParaVotacao[] = [
  {
    id: "1",
    titulo: "Expansão para Mercado Internacional",
    descricao:
      "Proposta de abertura de filial na Europa com investimento de R$ 50 milhões",
    submetidoPor: "Carlos Silva",
    dataSubmissao: "15/05/2025",
    conselho: "Conselho de Administração",
    prioridade: "Alta",
    status: "Aguardando Análise",
    analiseIAProgresso: null,
    analiseIANivelRisco: null,
  },
  {
    id: "2",
    titulo: "Aquisição da TechStart Ltd",
    descricao:
      "Proposta de aquisição de startup de tecnologia por R$ 25 milhões",
    submetidoPor: "Ana Silva",
    dataSubmissao: "10/05/2025",
    conselho: "Conselho de Administração",
    prioridade: "Alta",
    status: "Analisado por IA",
    analiseIAProgresso: 75,
    analiseIANivelRisco: "Médio",
  },
  {
    id: "3",
    titulo: "Programa de Sustentabilidade ESG",
    descricao: "Implementação de programa ESG com metas para 2030",
    submetidoPor: "Maria Silva",
    dataSubmissao: "08/05/2025",
    conselho: "Conselho Consultivo",
    prioridade: "Média",
    status: "Aprovado",
    analiseIAProgresso: 95,
    analiseIANivelRisco: "Baixo",
  },
];
