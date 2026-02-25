/**
 * Configuração de Tiers de Parceiros – comissões e responsabilidades por tier.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, TrendingUp, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export interface TierCommission {
  setup: number;
  recorrente: number;
  meses: number;
}

export interface TierConfig {
  id: string;
  name: string;
  description: string;
  label: string;
  icon: React.ElementType;
  vendasOriginadas: TierCommission;
  vendasRecebidas?: TierCommission;
  responsabilidades: string[];
}

const DEFAULT_TIER_1: TierConfig = {
  id: "tier1",
  name: "Parceiro Comercial",
  description: "Atuação completa no ciclo de vendas",
  label: "TIER 1 COMMERCIAL",
  icon: Shield,
  vendasOriginadas: { setup: 15, recorrente: 15, meses: 3 },
  vendasRecebidas: { setup: 15, recorrente: 5, meses: 3 },
  responsabilidades: [
    "Conduz reuniões comerciais do início ao fim",
    "Apresenta propostas comerciais e técnicas",
    "Negocia termos, condições e prazos",
  ],
};

const DEFAULT_TIER_2: TierConfig = {
  id: "tier2",
  name: "Afiliado Qualificado",
  description: "Prospecção ativa e qualificação inicial",
  label: "TIER 2 QUALIFIED",
  icon: TrendingUp,
  vendasOriginadas: { setup: 10, recorrente: 5, meses: 3 },
  responsabilidades: [
    "Valida o fit do lead com o perfil ICP",
    "Realiza apresentação inicial do produto",
    "Aquece o lead e gera interesse genuíno",
    "Transfere o lead pronto para o time comercial",
  ],
};

function TierCard({
  tier,
  onChange,
  showVendasRecebidas = true,
}: {
  tier: TierConfig;
  onChange: (t: TierConfig) => void;
  showVendasRecebidas?: boolean;
}) {
  const Icon = tier.icon;

  const update = (patch: Partial<TierConfig>) => {
    onChange({ ...tier, ...patch });
  };

  const updateOriginadas = (patch: Partial<TierCommission>) => {
    update({ vendasOriginadas: { ...tier.vendasOriginadas, ...patch } });
  };

  const updateRecebidas = (patch: Partial<TierCommission>) => {
    if (!tier.vendasRecebidas) return;
    update({ vendasRecebidas: { ...tier.vendasRecebidas, ...patch } });
  };

  const addResponsabilidade = () => {
    update({ responsabilidades: [...tier.responsabilidades, ""] });
  };

  const setResponsabilidade = (index: number, value: string) => {
    const next = [...tier.responsabilidades];
    next[index] = value;
    update({ responsabilidades: next });
  };

  const removeResponsabilidade = (index: number) => {
    update({
      responsabilidades: tier.responsabilidades.filter((_, i) => i !== index),
    });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg">{tier.name}</CardTitle>
            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {tier.label}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{tier.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`name-${tier.id}`}>Nome do Tier</Label>
          <Input
            id={`name-${tier.id}`}
            value={tier.name}
            onChange={(e) => update({ name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`desc-${tier.id}`}>Descrição</Label>
          <Textarea
            id={`desc-${tier.id}`}
            value={tier.description}
            onChange={(e) => update({ description: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-3">
          <Label>Comissões - Vendas Originadas</Label>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Setup (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={tier.vendasOriginadas.setup}
                onChange={(e) => updateOriginadas({ setup: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Recorrente (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={tier.vendasOriginadas.recorrente}
                onChange={(e) => updateOriginadas({ recorrente: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Meses</Label>
              <Input
                type="number"
                min={0}
                value={tier.vendasOriginadas.meses}
                onChange={(e) => updateOriginadas({ meses: Number(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>

        {showVendasRecebidas && tier.vendasRecebidas && (
          <div className="space-y-3">
            <Label>Comissões - Vendas Recebidas</Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Setup (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={tier.vendasRecebidas.setup}
                  onChange={(e) => updateRecebidas({ setup: Number(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Recorrente (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={tier.vendasRecebidas.recorrente}
                  onChange={(e) => updateRecebidas({ recorrente: Number(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Meses</Label>
                <Input
                  type="number"
                  min={0}
                  value={tier.vendasRecebidas.meses}
                  onChange={(e) => updateRecebidas({ meses: Number(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Responsabilidades</Label>
          <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addResponsabilidade}>
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
          <div className="flex flex-col gap-2">
            {tier.responsabilidades.map((r, i) => (
              <div key={i} className="flex items-center gap-2 rounded-md border bg-gray-50 px-3 py-2">
                <Input
                  value={r}
                  onChange={(e) => setResponsabilidade(i, e.target.value)}
                  className="flex-1 border-0 bg-transparent"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeResponsabilidade(i)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPartnersTiers() {
  const navigate = useNavigate();
  const [tier1, setTier1] = useState<TierConfig>(DEFAULT_TIER_1);
  const [tier2, setTier2] = useState<TierConfig>(DEFAULT_TIER_2);

  const handleRestore = () => {
    setTier1(JSON.parse(JSON.stringify(DEFAULT_TIER_1)));
    setTier2(JSON.parse(JSON.stringify(DEFAULT_TIER_2)));
  };

  const handleSave = () => {
    // TODO: persistir via API
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Configuração de Tiers de Parceiros"
          rightExtra={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/partners")}>
                Voltar
              </Button>
              <Button variant="outline" size="sm" onClick={handleRestore}>
                Restaurar Padrão
              </Button>
              <Button className="bg-legacy-500 hover:bg-legacy-600 text-white" size="sm" onClick={handleSave}>
                Salvar Configurações
              </Button>
            </div>
          }
        />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Configuração de Tiers de Parceiros</h1>
            <p className="text-gray-500">Gerencie as comissões e configurações de cada Tier de parceiro</p>
          </div>

          <Alert className="mb-6 border-gray-200 bg-gray-50">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              As configurações de Tier afetam diretamente os contratos gerados e os cálculos de comissões.
              Alterações aqui serão refletidas automaticamente nos novos contratos de parceiros.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TierCard tier={tier1} onChange={setTier1} showVendasRecebidas />
            <TierCard tier={tier2} onChange={setTier2} showVendasRecebidas={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
