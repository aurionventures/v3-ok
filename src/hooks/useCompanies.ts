import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Company {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'parceiro' | 'cliente' | 'user';
  company: string;
  sector: string | null;
  phone: string | null;
  created_at: string;
  created_by_partner: string | null;
  // Campos calculados para a interface
  plan: string;
  status: 'active' | 'inactive';
  type: 'cliente' | 'parceiro';
  paymentStatus: 'Pago' | 'Aguardando' | 'Pendente' | 'Vencido';
  users: number;
  nextPayment: string;
  contact: string;
  contactEmail: string;
  contactPhone: string;
}

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalPartners: 0, totalClients: 0, total: 0 });
  const { toast } = useToast();

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar users com seus roles usando JOIN
      const { data, error: fetchError } = await supabase
        .from('users')
        .select(`
          id,
          email,
          name,
          company,
          sector,
          phone,
          created_at,
          created_by_partner,
          user_roles!inner(role)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Transformar dados do banco para o formato da interface
      const transformedCompanies: Company[] = (data || [])
        .filter((user: any) => {
          const role = user.user_roles?.[0]?.role;
          return role === 'parceiro' || role === 'cliente';
        })
        .map((user: any, index: number) => {
          const role = user.user_roles?.[0]?.role;
          const type = role === 'parceiro' ? 'parceiro' : 'cliente';
          
          // Determinar status baseado na data de criação
          const createdAt = new Date(user.created_at);
          const daysSinceCreation = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
          const status = daysSinceCreation < 180 ? 'active' : 'inactive';

          // Determinar plano (simulação)
          const plans = ['Basic', 'Professional', 'Enterprise'];
          const plan = plans[index % 3];

          // Determinar status de pagamento (simulação)
          const paymentStatuses: Company['paymentStatus'][] = ['Pago', 'Aguardando', 'Pendente', 'Vencido'];
          const paymentStatus = paymentStatuses[index % 4];

          // Calcular próximo pagamento (simulação)
          const nextPaymentDate = new Date(createdAt);
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 6);
          const nextPayment = nextPaymentDate.toLocaleDateString('pt-BR');

          // Determinar número de usuários (simulação)
          const usersByPlan = { 'Basic': 3, 'Professional': 8, 'Enterprise': 15 };
          const users = usersByPlan[plan as keyof typeof usersByPlan] || 3;

          return {
            id: user.id,
            name: user.company || user.name || user.email.split('@')[0],
            email: user.email,
            role: role as Company['role'],
            company: user.company || 'Sem nome',
            sector: user.sector,
            phone: user.phone,
            created_at: user.created_at,
            created_by_partner: user.created_by_partner,
            plan,
            status,
            type,
            paymentStatus,
            users,
            nextPayment,
            contact: user.name || user.email.split('@')[0],
            contactEmail: user.email,
            contactPhone: user.phone || '(11) 99999-9999'
          };
        });

      // Calculate statistics
      const totalPartners = transformedCompanies.filter(c => c.role === 'parceiro').length;
      const totalClients = transformedCompanies.filter(c => c.role === 'cliente').length;
      
      setCompanies(transformedCompanies);
      setStats({ totalPartners, totalClients, total: transformedCompanies.length });
    } catch (err: any) {
      console.error('Erro ao buscar empresas:', err);
      setError(err.message || 'Erro ao carregar empresas');
      toast({
        title: 'Erro',
        description: 'Falha ao carregar empresas do banco de dados',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async (companyData: {
    name: string;
    email: string;
    role: 'admin' | 'parceiro' | 'cliente' | 'user';
    company?: string;
    sector?: string;
  }) => {
    try {
      // Inserir usuário
      const { data: userData, error: insertError } = await supabase
        .from('users')
        .insert({
          name: companyData.name,
          email: companyData.email,
          company: companyData.company || companyData.name,
          sector: companyData.sector
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Inserir role do usuário
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userData.id,
          role: companyData.role
        });

      if (roleError) {
        throw roleError;
      }

      // Recarregar lista de empresas
      await fetchCompanies();

      toast({
        title: 'Empresa adicionada',
        description: `${companyData.name} foi adicionada com sucesso`
      });

      return userData;
    } catch (err: any) {
      console.error('Erro ao adicionar empresa:', err);
      toast({
        title: 'Erro',
        description: 'Falha ao adicionar empresa',
        variant: 'destructive'
      });
      throw err;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: updates.name,
          email: updates.contactEmail,
          company: updates.company,
          sector: updates.sector,
          phone: updates.phone
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      // Atualizar role se necessário
      if (updates.role) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: updates.role })
          .eq('user_id', id);

        if (roleError) {
          console.error('Erro ao atualizar role:', roleError);
        }
      }

      // Recarregar lista de empresas
      await fetchCompanies();

      toast({
        title: 'Empresa atualizada',
        description: 'Dados da empresa foram atualizados com sucesso'
      });
    } catch (err: any) {
      console.error('Erro ao atualizar empresa:', err);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar empresa',
        variant: 'destructive'
      });
      throw err;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      console.log('🗑️ Tentando deletar usuário com ID:', id);
      
      // Deletar role primeiro (CASCADE vai deletar o usuário)
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', id);

      if (roleError) {
        console.error('❌ Erro ao deletar role:', roleError);
        throw roleError;
      }

      // Deletar usuário
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('❌ Erro ao deletar usuário:', deleteError);
        throw deleteError;
      }

      console.log('✅ Usuário deletado com sucesso');

      // Recarregar lista de empresas
      await fetchCompanies();

      toast({
        title: 'Empresa removida',
        description: 'Empresa foi removida com sucesso'
      });
    } catch (err: any) {
      console.error('❌ Erro ao remover empresa:', err);
      toast({
        title: 'Erro',
        description: `Falha ao remover empresa: ${err.message || 'Erro desconhecido'}`,
        variant: 'destructive'
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return {
    companies,
    loading,
    error,
    stats,
    fetchCompanies,
    addCompany,
    updateCompany,
    deleteCompany
  };
};
