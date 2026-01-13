import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PriorityMatrix as PriorityMatrixType, AgendaTopic } from "@/types/copilot";

interface PriorityMatrixProps {
  matrix: PriorityMatrixType;
  topics: AgendaTopic[];
  onTopicClick?: (topicId: string) => void;
}

function getTopicTitle(topics: AgendaTopic[], id: string): string {
  const topic = topics.find((t) => t.id === id);
  return topic?.title || id;
}

function getTopicPriority(topics: AgendaTopic[], id: string): string {
  const topic = topics.find((t) => t.id === id);
  return topic?.priority || "medium";
}

export function PriorityMatrix({ matrix, topics, onTopicClick }: PriorityMatrixProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Must Discuss */}
      <Card className="p-4 border-l-4 border-l-destructive bg-destructive/5 dark:bg-destructive/10">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <h4 className="font-semibold text-sm text-destructive dark:text-destructive">
            Obrigatório
          </h4>
          <Badge className="ml-auto bg-destructive text-destructive-foreground text-[10px]">
            {matrix.mustDiscuss.length}
          </Badge>
        </div>
        <ul className="space-y-2">
          {matrix.mustDiscuss.map((id) => (
            <li
              key={id}
              className="text-xs p-2 bg-white dark:bg-background rounded border border-destructive/20 dark:border-destructive/20 cursor-pointer hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors"
              onClick={() => onTopicClick?.(id)}
            >
              <span className="line-clamp-2">{getTopicTitle(topics, id)}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Should Discuss */}
      <Card className="p-4 border-l-4 border-l-warning bg-warning/5 dark:bg-warning/10">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h4 className="font-semibold text-sm text-warning dark:text-warning">
            Importante
          </h4>
          <Badge className="ml-auto bg-warning text-warning-foreground text-[10px]">
            {matrix.shouldDiscuss.length}
          </Badge>
        </div>
        <ul className="space-y-2">
          {matrix.shouldDiscuss.map((id) => (
            <li
              key={id}
              className="text-xs p-2 bg-white dark:bg-background rounded border border-warning/20 dark:border-warning/20 cursor-pointer hover:bg-warning/10 dark:hover:bg-warning/20 transition-colors"
              onClick={() => onTopicClick?.(id)}
            >
              <span className="line-clamp-2">{getTopicTitle(topics, id)}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Could Discuss */}
      <Card className="p-4 border-l-4 border-l-primary bg-primary/5 dark:bg-primary/10">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-primary" />
          <h4 className="font-semibold text-sm text-primary dark:text-primary">
            Se houver tempo
          </h4>
          <Badge className="ml-auto bg-primary text-primary-foreground text-[10px]">
            {matrix.couldDiscuss.length}
          </Badge>
        </div>
        <ul className="space-y-2">
          {matrix.couldDiscuss.map((id) => (
            <li
              key={id}
              className="text-xs p-2 bg-white dark:bg-background rounded border border-primary/20 dark:border-primary/20 cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
              onClick={() => onTopicClick?.(id)}
            >
              <span className="line-clamp-2">{getTopicTitle(topics, id)}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Future Topics */}
      <Card className="p-4 border-l-4 border-l-muted-foreground/50 bg-muted/30 dark:bg-muted/20">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <h4 className="font-semibold text-sm text-muted-foreground">
            Próximas Reuniões
          </h4>
          <Badge className="ml-auto bg-muted-foreground/80 text-background text-[10px]">
            {matrix.futureTopics.length}
          </Badge>
        </div>
        <ul className="space-y-2">
          {matrix.futureTopics.map((topic, i) => (
            <li
              key={i}
              className="text-xs p-2 bg-white dark:bg-background rounded border border-border"
            >
              <span className="line-clamp-2 text-muted-foreground">{topic}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export default PriorityMatrix;




