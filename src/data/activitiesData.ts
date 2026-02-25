/**
 * Dados de atividades para Settings > Atividades (histórico genérico).
 */
export const allActivities = [
  {
    id: 1,
    type: "meeting" as const,
    title: "Reunião do Conselho Consultivo",
    date: "24 de maio, 2025",
    status: "scheduled" as const,
    description: "Análise de resultados trimestrais e planejamento estratégico",
  },
  {
    id: 2,
    type: "document" as const,
    title: "Atualização do Protocolo Familiar",
    date: "20 de maio, 2025",
    status: "completed" as const,
    description: "Adição de cláusulas sobre política de dividendos",
  },
  {
    id: 3,
    type: "training" as const,
    title: "Workshop de Liderança para Herdeiros",
    date: "15 de maio, 2025",
    status: "completed" as const,
    description: "Formação sobre comunicação e tomada de decisão",
  },
  {
    id: 4,
    type: "document" as const,
    title: "Revisão de Estatuto Social",
    date: "10 de maio, 2025",
    status: "pending" as const,
    description: "Análise jurídica de alterações propostas",
  },
  {
    id: 5,
    type: "meeting" as const,
    title: "Assembleia Familiar Anual",
    date: "5 de maio, 2025",
    status: "completed" as const,
    description: "Prestação de contas e alinhamento de valores",
  },
  {
    id: 6,
    type: "training" as const,
    title: "Curso de Governança Corporativa",
    date: "1 de maio, 2025",
    status: "completed" as const,
    description: "Princípios e melhores práticas de governança",
  },
  {
    id: 7,
    type: "meeting" as const,
    title: "Comitê de Sucessão",
    date: "25 de abril, 2025",
    status: "completed" as const,
    description: "Avaliação de candidatos e cronograma",
  },
  {
    id: 8,
    type: "document" as const,
    title: "Plano de Desenvolvimento de Herdeiros",
    date: "20 de abril, 2025",
    status: "completed" as const,
    description: "Definição de metas e trilhas de formação",
  },
  {
    id: 9,
    type: "training" as const,
    title: "Treinamento ESG para Conselheiros",
    date: "15 de abril, 2025",
    status: "cancelled" as const,
    description: "Estratégias de implementação de práticas sustentáveis",
  },
  {
    id: 10,
    type: "meeting" as const,
    title: "Reunião com Consultoria de Governança",
    date: "10 de abril, 2025",
    status: "completed" as const,
    description: "Diagnóstico inicial e planejamento de melhorias",
  },
];

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
