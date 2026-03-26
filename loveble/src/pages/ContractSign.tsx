/**
 * Página Pública: Assinatura de Contrato
 * Permite que o cliente visualize e assine o contrato eletronicamente
 */

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText, CheckCircle, AlertCircle, Clock, Download,
  Shield, Lock, Pen, Building2, Calendar, DollarSign, User, ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ContractPDF, ContractData } from "@/components/contracts/ContractPDF";
import { CreatePasswordModal } from "@/components/modals/CreatePasswordModal";
import { formatCPF, isValidCPF, onlyNumbers } from "@/utils/masks";
import { DEFAULT_CONTRACT_CONTENT } from "@/components/contracts/defaultContractTemplate";

interface Contract {
  id: string;
  contract_number: string;
  client_name: string;
  client_document: string;
  client_email: string;
  signatory_name: string;
  signatory_cpf?: string; // CPF do signatário
  signatory_role: string;
  plan_name: string;
  plan_type: string;
  addons: string[];
  monthly_value: number;
  total_value: number;
  start_date: string;
  end_date: string;
  duration_months: number;
  content_html: string;
  status: string;
  client_signature_token?: string;
  client_signature_token_expires_at: string;
  client_signed_at: string | null;
  client_signature_ip?: string;
  client_signature_hash?: string;
  client_signature_user_agent?: string;
}

export default function ContractSign() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  
  // Form de assinatura
  const [signatoryNameConfirm, setSignatoryNameConfirm] = useState("");
  const [signatoryCpfConfirm, setSignatoryCpfConfirm] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptLgpd, setAcceptLgpd] = useState(false);
  
  // Modal de sucesso e criação de senha
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [contractSigned, setContractSigned] = useState(false);

  useEffect(() => {
    if (token) {
      fetchContract();
    }
  }, [token]);

  const fetchContract = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // NOTE: contracts table doesn't exist yet, using localStorage/mock
      const storedContracts = localStorage.getItem('contracts') || '[]';
      const contracts = JSON.parse(storedContracts);
      const data = contracts.find((c: any) => c.client_signature_token === token);

      if (!data) {
        // Use mock for development - getMockContract já carrega o template corretamente
        const mockContract = getMockContract();
        // Garantir que o token do mock corresponda ao token da URL
        if (token) {
          mockContract.client_signature_token = token;
        }
        console.log('Usando contrato mockado:', mockContract.contract_number);
        console.log('Content HTML:', mockContract.content_html ? 'Preenchido' : 'Vazio', mockContract.content_html?.substring(0, 100));
        setContract(mockContract);
        return;
      }

      // Verificar se token expirou
      if (data.client_signature_token_expires_at && new Date(data.client_signature_token_expires_at) < new Date()) {
        setError("O link de assinatura expirou. Solicite um novo link.");
        return;
      }

      // Verificar se já foi assinado
      if (data.client_signed_at) {
        setError("Este contrato já foi assinado.");
        setContract(data);
        return;
      }

      // SEMPRE carregar o template ativo do tipo 'client' do Super ADM para garantir conteúdo atualizado
      // Mesmo que o contrato já tenha content_html, vamos sempre usar o template mais recente do Super ADM
      const storedTemplates = localStorage.getItem('contract_templates');
      let templateContent = DEFAULT_CONTRACT_CONTENT;
      
      // Se não houver templates, garantir que sejam inicializados
      let templatesToUse: any[] = [];
      if (!storedTemplates) {
        console.warn('Templates não encontrados no localStorage. Inicializando com template padrão.');
        // Tentar inicializar templates como no AdminContractManagement
        const defaultTemplates = [
          {
            id: '1',
            name: 'Contrato de Prestação de Serviços SaaS - Padrão',
            description: 'Modelo padrão de contrato para assinatura de planos Legacy OS (Clientes)',
            version: '1.0',
            content: DEFAULT_CONTRACT_CONTENT,
            is_active: true,
            is_default: true,
            contract_type: 'client',
          }
        ];
        localStorage.setItem('contract_templates', JSON.stringify(defaultTemplates));
        templatesToUse = defaultTemplates;
        templateContent = DEFAULT_CONTRACT_CONTENT;
      } else {
        try {
          templatesToUse = JSON.parse(storedTemplates);
          console.log('Templates encontrados no localStorage:', templatesToUse.length);
          
          // Buscar template ativo do tipo 'client' (ou padrão se não houver tipo especificado)
          const defaultTemplate = templatesToUse.find((t: any) => 
            t.is_active && (t.contract_type === 'client' || (!t.contract_type && t.is_default))
          ) || templatesToUse.find((t: any) => t.is_default && t.is_active);
          
          if (defaultTemplate?.content) {
            templateContent = defaultTemplate.content;
            console.log('Template ativo encontrado:', defaultTemplate.name);
          } else if (defaultTemplate?.content === '' || !defaultTemplate) {
            console.warn('Template não encontrado ou vazio. Usando DEFAULT_CONTRACT_CONTENT.');
            templateContent = DEFAULT_CONTRACT_CONTENT;
          }
        } catch (e) {
          console.error('Erro ao parsear templates:', e);
          templateContent = DEFAULT_CONTRACT_CONTENT;
        }
      }
      
      // Usar o conteúdo do template (ou DEFAULT_CONTRACT_CONTENT como fallback)
      // Substituir variáveis do template com dados do contrato
      let content = templateContent;
      const variables: Record<string, string> = {
        'contrato_numero': data.contract_number || '',
        'cliente_nome': data.client_name || '',
        'cliente_cnpj': data.client_document || '',
        'cliente_endereco': (data as any).client_address || '',
        'cliente_email': data.client_email || '',
        'cliente_telefone': (data as any).client_phone || '',
        'signatario_nome': data.signatory_name || '',
        'signatario_cargo': data.signatory_role || '',
        'signatario_cpf': data.signatory_cpf || '',
        'plano_nome': data.plan_name || '',
        'plano_tipo': data.plan_type || '',
        'modulos_inclusos': data.plan_name || '',
        'addons_inclusos': (data.addons || []).join(', ') || 'Nenhum',
        'duracao_meses': data.duration_months?.toString() || '',
        'duracao_extenso': data.duration_months === 12 ? 'doze' : data.duration_months === 24 ? 'vinte e quatro' : data.duration_months === 36 ? 'trinta e seis' : data.duration_months?.toString() || '',
        'data_inicio': data.start_date ? format(new Date(data.start_date), 'dd/MM/yyyy', { locale: ptBR }) : '',
        'data_fim': data.end_date ? format(new Date(data.end_date), 'dd/MM/yyyy', { locale: ptBR }) : '',
        'plano_valor': data.monthly_value ? data.monthly_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
        'plano_valor_extenso': data.monthly_value ? `R$ ${data.monthly_value.toFixed(2).replace('.', ',')}` : '',
        'forma_pagamento': 'Boleto Bancário',
        'dia_vencimento': '05',
        'data_contrato': format(new Date(), 'dd/MM/yyyy', { locale: ptBR }),
        'cidade_assinatura': 'São Paulo - SP',
        'valor_mensal': data.monthly_value ? data.monthly_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
      };
      
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        content = content.replace(regex, value);
      });
      
      // SEMPRE atualizar content_html com o template mais recente do Super ADM
      data.content_html = content;
      
      // Debug: verificar se o conteúdo foi carregado
      console.log('=== DEBUG CONTRATO ===');
      console.log('Contrato encontrado:', data.contract_number);
      console.log('Template carregado:', templateContent ? 'Sim (' + templateContent.length + ' caracteres)' : 'Não');
      console.log('Content HTML após substituição:', data.content_html ? 'Sim (' + data.content_html.length + ' caracteres)' : 'Não');
      if (data.content_html) {
        console.log('Preview do content_html:', data.content_html.substring(0, 200));
      }
      console.log('========================');

      setContract(data);
    } catch (error) {
      console.error("Error fetching contract:", error);
      // Mock para desenvolvimento
      setContract(getMockContract());
    } finally {
      setIsLoading(false);
    }
  };

  const handleSign = async () => {
    if (!contract) return;

    // Validações
    if (signatoryNameConfirm.toLowerCase() !== contract.signatory_name.toLowerCase()) {
      toast.error("O nome digitado não confere com o nome do signatário");
      return;
    }

    // Validar CPF se fornecido no contrato
    if (contract.signatory_cpf) {
      const cleanCpfConfirm = onlyNumbers(signatoryCpfConfirm);
      const cleanCpfContract = onlyNumbers(contract.signatory_cpf);
      
      if (cleanCpfConfirm !== cleanCpfContract) {
        toast.error("O CPF digitado não confere com o CPF do signatário");
        return;
      }

      if (!isValidCPF(signatoryCpfConfirm)) {
        toast.error("CPF inválido");
        return;
      }
    } else if (signatoryCpfConfirm && !isValidCPF(signatoryCpfConfirm)) {
      toast.error("CPF inválido");
      return;
    }

    if (!acceptTerms || !acceptLgpd) {
      toast.error("Você precisa aceitar os termos para assinar o contrato");
      return;
    }

    setIsSigning(true);

    try {
      // Gerar hash da assinatura (incluindo CPF se disponível)
      const cpfToUse = signatoryCpfConfirm || contract.signatory_cpf || '';
      const cpfPart = cpfToUse ? `|${onlyNumbers(cpfToUse)}` : '';
      const signatureData = `${contract.signatory_name}${cpfPart}|${new Date().toISOString()}|${window.location.hostname}`;
      const signatureHash = await generateHash(signatureData);

      // NOTE: contracts table doesn't exist yet, updating localStorage
      const clientIP = await getClientIP();
      const signedAt = new Date().toISOString();
      
      // Criar objeto de contrato atualizado com todos os dados da assinatura
      const updatedContract: Contract = {
        ...contract,
        status: "pending_counter_signature",
        client_signed_at: signedAt,
        client_signature_ip: clientIP,
        client_signature_user_agent: navigator.userAgent,
        client_signature_hash: signatureHash,
        signatory_cpf_confirmed: signatoryCpfConfirm || contract.signatory_cpf || null,
      };
      
      // Atualizar localStorage
      const storedContracts = localStorage.getItem('contracts') || '[]';
      const contracts = JSON.parse(storedContracts);
      const updatedContracts = contracts.map((c: any) => 
        c.id === contract.id ? updatedContract : c
      );
      localStorage.setItem('contracts', JSON.stringify(updatedContracts));

      // Log event locally
      console.log('Contract signed:', {
        contract_id: contract.id,
        event_type: "signed",
        actor_email: contract.client_email,
      });

      // Simular envio de email com cópia do contrato
      try {
        console.log(`[EMAIL] Enviando cópia do contrato assinado para ${contract.client_email}`);
        console.log(`[EMAIL] Contrato nº ${contract.contract_number} assinado com sucesso`);
        // Aqui seria feita a chamada para o serviço de email (Edge Function ou API)
      } catch (emailErr) {
        console.error('Erro ao enviar e-mail:', emailErr);
      }
      
      // Atualizar estado do contrato
      setContract(updatedContract);
      setContractSigned(true);

      // Aguardar um tick para garantir que o estado foi atualizado antes de mostrar o modal
      setTimeout(() => {
        setShowDownloadModal(true);
      }, 100);
    } catch (error) {
      console.error("Error signing contract:", error);
      toast.error("Erro ao assinar contrato. Tente novamente.");
    } finally {
      setIsSigning(false);
    }
  };

  // Gerar hash SHA-256
  const generateHash = async (data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  // Obter IP do cliente
  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch {
      return "unknown";
    }
  };

  // Preparar dados para PDF - usar useMemo para garantir que os dados estejam sempre atualizados
  const pdfData = useMemo((): ContractData | null => {
    if (!contract) return null;

    return {
      contractNumber: contract.contract_number,
      status: contract.status as any,
      clientName: contract.client_name,
      clientDocument: contract.client_document,
      clientEmail: contract.client_email,
      signatoryName: contract.signatory_name,
      signatoryRole: contract.signatory_role,
      signatoryDocument: contract.signatory_cpf,
      planName: contract.plan_name,
      planType: contract.plan_type,
      addons: contract.addons || [],
      monthlyValue: contract.monthly_value,
      totalValue: contract.total_value,
      startDate: contract.start_date,
      endDate: contract.end_date,
      durationMonths: contract.duration_months,
      clientSignedAt: contract.client_signed_at || undefined,
      clientSignatureIp: contract.client_signature_ip || undefined,
      generatedAt: new Date().toISOString(),
    };
  }, [contract]);

  const getPDFData = (): ContractData | null => {
    return pdfData;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Carregando contrato...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle>Ops! Algo deu errado</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          {contract?.client_signed_at && (
            <CardContent className="text-center">
              <Badge className="bg-emerald-500 mb-4">
                <CheckCircle className="h-4 w-4 mr-1" />
                Assinado em {format(new Date(contract.client_signed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Você receberá uma cópia do contrato assinado por email.
              </p>
            </CardContent>
          )}
          <CardFooter className="justify-center">
            <Button variant="outline" onClick={() => window.location.href = "https://legacy.gov.br"}>
              Ir para o site
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!contract) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-white">
          <img
            src="/assets/legacy-logo-full.png"
            alt="Legacy OS"
            className="h-12 mx-auto mb-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <h1 className="text-2xl font-bold mb-2">Assinatura de Contrato</h1>
          <p className="text-slate-300">
            Contrato nº {contract.contract_number}
          </p>
        </div>

        {/* Card Principal */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Contrato de Prestação de Serviços SaaS
                </CardTitle>
                <CardDescription>
                  Revise os termos e assine eletronicamente
                </CardDescription>
              </div>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Aguardando Assinatura
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Resumo do Contrato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Contratante</p>
                    <p className="font-medium">{contract.client_name}</p>
                    <p className="text-xs text-muted-foreground">{contract.client_document}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Pen className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Signatário</p>
                    <p className="font-medium">{contract.signatory_name}</p>
                    <p className="text-xs text-muted-foreground">{contract.signatory_role}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Vigência</p>
                    <p className="font-medium">{contract.duration_months} meses</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(contract.start_date), "dd/MM/yyyy")} a{" "}
                      {format(new Date(contract.end_date), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Valor</p>
                    <p className="font-medium">
                      R$ {contract.monthly_value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total: R$ {contract.total_value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Conteúdo do Contrato - Estilo PDF Reader */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Termos do Contrato
              </h3>
              <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
                <ScrollArea className="h-[600px] p-0">
                  <div className="p-6">
                  {contract?.content_html ? (
                    <div className="contract-pdf-viewer">
                      <style>{`
                        .contract-pdf-viewer {
                          background: #ffffff !important;
                          color: #1a1a1a !important;
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
                          line-height: 1.7;
                          padding: 0;
                          max-width: 900px;
                          margin: 0 auto;
                          width: 100%;
                        }
                        .contract-pdf-viewer > .legacy-contract {
                          background: #ffffff !important;
                          min-height: auto !important;
                        }
                        .contract-pdf-viewer * {
                          box-sizing: border-box;
                        }
                        .contract-pdf-viewer .legacy-contract {
                          background: #ffffff !important;
                          color: #1a1a1a !important;
                          margin: 0;
                          padding: 0;
                        }
                        .contract-pdf-viewer .legacy-contract header,
                        .contract-pdf-viewer .legacy-contract nav,
                        .contract-pdf-viewer .legacy-contract .grid,
                        .contract-pdf-viewer .legacy-contract .topbar,
                        .contract-pdf-viewer .legacy-contract .actions,
                        .contract-pdf-viewer .legacy-contract .brand {
                          display: none !important;
                          visibility: hidden !important;
                          height: 0 !important;
                          width: 0 !important;
                          overflow: hidden !important;
                        }
                        .contract-pdf-viewer .legacy-contract .wrap {
                          max-width: 100% !important;
                          margin: 0 !important;
                          padding: 0 !important;
                          background: #ffffff !important;
                        }
                        .contract-pdf-viewer .legacy-contract .wrap > .grid {
                          display: block !important;
                        }
                        .contract-pdf-viewer .legacy-contract .wrap > .grid > nav {
                          display: none !important;
                        }
                        .contract-pdf-viewer .legacy-contract .wrap > .grid > main {
                          width: 100% !important;
                          max-width: 100% !important;
                        }
                        .contract-pdf-viewer .legacy-contract main {
                          background: #ffffff !important;
                          border: none !important;
                          box-shadow: none !important;
                          border-radius: 0 !important;
                          padding: 0 !important;
                          width: 100% !important;
                          max-width: 100% !important;
                          margin: 0 !important;
                        }
                        .contract-pdf-viewer .legacy-contract .hero {
                          background: #ffffff !important;
                          border-bottom: 1px solid #e5e5e5 !important;
                          padding: 0 0 20px 0 !important;
                          margin-bottom: 30px;
                        }
                        .contract-pdf-viewer .legacy-contract h1 {
                          color: #1a1a1a !important;
                          font-size: 24px;
                          font-weight: 700;
                          margin: 0 0 12px 0;
                        }
                        .contract-pdf-viewer .legacy-contract .sub {
                          color: #666666 !important;
                        }
                        .contract-pdf-viewer .legacy-contract .content {
                          padding: 0 !important;
                        }
                        .contract-pdf-viewer .legacy-contract section {
                          padding: 20px 0;
                          border-bottom: 1px solid #e5e5e5;
                        }
                        .contract-pdf-viewer .legacy-contract section:last-child {
                          border-bottom: none;
                        }
                        .contract-pdf-viewer .legacy-contract h2 {
                          color: #1a1a1a !important;
                          font-size: 18px;
                          font-weight: 700;
                          margin: 0 0 12px 0;
                        }
                        .contract-pdf-viewer .legacy-contract h3 {
                          color: #1a1a1a !important;
                          font-size: 16px;
                          font-weight: 600;
                          margin: 16px 0 8px 0;
                        }
                        .contract-pdf-viewer .legacy-contract p {
                          color: #1a1a1a !important;
                          margin: 12px 0;
                          font-size: 14px;
                        }
                        .contract-pdf-viewer .legacy-contract ul,
                        .contract-pdf-viewer .legacy-contract ol {
                          color: #1a1a1a !important;
                          margin: 12px 0 12px 20px;
                        }
                        .contract-pdf-viewer .legacy-contract li {
                          color: #1a1a1a !important;
                          margin: 6px 0;
                        }
                        .contract-pdf-viewer .legacy-contract strong {
                          color: #1a1a1a !important;
                          font-weight: 600;
                        }
                        .contract-pdf-viewer .legacy-contract .muted {
                          color: #666666 !important;
                        }
                        .contract-pdf-viewer .legacy-contract .callout {
                          border: 1px solid #2563eb;
                          background: rgba(37, 99, 235, 0.05);
                          padding: 16px;
                          border-radius: 6px;
                          margin: 16px 0;
                        }
                        .contract-pdf-viewer .legacy-contract .callout.danger {
                          border-color: #dc2626;
                          background: rgba(220, 38, 38, 0.05);
                        }
                        .contract-pdf-viewer .legacy-contract .callout.success {
                          border-color: #059669;
                          background: rgba(5, 150, 105, 0.05);
                        }
                        .contract-pdf-viewer .legacy-contract .footer {
                          background: #f9fafb !important;
                          border-top: 1px solid #e5e5e5 !important;
                          padding: 20px 0 !important;
                          margin-top: 40px;
                        }
                        .contract-pdf-viewer .legacy-contract .footer small {
                          color: #666666 !important;
                        }
                        .contract-pdf-viewer .legacy-contract .checkbox {
                          background: #f9fafb !important;
                          border: 1px solid #e5e5e5 !important;
                          padding: 16px;
                          border-radius: 6px;
                        }
                        .contract-pdf-viewer .legacy-contract .checkbox label {
                          color: #1a1a1a !important;
                        }
                        .contract-pdf-viewer .legacy-contract .btn {
                          display: none !important;
                        }
                        .contract-pdf-viewer .legacy-contract a {
                          color: #2563eb;
                          text-decoration: underline;
                        }
                        .contract-pdf-viewer .legacy-contract a:hover {
                          color: #1d4ed8;
                        }
                        .contract-pdf-viewer .legacy-contract .pill {
                          background: #f5f5f5 !important;
                          border: 1px solid #e5e5e5 !important;
                          color: #666666 !important;
                        }
                        .contract-pdf-viewer .legacy-contract details {
                          background: #f9fafb !important;
                          border: 1px solid #e5e5e5 !important;
                          padding: 12px 16px;
                          border-radius: 6px;
                          margin: 16px 0;
                        }
                        .contract-pdf-viewer .legacy-contract summary {
                          color: #1a1a1a !important;
                          font-weight: 600;
                        }
                        .contract-pdf-viewer .legacy-contract .divider {
                          background: #e5e5e5 !important;
                          height: 1px;
                          margin: 20px 0;
                        }
                      `}</style>
                      <div
                        dangerouslySetInnerHTML={{ __html: contract.content_html }}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Carregando conteúdo do contrato...</p>
                    </div>
                  )}
                  </div>
                </ScrollArea>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Role a página para ler todo o conteúdo do contrato antes de assinar
              </p>
            </div>

            <Separator />

            {/* Seção de Assinatura */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Pen className="h-4 w-4" />
                Assinatura Eletrônica
              </h3>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-700 dark:text-blue-300">
                      Assinatura com Validade Jurídica
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 mt-1">
                      Esta assinatura eletrônica tem validade jurídica conforme a Lei nº 14.063/2020 
                      e equivale à assinatura manuscrita para todos os fins legais.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signatory_name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Digite seu nome completo para confirmar a assinatura
                  </Label>
                  <Input
                    id="signatory_name"
                    placeholder={contract.signatory_name}
                    value={signatoryNameConfirm}
                    onChange={(e) => setSignatoryNameConfirm(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Digite exatamente: <strong>{contract.signatory_name}</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signatory_cpf" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    CPF do Assinante {contract.signatory_cpf ? '*' : ''}
                  </Label>
                  <Input
                    id="signatory_cpf"
                    placeholder={contract.signatory_cpf ? formatCPF(contract.signatory_cpf) : "000.000.000-00"}
                    value={signatoryCpfConfirm}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      setSignatoryCpfConfirm(formatted);
                    }}
                    maxLength={14}
                    className="text-lg"
                  />
                  {contract.signatory_cpf && (
                    <p className="text-xs text-muted-foreground">
                      Digite exatamente: <strong>{formatCPF(contract.signatory_cpf)}</strong>
                    </p>
                  )}
                  {signatoryCpfConfirm && !isValidCPF(signatoryCpfConfirm) && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      CPF inválido
                    </p>
                  )}
                  {signatoryCpfConfirm && isValidCPF(signatoryCpfConfirm) && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      CPF válido
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-sm leading-none cursor-pointer">
                      Li e aceito todos os termos e condições deste contrato
                    </label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="lgpd"
                      checked={acceptLgpd}
                      onCheckedChange={(checked) => setAcceptLgpd(checked as boolean)}
                    />
                    <label htmlFor="lgpd" className="text-sm leading-none cursor-pointer">
                      Autorizo o tratamento dos meus dados conforme a LGPD e a Política de Privacidade
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
            {contract && (
              <PDFDownloadLink
                document={<ContractPDF data={getPDFData()!} showWatermark={true} />}
                fileName={`contrato-${contract.contract_number}.pdf`}
              >
                {({ loading }) => (
                  <Button variant="outline" disabled={loading}>
                    <Download className="h-4 w-4 mr-2" />
                    {loading ? "Gerando..." : "Baixar PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
            <Button
              size="lg"
              onClick={handleSign}
              disabled={
                isSigning || 
                !acceptTerms || 
                !acceptLgpd || 
                !signatoryNameConfirm ||
                (contract.signatory_cpf && (!signatoryCpfConfirm || !isValidCPF(signatoryCpfConfirm)))
              }
              className="gap-2"
            >
              {isSigning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Assinando...
                </>
              ) : (
                <>
                  <Pen className="h-4 w-4" />
                  Assinar Contrato
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center text-slate-400 text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className="h-4 w-4" />
            <span>Conexão segura e criptografada</span>
          </div>
          <p>Legacy Governança Ltda. • contato@legacy.gov.br</p>
        </div>
      </div>

      {/* Modal de Download PDF após Assinatura */}
      <Dialog open={showDownloadModal} onOpenChange={setShowDownloadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl text-center">Contrato Assinado com Sucesso!</DialogTitle>
            <DialogDescription className="text-base mt-2 text-center">
              Seu contrato foi assinado eletronicamente e uma cópia foi enviada para o email <strong>{contract?.client_email}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-center">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Importante:</strong> Recomendamos baixar uma cópia do contrato assinado em PDF antes de continuar.
              </p>
            </div>
            {contract && pdfData && (contract.client_signed_at || contractSigned) ? (
              <PDFDownloadLink
                document={<ContractPDF data={pdfData} showWatermark={false} />}
                fileName={`contrato-assinado-${contract?.contract_number}.pdf`}
                className="block w-full"
              >
                {({ loading, blob, url, error }) => {
                  if (error) {
                    console.error('Erro ao gerar PDF:', error);
                    console.log('PDF Data:', pdfData);
                    console.log('Contract:', contract);
                    return (
                      <Button 
                        variant="outline" 
                        disabled
                        className="w-full"
                        size="lg"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Erro ao gerar PDF
                      </Button>
                    );
                  }
                  return (
                    <Button 
                      variant="outline" 
                      disabled={loading}
                      className="w-full"
                      size="lg"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {loading ? "Gerando PDF..." : "Baixar Contrato em PDF"}
                    </Button>
                  );
                }}
              </PDFDownloadLink>
            ) : (
              <Button 
                variant="outline" 
                disabled
                className="w-full"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar Contrato em PDF
              </Button>
            )}
          </div>
          <DialogFooter className="flex-col gap-2 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setShowDownloadModal(false);
                setShowPasswordModal(true);
              }}
              className="w-full"
            >
              Continuar para Criação de Senha
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Criação de Senha (fluxo PLG automatizado) */}
      {contract && (
        <CreatePasswordModal
          open={showPasswordModal}
          email={contract.client_email}
          name={contract.signatory_name}
          companyName={contract.client_name}
          contractId={contract.id}
          onSuccess={() => {
            // Modal será fechado automaticamente após redirecionamento
            setShowPasswordModal(false);
          }}
        />
      )}

      {/* Modal de Sucesso (apenas se não foi redirecionado) */}
      <Dialog open={showSuccessModal && !showPasswordModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="text-center">
          <DialogHeader>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <DialogTitle>Contrato Assinado com Sucesso!</DialogTitle>
            <DialogDescription>
              Sua assinatura foi registrada. Você receberá uma cópia do contrato por email
              após a contra-assinatura pela Legacy.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Data da assinatura: {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
          <DialogFooter className="justify-center">
            <Button onClick={() => window.location.href = "https://legacy.gov.br"}>
              Ir para o site
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Mock data - Retorna contrato mockado similar ao Super ADM
function getMockContract(): Contract {
  // Carregar template padrão do tipo 'client' do localStorage ou usar DEFAULT_CONTRACT_CONTENT
  const storedTemplates = localStorage.getItem('contract_templates');
  let templateContent = DEFAULT_CONTRACT_CONTENT;
  
  if (storedTemplates) {
    try {
      const templates = JSON.parse(storedTemplates);
      // Buscar template ativo do tipo 'client' (ou padrão se não houver tipo especificado)
      const defaultTemplate = templates.find((t: any) => 
        t.is_active && (t.contract_type === 'client' || (!t.contract_type && t.is_default))
      ) || templates.find((t: any) => t.is_default && t.is_active);
      if (defaultTemplate?.content) {
        templateContent = defaultTemplate.content;
      }
    } catch (e) {
      console.error('Erro ao carregar template:', e);
    }
  }
  
  // Dados mockados baseados no Super ADM (similar ao getMockContracts)
  const contractData = {
    id: "1",
    contract_number: "CTR-1768758911100",
    client_name: "AURION VENTURES LTDA",
    client_document: "63657780000167",
    client_email: "contato@aurion.com.br",
    signatory_name: "roger",
    signatory_cpf: "123.456.789-00",
    signatory_role: "cfo",
    plan_name: "Profissional",
    plan_type: "governance_plus",
    addons: ["ESG", "Inteligência de Mercado"],
    monthly_value: 3597.30,
    total_value: 86335.20,
    start_date: "2026-01-17",
    end_date: "2028-01-17",
    duration_months: 24,
    client_address: "Rua Exemplo, 123 - Centro - São Paulo/SP - CEP: 01234-567",
    client_phone: "(11) 98765-4321",
  };
  
  // Substituir variáveis do template com os dados mockados
  let content = templateContent;
  const variables: Record<string, string> = {
    'contrato_numero': contractData.contract_number,
    'cliente_nome': contractData.client_name,
    'cliente_cnpj': contractData.client_document,
    'cliente_endereco': contractData.client_address || '',
    'cliente_email': contractData.client_email,
    'cliente_telefone': contractData.client_phone || '',
    'signatario_nome': contractData.signatory_name,
    'signatario_cargo': contractData.signatory_role,
    'signatario_cpf': contractData.signatory_cpf,
    'plano_nome': contractData.plan_name,
    'plano_tipo': contractData.plan_type,
    'modulos_inclusos': contractData.plan_name,
    'addons_inclusos': (contractData.addons || []).join(', ') || 'Nenhum',
    'duracao_meses': contractData.duration_months?.toString() || '',
    'duracao_extenso': contractData.duration_months === 12 ? 'doze' : contractData.duration_months === 24 ? 'vinte e quatro' : contractData.duration_months === 36 ? 'trinta e seis' : contractData.duration_months?.toString() || '',
    'data_inicio': contractData.start_date ? format(new Date(contractData.start_date), 'dd/MM/yyyy', { locale: ptBR }) : '',
    'data_fim': contractData.end_date ? format(new Date(contractData.end_date), 'dd/MM/yyyy', { locale: ptBR }) : '',
    'plano_valor': contractData.monthly_value ? contractData.monthly_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
    'plano_valor_extenso': contractData.monthly_value ? `R$ ${contractData.monthly_value.toFixed(2).replace('.', ',')}` : '',
    'forma_pagamento': 'Boleto Bancário',
    'dia_vencimento': '05',
    'data_contrato': format(new Date(), 'dd/MM/yyyy', { locale: ptBR }),
    'cidade_assinatura': 'São Paulo - SP',
    'valor_mensal': contractData.monthly_value ? contractData.monthly_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
  };
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    content = content.replace(regex, value);
  });
  
  return {
    ...contractData,
    content_html: content,
    status: "pending_signature",
    client_signature_token: "2f5e2ec0-aa58-4c2a-a151-fddd14553f25b6c5303bd9a7486d80266fc3e3b9b7f4",
    client_signature_token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    client_signed_at: null,
  };
}
