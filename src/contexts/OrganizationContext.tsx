import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Organization, CompanySize, GovernancePlan, ModuleKey } from "@/types/organization";
import { getDefaultModules } from "@/utils/moduleMatrix";
import { useAuth } from "./AuthContext";

interface OrganizationContextType {
  organization: Organization | null;
  loading: boolean;
  setOrganization: (org: Organization) => void;
  hasModule: (moduleKey: ModuleKey) => boolean;
  updateCompanySize: (size: CompanySize) => void;
  updatePlan: (plan: GovernancePlan) => void;
  toggleModule: (moduleKey: ModuleKey) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

const STORAGE_KEY = 'organization';

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const [organization, setOrganizationState] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Persistir organização
  const setOrganization = (org: Organization) => {
    setOrganizationState(org);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(org));
  };

  // Verificar acesso a módulo
  const hasModule = (moduleKey: ModuleKey): boolean => {
    if (!organization) return false;
    return organization.enabledModules.includes(moduleKey);
  };

  // Atualizar porte e recalcular módulos
  const updateCompanySize = (size: CompanySize) => {
    if (!organization) return;
    const newModules = getDefaultModules(size, organization.plan);
    setOrganization({
      ...organization,
      companySize: size,
      enabledModules: newModules
    });
  };

  // Atualizar plano e recalcular módulos
  const updatePlan = (plan: GovernancePlan) => {
    if (!organization) return;
    const newModules = getDefaultModules(organization.companySize, plan);
    setOrganization({
      ...organization,
      plan,
      enabledModules: newModules
    });
  };

  // Toggle manual de módulo
  const toggleModule = (moduleKey: ModuleKey) => {
    if (!organization) return;
    const hasIt = organization.enabledModules.includes(moduleKey);
    const newModules = hasIt
      ? organization.enabledModules.filter(m => m !== moduleKey)
      : [...organization.enabledModules, moduleKey];
    setOrganization({
      ...organization,
      enabledModules: newModules
    });
  };

  // Inicializar do localStorage ou criar default baseado no user
  useEffect(() => {
    const initializeOrg = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setOrganizationState(JSON.parse(stored));
        } else if (user) {
          // Criar organização default para demo
          const defaultOrg: Organization = {
            id: 'org-demo',
            name: user.company || 'Empresa Demo',
            companySize: 'medium',
            plan: 'legacy_360',
            enabledModules: getDefaultModules('medium', 'legacy_360'),
            onboardingCompleted: true
          };
          setOrganization(defaultOrg);
        }
      } catch (error) {
        console.error('Erro ao inicializar organização:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeOrg();
  }, [user]);

  return (
    <OrganizationContext.Provider value={{
      organization,
      loading,
      setOrganization,
      hasModule,
      updateCompanySize,
      updatePlan,
      toggleModule
    }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = (): OrganizationContextType => {
  const ctx = useContext(OrganizationContext);
  if (!ctx) throw new Error("useOrganization deve ser usado dentro de OrganizationProvider");
  return ctx;
};
