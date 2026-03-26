import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ActivityFilters as ActivityFiltersType, ActivityType, ActivityStatus } from '@/hooks/useEnhancedActivities';

interface ActivityFiltersProps {
  filters: ActivityFiltersType;
  onFilterChange: <K extends keyof ActivityFiltersType>(key: K, value: ActivityFiltersType[K]) => void;
  resultCount: number;
  totalCount: number;
}

const activityTypes: { value: ActivityType | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'meeting', label: 'Reuniões' },
  { value: 'document', label: 'Documentos' },
  { value: 'task', label: 'Tarefas criadas' },
  { value: 'task_completed', label: 'Tarefas concluídas' },
  { value: 'email_sent', label: 'E-mails enviados' },
  { value: 'whatsapp_sent', label: 'WhatsApp enviados' },
  { value: 'ata_generated', label: 'ATAs geradas' },
  { value: 'approval', label: 'Aprovações' },
  { value: 'signature', label: 'Assinaturas' },
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
  { value: 'config', label: 'Configurações' },
];

const activityStatuses: { value: ActivityStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos os status' },
  { value: 'completed', label: 'Concluído' },
  { value: 'pending', label: 'Pendente' },
  { value: 'scheduled', label: 'Agendado' },
  { value: 'cancelled', label: 'Cancelado' },
  { value: 'error', label: 'Erro' },
];

const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  filters,
  onFilterChange,
  resultCount,
  totalCount
}) => {
  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.status !== 'all';

  const clearFilters = () => {
    onFilterChange('search', '');
    onFilterChange('type', 'all');
    onFilterChange('status', 'all');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, descrição ou usuário..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select
          value={filters.type}
          onValueChange={(value) => onFilterChange('type', value as ActivityType | 'all')}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            {activityTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange('status', value as ActivityStatus | 'all')}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {activityStatuses.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters} title="Limpar filtros">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Exibindo <span className="font-medium text-foreground">{resultCount}</span> de{' '}
          <span className="font-medium text-foreground">{totalCount}</span> atividades
        </span>
        {hasActiveFilters && (
          <span className="text-primary">Filtros ativos</span>
        )}
      </div>
    </div>
  );
};

export default ActivityFilters;
