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

    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      return new Response(
        JSON.stringify({ error: 'Formato de requisição inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      email,
      name,
      companyName,
      phone,
      cnpj,
      type,
      primaryColor,
      secondaryColor,
      customDomain,
      commission,
      commissionService,
      commissionRecurring,
      recurringCommissionMonths,
    } = requestBody;

    if (!email || !name || !companyName) {
      return new Response(
        JSON.stringify({ error: 'Email, nome e nome da empresa são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se o usuário já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    let userId: string;

    if (existingUser) {
      // Usuário já existe, usar o ID existente
      userId = existingUser.id;
      
      // Atualizar dados do usuário
      await supabase
        .from('users')
        .update({
          name,
          company: companyName,
          phone: phone || null,
        })
        .eq('id', userId);
    } else {
      // Criar novo usuário usando auth.admin
      // Gerar senha temporária aleatória
      const tempPassword = Math.random().toString(36).slice(-12) + 'A1!';
      
      const { data: newAuthUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          name,
          company: companyName,
          role: 'parceiro',
        }
      });

      if (authError) {
        console.error('Erro ao criar usuário auth:', authError);
        return new Response(
          JSON.stringify({ error: 'Erro ao criar usuário: ' + authError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      userId = newAuthUser.user.id;

      // Criar registro na tabela users
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: userId,
          email,
          name,
          company: companyName,
          phone: phone || null,
        }, {
          onConflict: 'id'
        });

      if (userError) {
        console.error('Erro ao criar registro em users:', userError);
        return new Response(
          JSON.stringify({ error: 'Erro ao criar registro: ' + userError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Adicionar role de parceiro
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: 'parceiro',
      }, {
        onConflict: 'user_id,role'
      });

    if (roleError) {
      console.error('Erro ao adicionar role:', roleError);
      // Não falha a operação se a role já existir
    }

    // Criar/atualizar settings de parceiro
    let affiliateToken: string | null = null;
    try {
      const { data: settingsData, error: settingsError } = await supabase
        .from('partner_settings')
        .upsert({
          user_id: userId,
          company_name: companyName,
          cnpj: cnpj || null,
          partner_type: type || 'consultoria',
          admin_phone: phone || null,
          primary_color: primaryColor || '#3B82F6',
          secondary_color: secondaryColor || '#1E40AF',
          custom_domain: customDomain || null,
          commission: commission || 15,
          commission_service: commissionService || null,
          commission_recurring: commissionRecurring || null,
          recurring_commission_months: recurringCommissionMonths || 12,
          status: 'active',
        }, {
          onConflict: 'user_id'
        })
        .select('affiliate_token')
        .single();

      // Se o token não foi gerado automaticamente, gerar manualmente
      affiliateToken = settingsData?.affiliate_token || null;
      if (settingsData && !settingsData.affiliate_token) {
        const token = `aff_${Math.random().toString(36).substring(2, 14).toUpperCase()}`;
        const { data: updatedSettings } = await supabase
          .from('partner_settings')
          .update({ affiliate_token: token })
          .eq('user_id', userId)
          .select('affiliate_token')
          .single();
        affiliateToken = updatedSettings?.affiliate_token || token;
      }

      if (settingsError && !settingsError.message.includes('duplicate')) {
        console.error('Erro ao criar partner_settings:', settingsError);
        // Não falha a operação, apenas loga o erro
      }
    } catch (settingsErr) {
      console.log('Tabela partner_settings pode não existir:', settingsErr);
      // Não falha a operação se a tabela não existir
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId,
        affiliateToken: affiliateToken,
        message: 'Parceiro criado com sucesso'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (err: any) {
    console.error('Erro ao criar parceiro:', err);
    const errorMessage = err.message || 'Erro interno ao criar parceiro';
    console.error('Detalhes do erro:', {
      message: errorMessage,
      stack: err.stack,
      name: err.name,
    });
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
