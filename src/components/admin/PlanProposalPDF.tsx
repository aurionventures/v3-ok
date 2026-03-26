import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CompanySize, COMPANY_SIZE_LABELS } from '@/types/organization';
import { BASE_MODULES, ADDON_MODULES } from '@/utils/moduleMatrix';
import { SIDEBAR_SECTIONS } from '@/data/sidebarCatalog';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 20,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottom: '1.5px solid #C9A54E',
    paddingBottom: 8,
  },
  logo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  logoAccent: {
    color: '#C9A54E',
  },
  date: {
    fontSize: 7,
    color: '#666666',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
    textAlign: 'center',
  },
  companySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 3,
  },
  companyName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  planName: {
    fontSize: 9,
    color: '#C9A54E',
    fontWeight: 'bold',
  },
  pricingSection: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 6,
    borderBottom: '0.5px solid #e0e0e0',
    paddingBottom: 3,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  priceLabel: {
    fontSize: 7,
    color: '#333333',
  },
  priceValue: {
    fontSize: 7,
    color: '#333333',
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginTop: 4,
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 8,
    borderRadius: 3,
  },
  totalLabel: {
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 8,
    color: '#C9A54E',
    fontWeight: 'bold',
  },
  modulesSection: {
    marginBottom: 8,
  },
  modulesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    borderBottom: '0.5px solid #e0e0e0',
    paddingBottom: 3,
  },
  modulesTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  legendText: {
    fontSize: 6,
    color: '#666666',
  },
  columnsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  column: {
    flex: 1,
  },
  sectionBlock: {
    marginBottom: 6,
  },
  sectionLabel: {
    fontSize: 6,
    fontWeight: 'bold',
    color: '#C9A54E',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 1,
    paddingLeft: 4,
  },
  moduleMarker: {
    fontSize: 6,
    width: 10,
  },
  moduleIncluded: {
    color: '#22c55e',
  },
  moduleExcluded: {
    color: '#d1d5db',
  },
  moduleText: {
    fontSize: 6,
    color: '#333333',
  },
  moduleTextExcluded: {
    fontSize: 6,
    color: '#9ca3af',
  },
  footer: {
    position: 'absolute',
    bottom: 12,
    left: 20,
    right: 20,
    borderTop: '0.5px solid #e0e0e0',
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  footerText: {
    fontSize: 6,
    color: '#666666',
  },
  footerContact: {
    fontSize: 6,
    color: '#C9A54E',
  },
  discountBadge: {
    backgroundColor: '#22c55e',
    color: '#ffffff',
    fontSize: 5,
    padding: '1 4',
    borderRadius: 2,
    marginLeft: 6,
  },
  originalPrice: {
    fontSize: 6,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

interface PlanProposalPDFProps {
  companyName: string;
  selectedSize: CompanySize;
  selectedAddons: string[];
  isFullPackage: boolean;
  planPrice: number;
  addonPrices: { esg: number; market_intel: number };
  fullPackagePrice: { original: number; discounted: number };
}

const formatCurrency = (value: number) => {
  return `R$ ${value.toLocaleString('pt-BR')}`;
};

// Define section order for left and right columns
const LEFT_SECTIONS = ['INÍCIO', 'PARAMETRIZAÇÃO', 'PREPARAÇÃO', 'DESENVOLVIMENTO'];
const RIGHT_SECTIONS = ['ESTRUTURAÇÃO', 'MONITORAMENTO', 'ESG', 'INTELIGÊNCIA DE MERCADO', 'OTIMIZAÇÃO'];

export const PlanProposalPDF = ({
  companyName,
  selectedSize,
  selectedAddons,
  isFullPackage,
  planPrice,
  addonPrices,
  fullPackagePrice,
}: PlanProposalPDFProps) => {
  const enabledModules = BASE_MODULES[selectedSize];
  const hasESG = selectedAddons.includes('esg_maturity') || isFullPackage;
  const hasMarketIntel = selectedAddons.includes('market_intel') || isFullPackage;
  
  const baseTotal = planPrice;
  const addonsTotal = (hasESG ? addonPrices.esg : 0) + (hasMarketIntel ? addonPrices.market_intel : 0);
  const finalTotal = isFullPackage ? fullPackagePrice.discounted : baseTotal + addonsTotal;
  
  // Check if a module is included
  const isModuleIncluded = (moduleKey: string) => {
    if (enabledModules.includes(moduleKey as any)) return true;
    if (moduleKey === 'esg_maturity' && hasESG) return true;
    if ((moduleKey === 'market_intel' || moduleKey === 'benchmarking') && hasMarketIntel) return true;
    return false;
  };

  // Get all modules organized by section
  const getAllModulesBySection = () => {
    return SIDEBAR_SECTIONS.map(section => ({
      section: section.label,
      modules: section.items.map(item => ({
        key: item.key,
        label: item.label,
        included: isModuleIncluded(item.key)
      }))
    }));
  };

  const allModules = getAllModulesBySection();
  const leftModules = allModules.filter(s => LEFT_SECTIONS.includes(s.section));
  const rightModules = allModules.filter(s => RIGHT_SECTIONS.includes(s.section));

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const renderModuleSection = (sectionData: { section: string; modules: { key: string; label: string; included: boolean }[] }) => (
    <View key={sectionData.section} style={styles.sectionBlock}>
      <Text style={styles.sectionLabel}>{sectionData.section}</Text>
      {sectionData.modules.map((module) => (
        <View key={module.key} style={styles.moduleRow}>
          <Text style={[styles.moduleMarker, module.included ? styles.moduleIncluded : styles.moduleExcluded]}>
            {module.included ? '●' : '○'}
          </Text>
          <Text style={module.included ? styles.moduleText : styles.moduleTextExcluded}>
            {module.label}
          </Text>
        </View>
      ))}
    </View>
  );

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

        <Text style={styles.title}>Proposta Comercial</Text>

        <View style={styles.companySection}>
          <Text style={styles.companyName}>{companyName || 'Empresa'}</Text>
          <Text style={styles.planName}>
            Plano {COMPANY_SIZE_LABELS[selectedSize]}
            {isFullPackage && ' + Pacote Full'}
          </Text>
        </View>

        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Investimento Mensal</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Plano {COMPANY_SIZE_LABELS[selectedSize]}</Text>
            <Text style={styles.priceValue}>{formatCurrency(planPrice)}</Text>
          </View>

          {hasESG && !isFullPackage && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Add-on ESG</Text>
              <Text style={styles.priceValue}>{formatCurrency(addonPrices.esg)}</Text>
            </View>
          )}

          {hasMarketIntel && !isFullPackage && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Add-on Inteligência de Mercado</Text>
              <Text style={styles.priceValue}>{formatCurrency(addonPrices.market_intel)}</Text>
            </View>
          )}

          {isFullPackage && (
            <View style={styles.priceRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.priceLabel}>Pacote Full (ESG + Intel. Mercado)</Text>
                <Text style={styles.discountBadge}>ECONOMIA</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.originalPrice}>{formatCurrency(fullPackagePrice.original)}</Text>
                <Text style={styles.priceValue}>{formatCurrency(fullPackagePrice.discounted)}</Text>
              </View>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL MENSAL</Text>
            <Text style={styles.totalValue}>{formatCurrency(finalTotal)}</Text>
          </View>
        </View>

        <View style={styles.modulesSection}>
          <View style={styles.modulesHeader}>
            <Text style={styles.modulesTitle}>Módulos da Plataforma</Text>
            <Text style={styles.legendText}>● Incluído   ○ Não Incluído</Text>
          </View>
          
          <View style={styles.columnsContainer}>
            <View style={styles.column}>
              {leftModules.map(renderModuleSection)}
            </View>
            <View style={styles.column}>
              {rightModules.map(renderModuleSection)}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Proposta válida por 30 dias</Text>
          <Text style={styles.footerContact}>contato@legacygovernanca.com.br</Text>
          <Text style={styles.footerContact}>+55 47 99162-2220</Text>
        </View>
      </Page>
    </Document>
  );
};
