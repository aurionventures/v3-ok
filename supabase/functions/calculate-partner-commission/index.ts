import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CalculateCommissionRequest {
  contract_id: string;
  affiliate_token?: string;
  partner_id?: string;
  plan_name: string;
  plan_value: number;
  setup_value?: number;
  billing_term?: number;
  sale_origin?: 'originated' | 'received';
  user_id?: string;
  org_id?: string;
  lead_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Autenticação
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verificar se é admin ou service role
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const requestData: CalculateCommissionRequest = await req.json();
    const {
      contract_id,
      affiliate_token,
      partner_id,
      plan_name,
      plan_value,
      setup_value = 0,
      billing_term = 12,
      sale_origin = 'originated',
      user_id,
      org_id,
      lead_id,
    } = requestData;

    if (!contract_id || !plan_name || !plan_value) {
      throw new Error("Missing required fields: contract_id, plan_name, plan_value");
    }

    // Identificar parceiro (por token ou partner_id)
    let finalPartnerId: string | null = partner_id || null;

    if (!finalPartnerId && affiliate_token) {
      const { data: partnerSettings, error: psError } = await supabaseClient
        .from("partner_settings")
        .select("user_id, partner_tier")
        .eq("affiliate_token", affiliate_token)
        .eq("status", "active")
        .single();

      if (psError) {
        console.error("Erro ao buscar parceiro por token:", psError);
      } else if (partnerSettings) {
        finalPartnerId = partnerSettings.user_id;
      }
    }

    if (!finalPartnerId) {
      throw new Error("Partner not found. Provide affiliate_token or partner_id");
    }

    // Buscar Tier do parceiro
    const { data: partnerSettings, error: partnerError } = await supabaseClient
      .from("partner_settings")
      .select("partner_tier, affiliate_token")
      .eq("user_id", finalPartnerId)
      .single();

    if (partnerError || !partnerSettings) {
      throw new Error("Partner settings not found");
    }

    const partnerTier = partnerSettings.partner_tier || 'tier_3_simple';

    // Chamar função SQL para calcular comissão
    const { data: commissionData, error: calcError } = await supabaseClient
      .rpc("calculate_commission_by_tier", {
        p_partner_tier: partnerTier,
        p_sale_origin: sale_origin,
        p_plan_value: plan_value,
        p_setup_value: setup_value,
        p_billing_term: billing_term,
      });

    if (calcError || !commissionData || commissionData.length === 0) {
      throw new Error(`Erro ao calcular comissão: ${calcError?.message || 'Sem dados retornados'}`);
    }

    const {
      setup_commission,
      recurring_commission,
      total_commission,
      recurring_months,
    } = commissionData[0];

    // Criar registro de comissão
    const { data: commission, error: commissionError } = await supabaseClient
      .from("partner_commissions")
      .insert({
        partner_id: finalPartnerId,
        affiliate_token: partnerSettings.affiliate_token || affiliate_token,
        lead_id: lead_id || null,
        user_id: user_id || null,
        org_id: org_id || null,
        plan_name,
        plan_value,
        billing_term,
        billing_cycle: "monthly",
        commission_rate: total_commission > 0 
          ? (total_commission / plan_value) * 100 
          : 0,
        commission_amount: total_commission,
        partner_tier: partnerTier,
        sale_origin: sale_origin,
        setup_value: setup_value,
        setup_commission: setup_commission || 0,
        recurring_commission: recurring_commission || 0,
        recurring_months: recurring_months || 0,
        status: "pending", // Aguardando confirmação de pagamento
        sale_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (commissionError) {
      throw new Error(`Erro ao criar comissão: ${commissionError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        commission: {
          id: commission.id,
          partner_id: finalPartnerId,
          partner_tier: partnerTier,
          sale_origin: sale_origin,
          plan_name,
          plan_value,
          setup_value,
          setup_commission,
          recurring_commission,
          total_commission,
          recurring_months,
          status: commission.status,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Erro ao calcular comissão:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erro ao calcular comissão",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
