# Magic Link no localhost

Para o magic link de convidados funcionar em `http://localhost:8080` (ou outra porta), é necessário adicionar a URL às **Redirect URLs** do Supabase.

## Passos

1. Acesse: **https://supabase.com/dashboard/project/wzlcucfssplfskfavvsy/auth/url-configuration**
2. Em **Redirect URLs**, adicione:
   - `http://localhost:8080/**`
   - (opcional) `http://localhost:5173/**` se usar Vite na porta padrão
3. Clique em **Save**

Depois disso, os magic links gerados funcionarão corretamente. O fluxo redireciona para `/auth/callback`, que processa a sessão e encaminha convidados para `/convidado` e membros para `/member/dashboard`.
