import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BookOpen,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Zap,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import type { OnboardingProgress } from '@/types/onboarding';

interface KnowledgeBaseWidgetProps {
  progress: OnboardingProgress | null;
  score: number;
  isCompact?: boolean;
}

function ScoreCircleCompact({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 32;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = () => {
    if (score >= 90) return 'Excelente';
    if (score >= 70) return 'Bom';
    if (score >= 50) return 'Suficiente';
    return 'Incompleto';
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-20 h-20 transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r="32"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className="text-muted"
        />
        <circle
          cx="40"
          cy="40"
          r="32"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn('transition-all duration-1000', getScoreColor())}
        />
      </svg>
      <div className="absolute text-center">
        <span className={cn('text-xl font-bold', getScoreColor())}>{score}</span>
        <p className="text-[8px] text-muted-foreground">{getScoreLabel()}</p>
      </div>
    </div>
  );
}

export function KnowledgeBaseWidget({ progress, score, isCompact = false }: KnowledgeBaseWidgetProps) {
  const navigate = useNavigate();

  const isReady = score >= 50;
  const hasMissingCritical = progress?.missing_critical_data && progress.missing_critical_data.length > 0;

  if (isCompact) {
    return (
      <Card 
        className={cn(
          "cursor-pointer transition-all hover:shadow-md",
          isReady ? "border-green-500/30 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10" : "border-primary/20"
        )}
        onClick={() => navigate('/knowledge-base')}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <ScoreCircleCompact score={score} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium truncate">Knowledge Base</span>
                {isReady && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-green-600 border-green-300">
                    <Zap className="h-2.5 w-2.5 mr-0.5" />
                    Pronto
                  </Badge>
                )}
              </div>
              <div className="flex gap-1.5">
                <Badge 
                  variant={progress?.phase_1_basic_setup ? "default" : "secondary"} 
                  className="text-[9px] px-1 py-0"
                >
                  {progress?.phase_1_basic_setup ? <CheckCircle className="h-2 w-2 mr-0.5" /> : <Clock className="h-2 w-2 mr-0.5" />}
                  F1
                </Badge>
                <Badge 
                  variant={progress?.phase_2_document_upload ? "default" : "secondary"} 
                  className="text-[9px] px-1 py-0"
                >
                  {progress?.phase_2_document_upload ? <CheckCircle className="h-2 w-2 mr-0.5" /> : <Clock className="h-2 w-2 mr-0.5" />}
                  F2
                </Badge>
                <Badge 
                  variant={progress?.phase_3_strategic_context ? "default" : "secondary"} 
                  className="text-[9px] px-1 py-0"
                >
                  {progress?.phase_3_strategic_context ? <CheckCircle className="h-2 w-2 mr-0.5" /> : <Clock className="h-2 w-2 mr-0.5" />}
                  F3
                </Badge>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "transition-all",
      isReady 
        ? "border-green-500/30 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10" 
        : "border-primary/20 bg-gradient-to-br from-primary/5 to-background"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded-md bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            Knowledge Base
            {isReady && (
              <Badge className="bg-green-500 text-white text-[10px]">
                <Sparkles className="h-3 w-3 mr-1" />
                MOAT Ready
              </Badge>
            )}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs"
            onClick={() => navigate('/knowledge-base')}
          >
            Configurar
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4">
          <ScoreCircleCompact score={score} />
          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 rounded-md bg-muted/50">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  {progress?.phase_1_basic_setup ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Clock className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className="text-[10px] font-medium">Fase 1</span>
                </div>
                <Progress 
                  value={progress?.basic_setup_score || 0} 
                  className="h-1.5" 
                />
                <span className="text-[9px] text-muted-foreground">
                  {progress?.basic_setup_score || 0}%
                </span>
              </div>
              <div className="text-center p-2 rounded-md bg-muted/50">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  {progress?.phase_2_document_upload ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Clock className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className="text-[10px] font-medium">Fase 2</span>
                </div>
                <Progress 
                  value={progress?.document_upload_score || 0} 
                  className="h-1.5" 
                />
                <span className="text-[9px] text-muted-foreground">
                  {progress?.document_upload_score || 0}%
                </span>
              </div>
              <div className="text-center p-2 rounded-md bg-muted/50">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  {progress?.phase_3_strategic_context ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Clock className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className="text-[10px] font-medium">Fase 3</span>
                </div>
                <Progress 
                  value={progress?.strategic_context_score || 0} 
                  className="h-1.5" 
                />
                <span className="text-[9px] text-muted-foreground">
                  {progress?.strategic_context_score || 0}%
                </span>
              </div>
            </div>

            {hasMissingCritical && !isReady && (
              <Alert variant="destructive" className="py-1.5 px-2">
                <AlertTriangle className="h-3 w-3" />
                <AlertDescription className="text-[10px] ml-1">
                  {progress.missing_critical_data![0]}
                </AlertDescription>
              </Alert>
            )}

            {isReady && (
              <Button 
                size="sm" 
                className="w-full h-7 text-xs bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/governance-copilot')}
              >
                <Zap className="mr-1 h-3 w-3" />
                Ativar MOAT Engine
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
