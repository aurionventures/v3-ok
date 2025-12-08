import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { COMPANY_SIZE_LABELS } from '@/types/organization';
import { BASE_MODULES, PLAN_PRICES, ADDON_PRICES, FULL_PACKAGE } from '@/utils/moduleMatrix';
import { SIDEBAR_SECTIONS } from '@/data/sidebarCatalog';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 15,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottom: '1.5px solid #C9A54E',
    paddingBottom: 6,
  },
  logo: {
    fontSize: 12,
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
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 7,
    color: '#666666',
    marginBottom: 6,
    textAlign: 'center',
  },
  table: {
    marginBottom: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    paddingVertical: 4,
    paddingHorizontal: 3,
  },
  tableHeaderCell: {
    fontSize: 5.5,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  moduleCol: {
    width: '22%',
    textAlign: 'left',
    paddingLeft: 3,
  },
  planCol: {
    width: '13%',
    textAlign: 'center',
  },
  addonCol: {
    width: '6.5%',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5px solid #e0e0e0',
    paddingVertical: 2,
    paddingHorizontal: 3,
  },
  tableRowAlt: {
    backgroundColor: '#f8f9fa',
  },
  sectionRow: {
    flexDirection: 'row',
    backgroundColor: '#e8e8e8',
    paddingVertical: 2,
    paddingHorizontal: 3,
  },
  sectionTitle: {
    fontSize: 5.5,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  moduleCell: {
    fontSize: 5,
    color: '#333333',
    width: '22%',
    paddingLeft: 6,
  },
  checkCell: {
    fontSize: 6,
    width: '13%',
    textAlign: 'center',
  },
  addonCheckCell: {
    fontSize: 6,
    width: '6.5%',
    textAlign: 'center',
  },
  check: {
    color: '#22c55e',
  },
  cross: {
    color: '#cccccc',
  },
  priceRow: {
    flexDirection: 'row',
    backgroundColor: '#C9A54E',
    paddingVertical: 4,
    paddingHorizontal: 3,
  },
  priceLabel: {
    fontSize: 5.5,
    color: '#ffffff',
    fontWeight: 'bold',
    width: '22%',
    paddingLeft: 3,
  },
  priceCell: {
    fontSize: 5,
    color: '#ffffff',
    width: '13%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  addonPriceCell: {
    fontSize: 5,
    color: '#ffffff',
    width: '6.5%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  fullPackageRow: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fullPackageTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#C9A54E',
  },
  fullPackageText: {
    fontSize: 6,
    color: '#ffffff',
  },
  fullPackagePrices: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    fontSize: 6,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#C9A54E',
  },
  footer: {
    position: 'absolute',
    bottom: 8,
    left: 15,
    right: 15,
    borderTop: '0.5px solid #e0e0e0',
    paddingTop: 4,
  },
  footerText: {
    fontSize: 6,
    color: '#666666',
    textAlign: 'center',
  },
});

const SIZE_ORDER = ['startup', 'small', 'medium', 'large', 'listed'] as const;

const formatCurrency = (value: number) => {
  return `R$ ${value.toLocaleString('pt-BR')}`;
};

export const PlansComparisonPDF = () => {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const allModules: { section: string; items: { key: string; label: string }[] }[] = [];
  
  SIDEBAR_SECTIONS.forEach(section => {
    if (section.items.length > 0) {
      allModules.push({
        section: section.label,
        items: section.items.map(item => ({ key: item.key, label: item.label })),
      });
    }
  });

  const isModuleIncluded = (moduleKey: string, size: typeof SIZE_ORDER[number]) => {
    return BASE_MODULES[size].includes(moduleKey as any);
  };

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

        <Text style={styles.title}>Comparativo de Planos</Text>
        <Text style={styles.subtitle}>Visão completa dos módulos por porte de empresa</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.moduleCol]}>Módulo</Text>
            {SIZE_ORDER.map(size => (
              <Text key={size} style={[styles.tableHeaderCell, styles.planCol]}>
                {COMPANY_SIZE_LABELS[size]}
              </Text>
            ))}
            <Text style={[styles.tableHeaderCell, styles.addonCol]}>ESG</Text>
            <Text style={[styles.tableHeaderCell, styles.addonCol]}>Intel.</Text>
          </View>

          {allModules.map((section, sIdx) => (
            <View key={sIdx}>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>{section.section}</Text>
              </View>
              {section.items.map((item, iIdx) => (
                <View 
                  key={iIdx} 
                  style={[styles.tableRow, iIdx % 2 === 1 && styles.tableRowAlt]}
                >
                  <Text style={styles.moduleCell}>{item.label}</Text>
                  {SIZE_ORDER.map(size => (
                    <Text 
                      key={size} 
                      style={[
                        styles.checkCell, 
                        isModuleIncluded(item.key, size) ? styles.check : styles.cross
                      ]}
                    >
                      {isModuleIncluded(item.key, size) ? '●' : '○'}
                    </Text>
                  ))}
                  <Text style={[styles.addonCheckCell, item.key === 'esg_maturity' ? styles.check : styles.cross]}>
                    {item.key === 'esg_maturity' ? '●' : '-'}
                  </Text>
                  <Text style={[styles.addonCheckCell, (item.key === 'market_intel' || item.key === 'benchmarking') ? styles.check : styles.cross]}>
                    {(item.key === 'market_intel' || item.key === 'benchmarking') ? '●' : '-'}
                  </Text>
                </View>
              ))}
            </View>
          ))}

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>INVESTIMENTO/MÊS</Text>
            {SIZE_ORDER.map(size => (
              <Text key={size} style={styles.priceCell}>
                {size === 'listed' ? 'A partir de ' : ''}{formatCurrency(PLAN_PRICES[size])}
              </Text>
            ))}
            <Text style={styles.addonPriceCell}>{formatCurrency(ADDON_PRICES.esg)}</Text>
            <Text style={styles.addonPriceCell}>{formatCurrency(ADDON_PRICES.market_intel)}</Text>
          </View>
        </View>

        <View style={styles.fullPackageRow}>
          <Text style={styles.fullPackageTitle}>Pacote Full (ESG + Inteligência de Mercado)</Text>
          <View style={styles.fullPackagePrices}>
            <Text style={styles.originalPrice}>De {formatCurrency(FULL_PACKAGE.originalPrice)}</Text>
            <Text style={styles.discountedPrice}>Por {formatCurrency(FULL_PACKAGE.discountedPrice)}/mês</Text>
          </View>
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
