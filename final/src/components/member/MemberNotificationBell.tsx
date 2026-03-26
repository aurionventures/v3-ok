import { useState } from "react";
import { Bell, FileCheck, FileSignature, Calendar, Clock, FileText, Mail, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

type NotificationType = 
  | 'ATA_APROVACAO'
  | 'ATA_ASSINATURA'
  | 'REUNIAO_PROXIMA'
  | 'TAREFA_PRAZO'
  | 'MATERIAIS_DISPONIVEIS'
  | 'CONVOCACAO'
  | 'ALERTA';

interface MemberNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  urgent?: boolean;
}

const mockNotifications: MemberNotification[] = [
  {
    id: '1',
    type: 'ATA_APROVACAO',
    title: 'ATA aguardando aprovação',
    message: 'A ATA da reunião do Conselho de Administração de 28/11 requer sua aprovação.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    urgent: true
  },
  {
    id: '2',
    type: 'REUNIAO_PROXIMA',
    title: 'Reunião em 2 dias',
    message: 'Reunião Ordinária do Conselho de Administração agendada para 07/12 às 14:00.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: false
  },
  {
    id: '3',
    type: 'TAREFA_PRAZO',
    title: 'Tarefa com prazo próximo',
    message: 'A tarefa "Revisar política de compliance" vence em 3 dias.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: false,
    urgent: true
  },
  {
    id: '4',
    type: 'MATERIAIS_DISPONIVEIS',
    title: 'Novos materiais disponíveis',
    message: 'Os materiais de apoio para a reunião de 07/12 foram disponibilizados.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: false
  },
  {
    id: '5',
    type: 'CONVOCACAO',
    title: 'Nova convocação recebida',
    message: 'Você foi convocado para reunião extraordinária do Comitê de Auditoria.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true
  },
  {
    id: '6',
    type: 'ALERTA',
    title: 'Alerta de Prazo',
    message: 'Uma pauta virtual requer sua atenção urgente antes do prazo de 20/01/2026.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    read: false,
    urgent: true
  }
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'ATA_APROVACAO':
      return FileCheck;
    case 'ATA_ASSINATURA':
      return FileSignature;
    case 'REUNIAO_PROXIMA':
      return Calendar;
    case 'TAREFA_PRAZO':
      return Clock;
    case 'MATERIAIS_DISPONIVEIS':
      return FileText;
    case 'CONVOCACAO':
      return Mail;
    case 'ALERTA':
      return AlertTriangle;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: NotificationType, urgent?: boolean) => {
  if (urgent) return 'text-destructive';
  switch (type) {
    case 'ATA_APROVACAO':
    case 'ATA_ASSINATURA':
      return 'text-amber-500';
    case 'REUNIAO_PROXIMA':
    case 'CONVOCACAO':
      return 'text-primary';
    case 'TAREFA_PRAZO':
      return 'text-orange-500';
    case 'MATERIAIS_DISPONIVEIS':
      return 'text-emerald-500';
    case 'ALERTA':
      return 'text-red-500';
    default:
      return 'text-muted-foreground';
  }
};

const MemberNotificationBell = () => {
  const [notifications, setNotifications] = useState<MemberNotification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground font-medium">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0" 
        align="end"
        sideOffset={8}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Notificações</h3>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 
                ? `${unreadCount} notificações não lidas`
                : "Nenhuma notificação não lida"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8"
              onClick={markAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Marcar todas
            </Button>
          )}
        </div>
        
        <div className="overflow-y-auto max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const iconColor = getNotificationColor(notification.type, notification.urgent);
              
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 border-b cursor-pointer hover:bg-accent/50 transition-colors",
                    !notification.read && "bg-accent/30"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className={cn("flex-shrink-0 mt-0.5", iconColor)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={cn(
                          "text-sm line-clamp-1",
                          !notification.read && "font-semibold"
                        )}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <span className="text-xs text-muted-foreground/70 mt-2 block">
                        {formatDistanceToNow(notification.timestamp, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MemberNotificationBell;
