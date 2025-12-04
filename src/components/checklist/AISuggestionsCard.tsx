import { Card, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";
interface AISuggestionsCardProps {
  suggestions: string;
}
export const AISuggestionsCard = ({
  suggestions
}: AISuggestionsCardProps) => {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Bot className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-sm mb-1">Sugestões de IA</h4>
            <p className="text-sm text-muted-foreground">{suggestions}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};