# Magic Link no localhost

Para o magic link de convidados funcionar em `http://localhost:8080` (ou outra porta), é necessário adicionar a URL às **Redirect URLs** do Supabase.

## Passos

1. Acesse: **Supabase Dashboard → Authentication → URL Configuration**
2. Em **Redirect URLs**, adicione:
   - `http://localhost:8080/**`
   - `http://localhost:8080/auth/callback`
   - (opcional) `http://localhost:5173/**` se usar Vite na porta padrão
3. Clique em **Save**

## Fluxo esperado

1. **Agenda** → Nova Reunião → preencher dados (Informações) → Participantes → Adicionar Convidado (e-mail + validade)
2. Clicar em **Gerar / Copiar Link** – o sistema cria a reunião (se ainda não existe), cadastra o convidado em `reuniao_convidados` com `user_id`, e gera o magic link
3. Convidado cola o link no navegador → Supabase verifica e redireciona para `/auth/callback` com tokens no hash
4. **AuthCallback** aplica a sessão e redireciona convidados para `/convidado`
5. Em `/convidado`, o convidado vê dados da reunião, faz upload de documentos e confirma participação

## Se voltar para a tela de login

- **"Nenhum perfil encontrado"**: o convidado precisa ter sido criado via "Gerar / Copiar Link" (que grava em `reuniao_convidados` com `user_id`). Links gerados por outros meios podem não ter esse vínculo.
- **Redirect URLs**: confirme que `http://localhost:8080/auth/callback` está nas Redirect URLs do Supabase.
