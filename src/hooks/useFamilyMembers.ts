import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchFamilyMembers,
  insertFamilyMember,
  deleteFamilyMember,
} from "@/services/familyStructure";
import type { FamilyMemberInsert } from "@/types/familyStructure";

export const FAMILY_MEMBERS_QUERY_KEY = ["family-members"] as const;

export function useFamilyMembers(empresaId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...FAMILY_MEMBERS_QUERY_KEY, empresaId ?? "none"],
    queryFn: () => fetchFamilyMembers(empresaId!),
    enabled: !!empresaId,
  });

  const insertMutation = useMutation({
    mutationFn: (payload: FamilyMemberInsert) => insertFamilyMember(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...FAMILY_MEMBERS_QUERY_KEY, variables.empresa_id],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFamilyMember(id),
    onSuccess: () => {
      if (empresaId) {
        queryClient.invalidateQueries({
          queryKey: [...FAMILY_MEMBERS_QUERY_KEY, empresaId],
        });
      }
    },
  });

  return {
    members: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    insertMember: insertMutation.mutateAsync,
    insertLoading: insertMutation.isPending,
    insertError: insertMutation.error,
    deleteMember: deleteMutation.mutateAsync,
    deleteLoading: deleteMutation.isPending,
  };
}
