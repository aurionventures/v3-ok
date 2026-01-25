/**
 * Editor de Minuta de Contrato
 * Permite criar e editar templates de contrato com variáveis dinâmicas
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText, Save, Eye, Plus, Trash2, Code,
  Variable, Copy
} from "lucide-react";
import { toast } from "sonner";
import ContractTemplateDocxUpload from "@/components/contracts/ContractTemplateDocxUpload";
import { DEFAULT_CONTRACT_CONTENT } from "@/components/contracts/defaultContractTemplate";

interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency';
}

interface ContractTemplate {
  id?: string;
  name: string;
  description: string;
  version: string;
  content: string;
  available_variables: TemplateVariable[];
  plan_types: string[];
  requires_witness: boolean;
  witness_count: number;
  is_active: boolean;
  is_default: boolean;
}

interface ContractTemplateEditorProps {
  template?: ContractTemplate | null;
  onSave: (template: ContractTemplate) => Promise<void>;
  onCancel: () => void;
}

// Variáveis padrão disponíveis
const DEFAULT_VARIABLES: TemplateVariable[] = [
  { key: 'contrato_numero', label: 'Número do Contrato', type: 'text' },
  { key: 'cliente_nome', label: 'Nome/Razão Social do Cliente', type: 'text' },
  { key: 'cliente_cnpj', label: 'CNPJ do Cliente', type: 'text' },
  { key: 'cliente_endereco', label: 'Endereço do Cliente', type: 'text' },
  { key: 'cliente_email', label: 'Email do Cliente', type: 'text' },
  { key: 'cliente_telefone', label: 'Telefone do Cliente', type: 'text' },
  { key: 'signatario_nome', label: 'Nome do Signatário', type: 'text' },
  { key: 'signatario_cargo', label: 'Cargo do Signatário', type: 'text' },
  { key: 'signatario_cpf', label: 'CPF do Signatário', type: 'text' },
  { key: 'plano_nome', label: 'Nome do Plano', type: 'text' },
  { key: 'plano_tipo', label: 'Tipo do Plano', type: 'text' },
  { key: 'modulos_inclusos', label: 'Módulos Inclusos', type: 'text' },
  { key: 'addons_inclusos', label: 'Add-ons Contratados', type: 'text' },
  { key: 'duracao_meses', label: 'Duração em Meses', type: 'number' },
  { key: 'duracao_extenso', label: 'Duração por Extenso', type: 'text' },
  { key: 'data_inicio', label: 'Data de Início', type: 'date' },
  { key: 'data_fim', label: 'Data de Término', type: 'date' },
  { key: 'plano_valor', label: 'Valor do Plano (formatado)', type: 'currency' },
  { key: 'plano_valor_extenso', label: 'Valor por Extenso', type: 'text' },
  { key: 'forma_pagamento', label: 'Forma de Pagamento', type: 'text' },
  { key: 'dia_vencimento', label: 'Dia de Vencimento', type: 'number' },
  { key: 'data_contrato', label: 'Data do Contrato', type: 'date' },
  { key: 'cidade_assinatura', label: 'Cidade da Assinatura', type: 'text' },
];

// Valores de exemplo para preview
const PREVIEW_VALUES: Record<string, string> = {
  contrato_numero: 'CONT-2026-0001',
  cliente_nome: 'Empresa ABC Ltda',
  cliente_cnpj: '12.345.678/0001-90',
  cliente_endereco: 'Av. Paulista, 1000, São Paulo/SP, CEP 01310-100',
  cliente_email: 'contato@empresaabc.com.br',
  cliente_telefone: '(11) 99999-9999',
  signatario_nome: 'João Silva',
  signatario_cargo: 'Diretor de Governança',
  signatario_cpf: '123.456.789-00',
  plano_nome: 'Governance Plus',
  plano_tipo: 'governance_plus',
  modulos_inclusos: 'Governança, Reuniões, Riscos, Pessoas',
  addons_inclusos: 'ESG, Inteligência de Mercado',
  duracao_meses: '12',
  duracao_extenso: 'doze',
  data_inicio: '01/02/2026',
  data_fim: '01/02/2027',
  plano_valor: 'R$ 2.500,00/mês',
  plano_valor_extenso: 'dois mil e quinhentos reais mensais',
  forma_pagamento: 'Mensal',
  dia_vencimento: '10',
  data_contrato: '13 de janeiro de 2026',
  cidade_assinatura: 'São Paulo - SP',
};

export default function ContractTemplateEditor({
  template,
  onSave,
  onCancel,
}: ContractTemplateEditorProps) {
  const [formData, setFormData] = useState<ContractTemplate>({
    name: '',
    description: '',
    version: '1.0',
    content: DEFAULT_CONTRACT_CONTENT,
    available_variables: DEFAULT_VARIABLES,
    plan_types: ['core', 'governance_plus', 'people_esg', 'legacy_360'],
    requires_witness: false,
    witness_count: 0,
    is_active: true,
    is_default: false,
  });

  const [activeTab, setActiveTab] = useState('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [showVariableModal, setShowVariableModal] = useState(false);
  const [newVariable, setNewVariable] = useState<TemplateVariable>({
    key: '',
    label: '',
    type: 'text',
  });

  // Carregar template existente
  useEffect(() => {
    if (template) {
      setFormData({
        ...template,
        content: template.content || DEFAULT_CONTRACT_CONTENT,
        available_variables: template.available_variables?.length > 0 
          ? template.available_variables 
          : DEFAULT_VARIABLES,
      });
    }
  }, [template]);

  // Gerar preview quando conteúdo mudar
  useEffect(() => {
    const html = replaceVariables(formData.content, PREVIEW_VALUES);
    setPreviewHtml(html);
  }, [formData.content]);

  // Substituir variáveis por valores
  const replaceVariables = (content: string, values: Record<string, string>): string => {
    let result = content;
    Object.entries(values).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  };

  // Inserir variável no cursor
  const insertVariable = (key: string) => {
    const textarea = document.getElementById('contract-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = formData.content;
      const newText = text.substring(0, start) + `{{${key}}}` + text.substring(end);
      setFormData(prev => ({ ...prev, content: newText }));
      
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + key.length + 4;
      }, 0);
    }
    toast.success(`Variável {{${key}}} inserida`);
  };

  // Copiar variável para clipboard
  const copyVariable = (key: string) => {
    navigator.clipboard.writeText(`{{${key}}}`);
    toast.success(`{{${key}}} copiado!`);
  };

  // Adicionar nova variável personalizada
  const addCustomVariable = () => {
    if (!newVariable.key || !newVariable.label) {
      toast.error('Preencha a chave e o label da variável');
      return;
    }

    if (formData.available_variables.some(v => v.key === newVariable.key)) {
      toast.error('Já existe uma variável com essa chave');
      return;
    }

    setFormData(prev => ({
      ...prev,
      available_variables: [...prev.available_variables, { ...newVariable }],
    }));

    setNewVariable({ key: '', label: '', type: 'text' });
    setShowVariableModal(false);
    toast.success('Variável adicionada');
  };

  // Remover variável personalizada
  const removeVariable = (key: string) => {
    if (DEFAULT_VARIABLES.some(v => v.key === key)) {
      toast.error('Não é possível remover variáveis padrão');
      return;
    }

    setFormData(prev => ({
      ...prev,
      available_variables: prev.available_variables.filter(v => v.key !== key),
    }));
    toast.success('Variável removida');
  };

  // Carregar modelo padrão
  const loadDefaultTemplate = () => {
    setFormData(prev => ({
      ...prev,
      content: DEFAULT_CONTRACT_CONTENT,
    }));
    toast.success('Modelo padrão carregado');
  };

  // Salvar template
  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Informe o nome do template');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('O conteúdo do contrato não pode estar vazio');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success('Template salvo com sucesso!');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Erro ao salvar template');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {template?.id ? 'Editar Minuta' : 'Nova Minuta de Contrato'}
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure o template do contrato com variáveis dinâmicas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar Template'}
          </Button>
        </div>
      </div>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações do Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Template *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Contrato SaaS Padrão"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Versão</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                placeholder="1.0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o propósito deste template..."
              rows={2}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Template Ativo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_default"
                checked={formData.is_default}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
              />
              <Label htmlFor="is_default">Template Padrão</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="requires_witness"
                checked={formData.requires_witness}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requires_witness: checked, witness_count: checked ? 2 : 0 }))}
              />
              <Label htmlFor="requires_witness">Requer Testemunhas</Label>
            </div>
            {formData.requires_witness && (
              <div className="flex items-center gap-2">
                <Label>Quantidade:</Label>
                <Select
                  value={formData.witness_count.toString()}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, witness_count: parseInt(v) }))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Editor e Preview - TABS CORRIGIDOS */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-base">Conteúdo do Contrato</CardTitle>
              <TabsList>
                <TabsTrigger value="editor" className="gap-2">
                  <Code className="h-4 w-4" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="variables" className="gap-2">
                  <Variable className="h-4 w-4" />
                  Variáveis
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="editor" className="m-0 mt-0">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">Inserir variável:</span>
                  {formData.available_variables.slice(0, 6).map((v) => (
                    <Badge
                      key={v.key}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => insertVariable(v.key)}
                    >
                      {`{{${v.key}}}`}
                    </Badge>
                  ))}
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setActiveTab('variables')}
                  >
                    Ver todas...
                  </Badge>
                  <div className="flex-1" />
                  <ContractTemplateDocxUpload
                    onHtmlReady={(html) => {
                      setFormData(prev => ({
                        ...prev,
                        content: html,
                        is_active: true,
                        is_default: true,
                      }));
                      setActiveTab('editor');
                    }}
                  />
                  <Button size="sm" variant="outline" onClick={loadDefaultTemplate}>
                    Carregar Modelo Padrão
                  </Button>
                </div>

                <Textarea
                  id="contract-content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Digite o conteúdo do contrato em HTML..."
                  className="font-mono text-sm min-h-[500px]"
                />

                <p className="text-xs text-muted-foreground">
                  Use HTML para formatação. Variáveis devem seguir o padrão {`{{nome_variavel}}`}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="m-0 mt-0">
              <div className="border rounded-lg p-8 bg-white min-h-[500px] overflow-auto">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Preview com valores de exemplo. As variáveis serão substituídas pelos dados reais ao gerar o contrato.
              </p>
            </TabsContent>

            <TabsContent value="variables" className="m-0 mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Clique em uma variável para copiá-la
                  </p>
                  <Button size="sm" variant="outline" onClick={() => setShowVariableModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Variável
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {formData.available_variables.map((variable) => {
                    const isDefault = DEFAULT_VARIABLES.some(v => v.key === variable.key);
                    return (
                      <div
                        key={variable.key}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 cursor-pointer" onClick={() => copyVariable(variable.key)}>
                          <p className="font-mono text-sm text-primary">{`{{${variable.key}}}`}</p>
                          <p className="text-xs text-muted-foreground">{variable.label}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {variable.type}
                          </Badge>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => copyVariable(variable.key)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          {!isDefault && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-destructive"
                              onClick={() => removeVariable(variable.key)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Modal para adicionar variável */}
      <Dialog open={showVariableModal} onOpenChange={setShowVariableModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Variável Personalizada</DialogTitle>
            <DialogDescription>
              Adicione uma variável personalizada para usar no template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="var_key">Chave da Variável</Label>
              <Input
                id="var_key"
                value={newVariable.key}
                onChange={(e) => setNewVariable(prev => ({ ...prev, key: e.target.value.toLowerCase().replace(/\s/g, '_') }))}
                placeholder="minha_variavel"
              />
              <p className="text-xs text-muted-foreground">
                Será usada como {`{{${newVariable.key || 'minha_variavel'}}}`}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="var_label">Label (Descrição)</Label>
              <Input
                id="var_label"
                value={newVariable.label}
                onChange={(e) => setNewVariable(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Minha Variável Personalizada"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="var_type">Tipo</Label>
              <Select
                value={newVariable.type}
                onValueChange={(v) => setNewVariable(prev => ({ ...prev, type: v as 'text' | 'number' | 'date' | 'currency' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="currency">Moeda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVariableModal(false)}>
              Cancelar
            </Button>
            <Button onClick={addCustomVariable}>
              Adicionar Variável
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
