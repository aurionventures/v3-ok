import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCouncilReminderConfig } from "@/hooks/useCouncilReminderConfig";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface CouncilReminderConfigProps {
  councilId: string;
}

const CouncilReminderConfig = ({ councilId }: CouncilReminderConfigProps) => {
  const { config, loading, updateConfig } = useCouncilReminderConfig(councilId);
  const [formData, setFormData] = useState({
    remind_30d: true,
    remind_7d: true,
    remind_24h: true,
    remind_12h: false,
    remind_1h: false,
  });

  useEffect(() => {
    if (config) {
      setFormData({
        remind_30d: config.remind_30d,
        remind_7d: config.remind_7d,
        remind_24h: config.remind_24h,
        remind_12h: config.remind_12h,
        remind_1h: config.remind_1h,
      });
    }
  }, [config]);

  const handleSave = () => {
    updateConfig(formData);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⏰ Configuração de Lembretes Automáticos
        </CardTitle>
        <CardDescription>
          Configure quando os membros devem ser notificados antes das reuniões deste conselho
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="remind_30d" className="cursor-pointer">
            30 dias antes
          </Label>
          <Switch
            id="remind_30d"
            checked={formData.remind_30d}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, remind_30d: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="remind_7d" className="cursor-pointer">
            7 dias antes
          </Label>
          <Switch
            id="remind_7d"
            checked={formData.remind_7d}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, remind_7d: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="remind_24h" className="cursor-pointer">
            24 horas antes
          </Label>
          <Switch
            id="remind_24h"
            checked={formData.remind_24h}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, remind_24h: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="remind_12h" className="cursor-pointer">
            12 horas antes
          </Label>
          <Switch
            id="remind_12h"
            checked={formData.remind_12h}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, remind_12h: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="remind_1h" className="cursor-pointer">
            1 hora antes
          </Label>
          <Switch
            id="remind_1h"
            checked={formData.remind_1h}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, remind_1h: checked })
            }
          />
        </div>

        <Button onClick={handleSave} className="w-full mt-4">
          Salvar Configuração
        </Button>
      </CardContent>
    </Card>
  );
};

export default CouncilReminderConfig;
