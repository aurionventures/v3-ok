import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ShareholderData {
  id: string;
  company_id: string;
  name: string;
  document?: string;
  email?: string;
  phone?: string;
  
  // Qualificação Oficial
  governance_category: string;
  governance_subcategory?: string;
  official_qualification_code?: string;
  specific_role?: string;
  
  // Dados Societários
  shareholding_percentage?: number;
  shareholding_class?: string;
  investment_entry_date?: string;
  investment_type?: string;
  
  // Dados Familiares
  is_family_member?: boolean;
  generation?: string;
  
  // Status
  status: string;
  created_at: string;
  updated_at: string;
}

export const useCapTable = (companyId: string, useMockData = false) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar apenas SÓCIOS (filtro por governance_category)
  const { data: shareholders, isLoading, error } = useQuery({
    queryKey: ["shareholders", companyId, useMockData],
    queryFn: async () => {
      if (useMockData) {
        const { mockShareholders } = await import("@/data/mockCapTableData");
        return mockShareholders as ShareholderData[];
      }
      
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from("corporate_structure_members")
        .select("*")
        .eq("company_id", companyId)
        .or("governance_category.ilike.%Sócio%,governance_category.ilike.%Acionista%")
        .eq("status", "Ativo")
        .order("shareholding_percentage", { ascending: false });

      if (error) throw error;
      return (data || []) as ShareholderData[];
    },
    enabled: !!companyId || useMockData,
  });

  // Calcular métricas do Cap Table
  const metrics = {
    totalShareholders: shareholders?.length || 0,
    familyControl: shareholders
      ?.filter(s => s.is_family_member)
      .reduce((sum, s) => sum + (s.shareholding_percentage || 0), 0) || 0,
    externalInvestors: shareholders
      ?.filter(s => !s.is_family_member)
      .reduce((sum, s) => sum + (s.shareholding_percentage || 0), 0) || 0,
    rfbCompliance: shareholders?.every(s => s.official_qualification_code) || false,
    totalPercentage: shareholders?.reduce((sum, s) => sum + (s.shareholding_percentage || 0), 0) || 0,
  };

  // Mutation para atualizar participação
  const updateShareholding = useMutation({
    mutationFn: async ({ 
      id, 
      shareholding_percentage 
    }: { 
      id: string; 
      shareholding_percentage: number 
    }) => {
      const { error } = await supabase
        .from("corporate_structure_members")
        .update({ shareholding_percentage, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shareholders"] });
      toast({
        title: "Participação atualizada",
        description: "A estrutura do Cap Table foi atualizada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    },
  });

  return {
    shareholders: shareholders || [],
    isLoading,
    error,
    metrics,
    updateShareholding,
  };
};
