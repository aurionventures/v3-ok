import { UserRole } from './auth';

export interface InvitationData {
  type: 'cliente' | 'parceiro';
  email: string;
  companyName: string;
  invitedBy: string;
  createdAt: number;
  expiresAt: number;
}

export interface InvitationToken {
  token: string;
  url: string;
}

export interface InviteFormData {
  email: string;
  companyName: string;
  type: 'cliente' | 'parceiro';
}
