
import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Activity {
  id: number;
  type: "meeting" | "document" | "training";
  title: string;
  date: string;
  status: "scheduled" | "completed" | "cancelled" | "pending";
  description?: string;
}

interface ActivityListProps {
  activities: Activity[];
  limit?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  limit,
  showViewAll = true,
  onViewAll,
}) => {
  const navigate = useNavigate();
  const displayActivities = limit ? activities.slice(0, limit) : activities;

  const handleActivityClick = (activity: Activity) => {
    toast({
      title: activity.title,
      description: activity.description || `Detalhes da atividade ${activity.id}`,
    });
  };

  return (
    <div className="space-y-4">
      {displayActivities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start p-3 border-b last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => handleActivityClick(activity)}
        >
          <div className="mr-3">
            {activity.type === "meeting" && (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            )}
            {activity.type === "document" && (
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-legacy-purple-500" />
              </div>
            )}
            {activity.type === "training" && (
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-green-600" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium">{activity.title}</h3>
            <p className="text-xs text-gray-500">{activity.date}</p>
            <div className="mt-1">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  activity.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : activity.status === "scheduled"
                    ? "bg-blue-100 text-blue-800"
                    : activity.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {activity.status === "completed"
                  ? "Concluído"
                  : activity.status === "scheduled"
                  ? "Agendado"
                  : activity.status === "cancelled"
                  ? "Cancelado"
                  : "Pendente"}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="ml-2">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {showViewAll && activities.length > (limit || 0) && (
        <Button
          variant="ghost"
          className="w-full mt-4 text-gray-600"
          onClick={onViewAll}
        >
          Ver Todas as Atividades
        </Button>
      )}
    </div>
  );
};

export default ActivityList;
