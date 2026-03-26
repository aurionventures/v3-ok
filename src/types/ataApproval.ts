export type ApprovalStatus = 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'REVISAO_SOLICITADA';
export type SignatureStatus = 'NAO_ASSINADO' | 'ASSINADO';
export type ATAStatus = 'PENDENTE_APROVACAO' | 'EM_APROVACAO' | 'APROVADO' | 'ASSINADO' | null;

export interface ATAApproval {
  id: string;
  meeting_id: string;
  participant_id: string;
  
  // Approval
  approval_status: ApprovalStatus;
  approval_comment: string | null;
  approved_at: string | null;
  
  // Signature
  signature_status: SignatureStatus;
  signature_hash: string | null;
  signature_ip: string | null;
  signature_user_agent: string | null;
  signed_at: string | null;
  
  // Notification
  notification_sent_at: string | null;
  magic_link_token: string | null;
  
  created_at: string;
  updated_at: string;
  
  // Joined data
  participant?: {
    id: string;
    external_name: string | null;
    external_email: string | null;
    role: string;
  };
}

export interface ATAApprovalWithParticipant extends ATAApproval {
  participant: {
    id: string;
    external_name: string | null;
    external_email: string | null;
    role: string;
  };
}

export interface SignatureData {
  hash: string;
  ip: string;
  userAgent: string;
  signedAt: string;
}
