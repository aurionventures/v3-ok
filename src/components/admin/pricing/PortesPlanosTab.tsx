import { useState } from "react";
import { usePricingConfig, CompanySize, SubscriptionPlan } from "@/hooks/usePricingConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Building2, CreditCard, Users, Infinity } from "lucide-react";

export function PortesPlanosTab() {
  const { companySizes, subscriptionPlans, updateCompanySize, createCompanySize, deleteCompanySize, updateSubscriptionPlan, createSubscriptionPlan, deleteSubscriptionPlan } = usePricingConfig();
  
  const [editingSize, setEditingSize] = useState<CompanySize | null>(null);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isNewSize, setIsNewSize] = useState(false);
  const [isNewPlan, setIsNewPlan] = useState(false);

  const handleSaveSize = () => {
    if (!editingSize) return;
    if (isNewSize) {
      createCompanySize(editingSize);
    } else {
      updateCompanySize(editingSize);
    }
    setEditingSize(null);
    setIsNewSize(false);
  };

  const handleSavePlan = () => {
    if (!editingPlan) return;
    if (isNewPlan) {
      createSubscriptionPlan(editingPlan);
    } else {
      updateSubscriptionPlan(editingPlan);
    }
    setEditingPlan(null);
    setIsNewPlan(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Portes de Empresa */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Portes de Empresa
          </CardTitle>
          <Button size="sm" onClick={() => { setEditingSize({ id: "", key: "", name: "", description: "", revenue_min: null, revenue_max: null, employee_min: null, employee_max: null, order_index: companySizes.length + 1, is_active: true }); setIsNewSize(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Novo
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {companySizes.map((size) => (
            <div key={size.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div>
                <div className="font-medium">{size.name}</div>
                <div className="text-sm text-muted-foreground">{size.description}</div>
                {size.revenue_min !== null && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {size.revenue_min === 0 ? '< R$ ' : 'R$ '}
                    {size.revenue_min > 0 && `${(size.revenue_min / 1000000).toFixed(0)}M`}
                    {size.revenue_min === 0 && '50M'}
                    {size.revenue_max ? ` - R$ ${(size.revenue_max / 1000000).toFixed(0)}M` : " - ∞"}
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditingSize(size); setIsNewSize(false); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteCompanySize(size.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Planos de Assinatura */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Planos de Assinatura
          </CardTitle>
          <Button size="sm" onClick={() => { setEditingPlan({ id: "", key: "", name: "", description: "", max_companies: 1, max_councils: 1, max_users: 10, included_addons: 0, features: [], order_index: subscriptionPlans.length + 1, is_active: true }); setIsNewPlan(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Novo
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {subscriptionPlans.map((plan) => (
            <div key={plan.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div>
                <div className="font-medium">{plan.name}</div>
                <div className="text-sm text-muted-foreground">{plan.description}</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {plan.max_companies === 0 ? <Infinity className="h-3 w-3" /> : plan.max_companies} empresas
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {plan.max_users === 0 ? <Infinity className="h-3 w-3" /> : plan.max_users} usuários
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {plan.included_addons} add-ons
                  </Badge>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditingPlan(plan); setIsNewPlan(false); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteSubscriptionPlan(plan.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Modal Editar Porte */}
      <Dialog open={!!editingSize} onOpenChange={() => setEditingSize(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNewSize ? "Novo Porte" : "Editar Porte"}</DialogTitle>
          </DialogHeader>
          {editingSize && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Key</Label><Input value={editingSize.key} onChange={(e) => setEditingSize({ ...editingSize, key: e.target.value })} /></div>
                <div><Label>Nome</Label><Input value={editingSize.name} onChange={(e) => setEditingSize({ ...editingSize, name: e.target.value })} /></div>
              </div>
              <div><Label>Descrição</Label><Input value={editingSize.description || ""} onChange={(e) => setEditingSize({ ...editingSize, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Receita Mín (R$)</Label><Input type="number" value={editingSize.revenue_min || ""} onChange={(e) => setEditingSize({ ...editingSize, revenue_min: Number(e.target.value) || null })} /></div>
                <div><Label>Receita Máx (R$)</Label><Input type="number" value={editingSize.revenue_max || ""} onChange={(e) => setEditingSize({ ...editingSize, revenue_max: Number(e.target.value) || null })} /></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSize(null)}>Cancelar</Button>
            <Button onClick={handleSaveSize}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Plano */}
      <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNewPlan ? "Novo Plano" : "Editar Plano"}</DialogTitle>
          </DialogHeader>
          {editingPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Key</Label><Input value={editingPlan.key} onChange={(e) => setEditingPlan({ ...editingPlan, key: e.target.value })} /></div>
                <div><Label>Nome</Label><Input value={editingPlan.name} onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })} /></div>
              </div>
              <div><Label>Descrição</Label><Input value={editingPlan.description || ""} onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Empresas (0=∞)</Label><Input type="number" value={editingPlan.max_companies} onChange={(e) => setEditingPlan({ ...editingPlan, max_companies: Number(e.target.value) })} /></div>
                <div><Label>Usuários (0=∞)</Label><Input type="number" value={editingPlan.max_users} onChange={(e) => setEditingPlan({ ...editingPlan, max_users: Number(e.target.value) })} /></div>
                <div><Label>Add-ons</Label><Input type="number" value={editingPlan.included_addons} onChange={(e) => setEditingPlan({ ...editingPlan, included_addons: Number(e.target.value) })} /></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPlan(null)}>Cancelar</Button>
            <Button onClick={handleSavePlan}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
