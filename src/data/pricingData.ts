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
  // Core
  { categoria: 'Core', nome: 'Estrutura Societária', essencial: true, profissional: true, business: true, enterprise: true },
  { categoria: 'Core', nome: 'Gestão de Conselhos', essencial: true, profissional: true, business: true, enterprise: true },
  { categoria: 'Core', nome: 'Reuniões e ATAs', essencial: true, profissional: true, business: true, enterprise: true },
  { categoria: 'Core', nome: 'Gestão de Documentos', essencial: true, profissional: true, business: true, enterprise: true },
  { categoria: 'Core', nome: 'Agenda Anual', essencial: true, profissional: true, business: true, enterprise: true },
  { categoria: 'Core', nome: 'Tarefas e Pendências', essencial: true, profissional: true, business: true, enterprise: true },
  { categoria: 'Core', nome: 'Portal do Membro', essencial: true, profissional: true, business: true, enterprise: true },
  
  // AI Engine
  { categoria: 'AI Engine', nome: 'Análise de Documentos', essencial: 'Básico', profissional: 'Avançado', business: 'Avançado', enterprise: 'Premium' },
  { categoria: 'AI Engine', nome: 'Busca Inteligente', essencial: true, profissional: true, business: true, enterprise: true },
  { categoria: 'AI Engine', nome: 'Sugestões de Pauta', essencial: false, profissional: true, business: true, enterprise: true },
  { categoria: 'AI Engine', nome: 'Agentes Especializados', essencial: false, profissional: '3 agentes', business: '6 agentes', enterprise: 'Ilimitados' },
  { categoria: 'AI Engine', nome: 'Inteligência de Mercado', essencial: false, profissional: false, business: true, enterprise: true },
  
  // Limites
  { categoria: 'Limites', nome: 'Empresas (por CNPJ)', essencial: '1 Empresa', profissional: '1 Empresa', business: '1 Empresa', enterprise: '1 Empresa' },
  { categoria: 'Limites', nome: 'Usuários', essencial: 'Ilimitados', profissional: 'Ilimitados', business: 'Ilimitados', enterprise: 'Ilimitados' },
  { categoria: 'Limites', nome: 'Armazenamento', essencial: '10 GB', profissional: '50 GB', business: '200 GB', enterprise: 'Ilimitado' },
  { categoria: 'Limites', nome: 'Add-ons Inclusos', essencial: '0', profissional: '3', business: '6', enterprise: 'Todos (9)' },
  
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
    icone: 'ClipboardList',
    whatsappMessage: 'Olá, gostaria de saber mais sobre o add-on Projetos Estratégicos',
    precoMensal: 497,
    precoAnual: 4970,
  },
  {
    id: 'pessoas',
    nome: 'Gestão de Pessoas',
    descricao: 'PDI, succession planning, matriz 9-box e feedback contínuo para desenvolvimento de lideranças.',
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
    icone: 'Star',
    whatsappMessage: 'Olá, gostaria de saber mais sobre o add-on Desempenho Conselho',
    precoMensal: 597,
    precoAnual: 5970,
  },
  {
    id: 'riscos',
    nome: 'Riscos Avançados',
    descricao: 'Matriz de riscos corporativos, heat maps, indicadores de risco e alertas automatizados.',
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
    icone: 'Globe',
    whatsappMessage: 'Olá, gostaria de saber mais sobre o add-on Inteligência Mercado',
    precoMensal: 997,
    precoAnual: 9970,
  },
  {
    id: 'benchmarking',
    nome: 'Benchmarking Global',
    descricao: 'Comparação com melhores práticas do mercado e ranking setorial de governança.',
    icone: 'BarChart3',
    whatsappMessage: 'Olá, gostaria de saber mais sobre o add-on Benchmarking Global',
    precoMensal: 697,
    precoAnual: 6970,
  },
  {
    id: 'agentes-ai',
    nome: 'Agentes AI Premium',
    descricao: 'Agentes especializados para análise jurídica, financeira, tributária e compliance.',
    icone: 'Bot',
    novo: true,
    whatsappMessage: 'Olá, gostaria de saber mais sobre o add-on Agentes AI Premium',
    precoMensal: 1497,
    precoAnual: 14970,
  },
  {
    id: 'simulador',
    nome: 'Simulador Cenários',
    descricao: 'Modelagem de cenários estratégicos, análise de impacto e tomada de decisão baseada em dados.',
    icone: 'LineChart',
    whatsappMessage: 'Olá, gostaria de saber mais sobre o add-on Simulador Cenários',
    precoMensal: 1197,
    precoAnual: 11970,
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

// Tabela de preços (BACKEND ONLY - não expor diretamente no frontend)
// Revelado apenas após cálculo da calculadora
export const PRICING_TABLE = {
  essencial: {
    mensal: 1997,
    anual: 19970,
    economia: 3964, // 2 meses
  },
  profissional: {
    mensal: 4997,
    anual: 49970,
    economia: 9964,
  },
  business: {
    mensal: 9997,
    anual: 99970,
    economia: 19964,
  },
  enterprise: {
    mensal: null, // Custom
    anual: null,
    economia: null,
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

// Lógica de recomendação de plano
export function recommendPlan(
  complexityScore: number,
  faturamento: string
): string {
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

  // Faturamento normal - baseado no complexity score
  if (complexityScore <= 5) {
    return 'essencial';
  } else if (complexityScore <= 15) {
    return 'profissional';
  } else if (complexityScore <= 40) {
    return 'business';
  } else {
    return 'enterprise';
  }
}

// Revelar preço baseado no plano
export function revealPricing(planoId: string): {
  mensal: number | null;
  anual: number | null;
  economia: number | null;
  mensalFormatted: string;
  anualFormatted: string;
  economiaFormatted: string;
} {
  const pricing = PRICING_TABLE[planoId as keyof typeof PRICING_TABLE];

  if (!pricing || !pricing.mensal) {
    return {
      mensal: null,
      anual: null,
      economia: null,
      mensalFormatted: 'Sob consulta',
      anualFormatted: 'Sob consulta',
      economiaFormatted: '',
    };
  }

  return {
    mensal: pricing.mensal,
    anual: pricing.anual,
    economia: pricing.economia,
    mensalFormatted: `R$ ${pricing.mensal.toLocaleString('pt-BR')}`,
    anualFormatted: `R$ ${pricing.anual?.toLocaleString('pt-BR')}`,
    economiaFormatted: pricing.economia
      ? `Economize R$ ${pricing.economia.toLocaleString('pt-BR')}`
      : '',
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
