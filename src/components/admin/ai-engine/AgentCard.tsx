import { LucideIcon, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ColorVariant, getVariantStyles, ImpactLevel, getImpactConfig } from './config';
import { cn } from '@/lib/utils';

interface AgentPrompt {
  id: string;
  name: string;
  impactLevel: ImpactLevel;
}

interface AgentCardProps {
  code: string;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  variant?: ColorVariant;
  prompts?: AgentPrompt[];
  criticalCount?: number;
  activeCount?: number;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function AgentCard({
  code,
  name,
  shortName,
  description,
  icon: Icon,
  variant = 'primary',
  prompts = [],
  criticalCount = 0,
  activeCount = 0,
  isSelected = false,
  onClick,
  className,
}: AgentCardProps) {
  const styles = getVariantStyles(variant);

  return (
    <Card
      className={cn(
        "bg-card/50 border-border/50 backdrop-blur-sm transition-all duration-200 cursor-pointer group",
        "hover:shadow-md hover:border-primary/30",
        isSelected && "ring-2 ring-primary border-primary",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-lg", styles.bg)}>
              <Icon className={cn("h-5 w-5", styles.text)} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{shortName}</h3>
              <p className="text-xs text-muted-foreground">{name}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {criticalCount} crítico{criticalCount > 1 ? 's' : ''}
            </Badge>
          )}
          {activeCount > 0 && (
            <Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/20">
              {activeCount} ativo{activeCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Prompts Preview */}
        {prompts.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">
              {prompts.length} prompt{prompts.length > 1 ? 's' : ''} associado{prompts.length > 1 ? 's' : ''}
            </p>
            <div className="flex flex-wrap gap-1">
              {prompts.slice(0, 3).map((prompt) => {
                const impactConfig = getImpactConfig(prompt.impactLevel);
                const impactStyles = getVariantStyles(impactConfig.variant);
                return (
                  <Badge
                    key={prompt.id}
                    variant="outline"
                    className={cn("text-xs", impactStyles.bg, impactStyles.text, impactStyles.border)}
                  >
                    {prompt.name}
                  </Badge>
                );
              })}
              {prompts.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{prompts.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
