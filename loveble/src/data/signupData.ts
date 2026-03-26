/**
 * Signup & Onboarding Data - Legacy OS
 * Dados mockados para fluxo de signup, onboarding e convites
 * 
 * PRD #2: Sistema de Ativação PLG + Efeito Rede (Viral Loop)
 */

// Tipos
export interface User {
  id: string;
  nomeCompleto: string;
  email: string;
  telefone?: string;
  cargo?: string;
  role: 'super_admin' | 'admin_cliente' | 'viewer' | 'membro';
  emailConfirmedAt?: string;
  onboardingCompletedAt?: string;
  isActive: boolean;
  lastLoginAt?: string;
  empresaId?: string;
}

export interface Empresa {
  id: string;
  nome: string;
  razaoSocial?: string;
  cnpj?: string;
  endereco?: {
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
  tipo: 'holding' | 'subsidiaria' | 'coligada';
  isActive: boolean;
  createdBy: string;
}

export interface PlanoAssinatura {
  id: string;
  empresaId: string;
  planoSlug: string;
  precoMensal: number | null;
  precoAnual: number | null;
  frequenciaPagamento: 'mensal' | 'anual';
  trialStartedAt: string;
  trialEndsAt: string;
  isTrial: boolean;
  status: 'trial' | 'active' | 'past_due' | 'canceled' | 'paused';
  limiteEmpresas: number | null;
  limiteConselhos: number | null;
}

export interface Conselho {
  id: string;
  empresaId: string;
  nome: string;
  tipo: string;
  descricao?: string;
  frequenciaReunioes: string;
  duracaoPadraoReuniao: number;
  isActive: boolean;
  createdBy: string;
}

export interface ConselhoMembro {
  id: string;
  conselhoId: string;
  userId: string;
  cargo: string;
  dataEntrada: string;
  dataSaida?: string;
  podeVotar: boolean;
  podeComentar: boolean;
  podeConvidarOutros: boolean;
  isActive: boolean;
}

export interface Invite {
  id: string;
  invitedBy: string;
  empresaId: string;
  conselhoId?: string;
  email: string;
  nomeCompleto: string;
  cargo?: string;
  role: 'admin_cliente' | 'viewer' | 'membro';
  mensagemPersonalizada?: string;
  token: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  sentAt: string;
  acceptedAt?: string;
}

// Tipos de Conselho
export const TIPOS_CONSELHO = [
  { value: 'administracao', label: 'Conselho de Administração' },
  { value: 'consultivo', label: 'Conselho Consultivo' },
  { value: 'fiscal', label: 'Conselho Fiscal' },
  { value: 'comite_auditoria', label: 'Comitê de Auditoria' },
  { value: 'comite_pessoas', label: 'Comitê de Pessoas' },
  { value: 'comite_riscos', label: 'Comitê de Riscos' },
  { value: 'comite_esg', label: 'Comitê ESG' },
  { value: 'comite_estrategia', label: 'Comitê de Estratégia' },
  { value: 'outro', label: 'Outro' },
];

// Frequência de Reuniões
export const FREQUENCIA_REUNIOES = [
  { value: 'semanal', label: 'Semanal' },
  { value: 'quinzenal', label: 'Quinzenal' },
  { value: 'mensal', label: 'Mensal' },
  { value: 'bimestral', label: 'Bimestral' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'semestral', label: 'Semestral' },
  { value: 'anual', label: 'Anual' },
];

// Cargos sugeridos
export const CARGOS_SUGERIDOS = [
  'Presidente do Conselho',
  'Vice-Presidente',
  'Conselheiro Independente',
  'Conselheiro',
  'Secretário Executivo',
  'CEO',
  'CFO',
  'COO',
  'CTO',
  'Controller',
  'Diretor Financeiro',
  'Diretor Jurídico',
  'Auditor Externo',
  'Auditor Interno',
  'Membro Comitê',
  'Outro',
];

// Roles disponíveis
export const ROLES = [
  { value: 'admin_cliente', label: 'Admin', description: 'Acesso total à empresa' },
  { value: 'viewer', label: 'Viewer', description: 'Apenas visualização' },
  { value: 'membro', label: 'Membro', description: 'Acesso ao conselho específico' },
];

// Estados brasileiros
export const ESTADOS_BR = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

// Tópicos de pauta gerados por IA (mock)
export const TOPICOS_PAUTA_IA = [
  'Aprovação da ata da reunião anterior',
  'Revisão do planejamento estratégico 2026',
  'Análise de indicadores financeiros Q4 2025',
  'Discussão sobre cenário macroeconômico',
  'Relatório do Comitê de Auditoria',
  'Avaliação de riscos corporativos',
  'Proposta de investimentos em tecnologia',
  'Plano de sucessão - atualização',
  'Política de ESG e sustentabilidade',
  'Aprovação de orçamento anual',
  'Discussão sobre M&A em análise',
  'Governança e compliance - atualizações regulatórias',
];

// Domínios pessoais (para validação)
export const PERSONAL_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'icloud.com',
  'uol.com.br',
  'bol.com.br',
  'terra.com.br',
  'live.com',
  'me.com',
  'aol.com',
  'protonmail.com',
  'msn.com',
  'globo.com',
  'ig.com.br',
];

// Funções de validação

/**
 * Valida se email é corporativo (não pessoal)
 */
export function isCorporateEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? !PERSONAL_DOMAINS.includes(domain) : false;
}

/**
 * Valida força da senha
 * Min 8 chars, 1 uppercase, 1 number, 1 special char
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Mínimo 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Pelo menos 1 letra maiúscula');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Pelo menos 1 número');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Pelo menos 1 caractere especial (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Formata CNPJ (XX.XXX.XXX/XXXX-XX)
 */
export function formatCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);
}

/**
 * Formata telefone
 */
export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 10) {
    return numbers
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return numbers
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}

/**
 * Gera token único para convite
 */
export function generateInviteToken(): string {
  return `inv_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Gera UUID simples (mock)
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Calcula data de expiração do trial (30 dias)
 */
export function calculateTrialEnd(): string {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString();
}

/**
 * Calcula data de expiração do convite (7 dias)
 */
export function calculateInviteExpiry(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString();
}

// Storage helpers para dados mockados

const STORAGE_KEYS = {
  USERS: 'legacy_users',
  EMPRESAS: 'legacy_empresas',
  PLANOS: 'legacy_planos',
  CONSELHOS: 'legacy_conselhos',
  MEMBROS: 'legacy_membros',
  INVITES: 'legacy_invites',
  CURRENT_USER: 'legacy_current_user',
  ONBOARDING_DATA: 'legacy_onboarding_data',
};

/**
 * Salvar usuário no storage (mock)
 */
export function saveUser(user: User): void {
  const users = getUsers();
  const existingIndex = users.findIndex((u) => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

/**
 * Buscar todos os usuários
 */
export function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  } catch {
    return [];
  }
}

/**
 * Buscar usuário por email
 */
export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Salvar empresa
 */
export function saveEmpresa(empresa: Empresa): void {
  const empresas = getEmpresas();
  const existingIndex = empresas.findIndex((e) => e.id === empresa.id);
  if (existingIndex >= 0) {
    empresas[existingIndex] = empresa;
  } else {
    empresas.push(empresa);
  }
  localStorage.setItem(STORAGE_KEYS.EMPRESAS, JSON.stringify(empresas));
}

/**
 * Buscar todas as empresas
 */
export function getEmpresas(): Empresa[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPRESAS) || '[]');
  } catch {
    return [];
  }
}

/**
 * Salvar plano de assinatura
 */
export function savePlano(plano: PlanoAssinatura): void {
  const planos = getPlanos();
  const existingIndex = planos.findIndex((p) => p.id === plano.id);
  if (existingIndex >= 0) {
    planos[existingIndex] = plano;
  } else {
    planos.push(plano);
  }
  localStorage.setItem(STORAGE_KEYS.PLANOS, JSON.stringify(planos));
}

/**
 * Buscar todos os planos
 */
export function getPlanos(): PlanoAssinatura[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANOS) || '[]');
  } catch {
    return [];
  }
}

/**
 * Salvar conselho
 */
export function saveConselho(conselho: Conselho): void {
  const conselhos = getConselhos();
  const existingIndex = conselhos.findIndex((c) => c.id === conselho.id);
  if (existingIndex >= 0) {
    conselhos[existingIndex] = conselho;
  } else {
    conselhos.push(conselho);
  }
  localStorage.setItem(STORAGE_KEYS.CONSELHOS, JSON.stringify(conselhos));
}

/**
 * Buscar todos os conselhos
 */
export function getConselhos(): Conselho[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONSELHOS) || '[]');
  } catch {
    return [];
  }
}

/**
 * Salvar convite
 */
export function saveInvite(invite: Invite): void {
  const invites = getInvites();
  const existingIndex = invites.findIndex((i) => i.id === invite.id);
  if (existingIndex >= 0) {
    invites[existingIndex] = invite;
  } else {
    invites.push(invite);
  }
  localStorage.setItem(STORAGE_KEYS.INVITES, JSON.stringify(invites));
}

/**
 * Buscar todos os convites
 */
export function getInvites(): Invite[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.INVITES) || '[]');
  } catch {
    return [];
  }
}

/**
 * Buscar convite por token
 */
export function getInviteByToken(token: string): Invite | undefined {
  return getInvites().find((i) => i.token === token);
}

/**
 * Salvar dados do onboarding em progresso
 */
export function saveOnboardingData(data: Record<string, unknown>): void {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_DATA, JSON.stringify(data));
}

/**
 * Buscar dados do onboarding
 */
export function getOnboardingData(): Record<string, unknown> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA) || '{}');
  } catch {
    return {};
  }
}

/**
 * Limpar dados do onboarding
 */
export function clearOnboardingData(): void {
  localStorage.removeItem(STORAGE_KEYS.ONBOARDING_DATA);
}

/**
 * Criar conta (signup mock)
 */
export function createAccount(data: {
  nomeCompleto: string;
  email: string;
  password: string;
  telefone?: string;
  empresa: string;
  cargo?: string;
  planoSlug: string;
  precoAnual?: number;
}): {
  user: User;
  empresa: Empresa;
  plano: PlanoAssinatura;
} {
  const userId = generateUUID();
  const empresaId = generateUUID();
  const planoId = generateUUID();
  const now = new Date().toISOString();

  // Criar usuário
  const user: User = {
    id: userId,
    nomeCompleto: data.nomeCompleto,
    email: data.email,
    telefone: data.telefone,
    cargo: data.cargo,
    role: 'admin_cliente',
    isActive: true,
    empresaId,
    lastLoginAt: now,
  };

  // Criar empresa
  const empresa: Empresa = {
    id: empresaId,
    nome: data.empresa,
    tipo: 'holding',
    isActive: true,
    createdBy: userId,
  };

  // Criar plano de assinatura
  const plano: PlanoAssinatura = {
    id: planoId,
    empresaId,
    planoSlug: data.planoSlug,
    precoMensal: null,
    precoAnual: data.precoAnual || null,
    frequenciaPagamento: 'anual',
    trialStartedAt: now,
    trialEndsAt: calculateTrialEnd(),
    isTrial: true,
    status: 'trial',
    limiteEmpresas: data.planoSlug === 'essencial' ? 1 : data.planoSlug === 'profissional' ? 5 : data.planoSlug === 'business' ? 15 : null,
    limiteConselhos: null,
  };

  // Salvar no storage
  saveUser(user);
  saveEmpresa(empresa);
  savePlano(plano);

  // Configurar sessão mockada
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('auth_role', 'cliente');
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

  return { user, empresa, plano };
}

/**
 * Gerar tópicos de pauta com IA (mock)
 */
export function generatePautaIA(tipoConselho: string): string[] {
  // Seleciona 5-7 tópicos aleatórios baseados no tipo
  const shuffled = [...TOPICOS_PAUTA_IA].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 5);
}

/**
 * Enviar convites (mock)
 */
export function sendInvites(data: {
  conselhoId: string;
  empresaId: string;
  invitedBy: string;
  membros: Array<{
    nome: string;
    email: string;
    cargo?: string;
    role: 'admin_cliente' | 'viewer' | 'membro';
  }>;
  mensagemPersonalizada?: string;
}): Invite[] {
  const invites: Invite[] = [];
  const now = new Date().toISOString();

  for (const membro of data.membros) {
    const invite: Invite = {
      id: generateUUID(),
      invitedBy: data.invitedBy,
      empresaId: data.empresaId,
      conselhoId: data.conselhoId,
      email: membro.email,
      nomeCompleto: membro.nome,
      cargo: membro.cargo,
      role: membro.role,
      mensagemPersonalizada: data.mensagemPersonalizada,
      token: generateInviteToken(),
      expiresAt: calculateInviteExpiry(),
      status: 'pending',
      sentAt: now,
    };

    saveInvite(invite);
    invites.push(invite);
  }

  return invites;
}

/**
 * Aceitar convite (mock)
 */
export function acceptInvite(
  token: string,
  password?: string
): { success: boolean; user?: User; error?: string } {
  const invite = getInviteByToken(token);

  if (!invite) {
    return { success: false, error: 'Convite não encontrado' };
  }

  if (invite.status !== 'pending') {
    return { success: false, error: 'Convite já foi utilizado ou expirou' };
  }

  if (new Date(invite.expiresAt) < new Date()) {
    invite.status = 'expired';
    saveInvite(invite);
    return { success: false, error: 'Convite expirado' };
  }

  // Verificar se usuário já existe
  let user = getUserByEmail(invite.email);

  if (!user) {
    // Criar novo usuário
    user = {
      id: generateUUID(),
      nomeCompleto: invite.nomeCompleto,
      email: invite.email,
      cargo: invite.cargo,
      role: invite.role,
      isActive: true,
      empresaId: invite.empresaId,
      emailConfirmedAt: new Date().toISOString(),
      onboardingCompletedAt: new Date().toISOString(), // Membro não precisa fazer onboarding
    };
    saveUser(user);
  }

  // Atualizar convite
  invite.status = 'accepted';
  invite.acceptedAt = new Date().toISOString();
  saveInvite(invite);

  // Configurar sessão
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('auth_role', 'cliente');

  return { success: true, user };
}

// Limites por plano
export const PLAN_LIMITS = {
  essencial: {
    empresas: 1,
    usuarios: 'ilimitado',
    conselhos: 3,
    reunioesMes: 10,
  },
  profissional: {
    empresas: 5,
    usuarios: 'ilimitado',
    conselhos: 10,
    reunioesMes: 50,
  },
  business: {
    empresas: 15,
    usuarios: 'ilimitado',
    conselhos: 30,
    reunioesMes: null, // ilimitado
  },
  enterprise: {
    empresas: null, // ilimitado
    usuarios: 'ilimitado',
    conselhos: null, // ilimitado
    reunioesMes: null, // ilimitado
  },
};
