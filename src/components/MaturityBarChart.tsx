import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface MaturityDimension {
  name: string;
  score: number;
  sectorAverage: number;
  fullMark: number;
}

interface MaturityBarChartProps {
  data: MaturityDimension[];
}

const MaturityBarChart = ({ data }: MaturityBarChartProps) => {
  const getMaturityLevel = (score: number) => {
    if (score >= 4) return { level: "Avançado", color: "bg-emerald-500", variant: "default" as const };
    if (score >= 3) return { level: "Sólido", color: "bg-blue-500", variant: "secondary" as const };
    if (score >= 2) return { level: "Básico", color: "bg-amber-500", variant: "outline" as const };
    if (score >= 1) return { level: "Inicial", color: "bg-orange-500", variant: "destructive" as const };
    return { level: "Embrionário", color: "bg-red-500", variant: "destructive" as const };
  };

  const getProgressColor = (score: number) => {
    if (score >= 4) return "bg-emerald-500";
    if (score >= 3) return "bg-blue-500";
    if (score >= 2) return "bg-amber-500";
    if (score >= 1) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-4">
      {data.map((dimension) => {
        const percentage = (dimension.score / dimension.fullMark) * 100;
        const sectorPercentage = (dimension.sectorAverage / dimension.fullMark) * 100;
        const maturityInfo = getMaturityLevel(dimension.score);
        
        return (
          <div key={dimension.name} className="bg-card p-4 rounded-lg border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
              <div className="flex-1">
                <h4 className="font-medium text-sm sm:text-base leading-tight">
                  {dimension.name}
                </h4>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Badge variant={maturityInfo.variant} className="text-xs">
                  {maturityInfo.level}
                </Badge>
                <span className="font-semibold text-sm sm:text-base min-w-[3rem] text-right">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              {/* Empresa Progress Bar */}
              <div className="relative">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Sua empresa</span>
                  <span>{dimension.score.toFixed(1)}/5.0</span>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${getProgressColor(dimension.score)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
              
              {/* Sector Average Indicator */}
              <div className="relative">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Boa Governança</span>
                  <span>{dimension.sectorAverage.toFixed(1)}/5.0</span>
                </div>
                <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-400 transition-all duration-500"
                    style={{ width: `${Math.min(sectorPercentage, 100)}%` }}
                  />
                </div>
              </div>
              
              {/* Comparison */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  Diferença: 
                  <span className={`ml-1 font-medium ${
                    dimension.score >= dimension.sectorAverage ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {dimension.score >= dimension.sectorAverage ? '+' : ''}
                    {(dimension.score - dimension.sectorAverage).toFixed(1)}
                  </span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MaturityBarChart;