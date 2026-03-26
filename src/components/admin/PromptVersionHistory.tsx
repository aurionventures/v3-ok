import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  GitBranch, 
  CheckCircle2, 
  Circle,
  Clock,
  RotateCcw
} from 'lucide-react';
import { usePrompts } from '@/hooks/usePrompts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PromptVersionHistoryProps {
  category: string;
  currentVersion: string;
}

const getStatusBadge = (status: string, isDefault: boolean) => {
  if (isDefault) {
    return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Default</Badge>;
  }
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>;
    case 'testing':
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Teste</Badge>;
    case 'deprecated':
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Depreciado</Badge>;
    default:
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Rascunho</Badge>;
  }
};

export function PromptVersionHistory({ category, currentVersion }: PromptVersionHistoryProps) {
  const { prompts, activatePrompt } = usePrompts();

  // Filter versions by category
  const versions = prompts
    ?.filter(p => p.category === category)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [];

  const handleRollback = async (promptId: string) => {
    await activatePrompt.mutateAsync(promptId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <GitBranch className="h-4 w-4" />
          Histórico de Versões
        </CardTitle>
      </CardHeader>
      <CardContent>
        {versions && versions.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-border" />

            <div className="space-y-4">
              {versions.map((version, index) => {
                const isCurrent = version.version === currentVersion;
                const isDefault = version.is_default;

                return (
                  <div key={version.id} className="relative flex gap-4">
                    {/* Timeline dot */}
                    <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      isDefault 
                        ? 'bg-green-500 border-green-500' 
                        : isCurrent 
                          ? 'bg-primary border-primary' 
                          : 'bg-background border-border'
                    }`}>
                      {isDefault ? (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      ) : (
                        <Circle className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 p-4 rounded-lg border ${
                      isCurrent ? 'border-primary/50 bg-primary/5' : 'bg-card'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">v{version.version}</span>
                            {getStatusBadge(version.status, version.is_default)}
                            {isCurrent && (
                              <Badge variant="outline">Visualizando</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {version.name}
                          </p>
                          {version.changelog && (
                            <p className="text-sm mt-2">{version.changelog}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {!isDefault && version.status !== 'deprecated' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRollback(version.id)}
                              disabled={activatePrompt.isPending}
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Rollback
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(version.created_at), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                        </div>
                        <span>•</span>
                        <span>{version.model}</span>
                        {version.total_executions > 0 && (
                          <>
                            <span>•</span>
                            <span>{version.total_executions} execuções</span>
                          </>
                        )}
                        {version.success_rate !== null && (
                          <>
                            <span>•</span>
                            <span>{version.success_rate}% sucesso</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Nenhuma versão encontrada para esta categoria.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
