import { MemberLayout } from "@/components/member/MemberLayout";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { governanceRisks } from "@/data/riskData";
import { calculateRiskStats } from "@/utils/riskCalculator";

const MemberRiscos = () => {
  const riskStats = calculateRiskStats(governanceRisks);

  const riskKPIs = [
    { label: 'Total de Riscos', value: riskStats.totalRisks, bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Críticos', value: riskStats.criticalRisks, bgColor: 'bg-red-50', textColor: 'text-red-600' },
    { label: 'Com Mitigação', value: riskStats.mitigationPlans, bgColor: 'bg-green-50', textColor: 'text-green-600' },
    { label: 'Sem Mitigação', value: riskStats.withoutMitigation, bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
  ];

  return (
    <MemberLayout 
      title="Gestão de Riscos"
      subtitle="Visão geral dos riscos da governança"
    >
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">Matriz de Riscos</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {riskKPIs.map((kpi) => (
            <div 
              key={kpi.label} 
              className={`${kpi.bgColor} rounded-lg p-4 text-center`}
            >
              <span className={`text-3xl font-bold ${kpi.textColor}`}>
                {kpi.value}
              </span>
              <p className={`text-sm font-medium ${kpi.textColor} mt-1`}>
                {kpi.label}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </MemberLayout>
  );
};

export default MemberRiscos;
