/**
 * Asaas Service - Integração com Gateway de Pagamentos
 * 
 * Documentação: https://docs.asaas.com/
 * 
 * IMPORTANTE: Em produção, todas as chamadas devem ser feitas via backend
 * para proteger a API Key. Este serviço simula as operações para demo.
 */

import {
  AsaasCustomer,
  AsaasPayment,
  AsaasSubscription,
  ClientBilling,
  Contract,
  Invoice,
  InvoiceStatus,
} from '@/types/billing';

// ==================== CONFIGURAÇÃO ====================

const ASAAS_CONFIG = {
  // Em produção: usar variáveis de ambiente no backend
  apiUrl: 'https://sandbox.asaas.com/api/v3', // sandbox para desenvolvimento
  // apiUrl: 'https://www.asaas.com/api/v3', // produção
  
  // API Key deve estar apenas no backend
  // Esta é apenas para referência/documentação
  apiKeyEnvVar: 'ASAAS_API_KEY',
};

// ==================== STORAGE LOCAL (DEMO) ====================

const STORAGE_KEYS = {
  customers: 'asaas_customers',
  payments: 'asaas_payments',
  subscriptions: 'asaas_subscriptions',
  invoices: 'billing_invoices',
  contracts: 'billing_contracts',
};

// Helper para gerar IDs únicos
const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper para formatar data para Asaas (YYYY-MM-DD)
const formatDateForAsaas = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// ==================== CUSTOMER SERVICE ====================

export const customerService = {
  /**
   * Criar cliente no Asaas
   */
  async create(client: ClientBilling): Promise<AsaasCustomer> {
    const customer: AsaasCustomer = {
      id: generateId('cus'),
      name: client.company_name,
      cpfCnpj: client.cnpj.replace(/\D/g, ''),
      email: client.primary_contact.email,
      phone: client.primary_contact.phone?.replace(/\D/g, ''),
      address: client.billing_address.street,
      addressNumber: client.billing_address.number,
      complement: client.billing_address.complement,
      province: client.billing_address.neighborhood,
      city: client.billing_address.city,
      state: client.billing_address.state,
      postalCode: client.billing_address.zip.replace(/\D/g, ''),
      externalReference: client.id,
      municipalInscription: client.municipal_registration,
      stateInscription: client.state_registration,
    };

    // Salvar localmente (em produção: chamada à API Asaas)
    const customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.customers) || '[]');
    customers.push(customer);
    localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers));

    console.log('✅ Cliente criado no Asaas:', customer.id);
    return customer;
  },

  /**
   * Buscar cliente por ID
   */
  async getById(customerId: string): Promise<AsaasCustomer | null> {
    const customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.customers) || '[]');
    return customers.find((c: AsaasCustomer) => c.id === customerId) || null;
  },

  /**
   * Buscar cliente por CNPJ
   */
  async getByCpfCnpj(cpfCnpj: string): Promise<AsaasCustomer | null> {
    const cleanCpfCnpj = cpfCnpj.replace(/\D/g, '');
    const customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.customers) || '[]');
    return customers.find((c: AsaasCustomer) => c.cpfCnpj === cleanCpfCnpj) || null;
  },

  /**
   * Atualizar cliente
   */
  async update(customerId: string, data: Partial<AsaasCustomer>): Promise<AsaasCustomer | null> {
    const customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.customers) || '[]');
    const index = customers.findIndex((c: AsaasCustomer) => c.id === customerId);
    
    if (index === -1) return null;
    
    customers[index] = { ...customers[index], ...data };
    localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers));
    
    return customers[index];
  },
};

// ==================== PAYMENT SERVICE ====================

export const paymentService = {
  /**
   * Criar cobrança avulsa (boleto ou PIX)
   */
  async create(payment: AsaasPayment): Promise<AsaasPayment & { bankSlipUrl?: string; pixQrCode?: string }> {
    const newPayment = {
      ...payment,
      id: generateId('pay'),
      status: 'PENDING',
      dateCreated: new Date().toISOString(),
      // Simular dados de boleto/PIX
      bankSlipUrl: payment.billingType === 'BOLETO' 
        ? `https://sandbox.asaas.com/b/pdf/${generateId('boleto')}`
        : undefined,
      invoiceUrl: `https://sandbox.asaas.com/i/${generateId('inv')}`,
      pixQrCode: payment.billingType === 'PIX'
        ? `00020126580014br.gov.bcb.pix0136${generateId('pix')}5204000053039865802BR`
        : undefined,
      pixQrCodeImage: payment.billingType === 'PIX'
        ? `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`
        : undefined,
    };

    const payments = JSON.parse(localStorage.getItem(STORAGE_KEYS.payments) || '[]');
    payments.push(newPayment);
    localStorage.setItem(STORAGE_KEYS.payments, JSON.stringify(payments));

    console.log('✅ Cobrança criada:', newPayment.id, newPayment.billingType);
    return newPayment;
  },

  /**
   * Buscar cobrança por ID
   */
  async getById(paymentId: string): Promise<AsaasPayment | null> {
    const payments = JSON.parse(localStorage.getItem(STORAGE_KEYS.payments) || '[]');
    return payments.find((p: AsaasPayment) => p.id === paymentId) || null;
  },

  /**
   * Listar cobranças de um cliente
   */
  async listByCustomer(customerId: string): Promise<AsaasPayment[]> {
    const payments = JSON.parse(localStorage.getItem(STORAGE_KEYS.payments) || '[]');
    return payments.filter((p: AsaasPayment) => p.customer === customerId);
  },

  /**
   * Simular pagamento (apenas para demo/teste)
   */
  async simulatePayment(paymentId: string): Promise<AsaasPayment | null> {
    const payments = JSON.parse(localStorage.getItem(STORAGE_KEYS.payments) || '[]');
    const index = payments.findIndex((p: AsaasPayment) => p.id === paymentId);
    
    if (index === -1) return null;
    
    payments[index] = {
      ...payments[index],
      status: 'RECEIVED',
      paymentDate: new Date().toISOString(),
      confirmedDate: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.payments, JSON.stringify(payments));
    console.log('✅ Pagamento confirmado (simulado):', paymentId);
    
    return payments[index];
  },
};

// ==================== SUBSCRIPTION SERVICE ====================

export const subscriptionService = {
  /**
   * Criar assinatura recorrente
   */
  async create(subscription: AsaasSubscription): Promise<AsaasSubscription> {
    const newSubscription = {
      ...subscription,
      id: generateId('sub'),
      status: 'ACTIVE',
      dateCreated: new Date().toISOString(),
    };

    const subscriptions = JSON.parse(localStorage.getItem(STORAGE_KEYS.subscriptions) || '[]');
    subscriptions.push(newSubscription);
    localStorage.setItem(STORAGE_KEYS.subscriptions, JSON.stringify(subscriptions));

    console.log('✅ Assinatura criada:', newSubscription.id);
    return newSubscription;
  },

  /**
   * Buscar assinatura por ID
   */
  async getById(subscriptionId: string): Promise<AsaasSubscription | null> {
    const subscriptions = JSON.parse(localStorage.getItem(STORAGE_KEYS.subscriptions) || '[]');
    return subscriptions.find((s: AsaasSubscription) => s.id === subscriptionId) || null;
  },

  /**
   * Cancelar assinatura
   */
  async cancel(subscriptionId: string): Promise<boolean> {
    const subscriptions = JSON.parse(localStorage.getItem(STORAGE_KEYS.subscriptions) || '[]');
    const index = subscriptions.findIndex((s: AsaasSubscription) => s.id === subscriptionId);
    
    if (index === -1) return false;
    
    subscriptions[index] = {
      ...subscriptions[index],
      status: 'INACTIVE',
      deletedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.subscriptions, JSON.stringify(subscriptions));
    console.log('✅ Assinatura cancelada:', subscriptionId);
    
    return true;
  },

  /**
   * Atualizar valor da assinatura
   */
  async updateValue(subscriptionId: string, newValue: number): Promise<AsaasSubscription | null> {
    const subscriptions = JSON.parse(localStorage.getItem(STORAGE_KEYS.subscriptions) || '[]');
    const index = subscriptions.findIndex((s: AsaasSubscription) => s.id === subscriptionId);
    
    if (index === -1) return null;
    
    subscriptions[index] = {
      ...subscriptions[index],
      value: newValue,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.subscriptions, JSON.stringify(subscriptions));
    return subscriptions[index];
  },
};

// ==================== INVOICE SERVICE ====================

export const invoiceService = {
  /**
   * Criar fatura interna (vinculada ao pagamento Asaas)
   */
  async create(data: Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'updated_at'>): Promise<Invoice> {
    const invoices = JSON.parse(localStorage.getItem(STORAGE_KEYS.invoices) || '[]');
    
    // Gerar número da fatura
    const year = new Date().getFullYear();
    const count = invoices.filter((i: Invoice) => i.invoice_number.includes(`NF-${year}`)).length + 1;
    const invoiceNumber = `NF-${year}-${String(count).padStart(4, '0')}`;
    
    const invoice: Invoice = {
      ...data,
      id: generateId('inv'),
      invoice_number: invoiceNumber,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    invoices.push(invoice);
    localStorage.setItem(STORAGE_KEYS.invoices, JSON.stringify(invoices));

    console.log('✅ Fatura criada:', invoice.invoice_number);
    return invoice;
  },

  /**
   * Buscar fatura por ID
   */
  async getById(invoiceId: string): Promise<Invoice | null> {
    const invoices = JSON.parse(localStorage.getItem(STORAGE_KEYS.invoices) || '[]');
    return invoices.find((i: Invoice) => i.id === invoiceId) || null;
  },

  /**
   * Listar faturas de um contrato
   */
  async listByContract(contractId: string): Promise<Invoice[]> {
    const invoices = JSON.parse(localStorage.getItem(STORAGE_KEYS.invoices) || '[]');
    return invoices.filter((i: Invoice) => i.contract_id === contractId);
  },

  /**
   * Listar faturas de um cliente
   */
  async listByClient(clientId: string): Promise<Invoice[]> {
    const invoices = JSON.parse(localStorage.getItem(STORAGE_KEYS.invoices) || '[]');
    return invoices.filter((i: Invoice) => i.client_id === clientId);
  },

  /**
   * Atualizar status da fatura
   */
  async updateStatus(invoiceId: string, status: InvoiceStatus, paymentData?: Partial<Invoice>): Promise<Invoice | null> {
    const invoices = JSON.parse(localStorage.getItem(STORAGE_KEYS.invoices) || '[]');
    const index = invoices.findIndex((i: Invoice) => i.id === invoiceId);
    
    if (index === -1) return null;
    
    invoices[index] = {
      ...invoices[index],
      ...paymentData,
      status,
      updated_at: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.invoices, JSON.stringify(invoices));
    return invoices[index];
  },

  /**
   * Listar faturas vencidas
   */
  async listOverdue(): Promise<Invoice[]> {
    const invoices = JSON.parse(localStorage.getItem(STORAGE_KEYS.invoices) || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    return invoices.filter((i: Invoice) => 
      i.status === 'pending' && i.due_date < today
    );
  },
};

// ==================== CONTRACT SERVICE ====================

export const contractService = {
  /**
   * Criar contrato
   */
  async create(data: Omit<Contract, 'id' | 'contract_number' | 'created_at' | 'updated_at'>): Promise<Contract> {
    const contracts = JSON.parse(localStorage.getItem(STORAGE_KEYS.contracts) || '[]');
    
    // Gerar número do contrato
    const year = new Date().getFullYear();
    const count = contracts.filter((c: Contract) => c.contract_number.includes(`CONT-${year}`)).length + 1;
    const contractNumber = `CONT-${year}-${String(count).padStart(4, '0')}`;
    
    const contract: Contract = {
      ...data,
      id: generateId('cont'),
      contract_number: contractNumber,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    contracts.push(contract);
    localStorage.setItem(STORAGE_KEYS.contracts, JSON.stringify(contracts));

    console.log('✅ Contrato criado:', contract.contract_number);
    return contract;
  },

  /**
   * Buscar contrato por ID
   */
  async getById(contractId: string): Promise<Contract | null> {
    const contracts = JSON.parse(localStorage.getItem(STORAGE_KEYS.contracts) || '[]');
    return contracts.find((c: Contract) => c.id === contractId) || null;
  },

  /**
   * Listar contratos de um cliente
   */
  async listByClient(clientId: string): Promise<Contract[]> {
    const contracts = JSON.parse(localStorage.getItem(STORAGE_KEYS.contracts) || '[]');
    return contracts.filter((c: Contract) => c.client_id === clientId);
  },

  /**
   * Assinar contrato (cliente)
   */
  async signByClient(contractId: string, signature: Contract['client_signature']): Promise<Contract | null> {
    const contracts = JSON.parse(localStorage.getItem(STORAGE_KEYS.contracts) || '[]');
    const index = contracts.findIndex((c: Contract) => c.id === contractId);
    
    if (index === -1) return null;
    
    contracts[index] = {
      ...contracts[index],
      client_signature: signature,
      signature_status: 'signed',
      updated_at: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.contracts, JSON.stringify(contracts));
    console.log('✅ Contrato assinado pelo cliente:', contractId);
    
    return contracts[index];
  },

  /**
   * Contra-assinar contrato (empresa)
   */
  async countersign(contractId: string, signature: Contract['company_signature']): Promise<Contract | null> {
    const contracts = JSON.parse(localStorage.getItem(STORAGE_KEYS.contracts) || '[]');
    const index = contracts.findIndex((c: Contract) => c.id === contractId);
    
    if (index === -1) return null;
    
    contracts[index] = {
      ...contracts[index],
      company_signature: signature,
      signature_status: 'countersigned',
      status: 'active',
      updated_at: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.contracts, JSON.stringify(contracts));
    console.log('✅ Contrato contra-assinado:', contractId);
    
    return contracts[index];
  },

  /**
   * Cancelar contrato
   */
  async cancel(contractId: string, reason: string): Promise<Contract | null> {
    const contracts = JSON.parse(localStorage.getItem(STORAGE_KEYS.contracts) || '[]');
    const index = contracts.findIndex((c: Contract) => c.id === contractId);
    
    if (index === -1) return null;
    
    contracts[index] = {
      ...contracts[index],
      status: 'cancelled',
      cancellation_reason: reason,
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.contracts, JSON.stringify(contracts));
    
    // Cancelar assinatura no Asaas se existir
    if (contracts[index].asaas_subscription_id) {
      await subscriptionService.cancel(contracts[index].asaas_subscription_id);
    }
    
    console.log('✅ Contrato cancelado:', contractId);
    return contracts[index];
  },

  /**
   * Listar todos os contratos
   */
  async listAll(): Promise<Contract[]> {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.contracts) || '[]');
  },
};

// ==================== CHECKOUT FLOW ====================

export const checkoutService = {
  /**
   * Processar checkout completo
   */
  async processCheckout(data: {
    client: ClientBilling;
    planId: string;
    planName: string;
    addons: string[];
    monthlyValue: number;
    annualValue: number;
    setupFee: number;
    contractTerm: 12 | 24 | 36;
    paymentCycle: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
    billingType: 'BOLETO' | 'PIX';
  }): Promise<{
    customer: AsaasCustomer;
    contract: Contract;
    subscription: AsaasSubscription;
    firstPayment: AsaasPayment;
    invoice: Invoice;
  }> {
    console.log('🚀 Iniciando checkout...');

    // 1. Criar ou buscar cliente no Asaas
    let customer = await customerService.getByCpfCnpj(data.client.cnpj);
    if (!customer) {
      customer = await customerService.create(data.client);
    }

    // 2. Calcular valores
    const cycleMap = {
      monthly: { asaas: 'MONTHLY' as const, months: 1 },
      quarterly: { asaas: 'QUARTERLY' as const, months: 3 },
      semi_annual: { asaas: 'SEMIANNUALLY' as const, months: 6 },
      annual: { asaas: 'YEARLY' as const, months: 12 },
    };
    
    const cycle = cycleMap[data.paymentCycle];
    const paymentValue = data.monthlyValue * cycle.months;
    const totalContractValue = data.monthlyValue * data.contractTerm;

    // 3. Criar contrato
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + data.contractTerm);

    const contract = await contractService.create({
      proposal_id: '',
      client_id: data.client.id,
      plan_id: data.planId,
      plan_name: data.planName,
      addons: data.addons,
      monthly_value: data.monthlyValue,
      annual_value: data.annualValue,
      total_contract_value: totalContractValue,
      setup_fee: data.setupFee,
      start_date: formatDateForAsaas(startDate),
      end_date: formatDateForAsaas(endDate),
      term_months: data.contractTerm,
      auto_renewal: true,
      renewal_notice_days: 30,
      signature_status: 'pending',
      asaas_customer_id: customer.id,
      status: 'pending_signature',
      created_by: 'system',
    });

    // 4. Criar assinatura recorrente no Asaas
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + 5); // 5 dias para primeiro pagamento

    const subscription = await subscriptionService.create({
      customer: customer.id!,
      billingType: data.billingType,
      value: paymentValue,
      nextDueDate: formatDateForAsaas(nextDueDate),
      cycle: cycle.asaas,
      description: `Legacy OS - ${data.planName} - Contrato ${contract.contract_number}`,
      externalReference: contract.id,
      endDate: formatDateForAsaas(endDate),
    });

    // Atualizar contrato com ID da assinatura
    const contracts = JSON.parse(localStorage.getItem(STORAGE_KEYS.contracts) || '[]');
    const contractIndex = contracts.findIndex((c: Contract) => c.id === contract.id);
    if (contractIndex !== -1) {
      contracts[contractIndex].asaas_subscription_id = subscription.id;
      localStorage.setItem(STORAGE_KEYS.contracts, JSON.stringify(contracts));
    }

    // 5. Criar primeira cobrança (setup + primeira mensalidade)
    const firstPaymentValue = data.setupFee + paymentValue;
    
    const firstPayment = await paymentService.create({
      customer: customer.id!,
      billingType: data.billingType,
      value: firstPaymentValue,
      dueDate: formatDateForAsaas(nextDueDate),
      description: `Legacy OS - Setup + Primeira Mensalidade - ${contract.contract_number}`,
      externalReference: contract.id,
    });

    // 6. Criar fatura interna
    const invoice = await invoiceService.create({
      contract_id: contract.id,
      client_id: data.client.id,
      reference_period: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`,
      description: `Setup + Primeira Mensalidade - ${data.planName}`,
      subtotal: firstPaymentValue,
      discounts: 0,
      taxes: 0,
      total: firstPaymentValue,
      due_date: formatDateForAsaas(nextDueDate),
      status: 'pending',
      asaas_payment_id: firstPayment.id,
      boleto_url: (firstPayment as any).bankSlipUrl,
      pix_qrcode: (firstPayment as any).pixQrCode,
      pix_qrcode_image: (firstPayment as any).pixQrCodeImage,
      reminders_sent: 0,
    });

    console.log('✅ Checkout concluído!');
    console.log('   - Cliente:', customer.id);
    console.log('   - Contrato:', contract.contract_number);
    console.log('   - Assinatura:', subscription.id);
    console.log('   - Cobrança:', firstPayment.id);
    console.log('   - Fatura:', invoice.invoice_number);

    return {
      customer,
      contract,
      subscription,
      firstPayment,
      invoice,
    };
  },
};

// ==================== EXPORTS ====================

export const asaasService = {
  customer: customerService,
  payment: paymentService,
  subscription: subscriptionService,
  invoice: invoiceService,
  contract: contractService,
  checkout: checkoutService,
};

export default asaasService;
