import { useState } from "react";
import { usePricingConfig, PlanPricingMatrix } from "@/hooks/usePricingConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Star, Receipt, Calendar, Zap, FileDown } from "lucide-react";
import { PricingTablePDF } from "./PricingTablePDF";

export function MatrizPricingTab() {
  const { companySizes, subscriptionPlans, pricingMatrix, updatePricingMatrix, getPricing } = usePricingConfig();
  const [editingPricing, setEditingPricing] = useState<PlanPricingMatrix | null>(null);
  const [viewMode, setViewMode] = useState<'mensal' | 'anual' | 'setup'>('mensal');

  const handleSave = () => {
    if (!editingPricing) return;
    updatePricingMatrix(editingPricing);
    setEditingPricing(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(price);
  };

  const getDisplayPrice = (pricing: PlanPricingMatrix) => {
    switch (viewMode) {
      case 'anual':
        return pricing.annual_price;
      case 'setup':
        return pricing.setup_fee || 0;
      default:
        return pricing.monthly_price;
    }
  };

  const getPriceLabel = () => {
    switch (viewMode) {
      case 'anual':
        return '/ano';
      case 'setup':
        return '(único)';
      default:
        return '/mês';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle>Matriz de Pricing (Porte × Plano)</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Configure o preço mensal, anual e setup para cada combinação de porte e plano
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <PricingTablePDF viewMode={viewMode} />
              <PricingTablePDF viewMode="all" />
            </div>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'mensal' | 'anual' | 'setup')}>
              <TabsList>
                <TabsTrigger value="mensal" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  Mensal
                </TabsTrigger>
                <TabsTrigger value="anual" className="gap-1">
                  <Receipt className="h-3 w-3" />
                  Anual
                </TabsTrigger>
                <TabsTrigger value="setup" className="gap-1">
                  <Zap className="h-3 w-3" />
                  Setup
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left font-medium text-muted-foreground border-b">Porte \ Plano</th>
                {subscriptionPlans.map((plan) => (
                  <th key={plan.id} className="p-3 text-center font-medium border-b min-w-[140px]">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companySizes.map((size) => (
                <tr key={size.id} className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">{size.name}</td>
                  {subscriptionPlans.map((plan) => {
                    const pricing = getPricing(size.id, plan.id);
                    if (!pricing) return <td key={plan.id} className="p-3 text-center text-muted-foreground">—</td>;
                    
                    return (
                      <td key={plan.id} className="p-3">
                        <div className="flex flex-col items-center gap-1 relative">
                          {pricing.is_recommended && (
                            <Badge className="absolute -top-1 -right-1 bg-amber-500 text-[10px] px-1">
                              <Star className="h-2 w-2" />
                            </Badge>
                          )}
                          <div className={`font-semibold ${viewMode === 'setup' ? 'text-green-600' : 'text-foreground'}`}>
                            {formatPrice(getDisplayPrice(pricing))}
                          </div>
                          <div className="text-xs text-muted-foreground">{getPriceLabel()}</div>
                          <Button variant="ghost" size="sm" className="mt-1 h-6 text-xs" onClick={() => setEditingPricing(pricing)}>
                            <Pencil className="h-3 w-3 mr-1" /> Editar
                          </Button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-500" /> = Mais Popular
          </div>
          <div>— = Combinação não disponível</div>
        </div>

        {/* Resumo PRD v3.0 */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">PRD v3.0 - Resumo Pricing</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Piso Mensal</div>
              <div className="font-semibold text-lg">R$ 2.997</div>
            </div>
            <div>
              <div className="text-muted-foreground">Teto Mensal</div>
              <div className="font-semibold text-lg">R$ 100.000</div>
            </div>
            <div>
              <div className="text-muted-foreground">Setup Mínimo</div>
              <div className="font-semibold text-lg text-green-600">R$ 2.997</div>
            </div>
            <div>
              <div className="text-muted-foreground">Setup Máximo</div>
              <div className="font-semibold text-lg text-green-600">R$ 59.997</div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Modal Editar Pricing */}
      <Dialog open={!!editingPricing} onOpenChange={() => setEditingPricing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Pricing</DialogTitle>
          </DialogHeader>
          {editingPricing && (() => {
            const currentSize = companySizes.find((s) => s.id === editingPricing.company_size_id);
            const isSMB = currentSize?.key === 'smb' || currentSize?.key === 'smb_plus';
            
            const handleMonthlyPriceChange = (value: number) => {
              const monthly = value || 0;
              const annual = monthly * 12; // Anual = Mensal × 12
              const setup = isSMB ? monthly * 2 : monthly; // Setup = Mensal × 2 para SMB/SMB+, senão = Mensal
              
              setEditingPricing({
                ...editingPricing,
                monthly_price: monthly,
                annual_price: annual,
                setup_fee: setup,
              });
            };

            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
                  <div>
                    <Label className="text-muted-foreground">Porte</Label>
                    <div className="font-medium">{currentSize?.name}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Plano</Label>
                    <div className="font-medium">{subscriptionPlans.find((p) => p.id === editingPricing.plan_id)?.name}</div>
                  </div>
                </div>

                <div>
                  <Label>Preço Mensal (R$)</Label>
                  <Input 
                    type="number" 
                    value={editingPricing.monthly_price} 
                    onChange={(e) => handleMonthlyPriceChange(Number(e.target.value))} 
                    placeholder="2997"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Mínimo: R$ 2.997/mês
                  </p>
                </div>

                <div>
                  <Label>Preço Anual (R$)</Label>
                  <Input 
                    type="number" 
                    value={editingPricing.annual_price} 
                    onChange={(e) => {
                      const annual = Number(e.target.value) || 0;
                      const monthly = annual / 12;
                      const setup = isSMB ? monthly * 2 : monthly;
                      setEditingPricing({
                        ...editingPricing,
                        annual_price: annual,
                        monthly_price: Math.round(monthly),
                        setup_fee: Math.round(setup),
                      });
                    }}
                    placeholder="35964"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Calculado automaticamente: {formatPrice(editingPricing.monthly_price * 12)} (Mensal × 12)
                    {editingPricing.monthly_price > 0 && (
                      <span className="block mt-0.5">
                        Economia: {formatPrice(editingPricing.monthly_price * 12 - editingPricing.annual_price)} ({Math.round((1 - editingPricing.annual_price / (editingPricing.monthly_price * 12)) * 100)}%)
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    Taxa de Setup (R$)
                  </Label>
                  <Input 
                    type="number" 
                    value={editingPricing.setup_fee || 0} 
                    onChange={(e) => setEditingPricing({ ...editingPricing, setup_fee: Number(e.target.value) })} 
                    placeholder={isSMB ? "5994" : "2997"}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {isSMB ? (
                      <>Calculado automaticamente: {formatPrice(editingPricing.monthly_price * 2)} (Mensal × 2 para SMB/SMB+)</>
                    ) : (
                      <>Calculado automaticamente: {formatPrice(editingPricing.monthly_price)} (igual à mensalidade)</>
                    )}
                    <span className="block mt-1">
                      Descontos: 50% (anual), 100% (referral), 30% (trial)
                    </span>
                  </p>
                </div>
              </div>
            );
          })()}

              <div className="flex items-center justify-between">
                <Label>Marcar como "Mais Popular"</Label>
                <Switch checked={editingPricing.is_recommended} onCheckedChange={(checked) => setEditingPricing({ ...editingPricing, is_recommended: checked })} />
              </div>

              <div className="flex items-center justify-between">
                <Label>Ativo</Label>
                <Switch checked={editingPricing.is_active} onCheckedChange={(checked) => setEditingPricing({ ...editingPricing, is_active: checked })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPricing(null)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
