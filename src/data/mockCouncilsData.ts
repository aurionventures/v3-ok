export const mockCouncils = [
  {
    id: 'council-admin-001',
    company_id: 'Legacy Governance',
    name: 'Conselho de Administração',
    type: 'administrativo',
    description: 'Órgão responsável pelas decisões estratégicas e pela orientação geral dos negócios da empresa.',
    quorum: 3,
    status: 'active',
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z'
  },
  {
    id: 'council-consultivo-001',
    company_id: 'Legacy Governance',
    name: 'Conselho Consultivo',
    type: 'consultivo',
    description: 'Órgão consultivo que fornece orientação especializada em áreas específicas do negócio.',
    quorum: 2,
    status: 'active',
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2023-06-01T00:00:00Z'
  }
];

export const mockCouncilMembers = [
  // Conselho de Administração - 6 membros
  {
    id: 'member-001',
    council_id: 'council-admin-001',
    user_id: null,
    name: 'Roberto Almeida Silva',
    role: 'Presidente',
    start_date: '2023-01-15',
    end_date: '2026-01-14',
    status: 'active',
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z'
  },
  {
    id: 'member-002',
    council_id: 'council-admin-001',
    user_id: null,
    name: 'Ana Paula Ferreira',
    role: 'Vice-Presidente',
    start_date: '2023-01-15',
    end_date: '2026-01-14',
    status: 'active',
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z'
  },
  {
    id: 'member-003',
    council_id: 'council-admin-001',
    user_id: null,
    name: 'Dr. Carlos Eduardo Santos',
    role: 'Conselheiro Independente',
    start_date: '2023-03-01',
    end_date: '2026-02-28',
    status: 'active',
    created_at: '2023-03-01T00:00:00Z',
    updated_at: '2023-03-01T00:00:00Z'
  },
  {
    id: 'member-004',
    council_id: 'council-admin-001',
    user_id: null,
    name: 'Mariana Costa Lima',
    role: 'Conselheiro Independente',
    start_date: '2023-03-01',
    end_date: '2026-02-28',
    status: 'active',
    created_at: '2023-03-01T00:00:00Z',
    updated_at: '2023-03-01T00:00:00Z'
  },
  {
    id: 'member-005',
    council_id: 'council-admin-001',
    user_id: null,
    name: 'Fernando Dias Oliveira',
    role: 'Conselheiro',
    start_date: '2024-01-10',
    end_date: '2027-01-09',
    status: 'active',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: 'member-006',
    council_id: 'council-admin-001',
    user_id: null,
    name: 'Juliana Rodrigues Martins',
    role: 'Conselheiro',
    start_date: '2024-01-10',
    end_date: '2027-01-09',
    status: 'active',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  // Conselho Consultivo - 5 membros
  {
    id: 'member-007',
    council_id: 'council-consultivo-001',
    user_id: null,
    name: 'Patricia Mendes Souza',
    role: 'Coordenador',
    start_date: '2023-06-01',
    end_date: '2025-05-31',
    status: 'active',
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2023-06-01T00:00:00Z'
  },
  {
    id: 'member-008',
    council_id: 'council-consultivo-001',
    user_id: null,
    name: 'Ricardo Barbosa Neto',
    role: 'Consultor Financeiro',
    start_date: '2023-06-01',
    end_date: '2025-05-31',
    status: 'active',
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2023-06-01T00:00:00Z'
  },
  {
    id: 'member-009',
    council_id: 'council-consultivo-001',
    user_id: null,
    name: 'Bruno Henrique Cardoso',
    role: 'Consultor de Tecnologia',
    start_date: '2023-08-15',
    end_date: '2025-08-14',
    status: 'active',
    created_at: '2023-08-15T00:00:00Z',
    updated_at: '2023-08-15T00:00:00Z'
  },
  {
    id: 'member-010',
    council_id: 'council-consultivo-001',
    user_id: null,
    name: 'Claudia Regina Alves',
    role: 'Consultor ESG',
    start_date: '2024-02-01',
    end_date: '2026-01-31',
    status: 'active',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z'
  },
  {
    id: 'member-011',
    council_id: 'council-consultivo-001',
    user_id: null,
    name: 'Dr. Marcelo Pereira Costa',
    role: 'Consultor Jurídico',
    start_date: '2024-03-15',
    end_date: '2026-03-14',
    status: 'active',
    created_at: '2024-03-15T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z'
  }
];
