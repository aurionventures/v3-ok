import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSecurityEvents, useResolveSecurityEvent, useSecurityStats } from '@/hooks/useSecurityEvents';
import { useUserSessions, useTerminateSession } from '@/hooks/useUserSessions';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Shield, AlertTriangle, CheckCircle, XCircle, Monitor, Ban } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const getSeverityColor = (severity: string) => {
  const colors: Record<string, string> = {
    LOW: 'bg-blue-500',
    MEDIUM: 'bg-yellow-500',
    HIGH: 'bg-orange-500',
    CRITICAL: 'bg-red-500'
  };
  return colors[severity] || 'bg-gray-500';
};

export default function SecurityDashboard() {
  const [showResolved, setShowResolved] = useState(false);
  const [sessionToTerminate, setSessionToTerminate] = useState<string | null>(null);

  const { events, loading: eventsLoading } = useSecurityEvents({ 
    resolved: showResolved ? undefined : false 
  });
  const { sessions, loading: sessionsLoading } = useUserSessions();
  const { data: stats } = useSecurityStats();
  const resolveEvent = useResolveSecurityEvent();
  const terminateSession = useTerminateSession();

  const handleResolveEvent = async (eventId: string) => {
    try {
      await resolveEvent.mutateAsync({ eventId });
      toast.success('Evento resolvido com sucesso');
    } catch (error) {
      toast.error('Erro ao resolver evento');
    }
  };

  const handleTerminateSession = async () => {
    if (!sessionToTerminate) return;
    
    try {
      await terminateSession.mutateAsync(sessionToTerminate);
      toast.success('Sessão encerrada com sucesso');
      setSessionToTerminate(null);
    } catch (error) {
      toast.error('Erro ao encerrar sessão');
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard de Segurança</h1>
              <p className="text-muted-foreground">
                Monitore eventos de segurança e sessões ativas
              </p>
            </div>
            <Shield className="h-12 w-12 text-primary" />
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Não Resolvidos</CardTitle>
                  <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{stats.unresolved}</div>
                  <p className="text-xs text-muted-foreground">Requerem atenção</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Críticos</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{stats.critical}</div>
                  <p className="text-xs text-muted-foreground">Alta prioridade</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
                  <p className="text-xs text-muted-foreground">Tratados</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Eventos de Segurança</CardTitle>
                  <CardDescription>
                    {showResolved ? 'Todos os eventos' : 'Eventos não resolvidos'}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowResolved(!showResolved)}
                >
                  {showResolved ? 'Mostrar Pendentes' : 'Mostrar Todos'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <div className="text-center py-8">Carregando...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Severidade</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {event.event_type.replace(/_/g, ' ')}
                        </TableCell>
                        <TableCell className="max-w-md truncate">
                          {event.description}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(event.created_at), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </TableCell>
                        <TableCell>
                          {event.resolved ? (
                            <Badge variant="outline" className="text-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolvido
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Pendente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {!event.resolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveEvent(event.id)}
                              disabled={resolveEvent.isPending}
                            >
                              Resolver
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Sessões Ativas
              </CardTitle>
              <CardDescription>
                Monitore e gerencie sessões de usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <div className="text-center py-8">Carregando...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>User Agent</TableHead>
                      <TableHead>Última Atividade</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-mono text-sm">
                          {session.user_id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>{session.ip_address || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate text-sm">
                          {session.user_agent || 'N/A'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(session.last_activity), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setSessionToTerminate(session.id)}
                          >
                            <Ban className="h-3 w-3 mr-1" />
                            Encerrar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      <AlertDialog open={!!sessionToTerminate} onOpenChange={() => setSessionToTerminate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Encerrar Sessão?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação encerrará a sessão do usuário imediatamente. O usuário precisará fazer login novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleTerminateSession}>
              Encerrar Sessão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}