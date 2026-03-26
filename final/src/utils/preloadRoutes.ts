/**
 * PreloadRoutes - Pré-carrega todas as rotas principais
 * Evita lazy loading a cada clique, mantendo tudo carregado
 */

// Importar todas as rotas principais de forma estática
// Isso força o bundler a incluir tudo no bundle inicial
export function preloadAllRoutes() {
  // Pré-carregar TODAS as rotas (incluindo públicas)
  const routes = [
    // Páginas públicas (landing pages)
    () => import('../pages/Index'),
    () => import('../pages/Pricing'),
    () => import('../pages/Login'),
    () => import('../pages/Signup'),
    () => import('../pages/PoliticaPrivacidade'),
    () => import('../pages/TermosUso'),
    () => import('../pages/LGPD'),
    () => import('../pages/SobreNos'),
    () => import('../pages/ComoFunciona'),
    () => import('../pages/Plataforma'),
    () => import('../pages/Governanca'),
    () => import('../pages/AIEngine'),
    () => import('../pages/Contato'),
    () => import('../pages/Blog'),
    
    // Páginas principais
    () => import('../pages/Dashboard'),
    () => import('../pages/GovernanceConfig'),
    () => import('../pages/DocumentChecklist'),
    () => import('../pages/Maturity'),
    () => import('../pages/ESG'),
    () => import('../pages/AnnualAgenda'),
    () => import('../pages/Reunioes'),
    () => import('../pages/SecretariatPanel'),
    () => import('../pages/ShareholderStructure'),
    () => import('../pages/CapTable'),
    () => import('../pages/Interviews'),
    () => import('../pages/InitialReport'),
    () => import('../pages/GovernanceRiskManagement'),
    () => import('../pages/GovernanceCopilot'),
    () => import('../pages/PeopleManagement'),
    () => import('../pages/PeopleDevelopment'),
    () => import('../pages/PeopleGovernance'),
    () => import('../pages/Subsystems'),
    () => import('../pages/Onboarding'),
    () => import('../pages/Settings'),
    
    // Admin
    () => import('../pages/Admin'),
    () => import('../pages/AdminDiscountCoupons'),
    () => import('../pages/AdminPartners'),
    () => import('../pages/AdminClientManagement'),
    () => import('../pages/AdminContracts'),
    () => import('../pages/AdminFinances'),
    () => import('../pages/AdminSales'),
    () => import('../pages/AdminPromptLibrary'),
    () => import('../pages/AdminAgentConfig'),
    () => import('../pages/AdminGovMetrixCRM'),
    
    // Outras
    () => import('../pages/KnowledgeBase'),
    () => import('../pages/Activities'),
    () => import('../pages/Monitoring'),
    () => import('../pages/Benchmarking'),
    () => import('../pages/MarketIntelligence'),
  ];

  // Carregar todas as rotas em paralelo
  Promise.all(routes.map(route => route().catch(() => null)));
}

/**
 * Pré-carrega rotas críticas imediatamente
 */
export function preloadCriticalRoutes() {
  // Rotas mais usadas - carregar imediatamente
  Promise.all([
    import('../pages/Dashboard'),
    import('../pages/GovernanceConfig'),
    import('../pages/DocumentChecklist'),
    import('../pages/Maturity'),
    import('../pages/ESG'),
    import('../pages/AnnualAgenda'),
    import('../pages/Reunioes'),
    import('../pages/SecretariatPanel'),
  ].map(route => route.catch(() => null)));
}
