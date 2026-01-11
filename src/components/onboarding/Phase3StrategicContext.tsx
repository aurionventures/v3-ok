// =====================================================
// PHASE 3: STRATEGIC CONTEXT
// Coleta de contexto estrategico e qualitativo
// =====================================================

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Target, Users, AlertTriangle, TrendingUp, Lightbulb, Save, Loader2, Plus, Trash2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useStrategicContext, useOnboardingProgress, useCompanyProfile } from '@/hooks/useOnboardingMock';
import type {
  Phase3FormData,
  StrategicObjective,
  Stakeholder,
  KnownRisk,
  SustainabilityGoal,
  MarketPosition,
  CompetitiveIntensity,
  RiskAppetite,
  RiskSeverity
} from '@/types/onboarding';

interface Phase3StrategicContextProps {
  onComplete: () => void;
  onBack?: () => void;
}

const TABS = [
  { id: 'mission-vision', label: 'Missao & Visao', icon: Target },
  { id: 'objectives', label: 'Objetivos', icon: TrendingUp },
  { id: 'stakeholders', label: 'Stakeholders', icon: Users },
  { id: 'market', label: 'Mercado', icon: Target },
  { id: 'risks', label: 'Riscos', icon: AlertTriangle }
];

const defaultFormData: Phase3FormData = {
  mission: '',
  vision: '',
  values: [],
  businessModel: '',
  competitiveAdvantages: [],
  keySuccessFactors: [],
  strategicObjectives: [],
  okrs: [],
  keyStakeholders: [],
  marketPosition: undefined,
  mainCompetitors: [],
  competitiveIntensity: undefined,
  knownRisks: [],
  riskAppetite: undefined,
  recentAcquisitions: [],
  expansionPlans: '',
  investmentPriorities: [],
  esgCommitments: [],
  sustainabilityGoals: []
};

export function Phase3StrategicContext({ onComplete, onBack }: Phase3StrategicContextProps) {
  const { context, updateContext, isSaving, isLoading } = useStrategicContext();
  const { profile } = useCompanyProfile();
  const { completePhase } = useOnboardingProgress();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('mission-vision');
  const [formData, setFormData] = useState<Phase3FormData>(defaultFormData);
  
  // Input states for array fields
  const [valueInput, setValueInput] = useState('');
  const [advantageInput, setAdvantageInput] = useState('');
  const [competitorInput, setCompetitorInput] = useState('');
  const [priorityInput, setPriorityInput] = useState('');

  // Load context data
  useEffect(() => {
    if (context) {
      setFormData({
        mission: context.mission || '',
        vision: context.vision || '',
        values: context.values || [],
        businessModel: context.business_model || '',
        competitiveAdvantages: context.competitive_advantages || [],
        keySuccessFactors: context.key_success_factors || [],
        strategicObjectives: context.strategic_objectives || [],
        okrs: context.okrs || [],
        keyStakeholders: context.key_stakeholders || [],
        marketPosition: context.market_position,
        mainCompetitors: context.main_competitors || [],
        competitiveIntensity: context.competitive_intensity,
        knownRisks: context.known_risks || [],
        riskAppetite: context.risk_appetite,
        recentAcquisitions: [],
        expansionPlans: context.expansion_plans || '',
        investmentPriorities: context.investment_priorities || [],
        esgCommitments: context.esg_commitments || [],
        sustainabilityGoals: context.sustainability_goals || []
      });
    }
  }, [context]);

  const updateFormData = <K extends keyof Phase3FormData>(field: K, value: Phase3FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: keyof Phase3FormData, value: string, setInput: (v: string) => void) => {
    if (value.trim()) {
      const currentArray = formData[field] as string[];
      updateFormData(field, [...currentArray, value.trim()] as Phase3FormData[typeof field]);
      setInput('');
    }
  };

  const removeArrayItem = (field: keyof Phase3FormData, index: number) => {
    const currentArray = formData[field] as unknown[];
    updateFormData(field, currentArray.filter((_, i) => i !== index) as Phase3FormData[typeof field]);
  };

  const addObjective = () => {
    const newObjective: StrategicObjective = {
      id: `obj-${Date.now()}`,
      title: '',
      description: '',
      timeline: '',
      priority: 'medium'
    };
    updateFormData('strategicObjectives', [...formData.strategicObjectives, newObjective]);
  };

  const updateObjective = (index: number, updates: Partial<StrategicObjective>) => {
    const updated = formData.strategicObjectives.map((obj, i) =>
      i === index ? { ...obj, ...updates } : obj
    );
    updateFormData('strategicObjectives', updated);
  };

  const addStakeholder = () => {
    const newStakeholder: Stakeholder = {
      name: '',
      type: 'customer',
      importance: 'medium'
    };
    updateFormData('keyStakeholders', [...formData.keyStakeholders, newStakeholder]);
  };

  const updateStakeholder = (index: number, updates: Partial<Stakeholder>) => {
    const updated = formData.keyStakeholders.map((s, i) =>
      i === index ? { ...s, ...updates } : s
    );
    updateFormData('keyStakeholders', updated);
  };

  const addRisk = () => {
    const newRisk: KnownRisk = {
      id: `risk-${Date.now()}`,
      title: '',
      category: '',
      severity: 'medium',
      description: ''
    };
    updateFormData('knownRisks', [...formData.knownRisks, newRisk]);
  };

  const updateRisk = (index: number, updates: Partial<KnownRisk>) => {
    const updated = formData.knownRisks.map((r, i) =>
      i === index ? { ...r, ...updates } : r
    );
    updateFormData('knownRisks', updated);
  };

  const saveContext = async () => {
    await updateContext({
      mission: formData.mission,
      vision: formData.vision,
      values: formData.values,
      business_model: formData.businessModel,
      competitive_advantages: formData.competitiveAdvantages,
      key_success_factors: formData.keySuccessFactors,
      strategic_objectives: formData.strategicObjectives,
      okrs: formData.okrs,
      key_stakeholders: formData.keyStakeholders,
      market_position: formData.marketPosition,
      main_competitors: formData.mainCompetitors,
      competitive_intensity: formData.competitiveIntensity,
      known_risks: formData.knownRisks,
      risk_appetite: formData.riskAppetite,
      expansion_plans: formData.expansionPlans,
      investment_priorities: formData.investmentPriorities,
      esg_commitments: formData.esgCommitments,
      sustainability_goals: formData.sustainabilityGoals
    });
  };

  const handleComplete = async () => {
    await saveContext();
    await completePhase(3);
    toast({
      title: 'Onboarding Completo!',
      description: 'Sua base de conhecimento esta pronta.'
    });
    onComplete();
  };

  const generateAISuggestion = (field: string) => {
    // Simulacao de sugestao de IA baseada no perfil
    const suggestions: Record<string, string> = {
      mission: `Fornecer produtos e servicos de excelencia no setor de ${profile?.primary_sector || 'negocios'}, gerando valor sustentavel para todos os stakeholders.`,
      vision: `Ser referencia em governanca corporativa e inovacao no mercado brasileiro ate 2030.`,
      businessModel: `Modelo integrado com foco em ${profile?.target_markets?.join(' e ') || 'diversos mercados'}, operando em ${profile?.operating_states?.length || 'varios'} estados.`
    };
    
    if (suggestions[field]) {
      updateFormData(field as keyof Phase3FormData, suggestions[field]);
      toast({
        title: 'Sugestao aplicada',
        description: 'Voce pode editar o texto conforme necessario.'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const tabIndex = TABS.findIndex(t => t.id === activeTab);
  const progressPercentage = ((tabIndex + 1) / TABS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {TABS[tabIndex].label}
          </span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab: Mission & Vision */}
        <TabsContent value="mission-vision" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Missao, Visao e Valores</CardTitle>
              <CardDescription>
                Defina a identidade estrategica da empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mission">Missao</Label>
                  <Button variant="ghost" size="sm" onClick={() => generateAISuggestion('mission')}>
                    <Sparkles className="w-4 h-4 mr-1" />
                    Sugerir
                  </Button>
                </div>
                <Textarea
                  id="mission"
                  placeholder="Qual e a razao de existir da empresa?"
                  value={formData.mission}
                  onChange={(e) => updateFormData('mission', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="vision">Visao</Label>
                  <Button variant="ghost" size="sm" onClick={() => generateAISuggestion('vision')}>
                    <Sparkles className="w-4 h-4 mr-1" />
                    Sugerir
                  </Button>
                </div>
                <Textarea
                  id="vision"
                  placeholder="Onde a empresa quer chegar?"
                  value={formData.vision}
                  onChange={(e) => updateFormData('vision', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Valores</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar valor (ex: Integridade)"
                    value={valueInput}
                    onChange={(e) => setValueInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addArrayItem('values', valueInput, setValueInput)}
                  />
                  <Button onClick={() => addArrayItem('values', valueInput, setValueInput)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.values.map((value, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeArrayItem('values', index)}>
                      {value} &times;
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="businessModel">Modelo de Negocio</Label>
                  <Button variant="ghost" size="sm" onClick={() => generateAISuggestion('businessModel')}>
                    <Sparkles className="w-4 h-4 mr-1" />
                    Sugerir
                  </Button>
                </div>
                <Textarea
                  id="businessModel"
                  placeholder="Descreva como a empresa gera valor..."
                  value={formData.businessModel}
                  onChange={(e) => updateFormData('businessModel', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Vantagens Competitivas</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar vantagem competitiva"
                    value={advantageInput}
                    onChange={(e) => setAdvantageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addArrayItem('competitiveAdvantages', advantageInput, setAdvantageInput)}
                  />
                  <Button onClick={() => addArrayItem('competitiveAdvantages', advantageInput, setAdvantageInput)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {formData.competitiveAdvantages.map((adv, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm">{adv}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeArrayItem('competitiveAdvantages', index)}>
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Strategic Objectives */}
        <TabsContent value="objectives" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Objetivos Estrategicos</CardTitle>
                  <CardDescription>
                    Defina os principais objetivos de medio e longo prazo
                  </CardDescription>
                </div>
                <Button onClick={addObjective}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.strategicObjectives.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>Nenhum objetivo definido</p>
                  <p className="text-sm">Clique em "Adicionar" para criar um objetivo</p>
                </div>
              ) : (
                formData.strategicObjectives.map((obj, index) => (
                  <Card key={obj.id} className="bg-slate-50">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <Input
                            placeholder="Titulo do objetivo"
                            value={obj.title}
                            onChange={(e) => updateObjective(index, { title: e.target.value })}
                          />
                          <Textarea
                            placeholder="Descricao detalhada..."
                            value={obj.description}
                            onChange={(e) => updateObjective(index, { description: e.target.value })}
                            rows={2}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Prazo</Label>
                              <Input
                                placeholder="Ex: Q4 2026"
                                value={obj.timeline}
                                onChange={(e) => updateObjective(index, { timeline: e.target.value })}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Prioridade</Label>
                              <Select
                                value={obj.priority}
                                onValueChange={(value: 'high' | 'medium' | 'low') => updateObjective(index, { priority: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">Alta</SelectItem>
                                  <SelectItem value="medium">Media</SelectItem>
                                  <SelectItem value="low">Baixa</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeArrayItem('strategicObjectives', index)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Stakeholders */}
        <TabsContent value="stakeholders" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Principais Stakeholders</CardTitle>
                  <CardDescription>
                    Identifique as partes interessadas mais importantes
                  </CardDescription>
                </div>
                <Button onClick={addStakeholder}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.keyStakeholders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>Nenhum stakeholder definido</p>
                </div>
              ) : (
                formData.keyStakeholders.map((stakeholder, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 bg-slate-50 rounded-lg">
                    <div className="col-span-5">
                      <Input
                        placeholder="Nome do stakeholder"
                        value={stakeholder.name}
                        onChange={(e) => updateStakeholder(index, { name: e.target.value })}
                      />
                    </div>
                    <div className="col-span-3">
                      <Select
                        value={stakeholder.type}
                        onValueChange={(value: Stakeholder['type']) => updateStakeholder(index, { type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Cliente</SelectItem>
                          <SelectItem value="supplier">Fornecedor</SelectItem>
                          <SelectItem value="investor">Investidor</SelectItem>
                          <SelectItem value="regulator">Regulador</SelectItem>
                          <SelectItem value="community">Comunidade</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Select
                        value={stakeholder.importance}
                        onValueChange={(value: Stakeholder['importance']) => updateStakeholder(index, { importance: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critico</SelectItem>
                          <SelectItem value="high">Alto</SelectItem>
                          <SelectItem value="medium">Medio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="icon" onClick={() => removeArrayItem('keyStakeholders', index)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Market */}
        <TabsContent value="market" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Posicionamento de Mercado</CardTitle>
              <CardDescription>
                Descreva o cenario competitivo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Posicao no Mercado</Label>
                  <Select
                    value={formData.marketPosition}
                    onValueChange={(value: MarketPosition) => updateFormData('marketPosition', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market_leader">Lider de Mercado</SelectItem>
                      <SelectItem value="challenger">Desafiante</SelectItem>
                      <SelectItem value="follower">Seguidor</SelectItem>
                      <SelectItem value="niche_player">Nicho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Intensidade Competitiva</Label>
                  <Select
                    value={formData.competitiveIntensity}
                    onValueChange={(value: CompetitiveIntensity) => updateFormData('competitiveIntensity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="moderate">Moderada</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="very_high">Muito Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Principais Concorrentes</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome do concorrente"
                    value={competitorInput}
                    onChange={(e) => setCompetitorInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addArrayItem('mainCompetitors', competitorInput, setCompetitorInput)}
                  />
                  <Button onClick={() => addArrayItem('mainCompetitors', competitorInput, setCompetitorInput)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.mainCompetitors.map((comp, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeArrayItem('mainCompetitors', index)}>
                      {comp} &times;
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expansionPlans">Planos de Expansao</Label>
                <Textarea
                  id="expansionPlans"
                  placeholder="Descreva os planos de expansao ou aquisicao..."
                  value={formData.expansionPlans}
                  onChange={(e) => updateFormData('expansionPlans', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Prioridades de Investimento</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar prioridade"
                    value={priorityInput}
                    onChange={(e) => setPriorityInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addArrayItem('investmentPriorities', priorityInput, setPriorityInput)}
                  />
                  <Button onClick={() => addArrayItem('investmentPriorities', priorityInput, setPriorityInput)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {formData.investmentPriorities?.map((priority, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm">{priority}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeArrayItem('investmentPriorities', index)}>
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Risks */}
        <TabsContent value="risks" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Riscos Conhecidos</CardTitle>
                  <CardDescription>
                    Identifique os principais riscos da organizacao
                  </CardDescription>
                </div>
                <Button onClick={addRisk}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Apetite a Risco</Label>
                <Select
                  value={formData.riskAppetite}
                  onValueChange={(value: RiskAppetite) => updateFormData('riskAppetite', value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservador</SelectItem>
                    <SelectItem value="moderate">Moderado</SelectItem>
                    <SelectItem value="aggressive">Agressivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.knownRisks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>Nenhum risco identificado</p>
                </div>
              ) : (
                formData.knownRisks.map((risk, index) => (
                  <Card key={risk.id} className="bg-slate-50">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="Titulo do risco"
                              value={risk.title}
                              onChange={(e) => updateRisk(index, { title: e.target.value })}
                            />
                            <Input
                              placeholder="Categoria (ex: Financeiro)"
                              value={risk.category}
                              onChange={(e) => updateRisk(index, { category: e.target.value })}
                            />
                          </div>
                          <Textarea
                            placeholder="Descricao do risco..."
                            value={risk.description}
                            onChange={(e) => updateRisk(index, { description: e.target.value })}
                            rows={2}
                          />
                          <div className="w-48">
                            <Label className="text-xs">Severidade</Label>
                            <Select
                              value={risk.severity}
                              onValueChange={(value: RiskSeverity) => updateRisk(index, { severity: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Baixa</SelectItem>
                                <SelectItem value="medium">Media</SelectItem>
                                <SelectItem value="high">Alta</SelectItem>
                                <SelectItem value="critical">Critica</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeArrayItem('knownRisks', index)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="flex gap-2">
          {tabIndex < TABS.length - 1 ? (
            <Button onClick={() => setActiveTab(TABS[tabIndex + 1].id)}>
              Proximo
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Concluir Onboarding
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Phase3StrategicContext;
