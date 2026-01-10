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
      <Card className="p-4 border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <h4 className="font-semibold text-sm text-red-700 dark:text-red-400">
            Obrigatório
          </h4>
          <Badge className="ml-auto bg-red-600 text-white text-[10px]">
            {matrix.mustDiscuss.length}
          </Badge>
        </div>
        <ul className="space-y-2">
          {matrix.mustDiscuss.map((id) => (
            <li
              key={id}
              className="text-xs p-2 bg-white dark:bg-background rounded border border-red-200 dark:border-red-800 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              onClick={() => onTopicClick?.(id)}
            >
              <span className="line-clamp-2">{getTopicTitle(topics, id)}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Should Discuss */}
      <Card className="p-4 border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <h4 className="font-semibold text-sm text-orange-700 dark:text-orange-400">
            Importante
          </h4>
          <Badge className="ml-auto bg-orange-500 text-white text-[10px]">
            {matrix.shouldDiscuss.length}
          </Badge>
        </div>
        <ul className="space-y-2">
          {matrix.shouldDiscuss.map((id) => (
            <li
              key={id}
              className="text-xs p-2 bg-white dark:bg-background rounded border border-orange-200 dark:border-orange-800 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
              onClick={() => onTopicClick?.(id)}
            >
              <span className="line-clamp-2">{getTopicTitle(topics, id)}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Could Discuss */}
      <Card className="p-4 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-blue-600" />
          <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-400">
            Se houver tempo
          </h4>
          <Badge className="ml-auto bg-blue-500 text-white text-[10px]">
            {matrix.couldDiscuss.length}
          </Badge>
        </div>
        <ul className="space-y-2">
          {matrix.couldDiscuss.map((id) => (
            <li
              key={id}
              className="text-xs p-2 bg-white dark:bg-background rounded border border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              onClick={() => onTopicClick?.(id)}
            >
              <span className="line-clamp-2">{getTopicTitle(topics, id)}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Future Topics */}
      <Card className="p-4 border-l-4 border-l-gray-400 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-gray-600" />
          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-400">
            Próximas Reuniões
          </h4>
          <Badge className="ml-auto bg-gray-500 text-white text-[10px]">
            {matrix.futureTopics.length}
          </Badge>
        </div>
        <ul className="space-y-2">
          {matrix.futureTopics.map((topic, i) => (
            <li
              key={i}
              className="text-xs p-2 bg-white dark:bg-background rounded border border-gray-200 dark:border-gray-700"
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




