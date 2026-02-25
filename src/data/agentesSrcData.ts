/**
 * Registro dos agentes que existem em src/ (pastas agente, agente-*).
 * Usado na visão Mosaico da página Gestão de IA.
 */

export interface AgenteMosaico {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  color: string;
  icon: string;
}

export const AGENTES_SRC: AgenteMosaico[] = [
  {
    id: "agente-ata",
    name: "Agente ATA",
    description: "Geração de ATA de reuniões a partir de transcrições ou notas.",
    status: "active",
    color: "#0ea5e9",
    icon: "FileText",
  },
  {
    id: "agente-atas-reunioes",
    name: "Atas de reuniões",
    description: "Produção do documento formal de ata a partir dos dados da reunião.",
    status: "active",
    color: "#0ea5e9",
    icon: "FileText",
  },
  {
    id: "agente-briefing-pautas",
    name: "Briefing de pautas",
    description: "Geração de briefing de pautas (contexto, dados, recomendações).",
    status: "active",
    color: "#8b5cf6",
    icon: "BookOpen",
  },
  {
    id: "agente-diagnostico-governanca",
    name: "Diagnóstico de governança",
    description: "Análise de documentos e entrevistas para diagnóstico de governança.",
    status: "active",
    color: "#10b981",
    icon: "Shield",
  },
  {
    id: "agente-historico-padroes",
    name: "Histórico e padrões",
    description: "Análise de histórico de governança e padrões de recorrência.",
    status: "active",
    color: "#f59e0b",
    icon: "TrendingUp",
  },
  {
    id: "agente-insights-estrategicos",
    name: "Insights estratégicos",
    description: "Geração de insights estratégicos: riscos, ameaças e oportunidades.",
    status: "active",
    color: "#6366f1",
    icon: "Target",
  },
  {
    id: "agente-pautas-sugestoes",
    name: "Sugestões de pautas",
    description: "Geração de sugestões de pautas de reuniões conforme contexto.",
    status: "active",
    color: "#8b5cf6",
    icon: "ClipboardList",
  },
  {
    id: "agente-pdi-conselho",
    name: "PDI Conselho",
    description: "PDIs personalizados para membros de conselhos.",
    status: "active",
    color: "#06b6d4",
    icon: "Users",
  },
  {
    id: "agente-prioridade-agenda",
    name: "Prioridade de agenda",
    description: "Cálculo de prioridade e priorização de temas para agenda do conselho.",
    status: "active",
    color: "#ec4899",
    icon: "Calendar",
  },
  {
    id: "agente-processamento-documentos",
    name: "Processamento de documentos",
    description: "Extração de texto, metadados e estrutura de arquivos (PDF, DOCX).",
    status: "active",
    color: "#14b8a6",
    icon: "FileText",
  },
  {
    id: "agente-sinais-mercado",
    name: "Sinais de mercado",
    description: "Coleta de sinais externos (regulatório, setorial, concorrência).",
    status: "active",
    color: "#f97316",
    icon: "TrendingUp",
  },
];
