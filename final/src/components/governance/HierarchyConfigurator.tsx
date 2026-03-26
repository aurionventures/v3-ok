import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AccessConfig } from '@/hooks/useGovernanceOrgans';
import { Shield, Users, Eye, Upload, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HierarchyConfiguratorProps {
  organId: string;
  organName: string;
  currentConfig: AccessConfig;
  onSave: (config: AccessConfig) => Promise<void>;
}

export const HierarchyConfigurator = ({ 
  organId, 
  organName, 
  currentConfig, 
  onSave 
}: HierarchyConfiguratorProps) => {
  const [config, setConfig] = useState<AccessConfig>(currentConfig);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(config);
      toast({
        title: "Configurações salvas",
        description: `As permissões de "${organName}" foram atualizadas.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Hierarquia de Acesso - {organName}
        </CardTitle>
        <CardDescription>
          Configure os níveis de permissão e visibilidade deste órgão
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nível 1: Visualização Pública */}
        <div className="space-y-4 border-l-4 border-blue-500 pl-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <Label htmlFor="public-view" className="font-semibold">
                  Visualização Pública
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Reuniões e documentos visíveis para qualquer usuário da empresa
              </p>
            </div>
            <Switch
              id="public-view"
              checked={config.public_view}
              onCheckedChange={(checked) => 
                setConfig({ ...config, public_view: checked })
              }
            />
          </div>
        </div>

        {/* Nível 2: Membros */}
        <div className="space-y-4 border-l-4 border-green-500 pl-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <Label htmlFor="member-upload" className="font-semibold">
                  Permissões de Membros
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Membros permanentes podem fazer upload de documentos
              </p>
            </div>
            <Switch
              id="member-upload"
              checked={config.member_upload}
              onCheckedChange={(checked) => 
                setConfig({ ...config, member_upload: checked })
              }
            />
          </div>
        </div>

        {/* Nível 3: Convidados */}
        <div className="space-y-4 border-l-4 border-amber-500 pl-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-amber-500" />
                  <Label htmlFor="guest-upload" className="font-semibold">
                    Permissões de Convidados
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Convidados podem fazer upload de documentos
                </p>
              </div>
              <Switch
                id="guest-upload"
                checked={config.guest_upload}
                onCheckedChange={(checked) => 
                  setConfig({ ...config, guest_upload: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Nível 4: Aprovações */}
        <div className="space-y-4 border-l-4 border-purple-500 pl-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                <Label htmlFor="require-approval" className="font-semibold">
                  Requer Aprovação
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Documentos enviados por convidados precisam de aprovação antes de serem visíveis
              </p>
            </div>
            <Switch
              id="require-approval"
              checked={config.require_approval}
              onCheckedChange={(checked) => 
                setConfig({ ...config, require_approval: checked })
              }
            />
          </div>
        </div>

        {/* Botão de Salvar */}
        <div className="pt-4 border-t">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full"
          >
            {saving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
