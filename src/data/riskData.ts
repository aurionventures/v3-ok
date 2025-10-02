import { Target, Settings, DollarSign, Shield } from "lucide-react";

export interface RiskCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
}

export interface IBGCRisk {
  id: number;
  category: string;
  title: string;
  description: string;
  impact: number;
  probability: number;
  inherentRisk: number;
  residualRisk: number;
  controls: string[];
  responsible: string;
  deadline: string;
  estimatedResolution?: string;
  status: "active" | "mitigated" | "urgent";
}

export const RISK_CATEGORIES: RiskCategory[] = [
  { id: "strategic", name: "Estratégicos", icon: Target, color: "#ef4444", description: "Riscos relacionados à estratégia de negócio" },
  { id: "operational", name: "Operacionais", icon: Settings, color: "#f97316", description: "Riscos operacionais e de processos" },
  { id: "financial", name: "Financeiros", icon: DollarSign, color: "#eab308", description: "Riscos financeiros e de liquidez" },
  { id: "compliance", name: "Conformidade", icon: Shield, color: "#22c55e", description: "Riscos regulatórios e de compliance" }
];

export const ibgcRisks: IBGCRisk[] = [
  {
    id: 1,
    category: "strategic",
    title: "Mudanças no Ambiente Competitivo",
    description: "Entrada de novos concorrentes ou mudanças tecnológicas disruptivas",
    impact: 4,
    probability: 3,
    inherentRisk: 12,
    residualRisk: 8,
    controls: ["Monitoramento de mercado", "Análise competitiva trimestral"],
    responsible: "CEO",
    deadline: "2024-12-31",
    estimatedResolution: "6 meses",
    status: "active"
  },
  {
    id: 2,
    category: "operational",
    title: "Falhas em Sistemas Críticos",
    description: "Interrupção de sistemas de TI essenciais para operação",
    impact: 5,
    probability: 2,
    inherentRisk: 10,
    residualRisk: 4,
    controls: ["Backup sistemas", "Plano de contingência", "Monitoramento 24/7"],
    responsible: "CTO",
    deadline: "2024-10-15",
    estimatedResolution: "90 dias",
    status: "mitigated"
  },
  {
    id: 3,
    category: "financial",
    title: "Risco de Liquidez",
    description: "Dificuldades de caixa para honrar compromissos financeiros",
    impact: 5,
    probability: 2,
    inherentRisk: 10,
    residualRisk: 6,
    controls: ["Gestão de caixa", "Linhas de crédito pré-aprovadas"],
    responsible: "CFO",
    deadline: "2024-11-30",
    estimatedResolution: "60 dias",
    status: "active"
  },
  {
    id: 4,
    category: "compliance",
    title: "Mudanças Regulatórias",
    description: "Alterações na legislação que impactem o negócio",
    impact: 3,
    probability: 4,
    inherentRisk: 12,
    residualRisk: 6,
    controls: ["Monitoramento regulatório", "Consultoria jurídica"],
    responsible: "Compliance Officer",
    deadline: "2024-09-30",
    estimatedResolution: "30 dias",
    status: "urgent"
  },
  {
    id: 5,
    category: "strategic",
    title: "Perda de Mercado",
    description: "Redução da participação de mercado devido à competição",
    impact: 4,
    probability: 3,
    inherentRisk: 12,
    residualRisk: 9,
    controls: ["Estratégia de marketing", "Inovação de produtos"],
    responsible: "CMO",
    deadline: "2024-11-15",
    estimatedResolution: "4 meses",
    status: "active"
  },
  {
    id: 6,
    category: "operational",
    title: "Falha na Cadeia de Suprimentos",
    description: "Interrupção no fornecimento de materiais críticos",
    impact: 4,
    probability: 2,
    inherentRisk: 8,
    residualRisk: 4,
    controls: ["Fornecedores alternativos", "Estoque de segurança"],
    responsible: "COO",
    deadline: "2024-10-30",
    estimatedResolution: "45 dias",
    status: "mitigated"
  }
];