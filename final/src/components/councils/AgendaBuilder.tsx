import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical, Clock } from 'lucide-react';
import { AgendaItem } from '@/types/annualSchedule';

interface AgendaBuilderProps {
  agenda?: AgendaItem[];
  onUpdate: (agenda: AgendaItem[]) => void;
}

export default function AgendaBuilder({ agenda = [], onUpdate }: AgendaBuilderProps) {
  const [items, setItems] = useState<AgendaItem[]>(agenda);
  const [newItem, setNewItem] = useState<Partial<AgendaItem>>({
    title: '',
    description: '',
    presenter: '',
    duration: 30,
    type: 'Informativo',
  });

  const addItem = () => {
    if (!newItem.title || !newItem.presenter) return;

    const item: AgendaItem = {
      id: crypto.randomUUID(),
      title: newItem.title,
      description: newItem.description || '',
      presenter: newItem.presenter,
      duration: newItem.duration || 30,
      order: items.length + 1,
      type: (newItem.type as AgendaItem['type']) || 'Informativo',
      keyPoints: [],
      detailedScript: '',
      expectedOutcome: '',
    };

    const updatedItems = [...items, item];
    setItems(updatedItems);
    onUpdate(updatedItems);
    
    setNewItem({
      title: '',
      description: '',
      presenter: '',
      duration: 30,
      type: 'Informativo',
    });
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    onUpdate(updatedItems);
  };

  const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Itens da Pauta</h3>
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" />
          {totalDuration} minutos
        </Badge>
      </div>

      {/* Lista de itens existentes */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-move" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{index + 1}. {item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.presenter}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{item.type}</Badge>
                    <Badge variant="outline">{item.duration} min</Badge>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulário para novo item */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h4 className="font-medium">Adicionar Item</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Título</Label>
              <Input
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Ex: Apresentação de Resultados Q4"
              />
            </div>

            <div className="col-span-2">
              <Label>Descrição (opcional)</Label>
              <Textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Breve descrição do item"
                rows={2}
              />
            </div>

            <div>
              <Label>Apresentador</Label>
              <Input
                value={newItem.presenter}
                onChange={(e) => setNewItem({ ...newItem, presenter: e.target.value })}
                placeholder="Nome do apresentador"
              />
            </div>

            <div>
              <Label>Tipo</Label>
              <Select
                value={newItem.type}
                onValueChange={(value) => setNewItem({ ...newItem, type: value as AgendaItem['type'] })}
              >
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

            <div className="col-span-2">
              <Label>Duração (minutos)</Label>
              <Input
                type="number"
                value={newItem.duration}
                onChange={(e) => setNewItem({ ...newItem, duration: parseInt(e.target.value) || 30 })}
                min={5}
                step={5}
              />
            </div>
          </div>

          <Button onClick={addItem} className="w-full" disabled={!newItem.title || !newItem.presenter}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Item
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
