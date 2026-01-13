import { Brain, Bot, Cog, ArrowRight, Network } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AGENT_CONFIGS, getVariantStyles } from './config';
import { cn } from '@/lib/utils';

interface GovernanceMapCardProps {
  copilotsCount?: number;
  agentsCount?: number;
  servicesCount?: number;
  className?: string;
}

export function GovernanceMapCard({
  copilotsCount = 2,
  agentsCount = 4,
  servicesCount = 5,
  className,
}: GovernanceMapCardProps) {
  return (
    <Card className={cn("bg-card/50 border-border/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-1.5 rounded bg-primary/10">
            <Network className="h-4 w-4 text-primary" />
          </div>
          Mapa de Governança
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Architecture Flow */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Copilots */}
          <div className="flex-1 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-info/10 mb-2">
              <Brain className="h-6 w-6 text-info" />
            </div>
            <p className="text-sm font-medium text-foreground">Copilotos</p>
            <Badge variant="secondary" className="mt-1">
              {copilotsCount}
            </Badge>
          </div>

          <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />

          {/* Agents */}
          <div className="flex-1 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-accent/50 mb-2">
              <Bot className="h-6 w-6 text-accent-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Agentes</p>
            <Badge variant="secondary" className="mt-1">
              {agentsCount}
            </Badge>
          </div>

          <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />

          {/* Services */}
          <div className="flex-1 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-success/10 mb-2">
              <Cog className="h-6 w-6 text-success" />
            </div>
            <p className="text-sm font-medium text-foreground">Serviços</p>
            <Badge variant="secondary" className="mt-1">
              {servicesCount}
            </Badge>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="border-t border-border/50 pt-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
            Agentes Ativos
          </p>
          <div className="grid grid-cols-4 gap-2">
            {AGENT_CONFIGS.map((agent) => {
              const styles = getVariantStyles(agent.variant);
              const Icon = agent.icon;
              return (
                <div
                  key={agent.id}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-lg transition-all",
                    "hover:shadow-md cursor-pointer",
                    styles.bg
                  )}
                >
                  <Icon className={cn("h-5 w-5 mb-1", styles.text)} />
                  <span className={cn("text-xs font-medium", styles.text)}>
                    {agent.code}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
