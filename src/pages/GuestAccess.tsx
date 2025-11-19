import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, MapPin, Users, Upload, FileText, AlertCircle, Download } from 'lucide-react';
import { toast } from 'sonner';

interface MeetingData {
  participant: {
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

  useEffect(() => {
    if (token) {
      fetchMeetingData();
    }
  }, [token]);

  const fetchMeetingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validar token no localStorage
      const tokens = JSON.parse(localStorage.getItem('guest_tokens') || '{}');
      const tokenData = tokens[token];
      
      if (!tokenData) {
        throw new Error('Token inválido ou não encontrado');
      }
      
      // Verificar expiração
      if (new Date(tokenData.expires_at) < new Date()) {
        throw new Error('Token expirado');
      }
      
      // Incrementar contador de acessos
      tokenData.access_count += 1;
      tokenData.last_accessed_at = new Date().toISOString();
      tokens[token] = tokenData;
      localStorage.setItem('guest_tokens', JSON.stringify(tokens));
      
      // Buscar dados da reunião
      const scheduleData = JSON.parse(localStorage.getItem('annual_council_schedule') || '{}');
      const meetings = scheduleData.meetings || [];
      const meeting = meetings.find((m: any) => m.id === tokenData.meeting_id);
      
      if (!meeting) {
        throw new Error('Reunião não encontrada');
      }
      
      // Buscar documentos
      const allDocs = JSON.parse(localStorage.getItem('meeting_documents') || '[]');
      const meetingDocs = allDocs.filter((doc: any) => doc.meeting_id === tokenData.meeting_id);
      
      const mockData: MeetingData = {
        participant: {
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
          }
        },
        permissions: tokenData.permissions,
        visible_items: meeting.agenda || [],
        documents: meetingDocs.map((doc: any) => ({
          id: doc.id,
          name: doc.file_name,
          file_data: doc.file_data,
          file_type: doc.file_type,
          document_type: doc.document_type,
          created_at: doc.created_at,
          uploaded_by: doc.uploaded_by
        }))
      };
      
      setData(mockData);
      toast.success(`Bem-vindo, ${tokenData.name}! (Acesso #${tokenData.access_count})`);
      
    } catch (err: any) {
      console.error('Error validating token:', err);
      setError(err.message || 'Token inválido ou expirado');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!data?.permissions.can_upload) {
      toast.error('Você não tem permissão para fazer upload');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo: 5MB');
      return;
    }
    
    setUploading(true);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const fileData = e.target?.result as string;
        
        const allDocs = JSON.parse(localStorage.getItem('meeting_documents') || '[]');
        
        const newDoc = {
          id: crypto.randomUUID(),
          meeting_id: data.meeting.id,
          uploaded_by: data.participant.name,
          uploaded_by_email: data.participant.email,
          file_name: file.name,
          file_data: fileData,
          file_type: file.type,
          file_size: file.size,
          document_type: 'guest_upload',
          created_at: new Date().toISOString()
        };
        
        allDocs.push(newDoc);
        localStorage.setItem('meeting_documents', JSON.stringify(allDocs));
        
        const notification = {
          id: `notif-${Date.now()}`,
          type: 'UPLOAD_DOCUMENTO',
          title: '📄 Novo Documento Enviado',
          message: `${data.participant.name} enviou o documento "${file.name}"`,
          scheduled_at: new Date().toISOString(),
          sent_at: new Date().toISOString(),
          status: 'ENVIADA',
          channel: 'EMAIL',
          context: { 
            meeting_id: data.meeting.id,
            document_name: file.name,
            uploader: data.participant.name
          }
        };
        
        const existingNotifs = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
        localStorage.setItem('mock_notifications', JSON.stringify([...existingNotifs, notification]));
        
        toast.success(`✅ Documento "${file.name}" enviado!`);
        toast.success(`📧 [DEMO] Participantes notificados`);
        
        fetchMeetingData();
      };
      
      reader.onerror = () => {
        toast.error('Erro ao ler arquivo');
      };
      
      reader.readAsDataURL(file);
      
    } catch (err: any) {
      toast.error('Erro ao fazer upload: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-muted-foreground">Validando acesso...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Card className="max-w-md shadow-lg">
          <CardHeader>
            <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-center">Acesso Negado</CardTitle>
            <CardDescription className="text-center">
              {error || 'Token inválido ou expirado'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-xl font-bold">Portal do Convidado</h1>
          <p className="text-sm text-muted-foreground">
            Bem-vindo, {data.participant.name}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <Card className="mb-6 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="text-2xl">{data.meeting.title}</CardTitle>
            <CardDescription className="text-blue-100">
              {data.meeting.council.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Data</p>
                  <p className="font-semibold">
                    {new Date(data.meeting.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Horário</p>
                  <p className="font-semibold">{data.meeting.time}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Local</p>
                  <p className="font-semibold">{data.meeting.location || "A definir"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Modalidade</p>
                  <p className="font-semibold">{data.meeting.modalidade}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {data.permissions.can_upload && (
          <Card className="mb-6 border-2 border-dashed border-blue-200 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-500" />
                Enviar Documento
              </CardTitle>
              <CardDescription>
                Você está autorizado a enviar documentos para esta reunião
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 bg-blue-50 rounded-lg">
                <Upload className="h-12 w-12 text-blue-400 mb-4" />
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Arraste um arquivo ou clique para selecionar<br />
                  <span className="text-xs">Máximo: 5MB | PDF, Word, Excel, PowerPoint</span>
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                />
                <Button
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={uploading}
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Arquivo
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {data.visible_items.length > 0 && (
          <Card className="mb-6 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Pauta da Reunião
              </CardTitle>
              <CardDescription>
                {data.visible_items.length} {data.visible_items.length === 1 ? 'item' : 'itens'} para discussão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.visible_items.map((item, index) => (
                  <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">{index + 1}</Badge>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        )}
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          {item.presenter && <span>👤 {item.presenter}</span>}
                          {item.duration_minutes && <span>⏱️ {item.duration_minutes} min</span>}
                          <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {data.documents.length > 0 && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentos Disponíveis
              </CardTitle>
              <CardDescription>
                {data.documents.length} documento(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.uploaded_by && `Enviado por ${doc.uploaded_by} • `}
                          {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = doc.file_data;
                        link.download = doc.name;
                        link.click();
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
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
  );
}
