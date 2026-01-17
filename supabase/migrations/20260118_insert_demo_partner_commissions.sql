-- Migration: Inserir comissões de demonstração para parceiros
-- Descrição: Cria comissões mockadas para o parceiro demo para demonstração completa
-- Data: 2026-01-18

-- =============================================================================
-- COMISSÕES PARA PARCEIRO DEMO (parceiro@legacy.com)
-- =============================================================================

-- Inserir comissões de demonstração para o parceiro demo
-- (Assumindo que o parceiro já foi criado via Edge Function ou script)
INSERT INTO public.partner_commissions (
  partner_id,
  affiliate_token,
  plan_name,
  plan_value,
  billing_cycle,
  billing_term,
  commission_rate,
  commission_amount,
  status,
  sale_date,
  payment_date,
  notes
)
SELECT 
  ps.user_id as partner_id,
  ps.affiliate_token,
  'Legacy 360' as plan_name,
  1500.00 as plan_value,
  'monthly' as billing_cycle,
  12 as billing_term,
  10.00 as commission_rate,
  150.00 as commission_amount,
  'confirmed' as status,
  (NOW() - INTERVAL '5 days')::timestamptz as sale_date,
  (NOW() - INTERVAL '5 days')::timestamptz as payment_date,
  'Comissão de demonstração - Venda Legacy 360' as notes
FROM public.partner_settings ps
JOIN public.users u ON u.id = ps.user_id
WHERE u.email = 'parceiro@legacy.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.partner_commissions pc 
    WHERE pc.partner_id = ps.user_id 
    AND pc.plan_name = 'Legacy 360'
    AND pc.sale_date::date = (NOW() - INTERVAL '5 days')::date
  )
ON CONFLICT DO NOTHING;

INSERT INTO public.partner_commissions (
  partner_id,
  affiliate_token,
  plan_name,
  plan_value,
  billing_cycle,
  billing_term,
  commission_rate,
  commission_amount,
  status,
  sale_date,
  payment_date,
  commission_paid_date,
  notes
)
SELECT 
  ps.user_id as partner_id,
  ps.affiliate_token,
  'Legacy 720' as plan_name,
  2500.00 as plan_value,
  'monthly' as billing_cycle,
  12 as billing_term,
  10.00 as commission_rate,
  250.00 as commission_amount,
  'paid' as status,
  (NOW() - INTERVAL '30 days')::timestamptz as sale_date,
  (NOW() - INTERVAL '30 days')::timestamptz as payment_date,
  (NOW() - INTERVAL '25 days')::timestamptz as commission_paid_date,
  'Comissão de demonstração - Venda Legacy 720 (Já paga)' as notes
FROM public.partner_settings ps
JOIN public.users u ON u.id = ps.user_id
WHERE u.email = 'parceiro@legacy.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.partner_commissions pc 
    WHERE pc.partner_id = ps.user_id 
    AND pc.plan_name = 'Legacy 720'
    AND pc.sale_date::date = (NOW() - INTERVAL '30 days')::date
  )
ON CONFLICT DO NOTHING;
