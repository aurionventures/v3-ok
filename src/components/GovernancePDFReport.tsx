import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { HistoricalAssessment } from '@/data/mockHistoricalData';

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 15,
    textAlign: 'center',
    borderBottom: 2,
    borderBottomColor: '#1e40af',
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  titlePage2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4,
  },
  scoreContainer: {
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 11,
    color: '#666666',
    lineHeight: 1.5,
  },
  dimensionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  dimensionBox: {
    width: '48%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
    textAlign: 'center',
  },
  dimensionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 5,
    lineHeight: 1.3,
  },
  dimensionScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  text: {
    fontSize: 10,
    lineHeight: 1.2,
    marginBottom: 6,
  },
  boldText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  listItem: {
    fontSize: 9,
    marginBottom: 2,
    marginLeft: 15,
  },
  insightItem: {
    marginBottom: 6,
    padding: 8,
    backgroundColor: '#f0f9ff',
    borderRadius: 4,
  },
  recommendationItem: {
    marginBottom: 6,
    padding: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 4,
  },
  nextStepItem: {
    marginBottom: 6,
    padding: 8,
    backgroundColor: '#f0fdf4',
    borderRadius: 4,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#1e40af',
  },
  concentratedControlBox: {
    backgroundColor: '#e0f2fe',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    textAlign: 'center',
  },
  concentratedControlTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 5,
  },
  concentratedControlScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666666',
    borderTop: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  companyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
  },
  companyInfoItem: {
    flex: 1,
    textAlign: 'center',
  },
  companyInfoLabel: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 3,
  },
  companyInfoValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
  },
});

interface IGBCPDFReportProps {
  assessment: HistoricalAssessment;
}

const IGBCPDFDocument: React.FC<IGBCPDFReportProps> = ({ assessment }) => {
  const currentDate = new Date().toLocaleDateString('pt-BR');

  const getMaturityDescription = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'embrionário':
        return "Estágio inicial. A empresa ainda não possui estruturas de governança formais. É fundamental estabelecer bases sólidas.";
      case 'inicial':
        return "Práticas básicas implementadas. É hora de estruturar processos mais robustos e formais de governança.";
      case 'básico':
        return "Estrutura básica estabelecida. Continue evoluindo para práticas mais sofisticadas e integradas.";
      case 'sólido':
        return "Boa maturidade em governança. Foque em otimização e alinhamento estratégico das práticas.";
      case 'avançado':
        return "Maturidade avançada em governança. Lidere pelo exemplo e continue inovando em melhores práticas.";
      default:
        return "Continue sua jornada de melhoria contínua em governança corporativa.";
    }
  };

  const dimensionData = [
    // pontuacao_dimensoes já está em pontos (0-5) após a correção
    { name: "Sócios", score: assessment.result.pontuacao_dimensoes["Sócios"] || 0 },
    { name: "Conselho", score: assessment.result.pontuacao_dimensoes["Conselho"] || 0 },
    { name: "Diretoria", score: assessment.result.pontuacao_dimensoes["Diretoria"] || 0 },
    { name: "Órgãos de Fiscalização", score: assessment.result.pontuacao_dimensoes["Órgãos de fiscalização e controle"] || 0 },
    { name: "Conduta e Conflitos", score: assessment.result.pontuacao_dimensoes["Conduta e conflitos de interesses"] || 0 }
  ];

  // Usar percentual se disponível, senão converter de pontos
  const concentratedControlScore = assessment.result.pontuacao_empresas_controle_concentrado?.percentual || 
    ((assessment.result.pontuacao_empresas_controle_concentrado?.pontos || 0) / 5 * 100);

  return (
    <Document>
      {/* PÁGINA 1 - Overview e Performance */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Relatório Executivo - Maturidade IBGC</Text>
          <Text style={styles.subtitle}>
            Diagnóstico de Governança Corporativa - {currentDate}
          </Text>
        </View>

        {/* Company Info */}
        <View style={styles.companyInfo}>
          <View style={styles.companyInfoItem}>
            <Text style={styles.companyInfoLabel}>EMPRESA</Text>
            <Text style={styles.companyInfoValue}>{assessment.companyData.nome}</Text>
          </View>
          <View style={styles.companyInfoItem}>
            <Text style={styles.companyInfoLabel}>PERÍODO</Text>
            <Text style={styles.companyInfoValue}>{assessment.period}</Text>
          </View>
          <View style={styles.companyInfoItem}>
            <Text style={styles.companyInfoLabel}>ANALISTA</Text>
            <Text style={styles.companyInfoValue}>{assessment.analyst}</Text>
          </View>
        </View>

        {/* Score Geral */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {assessment.result.pontuacao_total_percentual 
              ? `${assessment.result.pontuacao_total_percentual.toFixed(1)}%`
              : `${(assessment.result.pontuacao_total / 5 * 100).toFixed(1)}%`
            }
          </Text>
          <Text style={styles.levelText}>
            Nível de Maturidade: {assessment.result.estagio}
          </Text>
          <Text style={styles.descriptionText}>
            {getMaturityDescription(assessment.result.estagio)}
          </Text>
        </View>

        {/* Scores por Dimensão */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desempenho por Dimensão</Text>
          <View style={styles.dimensionContainer}>
            {dimensionData.map((dimension, index) => (
              <View key={index} style={styles.dimensionBox}>
                <Text style={styles.dimensionTitle}>{dimension.name}</Text>
                <Text style={styles.dimensionScore}>{dimension.score.toFixed(1)}/5.0</Text>
                <Text style={[styles.text, { fontSize: 9 }]}>
                  {((dimension.score / 5) * 100).toFixed(0)}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Concentrated Control Business Score */}
        {concentratedControlScore > 0 && (
          <View style={styles.concentratedControlBox}>
            <Text style={styles.concentratedControlTitle}>
              Empresas de Controle Concentrado
            </Text>
            <Text style={styles.concentratedControlScore}>
              {concentratedControlScore.toFixed(1)}%
            </Text>
            <Text style={styles.text}>
              Pontuação específica para aspectos de empresas familiares e de controle concentrado
            </Text>
          </View>
        )}

        {/* Footer Página 1 */}
        <Text 
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages} - Relatório de Maturidade em Governança gerado automaticamente pela Legacy Governance - 29/09/2025`}
          fixed
        />
      </Page>

      {/* PÁGINA 2 - Insights e Recomendações */}
      <Page size="A4" style={styles.page}>
        {/* Header Página 2 */}
        <View style={styles.header}>
          <Text style={styles.titlePage2}>Insights e Recomendações</Text>
          <Text style={styles.subtitle}>
            Diagnóstico de Governança Corporativa - {assessment.companyData.nome}
          </Text>
        </View>

        {/* Principais Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Principais Insights</Text>
          {assessment.keyInsights.slice(0, 2).map((insight, index) => (
            <View key={index} style={styles.insightItem}>
              <Text style={styles.itemTitle}>Insight {index + 1}</Text>
              <Text style={styles.text}>{insight}</Text>
            </View>
          ))}
        </View>

        {/* Recomendações Prioritárias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recomendações Prioritárias</Text>
          {assessment.recommendations.slice(0, 2).map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.itemTitle}>Recomendação {index + 1}</Text>
              <Text style={styles.text}>{recommendation}</Text>
            </View>
          ))}
        </View>

        {/* Próximos Passos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximos Passos</Text>
          {assessment.nextSteps.slice(0, 2).map((step, index) => (
            <View key={index} style={styles.nextStepItem}>
              <Text style={styles.itemTitle}>Passo {index + 1}</Text>
              <Text style={styles.text}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Footer Página 2 */}
        <Text 
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages} - Relatório de Maturidade em Governança gerado automaticamente pela Legacy Governance - 29/09/2025`}
          fixed
        />
      </Page>
    </Document>
  );
};

export const generateGovernancePDFReport = async (assessment: HistoricalAssessment) => {
  try {
    const blob = await pdf(<IGBCPDFDocument assessment={assessment} />).toBlob();
    const fileName = `diagnostico-maturidade-governanca-${assessment.companyData.nome.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
};

export default IGBCPDFDocument;