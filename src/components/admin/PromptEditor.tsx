import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { usePrompts, AIPrompt, CreatePromptInput } from '@/hooks/usePrompts';
import { Loader2 } from 'lucide-react';

interface PromptEditorProps {
  open: boolean;
  onClose: () => void;
  promptId?: string | null;
}

const CATEGORIES = [
  { value: 'agent_a_collector', label: 'Agent A - Collector' },
  { value: 'agent_a_classifier', label: 'Agent A - Classifier' },
  { value: 'agent_b_analyzer', label: 'Agent B - Analyzer' },
  { value: 'agent_b_pattern_detector', label: 'Agent B - Pattern Detector' },
  { value: 'agent_c_scorer', label: 'Agent C - Scorer' },
  { value: 'agent_c_prioritizer', label: 'Agent C - Prioritizer' },
  { value: 'agent_d_agenda_generator', label: 'Agent D - Agenda Generator' },
  { value: 'agent_d_briefing_generator', label: 'Agent D - Briefing Generator' },
];

const MODELS = [
  { value: 'google/gemini-3-flash-preview', label: 'Gemini 3 Flash (Recomendado)' },
  { value: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
  { value: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
];

const STATUSES = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'testing', label: 'Em Teste' },
  { value: 'active', label: 'Ativo' },
  { value: 'deprecated', label: 'Depreciado' },
];

const defaultFormData: CreatePromptInput = {
  name: '',
  category: 'agent_a_collector',
  version: '1.0.0',
  description: '',
  system_prompt: '',
  user_prompt_template: '',
  model: 'google/gemini-3-flash-preview',
  temperature: 0.7,
  max_tokens: 4000,
  top_p: 1.0,
  frequency_penalty: 0,
  presence_penalty: 0,
  functions: null,
  tool_choice: 'auto',
  examples: null,
  status: 'draft',
  changelog: '',
  tags: []
};

export function PromptEditor({ open, onClose, promptId }: PromptEditorProps) {
  const { createPrompt, updatePrompt } = usePrompts();
  const isEditing = !!promptId;

  const [formData, setFormData] = useState<CreatePromptInput>(defaultFormData);
  const [functionsText, setFunctionsText] = useState('');
  const [examplesText, setExamplesText] = useState('');

  // Load existing prompt if editing
  const { data: existingPrompt, isLoading: loadingPrompt } = useQuery({
    queryKey: ['prompt', promptId],
    queryFn: async () => {
      if (!promptId) return null;
      const { data, error } = await (supabase as any)
        .from('ai_prompt_library')
        .select('*')
        .eq('id', promptId)
        .single();
      
      if (error) throw error;
      return data as AIPrompt;
    },
    enabled: !!promptId && open
  });

  useEffect(() => {
    if (existingPrompt) {
      setFormData({
        name: existingPrompt.name,
        category: existingPrompt.category,
        version: existingPrompt.version,
        description: existingPrompt.description || '',
        system_prompt: existingPrompt.system_prompt,
        user_prompt_template: existingPrompt.user_prompt_template || '',
        model: existingPrompt.model,
        temperature: existingPrompt.temperature,
        max_tokens: existingPrompt.max_tokens,
        top_p: existingPrompt.top_p,
        frequency_penalty: existingPrompt.frequency_penalty,
        presence_penalty: existingPrompt.presence_penalty,
        functions: existingPrompt.functions,
        tool_choice: existingPrompt.tool_choice,
        examples: existingPrompt.examples,
        status: existingPrompt.status,
        changelog: existingPrompt.changelog || '',
        tags: existingPrompt.tags || []
      });
      setFunctionsText(existingPrompt.functions ? JSON.stringify(existingPrompt.functions, null, 2) : '');
      setExamplesText(existingPrompt.examples ? JSON.stringify(existingPrompt.examples, null, 2) : '');
    } else if (!promptId) {
      setFormData(defaultFormData);
      setFunctionsText('');
      setExamplesText('');
    }
  }, [existingPrompt, promptId]);

  const handleSave = async () => {
    // Parse JSON fields
    let functions = null;
    let examples = null;

    if (functionsText.trim()) {
      try {
        functions = JSON.parse(functionsText);
      } catch (e) {
        // Invalid JSON, ignore
      }
    }

    if (examplesText.trim()) {
      try {
        examples = JSON.parse(examplesText);
      } catch (e) {
        // Invalid JSON, ignore
      }
    }

    const data = {
      ...formData,
      functions,
      examples
    };

    if (isEditing && promptId) {
      await updatePrompt.mutateAsync({ id: promptId, ...data });
    } else {
      await createPrompt.mutateAsync(data);
    }
    onClose();
  };

  const isSaving = createPrompt.isPending || updatePrompt.isPending;
  const isValid = formData.name.trim() && formData.system_prompt.trim();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Prompt' : 'Novo Prompt'}
          </DialogTitle>
        </DialogHeader>

        {loadingPrompt ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4">
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="basic">Básico</TabsTrigger>
                <TabsTrigger value="prompt">Prompt</TabsTrigger>
                <TabsTrigger value="config">Configuração</TabsTrigger>
                <TabsTrigger value="advanced">Avançado</TabsTrigger>
              </TabsList>

              {/* Tab: Basic */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Agent A Collector v1.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Versão (Semântica)</Label>
                    <Input
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      placeholder="1.0.0"
                    />
                    <p className="text-xs text-muted-foreground">
                      Use semantic versioning: MAJOR.MINOR.PATCH
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o propósito deste prompt..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Changelog (o que mudou nesta versão)</Label>
                  <Textarea
                    value={formData.changelog || ''}
                    onChange={(e) => setFormData({ ...formData, changelog: e.target.value })}
                    placeholder="Liste as alterações desta versão..."
                    rows={2}
                  />
                </div>
              </TabsContent>

              {/* Tab: Prompt */}
              <TabsContent value="prompt" className="space-y-4">
                <div className="space-y-2">
                  <Label>System Prompt *</Label>
                  <Textarea
                    value={formData.system_prompt}
                    onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                    placeholder="Você é um especialista em..."
                    rows={16}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>User Prompt Template (Opcional)</Label>
                  <Textarea
                    value={formData.user_prompt_template || ''}
                    onChange={(e) => setFormData({ ...formData, user_prompt_template: e.target.value })}
                    placeholder="Analise o seguinte contexto: {{context}}"
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {'{{variável}}'} para conteúdo dinâmico
                  </p>
                </div>
              </TabsContent>

              {/* Tab: Configuration */}
              <TabsContent value="config" className="space-y-6">
                <div className="space-y-2">
                  <Label>Modelo</Label>
                  <Select
                    value={formData.model}
                    onValueChange={(value) => setFormData({ ...formData, model: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MODELS.map(model => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Temperature</Label>
                    <span className="text-sm text-muted-foreground">{formData.temperature}</span>
                  </div>
                  <Slider
                    value={[formData.temperature || 0.7]}
                    onValueChange={([value]) => setFormData({ ...formData, temperature: value })}
                    min={0}
                    max={2}
                    step={0.1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Menor = mais determinístico, Maior = mais criativo
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Max Tokens</Label>
                    <span className="text-sm text-muted-foreground">{formData.max_tokens}</span>
                  </div>
                  <Slider
                    value={[formData.max_tokens || 4000]}
                    onValueChange={([value]) => setFormData({ ...formData, max_tokens: value })}
                    min={100}
                    max={16000}
                    step={100}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Top P</Label>
                    <span className="text-sm text-muted-foreground">{formData.top_p}</span>
                  </div>
                  <Slider
                    value={[formData.top_p || 1.0]}
                    onValueChange={([value]) => setFormData({ ...formData, top_p: value })}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Frequency Penalty</Label>
                      <span className="text-sm text-muted-foreground">{formData.frequency_penalty}</span>
                    </div>
                    <Slider
                      value={[formData.frequency_penalty || 0]}
                      onValueChange={([value]) => setFormData({ ...formData, frequency_penalty: value })}
                      min={0}
                      max={2}
                      step={0.1}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Presence Penalty</Label>
                      <span className="text-sm text-muted-foreground">{formData.presence_penalty}</span>
                    </div>
                    <Slider
                      value={[formData.presence_penalty || 0]}
                      onValueChange={([value]) => setFormData({ ...formData, presence_penalty: value })}
                      min={0}
                      max={2}
                      step={0.1}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Tab: Advanced */}
              <TabsContent value="advanced" className="space-y-4">
                <div className="space-y-2">
                  <Label>Function Calling (JSON)</Label>
                  <Textarea
                    value={functionsText}
                    onChange={(e) => setFunctionsText(e.target.value)}
                    placeholder={`[
  {
    "type": "function",
    "function": {
      "name": "example_function",
      "description": "Description",
      "parameters": { ... }
    }
  }
]`}
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tool Choice</Label>
                  <Input
                    value={formData.tool_choice || 'auto'}
                    onChange={(e) => setFormData({ ...formData, tool_choice: e.target.value })}
                    placeholder="auto, none, ou nome da função"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Few-shot Examples (JSON)</Label>
                  <Textarea
                    value={examplesText}
                    onChange={(e) => setExamplesText(e.target.value)}
                    placeholder={`[
  {
    "input": "Example input",
    "output": "Expected output"
  }
]`}
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !isValid}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              isEditing ? 'Atualizar' : 'Criar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
