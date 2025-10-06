import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('🚀 Iniciando setup dos usuários demo...');

    // Definir os usuários demo
    const demoUsers = [
      {
        email: 'admin@gov.com',
        password: 'admin123',
        role: 'admin',
        metadata: { name: 'Admin Master' }
      },
      {
        email: 'parceiro@consultor.com',
        password: 'parceiro123',
        role: 'parceiro',
        metadata: { name: 'Parceiro Consultor', company: 'Consultoria' }
      },
      {
        email: 'cliente@empresa.com',
        password: '123456',
        role: 'cliente',
        metadata: { name: 'Cliente Demo', company: 'Empresa Demo' }
      }
    ];

    const results = [];

    for (const user of demoUsers) {
      console.log(`📧 Processando usuário: ${user.email}`);

      // Tentar encontrar e deletar usuário existente
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users.find(u => u.email === user.email);
      
      if (existingUser) {
        console.log(`🗑️ Deletando usuário existente: ${user.email}`);
        await supabase.auth.admin.deleteUser(existingUser.id);
      }

      // Criar novo usuário
      console.log(`➕ Criando novo usuário: ${user.email}`);
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: user.metadata
      });

      if (createError) {
        console.error(`❌ Erro ao criar ${user.email}:`, createError);
        throw createError;
      }

      console.log(`✅ Usuário criado: ${user.email} (ID: ${newUser.user.id})`);

      // Deletar role antiga (se existir)
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', newUser.user.id);

      // Inserir role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: newUser.user.id,
          role: user.role
        });

      if (roleError) {
        console.error(`❌ Erro ao inserir role para ${user.email}:`, roleError);
        throw roleError;
      }

      console.log(`🔑 Role ${user.role} atribuída para ${user.email}`);

      // Criar/atualizar registro na tabela users (se existir)
      const { error: userRecordError } = await supabase
        .from('users')
        .upsert({
          id: newUser.user.id,
          email: user.email,
          name: user.metadata.name,
          company: user.metadata.company || null
        }, {
          onConflict: 'id'
        });

      if (userRecordError) {
        console.log(`⚠️ Aviso ao criar registro em users para ${user.email}:`, userRecordError);
      }

      results.push({
        email: user.email,
        id: newUser.user.id,
        role: user.role,
        success: true
      });
    }

    console.log('✨ Setup de usuários demo concluído com sucesso!');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Usuários demo configurados com sucesso',
        users: results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('💥 Erro no setup:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
