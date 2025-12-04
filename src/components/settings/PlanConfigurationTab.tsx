import { useOrganization } from "@/contexts/OrganizationContext";
import { CompanySize, GovernancePlan } from "@/types/organization";
import { CompanySizeSelector } from "./CompanySizeSelector";
import { PlanSelector } from "./PlanSelector";
import { ModulesPreview } from "./ModulesPreview";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export function PlanConfigurationTab() {
  const { organization, updateCompanySize, updatePlan } = useOrganization();
  
  if (!organization) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Carregando configuração...
      </div>
    );
  }
  
  const handleSizeChange = (size: CompanySize) => {
    updateCompanySize(size);
    toast({
      title: "Porte atualizado",
      description: "Os módulos disponíveis foram recalculados automaticamente.",
    });
  };
  
  const handlePlanChange = (plan: GovernancePlan) => {
    updatePlan(plan);
    toast({
      title: "Plano atualizado",
      description: "Os módulos premium foram atualizados de acordo com o novo plano.",
    });
  };
  
  return (
    <div className="space-y-8">
      <CompanySizeSelector 
        value={organization.companySize}
        onChange={handleSizeChange}
        currentPlan={organization.plan}
      />
      
      <Separator />
      
      <PlanSelector
        value={organization.plan}
        onChange={handlePlanChange}
      />
      
      <Separator />
      
      <ModulesPreview enabledModules={organization.enabledModules} />
    </div>
  );
}
