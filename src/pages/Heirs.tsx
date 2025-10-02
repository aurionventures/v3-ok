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
import { User, Plus, Target, TrendingUp, AlertCircle, BookOpen, Briefcase, Heart, FileCheck, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

interface Heir {
  id: string;
  name: string;
  age: number;
  generation: string;
  currentRole: string;
  readinessScore: number;
  status: 'not_ready' | 'developing' | 'ready';
  requirements: {
    education: boolean;
    professionalExp: boolean;
    businessExp: boolean;
    familyValues: boolean;
    successionPlan: boolean;
  };
  pdi: string[];
  lastEvaluation: Date;
}

const initialHeirs: Heir[] = [
  {
    id: '1',
    name: 'Carlos Silva Jr.',
    age: 28,
    generation: '2ª Geração',
    currentRole: 'Analista Financeiro',
    readinessScore: 75,
    status: 'ready',
    requirements: {
      education: true,
      professionalExp: true,
      businessExp: true,
      familyValues: true,
      successionPlan: false
    },
    pdi: ['Curso de Governança Corporativa IBGC', 'Experiência internacional', 'Mentoria com CEO'],
    lastEvaluation: new Date(2025, 0, 15)
  },
  {
    id: '2',
    name: 'Ana Silva',
    age: 26,
    generation: '2ª Geração',
    currentRole: 'Estudante de MBA',
    readinessScore: 45,
    status: 'developing',
    requirements: {
      education: true,
      professionalExp: false,
      businessExp: false,
      familyValues: true,
      successionPlan: false
    },
    pdi: ['Estágio em empresa externa', 'Participação em projetos estratégicos', 'Curso de liderança'],
    lastEvaluation: new Date(2025, 0, 10)
  }
];

const requirements = [
  { key: 'education', label: 'Formação Acadêmica', weight: 0.20, icon: BookOpen },
  { key: 'professionalExp', label: 'Experiência Profissional', weight: 0.20, icon: Briefcase },
  { key: 'businessExp', label: 'Vivência Empresarial', weight: 0.20, icon: Target },
  { key: 'familyValues', label: 'Valores e Propósito Familiar', weight: 0.20, icon: Heart },
  { key: 'successionPlan', label: 'Plano de Sucessão', weight: 0.20, icon: FileCheck }
];

const HeirsPage = () => {
  const navigate = useNavigate();
  const [heirs, setHeirs] = useState<Heir[]>(initialHeirs);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedHeir, setSelectedHeir] = useState<Heir | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [newHeir, setNewHeir] = useState({
    name: '',
    age: '',
    generation: '',
    currentRole: '',
    requirements: {
      education: false,
      professionalExp: false,
      businessExp: false,
      familyValues: false,
      successionPlan: false
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
      case 'ready': return <Badge className="bg-green-500">Habilitado</Badge>;
      case 'developing': return <Badge className="bg-yellow-500">Em Desenvolvimento</Badge>;
      case 'not_ready': return <Badge variant="destructive">Não Habilitado</Badge>;
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

  const handleAddHeir = () => {
    const score = calculateReadinessScore(newHeir.requirements);
    const status = getStatus(score);
    
    const heir: Heir = {
      id: Date.now().toString(),
      name: newHeir.name,
      age: parseInt(newHeir.age),
      generation: newHeir.generation,
      currentRole: newHeir.currentRole,
      readinessScore: score,
      status,
      requirements: newHeir.requirements,
      pdi: [], // Will be generated by AI
      lastEvaluation: new Date()
    };

    setHeirs(prev => [...prev, heir]);
    setNewHeir({
      name: '',
      age: '',
      generation: '',
      currentRole: '',
      requirements: {
        education: false,
        professionalExp: false,
        businessExp: false,
        familyValues: false,
        successionPlan: false
      }
    });
    setIsAddDialogOpen(false);
    toast.success('Herdeiro adicionado com sucesso');
  };

  const generatePDI = (heir: Heir) => {
    const suggestions = [];
    if (!heir.requirements.education) {
      suggestions.push('Complementar formação acadêmica (MBA ou especialização)');
    }
    if (!heir.requirements.professionalExp) {
      suggestions.push('Experiência profissional em empresa externa (2-3 anos)');
    }
    if (!heir.requirements.businessExp) {
      suggestions.push('Participação em projetos estratégicos da empresa');
    }
    if (!heir.requirements.familyValues) {
      suggestions.push('Participação em rituais familiares e workshops de valores');
    }
    if (!heir.requirements.successionPlan) {
      suggestions.push('Inclusão formal no plano de sucessão familiar');
    }
    return suggestions;
  };

  const stats = {
    total: heirs.length,
    ready: heirs.filter(h => h.status === 'ready').length,
    developing: heirs.filter(h => h.status === 'developing').length,
    notReady: heirs.filter(h => h.status === 'not_ready').length,
    averageScore: heirs.length > 0 ? Math.round(heirs.reduce((sum, h) => sum + h.readinessScore, 0) / heirs.length) : 0
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header title="Gestão de Herdeiros" />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <User className="h-8 w-8" />
                  Herdeiros
                </h1>
                <p className="text-muted-foreground mt-2">
                  Avaliação da prontidão dos herdeiros para assumir a sucessão empresarial
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Herdeiro
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Cadastrar Novo Herdeiro</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          value={newHeir.name}
                          onChange={(e) => setNewHeir({...newHeir, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="age">Idade</Label>
                        <Input
                          id="age"
                          type="number"
                          value={newHeir.age}
                          onChange={(e) => setNewHeir({...newHeir, age: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="generation">Geração</Label>
                        <Select onValueChange={(value) => setNewHeir({...newHeir, generation: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a geração" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1ª Geração">1ª Geração</SelectItem>
                            <SelectItem value="2ª Geração">2ª Geração</SelectItem>
                            <SelectItem value="3ª Geração">3ª Geração</SelectItem>
                            <SelectItem value="4ª Geração">4ª Geração</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="currentRole">Papel Atual</Label>
                        <Input
                          id="currentRole"
                          value={newHeir.currentRole}
                          onChange={(e) => setNewHeir({...newHeir, currentRole: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Requisitos de Habilitação</Label>
                      {requirements.map((req) => (
                        <div key={req.key} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <input
                            type="checkbox"
                            checked={newHeir.requirements[req.key as keyof typeof newHeir.requirements]}
                            onChange={(e) => setNewHeir({
                              ...newHeir,
                              requirements: {
                                ...newHeir.requirements,
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
                      <Button onClick={handleAddHeir} disabled={!newHeir.name.trim()}>
                        Cadastrar
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
                  <div className="text-sm text-muted-foreground">Total de Herdeiros</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-500">{stats.ready}</div>
                  <div className="text-sm text-muted-foreground">Habilitados</div>
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

            {/* Heirs List */}
            <div className="grid gap-6">
              {heirs.map((heir) => (
                <Card key={heir.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{heir.name}</h3>
                          <p className="text-muted-foreground">{heir.generation} • {heir.age} anos • {heir.currentRole}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Última avaliação: {heir.lastEvaluation.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getStatusColor(heir.status)}`}>
                          {heir.readinessScore}%
                        </div>
                        {getStatusBadge(heir.status)}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Prontidão para Sucessão</span>
                          <span>{heir.readinessScore}%</span>
                        </div>
                        <Progress value={heir.readinessScore} className="h-2" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Requisitos Atendidos
                          </h4>
                          <div className="space-y-2">
                            {requirements.map((req) => (
                              <div key={req.key} className="flex items-center gap-2 text-sm">
                                <div className={`w-2 h-2 rounded-full ${
                                  heir.requirements[req.key as keyof typeof heir.requirements] 
                                    ? 'bg-green-500' 
                                    : 'bg-red-500'
                                }`} />
                                <req.icon className="h-4 w-4" />
                                <span className={
                                  heir.requirements[req.key as keyof typeof heir.requirements] 
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
                            Plano de Desenvolvimento (PDI)
                          </h4>
                          <div className="space-y-2">
                            {generatePDI(heir).length > 0 ? (
                              generatePDI(heir).map((item, index) => (
                                <div key={index} className="flex items-start gap-2 text-sm">
                                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-green-600 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Todos os requisitos atendidos
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {heirs.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum herdeiro cadastrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Comece cadastrando os herdeiros da família empresária para avaliar a prontidão para sucessão.
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Primeiro Herdeiro
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

export default HeirsPage;