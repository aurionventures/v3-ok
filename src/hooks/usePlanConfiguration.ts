import { useState, useCallback } from 'react';
import { CompanySize } from '@/types/organization';
import { toast } from 'sonner';

// Tipos para a configuração
export interface PlanSizeConfig {
  key: CompanySize;
  label: string;
  description: string;
  price: number;
}

export interface AddonPrice {
  key: string;
  label: string;
  description: string;
  price: number;
}

export interface ModulesBySize {
  startup: string[];
  small: string[];
  medium: string[];
  large: string[];
  listed: string[];
}

export interface FullPackage {
  originalPrice: number;
  discountedPrice: number;
}

export interface PlanConfiguration {
  sizeConfigs: PlanSizeConfig[];
  addonPrices: AddonPrice[];
  modulesBySize: ModulesBySize;
  fullPackage: FullPackage;
}

// Valores padrão (hardcoded - podem ser movidos para banco depois)
const DEFAULT_SIZE_CONFIGS: PlanSizeConfig[] = [
  { key: 'startup', label: 'Startup', description: '14 módulos incluídos', price: 3990 },
  { key: 'small', label: 'Pequena Empresa', description: '14 módulos incluídos', price: 5990 },
  { key: 'medium', label: 'Média Empresa', description: '15 módulos incluídos', price: 12900 },
  { key: 'large', label: 'Grande Empresa', description: '18 módulos incluídos', price: 29900 },
  { key: 'listed', label: 'Empresa Listada', description: '21 módulos incluídos', price: 69990 },
];

const DEFAULT_ADDONS: AddonPrice[] = [
  { key: 'ai_agents', label: 'Agentes de IA', description: 'Automação de processos com IA', price: 2990 },
  { key: 'project_submission', label: 'Submeter Projetos', description: 'Fluxo de aprovação de projetos', price: 1990 },
  { key: 'leadership_performance', label: 'Gestão de Pessoas', description: 'Desenvolvimento e PDI de lideranças', price: 2490 },
  { key: 'risks', label: 'Monitoramento de Riscos', description: 'Gestão de riscos de governança', price: 1990 },
  { key: 'esg_maturity', label: 'Maturidade ESG', description: 'Avaliação de maturidade ESG', price: 3990 },
  { key: 'market_intel', label: 'Inteligência de Mercado', description: 'Análise de mercado e benchmarking', price: 4990 },
];

const CORE_MODULES = [
  'dashboard', 'settings', 'structure', 'cap_table', 'gov_maturity', 'legacy_rituals',
  'checklist', 'interviews', 'analysis_actions', 'gov_config', 'annual_agenda', 
  'secretariat', 'councils', 'activities'
];

const DEFAULT_MODULES_BY_SIZE: ModulesBySize = {
  startup: [...CORE_MODULES],
  small: [...CORE_MODULES],
  medium: [...CORE_MODULES, 'leadership_performance'],
  large: [...CORE_MODULES, 'leadership_performance', 'risks', 'ai_agents', 'project_submission'],
  listed: [...CORE_MODULES, 'leadership_performance', 'risks', 'ai_agents', 'project_submission', 'esg_maturity', 'market_intel', 'benchmarking']
};

const DEFAULT_FULL_PACKAGE: FullPackage = {
  originalPrice: 78970,
  discountedPrice: 75970
};

export function usePlanConfiguration() {
  const [sizeConfigs, setSizeConfigs] = useState<PlanSizeConfig[]>(DEFAULT_SIZE_CONFIGS);
  const [addonPrices, setAddonPrices] = useState<AddonPrice[]>(DEFAULT_ADDONS);
  const [modulesBySize, setModulesBySize] = useState<ModulesBySize>(DEFAULT_MODULES_BY_SIZE);
  const [fullPackage, setFullPackage] = useState<FullPackage>(DEFAULT_FULL_PACKAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Atualizar configuração completa de um porte
  const updateSizeConfig = useCallback((
    size: CompanySize, 
    label: string, 
    description: string, 
    price: number
  ) => {
    setSizeConfigs(prev => prev.map(config => 
      config.key === size 
        ? { ...config, label, description, price }
        : config
    ));
    setHasChanges(true);
  }, []);

  // Obter configuração de um porte específico
  const getSizeConfig = useCallback((size: CompanySize): PlanSizeConfig | undefined => {
    return sizeConfigs.find(config => config.key === size);
  }, [sizeConfigs]);

  // Atualizar preço de add-on
  const updateAddonPrice = useCallback((key: string, value: number) => {
    setAddonPrices(prev => prev.map(addon => 
      addon.key === key ? { ...addon, price: value } : addon
    ));
    setHasChanges(true);
  }, []);

  // Atualizar detalhes de add-on
  const updateAddonDetails = useCallback((key: string, label: string, description: string) => {
    setAddonPrices(prev => prev.map(addon => 
      addon.key === key ? { ...addon, label, description } : addon
    ));
    setHasChanges(true);
  }, []);

  // Toggle módulo para um porte
  const toggleModule = useCallback((size: CompanySize, moduleKey: string) => {
    setModulesBySize(prev => {
      const currentModules = prev[size];
      const hasModule = currentModules.includes(moduleKey);
      
      return {
        ...prev,
        [size]: hasModule 
          ? currentModules.filter(m => m !== moduleKey)
          : [...currentModules, moduleKey]
      };
    });
    setHasChanges(true);
  }, []);

  // Verificar se módulo está incluído em um porte
  const isModuleIncluded = useCallback((size: CompanySize, moduleKey: string): boolean => {
    return modulesBySize[size].includes(moduleKey);
  }, [modulesBySize]);

  // Atualizar pacote full
  const updateFullPackage = useCallback((original: number, discounted: number) => {
    setFullPackage({ originalPrice: original, discountedPrice: discounted });
    setHasChanges(true);
  }, []);

  // Salvar alterações (futuro: enviar para banco)
  const saveChanges = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Enviar para Supabase quando tabela existir
      // await supabase.from('plan_configuration').upsert({ ... })
      
      // Por agora, apenas simular delay e confirmar
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setHasChanges(false);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  }, [sizeConfigs, addonPrices, modulesBySize, fullPackage]);

  // Restaurar para padrões
  const resetToDefaults = useCallback(() => {
    setSizeConfigs(DEFAULT_SIZE_CONFIGS);
    setAddonPrices(DEFAULT_ADDONS);
    setModulesBySize(DEFAULT_MODULES_BY_SIZE);
    setFullPackage(DEFAULT_FULL_PACKAGE);
    setHasChanges(true);
    toast.info('Configurações restauradas para o padrão');
  }, []);

  return {
    // Estado
    sizeConfigs,
    addonPrices,
    modulesBySize,
    fullPackage,
    isLoading,
    hasChanges,
    
    // Ações
    updateSizeConfig,
    getSizeConfig,
    updateAddonPrice,
    updateAddonDetails,
    toggleModule,
    isModuleIncluded,
    updateFullPackage,
    saveChanges,
    resetToDefaults
  };
}
