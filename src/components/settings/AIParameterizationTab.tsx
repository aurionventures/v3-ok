import React, { useState, useEffect } from "react";
import { Bot, FileText, Sparkles, RotateCcw, Save, Check, Clock, Code, Settings2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { useATAConfig, ATAConfig, DEFAULT_CONFIG, DEFAULT_ATA_PROMPT } from "@/hooks/useATAConfig";
import { cn } from "@/lib/utils";

const TEMPLATES = [
  {
    id: 'formal',
    name: 'Formal',
    description: 'Linguagem jurídica e cerimonial, ideal para conselhos de administração',
    icon: FileText,
    config: {
      tone: 'formal' as const,
      verbalPerson: 'terceira' as const,
      summaryLength: 250,
      customInstructions: 'Utilize vocabulário jurídico-corporativo. Inclua referências a deliberações formais e quórum.'
    }
  },
  {
    id: 'executivo',
    name: 'Executivo',
    description: 'Direto e focado em decisões, ideal para comitês executivos',
    icon: Sparkles,
    config: {
      tone: 'executivo' as const,
      verbalPerson: 'terceira' as const,
      summaryLength: 200,
      customInstructions: 'Foque em decisões tomadas, responsáveis e prazos. Seja objetivo e prático.'
    }
  },
  {
    id: 'tecnico',
    name: 'Técnico',
    description: 'Linguagem técnica com bullet points, ideal para comissões',
    icon: Bot,
    config: {
      tone: 'tecnico' as const,
      verbalPerson: 'primeira_plural' as const,
      summaryLength: 300,
      customInstructions: 'Use listas e bullet points. Inclua métricas e dados quando disponíveis.'
    }
  }
];

const TONE_OPTIONS = [
  { value: 'formal', label: 'Formal', description: 'Linguagem jurídica e cerimonial' },
  { value: 'semi-formal', label: 'Semi-formal', description: 'Profissional mas acessível' },
  { value: 'executivo', label: 'Executivo', description: 'Direto e focado em decisões' },
  { value: 'tecnico', label: 'Técnico', description: 'Técnico com dados e métricas' },
];

const VERBAL_PERSON_OPTIONS = [
  { value: 'terceira', label: 'Terceira pessoa', example: '"O Conselho deliberou..."' },
  { value: 'primeira_plural', label: 'Primeira pessoa plural', example: '"Deliberamos..."' },
];

export const AIParameterizationTab: React.FC = () => {
  const { config, saveConfig, loading } = useATAConfig();
  const [localConfig, setLocalConfig] = useState<ATAConfig>(config || DEFAULT_CONFIG);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(localConfig.advancedMode ? 'advanced' : 'simple');

  useEffect(() => {
    if (config) {
      setLocalConfig(config);
      setActiveTab(config.advancedMode ? 'advanced' : 'simple');
    }
  }, [config]);

  const handleTemplateSelect = (template: typeof TEMPLATES[0]) => {
    setSelectedTemplate(template.id);
    setLocalConfig(prev => ({
      ...prev,
      ...template.config
    }));
    setHasChanges(true);
  };

  const handleConfigChange = (key: keyof ATAConfig, value: any) => {
    setSelectedTemplate(null);
    setLocalConfig(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const isAdvanced = tab === 'advanced';
    setLocalConfig(prev => ({
      ...prev,
      advancedMode: isAdvanced
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await saveConfig(localConfig);
    setHasChanges(false);
    toast({
      title: "Configuracoes salvas",
      description: "As configuracoes de geracao de ATA foram atualizadas.",
    });
  };

  const handleReset = () => {
    setLocalConfig(DEFAULT_CONFIG);
    setSelectedTemplate(null);
    setActiveTab('simple');
    setHasChanges(true);
  };

  const handleResetPrompt = () => {
    setLocalConfig(prev => ({
      ...prev,
      fullPrompt: DEFAULT_ATA_PROMPT
    }));
    setHasChanges(true);
    toast({
      title: "Prompt restaurado",
      description: "O prompt foi restaurado para a versao padrao.",
    });
  };

  const generatePromptPreview = () => {
    if (localConfig.advancedMode && localConfig.fullPrompt) {
      return localConfig.fullPrompt;
    }

    const toneMap: Record<string, string> = {
      'formal': 'Use linguagem jurídica formal e cerimonial',
      'semi-formal': 'Use linguagem profissional mas acessível',
      'executivo': 'Seja direto e focado em decisões e ações',
      'tecnico': 'Use linguagem técnica com bullet points'
    };

    const personMap: Record<string, string> = {
      'terceira': 'Use terceira pessoa do singular',
      'primeira_plural': 'Use primeira pessoa do plural'
    };

    return `Você é um secretário executivo experiente em governança corporativa brasileira.

INSTRUÇÕES DE ESTILO:
- ${toneMap[localConfig.tone]}
- ${personMap[localConfig.verbalPerson]}
- Gere resumos executivos de ${localConfig.summaryLength} palavras

${localConfig.customInstructions ? `INSTRUÇÕES ESPECÍFICAS DO CLIENTE:\n${localConfig.customInstructions}` : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Seletor de Modo */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="simple" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Modo Simplificado
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Editor de Prompt
          </TabsTrigger>
        </TabsList>

        {/* MODO SIMPLIFICADO */}
        <TabsContent value="simple" className="mt-6">
          {/* Templates Pré-definidos */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Templates Pre-definidos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Selecione um template como ponto de partida ou personalize manualmente abaixo.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/50",
                    selectedTemplate === template.id && "border-primary ring-2 ring-primary/20"
                  )}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <template.icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      {selectedTemplate === template.id && (
                        <Check className="h-4 w-4 text-primary ml-auto" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{template.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Personalização Manual */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tom de Voz</CardTitle>
                  <CardDescription>Define o estilo de linguagem da ATA</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={localConfig.tone}
                    onValueChange={(value) => handleConfigChange('tone', value)}
                    className="space-y-3"
                  >
                    {TONE_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-start space-x-3">
                        <RadioGroupItem value={option.value} id={`tone-${option.value}`} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={`tone-${option.value}`} className="font-medium cursor-pointer">
                            {option.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pessoa Verbal</CardTitle>
                  <CardDescription>Como a ATA deve se referir ao orgao</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={localConfig.verbalPerson}
                    onValueChange={(value) => handleConfigChange('verbalPerson', value)}
                    className="space-y-3"
                  >
                    {VERBAL_PERSON_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-start space-x-3">
                        <RadioGroupItem value={option.value} id={`person-${option.value}`} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={`person-${option.value}`} className="font-medium cursor-pointer">
                            {option.label}
                          </Label>
                          <p className="text-sm text-muted-foreground italic">{option.example}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Extensao do Resumo</CardTitle>
                  <CardDescription>Numero aproximado de palavras no resumo executivo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={[localConfig.summaryLength]}
                      onValueChange={(value) => handleConfigChange('summaryLength', value[0])}
                      min={100}
                      max={2500}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>100 palavras</span>
                      <span className="font-medium text-foreground">{localConfig.summaryLength} palavras</span>
                      <span>2.500 palavras</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Instrucoes Especificas</CardTitle>
                  <CardDescription>Adicione instrucoes personalizadas para sua empresa</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={localConfig.customInstructions}
                    onChange={(e) => handleConfigChange('customInstructions', e.target.value)}
                    placeholder="Ex: Sempre mencione o quórum presente. Inclua referências aos documentos anexos. Use o nome completo dos membros na primeira menção..."
                    className="min-h-[120px]"
                  />
                </CardContent>
              </Card>

              {/* Auto-Approval Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Auto-Aprovacao de ATA
                  </CardTitle>
                  <CardDescription>Configure aprovacao automatica apos periodo sem resposta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Ativar auto-aprovacao</Label>
                      <p className="text-sm text-muted-foreground">
                        ATAs serao consideradas aprovadas automaticamente
                      </p>
                    </div>
                    <Switch
                      checked={localConfig.autoApprovalDays !== null}
                      onCheckedChange={(checked) => {
                        handleConfigChange('autoApprovalDays', checked ? 7 : null);
                      }}
                    />
                  </div>

                  {localConfig.autoApprovalDays !== null && (
                    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm">Apos</span>
                        <Input
                          type="number"
                          min={3}
                          max={30}
                          value={localConfig.autoApprovalDays}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 7;
                            handleConfigChange('autoApprovalDays', Math.min(30, Math.max(3, value)));
                          }}
                          className="w-20 h-9 text-center"
                        />
                        <span className="text-sm">dias da geracao da ATA, considerar ATA aprovada pelos membros.</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Membros que nao responderem dentro do prazo terao sua aprovacao registrada automaticamente.
                        O prazo deve estar entre 3 e 30 dias.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Preview do Prompt */}
            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Preview do Prompt
                  </CardTitle>
                  <CardDescription>
                    Visualize como as instrucoes serao enviadas para a IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap border max-h-[500px] overflow-y-auto">
                    {generatePromptPreview()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* MODO AVANÇADO - EDITOR DE PROMPT */}
        <TabsContent value="advanced" className="mt-6">
          <div className="space-y-6">
            {/* Alerta de Modo Avançado */}
            <Alert variant="default" className="border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-600">Modo Avancado</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                No modo avancado, voce tem controle total sobre o prompt enviado para a IA.
                Alteracoes incorretas podem afetar a qualidade da geracao de ATAs.
                Se precisar, use o botao "Restaurar Prompt Padrao" para voltar a versao original.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Editor do Prompt */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Code className="h-5 w-5" />
                          Editor de Prompt de ATA
                        </CardTitle>
                        <CardDescription>
                          Edite o prompt completo que sera enviado para a IA gerar ATAs
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetPrompt}
                        className="text-amber-600 border-amber-500/50 hover:bg-amber-500/10"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Restaurar Padrao
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={localConfig.fullPrompt || DEFAULT_ATA_PROMPT}
                      onChange={(e) => handleConfigChange('fullPrompt', e.target.value)}
                      placeholder="Digite o prompt completo para geração de ATA..."
                      className="min-h-[500px] font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      O prompt sera enviado como instrucao de sistema para a IA.
                      Variaveis disponiveis: dados da reuniao serao injetados automaticamente.
                    </p>
                  </CardContent>
                </Card>

                {/* Auto-Approval no modo avançado também */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Auto-Aprovacao de ATA
                    </CardTitle>
                    <CardDescription>Configure aprovacao automatica apos periodo sem resposta</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Ativar auto-aprovacao</Label>
                        <p className="text-sm text-muted-foreground">
                          ATAs serao consideradas aprovadas automaticamente
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.autoApprovalDays !== null}
                        onCheckedChange={(checked) => {
                          handleConfigChange('autoApprovalDays', checked ? 7 : null);
                        }}
                      />
                    </div>

                    {localConfig.autoApprovalDays !== null && (
                      <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm">Apos</span>
                          <Input
                            type="number"
                            min={3}
                            max={30}
                            value={localConfig.autoApprovalDays}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 7;
                              handleConfigChange('autoApprovalDays', Math.min(30, Math.max(3, value)));
                            }}
                            className="w-20 h-9 text-center"
                          />
                          <span className="text-sm">dias da geracao da ATA, considerar ATA aprovada.</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Dicas e Variáveis */}
              <div className="space-y-6">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Guia de Variaveis
                    </CardTitle>
                    <CardDescription>
                      Dados que serao injetados automaticamente no contexto
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium text-sm">Dados da Reuniao</p>
                        <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                          <li>- Orgao (Conselho, Comite, etc.)</li>
                          <li>- Data e Horario</li>
                          <li>- Tipo e Modalidade</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium text-sm">Participantes</p>
                        <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                          <li>- Lista de presentes</li>
                          <li>- Cargo de cada membro</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium text-sm">Pauta</p>
                        <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                          <li>- Itens da pauta</li>
                          <li>- Descricoes e apresentadores</li>
                          <li>- Resultados esperados</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium text-sm">Tarefas</p>
                        <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                          <li>- Tarefas atribuidas</li>
                          <li>- Responsaveis e prazos</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="font-medium text-sm mb-2">Formato de Resposta Esperado</p>
                      <div className="bg-muted rounded-lg p-3 font-mono text-xs">
{`{
  "summary": "Resumo executivo...",
  "decisions": [
    "Decisão 1",
    "Decisão 2"
  ]
}`}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        A IA deve retornar um JSON com summary e decisions.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Ações */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Restaurar Padrao
        </Button>
        <Button onClick={handleSave} disabled={!hasChanges || loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Salvando...' : 'Salvar Configuracoes'}
        </Button>
      </div>
    </div>
  );
};

export default AIParameterizationTab;
