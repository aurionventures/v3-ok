import { useState } from "react";
import { usePricingConfig, AddonCatalog } from "@/hooks/usePricingConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Puzzle, Sparkles, CheckCircle2 } from "lucide-react";

const CATEGORIES = [
  { value: "governance", label: "Governança" },
  { value: "people", label: "Pessoas" },
  { value: "strategy", label: "Estratégia" },
  { value: "intelligence", label: "Inteligência" },
];

export function AddonsConfigTab() {
  const { addons, updateAddon, createAddon, deleteAddon, suggestedAddons, updateSuggestedAddons } = usePricingConfig();
  const [isEditingSuggested, setIsEditingSuggested] = useState(false);
  const [tempSuggestedAddons, setTempSuggestedAddons] = useState<string[]>([]);
  const [editingAddon, setEditingAddon] = useState<AddonCatalog | null>(null);
  const [isNew, setIsNew] = useState(false);

  const handleSave = () => {
    if (!editingAddon) return;
    if (isNew) {
      createAddon(editingAddon);
    } else {
      updateAddon(editingAddon);
    }
    setEditingAddon(null);
    setIsNew(false);
  };

  const formatPrice = (price: number | undefined | null) => {
    const numPrice = Number(price) || 0;
    return new Intl.NumberFormat("pt-BR", { 
      style: "currency", 
      currency: "BRL", 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numPrice);
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case "governance": return "bg-blue-500/10 text-blue-500";
      case "people": return "bg-purple-500/10 text-purple-500";
      case "strategy": return "bg-amber-500/10 text-amber-500";
      case "intelligence": return "bg-emerald-500/10 text-emerald-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleSaveSuggested = () => {
    updateSuggestedAddons({
      enabled: tempSuggestedAddons,
      updated_at: new Date().toISOString(),
    });
    setIsEditingSuggested(false);
  };

  const toggleSuggestedAddon = (addonKey: string) => {
    setTempSuggestedAddons((prev) => {
      if (prev.includes(addonKey)) {
        // Remover se já está selecionado (mas manter mínimo de 1)
        if (prev.length > 1) {
          return prev.filter((k) => k !== addonKey);
        }
        return prev;
      } else {
        // Adicionar (máximo de 3)
        if (prev.length < 3) {
          return [...prev, addonKey];
        }
        return prev;
      }
    });
  };

  const startEditingSuggested = () => {
    setTempSuggestedAddons([...suggestedAddons.enabled]);
    setIsEditingSuggested(true);
  };

  return (
    <div className="space-y-6">
      {/* Configuração de Add-ons Sugeridos */}
      <Card className="border-2 border-blue-500/20 bg-blue-50/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Add-ons Sugeridos Padrão</CardTitle>
            </div>
            {!isEditingSuggested && (
              <Button variant="outline" size="sm" onClick={startEditingSuggested}>
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configure quais add-ons serão sugeridos automaticamente na calculadora de planos (máximo 3)
          </p>
        </CardHeader>
        <CardContent>
          {!isEditingSuggested ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {suggestedAddons.enabled.length} add-on{suggestedAddons.enabled.length > 1 ? 's' : ''} configurado{suggestedAddons.enabled.length > 1 ? 's' : ''}
                </Badge>
                {suggestedAddons.updated_at && (
                  <span className="text-xs text-muted-foreground">
                    Atualizado em {new Date(suggestedAddons.updated_at).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {suggestedAddons.enabled.map((addonKey, index) => {
                  const addon = addons.find((a) => a.key === addonKey);
                  if (!addon) return null;
                  return (
                    <div
                      key={addonKey}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{addon.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{formatPrice(addon.monthly_price)}/mês</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-3">
                Selecione até 3 add-ons para serem sugeridos automaticamente na calculadora:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {addons
                  .filter((a) => a.is_active && a.is_visible)
                  .map((addon) => {
                    const isSelected = tempSuggestedAddons.includes(addon.key);
                    const isDisabled = !isSelected && tempSuggestedAddons.length >= 3;
                    return (
                      <div
                        key={addon.id}
                        onClick={() => !isDisabled && toggleSuggestedAddon(addon.key)}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                            : isDisabled
                            ? 'border-muted bg-muted/30 cursor-not-allowed opacity-50'
                            : 'border-muted bg-card hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-muted-foreground/30'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{addon.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {formatPrice(addon.monthly_price)}/mês
                          </p>
                        </div>
                        {tempSuggestedAddons.includes(addon.key) && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                            #{tempSuggestedAddons.indexOf(addon.key) + 1}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-sm text-muted-foreground">
                  {tempSuggestedAddons.length} de 3 selecionados
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditingSuggested(false)}>
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSaveSuggested} disabled={tempSuggestedAddons.length === 0}>
                    Salvar Configuração
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Add-ons */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5" />
            Add-ons Premium ({addons.length})
          </CardTitle>
          <Button onClick={() => { setEditingAddon({ id: "", key: "", name: "", description: "", icon: "Package", monthly_price: 0, annual_price: 0, category: "governance", target_section: "", target_section_label: "", order_index: addons.length + 1, is_active: true, is_visible: true }); setIsNew(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Novo Add-on
          </Button>
        </CardHeader>
        <CardContent>
        <div className="grid gap-4">
          {addons.map((addon) => (
            <div key={addon.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{addon.name}</span>
                  <Badge className={getCategoryColor(addon.category)}>
                    {CATEGORIES.find((c) => c.value === addon.category)?.label || addon.category}
                  </Badge>
                  {!addon.is_active && <Badge variant="outline" className="text-muted-foreground">Inativo</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{addon.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span><strong>{formatPrice(addon.monthly_price)}</strong>/mês</span>
                  <span className="text-muted-foreground">|</span>
                  <span><strong>{formatPrice(addon.annual_price)}</strong>/ano</span>
                  <Badge variant="secondary" className="text-xs">{addon.target_section_label}</Badge>
                </div>
              </div>
              <div className="flex gap-1 ml-4">
                <Button variant="ghost" size="icon" onClick={() => { setEditingAddon(addon); setIsNew(false); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteAddon(addon.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        </CardContent>
      </Card>

      {/* Modal Editar Add-on */}
      <Dialog open={!!editingAddon} onOpenChange={() => setEditingAddon(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isNew ? "Novo Add-on" : "Editar Add-on"}</DialogTitle>
          </DialogHeader>
          {editingAddon && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Key</Label><Input value={editingAddon.key} onChange={(e) => setEditingAddon({ ...editingAddon, key: e.target.value })} /></div>
                <div><Label>Nome</Label><Input value={editingAddon.name} onChange={(e) => setEditingAddon({ ...editingAddon, name: e.target.value })} /></div>
              </div>

              <div><Label>Descrição</Label><Textarea value={editingAddon.description || ""} onChange={(e) => setEditingAddon({ ...editingAddon, description: e.target.value })} /></div>

              <div className="grid grid-cols-2 gap-4">
                <div><Label>Preço Mensal (R$)</Label><Input type="number" value={editingAddon.monthly_price} onChange={(e) => setEditingAddon({ ...editingAddon, monthly_price: Number(e.target.value) })} /></div>
                <div><Label>Preço Anual (R$)</Label><Input type="number" value={editingAddon.annual_price} onChange={(e) => setEditingAddon({ ...editingAddon, annual_price: Number(e.target.value) })} /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Categoria</Label>
                  <Select value={editingAddon.category || ""} onValueChange={(v) => setEditingAddon({ ...editingAddon, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Seção de Destino</Label><Input value={editingAddon.target_section_label || ""} onChange={(e) => setEditingAddon({ ...editingAddon, target_section_label: e.target.value })} /></div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Ativo</Label>
                <Switch checked={editingAddon.is_active} onCheckedChange={(checked) => setEditingAddon({ ...editingAddon, is_active: checked })} />
              </div>

              <div className="flex items-center justify-between">
                <Label>Visível no Catálogo</Label>
                <Switch checked={editingAddon.is_visible} onCheckedChange={(checked) => setEditingAddon({ ...editingAddon, is_visible: checked })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAddon(null)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
