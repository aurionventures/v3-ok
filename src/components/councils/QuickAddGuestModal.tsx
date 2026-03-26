import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useMeetingParticipants } from '@/hooks/useMeetingParticipants';
import { useGuestTokens } from '@/hooks/useGuestTokens';
import { Copy, Check, Loader2 } from 'lucide-react';

interface QuickAddGuestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingId: string;
  meetingTitle: string;
}

export const QuickAddGuestModal: React.FC<QuickAddGuestModalProps> = ({
  open,
  onOpenChange,
  meetingId,
  meetingTitle
}) => {
  const { toast } = useToast();
  const { addParticipant } = useMeetingParticipants(meetingId);
  const { generateToken } = useGuestTokens();
  
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    canUpload: true,
    canViewMaterials: true,
    canComment: false
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o nome e email do convidado.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);

      // Adicionar participante
      addParticipant({
        meeting_id: meetingId,
        user_id: null,
        external_name: formData.name,
        external_email: formData.email,
        external_phone: null,
        role: 'CONVIDADO',
        can_upload: formData.canUpload,
        can_view_materials: formData.canViewMaterials,
        invited_by: null
      });

      // Gerar token de acesso
      const token = await generateToken({
        participantId: meetingId, // Temporário - deveria ser o ID do participante criado
        expiresInDays: 30,
        canUpload: formData.canUpload,
        canViewMaterials: formData.canViewMaterials
      });

      // Gerar link
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/guest-access?token=${token.token}`;
      setGeneratedLink(link);

      toast({
        title: 'Convidado adicionado',
        description: 'Link de acesso gerado com sucesso!'
      });

    } catch (error) {
      console.error('Erro ao adicionar convidado:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao adicionar convidado. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;
    
    try {
      await navigator.clipboard.writeText(generatedLink);
      setLinkCopied(true);
      toast({
        title: 'Link copiado!',
        description: 'O link de acesso foi copiado para a área de transferência.'
      });
      
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível copiar o link.',
        variant: 'destructive'
      });
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      canUpload: true,
      canViewMaterials: true,
      canComment: false
    });
    setGeneratedLink(null);
    setLinkCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Convidado Externo</DialogTitle>
          <DialogDescription>
            Convide alguém para participar da reunião: {meetingTitle}
          </DialogDescription>
        </DialogHeader>

        {!generatedLink ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Nome completo do convidado"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-sm font-medium">Permissões</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canUpload"
                  checked={formData.canUpload}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, canUpload: checked as boolean }))
                  }
                />
                <label
                  htmlFor="canUpload"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Pode fazer upload de documentos
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canViewMaterials"
                  checked={formData.canViewMaterials}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, canViewMaterials: checked as boolean }))
                  }
                />
                <label
                  htmlFor="canViewMaterials"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Pode visualizar materiais
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canComment"
                  checked={formData.canComment}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, canComment: checked as boolean }))
                  }
                />
                <label
                  htmlFor="canComment"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Pode comentar em pautas
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4">
              <Label className="text-sm font-medium mb-2 block">Link de Acesso Gerado</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={generatedLink}
                  readOnly
                  className="text-xs"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyLink}
                >
                  {linkCopied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Envie este link para {formData.name} ({formData.email})
              </p>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium">Permissões concedidas:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {formData.canUpload && <li>Fazer upload de documentos</li>}
                {formData.canViewMaterials && <li>Visualizar materiais</li>}
                {formData.canComment && <li>Comentar em pautas</li>}
              </ul>
            </div>
          </div>
        )}

        <DialogFooter>
          {!generatedLink ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gerar Link
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} className="w-full">
              Concluir
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
