import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, TrendingUp, Award } from "lucide-react";
import { useGovernanceProgress } from "@/hooks/useGovernanceProgress";
import { cn } from "@/lib/utils";

interface GovernanceProgressBarProps {
  showDetails?: boolean;
  variant?: 'compact' | 'detailed';
  className?: string;
}

export const GovernanceProgressBar = ({ 
  showDetails = true, 
  variant = 'detailed',
  className 
}: GovernanceProgressBarProps) => {
  const progress = useGovernanceProgress();

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return "bg-emerald-500";
    if (percentage >= 50) return "bg-blue-500";
    if (percentage >= 25) return "bg-amber-500";
    return "bg-red-500";
  };

  const getProgressIcon = (percentage: number) => {
    if (percentage >= 75) return <Trophy className="h-4 w-4 text-emerald-600" />;
    if (percentage >= 50) return <Target className="h-4 w-4 text-blue-600" />;
    if (percentage >= 25) return <TrendingUp className="h-4 w-4 text-amber-600" />;
    return <Award className="h-4 w-4 text-red-600" />;
  };

  const nextMilestone = progress.milestones.find(m => !m.achieved);

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        {getProgressIcon(progress.overallPercentage)}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-foreground">
              Governança {progress.overallPercentage}% configurada
            </span>
            <Badge 
              variant="secondary" 
              className="text-xs"
            >
              {progress.completedModules}/{progress.totalModules}
            </Badge>
          </div>
          <Progress 
            value={progress.overallPercentage} 
            className="h-2"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getProgressIcon(progress.overallPercentage)}
          <h3 className="text-lg font-semibold text-foreground">
            Sua Governança está {progress.overallPercentage}% configurada
          </h3>
        </div>
        <Badge 
          variant={progress.overallPercentage >= 75 ? "default" : "secondary"}
          className="text-sm"
        >
          {progress.completedModules}/{progress.totalModules} módulos
        </Badge>
      </div>

      <div className="space-y-2">
        <Progress 
          value={progress.overallPercentage} 
          className={cn("h-3", getProgressColor(progress.overallPercentage))}
        />
        
        {showDetails && (
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Começando</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>Completo</span>
          </div>
        )}
      </div>

      {showDetails && nextMilestone && (
        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Próximo Marco: {nextMilestone.name}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            Faltam {nextMilestone.threshold - progress.overallPercentage}% para: {nextMilestone.reward}
          </div>
          <Progress 
            value={(progress.overallPercentage / nextMilestone.threshold) * 100} 
            className="h-2"
          />
        </div>
      )}

      {showDetails && (
        <div className="bg-card rounded-lg p-3 border border-border">
          <div className="text-sm font-medium text-foreground mb-1">
            Valor Estimado Total: R$ {(progress.estimatedTotalValue / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-muted-foreground">
            Ao completar 100% da governança, sua empresa pode gerar até R$ {(progress.estimatedTotalValue / 1000000).toFixed(1)} milhões em valor adicional
          </div>
        </div>
      )}
    </div>
  );
};