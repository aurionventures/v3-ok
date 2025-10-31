import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useDocumentChecklist } from "@/hooks/useDocumentChecklist";
import { DocumentStatus } from "@/types/documentChecklist";
import { ChecklistProgressCard } from "@/components/checklist/ChecklistProgressCard";
import { AISuggestionsCard } from "@/components/checklist/AISuggestionsCard";
import { ChecklistCategoryCard } from "@/components/checklist/ChecklistCategoryCard";
import { ChecklistActions } from "@/components/checklist/ChecklistActions";

export default function DocumentChecklist() {
  const navigate = useNavigate();
  const { 
    checklist, 
    calculateProgress, 
    handleItemCheck,
    handleStatusChange,
    getCategoryProgress, 
    getAISuggestions 
  } = useDocumentChecklist();

  const progress = calculateProgress();

  const handleItemChecked = (categoryIndex: number, itemIndex: number, checked: boolean) => {
    handleItemCheck(categoryIndex, itemIndex, checked);
    if (checked) {
      toast.success("Documento marcado como existente.");
    }
  };

  const handleItemStatusChange = (
    categoryIndex: number, 
    itemIndex: number, 
    status: DocumentStatus
  ) => {
    handleStatusChange(categoryIndex, itemIndex, status);
    
    const statusLabels: Record<string, string> = {
      "not-sent": "Não enviou",
      "not-have": "Não tem",
      "not-applicable": "Não se aplica",
    };
    toast.success(`Status atualizado: ${statusLabels[status as string]}`);
  };

  const handleUploadRedirect = (categoryName: string, itemName: string) => {
    localStorage.setItem('upload-context', JSON.stringify({
      category: categoryName,
      item: itemName
    }));
    navigate('/documents');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Checklist de Documentos" />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header with Progress */}
            <ChecklistProgressCard progress={progress} />

            {/* AI Suggestions */}
            <AISuggestionsCard suggestions={getAISuggestions(progress.completionPercentage)} />

            {/* Checklist Categories */}
            <div className="grid gap-6">
              {checklist.map((category, categoryIndex) => (
                <ChecklistCategoryCard
                  key={category.id}
                  category={category}
                  categoryIndex={categoryIndex}
                  progress={getCategoryProgress(category)}
                  onItemCheck={handleItemChecked}
                  onStatusChange={handleItemStatusChange}
                  onUploadRedirect={handleUploadRedirect}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <ChecklistActions
              onNavigateToDashboard={() => navigate('/dashboard')}
              onNavigateToUpload={() => navigate('/documents')}
              onNavigateToInterviews={() => navigate('/interviews')}
            />
          </div>
        </main>
      </div>
    </div>
  );
}