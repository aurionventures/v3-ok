import { useState } from "react";
import { usePricingConfig, PlanPricingMatrix } from "@/hooks/usePricingConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Pencil, Star } from "lucide-react";

export function MatrizPricingTab() {
  const { companySizes, subscriptionPlans, pricingMatrix, updatePricingMatrix, getPricing } = usePricingConfig();
  const [editingPricing, setEditingPricing] = useState<PlanPricingMatrix | null>(null);

  const handleSave = () => {
    if (!editingPricing) return;
    updatePricingMatrix(editingPricing);
    setEditingPricing(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matriz de Pricing (Porte × Plano)</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure o preço mensal e anual para cada combinação de porte e plano
        </p>
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
                          <div className="font-semibold text-foreground">
                            {formatPrice(pricing.monthly_price)}
                          </div>
                          <div className="text-xs text-muted-foreground">/mês</div>
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
      </CardContent>

      {/* Modal Editar Pricing */}
      <Dialog open={!!editingPricing} onOpenChange={() => setEditingPricing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Pricing</DialogTitle>
          </DialogHeader>
          {editingPricing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
                <div>
                  <Label className="text-muted-foreground">Porte</Label>
                  <div className="font-medium">{companySizes.find((s) => s.id === editingPricing.company_size_id)?.name}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Plano</Label>
                  <div className="font-medium">{subscriptionPlans.find((p) => p.id === editingPricing.plan_id)?.name}</div>
                </div>
              </div>

              <div>
                <Label>Preço Mensal (R$)</Label>
                <Input type="number" value={editingPricing.monthly_price} onChange={(e) => setEditingPricing({ ...editingPricing, monthly_price: Number(e.target.value) })} />
              </div>

              <div>
                <Label>Preço Anual (R$)</Label>
                <Input type="number" value={editingPricing.annual_price} onChange={(e) => setEditingPricing({ ...editingPricing, annual_price: Number(e.target.value) })} />
                <p className="text-xs text-muted-foreground mt-1">
                  Economia: {formatPrice(editingPricing.monthly_price * 12 - editingPricing.annual_price)} ({Math.round((1 - editingPricing.annual_price / (editingPricing.monthly_price * 12)) * 100)}%)
                </p>
              </div>

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
