import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileText,
  Clock,
  Target,
  TrendingUp,
  Shield,
  Lightbulb,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgendaTopic } from "@/types/copilot";

interface TopicCardProps {
  topic: AgendaTopic;
  index: number;
  onSelect?: (topic: AgendaTopic) => void;
}

const categoryConfig = {
  strategic: {
    label: "Estratégico",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Target,
  },
  risk: {
    label: "Risco",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    icon: Shield,
  },
  opportunity: {
    label: "Oportunidade",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    icon: Lightbulb,
  },
  governance: {
    label: "Governança",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    icon: Settings,
  },
  operational: {
    label: "Operacional",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400",
    icon: TrendingUp,
  },
};

const priorityConfig = {
  critical: {
    label: "Crítico",
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
  },
  high: {
    label: "Alto",
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  medium: {
    label: "Médio",
    icon: Info,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  low: {
    label: "Baixo",
    icon: Info,
    color: "text-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-900/30",
    borderColor: "border-gray-200 dark:border-gray-700",
  },
};

export function TopicCard({ topic, index, onSelect }: TopicCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const category = categoryConfig[topic.category];
  const priority = priorityConfig[topic.priority];
  const PriorityIcon = priority.icon;
  const CategoryIcon = category.icon;

  return (
    <Card
      className={cn(
        "p-4 transition-all hover:shadow-lg cursor-pointer border-l-4",
        priority.bgColor,
        topic.priority === "critical" ? "border-l-red-500" : "",
        topic.priority === "high" ? "border-l-orange-500" : "",
        topic.priority === "medium" ? "border-l-blue-500" : "",
        topic.priority === "low" ? "border-l-gray-400" : ""
      )}
      onClick={() => onSelect?.(topic)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-muted-foreground bg-background/80 px-2 py-0.5 rounded">
            #{index}
          </span>
          <PriorityIcon className={cn("h-4 w-4", priority.color)} />
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {topic.estimatedDuration} min
        </div>
      </div>

      {/* Title */}
      <h4 className="font-semibold text-sm mb-2 leading-tight">{topic.title}</h4>

      {/* Category Badge */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge className={cn("text-[10px] gap-1", category.color)}>
          <CategoryIcon className="h-3 w-3" />
          {category.label}
        </Badge>
        <Badge variant="outline" className="text-[10px]">
          {priority.label}
        </Badge>
      </div>

      {/* Rationale */}
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {topic.rationale}
      </p>

      {/* Expandable Details */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs gap-1 h-7"
            onClick={(e) => e.stopPropagation()}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3" />
                Ocultar detalhes
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                Ver detalhes
              </>
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-3 space-y-4">
          {/* Suggested Actions */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Ações Sugeridas
            </p>
            <ul className="space-y-1.5">
              {topic.suggestedActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Risks */}
          {topic.relatedData.risks.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Riscos Relacionados
              </p>
              <div className="flex flex-wrap gap-1">
                {topic.relatedData.risks.map((risk, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-[9px] bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800"
                  >
                    {risk}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related Opportunities */}
          {topic.relatedData.opportunities.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Oportunidades
              </p>
              <div className="flex flex-wrap gap-1">
                {topic.relatedData.opportunities.map((opp, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-[9px] bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800"
                  >
                    {opp}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* External Factors */}
          {topic.relatedData.externalFactors.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Fatores Externos
              </p>
              <div className="flex flex-wrap gap-1">
                {topic.relatedData.externalFactors.map((factor, i) => (
                  <Badge key={i} variant="secondary" className="text-[9px]">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Preparation Materials */}
          {topic.preparationMaterials.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Materiais de Preparação
              </p>
              <ul className="space-y-1">
                {topic.preparationMaterials.map((material, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    {material}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default TopicCard;




