/**
 * Edge Function: PLG Metrics
 * 
 * Retorna métricas agregadas do funil PLG para o dashboard admin
 * 
 * Endpoints:
 * GET /plg-metrics - Obter métricas do funil
 * GET /plg-metrics?period=7d - Métricas dos últimos 7 dias
 * GET /plg-metrics?period=30d - Métricas dos últimos 30 dias
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FunnelStageCount {
  stage: string;
  count: number;
  avgScore: number | null;
}

interface ConversionRate {
  fromStage: string;
  toStage: string;
  rate: number;
}

interface DailyMetric {
  date: string;
  totalLeads: number;
  iscaStarted: number;
  iscaCompleted: number;
  discoveryCompleted: number;
  checkoutCompleted: number;
  paymentCompleted: number;
  activationCompleted: number;
  avgScore: number | null;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const period = url.searchParams.get("period") || "7d";
    
    // Calcular data de início baseada no período
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case "24h":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // 1. Métricas gerais do período
    const { data: leads, error: leadsError } = await supabase
      .from("plg_leads")
      .select("id, funnel_stage, govmetrix_score, recommended_plan, created_at")
      .gte("created_at", startDate.toISOString());

    if (leadsError) {
      throw new Error(`Erro ao buscar leads: ${leadsError.message}`);
    }

    // 2. Contagem por estágio
    const stageCounts: Record<string, { count: number; scores: number[] }> = {};
    const stages = [
      'isca_started', 'isca_completed',
      'discovery_started', 'discovery_completed',
      'checkout_started', 'checkout_completed',
      'payment_started', 'payment_completed',
      'activation_started', 'activation_completed'
    ];

    stages.forEach(stage => {
      stageCounts[stage] = { count: 0, scores: [] };
    });

    leads?.forEach(lead => {
      if (lead.funnel_stage && stageCounts[lead.funnel_stage]) {
        stageCounts[lead.funnel_stage].count++;
        if (lead.govmetrix_score) {
          stageCounts[lead.funnel_stage].scores.push(lead.govmetrix_score);
        }
      }
    });

    const funnelStages: FunnelStageCount[] = stages.map(stage => ({
      stage,
      count: stageCounts[stage].count,
      avgScore: stageCounts[stage].scores.length > 0 
        ? Math.round(stageCounts[stage].scores.reduce((a, b) => a + b, 0) / stageCounts[stage].scores.length)
        : null
    }));

    // 3. Calcular taxas de conversão
    const conversionRates: ConversionRate[] = [];
    for (let i = 0; i < stages.length - 1; i++) {
      const fromCount = funnelStages.slice(i).reduce((sum, s) => sum + s.count, 0);
      const toCount = funnelStages.slice(i + 1).reduce((sum, s) => sum + s.count, 0);
      
      conversionRates.push({
        fromStage: stages[i],
        toStage: stages[i + 1],
        rate: fromCount > 0 ? Math.round((toCount / fromCount) * 100) : 0
      });
    }

    // 4. Métricas por dia
    const dailyMetrics: Record<string, DailyMetric> = {};
    
    leads?.forEach(lead => {
      const date = lead.created_at.split('T')[0];
      if (!dailyMetrics[date]) {
        dailyMetrics[date] = {
          date,
          totalLeads: 0,
          iscaStarted: 0,
          iscaCompleted: 0,
          discoveryCompleted: 0,
          checkoutCompleted: 0,
          paymentCompleted: 0,
          activationCompleted: 0,
          avgScore: null
        };
      }
      
      dailyMetrics[date].totalLeads++;
      
      // Incrementar contadores baseado no estágio
      const stageIndex = stages.indexOf(lead.funnel_stage);
      if (stageIndex >= 0) dailyMetrics[date].iscaStarted++;
      if (stageIndex >= 1) dailyMetrics[date].iscaCompleted++;
      if (stageIndex >= 3) dailyMetrics[date].discoveryCompleted++;
      if (stageIndex >= 5) dailyMetrics[date].checkoutCompleted++;
      if (stageIndex >= 7) dailyMetrics[date].paymentCompleted++;
      if (stageIndex >= 9) dailyMetrics[date].activationCompleted++;
    });

    // 5. Métricas por plano recomendado
    const planCounts: Record<string, number> = {};
    leads?.forEach(lead => {
      if (lead.recommended_plan) {
        planCounts[lead.recommended_plan] = (planCounts[lead.recommended_plan] || 0) + 1;
      }
    });

    // 6. Métricas resumo
    const totalLeads = leads?.length || 0;
    const convertedLeads = funnelStages.find(s => s.stage === 'activation_completed')?.count || 0;
    const overallConversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
    
    const allScores = leads?.filter(l => l.govmetrix_score).map(l => l.govmetrix_score) || [];
    const avgGovMetrixScore = allScores.length > 0 
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : null;

    // 7. Leads recentes
    const { data: recentLeads, error: recentError } = await supabase
      .from("plg_leads")
      .select("id, name, email, company, funnel_stage, govmetrix_score, recommended_plan, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    const response = {
      period,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      
      summary: {
        totalLeads,
        convertedLeads,
        overallConversionRate,
        avgGovMetrixScore
      },
      
      funnelStages,
      conversionRates,
      dailyMetrics: Object.values(dailyMetrics).sort((a, b) => a.date.localeCompare(b.date)),
      planDistribution: planCounts,
      recentLeads: recentLeads || []
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
