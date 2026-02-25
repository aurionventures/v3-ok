import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuestionInput } from "@/components/QuestionInput";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { QUESTIONS } from "@/data/maturityData";
import { Question } from "@/types/maturity";
import { cn } from "@/lib/utils";

const IBGC_QUESTIONS: Question[] = QUESTIONS.slice(0, 10);
const TOTAL = IBGC_QUESTIONS.length;

export interface DiagnosticoIBGCDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DiagnosticoIBGCDialog({
  open,
  onOpenChange,
}: DiagnosticoIBGCDialogProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});

  const question = IBGC_QUESTIONS[currentIndex];
  const questionNumber = currentIndex + 1;
  const progressPercent = (questionNumber / TOTAL) * 100;
  const value = answers[question.numero];

  const handleAnswer = (val: string | string[] | number) => {
    setAnswers((prev) => ({ ...prev, [question.numero]: val }));
  };

  const canAdvance = () => {
    const v = value;
    if (question.tipo === "multipla_escolha_multipla" || question.tipo === "multipla_escolha_unica") {
      if (Array.isArray(v)) return v.length > 0;
      return v !== undefined && v !== "" && v !== null;
    }
    if (question.tipo === "numerico") return v !== undefined && v !== "" && v !== null;
    if (question.tipo === "numerico_multiplo" || question.tipo === "texto" || question.tipo === "matriz") return true;
    return true;
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleNext = () => {
    if (!canAdvance()) return;
    if (currentIndex < TOTAL - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onOpenChange(false);
      navigate("/login", { state: { fromDiagnostico: true, diagnosticoAnswers: answers } });
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setCurrentIndex(0);
      setAnswers({});
    }
    onOpenChange(open);
  };

  const tabLabels = [
    question.dimensao,
    ...(question.indicador ? [question.indicador] : []),
  ];
  const activeTabIndex = question.indicador ? 1 : 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0A1628] border-white/10 text-white p-0 gap-0"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="p-6 pb-4">
          <DialogTitle className="sr-only">
            Diagnóstico de Maturidade em Governança
          </DialogTitle>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Diagnóstico de Maturidade em Governança
              </h2>
              <p className="text-sm text-white/80 mt-1">
                Descubra o nível de maturidade da governança da sua empresa em apenas alguns minutos
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm text-white/70">
                Pergunta {questionNumber} de {TOTAL}
              </span>
              <span className="text-sm font-medium text-white">{Math.round(progressPercent)}%</span>
            </div>
          </div>

          <Progress value={progressPercent} className="h-1.5 bg-white/10 mb-6" />

          {tabLabels.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tabLabels.map((label, i) => (
                <div
                  key={label}
                  role="tab"
                  aria-selected={i === activeTabIndex}
                  className={cn(
                    "rounded-sm px-2 py-1.5 text-sm outline-none transition-colors cursor-default",
                    i === activeTabIndex
                      ? "bg-white/15 text-white"
                      : "text-white/70"
                  )}
                >
                  {label}
                </div>
              ))}
            </div>
          )}

          <p className="text-base font-medium text-white mb-3 leading-snug">
            {question.texto}
          </p>
          {question.referencia && (
            <p className="text-xs text-white/60 mb-4 p-2 rounded bg-white/5 border border-white/10">
              Referência IBGC: {question.referencia}
            </p>
          )}

          <div className="mt-2 [&_label]:text-white [&_input]:border-white/30 [&_input]:text-white [&_input]:bg-white/5">
            <QuestionInput
              question={question}
              value={value}
              onChange={handleAnswer}
              disabled={false}
            />
          </div>
        </div>

        <div className="flex justify-between items-center px-6 py-4 border-t border-white/10 bg-[#0A1628]">
          <Button
            type="button"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          <Button
            type="button"
            className="bg-legacy-gold text-legacy-500 hover:brightness-110"
            onClick={handleNext}
            disabled={!canAdvance()}
          >
            {currentIndex < TOTAL - 1 ? (
              <>
                Avançar
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              "Gerar Diagnóstico"
            )}
          </Button>
        </div>

        <p className="text-center text-xs text-white/50 px-6 pb-4">
          Seus dados estão seguros e serão utilizados apenas para gerar o diagnóstico
        </p>
      </DialogContent>
    </Dialog>
  );
}
