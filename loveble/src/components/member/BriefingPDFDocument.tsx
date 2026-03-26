import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { MemberBriefing } from "@/types/copilot";

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: "#6366f1",
    paddingBottom: 15,
  },
  title: {
    fontSize: 22,
    color: "#6366f1",
    marginBottom: 8,
    fontFamily: "Helvetica-Bold",
  },
  subtitle: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#1f2937",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    fontFamily: "Helvetica-Bold",
  },
  section: {
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#374151",
    marginBottom: 8,
    textAlign: "justify",
  },
  listItem: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#374151",
    marginBottom: 6,
    marginLeft: 15,
  },
  listNumber: {
    fontFamily: "Helvetica-Bold",
    marginRight: 8,
  },
  topicCard: {
    marginBottom: 18,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#6366f1",
    backgroundColor: "#f8fafc",
  },
  topicTitle: {
    fontSize: 12,
    color: "#1f2937",
    marginBottom: 6,
    fontFamily: "Helvetica-Bold",
  },
  topicRelevance: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 10,
    fontStyle: "italic",
  },
  subSectionTitle: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 6,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  keyPoint: {
    fontSize: 9,
    lineHeight: 1.4,
    color: "#374151",
    marginBottom: 4,
    marginLeft: 10,
  },
  highlightBox: {
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  perspectiveBox: {
    backgroundColor: "#eef2ff",
  },
  perspectiveLabel: {
    fontSize: 9,
    color: "#6366f1",
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  perspectiveText: {
    fontSize: 9,
    color: "#4338ca",
    lineHeight: 1.4,
  },
  concernBox: {
    backgroundColor: "#fffbeb",
  },
  concernLabel: {
    fontSize: 9,
    color: "#d97706",
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  concernText: {
    fontSize: 9,
    color: "#b45309",
    lineHeight: 1.4,
    marginLeft: 10,
    marginBottom: 3,
  },
  stanceBox: {
    backgroundColor: "#ecfdf5",
  },
  stanceLabel: {
    fontSize: 9,
    color: "#059669",
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  stanceText: {
    fontSize: 9,
    color: "#047857",
    lineHeight: 1.4,
  },
  checklistItem: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#374151",
    marginBottom: 6,
    marginLeft: 15,
  },
  documentTag: {
    fontSize: 9,
    color: "#374151",
    marginBottom: 5,
    marginLeft: 10,
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 3,
  },
  bulletPoint: {
    width: 4,
    height: 4,
    backgroundColor: "#6366f1",
    borderRadius: 2,
    marginRight: 8,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
});

interface BriefingPDFDocumentProps {
  briefing: MemberBriefing;
  generatedDate: string;
}

export function BriefingPDFDocument({ briefing, generatedDate }: BriefingPDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Briefing Personalizado</Text>
          <Text style={styles.subtitle}>Gerado em {generatedDate}</Text>
          <Text style={styles.subtitle}>
            Tempo estimado de leitura: {briefing.content.estimatedReadingTime} minutos
          </Text>
        </View>

        {/* Executive Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo Executivo</Text>
          {briefing.content.executiveSummary.split("\n\n").map((para, i) => (
            <Text key={i} style={styles.paragraph}>
              {para}
            </Text>
          ))}
        </View>

        {/* Critical Questions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perguntas Críticas</Text>
          {briefing.content.criticalQuestions.map((question, i) => (
            <View key={i} style={styles.row}>
              <Text style={[styles.listItem, styles.listNumber]}>{i + 1}.</Text>
              <Text style={[styles.listItem, { flex: 1, marginLeft: 0 }]}>{question}</Text>
            </View>
          ))}
        </View>
      </Page>

      {/* Topic Analysis Pages */}
      {briefing.content.topicBreakdown.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Análise por Pauta</Text>
            
            {briefing.content.topicBreakdown.map((topic, i) => (
              <View key={i} style={styles.topicCard} wrap={false}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicRelevance}>{topic.relevanceToMember}</Text>

                {/* Key Points */}
                <Text style={styles.subSectionTitle}>Pontos-Chave:</Text>
                {topic.keyPoints.map((point, j) => (
                  <View key={j} style={styles.row}>
                    <View style={styles.bulletPoint} />
                    <Text style={[styles.keyPoint, { flex: 1 }]}>{point}</Text>
                  </View>
                ))}

                {/* Your Perspective */}
                <View style={[styles.highlightBox, styles.perspectiveBox]}>
                  <Text style={styles.perspectiveLabel}>Sua Perspectiva é Importante:</Text>
                  <Text style={styles.perspectiveText}>{topic.yourPerspectiveMatters}</Text>
                </View>

                {/* Potential Concerns */}
                {topic.potentialConcerns.length > 0 && (
                  <View style={[styles.highlightBox, styles.concernBox]}>
                    <Text style={styles.concernLabel}>Preocupações Potenciais:</Text>
                    {topic.potentialConcerns.map((concern, j) => (
                      <Text key={j} style={styles.concernText}>• {concern}</Text>
                    ))}
                  </View>
                )}

                {/* Suggested Stance */}
                <View style={[styles.highlightBox, styles.stanceBox]}>
                  <Text style={styles.stanceLabel}>Posição Sugerida:</Text>
                  <Text style={styles.stanceText}>{topic.suggestedStance}</Text>
                </View>
              </View>
            ))}
          </View>
        </Page>
      )}

      {/* Checklist and Documents Page */}
      <Page size="A4" style={styles.page}>
        {/* Preparation Checklist */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Checklist de Preparação</Text>
          {briefing.content.preparationChecklist.map((item, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.checklistItem}>☐ {item}</Text>
            </View>
          ))}
        </View>

        {/* Related Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documentos Relacionados</Text>
          {briefing.content.relatedDocuments.map((doc, i) => (
            <Text key={i} style={styles.documentTag}>• {doc}</Text>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Documento gerado pelo Copiloto de Governança - Legacy OS
          </Text>
          <Text style={styles.footerText}>
            Este briefing é confidencial e destinado exclusivamente ao membro do conselho.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default BriefingPDFDocument;




