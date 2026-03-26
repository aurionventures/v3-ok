export interface CustomCriterion {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  assignedTo?: string;
  createdAt: Date;
}

export interface CriteriaProgress {
  total: number;
  completed: number;
  percentage: number;
  standardCompleted: number;
  customCompleted: number;
}
