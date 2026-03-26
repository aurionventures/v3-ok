import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, FileText, CheckCircle2, AlertCircle, Play, CheckCheck, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMeetingItems } from '@/hooks/useMeetingItems';
import { useMeetingActions } from '@/hooks/useMeetingActions';
import { useMeetings } from '@/hooks/useMeetings';
import { useToast } from '@/hooks/use-toast';

interface ReuniaoResumoProps {
  meeting: any;
}

export const ReuniaoResumo = ({ meeting }: ReuniaoResumoProps) => {
  const { items } = useMeetingItems(meeting.id);
  const { actions, getOverdueActions, getPendingActions, getCompletedActions } = useMeetingActions(meeting.id);
  const { updateMeeting } = useMeetings();
  const { toast } = useToast();

  const overdueCount = getOverdueActions().length;
  const pendingCount = getPendingActions().length;
  const completedCount = getCompletedActions().length;

  const handleUpdateStatus = async (newStatus: 'AGENDADA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA') => {
    await updateMeeting(meeting.id, { status: newStatus });
    window.location.reload();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any; label: string }> = {
      'AGENDADA': { variant: 'outline', icon: Clock, label: 'Agendada' },
      'EM_ANDAMENTO': { variant: 'default', icon: Play, label: 'Em Andamento' },
      'CONCLUIDA': { variant: 'secondary', icon: CheckCircle2, label: 'Concluída' },
      'CANCELADA': { variant: 'destructive', icon: XCircle, label: 'Cancelada' },
    };

    const config = variants[status] || variants['AGENDADA'];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{meeting.title}</CardTitle>
              <CardDescription>Informações gerais da reunião</CardDescription>
            </div>
            {getStatusBadge(meeting.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="font-medium">
                  {format(new Date(meeting.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Horário</p>
                <p className="font-medium">{meeting.time}</p>
              </div>
            </div>

            {meeting.location && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Local</p>
                  <p className="font-medium">{meeting.location}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Modalidade</p>
                <p className="font-medium">{meeting.modalidade || 'Presencial'}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Badge variant="outline">{meeting.type}</Badge>
          </div>

          <div className="flex gap-3 pt-4">
            {meeting.status === 'AGENDADA' && (
              <Button onClick={() => handleUpdateStatus('EM_ANDAMENTO')}>
                <Play className="h-4 w-4 mr-2" />
                Iniciar Reunião
              </Button>
            )}
            {meeting.status === 'EM_ANDAMENTO' && (
              <Button onClick={() => handleUpdateStatus('CONCLUIDA')}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Marcar como Concluída
              </Button>
            )}
            {(meeting.status === 'AGENDADA' || meeting.status === 'EM_ANDAMENTO') && (
              <Button variant="destructive" onClick={() => handleUpdateStatus('CANCELADA')}>
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar Reunião
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Pautas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">itens na agenda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Pendências Concluídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">
              de {actions.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Pendências Atrasadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{overdueCount}</div>
            <p className="text-xs text-muted-foreground">
              requerem atenção
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
