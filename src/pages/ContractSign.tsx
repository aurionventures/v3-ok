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
import { DEFAULT_CONTRACT_CONTENT } from "@/components/contracts/ContractTemplateEditor";

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
  client_signature_token_expires_at: string;
  client_signed_at: string | null;
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
        // Use mock for development
        const mockContract = getMockContract();
        // Garantir que content_html esteja preenchido
        if (!mockContract.content_html || mockContract.content_html.trim() === '' || mockContract.content_html.includes('Conteúdo do contrato...')) {
          // Recarregar template e substituir variáveis
          const storedTemplates = localStorage.getItem('contract_templates');
          let templateContent = DEFAULT_CONTRACT_CONTENT;
          
          if (storedTemplates) {
            try {
              const templates = JSON.parse(storedTemplates);
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
          
          // Substituir variáveis do template
          let content = templateContent;
          const variables: Record<string, string> = {
            'contrato_numero': mockContract.contract_number || '',
            'cliente_nome': mockContract.client_name || '',
            'cliente_cnpj': mockContract.client_document || '',
            'cliente_endereco': 'Rua Exemplo, 123 - Centro - São Paulo/SP - CEP: 01234-567',
            'cliente_email': mockContract.client_email || '',
            'cliente_telefone': '(11) 98765-4321',
            'signatario_nome': mockContract.signatory_name || '',
            'signatario_cargo': mockContract.signatory_role || '',
            'signatario_cpf': mockContract.signatory_cpf || '',
            'plano_nome': mockContract.plan_name || '',
            'plano_tipo': mockContract.plan_type || '',
            'modulos_inclusos': mockContract.plan_name || '',
            'addons_inclusos': (mockContract.addons || []).join(', ') || 'Nenhum',
            'duracao_meses': mockContract.duration_months?.toString() || '',
            'duracao_extenso': mockContract.duration_months === 12 ? 'doze' : mockContract.duration_months === 24 ? 'vinte e quatro' : mockContract.duration_months === 36 ? 'trinta e seis' : mockContract.duration_months?.toString() || '',
            'data_inicio': mockContract.start_date ? format(new Date(mockContract.start_date), 'dd/MM/yyyy', { locale: ptBR }) : '',
            'data_fim': mockContract.end_date ? format(new Date(mockContract.end_date), 'dd/MM/yyyy', { locale: ptBR }) : '',
            'plano_valor': mockContract.monthly_value ? mockContract.monthly_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
            'plano_valor_extenso': mockContract.monthly_value ? `R$ ${mockContract.monthly_value.toFixed(2).replace('.', ',')}` : '',
            'forma_pagamento': 'Boleto Bancário',
            'dia_vencimento': '05',
            'data_contrato': format(new Date(), 'dd/MM/yyyy', { locale: ptBR }),
            'cidade_assinatura': 'São Paulo - SP',
            'valor_mensal': mockContract.monthly_value ? mockContract.monthly_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
          };
          
          Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            content = content.replace(regex, value);
          });
          
          mockContract.content_html = content;
        }
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

      // Se o contrato não tiver content_html ou estiver vazio, carregar do template padrão do tipo 'client'
      if (!data.content_html || data.content_html.trim() === '' || data.content_html.includes('Conteúdo do contrato...')) {
        const storedTemplates = localStorage.getItem('contract_templates');
        if (storedTemplates) {
          try {
            const templates = JSON.parse(storedTemplates);
            // Buscar template ativo do tipo 'client' (ou padrão se não houver tipo especificado)
            const defaultTemplate = templates.find((t: any) => 
              t.is_active && (t.contract_type === 'client' || (!t.contract_type && t.is_default))
            ) || templates.find((t: any) => t.is_default && t.is_active);
            if (defaultTemplate?.content) {
              // Substituir variáveis do template com dados do contrato
              let content = defaultTemplate.content;
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
              
              data.content_html = content;
            }
          } catch (e) {
            console.error('Erro ao carregar template:', e);
            // Se não conseguir carregar do template, usar DEFAULT_CONTRACT_CONTENT
            if (!data.content_html || data.content_html.trim() === '') {
              data.content_html = DEFAULT_CONTRACT_CONTENT;
            }
          }
        } else {
          // Se não houver templates no localStorage, usar DEFAULT_CONTRACT_CONTENT
          if (!data.content_html || data.content_html.trim() === '') {
            data.content_html = DEFAULT_CONTRACT_CONTENT;
          }
        }
      }

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
      const storedContracts = localStorage.getItem('contracts') || '[]';
      const contracts = JSON.parse(storedContracts);
      const updatedContracts = contracts.map((c: any) => 
        c.id === contract.id 
          ? {
              ...c,
              status: "pending_counter_signature",
              client_signed_at: new Date().toISOString(),
              client_signature_ip: clientIP,
              client_signature_user_agent: navigator.userAgent,
              client_signature_hash: signatureHash,
              signatory_cpf_confirmed: signatoryCpfConfirm || contract.signatory_cpf || null,
            }
          : c
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

      // Atualizar estado do contrato local
      setContract(prev => prev ? { ...prev, client_signed_at: new Date().toISOString(), status: "pending_counter_signature" } : null);
      setContractSigned(true);

      // Mostrar modal de download PDF antes de avançar para senha
      setShowDownloadModal(true);
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

  // Preparar dados para PDF
  const getPDFData = (): ContractData | null => {
    if (!contract) return null;

    return {
      contractNumber: contract.contract_number,
      status: contract.status as any,
      clientName: contract.client_name,
      clientDocument: contract.client_document,
      clientEmail: contract.client_email,
      signatoryName: contract.signatory_name,
      signatoryRole: contract.signatory_role,
      planName: contract.plan_name,
      planType: contract.plan_type,
      addons: contract.addons || [],
      monthlyValue: contract.monthly_value,
      totalValue: contract.total_value,
      startDate: contract.start_date,
      endDate: contract.end_date,
      durationMonths: contract.duration_months,
      clientSignedAt: contract.client_signed_at || undefined,
      generatedAt: new Date().toISOString(),
    };
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

  const pdfData = getPDFData();

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

            {/* Conteúdo do Contrato */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Termos do Contrato
              </h3>
              <div className="border rounded-lg bg-white overflow-hidden">
                <ScrollArea className="h-[600px] p-6">
                  {contract?.content_html ? (
                    <div
                      className="prose prose-sm max-w-none prose-headings:font-semibold prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal"
                      dangerouslySetInnerHTML={{ __html: contract.content_html }}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Carregando conteúdo do contrato...</p>
                    </div>
                  )}
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
            {contract && getPDFData() ? (
              <PDFDownloadLink
                document={<ContractPDF data={getPDFData()!} showWatermark={false} />}
                fileName={`contrato-assinado-${contract?.contract_number}.pdf`}
                className="block"
              >
                {({ loading }) => (
                  <Button 
                    variant="outline" 
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {loading ? "Gerando PDF..." : "Baixar Contrato em PDF"}
                  </Button>
                )}
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

// Mock data
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
  
  // Substituir variáveis básicas para o mock
  let content = templateContent
    .replace(/\{\{contrato_numero\}\}/g, 'CONT-2026-0001')
    .replace(/\{\{cliente_nome\}\}/g, 'Empresa ABC Ltda')
    .replace(/\{\{cliente_cnpj\}\}/g, '12.345.678/0001-90')
    .replace(/\{\{cliente_endereco\}\}/g, 'Rua Exemplo, 123 - Centro - São Paulo/SP - CEP: 01234-567')
    .replace(/\{\{cliente_email\}\}/g, 'contato@empresaabc.com.br')
    .replace(/\{\{cliente_telefone\}\}/g, '(11) 98765-4321')
    .replace(/\{\{signatario_nome\}\}/g, 'João Silva')
    .replace(/\{\{signatario_cargo\}\}/g, 'Diretor de Governança')
    .replace(/\{\{signatario_cpf\}\}/g, '123.456.789-00')
    .replace(/\{\{plano_nome\}\}/g, 'Profissional')
    .replace(/\{\{plano_tipo\}\}/g, 'governance_plus')
    .replace(/\{\{modulos_inclusos\}\}/g, 'Módulos do plano Profissional')
    .replace(/\{\{addons_inclusos\}\}/g, 'ESG, Inteligência de Mercado')
    .replace(/\{\{duracao_meses\}\}/g, '24')
    .replace(/\{\{duracao_extenso\}\}/g, 'vinte e quatro')
    .replace(/\{\{data_inicio\}\}/g, '31/12/2025')
    .replace(/\{\{data_fim\}\}/g, '30/12/2027')
    .replace(/\{\{plano_valor\}\}/g, 'R$ 8.497,00')
    .replace(/\{\{plano_valor_extenso\}\}/g, 'R$ 8497,00')
    .replace(/\{\{forma_pagamento\}\}/g, 'Boleto Bancário')
    .replace(/\{\{dia_vencimento\}\}/g, '05')
    .replace(/\{\{data_contrato\}\}/g, new Date().toLocaleDateString('pt-BR'))
    .replace(/\{\{cidade_assinatura\}\}/g, 'São Paulo - SP')
    .replace(/\{\{valor_mensal\}\}/g, 'R$ 8.497,00');
  
  return {
    id: "1",
    contract_number: "CONT-2026-0001",
    client_name: "Empresa ABC Ltda",
    client_document: "12.345.678/0001-90",
    client_email: "contato@empresaabc.com.br",
    signatory_name: "João Silva",
    signatory_cpf: "123.456.789-00",
    signatory_role: "Diretor de Governança",
    plan_name: "Profissional",
    plan_type: "governance_plus",
    addons: ["ESG", "Inteligência de Mercado"],
    monthly_value: 8497,
    total_value: 203928,
    start_date: "2025-12-31",
    end_date: "2027-12-30",
    duration_months: 24,
    content_html: content,
    status: "pending_signature",
    client_signature_token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    client_signed_at: null,
  };
}
