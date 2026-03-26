import { useState } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip as UITooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
interface MaturityDimension {
  name: string;
  score: number;
  sectorAverage: number;
  fullMark: number;
}
interface MaturityRadarChartProps {
  data: MaturityDimension[];
}
const MaturityRadarChart = ({
  data
}: MaturityRadarChartProps) => {
  // Validate data before rendering
  const isValidData = data && Array.isArray(data) && data.length > 0 && data.every(item => item && typeof item.name === 'string' && typeof item.score === 'number' && typeof item.sectorAverage === 'number');

  // Function to format long axis labels with line breaks
  const formatAxisLabel = (label: string) => {
    // Specific cases for long labels that need better formatting
    const specificCases: Record<string, string> = {
      'Conduta e Conflitos': 'Conduta e\nConflitos',
      'Órgãos de Fiscalização': 'Órgãos de\nFiscalização'
    };
    if (specificCases[label]) {
      return specificCases[label];
    }

    // General case for other long labels
    if (label.length > 12) {
      const words = label.split(' ');
      if (words.length >= 2) {
        const midPoint = Math.ceil(words.length / 2);
        return words.slice(0, midPoint).join(' ') + '\n' + words.slice(midPoint).join(' ');
      }
    }
    return label;
  };

  // Function to get pillar description for tooltips
  const getPillarDescription = (name: string) => {
    const descriptions: Record<string, string> = {
      'Sócios': 'Estrutura societária e participação acionária',
      'Conselho': 'Governança e supervisão estratégica',
      'Diretoria': 'Gestão executiva e operacional',
      'Órgãos de Fiscalização': 'Controle e auditoria interna/externa',
      'Conduta e Conflitos': 'Ética empresarial e gestão de conflitos'
    };
    return descriptions[name] || 'Pilar de governança corporativa';
  };
  if (!isValidData) {
    return <div className="w-full h-72 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p>Carregando dados do gráfico...</p>
          <p className="text-sm mt-1">Aguarde enquanto processamos as informações</p>
        </div>
      </div>;
  }
  return <TooltipProvider>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} tickFormatter={formatAxisLabel} />
            <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 8 }} />
            <Radar name="Sua Empresa" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.5} />
            <Radar name="Média do Setor" dataKey="sectorAverage" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </TooltipProvider>;
};
export default MaturityRadarChart;