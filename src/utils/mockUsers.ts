import { Organization, OrganizationUserRole } from "@/types/organization";
import { getDefaultModules } from "./moduleMatrix";

export interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'parceiro' | 'cliente';
  orgRole?: OrganizationUserRole; // Papel dentro da organização
  company?: string;
  councilMemberships?: string[]; // IDs dos órgãos que participa (para membros)
  organization?: Organization;
}

export const mockUsers: MockUser[] = [
  // Admin do Cliente (Acesso total)
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'cliente@empresa.com',
    password: '123456',
    name: 'Cliente Demo',
    role: 'cliente',
    orgRole: 'org_admin',
    company: 'Empresa Demo',
    organization: {
      id: 'org-demo',
      name: 'Empresa Demo',
      companySize: 'medium',
      plan: 'legacy_360',
      enabledModules: getDefaultModules('medium', 'legacy_360'),
      onboardingCompleted: true
    }
  },
  // Membro/Conselheiro (Portal do Membro)
  {
    id: 'a0000000-0000-0000-0000-000000000010',
    email: 'roberto.alves@empresa.com',
    password: 'membro123',
    name: 'Roberto Alves',
    role: 'cliente',
    orgRole: 'org_member',
    company: 'Empresa Demo',
    councilMemberships: ['conselho-1', 'comite-1'],
    organization: {
      id: 'org-demo',
      name: 'Empresa Demo',
      companySize: 'medium',
      plan: 'legacy_360',
      enabledModules: getDefaultModules('medium', 'legacy_360'),
      onboardingCompleted: true
    }
  },
  // Usuário comum (Acesso limitado)
  {
    id: 'a0000000-0000-0000-0000-000000000011',
    email: 'maria.secretaria@empresa.com',
    password: 'user123',
    name: 'Maria Santos',
    role: 'cliente',
    orgRole: 'org_user',
    company: 'Empresa Demo',
    organization: {
      id: 'org-demo',
      name: 'Empresa Demo',
      companySize: 'medium',
      plan: 'legacy_360',
      enabledModules: getDefaultModules('medium', 'legacy_360'),
      onboardingCompleted: true
    }
  },
  // Parceiro
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    email: 'parceiro@consultor.com',
    password: 'parceiro123',
    name: 'Parceiro Consultor',
    role: 'parceiro',
    company: 'Consultoria Legacy',
    organization: {
      id: 'org-parceiro',
      name: 'Consultoria Legacy',
      companySize: 'large',
      plan: 'legacy_360',
      enabledModules: getDefaultModules('large', 'legacy_360'),
      onboardingCompleted: true
    }
  },
  // Admin Master
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    email: 'admin@gov.com',
    password: 'admin123',
    name: 'Admin Master',
    role: 'admin',
    company: 'Legacy Governance',
    organization: {
      id: 'org-admin',
      name: 'Legacy Governance',
      companySize: 'listed',
      plan: 'legacy_360',
      enabledModules: getDefaultModules('listed', 'legacy_360'),
      onboardingCompleted: true
    }
  }
];

// Mock users da organização para o gerenciamento de usuários
export const mockOrganizationUsers = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'cliente@empresa.com',
    name: 'Cliente Demo',
    orgRole: 'org_admin' as OrganizationUserRole,
    company_id: 'Empresa Demo',
    status: 'active' as const,
    lastLogin: '2024-12-04T14:30:00Z',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'a0000000-0000-0000-0000-000000000011',
    email: 'maria.secretaria@empresa.com',
    name: 'Maria Santos',
    orgRole: 'org_user' as OrganizationUserRole,
    company_id: 'Empresa Demo',
    status: 'active' as const,
    lastLogin: '2024-12-02T09:15:00Z',
    createdAt: '2024-03-10T11:00:00Z'
  },
];
