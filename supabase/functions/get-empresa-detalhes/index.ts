/**
 * Retorna dados completos da empresa + ADM (para Super ADM visualizar/editar).
 * Rota: POST /functions/v1/get-empresa-detalhes
 * Body: { empresa_id }
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
    const body = await req.json().catch(() => ({}));
    const empresa_id = (body.empresa_id ?? "").trim();

    if (!empresa_id) {
      return new Response(
        JSON.stringify({ error: "empresa_id é obrigatório" }),
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

    const { data: empresa, error: errEmpresa } = await supabase
      .from("empresas")
      .select("id, nome, razao_social, cnpj, ativo")
      .eq("id", empresa_id)
      .maybeSingle();

    if (errEmpresa || !empresa) {
      return new Response(
        JSON.stringify({ error: "Empresa não encontrada" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: admPerfil } = await supabase
      .from("perfis")
      .select("id, user_id, nome, email, senha_alterada")
      .eq("empresa_id", empresa_id)
      .eq("role", "empresa_adm")
      .maybeSingle();

    let admEmail: string | null = null;
    let adm: { user_id: string; nome: string | null; email: string | null; senha_alterada: boolean } | null = null;

    if (admPerfil) {
      admEmail = admPerfil.email ?? null;
      if (!admEmail && admPerfil.user_id) {
        const { data: userData } = await supabase.auth.admin.getUserById(admPerfil.user_id);
        admEmail = userData?.user?.email ?? null;
      }
      adm = {
        user_id: admPerfil.user_id ?? "",
        nome: admPerfil.nome ?? null,
        email: admEmail,
        senha_alterada: admPerfil.senha_alterada ?? true,
      };
    }

    return new Response(
      JSON.stringify({
        empresa: {
          id: empresa.id,
          nome: empresa.nome,
          razao_social: empresa.razao_social,
          cnpj: empresa.cnpj,
          ativo: empresa.ativo,
        },
        adm,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[get-empresa-detalhes]", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
