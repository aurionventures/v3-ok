import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { SIDEBAR_SECTIONS } from '@/data/sidebarCatalog';

// Logo em base64 para uso no PDF
const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDYwLCAyMDIwLzA1LzEyLTE2OjA0OjE3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTAxLTE1VDEwOjMwOjAwLTAzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTAxLTE1VDEwOjMwOjAwLTAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wMS0xNVQxMDozMDowMC0wMzowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwYWIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTIzNDU2NzgtMTIzNC0xMjM0LTEyMzQtMTIzNDU2Nzg5MGFiIiB4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';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 25,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottom: '2px solid #C9A54E',
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: 32,
    height: 32,
  },
  logo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  logoAccent: {
    color: '#C9A54E',
  },
  date: {
    fontSize: 8,
    color: '#666666',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 10,
    textAlign: 'center',
  },
  companySection: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
  },
  companyLabel: {
    fontSize: 8,
    color: '#666666',
    marginBottom: 1,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
    marginTop: 8,
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: 3,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  sectionGroup: {
    marginBottom: 6,
  },
  sectionLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 2,
  },
  moduleItem: {
    fontSize: 7,
    color: '#333333',
    paddingVertical: 1,
    paddingHorizontal: 4,
    backgroundColor: '#e8f4f8',
    borderRadius: 2,
    marginRight: 3,
    marginBottom: 3,
  },
  pricingSection: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#1a1a2e',
    borderRadius: 4,
  },
  pricingTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#C9A54E',
    marginBottom: 8,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  pricingLabel: {
    fontSize: 8,
    color: '#ffffff',
  },
  pricingValue: {
    fontSize: 8,
    color: '#ffffff',
  },
  discountLabel: {
    fontSize: 8,
    color: '#22c55e',
  },
  discountValue: {
    fontSize: 8,
    color: '#22c55e',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTop: '1px solid #C9A54E',
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#C9A54E',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#C9A54E',
  },
  conditionsSection: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
  },
  conditionsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 6,
  },
  conditionRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  conditionLabel: {
    fontSize: 7,
    color: '#666666',
    width: '40%',
  },
  conditionValue: {
    fontSize: 7,
    color: '#333333',
  },
  observationsBox: {
    marginTop: 6,
    padding: 6,
    backgroundColor: '#ffffff',
    borderRadius: 3,
    border: '1px solid #e0e0e0',
  },
  observationsLabel: {
    fontSize: 7,
    color: '#666666',
    marginBottom: 2,
  },
  observationsText: {
    fontSize: 7,
    color: '#333333',
    lineHeight: 1.3,
  },
  footer: {
    marginTop: 12,
    borderTop: '1px solid #e0e0e0',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: '#666666',
    textAlign: 'center',
  },
});

interface CustomProposalPDFProps {
  companyName: string;
  responsibleName?: string;
  selectedModules: string[];
  baseValue: number;
  setupValue?: number;
  discountPercent: number;
  discountValue: number;
  finalValue: number;
  validityDays: number;
  observations?: string;
}

const formatCurrency = (value: number) => {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
};

export const CustomProposalPDF = ({
  companyName,
  responsibleName,
  selectedModules,
  baseValue,
  setupValue = 0,
  discountPercent,
  discountValue,
  finalValue,
  validityDays,
  observations,
}: CustomProposalPDFProps) => {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Organiza módulos por seção
  const modulesBySection = SIDEBAR_SECTIONS.map(section => ({
    label: section.label,
    modules: section.items.filter(item => selectedModules.includes(item.key)),
  })).filter(s => s.modules.length > 0);

  const calculatedDiscount = discountPercent > 0 
    ? baseValue * (discountPercent / 100) 
    : discountValue;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={{ width: 28, height: 28, backgroundColor: '#C9A54E', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: 'bold' }}>L</Text>
            </View>
            <Text style={styles.logo}>
              LEGACY <Text style={styles.logoAccent}>GOVERNANÇA</Text>
            </Text>
          </View>
          <Text style={styles.date}>{currentDate}</Text>
        </View>

        <Text style={styles.title}>Proposta Comercial Personalizada</Text>
        <Text style={styles.subtitle}>Solução de Governança Corporativa sob medida</Text>

        <View style={styles.companySection}>
          <Text style={styles.companyLabel}>Elaborada para:</Text>
          <Text style={styles.companyName}>{companyName}</Text>
          {responsibleName && (
            <View style={{ marginTop: 4 }}>
              <Text style={styles.companyLabel}>Responsável:</Text>
              <Text style={[styles.companyName, { fontSize: 10 }]}>{responsibleName}</Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Módulos Incluídos ({selectedModules.length})</Text>
        
        {modulesBySection.map((section, idx) => (
          <View key={idx} style={styles.sectionGroup}>
            <Text style={styles.sectionLabel}>{section.label}</Text>
            <View style={styles.modulesGrid}>
              {section.modules.map((module, mIdx) => (
                <Text key={mIdx} style={styles.moduleItem}>{module.label}</Text>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.pricingSection}>
          <Text style={styles.pricingTitle}>Investimento</Text>
          
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Valor Base (mensal)</Text>
            <Text style={styles.pricingValue}>{formatCurrency(baseValue)}/mês</Text>
          </View>

          {calculatedDiscount > 0 && (
            <View style={styles.pricingRow}>
              <Text style={styles.discountLabel}>
                Desconto {discountPercent > 0 ? `(${discountPercent}%)` : ''}
              </Text>
              <Text style={styles.discountValue}>- {formatCurrency(calculatedDiscount)}</Text>
            </View>
          )}

          {/* Total Recorrente */}
          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>TOTAL RECORRENTE</Text>
              <Text style={{ fontSize: 6, color: '#999999' }}>Valor mensal</Text>
            </View>
            <Text style={styles.totalValue}>{formatCurrency(finalValue)}</Text>
          </View>

          {/* Total Setup */}
          {setupValue > 0 && (
            <View style={[styles.pricingRow, { marginTop: 8, paddingTop: 6, borderTop: '1px solid #C9A54E' }]}>
              <View>
                <Text style={[styles.pricingLabel, { fontWeight: 'bold', color: '#60a5fa' }]}>TOTAL SETUP</Text>
                <Text style={{ fontSize: 6, color: '#999999' }}>Pagamento único</Text>
              </View>
              <Text style={[styles.pricingValue, { fontSize: 10, fontWeight: 'bold', color: '#60a5fa' }]}>{formatCurrency(setupValue)}</Text>
            </View>
          )}

          {/* Nota de contrato mínimo */}
          <Text style={{ fontSize: 7, color: '#666666', fontStyle: 'italic', textAlign: 'center', marginTop: 10 }}>
            Valor da mensalidade válido para contrato mínimo de 24 meses.
          </Text>
        </View>

        <View style={styles.conditionsSection}>
          <Text style={styles.conditionsTitle}>Condições Comerciais</Text>
          
          <View style={styles.conditionRow}>
            <Text style={styles.conditionLabel}>Validade da Proposta:</Text>
            <Text style={styles.conditionValue}>{validityDays} dias</Text>
          </View>
          
          <View style={styles.conditionRow}>
            <Text style={styles.conditionLabel}>Forma de Pagamento:</Text>
            <Text style={styles.conditionValue}>Mensal via boleto ou cartão</Text>
          </View>
          
          <View style={styles.conditionRow}>
            <Text style={styles.conditionLabel}>Início do Serviço:</Text>
            <Text style={styles.conditionValue}>Imediato após confirmação</Text>
          </View>

          {observations && (
            <View style={styles.observationsBox}>
              <Text style={styles.observationsLabel}>Observações:</Text>
              <Text style={styles.observationsText}>{observations}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Legacy Tecnologia para Governança Corporativa
          </Text>
        </View>
      </Page>
    </Document>
  );
};
