import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { CompanySize, ModuleKey } from '@/types/organization';

export type ConfigMode = 'automatic' | 'manual';

export interface ClientPlanConfig {
  id: string;
  user_id: string;
  company_size: CompanySize;
  config_mode: ConfigMode;
  enabled_modules: ModuleKey[];
  enabled_addons: string[];
  total_price: number;
  status: 'pending' | 'active' | 'suspended';
  activated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DemoClient {
  id: string;
  name: string;
  email: string;
  company: string | null;
  sector: string | null;
  phone: string | null;
  created_at: string;
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

// Storage keys for localStorage
const DEMO_CLIENTS_KEY = 'demo_clients';
const PLAN_CONFIGS_KEY = 'client_plan_configs';

// Initial demo clients
const INITIAL_DEMO_CLIENTS: DemoClient[] = [
  {
    id: 'demo-client-001',
    name: 'Carlos Mendes',
    email: 'carlos@techcorp.com.br',
    company: 'TechCorp Brasil',
    sector: 'Tecnologia',
    phone: '(11) 99999-1111',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-client-002',
    name: 'Ana Paula Silva',
    email: 'ana@industriasprogresso.com.br',
    company: 'Indústrias Progresso',
    sector: 'Indústria',
    phone: '(11) 99999-2222',
    created_at: '2024-02-20T14:30:00Z'
  },
  {
    id: 'demo-client-003',
    name: 'Roberto Fernandes',
    email: 'roberto@gruposilva.com.br',
    company: 'Grupo Familiar Silva',
    sector: 'Holding Familiar',
    phone: '(11) 99999-3333',
    created_at: '2024-03-10T09:15:00Z'
  }
];

// Initial demo plan configs
const INITIAL_PLAN_CONFIGS: Record<string, ClientPlanConfig> = {
  'demo-client-001': {
    id: 'plan-001',
    user_id: 'demo-client-001',
    company_size: 'medium' as CompanySize,
    config_mode: 'automatic',
    enabled_modules: ['dashboard', 'settings', 'structure', 'cap_table', 'gov_maturity', 'legacy_rituals', 'checklist', 'interviews', 'analysis_actions', 'gov_config', 'annual_agenda', 'secretariat', 'councils', 'activities', 'leadership_performance'] as ModuleKey[],
    enabled_addons: ['esg_maturity', 'risks'],
    total_price: 12900,
    status: 'active',
    activated_at: '2024-01-20T10:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  'demo-client-002': {
    id: 'plan-002',
    user_id: 'demo-client-002',
    company_size: 'large' as CompanySize,
    config_mode: 'manual',
    enabled_modules: ['dashboard', 'settings', 'structure', 'cap_table', 'gov_maturity', 'legacy_rituals', 'checklist', 'interviews', 'analysis_actions', 'gov_config', 'annual_agenda', 'secretariat', 'councils', 'activities', 'leadership_performance', 'risks', 'ai_agents', 'project_submission'] as ModuleKey[],
    enabled_addons: ['risks', 'ai_agents'],
    total_price: 29900,
    status: 'pending',
    activated_at: null,
    created_at: '2024-02-20T14:30:00Z',
    updated_at: '2024-02-20T14:30:00Z'
  }
};

function getDemoClients(): DemoClient[] {
  try {
    const stored = localStorage.getItem(DEMO_CLIENTS_KEY);
    if (!stored) {
      // Initialize with demo data
      localStorage.setItem(DEMO_CLIENTS_KEY, JSON.stringify(INITIAL_DEMO_CLIENTS));
      return INITIAL_DEMO_CLIENTS;
    }
    return JSON.parse(stored);
  } catch {
    return INITIAL_DEMO_CLIENTS;
  }
}

function saveDemoClients(clients: DemoClient[]) {
  localStorage.setItem(DEMO_CLIENTS_KEY, JSON.stringify(clients));
}

function getStoredConfigs(): Record<string, ClientPlanConfig> {
  try {
    const stored = localStorage.getItem(PLAN_CONFIGS_KEY);
    if (!stored) {
      // Initialize with demo data
      localStorage.setItem(PLAN_CONFIGS_KEY, JSON.stringify(INITIAL_PLAN_CONFIGS));
      return INITIAL_PLAN_CONFIGS;
    }
    return JSON.parse(stored);
  } catch {
    return INITIAL_PLAN_CONFIGS;
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
      
      // Get demo clients from localStorage
      const demoClients = getDemoClients();
      const storedConfigs = getStoredConfigs();

      // Combine clients with their plan configs
      const clientsWithPlans: ClientWithPlan[] = demoClients.map((client) => ({
        id: client.id,
        name: client.name,
        email: client.email,
        company: client.company,
        sector: client.sector,
        phone: client.phone,
        created_at: client.created_at,
        plan_config: storedConfigs[client.id] || null
      }));

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
      const demoClients = getDemoClients();
      
      // Check if email already exists
      if (demoClients.some(c => c.email === clientData.email)) {
        throw new Error('Email já cadastrado');
      }

      const newClient: DemoClient = {
        id: crypto.randomUUID(),
        name: clientData.name,
        email: clientData.email,
        company: clientData.company,
        sector: clientData.sector,
        phone: clientData.phone || null,
        created_at: new Date().toISOString()
      };

      demoClients.push(newClient);
      saveDemoClients(demoClients);

      toast.success('Cliente criado com sucesso!');
      await fetchClients();
      return newClient;
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
      config_mode?: ConfigMode;
      enabled_modules?: ModuleKey[];
      enabled_addons: string[];
      total_price: number;
      status?: 'pending' | 'active' | 'suspended';
    }
  ) => {
    try {
      const storedConfigs = getStoredConfigs();
      const now = new Date().toISOString();
      const existingConfig = storedConfigs[userId];
      
      const newConfig: ClientPlanConfig = {
        id: existingConfig?.id || crypto.randomUUID(),
        user_id: userId,
        company_size: config.company_size,
        config_mode: config.config_mode || existingConfig?.config_mode || 'automatic',
        enabled_modules: config.enabled_modules || existingConfig?.enabled_modules || [],
        enabled_addons: config.enabled_addons,
        total_price: config.total_price,
        status: config.status || existingConfig?.status || 'pending',
        activated_at: existingConfig?.activated_at || null,
        created_at: existingConfig?.created_at || now,
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

  const deleteClient = async (userId: string) => {
    try {
      // Remove from demo clients
      const demoClients = getDemoClients();
      const filteredClients = demoClients.filter(c => c.id !== userId);
      saveDemoClients(filteredClients);

      // Remove plan config
      const storedConfigs = getStoredConfigs();
      delete storedConfigs[userId];
      saveStoredConfigs(storedConfigs);

      toast.success('Cliente removido.');
      await fetchClients();
    } catch (err: any) {
      console.error('Error deleting client:', err);
      toast.error('Erro ao remover cliente: ' + err.message);
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
    suspendClient,
    deleteClient
  };
}
