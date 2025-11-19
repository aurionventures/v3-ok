import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { useAuth } from '../contexts/AuthContext';

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

      if (fetchError) throw fetchError;

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
      setError(err instanceof Error ? err.message : 'Erro ao buscar órgãos');
      setOrgans([]);
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

  // Criar dados mockados para demonstração
  const createMockData = async () => {
    try {
      setError(null);
      if (!user?.company) {
        throw new Error('Usuário não autenticado ou sem empresa associada');
      }

      // Dados dos órgãos
      const mockOrgans = [
        // 3 Conselhos
        { name: 'Conselho de Administração', type: 'administrativo', organ_type: 'conselho', description: 'Conselho responsável pela gestão estratégica da empresa', quorum: 3, hierarchy_level: 1 },
        { name: 'Conselho Fiscal', type: 'fiscal', organ_type: 'conselho', description: 'Conselho de fiscalização contábil e financeira', quorum: 3, hierarchy_level: 1 },
        { name: 'Conselho Consultivo', type: 'consultivo', organ_type: 'conselho', description: 'Conselho de especialistas externos para orientação estratégica', quorum: 5, hierarchy_level: 1 },
        // 3 Comitês
        { name: 'Comitê de Auditoria', type: 'auditoria', organ_type: 'comite', description: 'Supervisão de processos de auditoria interna e externa', quorum: 3, hierarchy_level: 2 },
        { name: 'Comitê de Estratégia', type: 'estrategia', organ_type: 'comite', description: 'Definição e acompanhamento do planejamento estratégico', quorum: 4, hierarchy_level: 2 },
        { name: 'Comitê de Riscos', type: 'outros', organ_type: 'comite', description: 'Gestão e mitigação de riscos corporativos', quorum: 3, hierarchy_level: 2 },
        // 3 Comissões
        { name: 'Comissão de Ética', type: 'outros', organ_type: 'comissao', description: 'Análise de questões éticas e compliance corporativo', quorum: 3, hierarchy_level: 3 },
        { name: 'Comissão de Inovação', type: 'outros', organ_type: 'comissao', description: 'Avaliação de projetos de inovação e transformação digital', quorum: 4, hierarchy_level: 3 },
        { name: 'Comissão de Sustentabilidade', type: 'outros', organ_type: 'comissao', description: 'Iniciativas ESG e sustentabilidade empresarial', quorum: 3, hierarchy_level: 3 }
      ];

      // Inserir órgãos
      const { data: insertedOrgans, error: organsError } = await supabase
        .from('councils')
        .insert(mockOrgans.map(organ => ({
          ...organ,
          company_id: user.company,
          status: 'active'
        })))
        .select();

      if (organsError) throw organsError;

      // Dados dos membros por órgão
      const membersByOrgan: Record<string, Array<{ name: string; role: string }>> = {
        'Conselho de Administração': [
          { name: 'Carlos Alberto Silva', role: 'Presidente' },
          { name: 'Maria Fernanda Costa', role: 'Vice-Presidente' },
          { name: 'Roberto Martins', role: 'Conselheiro' },
          { name: 'Ana Paula Rodrigues', role: 'Conselheira Independente' }
        ],
        'Conselho Fiscal': [
          { name: 'João Pedro Santos', role: 'Presidente' },
          { name: 'Patricia Lima', role: 'Membro' },
          { name: 'Fernando Alves', role: 'Membro' }
        ],
        'Conselho Consultivo': [
          { name: 'Dr. Eduardo Campos', role: 'Consultor Sênior' },
          { name: 'Dra. Juliana Moreira', role: 'Consultora Estratégica' },
          { name: 'Prof. Ricardo Tavares', role: 'Consultor Acadêmico' },
          { name: 'Beatriz Cardoso', role: 'Consultora de Inovação' },
          { name: 'Marcelo Souza', role: 'Consultor Financeiro' }
        ],
        'Comitê de Auditoria': [
          { name: 'Luiz Fernando Braga', role: 'Coordenador' },
          { name: 'Sandra Oliveira', role: 'Membro' },
          { name: 'Gustavo Henrique', role: 'Auditor Interno' }
        ],
        'Comitê de Estratégia': [
          { name: 'Renata Barbosa', role: 'Coordenadora' },
          { name: 'Daniel Ferreira', role: 'Analista de Planejamento' },
          { name: 'Camila Nunes', role: 'Estrategista de Negócios' },
          { name: 'André Carvalho', role: 'Membro' }
        ],
        'Comitê de Riscos': [
          { name: 'Fabio Mendes', role: 'Coordenador de Riscos' },
          { name: 'Luciana Dias', role: 'Analista de Compliance' },
          { name: 'Thiago Pereira', role: 'Gestor de Riscos Operacionais' }
        ],
        'Comissão de Ética': [
          { name: 'Isabela Monteiro', role: 'Presidente' },
          { name: 'Rafael Gomes', role: 'Membro' },
          { name: 'Vanessa Prado', role: 'Compliance Officer' }
        ],
        'Comissão de Inovação': [
          { name: 'Leonardo Ribeiro', role: 'Líder de Inovação' },
          { name: 'Priscila Araújo', role: 'Coordenadora de Projetos' },
          { name: 'Bruno Castro', role: 'Analista de Tecnologia' },
          { name: 'Tatiana Freitas', role: 'UX Researcher' }
        ],
        'Comissão de Sustentabilidade': [
          { name: 'Henrique Azevedo', role: 'Coordenador ESG' },
          { name: 'Márcia Santos', role: 'Analista Ambiental' },
          { name: 'Rodrigo Teixeira', role: 'Especialista em Social' }
        ]
      };

      // Inserir membros
      if (insertedOrgans) {
        for (const organ of insertedOrgans) {
          const members = membersByOrgan[organ.name];
          if (members) {
            const membersToInsert = members.map(member => ({
              council_id: organ.id,
              name: member.name,
              role: member.role,
              start_date: '2024-01-15',
              status: 'active'
            }));

            await supabase.from('council_members').insert(membersToInsert);
          }
        }
      }

      await fetchOrgans();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar dados mockados');
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
    updateAccessConfig,
    createMockData
  };
};
