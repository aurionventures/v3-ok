import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, Crown, Award, TrendingUp, AlertCircle, Plus, 
  GraduationCap, BarChart3, Heart, Target, Trophy, 
  UserCheck, UserPlus, Clock, Star
} from 'lucide-react';
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import PDIManagement from '@/components/PDIManagement';
import { CriteriaManager } from '@/components/CriteriaManager';
import { CustomCriterion, CriteriaProgress } from '@/types/criteria';
import { criteriaByCategory } from '@/data/criteriaData';

// Unified Person interface
interface Person {
  id: string;
  name: string;
  category: 'heir' | 'board_member' | 'key_position' | 'development';
  currentRole: string;
  targetRole?: string;
  age?: number;
  department?: string;
  readinessScore: number;
  status: 'ready' | 'developing' | 'not_ready' | 'eligible' | 'under_review' | 'not_eligible';
  requirements: Record<string, boolean>;
  customCriteria?: CustomCriterion[];
  criteriaProgress?: CriteriaProgress;
  developmentPlan: string[];
  lastEvaluation: Date;
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
}

// Unified requirements system
const requirementCategories = {
  succession: [
    { key: 'education', label: 'Formação Acadêmica', weight: 0.15, icon: GraduationCap },
    { key: 'leadership', label: 'Experiência de Liderança', weight: 0.25, icon: Trophy },
    { key: 'business', label: 'Conhecimento do Negócio', weight: 0.20, icon: BarChart3 },
    { key: 'vision', label: 'Visão Estratégica', weight: 0.20, icon: Target },
    { key: 'family', label: 'Alinhamento Familiar', weight: 0.20, icon: Heart }
  ],
  board: [
    { key: 'governance', label: 'Experiência em Governança', weight: 0.30, icon: Award },
    { key: 'independence', label: 'Independência', weight: 0.20, icon: UserCheck },
    { key: 'expertise', label: 'Expertise Setorial', weight: 0.25, icon: GraduationCap },
    { key: 'time', label: 'Disponibilidade de Tempo', weight: 0.15, icon: Clock },
    { key: 'ethics', label: 'Integridade e Ética', weight: 0.10, icon: Heart }
  ],
  management: [
    { key: 'education', label: 'Formação e Certificações', weight: 0.20, icon: GraduationCap },
    { key: 'managementExp', label: 'Experiência de Gestão', weight: 0.25, icon: Users },
    { key: 'leadership', label: 'Liderança e Soft Skills', weight: 0.20, icon: Trophy },
    { key: 'results', label: 'Resultados Entregues', weight: 0.20, icon: BarChart3 },
    { key: 'culturalFit', label: 'Alinhamento Cultural', weight: 0.15, icon: Heart }
  ]
};

// Sample unified data
const initialPeople: Person[] = [
  {
    id: '1',
    name: 'Ana Silva',
    category: 'heir',
    currentRole: 'Gerente Regional',
    targetRole: 'CEO',
    age: 28,
    readinessScore: 75,
    status: 'developing',
    requirements: { education: true, leadership: true, business: false, vision: true, family: true },
    developmentPlan: ['MBA Executivo', 'Experiência internacional', 'Mentoring com CEO atual'],
    lastEvaluation: new Date(2025, 0, 20),
    priority: 'high'
  },
  {
    id: '2',
    name: 'Dr. Carlos Mendoza',
    category: 'board_member',
    currentRole: 'Conselheiro Independente',
    readinessScore: 90,
    status: 'eligible',
    requirements: { governance: true, independence: true, expertise: true, time: true, ethics: true },
    developmentPlan: [],
    lastEvaluation: new Date(2025, 0, 15),
    priority: 'high'
  },
  {
    id: '3',
    name: 'Maria Santos',
    category: 'key_position',
    currentRole: 'Gerente Financeira',
    targetRole: 'CFO',
    department: 'Financeiro',
    readinessScore: 85,
    status: 'ready',
    requirements: { education: true, managementExp: true, leadership: true, results: true, culturalFit: true },
    developmentPlan: ['Certificação CFA', 'Curso de Relações com Investidores'],
    lastEvaluation: new Date(2025, 0, 20),
    priority: 'medium'
  }
];

const PeopleManagementPage = () => {
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  
  const [newPerson, setNewPerson] = useState({
    name: '',
    category: 'heir' as const,
    currentRole: '',
    targetRole: '',
    age: '',
    department: '',
    requirements: {} as Record<string, boolean>,
    customCriteria: [] as CustomCriterion[]
  });

  // Calculations
  const calculateReadinessScore = (requirements: Record<string, boolean>, category: string) => {
    const categoryReqs = requirementCategories[category as keyof typeof requirementCategories] || requirementCategories.succession;
    const totalWeight = categoryReqs.reduce((sum, req) => sum + req.weight, 0);
    const achievedWeight = categoryReqs.reduce((sum, req) => {
      return sum + (requirements[req.key] ? req.weight : 0);
    }, 0);
    return Math.round((achievedWeight / totalWeight) * 100);
  };

  const getStatus = (score: number, category: string): Person['status'] => {
    if (category === 'board_member') {
      if (score >= 80) return 'eligible';
      if (score >= 60) return 'under_review';
      return 'not_eligible';
    }
    if (score >= 70) return 'ready';
    if (score >= 40) return 'developing';
    return 'not_ready';
  };

  const getStatusBadge = (status: Person['status']) => {
    const statusConfig = {
      ready: { label: 'Pronto', className: 'bg-green-500 text-white' },
      developing: { label: 'Em Desenvolvimento', className: 'bg-yellow-500 text-white' },
      not_ready: { label: 'Não Pronto', className: 'bg-red-500 text-white' },
      eligible: { label: 'Elegível', className: 'bg-green-500 text-white' },
      under_review: { label: 'Em Análise', className: 'bg-yellow-500 text-white' },
      not_eligible: { label: 'Não Elegível', className: 'bg-red-500 text-white' }
    };
    
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusColor = (status: Person['status']) => {
    const colors = {
      ready: 'text-green-500',
      developing: 'text-yellow-500',
      not_ready: 'text-red-500',
      eligible: 'text-green-500',
      under_review: 'text-yellow-500',
      not_eligible: 'text-red-500'
    };
    return colors[status];
  };

  const getCategoryIcon = (category: Person['category']) => {
    const icons = {
      heir: Crown,
      board_member: Award,
      key_position: Target,
      development: TrendingUp
    };
    return icons[category];
  };

  const getCategoryLabel = (category: Person['category']) => {
    const labels = {
      heir: 'Herdeiro/Sucessor',
      board_member: 'Conselheiro',
      key_position: 'Cargo-Chave',
      development: 'Desenvolvimento'
    };
    return labels[category];
  };

  // Filter people by category
  const filteredPeople = selectedCategory === 'all' 
    ? people 
    : people.filter(p => p.category === selectedCategory);

  // Statistics
  const stats = {
    total: people.length,
    heirs: people.filter(p => p.category === 'heir').length,
    boardMembers: people.filter(p => p.category === 'board_member').length,
    keyPositions: people.filter(p => p.category === 'key_position').length,
    ready: people.filter(p => ['ready', 'eligible'].includes(p.status)).length,
    developing: people.filter(p => ['developing', 'under_review'].includes(p.status)).length,
    averageScore: people.length > 0 ? Math.round(people.reduce((sum, p) => sum + p.readinessScore, 0) / people.length) : 0
  };

  const handleAddPerson = () => {
    const score = calculateReadinessScore(newPerson.requirements, newPerson.category);
    const status = getStatus(score, newPerson.category);
    
    // Calculate criteria progress
    const standardCriteria = criteriaByCategory[newPerson.category] || [];
    const standardCompleted = Object.values(newPerson.requirements).filter(Boolean).length;
    const customCompleted = newPerson.customCriteria.filter(c => c.completed).length;
    const totalCriteria = standardCriteria.length + newPerson.customCriteria.length;
    const totalCompleted = standardCompleted + customCompleted;
    
    const criteriaProgress: CriteriaProgress = {
      total: totalCriteria,
      completed: totalCompleted,
      percentage: totalCriteria > 0 ? Math.round((totalCompleted / totalCriteria) * 100) : 0,
      standardCompleted,
      customCompleted
    };
    
    const person: Person = {
      id: Date.now().toString(),
      name: newPerson.name,
      category: newPerson.category,
      currentRole: newPerson.currentRole,
      targetRole: newPerson.targetRole || undefined,
      age: newPerson.age ? parseInt(newPerson.age) : undefined,
      department: newPerson.department || undefined,
      readinessScore: score,
      status,
      requirements: newPerson.requirements,
      customCriteria: newPerson.customCriteria.length > 0 ? newPerson.customCriteria : undefined,
      criteriaProgress,
      developmentPlan: [],
      lastEvaluation: new Date(),
      priority: 'medium'
    };

    setPeople(prev => [...prev, person]);
    setNewPerson({
      name: '',
      category: 'heir',
      currentRole: '',
      targetRole: '',
      age: '',
      department: '',
      requirements: {},
      customCriteria: []
    });
    setIsAddDialogOpen(false);
    toast.success('Pessoa adicionada com sucesso');
  };

  const getRisksAndPriorities = () => {
    const highRiskSuccession = people.filter(p => 
      p.category === 'heir' && p.status === 'not_ready'
    );
    
    const boardGaps = people.filter(p => 
      p.category === 'board_member' && p.status === 'not_eligible'
    );

    const keyPositionGaps = people.filter(p => 
      p.category === 'key_position' && p.status === 'not_ready'
    );

    return { highRiskSuccession, boardGaps, keyPositionGaps };
  };

  const { highRiskSuccession, boardGaps, keyPositionGaps } = getRisksAndPriorities();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header title="Gestão de Pessoas & Governança" />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Users className="h-8 w-8" />
                  Gestão de Pessoas & Governança
                </h1>
                <p className="text-muted-foreground mt-2">
                  Plataforma unificada para sucessão, conselhos e desenvolvimento de talentos
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Pessoa
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Pessoa</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Basic Information Section */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Dados Básicos
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nome Completo *</Label>
                          <Input
                            id="name"
                            placeholder="Digite o nome completo"
                            value={newPerson.name}
                            onChange={(e) => setNewPerson({...newPerson, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Categoria *</Label>
                          <Select onValueChange={(value: any) => setNewPerson({...newPerson, category: value, requirements: {}, customCriteria: []})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="heir">Herdeiro/Sucessor</SelectItem>
                              <SelectItem value="board_member">Conselheiro</SelectItem>
                              <SelectItem value="key_position">Cargo-Chave</SelectItem>
                              <SelectItem value="development">Desenvolvimento</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="currentRole">Cargo Atual *</Label>
                          <Input
                            id="currentRole"
                            placeholder="Cargo atual"
                            value={newPerson.currentRole}
                            onChange={(e) => setNewPerson({...newPerson, currentRole: e.target.value})}
                          />
                        </div>
                        {!['board_member'].includes(newPerson.category) && (
                          <div>
                            <Label htmlFor="targetRole">Cargo Alvo</Label>
                            <Input
                              id="targetRole"
                              placeholder="Cargo desejado"
                              value={newPerson.targetRole}
                              onChange={(e) => setNewPerson({...newPerson, targetRole: e.target.value})}
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="age">Idade</Label>
                          <Input
                            id="age"
                            type="number"
                            placeholder="Idade"
                            value={newPerson.age}
                            onChange={(e) => setNewPerson({...newPerson, age: e.target.value})}
                          />
                        </div>
                        {['key_position', 'development'].includes(newPerson.category) && (
                          <div>
                            <Label htmlFor="department">Departamento</Label>
                            <Input
                              id="department"
                              placeholder="Departamento"
                              value={newPerson.department}
                              onChange={(e) => setNewPerson({...newPerson, department: e.target.value})}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Criteria Management Section */}
                    {newPerson.category && criteriaByCategory[newPerson.category] && (
                      <CriteriaManager
                        categoryKey={newPerson.category}
                        standardCriteria={criteriaByCategory[newPerson.category]}
                        selectedStandardCriteria={newPerson.requirements}
                        customCriteria={newPerson.customCriteria}
                        onStandardChange={(key, value) => {
                          setNewPerson({
                            ...newPerson,
                            requirements: {
                              ...newPerson.requirements,
                              [key]: value
                            }
                          });
                        }}
                        onCustomAdd={(criterion) => {
                          const newCriterion: CustomCriterion = {
                            ...criterion,
                            id: Date.now().toString(),
                            createdAt: new Date()
                          };
                          setNewPerson({
                            ...newPerson,
                            customCriteria: [...newPerson.customCriteria, newCriterion]
                          });
                        }}
                        onCustomUpdate={(id, updates) => {
                          setNewPerson({
                            ...newPerson,
                            customCriteria: newPerson.customCriteria.map(c =>
                              c.id === id ? { ...c, ...updates } : c
                            )
                          });
                        }}
                        onCustomRemove={(id) => {
                          setNewPerson({
                            ...newPerson,
                            customCriteria: newPerson.customCriteria.filter(c => c.id !== id)
                          });
                        }}
                      />
                    )}

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddPerson} disabled={!newPerson.name.trim() || !newPerson.category}>
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-500">{stats.heirs}</div>
                  <div className="text-sm text-muted-foreground">Herdeiros</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-500">{stats.boardMembers}</div>
                  <div className="text-sm text-muted-foreground">Conselheiros</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-500">{stats.keyPositions}</div>
                  <div className="text-sm text-muted-foreground">Cargos-Chave</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-500">{stats.ready}</div>
                  <div className="text-sm text-muted-foreground">Prontos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-500">{stats.developing}</div>
                  <div className="text-sm text-muted-foreground">Desenvolvendo</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{stats.averageScore}%</div>
                  <div className="text-sm text-muted-foreground">Score Médio</div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Alerts */}
            {(highRiskSuccession.length > 0 || boardGaps.length > 0 || keyPositionGaps.length > 0) && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    Alertas de Risco
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {highRiskSuccession.length > 0 && (
                      <div className="text-red-600">
                        • {highRiskSuccession.length} sucessor(es) não pronto(s) para liderança
                      </div>
                    )}
                    {boardGaps.length > 0 && (
                      <div className="text-red-600">
                        • {boardGaps.length} gap(s) crítico(s) no conselho
                      </div>
                    )}
                    {keyPositionGaps.length > 0 && (
                      <div className="text-red-600">
                        • {keyPositionGaps.length} cargo(s)-chave sem cobertura adequada
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Content */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="heir">Herdeiros</TabsTrigger>
                <TabsTrigger value="board_member">Conselheiros</TabsTrigger>
                <TabsTrigger value="key_position">Cargos-Chave</TabsTrigger>
                <TabsTrigger value="development">Desenvolvimento</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedCategory} className="space-y-4">
                {selectedCategory === 'development' ? (
                  <PDIManagement />
                ) : filteredPeople.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Nenhuma pessoa cadastrada</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Comece adicionando pessoas para gerenciar seu pipeline de talentos
                      </p>
                      <Button onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Primeira Pessoa
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredPeople.map((person) => {
                      const CategoryIcon = getCategoryIcon(person.category);
                      const categoryReqs = requirementCategories[person.category as keyof typeof requirementCategories] || [];
                      
                      return (
                        <Card key={person.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start gap-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <CategoryIcon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold">{person.name}</h3>
                                  <p className="text-muted-foreground">
                                    {person.currentRole}
                                    {person.targetRole && ` → ${person.targetRole}`}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline">{getCategoryLabel(person.category)}</Badge>
                                    {person.priority && (
                                      <Badge variant={person.priority === 'high' ? 'destructive' : 'secondary'}>
                                        {person.priority === 'high' ? 'Alta Prioridade' : 'Prioridade Média'}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-2xl font-bold ${getStatusColor(person.status)}`}>
                                  {person.readinessScore}%
                                </div>
                                {getStatusBadge(person.status)}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span>Prontidão Geral</span>
                                  <span>{person.readinessScore}%</span>
                                </div>
                                <Progress value={person.readinessScore} className="h-2" />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Target className="h-4 w-4" />
                                    Critérios Atendidos
                                  </h4>
                                  <div className="space-y-2">
                                    {categoryReqs.map((req) => (
                                      <div key={req.key} className="flex items-center gap-2 text-sm">
                                        <div className={`w-2 h-2 rounded-full ${
                                          person.requirements[req.key] ? 'bg-green-500' : 'bg-red-500'
                                        }`} />
                                        <req.icon className="h-4 w-4" />
                                        <span className={
                                          person.requirements[req.key] ? 'text-foreground' : 'text-muted-foreground'
                                        }>
                                          {req.label}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {person.developmentPlan.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                      <TrendingUp className="h-4 w-4" />
                                      Plano de Desenvolvimento
                                    </h4>
                                    <div className="space-y-1">
                                      {person.developmentPlan.map((item, index) => (
                                        <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                          <Star className="h-3 w-3" />
                                          {item}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PeopleManagementPage;