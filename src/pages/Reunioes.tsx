import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeetings } from '@/hooks/useMeetings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, CheckCircle2, Clock, XCircle, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Reunioes = () => {
  const navigate = useNavigate();
  const { meetings, loading } = useMeetings();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any }> = {
      'AGENDADA': { variant: 'outline', icon: Clock },
      'EM_ANDAMENTO': { variant: 'default', icon: Clock },
      'CONCLUIDA': { variant: 'secondary', icon: CheckCircle2 },
      'CANCELADA': { variant: 'destructive', icon: XCircle },
    };

    const config = variants[status] || variants['AGENDADA'];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reuniões</h1>
          <p className="text-muted-foreground">Gerencie as reuniões dos conselhos e comitês</p>
        </div>
        <Button onClick={() => navigate('/agenda-anual')}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Reunião
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar reuniões..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="AGENDADA">Agendada</SelectItem>
            <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
            <SelectItem value="CONCLUIDA">Concluída</SelectItem>
            <SelectItem value="CANCELADA">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredMeetings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              {searchTerm || statusFilter !== 'all' 
                ? 'Nenhuma reunião encontrada com os filtros aplicados.'
                : 'Nenhuma reunião cadastrada. Comece criando uma nova reunião na Agenda Anual.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMeetings.map((meeting) => (
            <Card
              key={meeting.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/reunioes/${meeting.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{meeting.title}</CardTitle>
                  {getStatusBadge(meeting.status)}
                </div>
                <CardDescription>
                  {meeting.council_id && (
                    <span className="flex items-center gap-1 text-sm">
                      <Users className="h-3 w-3" />
                      Conselho
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(meeting.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                  <span className="text-muted-foreground">às {meeting.time}</span>
                </div>
                
                {meeting.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{meeting.location}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Badge variant="outline">{meeting.type}</Badge>
                  <Badge variant="outline">Presencial</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reunioes;
