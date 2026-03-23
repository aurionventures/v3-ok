export interface AddonModuleInfo {
  title: string;
  description: string;
  features: string[];
}

export const ADDON_MODULES: Record<string, AddonModuleInfo> = {
  "Submeter Projetos": {
    title: "Submeter Projetos",
    description: "Submissão e acompanhamento de projetos pelo conselho.",
    features: [
      "Submissão de projetos para aprovação",
      "Fluxo de aprovação e pareceres",
      "Acompanhamento e evolução de projetos",
    ],
  },
  "Desempenho do Conselho": {
    title: "Desempenho do Conselho",
    description: "Métricas e indicadores de eficácia e maturidade do conselho.",
    features: [
      "Avaliação de desempenho por competência",
      "Indicadores de participação e contribuição",
      "Relatórios de evolução e metas",
    ],
  },
  "Riscos": {
    title: "Riscos",
    description: "Gestão de riscos sistêmicos e matriz de exposição.",
    features: [
      "Matriz de riscos e mitigação",
      "Monitoramento de indicadores de risco",
      "Relatórios e dashboards de exposição",
    ],
  },
  "Desenvolvimento e PDI": {
    title: "Desenvolvimento e PDI",
    description: "Gestão de pessoas e desempenho de liderança.",
    features: [
      "Avaliação de competências",
      "Planos de desenvolvimento",
      "Sucessão de líderes",
    ],
  },
  "Maturidade ESG": {
    title: "Maturidade ESG",
    description: "Métricas ambientais, sociais e de governança integradas.",
    features: [
      "Diagnóstico de maturidade ESG",
      "Indicadores e relatórios GRI",
      "Plano de ação e evolução",
    ],
  },
  "Inteligência de Mercado": {
    title: "Inteligência de Mercado",
    description: "Dados e tendências para decisões estratégicas.",
    features: [
      "Monitoramento de setores e concorrentes",
      "Alertas e relatórios customizados",
      "Benchmarks e cenários",
    ],
  },
  "Benchmarking Global": {
    title: "Benchmarking Global",
    description: "Compare práticas e indicadores com o mercado.",
    features: [
      "Comparativo com pares e melhores práticas",
      "Indicadores normalizados",
      "Relatórios de posicionamento",
    ],
  },
  "Agentes de IA": {
    title: "Agentes de IA",
    description: "Assistentes especializados para governança e análise.",
    features: [
      "Agentes configuráveis por contexto",
      "Análise de documentos e pautas",
      "Recomendações e sugestões automáticas",
    ],
  },
  "Simulador de Cenários": {
    title: "Simulador de Cenários",
    description: "Projeções e simulações para planejamento estratégico.",
    features: [
      "Cenários what-if e sensibilidade",
      "Projeções financeiras e de governança",
      "Relatórios de impacto",
    ],
  },
};
