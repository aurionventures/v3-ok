import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, DollarSign, Package, Settings2, Save, RotateCcw, Pencil, X, Layers } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CompanySize, COMPANY_SIZE_LABELS } from "@/types/organization";
import { SIDEBAR_SECTIONS, MODULE_DESCRIPTIONS } from "@/data/sidebarCatalog";
import { usePlanConfiguration } from "@/hooks/usePlanConfiguration";
import { toast } from "sonner";

const SIZE_ORDER: CompanySize[] = ['startup', 'small', 'medium', 'large', 'listed'];

const formatCurrency = (value: number) => {
  return `R$ ${value.toLocaleString('pt-BR')}`;
};

const AdminPlansComparison = () => {
  const {
    prices,
    addonPrices,
    modulesBySize,
    fullPackage,
    isLoading,
    hasChanges,
    updatePrice,
    updateAddonPrice,
    updateAddonDetails,
    toggleModule,
    isModuleIncluded,
    updateFullPackage,
    saveChanges,
    resetToDefaults
  } = usePlanConfiguration();

  // Estado para edição de preços
  const [editingPrice, setEditingPrice] = useState<CompanySize | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // Estado para edição de add-on
  const [editingAddon, setEditingAddon] = useState<string | null>(null);
  const [tempAddonPrice, setTempAddonPrice] = useState<string>('');
  const [tempAddonLabel, setTempAddonLabel] = useState<string>('');
  const [tempAddonDescription, setTempAddonDescription] = useState<string>('');

  // Coletar todos os módulos únicos do catálogo
  const allModules = SIDEBAR_SECTIONS.flatMap(section => 
    section.items.map(item => ({
      key: item.key,
      label: item.label,
      section: section.label,
      sectionColor: section.color,
      isAddon: item.isAddon || section.isAddon
    }))
  );

  // Iniciar edição de preço
  const startEditingPrice = (size: CompanySize) => {
    setEditingPrice(size);
    setTempPrice(prices[size].toString());
  };

  // Salvar preço editado
  const saveEditedPrice = () => {
    if (editingPrice) {
      const value = parseInt(tempPrice.replace(/\D/g, ''), 10) || 0;
      updatePrice(editingPrice, value);
      setEditingPrice(null);
      toast.success(`Preço de ${COMPANY_SIZE_LABELS[editingPrice]} atualizado`);
    }
  };

  // Iniciar edição de add-on
  const startEditingAddon = (addonKey: string) => {
    const addon = addonPrices.find(a => a.key === addonKey);
    if (addon) {
      setEditingAddon(addonKey);
      setTempAddonPrice(addon.price.toString());
      setTempAddonLabel(addon.label);
      setTempAddonDescription(addon.description);
    }
  };

  // Salvar add-on editado
  const saveEditedAddon = () => {
    if (editingAddon) {
      const price = parseInt(tempAddonPrice.replace(/\D/g, ''), 10) || 0;
      updateAddonPrice(editingAddon, price);
      updateAddonDetails(editingAddon, tempAddonLabel, tempAddonDescription);
      setEditingAddon(null);
      toast.success('Add-on atualizado');
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Configuração de Planos" />
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Parametrizador de Planos</h1>
              <p className="text-muted-foreground">
                Configure preços, módulos e funcionalidades por porte de empresa
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetToDefaults}
                disabled={isLoading}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restaurar Padrão
              </Button>
              <Button
                onClick={saveChanges}
                disabled={!hasChanges || isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>

          {hasChanges && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-500/20 text-amber-600 border-amber-500/30">
                Alterações pendentes
              </Badge>
              <span className="text-sm text-muted-foreground">
                Clique em "Salvar Alterações" para aplicar as modificações
              </span>
            </div>
          )}

          {/* Tabs Principais */}
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="prices" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="prices" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Preços dos Planos
                  </TabsTrigger>
                  <TabsTrigger value="modules" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Módulos por Porte
                  </TabsTrigger>
                  <TabsTrigger value="addons" className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    Configurar Add-ons
                  </TabsTrigger>
                </TabsList>

                {/* Tab: Preços dos Planos */}
                <TabsContent value="prices" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Preços Mensais por Porte</CardTitle>
                      <CardDescription>
                        Configure o valor mensal de cada plano por porte de empresa
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">Porte da Empresa</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="text-right w-[180px]">Preço Mensal</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {SIZE_ORDER.map(size => (
                            <TableRow key={size}>
                              <TableCell className="font-medium">
                                {COMPANY_SIZE_LABELS[size]}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {modulesBySize[size].length} módulos incluídos
                              </TableCell>
                              <TableCell className="text-right">
                                {editingPrice === size ? (
                                  <Input
                                    value={tempPrice}
                                    onChange={(e) => setTempPrice(e.target.value)}
                                    className="w-32 text-right ml-auto"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && saveEditedPrice()}
                                  />
                                ) : (
                                  <Badge variant="secondary" className="font-mono text-base">
                                    {formatCurrency(prices[size])}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {editingPrice === size ? (
                                  <div className="flex gap-1">
                                    <Button size="sm" variant="ghost" onClick={saveEditedPrice}>
                                      <Check className="h-4 w-4 text-green-500" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setEditingPrice(null)}>
                                      <X className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button size="sm" variant="ghost" onClick={() => startEditingPrice(size)}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Pacote Full */}
                  <Card className="border-primary/30 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Layers className="h-5 w-5 text-primary" />
                        Pacote Full (Todos os Add-ons)
                      </CardTitle>
                      <CardDescription>
                        Valor promocional quando o cliente contrata todos os add-ons juntos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6">
                        <div>
                          <Label className="text-sm text-muted-foreground">Valor Original</Label>
                          <p className="text-lg font-mono line-through text-muted-foreground">
                            {formatCurrency(fullPackage.originalPrice)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Valor com Desconto</Label>
                          <p className="text-2xl font-bold text-primary font-mono">
                            {formatCurrency(fullPackage.discountedPrice)}
                          </p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                          Economia de {formatCurrency(fullPackage.originalPrice - fullPackage.discountedPrice)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Módulos por Porte */}
                <TabsContent value="modules" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Matriz de Módulos por Porte</CardTitle>
                      <CardDescription>
                        Marque/desmarque os módulos incluídos em cada porte de empresa
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px] sticky left-0 bg-background">Módulo</TableHead>
                              <TableHead className="w-[150px]">Seção</TableHead>
                              {SIZE_ORDER.map(size => (
                                <TableHead key={size} className="text-center w-[100px]">
                                  {COMPANY_SIZE_LABELS[size]}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {allModules.map(module => (
                              <TableRow key={module.key}>
                                <TableCell className="font-medium sticky left-0 bg-background">
                                  <div className="flex items-center gap-2">
                                    {module.label}
                                    {module.isAddon && (
                                      <Badge variant="outline" className="text-xs">Add-on</Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className={`text-sm ${module.sectionColor}`}>
                                    {module.section}
                                  </span>
                                </TableCell>
                                {SIZE_ORDER.map(size => (
                                  <TableCell key={size} className="text-center">
                                    <Checkbox
                                      checked={isModuleIncluded(size, module.key)}
                                      onCheckedChange={() => toggleModule(size, module.key)}
                                    />
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Legenda */}
                      <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Checkbox checked disabled className="opacity-70" />
                          <span>Incluído no plano</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">Add-on</Badge>
                          <span>Módulo premium (contratado separadamente por padrão)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Configurar Add-ons */}
                <TabsContent value="addons" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Add-ons Disponíveis</CardTitle>
                      <CardDescription>
                        Configure preços e descrições dos módulos premium
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">Add-on</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="text-right w-[150px]">Preço Mensal</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {addonPrices.map(addon => (
                            <TableRow key={addon.key}>
                              <TableCell className="font-medium">
                                {addon.label}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm max-w-[300px]">
                                {addon.description}
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge variant="outline" className="font-mono">
                                  +{formatCurrency(addon.price)}/mês
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => startEditingAddon(addon.key)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Edição de Add-on */}
      <Dialog open={!!editingAddon} onOpenChange={(open) => !open && setEditingAddon(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Add-on</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="addonLabel">Nome do Add-on</Label>
              <Input
                id="addonLabel"
                value={tempAddonLabel}
                onChange={(e) => setTempAddonLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addonDescription">Descrição</Label>
              <Input
                id="addonDescription"
                value={tempAddonDescription}
                onChange={(e) => setTempAddonDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addonPrice">Preço Mensal (R$)</Label>
              <Input
                id="addonPrice"
                value={tempAddonPrice}
                onChange={(e) => setTempAddonPrice(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAddon(null)}>
              Cancelar
            </Button>
            <Button onClick={saveEditedAddon}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPlansComparison;
