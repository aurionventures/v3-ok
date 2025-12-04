import { Organization } from "@/types/organization";
import { getDefaultModules } from "./moduleMatrix";

export interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'parceiro' | 'cliente';
  company?: string;
  organization?: Organization;
}

export const mockUsers: MockUser[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'cliente@empresa.com',
    password: '123456',
    name: 'Cliente Demo',
    role: 'cliente',
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
