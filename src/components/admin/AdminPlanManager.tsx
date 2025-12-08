import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, Check, X, Save, Sparkles, Crown
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCompanies, type Company } from "@/hooks/useCompanies";
import { 
  CompanySize, 
  ModuleKey, 
  COMPANY_SIZE_LABELS 
} from "@/types/organization";
import { 
  BASE_MODULES, 
  ADDON_MODULES, 
  isModuleIncludedInSize,
  isAddonModule
} from "@/utils/moduleMatrix";
import { SIDEBAR_SECTIONS, SidebarSection } from "@/data/sidebarCatalog";

const SIZE_ORDER: CompanySize[] = ['startup', 'small', 'medium', 'large', 'listed'];

export function AdminPlanManager() {
  const { companies, loading } = useCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<CompanySize>('startup');
  const [enabledModules, setEnabledModules] = useState<ModuleKey[]>([]);
  const [enabledAddons, setEnabledAddons] = useState<ModuleKey[]>([]);

  // Filtra apenas clientes
  const clientCompanies = companies.filter(c => c.type === 'cliente');

  // Quando seleciona empresa, carrega configuração salva (mock por localStorage)
  useEffect(() => {
    if (selectedCompanyId) {
      const savedConfig = localStorage.getItem(`company_plan_${selectedCompanyId}`);
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        setSelectedSize(config.size || 'startup');
        setEnabledModules(config.modules || BASE_MODULES['startup']);
        setEnabledAddons(config.addons || []);
      } else {
        // Valor padrão
        setSelectedSize('startup');
        setEnabledModules(BASE_MODULES['startup']);
        setEnabledAddons([]);
      }
    }
  }, [selectedCompanyId]);

  // Quando muda o porte, atualiza módulos base
  useEffect(() => {
    const baseModules = BASE_MODULES[selectedSize];
    setEnabledModules([...baseModules, ...enabledAddons]);
  }, [selectedSize]);

  // Toggle de add-on
  const handleAddonToggle = (addonKey: ModuleKey) => {
    setEnabledAddons(prev => {
      const newAddons = prev.includes(addonKey)
        ? prev.filter(k => k !== addonKey)
        : [...prev, addonKey];
      
      // Atualiza módulos habilitados
      const baseModules = BASE_MODULES[selectedSize];
      setEnabledModules([...baseModules, ...newAddons]);
      
      return newAddons;
    });
  };

  // Salvar configuração
  const handleSave = () => {
    if (!selectedCompanyId) {
      toast({
        title: "Erro",
        description: "Selecione uma empresa primeiro",
        variant: "destructive"
      });
      return;
    }

    const config = {
      size: selectedSize,
      modules: enabledModules,
      addons: enabledAddons,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(`company_plan_${selectedCompanyId}`, JSON.stringify(config));
    
    toast({
      title: "Configuração salva",
      description: "O plano da empresa foi atualizado com sucesso"
    });
  };

  // Conta módulos por seção
  const getModulesCountBySection = (section: SidebarSection): { enabled: number; total: number } => {
    const sectionModules = section.items.map(i => i.key);
    const enabled = sectionModules.filter(k => enabledModules.includes(k)).length;
    return { enabled, total: sectionModules.length };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-muted-foreground">Carregando empresas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seletor de Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Selecionar Empresa Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCompanyId || ""} onValueChange={setSelectedCompanyId}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Selecione uma empresa cliente..." />
            </SelectTrigger>
            <SelectContent>
              {clientCompanies.map(company => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedCompanyId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuração do Plano */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Configuração do Plano
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Seletor de Porte */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Porte da Empresa</Label>
                <div className="grid grid-cols-1 gap-2">
                  {SIZE_ORDER.map(size => (
                    <div
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
                        ${selectedSize === size 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-4 h-4 rounded-full border-2
                          ${selectedSize === size 
                            ? 'border-primary bg-primary' 
                            : 'border-muted-foreground'
                          }
                        `}>
                          {selectedSize === size && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <span className="font-medium">{COMPANY_SIZE_LABELS[size]}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {BASE_MODULES[size].length} módulos
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Add-ons */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Add-ons Disponíveis
                </Label>
                <div className="space-y-3">
                  {ADDON_MODULES.map(addon => (
                    <div
                      key={addon.key}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{addon.label}</p>
                        <p className="text-xs text-muted-foreground">{addon.section}</p>
                      </div>
                      <Switch
                        checked={enabledAddons.includes(addon.key)}
                        onCheckedChange={() => handleAddonToggle(addon.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleSave} className="w-full" size="lg">
                <Save className="h-4 w-4 mr-2" />
                Salvar Configuração
              </Button>
            </CardContent>
          </Card>

          {/* Preview de Módulos */}
          <Card>
            <CardHeader>
              <CardTitle>Módulos Habilitados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
              {SIDEBAR_SECTIONS.map(section => {
                const counts = getModulesCountBySection(section);
                
                return (
                  <div key={section.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <section.icon className={`h-4 w-4 ${section.color}`} />
                        <span className="font-medium text-sm">{section.label}</span>
                      </div>
                      <Badge 
                        variant={counts.enabled === counts.total ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {counts.enabled}/{counts.total}
                      </Badge>
                    </div>
                    <div className="pl-6 space-y-1">
                      {section.items.map(item => {
                        const isEnabled = enabledModules.includes(item.key);
                        const isAddon = isAddonModule(item.key);
                        
                        return (
                          <div
                            key={item.key}
                            className={`
                              flex items-center justify-between py-1.5 px-2 rounded text-sm
                              ${isEnabled ? 'bg-green-500/10' : 'bg-muted/50'}
                            `}
                          >
                            <div className="flex items-center gap-2">
                              {isEnabled ? (
                                <Check className="h-3.5 w-3.5 text-green-500" />
                              ) : (
                                <X className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                              <span className={isEnabled ? '' : 'text-muted-foreground'}>
                                {item.label}
                              </span>
                            </div>
                            {isAddon && (
                              <Badge variant="outline" className="text-[10px] h-5">
                                Add-on
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <Separator className="my-4" />
              
              <div className="flex items-center justify-between font-semibold">
                <span>Total de Módulos</span>
                <Badge variant="default" className="text-sm">
                  {enabledModules.length} habilitados
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
