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
    console.log('📝 Inserindo reuniões...');
    const meetings = [
      { id: '10000000-0000-0000-0000-000000000001', council_id: 'c0000000-0000-0000-0000-000000000001', company_id: 'Empresa Demo', title: 'Aprovação do orçamento 2025', date: '2025-01-15', time: '14:00', type: 'Ordinária', status: 'CONCLUIDA', modalidade: 'Presencial', location: 'Sala de Reuniões - Matriz' },
      { id: '10000000-0000-0000-0000-000000000002', council_id: 'c0000000-0000-0000-0000-000000000004', company_id: 'Empresa Demo', title: 'Análise de controles internos Q1', date: '2025-02-10', time: '10:00', type: 'Ordinária', status: 'CONCLUIDA', modalidade: 'Híbrida', location: 'Sala de Auditoria' },
      { id: '10000000-0000-0000-0000-000000000003', council_id: 'c0000000-0000-0000-0000-000000000002', company_id: 'Empresa Demo', title: 'Revisão de desvios orçamentários', date: '2025-02-20', time: '16:00', type: 'Extraordinária', status: 'CONCLUIDA', modalidade: 'Presencial', location: 'Sala Executiva' },
      { id: '10000000-0000-0000-0000-000000000004', council_id: 'c0000000-0000-0000-0000-000000000007', company_id: 'Empresa Demo', title: 'Atualização do código de conduta', date: '2025-03-05', time: '09:00', type: 'Ordinária', status: 'CONCLUIDA', modalidade: 'Online', location: 'Microsoft Teams' },
      { id: '10000000-0000-0000-0000-000000000005', council_id: 'c0000000-0000-0000-0000-000000000005', company_id: 'Empresa Demo', title: 'Plano de sucessão C-Level', date: '2025-03-15', time: '15:00', type: 'Ordinária', status: 'CONCLUIDA', modalidade: 'Presencial', location: 'Sala VIP' },
      { id: '10000000-0000-0000-0000-000000000006', council_id: 'c0000000-0000-0000-0000-000000000003', company_id: 'Empresa Demo', title: 'Cenários macroeconômicos 2025', date: '2024-10-20', time: '14:30', type: 'Ordinária', status: 'CONCLUIDA', modalidade: 'Presencial', location: 'Auditório' },
      { id: '10000000-0000-0000-0000-000000000007', council_id: 'c0000000-0000-0000-0000-000000000001', company_id: 'Empresa Demo', title: 'Revisão estratégica anual', date: '2025-12-15', time: '14:00', type: 'Ordinária', status: 'AGENDADA', modalidade: 'Presencial', location: 'Sala de Reuniões - Matriz' },
      { id: '10000000-0000-0000-0000-000000000008', council_id: 'c0000000-0000-0000-0000-000000000006', company_id: 'Empresa Demo', title: 'Relatório ESG 2024', date: '2025-12-10', time: '10:00', type: 'Ordinária', status: 'AGENDADA', modalidade: 'Híbrida', location: 'Sala de Sustentabilidade' },
      { id: '10000000-0000-0000-0000-000000000009', council_id: 'c0000000-0000-0000-0000-000000000008', company_id: 'Empresa Demo', title: 'Due diligence Target Corp', date: '2026-01-20', time: '11:00', type: 'Extraordinária', status: 'AGENDADA', modalidade: 'Online', location: 'Zoom' },
      { id: '10000000-0000-0000-0000-000000000010', council_id: 'c0000000-0000-0000-0000-000000000002', company_id: 'Empresa Demo', title: 'Balanço patrimonial Q4 2025', date: '2026-01-25', time: '16:00', type: 'Ordinária', status: 'AGENDADA', modalidade: 'Presencial', location: 'Sala Executiva' },
      { id: '10000000-0000-0000-0000-000000000011', council_id: 'c0000000-0000-0000-0000-000000000004', company_id: 'Empresa Demo', title: 'Plano de auditoria 2026', date: '2026-02-05', time: '10:30', type: 'Ordinária', status: 'AGENDADA', modalidade: 'Presencial', location: 'Sala de Auditoria' },
      { id: '10000000-0000-0000-0000-000000000012', council_id: 'c0000000-0000-0000-0000-000000000005', company_id: 'Empresa Demo', title: 'Avaliação de desempenho executivo', date: '2026-02-15', time: '14:00', type: 'Ordinária', status: 'AGENDADA', modalidade: 'Presencial', location: 'Sala VIP' }
    ];

    const { error: meetingsError, data: meetingsData } = await supabase
      .from('meetings')
      .upsert(meetings, { onConflict: 'id' })
      .select();

    if (meetingsError) {
      console.error('❌ Erro ao inserir reuniões:', JSON.stringify(meetingsError, null, 2));
      throw new Error(`Erro meetings: ${meetingsError.message} - ${JSON.stringify(meetingsError.details || {})}`);
    }
    console.log('✅ 12 reuniões inseridas:', meetingsData?.length || 0);

    // 4. Inserir 20 tarefas
    console.log('📝 Inserindo tarefas...');
    const actions = [
      // ATRASADAS (4)
      { id: '20000000-0000-0000-0000-000000000001', meeting_id: '10000000-0000-0000-0000-000000000007', description: 'Enviar convocação da reunião de dezembro com pauta anexa', due_date: '2025-11-20', status: 'ATRASADA', priority: 'ALTA', category: 'Convocação', responsible_external_name: 'João Silva', responsible_external_email: 'joao.silva@empresademo.com' },
      { id: '20000000-0000-0000-0000-000000000002', meeting_id: '10000000-0000-0000-0000-000000000003', description: 'Analisar desvios orçamentários do Q3 2024', due_date: '2025-11-15', status: 'ATRASADA', priority: 'MEDIA', category: 'Análise Financeira', responsible_external_name: 'Ana Costa', responsible_external_email: 'ana.costa@fiscal.com' },
      { id: '20000000-0000-0000-0000-000000000003', meeting_id: '10000000-0000-0000-0000-000000000011', description: 'Revisar parecer sobre fraude identificada na filial Sul', due_date: '2025-11-18', status: 'ATRASADA', priority: 'ALTA', category: 'Compliance', responsible_external_name: 'Fernanda Souza', responsible_external_email: 'fernanda.souza@auditoria.com' },
      { id: '20000000-0000-0000-0000-000000000004', meeting_id: '10000000-0000-0000-0000-000000000004', description: 'Responder denúncia trabalhista protocolo #2024-089', due_date: '2025-11-10', status: 'ATRASADA', priority: 'ALTA', category: 'Jurídico', responsible_external_name: 'Marcelo Pereira', responsible_external_email: 'marcelo.pereira@juridico.com' },
      
      // PENDENTES (5)
      { id: '20000000-0000-0000-0000-000000000005', meeting_id: '10000000-0000-0000-0000-000000000001', description: 'Preparar proposta de investimento em IA para aprovação', due_date: '2025-12-05', status: 'PENDENTE', priority: 'ALTA', category: 'Estratégia', responsible_external_name: 'Maria Santos', responsible_external_email: 'maria.santos@empresademo.com' },
      { id: '20000000-0000-0000-0000-000000000006', meeting_id: '10000000-0000-0000-0000-000000000003', description: 'Revisar plano estratégico 2026-2030', due_date: '2025-12-15', status: 'PENDENTE', priority: 'MEDIA', category: 'Planejamento', responsible_external_name: 'Patricia Lima', responsible_external_email: 'patricia.lima@consultoria.com' },
      { id: '20000000-0000-0000-0000-000000000007', meeting_id: '10000000-0000-0000-0000-000000000012', description: 'Avaliar candidatos finalistas para cargo de CFO', due_date: '2025-11-30', status: 'PENDENTE', priority: 'MEDIA', category: 'Recursos Humanos', responsible_external_name: 'Juliana Martins', responsible_external_email: 'juliana.martins@rh.com' },
      { id: '20000000-0000-0000-0000-000000000008', meeting_id: '10000000-0000-0000-0000-000000000008', description: 'Atualizar inventário de emissões de GEE (Escopo 1, 2, 3)', due_date: '2025-12-10', status: 'PENDENTE', priority: 'BAIXA', category: 'Sustentabilidade', responsible_external_name: 'Claudia Alves', responsible_external_email: 'claudia.alves@sustentabilidade.com' },
      { id: '20000000-0000-0000-0000-000000000009', meeting_id: '10000000-0000-0000-0000-000000000009', description: 'Elaborar due diligence completa da Target Corp', due_date: '2025-11-28', status: 'PENDENTE', priority: 'ALTA', category: 'M&A', responsible_external_name: 'Ricardo Barbosa', responsible_external_email: 'ricardo.barbosa@ma.com' },
      
      // EM ANDAMENTO (3)
      { id: '20000000-0000-0000-0000-000000000010', meeting_id: '10000000-0000-0000-0000-000000000002', description: 'Implementar nova política de controles internos', due_date: '2025-12-20', status: 'EM_ANDAMENTO', priority: 'ALTA', category: 'Auditoria', responsible_external_name: 'Bruno Cardoso', responsible_external_email: 'bruno.cardoso@auditoria.com' },
      { id: '20000000-0000-0000-0000-000000000011', meeting_id: '10000000-0000-0000-0000-000000000004', description: 'Revisar e atualizar código de conduta corporativo', due_date: '2025-12-18', status: 'EM_ANDAMENTO', priority: 'MEDIA', category: 'Compliance', responsible_external_name: 'Beatriz Santos', responsible_external_email: 'beatriz.santos@compliance.com' },
      { id: '20000000-0000-0000-0000-000000000012', meeting_id: '10000000-0000-0000-0000-000000000009', description: 'Negociar termos de acordo de confidencialidade', due_date: '2025-11-25', status: 'EM_ANDAMENTO', priority: 'ALTA', category: 'M&A', responsible_external_name: 'Leonardo Costa', responsible_external_email: 'leonardo.costa@ma.com' },
      
      // CONCLUÍDAS (8)
      { id: '20000000-0000-0000-0000-000000000013', meeting_id: '10000000-0000-0000-0000-000000000001', description: 'Ratificar nomeação do novo CTO', due_date: '2025-11-05', status: 'CONCLUIDA', priority: 'MEDIA', category: 'Governança', responsible_external_name: 'Carlos Mendes', responsible_external_email: 'carlos.mendes@empresademo.com', completed_at: '2025-11-05T14:30:00' },
      { id: '20000000-0000-0000-0000-000000000014', meeting_id: '10000000-0000-0000-0000-000000000003', description: 'Aprovar balanço patrimonial Q3 2024', due_date: '2025-11-14', status: 'CONCLUIDA', priority: 'ALTA', category: 'Finanças', responsible_external_name: 'Roberto Almeida', responsible_external_email: 'roberto.almeida@fiscal.com', completed_at: '2025-11-14T16:00:00' },
      { id: '20000000-0000-0000-0000-000000000015', meeting_id: '10000000-0000-0000-0000-000000000002', description: 'Aprovar plano de contas atualizado', due_date: '2025-10-15', status: 'CONCLUIDA', priority: 'BAIXA', category: 'Contabilidade', responsible_external_name: 'Roberto Almeida', responsible_external_email: 'roberto.almeida@fiscal.com', completed_at: '2025-10-15T10:00:00' },
      { id: '20000000-0000-0000-0000-000000000016', meeting_id: '10000000-0000-0000-0000-000000000006', description: 'Apresentar cenários macroeconômicos 2025', due_date: '2024-10-20', status: 'CONCLUIDA', priority: 'MEDIA', category: 'Estratégia', responsible_external_name: 'Patricia Lima', responsible_external_email: 'patricia.lima@consultoria.com', completed_at: '2024-10-20T14:30:00' },
      { id: '20000000-0000-0000-0000-000000000017', meeting_id: '10000000-0000-0000-0000-000000000002', description: 'Validar auditoria externa sem ressalvas', due_date: '2025-10-25', status: 'CONCLUIDA', priority: 'ALTA', category: 'Auditoria', responsible_external_name: 'Bruno Cardoso', responsible_external_email: 'bruno.cardoso@auditoria.com', completed_at: '2025-10-25T11:00:00' },
      { id: '20000000-0000-0000-0000-000000000018', meeting_id: '10000000-0000-0000-0000-000000000005', description: 'Aprovar nova política de benefícios flexíveis', due_date: '2025-11-10', status: 'CONCLUIDA', priority: 'MEDIA', category: 'RH', responsible_external_name: 'Juliana Martins', responsible_external_email: 'juliana.martins@rh.com', completed_at: '2025-11-10T15:00:00' },
      { id: '20000000-0000-0000-0000-000000000019', meeting_id: '10000000-0000-0000-0000-000000000008', description: 'Publicar relatório ESG 2024 no site corporativo', due_date: '2025-11-01', status: 'CONCLUIDA', priority: 'ALTA', category: 'Sustentabilidade', responsible_external_name: 'Claudia Alves', responsible_external_email: 'claudia.alves@sustentabilidade.com', completed_at: '2025-11-01T09:00:00' },
      { id: '20000000-0000-0000-0000-000000000020', meeting_id: '10000000-0000-0000-0000-000000000004', description: 'Arquivar investigação 2024-034 sem irregularidades', due_date: '2025-10-28', status: 'CONCLUIDA', priority: 'BAIXA', category: 'Compliance', responsible_external_name: 'Beatriz Santos', responsible_external_email: 'beatriz.santos@compliance.com', completed_at: '2025-10-28T10:30:00' }
    ];

    const { error: actionsError, data: actionsData } = await supabase
      .from('meeting_actions')
      .upsert(actions, { onConflict: 'id' })
      .select();

    if (actionsError) {
      console.error('❌ Erro ao inserir tarefas:', JSON.stringify(actionsError, null, 2));
      throw new Error(`Erro actions: ${actionsError.message} - ${JSON.stringify(actionsError.details || {})}`);
    }
    console.log('✅ 20 tarefas inseridas:', actionsData?.length || 0);

    // 5. Inserir 5 entrevistas (removendo user_id para evitar FK constraint)
    console.log('📝 Inserindo entrevistas...');
    const interviews = [
      { id: 'e0000000-0000-0000-0000-000000000001', company_id: 'Empresa Demo', name: 'Roberto Silva', role: 'Fundador/CEO', email: 'roberto.silva@empresademo.com', priority: 'high', status: 'interviewed', interview_date: '2025-11-15 10:00:00', notes: 'Entrevista sobre visão estratégica e processo sucessório. Foco em profissionalização da governança.', created_at: '2025-11-10 09:00:00', updated_at: '2025-11-15 11:00:00' },
      { id: 'e0000000-0000-0000-0000-000000000002', company_id: 'Empresa Demo', name: 'Ana Paula Costa', role: 'Diretora Financeira', email: 'ana.costa@empresademo.com', priority: 'high', status: 'interviewed', interview_date: '2025-11-18 14:30:00', notes: 'Discussão sobre estrutura financeira, controles internos e necessidade de comitê de auditoria.', created_at: '2025-11-12 11:00:00', updated_at: '2025-11-18 15:30:00' },
      { id: 'e0000000-0000-0000-0000-000000000003', company_id: 'Empresa Demo', name: 'Carlos Eduardo Mendes', role: 'Conselheiro Independente', email: 'carlos.mendes@conselho.com', priority: 'medium', status: 'interviewed', interview_date: '2025-11-20 09:00:00', notes: 'Avaliação independente sobre governança corporativa e recomendações estruturais.', created_at: '2025-11-14 10:00:00', updated_at: '2025-11-20 10:00:00' },
      { id: 'e0000000-0000-0000-0000-000000000004', company_id: 'Empresa Demo', name: 'Patricia Lima Santos', role: 'Sócia/Acionista Minoritária', email: 'patricia.santos@empresademo.com', priority: 'high', status: 'interviewed', interview_date: '2025-11-22 16:00:00', notes: 'Perspectiva de acionista minoritária sobre proteção de direitos e participação em decisões.', created_at: '2025-11-15 14:00:00', updated_at: '2025-11-22 17:00:00' },
      { id: 'e0000000-0000-0000-0000-000000000005', company_id: 'Empresa Demo', name: 'Fernanda Oliveira', role: 'Herdeira (2ª Geração)', email: 'fernanda.oliveira@empresademo.com', priority: 'medium', status: 'interviewed', interview_date: '2025-11-23 11:00:00', notes: 'Visão da segunda geração sobre modernização, diversidade e necessidade de governança familiar.', created_at: '2025-11-18 09:00:00', updated_at: '2025-11-23 12:00:00' }
    ];

    const { error: interviewsError, data: interviewsData } = await supabase
      .from('interviews')
      .upsert(interviews, { onConflict: 'id' })
      .select();

    if (interviewsError) {
      console.error('❌ Erro ao inserir entrevistas:', JSON.stringify(interviewsError, null, 2));
      throw new Error(`Erro interviews: ${interviewsError.message} - ${JSON.stringify(interviewsError.details || {})}`);
    }
    console.log('✅ 5 entrevistas inseridas:', interviewsData?.length || 0);

    // 6. Inserir 5 transcrições
    console.log('📝 Inserindo transcrições...');
    const transcripts = [
      { 
        id: 'f0000000-0000-0000-0000-000000000001', 
        interview_id: 'e0000000-0000-0000-0000-000000000001', 
        uploaded_at: '2025-11-15 11:30:00',
        transcript_text: `ENTREVISTA COM ROBERTO SILVA - FUNDADOR/CEO
Data: 15/11/2025 | Duração: 45 minutos

ENTREVISTADOR: Bom dia, Roberto. Poderia nos contar um pouco sobre a origem da empresa?

ROBERTO SILVA: Claro. Fundei a empresa em 1998, quando o mercado brasileiro estava em transformação. Começamos como uma pequena distribuidora no interior de São Paulo e, ao longo de 26 anos, nos tornamos referência nacional no setor de tecnologia industrial. Hoje temos 8 unidades distribuídas pelo país e cerca de 450 colaboradores.

ENTREVISTADOR: Como você enxerga o processo de sucessão?

ROBERTO: A sucessão é uma das minhas maiores preocupações. Não quero que o que construímos se perca por falta de planejamento. Meu filho mais velho, Eduardo, trabalha conosco há 10 anos e tem mostrado capacidade técnica, mas ainda precisa desenvolver a visão estratégica de longo prazo. Por outro lado, minha filha Patricia, que é acionista minoritária, tem uma visão muito aguçada do mercado financeiro.

ENTREVISTADOR: Qual sua expectativa para os próximos 5 anos?

ROBERTO: Pretendo me afastar gradualmente da operação nos próximos 3 anos. Quero que Eduardo assuma a presidência executiva, mas com um Conselho de Administração forte que possa orientá-lo. Patricia poderia compor esse conselho. Também acredito que precisamos profissionalizar ainda mais a gestão, trazendo executivos de mercado para algumas diretorias.

ENTREVISTADOR: Como você enxerga a governança corporativa na empresa?

ROBERTO: Hoje temos uma estrutura básica, mas informal. Precisamos formalizar tudo: políticas de conflito de interesses, acordo de acionistas atualizado, conselho fiscal ativo. Isso é fundamental para proteger o patrimônio familiar e dar segurança aos investidores externos que queremos trazer nos próximos anos.`
      },
      { 
        id: 'f0000000-0000-0000-0000-000000000002', 
        interview_id: 'e0000000-0000-0000-0000-000000000002', 
        uploaded_at: '2025-11-18 16:00:00',
        transcript_text: `ENTREVISTA COM ANA PAULA COSTA - DIRETORA FINANCEIRA
Data: 18/11/2025 | Duração: 35 minutos

ENTREVISTADOR: Ana Paula, como está estruturada a área financeira atualmente?

ANA PAULA: Trabalho na empresa há 12 anos. Quando entrei, tínhamos controles muito básicos, quase tudo em planilhas. Hoje implementamos um ERP robusto, temos auditoria externa anual e controles internos bem definidos. Nossa maior conquista foi reduzir o endividamento de 4,5x para 1,8x EBITDA nos últimos 5 anos.

ENTREVISTADOR: Quais são os principais desafios financeiros?

ANA PAULA: O principal desafio é equilibrar investimentos em crescimento com distribuição de dividendos. A família Silva tem uma expectativa de retorno anual, mas precisamos reter recursos para expansão. Outro ponto crítico é a separação entre contas da empresa e pessoais da família, algo que ainda precisa ser mais bem delimitado.

ENTREVISTADOR: Como você vê a profissionalização da governança?

ANA PAULA: É essencial. Precisamos de um Comitê de Auditoria independente que avalie nossos números com olhar crítico. Também defendemos a criação de um Conselho Fiscal ativo, não apenas pró-forma. Isso dá credibilidade para eventuais captações de recursos ou entrada de investidores estratégicos.

ENTREVISTADOR: Há riscos financeiros relevantes que devem ser endereçados?

ANA PAULA: Sim. Nossa estrutura de capital está muito concentrada em crédito bancário de curto prazo. Precisamos diversificar: debêntures, fundos de investimento, talvez até uma abertura de capital em 5-7 anos. Mas para isso, a governança precisa estar impecável.`
      },
      { 
        id: 'f0000000-0000-0000-0000-000000000003', 
        interview_id: 'e0000000-0000-0000-0000-000000000003', 
        uploaded_at: '2025-11-20 10:30:00',
        transcript_text: `ENTREVISTA COM CARLOS EDUARDO MENDES - CONSELHEIRO INDEPENDENTE
Data: 20/11/2025 | Duração: 40 minutos

ENTREVISTADOR: Carlos, você foi convidado para compor o conselho como membro independente. Como avalia a empresa?

CARLOS: Vejo uma empresa sólida, com marca forte e equipe competente, mas ainda muito dependente do fundador. Roberto é brilhante, mas centraliza demais as decisões estratégicas. O conselho hoje funciona mais como um grupo consultivo do que como um órgão deliberativo.

ENTREVISTADOR: Quais são as maiores fragilidades?

CARLOS: Primeira: falta de sucessão clara documentada. Segunda: inexistência de políticas formais de governança - não há código de conduta, política de transações com partes relacionadas ou matriz de alçadas bem definida. Terceira: sobreposição entre propriedade e gestão sem mecanismos de mediação.

ENTREVISTADOR: O que você recomendaria como prioridade?

CARLOS: Três ações imediatas: 1) Elaborar um Acordo de Acionistas robusto com cláusulas de liquidez e sucessão; 2) Implementar um Conselho de Administração profissional com maioria independente; 3) Criar um Conselho de Família separado para tratar questões patrimoniais e educação das próximas gerações.

ENTREVISTADOR: Como o senhor vê o papel da família na gestão?

CARLOS: A família deve estar na propriedade e na governança, não necessariamente na gestão executiva. Nem todos os familiares têm perfil ou competência para gerir. É importante distinguir: ser dono não te qualifica automaticamente para ser gestor.`
      },
      { 
        id: 'f0000000-0000-0000-0000-000000000004', 
        interview_id: 'e0000000-0000-0000-0000-000000000004', 
        uploaded_at: '2025-11-22 17:30:00',
        transcript_text: `ENTREVISTA COM PATRICIA LIMA SANTOS - SÓCIA/ACIONISTA MINORITÁRIA
Data: 22/11/2025 | Duração: 30 minutos

ENTREVISTADOR: Patricia, como acionista com 15% da empresa, como você se relaciona com a gestão?

PATRICIA: É uma relação que evoluiu muito. No início, eu não tinha visibilidade nenhuma das operações. Recebia dividendos, mas não participava de decisões. Nos últimos 3 anos, com a formalização do conselho, passei a ter acesso a relatórios trimestrais e participo das assembleias.

ENTREVISTADOR: Quais são suas expectativas?

PATRICIA: Quero que a empresa continue crescendo de forma sustentável e que haja clareza nos critérios de distribuição de lucros. Também é importante ter regras claras para entrada e saída de acionistas. E se meu primo Eduardo assumir a presidência, quero garantias de que haverá meritocracia, não nepotismo.

ENTREVISTADOR: Você tem interesse em participar da gestão?

PATRICIA: Não na operação do dia a dia. Minha carreira é no mercado financeiro, trabalho num banco de investimentos. Mas posso contribuir muito no conselho, especialmente em temas de M&A, captação de recursos e valuation da empresa.

ENTREVISTADOR: Como você vê a necessidade de governança?

PATRICIA: É fundamental para proteger acionistas minoritários como eu. Sem governança, ficamos à mercê das decisões do controlador. Precisamos de acordos que garantam direitos, como tag along, acesso a informações e participação em decisões relevantes.`
      },
      { 
        id: 'f0000000-0000-0000-0000-000000000005', 
        interview_id: 'e0000000-0000-0000-0000-000000000005', 
        uploaded_at: '2025-11-23 12:30:00',
        transcript_text: `ENTREVISTA COM FERNANDA OLIVEIRA - HERDEIRA (2ª GERAÇÃO)
Data: 23/11/2025 | Duração: 25 minutos

ENTREVISTADOR: Fernanda, você tem 28 anos e é herdeira. Como enxerga seu papel na empresa?

FERNANDA: Ainda estou descobrindo. Cresci vendo meu pai dedicar a vida à empresa, mas sempre fui incentivada a seguir minha carreira. Me formei em engenharia e trabalho numa multinacional. A empresa da família sempre foi um tema de domingo, nunca senti pressão para trabalhar lá.

ENTREVISTADOR: Você tem interesse em se envolver?

FERNANDA: Tenho interesse em entender melhor o negócio, participar de conselhos e ajudar nas decisões estratégicas, mas não vejo meu futuro na gestão operacional. Acho que posso contribuir trazendo perspectivas de inovação, sustentabilidade e governança moderna. Minha geração pensa diferente.

ENTREVISTADOR: O que você acha que a empresa precisa melhorar?

FERNANDA: Precisa se modernizar. Tanto em tecnologia quanto em cultura organizacional. Vi que há pouca diversidade na liderança, todos são homens acima de 50 anos. Também acho que falta transparência: nunca entendi direito quanto vale minha participação ou como são tomadas as decisões de investimento.

ENTREVISTADOR: Como você vê a governança familiar?

FERNANDA: Acho essencial. Minha família precisa sentar e conversar abertamente sobre sucessão, valores, expectativas. Conheço casos de empresas familiares que quebraram por falta de alinhamento entre gerações. Precisamos de regras claras e um plano de longo prazo.`
      }
    ];

    const { error: transcriptsError, data: transcriptsData } = await supabase
      .from('interview_transcripts')
      .upsert(transcripts, { onConflict: 'id' })
      .select();

    if (transcriptsError) {
      console.error('❌ Erro ao inserir transcrições:', JSON.stringify(transcriptsError, null, 2));
      throw new Error(`Erro transcripts: ${transcriptsError.message} - ${JSON.stringify(transcriptsError.details || {})}`);
    }
    console.log('✅ 5 transcrições inseridas:', transcriptsData?.length || 0);

    console.log('✨ População de dados demo concluída com sucesso!');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Dados demo populados com sucesso',
        summary: {
          users: 1,
          councils: 8,
          meetings: 12,
          actions: 20,
          interviews: 5,
          transcripts: 5
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('💥 Erro completo:', error);
    
    // Log detalhado do erro
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      fullError: JSON.stringify(error, null, 2)
    };
    
    console.error('Detalhes:', JSON.stringify(errorDetails, null, 2));
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        details: errorDetails
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
