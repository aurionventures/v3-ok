import React, { useState } from "react";
import { Plus, Calendar, User, Tag, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Task } from "@/types/annualSchedule";

interface TaskKanbanBoardProps {
  tasks: Task[];
  onTaskAdd: (task: Omit<Task, 'id'>) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
}

const taskCategories = [
  "Financeiro",
  "Estratégico", 
  "Operacional",
  "Jurídico",
  "Recursos Humanos",
  "Tecnologia",
  "Marketing",
  "Outros"
];

const priorityColors = {
  "Baixa": "bg-green-500",
  "Média": "bg-yellow-500", 
  "Alta": "bg-red-500"
};

export function TaskKanbanBoard({ 
  tasks, 
  onTaskAdd, 
  onTaskUpdate, 
  onTaskDelete 
}: TaskKanbanBoardProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    dueDate: "",
    priority: "Média" as Task['priority'],
    category: ""
  });

  const columns = [
    { id: "Pendente", title: "Pendente", color: "border-l-gray-400" },
    { id: "Em Andamento", title: "Em Andamento", color: "border-l-blue-400" },
    { id: "Concluída", title: "Concluída", color: "border-l-green-400" }
  ];

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim() || !newTask.assignee.trim()) return;

    const task: Omit<Task, 'id'> = {
      ...newTask,
      status: "Pendente",
      createdAt: new Date().toISOString()
    };

    onTaskAdd(task);
    setNewTask({
      title: "",
      description: "",
      assignee: "",
      dueDate: "",
      priority: "Média",
      category: ""
    });
    setIsAddingTask(false);
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    onTaskUpdate(taskId, { status: newStatus });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tarefas e Combinados
          </CardTitle>
          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título da tarefa"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição detalhada"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Responsável</Label>
                    <Input
                      value={newTask.assignee}
                      onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                      placeholder="Nome do responsável"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Data Limite</Label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prioridade</Label>
                    <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value as Task['priority'] }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select value={newTask.category} onValueChange={(value) => setNewTask(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskCategories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddTask} className="flex-1">
                    Adicionar Tarefa
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {columns.map(column => (
            <div key={column.id} className={`border-l-4 ${column.color} pl-4`}>
              <div className="mb-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  {column.title}
                </h3>
                <div className="text-xs text-muted-foreground mt-1">
                  {getTasksByStatus(column.id as Task['status']).length} tarefa(s)
                </div>
              </div>

              <div className="space-y-3">
                {getTasksByStatus(column.id as Task['status']).map(task => (
                  <Card key={task.id} className="p-3 cursor-grab hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-3 w-3 text-muted-foreground" />
                        <h4 className="font-medium text-sm flex-1">{task.title}</h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onTaskDelete(task.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {task.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{task.assignee}</span>
                      </div>

                      {task.dueDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-500 font-medium' : ''}`}>
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]} mr-1`} />
                          {task.priority}
                        </Badge>
                        
                        {task.category && (
                          <Badge variant="secondary" className="text-xs">
                            {task.category}
                          </Badge>
                        )}
                      </div>

                      {/* Status change buttons */}
                      <div className="flex gap-1 pt-2">
                        {column.id !== "Pendente" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-6"
                            onClick={() => handleStatusChange(task.id, "Pendente")}
                          >
                            Pendente
                          </Button>
                        )}
                        {column.id !== "Em Andamento" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-6"
                            onClick={() => handleStatusChange(task.id, "Em Andamento")}
                          >
                            Em Andamento
                          </Button>
                        )}
                        {column.id !== "Concluída" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-6"
                            onClick={() => handleStatusChange(task.id, "Concluída")}
                          >
                            Concluir
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                {getTasksByStatus(column.id as Task['status']).length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8 border-2 border-dashed rounded-lg">
                    Nenhuma tarefa
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}