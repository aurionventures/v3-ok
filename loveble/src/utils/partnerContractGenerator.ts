/**
 * Utilitário para geração automatizada de contratos de parceiros
 * Centraliza a lógica de substituição de variáveis baseada no Tier configurado
 */

import { PartnerTier, getTierConfig, mapInvitationLevelToTier } from '@/config/partnerTiers';

export interface PartnerContractData {
  partnerName: string;
  companyName: string;
  cnpj?: string;
  email: string;
  phone?: string;
  cpf?: string;
  address?: string;
  invitationLevel?: string;
  contractNumber?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  durationMonths?: number;
}

/**
 * Gera o conteúdo HTML do contrato de parceiro substituindo todas as variáveis
 * com base no Tier configurado e dados do parceiro
 */
export function generatePartnerContractContent(
  templateContent: string,
  data: PartnerContractData
): string {
  // 1. Determinar o Tier do parceiro
  const partnerTier = mapInvitationLevelToTier(data.invitationLevel || 'tier_3_simple') as PartnerTier;
  const tierConfig = getTierConfig(partnerTier);
  
  // 2. Calcular datas
  const startDate = data.startDate 
    ? (typeof data.startDate === 'string' ? new Date(data.startDate) : data.startDate)
    : new Date();
  
  const durationMonths = data.durationMonths || 12;
  const endDate = data.endDate
    ? (typeof data.endDate === 'string' ? new Date(data.endDate) : data.endDate)
    : new Date(startDate.getTime() + durationMonths * 30 * 24 * 60 * 60 * 1000);
  
  // 3. Gerar número de contrato se não fornecido
  const contractNumber = data.contractNumber || `CTR-PART-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  
  // 4. Formatar datas para pt-BR
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const formatDateExtenso = (date: Date) => {
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };
  
  // 5. Obter configurações de todos os tiers para variáveis de referência
  const tier1Config = getTierConfig('tier_1_commercial');
  const tier2Config = getTierConfig('tier_2_qualified');
  const tier3Config = getTierConfig('tier_3_simple');
  const tier4Config = getTierConfig('tier_4_premium');
  
  // 6. Preparar todas as variáveis
  const variables: Record<string, string> = {
    // Dados do parceiro
    '{{parceiro_nome}}': data.partnerName,
    '{{parceiro_empresa}}': data.companyName,
    '{{parceiro_cnpj}}': data.cnpj || 'Não informado',
    '{{parceiro_email}}': data.email,
    '{{parceiro_telefone}}': data.phone || '',
    '{{parceiro_tier}}': tierConfig.tier_name,
    '{{parceiro_representante}}': data.partnerName,
    '{{parceiro_cargo}}': 'Representante Legal',
    '{{parceiro_cpf}}': data.cpf || 'Não informado',
    '{{parceiro_endereco}}': data.address || 'Não informado',
    
    // Dados do contrato
    '{{contrato_numero}}': contractNumber,
    '{{data_inicio}}': formatDate(startDate),
    '{{data_fim}}': formatDate(endDate),
    '{{duracao_meses}}': durationMonths.toString(),
    '{{duracao_extenso}}': durationMonths === 12 ? 'doze' : 
                          durationMonths === 24 ? 'vinte e quatro' :
                          durationMonths === 36 ? 'trinta e seis' : durationMonths.toString(),
    '{{data_contrato}}': formatDate(new Date()),
    '{{cidade_assinatura}}': 'São Paulo',
    
    // Comissões do Tier específico (este parceiro)
    '{{comissao_setup}}': tierConfig.originated_setup_commission.toString(),
    '{{comissao_recorrente}}': tierConfig.originated_recurring_commission.toString(),
    '{{meses_comissao}}': tierConfig.originated_recurring_months.toString(),
    
    // Variáveis de referência dos tiers (para informação no contrato)
    '{{comissao_setup_tier1}}': tier1Config.originated_setup_commission.toString(),
    '{{comissao_recorrente_tier1}}': tier1Config.originated_recurring_commission.toString(),
    '{{meses_comissao_tier1}}': tier1Config.originated_recurring_months.toString(),
    '{{comissao_setup_tier2}}': tier2Config.originated_setup_commission.toString(),
    '{{comissao_recorrente_tier2}}': tier2Config.originated_recurring_commission.toString(),
    '{{meses_comissao_tier2}}': tier2Config.originated_recurring_months.toString(),
    '{{comissao_setup_tier3}}': tier3Config.originated_setup_commission.toString(),
    '{{comissao_recorrente_tier3}}': tier3Config.originated_recurring_commission.toString(),
    '{{meses_comissao_tier3}}': tier3Config.originated_recurring_months.toString(),
    '{{comissao_setup_tier4}}': tier4Config.custom_contract_percentage.toString(), // Tier 4 usa porcentagem customizada
    
    // Variáveis adicionais
    '{{periodo_rastreamento}}': '30',
    '{{dia_pagamento_comissao}}': '10',
  };
  
  // 7. Substituir todas as variáveis no template
  let result = templateContent;
  Object.entries(variables).forEach(([key, value]) => {
    // Escapar caracteres especiais para regex
    const escapedKey = key.replace(/[{}]/g, '\\$&');
    const regex = new RegExp(escapedKey, 'g');
    result = result.replace(regex, value);
  });
  
  return result;
}

/**
 * Obtém as comissões configuradas para um Tier específico
 * Útil para preencher dados de contrato antes de gerar o conteúdo
 */
export function getTierCommissionConfig(invitationLevel?: string): {
  setup: number;
  recurring: number;
  recurringMonths: number;
  tier: PartnerTier;
} {
  const partnerTier = mapInvitationLevelToTier(invitationLevel || 'tier_3_simple') as PartnerTier;
  const tierConfig = getTierConfig(partnerTier);
  
  return {
    setup: tierConfig.originated_setup_commission,
    recurring: tierConfig.originated_recurring_commission,
    recurringMonths: tierConfig.originated_recurring_months,
    tier: partnerTier
  };
}
