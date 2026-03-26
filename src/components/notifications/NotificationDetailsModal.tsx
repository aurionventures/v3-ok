import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MockNotification } from "@/types/notifications";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotificationDetailsModalProps {
  notification: MockNotification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationDetailsModal = ({ notification, open, onOpenChange }: NotificationDetailsModalProps) => {
  if (!notification) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Notificação</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Tipo</label>
            <div className="mt-1">
              <Badge>{notification.type}</Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Destinatário</label>
            <p className="mt-1 font-medium">{notification.recipient_name}</p>
            {notification.external_email && (
              <p className="text-sm text-muted-foreground">{notification.external_email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Assunto</label>
            <p className="mt-1">{notification.title}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Mensagem</label>
            <p className="mt-1 text-sm whitespace-pre-wrap">{notification.message}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge variant={
                  notification.status === 'ENVIADA' ? 'default' :
                  notification.status === 'PENDENTE' ? 'secondary' : 'destructive'
                }>
                  {notification.status}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Canal</label>
              <div className="mt-1">
                <Badge variant="outline">{notification.channel}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Agendada para</label>
              <p className="mt-1 text-sm">
                {format(new Date(notification.scheduled_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>

            {notification.sent_at && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Enviada em</label>
                <p className="mt-1 text-sm">
                  {format(new Date(notification.sent_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            )}
          </div>

          {notification.context && Object.keys(notification.context).length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contexto</label>
              <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto">
                {JSON.stringify(notification.context, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
