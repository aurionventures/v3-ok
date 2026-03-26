import { InvitationData, InvitationToken } from '@/types/invitation';

const EXPIRATION_DAYS = 7;

export const invitationService = {
  generateToken(data: Omit<InvitationData, 'createdAt' | 'expiresAt'>): InvitationToken {
    const now = Date.now();
    const expiresAt = now + (EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
    
    const invitationData: InvitationData = {
      ...data,
      createdAt: now,
      expiresAt
    };
    
    // Encode to base64
    const token = btoa(JSON.stringify(invitationData));
    // Usar URL fixa para desenvolvimento ou pegar do window.location.origin
    const baseUrl = window.location.origin || 'http://localhost:5173';
    const url = `${baseUrl}/login?invitation=${encodeURIComponent(token)}`;
    
    return { token, url };
  },
  
  decodeToken(token: string): InvitationData | null {
    try {
      const decoded = JSON.parse(atob(decodeURIComponent(token)));
      
      // Check if expired
      if (decoded.expiresAt < Date.now()) {
        return null;
      }
      
      return decoded as InvitationData;
    } catch (error) {
      console.error('Invalid invitation token', error);
      return null;
    }
  },
  
  isExpired(invitation: InvitationData): boolean {
    return invitation.expiresAt < Date.now();
  }
};
