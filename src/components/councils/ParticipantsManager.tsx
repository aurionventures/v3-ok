import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { UserPlus, Copy, CheckCircle2, X, Mail } from 'lucide-react';
import { MeetingParticipant } from '@/types/annualSchedule';
import { toast } from 'sonner';

interface ParticipantsManagerProps {
  meetingId: string;
  councilId?: string;
  organType?: string;
  participants?: MeetingParticipant[];
  onUpdate: (participants: MeetingParticipant[]) => void;
}

export default function ParticipantsManager({ 
  meetingId, 
  councilId,
  organType,
  participants = [], 
  onUpdate 
}: ParticipantsManagerProps) {
  const [localParticipants, setLocalParticipants] = useState<MeetingParticipant[]>(participants);
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    can_upload: false,
    can_view_materials: true,
    can_comment: false,
  });

  useEffect(() => {
    // Carregar membros automaticamente quando councilId muda
    const loadOrganMembers = () => {
      if (!councilId) return;

      // Dados mockados de membros alocados ao órgão
      const mockOrganMembers: MeetingParticipant[] = [
        {
          id: crypto.randomUUID(),
          external_name: 'João Silva',
          role: 'MEMBRO',
          can_upload: true,
          can_view_materials: true,
          can_comment: true,
          confirmed: false,
        },
        {
          id: crypto.randomUUID(),
          external_name: 'Maria Santos',
          role: 'MEMBRO',
          can_upload: true,
          can_view_materials: true,
          can_comment: true,
          confirmed: false,
        },
        {
          id: crypto.randomUUID(),
          external_name: 'Carlos Oliveira',
          role: 'MEMBRO',
          can_upload: true,
          can_view_materials: true,
          can_comment: true,
          confirmed: false,
        },
      ];

      setLocalParticipants(mockOrganMembers);
      onUpdate(mockOrganMembers);
      
      toast.success(`${mockOrganMembers.length} membros carregados automaticamente`);
    };

    loadOrganMembers();
  }, [councilId]);

  const addGuest = () => {
    if (!newGuest.name || !newGuest.email) {
      toast.error('Preencha nome e email do convidado');
      return;
    }

    // Gerar token único e Magic Link
    const token = crypto.randomUUID();
    const participantId = crypto.randomUUID();
    const magicLink = `${window.location.origin}/guest-access/${token}`;

    const guest: MeetingParticipant = {
      id: participantId,
      external_name: newGuest.name,
      external_email: newGuest.email,
      role: 'CONVIDADO',
      can_upload: newGuest.can_upload,
      can_view_materials: newGuest.can_view_materials,
      can_comment: newGuest.can_comment,
      guest_token: token,
      guest_link: magicLink,
      confirmed: false,
    };

    // Salvar token no localStorage
    const tokens = JSON.parse(localStorage.getItem('guest_tokens') || '{}');
    tokens[token] = {
      participant_id: participantId,
      meeting_id: meetingId,
      name: newGuest.name,
      email: newGuest.email,
      permissions: {
        can_upload: newGuest.can_upload,
        can_view_materials: newGuest.can_view_materials,
        can_comment: newGuest.can_comment
      },
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      access_count: 0,
      last_accessed_at: null
    };
    localStorage.setItem('guest_tokens', JSON.stringify(tokens));
    
    console.log('🔑 Magic Link gerado:', {
      token,
      meeting_id: meetingId,
      guest: newGuest.name,
      email: newGuest.email,
      link: magicLink,
      permissions: tokens[token].permissions
    });

    const updated = [...localParticipants, guest];
    setLocalParticipants(updated);
    onUpdate(updated);

    setNewGuest({
      name: '',
      email: '',
      can_upload: false,
      can_view_materials: true,
      can_comment: false,
    });

    toast.success(`Convidado ${newGuest.name} adicionado! 🎉`, {
      description: 'Magic Link copiado para a área de transferência'
    });
  };

  const removeParticipant = (id: string) => {
    const updated = localParticipants.filter(p => p.id !== id);
    setLocalParticipants(updated);
    onUpdate(updated);
  };

  const toggleConfirmation = (id: string) => {
    const updated = localParticipants.map(p => 
      p.id === id ? { ...p, confirmed: !p.confirmed } : p
    );
    setLocalParticipants(updated);
    onUpdate(updated);
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyGuestLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('🔗 Magic Link copiado!');
  };

  const members = localParticipants.filter(p => p.role === 'MEMBRO');
  const guests = localParticipants.filter(p => p.role === 'CONVIDADO');

  return (
    <div className="space-y-6">
      {/* Membros Alocados */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Membros do Órgão</h3>
        <div className="space-y-2">
          {members.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={member.confirmed}
                      onCheckedChange={() => toggleConfirmation(member.id)}
                    />
                    <div>
                      <p className="font-medium">Membro {member.id.substring(0, 8)}</p>
                      <Badge variant="secondary">Membro</Badge>
                    </div>
                  </div>
                  {member.confirmed && (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Confirmado
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Adicionar Convidados */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Adicionar Convidados Externos</h3>
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome do Convidado</Label>
                <Input
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Permissões</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={newGuest.can_upload}
                    onCheckedChange={(checked) => 
                      setNewGuest({ ...newGuest, can_upload: checked as boolean })
                    }
                  />
                  <Label className="font-normal">Pode fazer upload de documentos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={newGuest.can_view_materials}
                    onCheckedChange={(checked) => 
                      setNewGuest({ ...newGuest, can_view_materials: checked as boolean })
                    }
                  />
                  <Label className="font-normal">Pode visualizar materiais</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={newGuest.can_comment}
                    onCheckedChange={(checked) => 
                      setNewGuest({ ...newGuest, can_comment: checked as boolean })
                    }
                  />
                  <Label className="font-normal">Pode comentar em pautas</Label>
                </div>
              </div>
            </div>

            <Button onClick={addGuest} className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Convidado
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Convidados */}
      {guests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Convidados Adicionados</h3>
          <div className="space-y-2">
            {guests.map((guest) => (
              <Card key={guest.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{guest.external_name}</p>
                        <Badge variant="outline">Convidado</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {guest.external_email}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {guest.can_upload && <Badge variant="secondary" className="text-xs">Upload</Badge>}
                        {guest.can_view_materials && <Badge variant="secondary" className="text-xs">Visualizar</Badge>}
                        {guest.can_comment && <Badge variant="secondary" className="text-xs">Comentar</Badge>}
                      </div>
                      {guest.guest_link && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyGuestLink(guest.guest_link!, guest.id)}
                            className="mt-2"
                          >
                            {copiedId === guest.id ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                                Copiado!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                Copiar Magic Link
                              </>
                            )}
                          </Button>
                          <Badge variant="outline" className="text-xs mt-2">
                            🔗 Link Ativo
                          </Badge>
                        </>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeParticipant(guest.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
