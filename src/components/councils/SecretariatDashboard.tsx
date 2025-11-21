import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Library, ListTodo, UserCheck, FileDown, FileText, Building2, Users, UserCog, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PendingTasksReportModal } from "./PendingTasksReportModal";
import { generatePendingTasksReportPDF } from "./PendingTasksReportPDF";
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

  const handleQuickReport = async (type: 'all' | 'conselho' | 'comite' | 'comissao') => {
    toast({
      title: "Gerando Relatório...",
      description: "Aguarde enquanto preparamos o documento PDF.",
    });

    try {
      // Filtrar tarefas baseado no tipo
      const filteredForReport = type === 'all' 
        ? pendingTasks 
        : pendingTasks.filter(t => t.organType === type);

      // Calcular resumo
      const summary = {
        total: filteredForReport.length,
        byOrganType: {
          conselhos: filteredForReport.filter(t => t.organType === 'conselho').length,
          comites: filteredForReport.filter(t => t.organType === 'comite').length,
          comissoes: filteredForReport.filter(t => t.organType === 'comissao').length,
        },
      };

      // Gerar PDF diretamente
      await generatePendingTasksReportPDF({
        filters: {
          priorities: [],
          organs: [],
          organsByType: {
            conselhos: type === 'conselho' || type === 'all' ? filteredForReport.filter(t => t.organType === 'conselho').map(t => t.organName!) : [],
            comites: type === 'comite' || type === 'all' ? filteredForReport.filter(t => t.organType === 'comite').map(t => t.organName!) : [],
            comissoes: type === 'comissao' || type === 'all' ? filteredForReport.filter(t => t.organType === 'comissao').map(t => t.organName!) : [],
          },
        },
        tasks: filteredForReport.map(task => ({
          ...task,
          organ: task.organName || 'Secretaria Geral',
          organType: task.organType as 'conselho' | 'comite' | 'comissao',
        })),
        summary,
      });

      toast({
        title: "✅ PDF Gerado com Sucesso",
        description: `Relatório com ${filteredForReport.length} tarefa(s) exportado.`,
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro ao Gerar PDF",
        description: "Não foi possível exportar o relatório.",
        variant: "destructive",
      });
    }
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
            <CardHeader className="pb-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-blue-500" />
                  Tarefas Pendentes
                  <Badge variant="secondary">{filteredTasks.length}</Badge>
                </CardTitle>
                <CardDescription>Ações que requerem sua atenção</CardDescription>
              </div>
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

                {/* Relatórios Rápidos */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                      <FileDown className="h-4 w-4" />
                      Relatórios Rápidos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {/* Botão: Todas as Tarefas */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-auto py-3 px-4 flex flex-col items-center gap-2 hover:bg-blue-100 hover:border-blue-400 transition-all"
                        onClick={() => handleQuickReport('all')}
                      >
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-xs font-medium">Todas Tarefas</span>
                        <Badge variant="secondary" className="text-xs">{pendingTasks.length}</Badge>
                      </Button>

                      {/* Botão: Conselhos */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-auto py-3 px-4 flex flex-col items-center gap-2 hover:bg-blue-100 hover:border-blue-400 transition-all"
                        onClick={() => handleQuickReport('conselho')}
                      >
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <span className="text-xs font-medium">Conselhos</span>
                        <Badge variant="secondary" className="text-xs">
                          {pendingTasks.filter(t => t.organType === 'conselho').length}
                        </Badge>
                      </Button>

                      {/* Botão: Comitês */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-auto py-3 px-4 flex flex-col items-center gap-2 hover:bg-green-100 hover:border-green-400 transition-all"
                        onClick={() => handleQuickReport('comite')}
                      >
                        <Users className="h-5 w-5 text-green-600" />
                        <span className="text-xs font-medium">Comitês</span>
                        <Badge variant="secondary" className="text-xs">
                          {pendingTasks.filter(t => t.organType === 'comite').length}
                        </Badge>
                      </Button>

                      {/* Botão: Comissões */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-auto py-3 px-4 flex flex-col items-center gap-2 hover:bg-amber-100 hover:border-amber-400 transition-all"
                        onClick={() => handleQuickReport('comissao')}
                      >
                        <UserCog className="h-5 w-5 text-amber-600" />
                        <span className="text-xs font-medium">Comissões</span>
                        <Badge variant="secondary" className="text-xs">
                          {pendingTasks.filter(t => t.organType === 'comissao').length}
                        </Badge>
                      </Button>

                      {/* Botão: Personalizado */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-auto py-3 px-4 flex flex-col items-center gap-2 hover:bg-purple-100 hover:border-purple-400 transition-all"
                        onClick={() => setReportModalOpen(true)}
                      >
                        <Settings className="h-5 w-5 text-purple-600" />
                        <span className="text-xs font-medium">Personalizado</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

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
