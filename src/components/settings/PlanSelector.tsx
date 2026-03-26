import { Check, Crown, Sparkles, Leaf, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { GovernancePlan, PLAN_LABELS } from "@/types/organization";
import { Badge } from "@/components/ui/badge";

interface PlanSelectorProps {
  value: GovernancePlan;
  onChange: (plan: GovernancePlan) => void;
}

const PLAN_CONFIG: Record<GovernancePlan, {
  icon: typeof Crown;
  color: string;
  bgColor: string;
  description: string;
  features: string[];
  premiumCount: number;
  recommended?: boolean;
}> = {
  core: {
    icon: Check,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    description: "Governança essencial para iniciar",
    features: ["Módulos base do porte", "Suporte padrão"],
    premiumCount: 0,
  },
  governance_plus: {
    icon: Sparkles,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    description: "Governança com IA embarcada",
    features: ["Tudo do Core", "Agentes de IA"],
    premiumCount: 1,
  },
  people_esg: {
    icon: Leaf,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    description: "Foco em pessoas e sustentabilidade",
    features: ["Tudo do Core", "Maturidade ESG"],
    premiumCount: 1,
  },
  legacy_360: {
    icon: Crown,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    description: "Experiência completa de governança",
    features: ["Todos os módulos premium", "Suporte prioritário"],
    premiumCount: 5,
    recommended: true,
  },
};

const PLANS: GovernancePlan[] = ['core', 'governance_plus', 'people_esg', 'legacy_360'];

export function PlanSelector({ value, onChange }: PlanSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Plano de Governança</h3>
        <p className="text-sm text-muted-foreground">
          Escolha o plano que melhor atende suas necessidades
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map((plan) => {
          const config = PLAN_CONFIG[plan];
          const Icon = config.icon;
          const isSelected = value === plan;
          
          return (
            <button
              key={plan}
              onClick={() => onChange(plan)}
              className={cn(
                "relative flex flex-col p-4 rounded-lg border-2 transition-all text-left",
                "hover:border-primary/50 hover:shadow-md",
                isSelected 
                  ? "border-primary bg-primary/5 shadow-md" 
                  : "border-border bg-card"
              )}
            >
              {config.recommended && (
                <Badge className="absolute -top-2 -right-2 bg-amber-500">
                  <Star className="h-3 w-3 mr-1" />
                  Recomendado
                </Badge>
              )}
              
              <div className={cn("p-2 rounded-md w-fit mb-3", config.bgColor)}>
                <Icon className={cn("h-5 w-5", config.color)} />
              </div>
              
              <span className="font-semibold">{PLAN_LABELS[plan]}</span>
              <span className="text-xs text-muted-foreground mt-1">
                {config.description}
              </span>
              
              <div className="mt-3 space-y-1">
                {config.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-emerald-500" />
                    {feature}
                  </div>
                ))}
              </div>
              
              {config.premiumCount > 0 && (
                <Badge variant="secondary" className="mt-3 w-fit">
                  +{config.premiumCount} premium
                </Badge>
              )}
              
              {isSelected && (
                <div className="absolute bottom-2 right-2">
                  <Check className="h-5 w-5 text-primary" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
