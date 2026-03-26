import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ClipboardCheck, 
  Clock, 
  Play, 
  CheckCircle, 
  AlertCircle,
  Users,
  FileText,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MOCK_ASSESSMENTS = [
  {
    id: 'assessment_1',
    client: 'TechCorp Soluções',
    type: 'IBGC - Governança Corporativa',
    status: 'Concluído',
    progress: 100,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-30'),
    score: 75,
    questions: 45,
    answeredQuestions: 45,
    categories: ['Estrutura', 'Processos', 'Compliance', 'Transparência']
  },
  {
    id: 'assessment_2',
    client: 'InvestPro Capital',
    type: 'ESG - Sustentabilidade',
    status: 'Em Andamento',
    progress: 60,
    startDate: new Date('2024-02-01'),
    endDate: null,
    score: null,
    questions: 38,
    answeredQuestions: 23,
    categories: ['Ambiental', 'Social', 'Governança']
  },
  {
    id: 'assessment_3',
    client: 'MedLife Hospitais',
    type: 'IBGC - Governança Corporativa',
    status: 'Agendado',
    progress: 0,
    startDate: new Date('2024-02-20'),
    endDate: null,
    score: null,
    questions: 45,
    answeredQuestions: 0,
    categories: ['Estrutura', 'Processos', 'Compliance', 'Transparência']
  }
];

export const ParceiroAssessments = () => {
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const { toast } = useToast();

  const handleStartAssessment = (assessmentId: string) => {
    toast({
      title: 'Assessment Iniciado',
      description: 'O cliente receberá as instruções por email.',
    });
  };

  const handleViewResults = (assessmentId: string) => {
    toast({
      title: 'Visualizar Resultados',
      description: 'Abrindo relatório detalhado do assessment.',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Concluído': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Em Andamento': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Agendado': return <Calendar className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído': return 'bg-green-100 text-green-800';
      case 'Em Andamento': return 'bg-yellow-100 text-yellow-800';
      case 'Agendado': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredAssessments = selectedFilter === 'todos' 
    ? MOCK_ASSESSMENTS 
    : MOCK_ASSESSMENTS.filter(a => a.status.toLowerCase() === selectedFilter);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assessments e Diagnósticos</h1>
            <p className="text-muted-foreground">
              Acompanhe o progresso dos assessments e análise os resultados
            </p>
          </div>
          <Button onClick={() => toast({ title: 'Novo Assessment', description: 'Funcionalidade será implementada' })}>
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Novo Assessment
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Assessments</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{MOCK_ASSESSMENTS.length}</div>
              <p className="text-xs text-muted-foreground">+1 neste mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {MOCK_ASSESSMENTS.filter(a => a.status === 'Concluído').length}
              </div>
              <p className="text-xs text-muted-foreground">Score médio: 75%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {MOCK_ASSESSMENTS.filter(a => a.status === 'Em Andamento').length}
              </div>
              <p className="text-xs text-muted-foreground">60% de progresso médio</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((MOCK_ASSESSMENTS.filter(a => a.status === 'Concluído').length / MOCK_ASSESSMENTS.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">+15% vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'todos', label: 'Todos' },
            { key: 'concluído', label: 'Concluídos' },
            { key: 'em andamento', label: 'Em Andamento' },
            { key: 'agendado', label: 'Agendados' }
          ].map(filter => (
            <Button
              key={filter.key}
              variant={selectedFilter === filter.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter.key)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Assessments List */}
        <div className="space-y-4">
          {filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{assessment.client}</h3>
                      <Badge className={getStatusColor(assessment.status)}>
                        {getStatusIcon(assessment.status)}
                        <span className="ml-1">{assessment.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{assessment.type}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Início: {assessment.startDate.toLocaleDateString('pt-BR')}</span>
                      {assessment.endDate && (
                        <span>Conclusão: {assessment.endDate.toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {assessment.status === 'Agendado' && (
                      <Button
                        size="sm"
                        onClick={() => handleStartAssessment(assessment.id)}
                      >
                        <Play className="mr-1 h-3 w-3" />
                        Iniciar
                      </Button>
                    )}
                    {assessment.status === 'Concluído' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewResults(assessment.id)}
                      >
                        <FileText className="mr-1 h-3 w-3" />
                        Ver Resultados
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Progresso</div>
                    <Progress value={assessment.progress} className="h-2 mb-1" />
                    <div className="text-xs text-muted-foreground">
                      {assessment.answeredQuestions}/{assessment.questions} questões respondidas
                    </div>
                  </div>

                  {assessment.score !== null && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Score Final</div>
                      <div className={`text-2xl font-bold ${getScoreColor(assessment.score)}`}>
                        {assessment.score}%
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Categorias Avaliadas</div>
                    <div className="flex flex-wrap gap-1">
                      {assessment.categories.map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAssessments.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <ClipboardCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum assessment encontrado para o filtro selecionado.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};