// ============================================================================
// EDGE FUNCTION: send-briefing-email
// Envia emails de notificação de briefing usando Resend
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendBriefingEmailRequest {
  to: string;
  subject: string;
  memberName: string;
  meetingDate: string;
  meetingTitle: string;
  readingTime: number;
  topicsCount: number;
  criticalTopics: string[];
  ctaLink: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "noreply@legacy.com";
    
    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY não configurada - email não enviado");
      return new Response(
        JSON.stringify({ 
          success: false,
          message: "Serviço de email não configurado" 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const body: SendBriefingEmailRequest = await req.json();
    
    const {
      to,
      subject,
      memberName,
      meetingDate,
      meetingTitle,
      readingTime,
      topicsCount,
      criticalTopics,
      ctaLink,
    } = body;

    if (!to || !subject) {
      return new Response(
        JSON.stringify({ error: "'to' e 'subject' são obrigatórios" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Template do email
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 10px 0 0; opacity: 0.9; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
        .stats { display: flex; gap: 20px; margin: 20px 0; }
        .stat { background: white; padding: 15px; border-radius: 8px; text-align: center; flex: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .stat-number { font-size: 28px; font-weight: bold; color: #6366f1; }
        .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
        .topics { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .topic { padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .topic:last-child { border-bottom: none; }
        .cta { display: inline-block; background: #6366f1; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
        .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Seu Briefing está Pronto</h1>
          <p>${meetingTitle} - ${meetingDate}</p>
        </div>
        
        <div class="content">
          <p>Olá <strong>${memberName}</strong>,</p>
          
          <p>Seu briefing personalizado para a próxima reunião do conselho foi preparado pelo nosso sistema de IA. Acesse agora para se preparar adequadamente.</p>
          
          <div class="stats">
            <div class="stat">
              <div class="stat-number">${readingTime}</div>
              <div class="stat-label">Minutos de Leitura</div>
            </div>
            <div class="stat">
              <div class="stat-number">${topicsCount}</div>
              <div class="stat-label">Tópicos Analisados</div>
            </div>
          </div>
          
          ${criticalTopics.length > 0 ? `
          <div class="topics">
            <p style="margin: 0 0 15px; font-weight: 600; color: #1e293b;">Tópicos para sua atenção:</p>
            ${criticalTopics.slice(0, 5).map(topic => `
              <div class="topic">• ${topic}</div>
            `).join('')}
          </div>
          ` : ''}
          
          <div style="text-align: center;">
            <a href="${ctaLink}" class="cta">Acessar Meu Briefing</a>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            Este briefing foi gerado automaticamente com base na pauta aprovada e no seu perfil de expertise. 
            Complete o checklist de preparação para garantir uma participação efetiva na reunião.
          </p>
        </div>
        
        <div class="footer">
          <p>Legacy OS - Governança Inteligente</p>
          <p>Este é um email automático. Por favor, não responda.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Enviar email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html: htmlContent,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Erro Resend:", errorText);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Erro ao enviar email",
          details: errorText 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const resendData = await resendResponse.json();
    console.log(`Email enviado para ${to}. ID: ${resendData.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        emailId: resendData.id,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Erro na função send-briefing-email:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Erro interno do servidor",
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
