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

    console.log('🚀 Iniciando população de dados demo...');

    // 1. Inserir usuário
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: 'a0000000-0000-0000-0000-000000000001',
        email: 'cliente@empresa.com',
        name: 'Cliente Demo',
        company: 'Empresa Demo',
        sector: 'Tecnologia'
      }, { onConflict: 'id' });

    if (userError) throw userError;
    console.log('✅ Usuário inserido');

    // 2. Inserir 8 conselhos
    const councils = [
      { id: 'c0000000-0000-0000-0000-000000000001', company_id: 'Empresa Demo', name: 'Conselho de Administração', type: 'administrativo', organ_type: 'conselho', description: 'Órgão máximo de deliberação estratégica', quorum: 3, hierarchy_level: 1, status: 'active' },
      { id: 'c0000000-0000-0000-0000-000000000002', company_id: 'Empresa Demo', name: 'Conselho Fiscal', type: 'fiscal', organ_type: 'conselho', description: 'Fiscalização contábil e financeira', quorum: 3, hierarchy_level: 1, status: 'active' },
      { id: 'c0000000-0000-0000-0000-000000000003', company_id: 'Empresa Demo', name: 'Conselho Consultivo', type: 'consultivo', organ_type: 'conselho', description: 'Assessoria especializada externa', quorum: 3, hierarchy_level: 1, status: 'active' },
      { id: 'c0000000-0000-0000-0000-000000000004', company_id: 'Empresa Demo', name: 'Comitê de Auditoria', type: 'especializado', organ_type: 'comite', description: 'Controles internos e gestão de riscos', quorum: 2, hierarchy_level: 2, status: 'active' },
      { id: 'c0000000-0000-0000-0000-000000000005', company_id: 'Empresa Demo', name: 'Comitê de Pessoas e Sucessão', type: 'especializado', organ_type: 'comite', description: 'RH, remuneração e desenvolvimento', quorum: 2, hierarchy_level: 2, status: 'active' },
      { id: 'c0000000-0000-0000-0000-000000000006', company_id: 'Empresa Demo', name: 'Comitê de Sustentabilidade', type: 'especializado', organ_type: 'comite', description: 'ESG, impacto social e ambiental', quorum: 2, hierarchy_level: 2, status: 'active' },
      { id: 'c0000000-0000-0000-0000-000000000007', company_id: 'Empresa Demo', name: 'Comissão de Ética e Compliance', type: 'temporario', organ_type: 'comissao', description: 'Código de conduta e integridade', quorum: 2, hierarchy_level: 3, status: 'active' },
      { id: 'c0000000-0000-0000-0000-000000000008', company_id: 'Empresa Demo', name: 'Comissão Especial de M&A', type: 'temporario', organ_type: 'comissao', description: 'Fusões, aquisições e parcerias', quorum: 2, hierarchy_level: 3, status: 'active' }
    ];

    const { error: councilsError } = await supabase
      .from('councils')
      .upsert(councils, { onConflict: 'id' });

    if (councilsError) throw councilsError;
    console.log('✅ 8 conselhos inseridos');

    // 3. Inserir 12 reuniões
    const meetings = [
      { id: '10000000-0000-0000-0000-000000000001', council_id: 'c0000000-0000-0000-0000-000000000001', company_id: 'Empresa Demo', title: 'Aprovação do orçamento 2025', date: '2025-01-15', time: '14:00', type: 'Ordinária', status: 'REALIZADA', modalidade: 'Presencial', location: 'Sala de Reuniões - Matriz', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '10000000-0000-0000-0000-000000000002', council_id: 'c0000000-0000-0000-0000-000000000004', company_id: 'Empresa Demo', title: 'Análise de controles internos Q1', date: '2025-02-10', time: '10:00', type: 'Ordinária', status: 'REALIZADA', modalidade: 'Híbrida', location: 'Sala de Auditoria', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '10000000-0000-0000-0000-000000000003', council_id: 'c0000000-0000-0000-0000-000000000002', company_id: 'Empresa Demo', title: 'Revisão de desvios orçamentários', date: '2025-02-20', time: '16:00', type: 'Extraordinária', status: 'REALIZADA', modalidade: 'Presencial', location: 'Sala Executiva', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '10000000-0000-0000-0000-000000000004', council_id: 'c0000000-0000-0000-0000-000000000007', company_id: 'Empresa Demo', title: 'Atualização do código de conduta', date: '2025-03-05', time: '09:00', type: 'Ordinária', status: 'REALIZADA', modalidade: 'Virtual', location: 'Microsoft Teams', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '10000000-0000-0000-0000-000000000005', council_id: 'c0000000-0000-0000-0000-000000000005', company_id: 'Empresa Demo', title: 'Plano de sucessão C-Level', date: '2025-03-15', time: '15:00', type: 'Ordinária', status: 'REALIZADA', modalidade: 'Presencial', location: 'Sala VIP', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '10000000-0000-0000-0000-000000000006', council_id: 'c0000000-0000-0000-0000-000000000003', company_id: 'Empresa Demo', title: 'Cenários macroeconômicos 2025', date: '2024-10-20', time: '14:30', type: 'Ordinária', status: 'REALIZADA', modalidade: 'Presencial', location: 'Auditório', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '10000000-0000-0000-0000-000000000007', council_id: 'c0000000-0000-0000-0000-000000000001', company_id: 'Empresa Demo', title: 'Revisão estratégica anual', date: '2025-12-15', time: '14:00', type: 'Ordinária', status: 'AGENDADA', modalidade: 'Presencial', location: 'Sala de Reuniões - Matriz', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '10000000-0000-0000-0000-000000000008', council_id: 'c0000000-0000-0000-0000-000000000006', company_id: 'Empresa Demo', title: 'Relatório ESG 2024', date: '2025-12-10', time: '10:00', type: 'Ordinária', status: 'AGENDADA', modalidade: 'Híbrida', location: 'Sala de Sustentabilidade', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '10000000-0000-0000-0000-000000000009', council_id: 'c0000000-0000-0000-0000-000000000008', company_id: 'Empresa Demo', title: 'Due diligence Target Corp', date: '2026-01-20', time: '11:00', type: 'Extraordinária', status: 'AGENDADA', modalidade: 'Virtual', location: 'Zoom', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '10000000-0000-0000-0000-000000000010', council_id: 'c0000000-0000-0000-0000-000000000002', company_id: 'Empresa Demo', title: 'Balanço patrimonial Q4 2025', date: '2026-01-25', time: '16:00', type: 'Ordinária', status: 'AGENDADA', modalidade: 'Presencial', location: 'Sala Executiva', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '10000000-0000-0000-0000-000000000011', council_id: 'c0000000-0000-0000-0000-000000000004', company_id: 'Empresa Demo', title: 'Plano de auditoria 2026', date: '2026-02-05', time: '10:30', type: 'Ordinária', status: 'AGENDADA', modalidade: 'Presencial', location: 'Sala de Auditoria', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '10000000-0000-0000-0000-000000000012', council_id: 'c0000000-0000-0000-0000-000000000005', company_id: 'Empresa Demo', title: 'Avaliação de desempenho executivo', date: '2026-02-15', time: '14:00', type: 'Ordinária', status: 'AGENDADA', modalidade: 'Presencial', location: 'Sala VIP', created_by: 'a0000000-0000-0000-0000-000000000001' }
    ];

    const { error: meetingsError } = await supabase
      .from('meetings')
      .upsert(meetings, { onConflict: 'id' });

    if (meetingsError) throw meetingsError;
    console.log('✅ 12 reuniões inseridas');

    // 4. Inserir 20 tarefas
    const actions = [
      // ATRASADAS (4)
      { id: '20000000-0000-0000-0000-000000000001', meeting_id: '10000000-0000-0000-0000-000000000007', description: 'Enviar convocação da reunião de dezembro com pauta anexa', due_date: '2025-11-20', status: 'ATRASADA', priority: 'ALTA', category: 'Convocação', responsible_external_name: 'João Silva', responsible_external_email: 'joao.silva@empresademo.com', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '20000000-0000-0000-0000-000000000002', meeting_id: '10000000-0000-0000-0000-000000000003', description: 'Analisar desvios orçamentários do Q3 2024', due_date: '2025-11-15', status: 'ATRASADA', priority: 'MEDIA', category: 'Análise Financeira', responsible_external_name: 'Ana Costa', responsible_external_email: 'ana.costa@fiscal.com', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '20000000-0000-0000-0000-000000000003', meeting_id: '10000000-0000-0000-0000-000000000011', description: 'Revisar parecer sobre fraude identificada na filial Sul', due_date: '2025-11-18', status: 'ATRASADA', priority: 'ALTA', category: 'Compliance', responsible_external_name: 'Fernanda Souza', responsible_external_email: 'fernanda.souza@auditoria.com', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '20000000-0000-0000-0000-000000000004', meeting_id: '10000000-0000-0000-0000-000000000004', description: 'Responder denúncia trabalhista protocolo #2024-089', due_date: '2025-11-10', status: 'ATRASADA', priority: 'ALTA', category: 'Jurídico', responsible_external_name: 'Marcelo Pereira', responsible_external_email: 'marcelo.pereira@juridico.com', created_by: 'a0000000-0000-0000-0000-000000000001' },
      
      // PENDENTES (5)
      { id: '20000000-0000-0000-0000-000000000005', meeting_id: '10000000-0000-0000-0000-000000000001', description: 'Preparar proposta de investimento em IA para aprovação', due_date: '2025-12-05', status: 'PENDENTE', priority: 'ALTA', category: 'Estratégia', responsible_external_name: 'Maria Santos', responsible_external_email: 'maria.santos@empresademo.com', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '20000000-0000-0000-0000-000000000006', meeting_id: '10000000-0000-0000-0000-000000000003', description: 'Revisar plano estratégico 2026-2030', due_date: '2025-12-15', status: 'PENDENTE', priority: 'MEDIA', category: 'Planejamento', responsible_external_name: 'Patricia Lima', responsible_external_email: 'patricia.lima@consultoria.com', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '20000000-0000-0000-0000-000000000007', meeting_id: '10000000-0000-0000-0000-000000000012', description: 'Avaliar candidatos finalistas para cargo de CFO', due_date: '2025-11-30', status: 'PENDENTE', priority: 'MEDIA', category: 'Recursos Humanos', responsible_external_name: 'Juliana Martins', responsible_external_email: 'juliana.martins@rh.com', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '20000000-0000-0000-0000-000000000008', meeting_id: '10000000-0000-0000-0000-000000000008', description: 'Atualizar inventário de emissões de GEE (Escopo 1, 2, 3)', due_date: '2025-12-10', status: 'PENDENTE', priority: 'BAIXA', category: 'Sustentabilidade', responsible_external_name: 'Claudia Alves', responsible_external_email: 'claudia.alves@sustentabilidade.com', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '20000000-0000-0000-0000-000000000009', meeting_id: '10000000-0000-0000-0000-000000000009', description: 'Elaborar due diligence completa da Target Corp', due_date: '2025-11-28', status: 'PENDENTE', priority: 'ALTA', category: 'M&A', responsible_external_name: 'Ricardo Barbosa', responsible_external_email: 'ricardo.barbosa@ma.com', created_by: 'a0000000-0000-0000-0000-000000000001' },
      
      // EM ANDAMENTO (3)
      { id: '20000000-0000-0000-0000-000000000010', meeting_id: '10000000-0000-0000-0000-000000000002', description: 'Implementar nova política de controles internos', due_date: '2025-12-20', status: 'EM_ANDAMENTO', priority: 'ALTA', category: 'Auditoria', responsible_external_name: 'Bruno Cardoso', responsible_external_email: 'bruno.cardoso@auditoria.com', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '20000000-0000-0000-0000-000000000011', meeting_id: '10000000-0000-0000-0000-000000000004', description: 'Revisar e atualizar código de conduta corporativo', due_date: '2025-12-18', status: 'EM_ANDAMENTO', priority: 'MEDIA', category: 'Compliance', responsible_external_name: 'Beatriz Santos', responsible_external_email: 'beatriz.santos@compliance.com', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '20000000-0000-0000-0000-000000000012', meeting_id: '10000000-0000-0000-0000-000000000009', description: 'Negociar termos de acordo de confidencialidade', due_date: '2025-11-25', status: 'EM_ANDAMENTO', priority: 'ALTA', category: 'M&A', responsible_external_name: 'Leonardo Costa', responsible_external_email: 'leonardo.costa@ma.com', created_by: 'a0000000-0000-0000-0000-000000000001' },
      
      // CONCLUÍDAS (8)
      { id: '20000000-0000-0000-0000-000000000013', meeting_id: '10000000-0000-0000-0000-000000000001', description: 'Ratificar nomeação do novo CTO', due_date: '2025-11-05', status: 'CONCLUIDA', priority: 'MEDIA', category: 'Governança', responsible_external_name: 'Carlos Mendes', responsible_external_email: 'carlos.mendes@empresademo.com', completed_at: '2025-11-05T14:30:00', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '20000000-0000-0000-0000-000000000014', meeting_id: '10000000-0000-0000-0000-000000000003', description: 'Aprovar balanço patrimonial Q3 2024', due_date: '2025-11-14', status: 'CONCLUIDA', priority: 'ALTA', category: 'Finanças', responsible_external_name: 'Roberto Almeida', responsible_external_email: 'roberto.almeida@fiscal.com', completed_at: '2025-11-14T16:00:00', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '20000000-0000-0000-0000-000000000015', meeting_id: '10000000-0000-0000-0000-000000000002', description: 'Aprovar plano de contas atualizado', due_date: '2025-10-15', status: 'CONCLUIDA', priority: 'BAIXA', category: 'Contabilidade', responsible_external_name: 'Roberto Almeida', responsible_external_email: 'roberto.almeida@fiscal.com', completed_at: '2025-10-15T10:00:00', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '20000000-0000-0000-0000-000000000016', meeting_id: '10000000-0000-0000-0000-000000000006', description: 'Apresentar cenários macroeconômicos 2025', due_date: '2024-10-20', status: 'CONCLUIDA', priority: 'MEDIA', category: 'Estratégia', responsible_external_name: 'Patricia Lima', responsible_external_email: 'patricia.lima@consultoria.com', completed_at: '2024-10-20T14:30:00', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '20000000-0000-0000-0000-000000000017', meeting_id: '10000000-0000-0000-0000-000000000002', description: 'Validar auditoria externa sem ressalvas', due_date: '2025-10-25', status: 'CONCLUIDA', priority: 'ALTA', category: 'Auditoria', responsible_external_name: 'Bruno Cardoso', responsible_external_email: 'bruno.cardoso@auditoria.com', completed_at: '2025-10-25T11:00:00', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '20000000-0000-0000-0000-000000000018', meeting_id: '10000000-0000-0000-0000-000000000005', description: 'Aprovar nova política de benefícios flexíveis', due_date: '2025-11-10', status: 'CONCLUIDA', priority: 'MEDIA', category: 'RH', responsible_external_name: 'Juliana Martins', responsible_external_email: 'juliana.martins@rh.com', completed_at: '2025-11-10T15:00:00', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '20000000-0000-0000-0000-000000000019', meeting_id: '10000000-0000-0000-0000-000000000008', description: 'Publicar relatório ESG 2024 no site corporativo', due_date: '2025-11-01', status: 'CONCLUIDA', priority: 'ALTA', category: 'Sustentabilidade', responsible_external_name: 'Claudia Alves', responsible_external_email: 'claudia.alves@sustentabilidade.com', completed_at: '2025-11-01T09:00:00', created_by: 'a0000000-0000-0000-0000-000000000001' },
      { id: '20000000-0000-0000-0000-000000000020', meeting_id: '10000000-0000-0000-0000-000000000004', description: 'Arquivar investigação 2024-034 sem irregularidades', due_date: '2025-10-28', status: 'CONCLUIDA', priority: 'BAIXA', category: 'Compliance', responsible_external_name: 'Beatriz Santos', responsible_external_email: 'beatriz.santos@compliance.com', completed_at: '2025-10-28T10:30:00', created_by: 'a0000000-0000-0000-0000-000000000001' }
    ];

    const { error: actionsError } = await supabase
      .from('meeting_actions')
      .upsert(actions, { onConflict: 'id' });

    if (actionsError) throw actionsError;
    console.log('✅ 20 tarefas inseridas');

    console.log('✨ População de dados demo concluída com sucesso!');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Dados demo populados com sucesso',
        summary: {
          users: 1,
          councils: 8,
          meetings: 12,
          actions: 20
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('💥 Erro:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
