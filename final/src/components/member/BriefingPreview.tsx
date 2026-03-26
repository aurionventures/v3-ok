import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  CheckCircle2,
  HelpCircle,
  FileText,
  AlertTriangle,
  Target,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { pdf } from "@react-pdf/renderer";
import { BriefingPDFDocument } from "./BriefingPDFDocument";
import { DocumentReaderModal } from "./DocumentReaderModal";
import type { MemberBriefing, TopicBriefing } from "@/types/copilot";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BriefingPreviewProps {
  briefing: MemberBriefing;
  onMarkAsRead?: () => void;
  onUpdateProgress?: (progress: number) => void;
}

function TopicBriefingCard({ topic }: { topic: TopicBriefing }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border-l-4 border-l-indigo-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{topic.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{topic.relevanceToMember}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Key Points */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Pontos-Chave
          </p>
          <ul className="space-y-1.5">
            {topic.keyPoints.map((point, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Your Perspective */}
        <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
              Sua Perspectiva é Importante
            </span>
          </div>
          <p className="text-sm text-indigo-600 dark:text-indigo-300">
            {topic.yourPerspectiveMatters}
          </p>
        </div>

        {/* Expandable Details */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full text-xs">
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Menos detalhes
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Mais detalhes
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {/* Potential Concerns */}
            {topic.potentialConcerns.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Preocupações Potenciais
                </p>
                <ul className="space-y-1.5">
                  {topic.potentialConcerns.map((concern, i) => (
                    <li key={i} className="text-sm flex items-start gap-2 text-orange-600 dark:text-orange-400">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      {concern}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggested Stance */}
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                  Posição Sugerida
                </span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-300">
                {topic.suggestedStance}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

export function BriefingPreview({
  briefing,
  onMarkAsRead,
  onUpdateProgress,
}: BriefingPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const handleCheckItem = (index: number) => {
    setCheckedItems(prev => {
      const newItems = prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index];
      
      // Update progress based on checked items
      if (onUpdateProgress) {
        const totalItems = briefing.content.preparationChecklist.length;
        const progress = Math.round((newItems.length / totalItems) * 100);
        onUpdateProgress(progress);
      }
      
      return newItems;
    });
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const generatedDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      
      // Gerar o PDF usando @react-pdf/renderer
      const blob = await pdf(
        <BriefingPDFDocument briefing={briefing} generatedDate={generatedDate} />
      ).toBlob();
      
      // Criar link para download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `briefing-reuniao-${format(new Date(), "yyyy-MM-dd")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "PDF gerado com sucesso",
        description: "O briefing foi baixado para o seu dispositivo.",
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-600">
            <Clock className="h-3 w-3 mr-1" />
            {briefing.content.estimatedReadingTime} min de leitura
          </Badge>
          {briefing.readAt && (
            <Badge variant="outline" className="text-green-600 border-green-300">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Lido
            </Badge>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-1" />
              Baixar PDF
            </>
          )}
        </Button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progresso de preparação</span>
          <span className="font-semibold">{briefing.preparationProgress}%</span>
        </div>
        <Progress value={briefing.preparationProgress} className="h-2" />
      </div>

      {/* Executive Summary */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Resumo Executivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {briefing.content.executiveSummary.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm text-foreground/90 mb-3 last:mb-0">
                {para}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critical Questions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
            Perguntas Críticas para Você
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {briefing.content.criticalQuestions.slice(0, isExpanded ? undefined : 3).map((q, i) => (
              <li
                key={i}
                className="flex items-start gap-3 p-2 rounded-lg bg-muted/50 text-sm"
              >
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-full flex-shrink-0">
                  <HelpCircle className="h-4 w-4 text-indigo-600" />
                </div>
                {q}
              </li>
            ))}
          </ul>
          {briefing.content.criticalQuestions.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Ver menos" : `Ver mais ${briefing.content.criticalQuestions.length - 3} perguntas`}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Topic Breakdown */}
      {briefing.content.topicBreakdown.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-lg">Análise por Pauta</h4>
          {briefing.content.topicBreakdown.map((topic) => (
            <TopicBriefingCard key={topic.topicId} topic={topic} />
          ))}
        </div>
      )}

      {/* Preparation Checklist */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            Checklist de Preparação
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Marque os itens conforme você se prepara para a reunião
          </p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {briefing.content.preparationChecklist.map((item, i) => (
              <li
                key={i}
                className={cn(
                  "flex items-center gap-3 text-sm p-2 rounded-lg transition-colors",
                  checkedItems.includes(i) && "bg-green-50 dark:bg-green-950/20"
                )}
              >
                <Checkbox
                  id={`checklist-${i}`}
                  checked={checkedItems.includes(i)}
                  onCheckedChange={() => handleCheckItem(i)}
                />
                <label 
                  htmlFor={`checklist-${i}`}
                  className={cn(
                    "cursor-pointer flex-1",
                    checkedItems.includes(i) && "line-through text-muted-foreground"
                  )}
                >
                  {item}
                </label>
                {checkedItems.includes(i) && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
              </li>
            ))}
          </ul>
          
          {/* Progress indicator */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progresso do checklist</span>
              <span className="font-semibold">
                {checkedItems.length}/{briefing.content.preparationChecklist.length} itens
              </span>
            </div>
            <Progress 
              value={(checkedItems.length / briefing.content.preparationChecklist.length) * 100} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Related Documents */}
      {briefing.content.relatedDocuments.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Documentos Relacionados</CardTitle>
            <p className="text-sm text-muted-foreground">
              Clique para visualizar o documento
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {briefing.content.relatedDocuments.map((doc, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors"
                  onClick={() => setSelectedDocument(doc)}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  {doc}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Reader Modal */}
      <DocumentReaderModal
        open={!!selectedDocument}
        onOpenChange={(open) => !open && setSelectedDocument(null)}
        documentName={selectedDocument || ""}
      />

      {/* Mark as Read Button */}
      {!briefing.readAt && onMarkAsRead && (
        <Button
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          onClick={onMarkAsRead}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Marcar como Lido
        </Button>
      )}
    </div>
  );
}

export default BriefingPreview;

