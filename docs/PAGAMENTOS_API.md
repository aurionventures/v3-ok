# API de Pagamentos - CheckoutFlow

## Visão geral

O checkout de planos (`CheckoutFlow.tsx`) está preparado para integração com gateway de pagamento. O fluxo atual redireciona para contato com especialista via WhatsApp.

## Instruções para implementação

1. **Gateway**: Integre Stripe, PagSeguro, Asaas ou similar.
2. **Forma de Pagamento**: Substituir o passo "Conectar API de pagamentos" por:
   - Formulário de cartão (ou PIX/boleto)
   - Chamada à API do gateway com: `plan.planName`, `valorMensal`, `plan.setupFee`, `prazoMeses`
3. **1ª Cobrança**: cobrar `primeiraCobranca` (Setup + 1ª mensalidade) na aprovação
4. **Recorrência**: configurar cobrança mensal de `valorMensal` pelo `prazoMeses`
5. **Sucesso**: redirecionar para confirmação e ativar assinatura da empresa

## Dados disponíveis para envio

- `plan.planName` – nome do plano
- `valorMensal` – valor mensal (com desconto conforme prazo)
- `valorTotalContrato` – valor total do período
- `plan.setupFee` – taxa de setup (mensal × 2)
- `primeiraCobranca` – Setup + primeira mensalidade
- `prazoMeses` – 12, 24 ou 36 meses
