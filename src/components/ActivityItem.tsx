import React from 'react';
import { 
  Calendar, 
  FileText, 
  CheckSquare, 
  Mail, 
  MessageCircle, 
  FileSignature, 
  LogIn, 
  LogOut, 
  Settings,
  CheckCircle,
  ThumbsUp,
  PenTool
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnhancedActivity, ActivityType, ActivityStatus } from '@/hooks/useEnhancedActivities';
import { cn } from '@/lib/utils';

interface ActivityItemProps {
  activity: EnhancedActivity;
}

const typeConfig: Record<ActivityType, { icon: React.ElementType; color: string; label: string }> = {
  meeting: { icon: Calendar, color: 'text-blue-500 bg-blue-500/10', label: 'Reunião' },
  document: { icon: FileText, color: 'text-purple-500 bg-purple-500/10', label: 'Documento' },
  task: { icon: CheckSquare, color: 'text-amber-500 bg-amber-500/10', label: 'Tarefa' },
  task_completed: { icon: CheckCircle, color: 'text-green-500 bg-green-500/10', label: 'Concluída' },
  email_sent: { icon: Mail, color: 'text-orange-500 bg-orange-500/10', label: 'E-mail' },
  whatsapp_sent: { icon: MessageCircle, color: 'text-emerald-500 bg-emerald-500/10', label: 'WhatsApp' },
  ata_generated: { icon: FileSignature, color: 'text-yellow-500 bg-yellow-500/10', label: 'ATA' },
  login: { icon: LogIn, color: 'text-slate-500 bg-slate-500/10', label: 'Login' },
  logout: { icon: LogOut, color: 'text-slate-400 bg-slate-400/10', label: 'Logout' },
  config: { icon: Settings, color: 'text-slate-600 bg-slate-600/10', label: 'Config' },
  approval: { icon: ThumbsUp, color: 'text-cyan-500 bg-cyan-500/10', label: 'Aprovação' },
  signature: { icon: PenTool, color: 'text-indigo-500 bg-indigo-500/10', label: 'Assinatura' },
};

const statusConfig: Record<ActivityStatus, { color: string; label: string }> = {
  completed: { color: 'bg-green-500/10 text-green-600 border-green-500/20', label: 'Concluído' },
  pending: { color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', label: 'Pendente' },
  scheduled: { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', label: 'Agendado' },
  cancelled: { color: 'bg-slate-500/10 text-slate-600 border-slate-500/20', label: 'Cancelado' },
  error: { color: 'bg-red-500/10 text-red-600 border-red-500/20', label: 'Erro' },
};

const formatDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins}min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;
  
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const config = typeConfig[activity.type];
  const statusCfg = statusConfig[activity.status];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
      <div className={cn('p-2 rounded-lg shrink-0', config.color)}>
        <Icon className="h-4 w-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {activity.title}
            </p>
            {activity.description && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {activity.description}
              </p>
            )}
          </div>
          <Badge variant="outline" className={cn('shrink-0 text-xs', statusCfg.color)}>
            {statusCfg.label}
          </Badge>
        </div>
        
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
          <span>{formatDate(activity.timestamp)}</span>
          {activity.user && (
            <>
              <span>•</span>
              <span>{activity.user}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
