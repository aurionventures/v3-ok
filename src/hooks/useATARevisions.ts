import { useState, useCallback } from 'react';
import { ATARevisionSuggestion, ATAVersion, RevisionSuggestionStatus } from '@/types/ataRevision';
import { useCreateAuditLog } from '@/hooks/useAuditLogs';

const REVISIONS_STORAGE_KEY = 'ata_revisions';
const VERSIONS_STORAGE_KEY = 'ata_versions';

const getStoredRevisions = (): ATARevisionSuggestion[] => {
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
