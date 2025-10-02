import { Button } from "@/components/ui/button";
import { Upload, ChevronRight } from "lucide-react";

interface ChecklistActionsProps {
  onNavigateToDashboard: () => void;
  onNavigateToUpload: () => void;
  onNavigateToInterviews: () => void;
}

export const ChecklistActions = ({
  onNavigateToDashboard,
  onNavigateToUpload,
  onNavigateToInterviews
}: ChecklistActionsProps) => {
  return (
    <div className="flex justify-between pt-6">
      <Button variant="outline" onClick={onNavigateToDashboard}>
        Voltar ao Dashboard
      </Button>
      
      <div className="flex gap-3">
        <Button 
          onClick={onNavigateToUpload}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Ir para Upload
        </Button>
        
        <Button 
          onClick={onNavigateToInterviews}
          className="flex items-center gap-2"
        >
          Próximo: Entrevistas
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};