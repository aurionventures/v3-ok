/**
 * Página Admin: Configurador de Minutas de Contrato
 * Lista, cria e edita templates de contrato
 */

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  FileText, Plus, MoreVertical, Edit, Trash2, Copy,
  CheckCircle, XCircle, Star, RefreshCw, Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ContractTemplateEditor from "@/components/contracts/ContractTemplateEditor";

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  content: string;
  available_variables: any[];
  plan_types: string[];
  requires_witness: boolean;
  witness_count: number;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminContractTemplates() {
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<ContractTemplate | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      // NOTE: contract_templates table doesn't exist yet, using mock data
      // When table is created, uncomment the Supabase query below
      /*
      const { data, error } = await supabase
        .from('contract_templates')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
      */
      
      // Load from localStorage or use mock data
      const storedTemplates = localStorage.getItem('contract_templates');
      if (storedTemplates) {
        setTemplates(JSON.parse(storedTemplates));
      } else {
        const mockData = getMockTemplates();
        setTemplates(mockData);
        localStorage.setItem('contract_templates', JSON.stringify(mockData));
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates(getMockTemplates());
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTemplate = async (template: Omit<ContractTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // NOTE: contract_templates table doesn't exist yet, using localStorage
      const now = new Date().toISOString();
      let updatedTemplates: ContractTemplate[];
      
      if (selectedTemplate?.id) {
        // Update existing
        updatedTemplates = templates.map(t => 
          t.id === selectedTemplate.id 
            ? { ...t, ...template, updated_at: now }
            : t
        );
      } else {
        // Create new
        const newTemplate: ContractTemplate = {
          id: crypto.randomUUID(),
          ...template,
          created_at: now,
          updated_at: now,
        };
        updatedTemplates = [newTemplate, ...templates];
      }

      setTemplates(updatedTemplates);
      localStorage.setItem('contract_templates', JSON.stringify(updatedTemplates));
      setShowEditor(false);
      setSelectedTemplate(null);
      toast.success(selectedTemplate ? 'Template atualizado' : 'Template criado');
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  };

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;

    try {
      // NOTE: contract_templates table doesn't exist yet, using localStorage
      const updatedTemplates = templates.filter(t => t.id !== templateToDelete.id);
      setTemplates(updatedTemplates);
      localStorage.setItem('contract_templates', JSON.stringify(updatedTemplates));
      toast.success('Template excluído');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Erro ao excluir template');
    } finally {
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handleDuplicate = async (template: ContractTemplate) => {
    try {
      // NOTE: contract_templates table doesn't exist yet, using localStorage
      const now = new Date().toISOString();
      const newTemplate: ContractTemplate = {
        id: crypto.randomUUID(),
        name: `${template.name} (Cópia)`,
        description: template.description,
        version: '1.0',
        content: template.content,
        available_variables: template.available_variables,
        plan_types: template.plan_types,
        requires_witness: template.requires_witness,
        witness_count: template.witness_count,
        is_active: false,
        is_default: false,
        created_at: now,
        updated_at: now,
      };

      const updatedTemplates = [newTemplate, ...templates];
      setTemplates(updatedTemplates);
      localStorage.setItem('contract_templates', JSON.stringify(updatedTemplates));
      toast.success('Template duplicado');
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast.error('Erro ao duplicar template');
    }
  };

  const handleSetDefault = async (template: ContractTemplate) => {
    try {
      // NOTE: contract_templates table doesn't exist yet, using localStorage
      const updatedTemplates = templates.map(t => ({
        ...t,
        is_default: t.id === template.id
      }));
      setTemplates(updatedTemplates);
      localStorage.setItem('contract_templates', JSON.stringify(updatedTemplates));
      toast.success('Template definido como padrão');
    } catch (error) {
      console.error('Error setting default:', error);
      toast.error('Erro ao definir template padrão');
    }
  };

  const handleToggleActive = async (template: ContractTemplate) => {
    try {
      // NOTE: contract_templates table doesn't exist yet, using localStorage
      const updatedTemplates = templates.map(t => 
        t.id === template.id ? { ...t, is_active: !t.is_active } : t
      );
      setTemplates(updatedTemplates);
      localStorage.setItem('contract_templates', JSON.stringify(updatedTemplates));
      toast.success(template.is_active ? 'Template desativado' : 'Template ativado');
    } catch (error) {
      console.error('Error toggling active:', error);
      toast.error('Erro ao alterar status');
    }
  };

  if (showEditor) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Configurador de Minutas" />
          <main className="flex-1 overflow-auto p-6">
            <ContractTemplateEditor
              template={selectedTemplate}
              onSave={handleSaveTemplate}
              onCancel={() => {
                setShowEditor(false);
                setSelectedTemplate(null);
              }}
            />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Configurador de Minutas" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Minutas de Contrato
                </h1>
                <p className="text-muted-foreground">
                  Configure templates de contrato com variáveis dinâmicas
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={fetchTemplates} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
                <Button onClick={() => { setSelectedTemplate(null); setShowEditor(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Minuta
                </Button>
              </div>
            </div>

            {/* Cards de Métricas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{templates.length}</p>
                      <p className="text-xs text-muted-foreground">Total de Templates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{templates.filter(t => t.is_active).length}</p>
                      <p className="text-xs text-muted-foreground">Ativos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <Star className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{templates.filter(t => t.is_default).length}</p>
                      <p className="text-xs text-muted-foreground">Padrão</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
                      <XCircle className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{templates.filter(t => !t.is_active).length}</p>
                      <p className="text-xs text-muted-foreground">Inativos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabela de Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Templates Disponíveis</CardTitle>
                <CardDescription>
                  Templates são usados para gerar contratos automaticamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template</TableHead>
                      <TableHead>Versão</TableHead>
                      <TableHead>Planos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Atualizado</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : templates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Nenhum template encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      templates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium flex items-center gap-2">
                                  {template.name}
                                  {template.is_default && (
                                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {template.description || 'Sem descrição'}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">v{template.version}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {template.plan_types.slice(0, 2).map((plan) => (
                                <Badge key={plan} variant="secondary" className="text-xs">
                                  {plan}
                                </Badge>
                              ))}
                              {template.plan_types.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{template.plan_types.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {template.is_active ? (
                              <Badge className="bg-emerald-500">Ativo</Badge>
                            ) : (
                              <Badge variant="secondary">Inativo</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(template.updated_at), "dd/MM/yyyy", { locale: ptBR })}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setSelectedTemplate(template); setShowEditor(true); }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {!template.is_default && (
                                  <DropdownMenuItem onClick={() => handleSetDefault(template)}>
                                    <Star className="h-4 w-4 mr-2" />
                                    Definir como Padrão
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleToggleActive(template)}>
                                  {template.is_active ? (
                                    <>
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Desativar
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Ativar
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => { setTemplateToDelete(template); setDeleteDialogOpen(true); }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Template</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o template "{templateToDelete?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTemplate} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Mock data
function getMockTemplates(): ContractTemplate[] {
  return [
    {
      id: '1',
      name: 'Contrato de Prestação de Serviços SaaS - Padrão',
      description: 'Modelo padrão de contrato para assinatura de planos Legacy OS',
      version: '1.0',
      content: '<div>Conteúdo do contrato...</div>',
      available_variables: [],
      plan_types: ['core', 'governance_plus', 'people_esg', 'legacy_360'],
      requires_witness: false,
      witness_count: 0,
      is_active: true,
      is_default: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Contrato Enterprise',
      description: 'Modelo para grandes empresas com cláusulas adicionais',
      version: '1.2',
      content: '<div>Conteúdo do contrato enterprise...</div>',
      available_variables: [],
      plan_types: ['legacy_360'],
      requires_witness: true,
      witness_count: 2,
      is_active: true,
      is_default: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}
