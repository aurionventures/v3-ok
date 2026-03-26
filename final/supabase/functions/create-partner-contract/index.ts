import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Token de autorização necessário' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar role de admin
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: 'Acesso negado. Apenas Super ADM pode criar contratos' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      partner_user_id,
      partner_invitation_id,
      contract_template_id,
      commission_setup,
      commission_recurring,
      recurring_commission_months,
      start_date,
      duration_months,
      auto_renew
    } = await req.json();

    if (!partner_user_id) {
      return new Response(
        JSON.stringify({ error: 'partner_user_id é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar dados do parceiro
    const { data: partnerData, error: partnerError } = await supabase
      .from('partner_settings')
      .select(`
        *,
        users:user_id (
          id,
          email,
          name,
          company
        )
      `)
      .eq('user_id', partner_user_id)
      .single();

    if (partnerError || !partnerData) {
      return new Response(
        JSON.stringify({ error: 'Parceiro não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar template de contrato
    let templateData: any = null;
    if (contract_template_id) {
      const { data: template } = await supabase
        .from('partner_contract_templates')
        .select('*')
        .eq('id', contract_template_id)
        .single();
      
      templateData = template;
    } else {
      // Buscar template padrão para o nível do parceiro
      const { data: defaultTemplate } = await supabase
        .from('partner_contract_templates')
        .select('*')
        .eq('contract_level', partnerData.partner_type === 'afiliado' ? 'afiliado_basico' : 'parceiro')
        .eq('is_default', true)
        .eq('is_active', true)
        .single();
      
      templateData = defaultTemplate;
    }

    // Gerar número de contrato
    const { data: contractNumber, error: numberError } = await supabase.rpc('generate_partner_contract_number');
    
    if (numberError) {
      // Fallback
      const year = new Date().getFullYear();
      const randomNum = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
      var finalContractNumber = `CONTR-PAR-${year}-${randomNum}`;
    } else {
      var finalContractNumber = contractNumber;
    }

    // Processar template HTML com variáveis
    let contentHtml = templateData?.content_html || '';
    if (contentHtml && templateData) {
      const variables = {
        '{partner_name}': partnerData.users?.name || '',
        '{partner_email}': partnerData.users?.email || '',
        '{company_name}': partnerData.company_name || partnerData.users?.company || '',
        '{cnpj}': partnerData.cnpj || '',
        '{contract_number}': finalContractNumber,
        '{commission_setup}': commission_setup?.toString() || '0',
        '{commission_recurring}': commission_recurring?.toString() || '0',
        '{recurring_commission_months}': recurring_commission_months?.toString() || '12',
        '{start_date}': new Date(start_date || Date.now()).toLocaleDateString('pt-BR'),
        '{duration_months}': duration_months?.toString() || '12',
        '{current_date}': new Date().toLocaleDateString('pt-BR'),
      };

      Object.entries(variables).forEach(([key, value]) => {
        contentHtml = contentHtml.replace(new RegExp(key, 'g'), value);
      });
    }

    // Calcular data de término
    const startDateObj = new Date(start_date || Date.now());
    const endDateObj = new Date(startDateObj);
    endDateObj.setMonth(endDateObj.getMonth() + (duration_months || 12));

    // Gerar token de assinatura
    const signatureToken = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias para assinar

    // Determinar contract_level baseado no partner_type
    const contractLevelMap: Record<string, string> = {
      'afiliado': 'afiliado_basico',
      'consultoria': 'afiliado_avancado',
      'parceiro': 'parceiro'
    };
    const contractLevel = contractLevelMap[partnerData.partner_type] || 'afiliado_basico';

    // Criar contrato
    const { data: contract, error: contractError } = await supabase
      .from('partner_contracts')
      .insert({
        partner_user_id,
        partner_invitation_id,
        contract_number: finalContractNumber,
        contract_type: contractLevel === 'parceiro' ? 'partner_agreement' : 'affiliate_agreement',
        contract_level: contractLevel,
        partner_name: partnerData.users?.name || '',
        partner_email: partnerData.users?.email || '',
        partner_company_name: partnerData.company_name || partnerData.users?.company || '',
        partner_cnpj: partnerData.cnpj || null,
        partner_phone: partnerData.admin_phone || null,
        contract_template_id: templateData?.id || null,
        content_html: contentHtml,
        commission_setup: commission_setup || 0,
        commission_recurring: commission_recurring || 0,
        recurring_commission_months: recurring_commission_months || 12,
        start_date: startDateObj.toISOString().split('T')[0],
        end_date: endDateObj.toISOString().split('T')[0],
        duration_months: duration_months || 12,
        auto_renew: auto_renew || false,
        status: 'pending_signature',
        partner_signature_token: signatureToken,
        partner_signature_token_expires_at: expiresAt.toISOString(),
        created_by: user.id
      })
      .select()
      .single();

    if (contractError) {
      console.error('Erro ao criar contrato:', contractError);
      return new Response(
        JSON.stringify({ error: 'Erro ao criar contrato: ' + contractError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Atualizar invitation se existir
    if (partner_invitation_id) {
      await supabase
        .from('partner_invitations')
        .update({ partner_contract_id: contract.id })
        .eq('id', partner_invitation_id);
    }

    const baseUrl = req.headers.get('origin') || Deno.env.get('PUBLIC_SITE_URL') || 'https://legacy.rogermedke.com';
    const signUrl = `${baseUrl}/parceiros/contrato/assinatura/${contract.partner_signature_token}`;

    return new Response(
      JSON.stringify({
        success: true,
        contract: {
          id: contract.id,
          contract_number: contract.contract_number,
          sign_url: signUrl,
          signature_token: contract.partner_signature_token,
          status: contract.status
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Erro ao criar contrato:', err);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: err.message || 'Erro interno ao criar contrato'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
