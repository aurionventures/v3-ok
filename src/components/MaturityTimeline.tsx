import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TimelineData {
  period: string;
  score: number;
  stage: string;
}

interface MaturityTimelineProps {
  data: TimelineData[];
}

const MaturityTimeline: React.FC<MaturityTimelineProps> = ({ data }) => {
  // Calculate evolution in points
  const firstScore = data[0]?.score || 0;
  const lastScore = data[data.length - 1]?.score || 0;
  const evolutionPoints = lastScore - firstScore;
  const evolutionPercentage = firstScore > 0 ? ((lastScore - firstScore) / firstScore * 100) : 0;

  // Use scores directly as points (0-5 scale)
  const chartData = data.map(item => ({
    ...item,
    scorePoints: item.score // Já está em pontos (0-5)
  }));

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Embrionário': return 'text-red-600';
      case 'Inicial': return 'text-orange-600';
      case 'Básico': return 'text-yellow-600';
      case 'Sólido': return 'text-blue-600';
      case 'Avançado': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-legacy-500">
            Linha do Tempo - Evolução da Maturidade de Governança
          </h2>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold">
              {evolutionPoints > 0 ? '+' : ''}{evolutionPoints.toFixed(2)} pontos
            </span>
            <span className="text-sm text-gray-500">desde {data[0]?.period}</span>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                domain={[0, 5]}
                tick={{ fontSize: 12 }}
                stroke="#666"
                label={{ value: 'Pontuação (pontos)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  `${value.toFixed(2)} pontos`, 
                  'Maturidade IBGC'
                ]}
                labelFormatter={(label) => `Período: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="scorePoints" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ 
                  r: 6, 
                  fill: "#8B5CF6",
                  strokeWidth: 2,
                  stroke: "white"
                }}
                activeDot={{ 
                  r: 8, 
                  fill: "#7C3AED",
                  strokeWidth: 2,
                  stroke: "white"
                }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Timeline Milestones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((item, index) => (
            <div key={item.period} className="flex items-center p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-center w-10 h-10 bg-legacy-500 text-white rounded-full mr-4 flex-shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.period}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-legacy-purple-500">
                    {item.score.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">pontos</span>
                  <span className="text-xs text-muted-foreground">/ 5.0</span>
                </div>
                <div className={`text-sm font-medium ${getStageColor(item.stage)}`}>
                  {item.stage}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Evolution Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Resumo da Evolução</h3>
              <p className="text-sm text-gray-600 mt-1">
                Progresso desde a primeira avaliação em {data[0]?.period}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-3xl font-bold text-green-600">
                  {evolutionPoints > 0 ? '+' : ''}{evolutionPoints.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">pontos</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {data[0]?.stage} → {data[data.length - 1]?.stage}
              </div>
              {evolutionPercentage !== 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  ({evolutionPercentage > 0 ? '+' : ''}{evolutionPercentage.toFixed(1)}% de evolução)
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaturityTimeline;