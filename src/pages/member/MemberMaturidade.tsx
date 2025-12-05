import { MemberLayout } from "@/components/member/MemberLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, BarChart3 } from "lucide-react";
import { governanceRisks } from "@/data/riskData";
import { calculateRiskStats } from "@/utils/riskCalculator";

const maturityData = [
  { name: 'Sócios', score: 4.1 },
  { name: 'Conselho', score: 3.9 },
  { name: 'Diretoria', score: 4.3 },
  { name: 'Órgãos de Fiscalização', score: 3.8 },
  { name: 'Conduta e Conflitos', score: 4.0 },
];

const MemberMaturidade = () => {
  const riskStats = calculateRiskStats(governanceRisks);

  const riskKPIs = [
    { label: 'Total de Riscos', value: riskStats.totalRisks, bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Críticos', value: riskStats.criticalRisks, bgColor: 'bg-red-50', textColor: 'text-red-600' },
    { label: 'Com Mitigação', value: riskStats.mitigationPlans, bgColor: 'bg-green-50', textColor: 'text-green-600' },
    { label: 'Sem Mitigação', value: riskStats.withoutMitigation, bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
  ];

  return (
    <MemberLayout 
      title="Maturidade e Riscos"
      subtitle="Visão geral da governança da sua empresa"
    >
      <div className="space-y-6">
        {/* Gestão de Riscos Card */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">Gestão de Riscos</h3>
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

        {/* Maturidade de Governança Card */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">Maturidade de Governança</h3>
          </div>
          
          <div className="space-y-4">
            {maturityData.map((pillar) => (
              <div key={pillar.name} className="flex items-center gap-4">
                <span className="text-base w-44 truncate" title={pillar.name}>
                  {pillar.name}
                </span>
                <div className="flex-1">
                  <Progress 
                    value={(pillar.score / 5) * 100} 
                    className="h-3"
                  />
                </div>
                <span className="text-base font-bold text-primary w-10 text-right">
                  {pillar.score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <Button variant="outline" size="lg" className="flex-1 text-base h-12">
              Ver Detalhes
            </Button>
            <Button size="lg" className="flex-1 text-base h-12">
              Nova Avaliação
            </Button>
          </div>
        </Card>
      </div>
    </MemberLayout>
  );
};

export default MemberMaturidade;
