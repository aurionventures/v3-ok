import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getMockGovernanceData, MockMember } from '@/data/mockGovernanceData';

export interface GovernanceMember extends MockMember {
  email?: string;
  phone?: string;
  allocations?: Array<{
    council_id: string;
    council_name: string;
    organ_type: 'conselho' | 'comite' | 'comissao';
    role: string;
    start_date: string;
  }>;
}

export interface MemberFormData {
  name: string;
  role: string;
  start_date: string;
  end_date?: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive';
}

export interface AllocationData {
  member_id: string;
  organ_id: string;
  role: string;
  start_date: string;
  end_date?: string;
}

export const useGovernanceMembers = () => {
  const [members, setMembers] = useState<GovernanceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAllMembers = useCallback(async () => {
    if (!user?.company) return;

    setLoading(true);
    setError(null);

    try {
      const { data: councilsData } = await supabase
        .from('councils')
        .select('id, name, organ_type')
        .eq('company_id', user.company);

      const councilIds = councilsData?.map(c => c.id) || [];

      if (councilIds.length === 0) {
        // Usar dados mockados
        console.log('📊 Carregando membros mockados...');
        const mockData = getMockGovernanceData(user.company);
        setMembers(mockData.members as GovernanceMember[]);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('council_members')
        .select('*')
        .in('council_id', councilIds);

      if (fetchError || !data || data.length === 0) {
        console.log('📊 Usando dados mockados como fallback...');
        const mockData = getMockGovernanceData(user.company);
        setMembers(mockData.members as GovernanceMember[]);
        setLoading(false);
        return;
      }

      // Processar dados reais
      const membersWithAllocations = data.map(member => {
        const council = councilsData?.find(c => c.id === member.council_id);
        return {
          ...member,
          allocations: council ? [{
            council_id: council.id,
            council_name: council.name,
            organ_type: council.organ_type as 'conselho' | 'comite' | 'comissao',
            role: member.role,
            start_date: member.start_date
          }] : []
        };
      });

      setMembers(membersWithAllocations);
    } catch (err) {
      console.error('❌ Erro ao buscar membros:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar membros');
      
      // Fallback para dados mockados
      if (user?.company) {
        const mockData = getMockGovernanceData(user.company);
        setMembers(mockData.members as GovernanceMember[]);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.company]);

  // Usar ref para evitar múltiplas chamadas durante renderização
  const isFetchingRef = useRef(false);
  
  useEffect(() => {
    if (user?.company && !isFetchingRef.current) {
      isFetchingRef.current = true;
      // Usar requestAnimationFrame para evitar bloqueio
      requestAnimationFrame(() => {
        fetchAllMembers().finally(() => {
          isFetchingRef.current = false;
        });
      });
    }
  }, [user?.company, fetchAllMembers]);

  const createMember = async (data: MemberFormData, organId?: string) => {
    if (!user?.company || !organId) return;

    try {
      const { error } = await supabase
        .from('council_members')
        .insert({
          council_id: organId,
          name: data.name,
          role: data.role,
          start_date: data.start_date,
          end_date: data.end_date || null,
          status: data.status,
          user_id: null
        });

      if (error) throw error;
      await fetchAllMembers();
    } catch (err) {
      console.error('Error creating member:', err);
      throw err;
    }
  };

  const updateMember = async (id: string, data: Partial<MemberFormData>) => {
    try {
      const { error } = await supabase
        .from('council_members')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      await fetchAllMembers();
    } catch (err) {
      console.error('Error updating member:', err);
      throw err;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('council_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAllMembers();
    } catch (err) {
      console.error('Error deleting member:', err);
      throw err;
    }
  };

  const allocateMemberToOrgan = async (allocation: AllocationData) => {
    try {
      const { error } = await supabase
        .from('council_members')
        .insert({
          council_id: allocation.organ_id,
          name: members.find(m => m.id === allocation.member_id)?.name || '',
          role: allocation.role,
          start_date: allocation.start_date,
          end_date: allocation.end_date || null,
          status: 'active',
          user_id: null
        });

      if (error) throw error;
      await fetchAllMembers();
    } catch (err) {
      console.error('Error allocating member:', err);
      throw err;
    }
  };

  const deallocateMemberFromOrgan = async (memberId: string, organId: string) => {
    try {
      const { error } = await supabase
        .from('council_members')
        .update({ status: 'inactive', end_date: new Date().toISOString() })
        .eq('id', memberId)
        .eq('council_id', organId);

      if (error) throw error;
      await fetchAllMembers();
    } catch (err) {
      console.error('Error deallocating member:', err);
      throw err;
    }
  };

  return {
    members,
    loading,
    error,
    fetchAllMembers,
    createMember,
    updateMember,
    deleteMember,
    allocateMemberToOrgan,
    deallocateMemberFromOrgan
  };
};
