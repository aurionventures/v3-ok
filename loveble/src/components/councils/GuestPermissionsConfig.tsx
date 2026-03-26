import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, User, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface GuestPermissions {
  can_view_materials: boolean;
  can_upload: boolean;
  can_comment: boolean;
  can_vote: boolean;
}

interface GuestPermissionsConfigProps {
  guestName: string;
  guestEmail: string;
  initialPermissions?: GuestPermissions;
  onSave?: (permissions: GuestPermissions) => void;
}

export const GuestPermissionsConfig = ({
  guestName,
  guestEmail,
  initialPermissions = {
    can_view_materials: true,
    can_upload: false,
    can_comment: false,
    can_vote: false
  },
  onSave
}: GuestPermissionsConfigProps) => {
  const [permissions, setPermissions] = useState<GuestPermissions>(initialPermissions);
  const { toast } = useToast();

  const handleToggle = (key: keyof GuestPermissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(permissions);
    }
    toast({
      title: "Permissões atualizadas",
      description: `Permissões de ${guestName} foram configuradas com sucesso.`
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{guestName}</CardTitle>
              <CardDescription>{guestEmail}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" />
            Convidado
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="space-y-0.5">
              <Label htmlFor="view-materials" className="text-base">
                Visualizar Materiais
              </Label>
              <p className="text-sm text-muted-foreground">
                Acesso para visualizar documentos e materiais da reunião
              </p>
            </div>
            <Switch
              id="view-materials"
              checked={permissions.can_view_materials}
              onCheckedChange={() => handleToggle('can_view_materials')}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="space-y-0.5">
              <Label htmlFor="upload-docs" className="text-base">
                Fazer Upload de Documentos
              </Label>
              <p className="text-sm text-muted-foreground">
                Permitir upload de arquivos e materiais complementares
              </p>
            </div>
            <Switch
              id="upload-docs"
              checked={permissions.can_upload}
              onCheckedChange={() => handleToggle('can_upload')}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="space-y-0.5">
              <Label htmlFor="comment" className="text-base">
                Comentar em Pautas
              </Label>
              <p className="text-sm text-muted-foreground">
                Adicionar comentários e observações nos itens de pauta
              </p>
            </div>
            <Switch
              id="comment"
              checked={permissions.can_comment}
              onCheckedChange={() => handleToggle('can_comment')}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="space-y-0.5">
              <Label htmlFor="vote" className="text-base">
                Votar em Deliberações
              </Label>
              <p className="text-sm text-muted-foreground">
                Participar de votações e tomadas de decisão
              </p>
            </div>
            <Switch
              id="vote"
              checked={permissions.can_vote}
              onCheckedChange={() => handleToggle('can_vote')}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Permissões
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
