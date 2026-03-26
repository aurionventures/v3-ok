/**
 * Máscaras e formatações para campos de formulário
 * CEP, CNPJ, CPF, Telefone, etc.
 */

// ==========================================
// FUNÇÕES DE LIMPEZA
// ==========================================

/**
 * Remove todos os caracteres não numéricos
 */
export function onlyNumbers(value: string): string {
  return value.replace(/\D/g, '');
}

// ==========================================
// MÁSCARAS DE CEP
// ==========================================

/**
 * Formata CEP: 00000-000
 */
export function formatCEP(value: string): string {
  const numbers = onlyNumbers(value);
  if (numbers.length <= 5) return numbers;
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
}

/**
 * Valida CEP (8 dígitos)
 */
export function isValidCEP(value: string): boolean {
  const numbers = onlyNumbers(value);
  return numbers.length === 8;
}

// ==========================================
// MÁSCARAS DE CNPJ
// ==========================================

/**
 * Formata CNPJ: 00.000.000/0000-00
 */
export function formatCNPJ(value: string): string {
  const numbers = onlyNumbers(value);
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
}

/**
 * Valida CNPJ usando algoritmo de verificação
 */
export function isValidCNPJ(value: string): boolean {
  const numbers = onlyNumbers(value);
  
  if (numbers.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (parseInt(numbers[12]) !== digit) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(numbers[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (parseInt(numbers[13]) !== digit) return false;
  
  return true;
}

// ==========================================
// MÁSCARAS DE CPF
// ==========================================

/**
 * Formata CPF: 000.000.000-00
 */
export function formatCPF(value: string): string {
  const numbers = onlyNumbers(value);
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
}

/**
 * Valida CPF usando algoritmo de verificação
 */
export function isValidCPF(value: string): boolean {
  const numbers = onlyNumbers(value);
  
  if (numbers.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i);
  }
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (parseInt(numbers[9]) !== digit) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i);
  }
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (parseInt(numbers[10]) !== digit) return false;
  
  return true;
}

// ==========================================
// MÁSCARAS DE TELEFONE
// ==========================================

/**
 * Formata telefone fixo: (00) 0000-0000
 */
export function formatPhone(value: string): string {
  const numbers = onlyNumbers(value);
  if (numbers.length <= 2) return numbers.length ? `(${numbers}` : '';
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`;
}

/**
 * Formata celular: (00) 00000-0000 ou (00) 0000-0000
 */
export function formatCellphone(value: string): string {
  const numbers = onlyNumbers(value);
  if (numbers.length <= 2) return numbers.length ? `(${numbers}` : '';
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

/**
 * Formata telefone genérico (detecta fixo ou celular)
 */
export function formatPhoneGeneric(value: string): string {
  const numbers = onlyNumbers(value);
  // Celular começa com 9 após DDD
  if (numbers.length > 2 && numbers[2] === '9') {
    return formatCellphone(value);
  }
  // Se tem 11 dígitos, é celular
  if (numbers.length === 11) {
    return formatCellphone(value);
  }
  // Caso contrário, formata como telefone fixo
  return formatPhone(value);
}

/**
 * Valida telefone (10 ou 11 dígitos)
 */
export function isValidPhone(value: string): boolean {
  const numbers = onlyNumbers(value);
  return numbers.length === 10 || numbers.length === 11;
}

/**
 * Valida DDD brasileiro
 */
export function isValidDDD(ddd: string): boolean {
  const validDDDs = [
    '11', '12', '13', '14', '15', '16', '17', '18', '19', // SP
    '21', '22', '24', // RJ
    '27', '28', // ES
    '31', '32', '33', '34', '35', '37', '38', // MG
    '41', '42', '43', '44', '45', '46', // PR
    '47', '48', '49', // SC
    '51', '53', '54', '55', // RS
    '61', // DF
    '62', '64', // GO
    '63', // TO
    '65', '66', // MT
    '67', // MS
    '68', // AC
    '69', // RO
    '71', '73', '74', '75', '77', // BA
    '79', // SE
    '81', '87', // PE
    '82', // AL
    '83', // PB
    '84', // RN
    '85', '88', // CE
    '86', '89', // PI
    '91', '93', '94', // PA
    '92', '97', // AM
    '95', // RR
    '96', // AP
    '98', '99', // MA
  ];
  return validDDDs.includes(ddd);
}

// ==========================================
// MÁSCARAS DE MOEDA
// ==========================================

/**
 * Formata valor em Reais: R$ 1.234,56
 */
export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) || 0 : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Formata input de moeda (centavos para reais)
 */
export function formatCurrencyInput(value: string): string {
  const numbers = onlyNumbers(value);
  if (!numbers) return '';
  const cents = parseInt(numbers, 10);
  const reais = cents / 100;
  return formatCurrency(reais);
}

/**
 * Parse moeda formatada para número
 */
export function parseCurrency(value: string): number {
  const cleaned = value
    .replace(/[R$\s.]/g, '')
    .replace(',', '.');
  return parseFloat(cleaned) || 0;
}

// ==========================================
// MÁSCARAS DE DATA
// ==========================================

/**
 * Formata data: DD/MM/AAAA
 */
export function formatDate(value: string): string {
  const numbers = onlyNumbers(value);
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
}

/**
 * Valida data no formato DD/MM/AAAA
 */
export function isValidDate(value: string): boolean {
  const numbers = onlyNumbers(value);
  if (numbers.length !== 8) return false;
  
  const day = parseInt(numbers.slice(0, 2), 10);
  const month = parseInt(numbers.slice(2, 4), 10);
  const year = parseInt(numbers.slice(4, 8), 10);
  
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;
  
  // Verifica dias por mês
  const daysInMonth = new Date(year, month, 0).getDate();
  return day <= daysInMonth;
}

// ==========================================
// OUTRAS MÁSCARAS
// ==========================================

/**
 * Formata RG (varia por estado, usa formato genérico)
 */
export function formatRG(value: string): string {
  const cleaned = value.replace(/[^\dXx]/g, '').toUpperCase();
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
  if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}-${cleaned.slice(8, 9)}`;
}

/**
 * Formata IE (Inscrição Estadual) - formato simplificado
 */
export function formatIE(value: string): string {
  return onlyNumbers(value);
}

/**
 * Formata IM (Inscrição Municipal) - formato simplificado
 */
export function formatIM(value: string): string {
  return onlyNumbers(value);
}

// ==========================================
// HELPER PARA INPUT CONTROLADO
// ==========================================

export type MaskType = 
  | 'cep' 
  | 'cnpj' 
  | 'cpf' 
  | 'phone' 
  | 'cellphone' 
  | 'currency' 
  | 'date'
  | 'rg';

/**
 * Aplica máscara baseada no tipo
 */
export function applyMask(value: string, type: MaskType): string {
  switch (type) {
    case 'cep': return formatCEP(value);
    case 'cnpj': return formatCNPJ(value);
    case 'cpf': return formatCPF(value);
    case 'phone': return formatPhone(value);
    case 'cellphone': return formatCellphone(value);
    case 'currency': return formatCurrencyInput(value);
    case 'date': return formatDate(value);
    case 'rg': return formatRG(value);
    default: return value;
  }
}

/**
 * Valida valor baseado no tipo
 */
export function validateMasked(value: string, type: MaskType): boolean {
  switch (type) {
    case 'cep': return isValidCEP(value);
    case 'cnpj': return isValidCNPJ(value);
    case 'cpf': return isValidCPF(value);
    case 'phone': return isValidPhone(value);
    case 'cellphone': return isValidPhone(value);
    case 'date': return isValidDate(value);
    default: return true;
  }
}
