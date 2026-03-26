import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  User,
  Users,
  Crown,
  CheckCircle2,
  Clock,
  Send,
  Save,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useEvaluations360 } from '@/hooks/useBoardPerformance360';
import { COMPETENCY_LABELS } from '@/types/boardPerformance';
import type { EvaluationScores, EvaluationFeedback } from '@/types/boardPerformance';
import { cn } from '@/lib/utils';
import { format, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Evaluations360TabProps {
  periodId: string;
  periodName: string;
  selfDeadline?: string;
  peerDeadline?: string;
}

// Componente de estatística
function StatCard({ 
  title, 
  value, 
  total, 
  icon, 
  progress 
}: { 
  title: string; 
  value: string; 
  total?: string;
  icon: React.ReactNode; 
  progress?: number;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {total && <p className="text-xs text-muted-foreground">de {total}</p>}
        {progress !== undefined && (
          <Progress value={progress} className="h-2 mt-2" />
        )}
      </CardContent>
    </Card>
  );
}

// Formulário de Auto-avaliação
function SelfEvaluationForm({ 
  onSubmit, 
  onSaveDraft,
  isLoading 
}: { 
  onSubmit: (scores: EvaluationScores, feedback: EvaluationFeedback) => Promise<void>;
  onSaveDraft: (scores: Partial<EvaluationScores>, feedback: Partial<EvaluationFeedback>) => Promise<void>;
  isLoading: boolean;
}) {
  const [scores, setScores] = useState<EvaluationScores>({
    strategic_thinking: 50,
    decision_quality: 50,
    leadership: 50,
    collaboration: 50,
    ethics_integrity: 50,
    communication: 50
  });
  
  const [feedback, setFeedback] = useState<EvaluationFeedback>({
    strengths: ['', '', ''],
    areas_for_improvement: ['', '', ''],
    specific_examples: '',
    development_suggestions: [''],
    most_valuable_contribution: '',
    biggest_challenge: '',
    support_needed: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(scores, feedback);
  };

  const competencies = [
    { key: 'strategic_thinking', label: 'Pensamento Estratégico' },
    { key: 'decision_quality', label: 'Qualidade de Decisão' },
    { key: 'leadership', label: 'Liderança e Influência' },
    { key: 'collaboration', label: 'Colaboração' },
    { key: 'ethics_integrity', label: 'Ética e Integridade' },
    { key: 'communication', label: 'Comunicação' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Scores Section */}
      <div>
        <h4 className="font-semibold mb-4">Avalie suas Competências (0-100)</h4>
        <div className="space-y-6">
          {competencies.map(({ key, label }) => (
            <div key={key}>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">{label}</label>
                <span className="text-sm font-bold text-primary">
                  {scores[key as keyof EvaluationScores]}
                </span>
              </div>
              <Slider
                value={[scores[key as keyof EvaluationScores]]}
                onValueChange={([value]) => setScores({...scores, [key]: value})}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Muito Abaixo</span>
                <span>Esperado</span>
                <span>Excepcional</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Qualitative Feedback */}
      <div className="space-y-6">
        <h4 className="font-semibold">Feedback Qualitativo</h4>
        
        <div>
          <label className="text-sm font-medium mb-2 block">
            Meus Principais Pontos Fortes (3)
          </label>
          {[0, 1, 2].map(i => (
            <Input
              key={i}
              placeholder={`Ponto forte ${i + 1}`}
              value={feedback.strengths[i]}
              onChange={(e) => {
                const newStrengths = [...feedback.strengths];
                newStrengths[i] = e.target.value;
                setFeedback({...feedback, strengths: newStrengths});
              }}
              className="mb-2"
            />
          ))}
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">
            Áreas que Preciso Desenvolver (3)
          </label>
          {[0, 1, 2].map(i => (
            <Input
              key={i}
              placeholder={`Área de melhoria ${i + 1}`}
              value={feedback.areas_for_improvement[i]}
              onChange={(e) => {
                const newAreas = [...feedback.areas_for_improvement];
                newAreas[i] = e.target.value;
                setFeedback({...feedback, areas_for_improvement: newAreas});
              }}
              className="mb-2"
            />
          ))}
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">
            Minha Contribuição Mais Valiosa Este Período
          </label>
          <Textarea
            placeholder="Descreva sua contribuição mais significativa..."
            value={feedback.most_valuable_contribution}
            onChange={(e) => setFeedback({...feedback, most_valuable_contribution: e.target.value})}
            rows={3}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">
            Maior Desafio Enfrentado
          </label>
          <Textarea
            placeholder="Qual foi seu maior desafio?"
            value={feedback.biggest_challenge}
            onChange={(e) => setFeedback({...feedback, biggest_challenge: e.target.value})}
            rows={3}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">
            Suporte Necessário para Melhorar
          </label>
          <Textarea
            placeholder="Que tipo de suporte você precisa?"
            value={feedback.support_needed}
            onChange={(e) => setFeedback({...feedback, support_needed: e.target.value})}
            rows={3}
          />
        </div>
      </div>
      
      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Enviar Auto-avaliação
            </>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => onSaveDraft(scores, feedback)}
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Rascunho
        </Button>
      </div>
    </form>
  );
}

// Card de avaliação de par
function PeerEvaluationCard({ 
  peer, 
  onEvaluate 
}: { 
  peer: { id: string; name: string; role: string }; 
  onEvaluate: (peerId: string) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{peer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{peer.name}</p>
          <p className="text-sm text-muted-foreground">{peer.role}</p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={() => onEvaluate(peer.id)}>
        Avaliar
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}

// Componente Principal
export function Evaluations360Tab({ 
  periodId, 
  periodName,
  selfDeadline,
  peerDeadline 
}: Evaluations360TabProps) {
  const {
    isLoading,
    getEvaluationProgress,
    getMyEvaluations,
    submitSelfEvaluation,
    saveDraft
  } = useEvaluations360(periodId);

  const progress = getEvaluationProgress();
  const myEvaluations = getMyEvaluations();

  const getDeadlineBadge = (deadline?: string) => {
    if (!deadline) return null;
    
    const daysLeft = differenceInDays(parseISO(deadline), new Date());
    
    if (daysLeft < 0) {
      return <Badge variant="destructive">Prazo expirado</Badge>;
    }
    if (daysLeft <= 3) {
      return <Badge variant="destructive">{daysLeft} dias restantes</Badge>;
    }
    if (daysLeft <= 7) {
      return <Badge className="bg-amber-100 text-amber-700">{daysLeft} dias restantes</Badge>;
    }
    return (
      <Badge variant="outline">
        {format(parseISO(deadline), "dd 'de' MMM", { locale: ptBR })}
      </Badge>
    );
  };

  const handleSubmitSelf = async (scores: EvaluationScores, feedback: EvaluationFeedback) => {
    await submitSelfEvaluation(scores, feedback);
  };

  const handleSaveDraft = async (scores: Partial<EvaluationScores>, feedback: Partial<EvaluationFeedback>) => {
    await saveDraft('self', null, scores, feedback);
  };

  const handleEvaluatePeer = (peerId: string) => {
    // Em produção, abriria modal ou navegaria para formulário
    console.log('Avaliar:', peerId);
  };

  return (
    <div className="space-y-6">
      {/* Header com Deadlines */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Avaliações 360°</h2>
            <p className="text-muted-foreground">
              Período: {periodName}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Auto-avaliação:</span>
              {getDeadlineBadge(selfDeadline)}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Pares:</span>
              {getDeadlineBadge(peerDeadline)}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Auto-avaliação"
          value={`${progress.selfCompleted}`}
          total={`${progress.selfTotal}`}
          progress={(progress.selfCompleted / progress.selfTotal) * 100}
          icon={<User className="h-4 w-4" />}
        />
        <StatCard
          title="Avaliações de Pares"
          value={`${progress.peerCompleted}`}
          total={`${progress.peerTotal}`}
          progress={(progress.peerCompleted / progress.peerTotal) * 100}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Avaliação Presidente"
          value={progress.presidentCompleted ? 'Concluída' : 'Pendente'}
          icon={<Crown className="h-4 w-4" />}
        />
        <StatCard
          title="Progresso Geral"
          value={`${Math.round(progress.overallCompletion)}%`}
          progress={progress.overallCompletion}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
      </div>
      
      {/* My Evaluations Section */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Minhas Avaliações</h3>
        
        <Tabs defaultValue="self">
          <TabsList>
            <TabsTrigger value="self">Auto-avaliação</TabsTrigger>
            <TabsTrigger value="peers">
              Avaliar Pares ({myEvaluations.pending.peers.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="self" className="mt-4">
            {myEvaluations.pending.self ? (
              <SelfEvaluationForm
                onSubmit={handleSubmitSelf}
                onSaveDraft={handleSaveDraft}
                isLoading={isLoading}
              />
            ) : (
              <Alert className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertTitle className="text-emerald-700">Auto-avaliação Concluída</AlertTitle>
                <AlertDescription className="text-emerald-600">
                  Você já completou sua auto-avaliação para este período.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="peers" className="mt-4">
            {myEvaluations.pending.peers.length > 0 ? (
              <div className="space-y-3">
                {myEvaluations.pending.peers.map(peer => (
                  <PeerEvaluationCard
                    key={peer.id}
                    peer={peer}
                    onEvaluate={handleEvaluatePeer}
                  />
                ))}
              </div>
            ) : (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Todas as avaliações concluídas</AlertTitle>
                <AlertDescription>
                  Você já avaliou todos os seus pares designados.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

export default Evaluations360Tab;




