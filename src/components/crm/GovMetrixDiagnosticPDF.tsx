import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GovMetrixDiagnosticPDFProps {
  name: string;
  company: string;
  email: string;
  score: number;
  stage: string;
  categoryScores: Record<string, number>;
  date: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#C0A062',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D2C54',
  },
  subtitle: {
    fontSize: 10,
    color: '#666666',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D2C54',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0D2C54',
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#C0A062',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  stageBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 5,
  },
  stageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  stageDescription: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
  },
  categorySection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D2C54',
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 10,
    color: '#333333',
  },
  progressBar: {
    width: 150,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  categoryScore: {
    width: 40,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  ctaSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#0D2C54',
    borderRadius: 8,
  },
  ctaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C0A062',
    marginBottom: 10,
  },
  ctaText: {
    fontSize: 10,
    color: '#ffffff',
    lineHeight: 1.5,
    marginBottom: 10,
  },
  ctaContact: {
    fontSize: 10,
    color: '#C0A062',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 8,
    color: '#999999',
  },
});

const stageConfig: Record<string, { color: string; description: string }> = {
  'Embrionário': { color: '#ef4444', description: 'Governança informal ou inexistente' },
  'Inicial': { color: '#f97316', description: 'Primeiros passos em estruturação' },
  'Em Desenvolvimento': { color: '#f59e0b', description: 'Estruturas em consolidação' },
  'Estruturado': { color: '#3b82f6', description: 'Governança bem estabelecida' },
  'Avançado': { color: '#10b981', description: 'Excelência em governança' },
};

const getProgressColor = (score: number) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#3b82f6';
  if (score >= 40) return '#f59e0b';
  if (score >= 20) return '#f97316';
  return '#ef4444';
};

export default function GovMetrixDiagnosticPDF({
  name,
  company,
  email,
  score,
  stage,
  categoryScores,
  date,
}: GovMetrixDiagnosticPDFProps) {
  const stageInfo = stageConfig[stage] || stageConfig['Inicial'];
  const formattedDate = format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Legacy OS</Text>
            <Text style={styles.subtitle}>Sistema Operacional de Governança Corporativa</Text>
          </View>
          <View>
            <Text style={styles.subtitle}>Diagnóstico GovMetrix®</Text>
            <Text style={styles.subtitle}>{formattedDate}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Relatório de Maturidade em Governança</Text>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Respondente</Text>
            <Text style={styles.infoValue}>{name}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Empresa</Text>
            <Text style={styles.infoValue}>{company}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>E-mail</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>
        </View>

        {/* Score Section */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{score}</Text>
          </View>
          <View style={[styles.stageBadge, { backgroundColor: stageInfo.color }]}>
            <Text style={styles.stageText}>{stage}</Text>
          </View>
          <Text style={styles.stageDescription}>{stageInfo.description}</Text>
        </View>

        {/* Category Scores */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Pontuação por Dimensão</Text>
          {Object.entries(categoryScores).map(([category, catScore]) => (
            <View key={category} style={styles.categoryRow}>
              <Text style={styles.categoryName}>{category}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${catScore}%`,
                      backgroundColor: getProgressColor(catScore),
                    },
                  ]}
                />
              </View>
              <Text style={[styles.categoryScore, { color: getProgressColor(catScore) }]}>
                {catScore}%
              </Text>
            </View>
          ))}
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Próximos Passos</Text>
          <Text style={styles.ctaText}>
            A Legacy OS pode ajudar sua empresa a evoluir na jornada de governança corporativa.
            Com nossa plataforma AI-First, você terá acesso a ferramentas que transformam
            a gestão do conselho e aceleram a maturidade organizacional.
          </Text>
          <Text style={styles.ctaContact}>
            Agende uma demonstração: contato@legacyos.com.br
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Legacy OS - Todos os direitos reservados
          </Text>
          <Text style={styles.footerText}>
            Metodologia baseada no Código IBGC - 6ª Edição
          </Text>
        </View>
      </Page>
    </Document>
  );
}
