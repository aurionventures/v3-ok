/**
 * Edge Function: Send Contract Email
 * 
 * Envia emails relacionados a contratos:
 * - Solicitação de assinatura
 * - Lembretes
 * - Confirmação de assinatura
 * - Cópia do contrato assinado
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendContractEmailRequest {
  contract_id: string;
  email_type: 'signature_request' | 'reminder' | 'signed_confirmation' | 'contract_copy';
  custom_message?: string;
}

// Templates de email
const EMAIL_TEMPLATES = {
  signature_request: {
    subject: "Solicitação de Assinatura - Contrato {{contract_number}}",
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .logo { font-size: 24px; font-weight: bold; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; }
          .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e5e5; }
          .info-label { color: #666; }
          .info-value { font-weight: 600; }
          .cta-button { display: inline-block; background: #c0a062; color: #1e3a5f; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">LEGACY OS</div>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Plataforma de Governança Corporativa</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1e3a5f; margin-top: 0;">Olá, ${data.signatory_name}!</h2>
            
            <p>Seu contrato de prestação de serviços com a <strong>Legacy Governança</strong> está pronto para assinatura.</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0; color: #1e3a5f;">Detalhes do Contrato</h3>
              <div class="info-row">
                <span class="info-label">Número do Contrato:</span>
                <span class="info-value">${data.contract_number}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Empresa:</span>
                <span class="info-value">${data.client_name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Plano:</span>
                <span class="info-value">${data.plan_name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Valor Mensal:</span>
                <span class="info-value">R$ ${data.monthly_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Vigência:</span>
                <span class="info-value">${data.duration_months} meses</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${data.sign_url}" class="cta-button">
                Revisar e Assinar Contrato
              </a>
            </div>
            
            <div class="warning">
              <strong>Importante:</strong> Este link é válido por 7 dias. Após este período, será necessário solicitar um novo link.
            </div>
            
            <p style="color: #666; font-size: 14px;">
              A assinatura eletrônica tem validade jurídica conforme a Lei nº 14.063/2020.
            </p>
          </div>
          
          <div class="footer">
            <p>Legacy Governança Ltda.</p>
            <p>contato@legacy.gov.br | www.legacy.gov.br</p>
            <p style="margin-top: 10px;">Este email foi enviado automaticamente. Por favor, não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },
  
  reminder: {
    subject: "Lembrete: Seu contrato aguarda assinatura - {{contract_number}}",
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; }
          .cta-button { display: inline-block; background: #c0a062; color: #1e3a5f; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
          .urgency { background: #fee2e2; border: 1px solid #ef4444; padding: 15px; border-radius: 6px; margin: 20px 0; color: #dc2626; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="font-size: 24px; font-weight: bold;">LEGACY OS</div>
          </div>
          
          <div class="content">
            <h2 style="color: #1e3a5f; margin-top: 0;">Lembrete: Contrato Pendente</h2>
            
            <p>Olá, ${data.signatory_name}!</p>
            
            <p>Notamos que o contrato <strong>${data.contract_number}</strong> da empresa <strong>${data.client_name}</strong> ainda não foi assinado.</p>
            
            <div class="urgency">
              <strong>Atenção:</strong> O link de assinatura expira em breve. Assine agora para não perder o acesso.
            </div>
            
            <div style="text-align: center;">
              <a href="${data.sign_url}" class="cta-button">
                Assinar Agora
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Se você já assinou este contrato, por favor ignore este email.
            </p>
          </div>
          
          <div class="footer">
            <p>Legacy Governança Ltda. | contato@legacy.gov.br</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },
  
  signed_confirmation: {
    subject: "Contrato Assinado com Sucesso - {{contract_number}}",
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; }
          .success-icon { font-size: 48px; margin-bottom: 10px; }
          .info-box { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #86efac; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">&#10003;</div>
            <div style="font-size: 20px; font-weight: bold;">Contrato Assinado!</div>
          </div>
          
          <div class="content">
            <h2 style="color: #059669; margin-top: 0;">Parabéns, ${data.signatory_name}!</h2>
            
            <p>O contrato <strong>${data.contract_number}</strong> foi assinado com sucesso.</p>
            
            <div class="info-box">
              <p style="margin: 0;"><strong>Data da Assinatura:</strong> ${data.signed_at}</p>
              <p style="margin: 10px 0 0 0;"><strong>Próximos Passos:</strong></p>
              <ol style="margin: 10px 0; padding-left: 20px;">
                <li>A Legacy irá realizar a contra-assinatura</li>
                <li>Você receberá uma cópia do contrato assinado por email</li>
                <li>Seu acesso à plataforma será liberado em até 24h</li>
              </ol>
            </div>
            
            <p>Em caso de dúvidas, entre em contato conosco pelo email contato@legacy.gov.br</p>
          </div>
          
          <div class="footer">
            <p>Legacy Governança Ltda. | contato@legacy.gov.br</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },
  
  contract_copy: {
    subject: "Cópia do Contrato Assinado - {{contract_number}}",
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="font-size: 24px; font-weight: bold;">LEGACY OS</div>
          </div>
          
          <div class="content">
            <h2 style="color: #1e3a5f; margin-top: 0;">Cópia do Contrato</h2>
            
            <p>Olá, ${data.signatory_name}!</p>
            
            <p>Segue em anexo a cópia do contrato <strong>${data.contract_number}</strong> devidamente assinado por ambas as partes.</p>
            
            <p>Guarde este documento para sua referência.</p>
            
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
            
            <p style="color: #666; font-size: 14px;">
              <strong>Datas de Assinatura:</strong><br>
              Cliente: ${data.client_signed_at}<br>
              Legacy: ${data.counter_signed_at}
            </p>
          </div>
          
          <div class="footer">
            <p>Legacy Governança Ltda. | contato@legacy.gov.br</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },
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

    const body: SendContractEmailRequest = await req.json();
    const { contract_id, email_type, custom_message } = body;

    if (!contract_id || !email_type) {
      return new Response(
        JSON.stringify({ error: "contract_id e email_type são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Buscar contrato
    const { data: contract, error: contractError } = await supabase
      .from("contracts")
      .select("*")
      .eq("id", contract_id)
      .single();

    if (contractError || !contract) {
      return new Response(
        JSON.stringify({ error: "Contrato não encontrado" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Gerar token de assinatura se necessário
    if (email_type === 'signature_request' && !contract.client_signature_token) {
      const token = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias de validade

      await supabase
        .from("contracts")
        .update({
          client_signature_token: token,
          client_signature_token_expires_at: expiresAt.toISOString(),
          status: 'pending_signature',
        })
        .eq("id", contract_id);

      contract.client_signature_token = token;
    }

    // Preparar dados para o template
    const baseUrl = Deno.env.get("PUBLIC_SITE_URL") || "https://legacy.gov.br";
    const signUrl = `${baseUrl}/contract/sign/${contract.client_signature_token}`;

    const templateData = {
      contract_number: contract.contract_number,
      client_name: contract.client_name,
      client_email: contract.client_email,
      signatory_name: contract.signatory_name,
      signatory_role: contract.signatory_role,
      plan_name: contract.plan_name,
      monthly_value: contract.monthly_value,
      total_value: contract.total_value,
      duration_months: contract.duration_months,
      start_date: contract.start_date,
      end_date: contract.end_date,
      sign_url: signUrl,
      signed_at: contract.client_signed_at 
        ? new Date(contract.client_signed_at).toLocaleString('pt-BR')
        : null,
      client_signed_at: contract.client_signed_at
        ? new Date(contract.client_signed_at).toLocaleString('pt-BR')
        : null,
      counter_signed_at: contract.counter_signed_at
        ? new Date(contract.counter_signed_at).toLocaleString('pt-BR')
        : null,
    };

    // Obter template
    const template = EMAIL_TEMPLATES[email_type];
    if (!template) {
      return new Response(
        JSON.stringify({ error: "Tipo de email inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subject = template.subject.replace("{{contract_number}}", contract.contract_number);
    const html = template.html(templateData);

    // Enviar email via Resend
    const resendKey = Deno.env.get("RESEND_API_KEY");
    let emailSent = false;

    if (resendKey) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Legacy Governança <contratos@legacy.gov.br>",
          to: contract.client_email,
          subject,
          html,
        }),
      });

      if (emailResponse.ok) {
        emailSent = true;
      } else {
        const errorText = await emailResponse.text();
        console.error("Erro ao enviar email:", errorText);
      }
    } else {
      console.log("[MOCK] Email seria enviado:", { to: contract.client_email, subject });
      emailSent = true; // Mock como sucesso para desenvolvimento
    }

    // Registrar evento
    await supabase.from("contract_events").insert({
      contract_id,
      event_type: email_type === 'signature_request' ? 'sent' : 
                  email_type === 'reminder' ? 'reminder_sent' : 'sent',
      actor_type: 'system',
      metadata: { email_type, sent_to: contract.client_email },
    });

    // Atualizar contrato
    const updateData: any = {
      sent_count: (contract.sent_count || 0) + 1,
    };

    if (email_type === 'signature_request') {
      updateData.sent_at = new Date().toISOString();
    } else if (email_type === 'reminder') {
      updateData.last_reminder_at = new Date().toISOString();
    }

    await supabase
      .from("contracts")
      .update(updateData)
      .eq("id", contract_id);

    return new Response(
      JSON.stringify({
        success: true,
        email_sent: emailSent,
        sign_url: signUrl,
        message: emailSent ? "Email enviado com sucesso" : "Email agendado para envio",
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
