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
import { Building2, Plus, Target, TrendingUp, AlertCircle, GraduationCap, Shield, Briefcase, CheckCircle, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

interface BoardMember {
  id: string;
  name: string;
  currentRole: string;
  boardType: string;
  experience: string;
  eligibilityScore: number;
  status: 'not_eligible' | 'under_review' | 'eligible';
  requirements: {
    previousExperience: boolean;
    education: boolean;
    technicalSkills: boolean;
    independence: boolean;
    valuesAlignment: boolean;
  };
  recommendations: string[];
  lastEvaluation: Date;
}

const initialMembers: BoardMember[] = [
  {
    id: '1',
    name: 'Dr. Patricia Lima',
    currentRole: 'Ex-CEO TechCorp',
    boardType: 'Conselho de Administração',
    experience: '15 anos',
    eligibilityScore: 90,
    status: 'eligible',
    requirements: {
      previousExperience: true,
      education: true,
      technicalSkills: true,
      independence: true,
      valuesAlignment: true
    },
    recommendations: ['Certificação em Governança Corporativa atualizada'],
    lastEvaluation: new Date(2025, 0, 25)
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    currentRole: 'Diretor Financeiro',
    boardType: 'Conselho Fiscal',
    experience: '8 anos',
    eligibilityScore: 55,
    status: 'under_review',
    requirements: {
      previousExperience: false,
      education: true,
      technicalSkills: true,
      independence: true,
      valuesAlignment: true
    },
    recommendations: ['Experiência em conselhos', 'Certificação em Governança Corporativa', 'Curso de governança corporativa'],
    lastEvaluation: new Date(2025, 0, 18)
  }
];

const requirements = [
  { key: 'previousExperience', label: 'Experiência Prévia em Conselhos', weight: 0.20, icon: Briefcase },
  { key: 'education', label: 'Formação e Certificações', weight: 0.20, icon: GraduationCap },
  { key: 'technicalSkills', label: 'Competências Técnicas', weight: 0.25, icon: Target },
  { key: 'independence', label: 'Independência', weight: 0.15, icon: Shield },
  { key: 'valuesAlignment', label: 'Alinhamento a Valores', weight: 0.20, icon: Heart }
];

const boardTypes = [
  'Conselho de Administração',
  'Conselho Consultivo',
  'Conselho Fiscal',
  'Conselho de Família',
  'Comitê de Auditoria',
  'Comitê de Riscos',
  'Comitê de Estratégia'
];

const BoardMembersPage = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<BoardMember[]>(initialMembers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const [newMember, setNewMember] = useState({
    name: '',
    currentRole: '',
    boardType: '',
    experience: '',
    requirements: {
      previousExperience: false,
      education: false,
      technicalSkills: false,
      independence: false,
      valuesAlignment: false
    }
  });

  const calculateEligibilityScore = (reqs: any) => {
    const totalWeight = requirements.reduce((sum, req) => sum + req.weight, 0);
    const achievedWeight = requirements.reduce((sum, req) => {
      return sum + (reqs[req.key] ? req.weight : 0);
    }, 0);
    return Math.round((achievedWeight / totalWeight) * 100);
  };

  const getStatus = (score: number): 'not_eligible' | 'under_review' | 'eligible' => {
    if (score >= 70) return 'eligible';
    if (score >= 40) return 'under_review';
    return 'not_eligible';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'eligible': return <Badge className="bg-green-500">Elegível</Badge>;
      case 'under_review': return <Badge className="bg-yellow-500">Em Avaliação</Badge>;
      case 'not_eligible': return <Badge variant="destructive">Não Elegível</Badge>;
      default: return <Badge variant="outline">Não Avaliado</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'eligible': return 'text-green-500';
      case 'under_review': return 'text-yellow-500';
      case 'not_eligible': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const handleAddMember = () => {
    const score = calculateEligibilityScore(newMember.requirements);
    const status = getStatus(score);
    
    const member: BoardMember = {
      id: Date.now().toString(),
      name: newMember.name,
      currentRole: newMember.currentRole,
      boardType: newMember.boardType,
      experience: newMember.experience,
      eligibilityScore: score,
      status,
      requirements: newMember.requirements,
      recommendations: [], // Will be generated by AI
      lastEvaluation: new Date()
    };

    setMembers(prev => [...prev, member]);
    setNewMember({
      name: '',
      currentRole: '',
      boardType: '',
      experience: '',
      requirements: {
        previousExperience: false,
        education: false,
        technicalSkills: false,
        independence: false,
        valuesAlignment: false
      }
    });
    setIsAddDialogOpen(false);
    toast.success('Conselheiro avaliado com sucesso');
  };

  const generateRecommendations = (member: BoardMember) => {
    const suggestions = [];
    if (!member.requirements.previousExperience) {
      suggestions.push('Experiência em conselhos de outras empresas');
    }
    if (!member.requirements.education) {
      suggestions.push('Certificação em Governança Corporativa ou equivalente');
    }
    if (!member.requirements.technicalSkills) {
      suggestions.push('Especialização em áreas críticas (finanças, estratégia, ESG)');
    }
    if (!member.requirements.independence) {
      suggestions.push('Avaliação de potenciais conflitos de interesse');
    }
    if (!member.requirements.valuesAlignment) {
      suggestions.push('Workshop de imersão nos valores da empresa');
    }
    return suggestions;
  };

  const stats = {
    total: members.length,
    eligible: members.filter(m => m.status === 'eligible').length,
    underReview: members.filter(m => m.status === 'under_review').length,
    notEligible: members.filter(m => m.status === 'not_eligible').length,
    averageScore: members.length > 0 ? Math.round(members.reduce((sum, m) => sum + m.eligibilityScore, 0) / members.length) : 0
  };

  const groupedByBoardType = members.reduce((acc, member) => {
    if (!acc[member.boardType]) {
      acc[member.boardType] = [];
    }
    acc[member.boardType].push(member);
    return acc;
  }, {} as Record<string, BoardMember[]>);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header title="Conselheiros" />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Building2 className="h-8 w-8" />
                  Conselheiros
                </h1>
                <p className="text-muted-foreground mt-2">
                  Avaliação da aderência técnica e cultural para integrar conselhos
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Avaliar Conselheiro
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Avaliar Novo Conselheiro</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          value={newMember.name}
                          onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="currentRole">Cargo/Função Atual</Label>
                        <Input
                          id="currentRole"
                          value={newMember.currentRole}
                          onChange={(e) => setNewMember({...newMember, currentRole: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="boardType">Tipo de Conselho</Label>
                        <Select onValueChange={(value) => setNewMember({...newMember, boardType: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {boardTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="experience">Experiência</Label>
                        <Input
                          id="experience"
                          placeholder="ex: 5 anos"
                          value={newMember.experience}
                          onChange={(e) => setNewMember({...newMember, experience: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Critérios de Elegibilidade</Label>
                      {requirements.map((req) => (
                        <div key={req.key} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <input
                            type="checkbox"
                            checked={newMember.requirements[req.key as keyof typeof newMember.requirements]}
                            onChange={(e) => setNewMember({
                              ...newMember,
                              requirements: {
                                ...newMember.requirements,
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
                      <Button onClick={handleAddMember} disabled={!newMember.name.trim()}>
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
                  <div className="text-sm text-muted-foreground">Conselheiros Avaliados</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-500">{stats.eligible}</div>
                  <div className="text-sm text-muted-foreground">Elegíveis</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-500">{stats.underReview}</div>
                  <div className="text-sm text-muted-foreground">Em Avaliação</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-500">{stats.averageScore}%</div>
                  <div className="text-sm text-muted-foreground">Score Médio</div>
                </CardContent>
              </Card>
            </div>

            {/* Members by Board Type */}
            <div className="space-y-6">
              {Object.entries(groupedByBoardType).map(([boardType, boardMembers]) => (
                <Card key={boardType}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {boardType}
                      <Badge variant="outline" className="ml-auto">
                        {boardMembers.length} {boardMembers.length === 1 ? 'membro' : 'membros'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {boardMembers.map((member) => (
                        <div key={member.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{member.name}</h3>
                              <p className="text-muted-foreground">
                                {member.currentRole} • {member.experience} de experiência
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Última avaliação: {member.lastEvaluation.toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className={`text-xl font-bold ${getStatusColor(member.status)}`}>
                                {member.eligibilityScore}%
                              </div>
                              {getStatusBadge(member.status)}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Elegibilidade para {boardType}</span>
                                <span>{member.eligibilityScore}%</span>
                              </div>
                              <Progress value={member.eligibilityScore} className="h-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <Target className="h-4 w-4" />
                                  Critérios Atendidos
                                </h4>
                                <div className="space-y-2">
                                  {requirements.map((req) => (
                                    <div key={req.key} className="flex items-center gap-2 text-sm">
                                      <div className={`w-2 h-2 rounded-full ${
                                        member.requirements[req.key as keyof typeof member.requirements] 
                                          ? 'bg-green-500' 
                                          : 'bg-red-500'
                                      }`} />
                                      <req.icon className="h-4 w-4" />
                                      <span className={
                                        member.requirements[req.key as keyof typeof member.requirements] 
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
                                  Recomendações
                                </h4>
                                <div className="space-y-2">
                                  {generateRecommendations(member).length > 0 ? (
                                    generateRecommendations(member).map((item, index) => (
                                      <div key={index} className="flex items-start gap-2 text-sm">
                                        <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span>{item}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-green-600 flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4" />
                                      Elegível para o conselho
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

            {members.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum conselheiro avaliado</h3>
                  <p className="text-muted-foreground mb-4">
                    Comece avaliando potenciais conselheiros para os órgãos de governança.
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Avaliar Primeiro Conselheiro
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

export default BoardMembersPage;