import { Bot, Cog, ArrowRight, Network } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AGENT_CONFIGS, getVariantStyles } from './config';
import { cn } from '@/lib/utils';

interface GovernanceMapCardProps {
  agentsCount?: number;
  servicesCount?: number;
  className?: string;
}

export function GovernanceMapCard({
  agentsCount,
  servicesCount = 5,
  className,
}: GovernanceMapCardProps) {
  const actualAgentsCount = agentsCount ?? AGENT_CONFIGS.length;
  
  return (
    <Card className={cn("bg-white border-2 border-slate-200 shadow-sm", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-md">
            <Network className="h-4 w-4 text-white" />
          </div>
          Mapa de Governança
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Architecture Flow */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {/* Agents */}
          <div className="flex-1 text-center">
            <div className="inline-flex items-center justify-center p-4 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg mb-2">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-foreground">Agentes</p>
            <Badge className="mt-1 bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-100">
              {actualAgentsCount}
            </Badge>
          </div>

          <ArrowRight className="h-5 w-5 text-slate-400 flex-shrink-0" />

          {/* Services */}
          <div className="flex-1 text-center">
            <div className="inline-flex items-center justify-center p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg mb-2">
              <Cog className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-foreground">Serviços</p>
            <Badge className="mt-1 bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">
              {servicesCount}
            </Badge>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="border-t border-slate-200 pt-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
            Agentes Ativos
          </p>
          <div className="grid grid-cols-5 gap-3">
            {AGENT_CONFIGS.map((agent) => {
              const styles = getVariantStyles(agent.variant);
              const Icon = agent.icon;
              return (
                <div
                  key={agent.id}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                    "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
                    styles.bg,
                    styles.border
                  )}
                >
                  <div className={cn("p-2 rounded-lg shadow-md mb-2", styles.iconBg)}>
                    <Icon className={cn("h-4 w-4", styles.iconText)} />
                  </div>
                  <span className={cn("text-xs font-bold", styles.text)}>
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
