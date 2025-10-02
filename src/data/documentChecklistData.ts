import { 
  Building,
  Shield,
  Users,
  AlertCircle,
  AlertTriangle,
  BarChart3
} from "lucide-react";
import { ChecklistCategory } from "@/types/documentChecklist";

export const initialDocumentChecklist: ChecklistCategory[] = [
  {
    id: "societario",
    name: "Societário / Estrutural",
    icon: Building,
    color: "text-blue-500",
    items: [
      { id: "contrato-social", name: "Contrato Social / Estatuto Social", checked: false, hasDocument: false },
      { id: "acordo-socios", name: "Acordo de Sócios / Acionistas", checked: false, hasDocument: false },
      { id: "atas-assembleia", name: "Atas de Assembleias / Reuniões", checked: false, hasDocument: false },
      { id: "cap-table", name: "Cap Table", checked: false, hasDocument: false }
    ]
  },
  {
    id: "governanca",
    name: "Governança e Conselho",
    icon: Shield,
    color: "text-green-500",
    items: [
      { id: "regimento-conselho", name: "Regimento Interno do Conselho", checked: false, hasDocument: false },
      { id: "calendario-reunioes", name: "Calendário Anual de Reuniões", checked: false, hasDocument: false },
      { id: "politica-remuneracao", name: "Política de Remuneração e Avaliação", checked: false, hasDocument: false },
      { id: "politica-sucessao", name: "Política de Sucessão", checked: false, hasDocument: false },
      { id: "atas-conselho", name: "Atas do Conselho", checked: false, hasDocument: false }
    ]
  },
  {
    id: "familia",
    name: "Família Empresária",
    icon: Users,
    color: "text-purple-500",
    items: [
      { id: "protocolo-familiar", name: "Protocolo / Constituição Familiar", checked: false, hasDocument: false },
      { id: "conselho-familia", name: "Conselho de Família (Regimento/Atas)", checked: false, hasDocument: false },
      { id: "comite-socios", name: "Comitê de Sócios / Fórum Familiar", checked: false, hasDocument: false },
      { id: "plano-sucessao-familiar", name: "Plano de Sucessão Familiar", checked: false, hasDocument: false },
      { id: "politica-contratacao", name: "Política de Contratação de Familiares", checked: false, hasDocument: false }
    ]
  },
  {
    id: "compliance",
    name: "Compliance & Conduta",
    icon: AlertCircle,
    color: "text-orange-500",
    items: [
      { id: "codigo-conduta", name: "Código de Conduta / Ética", checked: false, hasDocument: false },
      { id: "canal-denuncias", name: "Canal de Denúncias (documentação)", checked: false, hasDocument: false },
      { id: "politica-compliance", name: "Política de Compliance", checked: false, hasDocument: false },
      { id: "politica-transacoes", name: "Política de Transações entre Partes Relacionadas", checked: false, hasDocument: false },
      { id: "politica-comunicacao", name: "Política de Comunicação com Stakeholders", checked: false, hasDocument: false }
    ]
  },
  {
    id: "riscos",
    name: "Riscos e Auditoria",
    icon: AlertTriangle,
    color: "text-red-500",
    items: [
      { id: "relatorios-auditoria", name: "Relatórios de Auditoria Independente", checked: false, hasDocument: false },
      { id: "politica-riscos", name: "Política de Riscos e Controles Internos", checked: false, hasDocument: false },
      { id: "relatorios-compliance", name: "Relatórios de Compliance e Monitoramento", checked: false, hasDocument: false },
      { id: "conselho-fiscal", name: "Conselho Fiscal (Atas e Regimento)", checked: false, hasDocument: false }
    ]
  },
  {
    id: "financeiro",
    name: "Financeiro / Transparência",
    icon: BarChart3,
    color: "text-indigo-500",
    items: [
      { id: "demonstracoes-financeiras", name: "Demonstrações Financeiras Auditadas", checked: false, hasDocument: false },
      { id: "parecer-auditor", name: "Parecer do Auditor Independente", checked: false, hasDocument: false },
      { id: "relatorio-anual", name: "Relatório Anual / Sustentabilidade", checked: false, hasDocument: false }
    ]
  }
];