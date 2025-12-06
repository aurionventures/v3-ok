import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface NotificationPreferences {
  id: string;
  user_id: string;
  
  // Canais de Notificação
  email_enabled: boolean;
  whatsapp_enabled: boolean;
  whatsapp_number: string | null;
  push_enabled: boolean;
  in_app_enabled: boolean;
  
  // Preferências de Agenda e Reuniões
  notify_calendar_agenda: boolean;
  notify_meeting_creation: boolean;
  notify_pauta_definition: boolean;
  notify_ata_approval: boolean;
  notify_ata_signature: boolean;
  
  // Tipos de Notificação - Tarefas
  notify_task_assigned: boolean;
  notify_task_due_30d: boolean;
  notify_task_due_15d: boolean;
  notify_task_due_5d: boolean;
  notify_task_due_3d: boolean;
  notify_task_due_1d: boolean;
  notify_task_overdue_daily: boolean;
  
  // Legacy fields (kept for compatibility)
  sms_enabled: boolean;
  sms_number: string | null;
  notify_meeting_reminders: boolean;
  notify_pending_actions: boolean;
  notify_overdue_actions: boolean;
}

const STORAGE_KEY = 'notification_preferences_extended';

const defaultPreferences: NotificationPreferences = {
  id: '',
  user_id: '',
  email_enabled: true,
  whatsapp_enabled: false,
  whatsapp_number: null,
  push_enabled: true,
  in_app_enabled: true,
  sms_enabled: false,
  sms_number: null,
  notify_calendar_agenda: true,
  notify_meeting_creation: true,
  notify_pauta_definition: true,
  notify_ata_approval: true,
  notify_ata_signature: true,
  notify_task_assigned: true,
  notify_task_due_30d: true,
  notify_task_due_15d: true,
  notify_task_due_5d: true,
  notify_task_due_3d: true,
  notify_task_due_1d: true,
  notify_task_overdue_daily: true,
  notify_meeting_reminders: true,
  notify_pending_actions: true,
  notify_overdue_actions: true,
};

// Get extended preferences from localStorage
const getExtendedPreferences = (): Partial<NotificationPreferences> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Save extended preferences to localStorage
const saveExtendedPreferences = (prefs: Partial<NotificationPreferences>) => {
  try {
    const current = getExtendedPreferences();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...prefs }));
  } catch (e) {
    console.error('Failed to save extended preferences:', e);
  }
};

export const useNotificationPreferences = () => {
  const queryClient = useQueryClient();

  const { data: preferences, isLoading, error } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: async () => {
      // Get extended preferences from localStorage
      const extendedPrefs = getExtendedPreferences();
      
      // Try to get from database (for fields that exist)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // For demo mode, use localStorage only
        return {
          ...defaultPreferences,
          ...extendedPrefs,
        };
      }

      const { data, error } = await supabase
        .from("user_notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error('Error fetching preferences:', error);
      }
      
      // Merge: defaults -> database -> localStorage extended
      return {
        ...defaultPreferences,
        ...(data || {}),
        ...extendedPrefs,
      } as NotificationPreferences;
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: Partial<NotificationPreferences>) => {
      // Save extended fields to localStorage
      const extendedFields = [
        'push_enabled',
        'notify_calendar_agenda',
        'notify_meeting_creation', 
        'notify_pauta_definition',
        'notify_ata_approval',
        'notify_ata_signature',
        'notify_task_assigned',
        'notify_task_due_30d',
        'notify_task_due_15d',
        'notify_task_due_5d',
        'notify_task_due_3d',
        'notify_task_due_1d',
        'notify_task_overdue_daily',
      ];
      
      const extendedUpdates: Partial<NotificationPreferences> = {};
      const dbUpdates: Record<string, any> = {};
      
      Object.entries(updates).forEach(([key, value]) => {
        if (extendedFields.includes(key)) {
          (extendedUpdates as any)[key] = value;
        } else {
          dbUpdates[key] = value;
        }
      });
      
      // Save extended to localStorage
      if (Object.keys(extendedUpdates).length > 0) {
        saveExtendedPreferences(extendedUpdates);
      }
      
      // Save DB fields to Supabase (only if authenticated)
      const { data: { user } } = await supabase.auth.getUser();
      if (user && Object.keys(dbUpdates).length > 0) {
        const { data: existing } = await supabase
          .from("user_notification_preferences")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (existing) {
          const { error } = await supabase
            .from("user_notification_preferences")
            .update(dbUpdates)
            .eq("user_id", user.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("user_notification_preferences")
            .insert({ user_id: user.id, ...dbUpdates });

          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências de notificação foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar preferências",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetToDefaultsMutation = useMutation({
    mutationFn: async () => {
      // Clear localStorage extended preferences
      localStorage.removeItem(STORAGE_KEY);
      
      // Reset DB fields
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const dbDefaults = {
          email_enabled: true,
          whatsapp_enabled: false,
          whatsapp_number: null,
          sms_enabled: false,
          sms_number: null,
          in_app_enabled: true,
          notify_meeting_reminders: true,
          notify_pending_actions: true,
          notify_overdue_actions: true,
        };
        
        const { error } = await supabase
          .from("user_notification_preferences")
          .upsert({ user_id: user.id, ...dbDefaults });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
      toast({
        title: "Preferências restauradas",
        description: "Suas preferências foram restauradas para os valores padrão.",
      });
    },
  });

  return {
    preferences: preferences || defaultPreferences,
    loading: isLoading,
    error,
    updatePreferences: updatePreferencesMutation.mutate,
    resetToDefaults: resetToDefaultsMutation.mutate,
  };
};
