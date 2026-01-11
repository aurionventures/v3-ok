import { useState } from 'react';
import { 
  Edit, 
  Play, 
  GitBranch, 
  TrendingUp, 
  Settings,
  Archive,
  Copy,
  CheckCircle,
  Clock,
  Zap,
  DollarSign,
  BarChart3,
  Code,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { usePrompts, AIPrompt } from '@/hooks/usePrompts';
import { PromptTestPlayground } from './PromptTestPlayground';
import { PromptVersionHistory } from './PromptVersionHistory';
import { PromptPerformanceChart } from './PromptPerformanceChart';

interface PromptDetailViewProps {
  promptId: string;
  onEdit: () => void;
  onRefresh: () => void;
  onBack?: () => void;
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    'agent_a_collector': 'Agent A - Collector',
    'agent_a_classifier': 'Agent A - Classifier',
    'agent_b_analyzer': 'Agent B - Analyzer',
    'agent_b_pattern_detector': 'Agent B - Pattern Detector',
    'agent_c_scorer': 'Agent C - Scorer',
    'agent_c_prioritizer': 'Agent C - Prioritizer',
    'agent_d_agenda_generator': 'Agent D - Agenda Generator',
    'agent_d_briefing_generator': 'Agent D - Briefing Generator',
  };
  return labels[category] || category;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>;
    case 'testing':
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Em Teste</Badge>;
    case 'deprecated':
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Depreciado</Badge>;
    default:
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Rascunho</Badge>;
  }
};

export function PromptDetailView({ promptId, onEdit, onRefresh, onBack }: PromptDetailViewProps) {
  const [testPlaygroundOpen, setTestPlaygroundOpen] = useState(false);
  const { prompts, activatePrompt, deprecatePrompt, duplicatePrompt } = usePrompts();

  // Find prompt from mock data
  const prompt = prompts?.find(p => p.id === promptId);

  if (!prompt) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Prompt não encontrado
      </div>
    );
  }

  const handleActivate = async () => {
    await activatePrompt.mutateAsync(promptId);
    onRefresh();
  };

  const handleDeprecate = async () => {
    await deprecatePrompt.mutateAsync(promptId);
    onRefresh();
  };

  const handleDuplicate = async () => {
    await duplicatePrompt.mutateAsync(promptId);
    onRefresh();
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Back Button */}
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para lista
          </Button>
        )}

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{prompt.name}</h1>
                {getStatusBadge(prompt.status)}
                {prompt.is_default && (
                  <Badge variant="outline" className="border-primary text-primary">
                    Default
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{getCategoryLabel(prompt.category)}</p>
              {prompt.description && (
                <p className="text-sm text-muted-foreground mt-2">{prompt.description}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setTestPlaygroundOpen(true)}>
                <Play className="h-4 w-4 mr-2" />
                Testar
              </Button>
              <Button variant="outline" size="sm" onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
              </Button>

              {prompt.status !== 'active' && prompt.status !== 'deprecated' && (
                <Button 
                  size="sm" 
                  onClick={handleActivate}
                  disabled={activatePrompt.isPending}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Ativar
                </Button>
              )}

              {prompt.status === 'active' && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleDeprecate}
                  disabled={deprecatePrompt.isPending}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Depreciar
                </Button>
              )}

              <Button size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <GitBranch className="h-4 w-4" />
              <span>v{prompt.version}</span>
            </div>
            <div className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>{prompt.model}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span>Temp: {prompt.temperature}</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>{prompt.total_executions || 0} execuções</span>
            </div>
            {prompt.success_rate !== null && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>{prompt.success_rate}% sucesso</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Tabs */}
        <Tabs defaultValue="prompt" className="space-y-4">
          <TabsList>
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="config">Configuração</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="versions">Versões</TabsTrigger>
          </TabsList>

          {/* Tab: Prompt */}
          <TabsContent value="prompt" className="space-y-4">
            {/* System Prompt */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  System Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap font-mono">
                  {prompt.system_prompt}
                </pre>
              </CardContent>
            </Card>

            {/* User Prompt Template */}
            {prompt.user_prompt_template && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">User Prompt Template</CardTitle>
                  <CardDescription>
                    Use {'{{variável}}'} para conteúdo dinâmico
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap font-mono">
                    {prompt.user_prompt_template}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Function Calling */}
            {prompt.functions && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Function Calling</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
                    {JSON.stringify(prompt.functions, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Examples */}
            {prompt.examples && Array.isArray(prompt.examples) && prompt.examples.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Few-shot Examples ({prompt.examples.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {prompt.examples.map((example: any, i: number) => (
                    <div key={i} className="border rounded-lg p-4 space-y-3">
                      <Badge variant="outline">Exemplo {i + 1}</Badge>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Input</p>
                          <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(example.input, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Output</p>
                          <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(example.output, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Configuration */}
          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Configuração do LLM</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ConfigItem label="Modelo" value={prompt.model} />
                  <ConfigItem label="Temperature" value={prompt.temperature.toString()} />
                  <ConfigItem label="Max Tokens" value={prompt.max_tokens.toString()} />
                  <ConfigItem label="Top P" value={prompt.top_p.toString()} />
                  <ConfigItem label="Frequency Penalty" value={prompt.frequency_penalty.toString()} />
                  <ConfigItem label="Presence Penalty" value={prompt.presence_penalty.toString()} />
                  <ConfigItem label="Tool Choice" value={prompt.tool_choice || 'auto'} />
                  <ConfigItem label="Status" value={prompt.status} />
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            {prompt.total_executions > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Métricas de Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard 
                      label="Execuções" 
                      value={prompt.total_executions.toString()} 
                      icon={<Zap className="h-4 w-4" />}
                    />
                    <MetricCard 
                      label="Latência Média" 
                      value={prompt.avg_latency_ms ? `${prompt.avg_latency_ms}ms` : '-'} 
                      icon={<Clock className="h-4 w-4" />}
                    />
                    <MetricCard 
                      label="Tokens Médios" 
                      value={prompt.avg_tokens_used?.toString() || '-'} 
                      icon={<BarChart3 className="h-4 w-4" />}
                    />
                    <MetricCard 
                      label="Custo Médio" 
                      value={prompt.avg_cost_usd ? `$${prompt.avg_cost_usd}` : '-'} 
                      icon={<DollarSign className="h-4 w-4" />}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Changelog */}
            {prompt.changelog && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Changelog</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{prompt.changelog}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Performance */}
          <TabsContent value="performance">
            <PromptPerformanceChart promptId={promptId} />
          </TabsContent>

          {/* Tab: Versions */}
          <TabsContent value="versions">
            <PromptVersionHistory category={prompt.category} currentVersion={prompt.version} />
          </TabsContent>
        </Tabs>

        {/* Test Playground Modal */}
        {testPlaygroundOpen && (
          <PromptTestPlayground
            open={testPlaygroundOpen}
            onClose={() => setTestPlaygroundOpen(false)}
            promptId={promptId}
          />
        )}
      </div>
    </ScrollArea>
  );
}

function ConfigItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-muted rounded-lg">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
