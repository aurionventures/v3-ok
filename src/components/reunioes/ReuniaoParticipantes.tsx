import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, UserPlus, Link2, Trash2, Copy, Check, Settings } from 'lucide-react';
import { useMeetingParticipants } from '@/hooks/useMeetingParticipants';
import { useGuestTokens } from '@/hooks/useGuestTokens';
import { useMeetingItemVisibility } from '@/hooks/useMeetingItemVisibility';
import { useMeetingItems } from '@/hooks/useMeetingItems';
import { toast } from 'sonner';

interface ReuniaoParticipantesProps {
  meetingId: string;
}

export const ReuniaoParticipantes = ({ meetingId }: ReuniaoParticipantesProps) => {
  const { participants, isLoading, addParticipant, updateParticipant, removeParticipant } = useMeetingParticipants(meetingId);
  const { items } = useMeetingItems(meetingId);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showVisibilityDialog, setShowVisibilityDialog] = useState(false);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Form states
  const [externalName, setExternalName] = useState('');
  const [externalEmail, setExternalEmail] = useState('');
  const [externalPhone, setExternalPhone] = useState('');
  const [role, setRole] = useState<'MEMBRO' | 'CONVIDADO' | 'OBSERVADOR'>('CONVIDADO');
  const [canUpload, setCanUpload] = useState(false);
  const [canViewMaterials, setCanViewMaterials] = useState(true);

  // Token form
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [tokenCanUpload, setTokenCanUpload] = useState(false);
  const [tokenCanView, setTokenCanView] = useState(true);

  // Visibility
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { generateToken } = useGuestTokens(selectedParticipant || undefined);
  const { setMultipleVisibilities } = useMeetingItemVisibility(selectedParticipant || undefined);

  const handleAddExternal = () => {
    if (!externalName || !externalEmail) {
      toast.error('Nome e email são obrigatórios');
      return;
    }

    addParticipant({
      meeting_id: meetingId,
      user_id: null,
      external_name: externalName,
      external_email: externalEmail,
      external_phone: externalPhone || null,
      role,
      can_upload: canUpload,
      can_view_materials: canViewMaterials,
      invited_by: null,
    });

    // Reset form
    setExternalName('');
    setExternalEmail('');
    setExternalPhone('');
    setRole('CONVIDADO');
    setCanUpload(false);
    setCanViewMaterials(true);
    setShowAddDialog(false);
  };

  const handleGenerateToken = async () => {
    if (!selectedParticipant) return;

    try {
      const token = await generateToken({
        participantId: selectedParticipant,
        expiresInDays,
        canUpload: tokenCanUpload,
        canViewMaterials: tokenCanView,
      });

      const guestUrl = `${window.location.origin}/guest/${token.token}`;
      await navigator.clipboard.writeText(guestUrl);
      setCopiedToken(token.token);
      
      toast.success('Link copiado para a área de transferência!');
      
      setTimeout(() => setCopiedToken(null), 3000);
    } catch (error) {
      console.error('Error generating token:', error);
    }
  };

  const handleConfigureVisibility = () => {
    if (!selectedParticipant || selectedItems.length === 0) {
      toast.error('Selecione ao menos uma pauta');
      return;
    }

    setMultipleVisibilities({
      participantId: selectedParticipant,
      itemIds: selectedItems,
      canView: true,
    });

    setShowVisibilityDialog(false);
    setSelectedItems([]);
  };

  const openVisibilityDialog = (participantId: string) => {
    setSelectedParticipant(participantId);
    setShowVisibilityDialog(true);
  };

  const openTokenDialog = (participantId: string) => {
    setSelectedParticipant(participantId);
    setShowTokenDialog(true);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'MEMBRO': return 'default';
      case 'CONVIDADO': return 'secondary';
      case 'OBSERVADOR': return 'outline';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'MEMBRO': return 'Membro';
      case 'CONVIDADO': return 'Convidado';
      case 'OBSERVADOR': return 'Observador';
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Participantes</h2>
          <p className="text-muted-foreground">Gerencie membros e convidados da reunião</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Participante
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Participante Externo</DialogTitle>
              <DialogDescription>
                Adicione um convidado externo à reunião
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={externalName}
                  onChange={(e) => setExternalName(e.target.value)}
                  placeholder="Nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={externalEmail}
                  onChange={(e) => setExternalEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={externalPhone}
                  onChange={(e) => setExternalPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Tipo</Label>
                <Select value={role} onValueChange={(v) => setRole(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONVIDADO">Convidado</SelectItem>
                    <SelectItem value="OBSERVADOR">Observador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="upload"
                    checked={canUpload}
                    onCheckedChange={(checked) => setCanUpload(checked as boolean)}
                  />
                  <Label htmlFor="upload" className="cursor-pointer">
                    Permitir upload de documentos
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="view"
                    checked={canViewMaterials}
                    onCheckedChange={(checked) => setCanViewMaterials(checked as boolean)}
                  />
                  <Label htmlFor="view" className="cursor-pointer">
                    Visualizar materiais
                  </Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleAddExternal} className="flex-1">
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Participantes ({participants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Carregando...</p>
          ) : participants.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum participante adicionado ainda.
            </p>
          ) : (
            <div className="space-y-3">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">
                        {participant.external_name || 'Membro Interno'}
                      </p>
                      <Badge variant={getRoleBadgeVariant(participant.role)}>
                        {getRoleLabel(participant.role)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {participant.external_email || 'Email não informado'}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      {participant.can_upload && <span>✓ Pode enviar documentos</span>}
                      {participant.can_view_materials && <span>✓ Pode ver materiais</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {participant.role !== 'MEMBRO' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openVisibilityDialog(participant.id)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Pautas
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openTokenDialog(participant.id)}
                        >
                          <Link2 className="h-4 w-4 mr-2" />
                          Gerar Link
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeParticipant(participant.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configure Visibility Dialog */}
      <Dialog open={showVisibilityDialog} onOpenChange={setShowVisibilityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar Pautas Visíveis</DialogTitle>
            <DialogDescription>
              Selecione quais pautas o participante poderá visualizar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={item.id}
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedItems([...selectedItems, item.id]);
                    } else {
                      setSelectedItems(selectedItems.filter(id => id !== item.id));
                    }
                  }}
                />
                <Label htmlFor={item.id} className="cursor-pointer flex-1">
                  <span className="font-medium">{item.order_position}. {item.title}</span>
                  <Badge variant="outline" className="ml-2">{item.type}</Badge>
                </Label>
              </div>
            ))}

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowVisibilityDialog(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button onClick={handleConfigureVisibility} className="flex-1">
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generate Token Dialog */}
      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Link de Acesso</DialogTitle>
            <DialogDescription>
              Crie um link seguro para o convidado acessar a reunião
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="expires">Validade do Link</Label>
              <Select
                value={expiresInDays.toString()}
                onValueChange={(v) => setExpiresInDays(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 dias</SelectItem>
                  <SelectItem value="15">15 dias</SelectItem>
                  <SelectItem value="30">30 dias</SelectItem>
                  <SelectItem value="60">60 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="token-upload"
                  checked={tokenCanUpload}
                  onCheckedChange={(checked) => setTokenCanUpload(checked as boolean)}
                />
                <Label htmlFor="token-upload" className="cursor-pointer">
                  Permitir upload de documentos
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="token-view"
                  checked={tokenCanView}
                  onCheckedChange={(checked) => setTokenCanView(checked as boolean)}
                />
                <Label htmlFor="token-view" className="cursor-pointer">
                  Visualizar materiais
                </Label>
              </div>
            </div>

            <Button onClick={handleGenerateToken} className="w-full">
              {copiedToken ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Link Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Gerar e Copiar Link
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
