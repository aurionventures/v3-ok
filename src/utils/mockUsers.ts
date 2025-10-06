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
    id: 'cliente-demo-001',
    email: 'cliente@empresa.com',
    password: '123456',
    name: 'Cliente Demo',
    role: 'cliente',
    company: 'Empresa Demo'
  },
  {
    id: 'parceiro-demo-001',
    email: 'parceiro@consultor.com',
    password: 'parceiro123',
    name: 'Parceiro Consultor',
    role: 'parceiro',
    company: 'Consultoria Legacy'
  },
  {
    id: 'admin-demo-001',
    email: 'admin@gov.com',
    password: 'admin123',
    name: 'Admin Master',
    role: 'admin',
    company: 'Legacy Governance'
  }
];
