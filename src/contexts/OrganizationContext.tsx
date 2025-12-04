import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Organization, CompanySize, GovernancePlan, ModuleKey } from "@/types/organization";
import { getDefaultModules } from "@/utils/moduleMatrix";
import { useAuth } from "./AuthContext";

interface QuizResult {
  companySize: CompanySize;
  plan: GovernancePlan;
  companyName?: string;
  timestamp: string;
}

interface OrganizationContextType {
  organization: Organization | null;
  loading: boolean;
  setOrganization: (org: Organization) => void;
  hasModule: (moduleKey: ModuleKey) => boolean;
  updateCompanySize: (size: CompanySize) => void;
  updatePlan: (plan: GovernancePlan) => void;
  toggleModule: (moduleKey: ModuleKey) => void;
  completeOnboarding: () => void;
  addModule: (moduleKey: ModuleKey) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

const STORAGE_KEY = 'organization';
const QUIZ_RESULT_KEY = 'quiz_result';

// Map quiz faturamento to company size
function mapFaturamentoToSize(faturamento: string): CompanySize {
  switch (faturamento) {
    case 'ate_4_8m': return 'startup';
    case '4_8m_30m': return 'small';
    case '30m_300m': return 'medium';
    case '300m_4_8b': return 'large';
    case 'acima_4_8b': return 'listed';
    default: return 'medium';
  }
}

// Map quiz complexity to plan
function mapQuizToPlan(temConselho: string, temSucessao: string, avaliacaoRiscosEsg: string): GovernancePlan {
  let complexity = 0;
  
  if (temConselho === 'sim') complexity += 1;
  if (temSucessao === 'sim') complexity += 1;
  if (avaliacaoRiscosEsg === 'recorrente') complexity += 2;
  else if (avaliacaoRiscosEsg === 'esporadica') complexity += 1;
  
  if (complexity >= 3) return 'legacy_360';
  if (complexity >= 2) return 'people_esg';
  if (complexity >= 1) return 'governance_plus';
  return 'core';
}

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

  // Completar onboarding
  const completeOnboarding = () => {
    if (!organization) return;
    setOrganization({
      ...organization,
      onboardingCompleted: true
    });
    // Clear quiz result after activation
    localStorage.removeItem(QUIZ_RESULT_KEY);
  };

  // Adicionar módulo (para add-ons)
  const addModule = (moduleKey: ModuleKey) => {
    if (!organization) return;
    if (organization.enabledModules.includes(moduleKey)) return;
    setOrganization({
      ...organization,
      enabledModules: [...organization.enabledModules, moduleKey]
    });
  };

  // Inicializar do localStorage, quiz result, ou criar default baseado no user
  useEffect(() => {
    const initializeOrg = () => {
      try {
        // First check if organization already exists
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedOrg = JSON.parse(stored);
          setOrganizationState(parsedOrg);
          setLoading(false);
          return;
        }
        
        // Check if there's a quiz result to use
        const quizResultStr = localStorage.getItem(QUIZ_RESULT_KEY);
        if (quizResultStr && user) {
          const quizResult = JSON.parse(quizResultStr);
          const companySize = mapFaturamentoToSize(quizResult.faturamentoFaixa);
          const plan = mapQuizToPlan(
            quizResult.temConselho,
            quizResult.temSucessao,
            quizResult.avaliacaoRiscosEsg
          );
          
          const newOrg: Organization = {
            id: 'org-' + crypto.randomUUID().slice(0, 8),
            name: quizResult.empresaNome || user.company || 'Minha Empresa',
            companySize,
            plan,
            enabledModules: getDefaultModules(companySize, plan),
            onboardingCompleted: false // Not completed - needs to go through activation
          };
          setOrganization(newOrg);
          setLoading(false);
          return;
        }
        
        // Default organization for demo
        if (user) {
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
      toggleModule,
      completeOnboarding,
      addModule
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
