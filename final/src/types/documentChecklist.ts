import { LucideIcon } from "lucide-react";

export type DocumentStatus = "not-applicable" | "not-have" | "not-sent" | null;

export interface ChecklistItem {
  id: string;
  name: string;
  checked: boolean;
  hasDocument: boolean;
  status?: DocumentStatus;
}

export interface ChecklistCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  items: ChecklistItem[];
}

export interface ChecklistProgress {
  totalItems: number;
  checkedItems: number;
  completionPercentage: number;
}

export interface CategoryProgress {
  categoryProgress: number;
  categoryTotal: number;
  categoryPercentage: number;
}