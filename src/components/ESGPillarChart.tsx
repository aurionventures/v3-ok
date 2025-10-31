import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ESGPillarData {
  name: string;
  score: number;
  percentage: number;
  color: string;
}

interface ESGPillarChartProps {
  pillarScores: Record<string, any>;
}

const ESGPillarChart: React.FC<ESGPillarChartProps> = ({ pillarScores }) => {
  if (!pillarScores || Object.keys(pillarScores).length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <div className="text-sm">Nenhuma avaliação ESG encontrada</div>
          <div className="text-xs mt-1">Realize uma avaliação para ver os resultados</div>
        </div>
      </div>
    );
  }

  const data: ESGPillarData[] = Object.entries(pillarScores).map(([key, pillar]: [string, any]) => ({
    name: pillar.title?.replace(/[🌱👥⚖️🎯]/g, '').trim() || key,
    score: pillar.score || 0,
    percentage: pillar.percentage || 0,
    color: getColorForPillar(key)
  }));

  function getColorForPillar(pillar: string): string {
    const colors = {
      environmental: 'hsl(var(--chart-environmental))',
      social: 'hsl(var(--chart-social))',
      governance: 'hsl(var(--chart-governance))',
      strategy: 'hsl(var(--chart-strategy))'
    };
    return colors[pillar as keyof typeof colors] || 'hsl(var(--chart-environmental))';
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Score: <span className="font-medium text-foreground">{data.score.toFixed(1)}/6</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Percentual: <span className="font-medium text-foreground">{data.percentage.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 15,
            left: -5,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis 
            domain={[0, 6]} 
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ESGPillarChart;