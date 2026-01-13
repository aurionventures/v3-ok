/**
 * SLG Leads Dashboard
 * Dashboard para gestão de leads Sales-Led Growth (SLG)
 * Exibe leads encaminhados para atendimento comercial com priorização
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle, Users, TrendingUp, Target, Clock, Search, Filter,
  MoreVertical, Phone, Mail, MessageSquare, FileText, CheckCircle,
  XCircle, ArrowRight, RefreshCw, Flame, Star, Zap, UserCheck,
  Building2, Calendar, DollarSign
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

// Tipos
interface SLGLead {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string | null;
  govmetrix_score: number | null;
  govmetrix_stage: string | null;
  quiz_faturamento: string | null;
  quiz_tem_conselho: string | null;
  recommended_plan: string | null;
  lead_path: 'plg' | 'slg';
  slg_priority: 'low' | 'normal' | 'high' | 'urgent';
  sales_status: string;
  assigned_to: string | null;
  assigned_at: string | null;
  sales_notes: string | null;
  funnel_stage: string;
  created_at: string;
  updated_at: string;
}

// Configurações visuais
const priorityConfig = {
  urgent: { label: 'Urgente', color: 'bg-red-500', icon: AlertTriangle, textColor: 'text-red-500' },
  high: { label: 'Alta', color: 'bg-orange-500', icon: Flame, textColor: 'text-orange-500' },
  normal: { label: 'Normal', color: 'bg-blue-500', icon: Star, textColor: 'text-blue-500' },
  low: { label: 'Baixa', color: 'bg-gray-400', icon: Clock, textColor: 'text-gray-400' },
};

const salesStatusConfig = {
  pending: { label: 'Aguardando', color: 'bg-yellow-500', icon: Clock },
  contacted: { label: 'Contatado', color: 'bg-blue-500', icon: Phone },
  in_negotiation: { label: 'Em Negociação', color: 'bg-purple-500', icon: MessageSquare },
  proposal_sent: { label: 'Proposta Enviada', color: 'bg-indigo-500', icon: FileText },
  won: { label: 'Convertido', color: 'bg-emerald-500', icon: CheckCircle },
  lost: { label: 'Perdido', color: 'bg-red-400', icon: XCircle },
  returned_to_plg: { label: 'Devolvido PLG', color: 'bg-gray-400', icon: ArrowRight },
};

const faturamentoLabels: Record<string, string> = {
  'ate_4_8m': 'Até R$ 4,8M',
  '4_8m_30m': 'R$ 4,8M - R$ 30M',
  '30m_300m': 'R$ 30M - R$ 300M',
  '300m_4_8b': 'R$ 300M - R$ 4,8B',
  'acima_4_8b': 'Acima de R$ 4,8B',
};

export default function SLGLeadsDashboard() {
  const [leads, setLeads] = useState<SLGLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('pending');
  
  // Modal de notas
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<SLGLead | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('plg_leads')
        .select('*')
        .eq('lead_path', 'slg')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads((data as SLGLead[]) || []);
    } catch (error) {
      console.error('Error fetching SLG leads:', error);
      // Mock data para desenvolvimento
      setLeads(getMockSLGLeads());
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('plg_leads')
        .update({ 
          sales_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.map(lead =>
        lead.id === leadId ? { ...lead, sales_status: newStatus } : lead
      ));
      toast.success('Status atualizado');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const saveNotes = async () => {
    if (!selectedLead) return;
    
    try {
      const { error } = await supabase
        .from('plg_leads')
        .update({ 
          sales_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedLead.id);

      if (error) throw error;

      setLeads(prev => prev.map(lead =>
        lead.id === selectedLead.id ? { ...lead, sales_notes: notes } : lead
      ));
      setNotesModalOpen(false);
      toast.success('Notas salvas');
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Erro ao salvar notas');
    }
  };

  // Filtrar leads
  const filteredLeads = leads.filter(lead => {
    // Filtro por tab (status)
    if (activeTab === 'pending' && lead.sales_status !== 'pending') return false;
    if (activeTab === 'in_progress' && !['contacted', 'in_negotiation', 'proposal_sent'].includes(lead.sales_status)) return false;
    if (activeTab === 'closed' && !['won', 'lost', 'returned_to_plg'].includes(lead.sales_status)) return false;
    if (activeTab === 'all') { /* show all */ }
    
    // Filtro de busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!lead.name.toLowerCase().includes(query) &&
          !lead.email.toLowerCase().includes(query) &&
          !lead.company?.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    // Filtro de prioridade
    if (priorityFilter !== 'all' && lead.slg_priority !== priorityFilter) return false;
    
    // Filtro de status
    if (statusFilter !== 'all' && lead.sales_status !== statusFilter) return false;
    
    return true;
  });

  // Métricas
  const metrics = {
    total: leads.length,
    pending: leads.filter(l => l.sales_status === 'pending').length,
    inProgress: leads.filter(l => ['contacted', 'in_negotiation', 'proposal_sent'].includes(l.sales_status)).length,
    won: leads.filter(l => l.sales_status === 'won').length,
    lost: leads.filter(l => l.sales_status === 'lost').length,
    urgent: leads.filter(l => l.slg_priority === 'urgent').length,
    high: leads.filter(l => l.slg_priority === 'high').length,
    avgScore: leads.length > 0 
      ? Math.round(leads.reduce((sum, l) => sum + (l.govmetrix_score || 0), 0) / leads.length)
      : 0,
    conversionRate: leads.length > 0
      ? Math.round((leads.filter(l => l.sales_status === 'won').length / leads.length) * 100)
      : 0,
  };

  const openNotesModal = (lead: SLGLead) => {
    setSelectedLead(lead);
    setNotes(lead.sales_notes || '');
    setNotesModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="h-6 w-6 text-amber-500" />
            Pipeline SLG
          </h1>
          <p className="text-muted-foreground">
            Leads de alta prioridade para atendimento comercial
          </p>
        </div>
        <Button variant="outline" onClick={fetchLeads} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className={metrics.urgent > 0 ? 'border-red-500 border-2' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.urgent}</p>
                <p className="text-xs text-muted-foreground">Urgentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.pending}</p>
                <p className="text-xs text-muted-foreground">Aguardando</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.inProgress}</p>
                <p className="text-xs text-muted-foreground">Em Progresso</p>
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
                <p className="text-2xl font-bold">{metrics.won}</p>
                <p className="text-xs text-muted-foreground">Convertidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
                <p className="text-xs text-muted-foreground">Taxa Conversão</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs e Filtros */}
      <Card>
        <CardHeader className="pb-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <TabsList>
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Aguardando
                  {metrics.pending > 0 && (
                    <Badge variant="secondary" className="ml-1">{metrics.pending}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="in_progress" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Em Progresso
                </TabsTrigger>
                <TabsTrigger value="closed" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Finalizados
                </TabsTrigger>
                <TabsTrigger value="all">Todos</TabsTrigger>
              </TabsList>

              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar lead..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-48"
                  />
                </div>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-36">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Tabs>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">Prior.</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Faturamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum lead encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => {
                    const priority = priorityConfig[lead.slg_priority] || priorityConfig.normal;
                    const status = salesStatusConfig[lead.sales_status as keyof typeof salesStatusConfig] || salesStatusConfig.pending;
                    const PriorityIcon = priority.icon;
                    const StatusIcon = status.icon;

                    return (
                      <TableRow key={lead.id} className={lead.slg_priority === 'urgent' ? 'bg-red-500/5' : ''}>
                        <TableCell>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${priority.color}`}>
                            <PriorityIcon className="h-4 w-4 text-white" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{lead.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Building2 className="h-3 w-3" />
                              {lead.company}
                            </div>
                            <p className="text-xs text-muted-foreground">{lead.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <span className="text-2xl font-bold">{lead.govmetrix_score || '-'}</span>
                            <p className="text-xs text-muted-foreground">{lead.govmetrix_stage}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {faturamentoLabels[lead.quiz_faturamento || ''] || '-'}
                            </span>
                          </div>
                          {lead.recommended_plan && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {lead.recommended_plan}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${status.color} text-white border-0`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{format(new Date(lead.created_at), 'dd/MM/yyyy', { locale: ptBR })}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(lead.created_at), { locale: ptBR, addSuffix: true })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'contacted')}>
                                <Phone className="h-4 w-4 mr-2" />
                                Marcar Contatado
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'in_negotiation')}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Em Negociação
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'proposal_sent')}>
                                <FileText className="h-4 w-4 mr-2" />
                                Proposta Enviada
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'won')} className="text-emerald-600">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Convertido
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'lost')} className="text-red-600">
                                <XCircle className="h-4 w-4 mr-2" />
                                Perdido
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'returned_to_plg')}>
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Devolver para PLG
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openNotesModal(lead)}>
                                <FileText className="h-4 w-4 mr-2" />
                                Adicionar Notas
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a href={`mailto:${lead.email}`}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Enviar Email
                                </a>
                              </DropdownMenuItem>
                              {lead.phone && (
                                <DropdownMenuItem asChild>
                                  <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank">
                                    <Phone className="h-4 w-4 mr-2" />
                                    WhatsApp
                                  </a>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Notas */}
      <Dialog open={notesModalOpen} onOpenChange={setNotesModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notas do Lead</DialogTitle>
            <DialogDescription>
              {selectedLead?.name} - {selectedLead?.company}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Adicione notas sobre o contato com este lead..."
            rows={5}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveNotes}>
              Salvar Notas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Mock data para desenvolvimento
function getMockSLGLeads(): SLGLead[] {
  return [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@empresagrande.com.br',
      company: 'Empresa Grande S.A.',
      phone: '11999999999',
      govmetrix_score: 85,
      govmetrix_stage: 'Avançado',
      quiz_faturamento: '300m_4_8b',
      quiz_tem_conselho: 'sim',
      recommended_plan: 'listada',
      lead_path: 'slg',
      slg_priority: 'urgent',
      sales_status: 'pending',
      assigned_to: null,
      assigned_at: null,
      sales_notes: null,
      funnel_stage: 'isca_completed',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@mediaempresa.com.br',
      company: 'Média Empresa Ltda',
      phone: '11988888888',
      govmetrix_score: 72,
      govmetrix_stage: 'Estruturado',
      quiz_faturamento: '30m_300m',
      quiz_tem_conselho: 'sim',
      recommended_plan: 'grande',
      lead_path: 'slg',
      slg_priority: 'high',
      sales_status: 'contacted',
      assigned_to: null,
      assigned_at: null,
      sales_notes: 'Interessado em módulo ESG',
      funnel_stage: 'discovery_completed',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Pedro Lima',
      email: 'pedro@holding.com.br',
      company: 'Holding Familiar',
      phone: '11977777777',
      govmetrix_score: 68,
      govmetrix_stage: 'Em Desenvolvimento',
      quiz_faturamento: '30m_300m',
      quiz_tem_conselho: 'nao',
      recommended_plan: 'media',
      lead_path: 'slg',
      slg_priority: 'normal',
      sales_status: 'in_negotiation',
      assigned_to: null,
      assigned_at: null,
      sales_notes: 'Reunião agendada para próxima semana',
      funnel_stage: 'checkout_started',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}
