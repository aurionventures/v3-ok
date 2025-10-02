
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

const MaturityRadarChart = ({ data }: MaturityRadarChartProps) => {
  // Validate data before rendering
  const isValidData = data && Array.isArray(data) && data.length > 0 && 
    data.every(item => item && typeof item.name === 'string' && 
    typeof item.score === 'number' && typeof item.sectorAverage === 'number');

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
    return (
      <div className="w-full h-72 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p>Carregando dados do gráfico...</p>
          <p className="text-sm mt-1">Aguarde enquanto processamos as informações</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="h-80 w-full max-w-3xl mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart 
              cx="50%" 
              cy="50%" 
              outerRadius="75%" 
              data={data.map(item => ({
                ...item,
                name: formatAxisLabel(item.name)
              }))}
              margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
            >
              <PolarGrid stroke="#e2e8f0" strokeWidth={1} />
              <PolarAngleAxis 
                dataKey="name" 
                tick={{ 
                  fontSize: 12, 
                  fill: "#1f2937", 
                  fontWeight: 700,
                  textAnchor: "middle"
                }}
                className="text-xs font-bold"
              />
              <PolarRadiusAxis 
                domain={[0, 5]} 
                tick={{ fontSize: 10, fill: "#6b7280" }}
                tickCount={6}
                angle={90}
              />
              <Tooltip 
                formatter={(value, name) => {
                  const percentage = ((value as number) * 20).toFixed(0);
                  if (name === 'score') {
                    return [`${percentage}% (${value})`, 'Pontuação da empresa'];
                  }
                  return [`${((value as number) * 20).toFixed(0)}% (${value})`, 'Pontuação média da amostra total'];
                }}
                labelFormatter={(label) => {
                  const originalName = data.find(item => formatAxisLabel(item.name) === label)?.name || label;
                  return originalName;
                }}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                  borderRadius: '12px', 
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  fontSize: '13px'
                }}
              />
              <Radar
                name="score"
                dataKey="score"
                stroke="#1f40af"
                fill="#1f40af"
                fillOpacity={0.1}
                strokeWidth={3}
              />
              <Radar
                name="sectorAverage"
                dataKey="sectorAverage"
                stroke="#20b2aa"
                fill="transparent"
                strokeWidth={2}
                strokeDasharray="8 4"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MaturityRadarChart;
