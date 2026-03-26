/**
 * Script para criar parceiros de demonstração
 * Execute: node scripts/create-demo-partners.js
 * 
 * Requisitos:
 * - VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY configurados no .env
 * - Ou passe como variáveis de ambiente
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY devem estar configurados');
  process.exit(1);
}

// Dados dos parceiros de demonstração
const partners = [
  {
    email: 'parceiro1.demo@legacyos.com.br',
    name: 'João Silva',
    companyName: 'Parceiro Consultoria Premium',
    phone: '(11) 99999-9999',
    cnpj: '12.345.678/0001-90',
    type: 'consultoria',
    commissionService: 15.00,
    commissionRecurring: 15.00,
    recurringCommissionMonths: 12,
    password: '123456'
  },
  {
    email: 'parceiro2.demo@legacyos.com.br',
    name: 'Maria Santos',
    companyName: 'Parceiro Consultoria Standard',
    phone: '(11) 88888-8888',
    cnpj: '98.765.432/0001-10',
    type: 'consultoria',
    commissionService: 15.00,
    commissionRecurring: 5.00,
    recurringCommissionMonths: 12,
    password: '123456'
  },
  {
    email: 'parceiro@legacy.com',
    name: 'Parceiro Demo',
    companyName: 'Parceiro Demo Legacy',
    phone: '(11) 77777-7777',
    cnpj: '11.222.333/0001-44',
    type: 'afiliado',
    commissionService: 15.00,
    commissionRecurring: 10.00,
    recurringCommissionMonths: 12,
    password: '123456'
  }
];

async function createPartners() {
  console.log('🚀 Iniciando criação de parceiros de demonstração...\n');

  for (const partner of partners) {
    try {
      console.log(`📝 Criando parceiro: ${partner.companyName} (${partner.email})`);
      
      // Chamar Edge Function create-partner
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-partner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          email: partner.email,
          name: partner.name,
          companyName: partner.companyName,
          phone: partner.phone,
          cnpj: partner.cnpj,
          type: partner.type,
          commissionService: partner.commissionService,
          commissionRecurring: partner.commissionRecurring,
          recurringCommissionMonths: partner.recurringCommissionMonths,
          password: partner.password || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar parceiro');
      }

      if (data.success) {
        console.log(`✅ Parceiro criado com sucesso!`);
        console.log(`   User ID: ${data.userId}`);
        console.log(`   Token: ${data.affiliateToken}`);
        console.log(`   Link: ${SUPABASE_URL.replace('/rest/v1', '')}/plan-discovery?ref=${data.affiliateToken}\n`);
      } else {
        throw new Error(data.error || 'Falha ao criar parceiro');
      }
    } catch (error) {
      console.error(`❌ Erro ao criar parceiro ${partner.email}:`, error.message);
      console.log('   Verifique se a Edge Function create-partner está deployada\n');
    }
  }

  console.log('✨ Processo concluído!');
}

// Executar script
createPartners().catch(console.error);
