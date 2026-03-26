import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectorTrend } from '@/types/riskIntelligence';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface SectorTrendsChartProps {
  trends: SectorTrend[];
}

export const SectorTrendsChart = ({ trends }: SectorTrendsChartProps) => {
  const chartData = trends
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 6)
    .map(trend => ({
      name: trend.title.length > 30 ? trend.title.substring(0, 30) + '...' : trend.title,
      relevance: trend.relevance,
      impact: trend.impact,
      source: trend.source,
      fullTitle: trend.title,
      description: trend.description,
    }));

  const getColor = (impact: string) => {
    if (impact === 'positive') return 'hsl(var(--chart-1))';
    if (impact === 'negative') return 'hsl(var(--chart-5))';
    return 'hsl(var(--chart-3))';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Tendências Setoriais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="name" width={150} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold text-sm text-foreground mb-1">{data.fullTitle}</p>
                      <p className="text-xs text-muted-foreground mb-2">{data.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-medium">Relevância:</span>
                        <span className="text-muted-foreground">{data.relevance}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-medium">Fonte:</span>
                        <span className="text-muted-foreground">{data.source}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="relevance" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.impact)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--chart-1))' }} />
            <span>Positivo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--chart-5))' }} />
            <span>Negativo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--chart-3))' }} />
            <span>Neutro</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
