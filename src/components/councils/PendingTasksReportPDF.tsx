import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { saveAs } from 'file-saver';

export interface ReportTask {
  id: string;
  task: string;
  priority?: 'high' | 'medium' | 'low'; // Agora opcional
  dueDate: Date;
  organ: string;
  organType: 'conselho' | 'comite' | 'comissao';
}

export interface ReportFilters {
  priorities: string[];
  organs: string[];
  organsByType: {
    conselhos: string[];
    comites: string[];
    comissoes: string[];
  };
}

export interface ReportData {
  filters: ReportFilters;
  tasks: ReportTask[];
  summary: {
    total: number;
    byOrganType: {
      conselhos: number;
      comites: number;
      comissoes: number;
    };
  };
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#1e40af',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#6b7280',
  },
  summarySection: {
    marginTop: 20,
    marginBottom: 25,
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 4,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#374151',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  summaryItem: {
    flex: 1,
    padding: 8,
    backgroundColor: '#ffffff',
    marginHorizontal: 3,
    borderRadius: 3,
  },
  summaryLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 3,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  filtersSection: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  filtersTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e40af',
  },
  filterGroup: {
    marginBottom: 6,
  },
  filterLabel: {
    fontSize: 9,
    color: '#1e40af',
    marginBottom: 2,
  },
  filterValue: {
    fontSize: 9,
    color: '#3b82f6',
    marginLeft: 10,
  },
  organTypeBadge: {
    fontSize: 8,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    marginBottom: 8,
  },
  badgeConselho: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
  badgeComite: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  badgeComissao: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  tasksSection: {
    marginTop: 10,
  },
  taskItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#fafafa',
    borderLeftWidth: 3,
    borderRadius: 3,
  },
  taskItemHigh: {
    borderLeftColor: '#ef4444',
  },
  taskItemMedium: {
    borderLeftColor: '#f59e0b',
  },
  taskItemLow: {
    borderLeftColor: '#10b981',
  },
  taskTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  taskDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  taskLabel: {
    fontSize: 9,
    color: '#6b7280',
  },
  priorityBadge: {
    fontSize: 8,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  priorityHigh: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  priorityMedium: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  priorityLow: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
});

export const PendingTasksReportDocument = ({ data }: { data: ReportData }) => {
  const getOrganTypeBadgeStyle = (organType: string) => {
    switch (organType) {
      case 'conselho': return styles.badgeConselho;
      case 'comite': return styles.badgeComite;
      case 'comissao': return styles.badgeComissao;
      default: return styles.badgeConselho;
    }
  };

  const getOrganTypeLabel = (organType: string) => {
    switch (organType) {
      case 'conselho': return 'CONSELHO';
      case 'comite': return 'COMITÊ';
      case 'comissao': return 'COMISSÃO';
      default: return organType.toUpperCase();
    }
  };

  const hasFilters = data.filters.priorities.length > 0 || data.filters.organs.length > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Relatório de Tarefas Pendentes</Text>
          <Text style={styles.subtitle}>
            Gerado em {format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
          </Text>
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Resumo Executivo</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>{data.summary.total}</Text>
            </View>
          </View>

          {/* Distribuição por Tipo de Órgão */}
          <View style={{ marginTop: 15 }}>
            <Text style={styles.summaryLabel}>Distribuição por Tipo de Órgão</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
              <View style={[styles.summaryItem, { backgroundColor: '#dbeafe' }]}>
                <Text style={[styles.summaryLabel, { color: '#1e40af' }]}>Conselhos</Text>
                <Text style={[styles.summaryValue, { color: '#1e40af' }]}>
                  {data.summary.byOrganType.conselhos}
                </Text>
              </View>
              <View style={[styles.summaryItem, { backgroundColor: '#d1fae5' }]}>
                <Text style={[styles.summaryLabel, { color: '#065f46' }]}>Comitês</Text>
                <Text style={[styles.summaryValue, { color: '#065f46' }]}>
                  {data.summary.byOrganType.comites}
                </Text>
              </View>
              <View style={[styles.summaryItem, { backgroundColor: '#fef3c7' }]}>
                <Text style={[styles.summaryLabel, { color: '#92400e' }]}>Comissões</Text>
                <Text style={[styles.summaryValue, { color: '#92400e' }]}>
                  {data.summary.byOrganType.comissoes}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Filters Applied */}
        {hasFilters && (
          <View style={styles.filtersSection}>
            <Text style={styles.filtersTitle}>Filtros Aplicados</Text>
            
            {data.filters.priorities.length > 0 && (
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>• Prioridades:</Text>
                <Text style={styles.filterValue}>
                  {data.filters.priorities.map(p => 
                    p === 'high' ? 'Alta' : p === 'medium' ? 'Média' : 'Baixa'
                  ).join(', ')}
                </Text>
              </View>
            )}

            {data.filters.organsByType.conselhos.length > 0 && (
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>• Conselhos:</Text>
                <Text style={styles.filterValue}>
                  {data.filters.organsByType.conselhos.join(', ')}
                </Text>
              </View>
            )}

            {data.filters.organsByType.comites.length > 0 && (
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>• Comitês:</Text>
                <Text style={styles.filterValue}>
                  {data.filters.organsByType.comites.join(', ')}
                </Text>
              </View>
            )}

            {data.filters.organsByType.comissoes.length > 0 && (
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>• Comissões:</Text>
                <Text style={styles.filterValue}>
                  {data.filters.organsByType.comissoes.join(', ')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Tasks List */}
        <View style={styles.tasksSection}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 12, color: '#374151', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 5 }}>
            Tarefas Pendentes ({data.tasks.length})
          </Text>
          
          {data.tasks.map((task, index) => (
            <View 
              key={task.id} 
              style={[
                styles.taskItem,
                task.priority === 'high' && styles.taskItemHigh,
                task.priority === 'medium' && styles.taskItemMedium,
                task.priority === 'low' && styles.taskItemLow,
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Text style={[styles.organTypeBadge, getOrganTypeBadgeStyle(task.organType)]}>
                  {getOrganTypeLabel(task.organType)}
                </Text>
              </View>

              <Text style={styles.taskTitle}>{index + 1}. {task.task}</Text>
              
              <View style={styles.taskDetails}>
                <View>
                  <Text style={styles.taskLabel}>
                    Prazo: {format(task.dueDate, 'dd/MM/yyyy')}
                  </Text>
                  <Text style={styles.taskLabel}>
                    Órgão: {task.organ}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Relatório gerado automaticamente pelo Sistema de Governança</Text>
          <Text>Documento confidencial - Uso interno</Text>
        </View>
      </Page>
    </Document>
  );
};

export const generatePendingTasksReportPDF = async (data: ReportData) => {
  const blob = await pdf(<PendingTasksReportDocument data={data} />).toBlob();
  const fileName = `relatorio-pendencias-${format(new Date(), 'dd-MM-yyyy-HHmm')}.pdf`;
  saveAs(blob, fileName);
};
