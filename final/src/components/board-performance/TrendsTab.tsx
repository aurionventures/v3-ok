import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Clock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useHistoricalPerformance } from '@/hooks/useBoardPerformance360';
import type { TrendDirection } from '@/types/boardPerformance';
import { cn } from '@/lib/utils';

interface TrendsTabProps {
  companyId?: string;
  periodId?: string;
  onSelectMember?: (memberId: string) => void;
}

// Ícone de tendência
function TrendIcon({ direction }: { direction: TrendDirection }) {
  if (direction === 'improving') {
    return <TrendingUp className="h-4 w-4 text-emerald-500" />;
  }
  if (direction === 'declining') {
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  }
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

// Componente Principal
export function TrendsTab({ companyId, periodId, onSelectMember }: TrendsTabProps) {
  const { 
    historicalData, 
    getStatistics 
  } = useHistoricalPerformance(companyId);

  const stats = getStatistics();

  return (
    <div className="space-y-6">
      {/* Gráfico de Tendência */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Evolução de Performance</CardTitle>
              <CardDescription>Últimos 12 meses</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <TrendIcon direction={stats.trend} />
                <span className={cn(
                  "font-medium",
                  stats.trend === 'improving' && "text-emerald-600",
                  stats.trend === 'declining' && "text-red-600"
                )}>
                  {stats.trend === 'improving' ? 'Em melhoria' : 
                   stats.trend === 'declining' ? 'Em declínio' : 'Estável'}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Média: <strong className="text-foreground">{stats.avg}</strong>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis domain={[0, 100]} className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="avgScore" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                name="Score Médio"
                dot={{ fill: 'hsl(var(--primary))' }}
              />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Presença"
                strokeDasharray="5 5"
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Engajamento"
                strokeDasharray="5 5"
              />
              <Line 
                type="monotone" 
                dataKey="delivery" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Entrega"
                strokeDasharray="5 5"
              />
              <Line 
                type="monotone" 
                dataKey="preparation" 
                stroke="#06b6d4" 
                strokeWidth={2}
                name="Preparação"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grid de Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Score Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.latest}</div>
            <p className="text-xs text-muted-foreground">
              Min: {stats.min} / Max: {stats.max}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Próxima Revisão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">30 dias</div>
            <p className="text-xs text-muted-foreground">
              Atualização automática
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TrendsTab;
