import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { Loader2 } from "lucide-react";

const NotificationSettings = () => {
  const { preferences, loading, updatePreferences, resetToDefaults } = useNotificationPreferences();
  const [formData, setFormData] = useState({
    email_enabled: true,
    whatsapp_enabled: false,
    whatsapp_number: "",
    sms_enabled: false,
    sms_number: "",
    in_app_enabled: true,
    notify_meeting_reminders: true,
    notify_pending_actions: true,
    notify_overdue_actions: true,
  });

  useEffect(() => {
    if (preferences) {
      setFormData({
        email_enabled: preferences.email_enabled,
        whatsapp_enabled: preferences.whatsapp_enabled,
        whatsapp_number: preferences.whatsapp_number || "",
        sms_enabled: preferences.sms_enabled,
        sms_number: preferences.sms_number || "",
        in_app_enabled: preferences.in_app_enabled,
        notify_meeting_reminders: preferences.notify_meeting_reminders,
        notify_pending_actions: preferences.notify_pending_actions,
        notify_overdue_actions: preferences.notify_overdue_actions,
      });
    }
  }, [preferences]);

  const handleSave = () => {
    updatePreferences(formData);
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Configurações de Notificações</h1>
              <p className="text-muted-foreground">
                Configure como e quando você deseja receber notificações sobre reuniões e pendências.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Canais de Notificação</CardTitle>
                <CardDescription>
                  Escolha por quais canais deseja receber suas notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>📧 Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações por email
                    </p>
                  </div>
                  <Switch
                    checked={formData.email_enabled}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, email_enabled: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>📱 WhatsApp</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações por WhatsApp
                      </p>
                    </div>
                    <Switch
                      checked={formData.whatsapp_enabled}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, whatsapp_enabled: checked })
                      }
                    />
                  </div>
                  {formData.whatsapp_enabled && (
                    <div>
                      <Label htmlFor="whatsapp">Número de WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        placeholder="+55 (11) 99999-9999"
                        value={formData.whatsapp_number}
                        onChange={(e) =>
                          setFormData({ ...formData, whatsapp_number: e.target.value })
                        }
                      />
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>💬 SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações por SMS
                      </p>
                    </div>
                    <Switch
                      checked={formData.sms_enabled}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, sms_enabled: checked })
                      }
                    />
                  </div>
                  {formData.sms_enabled && (
                    <div>
                      <Label htmlFor="sms">Número de Celular</Label>
                      <Input
                        id="sms"
                        placeholder="+55 (11) 99999-9999"
                        value={formData.sms_number}
                        onChange={(e) =>
                          setFormData({ ...formData, sms_number: e.target.value })
                        }
                      />
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>🔔 Notificações no App</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações dentro da plataforma
                    </p>
                  </div>
                  <Switch
                    checked={formData.in_app_enabled}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, in_app_enabled: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Notificação</CardTitle>
                <CardDescription>
                  Escolha sobre quais eventos deseja ser notificado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Lembretes de Reuniões</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber lembretes automáticos antes das reuniões
                    </p>
                  </div>
                  <Switch
                    checked={formData.notify_meeting_reminders}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, notify_meeting_reminders: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pendências Próximas ao Vencimento</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber avisos quando pendências estiverem próximas do prazo
                    </p>
                  </div>
                  <Switch
                    checked={formData.notify_pending_actions}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, notify_pending_actions: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pendências Atrasadas</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber alertas diários sobre pendências atrasadas
                    </p>
                  </div>
                  <Switch
                    checked={formData.notify_overdue_actions}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, notify_overdue_actions: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleSave}>Salvar Preferências</Button>
              <Button variant="outline" onClick={() => resetToDefaults()}>
                Restaurar Padrões
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationSettings;
