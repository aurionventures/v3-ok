import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Award, Plus, Target, TrendingUp, AlertCircle, GraduationCap, Users2, Trophy, BarChart3, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

interface KeyPosition {
  id: string;
  name: string;
  currentPosition: string;
  targetPosition: string;
  department: string;
  readinessScore: number;
  status: 'not_ready' | 'developing' | 'ready';
  requirements: {
    education: boolean;
    managementExp: boolean;
    leadership: boolean;
    results: boolean;
    culturalFit: boolean;
  };
  pdi: string[];
  lastEvaluation: Date;
}

const initialPositions: KeyPosition[] = [
  {
    id: '1',
    name: 'Maria Santos',
    currentPosition: 'Gerente Financeira',
    targetPosition: 'CFO',
    department: 'Financeiro',
    readinessScore: 85,
    status: 'ready',
    requirements: {
      education: true,
      managementExp: true,
      leadership: true,
      results: true,
      culturalFit: true
    },
    pdi: ['Certificação CFA', 'Curso de Relações com Investidores'],
    lastEvaluation: new Date(2025, 0, 20)
  },
  {
    id: '2',
    name: 'João Oliveira',
    currentPosition: 'Coordenador de TI',
    targetPosition: 'CTO',
    department: 'Tecnologia',
    readinessScore: 55,
    status: 'developing',
    requirements: {
      education: true,
      managementExp: false,
      leadership: true,
      results: true,
      culturalFit: true
    },
    pdi: ['MBA Executivo', 'Experiência em gestão de equipes grandes', 'Certificação em cloud'],
    lastEvaluation: new Date(2025, 0, 15)
  }
];

const requirements = [
  { key: 'education', label: 'Formação e Certificações', weight: 0.20, icon: GraduationCap },
  { key: 'managementExp', label: 'Experiência de Gestão', weight: 0.25, icon: Users2 },
  { key: 'leadership', label: 'Liderança e Soft Skills', weight: 0.20, icon: Trophy },
  { key: 'results', label: 'Resultados Entregues', weight: 0.20, icon: BarChart3 },
  { key: 'culturalFit', label: 'Alinhamento Cultural', weight: 0.15, icon: Heart }
];

const positionTypes = [
  'CEO', 'CFO', 'CTO', 'COO', 'CHRO', 'CMO', 'Diretor Comercial', 
  'Diretor de Operações', 'Diretor de Marketing', 'Gerente Geral', 'Gerente Regional'
];

const KeyPositionsPage = () => {
  const navigate = useNavigate();
  const [positions, setPositions] = useState<KeyPosition[]>(initialPositions);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<KeyPosition | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const [newPosition, setNewPosition] = useState({
    name: '',
    currentPosition: '',
    targetPosition: '',
    department: '',
    requirements: {
      education: false,
      managementExp: false,
      leadership: false,
      results: false,
      culturalFit: false
    }
  });

  const calculateReadinessScore = (reqs: any) => {
    const totalWeight = requirements.reduce((sum, req) => sum + req.weight, 0);
    const achievedWeight = requirements.reduce((sum, req) => {
      return sum + (reqs[req.key] ? req.weight : 0);
    }, 0);
    return Math.round((achievedWeight / totalWeight) * 100);
  };

  const getStatus = (score: number): 'not_ready' | 'developing' | 'ready' => {
    if (score >= 70) return 'ready';
    if (score >= 40) return 'developing';
    return 'not_ready';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready': return <Badge className="bg-green-500">Pronto</Badge>;
      case 'developing': return <Badge className="bg-yellow-500">Em Desenvolvimento</Badge>;
      case 'not_ready': return <Badge variant="destructive">Não Pronto</Badge>;
      default: return <Badge variant="outline">Não Avaliado</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-500';
      case 'developing': return 'text-yellow-500';
      case 'not_ready': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const handleAddPosition = () => {
    const score = calculateReadinessScore(newPosition.requirements);
    const status = getStatus(score);
    
    const position: KeyPosition = {
      id: Date.now().toString(),
      name: newPosition.name,
      currentPosition: newPosition.currentPosition,
      targetPosition: newPosition.targetPosition,
      department: newPosition.department,
      readinessScore: score,
      status,
      requirements: newPosition.requirements,
      pdi: [], // Will be generated by AI
      lastEvaluation: new Date()
    };

    setPositions(prev => [...prev, position]);
    setNewPosition({
      name: '',
      currentPosition: '',
      targetPosition: '',
      department: '',
      requirements: {
        education: false,
        managementExp: false,
        leadership: false,
        results: false,
        culturalFit: false
      }
    });
    setIsAddDialogOpen(false);
    toast.success('Cargo-chave adicionado com sucesso');
  };

  const generatePDI = (position: KeyPosition) => {
    const suggestions = [];
    if (!position.requirements.education) {
      suggestions.push('MBA Executivo ou especialização na área');
    }
    if (!position.requirements.managementExp) {
      suggestions.push('Experiência em gestão de equipes multifuncionais');
    }
    if (!position.requirements.leadership) {
      suggestions.push('Programa de desenvolvimento de liderança');
    }
    if (!position.requirements.results) {
      suggestions.push('Definir e entregar projetos com resultados mensuráveis');
    }
    if (!position.requirements.culturalFit) {
      suggestions.push('Mentoring com lideranças seniores da empresa');
    }
    return suggestions;
  };

  const stats = {
    total: positions.length,
    ready: positions.filter(p => p.status === 'ready').length,
    developing: positions.filter(p => p.status === 'developing').length,
    notReady: positions.filter(p => p.status === 'not_ready').length,
    averageScore: positions.length > 0 ? Math.round(positions.reduce((sum, p) => sum + p.readinessScore, 0) / positions.length) : 0
  };

  const groupedByDepartment = positions.reduce((acc, position) => {
    if (!acc[position.department]) {
      acc[position.department] = [];
    }
    acc[position.department].push(position);
    return acc;
  }, {} as Record<string, KeyPosition[]>);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header title="Cargos-Chave" />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Award className="h-8 w-8" />
                  Cargos-Chave
                </h1>
                <p className="text-muted-foreground mt-2">
                  Avaliação da habilitação para cargos de gestão e liderança
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Avaliar Profissional
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Avaliar Novo Profissional</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          value={newPosition.name}
                          onChange={(e) => setNewPosition({...newPosition, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Departamento</Label>
                        <Input
                          id="department"
                          value={newPosition.department}
                          onChange={(e) => setNewPosition({...newPosition, department: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="currentPosition">Cargo Atual</Label>
                        <Input
                          id="currentPosition"
                          value={newPosition.currentPosition}
                          onChange={(e) => setNewPosition({...newPosition, currentPosition: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="targetPosition">Cargo Alvo</Label>
                        <Select onValueChange={(value) => setNewPosition({...newPosition, targetPosition: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o cargo alvo" />
                          </SelectTrigger>
                          <SelectContent>
                            {positionTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Requisitos de Habilitação</Label>
                      {requirements.map((req) => (
                        <div key={req.key} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <input
                            type="checkbox"
                            checked={newPosition.requirements[req.key as keyof typeof newPosition.requirements]}
                            onChange={(e) => setNewPosition({
                              ...newPosition,
                              requirements: {
                                ...newPosition.requirements,
                                [req.key]: e.target.checked
                              }
                            })}
                            className="h-4 w-4"
                          />
                          <req.icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{req.label}</div>
                            <div className="text-sm text-muted-foreground">Peso: {(req.weight * 100).toFixed(0)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddPosition} disabled={!newPosition.name.trim()}>
                        Avaliar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Profissionais Avaliados</div>
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
                  <div className="text-sm text-muted-foreground">Em Desenvolvimento</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-500">{stats.averageScore}%</div>
                  <div className="text-sm text-muted-foreground">Score Médio</div>
                </CardContent>
              </Card>
            </div>

            {/* Positions by Department */}
            <div className="space-y-6">
              {Object.entries(groupedByDepartment).map(([department, departmentPositions]) => (
                <Card key={department}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {department}
                      <Badge variant="outline" className="ml-auto">
                        {departmentPositions.length} {departmentPositions.length === 1 ? 'profissional' : 'profissionais'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {departmentPositions.map((position) => (
                        <div key={position.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{position.name}</h3>
                              <p className="text-muted-foreground">
                                {position.currentPosition} → {position.targetPosition}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Última avaliação: {position.lastEvaluation.toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className={`text-xl font-bold ${getStatusColor(position.status)}`}>
                                {position.readinessScore}%
                              </div>
                              {getStatusBadge(position.status)}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Prontidão para {position.targetPosition}</span>
                                <span>{position.readinessScore}%</span>
                              </div>
                              <Progress value={position.readinessScore} className="h-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <Target className="h-4 w-4" />
                                  Competências Atendidas
                                </h4>
                                <div className="space-y-2">
                                  {requirements.map((req) => (
                                    <div key={req.key} className="flex items-center gap-2 text-sm">
                                      <div className={`w-2 h-2 rounded-full ${
                                        position.requirements[req.key as keyof typeof position.requirements] 
                                          ? 'bg-green-500' 
                                          : 'bg-red-500'
                                      }`} />
                                      <req.icon className="h-4 w-4" />
                                      <span className={
                                        position.requirements[req.key as keyof typeof position.requirements] 
                                          ? 'text-foreground' 
                                          : 'text-muted-foreground'
                                      }>
                                        {req.label}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4" />
                                  Plano de Desenvolvimento
                                </h4>
                                <div className="space-y-2">
                                  {generatePDI(position).length > 0 ? (
                                    generatePDI(position).map((item, index) => (
                                      <div key={index} className="flex items-start gap-2 text-sm">
                                        <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span>{item}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-green-600 flex items-center gap-2">
                                      <Trophy className="h-4 w-4" />
                                      Pronto para assumir o cargo
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {positions.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum profissional avaliado</h3>
                  <p className="text-muted-foreground mb-4">
                    Comece avaliando profissionais para cargos-chave da empresa.
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Avaliar Primeiro Profissional
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Back Button */}
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => navigate('/people-governance')}>
                Voltar para Gestão de Pessoas & Governança
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KeyPositionsPage;