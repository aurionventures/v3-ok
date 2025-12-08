import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { COMPANY_SIZE_LABELS } from '@/types/organization';
import { BASE_MODULES, ADDON_MODULES, PLAN_PRICES, ADDON_PRICES } from '@/utils/moduleMatrix';
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
    paddingBottom: 15,
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
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 15,
    textAlign: 'center',
  },
  table: {
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  tableHeaderCell: {
    fontSize: 7,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  moduleCol: {
    width: '25%',
    textAlign: 'left',
    paddingLeft: 5,
  },
  planCol: {
    width: '12.5%',
    textAlign: 'center',
  },
  addonCol: {
    width: '12.5%',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e0e0e0',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  tableRowAlt: {
    backgroundColor: '#f8f9fa',
  },
  sectionRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderBottom: '1px solid #e0e0e0',
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  moduleCell: {
    fontSize: 7,
    color: '#333333',
    width: '25%',
    paddingLeft: 10,
  },
  checkCell: {
    fontSize: 8,
    width: '12.5%',
    textAlign: 'center',
  },
  check: {
    color: '#22c55e',
  },
  cross: {
    color: '#ef4444',
  },
  priceRow: {
    flexDirection: 'row',
    backgroundColor: '#C9A54E',
    paddingVertical: 8,
    paddingHorizontal: 5,
    marginTop: 5,
  },
  priceLabel: {
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
    width: '25%',
    paddingLeft: 5,
  },
  priceCell: {
    fontSize: 7,
    color: '#ffffff',
    width: '12.5%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  fullPackageSection: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#1a1a2e',
    borderRadius: 4,
  },
  fullPackageTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#C9A54E',
    marginBottom: 5,
  },
  fullPackageText: {
    fontSize: 9,
    color: '#ffffff',
    marginBottom: 3,
  },
  fullPackagePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C9A54E',
    marginTop: 5,
  },
  originalPrice: {
    fontSize: 10,
    color: '#999999',
    textDecorationLine: 'line-through',
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

  const isAddonModule = (moduleKey: string) => {
    return ADDON_MODULES.some(addon => addon.key === moduleKey);
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
                      {isModuleIncluded(item.key, size) ? '✓' : '✗'}
                    </Text>
                  ))}
                  <Text style={[styles.checkCell, item.key === 'esg_maturity' ? styles.check : styles.cross]}>
                    {item.key === 'esg_maturity' ? '✓' : '—'}
                  </Text>
                  <Text style={[styles.checkCell, (item.key === 'market_intel' || item.key === 'benchmarking') ? styles.check : styles.cross]}>
                    {(item.key === 'market_intel' || item.key === 'benchmarking') ? '✓' : '—'}
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
            <Text style={styles.priceCell}>{formatCurrency(ADDON_PRICES.esg)}</Text>
            <Text style={styles.priceCell}>{formatCurrency(ADDON_PRICES.market_intel)}</Text>
          </View>
        </View>

        <View style={styles.fullPackageSection}>
          <Text style={styles.fullPackageTitle}>Pacote Full (Todos os Add-ons)</Text>
          <Text style={styles.fullPackageText}>
            Inclui Maturidade ESG + Inteligência de Mercado + Benchmarking Global
          </Text>
          <Text style={styles.originalPrice}>De R$ 78.970/mês</Text>
          <Text style={styles.fullPackagePrice}>Por R$ 75.970/mês</Text>
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
