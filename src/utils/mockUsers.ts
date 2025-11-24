export interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'parceiro' | 'cliente';
  company?: string;
}

export const mockUsers: MockUser[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'cliente@empresa.com',
    password: '123456',
    name: 'Cliente Demo',
    role: 'cliente',
    company: 'Empresa Demo'
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    email: 'parceiro@consultor.com',
    password: 'parceiro123',
    name: 'Parceiro Consultor',
    role: 'parceiro',
    company: 'Consultoria Legacy'
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    email: 'admin@gov.com',
    password: 'admin123',
    name: 'Admin Master',
    role: 'admin',
    company: 'Legacy Governance'
  }
];
