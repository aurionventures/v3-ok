import { useState, useCallback, useEffect } from 'react';
import { ATARevisionSuggestion, ATAVersion, RevisionSuggestionStatus } from '@/types/ataRevision';
import { useCreateAuditLog } from '@/hooks/useAuditLogs';

const REVISIONS_STORAGE_KEY = 'ata_revisions';
const VERSIONS_STORAGE_KEY = 'ata_versions';
const DEMO_INITIALIZED_KEY = 'ata_revisions_demo_initialized';

const DEMO_REVISIONS: ATARevisionSuggestion[] = [
  {
    id: 'rev-demo-1',
    meetingId: 'conselho-1',
    participantId: 'member-roberto',
    participantName: 'Roberto Alves',
    participantEmail: 'roberto.alves@empresa.com',
    section: 'deliberations',
    sectionLabel: 'Deliberações / Discussões',
    originalText: 'O conselho aprovou o investimento de R$ 500.000 para expansão.',
    suggestedText: 'O conselho aprovou por unanimidade o investimento de R$ 500.000 para expansão da área comercial na região Sul.',
    reason: 'Faltou mencionar que a decisão foi unânime e especificar a região de expansão.',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev-demo-2',
    meetingId: 'conselho-1',
    participantId: 'member-maria',
    participantName: 'Maria Silva',
    participantEmail: 'maria.silva@empresa.com',
    section: 'actions',
    sectionLabel: 'Encaminhamentos / Ações',
    originalText: 'Diretoria deve apresentar relatório na próxima reunião.',
    suggestedText: 'Diretoria Financeira deve apresentar relatório detalhado de viabilidade na próxima reunião ordinária, prevista para 15/01/2025.',
    reason: 'Necessário especificar qual diretoria e a data da próxima reunião para melhor acompanhamento.',
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev-demo-3',
    meetingId: 'conselho-1',
    participantId: 'member-carlos',
    participantName: 'Carlos Mendes',
    participantEmail: 'carlos.mendes@empresa.com',
    section: 'participants',
    sectionLabel: 'Participantes / Presença',
    originalText: 'Presentes: Roberto Alves, Maria Silva, Carlos Mendes.',
    suggestedText: 'Presentes: Roberto Alves (Presidente), Maria Silva (Conselheira), Carlos Mendes (Conselheiro Independente). Ausente justificado: João Pereira (Conselheiro).',
    reason: 'Incluir as funções de cada membro e registrar ausências justificadas conforme regimento.',
    status: 'pending',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev-demo-4',
    meetingId: 'comite-1',
    participantId: 'member-ana',
    participantName: 'Ana Costa',
    participantEmail: 'ana.costa@empresa.com',
    section: 'deliberations',
    sectionLabel: 'Deliberações / Discussões',
    originalText: 'Aprovada a política de compliance.',
    suggestedText: 'Aprovada a Política de Compliance Corporativo versão 2.0, com vigência a partir de 01/02/2025, conforme recomendação da auditoria externa.',
    reason: 'Importante registrar a versão do documento, data de vigência e origem da recomendação.',
    status: 'accepted',
    processedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    processedBy: 'Administrador',
    finalText: 'Aprovada a Política de Compliance Corporativo versão 2.0, com vigência a partir de 01/02/2025, conforme recomendação da auditoria externa.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev-demo-5',
    meetingId: 'comite-1',
    participantId: 'member-pedro',
    participantName: 'Pedro Santos',
    participantEmail: 'pedro.santos@empresa.com',
    section: 'closing',
    sectionLabel: 'Encerramento',
    originalText: 'Reunião encerrada às 16h.',
    suggestedText: 'Reunião encerrada às 16h30, com duração total de 2 horas.',
    reason: 'Corrigir horário de encerramento que estava incorreto.',
    status: 'rejected',
    processedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    processedBy: 'Administrador',
    adminResponse: 'Verificado nos registros que o horário correto de encerramento foi 16h. A gravação confirma.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const DEMO_VERSIONS: ATAVersion[] = [
  {
    id: 'version-demo-1',
    meetingId: 'comite-1',
    version: 1,
    content: 'ATA da Reunião do Comitê de Auditoria - Versão Original\n\nData: 10/12/2024\nHorário: 14h às 16h\n\nParticipantes: Ana Costa, Pedro Santos, Fernanda Lima\n\nDeliberações:\n- Aprovada a política de compliance.\n- Discutido o plano de auditoria 2025.\n\nEncaminhamentos:\n- Preparar cronograma de auditorias.\n\nObservações:\n- Reunião encerrada às 16h.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'Sistema',
    changesSummary: 'Versão inicial da ATA',
    suggestionsApplied: [],
  },
  {
    id: 'version-demo-2',
    meetingId: 'comite-1',
    version: 2,
    content: 'ATA da Reunião do Comitê de Auditoria - Versão 2\n\nData: 10/12/2024\nHorário: 14h às 16h\n\nParticipantes: Ana Costa (Presidente), Pedro Santos (Membro), Fernanda Lima (Membro)\n\nDeliberações:\n- Aprovada a Política de Compliance Corporativo versão 2.0, com vigência a partir de 01/02/2025, conforme recomendação da auditoria externa.\n- Discutido o plano de auditoria 2025.\n\nEncaminhamentos:\n- Preparar cronograma de auditorias para apresentação até 20/01/2025.\n\nObservações:\n- Reunião encerrada às 16h.',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdBy: 'Administrador',
    changesSummary: 'Aplicada sugestão de Ana Costa sobre detalhamento da política de compliance',
    suggestionsApplied: ['rev-demo-4'],
  },
];

const initializeDemoData = () => {
  const initialized = localStorage.getItem(DEMO_INITIALIZED_KEY);
  if (!initialized) {
    localStorage.setItem(REVISIONS_STORAGE_KEY, JSON.stringify(DEMO_REVISIONS));
    localStorage.setItem(VERSIONS_STORAGE_KEY, JSON.stringify(DEMO_VERSIONS));
    localStorage.setItem(DEMO_INITIALIZED_KEY, 'true');
  }
};

const getStoredRevisions = (): ATARevisionSuggestion[] => {
  initializeDemoData();
  const stored = localStorage.getItem(REVISIONS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setStoredRevisions = (revisions: ATARevisionSuggestion[]) => {
  localStorage.setItem(REVISIONS_STORAGE_KEY, JSON.stringify(revisions));
};

const getStoredVersions = (): ATAVersion[] => {
  const stored = localStorage.getItem(VERSIONS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setStoredVersions = (versions: ATAVersion[]) => {
  localStorage.setItem(VERSIONS_STORAGE_KEY, JSON.stringify(versions));
};

export const useATARevisions = (meetingId?: string) => {
  const [revisions, setRevisions] = useState<ATARevisionSuggestion[]>(() => {
    const all = getStoredRevisions();
    return meetingId ? all.filter(r => r.meetingId === meetingId) : all;
  });
  const [versions, setVersions] = useState<ATAVersion[]>(() => {
    const all = getStoredVersions();
    return meetingId ? all.filter(v => v.meetingId === meetingId) : all;
  });
  const [loading, setLoading] = useState(false);

  const createAuditLog = useCreateAuditLog();

  const refreshRevisions = useCallback(() => {
    const all = getStoredRevisions();
    setRevisions(meetingId ? all.filter(r => r.meetingId === meetingId) : all);
  }, [meetingId]);

  const addRevisionSuggestion = useCallback(async (
    suggestion: Omit<ATARevisionSuggestion, 'id' | 'status' | 'createdAt'>
  ) => {
    const newSuggestion: ATARevisionSuggestion = {
      ...suggestion,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const all = getStoredRevisions();
    all.push(newSuggestion);
    setStoredRevisions(all);
    
    setRevisions(prev => [...prev, newSuggestion]);

    await createAuditLog.mutateAsync({
      action: 'SUGESTAO_REVISAO_ATA',
      entity_type: 'ata_revision',
      entity_id: newSuggestion.id,
      new_values: newSuggestion,
      metadata: {
        meetingId: suggestion.meetingId,
        participantName: suggestion.participantName,
        section: suggestion.section,
      },
    });

    return newSuggestion;
  }, [createAuditLog]);

  const addMultipleSuggestions = useCallback(async (
    suggestions: Omit<ATARevisionSuggestion, 'id' | 'status' | 'createdAt'>[]
  ) => {
    const newSuggestions = suggestions.map(s => ({
      ...s,
      id: crypto.randomUUID(),
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    }));

    const all = getStoredRevisions();
    all.push(...newSuggestions);
    setStoredRevisions(all);
    
    setRevisions(prev => [...prev, ...newSuggestions]);

    for (const suggestion of newSuggestions) {
      await createAuditLog.mutateAsync({
        action: 'SUGESTAO_REVISAO_ATA',
        entity_type: 'ata_revision',
        entity_id: suggestion.id,
        new_values: suggestion,
        metadata: {
          meetingId: suggestion.meetingId,
          participantName: suggestion.participantName,
          section: suggestion.section,
        },
      });
    }

    return newSuggestions;
  }, [createAuditLog]);

  const processSuggestion = useCallback(async (
    suggestionId: string,
    status: RevisionSuggestionStatus,
    adminResponse?: string,
    finalText?: string,
    processedBy?: string
  ) => {
    const all = getStoredRevisions();
    const index = all.findIndex(r => r.id === suggestionId);
    
    if (index === -1) return null;

    const oldValue = { ...all[index] };
    all[index] = {
      ...all[index],
      status,
      adminResponse,
      finalText: finalText || (status === 'accepted' ? all[index].suggestedText : undefined),
      processedAt: new Date().toISOString(),
      processedBy,
    };

    setStoredRevisions(all);
    setRevisions(meetingId ? all.filter(r => r.meetingId === meetingId) : all);

    await createAuditLog.mutateAsync({
      action: 'PROCESSAMENTO_REVISAO_ATA',
      entity_type: 'ata_revision',
      entity_id: suggestionId,
      old_values: oldValue,
      new_values: all[index],
      metadata: {
        status,
        processedBy,
        meetingId: all[index].meetingId,
      },
    });

    return all[index];
  }, [meetingId, createAuditLog]);

  const processBatchSuggestions = useCallback(async (
    suggestionIds: string[],
    status: RevisionSuggestionStatus,
    processedBy: string
  ) => {
    const all = getStoredRevisions();
    
    for (const id of suggestionIds) {
      const index = all.findIndex(r => r.id === id);
      if (index !== -1) {
        all[index] = {
          ...all[index],
          status,
          processedAt: new Date().toISOString(),
          processedBy,
          finalText: status === 'accepted' ? all[index].suggestedText : undefined,
        };
      }
    }

    setStoredRevisions(all);
    setRevisions(meetingId ? all.filter(r => r.meetingId === meetingId) : all);

    await createAuditLog.mutateAsync({
      action: 'PROCESSAMENTO_LOTE_REVISAO_ATA',
      entity_type: 'ata_revision',
      new_values: { suggestionIds, status },
      metadata: {
        count: suggestionIds.length,
        processedBy,
      },
    });
  }, [meetingId, createAuditLog]);

  const createNewVersion = useCallback(async (
    meetingId: string,
    content: string,
    createdBy: string,
    changesSummary: string,
    suggestionsApplied: string[]
  ) => {
    const allVersions = getStoredVersions();
    const meetingVersions = allVersions.filter(v => v.meetingId === meetingId);
    const nextVersion = meetingVersions.length + 1;

    const newVersion: ATAVersion = {
      id: crypto.randomUUID(),
      meetingId,
      version: nextVersion,
      content,
      createdAt: new Date().toISOString(),
      createdBy,
      changesSummary,
      suggestionsApplied,
    };

    allVersions.push(newVersion);
    setStoredVersions(allVersions);
    setVersions(prev => [...prev, newVersion]);

    await createAuditLog.mutateAsync({
      action: 'NOVA_VERSAO_ATA',
      entity_type: 'ata_version',
      entity_id: newVersion.id,
      new_values: newVersion,
      metadata: {
        meetingId,
        version: nextVersion,
        suggestionsApplied: suggestionsApplied.length,
      },
    });

    return newVersion;
  }, [createAuditLog]);

  const getRevisionsByMeeting = useCallback((meetingId: string) => {
    return getStoredRevisions().filter(r => r.meetingId === meetingId);
  }, []);

  const getPendingRevisions = useCallback((meetingId?: string) => {
    const all = getStoredRevisions().filter(r => r.status === 'pending');
    return meetingId ? all.filter(r => r.meetingId === meetingId) : all;
  }, []);

  const getVersionsByMeeting = useCallback((meetingId: string) => {
    return getStoredVersions()
      .filter(v => v.meetingId === meetingId)
      .sort((a, b) => b.version - a.version);
  }, []);

  const getRevisionStats = useCallback((meetingId: string) => {
    const meetingRevisions = getStoredRevisions().filter(r => r.meetingId === meetingId);
    return {
      total: meetingRevisions.length,
      pending: meetingRevisions.filter(r => r.status === 'pending').length,
      accepted: meetingRevisions.filter(r => r.status === 'accepted').length,
      rejected: meetingRevisions.filter(r => r.status === 'rejected').length,
      modified: meetingRevisions.filter(r => r.status === 'modified').length,
    };
  }, []);

  return {
    revisions,
    versions,
    loading,
    refreshRevisions,
    addRevisionSuggestion,
    addMultipleSuggestions,
    processSuggestion,
    processBatchSuggestions,
    createNewVersion,
    getRevisionsByMeeting,
    getPendingRevisions,
    getVersionsByMeeting,
    getRevisionStats,
  };
};
