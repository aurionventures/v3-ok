import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Clock, CheckCircle2, FileDown, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { generatePendingTasksReportPDF, ReportTask } from "./PendingTasksReportPDF";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGovernanceOrgans } from "@/hooks/useGovernanceOrgans";

interface Task {
  id: string;
  task: string;
  priority: "high" | "medium" | "low";
  dueDate: Date;
  organ?: string;
}

interface PendingTasksReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: Task[];
}

export const PendingTasksReportModal = ({
  open,
  onOpenChange,
  tasks,
}: PendingTasksReportModalProps) => {
  const { toast } = useToast();
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedOrgans, setSelectedOrgans] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Buscar todos os órgãos de governança
  const { organs: allOrgans } = useGovernanceOrgans();

  // Organizar órgãos por tipo
  const organsByType = useMemo(() => {
    return {
      conselhos: allOrgans.filter(o => o.organ_type === 'conselho'),
      comites: allOrgans.filter(o => o.organ_type === 'comite'),
      comissoes: allOrgans.filter(o => o.organ_type === 'comissao'),
    };
  }, [allOrgans]);

  // Enriquecer tarefas com órgãos e tipos
  const enrichedTasks: ReportTask[] = useMemo(() => {
    return tasks.map(task => {
      // Tentar encontrar o órgão baseado no nome da tarefa
      let organ = task.organ;
      let organType: 'conselho' | 'comite' | 'comissao' = 'conselho';

      if (!organ) {
        // Buscar nos órgãos mockados
        const foundOrgan = allOrgans.find(o => 
          task.task.toLowerCase().includes(o.name.toLowerCase())
        );
        
        if (foundOrgan) {
          organ = foundOrgan.name;
          organType = foundOrgan.organ_type as 'conselho' | 'comite' | 'comissao';
        } else {
          // Fallback baseado em palavras-chave
          if (task.task.toLowerCase().includes('conselho')) {
            organType = 'conselho';
            organ = 'Conselho de Administração';
          } else if (task.task.toLowerCase().includes('comitê')) {
            organType = 'comite';
            organ = 'Comitê de Auditoria';
          } else if (task.task.toLowerCase().includes('comissão')) {
            organType = 'comissao';
            organ = 'Comissão de Ética';
          } else {
            organ = 'Secretaria Geral';
          }
        }
      }

      return {
        ...task,
        organ,
        organType,
      };
    });
  }, [tasks, allOrgans]);

  // Filtrar tarefas
  const filteredTasks = useMemo(() => {
    return enrichedTasks.filter((task) => {
      const priorityMatch = selectedPriorities.length === 0 || 
        selectedPriorities.includes(task.priority);
      const organMatch = selectedOrgans.length === 0 || 
        selectedOrgans.includes(task.organ);
      return priorityMatch && organMatch;
    });
  }, [enrichedTasks, selectedPriorities, selectedOrgans]);

  // Calcular resumo
  const summary = useMemo(() => {
    return {
      total: filteredTasks.length,
      highPriority: filteredTasks.filter(t => t.priority === "high").length,
      mediumPriority: filteredTasks.filter(t => t.priority === "medium").length,
      lowPriority: filteredTasks.filter(t => t.priority === "low").length,
      byOrganType: {
        conselhos: filteredTasks.filter(t => t.organType === 'conselho').length,
        comites: filteredTasks.filter(t => t.organType === 'comite').length,
        comissoes: filteredTasks.filter(t => t.organType === 'comissao').length,
      },
    };
  }, [filteredTasks]);

  const handleTogglePriority = (priority: string) => {
    setSelectedPriorities(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const handleToggleOrgan = (organName: string) => {
    setSelectedOrgans(prev =>
      prev.includes(organName)
        ? prev.filter(o => o !== organName)
        : [...prev, organName]
    );
  };

  const handleSelectAllOrgansOfType = (type: 'conselho' | 'comite' | 'comissao') => {
    const organsOfType = organsByType[
      type === 'conselho' ? 'conselhos' : 
      type === 'comite' ? 'comites' : 
      'comissoes'
    ].map(o => o.name);

    const allSelected = organsOfType.every(name => selectedOrgans.includes(name));

    if (allSelected) {
      // Desselecionar todos deste tipo
      setSelectedOrgans(prev => prev.filter(name => !organsOfType.includes(name)));
    } else {
      // Selecionar todos deste tipo
      setSelectedOrgans(prev => [...new Set([...prev, ...organsOfType])]);
    }
  };

  const handleExportPDF = async () => {
    setIsGenerating(true);
    try {
      // Preparar dados com filtros organizados por tipo
      const organsByTypeSelected = {
        conselhos: selectedOrgans.filter(name => 
          organsByType.conselhos.some(o => o.name === name)
        ),
        comites: selectedOrgans.filter(name => 
          organsByType.comites.some(o => o.name === name)
        ),
        comissoes: selectedOrgans.filter(name => 
          organsByType.comissoes.some(o => o.name === name)
        ),
      };

      await generatePendingTasksReportPDF({
        filters: {
          priorities: selectedPriorities,
          organs: selectedOrgans,
          organsByType: organsByTypeSelected,
        },
        tasks: filteredTasks,
        summary,
      });
      
      toast({
        title: "PDF Gerado com Sucesso",
        description: `Relatório com ${filteredTasks.length} tarefas exportado.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao Gerar PDF",
        description: "Não foi possível exportar o relatório.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Alta";
      case "medium": return "Média";
      case "low": return "Baixa";
      default: return priority;
    }
  };

  const getOrganTypeColor = (organType: string) => {
    switch (organType) {
      case 'conselho': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'comite': return 'bg-green-100 text-green-700 border-green-300';
      case 'comissao': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getOrganTypeLabel = (organType: string) => {
    switch (organType) {
      case 'conselho': return 'Conselho';
      case 'comite': return 'Comitê';
      case 'comissao': return 'Comissão';
      default: return organType;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-blue-600" />
            Gerar Relatório de Pendências
          </DialogTitle>
          <DialogDescription>
            Configure os filtros por órgãos de governança e visualize o relatório antes de exportar
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="filters" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="filters" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <FileDown className="h-4 w-4" />
              Preview ({filteredTasks.length})
            </TabsTrigger>
          </TabsList>

          {/* ABA DE FILTROS */}
          <TabsContent value="filters" className="flex-1 overflow-y-auto space-y-6 mt-4">
            {/* Filtro de Prioridade */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-gray-600" />
                Prioridade
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {["high", "medium", "low"].map((priority) => (
                  <div
                    key={priority}
                    className={`flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPriorities.includes(priority)
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleTogglePriority(priority)}
                  >
                    <Checkbox
                      checked={selectedPriorities.includes(priority)}
                      onCheckedChange={() => handleTogglePriority(priority)}
                    />
                    {getPriorityIcon(priority)}
                    <Label className="cursor-pointer flex-1 font-medium">
                      {getPriorityLabel(priority)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* CONSELHOS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  Conselhos
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSelectAllOrgansOfType('conselho')}
                  className="h-7 text-xs"
                >
                  {organsByType.conselhos.every(o => selectedOrgans.includes(o.name))
                    ? 'Desmarcar Todos'
                    : 'Selecionar Todos'}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {organsByType.conselhos.map((organ) => (
                  <div
                    key={organ.id}
                    className={`flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedOrgans.includes(organ.name)
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/30"
                    }`}
                    onClick={() => handleToggleOrgan(organ.name)}
                  >
                    <Checkbox
                      checked={selectedOrgans.includes(organ.name)}
                      onCheckedChange={() => handleToggleOrgan(organ.name)}
                    />
                    <Label className="cursor-pointer flex-1 text-sm">
                      {organ.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* COMITÊS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  Comitês
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSelectAllOrgansOfType('comite')}
                  className="h-7 text-xs"
                >
                  {organsByType.comites.every(o => selectedOrgans.includes(o.name))
                    ? 'Desmarcar Todos'
                    : 'Selecionar Todos'}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {organsByType.comites.map((organ) => (
                  <div
                    key={organ.id}
                    className={`flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedOrgans.includes(organ.name)
                        ? "border-green-500 bg-green-50 shadow-sm"
                        : "border-gray-200 hover:border-green-200 hover:bg-green-50/30"
                    }`}
                    onClick={() => handleToggleOrgan(organ.name)}
                  >
                    <Checkbox
                      checked={selectedOrgans.includes(organ.name)}
                      onCheckedChange={() => handleToggleOrgan(organ.name)}
                    />
                    <Label className="cursor-pointer flex-1 text-sm">
                      {organ.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* COMISSÕES */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  Comissões
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSelectAllOrgansOfType('comissao')}
                  className="h-7 text-xs"
                >
                  {organsByType.comissoes.every(o => selectedOrgans.includes(o.name))
                    ? 'Desmarcar Todos'
                    : 'Selecionar Todos'}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {organsByType.comissoes.map((organ) => (
                  <div
                    key={organ.id}
                    className={`flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedOrgans.includes(organ.name)
                        ? "border-yellow-500 bg-yellow-50 shadow-sm"
                        : "border-gray-200 hover:border-yellow-200 hover:bg-yellow-50/30"
                    }`}
                    onClick={() => handleToggleOrgan(organ.name)}
                  >
                    <Checkbox
                      checked={selectedOrgans.includes(organ.name)}
                      onCheckedChange={() => handleToggleOrgan(organ.name)}
                    />
                    <Label className="cursor-pointer flex-1 text-sm">
                      {organ.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Resumo dos Filtros */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  Resumo do Relatório
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Por Prioridade */}
                  <div>
                    <Label className="text-xs text-blue-700 mb-2 block">Por Prioridade</Label>
                    <div className="grid grid-cols-4 gap-3 text-center">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
                        <div className="text-xs text-muted-foreground">Total</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-red-500">{summary.highPriority}</div>
                        <div className="text-xs text-muted-foreground">Alta</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-yellow-500">{summary.mediumPriority}</div>
                        <div className="text-xs text-muted-foreground">Média</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-green-500">{summary.lowPriority}</div>
                        <div className="text-xs text-muted-foreground">Baixa</div>
                      </div>
                    </div>
                  </div>

                  {/* Por Tipo de Órgão */}
                  <div>
                    <Label className="text-xs text-blue-700 mb-2 block">Por Tipo de Órgão</Label>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-blue-100 p-3 rounded-lg border border-blue-300">
                        <div className="text-2xl font-bold text-blue-700">{summary.byOrganType.conselhos}</div>
                        <div className="text-xs text-blue-600">Conselhos</div>
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg border border-green-300">
                        <div className="text-2xl font-bold text-green-700">{summary.byOrganType.comites}</div>
                        <div className="text-xs text-green-600">Comitês</div>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-300">
                        <div className="text-2xl font-bold text-yellow-700">{summary.byOrganType.comissoes}</div>
                        <div className="text-xs text-yellow-600">Comissões</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA DE PREVIEW */}
          <TabsContent value="preview" className="flex-1 overflow-y-auto space-y-4 mt-4">
            {filteredTasks.length === 0 ? (
              <Card className="bg-gray-50 border-dashed border-2">
                <CardContent className="text-center py-16">
                  <FileDown className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Nenhuma tarefa encontrada
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Ajuste os filtros para visualizar as tarefas pendentes
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Cabeçalho do Preview */}
                <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                      Relatório de Tarefas Pendentes
                    </CardTitle>
                    <p className="text-sm text-blue-100">
                      Gerado em {format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </CardHeader>
                </Card>

                {/* Lista de Tarefas */}
                <div className="space-y-3">
                  {filteredTasks.map((task, index) => (
                    <Card key={task.id} className="hover:shadow-lg transition-all border-l-4" style={{
                      borderLeftColor: 
                        task.priority === 'high' ? '#ef4444' :
                        task.priority === 'medium' ? '#f59e0b' :
                        '#10b981'
                    }}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-sm shadow-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs font-semibold ${getOrganTypeColor(task.organType)}`}
                                >
                                  {getOrganTypeLabel(task.organType)}
                                </Badge>
                              </div>
                              <p className="font-semibold text-gray-900 leading-relaxed">
                                {task.task}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5 text-gray-500" />
                                  {format(task.dueDate, "dd/MM/yyyy")}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="font-medium text-gray-700">{task.organ}</span>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={
                              task.priority === "high" ? "destructive" :
                              task.priority === "medium" ? "default" :
                              "secondary"
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 shadow-sm"
                          >
                            {getPriorityIcon(task.priority)}
                            <span className="font-semibold">{getPriorityLabel(task.priority)}</span>
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer com Botão de Exportar */}
        <div className="flex items-center justify-between pt-4 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'tarefa' : 'tarefas'}
            </Badge>
            {selectedOrgans.length > 0 && (
              <Badge variant="outline" className="text-sm px-3 py-1">
                {selectedOrgans.length} {selectedOrgans.length === 1 ? 'órgão' : 'órgãos'}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleExportPDF}
              disabled={filteredTasks.length === 0 || isGenerating}
              className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-md"
            >
              <FileDown className="h-4 w-4" />
              {isGenerating ? "Gerando PDF..." : "Exportar PDF"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
