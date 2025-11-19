import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockNotification } from "@/types/notifications";
import { Eye, Trash2, Mail, Phone, Bell } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotificationsTableProps {
  notifications: MockNotification[];
  onViewDetails: (notification: MockNotification) => void;
  onDelete: (id: string) => void;
}

const getTypeBadge = (type: string) => {
  const badges: Record<string, { label: string; variant: any }> = {
    CONVOCACAO_REUNIAO: { label: '📧 Convocação', variant: 'default' },
    EDICAO_REUNIAO: { label: '✏️ Edição', variant: 'secondary' },
    UPLOAD_DOCUMENTO: { label: '📎 Upload', variant: 'default' },
    ATA_GERADA: { label: '📄 ATA', variant: 'default' },
    LEMBRETE_30D: { label: '⏰ 30 dias', variant: 'secondary' },
    LEMBRETE_7D: { label: '⏰ 7 dias', variant: 'secondary' },
    LEMBRETE_24H: { label: '⏰ 24 horas', variant: 'secondary' },
    LEMBRETE_12H: { label: '⏰ 12 horas', variant: 'secondary' },
    LEMBRETE_1H: { label: '⏰ 1 hora', variant: 'secondary' },
    MAGIC_LINK_CONVIDADO: { label: '🔗 Magic Link', variant: 'outline' }
  };
  
  const badge = badges[type] || { label: type, variant: 'outline' };
  return <Badge variant={badge.variant}>{badge.label}</Badge>;
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, any> = {
    ENVIADA: 'default',
    PENDENTE: 'secondary',
    ERRO: 'destructive'
  };
  
  const icons: Record<string, string> = {
    ENVIADA: '✅',
    PENDENTE: '⏳',
    ERRO: '❌'
  };
  
  return <Badge variant={variants[status]}>{icons[status]} {status}</Badge>;
};

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case 'EMAIL':
      return <Mail className="h-4 w-4" />;
    case 'WHATSAPP':
      return <Phone className="h-4 w-4" />;
    case 'IN_APP':
      return <Bell className="h-4 w-4" />;
    default:
      return null;
  }
};

export const NotificationsTable = ({ notifications, onViewDetails, onDelete }: NotificationsTableProps) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma notificação encontrada</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Destinatário</TableHead>
            <TableHead>Assunto</TableHead>
            <TableHead>Canal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data/Hora</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.map((notif) => (
            <TableRow key={notif.id}>
              <TableCell>{getTypeBadge(notif.type)}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{notif.recipient_name}</p>
                  <p className="text-xs text-muted-foreground">{notif.external_email}</p>
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">{notif.title}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getChannelIcon(notif.channel)}
                  <span className="text-sm">{notif.channel}</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(notif.status)}</TableCell>
              <TableCell>
                {format(new Date(notif.scheduled_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(notif)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(notif.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
