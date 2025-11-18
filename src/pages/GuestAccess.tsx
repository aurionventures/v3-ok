import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calendar, MapPin, Users, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
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
    file_url: string;
    file_type: string | null;
    document_type: string;
    created_at: string;
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

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/guest-access/${token}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao carregar dados');
      }

      const meetingData = await response.json();
      setData(meetingData);
    } catch (err: any) {
      console.error('Error fetching meeting data:', err);
      setError(err.message || 'Token inválido ou expirado');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, itemId?: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      if (itemId) formData.append('meeting_item_id', itemId);
      formData.append('document_type', 'OUTROS');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/guest-access/upload/${token}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao fazer upload');
      }

      toast.success('Documento enviado com sucesso');
      fetchMeetingData(); // Reload data to show new document
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error('Erro ao enviar documento: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Acesso Negado</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {error || 'Link inválido ou expirado. Entre em contato com o organizador da reunião.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Portal do Convidado</h1>
              <p className="text-muted-foreground">Bem-vindo, {data.participant.name}</p>
            </div>
            <Badge variant="secondary">{data.participant.role}</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        {/* Meeting Info */}
        <Card>
          <CardHeader>
            <CardTitle>{data.meeting.title}</CardTitle>
            <CardDescription>{data.meeting.council.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Data e Hora</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(data.meeting.date).toLocaleDateString('pt-BR')} às {data.meeting.time}
                  </p>
                </div>
              </div>
              
              {data.meeting.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Local</p>
                    <p className="text-sm text-muted-foreground">{data.meeting.location}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Modalidade</p>
                  <p className="text-sm text-muted-foreground">{data.meeting.modalidade}</p>
                </div>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Você foi convidado como <strong>{data.participant.role}</strong>. 
                {data.permissions.can_upload && ' Você pode enviar documentos.'}
                {data.permissions.can_view_materials && ' Você pode visualizar materiais.'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Agenda Items */}
        <Card>
          <CardHeader>
            <CardTitle>Pautas da Reunião</CardTitle>
            <CardDescription>
              {data.visible_items.length} {data.visible_items.length === 1 ? 'pauta disponível' : 'pautas disponíveis'} para você
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.visible_items.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma pauta disponível no momento.
              </p>
            ) : (
              <div className="space-y-4">
                {data.visible_items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <h3 className="font-semibold">{item.title}</h3>
                      </div>
                      <Badge>{item.type}</Badge>
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {item.presenter && <span>Apresentador: {item.presenter}</span>}
                      {item.duration_minutes && <span>{item.duration_minutes} minutos</span>}
                    </div>

                    {data.permissions.can_upload && (
                      <div className="mt-4">
                        <Separator className="mb-4" />
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            id={`file-${item.id}`}
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, item.id)}
                            disabled={uploading}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`file-${item.id}`)?.click()}
                            disabled={uploading}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Enviar Documento
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        {data.permissions.can_view_materials && (
          <Card>
            <CardHeader>
              <CardTitle>Materiais da Reunião</CardTitle>
              <CardDescription>
                {data.documents.length} {data.documents.length === 1 ? 'documento disponível' : 'documentos disponíveis'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.documents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum documento disponível ainda.
                </p>
              ) : (
                <div className="space-y-2">
                  {data.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.document_type} • {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                          Abrir
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upload Section for General Documents */}
        {data.permissions.can_upload && (
          <Card>
            <CardHeader>
              <CardTitle>Enviar Documento Geral</CardTitle>
              <CardDescription>
                Envie documentos que não estão vinculados a uma pauta específica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                id="general-file"
                className="hidden"
                onChange={(e) => handleFileUpload(e)}
                disabled={uploading}
              />
              <Button
                onClick={() => document.getElementById('general-file')?.click()}
                disabled={uploading}
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
