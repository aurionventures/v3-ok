import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Building2,
  Search,
  Eye,
  Settings2,
  Code,
  CheckCircle2,
  Sparkles,
  MoreVertical,
  RefreshCw,
  Download,
  Filter,
  Users,
  Clock,
  ExternalLink,
  Copy,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  useAllClientPromptConfigs, 
  ClientPromptConfigWithOrg 
} from '@/hooks/useClientPromptConfig';
import { ClientPromptViewer } from './ClientPromptViewer';

interface ClientPromptsListProps {
  agentCategory?: string;
  agentName?: string;
  basePrompt?: string;
  onSelectClient?: (config: ClientPromptConfigWithOrg) => void;
}

// Mapeamento de categorias para nomes legíveis
const CATEGORY_LABELS: Record<string, string> = {
  'agent_g_ata_generator': 'Gerador de ATA',
  'agent_h_governance_insights': 'Insights de Governança',
  'agent_i_pdi_generator': 'Gerador de PDI',
  'agent_a_collector': 'Coletor de Sinais',
  'agent_b_analyzer': 'Analisador de Padrões',
  'agent_c_scorer': 'Calculador de Score',
  'agent_d_agenda_generator': 'Gerador de Pauta',
  'agent_d_briefing_generator': 'Gerador de Briefing',
  'agent_f_search_intent': 'Busca Inteligente',
};

export function ClientPromptsList({
  agentCategory,
  agentName = 'Agente',
  basePrompt = '',
  onSelectClient
}: ClientPromptsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<string>('all');
  const [selectedConfig, setSelectedConfig] = useState<ClientPromptConfigWithOrg | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const { configs, loading, stats, reload } = useAllClientPromptConfigs(agentCategory);

  // Filtrar configurações
  const filteredConfigs = useMemo(() => {
    return configs.filter(config => {
      // Busca por nome da organização
      const matchesSearch = searchQuery === '' ||
        config.organization_name?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por status (usa padrão ou customizado)
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'default' && config.uses_default) ||
        (filterStatus === 'custom' && !config.uses_default);

      // Filtro por modo (simplificado ou avançado)
      const matchesMode = filterMode === 'all' ||
        (filterMode === 'simple' && !config.advanced_mode) ||
        (filterMode === 'advanced' && config.advanced_mode);

      return matchesSearch && matchesStatus && matchesMode;
    });
  }, [configs, searchQuery, filterStatus, filterMode]);

  const handleViewConfig = (config: ClientPromptConfigWithOrg) => {
    setSelectedConfig(config);
    setViewerOpen(true);
    onSelectClient?.(config);
  };

  const getCategoryLabel = (category: string) => {
    return CATEGORY_LABELS[category] || category;
  };

  const getToneLabel = (tone: string) => {
    const labels: Record<string, string> = {
      'formal': 'Formal',
      'semi-formal': 'Semi-formal',
      'executivo': 'Executivo',
      'tecnico': 'Técnico'
    };
    return labels[tone] || tone;
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header com estatísticas */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total de Clientes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.usingDefault}</p>
                  <p className="text-xs text-muted-foreground">Usando Padrão</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.customized}</p>
                  <p className="text-xs text-muted-foreground">Customizados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-100">
                  <Code className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.advancedMode}</p>
                  <p className="text-xs text-muted-foreground">Modo Avançado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5" />
                  Configurações por Cliente
                </CardTitle>
                <CardDescription>
                  {agentCategory 
                    ? `Configurações do ${getCategoryLabel(agentCategory)}`
                    : 'Todas as configurações de prompts por cliente'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={reload}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Barra de filtros */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome da organização..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="default">Usando Padrão</SelectItem>
                  <SelectItem value="custom">Customizado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterMode} onValueChange={setFilterMode}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Modo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Modos</SelectItem>
                  <SelectItem value="simple">Simplificado</SelectItem>
                  <SelectItem value="advanced">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabela */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredConfigs.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  Nenhuma configuração de cliente encontrada
                </p>
                <p className="text-sm text-muted-foreground/70">
                  Os clientes que customizarem seus prompts aparecerão aqui
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organização</TableHead>
                      {!agentCategory && <TableHead>Agente</TableHead>}
                      <TableHead>Status</TableHead>
                      <TableHead>Modo</TableHead>
                      <TableHead>Tom</TableHead>
                      <TableHead>Atualizado</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConfigs.map((config) => (
                      <TableRow 
                        key={config.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewConfig(config)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {config.organization_name || 'Organização'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        
                        {!agentCategory && (
                          <TableCell>
                            <Badge variant="outline">
                              {getCategoryLabel(config.agent_category)}
                            </Badge>
                          </TableCell>
                        )}
                        
                        <TableCell>
                          {config.uses_default ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Padrão
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Customizado
                            </Badge>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {config.advanced_mode ? (
                            <Badge variant="outline" className="bg-violet-50 text-violet-700">
                              <Code className="h-3 w-3 mr-1" />
                              Avançado
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Settings2 className="h-3 w-3 mr-1" />
                              Simples
                            </Badge>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant="secondary">
                            {getToneLabel(config.tone)}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {config.updated_at 
                              ? new Date(config.updated_at).toLocaleDateString('pt-BR')
                              : 'N/A'}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleViewConfig(config);
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                if (config.custom_prompt) {
                                  navigator.clipboard.writeText(config.custom_prompt);
                                }
                              }}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copiar Prompt
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Acessar Organização
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de visualização */}
      <ClientPromptViewer
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        clientConfig={selectedConfig}
        basePrompt={basePrompt}
        agentName={agentName}
      />
    </>
  );
}
