// Lógica de recomendação de plano baseada em faturamento, complexidade e maturidade ISCA

export type RevenueRange = 
  | 'menos_50m'
  | 'ate_4_8m'
  | '4_8m_30m'
  | '30m_300m'
  | '300m_4_8b'
  | 'acima_4_8b';

export type PlanId = 'startup' | 'pequena' | 'media' | 'grande' | 'listada';

export type MaturityStage = 'Embrionário' | 'Inicial' | 'Em Desenvolvimento' | 'Estruturado' | 'Avançado';

export interface QuizAnswers {
  faturamentoFaixa: RevenueRange;
  temConselho: 'nao' | 'estruturando' | 'sim';
  temSucessao: 'nao' | 'em_construcao' | 'sim';
  avaliacaoRiscosEsg: 'nao' | 'parcial' | 'sim';
  numeroColaboradores: 'ate_20' | '21_100' | '101_500' | '501_1000' | 'mais_1000';
}

export interface ContactInfo {
  empresaNome: string;
  contatoNome: string;
  contatoEmail: string;
  contatoWhatsapp: string;
}

// Dados da ISCA (GovMetrix Quiz)
export interface GovMetrixResult {
  score: number;
  stage: MaturityStage;
  categoryScores: Record<string, number>;
  leadData: {
    name: string;
    company: string;
    email: string;
    whatsapp: string;
  };
  completedAt: string;
}

// Chaves do localStorage para o funil PLG
export const PLG_STORAGE_KEYS = {
  GOVMETRIX_RESULT: 'govmetrix_result',
  QUIZ_RESULT: 'quiz_result',
  QUIZ_RESPONSES: 'quiz_responses',
  CHECKOUT_DATA: 'checkout_data',
  PAYMENT_COMPLETED: 'payment_completed',
} as const;

// Mapear faturamento para plano base
const REVENUE_TO_PLAN: Record<RevenueRange, PlanId> = {
  menos_50m: 'startup',
  ate_4_8m: 'startup',
  '4_8m_30m': 'pequena',
  '30m_300m': 'media',
  '300m_4_8b': 'grande',
  acima_4_8b: 'listada',
};

// Ordem dos planos para upgrade
const PLAN_ORDER: PlanId[] = ['startup', 'pequena', 'media', 'grande', 'listada'];

// Função principal de recomendação
export function getRecommendedPlan(answers: QuizAnswers, govMetrixScore?: number): PlanId {
  // Plano base por faturamento
  let basePlan = REVENUE_TO_PLAN[answers.faturamentoFaixa];
  let basePlanIndex = PLAN_ORDER.indexOf(basePlan);
  
  // Contagem de pontos de complexidade
  let complexityPoints = 0;
  
  // Tem conselho funcionando = +1
  if (answers.temConselho === 'sim') {
    complexityPoints += 1;
  }
  
  // Tem sucessão formal = +1
  if (answers.temSucessao === 'sim') {
    complexityPoints += 1;
  }
  
  // Avaliação de riscos/ESG recorrente = +1
  if (answers.avaliacaoRiscosEsg === 'sim') {
    complexityPoints += 1;
  }
  
  // Muitos colaboradores pode indicar maior complexidade
  if (answers.numeroColaboradores === '501_1000' || answers.numeroColaboradores === 'mais_1000') {
    complexityPoints += 1;
  }

  // Considerar score de maturidade da ISCA (GovMetrix)
  // Score alto (>60) indica governança mais madura = pode precisar de plano mais completo
  // Score baixo (<40) indica necessidade de estruturação básica
  if (govMetrixScore !== undefined) {
    if (govMetrixScore >= 60) {
      complexityPoints += 1; // Maturidade alta = mais features
    }
    if (govMetrixScore >= 80) {
      complexityPoints += 1; // Maturidade avançada = enterprise
    }
  }
  
  // Se tem 3+ pontos de complexidade, subir 1 tier (máximo 2 tiers)
  const upgradeTiers = Math.min(Math.floor(complexityPoints / 3), 2);
  const finalIndex = Math.min(basePlanIndex + upgradeTiers, PLAN_ORDER.length - 1);
  
  return PLAN_ORDER[finalIndex];
}

// Obter dados da ISCA do localStorage
export function getGovMetrixResult(): GovMetrixResult | null {
  try {
    const stored = localStorage.getItem(PLG_STORAGE_KEYS.GOVMETRIX_RESULT);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Erro ao recuperar dados GovMetrix:', error);
  }
  return null;
}

// Salvar dados da ISCA no localStorage
export function saveGovMetrixResult(result: GovMetrixResult): void {
  try {
    localStorage.setItem(PLG_STORAGE_KEYS.GOVMETRIX_RESULT, JSON.stringify(result));
  } catch (error) {
    console.error('Erro ao salvar dados GovMetrix:', error);
  }
}

// Mapear score para respostas do quiz (inferência)
export function inferQuizAnswersFromGovMetrix(govMetrix: GovMetrixResult): Partial<QuizAnswers> {
  const categoryScores = govMetrix.categoryScores;
  
  return {
    temConselho: categoryScores['Conselho de administração/consultivo'] >= 60 ? 'sim' : 
                 categoryScores['Conselho de administração/consultivo'] >= 30 ? 'estruturando' : 'nao',
    avaliacaoRiscosEsg: categoryScores['Gestão de Riscos'] >= 60 ? 'sim' :
                        categoryScores['Gestão de Riscos'] >= 30 ? 'parcial' : 'nao',
  };
}

// Verificar se lead veio da ISCA
export function hasGovMetrixData(): boolean {
  return localStorage.getItem(PLG_STORAGE_KEYS.GOVMETRIX_RESULT) !== null;
}

// Dados dos planos para exibição
export const PLAN_DATA: Record<PlanId, {
  id: PlanId;
  nome: string;
  faixaFaturamentoLabel: string;
  precoMensal: string;
  descricaoResumida: string;
  bullets: string[];
  corHex: string;
  iconName: string;
}> = {
  startup: {
    id: 'startup',
    nome: 'Startup',
    faixaFaturamentoLabel: 'até R$ 4,8 milhões/ano',
    precoMensal: 'R$ 2.990',
    descricaoResumida: 'Ideal para empresas em fase inicial que desejam estruturar governança desde cedo.',
    bullets: [
      'Diagnóstico de maturidade em governança',
      'Estruturação básica de órgãos',
      'Modelo de atas e documentos',
      'Suporte via chat'
    ],
    corHex: '#6366f1',
    iconName: 'Rocket'
  },
  pequena: {
    id: 'pequena',
    nome: 'Pequena Empresa',
    faixaFaturamentoLabel: 'R$ 4,8M a R$ 30M/ano',
    precoMensal: 'R$ 4.990',
    descricaoResumida: 'Para empresas que já possuem estrutura básica e querem profissionalizar a governança.',
    bullets: [
      'Tudo do plano Startup',
      'Gestão completa de reuniões',
      'Secretariado digital',
      'Gestão de pendências',
      'Suporte prioritário'
    ],
    corHex: '#3b82f6',
    iconName: 'Building'
  },
  media: {
    id: 'media',
    nome: 'Média Empresa',
    faixaFaturamentoLabel: 'R$ 30M a R$ 300M/ano',
    precoMensal: 'R$ 7.990',
    descricaoResumida: 'Solução completa para empresas em expansão com múltiplos órgãos de governança.',
    bullets: [
      'Tudo do plano Pequena Empresa',
      'Múltiplos conselhos e comitês',
      'Gestão de riscos básica',
      'Avaliação de performance de órgãos',
      'Consultoria trimestral'
    ],
    corHex: '#10b981',
    iconName: 'Building2'
  },
  grande: {
    id: 'grande',
    nome: 'Grande Empresa',
    faixaFaturamentoLabel: 'R$ 300M a R$ 4,8B/ano',
    precoMensal: 'R$ 14.990',
    descricaoResumida: 'Para grandes empresas com governança complexa e necessidade de compliance avançado.',
    bullets: [
      'Tudo do plano Média Empresa',
      'Módulo ESG completo',
      'Gestão de riscos avançada',
      'Integrações customizadas',
      'Usuários ilimitados',
      'Consultoria mensal',
      'SLA dedicado'
    ],
    corHex: '#f59e0b',
    iconName: 'Globe'
  },
  listada: {
    id: 'listada',
    nome: 'Empresa Listada',
    faixaFaturamentoLabel: 'acima de R$ 4,8B/ano',
    precoMensal: 'Sob consulta',
    descricaoResumida: 'Solução enterprise para empresas listadas com exigências regulatórias específicas.',
    bullets: [
      'Tudo do plano Grande Empresa',
      'Inteligência de Mercado',
      'Compliance regulatório (CVM, B3)',
      'Relatórios para investidores',
      'Ambiente dedicado',
      'Consultoria semanal',
      'Suporte 24/7'
    ],
    corHex: '#8b5cf6',
    iconName: 'TrendingUp'
  }
};

// Labels para exibição das opções do quiz
export const REVENUE_LABELS: Record<RevenueRange, string> = {
  menos_50m: 'Menos de R$ 50M/ano',
  ate_4_8m: 'Até R$ 4,8 milhões/ano',
  '4_8m_30m': 'De R$ 4,8M a R$ 30M/ano',
  '30m_300m': 'De R$ 30M a R$ 300M/ano',
  '300m_4_8b': 'De R$ 300M a R$ 4,8B/ano',
  acima_4_8b: 'Acima de R$ 4,8B/ano'
};

export const COUNCIL_LABELS = {
  nao: 'Não',
  estruturando: 'Estamos estruturando',
  sim: 'Sim, já está em funcionamento'
};

export const SUCCESSION_LABELS = {
  nao: 'Não',
  em_construcao: 'Em construção',
  sim: 'Sim'
};

export const ESG_LABELS = {
  nao: 'Não',
  parcial: 'Parcial (alguns tópicos)',
  sim: 'Sim, de forma recorrente'
};

export const EMPLOYEES_LABELS = {
  ate_20: 'Até 20',
  '21_100': '21 a 100',
  '101_500': '101 a 500',
  '501_1000': '501 a 1.000',
  mais_1000: 'Mais de 1.000'
};

// Gerar link do WhatsApp com mensagem pré-preenchida
export function generateWhatsAppLink(
  planName: string,
  contactInfo: ContactInfo,
  faturamentoLabel: string
): string {
  const phoneNumber = '5547991622220';
  const message = `Olá, equipe Legacy! Acabei de fazer o Quiz na landing e o plano recomendado foi: ${planName}.\n\nFaturamento: ${faturamentoLabel}\nEmpresa: ${contactInfo.empresaNome}\nContato: ${contactInfo.contatoNome} - ${contactInfo.contatoEmail} - ${contactInfo.contatoWhatsapp}`;
  
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
