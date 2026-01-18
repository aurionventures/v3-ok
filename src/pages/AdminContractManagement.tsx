/**
 * Página Admin: Gestão de Contratos
 * Gerencia contratos, envio para assinatura eletrônica e disparo de email de senha
 */

import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  Mail,
  RefreshCw,
  Eye,
  Download,
  Search,
  Filter,
  Plus,
  AlertCircle,
  Key,
  Copy,
  MoreVertical,
  Edit,
  Trash2,
  Star,
  CheckCircle,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { DEFAULT_CONTRACT_CONTENT } from "@/components/contracts/ContractTemplateEditor";
import ContractTemplateEditor from "@/components/contracts/ContractTemplateEditor";

interface Contract {
  id: string;
  contract_number: string;
  client_name: string;
  client_document: string;
  client_email: string;
  signatory_name: string;
  plan_name: string;
  monthly_value: number;
  status: "draft" | "pending_signature" | "pending_counter_signature" | "active" | "expired" | "cancelled";
  created_at: string;
  sent_at?: string;
  client_signed_at?: string;
  counter_signed_at?: string;
  client_signature_token?: string;
  client_signature_token_expires_at?: string;
  password_email_sent_at?: string;
  origin: "PLG" | "SLG";
  organization_id?: string;
  // PLG Tracking
  partner_id?: string | null;
  affiliate_token?: string | null;
}

interface PartnerContract {
  id: string;
  contract_number: string;
  partner_name: string;
  partner_email: string;
  partner_company_name: string;
  partner_cnpj?: string;
  partner_phone?: string;
  contract_level: "afiliado_basico" | "afiliado_avancado" | "parceiro";
  status: "draft" | "pending_signature" | "partner_signed" | "counter_signed" | "expired" | "terminated" | "cancelled";
  created_at: string;
  partner_signed_at?: string;
  counter_signed_at?: string;
  partner_signature_token?: string;
  partner_signature_token_expires_at?: string;
  start_date: string;
  end_date?: string;
  commission_setup?: number;
  commission_recurring?: number;
  recurring_commission_months?: number;
}

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  content: string;
  available_variables: any[];
  plan_types: string[];
  requires_witness: boolean;
  witness_count: number;
  is_active: boolean;
  is_default: boolean;
  contract_type?: 'client' | 'partner';
  created_at: string;
  updated_at: string;
}

// Mock de contratos (substituir por dados reais)
const getMockContracts = (): Contract[] => {
  const stored = localStorage.getItem("contracts");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Se houver erro, usar dados de exemplo
    }
  }
  
  // Dados de exemplo para visualização
  const mockData: Contract[] = [
    {
      id: "1",
      contract_number: "CONT-2026-0001",
      client_name: "Empresa ABC Ltda",
      client_document: "12.345.678/0001-90",
      client_email: "contato@empresaabc.com.br",
      signatory_name: "João Silva",
      plan_name: "Profissional",
      monthly_value: 4796,
      status: "active",
      created_at: new Date(2026, 0, 10).toISOString(),
      sent_at: new Date(2026, 0, 12).toISOString(),
      client_signed_at: new Date(2026, 0, 15).toISOString(),
      counter_signed_at: new Date(2026, 0, 15).toISOString(),
      origin: "PLG",
    },
    {
      id: "2",
      contract_number: "CONT-2026-0002",
      client_name: "Tech Solutions XYZ S.A.",
      client_document: "98.765.432/0001-10",
      client_email: "legal@techxyz.com.br",
      signatory_name: "Maria Santos",
      plan_name: "Business",
      monthly_value: 8997,
      status: "pending_signature",
      created_at: new Date(2026, 0, 8).toISOString(),
      sent_at: new Date(2026, 0, 10).toISOString(),
      origin: "SLG",
    },
    {
      id: "3",
      contract_number: "CONT-2026-0003",
      client_name: "Governança Corporativa Ltda",
      client_document: "11.222.333/0001-44",
      client_email: "admin@govcorp.com.br",
      signatory_name: "Carlos Oliveira",
      plan_name: "Essencial",
      monthly_value: 3997,
      status: "draft",
      created_at: new Date(2026, 0, 5).toISOString(),
      origin: "PLG",
    },
    {
      id: "4",
      contract_number: "CONT-2026-0004",
      client_name: "Inovação Digital S.A.",
      client_document: "55.666.777/0001-88",
      client_email: "financeiro@inovacao.com.br",
      signatory_name: "Ana Paula",
      plan_name: "Enterprise",
      monthly_value: 14997,
      status: "pending_counter_signature",
      created_at: new Date(2025, 11, 28).toISOString(),
      sent_at: new Date(2025, 11, 30).toISOString(),
      client_signed_at: new Date(2026, 0, 2).toISOString(),
      origin: "SLG",
    },
    {
      id: "5",
      contract_number: "CONT-2025-0045",
      client_name: "Consultoria Estratégica Ltda",
      client_document: "33.444.555/0001-22",
      client_email: "contato@consultoria.com.br",
      signatory_name: "Roberto Mendes",
      plan_name: "Profissional",
      monthly_value: 4796,
      status: "expired",
      created_at: new Date(2025, 5, 15).toISOString(),
      sent_at: new Date(2025, 5, 20).toISOString(),
      client_signed_at: new Date(2025, 5, 25).toISOString(),
      counter_signed_at: new Date(2025, 5, 25).toISOString(),
      origin: "PLG",
    },
    {
      id: "6",
      contract_number: "CONT-2025-0038",
      client_name: "Gestão Avançada S.A.",
      client_document: "77.888.999/0001-33",
      client_email: "admin@gestao.com.br",
      signatory_name: "Fernanda Costa",
      plan_name: "Business",
      monthly_value: 8997,
      status: "cancelled",
      created_at: new Date(2025, 8, 10).toISOString(),
      sent_at: new Date(2025, 8, 12).toISOString(),
      origin: "SLG",
    },
  ];
  
  // Salvar no localStorage para persistência
  localStorage.setItem("contracts", JSON.stringify(mockData));
  return mockData;
};

export default function AdminContractManagement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Abrir na aba correta baseado na URL
  const tabParam = searchParams.get("tab");
  const initialTab = tabParam === "partners" ? "partners" : tabParam === "templates" ? "templates" : "clients";
  const [activeTab, setActiveTab] = useState<"clients" | "partners" | "templates">(initialTab);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [partnerContracts, setPartnerContracts] = useState<PartnerContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [selectedPartnerContract, setSelectedPartnerContract] = useState<PartnerContract | null>(null);
  
  // Modals
  const [showSendModal, setShowSendModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPartnerDetailsModal, setShowPartnerDetailsModal] = useState(false);
  const [sending, setSending] = useState(false);
  
  // Templates state
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templateTypeFilter, setTemplateTypeFilter] = useState<string>("all");
  const [templateSearchTerm, setTemplateSearchTerm] = useState("");
  const [deleteTemplateDialogOpen, setDeleteTemplateDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<ContractTemplate | null>(null);
  const [uploadFileDialogOpen, setUploadFileDialogOpen] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);

  // Carregar contratos
  useEffect(() => {
    loadContracts();
    loadPartnerContracts();
  }, []);

  // Carregar templates quando a aba estiver ativa
  useEffect(() => {
    if (activeTab === 'templates') {
      loadTemplates();
    }
  }, [activeTab]);

  const loadContracts = () => {
    setLoading(true);
    try {
      const mockContracts = getMockContracts();
      setContracts(mockContracts);
    } catch (error) {
      console.error("Erro ao carregar contratos:", error);
      toast.error("Erro ao carregar contratos");
    } finally {
      setLoading(false);
    }
  };

  const loadPartnerContracts = async () => {
    setLoadingPartners(true);
    try {
      // Buscar contratos de parceiros do Supabase
      const { data, error } = await supabase
        .from("partner_contracts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar contratos de parceiros:", error);
        // Usar dados mockados como fallback
        const mockPartnerContracts = getMockPartnerContracts();
        setPartnerContracts(mockPartnerContracts);
      } else {
        setPartnerContracts(data || getMockPartnerContracts());
      }
    } catch (error) {
      console.error("Erro ao carregar contratos de parceiros:", error);
      const mockPartnerContracts = getMockPartnerContracts();
      setPartnerContracts(mockPartnerContracts);
    } finally {
      setLoadingPartners(false);
    }
  };

  // Mock de contratos de parceiros
  const getMockPartnerContracts = (): PartnerContract[] => {
    return [
      {
        id: "pc-1",
        contract_number: "PC-2026-0001",
        partner_name: "João Silva",
        partner_email: "joao@parceiro.com.br",
        partner_company_name: "Parceiro Demo LTDA",
        partner_cnpj: "12.345.678/0001-90",
        partner_phone: "(11) 99999-9999",
        contract_level: "parceiro",
        status: "counter_signed",
        created_at: new Date(2026, 0, 10).toISOString(),
        partner_signed_at: new Date(2026, 0, 12).toISOString(),
        counter_signed_at: new Date(2026, 0, 13).toISOString(),
        start_date: new Date(2026, 0, 13).toISOString().split('T')[0],
        commission_setup: 15,
        commission_recurring: 15,
        recurring_commission_months: 3,
      },
      {
        id: "pc-2",
        contract_number: "PC-2026-0002",
        partner_name: "Maria Santos",
        partner_email: "maria@afiliado.com.br",
        partner_company_name: "Afiliado Qualificado S.A.",
        partner_cnpj: "98.765.432/0001-10",
        contract_level: "afiliado_avancado",
        status: "pending_signature",
        created_at: new Date(2026, 0, 15).toISOString(),
        start_date: new Date(2026, 0, 15).toISOString().split('T')[0],
        commission_setup: 10,
        commission_recurring: 5,
        recurring_commission_months: 3,
      },
    ];
  };

  // Filtrar contratos
  const filteredContracts = useMemo(() => {
    let filtered = contracts;

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Filtro por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.contract_number.toLowerCase().includes(term) ||
          c.client_name.toLowerCase().includes(term) ||
          c.client_email.toLowerCase().includes(term) ||
          c.client_document.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [contracts, statusFilter, searchTerm]);

  // Estatísticas
  const stats = useMemo(() => {
    return {
      total: contracts.length,
      drafts: contracts.filter((c) => c.status === "draft").length,
      pending: contracts.filter((c) => c.status === "pending_signature").length,
      active: contracts.filter((c) => c.status === "active").length,
      expired: contracts.filter((c) => c.status === "expired").length,
      cancelled: contracts.filter((c) => c.status === "cancelled").length,
    };
  }, [contracts]);

  // Gerar link de assinatura
  const generateSignatureLink = (contract: Contract): string => {
    const token = contract.client_signature_token || generateToken();
    return `${window.location.origin}/contract-sign/${token}`;
  };

  // Gerar token único
  const generateToken = (): string => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  // Enviar contrato para assinatura
  const handleSendContract = async () => {
    if (!selectedContract) return;

    setSending(true);
    try {
      const signatureLink = generateSignatureLink(selectedContract);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias para assinar

      // Atualizar contrato no storage
      const updatedContracts = contracts.map((c) =>
        c.id === selectedContract.id
          ? {
              ...c,
              status: "pending_signature" as const,
              client_signature_token: selectedContract.client_signature_token || generateToken(),
              client_signature_token_expires_at: expiresAt.toISOString(),
              sent_at: new Date().toISOString(),
            }
          : c
      );

      localStorage.setItem("contracts", JSON.stringify(updatedContracts));
      setContracts(updatedContracts);

      // TODO: Enviar email real via Edge Function
      console.log("Enviando email de assinatura para:", selectedContract.client_email);
      console.log("Link:", signatureLink);

      toast.success("Contrato enviado para assinatura com sucesso!");
      setShowSendModal(false);
      setSelectedContract(null);
    } catch (error) {
      console.error("Erro ao enviar contrato:", error);
      toast.error("Erro ao enviar contrato para assinatura");
    } finally {
      setSending(false);
    }
  };

  // Reenviar contrato
  const handleResendContract = async (contract: Contract) => {
    setSelectedContract(contract);
    setShowSendModal(true);
  };

  // Enviar email de senha (após assinatura)
  const handleSendPasswordEmail = async () => {
    if (!selectedContract) return;

    // Verificar se contrato foi assinado
    if (!selectedContract.client_signed_at) {
      toast.error("O contrato precisa ser assinado antes de enviar o email de senha");
      return;
    }

    setSending(true);
    try {
      // Atualizar contrato
      const updatedContracts = contracts.map((c) =>
        c.id === selectedContract.id
          ? {
              ...c,
              password_email_sent_at: new Date().toISOString(),
            }
          : c
      );

      localStorage.setItem("contracts", JSON.stringify(updatedContracts));
      setContracts(updatedContracts);

      // TODO: Enviar email real via Edge Function
      // Este email deve conter link para criação de senha
      console.log("Enviando email de criação de senha para:", selectedContract.client_email);

      toast.success("Email de criação de senha enviado com sucesso!");
      setShowPasswordModal(false);
      setSelectedContract(null);
    } catch (error) {
      console.error("Erro ao enviar email de senha:", error);
      toast.error("Erro ao enviar email de criação de senha");
    } finally {
      setSending(false);
    }
  };

  // Status badge
  const getStatusBadge = (status: Contract["status"]) => {
    const configs = {
      draft: { label: "Rascunho", color: "bg-gray-500" },
      pending_signature: { label: "Aguardando Assinatura", color: "bg-yellow-500" },
      pending_counter_signature: { label: "Aguardando Contra-assinatura", color: "bg-blue-500" },
      active: { label: "Ativo", color: "bg-green-500" },
      expired: { label: "Expirado", color: "bg-red-500" },
      cancelled: { label: "Cancelado", color: "bg-gray-400" },
    };

    const config = configs[status] || configs.draft;
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  // Copiar link de assinatura
  const copySignatureLink = (contract: Contract) => {
    const link = generateSignatureLink(contract);
    navigator.clipboard.writeText(link);
    toast.success("Link copiado para a área de transferência!");
  };

  // Templates functions
  const loadTemplates = async () => {
    setTemplatesLoading(true);
    try {
      const storedTemplates = localStorage.getItem('contract_templates');
      if (storedTemplates) {
        setTemplates(JSON.parse(storedTemplates));
      } else {
        // Inicializar com templates padrão se não houver no localStorage
        const mockTemplates: ContractTemplate[] = [
          {
            id: '1',
            name: 'Contrato de Prestação de Serviços SaaS - Padrão',
            description: 'Modelo padrão de contrato para assinatura de planos Legacy OS (Clientes)',
            version: '1.0',
            content: DEFAULT_CONTRACT_CONTENT,
            available_variables: [],
            plan_types: ['core', 'governance_plus', 'people_esg', 'legacy_360'],
            requires_witness: false,
            witness_count: 0,
            is_active: true,
            is_default: true,
            contract_type: 'client',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '3',
            name: 'Contrato de Parceiro/Afiliado - Padrão',
            description: 'Modelo padrão de contrato para parceiros e afiliados do programa de indicação',
            version: '1.0',
            content: `<div style="font-family: 'Times New Roman', Georgia, serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.7; color: #222;">

  <!-- CABEÇALHO -->
  <div style="text-align: center; margin-bottom: 40px;">
    <h1 style="font-size: 18px; font-weight: bold; margin-bottom: 5px; color: #1a365d;">
      CONTRATO DE PARCERIA E AFILIADOS
    </h1>
    <h2 style="font-size: 14px; font-weight: normal; margin-bottom: 20px; color: #4a5568;">
      PROGRAMA DE INDICAÇÃO LEGACY OS - GOVERNANÇA CORPORATIVA
    </h2>
    <p style="font-size: 13px;">
      <strong>Contrato nº {{contrato_numero}}</strong>
    </p>
  </div>

  <!-- PARTES -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">PARTES</h3>
  
  <p><strong>CONTRATADA:</strong> LEGACY GOVERNANÇA LTDA., pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 00.000.000/0001-00, com sede na cidade de São Paulo, Estado de São Paulo, neste ato representada na forma de seu Contrato Social, doravante denominada simplesmente <strong>"LEGACY"</strong>.</p>
  
  <p><strong>PARCEIRO/AFILIADO:</strong> <strong>{{parceiro_nome}}</strong>, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº <strong>{{parceiro_cnpj}}</strong>, com sede em <strong>{{parceiro_endereco}}</strong>, neste ato representada por <strong>{{parceiro_representante}}</strong>, <strong>{{parceiro_cargo}}</strong>, portador(a) do CPF nº <strong>{{parceiro_cpf}}</strong>, doravante denominada simplesmente <strong>"PARCEIRO"</strong>.</p>
  
  <p>As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Parceria e Afiliados para participação no Programa de Indicação da plataforma LEGACY OS, que se regerá pelas cláusulas seguintes e pelas condições descritas no presente.</p>

  <!-- CLÁUSULA 1 - DO OBJETO -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 1ª - DO OBJETO</h3>
  
  <p>1.1. O presente contrato tem por objeto a participação do PARCEIRO no Programa de Indicação da LEGACY OS, mediante divulgação da plataforma através de link de afiliado único fornecido pela LEGACY, com direito a comissões sobre vendas originadas através desse link.</p>
  
  <p>1.2. <strong>Nível do Parceiro:</strong> {{parceiro_tier}}</p>
  
  <p>1.3. O PARCEIRO receberá um link de afiliado único e exclusivo para divulgação da plataforma LEGACY OS, através do qual poderá indicar clientes potenciais.</p>
  
  <p>1.4. A LEGACY se compromete a rastrear todas as vendas originadas através do link de afiliado fornecido ao PARCEIRO e a pagar as comissões devidas conforme estabelecido nas cláusulas seguintes.</p>

  <!-- CLÁUSULA 2 - DO PRAZO -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 2ª - DO PRAZO</h3>
  
  <p>2.1. O presente contrato terá vigência de <strong>{{duracao_meses}} ({{duracao_extenso}}) meses</strong>, com início em <strong>{{data_inicio}}</strong> e término em <strong>{{data_fim}}</strong>.</p>
  
  <p>2.2. O contrato será renovado automaticamente por períodos iguais e sucessivos, salvo manifestação contrária de qualquer das partes, por escrito, com antecedência mínima de 30 (trinta) dias do término da vigência ou de qualquer período de renovação.</p>
  
  <p>2.3. Qualquer alteração nas condições do programa será comunicada ao PARCEIRO com 30 (trinta) dias de antecedência.</p>

  <!-- CLÁUSULA 3 - DAS COMISSÕES -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 3ª - DAS COMISSÕES E PAGAMENTOS</h3>
  
  <p>3.1. O PARCEIRO terá direito a receber comissões sobre as vendas originadas através de seu link de afiliado único, conforme o nível (Tier) do parceiro:</p>
  
  <ul style="margin-left: 20px;">
    <li><strong>Tier 1 - Parceiro Premium:</strong> Comissão inicial de {{comissao_setup_tier1}}% sobre o valor da primeira mensalidade e comissão recorrente de {{comissao_recorrente_tier1}}% por {{meses_comissao_tier1}} meses;</li>
    <li><strong>Tier 2 - Parceiro Avançado:</strong> Comissão inicial de {{comissao_setup_tier2}}% sobre o valor da primeira mensalidade e comissão recorrente de {{comissao_recorrente_tier2}}% por {{meses_comissao_tier2}} meses;</li>
    <li><strong>Tier 3 - Afiliado Qualificado:</strong> Comissão inicial de {{comissao_setup_tier3}}% sobre o valor da primeira mensalidade e comissão recorrente de {{comissao_recorrente_tier3}}% por {{meses_comissao_tier3}} meses;</li>
    <li><strong>Tier 4 - Afiliado Simples:</strong> Comissão única de {{comissao_setup_tier4}}% sobre o valor da primeira mensalidade.</li>
  </ul>
  
  <p>3.2. <strong>Comissões Configuradas para este Parceiro:</strong></p>
  <ul style="margin-left: 20px;">
    <li>Comissão Inicial (Setup): {{comissao_setup}}%</li>
    <li>Comissão Recorrente: {{comissao_recorrente}}% por {{meses_comissao}} meses</li>
  </ul>
  
  <p>3.3. O pagamento das comissões será efetuado mensalmente, até o dia {{dia_pagamento_comissao}} de cada mês, referente às vendas confirmadas e ativadas no mês anterior, mediante transferência bancária (PIX/TED) para conta indicada pelo PARCEIRO.</p>
  
  <p>3.4. A comissão será calculada sobre o valor líquido recebido pela LEGACY (após descontos, cancelamentos ou chargebacks), considerando apenas clientes que ativarem seus contratos e pagarem a primeira mensalidade.</p>
  
  <p>3.5. O PARCEIRO será responsável por manter seus dados bancários atualizados na plataforma. A falta de informações bancárias corretas poderá resultar no atraso do pagamento.</p>

  <!-- CLÁUSULA 4 - OBRIGAÇÕES DA LEGACY -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 4ª - DAS OBRIGAÇÕES DA LEGACY</h3>
  
  <p>4.1. A LEGACY se obriga a:</p>
  <ul style="margin-left: 20px;">
    <li>a) Fornecer ao PARCEIRO um link de afiliado único e exclusivo;</li>
    <li>b) Rastrear todas as vendas originadas através do link de afiliado;</li>
    <li>c) Fornecer relatórios mensais de vendas e comissões através do painel do parceiro;</li>
    <li>d) Pagar as comissões devidas nos prazos estabelecidos;</li>
    <li>e) Fornecer materiais de marketing e suporte para divulgação da plataforma;</li>
    <li>f) Manter o PARCEIRO informado sobre novidades e atualizações da plataforma;</li>
    <li>g) Respeitar os termos deste contrato e as políticas do programa de afiliados.</li>
  </ul>

  <!-- CLÁUSULA 5 - OBRIGAÇÕES DO PARCEIRO -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 5ª - DAS OBRIGAÇÕES DO PARCEIRO</h3>
  
  <p>5.1. O PARCEIRO se obriga a:</p>
  <ul style="margin-left: 20px;">
    <li>a) Divulgar a plataforma LEGACY OS de forma ética e profissional, utilizando apenas materiais oficiais fornecidos pela LEGACY;</li>
    <li>b) Não fazer promessas ou garantias não autorizadas sobre a plataforma;</li>
    <li>c) Manter seus dados cadastrais atualizados na plataforma;</li>
    <li>d) Não utilizar práticas de spam, marketing agressivo ou ações que possam prejudicar a imagem da LEGACY;</li>
    <li>e) Não criar sites ou materiais que imitem ou copiem a marca LEGACY OS;</li>
    <li>f) Seguir todas as diretrizes de marketing e comunicação fornecidas pela LEGACY;</li>
    <li>g) Não vender ou transferir seu link de afiliado sem autorização prévia da LEGACY;</li>
    <li>h) Manter sigilo sobre informações confidenciais a que tiver acesso;</li>
    <li>i) Informar imediatamente a LEGACY sobre qualquer violação de segurança ou uso indevido do link.</li>
  </ul>

  <!-- CLÁUSULA 6 - RASTREAMENTO E COMISSÕES -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 6ª - DO RASTREAMENTO E ATRIBUIÇÃO DE VENDAS</h3>
  
  <p>6.1. As vendas serão atribuídas ao PARCEIRO quando o cliente acessar a plataforma através do link de afiliado único fornecido e efetivar a contratação dentro do período de rastreamento de {{periodo_rastreamento}} dias.</p>
  
  <p>6.2. Uma venda será considerada confirmada apenas quando:</p>
  <ul style="margin-left: 20px;">
    <li>a) O cliente efetuar o pagamento da primeira mensalidade;</li>
    <li>b) O contrato estiver ativo e não cancelado;</li>
    <li>c) Não houver chargeback ou estorno dentro do período de garantia;</li>
    <li>d) O rastreamento for realizado corretamente através do link de afiliado.</li>
  </ul>
  
  <p>6.3. A LEGACY não se responsabiliza por vendas que não sejam atribuídas ao PARCEIRO devido a falhas no rastreamento causadas por bloqueadores de cookies, configurações do navegador do cliente ou outras circunstâncias fora do controle da LEGACY.</p>
  
  <p>6.4. O PARCEIRO terá acesso a um painel administrativo onde poderá acompanhar em tempo real suas indicações, vendas e comissões calculadas.</p>

  <!-- CLÁUSULA 7 - PROPRIEDADE INTELECTUAL -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 7ª - PROPRIEDADE INTELECTUAL E USO DA MARCA</h3>
  
  <p>7.1. A marca LEGACY OS, incluindo seu logo, nome comercial e materiais de marketing, são de propriedade exclusiva da LEGACY.</p>
  
  <p>7.2. O PARCEIRO recebe uma licença limitada, não exclusiva, revogável e intransferível para usar a marca LEGACY OS apenas para fins de divulgação da plataforma, conforme diretrizes fornecidas pela LEGACY.</p>
  
  <p>7.3. O PARCEIRO não poderá alterar, modificar ou criar variações da marca LEGACY OS sem autorização prévia e por escrito.</p>
  
  <p>7.4. O PARCEIRO reconhece que não adquire qualquer direito de propriedade sobre a marca LEGACY OS através deste contrato.</p>

  <!-- CLÁUSULA 8 - RESCISÃO -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 8ª - RESCISÃO</h3>
  
  <p>8.1. O presente contrato poderá ser rescindido:</p>
  <ul style="margin-left: 20px;">
    <li>a) Por acordo mútuo entre as partes;</li>
    <li>b) Por inadimplemento de qualquer obrigação contratual, após notificação e prazo de 15 dias para regularização;</li>
    <li>c) Por violação das diretrizes de marketing ou uso indevido da marca;</li>
    <li>d) Por solicitação de qualquer das partes, mediante aviso prévio de 30 dias;</li>
    <li>e) Por práticas fraudulentas ou que violem a legislação vigente.</li>
  </ul>
  
  <p>8.2. Em caso de rescisão, o PARCEIRO continuará tendo direito às comissões de vendas já confirmadas e pagas anteriormente à data de rescisão.</p>
  
  <p>8.3. Após a rescisão, o PARCEIRO deverá cessar imediatamente o uso do link de afiliado e de todos os materiais de marketing da LEGACY.</p>
  
  <p>8.4. A LEGACY se reserva o direito de suspender ou cancelar imediatamente o acesso do PARCEIRO ao programa em caso de violação grave dos termos deste contrato.</p>

  <!-- CLÁUSULA 9 - CONFIDENCIALIDADE -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 9ª - CONFIDENCIALIDADE</h3>
  
  <p>9.1. O PARCEIRO se compromete a manter sigilo sobre todas as informações confidenciais a que tiver acesso em razão deste contrato, incluindo, mas não se limitando a: estratégias comerciais, valores de comissões de outros parceiros, informações técnicas não públicas e dados de clientes.</p>
  
  <p>9.2. A obrigação de confidencialidade permanecerá válida mesmo após o término deste contrato.</p>

  <!-- CLÁUSULA 10 - DISPOSIÇÕES GERAIS -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 10ª - DISPOSIÇÕES GERAIS</h3>
  
  <p>10.1. Este contrato representa o acordo integral entre as partes sobre o programa de afiliados.</p>
  
  <p>10.2. Qualquer alteração nas condições de comissões ou políticas do programa será comunicada ao PARCEIRO com 30 dias de antecedência.</p>
  
  <p>10.3. Este contrato não cria relação de trabalho, sociedade, representação comercial ou qualquer outro vínculo além do estabelecido nas cláusulas acima.</p>
  
  <p>10.4. O PARCEIRO é um prestador de serviços independente e não possui vínculo empregatício com a LEGACY.</p>
  
  <p>10.5. Este contrato é celebrado eletronicamente, com validade jurídica nos termos da Medida Provisória nº 2.200-2/2001 e Lei nº 14.063/2020.</p>
  
  <p>10.6. As comunicações entre as partes serão realizadas preferencialmente por e-mail:</p>
  <ul style="margin-left: 20px;">
    <li>LEGACY: parceiros@legacyos.com.br</li>
    <li>PARCEIRO: {{parceiro_email}}</li>
  </ul>

  <!-- CLÁUSULA 11 - FORO -->
  <h3 style="font-size: 14px; color: #1a365d; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-top: 30px;">CLÁUSULA 11ª - FORO</h3>
  
  <p>11.1. Fica eleito o foro da Comarca de São Paulo, Estado de São Paulo, para dirimir quaisquer questões oriundas do presente contrato.</p>

  <!-- ASSINATURAS -->
  <div style="margin-top: 50px;">
    <p>E, por estarem assim justos e acordados, as partes assinam o presente instrumento eletronicamente.</p>
    
    <p style="text-align: center; margin-top: 30px;">
      <strong>{{cidade_assinatura}}, {{data_contrato}}</strong>
    </p>
    
    <div style="display: flex; justify-content: space-between; margin-top: 60px;">
      <div style="width: 45%; text-align: center;">
        <div style="border-top: 1px solid #333; padding-top: 10px;">
          <strong>LEGACY GOVERNANÇA LTDA.</strong><br/>
          <span style="font-size: 12px;">CNPJ: 00.000.000/0001-00</span><br/>
          <span style="font-size: 11px; color: #666;">CONTRATADA</span>
        </div>
      </div>
      <div style="width: 45%; text-align: center;">
        <div style="border-top: 1px solid #333; padding-top: 10px;">
          <strong>{{parceiro_nome}}</strong><br/>
          <span style="font-size: 12px;">CNPJ: {{parceiro_cnpj}}</span><br/>
          <span style="font-size: 12px;">{{parceiro_representante}} - {{parceiro_cargo}}</span><br/>
          <span style="font-size: 11px; color: #666;">PARCEIRO/AFILIADO</span>
        </div>
      </div>
    </div>
  </div>

</div>`,
            available_variables: [],
            plan_types: [],
            requires_witness: false,
            witness_count: 0,
            is_active: true,
            is_default: true,
            contract_type: 'partner',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
        setTemplates(mockTemplates);
        localStorage.setItem('contract_templates', JSON.stringify(mockTemplates));
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Erro ao carregar templates');
    } finally {
      setTemplatesLoading(false);
    }
  };

  const handleSaveTemplate = async (template: Omit<ContractTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const now = new Date().toISOString();
      let updatedTemplates: ContractTemplate[];
      
      if (selectedTemplate?.id) {
        // Update existing
        updatedTemplates = templates.map(t => 
          t.id === selectedTemplate.id 
            ? { ...t, ...template, updated_at: now }
            : t
        );
      } else {
        // Create new
        const newTemplate: ContractTemplate = {
          id: crypto.randomUUID(),
          ...template,
          created_at: now,
          updated_at: now,
        };
        updatedTemplates = [newTemplate, ...templates];
      }

      setTemplates(updatedTemplates);
      localStorage.setItem('contract_templates', JSON.stringify(updatedTemplates));
      setShowTemplateEditor(false);
      setSelectedTemplate(null);
      toast.success(selectedTemplate ? 'Template atualizado' : 'Template criado');
      loadTemplates(); // Reload to refresh filtered list
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  };

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;

    try {
      const updatedTemplates = templates.filter(t => t.id !== templateToDelete.id);
      setTemplates(updatedTemplates);
      localStorage.setItem('contract_templates', JSON.stringify(updatedTemplates));
      toast.success('Template excluído');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Erro ao excluir template');
    } finally {
      setDeleteTemplateDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handleDuplicateTemplate = (template: ContractTemplate) => {
    try {
      const now = new Date().toISOString();
      const newTemplate: ContractTemplate = {
        id: crypto.randomUUID(),
        name: `${template.name} (Cópia)`,
        description: template.description,
        version: '1.0',
        content: template.content,
        available_variables: template.available_variables,
        plan_types: template.plan_types,
        requires_witness: template.requires_witness,
        witness_count: template.witness_count,
        is_active: false,
        is_default: false,
        contract_type: template.contract_type,
        created_at: now,
        updated_at: now,
      };

      const updatedTemplates = [newTemplate, ...templates];
      setTemplates(updatedTemplates);
      localStorage.setItem('contract_templates', JSON.stringify(updatedTemplates));
      toast.success('Template duplicado');
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast.error('Erro ao duplicar template');
    }
  };

  const handleSetDefaultTemplate = (template: ContractTemplate) => {
    try {
      const updatedTemplates = templates.map(t => ({
        ...t,
        is_default: t.id === template.id && t.contract_type === template.contract_type
      }));
      setTemplates(updatedTemplates);
      localStorage.setItem('contract_templates', JSON.stringify(updatedTemplates));
      toast.success('Template definido como padrão');
    } catch (error) {
      console.error('Error setting default template:', error);
      toast.error('Erro ao definir template padrão');
    }
  };

  const handleToggleTemplateActive = (template: ContractTemplate) => {
    try {
      const updatedTemplates = templates.map(t => 
        t.id === template.id ? { ...t, is_active: !t.is_active } : t
      );
      setTemplates(updatedTemplates);
      localStorage.setItem('contract_templates', JSON.stringify(updatedTemplates));
      toast.success(template.is_active ? 'Template desativado' : 'Template ativado');
    } catch (error) {
      console.error('Error toggling template active:', error);
      toast.error('Erro ao alterar status');
    }
  };

  const handleUploadContractFile = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const now = new Date().toISOString();
        
        // Extrair nome do arquivo sem extensão
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        
        const newTemplate: ContractTemplate = {
          id: crypto.randomUUID(),
          name: fileName || 'Template Importado',
          description: `Template importado de ${file.name}`,
          version: '1.0',
          content: content || '<div>Conteúdo do contrato importado...</div>',
          available_variables: [],
          plan_types: [],
          requires_witness: false,
          witness_count: 0,
          is_active: false,
          is_default: false,
          created_at: now,
          updated_at: now,
        };

        const updatedTemplates = [newTemplate, ...templates];
        setTemplates(updatedTemplates);
        localStorage.setItem('contract_templates', JSON.stringify(updatedTemplates));
        toast.success('Template importado com sucesso!');
        setUploadFileDialogOpen(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error uploading template:', error);
      toast.error('Erro ao importar template');
    }
  };

  // Filtrar templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesType = templateTypeFilter === 'all' || t.contract_type === templateTypeFilter;
      const matchesSearch = !templateSearchTerm || 
        t.name.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(templateSearchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [templates, templateTypeFilter, templateSearchTerm]);

  // Renderizar editor de templates se necessário
  if (showTemplateEditor && activeTab === 'templates') {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Gestão de Contratos" />
          <main className="flex-1 overflow-auto p-6">
            <ContractTemplateEditor
              template={selectedTemplate}
              onSave={handleSaveTemplate}
              onCancel={() => {
                setShowTemplateEditor(false);
                setSelectedTemplate(null);
              }}
            />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestão de Contratos" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Tabs para separar Contratos de Clientes, Parceiros e Minutas */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "clients" | "partners" | "templates")}>
              <TabsList className="grid w-full max-w-2xl grid-cols-3">
                <TabsTrigger value="clients">Contratos de Clientes</TabsTrigger>
                <TabsTrigger value="partners">Contratos de Parceiros</TabsTrigger>
                <TabsTrigger value="templates">Minutas de Contratos</TabsTrigger>
              </TabsList>

              {/* Tab: Contratos de Clientes */}
              <TabsContent value="clients" className="space-y-6 mt-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.drafts}</div>
              <p className="text-xs text-muted-foreground mt-1">Rascunhos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">Aguardando</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground mt-1">Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
              <p className="text-xs text-muted-foreground mt-1">Expirados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-600">{stats.cancelled}</div>
              <p className="text-xs text-muted-foreground mt-1">Cancelados</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número, cliente, email ou CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="pending_signature">Aguardando Assinatura</SelectItem>
                  <SelectItem value="pending_counter_signature">Aguardando Contra-assinatura</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="expired">Expirado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Contratos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Contratos ({filteredContracts.length})</CardTitle>
                <CardDescription>
                  Gerencie contratos, envie para assinatura e dispare emails de senha
                </CardDescription>
              </div>
              <Button onClick={() => navigate("/admin/contract-templates")}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Contrato
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Carregando contratos...</p>
              </div>
            ) : filteredContracts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum contrato encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nº Contrato</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right w-[140px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">
                          {contract.contract_number}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{contract.client_name}</div>
                            <div className="text-xs text-muted-foreground">
                              {contract.client_email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(contract.status)}
                            {contract.origin && (
                              <Badge variant={contract.origin === "PLG" ? "default" : "secondary"} className="text-xs">
                                {contract.origin}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedContract(contract);
                              setShowDetailsModal(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal: Enviar Contrato */}
        <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enviar Contrato para Assinatura</DialogTitle>
              <DialogDescription>
                O contrato será enviado para o email do cliente com link para assinatura eletrônica.
              </DialogDescription>
            </DialogHeader>
            {selectedContract && (
              <div className="space-y-4 py-4">
                <div>
                  <Label>Cliente</Label>
                  <p className="text-sm font-medium">{selectedContract.client_name}</p>
                  <p className="text-xs text-muted-foreground">{selectedContract.client_email}</p>
                </div>
                <div>
                  <Label>Número do Contrato</Label>
                  <p className="text-sm font-medium">{selectedContract.contract_number}</p>
                </div>
                <div>
                  <Label>Link de Assinatura</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value={generateSignatureLink(selectedContract)}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copySignatureLink(selectedContract)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p className="text-xs text-blue-900 dark:text-blue-100">
                      O link de assinatura expira em 7 dias. Após a assinatura, você poderá enviar
                      o email de criação de senha.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSendModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSendContract} disabled={sending}>
                {sending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar para Assinatura
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal: Enviar Email de Senha */}
        <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enviar Email de Criação de Senha</DialogTitle>
              <DialogDescription>
                Este email será enviado apenas após o contrato estar assinado pelo cliente.
              </DialogDescription>
            </DialogHeader>
            {selectedContract && (
              <div className="space-y-4 py-4">
                {!selectedContract.client_signed_at ? (
                  <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900 dark:text-yellow-100">
                          Contrato ainda não assinado
                        </p>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                          O email de senha só pode ser enviado após o cliente assinar o contrato.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <Label>Cliente</Label>
                      <p className="text-sm font-medium">{selectedContract.client_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedContract.client_email}
                      </p>
                    </div>
                    <div>
                      <Label>Data da Assinatura</Label>
                      <p className="text-sm font-medium">
                        {format(
                          new Date(selectedContract.client_signed_at),
                          "dd/MM/yyyy 'às' HH:mm",
                          { locale: ptBR }
                        )}
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <p className="text-xs text-green-900 dark:text-green-100">
                          O email conterá um link seguro para criação de senha. Após criar a
                          senha, o cliente poderá acessar a plataforma.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSendPasswordEmail}
                disabled={sending || !selectedContract?.client_signed_at}
              >
                {sending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4 mr-2" />
                    Enviar Email de Senha
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal: Visualizar Detalhes do Contrato */}
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contrato {selectedContract?.contract_number}
              </DialogTitle>
              <DialogDescription>
                Detalhes completos do contrato
              </DialogDescription>
            </DialogHeader>
            {selectedContract && (
              <div className="space-y-4 py-4">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    {getStatusBadge(selectedContract.status)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Valor Mensal</p>
                    <p className="text-xl font-bold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(selectedContract.monthly_value)}
                    </p>
                  </div>
                </div>

                {/* Informações do Cliente */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Cliente</p>
                    <p className="font-medium">{selectedContract.client_name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedContract.client_document}</p>
                    <p className="text-sm text-muted-foreground">{selectedContract.client_email}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Signatário</p>
                    <p className="font-medium">{selectedContract.signatory_name}</p>
                    <p className="text-sm text-muted-foreground mt-1">Plano: {selectedContract.plan_name}</p>
                    <p className="text-sm text-muted-foreground">Origem: {selectedContract.origin}</p>
                  </div>
                </div>

                {/* Datas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Data de Criação</Label>
                    <p className="text-sm font-medium">
                      {format(new Date(selectedContract.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  {selectedContract.sent_at && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Enviado em</Label>
                      <p className="text-sm font-medium">
                        {format(new Date(selectedContract.sent_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  )}
                  {selectedContract.client_signed_at && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Assinado pelo Cliente</Label>
                      <p className="text-sm font-medium text-green-600">
                        {format(new Date(selectedContract.client_signed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  )}
                  {selectedContract.counter_signed_at && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Contra-assinado</Label>
                      <p className="text-sm font-medium text-green-600">
                        {format(new Date(selectedContract.counter_signed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Link de Assinatura (se disponível) */}
                {selectedContract.client_signature_token && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <Label className="text-xs text-muted-foreground mb-2 block">Link de Assinatura</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={generateSignatureLink(selectedContract)}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copySignatureLink(selectedContract)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Email de Senha */}
                {selectedContract.password_email_sent_at && (
                  <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">
                          Email de senha enviado
                        </p>
                        <p className="text-xs text-green-800 dark:text-green-200">
                          {format(new Date(selectedContract.password_email_sent_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                Fechar
              </Button>
              {selectedContract?.status === "draft" && (
                <Button
                  variant="default"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowSendModal(true);
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar para Assinatura
                </Button>
              )}
              {selectedContract?.status === "pending_signature" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      copySignatureLink(selectedContract);
                      toast.success("Link copiado!");
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Link
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleResendContract(selectedContract);
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reenviar
                  </Button>
                </>
              )}
              {selectedContract?.client_signed_at && !selectedContract?.password_email_sent_at && (
                <Button
                  variant="default"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowPasswordModal(true);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Enviar Email de Senha
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
              </TabsContent>

              {/* Tab: Contratos de Parceiros */}
              <TabsContent value="partners" className="space-y-6 mt-6">
                {/* Estatísticas de Contratos de Parceiros */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{partnerContracts.length}</div>
                      <p className="text-xs text-muted-foreground mt-1">Total</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">
                        {partnerContracts.filter((c) => c.status === "draft").length}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Rascunhos</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-yellow-600">
                        {partnerContracts.filter((c) => c.status === "pending_signature").length}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Aguardando</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600">
                        {partnerContracts.filter((c) => c.status === "partner_signed").length}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Parceiro Assinou</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">
                        {partnerContracts.filter((c) => c.status === "counter_signed").length}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Ativos</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-red-600">
                        {partnerContracts.filter((c) => c.status === "expired" || c.status === "cancelled").length}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Expirados/Cancelados</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Filtros para Contratos de Parceiros */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar por número, parceiro, email ou CNPJ..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[200px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os Status</SelectItem>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="pending_signature">Aguardando Assinatura</SelectItem>
                          <SelectItem value="partner_signed">Parceiro Assinou</SelectItem>
                          <SelectItem value="counter_signed">Ativo</SelectItem>
                          <SelectItem value="expired">Expirado</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Lista de Contratos de Parceiros */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Contratos de Parceiros ({partnerContracts.length})</CardTitle>
                        <CardDescription>
                          Gerencie contratos de parceiros e afiliados
                        </CardDescription>
                      </div>
                      <Button variant="outline" onClick={loadPartnerContracts} disabled={loadingPartners}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loadingPartners ? 'animate-spin' : ''}`} />
                        Atualizar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingPartners ? (
                      <div className="flex items-center justify-center py-12">
                        <p className="text-muted-foreground">Carregando contratos...</p>
                      </div>
                    ) : partnerContracts.filter(c => 
                      (statusFilter === "all" || c.status === statusFilter) &&
                      (!searchTerm || 
                        c.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.partner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.partner_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.partner_company_name.toLowerCase().includes(searchTerm.toLowerCase()))
                    ).length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Nenhum contrato de parceiro encontrado</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nº Contrato</TableHead>
                              <TableHead>Parceiro</TableHead>
                              <TableHead>Nível</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right w-[140px]">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {partnerContracts
                              .filter(c => 
                                (statusFilter === "all" || c.status === statusFilter) &&
                                (!searchTerm || 
                                  c.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  c.partner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  c.partner_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  c.partner_company_name.toLowerCase().includes(searchTerm.toLowerCase()))
                              )
                              .map((contract) => (
                                <TableRow key={contract.id}>
                                  <TableCell className="font-medium">
                                    {contract.contract_number}
                                  </TableCell>
                                  <TableCell>
                                    <div>
                                      <div className="font-medium">{contract.partner_company_name}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {contract.partner_email}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">
                                      {contract.contract_level === "parceiro" ? "Parceiro" :
                                       contract.contract_level === "afiliado_avancado" ? "Afiliado Avançado" :
                                       "Afiliado Básico"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {(() => {
                                      const statusConfigs = {
                                        draft: { label: "Rascunho", color: "bg-gray-500" },
                                        pending_signature: { label: "Aguardando Assinatura", color: "bg-yellow-500" },
                                        partner_signed: { label: "Parceiro Assinou", color: "bg-blue-500" },
                                        counter_signed: { label: "Ativo", color: "bg-green-500" },
                                        expired: { label: "Expirado", color: "bg-red-500" },
                                        cancelled: { label: "Cancelado", color: "bg-gray-400" },
                                        terminated: { label: "Terminado", color: "bg-gray-400" },
                                      };
                                      const config = statusConfigs[contract.status] || statusConfigs.draft;
                                      return (
                                        <Badge className={`${config.color} text-white`}>
                                          {config.label}
                                        </Badge>
                                      );
                                    })()}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedPartnerContract(contract);
                                        setShowPartnerDetailsModal(true);
                                      }}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      Ver Detalhes
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Modal: Detalhes do Contrato de Parceiro */}
                <Dialog open={showPartnerDetailsModal} onOpenChange={setShowPartnerDetailsModal}>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Contrato {selectedPartnerContract?.contract_number}
                      </DialogTitle>
                      <DialogDescription>
                        Detalhes completos do contrato de parceiro
                      </DialogDescription>
                    </DialogHeader>
                    {selectedPartnerContract && (
                      <div className="space-y-4 py-4">
                        {/* Status e Comissões */}
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Status</p>
                            {(() => {
                              const statusConfigs = {
                                draft: { label: "Rascunho", color: "bg-gray-500" },
                                pending_signature: { label: "Aguardando Assinatura", color: "bg-yellow-500" },
                                partner_signed: { label: "Parceiro Assinou", color: "bg-blue-500" },
                                counter_signed: { label: "Ativo", color: "bg-green-500" },
                                expired: { label: "Expirado", color: "bg-red-500" },
                                cancelled: { label: "Cancelado", color: "bg-gray-400" },
                                terminated: { label: "Terminado", color: "bg-gray-400" },
                              };
                              const config = statusConfigs[selectedPartnerContract.status] || statusConfigs.draft;
                              return (
                                <Badge className={`${config.color} text-white`}>
                                  {config.label}
                                </Badge>
                              );
                            })()}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-1">Comissão Setup</p>
                            <p className="text-xl font-bold">
                              {selectedPartnerContract.commission_setup || 0}%
                            </p>
                          </div>
                        </div>

                        {/* Informações do Parceiro */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Parceiro</p>
                            <p className="font-medium">{selectedPartnerContract.partner_name}</p>
                            <p className="text-sm text-muted-foreground mt-1">{selectedPartnerContract.partner_company_name}</p>
                            {selectedPartnerContract.partner_cnpj && (
                              <p className="text-sm text-muted-foreground">{selectedPartnerContract.partner_cnpj}</p>
                            )}
                            <p className="text-sm text-muted-foreground">{selectedPartnerContract.partner_email}</p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Contrato</p>
                            <p className="font-medium">
                              {selectedPartnerContract.contract_level === "parceiro" ? "Parceiro Comercial" :
                               selectedPartnerContract.contract_level === "afiliado_avancado" ? "Afiliado Qualificado" :
                               "Afiliado Simples"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Setup: {selectedPartnerContract.commission_setup || 0}%
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Recorrente: {selectedPartnerContract.commission_recurring || 0}% ({selectedPartnerContract.recurring_commission_months || 0} meses)
                            </p>
                          </div>
                        </div>

                        {/* Datas */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">Data de Criação</Label>
                            <p className="text-sm font-medium">
                              {format(new Date(selectedPartnerContract.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </p>
                          </div>
                          {selectedPartnerContract.start_date && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Início</Label>
                              <p className="text-sm font-medium">
                                {format(new Date(selectedPartnerContract.start_date), "dd/MM/yyyy", { locale: ptBR })}
                              </p>
                            </div>
                          )}
                          {selectedPartnerContract.partner_signed_at && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Assinado pelo Parceiro</Label>
                              <p className="text-sm font-medium text-green-600">
                                {format(new Date(selectedPartnerContract.partner_signed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </p>
                            </div>
                          )}
                          {selectedPartnerContract.counter_signed_at && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Contra-assinado</Label>
                              <p className="text-sm font-medium text-green-600">
                                {format(new Date(selectedPartnerContract.counter_signed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowPartnerDetailsModal(false)}>
                        Fechar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              {/* Tab: Minutas de Contratos */}
              <TabsContent value="templates" className="space-y-6 mt-6">
                {/* Ações rápidas */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={loadTemplates} disabled={templatesLoading}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${templatesLoading ? 'animate-spin' : ''}`} />
                      Atualizar
                    </Button>
                    <Button onClick={() => { setSelectedTemplate(null); setShowTemplateEditor(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Minuta
                    </Button>
                    <Button variant="outline" onClick={() => setUploadFileDialogOpen(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Importar Template
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Buscar template..."
                      value={templateSearchTerm}
                      onChange={(e) => setTemplateSearchTerm(e.target.value)}
                      className="w-[200px]"
                    />
                    <Select value={templateTypeFilter} onValueChange={setTemplateTypeFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Tipos</SelectItem>
                        <SelectItem value="client">Cliente</SelectItem>
                        <SelectItem value="partner">Parceiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Cards de Métricas */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{filteredTemplates.length}</p>
                          <p className="text-xs text-muted-foreground">Total de Templates</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{filteredTemplates.filter(t => t.is_active).length}</p>
                          <p className="text-xs text-muted-foreground">Ativos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                          <Star className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{filteredTemplates.filter(t => t.is_default).length}</p>
                          <p className="text-xs text-muted-foreground">Padrão</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
                          <XCircle className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{filteredTemplates.filter(t => !t.is_active).length}</p>
                          <p className="text-xs text-muted-foreground">Inativos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tabela de Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Templates Disponíveis</CardTitle>
                    <CardDescription>
                      Templates são usados para gerar contratos automaticamente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Template</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Versão</TableHead>
                          <TableHead>Planos</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Atualizado</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {templatesLoading ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                            </TableCell>
                          </TableRow>
                        ) : filteredTemplates.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              Nenhum template encontrado
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTemplates.map((template) => (
                            <TableRow key={template.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium flex items-center gap-2">
                                      {template.name}
                                      {template.is_default && (
                                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                      )}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {template.description || 'Sem descrição'}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {template.contract_type === 'client' ? 'Cliente' : template.contract_type === 'partner' ? 'Parceiro' : 'N/A'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">v{template.version}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {template.plan_types.slice(0, 2).map((plan) => (
                                    <Badge key={plan} variant="secondary" className="text-xs">
                                      {plan}
                                    </Badge>
                                  ))}
                                  {template.plan_types.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{template.plan_types.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {template.is_active ? (
                                  <Badge className="bg-emerald-500">Ativo</Badge>
                                ) : (
                                  <Badge variant="secondary">Inativo</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {format(new Date(template.updated_at), "dd/MM/yyyy", { locale: ptBR })}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => { setSelectedTemplate(template); setShowTemplateEditor(true); }}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Duplicar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {!template.is_default && (
                                      <DropdownMenuItem onClick={() => handleSetDefaultTemplate(template)}>
                                        <Star className="h-4 w-4 mr-2" />
                                        Definir como Padrão
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => handleToggleTemplateActive(template)}>
                                      {template.is_active ? (
                                        <>
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Desativar
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Ativar
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => { setTemplateToDelete(template); setDeleteTemplateDialogOpen(true); }}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Excluir
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Dialog de confirmação de exclusão */}
                <AlertDialog open={deleteTemplateDialogOpen} onOpenChange={setDeleteTemplateDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Template</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o template "{templateToDelete?.name}"?
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteTemplate} className="bg-destructive text-destructive-foreground">
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Dialog de upload de arquivo */}
                <Dialog open={uploadFileDialogOpen} onOpenChange={setUploadFileDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Importar Template de Contrato</DialogTitle>
                      <DialogDescription>
                        Faça upload de um arquivo HTML ou texto com o conteúdo do template
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept=".html,.txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleUploadContractFile(file);
                          }
                        }}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setUploadFileDialogOpen(false)}>
                        Cancelar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}