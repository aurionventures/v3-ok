// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { id } = await req.json();
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Deletar usuário usando service role key (bypass RLS)
    const { data, error } = await supabaseClient
      .from("users")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error("Erro ao deletar parceiro:", error);
      return new Response(
        JSON.stringify({ error: "Erro interno ao deletar parceiro" }),
        { status: 500, headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" } }
      );
    }

    if (data && data.length > 0) {
      console.log("Parceiro deletado com sucesso:", data[0]);
      return new Response(
        JSON.stringify({ 
          success: true, 
          deletedUser: data[0],
          message: "Parceiro deletado com sucesso" 
        }),
        { status: 200, headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Parceiro não encontrado" }),
        { status: 404, headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (err) {
    console.error("Erro na Edge Function delete-partner:", err);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { ...corsHeaders, ...securityHeaders, "Content-Type": "application/json" } }
    );
  }
});
