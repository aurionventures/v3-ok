import { GovernanceOrgan } from '../hooks/useGovernanceOrgans';

export interface MockMember {
  id: string;
  council_id: string;
  name: string;
  role: string;
  start_date: string;
  end_date?: string | null;
  status: string;
  user_id?: string | null;
}

export interface MockGuest {
  id: string;
  external_name: string;
  external_email: string;
  external_phone?: string;
  permissions: {
    can_view_materials: boolean;
    can_upload: boolean;
    can_comment: boolean;
    can_vote: boolean;
  };
  status: 'pending' | 'accepted' | 'declined';
  token?: string;
}

export interface MockMeeting {
  id: string;
  council_id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  status: string;
  modalidade: string;
  location?: string;
  attendees: string[];
  guests: MockGuest[];
}

export interface MockGovernanceData {
  organs: GovernanceOrgan[];
  members: MockMember[];
  guests: MockGuest[];
  meetings: MockMeeting[];
}

export const getMockGovernanceData = (company_id: string): MockGovernanceData => {
  // IDs dos órgãos
  const organIds = {
    conselho_admin: 'mock-council-admin-001',
    conselho_fiscal: 'mock-council-fiscal-002',
    conselho_consultivo: 'mock-council-consultivo-003',
    comite_auditoria: 'mock-committee-audit-004',
    comite_estrategia: 'mock-committee-strategy-005',
    comite_riscos: 'mock-committee-risk-006',
    comissao_etica: 'mock-commission-ethics-007',
    comissao_inovacao: 'mock-commission-innovation-008',
    comissao_sustentabilidade: 'mock-commission-sustainability-009'
  };

  // 9 Órgãos de Governança
  const organs: GovernanceOrgan[] = [
    // CONSELHOS
    {
      id: organIds.conselho_admin,
      company_id,
      name: 'Conselho de Administração',
      type: 'administrativo',
      organ_type: 'conselho',
      description: 'Conselho responsável pela gestão estratégica da empresa',
      quorum: 3,
      hierarchy_level: 1,
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      members: [],
      access_config: {
        public_view: false,
        member_upload: true,
        guest_upload: false,
        require_approval: true
      }
    },
    {
      id: organIds.conselho_fiscal,
      company_id,
      name: 'Conselho Fiscal',
      type: 'fiscal',
      organ_type: 'conselho',
      description: 'Conselho de fiscalização contábil e financeira',
      quorum: 3,
      hierarchy_level: 1,
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      members: [],
      access_config: {
        public_view: false,
        member_upload: true,
        guest_upload: false,
        require_approval: true
      }
    },
    {
      id: organIds.conselho_consultivo,
      company_id,
      name: 'Conselho Consultivo',
      type: 'consultivo',
      organ_type: 'conselho',
      description: 'Conselho de especialistas externos para orientação estratégica',
      quorum: 5,
      hierarchy_level: 1,
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      members: [],
      access_config: {
        public_view: false,
        member_upload: true,
        guest_upload: true,
        require_approval: false
      }
    },
    // COMITÊS
    {
      id: organIds.comite_auditoria,
      company_id,
      name: 'Comitê de Auditoria',
      type: 'auditoria',
      organ_type: 'comite',
      description: 'Supervisão de processos de auditoria interna e externa',
      quorum: 3,
      hierarchy_level: 2,
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      members: [],
      access_config: {
        public_view: false,
        member_upload: true,
        guest_upload: false,
        require_approval: true
      }
    },
    {
      id: organIds.comite_estrategia,
      company_id,
      name: 'Comitê de Estratégia',
      type: 'estrategia',
      organ_type: 'comite',
      description: 'Definição e acompanhamento do planejamento estratégico',
      quorum: 4,
      hierarchy_level: 2,
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      members: [],
      access_config: {
        public_view: false,
        member_upload: true,
        guest_upload: false,
        require_approval: true
      }
    },
    {
      id: organIds.comite_riscos,
      company_id,
      name: 'Comitê de Riscos',
      type: 'outros',
      organ_type: 'comite',
      description: 'Gestão e mitigação de riscos corporativos',
      quorum: 3,
      hierarchy_level: 2,
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      members: [],
      access_config: {
        public_view: false,
        member_upload: true,
        guest_upload: false,
        require_approval: true
      }
    },
    // COMISSÕES
    {
      id: organIds.comissao_etica,
      company_id,
      name: 'Comissão de Ética',
      type: 'outros',
      organ_type: 'comissao',
      description: 'Análise de questões éticas e compliance corporativo',
      quorum: 3,
      hierarchy_level: 3,
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      members: [],
      access_config: {
        public_view: false,
        member_upload: true,
        guest_upload: false,
        require_approval: false
      }
    },
    {
      id: organIds.comissao_inovacao,
      company_id,
      name: 'Comissão de Inovação',
      type: 'outros',
      organ_type: 'comissao',
      description: 'Avaliação de projetos de inovação e transformação digital',
      quorum: 4,
      hierarchy_level: 3,
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      members: [],
      access_config: {
        public_view: false,
        member_upload: true,
        guest_upload: true,
        require_approval: false
      }
    },
    {
      id: organIds.comissao_sustentabilidade,
      company_id,
      name: 'Comissão de Sustentabilidade',
      type: 'outros',
      organ_type: 'comissao',
      description: 'Iniciativas ESG e sustentabilidade empresarial',
      quorum: 3,
      hierarchy_level: 3,
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      members: [],
      access_config: {
        public_view: false,
        member_upload: true,
        guest_upload: true,
        require_approval: false
      }
    }
  ];

  // 35 Membros Fixos
  const members: MockMember[] = [
    // Conselho de Administração (4 membros)
    { id: 'mock-member-001', council_id: organIds.conselho_admin, name: 'Carlos Alberto Silva', role: 'Presidente', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-002', council_id: organIds.conselho_admin, name: 'Maria Fernanda Costa', role: 'Vice-Presidente', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-003', council_id: organIds.conselho_admin, name: 'Roberto Martins', role: 'Conselheiro', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-004', council_id: organIds.conselho_admin, name: 'Ana Paula Rodrigues', role: 'Conselheira Independente', start_date: '2024-01-15', status: 'active' },
    
    // Conselho Fiscal (3 membros)
    { id: 'mock-member-005', council_id: organIds.conselho_fiscal, name: 'João Pedro Santos', role: 'Presidente', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-006', council_id: organIds.conselho_fiscal, name: 'Patricia Lima', role: 'Membro', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-007', council_id: organIds.conselho_fiscal, name: 'Fernando Alves', role: 'Membro', start_date: '2024-01-15', status: 'active' },
    
    // Conselho Consultivo (5 membros)
    { id: 'mock-member-008', council_id: organIds.conselho_consultivo, name: 'Dr. Eduardo Campos', role: 'Consultor Sênior', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-009', council_id: organIds.conselho_consultivo, name: 'Dra. Juliana Moreira', role: 'Consultora Estratégica', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-010', council_id: organIds.conselho_consultivo, name: 'Prof. Ricardo Tavares', role: 'Consultor Acadêmico', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-011', council_id: organIds.conselho_consultivo, name: 'Beatriz Cardoso', role: 'Consultora de Inovação', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-012', council_id: organIds.conselho_consultivo, name: 'Marcelo Souza', role: 'Consultor Financeiro', start_date: '2024-01-15', status: 'active' },
    
    // Comitê de Auditoria (3 membros)
    { id: 'mock-member-013', council_id: organIds.comite_auditoria, name: 'Luiz Fernando Braga', role: 'Coordenador', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-014', council_id: organIds.comite_auditoria, name: 'Sandra Oliveira', role: 'Membro', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-015', council_id: organIds.comite_auditoria, name: 'Gustavo Henrique', role: 'Auditor Interno', start_date: '2024-01-15', status: 'active' },
    
    // Comitê de Estratégia (4 membros)
    { id: 'mock-member-016', council_id: organIds.comite_estrategia, name: 'Renata Barbosa', role: 'Coordenadora', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-017', council_id: organIds.comite_estrategia, name: 'Daniel Ferreira', role: 'Analista de Planejamento', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-018', council_id: organIds.comite_estrategia, name: 'Camila Nunes', role: 'Estrategista de Negócios', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-019', council_id: organIds.comite_estrategia, name: 'André Carvalho', role: 'Membro', start_date: '2024-01-15', status: 'active' },
    
    // Comitê de Riscos (3 membros)
    { id: 'mock-member-020', council_id: organIds.comite_riscos, name: 'Fabio Mendes', role: 'Coordenador de Riscos', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-021', council_id: organIds.comite_riscos, name: 'Luciana Dias', role: 'Analista de Compliance', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-022', council_id: organIds.comite_riscos, name: 'Thiago Pereira', role: 'Gestor de Riscos Operacionais', start_date: '2024-01-15', status: 'active' },
    
    // Comissão de Ética (3 membros)
    { id: 'mock-member-023', council_id: organIds.comissao_etica, name: 'Isabela Monteiro', role: 'Presidente', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-024', council_id: organIds.comissao_etica, name: 'Rafael Gomes', role: 'Membro', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-025', council_id: organIds.comissao_etica, name: 'Vanessa Prado', role: 'Compliance Officer', start_date: '2024-01-15', status: 'active' },
    
    // Comissão de Inovação (4 membros)
    { id: 'mock-member-026', council_id: organIds.comissao_inovacao, name: 'Leonardo Ribeiro', role: 'Líder de Inovação', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-027', council_id: organIds.comissao_inovacao, name: 'Priscila Araújo', role: 'Coordenadora de Projetos', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-028', council_id: organIds.comissao_inovacao, name: 'Bruno Castro', role: 'Analista de Tecnologia', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-029', council_id: organIds.comissao_inovacao, name: 'Tatiana Freitas', role: 'UX Researcher', start_date: '2024-01-15', status: 'active' },
    
    // Comissão de Sustentabilidade (3 membros)
    { id: 'mock-member-030', council_id: organIds.comissao_sustentabilidade, name: 'Henrique Azevedo', role: 'Coordenador ESG', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-031', council_id: organIds.comissao_sustentabilidade, name: 'Márcia Santos', role: 'Analista Ambiental', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-032', council_id: organIds.comissao_sustentabilidade, name: 'Rodrigo Teixeira', role: 'Especialista em Social', start_date: '2024-01-15', status: 'active' },
    
    // Membros adicionais em múltiplos órgãos
    { id: 'mock-member-033', council_id: organIds.comite_estrategia, name: 'Carlos Alberto Silva', role: 'Membro Ex-Officio', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-034', council_id: organIds.comite_auditoria, name: 'João Pedro Santos', role: 'Membro Ex-Officio', start_date: '2024-01-15', status: 'active' },
    { id: 'mock-member-035', council_id: organIds.comissao_etica, name: 'Maria Fernanda Costa', role: 'Membro Consultivo', start_date: '2024-01-15', status: 'active' }
  ];

  // 12 Convidados Externos
  const guests: MockGuest[] = [
    // Convidados do Conselho Consultivo
    {
      id: 'mock-guest-001',
      external_name: 'Dr. Alexandre Costa',
      external_email: 'alexandre.costa@external.com',
      external_phone: '+55 11 98765-4321',
      permissions: { can_view_materials: true, can_upload: true, can_comment: true, can_vote: false },
      status: 'accepted',
      token: 'token-guest-001'
    },
    {
      id: 'mock-guest-002',
      external_name: 'Silvia Mendonça',
      external_email: 'silvia.mendonca@consultant.com',
      external_phone: '+55 11 98765-4322',
      permissions: { can_view_materials: true, can_upload: false, can_comment: true, can_vote: false },
      status: 'accepted',
      token: 'token-guest-002'
    },
    // Convidados da Comissão de Inovação
    {
      id: 'mock-guest-003',
      external_name: 'Pedro Almeida',
      external_email: 'pedro.almeida@startup.com',
      external_phone: '+55 11 98765-4323',
      permissions: { can_view_materials: true, can_upload: true, can_comment: true, can_vote: false },
      status: 'accepted',
      token: 'token-guest-003'
    },
    {
      id: 'mock-guest-004',
      external_name: 'Carolina Bittencourt',
      external_email: 'carolina.b@innovation.com',
      external_phone: '+55 11 98765-4324',
      permissions: { can_view_materials: true, can_upload: true, can_comment: false, can_vote: false },
      status: 'pending'
    },
    // Convidados da Comissão de Sustentabilidade
    {
      id: 'mock-guest-005',
      external_name: 'Dr. Marcos Oliveira',
      external_email: 'marcos.oliveira@esg.org',
      external_phone: '+55 11 98765-4325',
      permissions: { can_view_materials: true, can_upload: true, can_comment: true, can_vote: false },
      status: 'accepted',
      token: 'token-guest-005'
    },
    {
      id: 'mock-guest-006',
      external_name: 'Amanda Silva',
      external_email: 'amanda.silva@sustainability.com',
      permissions: { can_view_materials: true, can_upload: false, can_comment: true, can_vote: false },
      status: 'accepted',
      token: 'token-guest-006'
    },
    // Convidados do Comitê de Auditoria
    {
      id: 'mock-guest-007',
      external_name: 'Ricardo Campos',
      external_email: 'ricardo.campos@audit.com',
      external_phone: '+55 11 98765-4327',
      permissions: { can_view_materials: true, can_upload: false, can_comment: false, can_vote: false },
      status: 'accepted',
      token: 'token-guest-007'
    },
    {
      id: 'mock-guest-008',
      external_name: 'Fernanda Rocha',
      external_email: 'fernanda.rocha@compliance.com',
      permissions: { can_view_materials: true, can_upload: true, can_comment: true, can_vote: false },
      status: 'pending'
    },
    // Convidados do Comitê de Estratégia
    {
      id: 'mock-guest-009',
      external_name: 'Paulo Henrique',
      external_email: 'paulo.h@strategy.com',
      external_phone: '+55 11 98765-4329',
      permissions: { can_view_materials: true, can_upload: true, can_comment: true, can_vote: false },
      status: 'accepted',
      token: 'token-guest-009'
    },
    {
      id: 'mock-guest-010',
      external_name: 'Gabriela Martins',
      external_email: 'gabriela.m@consulting.com',
      permissions: { can_view_materials: true, can_upload: false, can_comment: true, can_vote: false },
      status: 'declined'
    },
    // Convidados adicionais
    {
      id: 'mock-guest-011',
      external_name: 'Dr. Roberto Fonseca',
      external_email: 'roberto.fonseca@legal.com',
      external_phone: '+55 11 98765-4331',
      permissions: { can_view_materials: true, can_upload: true, can_comment: true, can_vote: false },
      status: 'accepted',
      token: 'token-guest-011'
    },
    {
      id: 'mock-guest-012',
      external_name: 'Mariana Costa',
      external_email: 'mariana.costa@advisor.com',
      permissions: { can_view_materials: true, can_upload: false, can_comment: false, can_vote: false },
      status: 'pending'
    }
  ];

  // 6 Reuniões Agendadas
  const meetings: MockMeeting[] = [
    {
      id: 'mock-meeting-001',
      council_id: organIds.conselho_admin,
      title: 'Reunião Ordinária - Q1 2025',
      date: '2025-02-15',
      time: '14:00',
      type: 'Ordinária',
      status: 'AGENDADA',
      modalidade: 'Híbrida',
      location: 'Sala de Reuniões - 5º Andar',
      attendees: ['mock-member-001', 'mock-member-002', 'mock-member-003', 'mock-member-004'],
      guests: []
    },
    {
      id: 'mock-meeting-002',
      council_id: organIds.conselho_consultivo,
      title: 'Sessão de Planejamento Estratégico',
      date: '2025-02-20',
      time: '10:00',
      type: 'Extraordinária',
      status: 'AGENDADA',
      modalidade: 'Presencial',
      location: 'Auditório Principal',
      attendees: ['mock-member-008', 'mock-member-009', 'mock-member-010', 'mock-member-011', 'mock-member-012'],
      guests: [guests[0], guests[1]]
    },
    {
      id: 'mock-meeting-003',
      council_id: organIds.comite_auditoria,
      title: 'Revisão de Controles Internos',
      date: '2025-02-25',
      time: '09:00',
      type: 'Ordinária',
      status: 'AGENDADA',
      modalidade: 'Virtual',
      attendees: ['mock-member-013', 'mock-member-014', 'mock-member-015'],
      guests: [guests[6], guests[7]]
    },
    {
      id: 'mock-meeting-004',
      council_id: organIds.comissao_inovacao,
      title: 'Avaliação de Projetos de Transformação Digital',
      date: '2025-03-05',
      time: '15:00',
      type: 'Ordinária',
      status: 'AGENDADA',
      modalidade: 'Híbrida',
      location: 'Lab de Inovação',
      attendees: ['mock-member-026', 'mock-member-027', 'mock-member-028', 'mock-member-029'],
      guests: [guests[2], guests[3]]
    },
    {
      id: 'mock-meeting-005',
      council_id: organIds.comissao_sustentabilidade,
      title: 'Roadmap ESG 2025',
      date: '2025-03-10',
      time: '11:00',
      type: 'Ordinária',
      status: 'AGENDADA',
      modalidade: 'Presencial',
      location: 'Sala Verde',
      attendees: ['mock-member-030', 'mock-member-031', 'mock-member-032'],
      guests: [guests[4], guests[5]]
    },
    {
      id: 'mock-meeting-006',
      council_id: organIds.comite_estrategia,
      title: 'Análise de Cenários Macroeconômicos',
      date: '2025-03-15',
      time: '16:00',
      type: 'Extraordinária',
      status: 'AGENDADA',
      modalidade: 'Virtual',
      attendees: ['mock-member-016', 'mock-member-017', 'mock-member-018', 'mock-member-019'],
      guests: [guests[8]]
    }
  ];

  // Associar membros aos órgãos
  organs.forEach(organ => {
    organ.members = members
      .filter(m => m.council_id === organ.id)
      .map(m => ({
        id: m.id,
        council_id: m.council_id,
        name: m.name,
        role: m.role,
        start_date: m.start_date,
        end_date: m.end_date,
        status: m.status,
        user_id: m.user_id,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      }));
  });

  return {
    organs,
    members,
    guests,
    meetings
  };
};
