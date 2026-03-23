/**
 * Seed Admin – cria usuário admin@legacy.com | 123 para login de Super ADM.
 * Invocar uma vez: POST /functions/v1/seed-admin
 * Deve ter verify_jwt: false para poder ser invocado sem autenticação.
 */

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const EMAIL = "admin@legacy.com";
const SENHA = "123";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método não permitido" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Configuração do servidor incompleta" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 500 });
    const usuarioExistente = listData?.users?.find((u) => u.email === EMAIL);

    let userId: string;

    if (usuarioExistente) {
      userId = usuarioExistente.id;
      await supabase.auth.admin.updateUserById(userId, {
        password: SENHA,
        email_confirm: true,
      });
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: EMAIL,
        password: SENHA,
        email_confirm: true,
        user_metadata: { nome: "Administrador Legacy OS" },
      });
      if (authError) {
        return new Response(
          JSON.stringify({ error: authError.message ?? "Erro ao criar usuário" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      userId = authData?.user?.id ?? "";
    }

    return new Response(
      JSON.stringify({
        ok: true,
        message: `Admin configurado. Use ${EMAIL} | ${SENHA} para login Admin.`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[seed-admin]", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
