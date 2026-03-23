import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { InsightCardItem } from "@/services/insightsEstrategicos";

export function InsightCard({
  item,
  borderColor,
}: {
  item: InsightCardItem;
  borderColor: "red" | "amber" | "green";
}) {
  const borderClass =
    borderColor === "red"
      ? "border-l-4 border-l-red-500"
      : borderColor === "amber"
        ? "border-l-4 border-l-amber-500"
        : "border-l-4 border-l-green-500";

  return (
    <Card className={`rounded-lg shadow-sm border overflow-hidden ${borderClass}`}>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {item.statusTags.map((tag) => (
            <Badge
              key={tag.label}
              variant="secondary"
              className={`${tag.bgClass} ${tag.textClass} border-0 font-medium`}
            >
              {tag.label}
            </Badge>
          ))}
        </div>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{item.title}</h3>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <p className="text-sm text-gray-600">{item.description}</p>
        {item.actions.length > 0 && (
          <div>
            <p className={`text-xs font-bold uppercase tracking-wide ${item.accentColor} mb-2`}>
              AÇÕES RECOMENDADAS
            </p>
            <ul className="space-y-1.5">
              {item.actions.map((action) => (
                <li key={action.label} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-gray-400">→</span>
                  {action.href ? (
                    <Link to={action.href} className="hover:underline flex items-center gap-1">
                      {action.label}
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </Link>
                  ) : (
                    <span>{action.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
