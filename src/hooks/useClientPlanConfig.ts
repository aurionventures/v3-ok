import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { CompanySize, ModuleKey } from '@/types/organization';

export interface ClientPlanConfig {
  id: string;
  user_id: string;
  company_size: CompanySize;
  enabled_addons: string[];
  total_price: number;
  status: 'pending' | 'active' | 'suspended';
  activated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientWithPlan {
  id: string;
  name: string;
  email: string;
  company: string | null;
  sector: string | null;
  phone: string | null;
  created_at: string;
  plan_config: ClientPlanConfig | null;
}

// Storage key for localStorage fallback
const PLAN_CONFIGS_KEY = 'client_plan_configs';

function getStoredConfigs(): Record<string, ClientPlanConfig> {
  try {
    const stored = localStorage.getItem(PLAN_CONFIGS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveStoredConfigs(configs: Record<string, ClientPlanConfig>) {
  localStorage.setItem(PLAN_CONFIGS_KEY, JSON.stringify(configs));
}

export function useClientPlanConfig() {
  const [clients, setClients] = useState<ClientWithPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      // Buscar usuários com role 'cliente'
      const { data: usersWithRoles, error: usersError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          users!inner(id, name, email, company, sector, phone, created_at)
        `)
        .eq('role', 'cliente');

      if (usersError) throw usersError;

      // Get stored plan configs from localStorage
      const storedConfigs = getStoredConfigs();

      // Combinar dados
      const clientsWithPlans: ClientWithPlan[] = (usersWithRoles || []).map((ur: any) => {
        const user = ur.users;
        const planConfig = storedConfigs[user.id] || null;
        
        return {
          id: user.id,
          name: user.name || 'Sem nome',
          email: user.email,
          company: user.company,
          sector: user.sector,
          phone: user.phone,
          created_at: user.created_at,
          plan_config: planConfig
        };
      });

      setClients(clientsWithPlans);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: {
    name: string;
    email: string;
    company: string;
    sector: string;
    phone?: string;
  }) => {
    try {
      // Criar usuário
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          name: clientData.name,
          email: clientData.email,
          company: clientData.company,
          sector: clientData.sector,
          phone: clientData.phone || null
        })
        .select()
        .single();

      if (userError) throw userError;

      // Criar role de cliente
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: newUser.id,
          role: 'cliente'
        });

      if (roleError) throw roleError;

      toast.success('Cliente criado com sucesso!');
      await fetchClients();
      return newUser;
    } catch (err: any) {
      console.error('Error creating client:', err);
      toast.error('Erro ao criar cliente: ' + err.message);
      throw err;
    }
  };

  const savePlanConfig = async (
    userId: string,
    config: {
      company_size: CompanySize;
      enabled_addons: string[];
      total_price: number;
    }
  ) => {
    try {
      const storedConfigs = getStoredConfigs();
      const now = new Date().toISOString();
      
      const newConfig: ClientPlanConfig = {
        id: storedConfigs[userId]?.id || crypto.randomUUID(),
        user_id: userId,
        company_size: config.company_size,
        enabled_addons: config.enabled_addons,
        total_price: config.total_price,
        status: 'pending',
        activated_at: null,
        created_at: storedConfigs[userId]?.created_at || now,
        updated_at: now
      };
      
      storedConfigs[userId] = newConfig;
      saveStoredConfigs(storedConfigs);

      toast.success('Configuração de plano salva!');
      await fetchClients();
    } catch (err: any) {
      console.error('Error saving plan config:', err);
      toast.error('Erro ao salvar configuração: ' + err.message);
      throw err;
    }
  };

  const activateClient = async (userId: string) => {
    try {
      const storedConfigs = getStoredConfigs();
      
      if (storedConfigs[userId]) {
        storedConfigs[userId] = {
          ...storedConfigs[userId],
          status: 'active',
          activated_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        saveStoredConfigs(storedConfigs);
      }

      toast.success('Cliente ativado com sucesso!');
      await fetchClients();
    } catch (err: any) {
      console.error('Error activating client:', err);
      toast.error('Erro ao ativar cliente: ' + err.message);
      throw err;
    }
  };

  const suspendClient = async (userId: string) => {
    try {
      const storedConfigs = getStoredConfigs();
      
      if (storedConfigs[userId]) {
        storedConfigs[userId] = {
          ...storedConfigs[userId],
          status: 'suspended',
          updated_at: new Date().toISOString()
        };
        saveStoredConfigs(storedConfigs);
      }

      toast.success('Cliente suspenso.');
      await fetchClients();
    } catch (err: any) {
      console.error('Error suspending client:', err);
      toast.error('Erro ao suspender cliente: ' + err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    savePlanConfig,
    activateClient,
    suspendClient
  };
}
