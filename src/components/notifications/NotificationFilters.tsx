import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NotificationFilters as Filters, NotificationType, NotificationStatus, NotificationChannel } from "@/types/notifications";
import { X } from "lucide-react";

interface NotificationFiltersProps {
  onFilterChange: (filters: Filters) => void;
}

export const NotificationFilters = ({ onFilterChange }: NotificationFiltersProps) => {
  const [filters, setFilters] = useState<Filters>({
    type: 'ALL',
    status: 'ALL',
    channel: 'ALL',
    organType: 'ALL',
    searchTerm: ''
  });

  const handleFilterChange = (key: keyof Filters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: Filters = {
      type: 'ALL',
      status: 'ALL',
      channel: 'ALL',
      organType: 'ALL',
      searchTerm: ''
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Limpar Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label>Buscar</Label>
          <Input
            placeholder="Nome, assunto..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="CONVOCACAO_REUNIAO">Convocação</SelectItem>
              <SelectItem value="EDICAO_REUNIAO">Edição</SelectItem>
              <SelectItem value="UPLOAD_DOCUMENTO">Upload</SelectItem>
              <SelectItem value="ATA_GERADA">ATA Gerada</SelectItem>
              <SelectItem value="LEMBRETE_30D">Lembrete 30d</SelectItem>
              <SelectItem value="LEMBRETE_7D">Lembrete 7d</SelectItem>
              <SelectItem value="LEMBRETE_24H">Lembrete 24h</SelectItem>
              <SelectItem value="LEMBRETE_12H">Lembrete 12h</SelectItem>
              <SelectItem value="LEMBRETE_1H">Lembrete 1h</SelectItem>
              <SelectItem value="MAGIC_LINK_CONVIDADO">Magic Link</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="ENVIADA">Enviada</SelectItem>
              <SelectItem value="PENDENTE">Pendente</SelectItem>
              <SelectItem value="ERRO">Erro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Canal</Label>
          <Select value={filters.channel} onValueChange={(value) => handleFilterChange('channel', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="EMAIL">Email</SelectItem>
              <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
              <SelectItem value="IN_APP">In-App</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Órgão</Label>
          <Select value={filters.organType} onValueChange={(value) => handleFilterChange('organType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="conselho">Conselho</SelectItem>
              <SelectItem value="comite">Comitê</SelectItem>
              <SelectItem value="comissao">Comissão</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
