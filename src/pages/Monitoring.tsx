import React from "react";
import { Link } from "react-router-dom";
import { Clock, Shield, Leaf, Activity, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useActivities } from "@/hooks/useActivities";
import ActivityList from "@/components/ActivityList";
import RiskMatrix from "@/components/RiskMatrix";

// Import shared risk data
import { ibgcRisks } from "@/data/riskData";

// Convert activities to ActivityList format
const convertToActivityFormat = (logs: any[]) => {
  return logs.map(log => ({
    id: parseInt(log.id),
    type: log.action.includes("ESG") ? "document" as const : 
          log.action.includes("Quiz") || log.action.includes("Avaliação") ? "training" as const : 
          "meeting" as const,
    title: log.action,
    date: log.timestamp.toLocaleDateString('pt-BR'),
    status: "completed" as const,
    description: log.details
  }));
};

const Monitoring = () => {
  const { activityLogs, formatDate } = useActivities();
  const activitiesForList = convertToActivityFormat(activityLogs);

  return (
    <div className="h-screen flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Monitoramento" />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Sistema de Monitoramento Integrado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="risk" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="risk">Gestão de Riscos</TabsTrigger>
                  <TabsTrigger value="esg">ESG</TabsTrigger>
                  <TabsTrigger value="activities">Atividades</TabsTrigger>
                </TabsList>

                <TabsContent value="risk" className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Gestão de Riscos IBGC</h3>
                        <p className="text-sm text-muted-foreground">
                          Matriz de riscos e análise baseada nas diretrizes IBGC
                        </p>
                      </div>
                      <Link to="/ibgc-risk-management">
                        <Button>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver Sistema Completo
                        </Button>
                      </Link>
                    </div>

                    {/* Mini Risk Matrix */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Matriz de Riscos - Resumo</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RiskMatrix risks={ibgcRisks.slice(0, 4)} />
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-destructive">2</div>
                            <div className="text-sm text-muted-foreground">Riscos Ativos</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">0</div>
                            <div className="text-sm text-muted-foreground">Riscos Críticos</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="esg" className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Monitoramento ESG</h3>
                        <p className="text-sm text-muted-foreground">
                          Indicadores ambientais, sociais e de governança
                        </p>
                      </div>
                      <Link to="/esg">
                        <Button>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver Dashboard ESG
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-100">
                              <Leaf className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Ambiental</h4>
                              <p className="text-2xl font-bold text-green-600">85%</p>
                              <p className="text-xs text-muted-foreground">Score atual</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100">
                              <Activity className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Social</h4>
                              <p className="text-2xl font-bold text-blue-600">78%</p>
                              <p className="text-xs text-muted-foreground">Score atual</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-100">
                              <Shield className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Governança</h4>
                              <p className="text-2xl font-bold text-purple-600">92%</p>
                              <p className="text-xs text-muted-foreground">Score atual</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="activities" className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Atividades do Sistema</h3>
                        <p className="text-sm text-muted-foreground">
                          Histórico completo de ações e eventos
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Última atualização: {formatDate(new Date())}
                        </span>
                      </div>
                    </div>

                    {/* Recent Activities */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Atividades Recentes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {activityLogs.slice(0, 5).map((log) => (
                            <div key={log.id} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                              <Avatar className="h-10 w-10 mt-1">
                                <AvatarFallback className="bg-primary text-primary-foreground">{log.userInitials}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium text-foreground">{log.user}</h4>
                                  <span className="text-sm text-muted-foreground flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatDate(log.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground mt-1">{log.action}</p>
                                {log.details && <p className="text-sm text-muted-foreground mt-1">{log.details}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* All Activities */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Todas as Atividades</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ActivityList 
                          activities={activitiesForList} 
                          showViewAll={false}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;