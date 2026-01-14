// =====================================================
// KNOWLEDGE BASE SCORE PANEL
// Painel otimizado de análise de score para AI Engine
// =====================================================

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap,
  Sparkles,
  Building2,
  FileText,
  Target,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCompanyProfile, useStrategicContext, useDocumentLibrary, useOnboardingProgress } from '@/hooks/useOnboardingMock';
import { calculateKnowledgeBaseScore as calcScore } from '@/hooks/useOnboardingMock';

interface KnowledgeBaseScorePanelProps {
  onNavigateToPhase?: (phase: 1 | 2 | 3) => void;
  onActivateAI?: () => void;
  compact?: boolean;
}

export function KnowledgeBaseScorePanel({ 
  onNavigateToPhase, 
  onActivateAI,
  compact = false 
}: KnowledgeBaseScorePanelProps) {
  const { profile } = useCompanyProfile();
  const { context } = useStrategicContext();
  const { documents } = useDocumentLibrary();
  const { progress } = useOnboardingProgress();

  // Calcular score geral
  const overallScore = useMemo(() => {
    return calcScore(profile, context, documents);
  }, [profile, context, documents]);

  // Calcular scores por fase
  const phaseScores = useMemo(() => {
    const phase1Score = calculatePhase1Score(profile);
    const phase2Score = calculatePhase2Score(documents);
    const phase3Score = calculatePhase3Score(context);
    
    return {
      phase1: phase1Score,
      phase2: phase2Score,
      phase3: phase3Score
    };
  }, [profile, documents, context]);

  // Gerar recomendações
  const recommendations = useMemo(() => {
    return generateRecommendations(profile, context, documents, phaseScores);
  }, [profile, context, documents, phaseScores]);

  const isReady = overallScore >= 50;
  const scoreLabel = getScoreLabel(overallScore);
  const scoreColor = getScoreColor(overallScore);

  if (compact) {
    return (
      <Card className={cn(
        "transition-all",
        isReady 
          ? "border-green-500/30 bg-gradient-to-br from-green-50/50 to-emerald-50/30" 
          : "border-primary/20"
      )}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">Knowledge Base</span>
              {isReady && (
                <Badge className="bg-green-500 text-white text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Ready
                </Badge>
              )}
            </div>
            <Progress value={overallScore} className="h-2" />
            <div className="grid grid-cols-3 gap-2">
              <PhaseProgress 
                label="Fase 1" 
                score={phaseScores.phase1} 
                completed={progress?.phase_1_basic_setup || false}
              />
              <PhaseProgress 
                label="Fase 2" 
                score={phaseScores.phase2} 
                completed={progress?.phase_2_document_upload || false}
              />
              <PhaseProgress 
                label="Fase 3" 
                score={phaseScores.phase3} 
                completed={progress?.phase_3_strategic_context || false}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Score Card */}
      <Card className={cn(
        "overflow-hidden transition-all",
        isReady 
          ? "border-green-500/30 bg-gradient-to-br from-green-50/50 to-emerald-50/30" 
          : "border-primary/20 bg-gradient-to-br from-primary/5 to-background"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                Configuração da Base de Conhecimento
              </CardTitle>
              <CardDescription className="mt-1">
                Configure o contexto da empresa para o AI Engine ter máxima efetividade
              </CardDescription>
            </div>
            {isReady && (
              <Badge className="bg-green-500 text-white">
                <Zap className="h-3 w-3 mr-1" />
                AI Ready
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Progress value={overallScore} className="h-3 mb-3" />
              <div className="flex items-baseline gap-2 mb-1">
                <span className={cn("text-4xl font-bold", scoreColor)}>
                  {overallScore}
                </span>
                <span className="text-xl text-muted-foreground">/100</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Status: <span className={cn("font-semibold", scoreColor)}>{scoreLabel}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Quanto maior o score, melhores serão os outputs do AI Engine
              </p>
            </div>

            {/* Progress Bars for Phases */}
            <div className="grid grid-cols-3 gap-3">
              <PhaseCard
                phase={1}
                title="Fase 1"
                subtitle="Setup Básico"
                score={phaseScores.phase1}
                completed={progress?.phase_1_basic_setup || false}
                icon={Building2}
                onNavigate={onNavigateToPhase}
              />
              <PhaseCard
                phase={2}
                title="Fase 2"
                subtitle="Documentos"
                score={phaseScores.phase2}
                completed={progress?.phase_2_document_upload || false}
                icon={FileText}
                onNavigate={onNavigateToPhase}
                description={`${documents.length} documentos`}
              />
              <PhaseCard
                phase={3}
                title="Fase 3"
                subtitle="Contexto Estratégico"
                score={phaseScores.phase3}
                completed={progress?.phase_3_strategic_context || false}
                icon={Target}
                onNavigate={onNavigateToPhase}
              />
            </div>

            {/* Activate Button */}
            {isReady && onActivateAI && (
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={onActivateAI}
              >
                <Zap className="mr-2 h-4 w-4" />
                Ativar AI Engine
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Próximos Passos
            </CardTitle>
            <CardDescription>
              Ações recomendadas para melhorar seu Knowledge Base Score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                    rec.priority === 'high' 
                      ? "bg-red-50 border-red-200" 
                      : rec.priority === 'medium'
                      ? "bg-amber-50 border-amber-200"
                      : "bg-slate-50 border-slate-200"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
                    rec.priority === 'high' 
                      ? "bg-red-500" 
                      : rec.priority === 'medium'
                      ? "bg-amber-500"
                      : "bg-slate-500"
                  )}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{rec.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                    {rec.impact && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-medium">Impacto:</span> +{rec.impact} pontos no score
                      </p>
                    )}
                  </div>
                  {rec.action && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={rec.action}
                      className="shrink-0"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Critical Alerts */}
      {overallScore < 50 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Complete pelo menos 50% da Base de Conhecimento para ativar o AI Engine. 
            Foque em preencher os dados básicos da empresa (Fase 1) primeiro.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Phase Progress Component
function PhaseProgress({ 
  label, 
  score, 
  completed 
}: { 
  label: string; 
  score: number; 
  completed: boolean;
}) {
  return (
    <div className="text-center p-2 rounded-md bg-muted/50">
      <div className="flex items-center justify-center gap-1 mb-1">
        {completed ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : (
          <Clock className="h-3 w-3 text-muted-foreground" />
        )}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <Progress value={score} className="h-1.5" />
      <span className="text-[10px] text-muted-foreground">{score}%</span>
    </div>
  );
}

// Phase Card Component
function PhaseCard({
  phase,
  title,
  subtitle,
  score,
  completed,
  icon: Icon,
  description,
  onNavigate
}: {
  phase: 1 | 2 | 3;
  title: string;
  subtitle: string;
  score: number;
  completed: boolean;
  icon: any;
  description?: string;
  onNavigate?: (phase: 1 | 2 | 3) => void;
}) {
  return (
    <div 
      className={cn(
        "p-3 rounded-lg border transition-all cursor-pointer h-full flex flex-col",
        completed ? "border-green-200 bg-green-50/50" : "border-slate-200 bg-slate-50/50",
        onNavigate && "hover:shadow-md"
      )}
      onClick={() => onNavigate?.(phase)}
    >
      <div className="flex items-start justify-between mb-2 flex-shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={cn(
            "p-1.5 rounded-md flex-shrink-0",
            completed ? "bg-green-100" : "bg-slate-100"
          )}>
            <Icon className={cn(
              "h-4 w-4",
              completed ? "text-green-600" : "text-slate-500"
            )} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold leading-tight">{title}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">{subtitle}</p>
          </div>
        </div>
        {completed && (
          <Badge variant="default" className="bg-green-600 text-[10px] px-1.5 py-0 flex-shrink-0 ml-2">
            <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
            Completo
          </Badge>
        )}
      </div>
      {description && (
        <p className="text-[10px] text-muted-foreground mb-2 flex-shrink-0">{description}</p>
      )}
      <div className="mt-auto space-y-1">
        <Progress value={score} className="h-1.5" />
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">{score}%</span>
          {onNavigate && (
            <Button variant="ghost" size="sm" className="h-5 text-[10px] px-2">
              {completed ? 'Revisar' : 'Continuar'}
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Functions
function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excelente';
  if (score >= 60) return 'Bom';
  if (score >= 50) return 'Suficiente';
  return 'Incompleto';
}

function calculatePhase1Score(profile: any): number {
  if (!profile) return 0;
  let score = 0;
  let maxScore = 40;

  // Campos críticos (20 pontos)
  if (profile.legal_name) score += 4;
  if (profile.tax_id) score += 4;
  if (profile.primary_sector) score += 4;
  if (profile.company_size) score += 4;
  if (profile.headquarters_state) score += 4;

  // Campos importantes (12 pontos)
  if (profile.annual_revenue_range) score += 3;
  if (profile.ownership_structure) score += 3;
  if (profile.number_of_shareholders) score += 3;
  if (profile.founded_date) score += 3;

  // Campos complementares (8 pontos)
  if (profile.products_services && Array.isArray(profile.products_services) && profile.products_services.length > 0) score += 2;
  if (profile.target_markets && profile.target_markets.length > 0) score += 2;
  if (profile.erp_system) score += 2;
  if (profile.certifications && profile.certifications.length > 0) score += 2;

  return Math.round((score / maxScore) * 100);
}

function calculatePhase2Score(documents: any[]): number {
  if (!documents || documents.length === 0) return 0;
  const processedDocs = documents.filter(d => d.processing_status === 'completed');
  const baseScore = Math.min(30, processedDocs.length * 5);
  
  // Bonus por categorias
  const categories = new Set(processedDocs.map(d => d.category));
  let bonus = 0;
  if (categories.has('governance')) bonus += 2;
  if (categories.has('minutes')) bonus += 2;
  if (categories.has('financial')) bonus += 2;
  if (categories.has('strategic')) bonus += 2;
  
  const totalScore = Math.min(100, baseScore + bonus);
  return Math.round((totalScore / 40) * 100); // Normalizar para 100%
}

function calculatePhase3Score(context: any): number {
  if (!context) return 0;
  let score = 0;
  let maxScore = 30;

  // Visão e missão (10 pontos)
  if (context.mission) score += 5;
  if (context.vision) score += 5;

  // Objetivos e stakeholders (12 pontos)
  if (context.strategic_objectives && context.strategic_objectives.length > 0) {
    score += Math.min(6, context.strategic_objectives.length * 2);
  }
  if (context.key_stakeholders && context.key_stakeholders.length > 0) {
    score += Math.min(6, context.key_stakeholders.length);
  }

  // Riscos e competidores (8 pontos)
  if (context.known_risks && context.known_risks.length > 0) {
    score += Math.min(4, context.known_risks.length);
  }
  if (context.main_competitors && context.main_competitors.length > 0) {
    score += Math.min(4, context.main_competitors.length);
  }

  return Math.round((score / maxScore) * 100);
}

function generateRecommendations(
  profile: any,
  context: any,
  documents: any[],
  phaseScores: { phase1: number; phase2: number; phase3: number }
): Array<{
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact?: number;
  action?: () => void;
}> {
  const recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    impact?: number;
    action?: () => void;
  }> = [];

  // Fase 1 Recommendations
  if (phaseScores.phase1 < 50) {
    if (!profile?.legal_name || !profile?.tax_id) {
      recommendations.push({
        title: 'Completar dados básicos da empresa',
        description: 'Adicione razão social e CNPJ para melhorar o contexto do AI Engine',
        priority: 'high',
        impact: 8
      });
    } else if (!profile?.primary_sector || !profile?.company_size) {
      recommendations.push({
        title: 'Definir setor e porte da empresa',
        description: 'Informe o setor principal e o porte da empresa',
        priority: 'high',
        impact: 8
      });
    } else if (phaseScores.phase1 < 80) {
      recommendations.push({
        title: 'Adicionar informações complementares',
        description: 'Complete produtos/serviços, mercados-alvo e sistemas utilizados',
        priority: 'medium',
        impact: 5
      });
    }
  }

  // Fase 2 Recommendations
  if (phaseScores.phase2 < 50) {
    recommendations.push({
      title: 'Upload de documentos essenciais',
      description: 'Adicione documentos de governança, financeiros e estratégicos',
      priority: 'high',
      impact: 15
    });
  } else if (documents.length < 5) {
    recommendations.push({
      title: 'Adicionar mais documentos históricos',
      description: 'Upload de ATAs dos últimos 12-24 meses para melhorar contexto',
      priority: 'medium',
      impact: 10
    });
  }

  // Fase 3 Recommendations
  if (phaseScores.phase3 < 50) {
    if (!context?.mission || !context?.vision) {
      recommendations.push({
        title: 'Definir missão e visão',
        description: 'Adicione a missão e visão da empresa para contexto estratégico',
        priority: 'high',
        impact: 10
      });
    } else if (!context?.strategic_objectives || context.strategic_objectives.length === 0) {
      recommendations.push({
        title: 'Adicionar objetivos estratégicos',
        description: 'Defina objetivos estratégicos e OKRs da empresa',
        priority: 'medium',
        impact: 6
      });
    }
  } else if (phaseScores.phase3 < 80) {
    if (!context?.known_risks || context.known_risks.length === 0) {
      recommendations.push({
        title: 'Mapear riscos conhecidos',
        description: 'Adicione riscos conhecidos para melhor análise do AI Engine',
        priority: 'medium',
        impact: 4
      });
    }
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations.slice(0, 5); // Limitar a 5 recomendações
}
