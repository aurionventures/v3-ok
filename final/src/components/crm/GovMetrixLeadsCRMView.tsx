import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users, TrendingUp, Target, BarChart3, Search, Filter,
  MoreVertical, Eye, Mail, FileText, Download, RefreshCw,
  Calendar, Building2, Phone, CheckCircle, Clock, Archive
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts";
import GovMetrixDiagnosticPDF from "./GovMetrixDiagnosticPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string | null;
  source: string | null;
  status: string | null;
  created_at: string | null;
  parsedData?: {
    type: string;
    score: number;
    stage: string;
    categoryScores: Record<string, number>;
    answers: Record<number, number[]>;
  };
}

const statusConfig = {
  new: { label: 'Novo', color: 'bg-blue-500', icon: Clock },
  contacted: { label: 'Contatado', color: 'bg-amber-500', icon: Phone },
  converted: { label: 'Convertido', color: 'bg-emerald-500', icon: CheckCircle },
  archived: { label: 'Arquivado', color: 'bg-gray-500', icon: Archive },
};

const stageColors: Record<string, string> = {
  'Embrionário': '#ef4444',
  'Inicial': '#f97316',
  'Em Desenvolvimento': '#f59e0b',
  'Estruturado': '#3b82f6',
  'Avançado': '#10b981',
};

export default function GovMetrixLeadsCRMView() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchQuery, statusFilter, stageFilter]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      // Using type assertion as table may be pending migration
      const { data, error } = await (supabase as any)
        .from('contacts')
        .select('*')
        .eq('source', 'govmetrix_quiz')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const parsedLeads = (data || []).map((lead: any) => {
        let parsedData = undefined;
        try {
          if (lead.message) {
            parsedData = JSON.parse(lead.message);
          }
        } catch (e) {
          console.error('Error parsing lead data:', e);
        }
        return { ...lead, parsedData } as Lead;
      });

      setLeads(parsedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Erro ao carregar leads');
    } finally {
      setIsLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = [...leads];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.company?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (stageFilter !== 'all') {
      filtered = filtered.filter(lead => lead.parsedData?.stage === stageFilter);
    }

    setFilteredLeads(filtered);
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      // Using type assertion as table may be pending migration
      const { error } = await (supabase as any)
        .from('contacts')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
      toast.success('Status atualizado');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  // Metrics calculations
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const convertedLeads = leads.filter(l => l.status === 'converted').length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  const avgScore = totalLeads > 0
    ? Math.round(leads.reduce((sum, l) => sum + (l.parsedData?.score || 0), 0) / totalLeads)
    : 0;

  // Stage distribution for pie chart
  const stageDistribution = leads.reduce((acc, lead) => {
    const stage = lead.parsedData?.stage || 'Indefinido';
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(stageDistribution).map(([name, value]) => ({
    name,
    value,
    color: stageColors[name] || '#6b7280',
  }));

  // Timeline data (last 7 days)
  const timelineData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = format(date, 'dd/MM');
    const count = leads.filter(l => {
      if (!l.created_at) return false;
      const leadDate = new Date(l.created_at);
      return format(leadDate, 'dd/MM') === dateStr;
    }).length;
    return { date: dateStr, leads: count };
  });

  const exportCSV = () => {
    const headers = ['Nome', 'Email', 'Empresa', 'Telefone', 'Score', 'Estágio', 'Status', 'Data'];
    const rows = leads.map(l => [
      l.name,
      l.email,
      l.company || '',
      l.phone || '',
      l.parsedData?.score?.toString() || '',
      l.parsedData?.stage || '',
      statusConfig[l.status as keyof typeof statusConfig]?.label || l.status,
      l.created_at ? format(new Date(l.created_at), 'dd/MM/yyyy HH:mm') : '',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `govmetrix-leads-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    toast.success('CSV exportado com sucesso');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CRM GovMetrix®</h1>
          <p className="text-muted-foreground">Gerencie os leads do diagnóstico de governança</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchLeads} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalLeads}</p>
                <p className="text-xs text-muted-foreground">Total de Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{newLeads}</p>
                <p className="text-xs text-muted-foreground">Novos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{conversionRate}%</p>
                <p className="text-xs text-muted-foreground">Taxa Conversão</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgScore}</p>
                <p className="text-xs text-muted-foreground">Score Médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Stage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-accent" />
              Distribuição por Maturidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              Leads nos Últimos 7 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle className="text-base font-medium">Lista de Leads</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Estágio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Estágios</SelectItem>
                  {Object.keys(stageColors).map(stage => (
                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Estágio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {isLoading ? 'Carregando...' : 'Nenhum lead encontrado'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => {
                    const status = statusConfig[lead.status as keyof typeof statusConfig] || statusConfig.new;
                    const StatusIcon = status.icon;
                    
                    return (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-xs text-muted-foreground">{lead.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{lead.company || '-'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-lg">{lead.parsedData?.score || '-'}</span>
                        </TableCell>
                        <TableCell>
                          {lead.parsedData?.stage ? (
                            <Badge
                              style={{ backgroundColor: stageColors[lead.parsedData.stage] }}
                              className="text-white border-0"
                            >
                              {lead.parsedData.stage}
                            </Badge>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${status.color} text-white border-0`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {lead.created_at
                            ? format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
                            : '-'}
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
                                Marcar como Contatado
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'converted')}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Marcar como Convertido
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'archived')}>
                                <Archive className="h-4 w-4 mr-2" />
                                Arquivar
                              </DropdownMenuItem>
                              {lead.parsedData && (
                                <PDFDownloadLink
                                  document={
                                    <GovMetrixDiagnosticPDF
                                      name={lead.name}
                                      company={lead.company || ''}
                                      email={lead.email}
                                      score={lead.parsedData.score}
                                      stage={lead.parsedData.stage}
                                      categoryScores={lead.parsedData.categoryScores}
                                      date={lead.created_at || new Date().toISOString()}
                                    />
                                  }
                                  fileName={`diagnostico-${lead.company?.toLowerCase().replace(/\s/g, '-') || 'govmetrix'}.pdf`}
                                >
                                  {({ loading }) => (
                                    <DropdownMenuItem disabled={loading}>
                                      <FileText className="h-4 w-4 mr-2" />
                                      {loading ? 'Gerando...' : 'Baixar PDF'}
                                    </DropdownMenuItem>
                                  )}
                                </PDFDownloadLink>
                              )}
                              <DropdownMenuItem asChild>
                                <a href={`mailto:${lead.email}`}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Enviar Email
                                </a>
                              </DropdownMenuItem>
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
    </div>
  );
}
