import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, X, Calendar, User, CheckCircle2, Circle, Pencil
} from 'lucide-react';
import { CustomCriterion, CriteriaProgress } from '@/types/criteria';
import { CriterionDefinition } from '@/data/criteriaData';

interface CriteriaManagerProps {
  categoryKey: 'heir' | 'board_member' | 'key_position' | 'development';
  standardCriteria: CriterionDefinition[];
  selectedStandardCriteria: Record<string, boolean>;
  customCriteria: CustomCriterion[];
  onStandardChange: (key: string, value: boolean) => void;
  onCustomAdd: (criterion: Omit<CustomCriterion, 'id' | 'createdAt'>) => void;
  onCustomUpdate: (id: string, criterion: Partial<CustomCriterion>) => void;
  onCustomRemove: (id: string) => void;
}

export const CriteriaManager: React.FC<CriteriaManagerProps> = ({
  standardCriteria,
  selectedStandardCriteria,
  customCriteria,
  onStandardChange,
  onCustomAdd,
  onCustomUpdate,
  onCustomRemove
}) => {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [editingCustomId, setEditingCustomId] = useState<string | null>(null);
  const [newCustomCriterion, setNewCustomCriterion] = useState({
    label: '',
    description: '',
    dueDate: '',
    assignedTo: '',
    completed: false
  });

  // Calculate progress
  const standardTotal = standardCriteria.length;
  const standardCompleted = Object.values(selectedStandardCriteria).filter(Boolean).length;
  const customTotal = customCriteria.length;
  const customCompleted = customCriteria.filter(c => c.completed).length;
  const totalCriteria = standardTotal + customTotal;
  const totalCompleted = standardCompleted + customCompleted;
  const progressPercentage = totalCriteria > 0 ? Math.round((totalCompleted / totalCriteria) * 100) : 0;

  const handleAddCustomCriterion = () => {
    if (!newCustomCriterion.label.trim()) return;

    onCustomAdd({
      label: newCustomCriterion.label,
      description: newCustomCriterion.description || undefined,
      dueDate: newCustomCriterion.dueDate || undefined,
      assignedTo: newCustomCriterion.assignedTo || undefined,
      completed: false
    });

    setNewCustomCriterion({
      label: '',
      description: '',
      dueDate: '',
      assignedTo: '',
      completed: false
    });
    setIsAddingCustom(false);
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Critérios de Avaliação</h3>
            <p className="text-sm text-muted-foreground">
              Marque os critérios atendidos para calcular a prontidão
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{progressPercentage}%</div>
            <div className="text-sm text-muted-foreground">
              {totalCompleted} de {totalCriteria} critérios
            </div>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Standard Criteria */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Critérios Padrão
        </h4>
        <div className="space-y-2">
          {standardCriteria.map((criterion) => {
            const Icon = criterion.icon;
            const isChecked = selectedStandardCriteria[criterion.key] || false;
            
            return (
              <div 
                key={criterion.key}
                className={`flex items-start gap-3 p-4 border rounded-lg transition-colors ${
                  isChecked ? 'bg-primary/5 border-primary/20' : 'hover:bg-accent'
                }`}
              >
                <Checkbox
                  id={criterion.key}
                  checked={isChecked}
                  onCheckedChange={(checked) => onStandardChange(criterion.key, checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <label 
                      htmlFor={criterion.key}
                      className="font-medium cursor-pointer"
                    >
                      {criterion.label}
                    </label>
                    <Badge variant="outline" className="ml-auto shrink-0">
                      Peso: {(criterion.weight * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  {criterion.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {criterion.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Criteria */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Critérios Personalizados
          </h4>
          {!isAddingCustom && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingCustom(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Critério
            </Button>
          )}
        </div>

        {/* Add Custom Criterion Form */}
        {isAddingCustom && (
          <div className="p-4 border rounded-lg bg-accent/50 space-y-3">
            <div>
              <Label htmlFor="custom-label">Critério *</Label>
              <Input
                id="custom-label"
                placeholder="Ex: Concluir MBA Executivo"
                value={newCustomCriterion.label}
                onChange={(e) => setNewCustomCriterion({ ...newCustomCriterion, label: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="custom-description">Descrição</Label>
              <Textarea
                id="custom-description"
                placeholder="Detalhes sobre o critério..."
                value={newCustomCriterion.description}
                onChange={(e) => setNewCustomCriterion({ ...newCustomCriterion, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="custom-dueDate">Prazo</Label>
                <Input
                  id="custom-dueDate"
                  type="date"
                  value={newCustomCriterion.dueDate}
                  onChange={(e) => setNewCustomCriterion({ ...newCustomCriterion, dueDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="custom-assignedTo">Responsável</Label>
                <Input
                  id="custom-assignedTo"
                  placeholder="Nome do responsável"
                  value={newCustomCriterion.assignedTo}
                  onChange={(e) => setNewCustomCriterion({ ...newCustomCriterion, assignedTo: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddingCustom(false);
                  setNewCustomCriterion({ label: '', description: '', dueDate: '', assignedTo: '', completed: false });
                }}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleAddCustomCriterion}
                disabled={!newCustomCriterion.label.trim()}
              >
                Adicionar
              </Button>
            </div>
          </div>
        )}

        {/* Custom Criteria List */}
        {customCriteria.length > 0 && (
          <div className="space-y-2">
            {customCriteria.map((criterion) => (
              <div
                key={criterion.id}
                className={`p-4 border rounded-lg transition-colors ${
                  criterion.completed ? 'bg-primary/5 border-primary/20' : 'bg-background'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={criterion.completed}
                    onCheckedChange={(checked) => onCustomUpdate(criterion.id, { completed: checked as boolean })}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-medium">{criterion.label}</div>
                        {criterion.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {criterion.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                          {criterion.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(criterion.dueDate).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                          {criterion.assignedTo && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {criterion.assignedTo}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCustomRemove(criterion.id)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {customCriteria.length === 0 && !isAddingCustom && (
          <div className="text-center py-6 text-sm text-muted-foreground border rounded-lg border-dashed">
            Nenhum critério personalizado adicionado
          </div>
        )}
      </div>
    </div>
  );
};
