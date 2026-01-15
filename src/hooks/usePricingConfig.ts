import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

// Types
export interface CompanySize {
  id: string;
  key: string;
  name: string;
  description: string | null;
  revenue_min: number | null;
  revenue_max: number | null;
  employee_min: number | null;
  employee_max: number | null;
  order_index: number;
  is_active: boolean;
}

export interface SubscriptionPlan {
  id: string;
  key: string;
  name: string;
  description: string | null;
  max_companies: number;
  max_councils: number;
  max_users: number;
  included_addons: number;
  features: string[];
  order_index: number;
  is_active: boolean;
}

export interface PlanPricingMatrix {
  id: string;
  company_size_id: string;
  plan_id: string;
  monthly_price: number;
  annual_price: number;
  setup_fee: number;
  is_active: boolean;
  is_recommended: boolean;
}

export interface AddonCatalog {
  id: string;
  key: string;
  name: string;
  description: string | null;
  icon: string | null;
  monthly_price: number;
  annual_price: number;
  category: string | null;
  target_section: string | null;
  target_section_label: string | null;
  order_index: number;
  is_active: boolean;
  is_visible: boolean;
}

export interface Module {
  id: string;
  key: string;
  name: string;
  description: string | null;
  icon: string | null;
  section: string;
  section_label: string | null;
  path: string | null;
  is_core: boolean;
  is_addon: boolean;
  order_index: number;
  is_active: boolean;
}

// Configuração de Add-ons Sugeridos Padrão (pode ser editada no admin)
export interface SuggestedAddonsConfig {
  enabled: string[]; // Array de keys dos add-ons sugeridos em ordem
  updated_at?: string;
}

// Initial mock data
const INITIAL_SIZES: CompanySize[] = [
  { id: "1", key: "smb", name: "SMB", description: "Empresas < R$ 50M/ano", revenue_min: 0, revenue_max: 50000000, employee_min: 1, employee_max: 50, order_index: 0, is_active: true },
  { id: "2", key: "smb_plus", name: "SMB+", description: "Empresas R$ 50-300M/ano", revenue_min: 50000000, revenue_max: 300000000, employee_min: 50, employee_max: 200, order_index: 1, is_active: true },
  { id: "3", key: "mid_market", name: "Mid-Market", description: "Empresas R$ 300M-1B/ano", revenue_min: 300000000, revenue_max: 1000000000, employee_min: 200, employee_max: 1000, order_index: 2, is_active: true },
  { id: "4", key: "large", name: "Large", description: "Empresas R$ 1B+/ano (fechadas)", revenue_min: 1000000000, revenue_max: null, employee_min: 1000, employee_max: null, order_index: 3, is_active: true },
  { id: "5", key: "enterprise", name: "Enterprise", description: "Listadas B3/LATAM", revenue_min: 1000000000, revenue_max: null, employee_min: 1000, employee_max: null, order_index: 4, is_active: true },
];

const INITIAL_PLANS: SubscriptionPlan[] = [
  { id: "1", key: "essencial", name: "Essencial", description: "Plano básico", max_companies: 1, max_councils: 1, max_users: 0, included_addons: 0, features: ["13 módulos core", "1 empresa", "Usuários ilimitados"], order_index: 1, is_active: true },
  { id: "2", key: "profissional", name: "Profissional", description: "Para crescimento", max_companies: 1, max_councils: 3, max_users: 0, included_addons: 2, features: ["13 módulos core", "1 empresa", "Usuários ilimitados", "2 add-ons"], order_index: 2, is_active: true },
  { id: "3", key: "business", name: "Business", description: "Médias empresas", max_companies: 1, max_councils: 10, max_users: 0, included_addons: 3, features: ["13 módulos core", "1 empresa", "Usuários ilimitados", "3 add-ons"], order_index: 3, is_active: true },
  { id: "4", key: "enterprise", name: "Enterprise", description: "Solução completa", max_companies: 1, max_councils: 0, max_users: 0, included_addons: 6, features: ["13 módulos core", "1 empresa", "Usuários ilimitados", "6 add-ons"], order_index: 4, is_active: true },
];

const INITIAL_ADDONS: AddonCatalog[] = [
  { id: "1", key: "submeter_projetos", name: "Submeter Projetos", description: "Submeta projetos para deliberação", icon: "FolderUp", monthly_price: 997, annual_price: 11964, category: "governance", target_section: "estruturacao", target_section_label: "ESTRUTURAÇÃO", order_index: 1, is_active: true, is_visible: true },
  { id: "2", key: "desenvolvimento_pdi", name: "Desenvolvimento e PDI", description: "Planos de desenvolvimento individual", icon: "GraduationCap", monthly_price: 997, annual_price: 11964, category: "people", target_section: "gestao_pessoas", target_section_label: "GESTÃO DE PESSOAS", order_index: 2, is_active: true, is_visible: true },
  { id: "3", key: "desempenho_conselho", name: "Desempenho do Conselho", description: "Avaliação 360° dos membros", icon: "Target", monthly_price: 1497, annual_price: 17964, category: "people", target_section: "gestao_pessoas", target_section_label: "GESTÃO DE PESSOAS", order_index: 3, is_active: true, is_visible: true },
  { id: "4", key: "riscos", name: "Monitoramento de Riscos", description: "Identifique e gerencie riscos", icon: "AlertTriangle", monthly_price: 997, annual_price: 11964, category: "governance", target_section: "monitoramento", target_section_label: "MONITORAMENTO", order_index: 4, is_active: true, is_visible: true },
  { id: "5", key: "maturidade_esg", name: "Maturidade ESG", description: "Avalie a maturidade ESG", icon: "Leaf", monthly_price: 2997, annual_price: 35964, category: "strategy", target_section: "esg", target_section_label: "ESG", order_index: 5, is_active: true, is_visible: true },
  { id: "6", key: "inteligencia_mercado", name: "Inteligência de Mercado", description: "Análises de mercado em tempo real", icon: "TrendingUp", monthly_price: 1497, annual_price: 17964, category: "intelligence", target_section: "inteligencia", target_section_label: "INTELIGÊNCIA", order_index: 6, is_active: true, is_visible: true },
  { id: "7", key: "benchmarking_global", name: "Benchmarking Global", description: "Compare com líderes mundiais", icon: "Globe", monthly_price: 797, annual_price: 9564, category: "intelligence", target_section: "inteligencia", target_section_label: "INTELIGÊNCIA", order_index: 7, is_active: true, is_visible: true },
  { id: "8", key: "agentes_ia", name: "Agentes de IA", description: "Agentes do MOAT Engine", icon: "Bot", monthly_price: 1497, annual_price: 17964, category: "strategy", target_section: "inicio", target_section_label: "INÍCIO", order_index: 8, is_active: true, is_visible: true },
  { id: "9", key: "simulador_cenarios", name: "Simulador de Cenários", description: "Simule cenários estratégicos", icon: "LineChart", monthly_price: 997, annual_price: 11964, category: "strategy", target_section: "estrategico", target_section_label: "ESTRATÉGICO", order_index: 9, is_active: true, is_visible: true },
];

const INITIAL_MODULES: Module[] = [
  { id: "1", key: "dashboard", name: "Dashboard", description: "Visão geral", icon: "LayoutDashboard", section: "inicio", section_label: "INÍCIO", path: "/dashboard", is_core: true, is_addon: false, order_index: 1, is_active: true },
  { id: "2", key: "copiloto_ia", name: "Copiloto de IA", description: "Assistente inteligente", icon: "Brain", section: "inicio", section_label: "INÍCIO", path: "/governance-copilot", is_core: true, is_addon: false, order_index: 2, is_active: true },
  { id: "3", key: "estrutura_societaria", name: "Estrutura Societária", description: "Sócios e acionistas", icon: "Users", section: "parametrizacao", section_label: "PARAMETRIZAÇÃO", path: "/shareholder-structure", is_core: true, is_addon: false, order_index: 3, is_active: true },
  { id: "4", key: "cap_table", name: "Cap Table", description: "Tabela de capitalização", icon: "PieChart", section: "parametrizacao", section_label: "PARAMETRIZAÇÃO", path: "/cap-table", is_core: true, is_addon: false, order_index: 4, is_active: true },
  { id: "5", key: "maturidade_governanca", name: "Maturidade de Governança", description: "Nível de maturidade", icon: "Target", section: "parametrizacao", section_label: "PARAMETRIZAÇÃO", path: "/maturity", is_core: true, is_addon: false, order_index: 5, is_active: true },
  { id: "7", key: "checklist_documentos", name: "Checklist de Documentos", description: "Documentos obrigatórios", icon: "FileCheck", section: "preparacao", section_label: "PREPARAÇÃO", path: "/document-checklist", is_core: true, is_addon: false, order_index: 6, is_active: true },
  { id: "8", key: "entrevistas", name: "Entrevistas", description: "Entrevistas diagnóstico", icon: "MessageSquare", section: "preparacao", section_label: "PREPARAÇÃO", path: "/interviews", is_core: true, is_addon: false, order_index: 7, is_active: true },
  { id: "9", key: "analise_acoes", name: "Análise e Ações", description: "Gaps e plano de ação", icon: "ClipboardList", section: "preparacao", section_label: "PREPARAÇÃO", path: "/insights", is_core: true, is_addon: false, order_index: 8, is_active: true },
  { id: "10", key: "config_governanca", name: "Config. Governança", description: "Órgãos e membros", icon: "Settings", section: "estruturacao", section_label: "ESTRUTURAÇÃO", path: "/governance-config", is_core: true, is_addon: false, order_index: 9, is_active: true },
  { id: "11", key: "agenda_anual", name: "Agenda Anual", description: "Planejamento anual", icon: "Calendar", section: "estruturacao", section_label: "ESTRUTURAÇÃO", path: "/annual-agenda", is_core: true, is_addon: false, order_index: 10, is_active: true },
  { id: "12", key: "secretariado", name: "Secretariado", description: "Painel secretariado", icon: "Briefcase", section: "estruturacao", section_label: "ESTRUTURAÇÃO", path: "/secretariat", is_core: true, is_addon: false, order_index: 11, is_active: true },
  { id: "13", key: "conselhos", name: "Conselhos", description: "Reuniões e deliberações", icon: "Users", section: "estruturacao", section_label: "ESTRUTURAÇÃO", path: "/reunioes", is_core: true, is_addon: false, order_index: 12, is_active: true },
];

// Configuração padrão de add-ons sugeridos
const DEFAULT_SUGGESTED_ADDONS: SuggestedAddonsConfig = {
  enabled: ['maturidade_esg', 'desempenho_conselho', 'inteligencia_mercado'], // ESG, Desempenho, Inteligência
  updated_at: new Date().toISOString(),
};

// Generate initial pricing matrix - PRD v3.0 (Novo Mínimo R$ 2.997/mês)
function generatePricingMatrix(): PlanPricingMatrix[] {
  const matrix: PlanPricingMatrix[] = [];
  
  // Matriz completa: Porte × Plano com preços mensais, anuais e setup fee
  // Mínimo: R$ 2.997/mês | Desconto anual: 2 meses grátis (16,67%)
  // Setup SMB e SMB+ = 2 × mensalidade | Outros portes = 1 × mensalidade
  const prices: Record<string, Record<string, { monthly: number; annual: number; setup: number }>> = {
    // SMB (< R$ 50M/ano) - Setup = 2 × mensalidade | Anual = Mensal × 12
    smb: { 
      essencial: { monthly: 2997, annual: 35964, setup: 5994 }, // anual = 2997 × 12, setup = 2997 × 2
      profissional: { monthly: 4997, annual: 59964, setup: 9994 }, // anual = 4997 × 12, setup = 4997 × 2
      business: { monthly: 7997, annual: 95964, setup: 15994 }, // anual = 7997 × 12, setup = 7997 × 2
      enterprise: { monthly: 12997, annual: 155964, setup: 25994 } // anual = 12997 × 12, setup = 12997 × 2
    },
    // SMB+ (R$ 50M - R$ 300M/ano) - Setup = 2 × mensalidade | Anual = Mensal × 12
    smb_plus: { 
      essencial: { monthly: 3997, annual: 47964, setup: 7994 }, // anual = 3997 × 12, setup = 3997 × 2
      profissional: { monthly: 5997, annual: 71964, setup: 11994 }, // anual = 5997 × 12, setup = 5997 × 2
      business: { monthly: 9997, annual: 119964, setup: 19994 }, // anual = 9997 × 12, setup = 9997 × 2
      enterprise: { monthly: 19997, annual: 239964, setup: 39994 } // anual = 19997 × 12, setup = 19997 × 2
    },
    // Mid-Market (R$ 300M - R$ 1B/ano) - Setup = 1 × mensalidade | Anual = Mensal × 12
    mid_market: { 
      essencial: { monthly: 5997, annual: 71964, setup: 5997 }, // anual = 5997 × 12, setup = 5997 × 1
      profissional: { monthly: 8997, annual: 107964, setup: 8997 }, // anual = 8997 × 12, setup = 8997 × 1
      business: { monthly: 14997, annual: 179964, setup: 14997 }, // anual = 14997 × 12, setup = 14997 × 1
      enterprise: { monthly: 24997, annual: 299964, setup: 24997 } // anual = 24997 × 12, setup = 24997 × 1
    },
    // Large (R$ 1B - R$ 5B/ano) - Setup = 1 × mensalidade | Anual = Mensal × 12
    large: { 
      essencial: { monthly: 9997, annual: 119964, setup: 9997 }, // anual = 9997 × 12, setup = 9997 × 1
      profissional: { monthly: 14997, annual: 179964, setup: 14997 }, // anual = 14997 × 12, setup = 14997 × 1
      business: { monthly: 24997, annual: 299964, setup: 24997 }, // anual = 24997 × 12, setup = 24997 × 1
      enterprise: { monthly: 49997, annual: 599964, setup: 49997 } // anual = 49997 × 12, setup = 49997 × 1
    },
    // Enterprise (R$ 5B+ ou Listada B3) - Setup = 1 × mensalidade | Anual = Mensal × 12
    enterprise: { 
      essencial: { monthly: 14997, annual: 179964, setup: 14997 }, // anual = 14997 × 12, setup = 14997 × 1
      profissional: { monthly: 24997, annual: 299964, setup: 24997 }, // anual = 24997 × 12, setup = 24997 × 1
      business: { monthly: 49997, annual: 599964, setup: 49997 }, // anual = 49997 × 12, setup = 49997 × 1
      enterprise: { monthly: 99997, annual: 1199964, setup: 99997 } // anual = 99997 × 12, setup = 99997 × 1
    },
  };

  let id = 1;
  INITIAL_SIZES.forEach((size) => {
    INITIAL_PLANS.forEach((plan) => {
      const price = prices[size.key]?.[plan.key] || { monthly: 2997, annual: 35964, setup: 5994 };
      const isSMB = size.key === 'smb' || size.key === 'smb_plus';
      
      // Garantir que anual = mensal × 12 e setup = mensal × 2 (SMB) ou mensal × 1 (outros)
      const monthly = price.monthly;
      const annual = monthly * 12; // Anual sempre = Mensal × 12
      const setup = isSMB ? monthly * 2 : monthly; // Setup = Mensal × 2 para SMB/SMB+, senão = Mensal
      
      matrix.push({
        id: String(id++),
        company_size_id: size.id,
        plan_id: plan.id,
        monthly_price: monthly,
        annual_price: annual,
        setup_fee: setup,
        is_active: true,
        is_recommended: plan.key === "profissional" && (size.key === "smb_plus" || size.key === "mid_market"),
      });
    });
  });
  return matrix;
}

// Hook principal - usando localStorage para persistência local
export function usePricingConfig() {
  const [companySizes, setCompanySizes] = useState<CompanySize[]>(() => {
    const saved = localStorage.getItem("pricing_company_sizes");
    return saved ? JSON.parse(saved) : INITIAL_SIZES;
  });

  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(() => {
    const saved = localStorage.getItem("pricing_subscription_plans");
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [pricingMatrix, setPricingMatrix] = useState<PlanPricingMatrix[]>(() => {
    const saved = localStorage.getItem("pricing_matrix");
    return saved ? JSON.parse(saved) : generatePricingMatrix();
  });

  const [addons, setAddons] = useState<AddonCatalog[]>(() => {
    const saved = localStorage.getItem("pricing_addons");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Verificar se os dados estão atualizados comparando com INITIAL_ADDONS
      // Se o número de add-ons mudou ou se algum preço está diferente, usar INITIAL_ADDONS
      if (parsed.length !== INITIAL_ADDONS.length) {
        return INITIAL_ADDONS;
      }
      // Verificar se algum add-on tem preços diferentes dos iniciais
      const needsUpdate = INITIAL_ADDONS.some((initialAddon) => {
        const savedAddon = parsed.find((a: AddonCatalog) => a.key === initialAddon.key);
        if (!savedAddon) return true;
        return savedAddon.monthly_price !== initialAddon.monthly_price || 
               savedAddon.annual_price !== initialAddon.annual_price;
      });
      if (needsUpdate) {
        // Atualizar os preços mantendo outras customizações
        const updated = parsed.map((savedAddon: AddonCatalog) => {
          const initialAddon = INITIAL_ADDONS.find(a => a.key === savedAddon.key);
          if (initialAddon) {
            return {
              ...savedAddon,
              monthly_price: initialAddon.monthly_price,
              annual_price: initialAddon.annual_price,
            };
          }
          return savedAddon;
        });
        // Adicionar novos add-ons que não existem no localStorage
        INITIAL_ADDONS.forEach((initialAddon) => {
          if (!updated.find((a: AddonCatalog) => a.key === initialAddon.key)) {
            updated.push(initialAddon);
          }
        });
        return updated;
      }
      return parsed;
    }
    return INITIAL_ADDONS;
  });

  const [modules, setModules] = useState<Module[]>(() => {
    const saved = localStorage.getItem("pricing_modules");
    return saved ? JSON.parse(saved) : INITIAL_MODULES;
  });

  // Configuração de add-ons sugeridos padrão
  const [suggestedAddons, setSuggestedAddons] = useState<SuggestedAddonsConfig>(() => {
    const saved = localStorage.getItem("pricing_suggested_addons");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Garantir que sempre temos pelo menos os 3 padrões
        if (parsed.enabled && Array.isArray(parsed.enabled) && parsed.enabled.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn('Erro ao carregar suggested addons:', e);
      }
    }
    return DEFAULT_SUGGESTED_ADDONS;
  });

  const [isMutating, setIsMutating] = useState(false);

  // Save to localStorage
  const saveToStorage = (key: string, data: unknown) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Sincronizar addons com INITIAL_ADDONS uma vez na montagem
  useEffect(() => {
    const saved = localStorage.getItem("pricing_addons");
    if (saved) {
      const parsed = JSON.parse(saved);
      const needsSync = INITIAL_ADDONS.some((initialAddon) => {
        const savedAddon = parsed.find((a: AddonCatalog) => a.key === initialAddon.key);
        if (!savedAddon) return true;
        return savedAddon.monthly_price !== initialAddon.monthly_price || 
               savedAddon.annual_price !== initialAddon.annual_price;
      });
      
      if (needsSync) {
        // Atualizar os preços mantendo outras customizações
        const updated = parsed.map((savedAddon: AddonCatalog) => {
          const initialAddon = INITIAL_ADDONS.find(a => a.key === savedAddon.key);
          if (initialAddon) {
            return {
              ...savedAddon,
              monthly_price: initialAddon.monthly_price,
              annual_price: initialAddon.annual_price,
            };
          }
          return savedAddon;
        });
        // Adicionar novos add-ons que não existem no localStorage
        INITIAL_ADDONS.forEach((initialAddon) => {
          if (!updated.find((a: AddonCatalog) => a.key === initialAddon.key)) {
            updated.push(initialAddon);
          }
        });
        setAddons(updated);
        saveToStorage("pricing_addons", updated);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar apenas uma vez na montagem

  // Company Size mutations
  const updateCompanySize = (data: Partial<CompanySize> & { id: string }) => {
    setIsMutating(true);
    const updated = companySizes.map((s) => (s.id === data.id ? { ...s, ...data } : s));
    setCompanySizes(updated);
    saveToStorage("pricing_company_sizes", updated);
    toast({ title: "Porte atualizado com sucesso" });
    setIsMutating(false);
  };

  const createCompanySize = (data: Omit<CompanySize, "id">) => {
    setIsMutating(true);
    const newSize = { ...data, id: String(Date.now()) };
    const updated = [...companySizes, newSize];
    setCompanySizes(updated);
    saveToStorage("pricing_company_sizes", updated);
    toast({ title: "Porte criado com sucesso" });
    setIsMutating(false);
  };

  const deleteCompanySize = (id: string) => {
    setIsMutating(true);
    const updated = companySizes.filter((s) => s.id !== id);
    setCompanySizes(updated);
    saveToStorage("pricing_company_sizes", updated);
    toast({ title: "Porte removido com sucesso" });
    setIsMutating(false);
  };

  // Subscription Plan mutations
  const updateSubscriptionPlan = (data: Partial<SubscriptionPlan> & { id: string }) => {
    setIsMutating(true);
    const updated = subscriptionPlans.map((p) => (p.id === data.id ? { ...p, ...data } : p));
    setSubscriptionPlans(updated);
    saveToStorage("pricing_subscription_plans", updated);
    toast({ title: "Plano atualizado com sucesso" });
    setIsMutating(false);
  };

  const createSubscriptionPlan = (data: Omit<SubscriptionPlan, "id">) => {
    setIsMutating(true);
    const newPlan = { ...data, id: String(Date.now()) };
    const updated = [...subscriptionPlans, newPlan];
    setSubscriptionPlans(updated);
    saveToStorage("pricing_subscription_plans", updated);
    toast({ title: "Plano criado com sucesso" });
    setIsMutating(false);
  };

  const deleteSubscriptionPlan = (id: string) => {
    setIsMutating(true);
    const updated = subscriptionPlans.filter((p) => p.id !== id);
    setSubscriptionPlans(updated);
    saveToStorage("pricing_subscription_plans", updated);
    toast({ title: "Plano removido com sucesso" });
    setIsMutating(false);
  };

  // Pricing Matrix mutations
  const updatePricingMatrix = (data: Partial<PlanPricingMatrix> & { id: string }) => {
    setIsMutating(true);
    const updated = pricingMatrix.map((p) => (p.id === data.id ? { ...p, ...data } : p));
    setPricingMatrix(updated);
    saveToStorage("pricing_matrix", updated);
    toast({ title: "Pricing atualizado com sucesso" });
    setIsMutating(false);
  };

  // Addon mutations
  const updateAddon = (data: Partial<AddonCatalog> & { id: string }) => {
    setIsMutating(true);
    const updated = addons.map((a) => (a.id === data.id ? { ...a, ...data } : a));
    setAddons(updated);
    saveToStorage("pricing_addons", updated);
    toast({ title: "Add-on atualizado com sucesso" });
    setIsMutating(false);
  };

  const createAddon = (data: Omit<AddonCatalog, "id">) => {
    setIsMutating(true);
    const newAddon = { ...data, id: String(Date.now()) };
    const updated = [...addons, newAddon];
    setAddons(updated);
    saveToStorage("pricing_addons", updated);
    toast({ title: "Add-on criado com sucesso" });
    setIsMutating(false);
  };

  const deleteAddon = (id: string) => {
    setIsMutating(true);
    const updated = addons.filter((a) => a.id !== id);
    setAddons(updated);
    saveToStorage("pricing_addons", updated);
    toast({ title: "Add-on removido com sucesso" });
    setIsMutating(false);
  };

  // Module mutations
  const updateModule = (data: Partial<Module> & { id: string }) => {
    setIsMutating(true);
    const updated = modules.map((m) => (m.id === data.id ? { ...m, ...data } : m));
    setModules(updated);
    saveToStorage("pricing_modules", updated);
    toast({ title: "Módulo atualizado com sucesso" });
    setIsMutating(false);
  };

  // Suggested Addons mutations
  const updateSuggestedAddons = (data: SuggestedAddonsConfig) => {
    setIsMutating(true);
    const updated = {
      ...data,
      updated_at: new Date().toISOString(),
    };
    setSuggestedAddons(updated);
    saveToStorage("pricing_suggested_addons", updated);
    toast({ title: "Add-ons sugeridos atualizados com sucesso" });
    setIsMutating(false);
  };

  // Helper
  const getPricing = (sizeId: string, planId: string): PlanPricingMatrix | undefined => {
    return pricingMatrix.find((p) => p.company_size_id === sizeId && p.plan_id === planId);
  };

  return {
    companySizes,
    subscriptionPlans,
    pricingMatrix,
    addons,
    modules,
    suggestedAddons,
    isLoading: false,
    isMutating,
    updateCompanySize,
    createCompanySize,
    deleteCompanySize,
    updateSubscriptionPlan,
    createSubscriptionPlan,
    deleteSubscriptionPlan,
    updatePricingMatrix,
    updateAddon,
    createAddon,
    deleteAddon,
    updateModule,
    updateSuggestedAddons,
    getPricing,
  };
}
