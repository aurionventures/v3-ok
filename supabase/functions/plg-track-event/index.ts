/**
 * Edge Function: PLG Track Event
 * 
 * Rastreia eventos do funil PLG e atualiza leads
 * 
 * Endpoints:
 * POST /plg-track-event - Rastrear evento do funil
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TrackEventRequest {
  event_type: string;
  lead_email?: string;
  lead_data?: {
    name?: string;
    company?: string;
    phone?: string;
  };
  event_data?: Record<string, any>;
  session_id?: string;
  page_url?: string;
  page_title?: string;
}

interface GovMetrixData {
  score: number;
  stage: string;
  categoryScores: Record<string, number>;
  answers?: Record<string, any>;
}

interface QuizData {
  faturamento?: string;
  temConselho?: string;
  temSucessao?: string;
  avaliacaoEsg?: string;
  numColaboradores?: string;
  recommendedPlan?: string;
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

    const body: TrackEventRequest = await req.json();
    const { 
      event_type, 
      lead_email, 
      lead_data, 
      event_data = {}, 
      session_id,
      page_url,
      page_title 
    } = body;

    if (!event_type) {
      return new Response(
        JSON.stringify({ error: "event_type é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let leadId: string | null = null;

    // Buscar ou criar lead se temos email
    if (lead_email) {
      // Verificar se lead existe
      const { data: existingLead, error: fetchError } = await supabase
        .from("plg_leads")
        .select("id, funnel_stage")
        .eq("email", lead_email)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Erro ao buscar lead:", fetchError);
      }

      if (existingLead) {
        leadId = existingLead.id;
        
        // Atualizar estágio do lead se é um evento de transição
        const stageTransitions = [
          'isca_started', 'isca_completed',
          'discovery_started', 'discovery_completed',
          'checkout_started', 'checkout_completed',
          'payment_started', 'payment_completed',
          'activation_started', 'activation_completed'
        ];
        
        if (stageTransitions.includes(event_type)) {
          const updateData: Record<string, any> = { funnel_stage: event_type };
          
          // Adicionar dados específicos baseados no evento
          if (event_type === 'isca_completed' && event_data.govmetrix) {
            const govmetrix = event_data.govmetrix as GovMetrixData;
            updateData.govmetrix_score = govmetrix.score;
            updateData.govmetrix_stage = govmetrix.stage;
            updateData.govmetrix_category_scores = govmetrix.categoryScores;
            updateData.govmetrix_answers = govmetrix.answers || {};
          }
          
          if (event_type === 'discovery_completed' && event_data.quiz) {
            const quiz = event_data.quiz as QuizData;
            updateData.quiz_faturamento = quiz.faturamento;
            updateData.quiz_tem_conselho = quiz.temConselho;
            updateData.quiz_tem_sucessao = quiz.temSucessao;
            updateData.quiz_avaliacao_esg = quiz.avaliacaoEsg;
            updateData.quiz_num_colaboradores = quiz.numColaboradores;
            updateData.recommended_plan = quiz.recommendedPlan;
          }
          
          if (event_type === 'checkout_completed' && event_data.selectedPlan) {
            updateData.selected_plan = event_data.selectedPlan;
          }
          
          if (event_type === 'activation_completed') {
            updateData.converted_at = new Date().toISOString();
            if (event_data.userId) {
              updateData.converted_to_user_id = event_data.userId;
            }
            if (event_data.orgId) {
              updateData.converted_to_org_id = event_data.orgId;
            }
          }
          
          const { error: updateError } = await supabase
            .from("plg_leads")
            .update(updateData)
            .eq("id", leadId);
          
          if (updateError) {
            console.error("Erro ao atualizar lead:", updateError);
          }
        }
      } else if (lead_data?.name && lead_data?.company) {
        // Criar novo lead
        const { data: newLead, error: createError } = await supabase
          .from("plg_leads")
          .insert({
            email: lead_email,
            name: lead_data.name,
            company: lead_data.company,
            phone: lead_data.phone,
            funnel_stage: event_type,
            source: event_data.source || 'organic',
            utm_source: event_data.utm_source,
            utm_medium: event_data.utm_medium,
            utm_campaign: event_data.utm_campaign,
          })
          .select("id")
          .single();
        
        if (createError) {
          console.error("Erro ao criar lead:", createError);
        } else {
          leadId = newLead.id;
        }
      }
    }

    // Registrar evento
    const { data: eventRecord, error: eventError } = await supabase
      .from("plg_funnel_events")
      .insert({
        lead_id: leadId,
        lead_email: lead_email,
        event_type,
        event_data,
        session_id,
        page_url,
        page_title,
      })
      .select("id")
      .single();

    if (eventError) {
      console.error("Erro ao registrar evento:", eventError);
      return new Response(
        JSON.stringify({ error: "Erro ao registrar evento", details: eventError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verificar automações para este evento
    await processAutomations(supabase, event_type, leadId, lead_email, event_data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        event_id: eventRecord.id,
        lead_id: leadId 
      }),
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

async function processAutomations(
  supabase: any, 
  eventType: string, 
  leadId: string | null,
  leadEmail: string | undefined,
  eventData: Record<string, any>
) {
  try {
    // Buscar automações ativas para este evento
    const { data: automations, error } = await supabase
      .from("plg_automations")
      .select("*")
      .eq("trigger_event", eventType)
      .eq("is_active", true);

    if (error || !automations?.length) return;

    for (const automation of automations) {
      // Verificar condições
      const conditions = automation.trigger_conditions || {};
      let shouldTrigger = true;

      // Verificar condição de score mínimo
      if (conditions.govmetrix_score_min && eventData.govmetrix?.score) {
        shouldTrigger = eventData.govmetrix.score >= conditions.govmetrix_score_min;
      }

      if (!shouldTrigger) continue;

      // Agendar automação
      const scheduledAt = new Date();
      scheduledAt.setMinutes(scheduledAt.getMinutes() + (automation.delay_minutes || 0));

      await supabase.from("plg_automation_logs").insert({
        automation_id: automation.id,
        lead_id: leadId,
        status: automation.delay_minutes > 0 ? "pending" : "processing",
        scheduled_at: scheduledAt.toISOString(),
        execution_data: {
          lead_email: leadEmail,
          event_data: eventData,
          action_config: automation.action_config
        }
      });

      // Se não tem delay, executar imediatamente
      if (automation.delay_minutes === 0) {
        // Aqui seria a execução da automação (email, webhook, etc.)
        // Por enquanto apenas logamos
        console.log(`Executando automação: ${automation.name}`);
      }
    }
  } catch (error) {
    console.error("Erro ao processar automações:", error);
  }
}
