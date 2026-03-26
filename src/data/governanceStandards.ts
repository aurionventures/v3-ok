/**
 * Brazilian Corporate Governance Standards
 * Based on Receita Federal (RFB) and DREI (Department of Business Registration) official codes
 */

// Official RFB Qualification Codes
export const RFB_QUALIFICATION_CODES = {
  "05": "Administrador",
  "08": "Conselheiro de Administração",
  "10": "Diretor",
  "16": "Presidente",
  "22": "Sócio",
  "23": "Sócio Capitalista",
  "28": "Sócio Comanditado",
  "29": "Sócio Comanditário",
  "31": "Sócio Cotista",
  "37": "Sócio Pessoa Física Residente ou Domiciliado no Brasil",
  "38": "Sócio Pessoa Jurídica Domiciliado no Brasil",
  "47": "Sócio Pessoa Física Residente no Exterior",
  "48": "Sócio Pessoa Jurídica Domiciliado no Exterior",
  "49": "Sócio-Administrador",
  "52": "Sócio com Capital",
  "53": "Sócio sem Capital",
  "54": "Fundador",
  "55": "Sócio Comanditado Residente no Exterior",
  "56": "Sócio Comanditário Pessoa Física Residente no Exterior",
  "57": "Sócio Comanditário Pessoa Jurídica Domiciliado no Exterior",
  "58": "Sócio Comanditário Incapaz",
  "63": "Cotas em Tesouraria",
  "65": "Titular Pessoa Física Residente ou Domiciliado no Brasil",
  "66": "Titular Pessoa Física Residente no Exterior",
  "70": "Administrador Judicial",
  "71": "Liquidante",
  "72": "Interventor",
  "74": "Administrador Especial",
  "75": "Procurador",
  "78": "Inventariante",
  "81": "Síndico",
} as const;

// Governance Categories
export interface GovernanceCategory {
  id: string;
  name: string;
  description: string;
  subcategories: GovernanceSubcategory[];
  requiredFields: string[];
  allowedQualificationCodes: string[];
}

export interface GovernanceSubcategory {
  id: string;
  name: string;
  description: string;
  defaultQualificationCode?: string;
  specificRoles: string[];
}

export const GOVERNANCE_CATEGORIES: GovernanceCategory[] = [
  {
    id: "shareholders",
    name: "Acionistas/Sócios",
    description: "Detentores de capital social da empresa",
    requiredFields: ["shareholdingPercentage", "investmentEntryDate", "shareholdingClass"],
    allowedQualificationCodes: ["22", "23", "28", "29", "31", "37", "38", "47", "48", "49", "52", "53", "54"],
    subcategories: [
      {
        id: "founders",
        name: "Fundadores",
        description: "Sócios fundadores da empresa",
        defaultQualificationCode: "54",
        specificRoles: ["Fundador", "Sócio Fundador"],
      },
      {
        id: "managing_partners",
        name: "Sócios-Administradores",
        description: "Sócios com poderes de administração",
        defaultQualificationCode: "49",
        specificRoles: ["Sócio-Administrador", "Sócio Gerente"],
      },
      {
        id: "quota_holders",
        name: "Sócios Quotistas",
        description: "Detentores de quotas (LTDA)",
        defaultQualificationCode: "31",
        specificRoles: ["Quotista", "Sócio Quotista"],
      },
      {
        id: "strategic_investors",
        name: "Investidores Estratégicos",
        description: "Investidores com participação estratégica",
        defaultQualificationCode: "52",
        specificRoles: ["Investidor Estratégico", "Acionista Estratégico"],
      },
      {
        id: "financial_investors",
        name: "Investidores Financeiros",
        description: "Investidores com foco financeiro",
        defaultQualificationCode: "52",
        specificRoles: ["Investidor Financeiro", "Private Equity", "Fundo de Investimento"],
      },
      {
        id: "minority_shareholders",
        name: "Acionistas Minoritários",
        description: "Acionistas com participação minoritária",
        defaultQualificationCode: "22",
        specificRoles: ["Acionista Minoritário", "Sócio Minoritário"],
      },
    ],
  },
  {
    id: "board",
    name: "Órgãos de Administração",
    description: "Conselhos e comitês de governança",
    requiredFields: ["termStartDate"],
    allowedQualificationCodes: ["08"],
    subcategories: [
      {
        id: "board_administration",
        name: "Conselho de Administração",
        description: "Órgão colegiado de deliberação estratégica",
        defaultQualificationCode: "08",
        specificRoles: [
          "Presidente do Conselho",
          "Vice-Presidente do Conselho",
          "Conselheiro Independente",
          "Conselheiro Executivo",
          "Conselheiro Familiar",
          "Conselheiro Externo",
          "Secretário do Conselho",
        ],
      },
      {
        id: "fiscal_council",
        name: "Conselho Fiscal",
        description: "Órgão de fiscalização independente",
        defaultQualificationCode: "08",
        specificRoles: [
          "Presidente do Conselho Fiscal",
          "Conselheiro Fiscal Efetivo",
          "Conselheiro Fiscal Suplente",
        ],
      },
      {
        id: "advisory_council",
        name: "Conselho Consultivo",
        description: "Órgão consultivo não-estatutário",
        defaultQualificationCode: "08",
        specificRoles: [
          "Presidente do Conselho Consultivo",
          "Conselheiro Consultivo",
          "Advisor",
        ],
      },
      {
        id: "committees",
        name: "Comitês",
        description: "Comitês de apoio à governança",
        defaultQualificationCode: "08",
        specificRoles: [
          "Coordenador do Comitê de Auditoria",
          "Membro do Comitê de Auditoria",
          "Coordenador do Comitê de Riscos",
          "Membro do Comitê de Riscos",
          "Coordenador do Comitê de Pessoas",
          "Membro do Comitê de Pessoas",
          "Coordenador do Comitê de Sustentabilidade",
          "Membro do Comitê de Sustentabilidade",
          "Coordenador do Comitê de Compliance",
          "Membro do Comitê de Compliance",
        ],
      },
    ],
  },
  {
    id: "executive",
    name: "Diretoria Executiva",
    description: "Gestão executiva da empresa",
    requiredFields: [],
    allowedQualificationCodes: ["05", "10", "16"],
    subcategories: [
      {
        id: "statutory_directors",
        name: "Diretoria Estatutária",
        description: "Diretores previstos no estatuto/contrato social",
        defaultQualificationCode: "10",
        specificRoles: [
          "Presidente / CEO",
          "Vice-Presidente Executivo",
          "Diretor Presidente",
          "Diretor Vice-Presidente",
        ],
      },
      {
        id: "functional_directors",
        name: "Diretoria Funcional",
        description: "Diretores de áreas específicas",
        defaultQualificationCode: "10",
        specificRoles: [
          "CFO / Diretor Financeiro",
          "COO / Diretor de Operações",
          "CMO / Diretor de Marketing",
          "CTO / Diretor de Tecnologia",
          "CHRO / Diretor de Pessoas",
          "CLO / Diretor Jurídico",
          "CRO / Diretor de Riscos",
          "CCO / Diretor de Compliance",
          "CSO / Diretor de Estratégia",
          "CIO / Diretor de Informação",
          "Diretor Comercial",
          "Diretor Industrial",
          "Diretor Administrativo",
        ],
      },
    ],
  },
  {
    id: "family",
    name: "Estrutura Familiar",
    description: "Membros da família empresária",
    requiredFields: ["generation", "isFamilyMember"],
    allowedQualificationCodes: ["22", "23", "31", "49", "52", "54"],
    subcategories: [
      {
        id: "first_generation",
        name: "Primeira Geração",
        description: "Fundadores e cônjuges",
        specificRoles: ["Fundador", "Cofundador", "Cônjuge de Fundador"],
      },
      {
        id: "second_generation",
        name: "Segunda Geração",
        description: "Filhos dos fundadores",
        specificRoles: ["Herdeiro Direto", "Sucessor", "Filho"],
      },
      {
        id: "third_generation",
        name: "Terceira Geração",
        description: "Netos dos fundadores",
        specificRoles: ["Herdeiro 3ª Geração", "Neto"],
      },
      {
        id: "potential_heirs",
        name: "Herdeiros Potenciais",
        description: "Membros com potencial sucessório",
        specificRoles: ["Herdeiro Potencial", "Sucessor em Preparação"],
      },
    ],
  },
];

// Shareholding Classes
export const SHAREHOLDING_CLASSES = [
  { value: "ON", label: "Ações Ordinárias (ON)" },
  { value: "PN", label: "Ações Preferenciais (PN)" },
  { value: "PNA", label: "Ações Preferenciais Classe A (PNA)" },
  { value: "PNB", label: "Ações Preferenciais Classe B (PNB)" },
  { value: "QUOTAS", label: "Quotas (LTDA)" },
  { value: "MISTA", label: "Participação Mista" },
];

// Investment Types
export const INVESTMENT_TYPES = [
  { value: "capital_inicial", label: "Capital Social Inicial" },
  { value: "aumento_capital", label: "Aumento de Capital" },
  { value: "aquisicao_secundaria", label: "Aquisição Secundária" },
  { value: "conversao_divida", label: "Conversão de Dívida" },
  { value: "permuta_acoes", label: "Permuta de Ações" },
  { value: "heranca", label: "Herança" },
  { value: "doacao", label: "Doação" },
];

// Committees
export const COMMITTEES = [
  { value: "auditoria", label: "Comitê de Auditoria" },
  { value: "riscos", label: "Comitê de Riscos" },
  { value: "pessoas", label: "Comitê de Pessoas e Remuneração" },
  { value: "sustentabilidade", label: "Comitê de Sustentabilidade" },
  { value: "compliance", label: "Comitê de Compliance" },
  { value: "estrategia", label: "Comitê de Estratégia" },
  { value: "inovacao", label: "Comitê de Inovação" },
  { value: "tecnologia", label: "Comitê de Tecnologia" },
  { value: "financas", label: "Comitê de Finanças" },
];

// Family Generations
export const FAMILY_GENERATIONS = [
  { value: "1", label: "1ª Geração (Fundadores)" },
  { value: "2", label: "2ª Geração (Filhos)" },
  { value: "3", label: "3ª Geração (Netos)" },
  { value: "4", label: "4ª Geração (Bisnetos)" },
];

// Member Status
export const MEMBER_STATUS = [
  { value: "Ativo", label: "Ativo", color: "green" },
  { value: "Afastado", label: "Afastado", color: "yellow" },
  { value: "Licenciado", label: "Licenciado", color: "blue" },
  { value: "Inativo", label: "Inativo", color: "gray" },
  { value: "Falecido", label: "Falecido", color: "red" },
];

// Helper functions
export function getQualificationName(code: string): string {
  return RFB_QUALIFICATION_CODES[code as keyof typeof RFB_QUALIFICATION_CODES] || code;
}

export function getCategoryById(id: string): GovernanceCategory | undefined {
  return GOVERNANCE_CATEGORIES.find(cat => cat.id === id);
}

export function getSubcategoryById(categoryId: string, subcategoryId: string): GovernanceSubcategory | undefined {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
}

export function getRequiredFields(categoryId: string): string[] {
  const category = getCategoryById(categoryId);
  return category?.requiredFields || [];
}

export function isQualificationAllowed(categoryId: string, qualificationCode: string): boolean {
  const category = getCategoryById(categoryId);
  return category?.allowedQualificationCodes.includes(qualificationCode) || false;
}

// Validation helpers
export function validateShareholding(percentage: number): boolean {
  return percentage > 0 && percentage <= 100;
}

export function validateTermDates(startDate: Date, endDate: Date): boolean {
  return endDate > startDate;
}
