import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Code, 
  Settings2, 
  Clock, 
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  useClientPromptConfigForOrg, 
  ClientPromptConfigWithOrg,
  buildEffectivePrompt 
} from '@/hooks/useClientPromptConfig';
import { toast } from 'sonner';

interface ClientPromptViewerProps {
  open: boolean;
  onClose: () => void;
  clientConfig: ClientPromptConfigWithOrg | null;
  basePrompt?: string;
  agentName?: string;
}

export function ClientPromptViewer({
  open,
  onClose,
  clientConfig,
  basePrompt = '',
  agentName = 'Agente'
}: ClientPromptViewerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { config, loading, reload } = useClientPromptConfigForOrg(
    clientConfig?.organization_id || null,
    clientConfig?.agent_category || ''
  );

  // Usar config atualizado ou o clientConfig passado
  const currentConfig = config || clientConfig;

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Prompt copiado para a área de transferência');
  };

  const getToneLabel = (tone: string) => {
    const labels: Record<string, string> = {
      'formal': 'Formal',
      'semi-formal': 'Semi-formal',
      'executivo': 'Executivo',
      'tecnico': 'Técnico'
    };
    return labels[tone] || tone;
  };

  const getPersonLabel = (person: string) => {
    const labels: Record<string, string> = {
      'terceira': 'Terceira pessoa',
      'primeira_plural': 'Primeira pessoa (plural)'
    };
    return labels[person] || person;
  };

  if (!currentConfig) return null;

  const effectivePrompt = buildEffectivePrompt(basePrompt, currentConfig);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="flex items-center gap-2">
                {currentConfig.organization_name || 'Cliente'}
                {!currentConfig.uses_default && (
                  <Badge variant="secondary" className="ml-2">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Customizado
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                Configuração do {agentName} para este cliente
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <Settings2 className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="prompt">
              <Code className="h-4 w-4 mr-2" />
              Prompt
            </TabsTrigger>
            <TabsTrigger value="effective">
              <Sparkles className="h-4 w-4 mr-2" />
              Prompt Efetivo
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
            <TabsContent value="overview" className="mt-0 space-y-4">
              {/* Status Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Status do Prompt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {currentConfig.uses_default ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <span className="font-medium">Usando Prompt Padrão</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 text-amber-500" />
                          <span className="font-medium">Prompt Customizado</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentConfig.uses_default 
                        ? 'Cliente utiliza o prompt definido pelo Super Admin'
                        : 'Cliente personalizou as configurações do prompt'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Modo de Edição</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {currentConfig.advanced_mode ? (
                        <>
                          <Code className="h-5 w-5 text-violet-500" />
                          <span className="font-medium">Modo Avançado</span>
                        </>
                      ) : (
                        <>
                          <Settings2 className="h-5 w-5 text-blue-500" />
                          <span className="font-medium">Modo Simplificado</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentConfig.advanced_mode 
                        ? 'Cliente edita o prompt diretamente'
                        : 'Cliente usa parâmetros de configuração'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Configurações de Estilo */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Configurações de Estilo</CardTitle>
                  <CardDescription>
                    Parâmetros definidos pelo cliente para geração de conteúdo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">Tom</p>
                      <Badge variant="outline" className="text-sm">
                        {getToneLabel(currentConfig.tone)}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">Pessoa Verbal</p>
                      <Badge variant="outline" className="text-sm">
                        {getPersonLabel(currentConfig.verbal_person)}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">Tamanho do Resumo</p>
                      <Badge variant="outline" className="text-sm">
                        {currentConfig.summary_length} palavras
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">Auto-Aprovação</p>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-sm",
                          currentConfig.auto_approval_days ? 'bg-green-50 text-green-700' : ''
                        )}
                      >
                        {currentConfig.auto_approval_days 
                          ? `${currentConfig.auto_approval_days} dias` 
                          : 'Desabilitado'}
                      </Badge>
                    </div>
                  </div>

                  {currentConfig.custom_instructions && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-muted-foreground uppercase mb-2">
                        Instruções Customizadas
                      </p>
                      <div className="p-3 rounded-md bg-muted/50 text-sm">
                        {currentConfig.custom_instructions}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Metadados */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Metadados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Criado em:</span>
                      <span>
                        {currentConfig.created_at 
                          ? new Date(currentConfig.created_at).toLocaleDateString('pt-BR')
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Atualizado em:</span>
                      <span>
                        {currentConfig.updated_at 
                          ? new Date(currentConfig.updated_at).toLocaleDateString('pt-BR')
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prompt" className="mt-0 space-y-4">
              {currentConfig.uses_default ? (
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">
                          Cliente usa o Prompt Padrão
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          Este cliente não possui um prompt customizado. Ele utiliza o prompt 
                          definido pelo Super Admin na biblioteca de prompts.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : currentConfig.custom_prompt ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Prompt Customizado do Cliente</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyPrompt(currentConfig.custom_prompt || '')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                  <Textarea
                    value={currentConfig.custom_prompt}
                    readOnly
                    className="h-[400px] font-mono text-sm"
                  />
                </div>
              ) : (
                <Card className="border-amber-200 bg-amber-50/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-900">
                          Modo Simplificado Ativo
                        </p>
                        <p className="text-sm text-amber-700 mt-1">
                          O cliente não editou o prompt diretamente, mas configurou parâmetros 
                          de estilo que são aplicados ao prompt base.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="effective" className="mt-0 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Prompt Efetivo
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyPrompt(effectivePrompt)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                  <CardDescription>
                    Este é o prompt que será efetivamente enviado para a IA, 
                    combinando o prompt base com as configurações do cliente.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={effectivePrompt}
                    readOnly
                    className="h-[400px] font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button variant="outline" onClick={reload}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
