import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CompanySize, COMPANY_SIZE_LABELS } from '@/types/organization';
import { BASE_MODULES, ADDON_MODULES } from '@/utils/moduleMatrix';
import { SIDEBAR_SECTIONS } from '@/data/sidebarCatalog';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottom: '2px solid #C9A54E',
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  logoAccent: {
    color: '#C9A54E',
  },
  date: {
    fontSize: 10,
    color: '#666666',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 20,
    textAlign: 'center',
  },
  companySection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 5,
  },
  planName: {
    fontSize: 14,
    color: '#C9A54E',
    fontWeight: 'bold',
  },
  pricingSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 10,
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: 5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottom: '1px solid #f0f0f0',
  },
  priceLabel: {
    fontSize: 11,
    color: '#333333',
  },
  priceValue: {
    fontSize: 11,
    color: '#333333',
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 10,
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  totalLabel: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 13,
    color: '#C9A54E',
    fontWeight: 'bold',
  },
  modulesSection: {
    marginBottom: 20,
  },
  moduleCategory: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#C9A54E',
    marginTop: 10,
    marginBottom: 5,
  },
  moduleItem: {
    fontSize: 10,
    color: '#333333',
    paddingLeft: 10,
    paddingVertical: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1px solid #e0e0e0',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 9,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 3,
  },
  footerContact: {
    fontSize: 9,
    color: '#C9A54E',
    textAlign: 'center',
  },
  discountBadge: {
    backgroundColor: '#22c55e',
    color: '#ffffff',
    fontSize: 9,
    padding: '3 8',
    borderRadius: 3,
    marginLeft: 10,
  },
  originalPrice: {
    fontSize: 10,
    color: '#999999',
    textDecorationLine: 'line-through',
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
  
  const getModulesBySection = () => {
    const result: { section: string; modules: string[] }[] = [];
    
    SIDEBAR_SECTIONS.forEach(section => {
      const sectionModules = section.items
        .filter(item => enabledModules.includes(item.key) || 
          (hasESG && item.key === 'esg_maturity') ||
          (hasMarketIntel && (item.key === 'market_intel' || item.key === 'benchmarking')))
        .map(item => item.label);
      
      if (sectionModules.length > 0) {
        result.push({ section: section.label, modules: sectionModules });
      }
    });
    
    return result;
  };

  const modulesBySection = getModulesBySection();
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

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
              <Text style={styles.priceLabel}>
                Pacote Full (ESG + Intel. Mercado)
                <Text style={styles.discountBadge}> ECONOMIA</Text>
              </Text>
              <View>
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
          <Text style={styles.sectionTitle}>Módulos Incluídos</Text>
          
          {modulesBySection.map((section, idx) => (
            <View key={idx}>
              <Text style={styles.moduleCategory}>{section.section}</Text>
              {section.modules.map((module, mIdx) => (
                <Text key={mIdx} style={styles.moduleItem}>• {module}</Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Proposta válida por 30 dias a partir da data de emissão
          </Text>
          <Text style={styles.footerContact}>
            contato@legacygovernanca.com.br | +55 47 99162-2220
          </Text>
        </View>
      </Page>
    </Document>
  );
};
