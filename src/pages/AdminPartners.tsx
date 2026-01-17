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
import { toast } from "sonner";
import { usePartners, Partner, PartnerFormData } from "@/hooks/usePartners";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { CompanyData } from "@/hooks/useCNPJ";
import { InputCNPJ, InputPhone } from "@/components/ui/input-masked";
import { 
  Plus, 
  Building2, 
  User, 
  Palette, 
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
  Check
} from "lucide-react";

const PARTNER_TYPES = [
  { value: 'revenda', label: 'Revenda' },
  { value: 'consultoria', label: 'Consultoria' },
  { value: 'integrador', label: 'Integrador' },
  { value: 'afiliado', label: 'Afiliado' }
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
  
  // Partner Details Modal
  const [partnerDetailsOpen, setPartnerDetailsOpen] = useState(false);
  
  // Edit Whitelabel Modal
  const [editWhitelabelOpen, setEditWhitelabelOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [whitelabelForm, setWhitelabelForm] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    customDomain: '',
    commission: 15
  });
  
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

  const handleEditWhitelabel = (partner: Partner) => {
    setSelectedPartner(partner);
    setWhitelabelForm({
      primaryColor: partner.settings?.primary_color || '#3B82F6',
      secondaryColor: partner.settings?.secondary_color || '#1E40AF',
      customDomain: partner.settings?.custom_domain || '',
      commission: partner.settings?.commission || 15
    });
    setEditWhitelabelOpen(true);
  };

  const handleSaveWhitelabel = async () => {
    if (!selectedPartner) return;
    
    setSaving(true);
    const result = await updatePartnerSettings(selectedPartner.id, {
      primary_color: whitelabelForm.primaryColor,
      secondary_color: whitelabelForm.secondaryColor,
      custom_domain: whitelabelForm.customDomain || null,
      commission: whitelabelForm.commission,
    });
    setSaving(false);
    
    if (result.success) {
      setEditWhitelabelOpen(false);
      toast.success("Configurações whitelabel atualizadas!");
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

  const stats = {
    total: partners.length,
    active: partners.filter(p => p.settings?.status === 'active').length,
    pending: partners.filter(p => p.settings?.status === 'pending').length,
    avgCommission: partners.length > 0 
      ? Math.round(partners.reduce((acc, p) => acc + (p.settings?.commission || 15), 0) / partners.length)
      : 0
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Gestão de Parceiros" />
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Handshake className="h-6 w-6 text-primary" />
                Gestão de Parceiros
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie parceiros de revenda e consultoria
              </p>
            </div>
            <Button onClick={handleOpenWizard} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Parceiro
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          </div>

          {/* Partners Table */}
          <Card>
            <CardHeader>
              <CardTitle>Parceiros Cadastrados</CardTitle>
              <CardDescription>Lista de todos os parceiros da plataforma</CardDescription>
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
                    {partners.map((partner) => (
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
                              <DropdownMenuItem 
                                className="gap-2"
                                onClick={() => handleEditWhitelabel(partner)}
                              >
                                <Palette className="h-4 w-4" />
                                Editar Whitelabel
                              </DropdownMenuItem>
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
        </main>
      </div>

      {/* Edit Whitelabel Modal */}
      <Dialog open={editWhitelabelOpen} onOpenChange={setEditWhitelabelOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Editar Whitelabel
            </DialogTitle>
            <DialogDescription>
              Configurações visuais para {selectedPartner?.settings?.company_name || selectedPartner?.company}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-primaryColor">Cor Primária</Label>
              <div className="flex gap-2">
                <Input
                  id="edit-primaryColor"
                  type="color"
                  className="w-14 h-10 p-1 cursor-pointer"
                  value={whitelabelForm.primaryColor}
                  onChange={(e) => setWhitelabelForm({ ...whitelabelForm, primaryColor: e.target.value })}
                />
                <Input
                  value={whitelabelForm.primaryColor}
                  onChange={(e) => setWhitelabelForm({ ...whitelabelForm, primaryColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-secondaryColor">Cor Secundária</Label>
              <div className="flex gap-2">
                <Input
                  id="edit-secondaryColor"
                  type="color"
                  className="w-14 h-10 p-1 cursor-pointer"
                  value={whitelabelForm.secondaryColor}
                  onChange={(e) => setWhitelabelForm({ ...whitelabelForm, secondaryColor: e.target.value })}
                />
                <Input
                  value={whitelabelForm.secondaryColor}
                  onChange={(e) => setWhitelabelForm({ ...whitelabelForm, secondaryColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-customDomain" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Domínio Personalizado
              </Label>
              <Input
                id="edit-customDomain"
                placeholder="parceiro.legacy.app"
                value={whitelabelForm.customDomain}
                onChange={(e) => setWhitelabelForm({ ...whitelabelForm, customDomain: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-commission" className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Comissão (%)
              </Label>
              <Input
                id="edit-commission"
                type="number"
                min="0"
                max="100"
                value={whitelabelForm.commission}
                onChange={(e) => setWhitelabelForm({ ...whitelabelForm, commission: Number(e.target.value) })}
              />
            </div>

            {/* Preview */}
            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="text-sm font-medium mb-3">Preview</p>
              <div className="flex gap-4">
                <div 
                  className="w-16 h-16 rounded-lg shadow-sm flex items-center justify-center text-white text-xs"
                  style={{ backgroundColor: whitelabelForm.primaryColor }}
                >
                  Primária
                </div>
                <div 
                  className="w-16 h-16 rounded-lg shadow-sm flex items-center justify-center text-white text-xs"
                  style={{ backgroundColor: whitelabelForm.secondaryColor }}
                >
                  Secundária
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditWhitelabelOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveWhitelabel} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

            {/* Tipo de Parceria */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={partnerForm.type}
                onValueChange={(value) => setPartnerForm({ ...partnerForm, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="afiliado">Afiliado</SelectItem>
                  <SelectItem value="parceiro">Parceiro</SelectItem>
                  <SelectItem value="revenda">Revenda</SelectItem>
                  <SelectItem value="consultoria">Consultoria</SelectItem>
                  <SelectItem value="integrador">Integrador</SelectItem>
                </SelectContent>
              </Select>
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
                    <SelectItem value="12">12 meses (Total do contrato)</SelectItem>
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
    </div>
  );
};

export default AdminPartners;
