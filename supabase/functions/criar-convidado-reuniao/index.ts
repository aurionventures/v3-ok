/**
 * Criar Convidado de Reunião – cria usuário Auth e registro em reuniao_convidados.
 * Rota: POST /functions/v1/criar-convidado-reuniao
 * Body: { reuniao_id, email, senha_provisoria, senha_valida_ate }
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
    const reuniao_id = (body.reuniao_id ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    const senha_provisoria = body.senha_provisoria ?? "";
    const senha_valida_ate = body.senha_valida_ate ?? "";

    if (!reuniao_id || !email || !senha_provisoria || !senha_valida_ate) {
      return new Response(
        JSON.stringify({
          error: "Campos obrigatórios: reuniao_id, email, senha_provisoria, senha_valida_ate",
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
      user_metadata: { tipo: "convidado_reuniao", reuniao_id },
    });

    if (authError) {
      console.error("[criar-convidado-reuniao] auth.createUser:", authError);
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

    const { data: convidadoData, error: convidadoError } = await supabase
      .from("reuniao_convidados")
      .insert({
        reuniao_id,
        email,
        user_id: userId,
        senha_valida_ate,
        ativo: true,
      })
      .select("id")
      .single();

    if (convidadoError) {
      console.error("[criar-convidado-reuniao] insert reuniao_convidados:", convidadoError);
      await supabase.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: convidadoError.message ?? "Erro ao criar convidado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        convidado_id: convidadoData?.id,
        email,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[criar-convidado-reuniao]", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
