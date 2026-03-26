/**
 * Script para criar parceiros de demonstração via Edge Function
 * Execute: node create-partners-demo.js
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Erro: Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

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
    recurringCommissionMonths: 12
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
    recurringCommissionMonths: 12
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
    password: '123456' // Senha específica para demo
  }
];

async function createPartner(partner) {
  try {
    console.log(`\n📝 Criando: ${partner.companyName} (${partner.email})`);
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-partner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        ...partner,
        // Incluir senha apenas se especificada
        ...(partner.password && { password: partner.password })
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    if (data.success) {
      console.log(`✅ Criado! User ID: ${data.userId}`);
      console.log(`   Token: ${data.affiliateToken}`);
      const baseUrl = SUPABASE_URL.replace('/rest/v1', '').replace('/functions/v1', '');
      console.log(`   Link: ${baseUrl}/plan-discovery?ref=${data.affiliateToken}`);
      return true;
    } else {
      throw new Error(data.error || 'Falha desconhecida');
    }
  } catch (error) {
    console.error(`❌ Erro: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Criando parceiros de demonstração...\n');
  
  let successCount = 0;
  for (const partner of partners) {
    const success = await createPartner(partner);
    if (success) successCount++;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Delay entre requisições
  }

  console.log(`\n✨ Concluído! ${successCount}/${partners.length} parceiros criados.`);
  console.log('\n📋 Credenciais para login:');
  console.log('   Parceiro Demo: parceiro@legacy.com | 123456');
  console.log('   (A senha será definida pela Edge Function)');
}

main().catch(console.error);
