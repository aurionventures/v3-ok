import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PromptListItem } from './PromptListItem';
import { cn } from '@/lib/utils';

interface RecentChange {
  id: string;
  name: string;
  agentName: string;
  changeType: 'created' | 'updated' | 'deleted';
  timestamp: string;
  version?: string;
}

interface RecentChangesCardProps {
  changes: RecentChange[];
  onChangeClick?: (id: string) => void;
  onViewAll?: () => void;
  maxItems?: number;
  className?: string;
}

export function RecentChangesCard({
  changes,
  onChangeClick,
  onViewAll,
  maxItems = 5,
  className,
}: RecentChangesCardProps) {
  const displayedChanges = changes.slice(0, maxItems);

  return (
    <Card className={cn("bg-card/50 border-border/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded bg-info/10">
              <Clock className="h-4 w-4 text-info" />
            </div>
            Últimas Alterações
          </CardTitle>
          {changes.length > maxItems && onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              Ver todas ({changes.length})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {displayedChanges.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma alteração recente</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayedChanges.map((change) => (
              <PromptListItem
                key={change.id}
                id={change.id}
                name={change.name}
                agentName={change.agentName}
                changeType={change.changeType}
                timestamp={change.timestamp}
                version={change.version}
                variant="change"
                onClick={() => onChangeClick?.(change.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
