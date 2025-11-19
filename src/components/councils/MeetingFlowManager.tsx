import React, { useState } from "react";
import { Calendar, Clock, MapPin, Users, FileText, Upload, Mic, CheckCircle2, AlertCircle, Plus, X, Save, Bot, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { MeetingSchedule, AgendaItem, Task, CouncilDocument } from "@/types/annualSchedule";
import { MeetingRealizationChecker } from "./MeetingRealizationChecker";

interface MeetingFlowManagerProps {
  meeting: MeetingSchedule;
  onUpdateMeeting: (updates: Partial<MeetingSchedule>) => void;
}

const getStepStatus = (meeting: MeetingSchedule, step: string) => {
  switch (step) {
    case "agenda":
      return meeting.agenda && meeting.agenda.length > 0 ? "completed" : "pending";
    case "documents":
      return meeting.preMeetingDocs && meeting.preMeetingDocs.length > 0 ? "completed" : "pending";
    case "meeting":
      return meeting.status === "Realizada" || meeting.status === "ATA Gerada" ? "completed" : "pending";
    case "recording":
      return meeting.recording ? "completed" : "pending";
    case "minutes":
      return meeting.minutes ? "completed" : "pending";
    default:
      return "pending";
  }
};

const getProgressPercentage = (meeting: MeetingSchedule) => {
  const steps = ["agenda", "documents", "meeting", "recording", "minutes"];
  const completedSteps = steps.filter(step => getStepStatus(meeting, step) === "completed").length;
  return Math.round((completedSteps / steps.length) * 100);
};

export const MeetingFlowManager: React.FC<MeetingFlowManagerProps> = ({ meeting, onUpdateMeeting }) => {
  const [newAgendaItem, setNewAgendaItem] = useState<Partial<AgendaItem>>({});
  const [newTask, setNewTask] = useState<Partial<Task>>({});
  const [isGeneratingMinutes, setIsGeneratingMinutes] = useState(false);
  const [nextMeetingTopics, setNextMeetingTopics] = useState(meeting.nextMeetingTopics?.join('\n') || '');

  const handleAddAgendaItem = () => {
    if (!newAgendaItem.title || !newAgendaItem.presenter) {
      toast({
        title: "Erro",
        description: "Título e apresentador são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const agendaItem: AgendaItem = {
      id: Date.now().toString(),
      title: newAgendaItem.title,
      description: newAgendaItem.description || "",
      presenter: newAgendaItem.presenter,
      duration: newAgendaItem.duration || 30,
      order: (meeting.agenda?.length || 0) + 1,
      type: newAgendaItem.type || "Discussão",
      keyPoints: newAgendaItem.keyPoints || [],
      detailedScript: newAgendaItem.detailedScript || "",
      expectedOutcome: newAgendaItem.expectedOutcome || "",
    };

    const updatedAgenda = [...(meeting.agenda || []), agendaItem];
    onUpdateMeeting({ 
      agenda: updatedAgenda,
      status: meeting.status === "Agendada" ? "Pauta Definida" : meeting.status 
    });
    setNewAgendaItem({});
    
    toast({
      title: "Item adicionado",
      description: "Item da pauta adicionado com sucesso",
    });
  };

  const handleRemoveAgendaItem = (itemId: string) => {
    const updatedAgenda = meeting.agenda?.filter(item => item.id !== itemId) || [];
    onUpdateMeeting({ agenda: updatedAgenda });
    
    toast({
      title: "Item removido",
      description: "Item da pauta removido com sucesso",
    });
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.assignee) {
      toast({
        title: "Erro",
        description: "Título e responsável são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || "",
      assignee: newTask.assignee,
      dueDate: newTask.dueDate || "",
      status: "Pendente",
      priority: newTask.priority || "Média",
      category: "",
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [...(meeting.tasks || []), task];
    onUpdateMeeting({ tasks: updatedTasks });
    setNewTask({});
    
    toast({
      title: "Tarefa adicionada",
      description: "Tarefa adicionada com sucesso",
    });
  };

  const handleGenerateMinutes = async () => {
    setIsGeneratingMinutes(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const minutes = {
        full: `ATA INTEGRAL DA REUNIÃO\n\n${meeting.council}\nData: ${new Date(meeting.date).toLocaleDateString('pt-BR')}\nHorário: ${meeting.time}\n\nPresentes:\n- José Silva (Presidente)\n- Maria Silva (Conselheira)\n- Roberto Mendes (Conselheiro Externo)\n\nPauta Discutida:\n${meeting.agenda?.map(item => `- ${item.title}: ${item.description}`).join('\n') || 'Pauta não definida'}\n\nDeliberações:\n- Todas as propostas foram aprovadas por unanimidade\n- Definidos próximos passos para implementação\n\nTarefas Definidas:\n${meeting.tasks?.map(task => `- ${task.title} (${task.assignee})`).join('\n') || 'Nenhuma tarefa definida'}\n\nReunião encerrada às ${meeting.time}.`,
        summary: `RESUMO EXECUTIVO - ${meeting.council}\n\nData: ${new Date(meeting.date).toLocaleDateString('pt-BR')}\n\nPrincipais Deliberações:\n- Aprovação das propostas apresentadas\n- Definição de cronograma de implementação\n- Aprovação do orçamento para próximo trimestre\n\nPróximos Passos:\n- Implementação das decisões aprovadas\n- Acompanhamento das métricas definidas\n\nPróxima Reunião: A ser definida`,
        generatedAt: new Date().toISOString(),
      };

      onUpdateMeeting({ 
        minutes,
        status: "ATA Gerada",
        nextMeetingTopics: nextMeetingTopics.split('\n').filter(topic => topic.trim())
      });
      
      setIsGeneratingMinutes(false);
      
      toast({
        title: "ATAs geradas",
        description: "ATAs integral e otimizada foram geradas com sucesso",
      });
    }, 3000);
  };


  const handleUploadRecording = () => {
    // Simulate file upload
    const recording = {
      type: "audio" as const,
      url: "/placeholder-audio.mp3",
      uploadedAt: new Date().toISOString(),
    };

    onUpdateMeeting({ recording });
    
    toast({
      title: "Gravação enviada",
      description: "Gravação da reunião foi enviada com sucesso",
    });
  };

  const daysUntilMeeting = Math.ceil((new Date(meeting.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isPastMeeting = daysUntilMeeting < 0;
  const isAgendaEditable = daysUntilMeeting > 7 || meeting.status === "Agendada";

  return (
    <div className="space-y-6">
      {/* Meeting Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{meeting.council}</CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(meeting.date).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {meeting.time}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {meeting.modalidade}
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge 
                variant="outline" 
                className={
                  meeting.status === "ATA Gerada" ? "bg-green-100 text-green-800" :
                  meeting.status === "Realizada" ? "bg-purple-100 text-purple-800" :
                  meeting.status === "Docs Enviados" ? "bg-orange-100 text-orange-800" :
                  meeting.status === "Pauta Definida" ? "bg-yellow-100 text-yellow-800" :
                  "bg-blue-100 text-blue-800"
                }
              >
                {meeting.status}
              </Badge>
              <div className="text-sm text-gray-500 mt-1">
                {isPastMeeting ? `${Math.abs(daysUntilMeeting)} dias atrás` : 
                 daysUntilMeeting === 0 ? 'Hoje' : `${daysUntilMeeting} dias`}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso da Reunião</span>
                <span>{getProgressPercentage(meeting)}%</span>
              </div>
              <Progress value={getProgressPercentage(meeting)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Flow Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Agenda Definition */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Definição de Pauta
                {getStepStatus(meeting, "agenda") === "completed" && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
              </CardTitle>
              {daysUntilMeeting > 30 && (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {meeting.agenda?.map((item) => (
                <div key={item.id} className="flex items-start justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.presenter} • {item.duration}min • {item.type}
                    </div>
                  </div>
                  {isAgendaEditable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAgendaItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              {isAgendaEditable && (
                <div className="space-y-3 p-3 border-2 border-dashed border-gray-200 rounded">
                  <Input
                    placeholder="Título do item"
                    value={newAgendaItem.title || ""}
                    onChange={(e) => setNewAgendaItem({ ...newAgendaItem, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Descrição"
                    value={newAgendaItem.description || ""}
                    onChange={(e) => setNewAgendaItem({ ...newAgendaItem, description: e.target.value })}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Apresentador"
                      value={newAgendaItem.presenter || ""}
                      onChange={(e) => setNewAgendaItem({ ...newAgendaItem, presenter: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Duração (min)"
                      value={newAgendaItem.duration || ""}
                      onChange={(e) => setNewAgendaItem({ ...newAgendaItem, duration: parseInt(e.target.value) })}
                    />
                    <Select value={newAgendaItem.type} onValueChange={(value) => setNewAgendaItem({ ...newAgendaItem, type: value as any })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Deliberação">Deliberação</SelectItem>
                        <SelectItem value="Informativo">Informativo</SelectItem>
                        <SelectItem value="Discussão">Discussão</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddAgendaItem} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pre-Meeting Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Documentos Prévios
              {getStepStatus(meeting, "documents") === "completed" && (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {meeting.preMeetingDocs?.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{(doc as any).name}</div>
                    <div className="text-sm text-gray-600">{(doc as any).type} • {((doc as any).size / 1024).toFixed(1)} KB</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver
                  </Button>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  <Upload className="h-8 w-8 mx-auto mb-2" />
                  <p>Nenhum documento enviado</p>
                  <Button variant="outline" className="mt-2">
                    Enviar Documentos
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Meeting Realization with ATA Support */}
        <MeetingRealizationChecker 
          meeting={meeting}
          onUpdateMeeting={onUpdateMeeting}
        />

        {/* Recording Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Gravação da Reunião
              {getStepStatus(meeting, "recording") === "completed" && (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {meeting.recording ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-700 font-medium">Gravação enviada</p>
                  <p className="text-sm text-gray-600">
                    Tipo: {meeting.recording.type} • 
                    Enviado em: {new Date(meeting.recording.uploadedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ) : meeting.status === "Realizada" ? (
                <div className="text-center py-4">
                  <Mic className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-700 mb-4">Enviar gravação da reunião</p>
                  <Button onClick={handleUploadRecording}>
                    <Upload className="h-4 w-4 mr-2" />
                    Enviar Gravação
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Mic className="h-8 w-8 mx-auto mb-2" />
                  <p>Aguardando realização da reunião</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Generated Minutes */}
      {meeting.minutes && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>ATA Integral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 overflow-y-auto bg-gray-50 p-4 rounded whitespace-pre-line text-sm">
                {meeting.minutes.full}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ATA Otimizada (Publicação)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 overflow-y-auto bg-gray-50 p-4 rounded whitespace-pre-line text-sm">
                {meeting.minutes.summary}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tasks and Next Meeting Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Tarefas e Combinados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {meeting.tasks?.map((task) => (
                <div key={task.id} className="p-3 bg-gray-50 rounded">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-600">{task.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {task.assignee} • {task.dueDate && new Date(task.dueDate).toLocaleDateString('pt-BR')} • {task.priority}
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        task.status === "Concluída" ? "bg-green-100 text-green-800" :
                        task.status === "Em Andamento" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }
                    >
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))}

              {meeting.status === "Realizada" && (
                <div className="space-y-3 p-3 border-2 border-dashed border-gray-200 rounded">
                  <Input
                    placeholder="Título da tarefa"
                    value={newTask.title || ""}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Descrição"
                    value={newTask.description || ""}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Responsável"
                      value={newTask.assignee || ""}
                      onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    />
                    <Input
                      type="date"
                      value={newTask.dueDate || ""}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                    <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value as any })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddTask} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Tarefa
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Meeting Topics */}
        <Card>
          <CardHeader>
            <CardTitle>Assuntos para Próxima Reunião</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Assuntos que não foram discutidos e devem ir para a próxima reunião..."
                value={nextMeetingTopics}
                onChange={(e) => setNextMeetingTopics(e.target.value)}
                rows={6}
              />
              <Button 
                onClick={() => {
                  onUpdateMeeting({ 
                    nextMeetingTopics: nextMeetingTopics.split('\n').filter(topic => topic.trim()) 
                  });
                  toast({
                    title: "Assuntos salvos",
                    description: "Assuntos para próxima reunião foram salvos",
                  });
                }}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Assuntos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};