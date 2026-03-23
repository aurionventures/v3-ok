/**
 * Configuração compartilhada do menu de módulos da empresa.
 * Usada pelo Sidebar para manter consistência.
 */

export interface CompanyMenuItem {
  href: string;
  name: string;
  moduleId: string | null;
  locked?: boolean;
}

export interface CompanyMenuPhase {
  phase: string;
  items: CompanyMenuItem[];
}

export const companyMenuPhases: CompanyMenuPhase[] = [
  {
    phase: "Início",
    items: [
      { href: "/dashboard", name: "Dashboard", moduleId: null },
      { href: "/copiloto-governanca", name: "Copiloto de IA", moduleId: null },
    ],
  },
  {
    phase: "Parametrização",
    items: [
      { href: "/family-structure", name: "Estrutura Societária", moduleId: "family-structure" },
      { href: "/documents", name: "Checklist", moduleId: "documents" },
      { href: "/cap-table", name: "Cap Table", moduleId: "cap-table" },
      { href: "/maturidade-governanca", name: "Maturidade de Governança", moduleId: "maturity" },
      { href: "/entrevistas", name: "Entrevistas", moduleId: "entrevistas" },
    ],
  },
  {
    phase: "Estruturação",
    items: [
      { href: "/councils", name: "Config. de Governança", moduleId: "councils" },
      { href: "/analise-acoes", name: "Análise e Ações", moduleId: null },
      { href: "/agenda", name: "Agenda", moduleId: null },
      { href: "/secretariado", name: "Secretariado", moduleId: null },
    ],
  },
  {
    phase: "Add-ons",
    items: [
      { href: "/planos", name: "Submeter Projetos", moduleId: null, locked: true },
      { href: "/planos", name: "Desempenho do Conselho", moduleId: null, locked: true },
      { href: "/planos", name: "Riscos", moduleId: null, locked: true },
      { href: "/planos", name: "Desenvolvimento e PDI", moduleId: null, locked: true },
      { href: "/planos", name: "Maturidade ESG", moduleId: null, locked: true },
      { href: "/planos", name: "Inteligência de Mercado", moduleId: null, locked: true },
      { href: "/planos", name: "Benchmarking Global", moduleId: null, locked: true },
      { href: "/planos", name: "Agentes de IA", moduleId: null, locked: true },
      { href: "/planos", name: "Simulador de Cenários", moduleId: null, locked: true },
    ],
  },
];
