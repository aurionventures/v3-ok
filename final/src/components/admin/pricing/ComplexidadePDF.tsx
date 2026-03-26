import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { calculateComplexityScore, getComplexityLevel } from '@/data/pricingData';
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
  formulaBox: {
    backgroundColor: '#f8fafc',
    border: '1 solid #e2e8f0',
    borderRadius: 6,
    padding: 15,
    marginBottom: 15,
  },
  formulaText: {
    fontSize: 14,
    fontFamily: 'Courier',
    textAlign: 'center',
    color: '#1e293b',
    fontWeight: 'bold',
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
    flex: 1.5,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  tableCellCenter: {
    textAlign: 'center',
  },
  levelCard: {
    border: '1 solid #e2e8f0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  levelTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  levelDescription: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 8,
  },
  levelFeatures: {
    fontSize: 8,
    color: '#475569',
    marginBottom: 5,
  },
  levelRecommendation: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 8,
    paddingTop: 8,
    borderTop: '1 solid #e2e8f0',
  },
  badge: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 'bold',
  },
  alertBox: {
    backgroundColor: '#fef3c7',
    border: '1 solid #fbbf24',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  alertTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 5,
  },
  alertText: {
    fontSize: 9,
    color: '#78350f',
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
});

// Exemplos práticos
const exemplos = [
  {
    nome: 'Startup/PE',
    empresas: 1,
    conselhos: 1,
    comites: 0,
    reunioes: 12,
  },
  {
    nome: 'Empresa Familiar Média',
    empresas: 2,
    conselhos: 1,
    comites: 2,
    reunioes: 36,
  },
  {
    nome: 'Corporação Média',
    empresas: 4,
    conselhos: 2,
    comites: 4,
    reunioes: 180,
  },
  {
    nome: 'Grande Corporação',
    empresas: 6,
    conselhos: 3,
    comites: 6,
    reunioes: 400,
  },
];

function ComplexidadePDFDocument() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", { 
      style: "currency", 
      currency: "BRL", 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Baixa': return '#10b981';
      case 'Moderada': return '#f59e0b';
      case 'Alta': return '#f97316';
      case 'Muito Alta': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Matriz de Complexidade e Pesos</Text>
          <Text style={styles.subtitle}>Sistema de Scoring de Complexidade da Governança</Text>
          <Text style={styles.date}>Gerado em: {new Date().toLocaleDateString('pt-BR')}</Text>
        </View>

        {/* Fórmula */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fórmula de Cálculo</Text>
          <View style={styles.formulaBox}>
            <Text style={styles.formulaText}>
              Complexity Score = (Empresas × 1) + (Conselhos × 3) + (Comitês × 2) + (Reuniões ÷ 10)
            </Text>
          </View>
        </View>

        {/* Matriz de Pesos */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Matriz de Pesos</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Fator</Text>
              <Text style={[styles.tableCell, styles.tableCellCenter]}>Peso</Text>
              <Text style={styles.tableCell}>Descrição</Text>
              <Text style={[styles.tableCell, styles.tableCellCenter]}>Impacto</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Empresas</Text>
              <Text style={[styles.tableCell, styles.tableCellCenter]}>×1</Text>
              <Text style={styles.tableCell}>Cada empresa no grupo adiciona 1 ponto</Text>
              <Text style={[styles.tableCell, styles.tableCellCenter, { color: '#10b981' }]}>Baixo</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Conselhos</Text>
              <Text style={[styles.tableCell, styles.tableCellCenter]}>×3</Text>
              <Text style={styles.tableCell}>Cada conselho de administração adiciona 3 pontos</Text>
              <Text style={[styles.tableCell, styles.tableCellCenter, { color: '#f97316' }]}>Alto</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Comitês</Text>
              <Text style={[styles.tableCell, styles.tableCellCenter]}>×2</Text>
              <Text style={styles.tableCell}>Cada comitê formal adiciona 2 pontos</Text>
              <Text style={[styles.tableCell, styles.tableCellCenter, { color: '#f59e0b' }]}>Médio</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Reuniões/Ano</Text>
              <Text style={[styles.tableCell, styles.tableCellCenter]}>÷10</Text>
              <Text style={styles.tableCell}>Volume anual de reuniões dividido por 10</Text>
              <Text style={[styles.tableCell, styles.tableCellCenter, { color: '#3b82f6' }]}>Variável</Text>
            </View>
          </View>
        </View>

        {/* Níveis de Complexidade */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Níveis de Complexidade</Text>
          
          <View style={[styles.levelCard, { borderColor: '#10b981' }]}>
            <Text style={[styles.levelTitle, { color: '#10b981' }]}>Baixa (Score ≤ 10)</Text>
            <Text style={styles.levelDescription}>Estrutura enxuta, ideal para começar</Text>
            <Text style={styles.levelFeatures}>• Empresa única ou grupo pequeno</Text>
            <Text style={styles.levelFeatures}>• 1 conselho ou menos</Text>
            <Text style={styles.levelFeatures}>• Poucos comitês formais</Text>
            <Text style={styles.levelFeatures}>• &lt; 50 reuniões/ano</Text>
            <Text style={[styles.levelRecommendation, { color: '#10b981' }]}>
              Plano Recomendado: Essencial ou Profissional
            </Text>
          </View>

          <View style={[styles.levelCard, { borderColor: '#f59e0b' }]}>
            <Text style={[styles.levelTitle, { color: '#f59e0b' }]}>Moderada (Score 11-30)</Text>
            <Text style={styles.levelDescription}>Complexidade típica de empresas em crescimento</Text>
            <Text style={styles.levelFeatures}>• Grupo pequeno/médio (2-3 empresas)</Text>
            <Text style={styles.levelFeatures}>• 1-2 conselhos</Text>
            <Text style={styles.levelFeatures}>• Alguns comitês (1-2)</Text>
            <Text style={styles.levelFeatures}>• 50-150 reuniões/ano</Text>
            <Text style={[styles.levelRecommendation, { color: '#f59e0b' }]}>
              Plano Recomendado: Profissional ou Business
            </Text>
          </View>

          <View style={[styles.levelCard, { borderColor: '#f97316' }]}>
            <Text style={[styles.levelTitle, { color: '#f97316' }]}>Alta (Score 31-60)</Text>
            <Text style={styles.levelDescription}>Estrutura robusta requer governança avançada</Text>
            <Text style={styles.levelFeatures}>• Grupo médio/grande (3-5 empresas)</Text>
            <Text style={styles.levelFeatures}>• Múltiplos conselhos (2-3)</Text>
            <Text style={styles.levelFeatures}>• Vários comitês (3-5)</Text>
            <Text style={styles.levelFeatures}>• 150-300 reuniões/ano</Text>
            <Text style={[styles.levelRecommendation, { color: '#f97316' }]}>
              Plano Recomendado: Business ou Enterprise
            </Text>
          </View>

          <View style={[styles.levelCard, { borderColor: '#ef4444' }]}>
            <Text style={[styles.levelTitle, { color: '#ef4444' }]}>Muito Alta (Score &gt; 60)</Text>
            <Text style={styles.levelDescription}>Complexidade de grande corporação</Text>
            <Text style={styles.levelFeatures}>• Grande grupo (5+ empresas)</Text>
            <Text style={styles.levelFeatures}>• Múltiplos conselhos (3+)</Text>
            <Text style={styles.levelFeatures}>• Muitos comitês (5+)</Text>
            <Text style={styles.levelFeatures}>• 300+ reuniões/ano</Text>
            <Text style={[styles.levelRecommendation, { color: '#ef4444' }]}>
              Plano Recomendado: Enterprise
            </Text>
          </View>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Segunda página - Exemplos e Relação com Preços */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Exemplos Práticos e Relação com Preços</Text>
        </View>

        {/* Exemplos Práticos */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Exemplos Práticos de Cálculo</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellFirst]}>Perfil</Text>
              <Text style={[styles.tableCell, styles.tableCellCenter]}>Empresas</Text>
              <Text style={[styles.tableCell, styles.tableCellCenter]}>Conselhos</Text>
              <Text style={[styles.tableCell, styles.tableCellCenter]}>Comitês</Text>
              <Text style={[styles.tableCell, styles.tableCellCenter]}>Reuniões</Text>
              <Text style={styles.tableCell}>Cálculo</Text>
              <Text style={[styles.tableCell, styles.tableCellCenter]}>Score</Text>
              <Text style={[styles.tableCell, styles.tableCellCenter]}>Nível</Text>
            </View>
            {exemplos.map((exemplo) => {
              const { score, level } = calcularExemplo(exemplo);
              const calculo = `${exemplo.empresas}×1 + ${exemplo.conselhos}×3 + ${exemplo.comites}×2 + ${exemplo.reunioes}÷10`;
              return (
                <View key={exemplo.nome} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellFirst]}>{exemplo.nome}</Text>
                  <Text style={[styles.tableCell, styles.tableCellCenter]}>{exemplo.empresas}</Text>
                  <Text style={[styles.tableCell, styles.tableCellCenter]}>{exemplo.conselhos}</Text>
                  <Text style={[styles.tableCell, styles.tableCellCenter]}>{exemplo.comites}</Text>
                  <Text style={[styles.tableCell, styles.tableCellCenter]}>{exemplo.reunioes}</Text>
                  <Text style={[styles.tableCell, { fontSize: 7, fontFamily: 'Courier' }]}>{calculo}</Text>
                  <Text style={[styles.tableCell, styles.tableCellCenter, { fontWeight: 'bold' }]}>{score}</Text>
                  <Text style={[styles.tableCell, styles.tableCellCenter, { color: getLevelColor(level.level) }]}>
                    {level.level}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Relação Complexidade vs Preços */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Relação Complexidade vs Preços</Text>
          
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Lógica de Recomendação</Text>
            <Text style={styles.alertText}>
              O Complexity Score é usado em conjunto com o faturamento anual para determinar o plano ideal. 
              Empresas com maior complexidade podem precisar de planos mais completos, mesmo com faturamento menor.
            </Text>
          </View>

          <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 8, marginTop: 10 }}>
            Fatores Adicionais Considerados:
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Faturamento Anual: Define o plano base (SMB, SMB+, Mid-Market, Large, Enterprise)</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Conselho Funcionando: +1 ponto de complexidade adicional</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Sucessão Formal: +1 ponto de complexidade adicional</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Avaliação Riscos/ESG Recorrente: +1 ponto de complexidade adicional</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Colaboradores &gt;500: +1 ponto de complexidade adicional</Text>
          <Text style={{ fontSize: 9, marginBottom: 4 }}>• Score ISCA/GovMetrix ≥60: +1 ponto | ≥80: +2 pontos</Text>

          <View style={[styles.alertBox, { backgroundColor: '#e0f2fe', borderColor: '#0ea5e9', marginTop: 15 }]}>
            <Text style={[styles.alertTitle, { color: '#0c4a6e' }]}>Lógica de Upgrade</Text>
            <Text style={[styles.alertText, { color: '#075985' }]}>
              Com 3+ pontos de complexidade adicional, o sistema recomenda um upgrade de 1 tier no plano 
              (ex: Essencial → Profissional, Profissional → Business). O upgrade máximo é de 2 tiers acima 
              do plano base por faturamento.
            </Text>
          </View>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
}

export function ComplexidadePDF() {
  const fileName = `matriz-complexidade-pesos-${new Date().toISOString().split('T')[0]}.pdf`;

  return (
    <PDFDownloadLink
      document={<ComplexidadePDFDocument />}
      fileName={fileName}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
    >
      {({ loading }) => (
        <>
          <FileDown className="h-4 w-4" />
          {loading ? 'Gerando PDF...' : 'Baixar PDF'}
        </>
      )}
    </PDFDownloadLink>
  );
}
