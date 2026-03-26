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

    const { token, form_data } = await req.json();

    if (!token || !form_data) {
      return new Response(
        JSON.stringify({ error: 'Token e dados do formulário são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar convite
    const { data: invitation, error: inviteError } = await supabase
      .from('partner_invitations')
      .select('*')
      .eq('invitation_token', token)
      .single();

    if (inviteError || !invitation) {
      return new Response(
        JSON.stringify({ error: 'Convite inválido ou não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validar status
    if (invitation.status !== 'pending') {
      return new Response(
        JSON.stringify({ 
          error: `Convite já foi ${invitation.status === 'used' ? 'usado' : invitation.status === 'expired' ? 'expirado' : 'processado'}` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validar expiração
    const now = new Date();
    const expiresAt = new Date(invitation.expires_at);
    if (now > expiresAt) {
      // Atualizar status para expired
      await supabase
        .from('partner_invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id);

      return new Response(
        JSON.stringify({ error: 'Convite expirado' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validar email não duplicado (se já existe parceiro com esse email)
    if (form_data.email) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', form_data.email)
        .single();

      if (existingUser) {
        // Verificar se já é parceiro
        const { data: existingPartner } = await supabase
          .from('partner_settings')
          .select('user_id')
          .eq('user_id', existingUser.id)
          .single();

        if (existingPartner) {
          return new Response(
            JSON.stringify({ error: 'Este email já está cadastrado como parceiro' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // Atualizar convite com dados do formulário
    const { error: updateError } = await supabase
      .from('partner_invitations')
      .update({
        status: 'submitted',
        email: form_data.email,
        name: form_data.name,
        company_name: form_data.company_name,
        cnpj: form_data.cnpj,
        phone: form_data.phone,
        partner_type: form_data.partner_type || null,
        form_data: {
          ...form_data,
          partner_type: form_data.partner_type || 'afiliado' // Default
        },
        submitted_at: new Date().toISOString()
      })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Erro ao atualizar convite:', updateError);
      return new Response(
        JSON.stringify({ error: 'Erro ao processar cadastro: ' + updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cadastro enviado com sucesso! Aguardando aprovação do Super ADM.'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Erro ao processar cadastro:', err);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: err.message || 'Erro interno ao processar cadastro'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
