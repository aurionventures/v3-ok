import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CheckCircle2, Clock, AlertCircle, Search, ListTodo, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PendingTasksReportModal } from "./PendingTasksReportModal";
import { SecretariatSearchChat } from "./SecretariatSearchChat";

interface SecretariatDashboardProps {
  onOpenConvocations?: () => void;
  onOpenMaterials?: () => void;
  onViewMeeting?: (meetingId: string) => void;
}

export const SecretariatDashboard = ({ 
  onOpenConvocations, 
  onOpenMaterials,
  onViewMeeting 
}: SecretariatDashboardProps) => {
  const { toast } = useToast();
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Mock data - Apenas tarefas e materiais
  const pendingTasks = [
    { id: "1", task: "Enviar convocação - Conselho de Administração", priority: "high" as const, dueDate: new Date(2025, 0, 20) },
    { id: "2", task: "Aprovar materiais - Comitê de Auditoria", priority: "medium" as const, dueDate: new Date(2025, 0, 23) },
    { id: "3", task: "Confirmar presença dos membros", priority: "low" as const, dueDate: new Date(2025, 0, 24) },
  ];

  const materialsAwaitingApproval = [
    { id: "1", name: "Relatório Financeiro Q4 2024.pdf", uploadedBy: "João Silva", uploadedAt: new Date(2025, 0, 18) },
    { id: "2", name: "Proposta de Orçamento 2025.xlsx", uploadedBy: "Maria Santos", uploadedAt: new Date(2025, 0, 18) },
  ];

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleGenerateReport = () => {
    setReportModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search" className="gap-2">
            <Search className="h-4 w-4" />
            Busca Inteligente
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <ListTodo className="h-4 w-4" />
            Tarefas Pendentes
          </TabsTrigger>
          <TabsTrigger value="materials" className="gap-2">
            <FileCheck className="h-4 w-4" />
            Materiais
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-6">
          <SecretariatSearchChat />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  Tarefas Pendentes
                  <Badge variant="secondary">{pendingTasks.length}</Badge>
                </CardTitle>
                <CardDescription>Ações que requerem sua atenção</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGenerateReport}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Gerar Relatório
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-start justify-between gap-4 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                    <div className="flex items-start gap-3 flex-1">
                      {getPriorityIcon(task.priority)}
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{task.task}</p>
                        <p className="text-xs text-muted-foreground">
                          Prazo: {format(task.dueDate, "dd 'de' MMMM", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      Concluir
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Materiais Aguardando Aprovação
              </CardTitle>
              <CardDescription>Documentos enviados para revisão</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {materialsAwaitingApproval.map((material) => (
                  <div key={material.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border bg-card">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{material.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Enviado por {material.uploadedBy} em {format(material.uploadedAt, "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Rejeitar
                      </Button>
                      <Button size="sm">
                        Aprovar
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4" onClick={onOpenMaterials}>
                  Ver Todos os Materiais
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PendingTasksReportModal 
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        tasks={pendingTasks}
      />
    </div>
  );
};
