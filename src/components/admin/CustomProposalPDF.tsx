import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { SIDEBAR_SECTIONS } from '@/data/sidebarCatalog';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: '2px solid #C9A54E',
    paddingBottom: 10,
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  logoAccent: {
    color: '#C9A54E',
  },
  date: {
    fontSize: 9,
    color: '#666666',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  companySection: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
  },
  companyLabel: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
    marginTop: 16,
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: 4,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  sectionGroup: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 4,
  },
  moduleItem: {
    fontSize: 8,
    color: '#333333',
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: '#e8f4f8',
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 4,
  },
  pricingSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#1a1a2e',
    borderRadius: 6,
  },
  pricingTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#C9A54E',
    marginBottom: 12,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  pricingLabel: {
    fontSize: 9,
    color: '#ffffff',
  },
  pricingValue: {
    fontSize: 9,
    color: '#ffffff',
  },
  discountLabel: {
    fontSize: 9,
    color: '#22c55e',
  },
  discountValue: {
    fontSize: 9,
    color: '#22c55e',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px solid #C9A54E',
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#C9A54E',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C9A54E',
  },
  conditionsSection: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
  },
  conditionsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  conditionRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  conditionLabel: {
    fontSize: 8,
    color: '#666666',
    width: '40%',
  },
  conditionValue: {
    fontSize: 8,
    color: '#333333',
  },
  observationsBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 3,
    border: '1px solid #e0e0e0',
  },
  observationsLabel: {
    fontSize: 8,
    color: '#666666',
    marginBottom: 4,
  },
  observationsText: {
    fontSize: 8,
    color: '#333333',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    borderTop: '1px solid #e0e0e0',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
  },
});

interface CustomProposalPDFProps {
  companyName: string;
  selectedModules: string[];
  baseValue: number;
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
  selectedModules,
  baseValue,
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
            <Text style={styles.pricingLabel}>Valor Base</Text>
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

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL MENSAL</Text>
            <Text style={styles.totalValue}>{formatCurrency(finalValue)}</Text>
          </View>
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
            Legacy Governança Corporativa | contato@legacygovernanca.com.br | +55 47 99162-2220
          </Text>
        </View>
      </Page>
    </Document>
  );
};
