import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getMockGovernanceData } from '../data/mockGovernanceData';

type CouncilMember = Database['public']['Tables']['council_members']['Row'];

export type OrganType = 'conselho' | 'comite' | 'comissao';

export interface AccessConfig {
  public_view: boolean;
  member_upload: boolean;
  guest_upload: boolean;
  require_approval: boolean;
}

export interface GovernanceOrgan {
  id: string;
  company_id: string;
  name: string;
  type: string;
  description: string | null;
  quorum: number;
  status: string;
  created_at: string;
  updated_at: string;
  organ_type?: string;
  hierarchy_level?: number;
  members?: CouncilMember[];
  access_config?: AccessConfig;
}

export const useGovernanceOrgans = (type?: OrganType) => {
  const [organs, setOrgans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Buscar órgãos por tipo
  const fetchOrgans = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.company) {
        setOrgans([]);
        setLoading(false);
        return;
      }

      let query: any = supabase
        .from('councils')
        .select('*, council_members(*)')
        .eq('company_id', user.company)
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('organ_type', type);
      }

      const { data, error: fetchError } = await query;

      // Se há erro OU não há dados, usar mockados
      if (fetchError || !data || data.length === 0) {
        console.log('📊 Carregando dados mockados de governança...');
        const mockData = getMockGovernanceData(user.company);
        const filteredOrgans = type 
          ? mockData.organs.filter(o => o.organ_type === type)
          : mockData.organs;
        
        console.log(`✅ ${filteredOrgans.length} órgãos mockados carregados para tipo: ${type || 'todos'}`);
        console.log('👥 Membros por órgão:', filteredOrgans.map(o => `${o.name}: ${o.members?.length || 0} membros`));
        
        setOrgans(filteredOrgans);
        setLoading(false);
        return;
      }

      // Processar os dados - usar any para evitar problemas com tipos complexos
      const processedData: GovernanceOrgan[] = [];
      
      if (data) {
        for (const organ of data as any[]) {
          processedData.push({
            id: organ.id,
            company_id: organ.company_id,
            name: organ.name,
            type: organ.type,
            description: organ.description,
            quorum: organ.quorum,
            status: organ.status,
            created_at: organ.created_at,
            updated_at: organ.updated_at,
            organ_type: organ.organ_type,
            hierarchy_level: organ.hierarchy_level,
            members: organ.council_members?.filter((m: any) => m.status === 'active') || [],
            access_config: organ.access_config || {
              public_view: false,
              member_upload: true,
              guest_upload: false,
              require_approval: false
            }
          });
        }
      }

      setOrgans(processedData);
    } catch (err) {
      console.error('❌ Erro ao buscar órgãos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar órgãos');
      
      // Usar dados mockados como fallback
      if (user?.company) {
        console.log('🔄 Usando dados mockados como fallback após erro...');
        const mockData = getMockGovernanceData(user.company);
        const filteredOrgans = type 
          ? mockData.organs.filter(o => o.organ_type === type)
          : mockData.organs;
        setOrgans(filteredOrgans);
      } else {
        setOrgans([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Criar novo órgão
  const createOrgan = async (organData: {
    name: string;
    organ_type: OrganType;
    type?: string;
    description?: string;
    quorum?: number;
    hierarchy_level?: number;
    access_config?: AccessConfig;
  }) => {
    try {
      setError(null);

      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada');
      }

      const insertData: any = {
        name: organData.name,
        organ_type: organData.organ_type,
        type: organData.type || 'administrativo',
        description: organData.description,
        quorum: organData.quorum || 1,
        hierarchy_level: organData.hierarchy_level || 1,
        company_id: user.company,
        status: 'active'
      };

      // Adicionar access_config como JSONB
      if (organData.access_config) {
        insertData.access_config = organData.access_config;
      }

      const { data: newOrgan, error: createError } = await supabase
        .from('councils')
        .insert(insertData)
        .select()
        .single();

      if (createError) throw createError;

      await fetchOrgans();
      return newOrgan;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar órgão');
      throw err;
    }
  };

  // Atualizar órgão
  const updateOrgan = async (organId: string, updates: Partial<GovernanceOrgan>) => {
    try {
      setError(null);

      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada');
      }

      const { data: updatedOrgan, error: updateError } = await supabase
        .from('councils')
        .update(updates)
        .eq('id', organId)
        .eq('company_id', user.company)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchOrgans();
      return updatedOrgan;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar órgão');
      throw err;
    }
  };

  // Deletar órgão
  const deleteOrgan = async (organId: string) => {
    try {
      setError(null);

      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada');
      }

      const { error: deleteError } = await supabase
        .from('councils')
        .delete()
        .eq('id', organId)
        .eq('company_id', user.company);

      if (deleteError) throw deleteError;

      await fetchOrgans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar órgão');
      throw err;
    }
  };

  // Buscar órgão específico
  const getOrgan = async (organId: string) => {
    try {
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('councils')
        .select('*, council_members(*)')
        .eq('id', organId)
        .single();

      if (fetchError) throw fetchError;

      return {
        ...data,
        members: data.council_members?.filter((m: any) => m.status === 'active') || []
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar órgão');
      throw err;
    }
  };

  // Atualizar configurações de acesso
  const updateAccessConfig = async (organId: string, accessConfig: AccessConfig) => {
    try {
      setError(null);

      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada');
      }

      // Usar any para evitar erro de tipo com campos JSONB customizados
      const { error: updateError } = await (supabase
        .from('councils')
        .update({ access_config: accessConfig } as any)
        .eq('id', organId)
        .eq('company_id', user.company));

      if (updateError) throw updateError;

      await fetchOrgans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar configurações');
      throw err;
    }
  };


  useEffect(() => {
    if (user?.company) {
      fetchOrgans();
    }
  }, [user?.company, type]);

  return {
    organs,
    loading,
    error,
    fetchOrgans,
    createOrgan,
    updateOrgan,
    deleteOrgan,
    getOrgan,
    updateAccessConfig
  };
};
