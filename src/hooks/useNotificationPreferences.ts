import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_enabled: boolean;
  whatsapp_enabled: boolean;
  whatsapp_number: string | null;
  sms_enabled: boolean;
  sms_number: string | null;
  in_app_enabled: boolean;
  notify_meeting_reminders: boolean;
  notify_pending_actions: boolean;
  notify_overdue_actions: boolean;
}

export const useNotificationPreferences = () => {
  const queryClient = useQueryClient();

  const { data: preferences, isLoading, error } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as NotificationPreferences | null;
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: Partial<NotificationPreferences>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if preferences exist
      const { data: existing } = await supabase
        .from("user_notification_preferences")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existing) {
        // Update existing preferences
        const { error } = await supabase
          .from("user_notification_preferences")
          .update(updates)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Insert new preferences
        const { error } = await supabase
          .from("user_notification_preferences")
          .insert({ user_id: user.id, ...updates });

        if (error) throw error;
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const defaults = {
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
        .upsert({ user_id: user.id, ...defaults });

      if (error) throw error;
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
    preferences,
    loading: isLoading,
    error,
    updatePreferences: updatePreferencesMutation.mutate,
    resetToDefaults: resetToDefaultsMutation.mutate,
  };
};
