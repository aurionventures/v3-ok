import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CheckCircle2, Clock, AlertCircle, Plus, Upload, Mail, FileText, Loader2, History, Filter, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useInterviews } from '@/hooks/useInterviews';
import { useInterviewTranscripts } from '@/hooks/useInterviewTranscripts';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, isAfter } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ScheduleData {
  intervieweeId: string;
  date: string;
  time: string;
  email: string;
}

interface HistoryEvent {
  id: string;
  timestamp: Date;
  type: 'created' | 'scheduled' | 'interviewed' | 'transcript_uploaded';
  intervieweeName: string;
  intervieweeRole: string;
  intervieweeId: string;
  priority: 'high' | 'medium' | 'low';
  currentStatus: 'pending' | 'scheduled' | 'interviewed';
  details: {
    scheduledDate?: Date;
    interviewDate?: Date;
    transcriptPreview?: string;
    notes?: string;
    email?: string;
  };
}

const commonRoles = [
  'Fundador/CEO',
  'Membro',
  'Conselheiro',
  'Diretor Financeiro',
  'Sócio/Acionista',
  'Herdeiro',
  'Diretor de RH',
  'Outro'
];

export default function Interviews() {
  const {
    interviews,
    loading,
    createInterview,
    updateInterview,
    markAsInterviewed,
    scheduleInterview: scheduleInterviewHook,
    getStatusCounts,
  } = useInterviews();

  const { createTranscript, getAllTranscripts } = useInterviewTranscripts();

  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    intervieweeId: '',
    date: '',
    time: '',
    email: ''
  });
  const [transcript, setTranscript] = useState('');
  const [selectedIntervieweeForTranscript, setSelectedIntervieweeForTranscript] = useState('');
  const [companyId, setCompanyId] = useState<string>('');
  const [allTranscripts, setAllTranscripts] = useState<any[]>([]);

  // History filters
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('30');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Get user's company
  useEffect(() => {
    const fetchUserCompany = async () => {
      console.log('🔍 [DEBUG] Fetching company ID...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('🔍 [DEBUG] Current user:', user?.id);
      
      if (user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('company')
          .eq('id', user.id)
          .single();

        console.log('🔍 [DEBUG] User data from DB:', userData);
        console.log('🔍 [DEBUG] Error (if any):', error);

        if (userData?.company) {
          setCompanyId(userData.company);
          console.log('✅ [DEBUG] Company ID set:', userData.company);
        } else {
          console.warn('⚠️ [DEBUG] No company found for user');
        }
      }
    };
    fetchUserCompany();
  }, []);

  // Load all transcripts
  useEffect(() => {
    const loadTranscripts = async () => {
      const data = await getAllTranscripts();
      setAllTranscripts(data);
    };
    loadTranscripts();
  }, [interviews]);

  const createNewInterviewee = async () => {
    console.log('🔍 [DEBUG] Creating new interviewee...');
    console.log('🔍 [DEBUG] Form data:', { name: newName, role: newRole, priority: newPriority });
    console.log('🔍 [DEBUG] Company ID:', companyId);
    
    if (!newName.trim() || !newRole.trim()) {
      toast.error('Nome e cargo são obrigatórios');
      console.error('❌ [DEBUG] Missing required fields');
      return;
    }

    if (!companyId) {
      toast.error('Erro ao identificar empresa');
      console.error('❌ [DEBUG] No company ID available');
      return;
    }

    try {
      const result = await createInterview({
        company_id: companyId,
        name: newName.trim(),
        role: newRole.trim(),
        priority: newPriority,
        status: 'pending',
      });
      console.log('✅ [DEBUG] Interview created:', result);
      setNewName('');
      setNewRole('');
      setNewPriority('medium');
      toast.success('Entrevistado criado com sucesso!');
    } catch (error) {
      console.error('❌ [DEBUG] Error creating interviewee:', error);
      toast.error('Erro ao criar entrevistado');
    }
  };

  const scheduleInterview = async () => {
    if (!scheduleData.intervieweeId || !scheduleData.date || !scheduleData.time || !scheduleData.email) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    try {
      const [hours, minutes] = scheduleData.time.split(':');
      const scheduledDateTime = new Date(`${scheduleData.date}T${scheduleData.time}`);
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

      await scheduleInterviewHook(scheduleData.intervieweeId, scheduledDateTime);

      if (scheduleData.email) {
        await updateInterview(scheduleData.intervieweeId, { email: scheduleData.email });
      }

      setScheduleData({ intervieweeId: '', date: '', time: '', email: '' });
      toast.success('Entrevista agendada com sucesso!');
    } catch (error) {
      console.error('Error scheduling interview:', error);
    }
  };

  const handleTranscriptUpload = async () => {
    console.log('🔍 [DEBUG] Uploading transcript...');
    console.log('🔍 [DEBUG] Selected interviewee ID:', selectedIntervieweeForTranscript);
    console.log('🔍 [DEBUG] Transcript length:', transcript.trim().length);
    
    if (!selectedIntervieweeForTranscript || !transcript.trim()) {
      toast.error('Selecione um entrevistado e adicione a transcrição');
      console.error('❌ [DEBUG] Missing interviewee or transcript');
      return;
    }

    try {
      const transcriptResult = await createTranscript(selectedIntervieweeForTranscript, transcript.trim());
      console.log('✅ [DEBUG] Transcript created:', transcriptResult);
      
      await markAsInterviewed(selectedIntervieweeForTranscript);
      console.log('✅ [DEBUG] Interview marked as interviewed');
      
      setTranscript('');
      setSelectedIntervieweeForTranscript('');

      // Reload transcripts
      const data = await getAllTranscripts();
      console.log('✅ [DEBUG] Transcripts reloaded:', data.length);
      setAllTranscripts(data);
      toast.success('Transcrição salva com sucesso!');
    } catch (error) {
      console.error('❌ [DEBUG] Error uploading transcript:', error);
      toast.error('Erro ao salvar transcrição');
    }
  };

  const counts = getStatusCounts();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'interviewed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'scheduled': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  // Build history timeline
  const buildHistoryTimeline = (): HistoryEvent[] => {
    const events: HistoryEvent[] = [];

    // Add creation, scheduling, and interview events
    interviews.forEach(interview => {
      // Creation event
      events.push({
        id: `created-${interview.id}`,
        timestamp: new Date(interview.created_at),
        type: 'created',
        intervieweeName: interview.name,
        intervieweeRole: interview.role,
        intervieweeId: interview.id,
        priority: interview.priority,
        currentStatus: interview.status,
        details: {
          notes: interview.notes,
        },
      });

      // Scheduling event
      if (interview.scheduled_date) {
        events.push({
          id: `scheduled-${interview.id}`,
          timestamp: new Date(interview.scheduled_date),
          type: 'scheduled',
          intervieweeName: interview.name,
          intervieweeRole: interview.role,
          intervieweeId: interview.id,
          priority: interview.priority,
          currentStatus: interview.status,
          details: {
            scheduledDate: new Date(interview.scheduled_date),
            email: interview.email,
          },
        });
      }

      // Interview completion event
      if (interview.interview_date) {
        events.push({
          id: `interviewed-${interview.id}`,
          timestamp: new Date(interview.interview_date),
          type: 'interviewed',
          intervieweeName: interview.name,
          intervieweeRole: interview.role,
          intervieweeId: interview.id,
          priority: interview.priority,
          currentStatus: interview.status,
          details: {
            interviewDate: new Date(interview.interview_date),
            notes: interview.notes,
          },
        });
      }
    });

    // Add transcript upload events
    allTranscripts.forEach(transcript => {
      const interview = interviews.find(i => i.id === transcript.interview_id);
      if (interview) {
        events.push({
          id: `transcript-${transcript.id}`,
          timestamp: new Date(transcript.uploaded_at),
          type: 'transcript_uploaded',
          intervieweeName: interview.name,
          intervieweeRole: interview.role,
          intervieweeId: interview.id,
          priority: interview.priority,
          currentStatus: interview.status,
          details: {
            transcriptPreview: transcript.transcript_text?.substring(0, 150) + '...',
          },
        });
      }
    });

    // Sort by date (most recent first)
    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  // Filter history events
  const getFilteredHistory = (): HistoryEvent[] => {
    let filtered = buildHistoryTimeline();

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType);
    }

    // Filter by period
    if (filterPeriod !== 'all') {
      const days = parseInt(filterPeriod);
      const cutoffDate = subDays(new Date(), days);
      filtered = filtered.filter(event => isAfter(event.timestamp, cutoffDate));
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(event => event.currentStatus === filterStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.intervieweeName.toLowerCase().includes(query) ||
        event.intervieweeRole.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  // Get history statistics
  const getHistoryStats = () => {
    const filtered = getFilteredHistory();
    return {
      total: filtered.length,
      created: filtered.filter(e => e.type === 'created').length,
      scheduled: filtered.filter(e => e.type === 'scheduled').length,
      interviewed: filtered.filter(e => e.type === 'interviewed').length,
      transcripts: filtered.filter(e => e.type === 'transcript_uploaded').length,
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'interviewed': return <Badge className="bg-green-500 text-white">Realizada</Badge>;
      case 'scheduled': return <Badge className="bg-blue-500 text-white">Agendada</Badge>;
      case 'pending': return <Badge variant="outline">Pendente</Badge>;
      default: return <Badge variant="outline">Pendente</Badge>;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title={`Entrevistas (${counts.total} entrevistados)`} />

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">

              {/* Nova Entrevista */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Nova Entrevista
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome do Entrevistado</label>
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Digite o nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Papel/Cargo/Função</label>
                      <Select value={newRole} onValueChange={setNewRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          {commonRoles.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Prioridade</label>
                      <Select value={newPriority} onValueChange={(value: any) => setNewPriority(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione prioridade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="low">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={createNewInterviewee} className="w-full" disabled={loading}>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Entrevista
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs Principais */}
              <Tabs defaultValue="entrevistados">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="entrevistados">
                    Entrevistados ({counts.total})
                  </TabsTrigger>
                  <TabsTrigger value="agendar">
                    Agendar
                  </TabsTrigger>
                  <TabsTrigger value="transcricoes">
                    Transcrições
                  </TabsTrigger>
                  <TabsTrigger value="historico">
                    <History className="h-4 w-4 mr-2" />
                    Histórico
                  </TabsTrigger>
                </TabsList>

                {/* Tab Entrevistados */}
                <TabsContent value="entrevistados" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-500">{counts.interviewed}</div>
                        <div className="text-sm text-muted-foreground">Realizadas</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-500">{counts.scheduled}</div>
                        <div className="text-sm text-muted-foreground">Agendadas</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-500">{counts.pending}</div>
                        <div className="text-sm text-muted-foreground">Pendentes</div>
                      </CardContent>
                    </Card>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <p className="text-muted-foreground mt-2">Carregando entrevistas...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {interviews.map(interviewee => (
                        <Card key={interviewee.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(interviewee.status)}
                                <div>
                                  <div className="font-medium">{interviewee.name}</div>
                                  <div className="text-sm text-muted-foreground">{interviewee.role}</div>
                                  {interviewee.scheduled_date && (
                                    <div className="text-xs text-blue-600">
                                      Agendada: {format(new Date(interviewee.scheduled_date), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}
                                    </div>
                                  )}
                                  {interviewee.interview_date && (
                                    <div className="text-xs text-green-600">
                                      Realizada: {format(new Date(interviewee.interview_date), "dd/MM/yyyy", { locale: pt })}
                                    </div>
                                  )}
                                  {interviewee.notes && (
                                    <div className="text-xs text-muted-foreground italic mt-1">{interviewee.notes}</div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(interviewee.status)}
                                {interviewee.priority === 'high' && (
                                  <Badge variant="destructive">Prioridade Alta</Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Tab Agendar */}
                <TabsContent value="agendar" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Agendar Entrevista</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Entrevistado</label>
                          <Select value={scheduleData.intervieweeId} onValueChange={(value) => setScheduleData({ ...scheduleData, intervieweeId: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o entrevistado" />
                            </SelectTrigger>
                            <SelectContent>
                              {interviews.filter(i => i.status === 'pending').map(interviewee => (
                                <SelectItem key={interviewee.id} value={interviewee.id}>
                                  {interviewee.name} - {interviewee.role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Data</label>
                            <Input
                              type="date"
                              value={scheduleData.date}
                              onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Horário</label>
                            <Input
                              type="time"
                              value={scheduleData.time}
                              onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email do Entrevistado</label>
                          <Input
                            type="email"
                            value={scheduleData.email}
                            onChange={(e) => setScheduleData({ ...scheduleData, email: e.target.value })}
                            placeholder="email@exemplo.com"
                          />
                        </div>
                        <Button onClick={scheduleInterview} className="w-full" disabled={loading}>
                          <Mail className="h-4 w-4 mr-2" />
                          Agendar e Enviar Convite
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab Transcrições */}
                <TabsContent value="transcricoes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload de Transcrição</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Selecionar Entrevistado</label>
                          <Select value={selectedIntervieweeForTranscript} onValueChange={setSelectedIntervieweeForTranscript}>
                            <SelectTrigger>
                              <SelectValue placeholder="Escolha o entrevistado" />
                            </SelectTrigger>
                            <SelectContent>
                              {interviews.map(interviewee => (
                                <SelectItem key={interviewee.id} value={interviewee.id}>
                                  {interviewee.name} - {interviewee.role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Transcrição da Entrevista</label>
                          <Textarea
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder="Cole ou digite a transcrição da entrevista aqui..."
                            className="min-h-[200px]"
                          />
                        </div>
                        <Button onClick={handleTranscriptUpload} className="w-full" disabled={loading}>
                          <Upload className="h-4 w-4 mr-2" />
                          Salvar Transcrição
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lista de Transcrições */}
                  <div className="space-y-3">
                    {allTranscripts.map((item: any) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-medium">{item.interviews?.name}</div>
                              <div className="text-sm text-muted-foreground">{item.interviews?.role}</div>
                              <div className="text-xs text-muted-foreground">
                                Enviado em: {format(new Date(item.uploaded_at), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}
                              </div>
                            </div>
                            <Badge className="bg-green-500 text-white">
                              <FileText className="h-3 w-3 mr-1" />
                              Transcrição
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground bg-muted p-3 rounded max-h-32 overflow-y-auto">
                            {item.transcript_text}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="historico" className="space-y-4">
                  {/* Filters */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtros
                      </CardTitle>
                      <CardDescription>
                        Filtre o histórico por tipo, período, status ou busque por nome
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Tipo de Evento</Label>
                          <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo de Evento" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos os Eventos</SelectItem>
                              <SelectItem value="created">Criadas</SelectItem>
                              <SelectItem value="scheduled">Agendadas</SelectItem>
                              <SelectItem value="interviewed">Realizadas</SelectItem>
                              <SelectItem value="transcript_uploaded">Transcrições</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Período</Label>
                          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                            <SelectTrigger>
                              <SelectValue placeholder="Período" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7">Última Semana</SelectItem>
                              <SelectItem value="30">Último Mês</SelectItem>
                              <SelectItem value="90">Últimos 3 Meses</SelectItem>
                              <SelectItem value="all">Todo o Histórico</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Status Atual</Label>
                          <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger>
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos os Status</SelectItem>
                              <SelectItem value="pending">Pendentes</SelectItem>
                              <SelectItem value="scheduled">Agendadas</SelectItem>
                              <SelectItem value="interviewed">Realizadas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Buscar</Label>
                          <Input
                            placeholder="Nome ou cargo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Statistics */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {getHistoryStats().total}
                          </div>
                          <div className="text-xs text-muted-foreground">Total de Eventos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-500">
                            {getHistoryStats().created}
                          </div>
                          <div className="text-xs text-muted-foreground">Criadas</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-500">
                            {getHistoryStats().scheduled}
                          </div>
                          <div className="text-xs text-muted-foreground">Agendadas</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">
                            {getHistoryStats().interviewed}
                          </div>
                          <div className="text-xs text-muted-foreground">Realizadas</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-500">
                            {getHistoryStats().transcripts}
                          </div>
                          <div className="text-xs text-muted-foreground">Transcrições</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Timeline */}
                  <div className="space-y-3">
                    {getFilteredHistory().length === 0 ? (
                      <Card>
                        <CardContent className="pt-6 text-center text-muted-foreground">
                          <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Nenhum evento encontrado com os filtros selecionados.</p>
                        </CardContent>
                      </Card>
                    ) : (
                      getFilteredHistory().map((event) => {
                        const getEventIcon = () => {
                          switch (event.type) {
                            case 'created':
                              return <Plus className="h-5 w-5 text-yellow-500" />;
                            case 'scheduled':
                              return <CalendarIcon className="h-5 w-5 text-blue-500" />;
                            case 'interviewed':
                              return <CheckCircle2 className="h-5 w-5 text-green-500" />;
                            case 'transcript_uploaded':
                              return <FileText className="h-5 w-5 text-purple-500" />;
                          }
                        };

                        const getEventTitle = () => {
                          switch (event.type) {
                            case 'created':
                              return 'Entrevista Criada';
                            case 'scheduled':
                              return 'Entrevista Agendada';
                            case 'interviewed':
                              return 'Entrevista Realizada';
                            case 'transcript_uploaded':
                              return 'Transcrição Enviada';
                          }
                        };

                        const getEventDetails = () => {
                          switch (event.type) {
                            case 'created':
                              return 'Aguardando agendamento';
                            case 'scheduled':
                              return event.details.scheduledDate
                                ? `Agendada para: ${format(event.details.scheduledDate, "dd/MM/yyyy 'às' HH:mm", { locale: pt })}`
                                : 'Agendamento confirmado';
                            case 'interviewed':
                              return event.details.notes || 'Entrevista concluída com sucesso';
                            case 'transcript_uploaded':
                              return event.details.transcriptPreview || 'Transcrição disponível';
                          }
                        };

                        const getPriorityBadge = () => {
                          if (event.priority === 'high') {
                            return <Badge variant="destructive">Alta Prioridade</Badge>;
                          } else if (event.priority === 'medium') {
                            return <Badge>Média Prioridade</Badge>;
                          }
                          return null;
                        };

                        return (
                          <Card key={event.id} className="transition-all hover:shadow-md">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="mt-1 shrink-0">{getEventIcon()}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-4 mb-2">
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold truncate">{event.intervieweeName}</div>
                                      <div className="text-sm text-muted-foreground truncate">
                                        {event.intervieweeRole}
                                      </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                                      {format(event.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: pt })}
                                    </div>
                                  </div>
                                  <div className="text-sm font-medium mb-1">{getEventTitle()}</div>
                                  <div className="text-sm text-muted-foreground mb-3">
                                    {getEventDetails()}
                                  </div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {getStatusBadge(event.currentStatus)}
                                    {getPriorityBadge()}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
