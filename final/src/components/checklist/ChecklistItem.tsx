import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CheckCircle, Upload } from "lucide-react";
import { ChecklistItem as ChecklistItemType, DocumentStatus } from "@/types/documentChecklist";
import { DocumentStatusSelect } from "./DocumentStatusSelect";

interface ChecklistItemProps {
  item: ChecklistItemType;
  categoryName: string;
  onCheck: (checked: boolean) => void;
  onStatusChange: (status: DocumentStatus) => void;
  onUploadRedirect: (categoryName: string, itemName: string) => void;
}

export const ChecklistItem = ({ 
  item, 
  categoryName, 
  onCheck,
  onStatusChange,
  onUploadRedirect 
}: ChecklistItemProps) => {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      {/* Seção esquerda: Checkbox + Nome */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Checkbox
          id={item.id}
          checked={item.checked}
          onCheckedChange={(checked) => onCheck(checked as boolean)}
        />
        <label 
          htmlFor={item.id} 
          className="font-medium cursor-pointer flex-1 truncate"
        >
          {item.name}
        </label>
        {item.checked && (
          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
        )}
      </div>
      
      {/* Seção direita: Dropdown Status + Botão Upload */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <DocumentStatusSelect
          value={item.status || null}
          onChange={onStatusChange}
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUploadRedirect(categoryName, item.name)}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>
    </div>
  );
};