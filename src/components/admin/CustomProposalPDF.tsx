import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { SIDEBAR_SECTIONS } from '@/data/sidebarCatalog';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 25,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottom: '2px solid #C9A54E',
    paddingBottom: 8,
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
          <View>
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
