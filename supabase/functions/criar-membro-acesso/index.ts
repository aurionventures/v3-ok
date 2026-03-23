/**
 * Criar Membro com Acesso – cria usuário Auth e registro em membros_governanca.
 * Rota: POST /functions/v1/criar-membro-acesso
 * Body: { email, senha_provisoria, nome, cargo_principal, empresa_id }
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
    const cargo_principal = (body.cargo_principal ?? "").trim() || null;
    const empresa_id = body.empresa_id ?? null;

    if (!email || !senha_provisoria || !nome || !empresa_id) {
      return new Response(
        JSON.stringify({
          error: "Campos obrigatórios: email, senha_provisoria, nome, empresa_id",
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
      user_metadata: { nome, cargo_principal },
    });

    if (authError) {
      console.error("[criar-membro-acesso] auth.createUser:", authError);
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

    const { data: membroData, error: membroError } = await supabase
      .from("membros_governanca")
      .insert({
        empresa_id,
        nome,
        cargo_principal,
        user_id: userId,
        email,
        senha_alterada: false,
      })
      .select("id")
      .single();

    if (membroError) {
      console.error("[criar-membro-acesso] insert membros_governanca:", membroError);
      await supabase.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: membroError.message ?? "Erro ao criar membro" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        membro_id: membroData?.id,
        email,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[criar-membro-acesso]", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
