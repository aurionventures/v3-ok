import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PromptListItem } from './PromptListItem';
import { ImpactLevel } from './config';
import { cn } from '@/lib/utils';

interface CriticalPrompt {
  id: string;
  name: string;
  agentName: string;
  impactLevel: ImpactLevel;
  version: string;
}

interface CriticalPromptsCardProps {
  prompts: CriticalPrompt[];
  onPromptClick?: (id: string) => void;
  onViewAll?: () => void;
  maxItems?: number;
  className?: string;
}

export function CriticalPromptsCard({
  prompts,
  onPromptClick,
  onViewAll,
  maxItems = 5,
  className,
}: CriticalPromptsCardProps) {
  const displayedPrompts = prompts.slice(0, maxItems);

  return (
    <Card className={cn("bg-card/50 border-border/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            Prompts Críticos
          </CardTitle>
          {prompts.length > maxItems && onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              Ver todos ({prompts.length})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {displayedPrompts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum prompt crítico encontrado</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayedPrompts.map((prompt) => (
              <PromptListItem
                key={prompt.id}
                id={prompt.id}
                name={prompt.name}
                agentName={prompt.agentName}
                impactLevel={prompt.impactLevel}
                version={prompt.version}
                variant="critical"
                onClick={() => onPromptClick?.(prompt.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
