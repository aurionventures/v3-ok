import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentStatus } from "@/types/documentChecklist";

interface DocumentStatusSelectProps {
  value: DocumentStatus;
  onChange: (value: DocumentStatus) => void;
}

export const DocumentStatusSelect = ({ 
  value, 
  onChange 
}: DocumentStatusSelectProps) => {
  const statusLabels: Record<string, string> = {
    "not-sent": "Não enviou",
    "not-have": "Não tem",
    "not-applicable": "Não se aplica",
  };

  const displayValue = value || "not-sent";

  return (
    <Select 
      value={displayValue} 
      onValueChange={(val) => onChange(val as DocumentStatus)}
    >
      <SelectTrigger className="w-[160px] bg-background border-input">
        <SelectValue placeholder="Status">
          {statusLabels[displayValue]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-popover border-border shadow-lg z-50">
        <SelectItem value="not-sent">
          Não enviou
        </SelectItem>
        <SelectItem value="not-have">
          Não tem
        </SelectItem>
        <SelectItem value="not-applicable">
          Não se aplica
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
