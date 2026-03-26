-- Migration: Detalhamento de Comissões por Parceiro
-- Descrição: Adiciona campos para comissão por serviço, recorrência e prazo de mensalidade
-- Data: 2026-01-16

-- =============================================================================
-- ALTERAÇÕES NA TABELA partner_settings
-- =============================================================================

-- Adicionar campos de comissão detalhados
ALTER TABLE public.partner_settings 
ADD COLUMN IF NOT EXISTS commission_service DECIMAL(5, 2) DEFAULT 0; -- Comissão sobre serviços/one-time (%)

ALTER TABLE public.partner_settings 
ADD COLUMN IF NOT EXISTS commission_recurring DECIMAL(5, 2); -- Comissão sobre recorrência (%)

-- Prazo de valor da mensalidade de recorrência (quantos meses considerar)
-- Ex: 12 = comissão sobre 12 meses de mensalidade, 24 = 24 meses, etc.
ALTER TABLE public.partner_settings 
ADD COLUMN IF NOT EXISTS recurring_commission_months INTEGER DEFAULT 12 CHECK (recurring_commission_months > 0);

-- Atualizar commission_recurring para usar o valor de commission se não estiver definido
UPDATE public.partner_settings
SET commission_recurring = commission
WHERE commission_recurring IS NULL;

-- Comentários
COMMENT ON COLUMN public.partner_settings.commission_service IS 'Percentual de comissão sobre vendas de serviços (setup, one-time)';
COMMENT ON COLUMN public.partner_settings.commission_recurring IS 'Percentual de comissão sobre recorrência (mensalidades)';
COMMENT ON COLUMN public.partner_settings.recurring_commission_months IS 'Quantos meses de mensalidade considerar para cálculo de comissão de recorrência';
