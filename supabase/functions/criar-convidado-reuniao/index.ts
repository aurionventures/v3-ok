/**
 * Criar Convidado de Reunião – cria usuário Auth e registro em reuniao_convidados.
 * Rota: POST /functions/v1/criar-convidado-reuniao
 * Body: { reuniao_id?, email, senha_provisoria?, senha_valida_ate?, use_magic_link?, redirect_to?, gerar_link_teste? }
 * - use_magic_link: true = gera magic link em vez de senha (senha_provisoria opcional)
 * - redirect_to: URL base do app para redirect do magic link (ex: https://app.exemplo.com)
 * - gerar_link_teste: true = gera apenas o magic link (email + redirect_to), sem reuniao_id nem reuniao_convidados
 */

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

function randomPassword(len = 20): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

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
    const use_magic_link = !!body.use_magic_link;
    const redirect_to = (body.redirect_to ?? "").trim() || undefined;
    const gerar_link_teste = !!body.gerar_link_teste;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Campo obrigatório: email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (gerar_link_teste) {
      if (!use_magic_link) {
        return new Response(
          JSON.stringify({ error: "gerar_link_teste exige use_magic_link" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else if (!reuniao_id || !senha_valida_ate) {
      return new Response(
        JSON.stringify({
          error: "Campos obrigatórios: reuniao_id, email, senha_valida_ate",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const password = use_magic_link ? randomPassword() : senha_provisoria;
    if (!use_magic_link) {
      if (password.length < 6) {
        return new Response(
          JSON.stringify({ error: "A senha deve ter pelo menos 6 caracteres" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
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
      password,
      email_confirm: true,
      user_metadata: { tipo: gerar_link_teste ? "convidado_teste" : "convidado_reuniao", reuniao_id: reuniao_id || null },
    });

    let userId: string | null = authData?.user?.id ?? null;

    if (authError) {
      if (gerar_link_teste && authError.message?.includes("already registered")) {
        const redirectTo = redirect_to ? `${redirect_to.replace(/\/$/, "")}/convidado` : undefined;
        const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
          type: "magiclink",
          email,
          options: redirectTo ? { redirectTo } : undefined,
        });
        const actionLink = linkData?.properties?.action_link ?? linkData?.action_link;
        if (!linkErr && actionLink) {
          return new Response(
            JSON.stringify({ email, magic_link: actionLink }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
      console.error("[criar-convidado-reuniao] auth.createUser:", authError);
      const msg = authError.message?.includes("already registered")
        ? "Este e-mail já está cadastrado. Use senha provisória ou outro e-mail para magic link."
        : authError.message ?? "Erro ao criar usuário de acesso.";
      return new Response(
        JSON.stringify({ error: msg }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Usuário criado mas ID não retornado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userIdStr = userId;

    if (gerar_link_teste) {
      const redirectTo = redirect_to ? `${redirect_to.replace(/\/$/, "")}/convidado` : undefined;
      const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: redirectTo ? { redirectTo } : undefined,
      });
      const actionLink = linkData?.properties?.action_link ?? linkData?.action_link;
      if (linkErr || !actionLink) {
        await supabase.auth.admin.deleteUser(userId);
        return new Response(
          JSON.stringify({ error: linkErr?.message ?? "Erro ao gerar magic link" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ email, magic_link: actionLink }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }


    const { data: convidadoData, error: convidadoError } = await supabase
      .from("reuniao_convidados")
      .insert({
        reuniao_id,
        email,
        user_id: userIdStr,
        senha_valida_ate,
        ativo: true,
      })
      .select("id")
      .single();

    if (convidadoError) {
      console.error("[criar-convidado-reuniao] insert reuniao_convidados:", convidadoError);
      await supabase.auth.admin.deleteUser(userIdStr);
      return new Response(
        JSON.stringify({ error: convidadoError.message ?? "Erro ao criar convidado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload: Record<string, unknown> = { convidado_id: convidadoData?.id, email };

    if (use_magic_link) {
      const redirectTo = redirect_to
        ? `${redirect_to.replace(/\/$/, "")}/convidado`
        : undefined;
      const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: redirectTo ? { redirectTo } : undefined,
      });
      const actionLink = linkData?.properties?.action_link ?? linkData?.action_link;
      if (!linkErr && actionLink) {
        payload.magic_link = actionLink;
      }
    }

    return new Response(
      JSON.stringify(payload),
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
