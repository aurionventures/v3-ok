import { MemberLayout } from "@/components/member/MemberLayout";
import { Card } from "@/components/ui/card";
import MaturityRadarChart from "@/components/MaturityRadarChart";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// Mock data - dados da empresa do membro
const mockRadarData = [
  { name: 'Sócios', score: 4.2, sectorAverage: 3.5, fullMark: 5 },
  { name: 'Conselho', score: 3.8, sectorAverage: 3.2, fullMark: 5 },
  { name: 'Diretoria', score: 3.5, sectorAverage: 3.4, fullMark: 5 },
  { name: 'Fiscalização', score: 2.8, sectorAverage: 3.0, fullMark: 5 },
  { name: 'Conduta', score: 3.2, sectorAverage: 3.1, fullMark: 5 },
];

const getMaturityLevel = (score: number) => {
  if (score >= 4) return { level: 'Alto', color: 'text-green-600 bg-green-100' };
  if (score >= 3) return { level: 'Médio', color: 'text-amber-600 bg-amber-100' };
  return { level: 'Baixo', color: 'text-red-600 bg-red-100' };
};

const getGapIndicator = (score: number, sectorAverage: number) => {
  const gap = score - sectorAverage;
  if (gap > 0.3) return { icon: TrendingUp, color: 'text-green-600', text: `+${gap.toFixed(1)} acima` };
  if (gap < -0.3) return { icon: TrendingDown, color: 'text-red-600', text: `${gap.toFixed(1)} abaixo` };
  return { icon: Minus, color: 'text-muted-foreground', text: 'Na média' };
};

const MemberMaturidade = () => {
  const overallScore = mockRadarData.reduce((acc, item) => acc + item.score, 0) / mockRadarData.length;
  const overallLevel = getMaturityLevel(overallScore);

  return (
    <MemberLayout 
      title="Maturidade de Governança"
      subtitle="Visão geral da maturidade da sua empresa"
    >
      <div className="space-y-6">
        {/* Overall Score Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Pontuação Geral</h3>
            <span className={`px-4 py-2 rounded-full text-lg font-medium ${overallLevel.color}`}>
              {overallLevel.level}
            </span>
          </div>
          <div className="text-center">
            <span className="text-5xl font-bold text-primary">{overallScore.toFixed(1)}</span>
            <span className="text-2xl text-muted-foreground">/5.0</span>
          </div>
        </Card>

        {/* Radar Chart */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Desempenho por Dimensão IBGC</h3>
          <div className="h-[350px]">
            <MaturityRadarChart data={mockRadarData} />
          </div>
          <div className="flex justify-center gap-6 mt-4 text-base">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/60"></div>
              <span>Sua Empresa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-500/60"></div>
              <span>Média do Setor</span>
            </div>
          </div>
        </Card>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockRadarData.map((pillar) => {
            const level = getMaturityLevel(pillar.score);
            const gap = getGapIndicator(pillar.score, pillar.sectorAverage);
            const GapIcon = gap.icon;
            
            return (
              <Card key={pillar.name} className="p-5">
                <h4 className="text-lg font-semibold mb-3">{pillar.name}</h4>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold">{pillar.score.toFixed(1)}</span>
                  <span className="text-lg text-muted-foreground">/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${level.color}`}>
                    {level.level}
                  </span>
                  <div className={`flex items-center gap-1 text-sm ${gap.color}`}>
                    <GapIcon className="h-4 w-4" />
                    <span>{gap.text}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </MemberLayout>
  );
};

export default MemberMaturidade;
