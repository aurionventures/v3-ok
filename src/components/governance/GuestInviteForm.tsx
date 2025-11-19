import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail, Phone, Upload, Eye, MessageSquare } from 'lucide-react';

interface GuestInviteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingId: string;
  onGuestAdded: () => void;
}

export const GuestInviteForm = ({ 
  open, 
  onOpenChange, 
  meetingId, 
  onGuestAdded 
}: GuestInviteFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    external_name: '',
    external_email: '',
    external_phone: '',
    can_upload: false,
    can_view_materials: true,
    can_comment: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.external_name || !formData.external_email) {
      toast({
        title: "Erro",
        description: "Nome e e-mail são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Aqui você implementaria a lógica para adicionar o convidado
      // usando o hook useMeetingParticipants quando estiver pronto
      
      // Simulação de sucesso
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Convidado adicionado",
        description: `${formData.external_name} foi convidado para a reunião.`,
      });

      onGuestAdded();
      onOpenChange(false);
      
      // Limpar formulário
      setFormData({
        external_name: '',
        external_email: '',
        external_phone: '',
        can_upload: false,
        can_view_materials: true,
        can_comment: false
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o convidado.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Convidar Participante Externo
          </DialogTitle>
          <DialogDescription>
            Adicione um convidado com permissões específicas para esta reunião
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Convidado *</Label>
            <Input
              id="name"
              value={formData.external_name}
              onChange={(e) => setFormData({ ...formData, external_name: e.target.value })}
              placeholder="Ex: João Silva"
              required
            />
          </div>

          {/* E-mail */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              E-mail *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.external_email}
              onChange={(e) => setFormData({ ...formData, external_email: e.target.value })}
              placeholder="joao@empresa.com"
              required
            />
          </div>

          {/* Telefone (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefone (opcional)
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.external_phone}
              onChange={(e) => setFormData({ ...formData, external_phone: e.target.value })}
              placeholder="+55 11 99999-9999"
            />
          </div>

          {/* Permissões */}
          <div className="space-y-3 pt-2 border-t">
            <Label className="font-semibold">Permissões</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="can_view"
                checked={formData.can_view_materials}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, can_view_materials: checked as boolean })
                }
              />
              <label
                htmlFor="can_view"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Visualizar materiais da reunião
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="can_upload"
                checked={formData.can_upload}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, can_upload: checked as boolean })
                }
              />
              <label
                htmlFor="can_upload"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Fazer upload de documentos
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="can_comment"
                checked={formData.can_comment}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, can_comment: checked as boolean })
                }
              />
              <label
                htmlFor="can_comment"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Adicionar comentários
              </label>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Enviando..." : "Enviar Convite"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
