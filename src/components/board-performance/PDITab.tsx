import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sparkles,
  Wand2,
  Target,
  Flag,
  ListChecks,
  GraduationCap,
  Users,
  BookOpen,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useMemberPDI } from '@/hooks/useBoardPerformance360';
import { 
  PDI_ACTION_TYPE_LABELS,
  PDI_STATUS_LABELS 
} from '@/types/boardPerformance';
import type { 
  CompetencyGap, 
  DevelopmentGoal, 
  PDIAction,
  RecommendedCourse,
  RecommendedReading
} from '@/types/boardPerformance';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PDITabProps {
  memberId: string;
  periodId?: string;
}

// Componente de Card de Gap de Competência
function CompetencyGapCard({ gap }: { gap: CompetencyGap }) {
  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800';
    if (priority === 'medium') return 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800';
    return 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800';
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') return <Badge variant="destructive">Alta</Badge>;
    if (priority === 'medium') return <Badge className="bg-amber-100 text-amber-700">Média</Badge>;
    return <Badge variant="secondary">Baixa</Badge>;
  };

  return (
    <div className={cn('border-2 rounded-lg p-4', getPriorityColor(gap.priority))}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-lg">{gap.competency}</h4>
          <div className="mt-1">{getPriorityBadge(gap.priority)}</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">{gap.gap}</div>
          <div className="text-xs text-muted-foreground">pontos de gap</div>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Nível Atual</span>
            <span className="font-semibold">{gap.currentLevel}</span>
          </div>
          <Progress value={gap.currentLevel} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Nível Alvo</span>
            <span className="font-semibold">{gap.targetLevel}</span>
          </div>
          <Progress value={gap.targetLevel} className="h-2 [&>div]:bg-emerald-500" />
        </div>
      </div>
      
      <div className="text-xs">
        <span className="font-medium text-muted-foreground">Evidências:</span>
        <ul className="mt-2 space-y-1">
          {gap.evidenceFrom.map((evidence, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span className="text-foreground/80">{evidence}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Componente de Card de Objetivo de Desenvolvimento
function DevelopmentGoalCard({ goal, onUpdateProgress }: { 
  goal: DevelopmentGoal;
  onUpdateProgress: (goalId: string, progress: number) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="mb-2">
            Prioridade {goal.priority}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {format(parseISO(goal.targetDate), "MMM 'de' yyyy", { locale: ptBR })}
          </Badge>
        </div>
        <CardTitle className="text-base leading-tight">{goal.goal}</CardTitle>
        <CardDescription>{goal.competency}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-semibold">{goal.progress || 0}%</span>
            </div>
            <Progress value={goal.progress || 0} className="h-2" />
          </div>
          
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Métricas:</span>
            <ul className="mt-1 space-y-0.5">
              {goal.metrics.slice(0, 2).map((metric, i) => (
                <li key={i}>• {metric}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente de Timeline de Ações
function ActionTimeline({ 
  actions, 
  filter,
  onComplete 
}: { 
  actions: PDIAction[];
  filter?: string;
  onComplete: (actionId: string) => void;
}) {
  const filteredActions = filter && filter !== 'all'
    ? actions.filter(a => a.type === filter)
    : actions;

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'course': return <GraduationCap className="h-4 w-4" />;
      case 'mentoring': return <Users className="h-4 w-4" />;
      case 'reading': return <BookOpen className="h-4 w-4" />;
      case 'project': return <Flag className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-3">
      {filteredActions.map((action) => (
        <div 
          key={action.id} 
          className={cn(
            "flex items-start gap-3 p-3 rounded-lg border",
            action.completed 
              ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800" 
              : "bg-background"
          )}
        >
          <Checkbox
            checked={action.completed}
            onCheckedChange={() => !action.completed && onComplete(action.id)}
            disabled={action.completed}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {getActionIcon(action.type)}
              <Badge variant="outline" className="text-xs">
                {PDI_ACTION_TYPE_LABELS[action.type]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {action.estimatedHours}h estimadas
              </span>
            </div>
            <p className={cn(
              "text-sm",
              action.completed && "line-through text-muted-foreground"
            )}>
              {action.action}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Prazo: {format(parseISO(action.deadline), "dd/MM/yyyy")}</span>
              {action.completed && action.completedAt && (
                <>
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 ml-2" />
                  <span className="text-emerald-600">
                    Concluído em {format(parseISO(action.completedAt), "dd/MM/yyyy")}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente Principal
export function PDITab({ memberId, periodId }: PDITabProps) {
  const { 
    isLoading, 
    isGenerating, 
    pdi, 
    generatePDI, 
    updateMemberNotes,
    completeAction 
  } = useMemberPDI(memberId, periodId);

  const [actionFilter, setActionFilter] = useState('all');

  if (!pdi) {
    return (
      <Card className="p-12 text-center">
        <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-2">PDI com Inteligência Artificial</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Gere um Plano de Desenvolvimento Individual personalizado baseado em suas métricas 
          de performance e avaliações 360°
        </p>
        <Button 
          size="lg" 
          onClick={generatePDI}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Gerando PDI com IA...
            </>
          ) : (
            <>
              <Wand2 className="h-5 w-5 mr-2" />
              Gerar Meu PDI
            </>
          )}
        </Button>
      </Card>
    );
  }

  const completedActions = pdi.recommended_actions.filter(a => a.completed).length;
  const totalActions = pdi.recommended_actions.length;

  return (
    <div className="space-y-6">
      {/* PDI Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Plano de Desenvolvimento Individual</h2>
            <p className="text-muted-foreground">
              Período: {format(parseISO(pdi.start_date), "dd/MM/yyyy")} até{' '}
              {format(parseISO(pdi.target_completion_date), "dd/MM/yyyy")}
            </p>
            <Badge className="mt-2" variant="outline">
              {PDI_STATUS_LABELS[pdi.status]}
            </Badge>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                Confiança IA: {pdi.ai_confidence_score}%
              </Badge>
            </div>
            <div className="flex items-center gap-2 w-48">
              <Progress value={pdi.progress_percentage} className="h-3" />
              <span className="text-sm font-semibold whitespace-nowrap">
                {pdi.progress_percentage}%
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {completedActions}/{totalActions} ações concluídas
            </span>
          </div>
        </div>
      </Card>
      
      {/* Gap Analysis Summary */}
      {pdi.gap_analysis_summary && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Resumo da Análise
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {pdi.gap_analysis_summary}
          </p>
        </Card>
      )}

      {/* Gap Analysis */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Análise de Gaps de Competências
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pdi.identified_gaps.map((gap, index) => (
            <CompetencyGapCard key={index} gap={gap} />
          ))}
        </div>
      </Card>
      
      {/* Development Goals */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Flag className="h-5 w-5" />
          Objetivos de Desenvolvimento
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pdi.development_goals.map((goal) => (
            <DevelopmentGoalCard 
              key={goal.id} 
              goal={goal} 
              onUpdateProgress={() => {}}
            />
          ))}
        </div>
      </Card>
      
      {/* Recommended Actions */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ListChecks className="h-5 w-5" />
          Ações Recomendadas
        </h3>
        
        <Tabs value={actionFilter} onValueChange={setActionFilter}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              Todas ({pdi.recommended_actions.length})
            </TabsTrigger>
            <TabsTrigger value="course">Cursos</TabsTrigger>
            <TabsTrigger value="mentoring">Mentoria</TabsTrigger>
            <TabsTrigger value="practice">Prática</TabsTrigger>
            <TabsTrigger value="reading">Leituras</TabsTrigger>
            <TabsTrigger value="project">Projetos</TabsTrigger>
          </TabsList>
          
          <TabsContent value={actionFilter}>
            <ActionTimeline 
              actions={pdi.recommended_actions}
              filter={actionFilter}
              onComplete={completeAction}
            />
          </TabsContent>
        </Tabs>
      </Card>
      
      {/* Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Cursos Recomendados
          </h4>
          <ul className="space-y-3">
            {pdi.recommended_courses.map((course, i) => (
              <li key={i}>
                <a 
                  href={course.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  {course.title}
                </a>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {course.provider} • {course.duration}
                </p>
              </li>
            ))}
          </ul>
        </Card>
        
        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Mentores Sugeridos
          </h4>
          <ul className="space-y-2">
            {pdi.recommended_mentors.map((mentor, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-primary">•</span>
                {mentor}
              </li>
            ))}
          </ul>
        </Card>
        
        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Leituras Recomendadas
          </h4>
          <ul className="space-y-2">
            {pdi.recommended_readings.map((reading, i) => (
              <li key={i}>
                <p className="text-sm font-medium">{reading.title}</p>
                <p className="text-xs text-muted-foreground">
                  {reading.author} • {reading.type === 'book' ? 'Livro' : reading.type === 'article' ? 'Artigo' : 'Whitepaper'}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      
      {/* Member Notes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Minhas Anotações</h3>
        <Textarea
          placeholder="Use este espaço para anotar reflexões, aprendizados ou ajustes no seu PDI..."
          value={pdi.member_notes || ''}
          onChange={(e) => updateMemberNotes(e.target.value)}
          rows={4}
        />
      </Card>
    </div>
  );
}

export default PDITab;




