import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Settings, 
  Save, 
  RefreshCw, 
  DollarSign, 
  TrendingUp,
  Users,
  Award,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { PartnerTier, TIER_CONFIGS, TierConfig } from "@/config/partnerTiers";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TIER_ICONS = {
  tier_1_commercial: Award,
  tier_2_qualified: TrendingUp,
  tier_3_simple: Users,
  tier_4_premium: Sparkles,
};

const TIER_COLORS = {
  tier_1_commercial: "bg-blue-500",
  tier_2_qualified: "bg-green-500",
  tier_3_simple: "bg-yellow-500",
  tier_4_premium: "bg-purple-500",
};

export default function AdminTierConfig() {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<Record<PartnerTier, TierConfig>>(TIER_CONFIGS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = () => {
    try {
      const stored = localStorage.getItem('partner_tier_configs');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge com configurações padrão para garantir que todos os campos existam
        const merged: Record<PartnerTier, TierConfig> = {} as Record<PartnerTier, TierConfig>;
        Object.keys(TIER_CONFIGS).forEach((key) => {
          const tierKey = key as PartnerTier;
          merged[tierKey] = {
            ...TIER_CONFIGS[tierKey],
            ...(parsed[tierKey] || {})
          };
        });
        setConfigs(merged);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações de Tier');
    }
  };

  const saveConfigs = async () => {
    setSaving(true);
    try {
      localStorage.setItem('partner_tier_configs', JSON.stringify(configs));
      
      // Também atualizar o arquivo de configuração em memória para uso imediato
      Object.keys(configs).forEach((key) => {
        const tierKey = key as PartnerTier;
        TIER_CONFIGS[tierKey] = configs[tierKey];
      });

      toast.success('Configurações de Tier salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações de Tier');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão? Isso irá sobrescrever todas as alterações.')) {
      setConfigs(TIER_CONFIGS);
      localStorage.removeItem('partner_tier_configs');
      toast.success('Configurações restauradas para o padrão');
    }
  };

  const updateConfig = (tier: PartnerTier, field: keyof TierConfig, value: any) => {
    setConfigs(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [field]: value
      }
    }));
  };

  const updateResponsibility = (tier: PartnerTier, index: number, value: string) => {
    setConfigs(prev => {
      const newResponsibilities = [...(prev[tier].responsibilities || [])];
      newResponsibilities[index] = value;
      return {
        ...prev,
        [tier]: {
          ...prev[tier],
          responsibilities: newResponsibilities
        }
      };
    });
  };

  const addResponsibility = (tier: PartnerTier) => {
    setConfigs(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        responsibilities: [...(prev[tier].responsibilities || []), '']
      }
    }));
  };

  const removeResponsibility = (tier: PartnerTier, index: number) => {
    setConfigs(prev => {
      const newResponsibilities = [...(prev[tier].responsibilities || [])];
      newResponsibilities.splice(index, 1);
      return {
        ...prev,
        [tier]: {
          ...prev[tier],
          responsibilities: newResponsibilities
        }
      };
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Configuração de Tiers de Parceiros" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">
                  Gerencie as comissões e configurações de cada Tier de parceiro
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetToDefaults} disabled={saving}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restaurar Padrão
                </Button>
                <Button onClick={saveConfigs} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                As configurações de Tier afetam diretamente os contratos gerados e os cálculos de comissões. 
                Alterações aqui serão refletidas automaticamente nos novos contratos de parceiros.
              </AlertDescription>
            </Alert>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.keys(configs).map((tierKey) => {
            const tier = tierKey as PartnerTier;
            const config = configs[tier];
            const TierIcon = TIER_ICONS[tier];
            const tierColor = TIER_COLORS[tier];

            return (
              <Card key={tier}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${tierColor} p-2 rounded-lg`}>
                      <TierIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{config.tier_name}</CardTitle>
                      <CardDescription className="mt-1">
                        {config.tier_description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {tierKey.replace('tier_', 'Tier ').replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Informações Básicas */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Informações Básicas</Label>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor={`${tier}-name`} className="text-xs">
                          Nome do Tier
                        </Label>
                        <Input
                          id={`${tier}-name`}
                          value={config.tier_name}
                          onChange={(e) => updateConfig(tier, 'tier_name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${tier}-description`} className="text-xs">
                          Descrição
                        </Label>
                        <Textarea
                          id={`${tier}-description`}
                          value={config.tier_description}
                          onChange={(e) => updateConfig(tier, 'tier_description', e.target.value)}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Comissões para Vendas Originadas */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Comissões - Vendas Originadas
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label htmlFor={`${tier}-orig-setup`} className="text-xs">
                          Setup (%)
                        </Label>
                        <Input
                          id={`${tier}-orig-setup`}
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={config.originated_setup_commission}
                          onChange={(e) => updateConfig(tier, 'originated_setup_commission', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${tier}-orig-recur`} className="text-xs">
                          Recorrente (%)
                        </Label>
                        <Input
                          id={`${tier}-orig-recur`}
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={config.originated_recurring_commission}
                          onChange={(e) => updateConfig(tier, 'originated_recurring_commission', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${tier}-orig-months`} className="text-xs">
                          Meses
                        </Label>
                        <Input
                          id={`${tier}-orig-months`}
                          type="number"
                          min="0"
                          value={config.originated_recurring_months}
                          onChange={(e) => updateConfig(tier, 'originated_recurring_months', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Comissões para Vendas Recebidas (apenas Tier 1) */}
                  {tier === 'tier_1_commercial' && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Comissões - Vendas Recebidas
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label htmlFor={`${tier}-recv-setup`} className="text-xs">
                              Setup (%)
                            </Label>
                            <Input
                              id={`${tier}-recv-setup`}
                              type="number"
                              step="0.1"
                              min="0"
                              max="100"
                              value={config.received_setup_commission}
                              onChange={(e) => updateConfig(tier, 'received_setup_commission', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`${tier}-recv-recur`} className="text-xs">
                              Recorrente (%)
                            </Label>
                            <Input
                              id={`${tier}-recv-recur`}
                              type="number"
                              step="0.1"
                              min="0"
                              max="100"
                              value={config.received_recurring_commission}
                              onChange={(e) => updateConfig(tier, 'received_recurring_commission', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`${tier}-recv-months`} className="text-xs">
                              Meses
                            </Label>
                            <Input
                              id={`${tier}-recv-months`}
                              type="number"
                              min="0"
                              value={config.received_recurring_months}
                              onChange={(e) => updateConfig(tier, 'received_recurring_months', parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Comissão Customizada (Tier 4) */}
                  {tier === 'tier_4_premium' && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <Label htmlFor={`${tier}-custom`} className="text-sm font-semibold">
                          Comissão Customizada (% sobre valor líquido)
                        </Label>
                        <Input
                          id={`${tier}-custom`}
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={config.custom_contract_percentage}
                          onChange={(e) => updateConfig(tier, 'custom_contract_percentage', parseFloat(e.target.value) || 0)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Para Tier 4, a comissão é calculada como porcentagem sobre o valor líquido total do contrato
                        </p>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Responsabilidades */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Responsabilidades</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addResponsibility(tier)}
                        className="h-7 text-xs"
                      >
                        + Adicionar
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(config.responsibilities || []).map((resp, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={resp}
                            onChange={(e) => updateResponsibility(tier, index, e.target.value)}
                            placeholder="Descreva uma responsabilidade do Tier"
                            className="text-sm"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeResponsibility(tier, index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      {(!config.responsibilities || config.responsibilities.length === 0) && (
                        <p className="text-xs text-muted-foreground italic">Nenhuma responsabilidade definida</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            })}
        </div>
          </div>
        </main>
      </div>
    </div>
  );
}
