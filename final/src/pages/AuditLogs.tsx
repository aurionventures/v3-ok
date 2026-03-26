import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Users, Calendar, Settings, AlertCircle } from 'lucide-react';

const getEntityIcon = (entityType: string) => {
  const icons: Record<string, any> = {
    meetings: Calendar,
    users: Users,
    councils: Settings,
    meeting_actions: FileText,
    corporate_structure_members: Users
  };
  return icons[entityType] || AlertCircle;
};

const getActionColor = (action: string) => {
  const colors: Record<string, string> = {
    INSERT: 'bg-green-500',
    UPDATE: 'bg-blue-500',
    DELETE: 'bg-red-500',
    LOGIN: 'bg-purple-500',
    LOGOUT: 'bg-gray-500'
  };
  return colors[action] || 'bg-gray-500';
};

export default function AuditLogs() {
  const [entityType, setEntityType] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const { logs, loading } = useAuditLogs({
    entityType: entityType || undefined,
    action: action || undefined,
    limit: 200
  });

  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      log.entity_type.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      (log.metadata?.table && log.metadata.table.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="container mx-auto p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Logs de Auditoria</h1>
            <p className="text-muted-foreground">
              Visualize todas as ações realizadas no sistema
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Filtre os logs por tipo de entidade ou ação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Buscar nos logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <Select value={entityType} onValueChange={setEntityType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Entidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="meetings">Reuniões</SelectItem>
                    <SelectItem value="councils">Conselhos</SelectItem>
                    <SelectItem value="users">Usuários</SelectItem>
                    <SelectItem value="meeting_actions">Pendências</SelectItem>
                    <SelectItem value="corporate_structure_members">Membros</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={action} onValueChange={setAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="INSERT">Criação</SelectItem>
                    <SelectItem value="UPDATE">Atualização</SelectItem>
                    <SelectItem value="DELETE">Exclusão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Ações</CardTitle>
              <CardDescription>
                {filteredLogs.length} registro(s) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ação</TableHead>
                        <TableHead>Entidade</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log) => {
                        const Icon = getEntityIcon(log.entity_type);
                        return (
                          <TableRow key={log.id}>
                            <TableCell>
                              <Badge className={getActionColor(log.action)}>
                                {log.action}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                                <span className="capitalize">{log.entity_type}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {log.user_id ? (
                                <span className="text-sm">{log.user_id.slice(0, 8)}...</span>
                              ) : (
                                <span className="text-muted-foreground">Sistema</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(log.created_at), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </TableCell>
                            <TableCell>
                              <Badge variant={log.success ? 'default' : 'destructive'}>
                                {log.success ? 'Sucesso' : 'Erro'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}