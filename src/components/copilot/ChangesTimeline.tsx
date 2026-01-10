import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SWOTChange } from "@/types/copilot";

interface ChangesTimelineProps {
  changes: SWOTChange[];
}

const changeTypeConfig = {
  new: {
    icon: PlusCircle,
    label: "Novo",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  improved: {
    icon: TrendingUp,
    label: "Melhorou",
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  worsened: {
    icon: TrendingDown,
    label: "Piorou",
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
  resolved: {
    icon: CheckCircle2,
    label: "Resolvido",
    color: "text-gray-600",
    bgColor: "bg-gray-100 dark:bg-gray-800/50",
  },
};

const categoryConfig = {
  strength: {
    icon: ThumbsUp,
    label: "Força",
    color: "text-green-600",
  },
  weakness: {
    icon: ThumbsDown,
    label: "Fraqueza",
    color: "text-red-600",
  },
  opportunity: {
    icon: Lightbulb,
    label: "Oportunidade",
    color: "text-blue-600",
  },
  threat: {
    icon: AlertTriangle,
    label: "Ameaça",
    color: "text-orange-600",
  },
};

export function ChangesTimeline({ changes }: ChangesTimelineProps) {
  if (changes.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        Nenhuma mudança significativa na última semana.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {changes.map((change, index) => {
        const typeConfig = changeTypeConfig[change.type];
        const catConfig = categoryConfig[change.category];
        const TypeIcon = typeConfig.icon;
        const CatIcon = catConfig.icon;

        return (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-background border"
          >
            <div
              className={cn(
                "p-2 rounded-full flex-shrink-0",
                typeConfig.bgColor
              )}
            >
              <TypeIcon className={cn("h-4 w-4", typeConfig.color)} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn("text-[10px] gap-1", typeConfig.color)}
                >
                  {typeConfig.label}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-[10px] gap-1"
                >
                  <CatIcon className={cn("h-3 w-3", catConfig.color)} />
                  {catConfig.label}
                </Badge>
              </div>

              <p className="font-medium text-sm mb-1">{change.item}</p>
              <p className="text-xs text-muted-foreground">
                {change.explanation}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChangesTimeline;




