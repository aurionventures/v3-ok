import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Target,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  Lightbulb,
  Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  Phase3FormData,
  StrategicObjective,
  Stakeholder,
  KnownRisk,
  OKR,
  MarketPosition,
  CompetitiveIntensity,
  RiskAppetite,
  RiskSeverity
} from '@/types/onboarding';

interface Phase3StrategicContextProps {
  initialData?: Partial<Phase3FormData>;
  onComplete: (data: Phase3FormData) => void;
  onBack?: () => void;
  isSaving?: boolean;
}

const MARKET_POSITIONS: { value: MarketPosition; label: string }[] = [
  { value: 'market_leader', label: 'Lider de Mercado' },
  { value: 'challenger', label: 'Desafiante' },
  { value: 'follower', label: 'Seguidor' },
  { value: 'niche_player', label: 'Nicho' }
];

const COMPETITIVE_INTENSITIES: { value: CompetitiveIntensity; label: string }[] = [
  { value: 'low', label: 'Baixa' },
  { value: 'moderate', label: 'Moderada' },
  { value: 'high', label: 'Alta' },
  { value: 'very_high', label: 'Muito Alta' }
];

const RISK_APPETITES: { value: RiskAppetite; label: string }[] = [
  { value: 'conservative', label: 'Conservador' },
  { value: 'moderate', label: 'Moderado' },
  { value: 'aggressive', label: 'Agressivo' }
];

const RISK_SEVERITIES: { value: RiskSeverity; label: string; color: string }[] = [
  { value: 'low', label: 'Baixo', color: 'bg-green-500' },
  { value: 'medium', label: 'Medio', color: 'bg-yellow-500' },
  { value: 'high', label: 'Alto', color: 'bg-orange-500' },
  { value: 'critical', label: 'Critico', color: 'bg-red-500' }
];

const RISK_CATEGORIES = [
  'Operacional',
  'Financeiro',
  'Regulatorio',
  'Reputacional',
  'Estrategico',
  'Tecnologico',
  'Ambiental',
  'Juridico',
  'Mercado',
  'Pessoas'
];

const STAKEHOLDER_TYPES = [
  { value: 'customer', label: 'Cliente' },
  { value: 'supplier', label: 'Fornecedor' },
  { value: 'investor', label: 'Investidor' },
  { value: 'regulator', label: 'Regulador' },
  { value: 'community', label: 'Comunidade' },
  { value: 'other', label: 'Outro' }
];

export function Phase3StrategicContext({
  initialData,
  onComplete,
  onBack,
  isSaving
}: Phase3StrategicContextProps) {
  const [activeTab, setActiveTab] = useState('mission-vision');
  const [formData, setFormData] = useState<Phase3FormData>({
    mission: initialData?.mission || '',
    vision: initialData?.vision || '',
    values: initialData?.values || [],
    businessModel: initialData?.businessModel || '',
    competitiveAdvantages: initialData?.competitiveAdvantages || [],
    keySuccessFactors: initialData?.keySuccessFactors || [],
    strategicObjectives: initialData?.strategicObjectives || [],
    okrs: initialData?.okrs || [],
    keyStakeholders: initialData?.keyStakeholders || [],
    marketPosition: initialData?.marketPosition,
    mainCompetitors: initialData?.mainCompetitors || [],
    competitiveIntensity: initialData?.competitiveIntensity,
    knownRisks: initialData?.knownRisks || [],
    riskAppetite: initialData?.riskAppetite,
    esgCommitments: initialData?.esgCommitments || [],
    sustainabilityGoals: initialData?.sustainabilityGoals || []
  });

  // Temporary state for adding items
  const [newValue, setNewValue] = useState('');
  const [newAdvantage, setNewAdvantage] = useState('');
  const [newFactor, setNewFactor] = useState('');
  const [newCompetitor, setNewCompetitor] = useState('');
  const [newObjective, setNewObjective] = useState<Partial<StrategicObjective>>({});
  const [newStakeholder, setNewStakeholder] = useState<Partial<Stakeholder>>({});
  const [newRisk, setNewRisk] = useState<Partial<KnownRisk>>({});

  const updateFormData = <K extends keyof Phase3FormData>(
    key: K,
    value: Phase3FormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const addToArray = (key: 'values' | 'competitiveAdvantages' | 'keySuccessFactors' | 'mainCompetitors', value: string) => {
    if (value.trim()) {
      updateFormData(key, [...(formData[key] || []), value.trim()]);
    }
  };

  const removeFromArray = (key: 'values' | 'competitiveAdvantages' | 'keySuccessFactors' | 'mainCompetitors', index: number) => {
    updateFormData(key, (formData[key] || []).filter((_, i) => i !== index));
  };

  const addObjective = () => {
    if (newObjective.title && newObjective.description) {
      const objective: StrategicObjective = {
        id: Date.now().toString(),
        title: newObjective.title,
        description: newObjective.description || '',
        timeline: newObjective.timeline || '',
        priority: (newObjective.priority as 'high' | 'medium' | 'low') || 'medium'
      };
      updateFormData('strategicObjectives', [...formData.strategicObjectives, objective]);
      setNewObjective({});
    }
  };

  const removeObjective = (id: string) => {
    updateFormData(
      'strategicObjectives',
      formData.strategicObjectives.filter(o => o.id !== id)
    );
  };

  const addStakeholder = () => {
    if (newStakeholder.name && newStakeholder.type) {
      const stakeholder: Stakeholder = {
        name: newStakeholder.name,
        type: newStakeholder.type as Stakeholder['type'],
        importance: (newStakeholder.importance as Stakeholder['importance']) || 'medium'
      };
      updateFormData('keyStakeholders', [...formData.keyStakeholders, stakeholder]);
      setNewStakeholder({});
    }
  };

  const removeStakeholder = (index: number) => {
    updateFormData(
      'keyStakeholders',
      formData.keyStakeholders.filter((_, i) => i !== index)
    );
  };

  const addRisk = () => {
    if (newRisk.title && newRisk.category && newRisk.severity) {
      const risk: KnownRisk = {
        id: Date.now().toString(),
        title: newRisk.title,
        category: newRisk.category,
        severity: newRisk.severity as RiskSeverity,
        description: newRisk.description || ''
      };
      updateFormData('knownRisks', [...formData.knownRisks, risk]);
      setNewRisk({});
    }
  };

  const removeRisk = (id: string) => {
    updateFormData('knownRisks', formData.knownRisks.filter(r => r.id !== id));
  };

  const handleComplete = () => {
    onComplete(formData);
  };

  const getProgress = () => {
    let filled = 0;
    let total = 8;

    if (formData.mission) filled++;
    if (formData.vision) filled++;
    if (formData.values.length > 0) filled++;
    if (formData.strategicObjectives.length >= 3) filled++;
    if (formData.keyStakeholders.length > 0) filled++;
    if (formData.marketPosition) filled++;
    if (formData.knownRisks.length >= 3) filled++;
    if (formData.riskAppetite) filled++;

    return (filled / total) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progresso do Contexto Estrategico</span>
          <span className="font-medium">{Math.round(getProgress())}%</span>
        </div>
        <Progress value={getProgress()} className="h-2" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mission-vision">
            <Flag className="mr-2 h-4 w-4" />
            Missao & Visao
          </TabsTrigger>
          <TabsTrigger value="objectives">
            <Target className="mr-2 h-4 w-4" />
            Objetivos
          </TabsTrigger>
          <TabsTrigger value="market">
            <TrendingUp className="mr-2 h-4 w-4" />
            Mercado
          </TabsTrigger>
          <TabsTrigger value="risks">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Riscos
          </TabsTrigger>
        </TabsList>

        {/* Mission & Vision Tab */}
        <TabsContent value="mission-vision" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Missao, Visao e Valores</CardTitle>
              <CardDescription>
                Defina o proposito e os principios que guiam a empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mission">Missao</Label>
                <Textarea
                  id="mission"
                  value={formData.mission}
                  onChange={(e) => updateFormData('mission', e.target.value)}
                  placeholder="Qual e o proposito fundamental da empresa?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vision">Visao</Label>
                <Textarea
                  id="vision"
                  value={formData.vision}
                  onChange={(e) => updateFormData('vision', e.target.value)}
                  placeholder="Onde a empresa quer chegar no futuro?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Valores</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.values.map((value, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {value}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeFromArray('values', index)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Adicionar valor"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToArray('values', newValue);
                        setNewValue('');
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      addToArray('values', newValue);
                      setNewValue('');
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessModel">Modelo de Negocio</Label>
                <Textarea
                  id="businessModel"
                  value={formData.businessModel}
                  onChange={(e) => updateFormData('businessModel', e.target.value)}
                  placeholder="Descreva como a empresa gera valor e receita"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Diferenciais Competitivos</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.competitiveAdvantages.map((advantage, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {advantage}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeFromArray('competitiveAdvantages', index)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newAdvantage}
                    onChange={(e) => setNewAdvantage(e.target.value)}
                    placeholder="Adicionar diferencial"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToArray('competitiveAdvantages', newAdvantage);
                        setNewAdvantage('');
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      addToArray('competitiveAdvantages', newAdvantage);
                      setNewAdvantage('');
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Objectives Tab */}
        <TabsContent value="objectives" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Objetivos Estrategicos</CardTitle>
              <CardDescription>
                Adicione pelo menos 3 objetivos estrategicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* List of objectives */}
              {formData.strategicObjectives.length > 0 && (
                <div className="space-y-2">
                  {formData.strategicObjectives.map((objective) => (
                    <div
                      key={objective.id}
                      className="flex items-start justify-between rounded-lg border p-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{objective.title}</h4>
                          <Badge
                            variant={
                              objective.priority === 'high'
                                ? 'destructive'
                                : objective.priority === 'medium'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {objective.priority === 'high'
                              ? 'Alta'
                              : objective.priority === 'medium'
                              ? 'Media'
                              : 'Baixa'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {objective.description}
                        </p>
                        {objective.timeline && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Prazo: {objective.timeline}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeObjective(objective.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new objective */}
              <Card className="bg-muted/50">
                <CardContent className="pt-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Titulo</Label>
                      <Input
                        value={newObjective.title || ''}
                        onChange={(e) =>
                          setNewObjective({ ...newObjective, title: e.target.value })
                        }
                        placeholder="Nome do objetivo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <Select
                        value={newObjective.priority || ''}
                        onValueChange={(value) =>
                          setNewObjective({ ...newObjective, priority: value as 'high' | 'medium' | 'low' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="medium">Media</SelectItem>
                          <SelectItem value="low">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descricao</Label>
                    <Textarea
                      value={newObjective.description || ''}
                      onChange={(e) =>
                        setNewObjective({ ...newObjective, description: e.target.value })
                      }
                      placeholder="Descreva o objetivo"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prazo</Label>
                    <Input
                      value={newObjective.timeline || ''}
                      onChange={(e) =>
                        setNewObjective({ ...newObjective, timeline: e.target.value })
                      }
                      placeholder="Ex: Q4 2026, Dezembro 2026"
                    />
                  </div>
                  <Button onClick={addObjective} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Objetivo
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Stakeholders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Stakeholders Principais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.keyStakeholders.length > 0 && (
                <div className="space-y-2">
                  {formData.keyStakeholders.map((stakeholder, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">{stakeholder.name}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">
                            {STAKEHOLDER_TYPES.find(t => t.value === stakeholder.type)?.label}
                          </Badge>
                          <Badge
                            variant={
                              stakeholder.importance === 'critical'
                                ? 'destructive'
                                : stakeholder.importance === 'high'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {stakeholder.importance === 'critical'
                              ? 'Critico'
                              : stakeholder.importance === 'high'
                              ? 'Alto'
                              : 'Medio'}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStakeholder(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  value={newStakeholder.name || ''}
                  onChange={(e) =>
                    setNewStakeholder({ ...newStakeholder, name: e.target.value })
                  }
                  placeholder="Nome"
                />
                <Select
                  value={newStakeholder.type || ''}
                  onValueChange={(value) =>
                    setNewStakeholder({ ...newStakeholder, type: value as Stakeholder['type'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAKEHOLDER_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={newStakeholder.importance || ''}
                  onValueChange={(value) =>
                    setNewStakeholder({ ...newStakeholder, importance: value as Stakeholder['importance'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Importancia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critico</SelectItem>
                    <SelectItem value="high">Alto</SelectItem>
                    <SelectItem value="medium">Medio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={addStakeholder} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Stakeholder
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Tab */}
        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mercado e Competicao</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Posicao de Mercado</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  {MARKET_POSITIONS.map(({ value, label }) => (
                    <div
                      key={value}
                      onClick={() => updateFormData('marketPosition', value)}
                      className={cn(
                        'cursor-pointer rounded-lg border-2 p-3 transition-all',
                        formData.marketPosition === value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {formData.marketPosition === value && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                        <span>{label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Intensidade Competitiva</Label>
                <div className="grid gap-2 md:grid-cols-4">
                  {COMPETITIVE_INTENSITIES.map(({ value, label }) => (
                    <div
                      key={value}
                      onClick={() => updateFormData('competitiveIntensity', value)}
                      className={cn(
                        'cursor-pointer rounded-lg border-2 p-3 text-center transition-all',
                        formData.competitiveIntensity === value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <span className="text-sm">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Principais Concorrentes</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.mainCompetitors.map((competitor, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {competitor}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeFromArray('mainCompetitors', index)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newCompetitor}
                    onChange={(e) => setNewCompetitor(e.target.value)}
                    placeholder="Nome do concorrente"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToArray('mainCompetitors', newCompetitor);
                        setNewCompetitor('');
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      addToArray('mainCompetitors', newCompetitor);
                      setNewCompetitor('');
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risks Tab */}
        <TabsContent value="risks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Riscos Conhecidos</CardTitle>
              <CardDescription>
                Adicione pelo menos 5 riscos conhecidos da organizacao
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Apetite a Risco</Label>
                <div className="grid gap-2 md:grid-cols-3">
                  {RISK_APPETITES.map(({ value, label }) => (
                    <div
                      key={value}
                      onClick={() => updateFormData('riskAppetite', value)}
                      className={cn(
                        'cursor-pointer rounded-lg border-2 p-3 text-center transition-all',
                        formData.riskAppetite === value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {formData.knownRisks.length > 0 && (
                <div className="space-y-2">
                  {formData.knownRisks.map((risk) => (
                    <div
                      key={risk.id}
                      className="flex items-start justify-between rounded-lg border p-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{risk.title}</h4>
                          <Badge variant="outline">{risk.category}</Badge>
                          <div
                            className={cn(
                              'h-2 w-2 rounded-full',
                              RISK_SEVERITIES.find(s => s.value === risk.severity)?.color
                            )}
                          />
                        </div>
                        {risk.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {risk.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRisk(risk.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Card className="bg-muted/50">
                <CardContent className="pt-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Titulo</Label>
                      <Input
                        value={newRisk.title || ''}
                        onChange={(e) =>
                          setNewRisk({ ...newRisk, title: e.target.value })
                        }
                        placeholder="Nome do risco"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select
                        value={newRisk.category || ''}
                        onValueChange={(value) =>
                          setNewRisk({ ...newRisk, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {RISK_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Severidade</Label>
                      <Select
                        value={newRisk.severity || ''}
                        onValueChange={(value) =>
                          setNewRisk({ ...newRisk, severity: value as RiskSeverity })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {RISK_SEVERITIES.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descricao</Label>
                    <Textarea
                      value={newRisk.description || ''}
                      onChange={(e) =>
                        setNewRisk({ ...newRisk, description: e.target.value })
                      }
                      placeholder="Descreva o risco"
                      rows={2}
                    />
                  </div>
                  <Button onClick={addRisk} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Risco
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Suggestion Panel */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Sugestao de IA</p>
              <p className="text-xs text-muted-foreground">
                Com base no setor e tamanho da empresa, recomendamos adicionar riscos
                relacionados a regulamentacao e conformidade como prioritarios.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button onClick={handleComplete} disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Concluir Fase 3'}
          <Check className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

