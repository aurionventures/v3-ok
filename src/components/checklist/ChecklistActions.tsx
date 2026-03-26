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
  return <div className="flex justify-between pt-6">
      <Button variant="outline" onClick={onNavigateToDashboard}>
        Voltar ao Dashboard
      </Button>
      
      <div className="flex gap-3">
        
        
        
      </div>
    </div>;
};