import { AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ImpactLevel, getImpactConfig, getVariantStyles } from './config';
import { cn } from '@/lib/utils';

interface PromptListItemProps {
  id: string;
  name: string;
  agentName?: string;
  impactLevel?: ImpactLevel;
  version?: string;
  timestamp?: string;
  changeType?: 'created' | 'updated' | 'deleted';
  variant?: 'critical' | 'change';
  onClick?: () => void;
  className?: string;
}

export function PromptListItem({
  id,
  name,
  agentName,
  impactLevel = 'medium',
  version,
  timestamp,
  changeType,
  variant = 'critical',
  onClick,
  className,
}: PromptListItemProps) {
  const impactConfig = getImpactConfig(impactLevel);
  const impactStyles = getVariantStyles(impactConfig.variant);

  const changeTypeConfig = {
    created: { label: 'Criado', variant: 'success' as const },
    updated: { label: 'Atualizado', variant: 'info' as const },
    deleted: { label: 'Removido', variant: 'destructive' as const },
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer group",
        "bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border/50",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 min-w-0">
        {variant === 'critical' && (
          <div className={cn("p-1.5 rounded", impactStyles.bg)}>
            <AlertTriangle className={cn("h-4 w-4", impactStyles.text)} />
          </div>
        )}
        {variant === 'change' && (
          <div className="p-1.5 rounded bg-muted">
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        
        <div className="min-w-0">
          <p className="font-medium text-foreground text-sm truncate">{name}</p>
          {agentName && (
            <p className="text-xs text-muted-foreground truncate">{agentName}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {version && (
          <Badge variant="outline" className="text-xs">
            v{version}
          </Badge>
        )}
        
        {impactLevel && variant === 'critical' && (
          <Badge
            variant="outline"
            className={cn("text-xs", impactStyles.bg, impactStyles.text, impactStyles.border)}
          >
            {impactConfig.label}
          </Badge>
        )}

        {changeType && variant === 'change' && (
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              getVariantStyles(changeTypeConfig[changeType].variant).bg,
              getVariantStyles(changeTypeConfig[changeType].variant).text,
              getVariantStyles(changeTypeConfig[changeType].variant).border
            )}
          >
            {changeTypeConfig[changeType].label}
          </Badge>
        )}

        {timestamp && (
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        )}

        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
