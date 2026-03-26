import { useState, useEffect } from "react";
import { useNotificationsDemo } from "@/hooks/useNotificationsDemo";
import { NotificationMetrics } from "@/components/notifications/NotificationMetrics";
import { NotificationFilters } from "@/components/notifications/NotificationFilters";
import { NotificationsTable } from "@/components/notifications/NotificationsTable";
import { NotificationDetailsModal } from "@/components/notifications/NotificationDetailsModal";
import { NotificationSimulator } from "@/components/notifications/NotificationSimulator";
import { NotificationCharts } from "@/components/notifications/NotificationCharts";
import { NotificationFilters as Filters, MockNotification } from "@/types/notifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const NotificationsCenter = () => {
  const { getMetrics, filterBy, deleteById, refresh } = useNotificationsDemo();
  const [metrics, setMetrics] = useState(getMetrics());
  const [filteredNotifications, setFilteredNotifications] = useState<MockNotification[]>([]);
  const [currentFilters, setCurrentFilters] = useState<Filters>({});
  const [selectedNotification, setSelectedNotification] = useState<MockNotification | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const newMetrics = getMetrics();
    setMetrics(newMetrics);
    
    const filtered = filterBy(currentFilters);
    setFilteredNotifications(filtered);
  };

  const handleFilterChange = (filters: Filters) => {
    setCurrentFilters(filters);
    const filtered = filterBy(filters);
    setFilteredNotifications(filtered);
  };

  const handleViewDetails = (notification: MockNotification) => {
    setSelectedNotification(notification);
    setDetailsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir esta notificação?')) {
      deleteById(id);
      loadData();
    }
  };

  const handleSimulated = () => {
    refresh();
    loadData();
  };

  const hasActiveFilters = Object.values(currentFilters).some(value => 
    value && value !== 'ALL' && value !== ''
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Central de Notificações</h1>
          <p className="text-muted-foreground mt-1">
            Monitore e gerencie todas as notificações do sistema
          </p>
        </div>
        {hasActiveFilters && (
          <Badge variant="secondary">
            {filteredNotifications.length} de {metrics.total} notificações
          </Badge>
        )}
      </div>

      <NotificationMetrics metrics={metrics} />

      <NotificationSimulator onSimulated={handleSimulated} />

      <NotificationFilters onFilterChange={handleFilterChange} />

      <NotificationsTable
        notifications={filteredNotifications}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
      />

      <NotificationCharts />

      <NotificationDetailsModal
        notification={selectedNotification}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
};

export default NotificationsCenter;
