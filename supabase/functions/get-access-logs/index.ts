/**
 * get-access-logs – retorna logs de acesso da plataforma.
 * POST /functions/v1/get-access-logs
 * Body: { limite?: number; offset?: number }
 * Requer JWT de super_admin ou empresa_adm.
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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Não autorizado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    const token = authHeader.slice(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Token inválido" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const email = user.email ?? "";
    const isSuperAdmin = email === "admin@legacy.com";
    const { data: perfis } = await supabase.from("perfis").select("empresa_id").eq("user_id", user.id);
    const isEmpresaAdm = perfis && perfis.length > 0 && perfis.some((p: { empresa_id: string | null }) => p.empresa_id);

    if (!isSuperAdmin && !isEmpresaAdm) {
      return new Response(
        JSON.stringify({ error: "Acesso negado. Apenas admins podem visualizar os logs." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = (await req.json().catch(() => ({}))) as { limite?: number; offset?: number };
    const limite = Math.min(Math.max(Number(body.limite) || 200, 1), 500);
    const offset = Math.max(Number(body.offset) || 0, 0);

    const { data: rows, error } = await supabase
      .from("platform_access_logs")
      .select("id, user_id, email, tipo, empresa_nome, acao, ip, user_agent, created_at")
      .order("created_at", { ascending: false })
      .range(offset, offset + limite - 1);

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const logs = (rows ?? []).map((r: Record<string, unknown>) => {
      const created = r.created_at as string;
      const ts = created ? new Date(created).toISOString().slice(0, 19).replace("T", " ") : "";
      const level = r.acao === "falha_login" ? "warn" : "info";
      const source = String(r.tipo ?? "desconhecido");
      const msg = [r.email, r.acao, r.empresa_nome ? `(${r.empresa_nome})` : ""].filter(Boolean).join(" ");
      return {
        id: r.id,
        timestamp: ts,
        level,
        source,
        message: msg,
        meta: { ip: r.ip, user_agent: r.user_agent },
      };
    });

    return new Response(
      JSON.stringify({ logs, total: logs.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Erro ao obter logs" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
