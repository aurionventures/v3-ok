import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChecklistProgress } from "@/types/documentChecklist";

interface ChecklistProgressCardProps {
  progress: ChecklistProgress;
}

export const ChecklistProgressCard = ({ progress }: ChecklistProgressCardProps) => {
  const { totalItems, checkedItems, completionPercentage } = progress;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Checklist de Documentos de Governança
          </h1>
          <p className="text-muted-foreground">
            Identifique quais documentos sua empresa já possui baseado em boas práticas de governança corporativa
          </p>
        </div>
        <Badge variant={completionPercentage >= 80 ? "default" : "secondary"} className="text-sm">
          {completionPercentage}% Completo
        </Badge>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso do Checklist</span>
              <span className="text-sm text-muted-foreground">
                {checkedItems} de {totalItems} documentos
              </span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};