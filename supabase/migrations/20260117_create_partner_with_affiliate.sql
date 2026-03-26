-- Migration: Função RPC para criar parceiro e gerar link de afiliado
-- Descrição: Cria uma função SQL que pode ser chamada do frontend para criar parceiro e gerar token
-- Data: 2026-01-17

-- Função para atualizar/gerar settings de parceiro e token de afiliado
-- Esta função assume que o usuário já existe em auth.users
CREATE OR REPLACE FUNCTION public.setup_partner_settings(
  p_user_id UUID,
  p_company_name TEXT,
  p_phone TEXT DEFAULT NULL,
  p_cnpj TEXT DEFAULT NULL,
  p_type TEXT DEFAULT 'consultoria',
  p_primary_color TEXT DEFAULT '#3B82F6',
  p_secondary_color TEXT DEFAULT '#1E40AF',
  p_custom_domain TEXT DEFAULT NULL,
  p_commission NUMERIC DEFAULT 15,
  p_commission_service NUMERIC DEFAULT NULL,
  p_commission_recurring NUMERIC DEFAULT NULL,
  p_recurring_commission_months INTEGER DEFAULT 12
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_affiliate_token TEXT;
BEGIN
  -- Garantir role de parceiro
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, 'parceiro')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Criar/atualizar partner_settings com token gerado automaticamente
  INSERT INTO public.partner_settings (
    user_id,
    company_name,
    cnpj,
    partner_type,
    admin_phone,
    primary_color,
    secondary_color,
    custom_domain,
    commission,
    commission_service,
    commission_recurring,
    recurring_commission_months,
    affiliate_token,
    status
  )
  VALUES (
    p_user_id,
    p_company_name,
    p_cnpj,
    p_type,
    p_phone,
    p_primary_color,
    p_secondary_color,
    p_custom_domain,
    p_commission,
    p_commission_service,
    p_commission_recurring,
    p_recurring_commission_months,
    generate_affiliate_token(),
    'active'
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    company_name = EXCLUDED.company_name,
    cnpj = EXCLUDED.cnpj,
    partner_type = EXCLUDED.partner_type,
    admin_phone = EXCLUDED.admin_phone,
    primary_color = EXCLUDED.primary_color,
    secondary_color = EXCLUDED.secondary_color,
    custom_domain = EXCLUDED.custom_domain,
    commission = EXCLUDED.commission,
    commission_service = EXCLUDED.commission_service,
    commission_recurring = EXCLUDED.commission_recurring,
    recurring_commission_months = EXCLUDED.recurring_commission_months,
    status = EXCLUDED.status,
    affiliate_token = COALESCE(partner_settings.affiliate_token, generate_affiliate_token()),
    updated_at = NOW();

  -- Buscar o token gerado
  SELECT affiliate_token INTO v_affiliate_token
  FROM public.partner_settings
  WHERE user_id = p_user_id;

  -- Se ainda não tiver token, gerar um
  IF v_affiliate_token IS NULL THEN
    v_affiliate_token := generate_affiliate_token();
    UPDATE public.partner_settings
    SET affiliate_token = v_affiliate_token
    WHERE user_id = p_user_id;
  END IF;

  -- Retornar resultado
  RETURN json_build_object(
    'success', true,
    'userId', p_user_id,
    'affiliateToken', v_affiliate_token,
    'message', 'Configurações de parceiro criadas com sucesso'
  );

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;

-- Comentário
COMMENT ON FUNCTION public.setup_partner_settings IS 'Cria ou atualiza configurações de parceiro e gera token de afiliado automaticamente. Retorna JSON com userId e affiliateToken.';
