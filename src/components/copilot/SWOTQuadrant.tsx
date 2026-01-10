import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  AlertTriangle,
  ExternalLink,
  BarChart3,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { SWOTItem, SWOTCategory } from "@/types/copilot";

interface SWOTQuadrantProps {
  title: string;
  category: SWOTCategory;
  items: SWOTItem[];
  className?: string;
}

const quadrantConfig = {
  strength: {
    icon: ThumbsUp,
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-400",
    iconColor: "text-green-600",
  },
  weakness: {
    icon: ThumbsDown,
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    textColor: "text-red-700 dark:text-red-400",
    iconColor: "text-red-600",
  },
  opportunity: {
    icon: Lightbulb,
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-400",
    iconColor: "text-blue-600",
  },
  threat: {
    icon: AlertTriangle,
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    textColor: "text-orange-700 dark:text-orange-400",
    iconColor: "text-orange-600",
  },
};

const trendConfig = {
  improving: {
    icon: TrendingUp,
    color: "text-green-600",
    label: "Melhorando",
  },
  worsening: {
    icon: TrendingDown,
    color: "text-red-600",
    label: "Piorando",
  },
  stable: {
    icon: Minus,
    color: "text-gray-500",
    label: "Estável",
  },
};

const impactConfig = {
  high: {
    label: "Alto",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  medium: {
    label: "Médio",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  low: {
    label: "Baixo",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400",
  },
};

function SWOTItemCard({ item }: { item: SWOTItem }) {
  const trend = trendConfig[item.trend];
  const impact = impactConfig[item.impact];
  const TrendIcon = trend.icon;

  return (
    <div className="bg-white dark:bg-background p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-sm leading-tight flex-1 pr-2">
          {item.title}
        </h4>
        <div className="flex items-center gap-2 flex-shrink-0">
          <TrendIcon className={cn("h-4 w-4", trend.color)} />
          <Badge className={cn("text-[9px]", impact.color)}>{impact.label}</Badge>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3">{item.description}</p>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          {item.dataSource === "external" ? (
            <ExternalLink className="h-3 w-3" />
          ) : item.dataSource === "internal" ? (
            <BarChart3 className="h-3 w-3" />
          ) : (
            <BarChart3 className="h-3 w-3" />
          )}
          <span>
            {item.dataSource === "external"
              ? "Externo"
              : item.dataSource === "internal"
              ? "Interno"
              : "Misto"}
          </span>
        </div>
        <span>
          Atualizado{" "}
          {formatDistanceToNow(new Date(item.lastUpdated), {
            addSuffix: true,
            locale: ptBR,
          })}
        </span>
      </div>

      {item.relatedMetrics.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <div className="flex flex-wrap gap-1">
            {item.relatedMetrics.slice(0, 3).map((metric, i) => (
              <Badge key={i} variant="secondary" className="text-[9px]">
                {metric}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SWOTQuadrant({ title, category, items, className }: SWOTQuadrantProps) {
  const config = quadrantConfig[category];
  const QuadrantIcon = config.icon;

  return (
    <Card
      className={cn(
        "p-5 border-2",
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("p-2 rounded-lg", config.bgColor)}>
          <QuadrantIcon className={cn("h-5 w-5", config.iconColor)} />
        </div>
        <h3 className={cn("text-lg font-bold", config.textColor)}>{title}</h3>
        <Badge variant="outline" className="ml-auto">
          {items.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <SWOTItemCard key={item.id} item={item} />
        ))}
      </div>
    </Card>
  );
}

export default SWOTQuadrant;




