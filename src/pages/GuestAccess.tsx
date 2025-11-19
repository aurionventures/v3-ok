import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, MapPin, Users, Upload, FileText, AlertCircle, Download, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface MeetingData {
  participant: {
    participant_id: string;
    name: string;
    email: string;
    role: string;
  };
  meeting: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string | null;
    status: string;
    modalidade: string;
    council: {
      name: string;
      type: string;
    };
    participants?: Array<{
      id: string;
      name?: string;
      email?: string;
      external_name?: string;
      external_email?: string;
      role: string;
      confirmed: boolean;
      can_upload: boolean;
      can_view_materials: boolean;
      can_comment: boolean;
    }>;
  };
  permissions: {
    can_upload: boolean;
    can_view_materials: boolean;
  };
  visible_items: Array<{
    id: string;
    title: string;
    description: string | null;
    order_position: number;
    type: string;
    presenter: string | null;
    duration_minutes: number | null;
  }>;
  documents: Array<{
    id: string;
    name: string;
    file_data: string;
    file_type: string | null;
    document_type: string;
    created_at: string;
    uploaded_by?: string;
  }>;
}

export default function GuestAccess() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MeetingData | null>(null);
  const [uploading, setUploading] = useState(false);

  // Função para inicializar dados de demonstração completos
  const initializeDemoData = () => {
    const existingTokens = localStorage.getItem('guest_tokens');
    
    if (!existingTokens || Object.keys(JSON.parse(existingTokens)).length === 0) {
      console.log('🔧 Inicializando demonstração completa...');
      
      // 1. CRIAR REUNIÃO MOCKADA COMPLETA
      const demoMeetingId = 'demo-meeting-comissao-etica-2025';
      const demoMeeting = {
        id: demoMeetingId,
        council: 'Comissão de Ética',
        organ_type: 'comissao',
        council_id: 'comissao-etica-001',
        type: 'Ordinária',
        date: '2025-02-15',
        time: '10:00',
        location: 'Sala de Reuniões - 3º Andar',
        modalidade: 'Presencial',
        status: 'Pauta Definida',
        agenda: [
          {
            id: 'agenda-1',
            title: 'Abertura e Verificação de Quórum',
            description: 'Abertura formal da reunião e confirmação da presença dos membros.',
            order: 1,
            type: 'Deliberação',
            presenter: 'Roberto Alves',
            duration: 10,
            keyPoints: ['Verificação de presença', 'Confirmação de quórum']
          },
          {
            id: 'agenda-2',
            title: 'Análise de Caso: Conduta em Negociação Comercial',
            description: 'Revisão e análise de denúncia anônima sobre possível conflito de interesses em negociação com fornecedor.',
            order: 2,
            type: 'Deliberação',
            presenter: 'Beatriz Lima',
            duration: 45,
            keyPoints: ['Revisão da denúncia', 'Análise de evidências', 'Deliberação sobre medidas']
          },
          {
            id: 'agenda-3',
            title: 'Atualização do Código de Ética',
            description: 'Discussão sobre propostas de atualização do Código de Ética Corporativa, incluindo novas diretrizes sobre uso de redes sociais.',
            order: 3,
            type: 'Deliberação',
            presenter: 'Daniela Ferreira',
            duration: 30,
            keyPoints: ['Propostas de atualização', 'Diretrizes sobre redes sociais', 'Votação']
          },
          {
            id: 'agenda-4',
            title: 'Programa de Treinamento em Ética',
            description: 'Apresentação do novo programa de treinamento obrigatório em ética empresarial para todos os colaboradores.',
            order: 4,
            type: 'Informativo',
            presenter: 'Pedro Berto',
            duration: 20,
            keyPoints: ['Estrutura do programa', 'Cronograma de implementação', 'Recursos necessários']
          },
          {
            id: 'agenda-5',
            title: 'Assuntos Gerais e Encerramento',
            description: 'Espaço para outros assuntos relevantes e encerramento da reunião.',
            order: 5,
            type: 'Informativo',
            presenter: 'Roberto Alves',
            duration: 15,
            keyPoints: ['Próxima reunião', 'Pendências']
          }
        ],
        participants: [
          // MEMBROS OFICIAIS (5)
          {
            id: 'member-1',
            name: 'Roberto Alves',
            email: 'roberto.alves@empresa.com',
            role: 'MEMBRO',
            confirmed: true,
            can_upload: true,
            can_view_materials: true,
            can_comment: true
          },
          {
            id: 'member-2',
            name: 'Beatriz Lima',
            email: 'beatriz.lima@empresa.com',
            role: 'MEMBRO',
            confirmed: true,
            can_upload: true,
            can_view_materials: true,
            can_comment: true
          },
          {
            id: 'member-3',
            name: 'Daniela Ferreira',
            email: 'daniela.ferreira@empresa.com',
            role: 'MEMBRO',
            confirmed: true,
            can_upload: true,
            can_view_materials: true,
            can_comment: true
          },
          {
            id: 'member-4',
            name: 'Carlos Eduardo Santos',
            email: 'carlos.santos@empresa.com',
            role: 'MEMBRO',
            confirmed: true,
            can_upload: true,
            can_view_materials: true,
            can_comment: true
          },
          {
            id: 'member-5',
            name: 'Marina Costa',
            email: 'marina.costa@empresa.com',
            role: 'MEMBRO',
            confirmed: true,
            can_upload: true,
            can_view_materials: true,
            can_comment: true
          },
          // CONVIDADOS (2)
          {
            id: 'guest-1-pedro',
            external_name: 'Pedro Berto',
            external_email: 'pedro.berto@consultoria.com',
            role: 'CONVIDADO',
            confirmed: true,
            can_upload: true,
            can_view_materials: true,
            can_comment: true
          },
          {
            id: 'guest-2-ana',
            external_name: 'Ana Paula Rodrigues',
            external_email: 'ana.rodrigues@auditoria.com',
            role: 'CONVIDADO',
            confirmed: true,
            can_upload: false,
            can_view_materials: true,
            can_comment: false
          }
        ],
        confirmed_participants: 7
      };

      // 2. SALVAR REUNIÃO NO LOCALSTORAGE
      const scheduleData = {
        year: 2025,
        meetings: [demoMeeting]
      };
      localStorage.setItem('annual_council_schedule', JSON.stringify(scheduleData));
      console.log('✅ Reunião de demonstração criada:', demoMeeting.council);

      // 3. CRIAR TOKENS PARA OS 2 CONVIDADOS
      const demoTokens = {
        // TOKEN 1: Pedro Berto (PODE fazer upload)
        'demo-guest-token-123': {
          participant_id: 'guest-1-pedro',
          meeting_id: demoMeetingId,
          name: 'Pedro Berto',
          email: 'pedro.berto@consultoria.com',
          permissions: {
            can_upload: true,
            can_view_materials: true,
            can_comment: true
          },
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          access_count: 0,
          last_accessed_at: null
        },
        // TOKEN 2: Ana Paula (NÃO pode fazer upload)
        'demo-guest-token-456': {
          participant_id: 'guest-2-ana',
          meeting_id: demoMeetingId,
          name: 'Ana Paula Rodrigues',
          email: 'ana.rodrigues@auditoria.com',
          permissions: {
            can_upload: false,
            can_view_materials: true,
            can_comment: false
          },
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          access_count: 0,
          last_accessed_at: null
        }
      };

      localStorage.setItem('guest_tokens', JSON.stringify(demoTokens));
      console.log('✅ Tokens de demonstração criados:');
      console.log('  👤 Pedro Berto (pode fazer upload):', `${window.location.origin}/guest-access/demo-guest-token-123`);
      console.log('  👤 Ana Paula (apenas visualização):', `${window.location.origin}/guest-access/demo-guest-token-456`);
    } else {
      console.log('ℹ️ Tokens já existentes:', Object.keys(JSON.parse(existingTokens)));
    }
  };

  useEffect(() => {
    initializeDemoData();
    
    if (token) {
      fetchMeetingData();
    }
  }, [token]);

  const fetchMeetingData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Buscando dados para token:', token);

      // Validar token no localStorage
      const tokens = JSON.parse(localStorage.getItem('guest_tokens') || '{}');
      console.log('📦 Tokens disponíveis:', Object.keys(tokens));
      
      const tokenData = tokens[token];
      
      if (!tokenData) {
        console.error('❌ Token não encontrado. Tokens disponíveis:', Object.keys(tokens));
        throw new Error('Token inválido ou não encontrado. Por favor, solicite um novo convite.');
      }
      
      console.log('✅ Token encontrado:', tokenData);
      
      // DEMO MODE: Não verificar expiração para demonstração
      
      // Incrementar contador de acessos
      tokenData.access_count += 1;
      tokenData.last_accessed_at = new Date().toISOString();
      tokens[token] = tokenData;
      localStorage.setItem('guest_tokens', JSON.stringify(tokens));
      
      // Buscar dados da reunião
      const scheduleData = JSON.parse(localStorage.getItem('annual_council_schedule') || '{}');
      const meetings = scheduleData.meetings || [];
      console.log('📅 Total de reuniões no schedule:', meetings.length);
      
      const meeting = meetings.find((m: any) => m.id === tokenData.meeting_id);
      
      if (!meeting) {
        console.error('❌ Reunião não encontrada. ID buscado:', tokenData.meeting_id);
        console.log('IDs disponíveis:', meetings.map((m: any) => m.id).slice(0, 5));
        throw new Error('Reunião não encontrada. O convite pode estar desatualizado.');
      }
      
      console.log('✅ Reunião encontrada:', meeting);
      
      // Buscar documentos
      const allDocs = JSON.parse(localStorage.getItem('meeting_documents') || '[]');
      const meetingDocs = allDocs.filter((doc: any) => doc.meeting_id === tokenData.meeting_id);
      
      const mockData: MeetingData = {
        participant: {
          participant_id: tokenData.participant_id,
          name: tokenData.name,
          email: tokenData.email,
          role: "Convidado Externo"
        },
        meeting: {
          id: meeting.id,
          title: meeting.title || `${meeting.council} - ${meeting.type}`,
          date: meeting.date,
          time: meeting.time,
          location: meeting.location || "A definir",
          status: meeting.status,
          modalidade: meeting.modalidade || "Presencial",
          council: {
            name: meeting.council,
            type: meeting.type
          },
          participants: meeting.participants || []
        },
        permissions: tokenData.permissions,
        visible_items: meeting.agenda?.length > 0 ? meeting.agenda : [
          {
            id: 'default-1',
            title: 'Pauta ainda não definida',
            description: 'A pauta desta reunião será disponibilizada em breve.',
            order_position: 1,
            type: 'Informativo',
            presenter: null,
            duration_minutes: null
          }
        ],
        documents: meetingDocs.map((doc: any) => ({
          id: doc.id,
          name: doc.file_name || doc.name,
          file_data: doc.file_data,
          file_type: doc.file_type || doc.type,
          document_type: doc.document_type || 'Documento',
          created_at: doc.created_at || new Date().toISOString(),
          uploaded_by: doc.uploaded_by
        }))
      };
      
      setData(mockData);
    toast.success(`Bem-vindo, ${tokenData.name}! 👋`, {
      description: `Esta é uma demonstração de acesso de convidado. Você pode ${
        tokenData.permissions.can_upload ? 'visualizar materiais e fazer upload de documentos' : 'visualizar materiais da reunião'
      }.`,
      duration: 5000
    });
      
      console.log('✅ Dados carregados com sucesso:', mockData);
    } catch (err: any) {
      console.error('❌ Erro ao validar token:', err);
      setError(err.message || 'Token inválido ou expirado');
      toast.error('Erro ao acessar reunião', {
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!data?.permissions.can_upload) {
      toast.error('Você não tem permissão para fazer upload de arquivos');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo muito grande! Tamanho máximo: 10MB');
      return;
    }

    setUploading(true);
    try {
      // Ler arquivo como base64
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = reader.result as string;
        
        // Salvar no localStorage
        const newDoc = {
          id: crypto.randomUUID(),
          meeting_id: data.meeting.id,
          file_name: file.name,
          file_data: fileData,
          file_type: file.type,
          document_type: 'Documento Enviado por Convidado',
          created_at: new Date().toISOString(),
          uploaded_by: data.participant.name
        };

        const allDocs = JSON.parse(localStorage.getItem('meeting_documents') || '[]');
        allDocs.push(newDoc);
        localStorage.setItem('meeting_documents', JSON.stringify(allDocs));

        toast.success('Documento enviado com sucesso!');
        
        // Recarregar dados para mostrar novo documento
        fetchMeetingData();
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Erro ao enviar documento');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (doc: MeetingData['documents'][0]) => {
    // Criar link de download a partir do base64
    const link = document.createElement('a');
    link.href = doc.file_data;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download iniciado!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto">
        {loading && (
          <div className="flex items-center justify-center min-h-screen">
            <Card>
              <CardContent className="flex items-center justify-center py-12 px-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-3 text-lg">Carregando informações da reunião...</span>
              </CardContent>
            </Card>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="border-red-200 bg-red-50 max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  Erro ao Acessar Reunião
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600 mb-4">{error}</p>
                <p className="text-sm text-gray-600 mb-4">
                  Por favor, solicite um novo link de acesso.
                </p>
                <Button
                  onClick={() => {
                    initializeDemoData();
                    window.location.href = `${window.location.origin}/guest-access/demo-guest-token-123`;
                  }}
                  className="w-full"
                >
                  Usar Link de Demonstração
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {data && (
          <div className="space-y-0">
            {/* Header com informações da reunião */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{data.meeting.title}</h1>
                  <p className="text-blue-100 text-lg">
                    Você foi convidado como: <span className="font-semibold">{data.participant.name}</span>
                  </p>
                </div>
              </div>
              
              {/* Informações da reunião em destaque */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Calendar className="h-5 w-5 mb-2" />
                  <p className="text-sm text-blue-100">Data</p>
                  <p className="font-semibold text-lg">
                    {new Date(data.meeting.date).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Clock className="h-5 w-5 mb-2" />
                  <p className="text-sm text-blue-100">Horário</p>
                  <p className="font-semibold text-lg">{data.meeting.time}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <MapPin className="h-5 w-5 mb-2" />
                  <p className="text-sm text-blue-100">Modalidade</p>
                  <p className="font-semibold text-lg">{data.meeting.modalidade}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Lista de Participantes */}
              {data.meeting.participants && data.meeting.participants.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Participantes da Reunião ({data.meeting.participants.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {data.meeting.participants.map((participant: any) => {
                        const isCurrentGuest = participant.id === data.participant.participant_id || 
                                              participant.external_email === data.participant.email;
                        const displayName = participant.name || participant.external_name;
                        const displayEmail = participant.email || participant.external_email;
                        const isMember = participant.role === 'MEMBRO';
                        
                        return (
                          <div 
                            key={participant.id}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              isCurrentGuest ? 'bg-primary/10 border-2 border-primary' : 'bg-muted/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                isCurrentGuest ? 'bg-primary text-primary-foreground' : 'bg-muted'
                              }`}>
                                {displayName?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {displayName}
                                  {isCurrentGuest && (
                                    <span className="ml-2 text-xs font-semibold text-primary">(Você)</span>
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground">{displayEmail}</p>
                              </div>
                            </div>
                            <Badge variant={isMember ? "default" : "secondary"}>
                              {isMember ? 'Membro Oficial' : 'Convidado'}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upload de Documentos ou Mensagem de Restrição */}
              {data.permissions.can_upload ? (
                <Card className="border-2 border-blue-500 bg-blue-50/50 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                      <Upload className="h-5 w-5 text-blue-600" />
                      Enviar Documentos
                    </CardTitle>
                    <CardDescription>
                      Você tem permissão para enviar documentos relacionados a esta reunião
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-8 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer bg-white">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer text-center w-full">
                        {uploading ? (
                          <>
                            <Loader2 className="h-12 w-12 mx-auto mb-4 text-blue-500 animate-spin" />
                            <p className="text-blue-600 font-medium">Enviando arquivo...</p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                            <p className="text-blue-900 font-medium mb-2 text-lg">
                              Clique aqui ou arraste um arquivo
                            </p>
                            <p className="text-sm text-gray-600">
                              Tamanho máximo: 10MB
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="mb-6 border-muted">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Permissão de Upload Não Concedida</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Você pode visualizar os materiais da reunião, mas não tem permissão para fazer upload de documentos.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Agenda Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Pauta da Reunião
                  </CardTitle>
                  <CardDescription>
                    {data.visible_items.length} {data.visible_items.length === 1 ? 'item' : 'itens'} na pauta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.visible_items.map((item, index) => (
                      <div
                        key={item.id}
                        className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-blue-50/30 transition-colors rounded-r"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {index + 1}. {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-gray-600 mt-1">{item.description}</p>
                            )}
                            <div className="flex gap-4 mt-2 text-sm text-gray-500">
                              {item.presenter && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {item.presenter}
                                </span>
                              )}
                              {item.duration_minutes && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {item.duration_minutes} min
                                </span>
                              )}
                            </div>
                          </div>
                          <Badge className="ml-2">{item.type}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              {data.documents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Documentos da Reunião
                    </CardTitle>
                    <CardDescription>
                      {data.documents.length} {data.documents.length === 1 ? 'documento disponível' : 'documentos disponíveis'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {data.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-500">
                                Enviado em {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                                {doc.uploaded_by && ` por ${doc.uploaded_by}`}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                            className="flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Baixar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
