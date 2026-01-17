/**
 * Página Admin: Gestão de Contratos
 * Gerencia contratos, envio para assinatura eletrônica e disparo de email de senha
 */

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

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
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  
  // Modals
  const [showSendModal, setShowSendModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [sending, setSending] = useState(false);

  // Carregar contratos
  useEffect(() => {
    loadContracts();
  }, []);

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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestão de Contratos" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
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
          </div>
        </main>
      </div>
    </div>
  );
}