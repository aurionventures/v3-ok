import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActivityFilters from "@/components/ActivityFilters";
import ActivityItem from "@/components/ActivityItem";
import { useEnhancedActivities } from "@/hooks/useEnhancedActivities";

const ActivitiesPage = () => {
  const navigate = useNavigate();
  const { activities, totalCount, filters, updateFilter } = useEnhancedActivities();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Log de Atividades" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Registro de Atividades
              </h2>
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">
                Histórico Completo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ActivityFilters
                filters={filters}
                onFilterChange={updateFilter}
                resultCount={activities.length}
                totalCount={totalCount}
              />
              
              <ScrollArea className="h-[calc(100vh-340px)]">
                <div className="space-y-1">
                  {activities.length > 0 ? (
                    activities.map(activity => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Nenhuma atividade encontrada</p>
                      <p className="text-sm mt-1">Tente ajustar os filtros</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;
