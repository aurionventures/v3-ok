import { Card } from "@/components/ui/card";
import { NotificationMetrics as Metrics } from "@/types/notifications";
import { Mail, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface NotificationMetricsProps {
  metrics: Metrics;
}

export const NotificationMetrics = ({ metrics }: NotificationMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total de Notificações</p>
            <p className="text-3xl font-bold text-foreground mt-1">{metrics.total}</p>
          </div>
          <Mail className="h-8 w-8 text-primary" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Enviadas</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{metrics.sent}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Pendentes</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">{metrics.pending}</p>
          </div>
          <Clock className="h-8 w-8 text-yellow-600" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Últimas 24h</p>
            <p className="text-3xl font-bold text-primary mt-1">{metrics.last24h}</p>
          </div>
          <AlertCircle className="h-8 w-8 text-primary" />
        </div>
      </Card>
    </div>
  );
};
