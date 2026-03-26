import { useState, useEffect } from 'react';
import { MockNotification, NotificationFilters, NotificationMetrics } from '@/types/notifications';

const STORAGE_KEY = 'mock_notifications';
const SCHEDULE_KEY = 'annual_council_schedule';

export const useNotificationsDemo = () => {
  const [notifications, setNotifications] = useState<MockNotification[]>([]);

  // Load notifications from localStorage
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const saveNotifications = (notifs: MockNotification[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
    setNotifications(notifs);
  };

  const getAll = (): MockNotification[] => {
    return notifications;
  };

  const getById = (id: string): MockNotification | null => {
    return notifications.find(n => n.id === id) || null;
  };

  const filterBy = (filters: NotificationFilters): MockNotification[] => {
    let filtered = [...notifications];

    if (filters.type && filters.type !== 'ALL') {
      filtered = filtered.filter(n => n.type === filters.type);
    }

    if (filters.status && filters.status !== 'ALL') {
      filtered = filtered.filter(n => n.status === filters.status);
    }

    if (filters.channel && filters.channel !== 'ALL') {
      filtered = filtered.filter(n => n.channel === filters.channel);
    }

    if (filters.organType && filters.organType !== 'ALL') {
      filtered = filtered.filter(n => n.context.organ_type === filters.organType);
    }

    if (filters.dateRange) {
      const start = filters.dateRange.start.getTime();
      const end = filters.dateRange.end.getTime();
      filtered = filtered.filter(n => {
        const date = new Date(n.scheduled_at).getTime();
        return date >= start && date <= end;
      });
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(term) ||
        n.message.toLowerCase().includes(term) ||
        n.recipient_name.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const deleteById = (id: string): void => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const clearAll = (): void => {
    saveNotifications([]);
  };

  const getMetrics = (): NotificationMetrics => {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);

    return {
      total: notifications.length,
      sent: notifications.filter(n => n.status === 'ENVIADA').length,
      pending: notifications.filter(n => n.status === 'PENDENTE').length,
      error: notifications.filter(n => n.status === 'ERRO').length,
      last24h: notifications.filter(n => new Date(n.scheduled_at).getTime() > last24h).length,
      openRate: 78.5 // Mocked value
    };
  };

  const simulateAutomaticReminders = (): { created: number; meetings: string[] } => {
    try {
      const scheduleStr = localStorage.getItem(SCHEDULE_KEY);
      if (!scheduleStr) {
        return { created: 0, meetings: [] };
      }

      const schedule = JSON.parse(scheduleStr);
      const now = new Date();
      const futureMeetings = schedule.meetings?.filter((m: any) => 
        new Date(m.date) > now
      ) || [];

      const newNotifications: MockNotification[] = [];
      const meetingNames: string[] = [];

      futureMeetings.forEach((meeting: any) => {
        const meetingDate = new Date(meeting.date);
        const reminderTypes = [
          { type: 'LEMBRETE_30D', days: 30 },
          { type: 'LEMBRETE_7D', days: 7 },
          { type: 'LEMBRETE_24H', hours: 24 },
          { type: 'LEMBRETE_12H', hours: 12 },
          { type: 'LEMBRETE_1H', hours: 1 }
        ];

        reminderTypes.forEach(reminder => {
          const scheduledDate = new Date(meetingDate);
          if (reminder.days) {
            scheduledDate.setDate(scheduledDate.getDate() - reminder.days);
          } else if (reminder.hours) {
            scheduledDate.setHours(scheduledDate.getHours() - reminder.hours);
          }

          // Create notifications for each participant
          meeting.participants?.forEach((participant: any) => {
            const notif: MockNotification = {
              id: `notif-${Date.now()}-${Math.random()}`,
              user_id: participant.id || null,
              external_email: participant.email || null,
              recipient_name: participant.name || 'Participante',
              type: reminder.type as any,
              title: `Lembrete: ${meeting.title}`,
              message: `Lembrete: A reunião "${meeting.title}" acontecerá em ${reminder.days ? `${reminder.days} dias` : `${reminder.hours} horas`}. Data: ${meetingDate.toLocaleDateString('pt-BR')} às ${meeting.time}.`,
              scheduled_at: scheduledDate.toISOString(),
              sent_at: scheduledDate.toISOString(),
              status: 'ENVIADA',
              channel: 'EMAIL',
              read_at: null,
              context: {
                meeting_id: meeting.id,
                organ_type: meeting.organ_type,
                organ_name: meeting.organ_name || meeting.title,
                meeting_date: meeting.date
              }
            };
            newNotifications.push(notif);
          });
        });

        meetingNames.push(meeting.title);
      });

      // Save all new notifications
      const allNotifications = [...notifications, ...newNotifications];
      saveNotifications(allNotifications);

      return {
        created: newNotifications.length,
        meetings: meetingNames
      };
    } catch (error) {
      console.error('Error simulating reminders:', error);
      return { created: 0, meetings: [] };
    }
  };

  const getNotificationsByType = (): { type: string; count: number }[] => {
    const typeMap = new Map<string, number>();
    
    notifications.forEach(n => {
      const current = typeMap.get(n.type) || 0;
      typeMap.set(n.type, current + 1);
    });

    return Array.from(typeMap.entries()).map(([type, count]) => ({
      type,
      count
    }));
  };

  const getNotificationsByDay = (days: number): { date: string; count: number }[] => {
    const now = new Date();
    const dateMap = new Map<string, number>();

    // Initialize all days with 0
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, 0);
    }

    // Count notifications per day
    notifications.forEach(n => {
      const dateStr = n.scheduled_at.split('T')[0];
      if (dateMap.has(dateStr)) {
        dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
      }
    });

    return Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  return {
    notifications,
    getAll,
    getById,
    filterBy,
    deleteById,
    clearAll,
    getMetrics,
    simulateAutomaticReminders,
    getNotificationsByType,
    getNotificationsByDay,
    refresh: loadNotifications
  };
};
