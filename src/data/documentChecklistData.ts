import { 
  Building,
  Shield,
  Users,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  Archive,
  Target
} from "lucide-react";
import { ChecklistCategory } from "@/types/documentChecklist";

export const initialDocumentChecklist: ChecklistCategory[] = [
  {
    id: "societario",
    name: "Societário / Estrutural",
    icon: Building,
    color: "text-blue-500",
    items: [
      { id: "contrato-social", name: "Contrato Social / Estatuto Social", checked: false, hasDocument: false, status: null },
      { id: "acordo-socios", name: "Acordo de Sócios / Acionistas", checked: false, hasDocument: false, status: null },
      { id: "atas-assembleia", name: "Atas de Assembleias / Reuniões", checked: false, hasDocument: false, status: null },
      { id: "cap-table", name: "Cap Table", checked: false, hasDocument: false, status: null }
    ]
  },
  {
    id: "governanca",
    name: "Governança e Conselho",
    icon: Shield,
    color: "text-green-500",
    items: [
      { id: "regimento-conselho", name: "Regimento Interno do Conselho", checked: false, hasDocument: false, status: null },
      { id: "calendario-reunioes", name: "Calendário Anual de Reuniões", checked: false, hasDocument: false, status: null },
      { id: "politica-remuneracao", name: "Política de Remuneração e Avaliação", checked: false, hasDocument: false, status: null },
      { id: "politica-sucessao", name: "Política de Sucessão", checked: false, hasDocument: false, status: null },
      { id: "atas-conselho", name: "Atas do Conselho", checked: false, hasDocument: false, status: null }
    ]
  },
  {
    id: "familia",
    name: "Família Empresária",
    icon: Users,
    color: "text-purple-500",
    items: [
      { id: "protocolo-familiar", name: "Protocolo / Constituição Familiar", checked: false, hasDocument: false, status: null },
      { id: "conselho-familia", name: "Conselho de Família (Regimento/Atas)", checked: false, hasDocument: false, status: null },
      { id: "comite-socios", name: "Comitê de Sócios / Fórum Familiar", checked: false, hasDocument: false, status: null },
      { id: "plano-sucessao-familiar", name: "Plano de Sucessão Familiar", checked: false, hasDocument: false, status: null },
      { id: "politica-contratacao", name: "Política de Contratação de Familiares", checked: false, hasDocument: false, status: null }
    ]
  },
  {
    id: "compliance",
    name: "Compliance & Conduta",
    icon: AlertCircle,
    color: "text-orange-500",
    items: [
      { id: "codigo-conduta", name: "Código de Conduta / Ética", checked: false, hasDocument: false, status: null },
      { id: "canal-denuncias", name: "Canal de Denúncias (documentação)", checked: false, hasDocument: false, status: null },
      { id: "politica-compliance", name: "Política de Compliance", checked: false, hasDocument: false, status: null },
      { id: "politica-transacoes", name: "Política de Transações entre Partes Relacionadas", checked: false, hasDocument: false, status: null },
      { id: "politica-comunicacao", name: "Política de Comunicação com Stakeholders", checked: false, hasDocument: false, status: null }
    ]
  },
  {
    id: "riscos",
    name: "Riscos e Auditoria",
    icon: AlertTriangle,
    color: "text-red-500",
    items: [
      { id: "relatorios-auditoria", name: "Relatórios de Auditoria Independente", checked: false, hasDocument: false, status: null },
      { id: "politica-riscos", name: "Política de Riscos e Controles Internos", checked: false, hasDocument: false, status: null },
      { id: "relatorios-compliance", name: "Relatórios de Compliance e Monitoramento", checked: false, hasDocument: false, status: null },
      { id: "conselho-fiscal", name: "Conselho Fiscal (Atas e Regimento)", checked: false, hasDocument: false, status: null }
    ]
  },
  {
    id: "estrategico",
    name: "Documentos Estratégicos",
    icon: Target,
    color: "text-purple-500",
    items: [
      { id: "planejamento-estrategico", name: "Planejamento Estratégico", checked: false, hasDocument: false, status: null },
      { id: "apresentacao-institucional", name: "Apresentação Institucional", checked: false, hasDocument: false, status: null },
      { id: "plano-negocios", name: "Plano de Negócios", checked: false, hasDocument: false, status: null },
      { id: "visao-missao-valores", name: "Documento de Visão, Missão e Valores", checked: false, hasDocument: false, status: null }
    ]
  },
  {
    id: "financeiro",
    name: "Financeiro / Transparência",
    icon: BarChart3,
    color: "text-indigo-500",
    items: [
      { id: "demonstracoes-financeiras", name: "Demonstrações Financeiras Auditadas", checked: false, hasDocument: false, status: null },
      { id: "parecer-auditor", name: "Parecer do Auditor Independente", checked: false, hasDocument: false, status: null },
      { id: "relatorio-anual", name: "Relatório Anual / Sustentabilidade", checked: false, hasDocument: false, status: null }
    ]
  },
  {
    id: "atas-antigas",
    name: "ATAs Antigas",
    icon: Archive,
    color: "text-amber-500",
    items: [
      { id: "atas-conselho-antigas", name: "ATAs de Conselho (últimos 12 meses)", checked: false, hasDocument: false, status: null },
      { id: "atas-assembleia-antigas", name: "ATAs de Assembleia (últimos 12 meses)", checked: false, hasDocument: false, status: null },
      { id: "atas-comites-antigas", name: "ATAs de Comitês (últimos 12 meses)", checked: false, hasDocument: false, status: null }
    ]
  }
];