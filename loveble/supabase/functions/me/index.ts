import { verify, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

// Função para extrair valor de cookie pelo nome
function getCookie(req: Request, name: string): string | null {
  const header = req.headers.get("cookie");
  if (!header) return null;
  const match = header.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
}

Deno.serve(async (req) => {
  // CORS: PERMITE TUDO PARA TESTE
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Credentials': 'true',
  };
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  try {
    const token = getCookie(req, 'auth_token');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Não autenticado' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const jwtSecret = Deno.env.get('JWT_SECRET')!;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(jwtSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const payload = await verify(token, key);

    // Monta objeto user a partir do payload, incluindo empresa
    const user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      name: (payload as any).name,  // include name if present in token
      company: (payload as any).company,  // include company from token
    };
    
    console.log('Debug - me function - Payload:', payload);
    console.log('Debug - me function - User object:', user);

    return new Response(JSON.stringify({ user }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Token inválido ou expirado' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
