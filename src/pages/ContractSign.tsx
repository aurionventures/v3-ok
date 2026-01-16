/**
 * Página Pública: Assinatura de Contrato
 * Permite que o cliente visualize e assine o contrato eletronicamente
 */

import { useState, useEffect } from "react";
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
  Shield, Lock, Pen, Building2, Calendar, DollarSign, User
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ContractPDF, ContractData } from "@/components/contracts/ContractPDF";
import { CreatePasswordModal } from "@/components/modals/CreatePasswordModal";
import { formatCPF, isValidCPF, onlyNumbers } from "@/utils/masks";

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
        setContract(getMockContract());
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

      // Mostrar modal de criação de senha (fluxo PLG automatizado)
      setShowPasswordModal(true);
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
              <ScrollArea className="h-[400px] border rounded-lg p-4 bg-white">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: contract.content_html }}
                />
              </ScrollArea>
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
            {pdfData && (
              <PDFDownloadLink
                document={<ContractPDF data={pdfData} showWatermark={true} />}
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
    content_html: `
      <h2>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h2>
      <p>Este contrato é celebrado entre as partes...</p>
      <h3>CLÁUSULA 1ª - DO OBJETO</h3>
      <p>O presente contrato tem por objeto a prestação de serviços de acesso à plataforma LEGACY OS...</p>
      <h3>CLÁUSULA 2ª - DO PRAZO</h3>
      <p>O contrato terá vigência de 24 meses...</p>
      <h3>CLÁUSULA 3ª - DO VALOR</h3>
      <p>O valor mensal é de R$ 8.497,00...</p>
    `,
    status: "pending_signature",
    client_signature_token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    client_signed_at: null,
  };
}
