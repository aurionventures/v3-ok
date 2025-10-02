import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface Company {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'parceiro' | 'cliente' | 'user';
  created_at: string;
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
  const { toast } = useToast();

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('id, email, name, role, created_at')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Transformar dados do banco para o formato da interface
      // Filtrar apenas parceiros por enquanto
      const transformedCompanies: Company[] = data
        .filter(user => user.role === 'parceiro') // Mostrar apenas parceiros
        .map((user, index) => {
        // Determinar tipo baseado no role (sempre parceiro agora)
        const type = 'parceiro' as const;
        
        // Determinar status baseado na data de criação (simulação)
        const createdAt = new Date(user.created_at);
        const daysSinceCreation = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
        const status = daysSinceCreation < 30 ? 'active' : 'inactive';

        // Determinar plano baseado no role e index (simulação)
        const plans = ['Basic', 'Professional', 'Enterprise'];
        const plan = plans[index % 3];

        // Determinar status de pagamento (simulação)
        const paymentStatuses: Company['paymentStatus'][] = ['Pago', 'Aguardando', 'Pendente', 'Vencido'];
        const paymentStatus = paymentStatuses[index % 4];

        // Calcular próximo pagamento (simulação)
        const nextPaymentDate = new Date(createdAt);
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 6);
        const nextPayment = nextPaymentDate.toLocaleDateString('pt-BR');

        // Determinar número de usuários (simulação baseada no plano)
        const usersByPlan = { 'Basic': 3, 'Professional': 8, 'Enterprise': 15 };
        const users = usersByPlan[plan as keyof typeof usersByPlan] || 3;

        return {
          id: user.id,
          name: user.name || user.email.split('@')[0],
          email: user.email,
          role: user.role as Company['role'],
          created_at: user.created_at,
          plan,
          status,
          type,
          paymentStatus,
          users,
          nextPayment,
          contact: user.name || user.email.split('@')[0],
          contactEmail: user.email,
          contactPhone: '(11) 99999-9999' // Simulação
        };
      });

      setCompanies(transformedCompanies);
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
  }) => {
    try {
      const { data, error: insertError } = await supabase
        .from('users')
        .insert({
          name: companyData.name,
          email: companyData.email,
          role: companyData.role
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Recarregar lista de empresas
      await fetchCompanies();

      toast({
        title: 'Empresa adicionada',
        description: `${companyData.name} foi adicionada com sucesso`
      });

      return data;
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
          role: updates.role
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
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
      
      // Usar Edge Function para deletar com service role key
      const { data, error } = await supabase.functions.invoke('delete-partner', {
        method: 'POST',
        body: { id }
      });

      console.log('📋 Resultado da exclusão:', { data, error });

      if (error) {
        console.error('❌ Erro na exclusão:', error);
        throw error;
      }

      if (data?.success) {
        console.log('✅ Usuário deletado com sucesso:', data.deletedUser);
      } else {
        console.warn('⚠️ Falha na exclusão:', data?.error);
        throw new Error(data?.error || 'Falha ao deletar parceiro');
      }

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
    fetchCompanies,
    addCompany,
    updateCompany,
    deleteCompany
  };
};
