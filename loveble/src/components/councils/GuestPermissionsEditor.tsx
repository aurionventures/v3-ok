import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, Upload, Eye, MessageSquare } from "lucide-react";

interface GuestPermissions {
  can_upload: boolean;
  can_view_materials: boolean;
  can_comment: boolean;
}

interface GuestPermissionsEditorProps {
  guestName: string;
  guestEmail: string;
  initialPermissions?: GuestPermissions;
  onSave?: (permissions: GuestPermissions) => void;
}

export function GuestPermissionsEditor({
  guestName,
  guestEmail,
  initialPermissions = {
    can_upload: false,
    can_view_materials: true,
    can_comment: false,
  },
  onSave,
}: GuestPermissionsEditorProps) {
  const [permissions, setPermissions] = useState<GuestPermissions>(initialPermissions);

  const handleToggle = (key: keyof GuestPermissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    onSave?.(permissions);
    toast.success("✅ [DEMO] Permissões salvas com sucesso");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Configuração de Permissões
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Guest Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{guestName}</Badge>
            <span className="text-sm text-muted-foreground">{guestEmail}</span>
          </div>
        </div>

        {/* Permissions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <Label htmlFor="view-materials">Visualizar Materiais</Label>
            </div>
            <Switch
              id="view-materials"
              checked={permissions.can_view_materials}
              onCheckedChange={() => handleToggle('can_view_materials')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-green-600" />
              <Label htmlFor="upload-docs">Fazer Upload de Documentos</Label>
            </div>
            <Switch
              id="upload-docs"
              checked={permissions.can_upload}
              onCheckedChange={() => handleToggle('can_upload')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-600" />
              <Label htmlFor="comment">Comentar em Pautas</Label>
            </div>
            <Switch
              id="comment"
              checked={permissions.can_comment}
              onCheckedChange={() => handleToggle('can_comment')}
            />
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full">
          Salvar Permissões
        </Button>
      </CardContent>
    </Card>
  );
}
