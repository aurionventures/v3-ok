import { Card } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useNotificationsDemo } from "@/hooks/useNotificationsDemo";

export const NotificationCharts = () => {
  const { getNotificationsByType, getNotificationsByDay } = useNotificationsDemo();

  const typeData = getNotificationsByType();
  const dayData = getNotificationsByDay(30);

  const typeLabels: Record<string, string> = {
    CONVOCACAO_REUNIAO: 'Convocação',
    EDICAO_REUNIAO: 'Edição',
    UPLOAD_DOCUMENTO: 'Upload',
    ATA_GERADA: 'ATA',
    LEMBRETE_30D: '30 dias',
    LEMBRETE_7D: '7 dias',
    LEMBRETE_24H: '24 horas',
    LEMBRETE_12H: '12 horas',
    LEMBRETE_1H: '1 hora',
    MAGIC_LINK_CONVIDADO: 'Magic Link'
  };

  const formattedTypeData = typeData.map(item => ({
    name: typeLabels[item.type] || item.type,
    value: item.count
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notificações por Tipo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedTypeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notificações nos Últimos 30 Dias</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" name="Notificações" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
