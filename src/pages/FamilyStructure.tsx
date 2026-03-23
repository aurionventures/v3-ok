import React, { useState, useMemo } from "react";
import { Search, UserPlus, Eye, Pencil, Trash2, Building2, Network } from "lucide-react";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FamilyTreeFlow } from "@/components/FamilyTreeFlow";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useEmpresas } from "@/hooks/useEmpresas";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import type { FamilyMember } from "@/types/familyStructure";

const INITIAL_FORM = {
  name: "",
  age: "",
  generation: "",
  role: "",
  involvement: "",
  status: "Ativo",
  shareholding: "",
};

const FamilyStructure = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [showDetailsMember, setShowDetailsMember] = useState<FamilyMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<FamilyMember | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<FamilyMember | null>(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string | null>(null);

  const { empresas, isLoading: loadingEmpresas, firstEmpresaId } = useEmpresas();
  const empresaId = selectedEmpresaId ?? firstEmpresaId;
  const {
    members,
    isLoading,
    insertMember,
    insertLoading,
    updateMember,
    updateLoading,
    deleteMember,
    deleteLoading,
  } = useFamilyMembers(empresaId);

  const filteredMembers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        (m.role ?? "").toLowerCase().includes(term) ||
        (m.involvement ?? "").toLowerCase().includes(term)
    );
  }, [members, searchTerm]);

  const handleViewDetails = (member: FamilyMember) => {
    setShowDetailsMember(member);
  };

  const handleAddMember = () => {
    setForm(INITIAL_FORM);
    setIsAddingMember(true);
  };

  const handleFormChange = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleSubmitAddMember = async () => {
    if (!empresaId) {
      toast({
        title: "Empresa não selecionada",
        description: "Selecione ou cadastre uma empresa para adicionar familiares.",
        variant: "destructive",
      });
      return;
    }
    if (!form.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Informe o nome completo do familiar.",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await insertMember({
      empresa_id: empresaId,
      nome: form.name.trim(),
      idade: form.age ? parseInt(form.age, 10) : null,
      geracao: form.generation || null,
      papel: form.role || null,
      envolvimento: form.involvement || null,
      status: form.status || "Ativo",
      participacao_societaria: form.shareholding || null,
    });

    if (error) {
      toast({
        title: "Erro ao adicionar",
        description: error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Membro adicionado",
      description: `${data?.name ?? form.name} foi adicionado com sucesso!`,
    });
    setIsAddingMember(false);
  };

  const handleEditMember = (member: FamilyMember) => {
    setShowDetailsMember(null);
    setMemberToEdit(member);
    setForm({
      name: member.name,
      age: member.age != null ? String(member.age) : "",
      generation: member.generation ?? "",
      role: member.role ?? "",
      involvement: member.involvement ?? "",
      status: member.status ?? "Ativo",
      shareholding: member.shareholding ?? "",
    });
  };

  const handleSubmitEditMember = async () => {
    if (!memberToEdit) return;
    if (!form.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Informe o nome completo do familiar.",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await updateMember({
      id: memberToEdit.id,
      payload: {
        nome: form.name.trim(),
        idade: form.age ? parseInt(form.age, 10) : null,
        geracao: form.generation || null,
        papel: form.role || null,
        envolvimento: form.involvement || null,
        status: form.status || "Ativo",
        participacao_societaria: form.shareholding || null,
      },
    });

    if (error) {
      toast({
        title: "Erro ao editar",
        description: error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Membro atualizado",
      description: `${data?.name ?? form.name} foi atualizado com sucesso!`,
    });
    setMemberToEdit(null);
  };

  const handleDeleteClick = (member: FamilyMember) => {
    setMemberToDelete(member);
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;
    const name = memberToDelete.name;
    const { error } = await deleteMember(memberToDelete.id);
    setMemberToDelete(null);
    if (error) {
      toast({
        title: "Erro ao excluir",
        description: error,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Membro removido",
      description: `${name} foi removido da estrutura familiar.`,
    });
  };

  const hasEmpresas = empresas.length > 0;

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
                      placeholder="Buscar familiares..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleAddMember}
                    disabled={!empresaId || loadingEmpresas}
                    title={!empresaId ? "Selecione uma empresa primeiro" : undefined}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Familiar
                  </Button>
                </div>
              </div>

              {!hasEmpresas ? (
                <div className="py-12 text-center text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">Nenhuma empresa cadastrada</p>
                  <p className="text-sm mt-1">
                    Cadastre uma empresa na tabela <code>empresas</code> do Supabase para usar a
                    Estrutura Societária.
                  </p>
                </div>
              ) : (
                <Tabs defaultValue="lista" className="mt-4">
                  <TabsList className="mb-4">
                    <TabsTrigger value="lista">Lista de Membros</TabsTrigger>
                    <TabsTrigger value="arvore">
                      <Network className="h-4 w-4 mr-2" />
                      Árvore Genealógica
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="lista">
                    {isLoading ? (
                      <div className="py-12 text-center text-muted-foreground">
                        Carregando familiares...
                      </div>
                    ) : filteredMembers.length === 0 ? (
                      <div className="py-12 text-center text-muted-foreground">
                        <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">
                          {searchTerm ? "Nenhum resultado para a busca" : "Nenhum familiar cadastrado"}
                        </p>
                        <p className="text-sm mt-1">
                          {searchTerm
                            ? "Tente outro termo de busca"
                            : "Clique em Adicionar Familiar para começar"}
                        </p>
                      </div>
                    ) : (
                      <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Idade</TableHead>
                      <TableHead>Geração</TableHead>
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
                        <TableCell>{member.age ?? "—"}</TableCell>
                        <TableCell>{member.generation ?? "—"}</TableCell>
                        <TableCell>{member.role ?? "—"}</TableCell>
                        <TableCell>{member.involvement ?? "—"}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              member.status === "Ativo"
                                ? "bg-green-100 text-green-800"
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
                              onClick={() => handleEditMember(member)}
                              title="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(member)}
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
                  <TabsContent value="arvore">
                    {isLoading ? (
                      <div className="py-12 text-center text-muted-foreground">
                        Carregando árvore...
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Visualização interativa das relações entre membros por geração
                        </p>
                        <FamilyTreeFlow members={filteredMembers} />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog for editing family member */}
      <Dialog open={!!memberToEdit} onOpenChange={(open) => !open && setMemberToEdit(null)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Editar Familiar</DialogTitle>
            <DialogDescription>
              Atualize os dados do membro da família
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome Completo</Label>
                <Input
                  id="edit-name"
                  placeholder="Nome completo"
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-age">Idade</Label>
                <Input
                  id="edit-age"
                  type="number"
                  placeholder="Idade"
                  value={form.age}
                  onChange={(e) => handleFormChange("age", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-generation">Geração</Label>
                <Select
                  value={form.generation}
                  onValueChange={(v) => handleFormChange("generation", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1ª">1ª Geração</SelectItem>
                    <SelectItem value="2ª">2ª Geração</SelectItem>
                    <SelectItem value="3ª">3ª Geração</SelectItem>
                    <SelectItem value="4ª">4ª Geração</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Papel</Label>
                <Input
                  id="edit-role"
                  placeholder="Ex: Fundador, Herdeiro, etc."
                  value={form.role}
                  onChange={(e) => handleFormChange("role", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-involvement">Envolvimento</Label>
                <Input
                  id="edit-involvement"
                  placeholder="Ex: CEO, Conselheiro, etc."
                  value={form.involvement}
                  onChange={(e) => handleFormChange("involvement", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={form.status} onValueChange={(v) => handleFormChange("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Afastado">Afastado</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-shareholding">Participação Societária</Label>
              <Input
                id="edit-shareholding"
                placeholder="Ex: 25%"
                value={form.shareholding}
                onChange={(e) => handleFormChange("shareholding", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMemberToEdit(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitEditMember} disabled={updateLoading}>
              {updateLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for adding new family member */}
      <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Adicionar Familiar</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo membro da família
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Nome completo"
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Idade"
                  value={form.age}
                  onChange={(e) => handleFormChange("age", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="generation">Geração</Label>
                <Select
                  value={form.generation}
                  onValueChange={(v) => handleFormChange("generation", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1ª">1ª Geração</SelectItem>
                    <SelectItem value="2ª">2ª Geração</SelectItem>
                    <SelectItem value="3ª">3ª Geração</SelectItem>
                    <SelectItem value="4ª">4ª Geração</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Papel</Label>
                <Input
                  id="role"
                  placeholder="Ex: Fundador, Herdeiro, etc."
                  value={form.role}
                  onChange={(e) => handleFormChange("role", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="involvement">Envolvimento</Label>
                <Input
                  id="involvement"
                  placeholder="Ex: CEO, Conselheiro, etc."
                  value={form.involvement}
                  onChange={(e) => handleFormChange("involvement", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(v) => handleFormChange("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Afastado">Afastado</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingMember(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitAddMember} disabled={insertLoading}>
              {insertLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sheet for showing member details */}
      <Sheet open={!!showDetailsMember} onOpenChange={() => setShowDetailsMember(null)}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detalhes do Familiar</SheetTitle>
            <SheetDescription>
              Informações detalhadas sobre o membro da família
            </SheetDescription>
          </SheetHeader>

          {showDetailsMember && (
            <div className="py-6">
              <div className="flex items-center mb-6">
                {showDetailsMember.imageSrc ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
                    <img
                      src={showDetailsMember.imageSrc}
                      alt={showDetailsMember.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <UserPlus className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{showDetailsMember.name}</h3>
                  <p className="text-gray-500">
                    {[
                      showDetailsMember.role,
                      showDetailsMember.generation
                        ? `${showDetailsMember.generation} Geração`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Idade</h4>
                    <p>{showDetailsMember.age != null ? `${showDetailsMember.age} anos` : "—"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        showDetailsMember.status === "Ativo"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {showDetailsMember.status}
                    </span>
                  </div>
                </div>

                {showDetailsMember.shareholding && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Participação Societária
                    </h4>
                    <p>{showDetailsMember.shareholding}</p>
                  </div>
                )}

                {showDetailsMember.education && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Formação</h4>
                    <p>{showDetailsMember.education}</p>
                  </div>
                )}

                {showDetailsMember.experience && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Experiência</h4>
                    <p>{showDetailsMember.experience}</p>
                  </div>
                )}

                {(showDetailsMember.contact.email || showDetailsMember.contact.phone) && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Contato</h4>
                    {showDetailsMember.contact.email && (
                      <p>Email: {showDetailsMember.contact.email}</p>
                    )}
                    {showDetailsMember.contact.phone && (
                      <p>Telefone: {showDetailsMember.contact.phone}</p>
                    )}
                  </div>
                )}

                {showDetailsMember.companies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Empresas</h4>
                    <div className="space-y-3">
                      {showDetailsMember.companies.map((company, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-md">
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-gray-500">Cargo: {company.role}</div>
                          {company.shareholding && company.shareholding !== "N/A" && (
                            <div className="text-sm text-gray-500">
                              Participação: {company.shareholding}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex space-x-4">
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
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete confirmation */}
      <AlertDialog open={!!memberToDelete} onOpenChange={(open) => !open && setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir familiar</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>{memberToDelete?.name}</strong> da estrutura
              familiar? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancelar</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Excluindo..." : "Excluir"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FamilyStructure;
