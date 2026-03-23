/**
 * CheckoutFlow - Fluxo de contratação de planos
 *
 * INSTRUÇÃO PARA FUTURA API DE PAGAMENTOS:
 * Para habilitar checkout automático, implemente:
 *
 * 1. Gateway: Integre Stripe, PagSeguro, Asaas ou similar.
 * 2. Step 2 (Forma de Pagamento): Substituir o botão "Falar com Especialista" por:
 *    - Formulário de cartão (ou PIX/boleto)
 *    - Chamada à API do gateway com: plan.planName, valorMensal, plan.setupFee, prazoMeses
 * 3. 1ª Cobrança: cobrar primeiraCobranca (Setup + 1ª mensalidade) na aprovação
 * 4. Recorrência: configurar cobrança mensal de valorMensal pelo prazoMeses
 * 5. Sucesso: redirecionar para confirmação e ativar assinatura da empresa
 *
 * Dados disponíveis para envio: plan, valorMensal, valorTotalContrato, primeiraCobranca, prazoMeses
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, ShoppingCart, ArrowLeft, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/config/contato";
import type { CalculatedPlan } from "./PlanDiscoveryFlow";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const PRAZO_OPCOES = [
  { meses: 12, label: "12 meses", discount: null },
  { meses: 24, label: "24 meses", discount: "-10% OFF" },
  { meses: 36, label: "36 meses", discount: "-15% OFF" },
];

interface CheckoutFlowProps {
  plan: CalculatedPlan;
  onClose: () => void;
}

export const CheckoutFlow = ({ plan, onClose }: CheckoutFlowProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [prazoMeses, setPrazoMeses] = useState(plan.prazoMeses ?? 12);

  const discountMultiplier = prazoMeses === 12 ? 1 : prazoMeses === 24 ? 0.9 : 0.85;
  const valorMensal = Math.round(plan.monthlyPrice * discountMultiplier);
  const valorTotalContrato = valorMensal * prazoMeses;
  const primeiraCobranca = plan.setupFee + valorMensal;

  const handleFalarEspecialista = () => {
    window.open(whatsappUrl(), "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <header className="sticky top-0 z-10 bg-white border-b flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-gray-600" />
          <h1 className="font-montserrat text-lg font-bold text-gray-900">Contratar Plano</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 border-green-200 hover:bg-green-50"
            onClick={handleFalarEspecialista}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Falar com Especialista
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ← Voltar
          </Button>
        </div>
      </header>

      <div className="flex justify-center gap-2 px-6 py-3 border-b bg-gray-50/50">
        <span
          className={cn(
            "flex items-center gap-2 font-lato text-sm font-medium",
            step === 1 ? "text-[#0A1628]" : "text-muted-foreground"
          )}
        >
          <Calendar className="h-4 w-4" />
          Prazo do Contrato
        </span>
        <span className="text-muted-foreground">/</span>
        <span
          className={cn(
            "flex items-center gap-2 font-lato text-sm font-medium",
            step === 2 ? "text-[#0A1628]" : "text-muted-foreground"
          )}
        >
          <CreditCard className="h-4 w-4" />
          Forma de Pagamento
        </span>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 ? (
              <div>
                <h2 className="font-montserrat text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5" />
                  Prazo do Contrato
                </h2>
                <p className="font-lato text-muted-foreground mb-6">
                  Escolha o prazo do seu contrato. Contratos mais longos oferecem descontos progressivos.
                </p>
                <p className="font-lato text-sm font-medium text-gray-900 mb-3">Selecione o Prazo</p>
                <div className="grid grid-cols-3 gap-4">
                  {PRAZO_OPCOES.map((op) => (
                    <button
                      key={op.meses}
                      type="button"
                      onClick={() => setPrazoMeses(op.meses)}
                      className={cn(
                        "rounded-lg border-2 p-6 flex flex-col items-center gap-2 transition-colors",
                        prazoMeses === op.meses
                          ? "border-[#0A1628] bg-[#0A1628]/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <Calendar className="h-8 w-8 text-gray-500" />
                      <span className="font-montserrat text-2xl font-bold text-gray-900">{op.meses}</span>
                      <span className="font-lato text-sm text-muted-foreground">meses</span>
                      {op.discount && (
                        <span className="font-lato text-sm font-medium text-green-600">{op.discount}</span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="font-lato text-xs text-muted-foreground mt-4">
                  Contratos de 24 e 36 meses oferecem descontos progressivos sobre o valor mensal.
                </p>
              </div>
            ) : (
              <div>
                <h2 className="font-montserrat text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                  <CreditCard className="h-5 w-5" />
                  Forma de Pagamento
                </h2>
                {/* TODO: Integrar API de pagamento - ver JSDoc no início do arquivo */}
                <p className="font-lato text-muted-foreground mb-6">
                  Em breve: integração com gateway de pagamento. Entre em contato com nosso especialista para concluir a contratação.
                </p>
                <p className="font-lato text-sm text-muted-foreground italic mb-6">
                  [Área reservada para conectar API de pagamento – cartão, PIX ou boleto]
                </p>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleFalarEspecialista}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Falar com Especialista para concluir
                </Button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-gray-50/50 p-5 sticky top-24">
              <h3 className="font-montserrat font-bold text-gray-900 mb-4">Resumo do Pedido</h3>
              <div className="space-y-2 font-lato text-sm">
                <p className="font-semibold text-gray-900">{plan.planName}</p>
                <p className="text-muted-foreground">Para grupos empresariais com múltiplas subsidiárias</p>
                <p className="font-bold text-gray-900 pt-2">{formatCurrency(valorMensal)}/mês</p>
              </div>
              <hr className="my-4" />
              <div className="space-y-1 font-lato text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal mensal</span>
                  <span>{formatCurrency(valorMensal)}</span>
                </div>
                <div className="flex justify-between font-medium text-gray-900">
                  <span>Valor mensal</span>
                  <span>{formatCurrency(valorMensal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Prazo</span>
                  <span>{prazoMeses} meses</span>
                </div>
                <div className="flex justify-between font-medium text-gray-900">
                  <span>Valor total do contrato</span>
                  <span>{formatCurrency(valorTotalContrato)}</span>
                </div>
                <div className="flex justify-between font-medium text-gray-900">
                  <span>Taxa de Setup</span>
                  <span>{formatCurrency(plan.setupFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-2">
                  <span>1ª Cobrança (Setup + mensal)</span>
                  <span>{formatCurrency(primeiraCobranca)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button variant="ghost" onClick={step === 1 ? onClose : () => setStep(1)}>
            ← Voltar
          </Button>
          {step === 1 ? (
            <Button
              className="bg-[#0A1628] hover:bg-[#0E254E]"
              onClick={() => setStep(2)}
            >
              Continuar →
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
