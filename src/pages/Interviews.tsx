import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CheckCircle2, Clock, AlertCircle, Plus, Upload, Mail, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useInterviews } from '@/hooks/useInterviews';
import { useInterviewTranscripts } from '@/hooks/useInterviewTranscripts';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ScheduleData {
  intervieweeId: string;
  date: string;
  time: string;
  email: string;
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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="entrevistados">
                    Entrevistados ({counts.total})
                  </TabsTrigger>
                  <TabsTrigger value="agendar">
                    Agendar
                  </TabsTrigger>
                  <TabsTrigger value="transcricoes">
                    Transcrições
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
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
