
import { useState } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";

interface MaturityDimension {
  name: string;
  score: number;
  sectorAverage: number;
  fullMark: number;
}

interface MaturityRadarChartProps {
  data: MaturityDimension[];
  /** Quando "governanca": sem botões de toggle, setor preenchido (teal), legenda externa */
  variant?: "default" | "governanca";
}

const MaturityRadarChart = ({ data, variant = "default" }: MaturityRadarChartProps) => {
  const [showCompany, setShowCompany] = useState(true);
  const [showSector, setShowSector] = useState(true);
  const isGovernanca = variant === "governanca";

  // Validate data before rendering
  const isValidData = data && Array.isArray(data) && data.length > 0 && 
    data.every(item => item && typeof item.name === 'string' && 
    typeof item.score === 'number' && typeof item.sectorAverage === 'number');

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
    <div className="w-full">
      {!isGovernanca && (
        <div className="flex justify-center gap-4 mb-4">
          <Button 
            variant={showCompany ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCompany(!showCompany)}
          >
            Empresa
          </Button>
          <Button 
            variant={showSector ? "default" : "outline"}
            size="sm"
            onClick={() => setShowSector(!showSector)}
          >
            Boa Governança
          </Button>
        </div>
      )}
      <div className="h-80 w-full max-w-lg mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart 
            cx="50%" 
            cy="50%" 
            outerRadius="70%" 
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <PolarGrid stroke="#e0e0e0" />
            <PolarAngleAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: "#555" }}
              className="text-xs"
            />
            <PolarRadiusAxis domain={[0, 5]} tick={false} tickCount={6} />
            <Tooltip 
              formatter={(value, name, props) => {
                const { payload } = props;
                if (name === 'score') {
                  const diff = (payload.score - payload.sectorAverage).toFixed(1);
                  const diffNum = parseFloat(diff);
                  return [
                    `Empresa: ${value} | Setor: ${payload.sectorAverage} (Diferença: ${diffNum > 0 ? '+' : ''}${diff})`,
                    'Score'
                  ];
                }
                return [`${value}`, 'Boa Governança'];
              }}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            {showCompany && (
              <Radar
                name="score"
                dataKey="score"
                stroke="#7E69AB"
                fill="#9b87f5"
                fillOpacity={0.6}
                strokeWidth={2}
              />
            )}
            {showSector && (
              <Radar
                name="sectorAverage"
                dataKey="sectorAverage"
                stroke="#2dd4bf"
                fill={isGovernanca ? "#2dd4bf" : "transparent"}
                fillOpacity={isGovernanca ? 0.35 : 1}
                strokeWidth={2}
                strokeDasharray={isGovernanca ? undefined : "5 5"}
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MaturityRadarChart;
