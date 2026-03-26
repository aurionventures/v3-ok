/**
 * Pricing Data - Legacy OS
 * Dados mockados para página de pricing e calculadora de complexidade
 * 
 * NOTA: Preços são mantidos no backend. Este arquivo contém estrutura e features.
 * Preços só são revelados após cálculo na calculadora.
 */

// Tipos
export interface Plan {
  id: string;
  nome: string;
  descricao: string;
  features: string[];
  limites: {
    empresas: number | 'ilimitado';
    usuarios: string;
    aiEngine: string;
    modulos: number;
    addonsInclusos: number;
  };
  isPopular?: boolean;
  isEnterprise?: boolean;
  cta: string;
}

export interface AddOn {
  id: string;
  nome: string;
  descricao: string;
  features: string[];
  icone: string;
  popular?: boolean;
  novo?: boolean;
  whatsappMessage: string;
  precoMensal: number;
  precoAnual: number;
}

export interface Competitor {
  nome: string;
  precoAnual: number;
  usuarios: string;
  modulos: number;
}

export interface FaturamentoOption {
  value: string;
  label: string;
  peso: number;
}

export interface MaturityOption {
  value: string;
  label: string;
  peso: number;
}

// Opções de Faturamento
export const FATURAMENTO_OPTIONS: FaturamentoOption[] = [
  { value: 'menos-50m', label: '< R$ 50M', peso: 0 },
  { value: '50-300m', label: 'R$ 50M - R$ 300M', peso: 1 },
  { value: '300m-1b', label: 'R$ 300M - R$ 1B', peso: 2 },
  { value: '1b-plus', label: 'R$ 1B+', peso: 3 },
  { value: 'listada', label: 'Empresa Listada (B3)', peso: 4 },
];

// Níveis de Maturidade
export const MATURITY_OPTIONS: MaturityOption[] = [
  { value: 'basico', label: 'Básico - Estrutura informal', peso: 1 },
  { value: 'intermediario', label: 'Intermediário - Processos em desenvolvimento', peso: 2 },
  { value: 'avancado', label: 'Avançado - Governança estruturada', peso: 3 },
  { value: 'world-class', label: 'World-Class - Padrão IBGC/B3', peso: 4 },
];

// Planos (SEM PREÇOS - revelados apenas na calculadora)
export const PLANS: Plan[] = [
  {
    id: 'essencial',
    nome: 'Essencial',
    descricao: 'Para empresas iniciando a jornada de governança',
    features: [
      'Até 1 empresa',
      'Usuários ilimitados',
      'AI Engine v1',
      '13 módulos core',
      'Suporte por email',
      'Documentos básicos',
      'ATAs e deliberações',
    ],
    limites: {
      empresas: 1,
      usuarios: 'Ilimitados',
      aiEngine: 'v1',
      modulos: 13,
      addonsInclusos: 0,
    },
    cta: 'Descobrir Investimento',
  },
  {
    id: 'profissional',
    nome: 'Profissional',
    descricao: 'Para empresas em crescimento com governança estruturada',
    features: [
      'Até 1 empresa',
      'Usuários ilimitados',
      'AI Engine v2',
      '13 módulos core',
      '3 add-ons inclusos',
      'Suporte prioritário',
      'Integrações avançadas',
      'Relatórios customizados',
    ],
    limites: {
      empresas: 1,
      usuarios: 'Ilimitados',
      aiEngine: 'v2',
      modulos: 13,
      addonsInclusos: 3,
    },
    isPopular: true,
    cta: 'Descobrir Investimento',
  },
  {
    id: 'business',
    nome: 'Business',
    descricao: 'Para grupos empresariais com múltiplas subsidiárias',
    features: [
      'Até 1 empresa',
      'Usuários ilimitados',
      'AI Engine v2',
      '13 módulos core',
      '6 add-ons inclusos',
      'Suporte dedicado 24/7',
      'API completa',
      'SSO/SAML',
      'Onboarding assistido',
    ],
    limites: {
      empresas: 1,
      usuarios: 'Ilimitados',
      aiEngine: 'v2',
      modulos: 13,
      addonsInclusos: 6,
    },
    cta: 'Descobrir Investimento',
  },
  {
    id: 'enterprise',
    nome: 'Enterprise',
    descricao: 'Solução completa para grandes corporações e holdings',
    features: [
      'Até 1 empresa',
      'Usuários ilimitados',
      'AI Engine v3 (Premium)',
      '13 módulos core',
      'Todos os add-ons',
      'Suporte white-glove',
      'API ilimitada',
      'Ambiente dedicado',
      'SLA customizado',
      'Implementação exclusiva',
    ],
    limites: {
      empresas: 1,
      usuarios: 'Ilimitados',
      aiEngine: 'v3',
      modulos: 13,
      addonsInclusos: 9,
    },
    isEnterprise: true,
    cta: 'Falar com Especialista',
  },
];

// Features para tabela comparativa
export const COMPARISON_FEATURES = [
  // Core - Módulos Base
  { categoria: 'Core', nome: 'Estrutura Societária', essencial: true, profissional: true, business: true, enterprise: true },
  { categoria: 'Core', nome: 'Gestão de Conselhos', essencial: true, profissional: true, business: true, enterprise: true },
  { categoria: 'Core', nome: 'Reuniões e ATAs', essencial: true, profissional: true, business: true, enterprise: true },
  { categoria: 'Core', nome: 'Gestão de Documentos', essencial: true, profissional: true, business: true, enterprise: true },
  { categoria: 'Core', nome: 'Agenda Anual', essencial: true, profissional: true, business: true, enterprise: true },
  { categoria: 'Core', nome: 'Tarefas e Pendências', essencial: true, profissional: true, business: true, enterprise: true },
  { categoria: 'Core', nome: 'Portal do Membro', essencial: true, profissional: true, business: true, enterprise: true },
  
  // Add-ons (disponibilidade por plano) - 7 módulos premium
  { categoria: 'Add-ons', nome: 'Riscos Avançados', essencial: 'Comprar', profissional: true, business: true, enterprise: true },
  { categoria: 'Add-ons', nome: 'Desempenho Conselho', essencial: 'Comprar', profissional: true, business: true, enterprise: true },
  { categoria: 'Add-ons', nome: 'Gestão de Pessoas', essencial: 'Comprar', profissional: true, business: true, enterprise: true },
  { categoria: 'Add-ons', nome: 'Agentes AI Premium', essencial: 'Comprar', profissional: 'Comprar', business: true, enterprise: true },
  { categoria: 'Add-ons', nome: 'Inteligência Mercado', essencial: 'Comprar', profissional: 'Comprar', business: true, enterprise: true },
  { categoria: 'Add-ons', nome: 'ESG Completo', essencial: 'Comprar', profissional: 'Comprar', business: 'Comprar', enterprise: true },
  { categoria: 'Add-ons', nome: 'Projetos Estratégicos', essencial: 'Comprar', profissional: 'Comprar', business: 'Comprar', enterprise: true },

  // Limites
  { categoria: 'Limites', nome: 'Empresas (por CNPJ)', essencial: '1 Empresa', profissional: '1 Empresa', business: '1 Empresa', enterprise: '1 Empresa' },
  { categoria: 'Limites', nome: 'Usuários', essencial: 'Ilimitados', profissional: 'Ilimitados', business: 'Ilimitados', enterprise: 'Ilimitados' },
  { categoria: 'Limites', nome: 'Armazenamento', essencial: '10 GB', profissional: '50 GB', business: '200 GB', enterprise: 'Ilimitado' },
  { categoria: 'Limites', nome: 'Add-ons Inclusos', essencial: '0', profissional: '3', business: '5', enterprise: 'Todos (7)' },
  
  // Suporte
  { categoria: 'Suporte', nome: 'Email', essencial: true, profissional: true, business: true, enterprise: true },
  { categoria: 'Suporte', nome: 'Chat', essencial: false, profissional: true, business: true, enterprise: true },
  { categoria: 'Suporte', nome: 'Telefone', essencial: false, profissional: false, business: true, enterprise: true },
  { categoria: 'Suporte', nome: 'Gerente Dedicado', essencial: false, profissional: false, business: false, enterprise: true },
  { categoria: 'Suporte', nome: 'SLA Garantido', essencial: '48h', profissional: '24h', business: '8h', enterprise: '4h' },
  
  // Segurança
  { categoria: 'Segurança', nome: '2FA', essencial: true, profissional: true, business: true, enterprise: true },
  { categoria: 'Segurança', nome: 'Audit Log', essencial: true, profissional: true, business: true, enterprise: true },
  { categoria: 'Segurança', nome: 'SSO/SAML', essencial: false, profissional: false, business: true, enterprise: true },
  { categoria: 'Segurança', nome: 'IP Whitelist', essencial: false, profissional: false, business: true, enterprise: true },
  { categoria: 'Segurança', nome: 'Ambiente Dedicado', essencial: false, profissional: false, business: false, enterprise: true },
];

// Add-ons (COM PREÇOS)
export const ADDONS: AddOn[] = [
  {
    id: 'projetos',
    nome: 'Projetos Estratégicos',
    descricao: 'Submeter, votar e acompanhar iniciativas estratégicas com transparência e rastreabilidade total.',
    features: [
      'Submissão de iniciativas',
      'Votação estruturada',
      'Rastreabilidade completa',
      'Relatórios de progresso',
    ],
    icone: 'ClipboardList',
    whatsappMessage: 'Olá, gostaria de saber mais sobre o add-on Projetos Estratégicos',
    precoMensal: 497,
    precoAnual: 4970,
  },
  {
    id: 'pessoas',
    nome: 'Gestão de Pessoas',
    descricao: 'PDI, succession planning, matriz 9-box e feedback contínuo para desenvolvimento de lideranças.',
    features: [
      'PDI estruturado',
      'Succession planning',
      'Matriz 9-box',
      'Feedback contínuo',
    ],
    icone: 'Users',
    popular: true,
    whatsappMessage: 'Olá, gostaria de saber mais sobre o add-on Gestão de Pessoas',
    precoMensal: 697,
    precoAnual: 6970,
  },
  {
    id: 'desempenho',
    nome: 'Desempenho Conselho',
    descricao: 'Avaliação 360° dos membros, NPS de reuniões e feedback anônimo estruturado.',
    features: [
      'Avaliação 360° membros',
      'NPS de reuniões',
      'Feedback anônimo',
      'Dashboards de desempenho',
    ],
    icone: 'Star',
    whatsappMessage: 'Olá, gostaria de saber mais sobre o add-on Desempenho Conselho',
    precoMensal: 597,
    precoAnual: 5970,
  },
  {
    id: 'riscos',
    nome: 'Riscos Avançados',
    descricao: 'Matriz de riscos corporativos, heat maps, indicadores de risco e alertas automatizados.',
    features: [
      'Matriz de riscos',
      'Heat maps visuais',
      'Indicadores de risco',
      'Alertas automatizados',
    ],
    icone: 'ShieldAlert',
    popular: true,
    whatsappMessage: 'Olá, gostaria de saber mais sobre o add-on Riscos Avançados',
    precoMensal: 897,
    precoAnual: 8970,
  },
  {
    id: 'esg',
    nome: 'ESG Completo',
    descricao: 'Indicadores ESG, relatórios de sustentabilidade e compliance com frameworks internacionais.',
    features: [
      'Indicadores ESG',
      'Relatórios sustentabilidade',
      'Compliance internacional',
      'Frameworks GRI, SASB',
    ],
    icone: 'Leaf',
    novo: true,
    whatsappMessage: 'Olá, gostaria de saber mais sobre o add-on ESG Completo',
    precoMensal: 797,
    precoAnual: 7970,
  },
  {
    id: 'inteligencia',
    nome: 'Inteligência Mercado',
    descricao: 'Monitoramento de concorrentes, tendências setoriais e alertas regulatórios em tempo real.',
    features: [
      'Monitoramento concorrentes',
      'Tendências setoriais',
      'Alertas regulatórios',
      'Insights em tempo real',
    ],
    icone: 'Globe',
    whatsappMessage: 'Olá, gostaria de saber mais sobre o add-on Inteligência Mercado',
    precoMensal: 997,
    precoAnual: 9970,
  },
  {
    id: 'agentes-ai',
    nome: 'Agentes AI Premium',
    descricao: 'Agentes especializados para análise jurídica, financeira, tributária e compliance.',
    features: [
      'Agente jurídico AI',
      'Agente financeiro AI',
      'Agente tributário AI',
      'Agente compliance AI',
    ],
    icone: 'Bot',
    novo: true,
    whatsappMessage: 'Olá, gostaria de saber mais sobre o add-on Agentes AI Premium',
    precoMensal: 1497,
    precoAnual: 14970,
  },
];

// Competidores para comparação
export const COMPETITORS: Competitor[] = [
  {
    nome: 'OnBoard',
    precoAnual: 540000,
    usuarios: 'Por usuário',
    modulos: 5,
  },
  {
    nome: 'Diligent',
    precoAnual: 810000,
    usuarios: 'Por usuário',
    modulos: 7,
  },
];

// PRD v3.0 - Matriz de Pricing (Porte × Plano)
// Mínimo: R$ 3.997/mês | Desconto anual: 2 meses grátis (16,67%)
// Setup SMB e SMB+ = 2 × mensalidade | Outros portes = 1 × mensalidade
export const PRICING_MATRIX: Record<string, Record<string, { mensal: number; anual: number; setup: number }>> = {
  // SMB (< R$ 50M/ano) - Setup = 2 × mensalidade | Anual = Mensal × 12
  smb: {
    essencial: { mensal: 3997, anual: 47964, setup: 7994 }, // anual = 3997 × 12, setup = 3997 × 2
    profissional: { mensal: 5997, anual: 71964, setup: 11994 }, // anual = 5997 × 12, setup = 5997 × 2
    business: { mensal: 8997, anual: 107964, setup: 17994 }, // anual = 8997 × 12, setup = 8997 × 2
    enterprise: { mensal: 14997, anual: 179964, setup: 29994 }, // anual = 14997 × 12, setup = 14997 × 2
  },
  // SMB+ (R$ 50M - R$ 300M/ano) - Setup = 2 × mensalidade | Anual = Mensal × 12
  smb_plus: {
    essencial: { mensal: 4997, anual: 59964, setup: 9994 }, // anual = 4997 × 12, setup = 4997 × 2
    profissional: { mensal: 6997, anual: 83964, setup: 13994 }, // anual = 6997 × 12, setup = 6997 × 2
    business: { mensal: 10997, anual: 131964, setup: 21994 }, // anual = 10997 × 12, setup = 10997 × 2
    enterprise: { mensal: 21997, anual: 263964, setup: 43994 }, // anual = 21997 × 12, setup = 21997 × 2
  },
  // Mid-Market (R$ 300M - R$ 1B/ano) - Setup = 1 × mensalidade | Anual = Mensal × 12
  mid_market: {
    essencial: { mensal: 6997, anual: 83964, setup: 6997 }, // anual = 6997 × 12, setup = 6997 × 1
    profissional: { mensal: 9997, anual: 119964, setup: 9997 }, // anual = 9997 × 12, setup = 9997 × 1
    business: { mensal: 15997, anual: 191964, setup: 15997 }, // anual = 15997 × 12, setup = 15997 × 1
    enterprise: { mensal: 26997, anual: 323964, setup: 26997 }, // anual = 26997 × 12, setup = 26997 × 1
  },
  // Large (R$ 1B - R$ 5B/ano) - Setup = 1 × mensalidade | Anual = Mensal × 12
  large: {
    essencial: { mensal: 10997, anual: 131964, setup: 10997 }, // anual = 10997 × 12, setup = 10997 × 1
    profissional: { mensal: 15997, anual: 191964, setup: 15997 }, // anual = 15997 × 12, setup = 15997 × 1
    business: { mensal: 26997, anual: 323964, setup: 26997 }, // anual = 26997 × 12, setup = 26997 × 1
    enterprise: { mensal: 54997, anual: 659964, setup: 54997 }, // anual = 54997 × 12, setup = 54997 × 1
  },
  // Enterprise (R$ 5B+ ou Listada B3) - Setup = 1 × mensalidade | Anual = Mensal × 12
  enterprise: {
    essencial: { mensal: 15997, anual: 191964, setup: 15997 }, // anual = 15997 × 12, setup = 15997 × 1
    profissional: { mensal: 26997, anual: 323964, setup: 26997 }, // anual = 26997 × 12, setup = 26997 × 1
    business: { mensal: 54997, anual: 659964, setup: 54997 }, // anual = 54997 × 12, setup = 54997 × 1
    enterprise: { mensal: 109997, anual: 1319964, setup: 109997 }, // anual = 109997 × 12, setup = 109997 × 1
  },
};

// Descontos de Setup
export const SETUP_DISCOUNTS = {
  annual_upfront: 0.50, // 50% OFF para pagamento anual à vista
  referral: 1.00, // 100% OFF (waived) para indicações
  trial_conversion: 0.30, // 30% OFF para conversão durante trial
};

// Tabela simplificada para compatibilidade (usa SMB como base - novo mínimo R$ 3.997)
export const PRICING_TABLE = {
  essencial: {
    mensal: 3997,
    anual: 47964,
    economia: 7994, // 2 meses
    setup: 7994,
  },
  profissional: {
    mensal: 5997,
    anual: 59970,
    economia: 11994,
    setup: 4497,
  },
  business: {
    mensal: 11997,
    anual: 119970,
    economia: 23994,
    setup: 5997,
  },
  enterprise: {
    mensal: 25000,
    anual: 250000,
    economia: 50000,
    setup: 9997,
  },
};

// FAQ da página de pricing
export const PRICING_FAQ = [
  {
    question: 'Por que não mostram os preços diretamente?',
    answer: 'Cada empresa tem uma complexidade única. Nossa calculadora analisa suas necessidades específicas (número de empresas, conselhos, reuniões) para recomendar o plano ideal e mostrar um investimento justo para sua realidade. Isso garante que você não pague por recursos que não precisa.',
  },
  {
    question: 'Os preços são por usuário?',
    answer: 'Não! Todos os nossos planos incluem usuários ilimitados. O preço é baseado na complexidade da sua estrutura de governança (número de empresas, conselhos e reuniões), não no número de pessoas que usam a plataforma.',
  },
  {
    question: 'Posso fazer upgrade de plano depois?',
    answer: 'Sim! Você pode fazer upgrade a qualquer momento. O valor pago será calculado proporcionalmente (pro-rata) ao período restante do seu plano atual.',
  },
  {
    question: 'Existe período de trial?',
    answer: 'Oferecemos 30 dias de trial gratuito, sem necessidade de cartão de crédito. Durante o trial, você tem acesso completo ao plano escolhido para avaliar se atende suas necessidades.',
  },
  {
    question: 'Como funciona a cobrança?',
    answer: 'A cobrança pode ser mensal ou anual. Optando pelo plano anual, você economiza o equivalente a 2 meses de mensalidade. Aceitamos cartão de crédito, boleto bancário e PIX.',
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim, você pode cancelar a qualquer momento. No plano anual, você mantém acesso até o final do período contratado. Garantimos a exportação de todos os seus dados em formatos padrão.',
  },
  {
    question: 'Os add-ons são obrigatórios?',
    answer: 'Não. Os add-ons são módulos opcionais que expandem as funcionalidades da plataforma. Cada plano já inclui alguns add-ons, e você pode adicionar mais conforme sua necessidade.',
  },
  {
    question: 'Vocês oferecem desconto para ONGs ou instituições públicas?',
    answer: 'Sim, temos condições especiais para organizações sem fins lucrativos, instituições de ensino e órgãos públicos. Entre em contato com nossa equipe comercial para conhecer as opções.',
  },
];

// Fórmula do Complexity Score
export function calculateComplexityScore(inputs: {
  numEmpresas: number;
  numConselhos: number;
  numComites: number;
  reunioesAno: number;
}): number {
  const { numEmpresas, numConselhos, numComites, reunioesAno } = inputs;

  const score =
    numEmpresas * 1 +
    numConselhos * 3 +
    numComites * 2 +
    reunioesAno / 10;

  return Math.round(score * 10) / 10;
}

// Classificação do Complexity Score
export function getComplexityLevel(score: number): {
  level: string;
  description: string;
  color: string;
} {
  if (score <= 10) {
    return {
      level: 'Baixa',
      description: 'Estrutura enxuta, ideal para começar',
      color: 'text-green-600',
    };
  } else if (score <= 30) {
    return {
      level: 'Moderada',
      description: 'Complexidade típica de empresas em crescimento',
      color: 'text-yellow-600',
    };
  } else if (score <= 60) {
    return {
      level: 'Alta',
      description: 'Estrutura robusta requer governança avançada',
      color: 'text-orange-600',
    };
  } else {
    return {
      level: 'Muito Alta',
      description: 'Complexidade de grande corporação',
      color: 'text-red-600',
    };
  }
}

// Valores mínimos por faturamento e estrutura informal (1 conselho, 12 reuniões, até 10 usuários)
export const MINIMUM_PRICES: Record<string, number> = {
  'menos-50m': 3997,      // < R$ 50M + informal = R$ 3.997
  '50-300m': 5997,        // R$ 50M - R$ 300M + informal = R$ 5.997
  '300m-1b': 7997,        // R$ 300M - R$ 1B + informal = R$ 7.997
  '1b-plus': 8997,        // > R$ 1B + informal = R$ 8.997
  'listada': 14997,       // Listada + informal = R$ 14.997
};

// Multiplicadores para aumentos proporcionais
export const COMPLEXITY_MULTIPLIERS = {
  conselho: 0.15,         // Cada conselho adicional = +15% do valor base
  comite: 0.10,          // Cada comitê adicional = +10% do valor base
  reuniao: 0.001,        // Cada reunião adicional acima de 12 = +0.1% do valor base
  usuario: 0.005,        // Cada usuário adicional acima de 10 = +0.5% do valor base
};

/**
 * Calcula o preço do plano baseado em faturamento, maturidade e complexidade
 * @param faturamento - Faixa de faturamento
 * @param maturidade - Nível de maturidade (estrutura informal = 'basico')
 * @param numConselhos - Número de conselhos
 * @param numComites - Número de comitês
 * @param reunioesAno - Número de reuniões por ano
 * @param numUsuarios - Número de usuários
 * @returns Preço mensal calculado
 */
export function calculatePlanPrice(
  faturamento: string,
  maturidade: string,
  numConselhos: number = 1,
  numComites: number = 0,
  reunioesAno: number = 12,
  numUsuarios: number = 10
): number {
  // Obter valor mínimo baseado no faturamento
  const basePrice = MINIMUM_PRICES[faturamento] || MINIMUM_PRICES['menos-50m'];
  
  // Se não for estrutura informal, aplicar multiplicador de maturidade
  let maturityMultiplier = 1.0;
  if (maturidade === 'intermediario') {
    maturityMultiplier = 1.2; // +20% para intermediário
  } else if (maturidade === 'avancado') {
    maturityMultiplier = 1.4; // +40% para avançado
  } else if (maturidade === 'world-class') {
    maturityMultiplier = 1.6; // +60% para world-class
  }
  
  let adjustedPrice = basePrice * maturityMultiplier;
  
  // Calcular aumentos proporcionais
  // Conselhos: acima de 1 conselho
  if (numConselhos > 1) {
    const conselhosAdicionais = numConselhos - 1;
    adjustedPrice += basePrice * COMPLEXITY_MULTIPLIERS.conselho * conselhosAdicionais;
  }
  
  // Comitês: cada comitê adicional
  if (numComites > 0) {
    adjustedPrice += basePrice * COMPLEXITY_MULTIPLIERS.comite * numComites;
  }
  
  // Reuniões: acima de 12 reuniões/ano
  if (reunioesAno > 12) {
    const reunioesAdicionais = reunioesAno - 12;
    adjustedPrice += basePrice * COMPLEXITY_MULTIPLIERS.reuniao * reunioesAdicionais;
  }
  
  // Usuários: acima de 10 usuários
  if (numUsuarios > 10) {
    const usuariosAdicionais = numUsuarios - 10;
    adjustedPrice += basePrice * COMPLEXITY_MULTIPLIERS.usuario * usuariosAdicionais;
  }
  
  // Arredondar para múltiplo de 1 (sem centavos)
  return Math.round(adjustedPrice);
}

/**
 * Determina o plano baseado no preço calculado
 * @param calculatedPrice - Preço mensal calculado
 * @param faturamento - Faixa de faturamento
 * @returns ID do plano recomendado
 */
export function determinePlanFromPrice(
  calculatedPrice: number,
  faturamento: string
): string {
  // Obter valores mínimos de cada plano para o porte
  const porteKey = mapFaturamentoToPorte(faturamento);
  const planos = PRICING_MATRIX[porteKey] || PRICING_MATRIX.smb;
  
  // Encontrar o plano mais adequado baseado no preço calculado
  // Se o preço calculado for menor que o Essencial, retornar Essencial
  if (calculatedPrice <= planos.essencial.mensal) {
    return 'essencial';
  }
  
  // Se o preço calculado for menor que o Profissional, retornar Profissional
  if (calculatedPrice <= planos.profissional.mensal) {
    return 'profissional';
  }
  
  // Se o preço calculado for menor que o Business, retornar Business
  if (calculatedPrice <= planos.business.mensal) {
    return 'business';
  }
  
  // Caso contrário, Enterprise
  return 'enterprise';
}

/**
 * Mapeia faturamento para chave de porte na matriz de pricing
 */
export function mapFaturamentoToPorte(faturamento: string): string {
  const mapping: Record<string, string> = {
    'menos-50m': 'smb',
    '50-300m': 'smb_plus',
    '300m-1b': 'mid_market',
    '1b-plus': 'large',
    'listada': 'enterprise',
  };
  return mapping[faturamento] || 'smb';
}

// Lógica de recomendação de plano (refatorada)
// Considera: faturamento, maturidade, número de conselhos, comitês, reuniões e usuários
export function recommendPlan(
  complexityScore: number,
  faturamento: string,
  numComites?: number,
  numUsuarios?: number,
  maturidade?: string,
  numConselhos?: number,
  reunioesAno?: number
): string {
  // Se temos todos os parâmetros necessários, usar cálculo de preço
  if (maturidade && numConselhos !== undefined && reunioesAno !== undefined) {
    const calculatedPrice = calculatePlanPrice(
      faturamento,
      maturidade,
      numConselhos,
      numComites || 0,
      reunioesAno,
      numUsuarios || 10
    );
    
    return determinePlanFromPrice(calculatedPrice, faturamento);
  }
  
  // Fallback para lógica antiga se não tiver todos os parâmetros
  // Empresas listadas sempre Enterprise
  if (faturamento === 'listada') {
    return 'enterprise';
  }

  // Faturamento alto sugere plano maior
  if (faturamento === '1b-plus') {
    if (complexityScore <= 20) return 'business';
    return 'enterprise';
  }

  if (faturamento === '300m-1b') {
    if (complexityScore <= 10) return 'profissional';
    if (complexityScore <= 40) return 'business';
    return 'enterprise';
  }

  // Baseado no complexity score
  if (complexityScore <= 10) {
    return 'essencial';
  } else if (complexityScore <= 20) {
    return 'profissional';
  } else if (complexityScore <= 40) {
    return 'business';
  } else {
    return 'enterprise';
  }
}

// Revelar preço baseado no plano
// Agora suporta cálculo dinâmico ou uso da matriz estática
export function revealPricing(
  planoId: string, 
  porte: string = 'smb',
  calculatedPrice?: number
): {
  mensal: number | null;
  anual: number | null;
  economia: number | null;
  setup: number | null;
  mensalFormatted: string;
  anualFormatted: string;
  economiaFormatted: string;
  setupFormatted: string;
  setupDescontos: {
    anualVista: number;
    referral: number;
    trial: number;
  };
} {
  // Se temos um preço calculado dinamicamente, usar ele
  let mensalPrice: number;
  
  if (calculatedPrice !== undefined) {
    mensalPrice = calculatedPrice;
  } else {
    // Tentar pegar da matriz completa primeiro
    const matrixPricing = PRICING_MATRIX[porte]?.[planoId];
    
    // Fallback para tabela simplificada
    const simplePricing = PRICING_TABLE[planoId as keyof typeof PRICING_TABLE];
    
    const pricing = matrixPricing || simplePricing;
    
    if (!pricing || !pricing.mensal) {
      return {
        mensal: null,
        anual: null,
        economia: null,
        setup: null,
        mensalFormatted: 'Sob consulta',
        anualFormatted: 'Sob consulta',
        economiaFormatted: '',
        setupFormatted: 'Sob consulta',
        setupDescontos: { anualVista: 0, referral: 0, trial: 0 },
      };
    }
    
    mensalPrice = pricing.mensal;
  }

  // Calcular valores anuais e setup baseados no preço mensal
  // Anual = mensal × 12 (sem desconto, pois já está aplicado na matriz)
  // Setup = 2× mensal para SMB/SMB+, 1× mensal para outros
  const isSMB = porte === 'smb' || porte === 'smb_plus';
  const setupMultiplier = isSMB ? 2 : 1;
  
  const anualPrice = mensalPrice * 12;
  const setupPrice = mensalPrice * setupMultiplier;
  
  // Economia anual = diferença entre pagamento mensal × 12 e anual (se houver desconto)
  // Como não há desconto explícito, economia = 0 ou pode ser calculada como 2 meses
  const economia = mensalPrice * 2; // 2 meses de economia no plano anual

  return {
    mensal: mensalPrice,
    anual: anualPrice,
    economia: economia,
    setup: setupPrice,
    mensalFormatted: `R$ ${mensalPrice.toLocaleString('pt-BR')}`,
    anualFormatted: `R$ ${anualPrice.toLocaleString('pt-BR')}`,
    economiaFormatted: economia > 0
      ? `Economize R$ ${economia.toLocaleString('pt-BR')}`
      : '',
    setupFormatted: `R$ ${setupPrice.toLocaleString('pt-BR')}`,
    setupDescontos: {
      anualVista: Math.round(setupPrice * (1 - SETUP_DISCOUNTS.annual_upfront)),
      referral: Math.round(setupPrice * (1 - SETUP_DISCOUNTS.referral)),
      trial: Math.round(setupPrice * (1 - SETUP_DISCOUNTS.trial_conversion)),
    },
  };
}

// Gerar justificativa para recomendação
export function generateJustification(inputs: {
  numEmpresas: number;
  numConselhos: number;
  numComites: number;
  reunioesAno: number;
  planoId: string;
}): string {
  const { numEmpresas, numConselhos, numComites, reunioesAno, planoId } = inputs;
  const plan = PLANS.find((p) => p.id === planoId);

  if (!plan) return '';

  const partes: string[] = [];

  partes.push(`Sua empresa possui ${numEmpresas} empresa${numEmpresas > 1 ? 's' : ''}`);

  if (numConselhos > 0) {
    partes.push(`${numConselhos} conselho${numConselhos > 1 ? 's' : ''}`);
  }

  if (numComites > 0) {
    partes.push(`${numComites} comitê${numComites > 1 ? 's' : ''}`);
  }

  partes.push(`com estimativa de ${reunioesAno} reuniões por ano`);

  const limite =
    plan.limites.empresas === 'ilimitado'
      ? 'empresas ilimitadas'
      : `até ${plan.limites.empresas} empresas`;

  return `${partes.join(', ')}. O plano ${plan.nome} suporta ${limite} e usuários ilimitados, sendo ideal para sua complexidade atual.`;
}

// Calcular ROI estimado
export function calculateROI(planoId: string): {
  economiaLicencas: number;
  economiaTempo: number;
  beneficioTotal: number;
  roiPercentual: number;
} {
  const pricing = PRICING_TABLE[planoId as keyof typeof PRICING_TABLE];
  const precoLegacy = pricing?.anual || 100000;

  // Média dos competidores
  const mediaCompetidores =
    COMPETITORS.reduce((acc, c) => acc + c.precoAnual, 0) / COMPETITORS.length;

  const economiaLicencas = Math.round(mediaCompetidores - precoLegacy);
  const economiaTempo = 180000; // Estimativa fixa de economia de tempo
  const beneficioTotal = economiaLicencas + economiaTempo;
  const roiPercentual = Math.round((beneficioTotal / precoLegacy) * 100);

  return {
    economiaLicencas: Math.max(0, economiaLicencas),
    economiaTempo,
    beneficioTotal: Math.max(economiaTempo, beneficioTotal),
    roiPercentual: Math.max(100, roiPercentual),
  };
}

// WhatsApp URL helper
export const WHATSAPP_NUMBER = '5547991622220';

export function getWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

// Gerar mensagem WhatsApp para resultado da calculadora
export function getCalculatorWhatsAppMessage(
  complexityScore: number,
  planoId: string,
  empresaNome?: string
): string {
  const plan = PLANS.find((p) => p.id === planoId);
  const empresa = empresaNome ? ` da empresa ${empresaNome}` : '';

  return `Olá! Vim da calculadora de pricing${empresa}. Meu Complexity Score é ${complexityScore} e o plano recomendado é ${plan?.nome || planoId}. Gostaria de falar com um especialista.`;
}
