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
    color: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
    icon: Target,
  },
  risk: {
    label: "Risco",
    color: "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive",
    icon: Shield,
  },
  opportunity: {
    label: "Oportunidade",
    color: "bg-success/10 text-success dark:bg-success/20 dark:text-success",
    icon: Lightbulb,
  },
  governance: {
    label: "Governança",
    color: "bg-accent text-accent-foreground dark:bg-accent dark:text-accent-foreground",
    icon: Settings,
  },
  operational: {
    label: "Operacional",
    color: "bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground",
    icon: TrendingUp,
  },
};

const priorityConfig = {
  critical: {
    label: "Crítico",
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/5 dark:bg-destructive/10",
    borderColor: "border-destructive/20 dark:border-destructive/20",
  },
  high: {
    label: "Alto",
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/5 dark:bg-warning/10",
    borderColor: "border-warning/20 dark:border-warning/20",
  },
  medium: {
    label: "Médio",
    icon: Info,
    color: "text-primary",
    bgColor: "bg-primary/5 dark:bg-primary/10",
    borderColor: "border-primary/20 dark:border-primary/20",
  },
  low: {
    label: "Baixo",
    icon: Info,
    color: "text-muted-foreground",
    bgColor: "bg-muted/50 dark:bg-muted/30",
    borderColor: "border-border",
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
        topic.priority === "critical" ? "border-l-destructive" : "",
        topic.priority === "high" ? "border-l-warning" : "",
        topic.priority === "medium" ? "border-l-primary" : "",
        topic.priority === "low" ? "border-l-muted-foreground/50" : ""
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
                  <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 flex-shrink-0" />
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
                    className="text-[9px] bg-destructive/5 text-destructive border-destructive/20 dark:bg-destructive/10 dark:text-destructive dark:border-destructive/20"
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
                    className="text-[9px] bg-success/5 text-success border-success/20 dark:bg-success/10 dark:text-success dark:border-success/20"
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




