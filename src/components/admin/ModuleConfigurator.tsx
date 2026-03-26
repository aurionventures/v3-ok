import { useState, useEffect } from "react";
import { Check, Settings2, Wand2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CompanySize, ModuleKey } from "@/types/organization";
import {
  BASE_MODULES,
  CORE_BASE_MODULES,
  ALL_ADDON_MODULES,
  ADDON_PRICES,
  PLAN_PRICES,
} from "@/utils/moduleMatrix";

export type ConfigMode = "automatic" | "manual";

interface ModuleConfiguatorProps {
  companySize: CompanySize;
  mode: ConfigMode;
  onModeChange: (mode: ConfigMode) => void;
  selectedModules: ModuleKey[];
  onModulesChange: (modules: ModuleKey[]) => void;
}

// Todos os 23 módulos organizados por seção
const ALL_MODULES_GROUPED: {
  section: string;
  modules: { key: ModuleKey; label: string; isAddon: boolean; price?: number }[];
}[] = [
  {
    section: "INÍCIO",
    modules: [
      { key: "dashboard", label: "Dashboard", isAddon: false },
      { key: "ai_agents", label: "Agentes de IA", isAddon: true, price: 2990 },
    ],
  },
  {
    section: "PARAMETRIZAÇÃO",
    modules: [
      { key: "structure", label: "Estrutura Societária", isAddon: false },
      { key: "cap_table", label: "Cap Table", isAddon: false },
      { key: "gov_maturity", label: "Maturidade de Governança", isAddon: false },
    ],
  },
  {
    section: "PREPARAÇÃO",
    modules: [
      { key: "checklist", label: "Checklist de Documentos", isAddon: false },
      { key: "interviews", label: "Entrevistas", isAddon: false },
      { key: "analysis_actions", label: "Análise de Ações", isAddon: false },
    ],
  },
  {
    section: "ESTRUTURAÇÃO",
    modules: [
      { key: "gov_config", label: "Configuração de Governança", isAddon: false },
      { key: "annual_agenda", label: "Agenda Anual", isAddon: false },
      { key: "secretariat", label: "Secretariado", isAddon: false },
      { key: "councils", label: "Conselhos e Comitês", isAddon: false },
      { key: "project_submission", label: "Submeter Projetos", isAddon: true, price: 1990 },
    ],
  },
  {
    section: "GESTÃO DE PESSOAS",
    modules: [
      { key: "leadership_performance", label: "Desenvolvimento e PDI", isAddon: true, price: 2490 },
    ],
  },
  {
    section: "MONITORAMENTO",
    modules: [
      { key: "activities", label: "Atividades", isAddon: false },
      { key: "risks", label: "Gestão de Riscos", isAddon: true, price: 1990 },
    ],
  },
  {
    section: "ESG",
    modules: [
      { key: "esg_maturity", label: "Maturidade ESG", isAddon: true, price: 3990 },
    ],
  },
  {
    section: "INTELIGÊNCIA DE MERCADO",
    modules: [
      { key: "market_intel", label: "Inteligência de Mercado", isAddon: true, price: 4990 },
      { key: "benchmarking", label: "Benchmarking Global", isAddon: true, price: 0 },
    ],
  },
  {
    section: "OUTROS",
    modules: [
      { key: "settings", label: "Configurações", isAddon: false },
    ],
  },
];

// Contagem de módulos
const TOTAL_MODULES = ALL_MODULES_GROUPED.reduce((acc, group) => acc + group.modules.length, 0);

const SIZE_LABELS: Record<CompanySize, string> = {
  startup: "Startup",
  small: "Pequena",
  medium: "Média",
  large: "Grande",
  listed: "Listada",
};

export function ModuleConfigurator({
  companySize,
  mode,
  onModeChange,
  selectedModules,
  onModulesChange,
}: ModuleConfiguatorProps) {
  // Get the modules that should be auto-selected based on company size
  const getAutomaticModules = (size: CompanySize): ModuleKey[] => {
    return BASE_MODULES[size] || CORE_BASE_MODULES;
  };

  // When mode changes to automatic, reset to default modules for size
  useEffect(() => {
    if (mode === "automatic") {
      onModulesChange(getAutomaticModules(companySize));
    }
  }, [mode, companySize]);

  // Toggle a module on/off (only in manual mode)
  const handleModuleToggle = (moduleKey: ModuleKey) => {
    if (mode === "automatic") return;

    // Core modules cannot be disabled
    if (CORE_BASE_MODULES.includes(moduleKey)) {
      // Allow toggling core modules too in manual mode for flexibility
    }

    if (selectedModules.includes(moduleKey)) {
      onModulesChange(selectedModules.filter((m) => m !== moduleKey));
    } else {
      const newModules = [...selectedModules, moduleKey];
      // If market_intel is added, also add benchmarking
      if (moduleKey === "market_intel" && !newModules.includes("benchmarking")) {
        newModules.push("benchmarking");
      }
      onModulesChange(newModules);
    }
  };

  // Calculate price for manual mode
  const calculateManualPrice = (): number => {
    const basePrice = PLAN_PRICES[companySize];
    
    // Only charge for add-ons that are NOT already included in the base plan
    const includedInBase = BASE_MODULES[companySize];
    const addonsPrice = selectedModules
      .filter((m) => ALL_ADDON_MODULES.includes(m) && !includedInBase.includes(m))
      .reduce((sum, addon) => sum + (ADDON_PRICES[addon] || 0), 0);

    return basePrice + addonsPrice;
  };

  const selectedCount = selectedModules.length;
  const automaticModules = getAutomaticModules(companySize);
  const automaticCount = automaticModules.length;

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Modo de Configuração</Label>
        <RadioGroup
          value={mode}
          onValueChange={(v) => onModeChange(v as ConfigMode)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div
            className={cn(
              "relative flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
              mode === "automatic"
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => onModeChange("automatic")}
          >
            <RadioGroupItem value="automatic" id="automatic" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-primary" />
                <Label htmlFor="automatic" className="font-medium cursor-pointer">
                  Automático
                </Label>
                <Badge variant="secondary" className="text-xs">Recomendado</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Módulos pré-definidos pelo porte ({automaticCount} módulos para {SIZE_LABELS[companySize]})
              </p>
            </div>
          </div>

          <div
            className={cn(
              "relative flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
              mode === "manual"
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => onModeChange("manual")}
          >
            <RadioGroupItem value="manual" id="manual" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-primary" />
                <Label htmlFor="manual" className="font-medium cursor-pointer">
                  Manual
                </Label>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Selecione módulos individualmente ({TOTAL_MODULES} disponíveis)
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">
            Módulos {mode === "automatic" ? "Incluídos" : "Selecionados"}
          </Label>
          <Badge variant="outline">
            {selectedCount}/{TOTAL_MODULES} módulos
          </Badge>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {ALL_MODULES_GROUPED.map((group) => (
            <div key={group.section} className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground tracking-wide">
                {group.section}
              </div>
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                {group.modules.map((module) => {
                  const isSelected = selectedModules.includes(module.key);
                  const isIncludedInBase = BASE_MODULES[companySize].includes(module.key);
                  const isDisabled = mode === "automatic";
                  const showPrice = module.isAddon && module.price && module.price > 0 && !isIncludedInBase;

                  return (
                    <div
                      key={module.key}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-all",
                        isSelected
                          ? "border-primary/50 bg-primary/5"
                          : "border-border bg-muted/20",
                        !isDisabled && "cursor-pointer hover:border-primary/30",
                        isDisabled && "opacity-80"
                      )}
                      onClick={() => !isDisabled && handleModuleToggle(module.key)}
                    >
                      <Checkbox
                        checked={isSelected}
                        disabled={isDisabled}
                        className="pointer-events-none"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">
                            {module.label}
                          </span>
                          {module.isAddon && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] px-1.5 py-0",
                                isIncludedInBase
                                  ? "border-green-500/50 text-green-500"
                                  : "border-amber-500/50 text-amber-500"
                              )}
                            >
                              {isIncludedInBase ? "Incluso" : "Add-on"}
                            </Badge>
                          )}
                        </div>
                        {showPrice && mode === "manual" && (
                          <span className="text-xs text-amber-500">
                            +R$ {module.price?.toLocaleString("pt-BR")}/mês
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">
                {mode === "automatic" ? "Preço do plano" : "Total mensal"}
              </div>
              <div className="text-2xl font-bold text-primary">
                R$ {(mode === "automatic" 
                  ? PLAN_PRICES[companySize] 
                  : calculateManualPrice()
                ).toLocaleString("pt-BR")}
                <span className="text-sm font-normal text-muted-foreground">/mês</span>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              {mode === "automatic" ? (
                <div>Plano {SIZE_LABELS[companySize]}</div>
              ) : (
                <>
                  <div>Base: R$ {PLAN_PRICES[companySize].toLocaleString("pt-BR")}</div>
                  {selectedModules.filter(
                    (m) => ALL_ADDON_MODULES.includes(m) && !BASE_MODULES[companySize].includes(m)
                  ).length > 0 && (
                    <div>
                      + {selectedModules.filter(
                        (m) => ALL_ADDON_MODULES.includes(m) && !BASE_MODULES[companySize].includes(m)
                      ).length} add-on(s) extras
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ModuleConfigurator;
