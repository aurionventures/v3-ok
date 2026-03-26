# Fluxo PLG Legacy OS - Diagrama Completo

Este documento apresenta o fluxo completo de Product-Led Growth (PLG) da plataforma Legacy OS, incluindo as duas formas de acesso ao Discovery: via ISCA (isca) ou através de link direto de Parceiro/Afiliado.

## Diagrama Mermaid

```mermaid
flowchart TD
    %% Entrada 1: Fluxo da ISCA
    Start1[Usuário acessa Landing Page] --> ISCA[ISCA: Quiz GovMetrix]
    ISCA --> ISCA_Lead[Captura de Lead<br/>Nome, Email, Empresa, WhatsApp]
    ISCA_Lead --> ISCA_Result[Resultado ISCA<br/>Score de Maturidade<br/>Estágio de Governança]
    ISCA_Result --> Discovery1[Discovery: Quiz de<br/>Descoberta de Plano]
    
    %% Entrada 2: Link do Parceiro/Afiliado
    Partner[Parceiro/Afiliado<br/>compartilha link] --> AffiliateLink[Link de Afiliado<br/>/plan-discovery?ref=aff_XXXXX]
    AffiliateLink --> Discovery2[Discovery: Quiz de<br/>Descoberta de Plano<br/>Token capturado]
    
    %% Convergência no Discovery
    Discovery1 --> Discovery_Quiz[Quiz de Descoberta<br/>- Faturamento<br/>- Conselho<br/>- Sucessão<br/>- ESG<br/>- Colaboradores<br/>- Contato]
    Discovery2 --> Discovery_Quiz
    
    %% Pré-população de dados (se veio da ISCA)
    Discovery_Quiz -.->|Se veio da ISCA| PrePopulate[Pré-população de dados<br/>do resultado ISCA]
    PrePopulate -.-> Discovery_Quiz
    
    %% Captura de token de afiliado (se veio do parceiro)
    Discovery_Quiz -.->|Se veio do parceiro| CaptureToken[Captura e armazena<br/>token de afiliado]
    CaptureToken -.-> Discovery_Quiz
    
    %% Fluxo após Discovery
    Discovery_Quiz --> PlanResult[Plan Result<br/>Plano Recomendado<br/>com base no quiz]
    PlanResult --> Checkout[Checkout<br/>Seleção de Plano<br/>Prazo de Contrato<br/>Método de Pagamento]
    
    %% Opções de Checkout
    Checkout --> CheckoutStripe{Forma de<br/>Pagamento?}
    CheckoutStripe -->|Cartão| StripeCheckout[Stripe Checkout<br/>Pagamento via Cartão]
    CheckoutStripe -->|PIX/Boleto| ContractCheckout[Contract Checkout<br/>Pagamento via PIX/Boleto]
    
    %% Processamento de Pagamento
    StripeCheckout --> PaymentProcessing[Processamento<br/>de Pagamento]
    ContractCheckout --> PaymentProcessing
    
    %% Confirmação de Pagamento
    PaymentProcessing --> PaymentConfirmed[Pagamento Confirmado<br/>Webhook recebido]
    PaymentConfirmed --> PlanActivation[Plan Activation<br/>Ativação do Plano]
    
    %% Onboarding
    PlanActivation --> Onboarding[Onboarding Wizard<br/>Configuração Inicial<br/>da Empresa]
    Onboarding --> Dashboard[Dashboard<br/>Plataforma Ativa]
    
    %% Rastreamento PLG
    ISCA -.->|trackEvent| PLGTracking[PLG Funnel Tracking<br/>isca_started]
    ISCA_Result -.->|trackEvent| PLGTracking2[PLG Funnel Tracking<br/>isca_completed]
    Discovery_Quiz -.->|trackEvent| PLGTracking3[PLG Funnel Tracking<br/>discovery_started]
    PlanResult -.->|trackEvent| PLGTracking4[PLG Funnel Tracking<br/>discovery_completed]
    Checkout -.->|trackEvent| PLGTracking5[PLG Funnel Tracking<br/>checkout_started]
    PaymentConfirmed -.->|trackEvent| PLGTracking6[PLG Funnel Tracking<br/>payment_completed]
    PlanActivation -.->|trackEvent| PLGTracking7[PLG Funnel Tracking<br/>activation_started]
    Dashboard -.->|trackEvent| PLGTracking8[PLG Funnel Tracking<br/>activation_completed]
    
    %% Atribuição de Lead
    AffiliateLink -.->|Atribui lead ao| PartnerTracking[Atribuição de Lead<br/>ao Parceiro/Afiliado<br/>via affiliate_token]
    PartnerTracking -.->|Salva em| PLGLeads[plg_leads<br/>partner_id / affiliate_token]
    
    %% Estilos
    classDef iscaFlow fill:#9333ea,stroke:#7c3aed,stroke-width:2px,color:#fff
    classDef partnerFlow fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
    classDef discovery fill:#10b981,stroke:#059669,stroke-width:3px,color:#fff
    classDef checkout fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    classDef payment fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
    classDef activation fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
    classDef tracking fill:#6b7280,stroke:#4b5563,stroke-width:1px,color:#fff,stroke-dasharray: 5 5
    
    class ISCA,ISCA_Lead,ISCA_Result,Discovery1 iscaFlow
    class Partner,AffiliateLink,Discovery2,PartnerTracking partnerFlow
    class Discovery_Quiz,PrePopulate,CaptureToken,PlanResult discovery
    class Checkout,CheckoutStripe,StripeCheckout,ContractCheckout checkout
    class PaymentProcessing,PaymentConfirmed payment
    class PlanActivation,Onboarding,Dashboard activation
    class PLGTracking,PLGTracking2,PLGTracking3,PLGTracking4,PLGTracking5,PLGTracking6,PLGTracking7,PLGTracking8,PLGLeads tracking
```

## Descrição do Fluxo

### Entrada 1: Fluxo da ISCA (Isca)

1. **ISCA (GovMetrix Quiz)**: O usuário acessa a landing page e inicia o quiz de diagnóstico de maturidade em governança corporativa.
2. **Captura de Lead**: Durante o quiz, são coletados dados do lead (nome, email, empresa, WhatsApp).
3. **Resultado ISCA**: Após completar o quiz, o usuário recebe seu score de maturidade e estágio de governança.
4. **Discovery**: O usuário é direcionado para o Quiz de Descoberta de Plano, onde os dados da ISCA são pré-populados.

### Entrada 2: Link do Parceiro/Afiliado

1. **Parceiro/Afiliado**: Um parceiro ou afiliado compartilha seu link único de afiliado.
2. **Link de Afiliado**: O link tem o formato `/plan-discovery?ref=aff_XXXXX`, onde `aff_XXXXX` é o token único do parceiro.
3. **Discovery**: O usuário acessa diretamente o Quiz de Descoberta de Plano, e o token de afiliado é capturado e armazenado para atribuição posterior.

### Convergência no Discovery

Ambos os fluxos convergem no **Quiz de Descoberta de Plano**, que coleta:
- Faturamento da empresa
- Existência de conselho
- Planejamento de sucessão
- Avaliação ESG
- Número de colaboradores
- Dados de contato

**Características especiais:**
- Se veio da ISCA: os dados são pré-populados com base no resultado do diagnóstico.
- Se veio do parceiro: o token de afiliado é capturado e armazenado para atribuição do lead.

### Fluxo Após Discovery

1. **Plan Result**: Apresenta o plano recomendado com base nas respostas do quiz.
2. **Checkout**: Usuário seleciona o plano, prazo de contrato e método de pagamento.
3. **Processamento de Pagamento**: 
   - **Cartão**: Via Stripe Checkout
   - **PIX/Boleto**: Via Contract Checkout (Asaas)
4. **Pagamento Confirmado**: Webhook confirma o pagamento.
5. **Plan Activation**: O plano é ativado.
6. **Onboarding**: Wizard de configuração inicial da empresa.
7. **Dashboard**: Usuário acessa a plataforma ativa.

### Rastreamento PLG

Todo o fluxo é rastreado através do sistema PLG Funnel Tracking, registrando eventos em cada etapa:
- `isca_started` / `isca_completed`
- `discovery_started` / `discovery_completed`
- `checkout_started` / `checkout_completed`
- `payment_started` / `payment_completed`
- `activation_started` / `activation_completed`

### Atribuição de Leads

Quando o usuário acessa via link de afiliado:
- O token `aff_XXXXX` é capturado e armazenado.
- O lead é atribuído ao parceiro/afiliado correspondente.
- Os dados são salvos na tabela `plg_leads` com `partner_id` ou `affiliate_token`.

## Tecnologias e Integrações

- **ISCA**: Quiz GovMetrix para diagnóstico de maturidade
- **Discovery**: Quiz de descoberta de plano personalizado
- **Stripe**: Processamento de pagamentos via cartão
- **Asaas**: Processamento de pagamentos via PIX/Boleto
- **Supabase**: Banco de dados e rastreamento PLG
- **LocalStorage**: Armazenamento temporário de dados do funil

## Métricas Rastreadas

- Tempo até Discovery (timeToDiscovery)
- Tempo até Checkout (timeToCheckout)
- Tempo até Pagamento (timeToPayment)
- Tempo até Ativação (timeToActivation)
- Tempo total da jornada (totalJourneyTime)
- Taxa de conversão por etapa
- Taxa de abandono (drop-off) por etapa
- Atribuição de leads por parceiro/afiliado
