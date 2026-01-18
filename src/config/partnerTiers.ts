/**
 * Configuração de Tiers de Parceiros
 * Conforme Política Comercial Legacy OS
 */

export type PartnerTier = 
  | 'tier_1_commercial' 
  | 'tier_2_qualified' 
  | 'tier_3_simple' 
  | 'tier_4_premium';

export type SaleOrigin = 'originated' | 'received';

export interface TierConfig {
  tier_key: PartnerTier;
  tier_name: string;
  tier_description: string;
  originated_setup_commission: number;
  originated_recurring_commission: number;
  originated_recurring_months: number;
  received_setup_commission: number;
  received_recurring_commission: number;
  received_recurring_months: number;
  custom_contract_percentage: number;
  responsibilities: string[];
}

export const TIER_CONFIGS: Record<PartnerTier, TierConfig> = {
  tier_1_commercial: {
    tier_key: 'tier_1_commercial',
    tier_name: 'Parceiro Comercial',
    tier_description: 'Atuação completa no ciclo de vendas',
    originated_setup_commission: 15.0,
    originated_recurring_commission: 15.0,
    originated_recurring_months: 3,
    received_setup_commission: 15.0,
    received_recurring_commission: 5.0,
    received_recurring_months: 3,
    custom_contract_percentage: 0,
    responsibilities: [
      'Conduz reuniões comerciais do início ao fim',
      'Apresenta propostas comerciais e técnicas',
      'Negocia termos, condições e prazos',
      'Realiza follow-up estruturado até o fechamento'
    ]
  },
  tier_2_qualified: {
    tier_key: 'tier_2_qualified',
    tier_name: 'Afiliado Qualificado',
    tier_description: 'Prospecção ativa e qualificação inicial',
    originated_setup_commission: 10.0,
    originated_recurring_commission: 5.0,
    originated_recurring_months: 3,
    received_setup_commission: 0,
    received_recurring_commission: 0,
    received_recurring_months: 0,
    custom_contract_percentage: 0,
    responsibilities: [
      'Valida o fit do lead com o perfil ICP',
      'Realiza apresentação inicial do produto',
      'Aquece o lead e gera interesse genuíno',
      'Transfere o lead pronto para o time comercial'
    ]
  },
  tier_3_simple: {
    tier_key: 'tier_3_simple',
    tier_name: 'Afiliado Simples',
    tier_description: 'Indicação e validação básica',
    originated_setup_commission: 0,
    originated_recurring_commission: 15.0,
    originated_recurring_months: 3,
    received_setup_commission: 0,
    received_recurring_commission: 0,
    received_recurring_months: 0,
    custom_contract_percentage: 0,
    responsibilities: [
      'Indica contatos qualificados da própria rede',
      'Valida interesse básico do prospect',
      'Realiza a ponte inicial com o time da Aurion'
    ]
  },
  tier_4_premium: {
    tier_key: 'tier_4_premium',
    tier_name: 'Parceiro Premium',
    tier_description: 'Posicionamento de mercado e abertura de portas',
    originated_setup_commission: 0,
    originated_recurring_commission: 0,
    originated_recurring_months: 0,
    received_setup_commission: 0,
    received_recurring_commission: 0,
    received_recurring_months: 0,
    custom_contract_percentage: 10.0,
    responsibilities: [
      'Atuação como formador de opinião',
      'Acesso direto a executivos C-level',
      'Relacionamento com conselhos e comitês',
      'Geração de negócios de cross-sell',
      'Validação e posicionamento institucional'
    ]
  }
};

export const TIER_OPTIONS = Object.values(TIER_CONFIGS).map(config => ({
  value: config.tier_key,
  label: config.tier_name,
  description: config.tier_description
}));

/**
 * Calcula comissão baseada no Tier e origem da venda
 */
export function calculateCommission(
  tier: PartnerTier,
  saleOrigin: SaleOrigin,
  planValue: number,
  setupValue: number = 0,
  billingTerm: number = 12
): {
  setupCommission: number;
  recurringCommission: number;
  totalCommission: number;
  recurringMonths: number;
} {
  const config = getTierConfig(tier);
  if (!config) {
    return {
      setupCommission: 0,
      recurringCommission: 0,
      totalCommission: 0,
      recurringMonths: 0
    };
  }

  const monthlyValue = planValue / 12.0;
  let setupCommission = 0;
  let recurringCommission = 0;
  let recurringMonths = 0;

  // Tier 4: Comissão customizada (porcentagem sobre valor líquido)
  if (tier === 'tier_4_premium') {
    return {
      setupCommission: 0,
      recurringCommission: (planValue * config.custom_contract_percentage) / 100.0,
      totalCommission: (planValue * config.custom_contract_percentage) / 100.0,
      recurringMonths: 0
    };
  }

  // Determinar qual configuração usar (originada ou recebida)
  if (saleOrigin === 'originated') {
    // Comissão de setup (se houver)
    if (config.originated_setup_commission > 0 && setupValue > 0) {
      setupCommission = (setupValue * config.originated_setup_commission) / 100.0;
    }

    // Comissão recorrente
    if (config.originated_recurring_commission > 0) {
      recurringMonths = config.originated_recurring_months;
      recurringCommission = 
        (monthlyValue * config.originated_recurring_commission) / 100.0 * recurringMonths;
    }
  } else {
    // Venda recebida (apenas Tier 1)
    if (tier === 'tier_1_commercial') {
      // Comissão de setup (se houver)
      if (config.received_setup_commission > 0 && setupValue > 0) {
        setupCommission = (setupValue * config.received_setup_commission) / 100.0;
      }

      // Comissão recorrente
      if (config.received_recurring_commission > 0) {
        recurringMonths = config.received_recurring_months;
        recurringCommission = 
          (monthlyValue * config.received_recurring_commission) / 100.0 * recurringMonths;
      }
    }
  }

  return {
    setupCommission,
    recurringCommission,
    totalCommission: setupCommission + recurringCommission,
    recurringMonths
  };
}

/**
 * Mapeia tipo de parceiro antigo para Tier
 */
export function mapPartnerTypeToTier(partnerType: string): PartnerTier {
  const mapping: Record<string, PartnerTier> = {
    'parceiro': 'tier_1_commercial',
    'revenda': 'tier_1_commercial',
    'consultoria': 'tier_2_qualified',
    'integrador': 'tier_2_qualified',
    'afiliado': 'tier_3_simple'
  };
  
  return mapping[partnerType] || 'tier_3_simple';
}

/**
 * Mapeia nível de convite antigo para Tier
 */
export function mapInvitationLevelToTier(level: string): PartnerTier {
  const mapping: Record<string, PartnerTier> = {
    'afiliado_basico': 'tier_3_simple',
    'afiliado_avancado': 'tier_2_qualified',
    'parceiro': 'tier_1_commercial'
  };
  
  return mapping[level] || 'tier_3_simple';
}

/**
 * Carrega configurações de Tier do localStorage ou retorna as configurações padrão
 */
export function getTierConfig(tier: PartnerTier): TierConfig {
  try {
    const stored = localStorage.getItem('partner_tier_configs');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed[tier]) {
        // Merge com configurações padrão para garantir que todos os campos existam
        return {
          ...TIER_CONFIGS[tier],
          ...parsed[tier]
        };
      }
    }
  } catch (error) {
    console.error('Erro ao carregar configurações de Tier do localStorage:', error);
  }
  
  return TIER_CONFIGS[tier];
}

/**
 * Retorna todas as configurações de Tier (do localStorage ou padrão)
 */
export function getAllTierConfigs(): Record<PartnerTier, TierConfig> {
  try {
    const stored = localStorage.getItem('partner_tier_configs');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge com configurações padrão
      const merged: Record<PartnerTier, TierConfig> = {} as Record<PartnerTier, TierConfig>;
      Object.keys(TIER_CONFIGS).forEach((key) => {
        const tierKey = key as PartnerTier;
        merged[tierKey] = {
          ...TIER_CONFIGS[tierKey],
          ...(parsed[tierKey] || {})
        };
      });
      return merged;
    }
  } catch (error) {
    console.error('Erro ao carregar configurações de Tier do localStorage:', error);
  }
  
  return TIER_CONFIGS;
}
