/**
 * Tipos e interfaces para cupons de desconto
 */

export type DiscountType = 'percentage' | 'fixed';
export type CouponStatus = 'active' | 'inactive' | 'expired' | 'used_up';

export interface DiscountCoupon {
  id: string;
  token: string; // Token único do cupom
  name: string; // Nome/descrição do cupom
  discountType: DiscountType; // 'percentage' ou 'fixed'
  discountValue: number; // Valor do desconto (percentual ou fixo em R$)
  minPurchaseValue?: number; // Valor mínimo de compra para usar o cupom
  maxDiscountValue?: number; // Valor máximo de desconto (para percentuais)
  validFrom: string; // Data de início (ISO string)
  validUntil: string; // Data de expiração (ISO string)
  maxUses?: number; // Número máximo de usos (null = ilimitado)
  currentUses: number; // Número de usos atuais
  applicablePlans?: string[]; // IDs dos planos aplicáveis (vazio = todos)
  applicablePortes?: string[]; // Portes aplicáveis (vazio = todos)
  status: CouponStatus;
  createdBy: string; // ID do admin que criou
  createdAt: string; // Data de criação (ISO string)
  updatedAt: string; // Data de atualização (ISO string)
}

export interface CouponUsage {
  id: string;
  couponId: string;
  couponToken: string;
  usedBy: string; // CNPJ ou email do cliente
  usedAt: string; // Data de uso (ISO string)
  orderValue: number; // Valor do pedido
  discountApplied: number; // Desconto aplicado
  contractId?: string; // ID do contrato relacionado
}

/**
 * Calcula o desconto aplicado por um cupom
 */
export function calculateCouponDiscount(
  coupon: DiscountCoupon,
  orderValue: number
): number {
  // Verificar se o cupom está ativo
  if (coupon.status !== 'active') {
    return 0;
  }

  // Verificar validade
  const now = new Date();
  const validFrom = new Date(coupon.validFrom);
  const validUntil = new Date(coupon.validUntil);

  if (now < validFrom || now > validUntil) {
    return 0;
  }

  // Verificar se atingiu o limite de usos
  if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
    return 0;
  }

  // Verificar valor mínimo de compra
  if (coupon.minPurchaseValue && orderValue < coupon.minPurchaseValue) {
    return 0;
  }

  let discount = 0;

  if (coupon.discountType === 'percentage') {
    discount = (orderValue * coupon.discountValue) / 100;
    // Aplicar limite máximo se existir
    if (coupon.maxDiscountValue && discount > coupon.maxDiscountValue) {
      discount = coupon.maxDiscountValue;
    }
  } else {
    // Desconto fixo
    discount = coupon.discountValue;
    // Não pode exceder o valor do pedido
    if (discount > orderValue) {
      discount = orderValue;
    }
  }

  return Math.round(discount * 100) / 100; // Arredondar para 2 casas decimais
}

/**
 * Valida se um cupom pode ser usado
 */
export function validateCoupon(
  coupon: DiscountCoupon | null,
  orderValue: number,
  planId?: string,
  porte?: string
): { valid: boolean; error?: string } {
  if (!coupon) {
    return { valid: false, error: 'Cupom não encontrado' };
  }

  if (coupon.status !== 'active') {
    return { valid: false, error: 'Cupom inativo' };
  }

  // Verificar validade
  const now = new Date();
  const validFrom = new Date(coupon.validFrom);
  const validUntil = new Date(coupon.validUntil);

  if (now < validFrom) {
    return { valid: false, error: 'Cupom ainda não está válido' };
  }

  if (now > validUntil) {
    return { valid: false, error: 'Cupom expirado' };
  }

  // Verificar limite de usos
  if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
    return { valid: false, error: 'Cupom esgotado' };
  }

  // Verificar valor mínimo
  if (coupon.minPurchaseValue && orderValue < coupon.minPurchaseValue) {
    return {
      valid: false,
      error: `Valor mínimo de compra: ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(coupon.minPurchaseValue)}`,
    };
  }

  // Verificar planos aplicáveis
  if (coupon.applicablePlans && coupon.applicablePlans.length > 0) {
    if (!planId || !coupon.applicablePlans.includes(planId)) {
      return { valid: false, error: 'Cupom não válido para este plano' };
    }
  }

  // Verificar portes aplicáveis
  if (coupon.applicablePortes && coupon.applicablePortes.length > 0) {
    if (!porte || !coupon.applicablePortes.includes(porte)) {
      return { valid: false, error: 'Cupom não válido para este porte' };
    }
  }

  return { valid: true };
}

/**
 * Gera um token único para o cupom
 */
export function generateCouponToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removido I, O, 0, 1 para evitar confusão
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
