import { Rocket, Building, Building2, Globe, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompanySize, COMPANY_SIZE_LABELS } from "@/types/organization";
import { getCompanySizeDescription, getDefaultModules } from "@/utils/moduleMatrix";

interface CompanySizeSelectorProps {
  value: CompanySize;
  onChange: (size: CompanySize) => void;
  currentPlan: string;
}

const SIZE_CONFIG: Record<CompanySize, { icon: typeof Rocket; color: string }> = {
  startup: { icon: Rocket, color: "text-orange-500" },
  small: { icon: Building, color: "text-blue-500" },
  medium: { icon: Building2, color: "text-purple-500" },
  large: { icon: Globe, color: "text-emerald-500" },
  listed: { icon: TrendingUp, color: "text-cyan-500" },
};

const SIZES: CompanySize[] = ['startup', 'small', 'medium', 'large', 'listed'];

export function CompanySizeSelector({ value, onChange, currentPlan }: CompanySizeSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Porte da Empresa</h3>
        <p className="text-sm text-muted-foreground">
          Selecione o porte que melhor representa sua organização
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {SIZES.map((size) => {
          const config = SIZE_CONFIG[size];
          const Icon = config.icon;
          const moduleCount = getDefaultModules(size, currentPlan as any).length;
          const isSelected = value === size;
          
          return (
            <button
              key={size}
              onClick={() => onChange(size)}
              className={cn(
                "flex flex-col items-center p-4 rounded-lg border-2 transition-all",
                "hover:border-primary/50 hover:bg-accent/50",
                isSelected 
                  ? "border-primary bg-primary/10 shadow-md" 
                  : "border-border bg-card"
              )}
            >
              <Icon className={cn("h-8 w-8 mb-2", config.color)} />
              <span className="font-medium text-sm">{COMPANY_SIZE_LABELS[size]}</span>
              <span className="text-xs text-muted-foreground mt-1">
                {moduleCount} módulos
              </span>
              {isSelected && (
                <span className="text-xs text-primary font-medium mt-2">
                  Selecionado
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
        {getCompanySizeDescription(value)}
      </p>
    </div>
  );
}
