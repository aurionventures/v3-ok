/**
 * Seed ADM Empresa Demo – cria usuário empresa@legacy.com | 123456 como ADM da Empresa Demo.
 * Invocar uma vez após deploy: POST /functions/v1/seed-empresa-adm-demo
 */

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const EMAIL = "empresa@legacy.com";
const SENHA = "123456";

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

    const { data: empresas } = await supabase
      .from("empresas")
      .select("id, nome")
      .eq("nome", "Empresa Demo")
      .limit(1);

    const empresa = empresas?.[0];
    if (!empresa) {
      return new Response(
        JSON.stringify({
          error: "Empresa Demo não encontrada. Execute primeiro a migration seed_empresa_demo.",
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 500 });
    const usuarioExistente = listData?.users?.find((u) => u.email === EMAIL);

    let userId: string;

    if (usuarioExistente) {
      userId = usuarioExistente.id;
      const { error: updateErr } = await supabase.auth.admin.updateUserById(userId, {
        password: SENHA,
        email_confirm: true,
      });
      if (updateErr) {
        console.warn("[seed-empresa-adm-demo] updateUser password:", updateErr);
      }
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: EMAIL,
        password: SENHA,
        email_confirm: true,
        user_metadata: { nome: "Empresa Demo ADM" },
      });
      if (authError) {
        console.error("[seed-empresa-adm-demo] createUser:", authError);
        return new Response(
          JSON.stringify({ error: authError.message ?? "Erro ao criar usuário" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      userId = authData?.user?.id ?? "";
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Usuário criado mas ID não retornado" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const { data: perfilExistente } = await supabase
      .from("perfis")
      .select("id")
      .eq("user_id", userId)
      .eq("empresa_id", empresa.id)
      .eq("role", "empresa_adm")
      .maybeSingle();

    if (!perfilExistente) {
      const { error: perfilError } = await supabase.from("perfis").insert({
        user_id: userId,
        empresa_id: empresa.id,
        nome: "Empresa Demo ADM",
        email: EMAIL,
        role: "empresa_adm",
        senha_alterada: false,
      });

      if (perfilError) {
        console.error("[seed-empresa-adm-demo] insert perfis:", perfilError);
        return new Response(
          JSON.stringify({ error: perfilError.message ?? "Erro ao criar perfil" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        message: `ADM Empresa Demo configurado. Use ${EMAIL} | ${SENHA} para login Cliente.`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[seed-empresa-adm-demo]", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
