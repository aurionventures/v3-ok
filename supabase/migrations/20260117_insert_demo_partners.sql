-- Migration: Inserir Parceiros de Demonstração
-- Descrição: Cria dois parceiros de exemplo para demonstração do sistema de comissões
-- Data: 2026-01-17

-- =============================================================================
-- PARCEIRO 1: 15% sobre serviço, 15% sobre SaaS (12 meses)
-- PARCEIRO 2: 15% sobre serviço, 5% sobre SaaS (12 meses)
-- =============================================================================

-- Esta migration cria os parceiros diretamente nas tabelas necessárias
-- Para criar os usuários em auth.users, execute os comandos SQL abaixo
-- ou use a Edge Function create-partner

DO $$
DECLARE
  v_partner1_id UUID;
  v_partner2_id UUID;
  v_partner1_email TEXT := 'parceiro1.demo@legacyos.com.br';
  v_partner2_email TEXT := 'parceiro2.demo@legacyos.com.br';
  v_partner1_exists BOOLEAN;
  v_partner2_exists BOOLEAN;
BEGIN
  -- Verificar se os usuários já existem em auth.users
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = v_partner1_email) INTO v_partner1_exists;
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = v_partner2_email) INTO v_partner2_exists;

  IF v_partner1_exists THEN
    SELECT id INTO v_partner1_id FROM auth.users WHERE email = v_partner1_email LIMIT 1;
  ELSE
    -- Criar usuário via auth.users (requer privilégios de admin)
    -- Se não conseguir criar, usar UUID fictício (será criado depois via Edge Function)
    v_partner1_id := gen_random_uuid();
    RAISE NOTICE '⚠️ Parceiro 1 não encontrado em auth.users. UUID gerado: %', v_partner1_id;
    RAISE NOTICE '💡 Crie o usuário via Edge Function create-partner ou SQL Editor do Supabase';
  END IF;

  IF v_partner2_exists THEN
    SELECT id INTO v_partner2_id FROM auth.users WHERE email = v_partner2_email LIMIT 1;
  ELSE
    -- Criar usuário via auth.users (requer privilégios de admin)
    v_partner2_id := gen_random_uuid();
    RAISE NOTICE '⚠️ Parceiro 2 não encontrado em auth.users. UUID gerado: %', v_partner2_id;
    RAISE NOTICE '💡 Crie o usuário via Edge Function create-partner ou SQL Editor do Supabase';
  END IF;

  -- Inserir/atualizar na tabela users (public.users)
  INSERT INTO public.users (id, email, name, company, phone)
  VALUES 
    (
      v_partner1_id,
      v_partner1_email,
      'João Silva',
      'Parceiro Consultoria Premium',
      '(11) 99999-9999'
    ),
    (
      v_partner2_id,
      v_partner2_email,
      'Maria Santos',
      'Parceiro Consultoria Standard',
      '(11) 88888-8888'
    )
  ON CONFLICT (id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    company = EXCLUDED.company,
    phone = EXCLUDED.phone,
    updated_at = NOW();

  -- Adicionar roles de parceiro
  INSERT INTO public.user_roles (user_id, role)
  VALUES 
    (v_partner1_id, 'parceiro'),
    (v_partner2_id, 'parceiro')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Criar/atualizar partner_settings
  INSERT INTO public.partner_settings (
    user_id,
    company_name,
    cnpj,
    partner_type,
    admin_phone,
    primary_color,
    secondary_color,
    commission,
    commission_service,
    commission_recurring,
    recurring_commission_months,
    affiliate_token,
    status
  )
  VALUES 
    -- Parceiro 1: 15% serviço, 15% SaaS (12 meses)
    (
      v_partner1_id,
      'Parceiro Consultoria Premium',
      '12.345.678/0001-90',
      'consultoria',
      '(11) 99999-9999',
      '#3B82F6',
      '#1E40AF',
      15.00, -- commission (padrão)
      15.00, -- commission_service: 15% sobre serviços
      15.00, -- commission_recurring: 15% sobre SaaS
      12,    -- recurring_commission_months: 12 meses
      COALESCE(
        (SELECT affiliate_token FROM public.partner_settings WHERE user_id = v_partner1_id),
        generate_affiliate_token()
      ),
      'active'
    ),
    -- Parceiro 2: 15% serviço, 5% SaaS (12 meses)
    (
      v_partner2_id,
      'Parceiro Consultoria Standard',
      '98.765.432/0001-10',
      'consultoria',
      '(11) 88888-8888',
      '#10B981',
      '#059669',
      10.00, -- commission (padrão - média entre os dois)
      15.00, -- commission_service: 15% sobre serviços
      5.00,  -- commission_recurring: 5% sobre SaaS
      12,    -- recurring_commission_months: 12 meses
      COALESCE(
        (SELECT affiliate_token FROM public.partner_settings WHERE user_id = v_partner2_id),
        generate_affiliate_token()
      ),
      'active'
    )
  ON CONFLICT (user_id)
  DO UPDATE SET
    company_name = EXCLUDED.company_name,
    cnpj = EXCLUDED.cnpj,
    partner_type = EXCLUDED.partner_type,
    admin_phone = EXCLUDED.admin_phone,
    commission = EXCLUDED.commission,
    commission_service = EXCLUDED.commission_service,
    commission_recurring = EXCLUDED.commission_recurring,
    recurring_commission_months = EXCLUDED.recurring_commission_months,
    status = EXCLUDED.status,
    affiliate_token = COALESCE(
      partner_settings.affiliate_token,
      EXCLUDED.affiliate_token
    ),
    updated_at = NOW();

  RAISE NOTICE '✅ Parceiros de demonstração criados/atualizados com sucesso!';
  RAISE NOTICE '📋 Parceiro 1: % | Email: % | Comissões: 15%% serviço, 15%% SaaS (12 meses)', v_partner1_id, v_partner1_email;
  RAISE NOTICE '📋 Parceiro 2: % | Email: % | Comissões: 15%% serviço, 5%% SaaS (12 meses)', v_partner2_id, v_partner2_email;

END $$;

-- =============================================================================
-- VERIFICAÇÃO
-- =============================================================================

-- Execute esta query para verificar se os parceiros foram criados:
/*
SELECT 
  u.id,
  u.email,
  u.name,
  u.company,
  ps.company_name,
  ps.commission_service,
  ps.commission_recurring,
  ps.recurring_commission_months,
  ps.affiliate_token,
  ps.status
FROM public.users u
JOIN public.partner_settings ps ON u.id = ps.user_id
WHERE u.email IN ('parceiro1.demo@legacyos.com.br', 'parceiro2.demo@legacyos.com.br');
*/

-- =============================================================================
-- NOTAS IMPORTANTES
-- =============================================================================

-- 1. Para criar os usuários em auth.users via SQL Editor do Supabase:
--    - Use a Service Role Key (Settings > API > Service Role Key)
--    - Execute os comandos abaixo no SQL Editor

-- 2. Ou use a Edge Function create-partner para criar cada parceiro:
--    - POST /functions/v1/create-partner
--    - Body: { email, name, companyName, type, commissionService, commissionRecurring, recurringCommissionMonths }

-- 3. Os tokens de afiliado são gerados automaticamente pela função generate_affiliate_token()

-- 4. Se os usuários não existirem em auth.users, eles serão criados com UUID fictícios
--    e você precisará criar via Edge Function ou Dashboard depois.
