/**
 * Criar Super Admin – cria usuário Auth e registro em perfis (role super_admin).
 * No primeiro acesso o Super Admin deverá alterar a senha.
 * Rota: POST /functions/v1/criar-super-admin
 * Body: { email, senha_provisoria, nome }
 */

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

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
    const body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();
    const senha_provisoria = body.senha_provisoria ?? "";
    const nome = (body.nome ?? "").trim();

    if (!email || !senha_provisoria || !nome) {
      return new Response(
        JSON.stringify({
          error: "Campos obrigatórios: email, senha_provisoria, nome",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (senha_provisoria.length < 6) {
      return new Response(
        JSON.stringify({ error: "A senha deve ter pelo menos 6 caracteres" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: senha_provisoria,
      email_confirm: true,
      user_metadata: { nome },
    });

    if (authError) {
      console.error("[criar-super-admin] auth.createUser:", authError);
      const msg = authError.message?.includes("already registered")
        ? "Este e-mail já está cadastrado."
        : authError.message ?? "Erro ao criar usuário de acesso.";
      return new Response(
        JSON.stringify({ error: msg }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = authData?.user?.id;
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Usuário criado mas ID não retornado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: perfilData, error: perfilError } = await supabase
      .from("perfis")
      .insert({
        user_id: userId,
        empresa_id: null,
        nome,
        email,
        role: "super_admin",
        senha_alterada: false,
      })
      .select("id")
      .single();

    if (perfilError) {
      console.error("[criar-super-admin] insert perfis:", perfilError);
      await supabase.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: perfilError.message ?? "Erro ao criar perfil Super Admin" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        perfil_id: perfilData?.id,
        email,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[criar-super-admin]", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
