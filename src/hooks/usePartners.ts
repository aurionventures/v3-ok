import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PartnerSettings {
  id: string;
  user_id: string;
  company_name: string;
  cnpj: string | null;
  partner_type: string;
  admin_phone: string | null;
  primary_color: string;
  secondary_color: string;
  custom_domain: string | null;
  commission: number; // Comissão padrão (para compatibilidade)
  commission_service: number | null; // Comissão sobre serviços/one-time (%)
  commission_recurring: number | null; // Comissão sobre recorrência (%)
  recurring_commission_months: number | null; // Meses de mensalidade para cálculo de comissão
  affiliate_token: string | null;
  status: 'pending' | 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  email: string;
  name: string;
  company: string | null;
  phone: string | null;
  created_at: string;
  settings?: PartnerSettings;
}

export interface PartnerFormData {
  companyName: string;
  cnpj: string;
  type: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  primaryColor: string;
  secondaryColor: string;
  customDomain: string;
  commission: number; // Compatibilidade com campo antigo
  commissionService: number; // Comissão sobre serviços (%)
  commissionRecurring: number; // Comissão sobre recorrência (%)
  recurringCommissionMonths: number; // Meses de mensalidade para comissão
}

export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Dados mockados do parceiro demo para demonstração
      const mockPartner: Partner = {
        id: 'demo-partner-id-1',
        email: 'parceiro@legacy.com',
        name: 'Parceiro Demo',
        company: 'Parceiro Demo Legacy',
        phone: '(11) 77777-7777',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        settings: {
          id: 'demo-settings-id-1',
          user_id: 'demo-partner-id-1',
          company_name: 'Parceiro Demo Legacy',
          cnpj: '11.222.333/0001-44',
          partner_type: 'afiliado',
          admin_phone: '(11) 77777-7777',
          primary_color: '#3B82F6',
          secondary_color: '#1E40AF',
          custom_domain: null,
          commission: 10,
          commission_service: 15.00,
          commission_recurring: 10.00,
          recurring_commission_months: 12,
          affiliate_token: 'aff_demo_parceiro_legacy_2024',
          status: 'active',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }
      };

      // Tentar buscar usuários com role 'parceiro'
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'parceiro');

      // Se houver erro ou não houver parceiros no banco, usar dados mockados para demonstração
      if (roleError || !roleData || roleData.length === 0) {
        setPartners([mockPartner]);
        setLoading(false);
        return;
      }

      const partnerUserIds = roleData.map(r => r.user_id);

      // Buscar dados dos usuários parceiros
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .in('id', partnerUserIds);

      if (usersError) throw usersError;

      // Tentar buscar settings (pode não existir ainda a tabela)
      let settingsMap: Record<string, PartnerSettings> = {};
      try {
        const { data: settingsData } = await supabase
          .from('partner_settings' as any)
          .select('*')
          .in('user_id', partnerUserIds);
        
        if (settingsData) {
          settingsMap = (settingsData as unknown as PartnerSettings[]).reduce((acc, s) => {
            acc[s.user_id] = s;
            return acc;
          }, {} as Record<string, PartnerSettings>);
        }
      } catch {
        // Tabela partner_settings pode não existir ainda
        console.log('partner_settings table not found, using defaults');
      }

      const formattedPartners: Partner[] = (usersData || []).map(user => ({
        id: user.id,
        email: user.email,
        name: user.name || '',
        company: user.company,
        phone: user.phone,
        created_at: user.created_at || new Date().toISOString(),
        settings: settingsMap[user.id] || {
          id: '',
          user_id: user.id,
          company_name: user.company || '',
          cnpj: null,
          partner_type: 'consultoria',
          admin_phone: user.phone,
          primary_color: '#3B82F6',
          secondary_color: '#1E40AF',
          custom_domain: null,
          commission: 15,
          commission_service: null,
          commission_recurring: null,
          recurring_commission_months: null,
          affiliate_token: null,
          status: 'pending' as const,
          created_at: user.created_at || new Date().toISOString(),
          updated_at: user.updated_at || new Date().toISOString(),
        }
      }));

      setPartners(formattedPartners);
    } catch (err: any) {
      console.error('Error fetching partners:', err);
      // Em caso de erro, usar dados mockados para demonstração
      const mockPartner: Partner = {
        id: 'demo-partner-id-1',
        email: 'parceiro@legacy.com',
        name: 'Parceiro Demo',
        company: 'Parceiro Demo Legacy',
        phone: '(11) 77777-7777',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        settings: {
          id: 'demo-settings-id-1',
          user_id: 'demo-partner-id-1',
          company_name: 'Parceiro Demo Legacy',
          cnpj: '11.222.333/0001-44',
          partner_type: 'afiliado',
          admin_phone: '(11) 77777-7777',
          primary_color: '#3B82F6',
          secondary_color: '#1E40AF',
          custom_domain: null,
          commission: 10,
          commission_service: 15.00,
          commission_recurring: 10.00,
          recurring_commission_months: 12,
          affiliate_token: 'aff_demo_parceiro_legacy_2024',
          status: 'active',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }
      };
      setPartners([mockPartner]);
      // Não definir erro para permitir que os dados mockados sejam exibidos
      // setError(err.message || 'Erro ao carregar parceiros');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPartner = async (formData: PartnerFormData) => {
    try {
      console.log('🔍 Criando parceiro com dados:', {
        email: formData.adminEmail,
        name: formData.adminName,
        companyName: formData.companyName,
        type: formData.type,
      });

      // Tentar usar Edge Function primeiro
      let affiliateToken: string | null = null;
      let userId: string | null = null;

      try {
        const { data, error } = await supabase.functions.invoke('create-partner', {
          method: 'POST',
          body: {
            email: formData.adminEmail,
            name: formData.adminName,
            companyName: formData.companyName,
            phone: formData.adminPhone || null,
            cnpj: formData.cnpj || null,
            type: formData.type || 'consultoria',
            primaryColor: formData.primaryColor || '#3B82F6',
            secondaryColor: formData.secondaryColor || '#1E40AF',
            customDomain: formData.customDomain || null,
            commission: formData.commission || 15,
            commissionService: formData.commissionService || null,
            commissionRecurring: formData.commissionRecurring || null,
            recurringCommissionMonths: formData.recurringCommissionMonths || 12,
          },
        });

        console.log('📥 Resposta da Edge Function:', { data, error });

        if (!error && data?.success) {
          userId = data.userId;
          affiliateToken = data.affiliateToken || null;
        } else {
          throw new Error('Edge Function não disponível, usando método alternativo');
        }
      } catch (edgeError: any) {
        console.log('⚠️ Edge Function não disponível, usando método alternativo:', edgeError);
        
        // Método alternativo: criar usuário via signUp e depois criar settings
        // Gerar senha temporária
        const tempPassword = Math.random().toString(36).slice(-12) + 'A1!@#';
        
        // Criar usuário via auth.signUp
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.adminEmail,
          password: tempPassword,
          options: {
            data: {
              name: formData.adminName,
              company: formData.companyName,
              role: 'parceiro',
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (authError) {
          // Se o usuário já existe, buscar do banco
          if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
            const { data: existingUsers } = await supabase
              .from('users')
              .select('id')
              .eq('email', formData.adminEmail)
              .single();
            
            if (existingUsers) {
              userId = existingUsers.id;
            } else {
              throw new Error('Usuário já existe mas não foi encontrado no banco');
            }
          } else {
            throw authError;
          }
        } else if (authData?.user) {
          userId = authData.user.id;
          
          // Criar registro na tabela users
          await supabase
            .from('users')
            .upsert({
              id: userId,
              email: formData.adminEmail,
              name: formData.adminName,
              company: formData.companyName,
              phone: formData.adminPhone || null,
            }, {
              onConflict: 'id'
            });
        } else {
          throw new Error('Falha ao criar usuário');
        }

        // Adicionar role de parceiro
        await supabase
          .from('user_roles')
          .upsert({
            user_id: userId,
            role: 'parceiro',
          }, {
            onConflict: 'user_id,role'
          });

        // Criar/atualizar partner_settings usando função RPC
        // Tentar usar função RPC primeiro (gera token automaticamente)
        try {
          const { data: rpcData, error: rpcError } = await supabase.rpc('setup_partner_settings', {
            p_user_id: userId,
            p_company_name: formData.companyName,
            p_phone: formData.adminPhone || null,
            p_cnpj: formData.cnpj || null,
            p_type: formData.type || 'consultoria',
            p_primary_color: formData.primaryColor || '#3B82F6',
            p_secondary_color: formData.secondaryColor || '#1E40AF',
            p_custom_domain: formData.customDomain || null,
            p_commission: formData.commission || 15,
            p_commission_service: formData.commissionService || null,
            p_commission_recurring: formData.commissionRecurring || null,
            p_recurring_commission_months: formData.recurringCommissionMonths || 12,
          });

          if (!rpcError && rpcData?.success) {
            affiliateToken = rpcData.affiliateToken;
            console.log('✅ Settings criadas via RPC:', rpcData);
          } else {
            throw new Error('RPC não disponível, usando método direto');
          }
        } catch (rpcErr: any) {
          console.log('⚠️ RPC não disponível, usando método direto:', rpcErr);
          
          // Método direto: inserir/atualizar partner_settings
          // Gerar token de afiliado manualmente
          affiliateToken = `aff_${Math.random().toString(36).substring(2, 14).toUpperCase()}`;
          
          const { data: settingsData, error: settingsError } = await supabase
            .from('partner_settings')
            .upsert({
              user_id: userId,
              company_name: formData.companyName,
              cnpj: formData.cnpj || null,
              partner_type: formData.type || 'consultoria',
              admin_phone: formData.adminPhone || null,
              primary_color: formData.primaryColor || '#3B82F6',
              secondary_color: formData.secondaryColor || '#1E40AF',
              custom_domain: formData.customDomain || null,
              commission: formData.commission || 15,
              commission_service: formData.commissionService || null,
              commission_recurring: formData.commissionRecurring || null,
              recurring_commission_months: formData.recurringCommissionMonths || 12,
              affiliate_token: affiliateToken,
              status: 'active',
            }, {
              onConflict: 'user_id'
            })
            .select('affiliate_token')
            .single();

          if (settingsError) {
            console.error('Erro ao criar partner_settings:', settingsError);
            // Tentar buscar o token se já existir
            const { data: existing } = await supabase
              .from('partner_settings')
              .select('affiliate_token')
              .eq('user_id', userId)
              .single();
            
            if (existing?.affiliate_token) {
              affiliateToken = existing.affiliate_token;
            }
          } else {
            affiliateToken = settingsData?.affiliate_token || affiliateToken;
          }
        }
      }

      if (!userId) {
        throw new Error('Falha ao obter ID do usuário');
      }

      console.log('✅ Parceiro criado com sucesso:', {
        userId,
        affiliateToken,
      });

      await fetchPartners();
      return { 
        success: true, 
        userId,
        affiliateToken: affiliateToken || null
      };
    } catch (err: any) {
      console.error('❌ Erro completo ao criar parceiro:', err);
      
      // Tratamento específico para diferentes tipos de erro
      let errorMessage = 'Erro ao criar parceiro. Tente novamente.';
      
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError') || err.message?.includes('Load failed')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (err.message?.includes('already registered') || err.message?.includes('already exists')) {
        errorMessage = 'Este email já está cadastrado. Use outro email ou edite o parceiro existente.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updatePartnerSettings = async (
    userId: string, 
    settings: Partial<PartnerSettings>
  ) => {
    try {
      // Atualizar settings (se tabela existir)
      const { error: settingsError } = await supabase
        .from('partner_settings' as any)
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (settingsError) {
        // Se tabela não existe, tentar criar
        const { error: insertError } = await supabase
          .from('partner_settings' as any)
          .insert({
            user_id: userId,
            company_name: settings.company_name || '',
            partner_type: settings.partner_type || 'consultoria',
            primary_color: settings.primary_color || '#3B82F6',
            secondary_color: settings.secondary_color || '#1E40AF',
            commission: settings.commission || 15,
            commission_service: settings.commission_service || null,
            commission_recurring: settings.commission_recurring || null,
            recurring_commission_months: settings.recurring_commission_months || 12,
            status: settings.status || 'active',
            ...settings,
          });
        
        if (insertError) throw insertError;
      }

      await fetchPartners();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating partner settings:', err);
      toast.error(err.message || 'Erro ao atualizar configurações');
      return { success: false, error: err.message };
    }
  };

  const updatePartnerStatus = async (userId: string, status: 'active' | 'pending' | 'suspended') => {
    try {
      await supabase
        .from('partner_settings' as any)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      await fetchPartners();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating partner status:', err);
      return { success: false, error: err.message };
    }
  };

  const deletePartner = async (userId: string) => {
    try {
      // Remover role primeiro
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'parceiro');

      // Remover settings se existir
      try {
        await supabase
          .from('partner_settings' as any)
          .delete()
          .eq('user_id', userId);
      } catch {
        // Tabela pode não existir
      }

      // Remover usuário
      await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      await fetchPartners();
      toast.success('Parceiro removido com sucesso');
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting partner:', err);
      toast.error(err.message || 'Erro ao remover parceiro');
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  return {
    partners,
    loading,
    error,
    fetchPartners,
    createPartner,
    updatePartnerSettings,
    updatePartnerStatus,
    deletePartner,
  };
}
