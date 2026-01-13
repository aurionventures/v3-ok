/**
 * Edge Function: PLG Track Event
 * 
 * Rastreia eventos do funil PLG e atualiza leads
 * Implementa encaminhamento automático PLG/SLG baseado em score e regras
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

interface LeadRoutingResult {
  lead_path: string;
  slg_priority: string;
  matched_rule_id: string | null;
  matched_rule_name: string;
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

      // Variáveis para armazenar routing (usadas nas automações)
      let leadPath: string | undefined;
      let slgPriority: string | undefined;
      
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
            
            // Determinar routing PLG/SLG baseado no score e regras
            const routing = await determineLeadRouting(supabase, govmetrix.score, event_data);
            updateData.lead_path = routing.lead_path;
            updateData.slg_priority = routing.slg_priority;
            
            // Armazenar para usar nas automações
            leadPath = routing.lead_path;
            slgPriority = routing.slg_priority;
            
            // Log do routing para debug
            console.log(`Lead ${lead_email} routed to ${routing.lead_path} (priority: ${routing.slg_priority}) - Rule: ${routing.matched_rule_name}`);
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

    // Verificar automações para este evento (passando routing info)
    await processAutomations(supabase, event_type, leadId, lead_email, event_data, leadPath, slgPriority);

    return new Response(
      JSON.stringify({ 
        success: true, 
        event_id: eventRecord.id,
        lead_id: leadId,
        lead_path: leadPath,
        slg_priority: slgPriority
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

// Função para determinar routing PLG/SLG
async function determineLeadRouting(
  supabase: any,
  govmetrixScore: number,
  eventData: Record<string, any>
): Promise<LeadRoutingResult> {
  try {
    // Tentar usar a função do banco de dados
    const { data, error } = await supabase.rpc('determine_lead_path', {
      p_govmetrix_score: govmetrixScore,
      p_faturamento: eventData.quiz?.faturamento || null,
      p_has_conselho: eventData.quiz?.temConselho === 'sim' ? true : null,
      p_has_sucessao: eventData.quiz?.temSucessao === 'sim' ? true : null,
    });

    if (!error && data && data.length > 0) {
      return data[0];
    }

    // Fallback: lógica local se função não existir
    console.log("Using fallback routing logic");
    return determineLeadRoutingFallback(govmetrixScore, eventData);
  } catch (error) {
    console.error("Error calling determine_lead_path:", error);
    return determineLeadRoutingFallback(govmetrixScore, eventData);
  }
}

// Lógica de fallback para routing (caso função do DB não exista)
function determineLeadRoutingFallback(
  govmetrixScore: number,
  eventData: Record<string, any>
): LeadRoutingResult {
  const faturamento = eventData.quiz?.faturamento;
  const temConselho = eventData.quiz?.temConselho === 'sim';

  // Regra 1: Empresas grandes sempre SLG urgente
  if (faturamento === '300m_4_8b' || faturamento === 'acima_4_8b') {
    return {
      lead_path: 'slg',
      slg_priority: 'urgent',
      matched_rule_id: null,
      matched_rule_name: 'Fallback: Empresa Grande'
    };
  }

  // Regra 2: Score alto + média empresa = SLG high
  if (govmetrixScore >= 70 && faturamento === '30m_300m') {
    return {
      lead_path: 'slg',
      slg_priority: 'high',
      matched_rule_id: null,
      matched_rule_name: 'Fallback: Score Alto + Média Empresa'
    };
  }

  // Regra 3: Score muito alto = SLG normal
  if (govmetrixScore >= 80) {
    return {
      lead_path: 'slg',
      slg_priority: 'normal',
      matched_rule_id: null,
      matched_rule_name: 'Fallback: Score Muito Alto'
    };
  }

  // Regra 4: Score médio-alto + tem conselho = SLG normal
  if (govmetrixScore >= 60 && govmetrixScore < 80 && temConselho) {
    return {
      lead_path: 'slg',
      slg_priority: 'normal',
      matched_rule_id: null,
      matched_rule_name: 'Fallback: Score Médio-Alto + Conselho'
    };
  }

  // Default: PLG
  return {
    lead_path: 'plg',
    slg_priority: 'normal',
    matched_rule_id: null,
    matched_rule_name: 'Fallback: Default PLG'
  };
}

async function processAutomations(
  supabase: any, 
  eventType: string, 
  leadId: string | null,
  leadEmail: string | undefined,
  eventData: Record<string, any>,
  leadPath?: string,
  slgPriority?: string
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

      // Verificar condição de lead_path (PLG/SLG)
      if (conditions.lead_path && leadPath) {
        shouldTrigger = shouldTrigger && conditions.lead_path === leadPath;
      }

      // Verificar condição de prioridade SLG
      if (conditions.slg_priority && slgPriority) {
        shouldTrigger = shouldTrigger && conditions.slg_priority === slgPriority;
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
          lead_path: leadPath,
          slg_priority: slgPriority,
          action_config: automation.action_config
        }
      });

      // Se não tem delay, executar imediatamente
      if (automation.delay_minutes === 0) {
        await executeAutomationImmediately(supabase, automation, leadId, leadEmail, eventData, leadPath, slgPriority);
      }
    }
  } catch (error) {
    console.error("Erro ao processar automações:", error);
  }
}

// Executar automação imediatamente (sem delay)
async function executeAutomationImmediately(
  supabase: any,
  automation: any,
  leadId: string | null,
  leadEmail: string | undefined,
  eventData: Record<string, any>,
  leadPath?: string,
  slgPriority?: string
) {
  console.log(`Executando automação: ${automation.name}`);
  
  try {
    switch (automation.action_type) {
      case 'slack': {
        const slackWebhook = Deno.env.get("SLACK_WEBHOOK_URL");
        if (slackWebhook) {
          const message = buildSlackMessage(automation, eventData, leadPath, slgPriority);
          await fetch(slackWebhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: message })
          });
          console.log(`Slack message sent for automation: ${automation.name}`);
        } else {
          console.log(`[MOCK] Slack message would be sent for: ${automation.name}`);
        }
        break;
      }
      
      case 'email': {
        // TODO: Integrar com Resend/EmailJS
        console.log(`[MOCK] Email would be sent for automation: ${automation.name}`);
        break;
      }
      
      case 'webhook': {
        if (automation.action_config?.url) {
          await fetch(automation.action_config.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: "plg_automation",
              automation_name: automation.name,
              lead_email: leadEmail,
              lead_path: leadPath,
              slg_priority: slgPriority,
              event_data: eventData
            })
          });
        }
        break;
      }
    }
    
    // Atualizar log como sucesso
    // (Já foi inserido como "processing", aqui poderia atualizar para "success")
    
  } catch (error) {
    console.error(`Error executing automation ${automation.name}:`, error);
  }
}

// Construir mensagem do Slack baseada no template
function buildSlackMessage(
  automation: any,
  eventData: Record<string, any>,
  leadPath?: string,
  slgPriority?: string
): string {
  const template = automation.action_config?.message_template;
  const govmetrix = eventData.govmetrix;
  const leadData = eventData.lead_data || {};
  
  const priorityEmoji = {
    urgent: ':rotating_light:',
    high: ':fire:',
    normal: ':star:',
    low: ':information_source:'
  }[slgPriority || 'normal'] || ':star:';
  
  const pathLabel = leadPath === 'slg' ? 'Sales-Led (SLG)' : 'Product-Led (PLG)';
  
  switch (template) {
    case 'slg_urgent_lead':
      return `${priorityEmoji} *LEAD URGENTE - SLG*\n\n` +
        `*Empresa:* ${leadData.company || 'N/A'}\n` +
        `*Contato:* ${leadData.name || 'N/A'}\n` +
        `*Email:* ${leadData.email || 'N/A'}\n` +
        `*Score GovMetrix:* ${govmetrix?.score || 'N/A'}/100\n` +
        `*Estágio:* ${govmetrix?.stage || 'N/A'}\n\n` +
        `:warning: *AÇÃO IMEDIATA NECESSÁRIA*`;
        
    case 'slg_high_lead':
      return `${priorityEmoji} *Novo Lead SLG - Alta Prioridade*\n\n` +
        `*Empresa:* ${leadData.company || 'N/A'}\n` +
        `*Contato:* ${leadData.name || 'N/A'}\n` +
        `*Email:* ${leadData.email || 'N/A'}\n` +
        `*Score GovMetrix:* ${govmetrix?.score || 'N/A'}/100\n` +
        `*Estágio:* ${govmetrix?.stage || 'N/A'}`;
        
    case 'hot_lead':
    default:
      return `${priorityEmoji} *Novo Lead - ${pathLabel}*\n\n` +
        `*Empresa:* ${leadData.company || 'N/A'}\n` +
        `*Contato:* ${leadData.name || 'N/A'}\n` +
        `*Email:* ${leadData.email || 'N/A'}\n` +
        `*Score:* ${govmetrix?.score || 'N/A'}/100\n` +
        `*Prioridade:* ${slgPriority || 'normal'}`;
  }
}
