import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { MeetingSchedule } from '@/types/annualSchedule';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottom: '2 solid #1e40af',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 6,
  },
  metadata: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: '1 solid #cbd5e1',
  },
  text: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  listItem: {
    fontSize: 10,
    color: '#334155',
    marginBottom: 6,
    paddingLeft: 15,
  },
  table: {
    width: '100%',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e2e8f0',
  },
  tableHeader: {
    backgroundColor: '#f1f5f9',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 9,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#94a3b8',
    paddingTop: 10,
    borderTop: '1 solid #e2e8f0',
  },
});

interface ATAPDFDocumentProps {
  meeting: MeetingSchedule;
}

export const ATAPDFDocument = ({ meeting }: ATAPDFDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>ATA DE REUNIÃO</Text>
        <Text style={styles.subtitle}>{meeting.council}</Text>
        <Text style={styles.metadata}>
          Data: {new Date(meeting.date).toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
          })} às {meeting.time}
        </Text>
        <Text style={styles.metadata}>
          Modalidade: {meeting.modalidade} | Tipo: {meeting.type}
        </Text>
      </View>

      {/* Participantes */}
      {meeting.participants && meeting.participants.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PARTICIPANTES PRESENTES</Text>
          {meeting.participants.filter(p => p.confirmed).map((p, idx) => (
            <Text key={idx} style={styles.listItem}>
              • {p.external_name || p.name || 'Membro'} - {p.role}
            </Text>
          ))}
        </View>
      )}

      {/* Resumo Executivo */}
      {meeting.ata?.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RESUMO EXECUTIVO</Text>
          <Text style={styles.text}>{meeting.ata.summary}</Text>
        </View>
      )}

      {/* Decisões */}
      {meeting.ata?.decisions && meeting.ata.decisions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DECISÕES E DELIBERAÇÕES</Text>
          {meeting.ata.decisions.map((decision, idx) => (
            <Text key={idx} style={styles.listItem}>
              {idx + 1}. {decision}
            </Text>
          ))}
        </View>
      )}

      {/* Tarefas */}
      {meeting.meeting_tasks && meeting.meeting_tasks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TAREFAS ATRIBUÍDAS</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Tarefa</Text>
              <Text style={styles.tableCell}>Responsável</Text>
              <Text style={styles.tableCell}>Prazo</Text>
              <Text style={styles.tableCell}>Status</Text>
            </View>
            {meeting.meeting_tasks.map((task, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.tableCell}>{task.title}</Text>
                <Text style={styles.tableCell}>{task.responsible}</Text>
                <Text style={styles.tableCell}>
                  {new Date(task.deadline).toLocaleDateString('pt-BR')}
                </Text>
                <Text style={styles.tableCell}>{task.status}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Próximos Assuntos */}
      {meeting.nextMeetingTopics && meeting.nextMeetingTopics.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ASSUNTOS PARA PRÓXIMA REUNIÃO</Text>
          {meeting.nextMeetingTopics.map((topic, idx) => (
            <Text key={idx} style={styles.listItem}>• {topic}</Text>
          ))}
        </View>
      )}

      {/* Rodapé */}
      <View style={styles.footer}>
        <Text>
          ATA gerada em {new Date(meeting.ata?.generatedAt || new Date()).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
        <Text>Por: {meeting.ata?.generatedBy || 'Sistema'}</Text>
      </View>
    </Page>
  </Document>
);
