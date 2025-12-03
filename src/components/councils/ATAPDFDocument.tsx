import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { MeetingSchedule } from '@/types/annualSchedule';
import { ATAApprovalWithParticipant, ATAStatus } from '@/types/ataApproval';

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
  tableCellSmall: {
    flex: 0.8,
    padding: 8,
    fontSize: 9,
  },
  tableCellLarge: {
    flex: 1.2,
    padding: 8,
    fontSize: 9,
  },
  approvalFooter: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingTop: 8,
    borderTop: '1 solid #e2e8f0',
  },
  statusApproved: {
    color: '#16a34a',
  },
  statusPending: {
    color: '#ca8a04',
  },
  statusRejected: {
    color: '#dc2626',
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
  approvals?: ATAApprovalWithParticipant[];
  ataStatus?: ATAStatus;
}

const getApprovalStatusText = (status: string) => {
  switch (status) {
    case 'APROVADO': return 'Aprovado';
    case 'REJEITADO': return 'Rejeitado';
    case 'REVISAO_SOLICITADA': return 'Revisao';
    default: return 'Pendente';
  }
};

const getSignatureStatusText = (status: string) => {
  return status === 'ASSINADO' ? 'Assinado' : 'Aguardando';
};

const getATAStatusText = (status: ATAStatus) => {
  switch (status) {
    case 'ASSINADO': return 'Finalizada - Todas assinaturas coletadas';
    case 'APROVADO': return 'Aprovada - Aguardando assinaturas';
    case 'EM_APROVACAO': return 'Em processo de aprovacao';
    case 'PENDENTE_APROVACAO': return 'Aguardando envio para aprovacao';
    default: return 'Aguardando geracao da ATA';
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'MEMBRO': return 'Membro';
    case 'CONVIDADO': return 'Convidado';
    case 'OBSERVADOR': return 'Observador';
    default: return role;
  }
};

export const ATAPDFDocument = ({ meeting, approvals, ataStatus }: ATAPDFDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Cabecalho */}
      <View style={styles.header}>
        <Text style={styles.title}>ATA DE REUNIAO</Text>
        <Text style={styles.subtitle}>{meeting.council}</Text>
        <Text style={styles.metadata}>
          Data: {new Date(meeting.date).toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
          })} as {meeting.time}
        </Text>
        <Text style={styles.metadata}>
          Modalidade: {meeting.modalidade} | Tipo: {meeting.type}
        </Text>
      </View>

      {/* Participantes Presentes */}
      {meeting.participants && meeting.participants.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PARTICIPANTES PRESENTES</Text>
          {meeting.participants.filter(p => p.confirmed !== false).map((p, idx) => (
            <Text key={idx} style={styles.listItem}>
              - {p.external_name || p.name || 'Membro'} ({getRoleLabel(p.role)})
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

      {/* Decisoes */}
      {meeting.ata?.decisions && meeting.ata.decisions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DECISOES E DELIBERACOES</Text>
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
          <Text style={styles.sectionTitle}>TAREFAS ATRIBUIDAS</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCellLarge}>Tarefa</Text>
              <Text style={styles.tableCell}>Responsavel</Text>
              <Text style={styles.tableCellSmall}>Prazo</Text>
              <Text style={styles.tableCellSmall}>Status</Text>
            </View>
            {meeting.meeting_tasks.map((task, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.tableCellLarge}>{task.title}</Text>
                <Text style={styles.tableCell}>{task.responsible}</Text>
                <Text style={styles.tableCellSmall}>
                  {new Date(task.deadline).toLocaleDateString('pt-BR')}
                </Text>
                <Text style={styles.tableCellSmall}>{task.status}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Proximos Assuntos */}
      {meeting.nextMeetingTopics && meeting.nextMeetingTopics.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ASSUNTOS PARA PROXIMA REUNIAO</Text>
          {meeting.nextMeetingTopics.map((topic, idx) => (
            <Text key={idx} style={styles.listItem}>- {topic}</Text>
          ))}
        </View>
      )}

      {/* Aprovacoes e Assinaturas */}
      {approvals && approvals.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APROVACOES E ASSINATURAS DA ATA</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCellLarge}>Membro</Text>
              <Text style={styles.tableCellSmall}>Cargo</Text>
              <Text style={styles.tableCellSmall}>Aprovacao</Text>
              <Text style={styles.tableCellSmall}>Assinatura</Text>
              <Text style={styles.tableCellSmall}>Data</Text>
            </View>
            {approvals.map((approval, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.tableCellLarge}>
                  {approval.participant?.external_name || 'Membro'}
                </Text>
                <Text style={styles.tableCellSmall}>
                  {getRoleLabel(approval.participant?.role || 'MEMBRO')}
                </Text>
                <Text style={[
                  styles.tableCellSmall,
                  approval.approval_status === 'APROVADO' ? styles.statusApproved :
                  approval.approval_status === 'REJEITADO' ? styles.statusRejected :
                  styles.statusPending
                ]}>
                  {getApprovalStatusText(approval.approval_status)}
                </Text>
                <Text style={[
                  styles.tableCellSmall,
                  approval.signature_status === 'ASSINADO' ? styles.statusApproved : styles.statusPending
                ]}>
                  {getSignatureStatusText(approval.signature_status)}
                </Text>
                <Text style={styles.tableCellSmall}>
                  {approval.signed_at 
                    ? new Date(approval.signed_at).toLocaleDateString('pt-BR')
                    : approval.approved_at 
                      ? new Date(approval.approved_at).toLocaleDateString('pt-BR')
                      : '-'}
                </Text>
              </View>
            ))}
          </View>
          
          {/* Status Geral da ATA */}
          <Text style={styles.approvalFooter}>
            Status da ATA: {getATAStatusText(ataStatus)}
          </Text>
        </View>
      )}

      {/* Rodape */}
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
