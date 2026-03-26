/**
 * Componente de Geração de PDF do Contrato
 * Usa @react-pdf/renderer para gerar PDFs profissionais
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Registrar fontes
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2",
      fontWeight: 700,
    },
  ],
});

// Estilos do PDF
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Inter",
    fontSize: 10,
    lineHeight: 1.5,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 30,
    textAlign: "center",
  },
  logo: {
    width: 120,
    marginBottom: 15,
    alignSelf: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 5,
    color: "#1e3a5f",
  },
  subtitle: {
    fontSize: 10,
    textAlign: "center",
    color: "#666",
  },
  contractNumber: {
    fontSize: 11,
    fontWeight: 600,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 8,
    color: "#1e3a5f",
    borderBottom: "1px solid #e5e5e5",
    paddingBottom: 4,
  },
  paragraph: {
    fontSize: 10,
    marginBottom: 6,
    textAlign: "justify",
  },
  bold: {
    fontWeight: 600,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: "30%",
    fontWeight: 600,
    color: "#444",
  },
  value: {
    width: "70%",
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
    border: "1px solid #e5e5e5",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e5e5e5",
  },
  tableRowLast: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
  },
  tableCell: {
    padding: 8,
    flex: 1,
    fontSize: 9,
  },
  tableCellHeader: {
    fontWeight: 700,
  },
  signatureSection: {
    marginTop: 40,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60,
  },
  signatureBlock: {
    width: "45%",
    textAlign: "center",
  },
  signatureLine: {
    borderTop: "1px solid #000",
    paddingTop: 8,
    marginTop: 40,
  },
  signatureName: {
    fontWeight: 600,
    fontSize: 10,
  },
  signatureRole: {
    fontSize: 9,
    color: "#666",
  },
  signatureInfo: {
    marginTop: 10,
    fontSize: 8,
    color: "#888",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: "center",
    fontSize: 8,
    color: "#888",
    borderTop: "1px solid #e5e5e5",
    paddingTop: 10,
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 50,
    fontSize: 8,
    color: "#888",
  },
  watermark: {
    position: "absolute",
    top: "45%",
    left: "25%",
    fontSize: 60,
    color: "#f0f0f0",
    transform: "rotate(-45deg)",
    opacity: 0.3,
  },
  statusBadge: {
    backgroundColor: "#22c55e",
    color: "#fff",
    padding: "4 8",
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 600,
    alignSelf: "center",
  },
  statusBadgePending: {
    backgroundColor: "#f59e0b",
  },
});

// Interface para os dados do contrato
export interface ContractData {
  contractNumber: string;
  status: 'draft' | 'pending_signature' | 'active' | 'expired' | 'cancelled';
  
  // Dados do Cliente
  clientName: string;
  clientDocument: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  
  // Signatário
  signatoryName: string;
  signatoryRole: string;
  signatoryDocument?: string;
  
  // Plano
  planName: string;
  planType: string;
  addons: string[];
  monthlyValue: number;
  totalValue: number;
  
  // Vigência
  startDate: string;
  endDate: string;
  durationMonths: number;
  
  // Assinaturas
  clientSignedAt?: string;
  clientSignatureIp?: string;
  counterSignedAt?: string;
  counterSignedBy?: string;
  
  // Data de geração
  generatedAt: string;
}

interface ContractPDFProps {
  data: ContractData;
  showWatermark?: boolean;
}

// Componente principal do PDF
export function ContractPDF({ data, showWatermark = false }: ContractPDFProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: "Rascunho",
      pending_signature: "Aguardando Assinatura",
      pending_counter_signature: "Aguardando Contrassinatura",
      active: "Ativo",
      expired: "Expirado",
      cancelled: "Cancelado",
    };
    return labels[status] || status;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Marca d'água */}
        {showWatermark && data.status === 'draft' && (
          <Text style={styles.watermark}>MINUTA</Text>
        )}

        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>
            CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE SOFTWARE COMO SERVIÇO (SaaS)
          </Text>
          <Text style={styles.subtitle}>PLATAFORMA LEGACY OS</Text>
          <Text style={styles.contractNumber}>Contrato nº {data.contractNumber}</Text>
          <View style={[styles.statusBadge, data.status === 'pending_signature' ? styles.statusBadgePending : {}]}>
            <Text>{getStatusLabel(data.status)}</Text>
          </View>
        </View>

        {/* Seção: Partes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PARTES</Text>
          
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>CONTRATADA: </Text>
            LEGACY GOVERNANÇA LTDA., pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 00.000.000/0001-00, 
            com sede na cidade de São Paulo, Estado de São Paulo, neste ato representada na forma de seu Contrato Social, 
            doravante denominada simplesmente "LEGACY".
          </Text>
          
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>CONTRATANTE: </Text>
            {data.clientName}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº {data.clientDocument}, 
            {data.clientAddress && ` com sede em ${data.clientAddress},`} neste ato representada por {data.signatoryName}, {data.signatoryRole}
            {data.signatoryDocument && `, portador(a) do CPF nº ${data.signatoryDocument}`}, doravante denominada simplesmente "CONTRATANTE".
          </Text>
        </View>

        {/* Seção: Objeto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CLÁUSULA 1ª - DO OBJETO</Text>
          <Text style={styles.paragraph}>
            1.1. O presente contrato tem por objeto a prestação de serviços de acesso e uso da plataforma de governança 
            corporativa "LEGACY OS", na modalidade Software como Serviço (SaaS), conforme plano contratado.
          </Text>
          
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>Item</Text>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>Descrição</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Plano Contratado</Text>
              <Text style={styles.tableCell}>{data.planName}</Text>
            </View>
            {data.addons.length > 0 && (
              <View style={styles.tableRowLast}>
                <Text style={styles.tableCell}>Add-ons</Text>
                <Text style={styles.tableCell}>{data.addons.join(", ")}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Seção: Prazo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CLÁUSULA 2ª - DO PRAZO</Text>
          <Text style={styles.paragraph}>
            2.1. O presente contrato terá vigência de {data.durationMonths} ({numberToWords(data.durationMonths)}) meses, 
            com início em {formatDate(data.startDate)} e término em {formatDate(data.endDate)}.
          </Text>
          <Text style={styles.paragraph}>
            2.2. Findo o prazo de vigência, o contrato será automaticamente renovado por igual período, 
            salvo manifestação contrária de qualquer das partes, com antecedência mínima de 30 (trinta) dias.
          </Text>
        </View>

        {/* Seção: Preço */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CLÁUSULA 3ª - DO PREÇO E FORMA DE PAGAMENTO</Text>
          <Text style={styles.paragraph}>
            3.1. Pela prestação dos serviços objeto deste contrato, a CONTRATANTE pagará à LEGACY o valor mensal de{" "}
            <Text style={styles.bold}>{formatCurrency(data.monthlyValue)}</Text>.
          </Text>
          <Text style={styles.paragraph}>
            3.2. O valor total do contrato para o período de vigência é de{" "}
            <Text style={styles.bold}>{formatCurrency(data.totalValue)}</Text>.
          </Text>
          <Text style={styles.paragraph}>
            3.3. O pagamento será realizado mensalmente, até o dia 10 (dez) de cada mês, mediante boleto bancário ou PIX.
          </Text>
        </View>

        {/* Rodapé da página */}
        <Text style={styles.footer}>
          Legacy Governança Ltda. • CNPJ: 00.000.000/0001-00 • contato@legacy.gov.br
        </Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Page>

      {/* Página 2: Obrigações e Disposições Finais */}
      <Page size="A4" style={styles.page}>
        {showWatermark && data.status === 'draft' && (
          <Text style={styles.watermark}>MINUTA</Text>
        )}

        {/* Seção: Obrigações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CLÁUSULA 4ª - DAS OBRIGAÇÕES DA LEGACY</Text>
          <Text style={styles.paragraph}>4.1. Disponibilizar acesso à plataforma LEGACY OS conforme plano contratado;</Text>
          <Text style={styles.paragraph}>4.2. Garantir disponibilidade mínima de 99,5% (noventa e nove vírgula cinco por cento) mensal;</Text>
          <Text style={styles.paragraph}>4.3. Prestar suporte técnico via chat, email e telefone em horário comercial;</Text>
          <Text style={styles.paragraph}>4.4. Manter backup diário dos dados da CONTRATANTE;</Text>
          <Text style={styles.paragraph}>4.5. Implementar e manter medidas de segurança adequadas à proteção dos dados.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CLÁUSULA 5ª - DAS OBRIGAÇÕES DA CONTRATANTE</Text>
          <Text style={styles.paragraph}>5.1. Efetuar os pagamentos nas datas acordadas;</Text>
          <Text style={styles.paragraph}>5.2. Utilizar a plataforma de acordo com as políticas de uso aceitável;</Text>
          <Text style={styles.paragraph}>5.3. Manter atualizados seus dados cadastrais;</Text>
          <Text style={styles.paragraph}>5.4. Não compartilhar credenciais de acesso com terceiros;</Text>
          <Text style={styles.paragraph}>5.5. Zelar pela confidencialidade das informações acessadas.</Text>
        </View>

        {/* Seção: LGPD */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CLÁUSULA 6ª - DA PROTEÇÃO DE DADOS (LGPD)</Text>
          <Text style={styles.paragraph}>
            6.1. As partes se comprometem a cumprir a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
          </Text>
          <Text style={styles.paragraph}>
            6.2. A LEGACY atua como operadora dos dados pessoais inseridos pela CONTRATANTE na plataforma.
          </Text>
        </View>

        {/* Seção: Disposições Gerais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CLÁUSULA 7ª - DAS DISPOSIÇÕES GERAIS</Text>
          <Text style={styles.paragraph}>
            7.1. Este contrato é celebrado eletronicamente, com validade jurídica nos termos da Lei nº 14.063/2020.
          </Text>
          <Text style={styles.paragraph}>
            7.2. A assinatura eletrônica deste contrato equivale à assinatura manuscrita para todos os fins legais.
          </Text>
          <Text style={styles.paragraph}>
            7.3. Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias.
          </Text>
        </View>

        {/* Assinaturas */}
        <View style={styles.signatureSection}>
          <Text style={[styles.paragraph, { textAlign: "center", marginBottom: 20 }]}>
            São Paulo, {formatDate(data.generatedAt)}
          </Text>

          <View style={styles.signatureRow}>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureName}>LEGACY GOVERNANÇA LTDA.</Text>
                <Text style={styles.signatureRole}>CNPJ: 00.000.000/0001-00</Text>
              </View>
              {data.counterSignedAt && (
                <Text style={styles.signatureInfo}>
                  Assinado em: {new Date(data.counterSignedAt).toLocaleString("pt-BR")}
                </Text>
              )}
            </View>

            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureName}>{data.clientName}</Text>
                <Text style={styles.signatureRole}>CNPJ: {data.clientDocument}</Text>
                <Text style={styles.signatureRole}>{data.signatoryName}</Text>
                <Text style={styles.signatureRole}>{data.signatoryRole}</Text>
              </View>
              {data.clientSignedAt && (
                <Text style={styles.signatureInfo}>
                  Assinado em: {new Date(data.clientSignedAt).toLocaleString("pt-BR")}
                  {data.clientSignatureIp && `\nIP: ${data.clientSignatureIp}`}
                </Text>
              )}
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Legacy Governança Ltda. • CNPJ: 00.000.000/0001-00 • contato@legacy.gov.br
        </Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Page>
    </Document>
  );
}

// Função auxiliar para converter número em palavras
function numberToWords(num: number): string {
  const units = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
  const teens = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  const tens = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  
  if (num === 0) return "zero";
  if (num < 10) return units[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const unit = num % 10;
    return tens[ten] + (unit > 0 ? " e " + units[unit] : "");
  }
  return num.toString();
}

export default ContractPDF;
