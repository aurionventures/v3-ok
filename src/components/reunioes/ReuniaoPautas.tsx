import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, GripVertical, Lock, FileText } from 'lucide-react';
import { useMeetingItems, type MeetingItemFormData } from '@/hooks/useMeetingItems';

interface ReuniaoPautasProps {
  meetingId: string;
}

export const ReuniaoPautas = ({ meetingId }: ReuniaoPautasProps) => {
  const { items, loading, createItem, updateItem, deleteItem } = useMeetingItems(meetingId);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<MeetingItemFormData>({
    title: '',
    description: '',
    type: 'Informativo',
    presenter: '',
    duration_minutes: 15,
    is_sensitive: false,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'Informativo',
      presenter: '',
      duration_minutes: 15,
      is_sensitive: false,
    });
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    if (editingItem) {
      await updateItem(editingItem.id, formData);
    } else {
      await createItem(formData);
    }
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      type: item.type,
      presenter: item.presenter || '',
      duration_minutes: item.duration_minutes || 15,
      is_sensitive: item.is_sensitive,
      detailed_script: item.detailed_script || '',
      expected_outcome: item.expected_outcome || '',
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (itemId: string) => {
    if (confirm('Tem certeza que deseja excluir esta pauta?')) {
      await deleteItem(itemId);
    }
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      'Deliberação': 'default',
      'Informativo': 'secondary',
      'Discussão': 'outline',
    };
    return <Badge variant={variants[type] || 'outline'}>{type}</Badge>;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pautas da Reunião</h2>
          <p className="text-muted-foreground">Gerencie os itens da agenda</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Pauta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar Pauta' : 'Nova Pauta'}</DialogTitle>
              <DialogDescription>
                Preencha os detalhes da pauta da reunião
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Aprovação do orçamento anual"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Deliberação">Deliberação</SelectItem>
                      <SelectItem value="Informativo">Informativo</SelectItem>
                      <SelectItem value="Discussão">Discussão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duração (minutos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="presenter">Apresentador</Label>
                <Input
                  id="presenter"
                  value={formData.presenter}
                  onChange={(e) => setFormData({ ...formData, presenter: e.target.value })}
                  placeholder="Nome do responsável pela apresentação"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva os pontos principais a serem discutidos"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected">Resultado Esperado</Label>
                <Textarea
                  id="expected"
                  value={formData.expected_outcome}
                  onChange={(e) => setFormData({ ...formData, expected_outcome: e.target.value })}
                  placeholder="O que se espera alcançar com esta pauta"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="sensitive"
                  checked={formData.is_sensitive}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_sensitive: checked })}
                />
                <Label htmlFor="sensitive" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Pauta sensível (acesso restrito)
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={!formData.title}>
                {editingItem ? 'Salvar Alterações' : 'Adicionar Pauta'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma pauta cadastrada ainda.</p>
            <p className="text-sm text-muted-foreground">Comece adicionando os itens da agenda.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GripVertical className="h-5 w-5 cursor-move" />
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {item.title}
                        {item.is_sensitive && <Lock className="h-4 w-4 text-amber-500" />}
                      </CardTitle>
                      {item.description && (
                        <CardDescription className="mt-1">{item.description}</CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {getTypeBadge(item.type)}
                  {item.presenter && <Badge variant="outline">👤 {item.presenter}</Badge>}
                  {item.duration_minutes && <Badge variant="outline">⏱️ {item.duration_minutes} min</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
