// ============================================================================
// EDGE FUNCTION: send-affiliate-link
// Envia link de afiliado por email usando Resend
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendAffiliateLinkRequest {
  partner_email: string;
  partner_name: string;
  company_name: string;
  affiliate_token: string;
  affiliate_link: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "parceiros@legacy.gov.br";
    
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

    const body: SendAffiliateLinkRequest = await req.json();
    
    const {
      partner_email,
      partner_name,
      company_name,
      affiliate_token,
      affiliate_link,
    } = body;

    if (!partner_email || !affiliate_link) {
      return new Response(
        JSON.stringify({ error: "'partner_email' e 'affiliate_link' são obrigatórios" }),
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
      <title>Seu Link de Afiliado - Legacy OS</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #0433FF 0%, #667eea 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Seu Link de Afiliado</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Legacy OS - Sistema de Governança</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Olá <strong>${partner_name || 'Parceiro'}</strong>,
                  </p>
                  
                  <p style="color: #666666; font-size: 15px; line-height: 1.6; margin: 0 0 25px 0;">
                    Aqui está o link de afiliado para a empresa <strong>${company_name}</strong>. 
                    Compartilhe este link com seus clientes para que eles possam acessar a plataforma Legacy OS.
                  </p>
                  
                  <!-- Link Card -->
                  <div style="background-color: #f8f9fa; border: 2px solid #0433FF; border-radius: 8px; padding: 25px; margin: 30px 0; text-align: center;">
                    <p style="color: #333333; font-size: 14px; font-weight: 600; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                      Seu Link de Afiliado
                    </p>
                    <div style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 6px; padding: 15px; margin: 15px 0;">
                      <a href="${affiliate_link}" style="color: #0433FF; font-size: 16px; font-weight: 600; text-decoration: none; word-break: break-all; display: inline-block;">
                        ${affiliate_link}
                      </a>
                    </div>
                    <a href="${affiliate_link}" 
                       style="display: inline-block; background-color: #0433FF; color: #ffffff; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 15px; font-size: 15px;">
                      Copiar Link
                    </a>
                  </div>
                  
                  <!-- Token Info -->
                  <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 25px 0;">
                    <p style="color: #666666; font-size: 13px; margin: 0 0 8px 0; font-weight: 600;">
                      Token de Afiliado:
                    </p>
                    <p style="color: #333333; font-family: monospace; font-size: 14px; margin: 0; background-color: #ffffff; padding: 10px; border-radius: 4px; border: 1px solid #e0e0e0;">
                      ${affiliate_token}
                    </p>
                  </div>
                  
                  <!-- Instructions -->
                  <div style="border-left: 4px solid #0433FF; padding-left: 20px; margin: 30px 0;">
                    <p style="color: #333333; font-size: 15px; font-weight: 600; margin: 0 0 15px 0;">
                      Como usar seu link de afiliado:
                    </p>
                    <ul style="color: #666666; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                      <li>Compartilhe o link com seus clientes</li>
                      <li>Quando o cliente acessar através do link, ele será automaticamente atribuído ao seu parceiro</li>
                      <li>Você receberá comissão sobre as vendas geradas através deste link</li>
                      <li>Você pode acompanhar as comissões na plataforma Legacy OS</li>
                    </ul>
                  </div>
                  
                  <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
                    Se você tiver dúvidas ou precisar de ajuda, entre em contato com nossa equipe.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="color: #999999; font-size: 12px; margin: 0 0 10px 0;">
                    Este é um email automático, por favor não responda.
                  </p>
                  <p style="color: #999999; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} Legacy OS. Todos os direitos reservados.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    // Enviar email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Legacy OS Parceiros <${FROM_EMAIL}>`,
        to: partner_email,
        subject: `Seu Link de Afiliado - ${company_name}`,
        html: htmlContent,
      }),
    });

    if (emailResponse.ok) {
      const data = await emailResponse.json();
      return new Response(
        JSON.stringify({
          success: true,
          message: "Link de afiliado enviado com sucesso",
          email_id: data.id,
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } else {
      const errorText = await emailResponse.text();
      console.error("Erro ao enviar email:", errorText);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Falha ao enviar email",
          details: errorText,
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

  } catch (error) {
    console.error("Erro:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erro interno do servidor",
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});