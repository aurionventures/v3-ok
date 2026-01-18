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

    // Verificar se o usuário é admin
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
        JSON.stringify({ error: 'Acesso negado. Apenas Super ADM pode gerar convites' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { invitation_level, expires_in_days = 30 } = await req.json();

    if (!invitation_level || !['afiliado_basico', 'afiliado_avancado', 'parceiro'].includes(invitation_level)) {
      return new Response(
        JSON.stringify({ error: 'Nível de convite inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Gerar token único usando função SQL
    const { data: tokenData, error: tokenError } = await supabase.rpc('generate_partner_invitation_token');
    
    let invitationToken: string;
    if (tokenError || !tokenData) {
      // Fallback: gerar token manualmente
      invitationToken = `inv_part_${Date.now()}_${Math.random().toString(36).substring(2, 18).toUpperCase()}`;
    } else {
      invitationToken = tokenData;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expires_in_days);

    const { data: invitation, error: insertError } = await supabase
      .from('partner_invitations')
      .insert({
        invitation_token: invitationToken,
        invitation_level,
        expires_at: expiresAt.toISOString(),
        created_by: user.id,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Erro ao criar convite:', insertError);
      return new Response(
        JSON.stringify({ error: 'Erro ao criar convite: ' + insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const baseUrl = req.headers.get('origin') || Deno.env.get('PUBLIC_SITE_URL') || 'https://legacy.rogermedke.com';
    const invitationUrl = `${baseUrl}/parceiros/cadastro?token=${invitation.invitation_token}`;

    return new Response(
      JSON.stringify({
        success: true,
        invitation: {
          id: invitation.id,
          token: invitation.invitation_token,
          url: invitationUrl,
          level: invitation_level,
          expires_at: invitation.expires_at,
          status: invitation.status
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Erro ao gerar convite:', err);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: err.message || 'Erro interno ao gerar convite'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
