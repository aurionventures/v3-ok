import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, CheckCircle2, Clock, AlertCircle, User } from 'lucide-react';
import { useMeetingActions, type MeetingActionFormData } from '@/hooks/useMeetingActions';
import { useMeetingParticipants } from '@/hooks/useMeetingParticipants';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReuniaoPendenciasProps {
  meetingId: string;
}

export const ReuniaoPendencias = ({ meetingId }: ReuniaoPendenciasProps) => {
  const { actions, loading, createAction, updateAction, deleteAction } = useMeetingActions(meetingId);
  const { participants } = useMeetingParticipants(meetingId);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formData, setFormData] = useState<MeetingActionFormData>({
    description: '',
    due_date: '',
    status: 'PENDENTE',
    priority: 'MEDIA',
    responsible_external_name: '',
    responsible_external_email: '',
  });

  const resetForm = () => {
    setFormData({
      description: '',
      due_date: '',
      status: 'PENDENTE',
      priority: 'MEDIA',
      responsible_external_name: '',
      responsible_external_email: '',
    });
    setEditingAction(null);
  };

  const handleSubmit = async () => {
    if (editingAction) {
      await updateAction(editingAction.id, formData);
    } else {
      await createAction(formData);
    }
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (action: any) => {
    setEditingAction(action);
    setFormData({
      description: action.description,
      due_date: action.due_date,
      status: action.status,
      priority: action.priority,
      category: action.category || '',
      notes: action.notes || '',
      responsible_external_name: action.responsible_external_name || '',
      responsible_external_email: action.responsible_external_email || '',
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (actionId: string) => {
    if (confirm('Tem certeza que deseja excluir esta pendência?')) {
      await deleteAction(actionId);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any }> = {
      'PENDENTE': { variant: 'outline', icon: Clock },
      'EM_ANDAMENTO': { variant: 'default', icon: Clock },
      'CONCLUIDA': { variant: 'secondary', icon: CheckCircle2 },
      'ATRASADA': { variant: 'destructive', icon: AlertCircle },
    };

    const config = variants[status] || variants['PENDENTE'];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      'BAIXA': 'bg-blue-500/10 text-blue-500',
      'MEDIA': 'bg-yellow-500/10 text-yellow-500',
      'ALTA': 'bg-red-500/10 text-red-500',
    };

    return (
      <Badge className={colors[priority] || colors['MEDIA']}>
        {priority}
      </Badge>
    );
  };

  const filteredActions = statusFilter === 'all' 
    ? actions 
    : actions.filter(action => action.status === statusFilter);

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Combinados e Pendências</h2>
          <p className="text-muted-foreground">Acompanhe as ações definidas na reunião</p>
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="PENDENTE">Pendente</SelectItem>
              <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
              <SelectItem value="ATRASADA">Atrasada</SelectItem>
              <SelectItem value="CONCLUIDA">Concluída</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Pendência
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingAction ? 'Editar Pendência' : 'Nova Pendência'}</DialogTitle>
                <DialogDescription>
                  Registre um combinado ou pendência da reunião
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva a ação ou pendência"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="due_date">Prazo *</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BAIXA">Baixa</SelectItem>
                        <SelectItem value="MEDIA">Média</SelectItem>
                        <SelectItem value="ALTA">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDENTE">Pendente</SelectItem>
                        <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                        <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Ex: Financeiro, Estratégia"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsible">Responsável *</Label>
                  <Select
                    value={formData.responsible_external_name || ''}
                    onValueChange={(participantId) => {
                      const participant = participants.find(p => p.id === participantId);
                      if (participant) {
                        setFormData({
                          ...formData,
                          responsible_external_name: participant.external_name || '',
                          responsible_external_email: participant.external_email || '',
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um participante da reunião" />
                    </SelectTrigger>
                    <SelectContent>
                      {participants.length > 0 ? (
                        participants.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.external_name} ({p.role})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          Nenhum participante cadastrado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {formData.responsible_external_email && (
                    <p className="text-xs text-muted-foreground mt-1">
                      📧 {formData.responsible_external_email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Informações adicionais"
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={!formData.description || !formData.due_date}>
                  {editingAction ? 'Salvar Alterações' : 'Adicionar Pendência'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredActions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {statusFilter === 'all' 
                ? 'Nenhuma pendência cadastrada ainda.'
                : 'Nenhuma pendência encontrada com o filtro aplicado.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell className="max-w-md">
                    <div>
                      <p className="font-medium">{action.description}</p>
                      {action.category && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {action.category}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {action.responsible_external_name ? (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{action.responsible_external_name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Não atribuído</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(action.due_date), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>{getPriorityBadge(action.priority)}</TableCell>
                  <TableCell>{getStatusBadge(action.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(action)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(action.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};
