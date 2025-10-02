# Configuração do EmailJS

Para o envio automático de emails funcionar, você precisa configurar o EmailJS:

## Passo 1: Criar Conta no EmailJS
1. Acesse: https://www.emailjs.com/
2. Crie uma conta gratuita

## Passo 2: Configurar Serviço de Email
1. No dashboard, vá em "Email Services"
2. Clique em "Add New Service"
3. Escolha seu provedor (Gmail, Outlook, etc.)
4. Configure e copie o **Service ID** (ex: `service_legacy`)

## Passo 3: Criar Template de Email
1. Vá em "Email Templates"
2. Clique em "Create New Template"
3. Use o Template ID: `template_invitation`
4. Configure o template com estas variáveis:

```
Assunto: Convite para acessar a plataforma Legacy

Olá {{company_name}},

Você recebeu um convite para acessar a plataforma Legacy como {{user_type}}.

Clique no link abaixo para ativar o seu cadastro:
{{invitation_link}}

Instruções:
1. Clique no link acima
2. Preencha seus dados de acesso
3. Complete o cadastro

A equipe Legacy agradece.

---
Este convite expira em 7 dias.
```

## Passo 4: Obter Public Key
1. Vá em "Account" → "General"
2. Copie sua **Public Key**

## Passo 5: Atualizar o Código
Abra o arquivo `src/components/invitation/InviteForm.tsx` e substitua:

```typescript
await emailjs.send(
  'service_legacy', // ← Substitua pelo seu Service ID
  'template_invitation', // ← Substitua pelo seu Template ID
  {
    to_email: email,
    to_name: companyName,
    user_type: type === 'cliente' ? 'Cliente' : 'Parceiro',
    invitation_link: url,
    company_name: companyName,
  },
  'YOUR_PUBLIC_KEY' // ← Substitua pela sua Public Key
);
```

## Teste
1. Tente enviar um convite
2. Verifique se o email chegou na caixa de entrada
3. Se não funcionar, verifique o console para erros

## Limites do Plano Gratuito
- 200 emails/mês
- Para mais, considere upgrade ou usar Resend + Supabase
