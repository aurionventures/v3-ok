import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Building, Building2, Globe, Rocket, TrendingUp, Save, 
  Check, Bot, Send, Users, Shield, Leaf, BarChart3, ArrowRight
} from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { CompanySize, COMPANY_SIZE_LABELS, ModuleKey } from "@/types/organization";
import { 
  PLAN_PRICES, 
  ADDON_PRICES, 
  ADDON_DETAILS,
  CORE_BASE_MODULES, 
  calculateTotalPrice,
  getModulesWithAddons
} from "@/utils/moduleMatrix";
import { BASE_SECTIONS, ADDON_SECTIONS, FIXED_ITEMS, DYNAMIC_ADDONS } from "@/data/sidebarCatalog";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { cn } from "@/lib/utils";

const SIZE_ICONS: Record<CompanySize, typeof Rocket> = {
  startup: Rocket,
  small: Building,
  medium: Building2,
  large: Globe,
  listed: TrendingUp,
};

const ADDON_ICONS: Record<string, typeof Bot> = {
  ai_agents: Bot,
  project_submission: Send,
  leadership_performance: Users,
  risks: Shield,
  esg_maturity: Leaf,
  market_intel: TrendingUp,
};

export default function AdminPlanConfigurator() {
  const { companies, loading } = useCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<CompanySize>("medium");
  const [enabledAddons, setEnabledAddons] = useState<ModuleKey[]>([]);
  
  // Carregar configuração salva quando empresa é selecionada
  useEffect(() => {
    if (selectedCompanyId) {
      const savedConfig = localStorage.getItem(`company_plan_${selectedCompanyId}`);
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        setSelectedSize(config.companySize || "medium");
        setEnabledAddons(config.enabledAddons || []);
      } else {
        setSelectedSize("medium");
        setEnabledAddons([]);
      }
    }
  }, [selectedCompanyId]);

  const handleAddonToggle = (addonKey: ModuleKey) => {
    setEnabledAddons(prev => {
      if (prev.includes(addonKey)) {
        // Se desabilitar market_intel, também remove benchmarking
        if (addonKey === 'market_intel') {
          return prev.filter(k => k !== addonKey && k !== 'benchmarking');
        }
        return prev.filter(k => k !== addonKey);
      } else {
        // Se habilitar market_intel, também adiciona benchmarking
        if (addonKey === 'market_intel') {
          return [...prev, addonKey, 'benchmarking'];
        }
        return [...prev, addonKey];
      }
    });
  };

  const handleSave = () => {
    if (!selectedCompanyId) {
      toast.error("Selecione uma empresa primeiro");
      return;
    }

    const config = {
      companySize: selectedSize,
      enabledAddons,
      enabledModules: getModulesWithAddons(selectedSize, enabledAddons),
      totalPrice: calculateTotalPrice(selectedSize, enabledAddons),
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(`company_plan_${selectedCompanyId}`, JSON.stringify(config));
    toast.success("Configuração salva com sucesso!");
  };

  const basePrice = PLAN_PRICES[selectedSize];
  const totalPrice = calculateTotalPrice(selectedSize, enabledAddons);
  const addonsPrice = totalPrice - basePrice;
  const enabledModules = getModulesWithAddons(selectedSize, enabledAddons);

  // Lista de add-ons para exibição (excluindo benchmarking que é incluído no market_intel)
  const displayAddons = Object.entries(ADDON_DETAILS).filter(([key]) => key !== 'benchmarking');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Configurador de Planos</h1>
          <p className="text-muted-foreground">Configure planos e add-ons para empresas clientes</p>
        </div>
      </div>

      {/* Seleção de Empresa */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Selecionar Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Selecione uma empresa..." />
            </SelectTrigger>
            <SelectContent>
              {companies?.map(company => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name || company.company || 'Empresa sem nome'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedCompanyId && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Configuração */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plano Base */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Plano Base
                </CardTitle>
                <CardDescription>
                  Selecione o porte da empresa para definir os módulos base
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(Object.keys(COMPANY_SIZE_LABELS) as CompanySize[]).map(size => {
                    const SizeIcon = SIZE_ICONS[size];
                    const isSelected = selectedSize === size;
                    
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "p-4 rounded-lg border-2 text-left transition-all",
                          isSelected 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <SizeIcon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                          <span className="font-medium">{COMPANY_SIZE_LABELS[size]}</span>
                        </div>
                        <div className="text-lg font-bold text-primary">
                          R$ {PLAN_PRICES[size].toLocaleString('pt-BR')}
                          <span className="text-sm font-normal text-muted-foreground">/mês</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {CORE_BASE_MODULES.length} módulos incluídos
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Add-ons */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="outline" className="border-amber-500 text-amber-500">
                        ADD-ONS
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Ative módulos adicionais conforme necessidade da empresa
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayAddons.map(([key, details]) => {
                    const isEnabled = enabledAddons.includes(key as ModuleKey);
                    const AddonIcon = ADDON_ICONS[key] || Shield;
                    const price = ADDON_PRICES[key];
                    
                    return (
                      <div
                        key={key}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg border transition-all",
                          isEnabled ? "border-amber-500/50 bg-amber-500/5" : "border-border"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "p-2 rounded-lg",
                            isEnabled ? "bg-amber-500/20" : "bg-muted"
                          )}>
                            <AddonIcon className={cn(
                              "h-5 w-5",
                              isEnabled ? "text-amber-500" : "text-muted-foreground"
                            )} />
                          </div>
                          <div>
                            <div className="font-medium">{details.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {details.description}
                            </div>
                            {details.targetSection && (
                              <div className="flex items-center gap-1 mt-1">
                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  Vai para: {details.section}
                                </span>
                              </div>
                            )}
                            {details.includesModules && (
                              <div className="text-xs text-emerald-600 mt-1">
                                ✓ Inclui Benchmarking Global
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-bold text-primary">
                              R$ {price.toLocaleString('pt-BR')}
                            </div>
                            <div className="text-xs text-muted-foreground">/mês</div>
                          </div>
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={() => handleAddonToggle(key as ModuleKey)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna 2: Resumo e Preview */}
          <div className="space-y-6">
            {/* Resumo de Preços */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Plano</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Plano Base ({COMPANY_SIZE_LABELS[selectedSize]})</span>
                  <span className="font-medium">R$ {basePrice.toLocaleString('pt-BR')}</span>
                </div>
                
                {enabledAddons.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Add-ons ativos:</span>
                      {enabledAddons
                        .filter(addon => addon !== 'benchmarking')
                        .map(addon => (
                          <div key={addon} className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-emerald-500" />
                              {ADDON_DETAILS[addon]?.label || addon}
                            </span>
                            <span>R$ {ADDON_PRICES[addon]?.toLocaleString('pt-BR') || 0}</span>
                          </div>
                        ))}
                    </div>
                  </>
                )}
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Mensal</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {totalPrice.toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="pt-2">
                  <div className="text-sm text-muted-foreground mb-2">
                    Módulos habilitados: <span className="font-medium text-foreground">{enabledModules.length}</span>
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full" size="lg">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configuração
                </Button>
              </CardContent>
            </Card>

            {/* Preview do Sidebar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Preview de Módulos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  {/* Seções Base */}
                  {BASE_SECTIONS.map(section => (
                    <div key={section.key}>
                      <div className={cn("font-medium mb-1", section.color)}>
                        {section.label}
                      </div>
                      <div className="pl-3 space-y-1">
                        {section.items.map(item => (
                          <div key={item.key} className="flex items-center gap-2 text-muted-foreground">
                            <Check className="h-3 w-3 text-emerald-500" />
                            {item.label}
                          </div>
                        ))}
                        {/* Add-ons dinâmicos */}
                        {Object.entries(DYNAMIC_ADDONS)
                          .filter(([key, config]) => 
                            config.targetSection === section.key && enabledAddons.includes(key as ModuleKey)
                          )
                          .map(([key, config]) => (
                            <div key={key} className="flex items-center gap-2 text-amber-600">
                              <Check className="h-3 w-3" />
                              {config.item.label}
                              <Badge variant="outline" className="text-[8px] px-1 py-0 h-3 border-amber-500/50">
                                Add-on
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}

                  {/* Separador ADD-ONS */}
                  {enabledAddons.some(addon => 
                    ADDON_SECTIONS.some(s => s.items.some(i => i.key === addon))
                  ) && (
                    <>
                      <div className="flex items-center gap-2 py-2">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-amber-500 font-semibold">ADD-ONS</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                      
                      {/* Seções Add-on */}
                      {ADDON_SECTIONS.map(section => {
                        const hasEnabledItems = section.items.some(item => 
                          enabledAddons.includes(item.key)
                        );
                        if (!hasEnabledItems) return null;
                        
                        return (
                          <div key={section.key}>
                            <div className={cn("font-medium mb-1", section.color)}>
                              {section.label}
                            </div>
                            <div className="pl-3 space-y-1">
                              {section.items
                                .filter(item => enabledAddons.includes(item.key))
                                .map(item => (
                                  <div key={item.key} className="flex items-center gap-2 text-amber-600">
                                    <Check className="h-3 w-3" />
                                    {item.label}
                                  </div>
                                ))}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {/* Itens Fixos */}
                  <Separator />
                  <div className="space-y-1">
                    {FIXED_ITEMS.map(item => (
                      <div key={item.key} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-3 w-3 text-emerald-500" />
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
