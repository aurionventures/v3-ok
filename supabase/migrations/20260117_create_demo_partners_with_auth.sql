-- Migration: Criar Parceiros de Demonstração com Autenticação
-- Descrição: Cria 3 parceiros (2 de exemplo + 1 para demo) com usuários em auth.users
-- Data: 2026-01-17
-- 
-- IMPORTANTE: Esta migration requer permissões de Service Role
-- Execute via Supabase Dashboard SQL Editor com Service Role Key

-- =============================================================================
-- PARCEIRO 1: 15% sobre serviço, 15% sobre SaaS (12 meses)
-- PARCEIRO 2: 15% sobre serviço, 5% sobre SaaS (12 meses)  
-- PARCEIRO 3 (Demo): parceiro@legacy.com | senha: 123456
-- =============================================================================

DO $$
DECLARE
  v_partner1_id UUID;
  v_partner2_id UUID;
  v_partner3_id UUID;
  v_partner1_email TEXT := 'parceiro1.demo@legacyos.com.br';
  v_partner2_email TEXT := 'parceiro2.demo@legacyos.com.br';
  v_partner3_email TEXT := 'parceiro@legacy.com';
  v_partner1_password TEXT := 'DemoPartner1!123';
  v_partner2_password TEXT := 'DemoPartner2!123';
  v_partner3_password TEXT := '123456';
BEGIN
  -- =============================================================================
  -- PARCEIRO 1: Consultoria Premium
  -- =============================================================================
  
  -- Verificar se já existe
  SELECT id INTO v_partner1_id FROM auth.users WHERE email = v_partner1_email LIMIT 1;
  
  IF v_partner1_id IS NULL THEN
    -- Criar usuário em auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000'::uuid,
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      v_partner1_email,
      crypt(v_partner1_password, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"João Silva","company":"Parceiro Consultoria Premium","role":"parceiro"}'::jsonb,
      NOW(),
      NOW(),
      '',
      ''
    )
    RETURNING id INTO v_partner1_id;
    
    RAISE NOTICE '✅ Parceiro 1 criado: %', v_partner1_id;
  ELSE
    RAISE NOTICE 'ℹ️ Parceiro 1 já existe: %', v_partner1_id;
  END IF;

  -- Criar/atualizar em public.users
  INSERT INTO public.users (id, email, name, company, phone)
  VALUES (
    v_partner1_id,
    v_partner1_email,
    'João Silva',
    'Parceiro Consultoria Premium',
    '(11) 99999-9999'
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    company = EXCLUDED.company,
    phone = EXCLUDED.phone,
    updated_at = NOW();

  -- Adicionar role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_partner1_id, 'parceiro')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Criar partner_settings
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
  VALUES (
    v_partner1_id,
    'Parceiro Consultoria Premium',
    '12.345.678/0001-90',
    'consultoria',
    '(11) 99999-9999',
    '#3B82F6',
    '#1E40AF',
    15.00,
    15.00, -- 15% sobre serviços
    15.00, -- 15% sobre SaaS
    12,    -- 12 meses
    COALESCE(
      (SELECT affiliate_token FROM public.partner_settings WHERE user_id = v_partner1_id),
      generate_affiliate_token()
    ),
    'active'
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    company_name = EXCLUDED.company_name,
    commission_service = EXCLUDED.commission_service,
    commission_recurring = EXCLUDED.commission_recurring,
    recurring_commission_months = EXCLUDED.recurring_commission_months,
    status = EXCLUDED.status,
    affiliate_token = COALESCE(
      partner_settings.affiliate_token,
      EXCLUDED.affiliate_token
    ),
    updated_at = NOW();

  -- =============================================================================
  -- PARCEIRO 2: Consultoria Standard
  -- =============================================================================
  
  SELECT id INTO v_partner2_id FROM auth.users WHERE email = v_partner2_email LIMIT 1;
  
  IF v_partner2_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000'::uuid,
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      v_partner2_email,
      crypt(v_partner2_password, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Maria Santos","company":"Parceiro Consultoria Standard","role":"parceiro"}'::jsonb,
      NOW(),
      NOW(),
      '',
      ''
    )
    RETURNING id INTO v_partner2_id;
    
    RAISE NOTICE '✅ Parceiro 2 criado: %', v_partner2_id;
  ELSE
    RAISE NOTICE 'ℹ️ Parceiro 2 já existe: %', v_partner2_id;
  END IF;

  INSERT INTO public.users (id, email, name, company, phone)
  VALUES (
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

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_partner2_id, 'parceiro')
  ON CONFLICT (user_id, role) DO NOTHING;

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
  VALUES (
    v_partner2_id,
    'Parceiro Consultoria Standard',
    '98.765.432/0001-10',
    'consultoria',
    '(11) 88888-8888',
    '#10B981',
    '#059669',
    10.00,
    15.00, -- 15% sobre serviços
    5.00,  -- 5% sobre SaaS
    12,    -- 12 meses
    COALESCE(
      (SELECT affiliate_token FROM public.partner_settings WHERE user_id = v_partner2_id),
      generate_affiliate_token()
    ),
    'active'
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    company_name = EXCLUDED.company_name,
    commission_service = EXCLUDED.commission_service,
    commission_recurring = EXCLUDED.commission_recurring,
    recurring_commission_months = EXCLUDED.recurring_commission_months,
    status = EXCLUDED.status,
    affiliate_token = COALESCE(
      partner_settings.affiliate_token,
      EXCLUDED.affiliate_token
    ),
    updated_at = NOW();

  -- =============================================================================
  -- PARCEIRO 3: Demo (parceiro@legacy.com)
  -- =============================================================================
  
  SELECT id INTO v_partner3_id FROM auth.users WHERE email = v_partner3_email LIMIT 1;
  
  IF v_partner3_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000'::uuid,
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      v_partner3_email,
      crypt(v_partner3_password, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Parceiro Demo","company":"Parceiro Demo Legacy","role":"parceiro"}'::jsonb,
      NOW(),
      NOW(),
      '',
      ''
    )
    RETURNING id INTO v_partner3_id;
    
    RAISE NOTICE '✅ Parceiro 3 (Demo) criado: %', v_partner3_id;
  ELSE
    RAISE NOTICE 'ℹ️ Parceiro 3 já existe: %', v_partner3_id;
    -- Atualizar senha se já existir
    UPDATE auth.users
    SET encrypted_password = crypt(v_partner3_password, gen_salt('bf'))
    WHERE id = v_partner3_id;
    RAISE NOTICE '🔑 Senha atualizada para parceiro@legacy.com';
  END IF;

  INSERT INTO public.users (id, email, name, company, phone)
  VALUES (
    v_partner3_id,
    v_partner3_email,
    'Parceiro Demo',
    'Parceiro Demo Legacy',
    '(11) 77777-7777'
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    company = EXCLUDED.company,
    phone = EXCLUDED.phone,
    updated_at = NOW();

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_partner3_id, 'parceiro')
  ON CONFLICT (user_id, role) DO NOTHING;

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
  VALUES (
    v_partner3_id,
    'Parceiro Demo Legacy',
    '11.222.333/0001-44',
    'afiliado',
    '(11) 77777-7777',
    '#8B5CF6',
    '#7C3AED',
    12.00,
    15.00, -- 15% sobre serviços
    10.00, -- 10% sobre SaaS
    12,    -- 12 meses
    COALESCE(
      (SELECT affiliate_token FROM public.partner_settings WHERE user_id = v_partner3_id),
      generate_affiliate_token()
    ),
    'active'
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    company_name = EXCLUDED.company_name,
    commission_service = EXCLUDED.commission_service,
    commission_recurring = EXCLUDED.commission_recurring,
    recurring_commission_months = EXCLUDED.recurring_commission_months,
    status = EXCLUDED.status,
    affiliate_token = COALESCE(
      partner_settings.affiliate_token,
      EXCLUDED.affiliate_token
    ),
    updated_at = NOW();

  RAISE NOTICE '';
  RAISE NOTICE '✨ ========================================';
  RAISE NOTICE '✅ PARCEIROS CRIADOS COM SUCESSO!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Parceiro 1 (Premium):';
  RAISE NOTICE '   Email: %', v_partner1_email;
  RAISE NOTICE '   Senha: %', v_partner1_password;
  RAISE NOTICE '   Comissões: 15%% serviço, 15%% SaaS (12 meses)';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Parceiro 2 (Standard):';
  RAISE NOTICE '   Email: %', v_partner2_email;
  RAISE NOTICE '   Senha: %', v_partner2_password;
  RAISE NOTICE '   Comissões: 15%% serviço, 5%% SaaS (12 meses)';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Parceiro 3 (Demo):';
  RAISE NOTICE '   Email: %', v_partner3_email;
  RAISE NOTICE '   Senha: %', v_partner3_password;
  RAISE NOTICE '   Comissões: 15%% serviço, 10%% SaaS (12 meses)';
  RAISE NOTICE '';
  RAISE NOTICE '🔗 Acesse /afiliado após fazer login como parceiro';
  RAISE NOTICE '========================================';

END $$;

-- =============================================================================
-- VERIFICAÇÃO
-- =============================================================================

-- Execute esta query para verificar os parceiros criados:
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
WHERE u.email IN (
  'parceiro1.demo@legacyos.com.br', 
  'parceiro2.demo@legacyos.com.br',
  'parceiro@legacy.com'
)
ORDER BY u.email;
*/
