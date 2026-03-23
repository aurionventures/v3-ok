/**
 * log-access – registra um evento de acesso (login/logout/falha).
 * POST /functions/v1/log-access
 * Body: { email, tipo, empresa_nome?, acao?, ip?, user_agent? }
 * Pode ser chamado sem JWT (após login ou em falha).
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as {
      user_id?: string;
      email?: string;
      tipo?: string;
      empresa_id?: string;
      empresa_nome?: string;
      acao?: string;
      ip?: string;
      user_agent?: string;
    };

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const tipo = ["super_admin", "empresa_adm", "membro", "convidado"].includes(String(body.tipo))
      ? body.tipo
      : "desconhecido";
    const acao = ["login", "logout", "falha_login"].includes(String(body.acao)) ? body.acao : "login";

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Configuração incompleta" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { error } = await supabase.from("platform_access_logs").insert({
      user_id: body.user_id || null,
      email: email || null,
      tipo,
      empresa_id: body.empresa_id || null,
      empresa_nome: body.empresa_nome || null,
      acao,
      ip: body.ip || null,
      user_agent: body.user_agent || null,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Erro ao registrar log" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
