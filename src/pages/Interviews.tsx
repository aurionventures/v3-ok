import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CheckCircle2, Clock, AlertCircle, Plus, Upload, Mail, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

interface Interviewee {
  id: string;
  name: string;
  role: string;
  status: 'pending' | 'scheduled' | 'interviewed';
  scheduledDate?: Date;
  email?: string;
  transcript?: string;
  uploadDate?: Date;
}

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
  const navigate = useNavigate();
  const [interviewees, setInterviewees] = useState<Interviewee[]>([]);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    intervieweeId: '',
    date: '',
    time: '',
    email: ''
  });
  const [transcript, setTranscript] = useState('');
  const [selectedIntervieweeForTranscript, setSelectedIntervieweeForTranscript] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('interviewees');
    if (saved) {
      setInterviewees(JSON.parse(saved).map((item: any) => ({
        ...item,
        scheduledDate: item.scheduledDate ? new Date(item.scheduledDate) : undefined,
        uploadDate: item.uploadDate ? new Date(item.uploadDate) : undefined
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('interviewees', JSON.stringify(interviewees));
  }, [interviewees]);

  const createNewInterviewee = () => {
    if (!newName.trim() || !newRole.trim()) {
      toast.error('Nome e cargo são obrigatórios');
      return;
    }

    const newInterviewee: Interviewee = {
      id: Date.now().toString(),
      name: newName.trim(),
      role: newRole.trim(),
      status: 'pending'
    };

    setInterviewees(prev => [...prev, newInterviewee]);
    setNewName('');
    setNewRole('');
    toast.success('Entrevistado adicionado com sucesso');
  };

  const scheduleInterview = () => {
    if (!scheduleData.intervieweeId || !scheduleData.date || !scheduleData.time || !scheduleData.email) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    setInterviewees(prev => prev.map(interviewee => 
      interviewee.id === scheduleData.intervieweeId 
        ? { 
            ...interviewee, 
            status: 'scheduled', 
            scheduledDate: new Date(`${scheduleData.date}T${scheduleData.time}`),
            email: scheduleData.email 
          }
        : interviewee
    ));

    setScheduleData({ intervieweeId: '', date: '', time: '', email: '' });
    toast.success('Entrevista agendada e convite enviado!');
  };

  const handleTranscriptUpload = () => {
    if (!selectedIntervieweeForTranscript || !transcript.trim()) {
      toast.error('Selecione um entrevistado e adicione a transcrição');
      return;
    }

    setInterviewees(prev => prev.map(interviewee => 
      interviewee.id === selectedIntervieweeForTranscript 
        ? { 
            ...interviewee, 
            status: 'interviewed', 
            transcript: transcript.trim(),
            uploadDate: new Date()
          }
        : interviewee
    ));

    setTranscript('');
    setSelectedIntervieweeForTranscript('');
    toast.success('Transcrição salva com sucesso!');
  };

  const getStatusCounts = () => {
    return {
      interviewed: interviewees.filter(i => i.status === 'interviewed').length,
      scheduled: interviewees.filter(i => i.status === 'scheduled').length,
      pending: interviewees.filter(i => i.status === 'pending').length,
      total: interviewees.length
    };
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div className="flex items-end">
                      <Button onClick={createNewInterviewee} className="w-full">
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

                  <div className="space-y-3">
                    {interviewees.map(interviewee => (
                      <Card key={interviewee.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(interviewee.status)}
                              <div>
                                <div className="font-medium">{interviewee.name}</div>
                                <div className="text-sm text-muted-foreground">{interviewee.role}</div>
                                {interviewee.scheduledDate && (
                                  <div className="text-xs text-blue-600">
                                    Agendada: {interviewee.scheduledDate.toLocaleDateString()} às {interviewee.scheduledDate.toLocaleTimeString()}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(interviewee.status)}
                              {interviewee.transcript && (
                                <Badge variant="outline">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Transcrição
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
                          <Select value={scheduleData.intervieweeId} onValueChange={(value) => setScheduleData({...scheduleData, intervieweeId: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o entrevistado" />
                            </SelectTrigger>
                            <SelectContent>
                              {interviewees.filter(i => i.status === 'pending').map(interviewee => (
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
                              onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Horário</label>
                            <Input
                              type="time"
                              value={scheduleData.time}
                              onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email do Entrevistado</label>
                          <Input
                            type="email"
                            value={scheduleData.email}
                            onChange={(e) => setScheduleData({...scheduleData, email: e.target.value})}
                            placeholder="email@exemplo.com"
                          />
                        </div>
                        <Button onClick={scheduleInterview} className="w-full">
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
                              {interviewees.map(interviewee => (
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
                        <Button onClick={handleTranscriptUpload} className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Salvar Transcrição
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Lista de Transcrições */}
                  <div className="space-y-3">
                    {interviewees.filter(i => i.transcript).map(interviewee => (
                      <Card key={interviewee.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-medium">{interviewee.name}</div>
                              <div className="text-sm text-muted-foreground">{interviewee.role}</div>
                              {interviewee.uploadDate && (
                                <div className="text-xs text-muted-foreground">
                                  Enviado em: {interviewee.uploadDate.toLocaleDateString()}
                                </div>
                              )}
                            </div>
                            <Badge className="bg-green-500 text-white">
                              <FileText className="h-3 w-3 mr-1" />
                              Transcrição
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground bg-muted p-3 rounded max-h-32 overflow-y-auto">
                            {interviewee.transcript}
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