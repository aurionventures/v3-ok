import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator, X, MessageCircle, Sparkles, Target, Crown, TrendingUp, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/config/contato";
import { getPlanos } from "@/data/planosStorage";

const FATURAMENTO_OPCOES = [
  "Até R$ 5 mi",
  "R$ 5 mi a R$ 20 mi",
  "R$ 20 mi a R$ 100 mi",
  "R$ 100 mi a R$ 500 mi",
  "Acima de R$ 500 mi",
];

const MATURIDADE_OPCOES = [
  "Inicial",
  "Em estruturação",
  "Intermediária",
  "Avançada",
  "Profissional",
];

const PRAZO_OPCOES = [
  { meses: 12, label: "12 meses" },
  { meses: 24, label: "24 meses", discount: "-10% OFF" },
  { meses: 36, label: "36 meses", discount: "-15% OFF" },
] as const;

export interface DiscoveryFormData {
  faturamento: string;
  empresas: number;
  reunioesAno: number;
  maturidade: string;
  conselhos: number;
  comites: number;
  usuariosEsperados: number;
  prazoMeses: 12 | 24 | 36;
}

export interface CalculatedPlan {
  planName: string;
  planSubtitle: string;
  complexityIndex: number;
  complexityLabel: "BAIXA" | "MODERADA" | "ALTA" | "MUITO ALTA";
  complexityPercent: number;
  description: string;
  monthlyPrice: number;
  monthlyPriceDisplay: number;
  annualPrice: number;
  annualSavings: number;
  annualSavingsMonths: number;
  setupFee: number;
  setupFeeDiscount: string;
  prazoMeses: 12 | 24 | 36;
}

const defaultForm: DiscoveryFormData = {
  faturamento: "",
  empresas: 1,
  reunioesAno: 12,
  maturidade: "",
  conselhos: 1,
  comites: 0,
  usuariosEsperados: 0,
  prazoMeses: 12,
};

function calculatePlan(form: DiscoveryFormData): CalculatedPlan {
  const empresas = form.empresas || 1;
  const conselhos = form.conselhos || 1;
  const reunioes = form.reunioesAno || 12;
  const prazoMeses = form.prazoMeses || 12;
  const planos = getPlanos();
  const complexity = Math.min(10, Math.max(1, empresas * 0.8 + conselhos * 0.5 + reunioes / 12));
  let percent = 25;
  if (complexity <= 3) percent = 25;
  else if (complexity <= 5) percent = 45;
  else if (complexity <= 7) percent = 65;
  else percent = 85;
  const label = percent <= 35 ? "BAIXA" : percent <= 55 ? "MODERADA" : percent <= 75 ? "ALTA" : "MUITO ALTA";
  const planIndex = Math.min(percent <= 35 ? 0 : percent <= 55 ? 1 : percent <= 75 ? 2 : 3, planos.length - 1);
  const plano = planos[Math.max(0, planIndex)] ?? planos[0] ?? { id: "1", name: "Essencial", description: "Plano básico", empresas: 1, usuarios: "∞", valor: 3490 };
  const monthlyPrice = plano.valor ?? 7490;
  const setupFee = monthlyPrice * 2;
  const discountMultiplier = prazoMeses === 12 ? 1 : prazoMeses === 24 ? 0.9 : 0.85;
  const valorMensalComDesconto = Math.round(monthlyPrice * discountMultiplier);
  const annualPrice = valorMensalComDesconto * prazoMeses;
  const annualSavings = prazoMeses === 12 ? Math.round(monthlyPrice * 2) : Math.round(monthlyPrice * prazoMeses * (1 - discountMultiplier));
  const annualSavingsMonths = prazoMeses === 12 ? 2 : 0;
  const monthlyPriceDisplay = prazoMeses === 12 ? monthlyPrice : valorMensalComDesconto;
  return {
    planName: plano.name,
    planSubtitle: plano.description ?? "Ideal para sua empresa",
    complexityIndex: Math.round(complexity * 10) / 10,
    complexityLabel: label,
    complexityPercent: percent,
    description: `Sua empresa possui ${empresas} empresa(s), ${conselhos} conselho(s), com estimativa de ${reunioes} reuniões por ano. O plano ${plano.name} suporta até ${empresas} empresa(s) e usuários ilimitados, sendo ideal para sua governança.`,
    monthlyPrice,
    monthlyPriceDisplay,
    annualPrice,
    annualSavings,
    annualSavingsMonths,
    setupFee,
    setupFeeDiscount: prazoMeses === 12 ? "50% OFF anual" : prazoMeses === 24 ? "10% OFF" : "15% OFF",
    prazoMeses,
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

interface PlanDiscoveryFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContract: (plan: CalculatedPlan) => void;
}

export const PlanDiscoveryFlow = ({ open, onOpenChange, onContract }: PlanDiscoveryFlowProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<DiscoveryFormData>(defaultForm);
  const [result, setResult] = useState<CalculatedPlan | null>(null);

  const handleClose = (open: boolean) => {
    if (!open) {
      setStep(1);
      setForm(defaultForm);
      setResult(null);
    }
    onOpenChange(open);
  };

  const handleSubmit = () => {
    if (!form.faturamento || !form.maturidade) return;
    const plan = calculatePlan(form);
    setResult(plan);
    setStep(2);
  };

  const handleRefazer = () => {
    setStep(1);
    setResult(null);
  };

  const handleContract = () => {
    if (result) {
      onOpenChange(false);
      setStep(1);
      setResult(null);
      onContract(result);
    }
  };

  const handleFalarEspecialista = () => {
    window.open(whatsappUrl(), "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          "max-w-2xl p-0 gap-0 overflow-hidden",
          step === 2 && "max-w-4xl"
        )}
      >
        {step === 1 ? (
          <>
            <DialogHeader className="flex flex-row items-start justify-between space-y-0 px-6 pt-6 pb-4 border-b">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-gray-600" />
                <div>
                  <DialogTitle className="font-montserrat text-xl font-bold text-gray-900">
                    Descubra Seu Plano Ideal
                  </DialogTitle>
                  <p className="font-lato text-sm text-muted-foreground mt-0.5">
                    Responda as perguntas abaixo (leva 2 minutos).
                  </p>
                </div>
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
              </div>
            </DialogHeader>
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="faturamento" className="font-lato">
                    Faturamento anual <span className="text-red-500">*</span>
                  </Label>
                  <Select value={form.faturamento} onValueChange={(v) => setForm((p) => ({ ...p, faturamento: v }))}>
                    <SelectTrigger id="faturamento">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {FATURAMENTO_OPCOES.map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maturidade" className="font-lato">
                    Maturidade da governança <span className="text-red-500">*</span>
                  </Label>
                  <Select value={form.maturidade} onValueChange={(v) => setForm((p) => ({ ...p, maturidade: v }))}>
                    <SelectTrigger id="maturidade">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {MATURIDADE_OPCOES.map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresas" className="font-lato">
                    Empresas <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="empresas"
                    type="number"
                    min={1}
                    value={form.empresas || ""}
                    onChange={(e) => setForm((p) => ({ ...p, empresas: parseInt(e.target.value, 10) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reunioes" className="font-lato">Reuniões/ano</Label>
                  <Input
                    id="reunioes"
                    type="number"
                    min={0}
                    value={form.reunioesAno ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, reunioesAno: parseInt(e.target.value, 10) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conselhos" className="font-lato">Conselhos</Label>
                  <Input
                    id="conselhos"
                    type="number"
                    min={0}
                    value={form.conselhos ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, conselhos: parseInt(e.target.value, 10) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comites" className="font-lato">Comitês</Label>
                  <Input
                    id="comites"
                    type="number"
                    min={0}
                    value={form.comites ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, comites: parseInt(e.target.value, 10) || 0 }))}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="usuarios" className="font-lato">Usuários esperados (ilimitados)</Label>
                  <Input
                    id="usuarios"
                    type="number"
                    min={0}
                    value={form.usuariosEsperados ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, usuariosEsperados: parseInt(e.target.value, 10) || 0 }))}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="font-lato">Prazo do contrato</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRAZO_OPCOES.map((op) => (
                      <button
                        key={op.meses}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, prazoMeses: op.meses }))}
                        className={cn(
                          "rounded-lg border-2 p-3 flex flex-col items-center gap-1 transition-colors font-lato text-sm",
                          form.prazoMeses === op.meses
                            ? "border-legacy-gold bg-legacy-gold/10 text-legacy-500"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <span className="font-montserrat font-semibold">{op.meses}</span>
                        <span className="text-xs text-muted-foreground">meses</span>
                        {op.discount && (
                          <span className="text-xs font-medium text-green-600">{op.discount}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                className="w-full mt-6 bg-legacy-gold text-legacy-500 hover:bg-legacy-gold hover:text-legacy-500 active:bg-legacy-gold active:text-legacy-500 focus:bg-legacy-gold focus:text-legacy-500 font-montserrat font-semibold py-6"
                onClick={handleSubmit}
                disabled={!form.faturamento || !form.maturidade}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Calcular Plano e Investimento
              </Button>
              <div className="mt-6 pt-4 border-t">
                <p className="font-montserrat font-semibold text-gray-900 mb-2">Como preencher:</p>
                <ul className="font-lato text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Campos marcados com * são obrigatórios</li>
                  <li>Preencha o número de empresas que você possui ou administra</li>
                  <li>Informe a quantidade de conselhos, comitês e reuniões anuais (opcional)</li>
                  <li>O número de usuários é apenas informativo - todos os planos incluem usuários ilimitados</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          result && (
            <>
              <DialogHeader className="flex flex-row items-center justify-between space-y-0 px-6 pt-6 pb-4 border-b">
                <div className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-green-600" />
                  <DialogTitle className="font-montserrat text-xl font-bold text-gray-900">
                    Seu Plano Ideal
                  </DialogTitle>
                </div>
              </DialogHeader>
              <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg border-2 border-legacy-gold/30 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-legacy-gold/20 p-2">
                      <Crown className="h-5 w-5 text-legacy-gold" />
                    </div>
                    <div>
                      <p className="font-montserrat font-bold text-lg text-gray-900">{result.planName}</p>
                      <p className="font-lato text-sm text-muted-foreground">{result.planSubtitle}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-montserrat font-semibold text-gray-900 mb-2">Índice de Complexidade</p>
                    <p className="text-3xl font-bold text-green-600">{result.complexityIndex}</p>
                    <p className="text-sm font-medium text-green-600">{result.complexityLabel}</p>
                    <div className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-[#0A1628] rounded-full transition-all"
                        style={{ width: `${result.complexityPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Baixa</span>
                      <span>Moderada</span>
                      <span>Alta</span>
                      <span>Muito Alta</span>
                    </div>
                  </div>
                  <p className="font-lato text-sm text-muted-foreground">{result.description}</p>
                </div>
                <div className="rounded-lg border-2 border-green-200 bg-green-50/30 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <p className="font-montserrat font-bold text-green-700 uppercase text-sm">Seu Investimento</p>
                  </div>
                  <div>
                    <p className="font-lato text-sm text-muted-foreground">Mensal</p>
                    <p className="font-montserrat text-2xl font-bold text-gray-900">{formatCurrency(result.monthlyPriceDisplay)} /mês</p>
                  </div>
                  <div>
                    <p className="font-lato text-sm text-muted-foreground">{result.prazoMeses === 12 ? "Anual" : `Valor (${result.prazoMeses} meses)`}</p>
                    <p className="font-montserrat text-2xl font-bold text-gray-900">{formatCurrency(result.annualPrice)} {result.prazoMeses === 12 ? "/ano" : `/${result.prazoMeses} meses`}</p>
                  </div>
                  {result.annualSavings > 0 && (
                    <div className="rounded-full bg-green-600 text-white text-center py-2 px-3 text-sm font-medium">
                      Economize {formatCurrency(result.annualSavings)}
                      {result.annualSavingsMonths > 0 ? ` (${result.annualSavingsMonths} meses)` : " com desconto"}
                    </div>
                  )}
                  <div>
                    <p className="font-lato text-sm text-muted-foreground">Taxa de Setup <span className="text-xs">Única vez</span></p>
                    <p className="font-montserrat font-bold text-gray-900">{formatCurrency(result.setupFee)}</p>
                    <p className="font-lato text-xs text-green-600">{result.setupFeeDiscount}</p>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 font-montserrat font-semibold"
                      onClick={handleContract}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Contratar Plano →
                    </Button>
                    <Button variant="outline" onClick={handleFalarEspecialista}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Falar com Especialista
                    </Button>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 text-center">
                <button
                  type="button"
                  className="font-lato text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  onClick={handleRefazer}
                >
                  ← Refazer cálculo
                </button>
              </div>
            </>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};
