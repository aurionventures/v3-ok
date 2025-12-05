import React, { useState, useEffect } from "react";
import { Bot, FileText, Sparkles, RotateCcw, Save, Check, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useATAConfig, ATAConfig, DEFAULT_CONFIG } from "@/hooks/useATAConfig";
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

  useEffect(() => {
    if (config) {
      setLocalConfig(config);
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

  const handleSave = async () => {
    await saveConfig(localConfig);
    setHasChanges(false);
    toast({
      title: "Configurações salvas",
      description: "As configurações de geração de ATA foram atualizadas.",
    });
  };

  const handleReset = () => {
    setLocalConfig(DEFAULT_CONFIG);
    setSelectedTemplate(null);
    setHasChanges(true);
  };

  const generatePromptPreview = () => {
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
      {/* Templates Pré-definidos */}
      <div>
        <h3 className="text-lg font-medium mb-4">Templates Pré-definidos</h3>
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
              <CardDescription>Como a ATA deve se referir ao órgão</CardDescription>
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
              <CardTitle className="text-base">Extensão do Resumo</CardTitle>
              <CardDescription>Número aproximado de palavras no resumo executivo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Slider
                  value={[localConfig.summaryLength]}
                  onValueChange={(value) => handleConfigChange('summaryLength', value[0])}
                  min={100}
                  max={400}
                  step={25}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>100 palavras</span>
                  <span className="font-medium text-foreground">{localConfig.summaryLength} palavras</span>
                  <span>400 palavras</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Instruções Específicas</CardTitle>
              <CardDescription>Adicione instruções personalizadas para sua empresa</CardDescription>
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
                Auto-Aprovação de ATA
              </CardTitle>
              <CardDescription>Configure aprovação automática após período sem resposta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ativar auto-aprovação</Label>
                  <p className="text-sm text-muted-foreground">
                    ATAs serão consideradas aprovadas automaticamente
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
                    <span className="text-sm">Após</span>
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
                    <span className="text-sm">dias da geração da ATA, considerar ATA aprovada pelos membros.</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Membros que não responderem dentro do prazo terão sua aprovação registrada automaticamente.
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
                Visualize como as instruções serão enviadas para a IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap border">
                {generatePromptPreview()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Restaurar Padrão
        </Button>
        <Button onClick={handleSave} disabled={!hasChanges || loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
};

export default AIParameterizationTab;
