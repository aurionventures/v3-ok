/**
 * Edge Function: PLG Process Automations
 * 
 * Processa automações agendadas do funil PLG
 * - Envia emails de follow-up
 * - Notifica equipe via Slack
 * - Executa webhooks
 * 
 * Deve ser chamada periodicamente via cron job
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Templates de email
const EMAIL_TEMPLATES: Record<string, { subject: string; html: (data: any) => string }> = {
  govmetrix_result: {
    subject: "Seu Diagnóstico de Governança está pronto!",
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1e3a5f;">Olá, ${data.name}!</h1>
        <p>Parabéns por completar o Diagnóstico GovMetrix da ${data.company}.</p>
        
        <div style="background: #f4f6f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #c0a062; margin-top: 0;">Seu Score: ${data.score}/100</h2>
          <p style="font-size: 18px; margin-bottom: 0;">Estágio: <strong>${data.stage}</strong></p>
        </div>
        
        <p>Este score indica o nível de maturidade da governança corporativa da sua empresa baseado nos princípios do Código IBGC.</p>
        
        <h3>Próximos Passos:</h3>
        <ol>
          <li>Descubra o plano ideal para sua empresa</li>
          <li>Agende uma demonstração personalizada</li>
          <li>Comece a transformar sua governança</li>
        </ol>
        
        <a href="https://legacy.gov.br/plan-discovery" 
           style="display: inline-block; background: #c0a062; color: #1e3a5f; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
          Encontrar Meu Plano Ideal
        </a>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Equipe Legacy Governança<br>
          <a href="mailto:contato@legacy.gov.br">contato@legacy.gov.br</a>
        </p>
      </div>
    `
  },
  
  discovery_reminder: {
    subject: "Descubra o plano ideal para sua governança",
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1e3a5f;">Olá, ${data.name}!</h1>
        
        <p>Você completou o Diagnóstico GovMetrix da ${data.company} e obteve um score de <strong>${data.score}/100</strong>.</p>
        
        <p>Mas ainda não descobriu qual plano é ideal para a sua empresa!</p>
        
        <div style="background: #f4f6f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #1e3a5f; margin-top: 0;">Em apenas 2 minutos:</h2>
          <ul>
            <li>Descubra o plano ideal baseado no seu perfil</li>
            <li>Veja funcionalidades personalizadas</li>
            <li>Receba uma proposta sob medida</li>
          </ul>
        </div>
        
        <a href="https://legacy.gov.br/plan-discovery" 
           style="display: inline-block; background: #c0a062; color: #1e3a5f; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
          Descobrir Meu Plano
        </a>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Se tiver dúvidas, responda este email ou fale conosco no WhatsApp.<br><br>
          Equipe Legacy Governança
        </p>
      </div>
    `
  },
  
  checkout_reminder: {
    subject: "Você esqueceu de algo?",
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1e3a5f;">Olá, ${data.name}!</h1>
        
        <p>Notamos que você iniciou a contratação do plano <strong>${data.recommended_plan}</strong> mas não finalizou.</p>
        
        <p>Entendemos que a decisão é importante. Por isso, estamos aqui para ajudar!</p>
        
        <div style="background: #f4f6f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e3a5f; margin-top: 0;">Dúvidas comuns:</h3>
          <ul>
            <li><strong>Posso testar antes?</strong> Sim! Oferecemos 14 dias de trial.</li>
            <li><strong>E se eu mudar de plano depois?</strong> Você pode fazer upgrade a qualquer momento.</li>
            <li><strong>Preciso de mais tempo?</strong> Sem problema, seu carrinho está salvo.</li>
          </ul>
        </div>
        
        <a href="https://legacy.gov.br/checkout" 
           style="display: inline-block; background: #c0a062; color: #1e3a5f; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
          Continuar Contratação
        </a>
        
        <p>Ou agende uma call conosco para tirar suas dúvidas:</p>
        
        <a href="https://calendly.com/legacy-demo" 
           style="display: inline-block; background: transparent; color: #1e3a5f; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; border: 2px solid #1e3a5f;">
          Agendar Conversa
        </a>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Equipe Legacy Governança
        </p>
      </div>
    `
  }
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar automações pendentes que já passaram do horário agendado
    const { data: pendingLogs, error: fetchError } = await supabase
      .from("plg_automation_logs")
      .select(`
        *,
        automation:automation_id (
          id, name, action_type, action_config
        ),
        lead:lead_id (
          id, name, email, company, govmetrix_score, govmetrix_stage, recommended_plan
        )
      `)
      .eq("status", "pending")
      .lte("scheduled_at", new Date().toISOString())
      .limit(50);

    if (fetchError) {
      throw new Error(`Erro ao buscar logs pendentes: ${fetchError.message}`);
    }

    const results = {
      processed: 0,
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[]
    };

    for (const log of pendingLogs || []) {
      results.processed++;

      try {
        // Atualizar status para processing
        await supabase
          .from("plg_automation_logs")
          .update({ status: "processing" })
          .eq("id", log.id);

        const automation = log.automation;
        const lead = log.lead;

        if (!automation || !lead) {
          results.skipped++;
          await supabase
            .from("plg_automation_logs")
            .update({ status: "skipped", error_message: "Automação ou lead não encontrado" })
            .eq("id", log.id);
          continue;
        }

        // Executar ação baseada no tipo
        switch (automation.action_type) {
          case "email": {
            const template = EMAIL_TEMPLATES[automation.action_config.template];
            if (!template) {
              throw new Error(`Template não encontrado: ${automation.action_config.template}`);
            }

            // Usar Resend para enviar email
            const resendKey = Deno.env.get("RESEND_API_KEY");
            if (resendKey) {
              const emailResponse = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${resendKey}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  from: "Legacy Governança <noreply@legacy.gov.br>",
                  to: lead.email,
                  subject: template.subject,
                  html: template.html({
                    name: lead.name,
                    company: lead.company,
                    score: lead.govmetrix_score,
                    stage: lead.govmetrix_stage,
                    recommended_plan: lead.recommended_plan
                  })
                })
              });

              if (!emailResponse.ok) {
                const errorText = await emailResponse.text();
                throw new Error(`Erro ao enviar email: ${errorText}`);
              }
            } else {
              console.log(`[MOCK] Enviando email para ${lead.email}: ${template.subject}`);
            }
            break;
          }

          case "slack": {
            const slackWebhook = Deno.env.get("SLACK_WEBHOOK_URL");
            if (slackWebhook) {
              const message = automation.action_config.message_template === "hot_lead"
                ? `:fire: *Novo Lead Quente!*\n\n*Nome:* ${lead.name}\n*Empresa:* ${lead.company}\n*Score:* ${lead.govmetrix_score}/100\n*Estágio:* ${lead.govmetrix_stage}`
                : `Novo evento PLG: ${lead.name} (${lead.company})`;

              await fetch(slackWebhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: message })
              });
            } else {
              console.log(`[MOCK] Enviando para Slack: Lead ${lead.name}`);
            }
            break;
          }

          case "webhook": {
            if (automation.action_config.url) {
              await fetch(automation.action_config.url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  event: "plg_automation",
                  lead: lead,
                  automation_name: automation.name
                })
              });
            }
            break;
          }
        }

        // Marcar como sucesso
        await supabase
          .from("plg_automation_logs")
          .update({ 
            status: "success", 
            executed_at: new Date().toISOString() 
          })
          .eq("id", log.id);

        results.success++;

      } catch (error) {
        results.failed++;
        results.errors.push(`Log ${log.id}: ${error.message}`);

        // Marcar como failed
        await supabase
          .from("plg_automation_logs")
          .update({ 
            status: "failed", 
            error_message: error.message,
            executed_at: new Date().toISOString()
          })
          .eq("id", log.id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
        timestamp: new Date().toISOString()
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
