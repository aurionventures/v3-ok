import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { ESGMaturityResult } from '@/types/esgMaturity';
import { generateESGRecommendations } from '@/utils/esgMaturityCalculator';

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottom: 2,
    borderBottomColor: '#22c55e',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 10,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 5,
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
    color: '#22c55e',
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
  pillarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  pillarBox: {
    width: '23%',
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
    textAlign: 'center',
  },
  pillarTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pillarScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  text: {
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 8,
  },
  boldText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  listItem: {
    fontSize: 10,
    marginBottom: 3,
    marginLeft: 15,
  },
  recommendationItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 5,
  },
  recommendationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  priorityHigh: {
    color: '#dc2626',
  },
  priorityMedium: {
    color: '#f59e0b',
  },
  priorityLow: {
    color: '#059669',
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
});

interface ESGPDFReportProps {
  results: ESGMaturityResult;
}

const ESGPDFDocument: React.FC<ESGPDFReportProps> = ({ results }) => {
  const recommendations = generateESGRecommendations(results);
  const currentDate = new Date().toLocaleDateString('pt-BR');

  const getMaturityDescription = (level: number) => {
    switch (level) {
      case 1:
        return "Estágio inicial da jornada ESG. Foco em estabelecer políticas básicas e conformidade regulatória.";
      case 2:
        return "Práticas ESG reativas. É hora de estruturar programas mais robustos e proativos.";
      case 3:
        return "Abordagem estratégica para ESG. Continue expandindo e integrando essas práticas ao negócio.";
      case 4:
        return "Maturidade inclusiva em ESG. Foque em engajar stakeholders e criar valor compartilhado.";
      case 5:
        return "Empresa integrada em ESG. Continue liderando e inovando em sustentabilidade.";
      case 6:
        return "Empresa regenerativa em ESG. Líder em transformação sistêmica.";
      default:
        return "Continue sua jornada de melhoria contínua em ESG.";
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Relatório de Maturidade ESG</Text>
          <Text style={styles.subtitle}>
            Avaliação completa baseada em {results.totalQuestions} perguntas - {currentDate}
          </Text>
        </View>

        {/* Score Geral */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{results.overallScore.toFixed(1)}/6.0</Text>
          <Text style={styles.levelText}>
            Nível {results.maturityLevel.level}: {results.maturityLevel.name}
          </Text>
          <Text style={styles.descriptionText}>
            {getMaturityDescription(results.maturityLevel.level)}
          </Text>
        </View>

        {/* Scores por Pilar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desempenho por Pilar</Text>
          <View style={styles.pillarContainer}>
            {Object.entries(results.pillarScores).map(([key, pillar]) => (
              <View key={key} style={styles.pillarBox}>
                <Text style={styles.pillarTitle}>{pillar.title}</Text>
                <Text style={styles.pillarScore}>{pillar.score.toFixed(1)}</Text>
                <Text style={[styles.text, { fontSize: 9 }]}>
                  {pillar.percentage.toFixed(0)}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Análise Detalhada */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análise Detalhada</Text>
          {Object.entries(results.pillarScores).map(([key, pillar]) => (
            <View key={key} style={{ marginBottom: 10 }}>
              <Text style={styles.boldText}>{pillar.title}</Text>
              <Text style={styles.text}>
                Score: {pillar.score.toFixed(1)}/6.0 ({pillar.percentage.toFixed(0)}% do potencial máximo)
              </Text>
              <Text style={styles.text}>
                Baseado em {pillar.questions} perguntas distribuídas em {Object.keys(pillar.subDimensions).length} sub-dimensões.
              </Text>
            </View>
          ))}
        </View>

        {/* Recomendações */}
        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recomendações Prioritárias</Text>
            {recommendations.slice(0, 6).map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Text style={[
                  styles.recommendationTitle,
                  rec.priority === 'Alta' ? styles.priorityHigh :
                  rec.priority === 'Média' ? styles.priorityMedium : styles.priorityLow
                ]}>
                  {rec.pillar} - Prioridade {rec.priority}
                </Text>
                <Text style={styles.text}>{rec.action}</Text>
                <Text style={[styles.text, { fontSize: 9, color: '#666666' }]}>
                  Score atual: {rec.currentScore.toFixed(1)} → Meta: {rec.targetScore.toFixed(1)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Roadmap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Roadmap para Evolução</Text>
          
          <Text style={styles.boldText}>Curto Prazo (3-6 meses):</Text>
          <Text style={styles.listItem}>• Implementar políticas básicas ESG</Text>
          <Text style={styles.listItem}>• Estabelecer métricas de monitoramento</Text>
          <Text style={styles.listItem}>• Capacitar equipes internas</Text>
          
          <Text style={styles.boldText}>Médio Prazo (6-12 meses):</Text>
          <Text style={styles.listItem}>• Integrar ESG à estratégia de negócios</Text>
          <Text style={styles.listItem}>• Engajar stakeholders externos</Text>
          <Text style={styles.listItem}>• Implementar programas estruturados</Text>
          
          <Text style={styles.boldText}>Longo Prazo (1-2 anos):</Text>
          <Text style={styles.listItem}>• Liderar transformação setorial</Text>
          <Text style={styles.listItem}>• Inovar em soluções sustentáveis</Text>
          <Text style={styles.listItem}>• Alcançar impacto regenerativo</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Relatório gerado automaticamente pelo Sistema de Avaliação de Maturidade ESG - {currentDate}
        </Text>
      </Page>
    </Document>
  );
};

export const generateESGPDFReport = async (results: ESGMaturityResult) => {
  try {
    const blob = await pdf(<ESGPDFDocument results={results} />).toBlob();
    const fileName = `relatorio-esg-${new Date().toISOString().split('T')[0]}.pdf`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
};

export default ESGPDFDocument;