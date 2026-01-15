import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { usePricingConfig, CompanySize, SubscriptionPlan, PlanPricingMatrix, AddonCatalog, Module } from '@/hooks/usePricingConfig';
import { calculateComplexityScore, getComplexityLevel, PRICING_MATRIX } from '@/data/pricingData';
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
    textAlign: 'center',
  },
  tableCellFirst: {
    flex: 1.2,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  tableCellPrice: {
    flex: 1,
    textAlign: 'center',
    color: '#059669',
    fontWeight: 'bold',
  },
  formulaBox: {
    backgroundColor: '#f8fafc',
    border: '1 solid #e2e8f0',
    borderRadius: 6,
    padding: 15,
    marginBottom: 15,
  },
  formulaText: {
    fontSize: 12,
    fontFamily: 'Courier',
    textAlign: 'center',
    color: '#1e293b',
    fontWeight: 'bold',
  },
  levelCard: {
    border: '1 solid #e2e8f0',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 6,
  },
  levelFeatures: {
    fontSize: 7,
    color: '#475569',
    marginBottom: 3,
  },
  levelRecommendation: {
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 6,
    paddingTop: 6,
    borderTop: '1 solid #e2e8f0',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 8,
  },
  summaryBox: {
    backgroundColor: '#f0f9ff',
    border: '1 solid #bfdbfe',
    borderRadius: 6,
    padding: 12,
    marginTop: 15,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    color: '#475569',
    fontSize: 9,
  },
  summaryValue: {
    fontWeight: 'bold',
    color: '#1e293b',
    fontSize: 9,
  },
  badge: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 7,
    fontWeight: 'bold',
  },
});

interface PLGSLGStrategyPDFDocumentProps {
  companySizes: CompanySize[];
  subscriptionPlans: SubscriptionPlan[];
  pricingMatrix: PlanPricingMatrix[];
  addons: AddonCatalog[];
  modules: Module[];
}

function PLGSLGStrategyPDFDocument({
  companySizes,
  subscriptionPlans,
  pricingMatrix,
  addons,
  modules
}: PLGSLGStrategyPDFDocumentProps) {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", { 
      style: "currency", 
      currency: "BRL", 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatPricePDF = (price: number) => {
    return `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getPricing = (sizeKey: string, planKey: string) => {
    return PRICING_MATRIX[sizeKey]?.[planKey];
  };

  // Exemplos de complexidade
  const exemplos = [
    { nome: 'Startup/PE', empresas: 1, conselhos: 1, comites: 0, reunioes: 12 },
    { nome: 'Empresa Familiar Média', empresas: 2, conselhos: 1, comites: 2, reunioes: 36 },
    { nome: 'Corporação Média', empresas: 4, conselhos: 2, comites: 4, reunioes: 180 },
    { nome: 'Grande Corporação', empresas: 6, conselhos: 3, comites: 6, reunioes: 400 },
  ];

  const calcularExemplo = (exemplo: typeof exemplos[0]) => {
    const score = calculateComplexityScore({
      numEmpresas: exemplo.empresas,
      numConselhos: exemplo.conselhos,
      numComites: exemplo.comites,
      reunioesAno: exemplo.reunioes,
    });
    const level = getComplexityLevel(score);
    return { score, level };
  };

  return (
    <Document>
      {/* Página 1: Capa e Visão Geral */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Estratégia PLG/SLG Legacy OS</Text>
          <Text style={styles.subtitle}>Crescimento Orientado a Produto / Crescimento Orientado a Vendas</Text>
          <Text style={styles.date}>Gerado em: {new Date().toLocaleDateString('pt-BR')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#1e293b' }}>
            Visão Geral da Estratégia
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 8, lineHeight: 1.5 }}>
            Este documento apresenta a estratégia completa de precificação, complexidade e recomendações de planos 
            da plataforma Legacy OS, incluindo:
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Portes de Empresa e Planos de Assinatura</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Matriz Completa de Pricing (Mensal, Anual, Setup)</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Sistema de Scoring de Complexidade</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Módulos Principais e Complementos Disponíveis</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Lógica de Recomendação de Planos</Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Resumo Executivo</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Portes de Empresa:</Text>
            <Text style={styles.summaryValue}>{companySizes.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Planos de Assinatura:</Text>
            <Text style={styles.summaryValue}>{subscriptionPlans.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Combinações de Pricing:</Text>
            <Text style={styles.summaryValue}>{pricingMatrix.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Módulos Principais:</Text>
            <Text style={styles.summaryValue}>{modules.filter(m => !m.is_addon).length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Complementos Disponíveis:</Text>
            <Text style={styles.summaryValue}>{addons.length}</Text>
          </View>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Página 2: Portes e Planos */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Portes de Empresa</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Porte</Text>
              <Text style={styles.tableCell}>Descrição</Text>
              <Text style={styles.tableCell}>Faturamento</Text>
              <Text style={styles.tableCell}>Funcionários</Text>
            </View>
            {companySizes.map((size) => (
              <View key={size.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellFirst]}>{size.name}</Text>
                <Text style={styles.tableCell}>{size.description || '-'}</Text>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>
                  {size.revenue_min === 0 ? '< R$ 50M' : 
                   size.revenue_min ? `R$ ${(size.revenue_min / 1000000).toFixed(0)}M` : ''}
                  {size.revenue_max ? ` - R$ ${(size.revenue_max / 1000000).toFixed(0)}M` : size.revenue_min ? ' - ∞' : ''}
                </Text>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>
                  {size.employee_min || '-'}
                  {size.employee_max ? ` - ${size.employee_max}` : size.employee_min ? ' - ∞' : ''}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planos de Assinatura</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Plano</Text>
              <Text style={styles.tableCell}>Descrição</Text>
              <Text style={styles.tableCell}>Max Empresas</Text>
              <Text style={styles.tableCell}>Max Conselhos</Text>
              <Text style={styles.tableCell}>Complementos Incluídos</Text>
            </View>
            {subscriptionPlans.map((plan) => (
              <View key={plan.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellFirst]}>{plan.name}</Text>
                <Text style={styles.tableCell}>{plan.description || '-'}</Text>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>{plan.max_companies || 'Ilimitado'}</Text>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>{plan.max_councils || 'Ilimitado'}</Text>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>{plan.included_addons || 0}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Página 3: Matriz de Pricing - Mensal */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Matriz de Pricing - Preços Mensais</Text>
        </View>

        <View style={styles.section} wrap={false}>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Porte \ Plano</Text>
              {subscriptionPlans.map((plan) => (
                <Text key={plan.id} style={styles.tableCell}>{plan.name}</Text>
              ))}
            </View>
            {companySizes.map((size) => (
              <View key={size.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellFirst]}>{size.name}</Text>
                {subscriptionPlans.map((plan) => {
                  const pricing = getPricing(size.key, plan.key);
                  if (!pricing) {
                    return (
                      <Text key={plan.id} style={styles.tableCell}>—</Text>
                    );
                  }
                  return (
                    <Text key={plan.id} style={[styles.tableCell, styles.tableCellPrice]}>
                      {formatPricePDF(pricing.mensal)}
                    </Text>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Página 4: Matriz de Pricing - Anual e Setup */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Matriz de Pricing - Preços Anuais</Text>
        </View>

        <View style={styles.section} wrap={false}>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Porte \ Plano</Text>
              {subscriptionPlans.map((plan) => (
                <Text key={plan.id} style={styles.tableCell}>{plan.name}</Text>
              ))}
            </View>
            {companySizes.map((size) => (
              <View key={size.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellFirst]}>{size.name}</Text>
                {subscriptionPlans.map((plan) => {
                  const pricing = getPricing(size.key, plan.key);
                  if (!pricing) {
                    return (
                      <Text key={plan.id} style={styles.tableCell}>—</Text>
                    );
                  }
                  return (
                    <Text key={plan.id} style={[styles.tableCell, styles.tableCellPrice]}>
                      {formatPricePDF(pricing.anual)}
                    </Text>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Taxas de Setup</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Porte \ Plano</Text>
              {subscriptionPlans.map((plan) => (
                <Text key={plan.id} style={styles.tableCell}>{plan.name}</Text>
              ))}
            </View>
            {companySizes.map((size) => (
              <View key={size.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellFirst]}>{size.name}</Text>
                {subscriptionPlans.map((plan) => {
                  const pricing = getPricing(size.key, plan.key);
                  if (!pricing) {
                    return (
                      <Text key={plan.id} style={styles.tableCell}>—</Text>
                    );
                  }
                  const isSMB = size.key === 'smb' || size.key === 'smb_plus';
                  return (
                    <Text key={plan.id} style={[styles.tableCell, { color: '#059669' }]}>
                      {formatPricePDF(pricing.setup)}
                      {isSMB && <Text style={{ fontSize: 7, color: '#64748b' }}> (2× mensal)</Text>}
                    </Text>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Página 5: Complexidade e Pesos */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Sistema de Complexidade</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fórmula de Cálculo</Text>
          <View style={styles.formulaBox}>
            <Text style={styles.formulaText}>
              Pontuação de Complexidade = (Empresas × 1) + (Conselhos × 3) + (Comitês × 2) + (Reuniões ÷ 10)
            </Text>
          </View>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Matriz de Pesos</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Fator</Text>
              <Text style={styles.tableCell}>Peso</Text>
              <Text style={styles.tableCell}>Descrição</Text>
              <Text style={styles.tableCell}>Impacto</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Empresas</Text>
              <Text style={[styles.tableCell, { textAlign: 'center' }]}>×1</Text>
              <Text style={styles.tableCell}>Cada empresa no grupo adiciona 1 ponto</Text>
              <Text style={[styles.tableCell, { color: '#10b981', textAlign: 'center' }]}>Baixo</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Conselhos</Text>
              <Text style={[styles.tableCell, { textAlign: 'center' }]}>×3</Text>
              <Text style={styles.tableCell}>Cada conselho de administração adiciona 3 pontos</Text>
              <Text style={[styles.tableCell, { color: '#f97316', textAlign: 'center' }]}>Alto</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Comitês</Text>
              <Text style={[styles.tableCell, { textAlign: 'center' }]}>×2</Text>
              <Text style={styles.tableCell}>Cada comitê formal adiciona 2 pontos</Text>
              <Text style={[styles.tableCell, { color: '#f59e0b', textAlign: 'center' }]}>Médio</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Reuniões/Ano</Text>
              <Text style={[styles.tableCell, { textAlign: 'center' }]}>÷10</Text>
              <Text style={styles.tableCell}>Volume anual de reuniões dividido por 10</Text>
              <Text style={[styles.tableCell, { color: '#3b82f6', textAlign: 'center' }]}>Variável</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Página 6: Níveis de Complexidade e Thresholds */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Níveis de Complexidade e Recomendações</Text>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Limiares de Score para Recomendação</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Pontuação</Text>
              <Text style={styles.tableCell}>Nível</Text>
              <Text style={styles.tableCell}>Plano Recomendado</Text>
              <Text style={styles.tableCell}>Exemplo (SMB)</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>≤ 10</Text>
              <Text style={[styles.tableCell, { color: '#10b981' }]}>Baixa</Text>
              <Text style={styles.tableCell}>Essencial</Text>
              <Text style={[styles.tableCell, { textAlign: 'center' }]}>R$ 2.997,00/mês</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>11 - 20</Text>
              <Text style={[styles.tableCell, { color: '#f59e0b' }]}>Moderada</Text>
              <Text style={styles.tableCell}>Profissional</Text>
              <Text style={[styles.tableCell, { textAlign: 'center' }]}>R$ 4.997,00/mês</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>21 - 40</Text>
              <Text style={[styles.tableCell, { color: '#f97316' }]}>Alta</Text>
              <Text style={styles.tableCell}>Business</Text>
              <Text style={[styles.tableCell, { textAlign: 'center' }]}>R$ 7.997,00/mês</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>&gt; 40</Text>
              <Text style={[styles.tableCell, { color: '#ef4444' }]}>Muito Alta</Text>
              <Text style={styles.tableCell}>Enterprise</Text>
              <Text style={[styles.tableCell, { textAlign: 'center' }]}>R$ 12.997,00/mês</Text>
            </View>
          </View>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Exemplos Práticos</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Perfil</Text>
              <Text style={styles.tableCell}>Empresas</Text>
              <Text style={styles.tableCell}>Conselhos</Text>
              <Text style={styles.tableCell}>Comitês</Text>
              <Text style={styles.tableCell}>Reuniões</Text>
              <Text style={styles.tableCell}>Pontuação</Text>
              <Text style={styles.tableCell}>Nível</Text>
            </View>
            {exemplos.map((exemplo) => {
              const { score, level } = calcularExemplo(exemplo);
              return (
                <View key={exemplo.nome} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellFirst]}>{exemplo.nome}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'center' }]}>{exemplo.empresas}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'center' }]}>{exemplo.conselhos}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'center' }]}>{exemplo.comites}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'center' }]}>{exemplo.reunioes}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'center' }]}>{score}</Text>
                  <Text style={[styles.tableCell, { 
                    color: 
                      level.level === 'Baixa' ? '#10b981' :
                      level.level === 'Moderada' ? '#f59e0b' :
                      level.level === 'Alta' ? '#f97316' : '#ef4444',
                    textAlign: 'center'
                  }]}>{level.level}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Página 7: Módulos e Add-ons */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Módulos e Complementos</Text>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Módulos Principais ({modules.filter(m => !m.is_addon).length})</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Módulo</Text>
              <Text style={styles.tableCell}>Descrição</Text>
              <Text style={styles.tableCell}>Seção</Text>
            </View>
            {modules.filter(m => !m.is_addon).map((module) => (
              <View key={module.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellFirst]}>{module.name}</Text>
                <Text style={styles.tableCell}>{module.description || '-'}</Text>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>{module.section_label || module.section || '-'}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Complementos Disponíveis ({addons.length})</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Complemento</Text>
              <Text style={styles.tableCell}>Descrição</Text>
              <Text style={styles.tableCell}>Mensal</Text>
              <Text style={styles.tableCell}>Anual</Text>
              <Text style={styles.tableCell}>Categoria</Text>
            </View>
            {addons.map((addon) => (
              <View key={addon.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellFirst]}>{addon.name}</Text>
                <Text style={styles.tableCell}>{addon.description || '-'}</Text>
                <Text style={[styles.tableCell, { color: '#059669', textAlign: 'center' }]}>
                  {formatPricePDF(addon.monthly_price)}
                </Text>
                <Text style={[styles.tableCell, { color: '#059669', textAlign: 'center' }]}>
                  {formatPricePDF(addon.annual_price)}
                </Text>
                <Text style={[styles.tableCell, { textAlign: 'center' }]}>{addon.category || '-'}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Página 8: Estratégia PLG/SLG */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Estratégia PLG/SLG</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crescimento Orientado a Produto (PLG)</Text>
          <Text style={{ fontSize: 10, marginBottom: 8, lineHeight: 1.5 }}>
            A estratégia PLG da Legacy OS permite que empresas descubram e ativem planos através de:
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Calculadora de Complexidade interativa</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Quiz de Descoberta de Planos</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Recomendação automática baseada em pontuação</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Teste gratuito e integração guiada</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Autoatendimento de ativação</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crescimento Orientado a Vendas (SLG)</Text>
          <Text style={{ fontSize: 10, marginBottom: 8, lineHeight: 1.5 }}>
            Para empresas com maior complexidade ou necessidades específicas, a estratégia SLG oferece:
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Propostas comerciais personalizadas</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Consultoria de implementação</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Suporte dedicado para Enterprise</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Negociação de contratos customizados</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Descontos para pagamento anual</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Funil de Conversão</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Etapa</Text>
              <Text style={styles.tableCell}>Ação</Text>
              <Text style={styles.tableCell}>Métrica</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>1. Descoberta</Text>
              <Text style={styles.tableCell}>Quiz / Calculadora</Text>
              <Text style={styles.tableCell}>Taxa de preenchimento</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>2. Recomendação</Text>
              <Text style={styles.tableCell}>Pontuação de Complexidade</Text>
              <Text style={styles.tableCell}>Precisão da recomendação</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>3. Ativação</Text>
              <Text style={styles.tableCell}>Finalização de Compra / Contrato</Text>
              <Text style={styles.tableCell}>Taxa de conversão</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>4. Expansão</Text>
              <Text style={styles.tableCell}>Complementos / Atualização</Text>
              <Text style={styles.tableCell}>Receita recorrente</Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Princípios da Estratégia</Text>
          <Text style={{ fontSize: 9, marginBottom: 4, lineHeight: 1.5 }}>
            • <strong>Transparência:</strong> Preços claros e públicos, sem surpresas
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 4, lineHeight: 1.5 }}>
            • <strong>Justiça:</strong> Preços proporcionais à complexidade e porte
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 4, lineHeight: 1.5 }}>
            • <strong>Flexibilidade:</strong> Planos escaláveis conforme crescimento
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 4, lineHeight: 1.5 }}>
            • <strong>Valor:</strong> Retorno sobre Investimento (ROI) claro e mensurável para cada plano
          </Text>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `©2026 - Confidencial Legacy OS | Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
}

export function PLGSLGStrategyPDF() {
  const { companySizes, subscriptionPlans, pricingMatrix, addons, modules } = usePricingConfig();
  const fileName = `estrategia-plg-slg-legacy-os-${new Date().toISOString().split('T')[0]}.pdf`;

  return (
    <PDFDownloadLink
      document={
        <PLGSLGStrategyPDFDocument
          companySizes={companySizes}
          subscriptionPlans={subscriptionPlans}
          pricingMatrix={pricingMatrix}
          addons={addons}
          modules={modules}
        />
      }
      fileName={fileName}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ 
        textDecoration: 'none',
        display: 'inline-flex',
        pointerEvents: 'auto',
        zIndex: 1
      }}
    >
      {({ loading, blob, url, error }) => {
        if (error) {
          console.error('Erro ao gerar PDF:', error);
        }
        return (
          <>
            <FileDown className="h-4 w-4" />
            {loading ? 'Gerando PDF...' : 'Baixar Estratégia PLG/SLG'}
          </>
        );
      }}
    </PDFDownloadLink>
  );
}
