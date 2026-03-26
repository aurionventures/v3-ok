import React from "react";
import { ActivitySquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActivityFilters from "@/components/ActivityFilters";
import ActivityItem from "@/components/ActivityItem";
import { useEnhancedActivities } from "@/hooks/useEnhancedActivities";

const ActivitiesLogTab = () => {
  const { 
    activities, 
    filters, 
    updateFilter,
    totalCount 
  } = useEnhancedActivities();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ActivitySquare className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Histórico de Atividades</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Acompanhe todas as atividades e ações realizadas na plataforma
      </p>
      
      <Card className="border-border/50">
        <CardContent className="p-4">
          <ActivityFilters
            filters={filters}
            onFilterChange={updateFilter}
            resultCount={activities.length}
            totalCount={totalCount}
          />
          
          <ScrollArea className="h-[400px] mt-4">
            <div className="space-y-1">
              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <ActivitySquare className="h-12 w-12 mb-4 opacity-50" />
                  <p>Nenhuma atividade encontrada</p>
                </div>
              ) : (
                activities.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivitiesLogTab;
