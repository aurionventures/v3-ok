/**
 * Tipos para Sistema de Billing - Legacy OS
 * Integração com Asaas para gestão de contratos e faturas
 */

// ==================== PROPOSTA COMERCIAL ====================

export interface ProposalAddon {
  addon_id: string;
  addon_name: string;
  price_monthly: number;
  price_annual: number;
}

export interface Proposal {
  id: string;
  client_id: string;
  
  // Plano selecionado
  plan_id: string;
  plan_name: string;
  porte: 'smb_plus' | 'mid_market' | 'large' | 'enterprise';
  
  // Add-ons selecionados
  addons: ProposalAddon[];
  
  // Valores calculados
  base_price_monthly: number;
  base_price_annual: number;
  addons_price_monthly: number;
  addons_price_annual: number;
  total_monthly: number;
  total_annual: number;
  
  // Contrato
  contract_term: 12 | 24 | 36; // meses
  payment_cycle: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  setup_fee: number;
  setup_fee_discounted: number;
  discount_percentage: number;
  
  // Total do contrato
  total_contract_value: number;
  
  // Status
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  valid_until: string;
  
  // Metadados
  created_at: string;
  created_by: string;
  sent_at?: string;
  viewed_at?: string;
  accepted_at?: string;
  accepted_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
}

// ==================== CONTRATO ====================

export type ContractStatus = 'pending_signature' | 'active' | 'suspended' | 'cancelled' | 'expired';
export type SignatureStatus = 'pending' | 'signed' | 'countersigned';

export interface ContractSignature {
  signer_name: string;
  signer_email: string;
  signer_role: string;
  signed_at: string;
  signature_ip: string;
  signature_hash: string;
  signature_method: 'digital' | 'electronic';
}

export interface Contract {
  id: string;
  contract_number: string; // CONT-2026-0001
  proposal_id: string;
  client_id: string;
  
  // Detalhes do plano
  plan_id: string;
  plan_name: string;
  addons: string[];
  
  // Valores contratuais
  monthly_value: number;
  annual_value: number;
  total_contract_value: number;
  setup_fee: number;
  
  // Vigência
  start_date: string;
  end_date: string;
  term_months: number;
  auto_renewal: boolean;
  renewal_notice_days: number; // dias antes do vencimento para aviso
  
  // Assinaturas
  signature_status: SignatureStatus;
  client_signature?: ContractSignature;
  company_signature?: ContractSignature;
  
  // Gateway externo (Asaas)
  asaas_subscription_id?: string;
  asaas_customer_id?: string;
  
  // Documentos
  contract_pdf_url?: string;
  signed_contract_pdf_url?: string;
  
  // Status
  status: ContractStatus;
  suspension_reason?: string;
  cancellation_reason?: string;
  cancelled_at?: string;
  
  // Auditoria
  created_at: string;
  created_by: string;
  updated_at: string;
}

// ==================== FATURA ====================

export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
export type PaymentMethod = 'boleto' | 'pix' | 'transfer' | 'credit_card';

export interface Invoice {
  id: string;
  invoice_number: string; // NF-2026-0001
  contract_id: string;
  client_id: string;
  
  // Referência
  reference_period: string; // 2026-01
  description: string;
  
  // Valores
  subtotal: number;
  discounts: number;
  taxes: number;
  total: number;
  
  // Vencimento e pagamento
  due_date: string;
  paid_at?: string;
  payment_method?: PaymentMethod;
  
  // Status
  status: InvoiceStatus;
  
  // NF-e
  nfe_number?: string;
  nfe_key?: string;
  nfe_pdf_url?: string;
  nfe_xml_url?: string;
  
  // Gateway Asaas
  asaas_payment_id?: string;
  boleto_url?: string;
  boleto_barcode?: string;
  boleto_due_date?: string;
  pix_qrcode?: string;
  pix_qrcode_image?: string;
  pix_expiration_date?: string;
  
  // Lembretes
  reminders_sent: number;
  last_reminder_at?: string;
  
  // Metadados
  created_at: string;
  updated_at: string;
}

// ==================== CLIENTE BILLING ====================

export interface BillingAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface FinanceContact {
  name: string;
  email: string;
  phone: string;
  role?: string;
}

export type ClientStatus = 'prospect' | 'trial' | 'pending_contract' | 'active' | 'suspended' | 'churned';

export interface ClientBilling {
  id: string;
  
  // Dados da empresa
  company_name: string;
  trading_name?: string;
  cnpj: string;
  state_registration?: string;
  municipal_registration?: string;
  
  // Endereço de faturamento
  billing_address: BillingAddress;
  
  // Contatos
  primary_contact: FinanceContact;
  finance_contact?: FinanceContact;
  technical_contact?: FinanceContact;
  
  // Gateway externo
  asaas_customer_id?: string;
  
  // Plano atual
  current_plan_id?: string;
  current_contract_id?: string;
  
  // Status
  status: ClientStatus;
  
  // Trial
  trial_start_date?: string;
  trial_end_date?: string;
  
  // Métricas
  total_paid: number;
  last_payment_date?: string;
  payment_score?: number; // 0-100 baseado em histórico
  
  // Metadados
  created_at: string;
  updated_at: string;
}

// ==================== ASAAS TYPES ====================

export interface AsaasCustomer {
  id?: string;
  name: string;
  cpfCnpj: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  externalReference?: string;
  notificationDisabled?: boolean;
  additionalEmails?: string;
  municipalInscription?: string;
  stateInscription?: string;
  observations?: string;
}

export interface AsaasPayment {
  id?: string;
  customer: string;
  billingType: 'BOLETO' | 'PIX' | 'CREDIT_CARD' | 'UNDEFINED';
  value: number;
  dueDate: string;
  description?: string;
  externalReference?: string;
  installmentCount?: number;
  installmentValue?: number;
  discount?: {
    value: number;
    dueDateLimitDays: number;
    type: 'FIXED' | 'PERCENTAGE';
  };
  interest?: {
    value: number;
    type: 'PERCENTAGE';
  };
  fine?: {
    value: number;
    type: 'FIXED' | 'PERCENTAGE';
  };
  postalService?: boolean;
}

export interface AsaasSubscription {
  id?: string;
  customer: string;
  billingType: 'BOLETO' | 'PIX' | 'CREDIT_CARD' | 'UNDEFINED';
  value: number;
  nextDueDate: string;
  cycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY';
  description?: string;
  externalReference?: string;
  endDate?: string;
  maxPayments?: number;
  discount?: {
    value: number;
    dueDateLimitDays: number;
    type: 'FIXED' | 'PERCENTAGE';
  };
}

export interface AsaasWebhookPayload {
  event: string;
  payment?: {
    id: string;
    customer: string;
    value: number;
    netValue: number;
    status: string;
    billingType: string;
    confirmedDate?: string;
    paymentDate?: string;
    invoiceUrl?: string;
    bankSlipUrl?: string;
    pixQrCodeId?: string;
  };
  subscription?: {
    id: string;
    customer: string;
    status: string;
  };
}

// ==================== CHECKOUT FLOW ====================

export interface CheckoutSession {
  id: string;
  
  // Dados do cliente
  client: {
    company_name: string;
    cnpj: string;
    email: string;
    phone: string;
    contact_name: string;
    contact_role: string;
  };
  
  // Plano selecionado
  plan_id: string;
  plan_name: string;
  porte: string;
  
  // Add-ons
  selected_addons: string[];
  
  // Valores
  monthly_value: number;
  annual_value: number;
  setup_fee: number;
  
  // Contrato
  contract_term: 12 | 24 | 36;
  payment_cycle: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  
  // Total
  total_contract_value: number;
  first_payment_value: number;
  
  // Status
  step: 'info' | 'review' | 'contract' | 'payment' | 'completed';
  
  // Metadados
  created_at: string;
  expires_at: string;
  completed_at?: string;
}

// ==================== HELPERS ====================

export const CONTRACT_TERM_OPTIONS = [
  { value: 12, label: '12 meses', discount: 0 },
  { value: 24, label: '24 meses', discount: 10 },
  { value: 36, label: '36 meses', discount: 15 },
] as const;

export const PAYMENT_CYCLE_OPTIONS = [
  { value: 'monthly', label: 'Mensal', asaasCycle: 'MONTHLY', discount: 0 },
  { value: 'quarterly', label: 'Trimestral', asaasCycle: 'QUARTERLY', discount: 5 },
  { value: 'semi_annual', label: 'Semestral', asaasCycle: 'SEMIANNUALLY', discount: 8 },
  { value: 'annual', label: 'Anual', asaasCycle: 'YEARLY', discount: 16.67 },
] as const;

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  overdue: 'Vencido',
  cancelled: 'Cancelado',
  refunded: 'Estornado',
};

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  pending_signature: 'Aguardando Assinatura',
  active: 'Ativo',
  suspended: 'Suspenso',
  cancelled: 'Cancelado',
  expired: 'Expirado',
};

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  prospect: 'Prospect',
  trial: 'Trial',
  pending_contract: 'Aguardando Contrato',
  active: 'Ativo',
  suspended: 'Suspenso',
  churned: 'Churned',
};
