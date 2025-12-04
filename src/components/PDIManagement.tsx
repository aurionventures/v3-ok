import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target, Calendar, TrendingUp, Award, Clock, 
  CheckCircle2, AlertCircle, Plus, BookOpen, 
  Users, Brain, Lightbulb, Trophy, Star
} from 'lucide-react';
import { toast } from 'sonner';

// Types for PDI
interface PDIGoal {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'leadership' | 'strategic' | 'behavioral';
  priority: 'high' | 'medium' | 'low';
  targetDate: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  actions: PDIAction[];
  mentor?: string;
  budget?: number;
}

interface PDIAction {
  id: string;
  title: string;
  type: 'course' | 'mentoring' | 'project' | 'assessment' | 'certification';
  provider?: string;
  duration: string;
  cost?: number;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
}

interface ExecutiveProfile {
  id: string;
  title: string;
  level: 'junior' | 'mid' | 'senior' | 'executive' | 'c_level';
  department: string;
  competencies: Competency[];
  experiences: string[];
  certifications: string[];
  languages: string[];
  minYearsExp: number;
  description: string;
}

interface Competency {
  name: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  category: 'technical' | 'leadership' | 'strategic' | 'behavioral';
  weight: number;
}

// Executive profiles templates
const executiveProfiles: ExecutiveProfile[] = [
  {
    id: 'ceo',
    title: 'Chief Executive Officer (CEO)',
    level: 'c_level',
    department: 'Executivo',
    competencies: [
      { name: 'Liderança Estratégica', level: 'expert', category: 'leadership', weight: 0.25 },
      { name: 'Visão de Negócios', level: 'expert', category: 'strategic', weight: 0.25 },
      { name: 'Gestão de Stakeholders', level: 'expert', category: 'behavioral', weight: 0.20 },
      { name: 'Tomada de Decisão', level: 'expert', category: 'strategic', weight: 0.20 },
      { name: 'Comunicação Executiva', level: 'expert', category: 'behavioral', weight: 0.10 }
    ],
    experiences: [
      'Mínimo 15 anos em posições de liderança',
      'Experiência em gestão de P&L',
      'Histórico de transformação organizacional',
      'Experiência internacional desejável'
    ],
    certifications: ['MBA ou equivalente', 'Certificação em Governança Corporativa'],
    languages: ['Português (nativo)', 'Inglês (fluente)', 'Espanhol (intermediário)'],
    minYearsExp: 15,
    description: 'Responsável pela liderança estratégica e operacional da organização'
  },
  {
    id: 'cfo',
    title: 'Chief Financial Officer (CFO)',
    level: 'c_level',
    department: 'Financeiro',
    competencies: [
      { name: 'Gestão Financeira Avançada', level: 'expert', category: 'technical', weight: 0.30 },
      { name: 'Planejamento Estratégico', level: 'expert', category: 'strategic', weight: 0.25 },
      { name: 'Relações com Investidores', level: 'advanced', category: 'behavioral', weight: 0.20 },
      { name: 'Controles Internos', level: 'expert', category: 'technical', weight: 0.15 },
      { name: 'Liderança de Equipes', level: 'advanced', category: 'leadership', weight: 0.10 }
    ],
    experiences: [
      'Mínimo 12 anos em finanças corporativas',
      'Experiência com mercado de capitais',
      'Gestão de auditoria e compliance',
      'Experiência em M&A desejável'
    ],
    certifications: ['CFA ou CPA', 'MBA Financeiro', 'Certificação em Controles Internos'],
    languages: ['Português (nativo)', 'Inglês (fluente)'],
    minYearsExp: 12,
    description: 'Responsável pela gestão financeira estratégica e relações com investidores'
  },
  {
    id: 'coo',
    title: 'Chief Operating Officer (COO)',
    level: 'c_level',
    department: 'Operações',
    competencies: [
      { name: 'Gestão Operacional', level: 'expert', category: 'technical', weight: 0.30 },
      { name: 'Otimização de Processos', level: 'expert', category: 'technical', weight: 0.25 },
      { name: 'Liderança Operacional', level: 'expert', category: 'leadership', weight: 0.20 },
      { name: 'Gestão da Qualidade', level: 'advanced', category: 'technical', weight: 0.15 },
      { name: 'Gestão de Mudanças', level: 'advanced', category: 'behavioral', weight: 0.10 }
    ],
    experiences: [
      'Mínimo 12 anos em operações',
      'Experiência em transformação digital',
      'Gestão de equipes multifuncionais',
      'Implementação de metodologias ágeis'
    ],
    certifications: ['MBA Operacional', 'Lean Six Sigma Black Belt', 'Certificação PMP'],
    languages: ['Português (nativo)', 'Inglês (avançado)'],
    minYearsExp: 12,
    description: 'Responsável pela excelência operacional e implementação da estratégia'
  }
];

// Sample PDI data
const samplePDIs = [
  {
    id: '1',
    personId: '1', // Ana Silva
    personName: 'Ana Silva',
    personCategory: 'Sucessor',
    currentRole: 'Gerente Regional',
    targetRole: 'CEO',
    goals: [
      {
        id: 'g1',
        title: 'MBA Executivo',
        description: 'Concluir MBA Executivo em instituição de primeira linha',
        category: 'technical' as const,
        priority: 'high' as const,
        targetDate: '2025-12-31',
        progress: 25,
        status: 'in_progress' as const,
        mentor: 'Dr. Carlos Silva',
        budget: 120000,
        actions: [
          {
            id: 'a1',
            title: 'Aplicação e Admissão',
            type: 'assessment' as const,
            duration: '2 meses',
            deadline: '2025-03-15',
            status: 'completed' as const
          },
          {
            id: 'a2',
            title: 'Módulo 1 - Estratégia',
            type: 'course' as const,
            provider: 'FGV',
            duration: '3 meses',
            deadline: '2025-06-30',
            status: 'in_progress' as const
          }
        ]
      },
      {
        id: 'g2',
        title: 'Experiência Internacional',
        description: 'Liderar projeto de expansão para América Latina',
        category: 'strategic' as const,
        priority: 'high' as const,
        targetDate: '2026-06-30',
        progress: 10,
        status: 'not_started' as const,
        mentor: 'Maria Santos',
        actions: []
      }
    ]
  }
];

const PDIManagement = () => {
  const [selectedPDI, setSelectedPDI] = useState<string>('');
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ExecutiveProfile | null>(null);
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'technical' as const,
    priority: 'medium' as const,
    targetDate: '',
    mentor: '',
    budget: ''
  });

  const getCategoryIcon = (category: string) => {
    const icons = {
      technical: BookOpen,
      leadership: Users,
      strategic: Brain,
      behavioral: Lightbulb
    };
    return icons[category as keyof typeof icons] || BookOpen;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technical: 'bg-blue-100 text-blue-800',
      leadership: 'bg-green-100 text-green-800',
      strategic: 'bg-purple-100 text-purple-800',
      behavioral: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      not_started: 'text-gray-500',
      in_progress: 'text-blue-500', 
      completed: 'text-green-500',
      overdue: 'text-red-500'
    };
    return colors[status as keyof typeof colors] || 'text-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      not_started: 'Não Iniciada',
      in_progress: 'Em Andamento', 
      completed: 'Concluída',
      overdue: 'Atrasada'
    };
    return labels[status as keyof typeof labels] || 'Não Iniciada';
  };

  const handleAddGoal = () => {
    toast.success('Meta de desenvolvimento adicionada com sucesso');
    setIsAddGoalOpen(false);
    setNewGoal({
      title: '',
      description: '',
      category: 'technical',
      priority: 'medium',
      targetDate: '',
      mentor: '',
      budget: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Profile Templates */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Planos de Desenvolvimento Individual (PDI)</h2>
          <p className="text-muted-foreground">
            Gestão completa de desenvolvimento para Herdeiros, Conselheiros e Cargos-Chave
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Trophy className="h-4 w-4 mr-2" />
                Perfis Executivos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Modelos de Perfis Executivos</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                {executiveProfiles.map((profile) => (
                  <Card key={profile.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{profile.title}</h3>
                          <p className="text-muted-foreground">{profile.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{profile.department}</Badge>
                            <Badge variant="secondary">{profile.minYearsExp}+ anos experiência</Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProfile(profile)}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Competências Principais</h4>
                          <div className="space-y-1">
                            {profile.competencies.slice(0, 3).map((comp, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <div className={`w-2 h-2 rounded-full ${getCategoryColor(comp.category).split(' ')[0]}`} />
                                <span>{comp.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {comp.level}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Certificações Requeridas</h4>
                          <div className="space-y-1">
                            {profile.certifications.slice(0, 2).map((cert, index) => (
                              <div key={index} className="text-sm text-muted-foreground">
                                • {cert}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Meta PDI
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Meta de Desenvolvimento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goalTitle">Título da Meta</Label>
                    <Input
                      id="goalTitle"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                      placeholder="Ex: MBA Executivo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goalCategory">Categoria</Label>
                    <Select onValueChange={(value: any) => setNewGoal({...newGoal, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Técnica</SelectItem>
                        <SelectItem value="leadership">Liderança</SelectItem>
                        <SelectItem value="strategic">Estratégica</SelectItem>
                        <SelectItem value="behavioral">Comportamental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="goalDescription">Descrição</Label>
                  <Textarea
                    id="goalDescription"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    placeholder="Descreva detalhadamente a meta de desenvolvimento..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="goalPriority">Prioridade</Label>
                    <Select onValueChange={(value: any) => setNewGoal({...newGoal, priority: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="goalDate">Data Alvo</Label>
                    <Input
                      id="goalDate"
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goalBudget">Orçamento (R$)</Label>
                    <Input
                      id="goalBudget"
                      type="number"
                      value={newGoal.budget}
                      onChange={(e) => setNewGoal({...newGoal, budget: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="goalMentor">Mentor/Responsável</Label>
                  <Input
                    id="goalMentor"
                    value={newGoal.mentor}
                    onChange={(e) => setNewGoal({...newGoal, mentor: e.target.value})}
                    placeholder="Nome do mentor ou responsável pelo acompanhamento"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddGoalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddGoal} disabled={!newGoal.title.trim()}>
                    Adicionar Meta
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* PDI Cards */}
      <div className="grid gap-6">
        {samplePDIs.map((pdi) => (
          <Card key={pdi.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    PDI - {pdi.personName}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {pdi.currentRole} → {pdi.targetRole}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{pdi.personCategory}</Badge>
                  <Badge variant="secondary">{pdi.goals.length} metas</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pdi.goals.map((goal) => {
                const CategoryIcon = getCategoryIcon(goal.category);
                
                return (
                  <Card key={goal.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getCategoryColor(goal.category)}`}>
                            <CategoryIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{goal.title}</h4>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge 
                                variant={goal.priority === 'high' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {goal.priority === 'high' ? 'Alta' : 
                                 goal.priority === 'medium' ? 'Média' : 'Baixa'} Prioridade
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {goal.targetDate}
                              </span>
                              {goal.mentor && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {goal.mentor}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getStatusColor(goal.status)}`}>
                            {goal.progress}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getStatusLabel(goal.status)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Progresso</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                      
                      {goal.actions.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium mb-2">Ações do Plano</h5>
                          <div className="space-y-1">
                            {goal.actions.map((action) => (
                              <div key={action.id} className="flex items-center gap-2 text-xs">
                                <div className={`w-2 h-2 rounded-full ${
                                  action.status === 'completed' ? 'bg-green-500' :
                                  action.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                                }`} />
                                <span className={
                                  action.status === 'completed' ? 'line-through text-muted-foreground' : ''
                                }>
                                  {action.title}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {action.duration}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Detailed Profile Modal */}
      {selectedProfile && (
        <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>{selectedProfile.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <p className="text-muted-foreground">{selectedProfile.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge>{selectedProfile.department}</Badge>
                  <Badge variant="outline">{selectedProfile.level}</Badge>
                  <Badge variant="secondary">{selectedProfile.minYearsExp}+ anos experiência</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Competências Requeridas</h4>
                  <div className="space-y-3">
                    {selectedProfile.competencies.map((comp, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getCategoryColor(comp.category).split(' ')[0]}`} />
                          <span className="font-medium">{comp.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{comp.level}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {(comp.weight * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Experiências Necessárias</h4>
                    <div className="space-y-1">
                      {selectedProfile.experiences.map((exp, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {exp}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Certificações</h4>
                    <div className="space-y-1">
                      {selectedProfile.certifications.map((cert, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {cert}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Idiomas</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedProfile.languages.map((lang, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PDIManagement;