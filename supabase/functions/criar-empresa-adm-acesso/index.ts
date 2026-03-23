/**
 * Criar ADM de Empresa com Acesso – cria usuário Auth e registro em perfis (role empresa_adm).
 * No primeiro acesso o ADM deverá alterar a senha.
 * Rota: POST /functions/v1/criar-empresa-adm-acesso
 * Body: { email, senha_provisoria, nome, empresa_id }
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

    let userId: string;

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: senha_provisoria,
      email_confirm: true,
      user_metadata: { nome },
    });

    const isEmailAlreadyRegistered =
      authError?.message?.includes("already been registered") ||
      authError?.message?.includes("already registered") ||
      authError?.message?.toLowerCase().includes("duplicate");
    if (isEmailAlreadyRegistered) {
      // E-mail já existe: buscar user_id em perfis ou em auth
      let existingUserId: string | null = null;
      const { data: perfilByEmail } = await supabase
        .from("perfis")
        .select("user_id")
        .eq("email", email)
        .limit(1)
        .maybeSingle();
      existingUserId = perfilByEmail?.user_id ?? null;
      if (!existingUserId) {
        const { data: usersData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
        const u = usersData?.users?.find((x) => x.email?.toLowerCase() === email);
        existingUserId = u?.id ?? null;
      }
      if (!existingUserId) {
        return new Response(
          JSON.stringify({ error: "E-mail já cadastrado, mas não foi possível vincular à empresa." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      userId = existingUserId;

      // Verificar se já existe perfil para este user+empresa
      const { data: perfilExistente } = await supabase
        .from("perfis")
        .select("id")
        .eq("user_id", userId)
        .eq("empresa_id", empresa_id)
        .maybeSingle();

      if (perfilExistente) {
        return new Response(
          JSON.stringify({ perfil_id: perfilExistente.id, email }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Criar novo perfil vinculando usuário existente à nova empresa
      const { data: perfilData, error: perfilError } = await supabase
        .from("perfis")
        .insert({
          user_id: userId,
          empresa_id,
          nome,
          email,
          role: "empresa_adm",
          senha_alterada: true,
        })
        .select("id")
        .single();

      if (perfilError) {
        console.error("[criar-empresa-adm-acesso] insert perfis (existing user):", perfilError);
        return new Response(
          JSON.stringify({ error: perfilError.message ?? "Erro ao vincular ADM à empresa" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ perfil_id: perfilData?.id, email }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (authError) {
      console.error("[criar-empresa-adm-acesso] auth.createUser:", authError);
      const msg = authError.message?.includes("already registered")
        ? "Este e-mail já está cadastrado."
        : authError.message ?? "Erro ao criar usuário de acesso.";
      return new Response(
        JSON.stringify({ error: msg }),
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

    const { data: perfilData, error: perfilError } = await supabase
      .from("perfis")
      .insert({
        user_id: userId,
        empresa_id,
        nome,
        email,
        role: "empresa_adm",
        senha_alterada: false,
      })
      .select("id")
      .single();

    if (perfilError) {
      console.error("[criar-empresa-adm-acesso] insert perfis:", perfilError);
      await supabase.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: perfilError.message ?? "Erro ao criar perfil ADM" }),
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
    console.error("[criar-empresa-adm-acesso]", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
