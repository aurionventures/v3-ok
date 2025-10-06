// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Geração de token seguro alfanumérico
function generateSecureToken(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

Deno.serve(async (req) => {
  // CORS mais restritivo e seguro
  const allowedOrigins = [
    'https://legacy.rogermedke.com',
    'https://www.legacy.rogermedke.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'https://governancalegacy.com',
    'https://governancalegacy.com/login',
    'http://localhost:8080',
    'http://localhost:8080/login',
  ];
  
  const origin = req.headers.get('Origin');
  const isAllowedOrigin = allowedOrigins.includes(origin || '');
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, x-client-info, apikey',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // Cache preflight por 24h
  };

  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  
  // Rejeitar requisições de origens não autorizadas
  if (!isAllowedOrigin) {
    return new Response(JSON.stringify({
      error: "Origin não autorizada"
    }), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
        ...securityHeaders
      }
    });
  }

  try {
    const { email, companyName, sector, phone, partnerId } = await req.json();
    
    if (!email || !companyName || !partnerId) {
      return new Response(
        JSON.stringify({ error: "Email, nome da empresa e ID do parceiro são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verificar se o parceiro existe e é válido
    const { data: partnerData, error: partnerError } = await supabaseClient
      .from("users")
      .select("id, email, name, role")
      .eq("id", partnerId)
      .eq("role", "parceiro")
      .single();

    if (partnerError || !partnerData) {
      return new Response(
        JSON.stringify({ error: "Parceiro não encontrado ou inválido" }),
        { status: 404, headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verificar se já existe usuário com este email
    const { data: existingUser } = await supabaseClient
      .from("users")
      .select("id, email, role, created_by_partner")
      .eq("email", email)
      .single();

    // Se o usuário já existe e foi criado por outro parceiro, bloquear
    if (existingUser && existingUser.created_by_partner && existingUser.created_by_partner !== partnerId) {
      return new Response(
        JSON.stringify({ error: "Este email já está cadastrado" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Se o usuário já existe e foi criado pelo mesmo parceiro, informar
    if (existingUser && existingUser.created_by_partner === partnerId) {
      return new Response(
        JSON.stringify({ error: "Este email já está cadastrado como seu cliente" }),
        { status: 400, headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" } }
      );
    }

    let newClient;

    if (existingUser) {
      // Atualizar usuário existente para ser cliente do parceiro
      const { data: updatedClient, error: updateError } = await supabaseClient
        .from("users")
        .update({
          role: 'cliente',
          name: companyName,
          sector: sector || null,
          created_by_partner: partnerId
        })
        .eq("id", existingUser.id)
        .select("id, email, name, role, sector")
        .single();

      if (updateError) {
        console.error("Erro ao atualizar cliente:", updateError);
        return new Response(
          JSON.stringify({ error: "Erro interno ao atualizar cliente" }),
          { status: 500, headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" } }
        );
      }

      newClient = updatedClient;
    } else {
      // Criar novo usuário cliente atrelado ao parceiro
      const { data: createdClient, error: clientError } = await supabaseClient
        .from("users")
        .insert({
          email,
          role: 'cliente',
          name: companyName,
          sector: sector || null, // Salvar o setor
          created_by_partner: partnerId // Campo para atrelar ao parceiro
        })
        .select("id, email, name, role, sector")
        .single();

      if (clientError) {
        console.error("Erro ao criar cliente:", clientError);
        return new Response(
          JSON.stringify({ error: "Erro interno ao criar cliente" }),
          { status: 500, headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" } }
        );
      }

      newClient = createdClient;
    }

    // Gerar token de acesso
    const code = generateSecureToken(8);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 dias

    const { error: tokenError } = await supabaseClient
      .from("access_codes")
      .insert({
        email,
        code,
        expires_at: expiresAt,
        created_by_partner: partnerId // Token criado pelo parceiro
      });

    if (tokenError) {
      console.error("Erro ao criar token:", tokenError);
      return new Response(
        JSON.stringify({ error: "Erro ao gerar token de acesso" }),
        { status: 500, headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" } }
      );
    }

    // Enviar email de convite
    const resendKey = Deno.env.get("RESEND_API_KEY")!;
    const invitationUrl = `${req.headers.get('origin') || 'http://localhost:5173'}/login?invitation=${encodeURIComponent(btoa(JSON.stringify({
      type: 'cliente',
      email: email,
      companyName: companyName,
      invitedBy: partnerData.name,
      createdByPartner: partnerId,
      createdAt: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
    })))}`;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "Legacy <no-reply@legacy.rogermedke.com>",
        to: email,
        subject: `Convite para ${companyName} - Legacy Governance`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">Bem-vindo à Legacy!</h2>
            <p>Olá! Você foi convidado por <strong>${partnerData.name}</strong> para acessar a plataforma Legacy Governance.</p>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #059669;">
              <h3 style="color: #059669; margin-top: 0;">Dados do Convite:</h3>
              <p><strong>Empresa:</strong> ${companyName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Setor:</strong> ${sector || 'Não informado'}</p>
              <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
            </div>

            <div style="background: #fef3c7; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; border: 2px solid #f59e0b;">
              <h1 style="font-family: monospace; letter-spacing: 3px; color: #f59e0b; margin: 0;">${code}</h1>
              <p style="margin: 10px 0 0 0; font-weight: bold;">Seu código de acesso</p>
            </div>

            <p><strong>Como acessar:</strong></p>
            <ol>
              <li>Clique no botão abaixo ou acesse: <a href="${invitationUrl}">${invitationUrl}</a></li>
              <li>Seu email já estará preenchido automaticamente</li>
              <li>Digite o código de acesso: <strong>${code}</strong></li>
              <li>Complete seu cadastro e comece a usar a plataforma!</li>
            </ol>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${invitationUrl}" style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Acessar Plataforma
              </a>
            </div>

            <p><strong>Este convite é válido por 7 dias.</strong></p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              Convite enviado por <strong>${partnerData.name}</strong><br>
              <strong>Equipe Legacy</strong>
            </p>
          </div>
        `
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Erro ao enviar email:", errorText);
      return new Response(
        JSON.stringify({ error: "Cliente criado, mas falha ao enviar email" }),
        { status: 500, headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        client: newClient,
        invitation: {
          link: invitationUrl,
          code: code,
          expiresAt: expiresAt
        },
        message: "Cliente criado e convite enviado com sucesso"
      }),
      { status: 200, headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Erro na Edge Function create-partner-client:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" } }
    );
  }
});
