
import React, { useState } from "react";
import { Users, Search, UserPlus, Eye, Pencil, Trash2, Network, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FamilyNetworkGraph from "@/components/FamilyNetworkGraph";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { useCorporateStructure } from "@/hooks/useCorporateStructure";


const ShareholderStructure = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [showDetailsMember, setShowDetailsMember] = useState<any>(null);
  const [memberToDelete, setMemberToDelete] = useState<any>(null);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    category: "",
    role: "",
    involvement: "",
    status: "",
    shareholding: ""
  });
  
  // Hook para gerenciar estrutura societária
  const { 
    members, 
    loading, 
    error, 
    addMember, 
    updateMember, 
    removeMember 
  } = useCorporateStructure();

  // Filtros locais para busca
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.involvement && member.involvement.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewDetails = (member: any) => {
    setShowDetailsMember(member);
  };

  const handleAddMember = () => {
    setIsAddingMember(true);
  };

  const handleEditMember = async (member: any) => {
    setIsEditingMember(true);
    setEditingData({
      id: member.id,
      name: member.name,
      age: member.age || "",
      category: member.category,
      role: member.role,
      involvement: member.involvement || "",
      status: member.status || "Ativo",
      email: member.email || "",
      phone: member.phone || "",
      document: member.document || "",
      shareholding: member.shareholding || ""
    });
  };

  const handleSaveChanges = async () => {
    try {
      if (!editingData) return;

      await updateMember(editingData.id, {
        name: editingData.name,
        age: editingData.age ? parseInt(editingData.age) : null,
        category: editingData.category,
        role: editingData.role,
        involvement: editingData.involvement || null,
        status: editingData.status,
        email: editingData.email || null,
        phone: editingData.phone || null,
        document: editingData.document || null,
        shareholding: editingData.shareholding || null
      });

      // Atualizar o membro exibido
      setShowDetailsMember({
        ...showDetailsMember,
        ...editingData
      });

      setIsEditingMember(false);
      setEditingData(null);

      toast({
        title: "Membro atualizado",
        description: "As alterações foram salvas com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar alterações",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingMember(false);
    setEditingData(null);
  };

  const handleDeleteMember = async (member: any) => {
    try {
      await removeMember(member.id);
      toast({
        title: "Membro removido",
        description: `${member.name} foi removido da estrutura societária`,
      });
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover membro",
        variant: "destructive",
      });
    }
  };

  const confirmDeleteMember = (member: any) => {
    setMemberToDelete(member);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Estrutura Societária" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-semibold text-legacy-500 mb-4 sm:mb-0">
                  Estrutura Societária
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Buscar membros..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddMember}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Membro
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="table" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="table" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Lista de Membros
                  </TabsTrigger>
                  <TabsTrigger value="network" className="flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    Mapa de Conexões
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="table">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-legacy-500" />
                      <span className="ml-2 text-gray-500">Carregando membros...</span>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <p className="text-red-500 mb-2">Erro ao carregar dados</p>
                        <p className="text-sm text-gray-500">{error}</p>
                      </div>
                    </div>
                  ) : filteredMembers.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">Nenhum membro encontrado</p>
                        <p className="text-sm text-gray-400">
                          {searchTerm ? "Tente ajustar os termos de busca" : "Adicione o primeiro membro à estrutura societária"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Idade</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Papel</TableHead>
                          <TableHead>Envolvimento</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMembers.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell>{member.age || '-'}</TableCell>
                            <TableCell>{member.category}</TableCell>
                            <TableCell>{member.role}</TableCell>
                            <TableCell>{member.involvement || '-'}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  member.status === "Ativo"
                                    ? "bg-green-100 text-green-800"
                                    : member.status === "Inativo"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {member.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewDetails(member)}
                                  title="Ver Detalhes"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => confirmDeleteMember(member)}
                                  title="Remover"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                <TabsContent value="network">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <h3 className="text-lg font-semibold">Mapa de Conexões Familiares e Corporativas</h3>
                        <p className="text-sm text-muted-foreground">
                          Visualização interativa das relações entre membros da estrutura societária
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-0.5 bg-primary"></div>
                          <span>Família</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-0.5 bg-secondary border-dashed"></div>
                          <span>Hierarquia</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-0.5 bg-accent border-dotted"></div>
                          <span>Conselho</span>
                        </div>
                      </div>
                    </div>
                    <FamilyNetworkGraph members={members.map(member => ({
                      id: parseInt(member.id.replace(/\D/g, '')) || Math.random(),
                      name: member.name,
                      age: member.age || 0,
                      generation: member.category,
                      role: member.role,
                      shareholding: member.shareholding || "0%" // Usar valor real do banco de dados
                    }))} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog for adding new family member */}
      <Dialog open={isAddingMember} onOpenChange={(open) => {
        setIsAddingMember(open);
        if (!open) {
          // Limpar formulário quando fechar
          setFormData({
            name: "",
            age: "",
            category: "",
            role: "",
            involvement: "",
            status: "",
            shareholding: ""
          });
        }
      }}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Adicionar Membro</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo membro da estrutura societária
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nome Completo
                </label>
                <Input 
                  id="name" 
                  placeholder="Nome completo" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="age" className="text-sm font-medium">
                  Idade
                </label>
                <Input 
                  id="age" 
                  type="number" 
                  placeholder="Idade" 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="generation" className="text-sm font-medium">
                  Categoria
                </label>
                <select 
                  id="generation" 
                  className="w-full p-2 border rounded-md"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Selecione...</option>
                  <option value="Fundadores">Fundadores</option>
                  <option value="Segunda Geração">Segunda Geração</option>
                  <option value="Investidores">Investidores</option>
                  <option value="Conselheiros">Conselheiros</option>
                  <option value="Executivos">Executivos</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Cargo/Função
                </label>
                <Input 
                  id="role" 
                  placeholder="Ex: CEO, Diretor, Investidor, etc." 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="involvement" className="text-sm font-medium">
                  Envolvimento
                </label>
                <Input 
                  id="involvement" 
                  placeholder="Ex: CEO, Conselheiro, etc." 
                  value={formData.involvement}
                  onChange={(e) => setFormData({...formData, involvement: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <select 
                  id="status" 
                  className="w-full p-2 border rounded-md"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="">Selecione...</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Afastado">Afastado</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="shareholding" className="text-sm font-medium">
                Participação Societária
              </label>
              <Input 
                id="shareholding" 
                placeholder="Ex: 25%" 
                value={formData.shareholding}
                onChange={(e) => setFormData({...formData, shareholding: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingMember(false)}>
              Cancelar
            </Button>
            <Button onClick={async () => {
              try {
                // Validar campos obrigatórios
                if (!formData.name || !formData.category || !formData.role) {
                  toast({
                    title: "Campos obrigatórios",
                    description: "Por favor, preencha pelo menos Nome, Categoria e Cargo.",
                    variant: "destructive",
                  });
                  return;
                }
                
                // Preparar dados para envio
                const memberData = {
                  name: formData.name,
                  age: formData.age ? parseInt(formData.age) : undefined,
                  category: formData.category,
                  role: formData.role,
                  involvement: formData.involvement || undefined,
                  status: (formData.status as "Ativo" | "Inativo" | "Afastado") || "Ativo",
                  shareholding: formData.shareholding || undefined
                };
                
                await addMember(memberData);
                
                // Limpar formulário
                setFormData({
                  name: "",
                  age: "",
                  category: "",
                  role: "",
                  involvement: "",
                  status: "",
                  shareholding: ""
                });
                
                toast({
                  title: "Membro adicionado",
                  description: "O novo membro foi adicionado com sucesso!"
                });
                setIsAddingMember(false);
              } catch (error) {
                toast({
                  title: "Erro",
                  description: "Erro ao adicionar membro",
                  variant: "destructive",
                });
              }
            }}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sheet for showing member details */}
      <Sheet open={!!showDetailsMember} onOpenChange={() => setShowDetailsMember(null)}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detalhes do Membro</SheetTitle>
            <SheetDescription>
              Informações detalhadas sobre o membro da estrutura societária
            </SheetDescription>
          </SheetHeader>
          
          {showDetailsMember && (
            <div className="py-6">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{showDetailsMember.name}</h3>
                  <p className="text-gray-500">{showDetailsMember.role} • {showDetailsMember.category}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Idade</h4>
                    {isEditingMember ? (
                      <Input
                        type="number"
                        value={editingData?.age || ""}
                        onChange={(e) => setEditingData({...editingData, age: e.target.value})}
                        placeholder="Idade"
                      />
                    ) : (
                      <p>{showDetailsMember.age || 'Não informado'}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    {isEditingMember ? (
                      <select
                        value={editingData?.status || "Ativo"}
                        onChange={(e) => setEditingData({...editingData, status: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="Ativo">Ativo</option>
                        <option value="Afastado">Afastado</option>
                        <option value="Inativo">Inativo</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          showDetailsMember.status === "Ativo"
                            ? "bg-green-100 text-green-800"
                            : showDetailsMember.status === "Inativo"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {showDetailsMember.status}
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Envolvimento</h4>
                  {isEditingMember ? (
                    <Input
                      value={editingData?.involvement || ""}
                      onChange={(e) => setEditingData({...editingData, involvement: e.target.value})}
                      placeholder="Envolvimento"
                    />
                  ) : (
                    <p>{showDetailsMember.involvement || 'Não informado'}</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                  {isEditingMember ? (
                    <Input
                      type="email"
                      value={editingData?.email || ""}
                      onChange={(e) => setEditingData({...editingData, email: e.target.value})}
                      placeholder="Email"
                    />
                  ) : (
                    <p>{showDetailsMember.email || 'Não informado'}</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Telefone</h4>
                  {isEditingMember ? (
                    <Input
                      value={editingData?.phone || ""}
                      onChange={(e) => setEditingData({...editingData, phone: e.target.value})}
                      placeholder="Telefone"
                    />
                  ) : (
                    <p>{showDetailsMember.phone || 'Não informado'}</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Documento</h4>
                  {isEditingMember ? (
                    <Input
                      value={editingData?.document || ""}
                      onChange={(e) => setEditingData({...editingData, document: e.target.value})}
                      placeholder="Documento"
                    />
                  ) : (
                    <p>{showDetailsMember.document || 'Não informado'}</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Participação Societária</h4>
                  {isEditingMember ? (
                    <Input
                      value={editingData?.shareholding || ""}
                      onChange={(e) => setEditingData({...editingData, shareholding: e.target.value})}
                      placeholder="Ex: 25%"
                    />
                  ) : (
                    <p>{showDetailsMember.shareholding || 'Não informado'}</p>
                  )}
                </div>
              
              {showDetailsMember.is_family_member && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Membro da Família</h4>
                  <p>Sim</p>
                </div>
              )}
              
              {showDetailsMember.is_external && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Pessoa Externa</h4>
                  <p>Sim</p>
                </div>
              )}
              </div>
              
              <div className="mt-8 flex space-x-4">
                {isEditingMember ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={handleCancelEdit}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleSaveChanges}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Salvar Alterações
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => handleEditMember(showDetailsMember)}
                      className="flex-1"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button 
                      onClick={() => setShowDetailsMember(null)}
                      className="flex-1 bg-legacy-purple-500 hover:bg-legacy-purple-600"
                    >
                      Fechar
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Dialog de confirmação para remover membro */}
      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>{memberToDelete?.name}</strong> da estrutura societária?
              <br />
              <span className="text-red-600 font-medium">Esta ação não pode ser desfeita.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (memberToDelete) {
                  handleDeleteMember(memberToDelete);
                  setMemberToDelete(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ShareholderStructure;
