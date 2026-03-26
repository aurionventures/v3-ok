import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Zap } from "lucide-react";
import { toast } from "sonner";
import { useNotificationsDemo } from "@/hooks/useNotificationsDemo";

interface NotificationSimulatorProps {
  onSimulated: () => void;
}

export const NotificationSimulator = ({ onSimulated }: NotificationSimulatorProps) => {
  const { simulateAutomaticReminders } = useNotificationsDemo();

  const handleSimulate = () => {
    const result = simulateAutomaticReminders();
    
    if (result.created > 0) {
      toast.success(`✅ ${result.created} lembretes criados para ${result.meetings.length} reuniões`, {
        description: `Lembretes automáticos simulados com sucesso`
      });
      onSimulated();
    } else {
      toast.info('Nenhuma reunião futura encontrada para criar lembretes');
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/20">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Simulador de Lembretes Automáticos</h3>
            <p className="text-sm text-muted-foreground">
              Gera lembretes (30d, 7d, 24h, 12h, 1h) para todas as reuniões futuras
            </p>
          </div>
        </div>
        <Button onClick={handleSimulate} size="lg" className="gap-2">
          <Zap className="h-5 w-5" />
          Simular Lembretes
        </Button>
      </div>
    </Card>
  );
};
