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
  commission: number;
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
  commission: number;
}

export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar usuários com role 'parceiro'
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'parceiro');

      if (roleError) throw roleError;

      if (!roleData || roleData.length === 0) {
        setPartners([]);
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
          status: 'pending' as const,
          created_at: user.created_at || new Date().toISOString(),
          updated_at: user.updated_at || new Date().toISOString(),
        }
      }));

      setPartners(formattedPartners);
    } catch (err: any) {
      console.error('Error fetching partners:', err);
      setError(err.message || 'Erro ao carregar parceiros');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPartner = async (formData: PartnerFormData) => {
    try {
      // 1. Criar usuário na tabela users
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: formData.adminEmail,
          name: formData.adminName,
          company: formData.companyName,
          phone: formData.adminPhone,
        })
        .select()
        .single();

      if (userError) throw userError;

      // 2. Adicionar role de parceiro
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: newUser.id,
          role: 'parceiro',
        });

      if (roleError) throw roleError;

      // 3. Tentar criar settings (se tabela existir)
      try {
        await supabase
          .from('partner_settings' as any)
          .insert({
            user_id: newUser.id,
            company_name: formData.companyName,
            cnpj: formData.cnpj || null,
            partner_type: formData.type,
            admin_phone: formData.adminPhone || null,
            primary_color: formData.primaryColor,
            secondary_color: formData.secondaryColor,
            custom_domain: formData.customDomain || null,
            commission: formData.commission,
            status: 'active',
          });
      } catch {
        console.log('Could not create partner_settings, table may not exist');
      }

      await fetchPartners();
      return { success: true, userId: newUser.id };
    } catch (err: any) {
      console.error('Error creating partner:', err);
      toast.error(err.message || 'Erro ao criar parceiro');
      return { success: false, error: err.message };
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
