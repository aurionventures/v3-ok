import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface CouncilReminderConfig {
  id: string;
  council_id: string;
  remind_30d: boolean;
  remind_7d: boolean;
  remind_24h: boolean;
  remind_12h: boolean;
  remind_1h: boolean;
}

export const useCouncilReminderConfig = (councilId: string) => {
  const queryClient = useQueryClient();

  const { data: config, isLoading, error } = useQuery({
    queryKey: ["council-reminder-config", councilId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("council_reminder_config")
        .select("*")
        .eq("council_id", councilId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as CouncilReminderConfig | null;
    },
    enabled: !!councilId,
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (updates: Partial<CouncilReminderConfig>) => {
      // Check if config exists
      const { data: existing } = await supabase
        .from("council_reminder_config")
        .select("id")
        .eq("council_id", councilId)
        .single();

      if (existing) {
        // Update existing config
        const { error } = await supabase
          .from("council_reminder_config")
          .update(updates)
          .eq("council_id", councilId);

        if (error) throw error;
      } else {
        // Insert new config
        const { error } = await supabase
          .from("council_reminder_config")
          .insert({ council_id: councilId, ...updates });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["council-reminder-config", councilId] });
      toast({
        title: "Configuração salva",
        description: "Os lembretes automáticos foram configurados com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar configuração",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    config,
    loading: isLoading,
    error,
    updateConfig: updateConfigMutation.mutate,
  };
};
