import { GovernanceRisk, RISK_CATEGORIES } from "@/data/riskData";

export interface RiskStats {
  totalRisks: number;
  criticalRisks: number;
  mitigationPlans: number;
  withoutMitigation: number;
}

export interface RiskCategoryStats {
  category: string;
  count: number;
  criticalCount: number;
  color: string;
  icon: any;
}

export interface RiskTrend {
  period: string;
  total: number;
  mitigated: number;
}

export const calculateRiskStats = (risks: GovernanceRisk[]): RiskStats => {
  const totalRisks = risks.length;
  const criticalRisks = risks.filter(risk => (risk.impact * risk.probability) >= 12).length;
  const mitigationPlans = risks.filter(risk => risk.status === "mitigated" || risk.controls.length > 0).length;
  const withoutMitigation = totalRisks - mitigationPlans;

  return {
    totalRisks,
    criticalRisks,
    mitigationPlans,
    withoutMitigation
  };
};

export const calculateRiskCategoryStats = (risks: GovernanceRisk[]): RiskCategoryStats[] => {
  return RISK_CATEGORIES.map(category => {
    const categoryRisks = risks.filter(risk => risk.category === category.id);
    const criticalCategoryRisks = categoryRisks.filter(risk => (risk.impact * risk.probability) >= 12);
    
    return {
      category: category.name,
      count: categoryRisks.length,
      criticalCount: criticalCategoryRisks.length,
      color: category.color,
      icon: category.icon
    };
  });
};

export const generateRiskTrends = (): RiskTrend[] => {
  // Simulated historical data for demonstration
  return [
    { period: "6 meses atrás", total: 8, mitigated: 3 },
    { period: "3 meses atrás", total: 7, mitigated: 4 },
    { period: "Atual", total: 6, mitigated: 2 }
  ];
};

export const getRiskLevel = (impact: number, probability: number): string => {
  const score = impact * probability;
  if (score >= 16) return "Crítico";
  if (score >= 12) return "Alto";
  if (score >= 6) return "Médio";
  return "Baixo";
};

export const getRiskColor = (impact: number, probability: number): string => {
  const score = impact * probability;
  if (score >= 16) return "bg-red-500";
  if (score >= 12) return "bg-orange-500";
  if (score >= 6) return "bg-yellow-500";
  return "bg-green-500";
};