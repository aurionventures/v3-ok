import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChecklistCategory, CategoryProgress } from "@/types/documentChecklist";
import { ChecklistItem } from "./ChecklistItem";

interface ChecklistCategoryCardProps {
  category: ChecklistCategory;
  categoryIndex: number;
  progress: CategoryProgress;
  onItemCheck: (categoryIndex: number, itemIndex: number, checked: boolean) => void;
  onUploadRedirect: (categoryName: string, itemName: string) => void;
}

export const ChecklistCategoryCard = ({ 
  category, 
  categoryIndex, 
  progress, 
  onItemCheck, 
  onUploadRedirect 
}: ChecklistCategoryCardProps) => {
  const CategoryIcon = category.icon;
  const { categoryProgress, categoryTotal, categoryPercentage } = progress;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CategoryIcon className={`h-6 w-6 ${category.color}`} />
            <div>
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <CardDescription>
                {categoryProgress} de {categoryTotal} documentos marcados
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <Badge variant={categoryPercentage === 100 ? "default" : "secondary"}>
              {categoryPercentage}%
            </Badge>
            <Progress value={categoryPercentage} className="w-20 h-2 mt-2" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {category.items.map((item, itemIndex) => (
          <ChecklistItem
            key={item.id}
            item={item}
            categoryName={category.name}
            onCheck={(checked) => onItemCheck(categoryIndex, itemIndex, checked)}
            onUploadRedirect={onUploadRedirect}
          />
        ))}
      </CardContent>
    </Card>
  );
};