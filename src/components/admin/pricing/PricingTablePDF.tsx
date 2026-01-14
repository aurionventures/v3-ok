import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { CompanySize, SubscriptionPlan, PlanPricingMatrix } from '@/hooks/usePricingConfig';
import { usePricingConfig } from '@/hooks/usePricingConfig';
import { FileDown } from 'lucide-react';

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #2563eb',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 3,
  },
  date: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 4,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  tableHeader: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 5,
    fontSize: 9,
  },
  tableCellFirst: {
    flex: 1.2,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  tableCellPrice: {
    flex: 1,
    textAlign: 'right',
    color: '#059669',
    fontWeight: 'bold',
  },
  tableCellRecommended: {
    flex: 1,
    textAlign: 'right',
    color: '#059669',
    fontWeight: 'bold',
    position: 'relative',
  },
  starBadge: {
    fontSize: 8,
    color: '#f59e0b',
    marginLeft: 3,
  },
  legend: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    fontSize: 9,
  },
  legendItem: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  legendText: {
    marginLeft: 5,
    color: '#64748b',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#94a3b8',
    borderTop: '1 solid #e2e8f0',
    paddingTop: 10,
  },
  summary: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e293b',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  summaryItem: {
    flex: 1,
    minWidth: '45%',
  },
  summaryLabel: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 3,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  summaryValueGreen: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
  },
});

interface PricingTablePDFProps {
  viewMode: 'mensal' | 'anual' | 'setup' | 'all';
  companySizes: CompanySize[];
  subscriptionPlans: SubscriptionPlan[];
  pricingMatrix: PlanPricingMatrix[];
  getPricing: (sizeId: string, planId: string) => PlanPricingMatrix | undefined;
}

function PricingTablePDFDocument({ 
  viewMode, 
  companySizes, 
  subscriptionPlans, 
  pricingMatrix,
  getPricing 
}: PricingTablePDFProps) {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", { 
      style: "currency", 
      currency: "BRL", 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getDisplayPrice = (pricing: PlanPricingMatrix, mode: 'mensal' | 'anual' | 'setup') => {
    switch (mode) {
      case 'anual':
        return pricing.annual_price;
      case 'setup':
        return pricing.setup_fee || 0;
      default:
        return pricing.monthly_price;
    }
  };

  const getPriceLabel = (mode: 'mensal' | 'anual' | 'setup') => {
    switch (mode) {
      case 'anual':
        return '/ano';
      case 'setup':
        return '(único)';
      default:
        return '/mês';
    }
  };

  const renderTable = (mode: 'mensal' | 'anual' | 'setup') => {
    const modeTitle = mode === 'mensal' ? 'Preços Mensais' : mode === 'anual' ? 'Preços Anuais' : 'Taxas de Setup';
    
    return (
      <View style={styles.section} wrap={false}>
        <Text style={styles.sectionTitle}>{modeTitle}</Text>
        <View style={styles.table}>
          {/* Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.tableCellFirst]}>Porte \ Plano</Text>
            {subscriptionPlans.map((plan) => (
              <Text key={plan.id} style={styles.tableCell}>
                {plan.name}
              </Text>
            ))}
          </View>
          
          {/* Rows */}
          {companySizes.map((size) => (
            <View key={size.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>{size.name}</Text>
              {subscriptionPlans.map((plan) => {
                const pricing = getPricing(size.id, plan.id);
                if (!pricing) {
                  return (
                    <Text key={plan.id} style={styles.tableCell}>
                      —
                    </Text>
                  );
                }
                
                const price = getDisplayPrice(pricing, mode);
                const isRecommended = pricing.is_recommended;
                
                return (
                  <Text key={plan.id} style={[styles.tableCell, styles.tableCellPrice]}>
                    {formatPrice(price)}
                    {isRecommended && <Text style={styles.starBadge}> ⭐</Text>}
                    {'\n'}
                    <Text style={{ fontSize: 7, color: '#64748b' }}>{getPriceLabel(mode)}</Text>
                  </Text>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Calcular resumo
  const allPrices = pricingMatrix
    .filter(p => p.is_active)
    .map(p => ({
      monthly: p.monthly_price,
      annual: p.annual_price,
      setup: p.setup_fee || 0,
    }));

  const minMonthly = Math.min(...allPrices.map(p => p.monthly));
  const maxMonthly = Math.max(...allPrices.map(p => p.monthly));
  const minSetup = Math.min(...allPrices.map(p => p.setup));
  const maxSetup = Math.max(...allPrices.map(p => p.setup));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tabela de Preços</Text>
          <Text style={styles.subtitle}>Legacy OS - Plataforma de Governança Corporativa</Text>
          <Text style={styles.date}>
            Gerado em: {new Date().toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>

        {/* Tabelas */}
        {viewMode === 'all' ? (
          <>
            {renderTable('mensal')}
            {renderTable('anual')}
            {renderTable('setup')}
          </>
        ) : (
          renderTable(viewMode)
        )}

        {/* Resumo */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Resumo de Preços</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Piso Mensal</Text>
              <Text style={styles.summaryValue}>{formatPrice(minMonthly)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Teto Mensal</Text>
              <Text style={styles.summaryValue}>{formatPrice(maxMonthly)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Setup Mínimo</Text>
              <Text style={styles.summaryValueGreen}>{formatPrice(minSetup)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Setup Máximo</Text>
              <Text style={styles.summaryValueGreen}>{formatPrice(maxSetup)}</Text>
            </View>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <Text style={styles.starBadge}>⭐</Text>
            <Text style={styles.legendText}>= Mais Popular</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.legendText}>— = Combinação não disponível</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `Página ${pageNumber} de ${totalPages} | Legacy OS - www.legacyos.com.br`
        )} fixed />
      </Page>
    </Document>
  );
}

interface PricingTablePDFButtonProps {
  viewMode: 'mensal' | 'anual' | 'setup' | 'all';
}

export function PricingTablePDF({ viewMode }: PricingTablePDFButtonProps) {
  const { companySizes, subscriptionPlans, pricingMatrix, getPricing } = usePricingConfig();
  
  const fileName = viewMode === 'all' 
    ? `tabela-precos-completa-legacy-${new Date().toISOString().split('T')[0]}.pdf`
    : `tabela-precos-${viewMode}-legacy-${new Date().toISOString().split('T')[0]}.pdf`;
  
  const buttonText = viewMode === 'all' ? 'Baixar PDF Completo' : 'Baixar PDF';
  
  return (
    <PDFDownloadLink 
      document={
        <PricingTablePDFDocument 
          viewMode={viewMode}
          companySizes={companySizes}
          subscriptionPlans={subscriptionPlans}
          pricingMatrix={pricingMatrix}
          getPricing={getPricing}
        />
      } 
      fileName={fileName}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
    >
      {({ loading }) => (
        <>
          <FileDown className="h-4 w-4" />
          {loading ? 'Gerando PDF...' : buttonText}
        </>
      )}
    </PDFDownloadLink>
  );
}
