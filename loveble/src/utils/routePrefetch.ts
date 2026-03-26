/**
 * routePrefetch - Sistema de prefetch inteligente para rotas
 * Pré-carrega rotas ao passar o mouse (hover) para eliminar "página fria"
 */

export const routePrefetchMap: Record<string, () => Promise<any>> = {
  // Rotas principais de governança
  '/governance-config': () => import('../pages/GovernanceConfig'),
  '/document-checklist': () => import('../pages/DocumentChecklist'),
  '/maturity': () => import('../pages/Maturity'),
  '/esg': () => import('../pages/ESG'),
  '/annual-agenda': () => import('../pages/AnnualAgenda'),
  '/reunioes': () => import('../pages/Reunioes'),
  '/secretariat': () => import('../pages/SecretariatPanel'),
  '/shareholder-structure': () => import('../pages/ShareholderStructure'),
  '/cap-table': () => import('../pages/CapTable'),
  '/interviews': () => import('../pages/Interviews'),
  '/initial-report': () => import('../pages/InitialReport'),
  '/governance-risk-management': () => import('../pages/GovernanceRiskManagement'),
  '/copiloto-governanca': () => import('../pages/GovernanceCopilot'),
  '/people-management': () => import('../pages/PeopleManagement'),
  '/people-development': () => import('../pages/PeopleDevelopment'),
  '/people-governance': () => import('../pages/PeopleGovernance'),
  '/subsystems': () => import('../pages/Subsystems'),
  '/onboarding': () => import('../pages/Onboarding'),
  '/settings': () => import('../pages/Settings'),
  '/dashboard': () => import('../pages/Dashboard'),
  
  // Admin
  '/admin': () => import('../pages/Admin'),
  '/admin/discount-coupons': () => import('../pages/AdminDiscountCoupons'),
  '/admin/partners': () => import('../pages/AdminPartners'),
  '/admin/clients': () => import('../pages/AdminClientManagement'),
  '/admin/contracts': () => import('../pages/AdminContracts'),
  '/admin/finances': () => import('../pages/AdminFinances'),
  '/admin/sales': () => import('../pages/AdminSales'),
  
  // Outras rotas principais
  '/knowledge-base': () => import('../pages/KnowledgeBase'),
  '/activities': () => import('../pages/Activities'),
  '/monitoring': () => import('../pages/Monitoring'),
  '/benchmarking': () => import('../pages/Benchmarking'),
  '/market-intelligence': () => import('../pages/MarketIntelligence'),
};

/**
 * Pré-carrega uma rota específica
 * Usado no hover dos links do menu
 */
export function prefetchRoute(path: string) {
  const prefetchFn = routePrefetchMap[path];
  if (prefetchFn) {
    // Usar requestIdleCallback se disponível, senão setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        prefetchFn().catch(() => null);
      });
    } else {
      setTimeout(() => {
        prefetchFn().catch(() => null);
      }, 100);
    }
  }
}

/**
 * Pré-carrega múltiplas rotas em background
 * Usado após login ou quando usuário está idle
 */
export function prefetchRoutes(paths: string[]) {
  paths.forEach(path => prefetchRoute(path));
}
