import { Card, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";

interface AISuggestionsCardProps {
  suggestions: string;
}

export const AISuggestionsCard = ({ suggestions }: AISuggestionsCardProps) => {
  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Bot className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Sugestão da IA</h3>
            <p className="text-sm text-blue-700">{suggestions}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};