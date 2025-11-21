import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Library, ListTodo, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PendingTasksReportModal } from "./PendingTasksReportModal";
import { ATALibrary } from "./ATALibrary";
import { GuestDocumentApproval } from "./GuestDocumentApproval";

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
  const [organFilter, setOrganFilter] = useState('all');

  // Mock data - Tarefas com órgãos
  const pendingTasks = [
    { 
      id: "1", 
      task: "Enviar convocação para reunião de fevereiro", 
      organType: "conselho",
      organName: "Conselho de Administração",
      dueDate: new Date(2025, 1, 5) 
    },
    { 
      id: "2", 
      task: "Confirmar presença dos membros", 
      organType: "comite",
      organName: "Comitê de Auditoria",
      dueDate: new Date(2025, 1, 8) 
    },
    { 
      id: "3", 
      task: "Preparar materiais para pauta", 
      organType: "comissao",
      organName: "Comissão de Ética",
      dueDate: new Date(2025, 1, 10) 
    },
    { 
      id: "4", 
      task: "Agendar reunião extraordinária", 
      organType: "conselho",
      organName: "Conselho Fiscal",
      dueDate: new Date(2025, 1, 12) 
    },
    { 
      id: "5", 
      task: "Enviar ATA para aprovação", 
      organType: "comite",
      organName: "Comitê de Auditoria",
      dueDate: new Date(2025, 1, 15) 
    }
  ];

  const filteredTasks = pendingTasks.filter(task => {
    if (organFilter === 'all') return true;
    return task.organType === organFilter;
  });

  const handleGenerateReport = () => {
    setReportModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="library" className="gap-2">
            <Library className="h-4 w-4" />
            Bibliotecas
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <ListTodo className="h-4 w-4" />
            Tarefas Pendentes
          </TabsTrigger>
          <TabsTrigger value="guests" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Aprovação de Convidados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="mt-6">
          <ATALibrary />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-blue-500" />
                  Tarefas Pendentes
                  <Badge variant="secondary">{filteredTasks.length}</Badge>
                </CardTitle>
                <CardDescription>Ações que requerem sua atenção</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGenerateReport}
                className="gap-2"
              >
                <ListTodo className="h-4 w-4" />
                Gerar Relatório
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filter */}
                <Select value={organFilter} onValueChange={setOrganFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por tipo de órgão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Órgãos</SelectItem>
                    <SelectItem value="conselho">Conselhos</SelectItem>
                    <SelectItem value="comite">Comitês</SelectItem>
                    <SelectItem value="comissao">Comissões</SelectItem>
                  </SelectContent>
                </Select>

                {/* Tasks List */}
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma tarefa encontrada para este filtro</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div key={task.id} className="flex items-start justify-between gap-4 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium leading-none">{task.task}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {task.organName}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Prazo: {format(task.dueDate, "dd 'de' MMMM", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        Concluir
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guests" className="mt-6">
          <GuestDocumentApproval />
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
