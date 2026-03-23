/**
 * Excluir Membro Definitivo – remove membro do banco, alocações (CASCADE) e usuário Auth.
 * Rota: POST /functions/v1/excluir-membro-definitivo
 * Body: { membro_id }
 * Retorna: { ok: true } ou { error }
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
    const membro_id = (body.membro_id ?? "").trim();

    if (!membro_id) {
      return new Response(
        JSON.stringify({ error: "membro_id é obrigatório" }),
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

    const { data: membro, error: fetchErr } = await supabase
      .from("membros_governanca")
      .select("id, user_id")
      .eq("id", membro_id)
      .maybeSingle();

    if (fetchErr || !membro) {
      return new Response(
        JSON.stringify({ error: "Membro não encontrado" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = membro?.user_id;
    if (userId) {
      const { error: authErr } = await supabase.auth.admin.deleteUser(userId);
      if (authErr) {
        console.warn("[excluir-membro-definitivo] auth.deleteUser:", authErr);
      }
    }

    const { error: deleteErr } = await supabase
      .from("membros_governanca")
      .delete()
      .eq("id", membro_id);

    if (deleteErr) {
      console.error("[excluir-membro-definitivo] delete:", deleteErr);
      return new Response(
        JSON.stringify({ error: deleteErr.message ?? "Erro ao excluir membro" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[excluir-membro-definitivo]", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
