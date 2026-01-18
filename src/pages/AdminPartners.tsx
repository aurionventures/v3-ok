import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePartners, Partner, PartnerFormData } from "@/hooks/usePartners";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { CompanyData } from "@/hooks/useCNPJ";
import { InputCNPJ, InputPhone } from "@/components/ui/input-masked";
import { TIER_OPTIONS, PartnerTier, mapInvitationLevelToTier, TIER_CONFIGS } from "@/config/partnerTiers";
import { 
  Plus, 
  Building2, 
  User, 
  CheckCircle, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Send,
  Handshake,
  Percent,
  Globe,
  Power,
  PowerOff,
  Loader2,
  Link as LinkIcon,
  Copy,
  Check,
  X,
  XCircle,
  Mail,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSignature,
  Users,
  Gift,
  Search,
  RefreshCw,
  MoreVertical,
  ExternalLink,
  Pen
} from "lucide-react";

// Mantido para compatibilidade com filtros existentes
const PARTNER_TYPES = [
  { value: 'revenda', label: 'Revenda' },
  { value: 'consultoria', label: 'Consultoria' },
  { value: 'integrador', label: 'Integrador' },
  { value: 'afiliado', label: 'Afiliado' },
  { value: 'parceiro', label: 'Parceiro' }
];

const AdminPartners = () => {
  const navigate = useNavigate();
  const { partners, loading, createPartner, updatePartnerSettings, updatePartnerStatus, deletePartner, fetchPartners } = usePartners();
  
  const [wizardOpen, setWizardOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set());
  const [affiliateLinkModalOpen, setAffiliateLinkModalOpen] = useState(false);
  const [newPartnerAffiliateLink, setNewPartnerAffiliateLink] = useState<string | null>(null);
  const [newPartnerToken, setNewPartnerToken] = useState<string | null>(null);
  const [partnerCommissions, setPartnerCommissions] = useState<Record<string, { total: number; pending: number }>>({});
  const [loadingCommissions, setLoadingCommissions] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  // Partner Details Modal
  const [partnerDetailsOpen, setPartnerDetailsOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<'partners' | 'invitations'>('partners');

  // Invitations
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteTier, setInviteTier] = useState<PartnerTier>('tier_3_simple');
  const [newInviteUrl, setNewInviteUrl] = useState<string | null>(null);
  const [inviteStatusFilter, setInviteStatusFilter] = useState<string>('all');
  const [selectedInvitation, setSelectedInvitation] = useState<any | null>(null);
  const [invitationDetailsOpen, setInvitationDetailsOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PartnerTier | null>(null);

  // Contracts - removido: redirecionar para /admin/contract-management?tab=partners
  
  // Form state
  const [partnerForm, setPartnerForm] = useState<PartnerFormData>({
    companyName: '',
    cnpj: '',
    type: 'afiliado', // Valor padrão
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    customDomain: '',
    commission: 15,
    commissionService: 0,
    commissionRecurring: 0,
    recurringCommissionMonths: 12
  });

  const resetForm = () => {
    setPartnerForm({
      companyName: '',
      cnpj: '',
      type: 'afiliado', // Valor padrão
      adminName: '',
      adminEmail: '',
      adminPhone: '',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      customDomain: '',
      commission: 15,
      commissionService: 0,
      commissionRecurring: 0,
      recurringCommissionMonths: 12
    });
    setAutoFilledFields(new Set());
  };

  const handleOpenWizard = () => {
    resetForm();
    setWizardOpen(true);
  };

  const handleCreatePartner = async () => {
    setSaving(true);
    try {
    const result = await createPartner(partnerForm);
    
    if (result.success) {
        let affiliateToken = result.affiliateToken;
        
        // Se não tiver token na resposta, buscar do banco
        if (!affiliateToken && result.userId) {
          console.log('🔍 Token não veio na resposta, buscando do banco...');
          await fetchPartners();
          const { data: partnerData, error: fetchError } = await supabase
            .from('partner_settings')
            .select('affiliate_token')
            .eq('user_id', result.userId)
            .single();
          
          if (fetchError) {
            console.error('Erro ao buscar token:', fetchError);
          } else if (partnerData?.affiliate_token) {
            affiliateToken = partnerData.affiliate_token;
            console.log('✅ Token encontrado no banco:', affiliateToken);
          }
        }
        
        if (affiliateToken) {
          const baseUrl = window.location.origin;
          const affiliateLink = `${baseUrl}/plan-discovery?ref=${affiliateToken}`;
          setNewPartnerToken(affiliateToken);
          setNewPartnerAffiliateLink(affiliateLink);
          setWizardOpen(false);
          resetForm();
          setAffiliateLinkModalOpen(true);
          toast.success('Parceiro cadastrado com sucesso!');
        } else {
          // Parceiro criado mas sem token - ainda assim mostrar sucesso
          setWizardOpen(false);
          resetForm();
          toast.success('Parceiro cadastrado com sucesso! O link de afiliado será gerado em breve.');
        }
      } else {
        // Erro já foi mostrado no toast pelo createPartner
        console.error('Erro ao criar parceiro:', result.error);
      }
    } catch (error: any) {
      console.error('Erro inesperado:', error);
      toast.error(error.message || 'Erro inesperado ao criar parceiro');
    } finally {
    setSaving(false);
    }
  };


  const handleToggleStatus = async (partner: Partner) => {
    const newStatus = partner.settings?.status === 'active' ? 'suspended' : 'active';
    await updatePartnerStatus(partner.id, newStatus);
    toast.success(newStatus === 'active' ? 'Parceiro ativado!' : 'Parceiro inativado!');
  };

  const handleDeletePartner = async (partner: Partner) => {
    if (confirm(`Remover parceiro ${partner.settings?.company_name || partner.company}?`)) {
      await deletePartner(partner.id);
    }
  };

  const getAffiliateLink = (partner: Partner) => {
    const token = partner.settings?.affiliate_token;
    if (!token) return null;
    const baseUrl = window.location.origin;
    return `${baseUrl}/plan-discovery?ref=${token}`;
  };

  const handleCopyAffiliateLink = (partner: Partner) => {
    const link = getAffiliateLink(partner);
    if (link) {
      navigator.clipboard.writeText(link);
      setCopiedToken(partner.id);
      toast.success("Link de afiliado copiado!");
      setTimeout(() => setCopiedToken(null), 2000);
    }
  };

  // Handler para auto-preenchimento via CNPJ
  const handleCNPJLoaded = (company: CompanyData) => {
    const filledFields = new Set<string>();
    
    // Preencher CNPJ formatado
    if (company.cnpj) {
      filledFields.add('cnpj');
    }
    
    // Preencher dados da empresa
    if (company.razaoSocial) {
      filledFields.add('companyName');
    }

    // Atualizar o formulário com os dados da empresa
    setPartnerForm(prev => ({
      ...prev,
      cnpj: company.cnpj || prev.cnpj,
      companyName: company.razaoSocial || prev.companyName || '',
    }));

    // Atualizar os campos auto-preenchidos
    setAutoFilledFields(filledFields);
    
    if (company.razaoSocial) {
      toast.success('Dados da empresa carregados automaticamente! Você pode revisar e editar se necessário.');
    } else {
      toast.warning('CNPJ encontrado, mas alguns dados não puderam ser preenchidos automaticamente.');
    }
  };

  const handleResendAffiliateLink = async (partner: Partner) => {
    const link = getAffiliateLink(partner);
    if (!link || !partner.settings?.affiliate_token) {
      toast.error("Link de afiliado não disponível");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-affiliate-link', {
        body: {
          partner_email: partner.email,
          partner_name: partner.name,
          company_name: partner.settings.company_name || partner.company || '',
          affiliate_token: partner.settings.affiliate_token,
          affiliate_link: link,
        },
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(`Link de afiliado enviado por email para ${partner.email}`);
      } else {
        toast.error(data?.message || 'Erro ao enviar email');
      }
    } catch (error: any) {
      console.error('Erro ao reenviar link:', error);
      toast.error(error.message || 'Erro ao enviar link por email');
    }
  };

  const getStatusBadge = (status?: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      active: { label: 'Ativo', className: 'bg-emerald-500' },
      pending: { label: 'Pendente', className: 'bg-amber-500 text-white' },
      suspended: { label: 'Inativo', className: 'bg-red-500/20 text-red-400 border-red-500/30' }
    };
    const config = statusConfig[status || 'pending'] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPartnerTypeLabel = (type?: string) => {
    return PARTNER_TYPES.find(t => t.value === type)?.label || type || 'Consultoria';
  };

  const getValidationErrors = () => {
    const errors: string[] = [];
    if (!partnerForm.companyName || partnerForm.companyName.trim().length === 0) {
      errors.push('Nome / Razão Social');
    }
    const phoneCleaned = partnerForm.adminPhone?.replace(/\D/g, '') || '';
    if (!partnerForm.adminPhone || phoneCleaned.length < 10) {
      errors.push('WhatsApp');
    }
    if (!partnerForm.adminEmail || partnerForm.adminEmail.trim().length === 0 || !partnerForm.adminEmail.includes('@')) {
      errors.push('Email');
    }
    if (!partnerForm.type || partnerForm.type.trim().length === 0) {
      errors.push('Tipo');
    }
    // Comissões são opcionais, não precisam ser validadas
    return errors;
  };

  const canCreate = () => {
    return getValidationErrors().length === 0;
  };

  // Buscar comissões dos parceiros
  useEffect(() => {
    const fetchCommissions = async () => {
      if (partners.length === 0) {
        setLoadingCommissions(false);
        return;
      }

      // Se for o parceiro demo (mockado), usar dados mockados de comissões
      const demoPartner = partners.find(p => p.email === 'parceiro@legacy.com');
      if (demoPartner && partners.length === 1) {
        const mockCommissions: Record<string, { total: number; pending: number }> = {
          'demo-partner-id-1': {
            total: 400.00, // R$ 150 (confirmed) + R$ 250 (paid)
            pending: 150.00 // R$ 150 (confirmed, não paga ainda)
          }
        };
        setPartnerCommissions(mockCommissions);
        setLoadingCommissions(false);
        return;
      }

      try {
        setLoadingCommissions(true);
        const partnerIds = partners.map(p => p.id);
        const { data, error } = await supabase
          .from('v_partner_commissions_summary')
          .select('partner_id, total_commission_pending, total_commission_paid')
          .in('partner_id', partnerIds);

        if (error) throw error;

        const commissionsMap: Record<string, { total: number; pending: number }> = {};
        (data || []).forEach((row: any) => {
          commissionsMap[row.partner_id] = {
            total: Number(row.total_commission_pending || 0),
            pending: Number(row.total_commission_pending || 0) - Number(row.total_commission_paid || 0),
          };
        });

        setPartnerCommissions(commissionsMap);
      } catch (error: any) {
        console.error('Erro ao buscar comissões:', error);
      } finally {
        setLoadingCommissions(false);
      }
    };

    fetchCommissions();
  }, [partners]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Mock invitations data
  const getMockInvitations = () => {
    const now = new Date();
    return [
      {
        id: 'inv-001',
        invitation_token: 'abc123def456',
        invitation_level: 'afiliado_basico',
        status: 'submitted',
        name: 'João Silva',
        email: 'joao.silva@empresa.com.br',
        company_name: 'Tech Solutions Ltda',
        cnpj: '12.345.678/0001-90',
        phone: '(11) 98765-4321',
        created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        submitted_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'inv-002',
        invitation_token: 'xyz789ghi012',
        invitation_level: 'afiliado_avancado',
        status: 'approved',
        name: 'Maria Santos',
        email: 'maria.santos@consultoria.com.br',
        company_name: 'Consultoria Avançada S.A.',
        cnpj: '98.765.432/0001-10',
        phone: '(21) 91234-5678',
        created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        submitted_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        approved_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        used_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'inv-003',
        invitation_token: 'mno345pqr678',
        invitation_level: 'parceiro',
        status: 'pending',
        name: null,
        email: null,
        company_name: null,
        cnpj: null,
        phone: null,
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'inv-004',
        invitation_token: 'stu901vwx234',
        invitation_level: 'afiliado_basico',
        status: 'rejected',
        name: 'Carlos Oliveira',
        email: 'carlos.oliveira@startup.com.br',
        company_name: 'Startup Inovadora',
        cnpj: '11.222.333/0001-44',
        phone: '(11) 99876-5432',
        created_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        submitted_at: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        rejection_reason: 'Não atende aos critérios mínimos',
        approved_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'inv-005',
        invitation_token: 'yza567bcd890',
        invitation_level: 'afiliado_avancado',
        status: 'expired',
        name: null,
        email: null,
        company_name: null,
        cnpj: null,
        phone: null,
        created_at: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  };

  // Load invitations
  const loadInvitations = async () => {
    setLoadingInvitations(true);
    try {
      const { data, error } = await supabase
        .from('partner_invitations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Se não houver dados ou houver erro, usar dados mockados
      if (!data || data.length === 0) {
        setInvitations(getMockInvitations());
      } else {
        setInvitations(data);
      }
    } catch (error: any) {
      console.error('Erro ao carregar convites, usando dados mockados:', error);
      // Usar dados mockados em caso de erro
      setInvitations(getMockInvitations());
    } finally {
      setLoadingInvitations(false);
    }
  };

  // Mock contracts data
  const getMockContracts = () => {
    const now = new Date();
    return [
      {
        id: 'pc-001',
        contract_number: 'PC-2026-0001',
        partner_user_id: 'user-001',
        partner_name: 'Maria Santos',
        partner_email: 'maria.santos@consultoria.com.br',
        partner_company_name: 'Consultoria Avançada S.A.',
        contract_level: 'afiliado_avancado',
        contract_type: 'affiliate_agreement',
        status: 'counter_signed',
        commission_setup: 15,
        commission_recurring: 10,
        recurring_commission_months: 12,
        start_date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date(now.getTime() + 335 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        duration_months: 12,
        auto_renew: true,
        partner_signed_at: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        legacy_signed_at: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'pc-002',
        contract_number: 'PC-2026-0002',
        partner_user_id: 'user-002',
        partner_name: 'João Silva',
        partner_email: 'joao.silva@empresa.com.br',
        partner_company_name: 'Tech Solutions Ltda',
        contract_level: 'afiliado_basico',
        contract_type: 'affiliate_agreement',
        status: 'pending_signature',
        commission_setup: 10,
        commission_recurring: 5,
        recurring_commission_months: 12,
        start_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date(now.getTime() + 372 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        duration_months: 12,
        auto_renew: true,
        partner_signature_token: 'sig-token-abc123',
        partner_signature_token_expires_at: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'pc-003',
        contract_number: 'PC-2026-0003',
        partner_user_id: 'user-003',
        partner_name: 'Ana Paula',
        partner_email: 'ana.paula@parceiro.com.br',
        partner_company_name: 'Parceiro Estratégico S.A.',
        contract_level: 'parceiro',
        contract_type: 'partner_agreement',
        status: 'partner_signed',
        commission_setup: 20,
        commission_recurring: 15,
        recurring_commission_months: 12,
        start_date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date(now.getTime() + 355 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        duration_months: 12,
        auto_renew: true,
        partner_signed_at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'pc-004',
        contract_number: 'PC-2025-0045',
        partner_user_id: 'user-004',
        partner_name: 'Roberto Costa',
        partner_email: 'roberto.costa@integrador.com.br',
        partner_company_name: 'Integrador Tech Ltda',
        contract_level: 'afiliado_avancado',
        contract_type: 'affiliate_agreement',
        status: 'expired',
        commission_setup: 15,
        commission_recurring: 10,
        recurring_commission_months: 12,
        start_date: new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        duration_months: 12,
        auto_renew: false,
        partner_signed_at: new Date(now.getTime() - 398 * 24 * 60 * 60 * 1000).toISOString(),
        legacy_signed_at: new Date(now.getTime() - 397 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'pc-005',
        contract_number: 'PC-2026-0004',
        partner_user_id: 'user-005',
        partner_name: 'Fernanda Lima',
        partner_email: 'fernanda.lima@afiliado.com.br',
        partner_company_name: 'Afiliado Premium',
        contract_level: 'afiliado_basico',
        contract_type: 'affiliate_agreement',
        status: 'draft',
        commission_setup: 10,
        commission_recurring: 5,
        recurring_commission_months: 12,
        start_date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date(now.getTime() + 379 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        duration_months: 12,
        auto_renew: true,
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  };

  // Contratos agora são gerenciados em /admin/contract-management?tab=partners

  // Generate invite
  const handleGenerateInvite = async () => {
    try {
      console.log('🔍 Gerando convite com tier:', inviteTier);
      console.log('🔍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      
      if (!inviteTier) {
        toast.error('Por favor, selecione um Tier');
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-partner-invite', {
        body: {
          invitation_level: inviteTier,
          expires_in_days: 30
        }
      });

      console.log('📥 Resposta da Edge Function:', { data, error });

      if (error) {
        console.error('❌ Erro na Edge Function:', error);
        
        // Mensagens mais específicas baseadas no tipo de erro
        let errorMessage = 'Erro ao gerar convite';
        if (error.message?.includes('Failed to send')) {
          errorMessage = 'Erro de conexão. Verifique se a Edge Function está deployada no Supabase.';
        } else if (error.message?.includes('Function not found')) {
          errorMessage = 'Edge Function não encontrada. Verifique se está deployada.';
        } else {
          errorMessage = error.message || error.error || 'Erro desconhecido';
        }
        
        toast.error(errorMessage);
        return;
      }

      // Verificar se data tem success e invitation
      if (data?.success && data?.invitation?.url) {
        console.log('✅ Convite gerado com sucesso:', data.invitation.url);
        setNewInviteUrl(data.invitation.url);
        setInviteDialogOpen(false);
        toast.success('Link de convite gerado com sucesso!');
        loadInvitations();
      } else if (data?.error) {
        console.error('❌ Erro na resposta:', data.error);
        toast.error('Erro: ' + data.error);
      } else {
        console.error('⚠️ Resposta inválida da Edge Function:', data);
        toast.error('Erro: Resposta inválida do servidor');
      }
    } catch (err: any) {
      console.error('❌ Erro ao gerar convite (catch):', err);
      console.error('❌ Stack trace:', err.stack);
      
      let errorMessage = 'Erro de conexão';
      if (err.message?.includes('Failed to send')) {
        errorMessage = 'Não foi possível conectar à Edge Function. Verifique:\n1. Se a função está deployada\n2. Sua conexão com a internet\n3. As configurações do Supabase';
      } else {
        errorMessage = err.message || err.toString() || 'Erro desconhecido';
      }
      
      toast.error('Erro ao gerar convite: ' + errorMessage);
    }
  };

  // Approve invitation
  const handleApproveInvitation = async (invitationId: string) => {
    try {
      const invitation = invitations.find(inv => inv.id === invitationId);
      if (!invitation || invitation.status !== 'submitted') {
        toast.error('Convite não pode ser aprovado');
        return;
      }

      // Mapear nível para tipo (fallback)
      const levelToType: Record<string, string> = {
        'afiliado_basico': 'afiliado',
        'afiliado_avancado': 'afiliado',
        'parceiro': 'parceiro'
      };

      // Usar partner_type do formulário se disponível, senão usar mapeamento
      const partnerType = invitation.partner_type || 
                         invitation.form_data?.partner_type || 
                         levelToType[invitation.invitation_level] || 
                         'afiliado';

      const defaultCommission: Record<string, number> = {
        'afiliado_basico': 10,
        'afiliado_avancado': 15,
        'parceiro': 20
      };

      // Determinar Tier: usar selecionado, ou mapear do nível, ou padrão tier_3_simple
      const partnerTier: PartnerTier = selectedTier || 
                                       mapInvitationLevelToTier(invitation.invitation_level) || 
                                       'tier_3_simple';

      // Criar parceiro usando a função existente
      const partnerForm: PartnerFormData = {
        companyName: invitation.company_name || invitation.form_data?.company_name || '',
        cnpj: invitation.cnpj || invitation.form_data?.cnpj || '',
        type: partnerType, // USAR partner_type DO FORMULÁRIO
        adminName: invitation.name || invitation.form_data?.name || '',
        adminEmail: invitation.email || invitation.form_data?.email || '',
        adminPhone: invitation.phone || invitation.form_data?.phone || '',
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        customDomain: '',
        commission: defaultCommission[invitation.invitation_level] || 10,
        commissionService: 0,
        commissionRecurring: 0,
        recurringCommissionMonths: 12
      };

      const result = await createPartner(partnerForm);

      if (result.success) {
        // Atualizar partner_settings com o Tier selecionado
        const { error: tierError } = await supabase
          .from('partner_settings')
          .update({ partner_tier: partnerTier })
          .eq('user_id', result.userId);

        if (tierError) {
          console.error('Erro ao atualizar Tier:', tierError);
        }

        // Atualizar status do convite
        const { data: userData } = await supabase.auth.getUser();
        
        const { error: updateError } = await supabase
          .from('partner_invitations')
          .update({
            status: 'approved',
            approved_by: userData.data.user?.id,
            approved_at: new Date().toISOString(),
            partner_user_id: result.userId,
            used_at: new Date().toISOString()
          })
          .eq('id', invitationId);

        if (!updateError) {
          toast.success('Parceiro aprovado e criado com sucesso!');
          loadInvitations();
          fetchPartners(); // Recarregar lista de parceiros
          setSelectedTier(null); // Resetar seleção de Tier
          
          // Criar contrato automaticamente
          await handleCreateContractForInvitation(invitationId, result.userId, partnerTier);
        } else {
          toast.error('Erro ao atualizar convite');
        }
      } else {
        toast.error('Erro ao criar parceiro: ' + result.error);
      }
    } catch (err: any) {
      console.error('Erro ao aprovar convite:', err);
      toast.error('Erro ao aprovar convite');
    }
  };

  // Create contract for approved invitation
  const handleCreateContractForInvitation = async (invitationId: string, partnerUserId: string, partnerTier?: PartnerTier) => {
    try {
      const invitation = invitations.find(inv => inv.id === invitationId);
      if (!invitation) return;

      // Valores padrão por nível
      const commissionSetup: Record<string, number> = {
        'afiliado_basico': 10,
        'afiliado_avancado': 15,
        'parceiro': 20
      };

      const commissionRecurring: Record<string, number> = {
        'afiliado_basico': 5,
        'afiliado_avancado': 10,
        'parceiro': 15
      };

      const { data, error } = await supabase.functions.invoke('create-partner-contract', {
        body: {
          partner_user_id: partnerUserId,
          partner_invitation_id: invitationId,
          commission_setup: commissionSetup[invitation.invitation_level] || 10,
          commission_recurring: commissionRecurring[invitation.invitation_level] || 5,
          recurring_commission_months: 12,
          start_date: new Date().toISOString().split('T')[0],
          duration_months: 12,
          auto_renew: true
        }
      });

      if (error) {
        console.error('Erro ao criar contrato:', error);
        return;
      }

      toast.success('Contrato criado com sucesso!');
      // Contratos agora são gerenciados em /admin/contract-management?tab=partners
    } catch (err: any) {
      console.error('Erro ao criar contrato:', err);
    }
  };

  // Reject invitation
  const handleRejectInvitation = async (invitationId: string, reason?: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('partner_invitations')
        .update({
          status: 'rejected',
          rejection_reason: reason || 'Rejeitado pelo Super ADM',
          approved_by: userData.data.user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', invitationId);

      if (!error) {
        toast.success('Convite rejeitado');
        loadInvitations();
      } else {
        toast.error('Erro ao rejeitar convite');
      }
    } catch (err) {
      console.error('Erro ao rejeitar convite:', err);
      toast.error('Erro ao rejeitar convite');
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'invitations') {
      loadInvitations();
    }
    // Contratos agora estão em /admin/contract-management?tab=partners
  }, [activeTab]);

  const stats = {
    total: partners.length,
    active: partners.filter(p => p.settings?.status === 'active').length,
    pending: partners.filter(p => p.settings?.status === 'pending').length,
    avgCommission: partners.length > 0 
      ? Math.round(partners.reduce((acc, p) => acc + (p.settings?.commission || 15), 0) / partners.length)
      : 0,
    invitationsPending: invitations.filter(inv => inv.status === 'submitted').length
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Gestão de Parceiros" />
        <main className="flex-1 p-6 space-y-6">
          {/* Ações rápidas */}
          <div className="flex items-center justify-end flex-wrap gap-4">
            <div className="flex gap-2">
              {activeTab === 'invitations' && (
                <Button onClick={() => setInviteDialogOpen(true)} variant="outline" className="gap-2">
                  <Gift className="h-4 w-4" />
                  Gerar Convite
                </Button>
              )}
              {activeTab === 'partners' && (
            <Button onClick={handleOpenWizard} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Parceiro
            </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Parceiros</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold">{stats.total}</p>
                    )}
                  </div>
                  <Handshake className="h-8 w-8 text-muted-foreground/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ativos</p>
                    {loading ? (
                      <Skeleton className="h-8 w-12 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
                    )}
                  </div>
                  <CheckCircle className="h-8 w-8 text-emerald-500/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pendentes</p>
                    {loading ? (
                      <Skeleton className="h-8 w-12 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                    )}
                  </div>
                  <Building2 className="h-8 w-8 text-amber-500/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Comissão Média</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold">{stats.avgCommission}%</p>
                    )}
                  </div>
                  <Percent className="h-8 w-8 text-muted-foreground/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Convites Pendentes</p>
                    {loadingInvitations ? (
                      <Skeleton className="h-8 w-12 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold text-blue-600">{stats.invitationsPending}</p>
                    )}
                  </div>
                  <Gift className="h-8 w-8 text-blue-500/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Contratos Pendentes</p>
                    <p className="text-2xl font-bold text-purple-600">0</p>
                  </div>
                  <FileSignature className="h-8 w-8 text-purple-500/30" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="partners">Parceiros</TabsTrigger>
              <TabsTrigger value="invitations">
                Convites
                {stats.invitationsPending > 0 && (
                  <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                    {stats.invitationsPending}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Tab: Parceiros */}
            <TabsContent value="partners" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
              <CardTitle>Parceiros Cadastrados</CardTitle>
              <CardDescription>Lista de todos os parceiros da plataforma</CardDescription>
                </div>
                <div className="w-full sm:w-auto">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      {PARTNER_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : partners.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Handshake className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Nenhum parceiro cadastrado</p>
                  <Button onClick={handleOpenWizard} variant="outline" className="mt-4 gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar primeiro parceiro
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[70px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners
                      .filter(partner => typeFilter === 'all' || partner.settings?.partner_type === typeFilter)
                      .map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{partner.settings?.company_name || partner.company}</p>
                            {partner.settings?.cnpj && (
                              <p className="text-sm text-muted-foreground">{partner.settings.cnpj}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{getPartnerTypeLabel(partner.settings?.partner_type)}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(partner.settings?.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                className="gap-2"
                                onClick={() => {
                                  setSelectedPartner(partner);
                                  setPartnerDetailsOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              {partner.settings?.affiliate_token && (
                                <DropdownMenuItem 
                                  className="gap-2"
                                  onClick={() => handleCopyAffiliateLink(partner)}
                                >
                                  <Copy className="h-4 w-4" />
                                  Copiar Link de Afiliado
                                </DropdownMenuItem>
                              )}
                              {partner.settings?.status === 'active' ? (
                                <DropdownMenuItem 
                                  className="gap-2 text-amber-600"
                                  onClick={() => handleToggleStatus(partner)}
                                >
                                  <PowerOff className="h-4 w-4" />
                                  Inativar
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  className="gap-2 text-emerald-600"
                                  onClick={() => handleToggleStatus(partner)}
                                >
                                  <Power className="h-4 w-4" />
                                  Ativar
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                className="gap-2 text-destructive"
                                onClick={() => handleDeletePartner(partner)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Remover
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
            </TabsContent>

            {/* Tab: Convites */}
            <TabsContent value="invitations" className="space-y-6 mt-6">
              {/* Métricas de Convites */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{invitations.length}</p>
                    <p className="text-xs text-muted-foreground">Total Enviados</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-amber-500">
                      {invitations.filter(inv => inv.status === 'pending' || inv.status === 'submitted').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Pendentes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-500">
                      {invitations.filter(inv => inv.status === 'approved' || inv.status === 'used').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Aprovados</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-red-500">
                      {invitations.filter(inv => inv.status === 'rejected').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Rejeitados</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">
                      {invitations.length > 0 
                        ? Math.round((invitations.filter(inv => inv.status === 'approved' || inv.status === 'used').length / invitations.length) * 100)
                        : 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">Taxa de Conversão</p>
                  </CardContent>
                </Card>
      </div>

              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Convites de Parceiros</CardTitle>
                      <CardDescription>Gerencie convites para novos parceiros se cadastrarem</CardDescription>
              </div>
                    <div className="w-full sm:w-auto flex gap-2">
                      <Select value={inviteStatusFilter} onValueChange={setInviteStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Filtrar por status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="pending">Pendentes</SelectItem>
                          <SelectItem value="submitted">Aguardando Aprovação</SelectItem>
                          <SelectItem value="approved">Aprovados</SelectItem>
                          <SelectItem value="rejected">Rejeitados</SelectItem>
                          <SelectItem value="expired">Expirados</SelectItem>
                        </SelectContent>
                      </Select>
            </div>
              </div>
                </CardHeader>
                <CardContent>
                  {loadingInvitations ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
            </div>
                  ) : invitations.filter(inv => inviteStatusFilter === 'all' || inv.status === inviteStatusFilter).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Gift className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>Nenhum convite encontrado</p>
                      <Button onClick={() => setInviteDialogOpen(true)} variant="outline" className="mt-4 gap-2">
                        <Gift className="h-4 w-4" />
                        Gerar Primeiro Convite
                      </Button>
            </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nível</TableHead>
                          <TableHead>Nome/Email</TableHead>
                          <TableHead>Empresa</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invitations
                          .filter(inv => inviteStatusFilter === 'all' || inv.status === inviteStatusFilter)
                          .map((invitation) => {
                            const getLevelLabel = (level: string) => {
                              const levels: Record<string, string> = {
                                'afiliado_basico': 'Afiliado Básico (N1)',
                                'afiliado_avancado': 'Afiliado Avançado (N2)',
                                'parceiro': 'Parceiro Estratégico (N3)',
                              };
                              return levels[level] || level;
                            };

                            const getInvitationStatusBadge = (status: string) => {
                              const configs: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
                                'pending': { label: 'Pendente', variant: 'outline' },
                                'submitted': { label: 'Aguardando Aprovação', variant: 'secondary' },
                                'approved': { label: 'Aprovado', variant: 'default' },
                                'rejected': { label: 'Rejeitado', variant: 'destructive' },
                                'expired': { label: 'Expirado', variant: 'outline' },
                                'used': { label: 'Usado', variant: 'default' },
                              };
                              const config = configs[status] || configs.pending;
                              return <Badge variant={config.variant}>{config.label}</Badge>;
                            };

                            return (
                              <TableRow key={invitation.id}>
                                <TableCell>
                                  <Badge variant="outline">{getLevelLabel(invitation.invitation_level)}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{invitation.name || '-'}</p>
                                    {invitation.email && (
                                      <p className="text-sm text-muted-foreground">{invitation.email}</p>
                                    )}
                </div>
                                </TableCell>
                                <TableCell>
                                  {invitation.company_name || '-'}
                                </TableCell>
                                <TableCell>
                                  {getInvitationStatusBadge(invitation.status)}
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    {invitation.created_at && (
                                      <div>{format(new Date(invitation.created_at), "dd/MM/yyyy", { locale: ptBR })}</div>
                                    )}
                                    {invitation.expires_at && (
                                      <div className="text-muted-foreground text-xs">
                                        Exp: {format(new Date(invitation.expires_at), "dd/MM/yyyy", { locale: ptBR })}
                </div>
                                    )}
              </div>
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        className="gap-2"
                                        onClick={() => {
                                          setSelectedInvitation(invitation);
                                          setInvitationDetailsOpen(true);
                                        }}
                                      >
                                        <Eye className="h-4 w-4" />
                                        Ver Detalhes
                                      </DropdownMenuItem>
                                      {invitation.status === 'submitted' && (
                                        <>
                                          <DropdownMenuItem
                                            className="gap-2 text-emerald-600"
                                            onClick={() => handleApproveInvitation(invitation.id)}
                                          >
                                            <CheckCircle2 className="h-4 w-4" />
                                            Aprovar
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            className="gap-2 text-destructive"
                                            onClick={() => handleRejectInvitation(invitation.id)}
                                          >
                                            <XCircle className="h-4 w-4" />
                                            Rejeitar
                                          </DropdownMenuItem>
                                        </>
                                      )}
                                      {invitation.status === 'pending' && invitation.invitation_token && (
                                        <DropdownMenuItem
                                          className="gap-2"
                                          onClick={() => {
                                            const baseUrl = window.location.origin;
                                            const inviteUrl = `${baseUrl}/parceiros/cadastro?token=${invitation.invitation_token}`;
                                            navigator.clipboard.writeText(inviteUrl);
                                            toast.success('Link do convite copiado!');
                                          }}
                                        >
                                          <Copy className="h-4 w-4" />
                                          Copiar Link
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Contratos - Redireciona para Gestão de Contratos */}
            <TabsContent value="contracts" className="space-y-6 mt-6">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-8 text-center">
                  <FileSignature className="h-16 w-16 mx-auto mb-4 text-primary opacity-80" />
                  <h3 className="text-xl font-semibold mb-2">Contratos de Parceiros</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Os contratos de parceiros agora são gerenciados na seção "Contratos" do Super ADM,
                    separados entre contratos de clientes e contratos de parceiros.
                  </p>
                  <Button 
                    onClick={() => navigate('/admin/contract-management?tab=partners')}
                    className="gap-2"
                  >
                    <FileSignature className="h-4 w-4" />
                    Abrir Gestão de Contratos (Aba Parceiros)
            </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>


      {/* Partner Registration Dialog */}
      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Novo Parceiro</DialogTitle>
            <DialogDescription>
              Cadastre um novo parceiro na plataforma
            </DialogDescription>
          </DialogHeader>

          {/* Compact Form */}
          <div className="space-y-4 py-4">
            {/* CNPJ com auto-complete */}
            <div className="space-y-2">
              <InputCNPJ
                id="cnpj"
                label="CNPJ"
                value={partnerForm.cnpj}
                onChange={(value, company) => {
                  const cnpjCleaned = value?.replace(/\D/g, '') || '';
                  
                  // Se os dados da empresa foram carregados via onChange, preencher automaticamente
                  if (company && company.razaoSocial) {
                    const filledFields = new Set<string>(['cnpj', 'companyName']);
                    setAutoFilledFields(filledFields);
                    setPartnerForm(prev => ({
                      ...prev,
                      cnpj: value,
                      companyName: company.razaoSocial,
                    }));
                  } else {
                    if (!value || cnpjCleaned.length === 0) {
                      setAutoFilledFields(new Set());
                      setPartnerForm(prev => ({
                        ...prev,
                        cnpj: value,
                        companyName: '',
                      }));
                    } else {
                      setPartnerForm(prev => ({
                        ...prev,
                        cnpj: value,
                      }));
                    }
                  }
                }}
                onCompanyLoaded={handleCNPJLoaded}
                autoFetch={true}
                showSearchButton={true}
                showCompanyPreview={false}
                inputClassName={autoFilledFields.has('cnpj') ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-900' : ''}
              />
                  </div>
                  
            {/* Nome / Razão Social */}
                  <div className="space-y-2">
              <Label htmlFor="companyName">Nome / Razão Social *</Label>
                    <Input
                      id="companyName"
                placeholder="Nome do parceiro"
                      value={partnerForm.companyName}
                      onChange={(e) => setPartnerForm({ ...partnerForm, companyName: e.target.value })}
                className={autoFilledFields.has('companyName') ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-900' : ''}
                    />
                  </div>
                  
            {/* WhatsApp */}
                  <div className="space-y-2">
              <InputPhone
                id="adminPhone"
                label="WhatsApp *"
                value={partnerForm.adminPhone}
                onChange={(value) => setPartnerForm({ ...partnerForm, adminPhone: value })}
                required
                placeholder="(11) 99999-9999"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email *</Label>
                    <Input
                id="adminEmail"
                type="email"
                placeholder="email@empresa.com"
                value={partnerForm.adminEmail}
                onChange={(e) => setPartnerForm({ ...partnerForm, adminEmail: e.target.value })}
                    />
                  </div>
                  
            {/* Tipo de Parceria - Tiers */}
                  <div className="space-y-2">
              <Label htmlFor="type">Tier *</Label>
                    <Select
                      value={partnerForm.type}
                      onValueChange={(value) => setPartnerForm({ ...partnerForm, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o Tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIER_OPTIONS.map((tier) => (
                          <SelectItem key={tier.value} value={tier.value}>
                            {tier.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {partnerForm.type && TIER_CONFIGS[partnerForm.type as PartnerTier]?.tier_description}
                    </p>
                </div>

            {/* Comissões em 3 colunas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Comissão Serviço */}
                  <div className="space-y-2">
                <Label htmlFor="commissionService">Comissão Serviço (%)</Label>
                    <Input
                  id="commissionService"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={partnerForm.commissionService || ''}
                  onChange={(e) => setPartnerForm({ ...partnerForm, commissionService: e.target.value ? Number(e.target.value) : 0 })}
                  placeholder="0"
                    />
                  </div>
                  
              {/* Comissão Recorrência */}
                  <div className="space-y-2">
                <Label htmlFor="commissionRecurring">Comissão Recorrência (%)</Label>
                    <Input
                  id="commissionRecurring"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={partnerForm.commissionRecurring || ''}
                  onChange={(e) => setPartnerForm({ ...partnerForm, commissionRecurring: e.target.value ? Number(e.target.value) : 0 })}
                  placeholder="0"
                    />
                  </div>
                  
              {/* Período de Comissão SaaS */}
                  <div className="space-y-2">
                <Label htmlFor="recurringCommissionMonths">Período de Comissão SaaS</Label>
                <Select
                  value={partnerForm.recurringCommissionMonths.toString()}
                  onValueChange={(value) => setPartnerForm({ ...partnerForm, recurringCommissionMonths: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 meses</SelectItem>
                    <SelectItem value="6">6 meses</SelectItem>
                    <SelectItem value="12">12 meses</SelectItem>
                    <SelectItem value="18">18 meses</SelectItem>
                    <SelectItem value="24">24 meses</SelectItem>
                    <SelectItem value="36">36 meses</SelectItem>
                  </SelectContent>
                </Select>
                  </div>
                </div>
            <p className="text-xs text-muted-foreground">
              Após este período, o parceiro não recebe mais comissão de recorrência
            </p>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value="active"
                onValueChange={(value) => {
                  // Status é sempre ativo ao criar
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="suspended">Inativo</SelectItem>
                </SelectContent>
              </Select>
              </div>
            </div>

          <DialogFooter className="flex justify-between gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setWizardOpen(false)}>
              Cancelar
            </Button>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleCreatePartner}
                disabled={saving || !canCreate()}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar Parceiro'
                )}
              </Button>
              {!canCreate() && getValidationErrors().length > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Preencha os seguintes campos obrigatórios: {getValidationErrors().join(', ')}
                </p>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Partner Details Dialog */}
      <Dialog open={partnerDetailsOpen} onOpenChange={setPartnerDetailsOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Handshake className="h-5 w-5 text-primary" />
              Detalhes do Parceiro
            </DialogTitle>
          </DialogHeader>

          {selectedPartner && (
            <div className="space-y-4 py-2">
              {/* Dados Cadastrais */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Dados Cadastrais</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Nome / Razão Social:</span>
                    <span className="font-medium text-right">{selectedPartner.settings?.company_name || selectedPartner.company}</span>
                  </div>
                  {selectedPartner.settings?.cnpj && (
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">CNPJ:</span>
                      <span className="text-right">{selectedPartner.settings.cnpj}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Tipo:</span>
                    <Badge variant="outline">{getPartnerTypeLabel(selectedPartner.settings?.partner_type)}</Badge>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">WhatsApp:</span>
                    <span className="text-right">{selectedPartner.settings?.admin_phone || selectedPartner.phone || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="text-right">{selectedPartner.email}</span>
                  </div>
                </div>
              </div>

              {/* Link de Afiliado */}
              {selectedPartner.settings?.affiliate_token && (
                <div className="space-y-3 pt-2 border-t">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Link de Afiliado
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Token</Label>
                    <div className="flex gap-2">
                      <Input
                          value={selectedPartner.settings.affiliate_token}
                          readOnly
                          className="font-mono text-xs h-9"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedPartner.settings!.affiliate_token!);
                            setCopiedToken(selectedPartner.id);
                            toast.success("Token copiado!");
                            setTimeout(() => setCopiedToken(null), 2000);
                          }}
                        >
                          {copiedToken === selectedPartner.id ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                    </div>
                  </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Link Completo</Label>
                    <div className="flex gap-2">
                      <Input
                          value={getAffiliateLink(selectedPartner) || ''}
                          readOnly
                          className="font-mono text-xs h-9"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => handleCopyAffiliateLink(selectedPartner)}
                        >
                          {copiedToken === selectedPartner.id ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                    </div>
                  </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 h-9"
                        onClick={() => handleCopyAffiliateLink(selectedPartner)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copiar Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 h-9"
                        onClick={() => handleResendAffiliateLink(selectedPartner)}
                      >
                        <Send className="h-3.5 w-3.5" />
                        Reenviar
                      </Button>
                </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setPartnerDetailsOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Link de Afiliado */}
      <Dialog open={affiliateLinkModalOpen} onOpenChange={setAffiliateLinkModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-primary" />
              Link de Afiliado Gerado
            </DialogTitle>
            <DialogDescription>
              Parceiro cadastrado com sucesso! Compartilhe este link para que clientes possam fazer adesão.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Link de Afiliado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="space-y-2">
                  <Label>Link Completo</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newPartnerAffiliateLink || ''}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (newPartnerAffiliateLink) {
                          navigator.clipboard.writeText(newPartnerAffiliateLink);
                          toast.success("Link copiado!");
                        }
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  </div>
                  
                {newPartnerToken && (
                  <div className="space-y-2">
                    <Label>Token de Afiliado</Label>
                    <div className="flex gap-2">
                    <Input
                        value={newPartnerToken}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(newPartnerToken);
                          toast.success("Token copiado!");
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                  </div>
                </div>
                )}

                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Como usar:</strong> Compartilhe este link com seus clientes. Quando eles acessarem através do link, serão automaticamente atribuídos ao seu parceiro e você receberá comissão sobre as vendas.
                  </p>
                </div>
              </CardContent>
            </Card>
              </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAffiliateLinkModalOpen(false)}>
              Fechar
            </Button>
            <Button
              onClick={async () => {
                if (newPartnerAffiliateLink && partnerForm.adminEmail) {
                  try {
                    const { data, error } = await supabase.functions.invoke('send-affiliate-link', {
                      body: {
                        partner_email: partnerForm.adminEmail,
                        partner_name: partnerForm.adminName,
                        company_name: partnerForm.companyName,
                        affiliate_token: newPartnerToken || '',
                        affiliate_link: newPartnerAffiliateLink,
                      },
                    });

                    if (error) throw error;

                    if (data?.success) {
                      toast.success(`Link de afiliado enviado por email para ${partnerForm.adminEmail}`);
                      setAffiliateLinkModalOpen(false);
                    } else {
                      toast.error(data?.message || 'Erro ao enviar email');
                    }
                  } catch (error: any) {
                    console.error('Erro ao enviar link:', error);
                    toast.error(error.message || 'Erro ao enviar link por email');
                  }
                }
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar Link por Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Convite para Parceiro</DialogTitle>
            <DialogDescription>
              Selecione o nível do parceiro para gerar um link de convite
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="inviteTier">Tier do Parceiro *</Label>
              <Select value={inviteTier} onValueChange={(v) => setInviteTier(v as PartnerTier)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o Tier" />
                </SelectTrigger>
                <SelectContent>
                  {TIER_OPTIONS.map((tier) => (
                    <SelectItem key={tier.value} value={tier.value}>
                      <div>
                        <div className="font-medium">{tier.label}</div>
                        <div className="text-xs text-muted-foreground">{tier.description}</div>
                  </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
                  </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                O link gerado terá validade de 30 dias. O parceiro poderá se cadastrar através do link.
              </AlertDescription>
            </Alert>
                </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGenerateInvite} className="gap-2">
              <Gift className="h-4 w-4" />
              Gerar Convite
            </Button>
            <Button 
              onClick={() => {
                // Link de teste simulado
                const testToken = `test-demo-${Date.now()}`;
                const testUrl = `${window.location.origin}/parceiros/cadastro?token=${testToken}`;
                setNewInviteUrl(testUrl);
                toast.success('Link de teste gerado! Use este link para simular o fluxo completo.');
              }} 
              variant="outline" 
              className="gap-2"
            >
              <LinkIcon className="h-4 w-4" />
              Gerar Link de Teste
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite URL Modal */}
      <Dialog open={!!newInviteUrl} onOpenChange={() => setNewInviteUrl(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link de Convite Gerado</DialogTitle>
            <DialogDescription>
              Copie o link abaixo e envie para o parceiro
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Link do Convite</Label>
              <div className="flex gap-2">
                <Input value={newInviteUrl || ''} readOnly className="font-mono text-sm" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (newInviteUrl) {
                      navigator.clipboard.writeText(newInviteUrl);
                      toast.success('Link copiado!');
                    }
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertDescription>
                O link expira em 30 dias. O parceiro precisa acessar este link para se cadastrar.
              </AlertDescription>
            </Alert>
              </div>
          <DialogFooter>
            <Button onClick={() => setNewInviteUrl(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invitation Details Modal */}
      <Dialog open={invitationDetailsOpen} onOpenChange={setInvitationDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Convite</DialogTitle>
            <DialogDescription>
              Informações completas do convite de parceiro
            </DialogDescription>
          </DialogHeader>
          {selectedInvitation && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nível</Label>
                  <p className="font-medium">
                    {selectedInvitation.invitation_level === 'afiliado_basico' && 'Afiliado Básico (Nível 1)'}
                    {selectedInvitation.invitation_level === 'afiliado_avancado' && 'Afiliado Avançado (Nível 2)'}
                    {selectedInvitation.invitation_level === 'parceiro' && 'Parceiro Estratégico (Nível 3)'}
                  </p>
                    </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    {selectedInvitation.status === 'pending' && <Badge variant="outline">Pendente</Badge>}
                    {selectedInvitation.status === 'submitted' && <Badge variant="secondary">Aguardando Aprovação</Badge>}
                    {selectedInvitation.status === 'approved' && <Badge variant="default">Aprovado</Badge>}
                    {selectedInvitation.status === 'rejected' && <Badge variant="destructive">Rejeitado</Badge>}
                    {selectedInvitation.status === 'expired' && <Badge variant="outline">Expirado</Badge>}
                      </div>
                    </div>
                    </div>

              {selectedInvitation.name && (
                <div>
                  <Label className="text-muted-foreground">Nome</Label>
                  <p className="font-medium">{selectedInvitation.name}</p>
                    </div>
              )}

              {selectedInvitation.email && (
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedInvitation.email}</p>
                      </div>
                    )}

              {selectedInvitation.company_name && (
                <div>
                  <Label className="text-muted-foreground">Empresa</Label>
                  <p className="font-medium">{selectedInvitation.company_name}</p>
              </div>
              )}

              {selectedInvitation.cnpj && (
                <div>
                  <Label className="text-muted-foreground">CNPJ</Label>
                  <p className="font-medium">{selectedInvitation.cnpj}</p>
                    </div>
              )}

              {selectedInvitation.phone && (
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <p className="font-medium">{selectedInvitation.phone}</p>
                  </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Criado em</Label>
                  <p className="text-sm">
                    {selectedInvitation.created_at && format(new Date(selectedInvitation.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </p>
              </div>
                <div>
                  <Label className="text-muted-foreground">Expira em</Label>
                  <p className="text-sm">
                    {selectedInvitation.expires_at && format(new Date(selectedInvitation.expires_at), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>

              {selectedInvitation.rejection_reason && (
                <div>
                  <Label className="text-muted-foreground">Motivo da Rejeição</Label>
                  <p className="text-sm text-destructive">{selectedInvitation.rejection_reason}</p>
            </div>
          )}

              {selectedInvitation.invitation_token && selectedInvitation.status === 'pending' && (
            <div>
                  <Label className="text-muted-foreground">Link do Convite</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      value={`${window.location.origin}/parceiros/cadastro?token=${selectedInvitation.invitation_token}`}
                      readOnly 
                      className="font-mono text-sm"
                    />
                <Button
                  variant="outline"
                      size="icon"
                      onClick={() => {
                        const baseUrl = window.location.origin;
                        const inviteUrl = `${baseUrl}/parceiros/cadastro?token=${selectedInvitation.invitation_token}`;
                        navigator.clipboard.writeText(inviteUrl);
                        toast.success('Link copiado!');
                      }}
                    >
                      <Copy className="h-4 w-4" />
                </Button>
                  </div>
                </div>
              )}

              {selectedInvitation.status === 'submitted' && (
                <>
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-900">
                      Este convite está aguardando sua aprovação. Selecione o Tier do parceiro antes de aprovar.
                    </AlertDescription>
                  </Alert>
                  <div>
                    <Label htmlFor="tier-select">Tier do Parceiro *</Label>
                    <Select
                      value={selectedTier || mapInvitationLevelToTier(selectedInvitation.invitation_level) || 'tier_3_simple'}
                      onValueChange={(value) => setSelectedTier(value as PartnerTier)}
                    >
                      <SelectTrigger id="tier-select" className="mt-1">
                        <SelectValue placeholder="Selecione o Tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIER_OPTIONS.map((tier) => (
                          <SelectItem key={tier.value} value={tier.value}>
                            <div>
                              <div className="font-medium">{tier.label}</div>
                              <div className="text-xs text-muted-foreground">{tier.description}</div>
            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedInvitation?.status === 'submitted' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleRejectInvitation(selectedInvitation.id)}
                  className="text-destructive"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeitar
                </Button>
                <Button
                  onClick={() => {
                    if (!selectedTier && !mapInvitationLevelToTier(selectedInvitation.invitation_level)) {
                      toast.error('Selecione um Tier antes de aprovar');
                      return;
                    }
                    handleApproveInvitation(selectedInvitation.id);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Aprovar
                </Button>
              </>
              )}
            <Button variant="outline" onClick={() => {
              setInvitationDetailsOpen(false);
              setSelectedTier(null);
            }}>
              Fechar
                </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contract Details Modal - Removido: Contratos agora são gerenciados em /admin/contract-management?tab=partners */}
    </div>
  );
};

export default AdminPartners;
