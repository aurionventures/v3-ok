// ============================================================================
// COMPONENTE: BriefingGenerationStatus
// Exibe o status de geração de briefings em tempo real
// ============================================================================

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  CheckCircle2, 
  Send, 
  Brain,
  User,
  FileText,
  AlertCircle,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MemberBriefing } from "@/types/copilot";

// --------------------------------------------------------------------------
// TIPOS
// --------------------------------------------------------------------------

interface BriefingGenerationStatusProps {
  isGenerating: boolean;
  progress: number;
  currentMember: string | null;
  totalMembers: number;
  completedBriefings: MemberBriefing[];
  error?: string | null;
  onClose?: () => void;
  onViewBriefing?: (briefingId: string) => void;
}

// --------------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// --------------------------------------------------------------------------

export function BriefingGenerationStatus({
  isGenerating,
  progress,
  currentMember,
  totalMembers,
  completedBriefings,
  error,
  onClose,
  onViewBriefing,
}: BriefingGenerationStatusProps) {
  // Não exibir se não há nada para mostrar
  if (!isGenerating && completedBriefings.length === 0 && !error) {
    return null;
  }

  const isComplete = !isGenerating && completedBriefings.length > 0;
  const hasError = !!error;

  return (
    <Card 
      className={cn(
        "border-2 transition-all duration-300",
        isGenerating && "border-indigo-300 bg-indigo-50/50 dark:bg-indigo-950/20",
        isComplete && "border-green-300 bg-green-50/50 dark:bg-green-950/20",
        hasError && "border-red-300 bg-red-50/50 dark:bg-red-950/20"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {isGenerating ? (
              <>
                <div className="relative">
                  <Brain className="h-5 w-5 text-indigo-600" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                </div>
                <span>Gerando Briefings com IA</span>
              </>
            ) : isComplete ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Briefings Gerados</span>
              </>
            ) : hasError ? (
              <>
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span>Erro na Geração</span>
              </>
            ) : null}
          </CardTitle>
          
          {onClose && !isGenerating && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Barra de Progresso */}
        {isGenerating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Processando com Agent D - Briefing Generator
              </span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            {currentMember && (
              <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Gerando briefing para: <strong>{currentMember}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* Status de Conclusão */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge 
              variant={isComplete ? "default" : isGenerating ? "secondary" : "destructive"}
              className={cn(
                isComplete && "bg-green-600",
                isGenerating && "bg-indigo-600"
              )}
            >
              {completedBriefings.length} de {totalMembers}
            </Badge>
            <span className="text-sm text-muted-foreground">
              briefings {isComplete ? "criados" : "processados"}
            </span>
          </div>

          {isComplete && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <Send className="h-4 w-4" />
              <span>Notificações enviadas</span>
            </div>
          )}
        </div>

        {/* Lista de Briefings Gerados */}
        {completedBriefings.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Briefings Gerados
            </p>
            <div className="grid gap-2 max-h-48 overflow-y-auto">
              {completedBriefings.map((briefing) => (
                <div
                  key={briefing.id}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg",
                    "bg-white dark:bg-gray-900 border",
                    "hover:bg-muted/50 transition-colors",
                    onViewBriefing && "cursor-pointer"
                  )}
                  onClick={() => onViewBriefing?.(briefing.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                      <User className="h-3.5 w-3.5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Membro {briefing.memberId.slice(-4)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {briefing.content.topicBreakdown.length} tópicos | {briefing.content.estimatedReadingTime} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      Pronto
                    </Badge>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensagem de Erro */}
        {hasError && (
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Ações */}
        {isComplete && (
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={onClose}
            >
              Fechar
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              onClick={() => window.open('/admin/briefings', '_blank')}
            >
              Ver Todos os Briefings
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --------------------------------------------------------------------------
// COMPONENTE COMPACTO (para uso em cards menores)
// --------------------------------------------------------------------------

interface CompactStatusProps {
  isGenerating: boolean;
  progress: number;
  completedCount: number;
  totalCount: number;
}

export function BriefingGenerationStatusCompact({
  isGenerating,
  progress,
  completedCount,
  totalCount,
}: CompactStatusProps) {
  if (!isGenerating && completedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/30">
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          <div className="flex-1">
            <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
              Gerando briefings... {progress}%
            </div>
            <Progress value={progress} className="h-1 mt-1" />
          </div>
        </>
      ) : (
        <>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="text-xs font-medium text-green-700 dark:text-green-300">
            {completedCount} briefings gerados
          </span>
        </>
      )}
    </div>
  );
}

export default BriefingGenerationStatus;
