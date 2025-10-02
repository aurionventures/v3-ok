import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CheckCircle, Upload } from "lucide-react";
import { ChecklistItem as ChecklistItemType } from "@/types/documentChecklist";

interface ChecklistItemProps {
  item: ChecklistItemType;
  categoryName: string;
  onCheck: (checked: boolean) => void;
  onUploadRedirect: (categoryName: string, itemName: string) => void;
}

export const ChecklistItem = ({ 
  item, 
  categoryName, 
  onCheck, 
  onUploadRedirect 
}: ChecklistItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          id={item.id}
          checked={item.checked}
          onCheckedChange={(checked) => onCheck(checked as boolean)}
        />
        <label 
          htmlFor={item.id} 
          className="font-medium cursor-pointer flex-1"
        >
          {item.name}
        </label>
        {item.checked && (
          <CheckCircle className="h-4 w-4 text-green-500" />
        )}
      </div>
      
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
  );
};