import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGovernanceOrgans, OrganType, AccessConfig } from '@/hooks/useGovernanceOrgans';
import { useGovernanceMembers, GovernanceMember, MemberFormData, AllocationData } from '@/hooks/useGovernanceMembers';
import { HierarchyConfigurator } from '@/components/governance/HierarchyConfigurator';
import { MembersTable } from '@/components/governance/MembersTable';
import { CreateMemberModal } from '@/components/governance/CreateMemberModal';
import { AllocateMemberModal } from '@/components/governance/AllocateMemberModal';
import { OrganDocumentsSection } from '@/components/governance/OrganDocumentsSection';
import { Building2, Users, UserCog, Plus, Settings, Trash2, Edit } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const GovernanceConfig = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<OrganType | 'membros'>('conselho');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'administrativo',
    description: '',
    quorum: 1,
    hierarchy_level: 1
  });

  const currentOrganType = activeTab === 'membros' ? 'conselho' : activeTab;
  const { organs, loading, createOrgan, deleteOrgan, updateAccessConfig } = useGovernanceOrgans(currentOrganType);
  const { 
    members, 
    loading: membersLoading,
    createMember, 
    updateMember, 
    deleteMember,
    allocateMemberToOrgan 
  } = useGovernanceMembers();
  
  // Estados para modais de membros
  const [isCreateMemberModalOpen, setIsCreateMemberModalOpen] = useState(false);
  const [isAllocateMemberModalOpen, setIsAllocateMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<GovernanceMember | null>(null);
  const [allocatingMember, setAllocatingMember] = useState<GovernanceMember | null>(null);

  const handleCreate = async () => {
    if (activeTab === 'membros') return;
    
    try {
      await createOrgan({
        ...formData,
        organ_type: activeTab
      });
      
      toast({
        title: "Órgão criado",
        description: `${getOrganTypeLabel(activeTab)} "${formData.name}" foi criado com sucesso.`,
      });

      setIsCreateDialogOpen(false);
      setFormData({
        name: '',
        type: 'administrativo',
        description: '',
        quorum: 1,
        hierarchy_level: 1
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o órgão.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (organId: string, organName: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${organName}"?`)) {
      return;
    }

    try {
      await deleteOrgan(organId);
      toast({
        title: "Órgão excluído",
        description: `"${organName}" foi excluído com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o órgão.",
        variant: "destructive"
      });
    }
  };

  const handleSaveAccessConfig = async (config: AccessConfig) => {
    if (!selectedOrgan) return;
    await updateAccessConfig(selectedOrgan, config);
  };

  // Handlers para membros
  const handleCreateMember = async (data: MemberFormData) => {
    try {
      if (editingMember) {
        await updateMember(editingMember.id, data);
      } else {
        // Para criar, precisamos de um órgão - podemos pedir depois na alocação
        toast({
          title: "Atenção",
          description: "Após criar o membro, aloque-o em um órgão.",
        });
      }
      setEditingMember(null);
    } catch (error) {
      throw error;
    }
  };

  const handleAllocateMember = async (data: AllocationData) => {
    try {
      await allocateMemberToOrgan(data);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteMember = async (member: GovernanceMember) => {
    if (!confirm(`Tem certeza que deseja remover "${member.name}"?`)) {
      return;
    }

    try {
      await deleteMember(member.id);
      toast({
        title: "Membro removido",
        description: `"${member.name}" foi removido com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o membro.",
        variant: "destructive"
      });
    }
  };

  const getOrganTypeLabel = (type: OrganType | 'membros') => {
    switch (type) {
      case 'conselho': return 'Conselho';
      case 'comite': return 'Comitê';
      case 'comissao': return 'Comissão';
      case 'membros': return 'Membros';
    }
  };

  const getOrganTypeIcon = (type: OrganType) => {
    switch (type) {
      case 'conselho': return <Building2 className="h-5 w-5 text-blue-500" />;
      case 'comite': return <Users className="h-5 w-5 text-green-500" />;
      case 'comissao': return <UserCog className="h-5 w-5 text-amber-500" />;
    }
  };

  const getHierarchyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Estratégico';
      case 2: return 'Tático';
      case 3: return 'Operacional';
      default: return `Nível ${level}`;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Configuração de Governança</h1>
              <p className="text-muted-foreground mt-2">
                Gerencie conselhos, comitês e comissões da sua empresa
              </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as OrganType | 'membros')}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="conselho" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Conselhos
                </TabsTrigger>
                <TabsTrigger value="comite" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Comitês
                </TabsTrigger>
                <TabsTrigger value="comissao" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  Comissões
                </TabsTrigger>
                <TabsTrigger value="membros" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Membros
                </TabsTrigger>
              </TabsList>

              {/* Aba Membros */}
              <TabsContent value="membros" className="space-y-4">
                <MembersTable
                  members={members}
                  loading={membersLoading}
                  onCreateMember={() => {
                    setEditingMember(null);
                    setIsCreateMemberModalOpen(true);
                  }}
                  onEditMember={(member) => {
                    setEditingMember(member);
                    setIsCreateMemberModalOpen(true);
                  }}
                  onAllocateMember={(member) => {
                    setAllocatingMember(member);
                    setIsAllocateMemberModalOpen(true);
                  }}
                  onDeleteMember={handleDeleteMember}
                />
              </TabsContent>

              {/* Content for each organ tab */}
              {(['conselho', 'comite', 'comissao'] as OrganType[]).map((type) => (
                <TabsContent key={type} value={type} className="space-y-4">
                  {/* Create Button */}
                  <div className="flex justify-end gap-2">
                    <Dialog open={isCreateDialogOpen && activeTab === type} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Criar {getOrganTypeLabel(type)}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {getOrganTypeIcon(type)}
                            Criar Novo {getOrganTypeLabel(type)}
                          </DialogTitle>
                          <DialogDescription>
                            Preencha os dados básicos do {getOrganTypeLabel(type).toLowerCase()}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Nome *</Label>
                            <Input
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder={`Ex: ${type === 'conselho' ? 'Conselho Administrativo' : type === 'comite' ? 'Comitê de Auditoria' : 'Comissão de Ética'}`}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Tipo</Label>
                            <Select 
                              value={formData.type}
                              onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="administrativo">Administrativo</SelectItem>
                                <SelectItem value="fiscal">Fiscal</SelectItem>
                                <SelectItem value="consultivo">Consultivo</SelectItem>
                                <SelectItem value="auditoria">Auditoria</SelectItem>
                                <SelectItem value="estrategia">Estratégia</SelectItem>
                                <SelectItem value="outros">Outros</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Descrição</Label>
                            <Textarea
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              placeholder="Breve descrição sobre o órgão"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Quórum</Label>
                              <Input
                                type="number"
                                min="1"
                                value={formData.quorum}
                                onChange={(e) => setFormData({ ...formData, quorum: parseInt(e.target.value) })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Nível Hierárquico</Label>
                              <Select 
                                value={formData.hierarchy_level.toString()}
                                onValueChange={(value) => setFormData({ ...formData, hierarchy_level: parseInt(value) })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 - Estratégico</SelectItem>
                                  <SelectItem value="2">2 - Tático</SelectItem>
                                  <SelectItem value="3">3 - Operacional</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button onClick={handleCreate} className="w-full">
                            Criar {getOrganTypeLabel(type)}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* List of Organs */}
                  {loading ? (
                    <Card>
                      <CardContent className="flex items-center justify-center py-8">
                        <p className="text-muted-foreground">Carregando...</p>
                      </CardContent>
                    </Card>
                  ) : organs.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        {getOrganTypeIcon(type)}
                        <p className="text-muted-foreground mt-4">
                          Nenhum {getOrganTypeLabel(type).toLowerCase()} cadastrado
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Clique em "Criar {getOrganTypeLabel(type)}" para adicionar um novo
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {organs.map((organ) => (
                        <Card key={organ.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                  {getOrganTypeIcon(type)}
                                  {organ.name}
                                </CardTitle>
                                <CardDescription>
                                  {organ.description || 'Sem descrição'}
                                </CardDescription>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setSelectedOrgan(selectedOrgan === organ.id ? null : organ.id)}
                                >
                                  <Settings className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleDelete(organ.id, organ.name)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="outline">Tipo: {organ.type}</Badge>
                              <Badge variant="outline">Quórum: {organ.quorum}</Badge>
                              <Badge variant="outline">
                                Nível: {getHierarchyLabel((organ as any).hierarchy_level || 1)}
                              </Badge>
                              <Badge variant="outline">
                                Membros: {organ.members?.length || 0}
                              </Badge>
                            </div>

                            {/* Hierarchy Configurator */}
                            {selectedOrgan === organ.id && (
                              <div className="pt-4 border-t">
                                <HierarchyConfigurator
                                  organId={organ.id}
                                  organName={organ.name}
                                  currentConfig={organ.access_config || {
                                    public_view: false,
                                    member_upload: true,
                                    guest_upload: false,
                                    require_approval: false
                                  }}
                                   onSave={handleSaveAccessConfig}
                                />
                              </div>
                            )}
                            
                            {/* Seção de Documentos */}
                            <OrganDocumentsSection 
                              organId={organ.id}
                              organName={organ.name}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>

            {/* Modais de Membros */}
            <CreateMemberModal
              open={isCreateMemberModalOpen}
              onOpenChange={setIsCreateMemberModalOpen}
              onSubmit={handleCreateMember}
              editingMember={editingMember}
            />

            <AllocateMemberModal
              open={isAllocateMemberModalOpen}
              onOpenChange={setIsAllocateMemberModalOpen}
              onAllocate={handleAllocateMember}
              member={allocatingMember}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default GovernanceConfig;
