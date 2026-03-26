import { useOrganization } from "@/contexts/OrganizationContext";
import { SIDEBAR_SECTIONS, SidebarSection } from "@/data/sidebarCatalog";
import { ModuleKey } from "@/types/organization";

export function useModuleAccess() {
  const { organization, hasModule } = useOrganization();

  // Verifica se módulo está habilitado
  const hasAccess = (moduleKey: ModuleKey): boolean => {
    return hasModule(moduleKey);
  };

  // Retorna apenas seções visíveis baseado em enabledModules
  const getVisibleSections = (): SidebarSection[] => {
    if (!organization) return [];
    
    return SIDEBAR_SECTIONS
      .map(section => ({
        ...section,
        items: section.items.filter(item => hasModule(item.key))
      }))
      .filter(section => section.items.length > 0);
  };

  // Retorna todos os módulos habilitados
  const getEnabledModules = (): ModuleKey[] => {
    return organization?.enabledModules || [];
  };

  return { 
    hasAccess, 
    getVisibleSections, 
    getEnabledModules,
    organization 
  };
}
