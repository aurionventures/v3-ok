// @ts-nocheck
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";
// Valida o código de acesso e gera JWT
// Inicia servidor com CORS support
// Servidor com CORS robusto
Deno.serve(async (req)=>{
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
    const { email, code } = await req.json();
    if (!email || !code) {
      return new Response(JSON.stringify({
        error: "Email e código são obrigatórios"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...securityHeaders
        }
      });
    }
    const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
    // Busca e valida o code
    const { data: accessCode } = await supabase.from("access_codes").select("id, expires_at, used_at, created_by_partner").eq("email", email).eq("code", code).gt("expires_at", new Date().toISOString()).is("used_at", null).single();
    if (!accessCode) {
      return new Response(JSON.stringify({
        error: "Código inválido ou expirado"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...securityHeaders
        }
      });
    }

    // Marca como usado
    await supabase.from("access_codes").update({
      used_at: new Date().toISOString()
    }).eq("id", accessCode.id);
    
    // ✅ Obtém ou cria usuário automaticamente
    let { data: user } = await supabase
      .from("users")
      .select("id, email, role, name")
      .eq("email", email)
      .single();
      
    if (!user) {
      // Determina o role baseado no tipo de convite
      const userRole = accessCode.created_by_partner ? 'cliente' : 'parceiro';
      
      // Cria usuário automaticamente com role correto
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({ email, role: userRole })
        .select("id, email, role, name")
        .single();
        
      if (createError) {
        console.error("Erro ao criar usuário:", createError);
        return new Response(
          JSON.stringify({ error: "Erro interno ao criar usuário" }),
          { status: 500, headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" } }
        );
      }
      
      user = newUser;
    }
    // JWT_SECRET deve estar definido
    const jwtSecretKey = Deno.env.get("JWT_SECRET");
    if (!jwtSecretKey) throw new Error("JWT_SECRET não configurado");
    // Importa chave HMAC-SHA256
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(jwtSecretKey), {
      name: "HMAC",
      hash: "SHA-256"
    }, false, [
      "sign"
    ]);
    // Header e payload
    const header = {
      alg: "HS256",
      typ: "JWT"
    };
    const now = new Date();
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      company: user.name, // Nome da empresa
      created_by_partner: user.created_by_partner, // ID do parceiro se aplicável
      iat: getNumericDate(now),
      exp: getNumericDate(new Date(now.getTime() + 15 * 60 * 1000))
    };
    // Gera JWT assinado
    const jwt = await create(header, payload, key);
    // Cria sessão armazenando token
    await supabase.from("sessions").insert({
      user_id: user.id,
      token: jwt,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    });
    // No sucesso, retorna user com empresa e seta cookie seguro com token
    return new Response(JSON.stringify({
      user: {
        ...user,
        company: user.name // Inclui a empresa (que está no campo name)
      }
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        ...securityHeaders,
        "Content-Type": "application/json",
        "Set-Cookie": `auth_token=${jwt}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${15 * 60}`
      }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({
      error: err.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        ...securityHeaders,
        "Content-Type": "application/json"
      }
    });
  }
}); /* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/validate-code' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/ 
