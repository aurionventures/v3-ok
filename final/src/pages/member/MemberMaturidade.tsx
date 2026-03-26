import { MemberLayout } from "@/components/member/MemberLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";

const maturityData = [
  { name: 'Sócios', score: 4.1 },
  { name: 'Conselho', score: 3.9 },
  { name: 'Diretoria', score: 4.3 },
  { name: 'Órgãos de Fiscalização', score: 3.8 },
  { name: 'Conduta e Conflitos', score: 4.0 },
];

const MemberMaturidade = () => {
  return (
    <MemberLayout 
      title="Maturidade de Governança"
      subtitle="Visão geral da maturidade da sua empresa"
    >
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">Maturidade por Pilar IBGC</h3>
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
    </MemberLayout>
  );
};

export default MemberMaturidade;
