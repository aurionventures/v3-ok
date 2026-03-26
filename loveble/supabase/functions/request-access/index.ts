// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

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

// Servidor com CORS robusto
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
    'Access-Control-Allow-Origin': isAllowedOrigin ? (origin || '*') : '*',
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
    const { email, companyName } = await req.json();
    if (!email || !companyName)
      return new Response(
        JSON.stringify({ error: "Email e nome da empresa são obrigatórios" }),
        { status: 400, headers: { ...securityHeaders, "Content-Type": "application/json" } },
      );

    // Gera token seguro alfanumérico de 8 caracteres e expiração em 1 hora
    const code = generateSecureToken(8);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // Insere no banco
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // ✅ CRIA ou ATUALIZA usuário empresa
    const { data: existingUser } = await supabaseClient
      .from("users")
      .select("id, email, role, name")
      .eq("email", email)
      .single();

    if (!existingUser) {
      // Cria novo usuário empresa
      const { error: userError } = await supabaseClient
        .from("users")
        .insert({ email, role: 'user', name: companyName });
      
      if (userError) {
        console.error("Erro ao criar usuário empresa:", userError);
        return new Response(
          JSON.stringify({ error: "Erro interno ao criar usuário" }),
          { status: 500, headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      // Atualiza o nome da empresa se o usuário já existe
      const { error: updateError } = await supabaseClient
        .from("users")
        .update({ name: companyName })
        .eq("email", email);
      
      if (updateError) {
        console.error("Erro ao atualizar nome da empresa:", updateError);
        return new Response(
          JSON.stringify({ error: "Erro interno ao atualizar usuário" }),
          { status: 500, headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const { error: dbError } = await supabaseClient
      .from("access_codes")
      .insert({ email, code, expires_at: expiresAt });
    if (dbError) throw dbError;

    // Envia email via Resend
    const resendKey = Deno.env.get("RESEND_API_KEY")!;
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "Legacy <no-reply@legacy.rogermedke.com>",
        to: email,
        subject: "Seu código de acesso",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0433FF;">Olá ${email}!</h2>
            <p>Seu token de acesso ao Legacy é:</p>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="font-family: monospace; letter-spacing: 3px; color: #0433FF; margin: 0;">${code}</h1>
            </div>
            <p><strong>Este token é válido por 1 hora.</strong></p>
            <p>Use este token junto com seu email para acessar o Sistema Legacy.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              Atenciosamente,<br>
              <strong>Equipe Legacy</strong>
            </p>
          </div>
        `
      }),
    });
    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Erro ao enviar email:", errorText);
      return new Response(JSON.stringify({ error: "Falha ao enviar email" }), {
        status: 500,
        headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ status: "OK" }), {
      status: 200,
      headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/request-access' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
