import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Clock,
  Check,
  X,
  Edit3,
  FileText,
  RefreshCw,
  CheckCheck,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import { ATARevisionCard } from './ATARevisionCard';
import { ATAVersionHistory } from './ATAVersionHistory';
import { useATARevisions } from '@/hooks/useATARevisions';
import { ATARevisionSuggestion, RevisionSuggestionStatus, ATA_SECTIONS } from '@/types/ataRevision';

interface ATARevisionDashboardProps {
  open: boolean;
  onClose: () => void;
  meetingId: string;
  meetingTitle: string;
  ataContent: string;
  adminName: string;
  onATAUpdated?: (newContent: string) => void;
}

export const ATARevisionDashboard: React.FC<ATARevisionDashboardProps> = ({
  open,
  onClose,
  meetingId,
  meetingTitle,
  ataContent,
  adminName,
  onATAUpdated,
}) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterSection, setFilterSection] = useState<string>('all');
  
  // Modify modal state
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [currentModifySuggestion, setCurrentModifySuggestion] = useState<ATARevisionSuggestion | null>(null);
  const [modifyText, setModifyText] = useState('');
  const [modifyResponse, setModifyResponse] = useState('');
  
  // Generate version dialog
  const [generateVersionOpen, setGenerateVersionOpen] = useState(false);
  const [versionSummary, setVersionSummary] = useState('');

  const {
    revisions,
    processSuggestion,
    processBatchSuggestions,
    createNewVersion,
    getRevisionStats,
    refreshRevisions,
  } = useATARevisions(meetingId);

  const stats = useMemo(() => getRevisionStats(meetingId), [meetingId, revisions]);

  const filteredRevisions = useMemo(() => {
    let filtered = revisions;
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(r => r.status === activeTab);
    }
    
    if (filterSection !== 'all') {
      filtered = filtered.filter(r => r.section === filterSection);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [revisions, activeTab, filterSection]);

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const pendingIds = filteredRevisions.filter(r => r.status === 'pending').map(r => r.id);
    if (selectedIds.size === pendingIds.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingIds));
    }
  };

  const handleAccept = async (id: string) => {
    await processSuggestion(id, 'accepted', undefined, undefined, adminName);
    toast.success('Sugestão aceita');
    refreshRevisions();
  };

  const handleReject = async (id: string) => {
    await processSuggestion(id, 'rejected', 'Sugestão não aplicável', undefined, adminName);
    toast.success('Sugestão recusada');
    refreshRevisions();
  };

  const handleModify = (id: string) => {
    const suggestion = revisions.find(r => r.id === id);
    if (suggestion) {
      setCurrentModifySuggestion(suggestion);
      setModifyText(suggestion.suggestedText);
      setModifyResponse('');
      setModifyModalOpen(true);
    }
  };

  const handleSubmitModify = async () => {
    if (!currentModifySuggestion || !modifyText.trim()) return;
    
    await processSuggestion(
      currentModifySuggestion.id,
      'modified',
      modifyResponse || 'Aceita com modificação',
      modifyText,
      adminName
    );
    
    toast.success('Sugestão aceita com modificação');
    setModifyModalOpen(false);
    setCurrentModifySuggestion(null);
    refreshRevisions();
  };

  const handleBatchAccept = async () => {
    if (selectedIds.size === 0) return;
    await processBatchSuggestions(Array.from(selectedIds), 'accepted', adminName);
    toast.success(`${selectedIds.size} sugestão(ões) aceita(s)`);
    setSelectedIds(new Set());
    refreshRevisions();
  };

  const handleBatchReject = async () => {
    if (selectedIds.size === 0) return;
    await processBatchSuggestions(Array.from(selectedIds), 'rejected', adminName);
    toast.success(`${selectedIds.size} sugestão(ões) recusada(s)`);
    setSelectedIds(new Set());
    refreshRevisions();
  };

  const handleGenerateVersion = async () => {
    const acceptedSuggestions = revisions.filter(
      r => r.status === 'accepted' || r.status === 'modified'
    );
    
    if (acceptedSuggestions.length === 0) {
      toast.error('Nenhuma sugestão aceita para aplicar');
      return;
    }

    // Apply changes to ATA content (simplified - in real app would be more sophisticated)
    let newContent = ataContent;
    for (const s of acceptedSuggestions) {
      const textToApply = s.finalText || s.suggestedText;
      if (s.originalText && textToApply) {
        newContent = newContent.replace(s.originalText, textToApply);
      }
    }

    await createNewVersion(
      meetingId,
      newContent,
      adminName,
      versionSummary || `Aplicadas ${acceptedSuggestions.length} sugestões de revisão`,
      acceptedSuggestions.map(s => s.id)
    );

    onATAUpdated?.(newContent);
    toast.success('Nova versão da ATA gerada com sucesso');
    setGenerateVersionOpen(false);
    setVersionSummary('');
  };

  const acceptedCount = revisions.filter(r => r.status === 'accepted' || r.status === 'modified').length;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Gestão de Revisões da ATA
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{meetingTitle}</p>
          </DialogHeader>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-2">
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </Card>
            <Card className="p-3 text-center border-amber-500">
              <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
              <div className="text-xs text-muted-foreground">Pendentes</div>
            </Card>
            <Card className="p-3 text-center border-emerald-500">
              <div className="text-2xl font-bold text-emerald-600">{stats.accepted}</div>
              <div className="text-xs text-muted-foreground">Aceitas</div>
            </Card>
            <Card className="p-3 text-center border-blue-500">
              <div className="text-2xl font-bold text-blue-600">{stats.modified}</div>
              <div className="text-xs text-muted-foreground">Modificadas</div>
            </Card>
            <Card className="p-3 text-center border-destructive">
              <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
              <div className="text-xs text-muted-foreground">Recusadas</div>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="pending" className="gap-1">
                  <Clock className="h-4 w-4" />
                  Pendentes
                  {stats.pending > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                      {stats.pending}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="accepted">Aceitas</TabsTrigger>
                <TabsTrigger value="modified">Modificadas</TabsTrigger>
                <TabsTrigger value="rejected">Recusadas</TabsTrigger>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="versions">
                  <FileText className="h-4 w-4 mr-1" />
                  Versões
                </TabsTrigger>
              </TabsList>

              {activeTab !== 'versions' && (
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={filterSection}
                    onChange={(e) => setFilterSection(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="all">Todas as seções</option>
                    {ATA_SECTIONS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Batch Actions for Pending */}
            {activeTab === 'pending' && stats.pending > 0 && (
              <div className="flex items-center gap-2 py-2 border-b">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  <CheckCheck className="h-4 w-4 mr-1" />
                  {selectedIds.size === filteredRevisions.filter(r => r.status === 'pending').length
                    ? 'Desmarcar Todos'
                    : 'Selecionar Todos'}
                </Button>
                {selectedIds.size > 0 && (
                  <>
                    <Separator orientation="vertical" className="h-6" />
                    <span className="text-sm text-muted-foreground">
                      {selectedIds.size} selecionada(s)
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-emerald-600"
                      onClick={handleBatchAccept}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Aceitar Selecionadas
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive"
                      onClick={handleBatchReject}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Recusar Selecionadas
                    </Button>
                  </>
                )}
              </div>
            )}

            <TabsContent value="versions" className="flex-1 overflow-hidden mt-0">
              <ATAVersionHistory meetingId={meetingId} />
            </TabsContent>

            {['pending', 'accepted', 'modified', 'rejected', 'all'].map(tab => (
              <TabsContent key={tab} value={tab} className="flex-1 overflow-hidden mt-0">
                <ScrollArea className="h-full pr-4">
                  {filteredRevisions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                      <FileText className="h-10 w-10 mb-2" />
                      <p>Nenhuma sugestão {tab === 'pending' ? 'pendente' : ''}</p>
                    </div>
                  ) : (
                    <div className="space-y-3 py-2">
                      {filteredRevisions.map(suggestion => (
                        <ATARevisionCard
                          key={suggestion.id}
                          suggestion={suggestion}
                          selected={selectedIds.has(suggestion.id)}
                          onSelect={handleSelect}
                          onAccept={handleAccept}
                          onReject={handleReject}
                          onModify={handleModify}
                          showActions={suggestion.status === 'pending'}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>

          <DialogFooter className="border-t pt-4">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-muted-foreground">
                {acceptedCount > 0
                  ? `${acceptedCount} sugestão(ões) aceita(s) pronta(s) para aplicar`
                  : 'Nenhuma sugestão aceita ainda'}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Fechar
                </Button>
                <Button
                  onClick={() => setGenerateVersionOpen(true)}
                  disabled={acceptedCount === 0}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Aplicar e Gerar Nova Versão
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modify Modal */}
      <Dialog open={modifyModalOpen} onOpenChange={setModifyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aceitar com Modificação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Texto Original</Label>
              <div className="p-2 bg-muted rounded text-sm">
                {currentModifySuggestion?.originalText}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sugestão do Membro</Label>
              <div className="p-2 bg-muted rounded text-sm">
                {currentModifySuggestion?.suggestedText}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Texto Final (edite conforme necessário)</Label>
              <Textarea
                value={modifyText}
                onChange={(e) => setModifyText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Resposta ao Membro (opcional)</Label>
              <Input
                value={modifyResponse}
                onChange={(e) => setModifyResponse(e.target.value)}
                placeholder="Ex: Ajustado conforme norma interna..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModifyModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitModify} disabled={!modifyText.trim()}>
              Aplicar Modificação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Version Dialog */}
      <AlertDialog open={generateVersionOpen} onOpenChange={setGenerateVersionOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Gerar Nova Versão da ATA</AlertDialogTitle>
            <AlertDialogDescription>
              Serão aplicadas {acceptedCount} sugestão(ões) aceita(s) e será gerada uma nova versão da ATA.
              Esta ação ficará registrada no histórico.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-2">
            <Label>Resumo das Alterações (opcional)</Label>
            <Textarea
              value={versionSummary}
              onChange={(e) => setVersionSummary(e.target.value)}
              placeholder="Descreva brevemente as principais alterações..."
              className="min-h-[80px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleGenerateVersion}>
              Confirmar e Gerar Versão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
