import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Library, List, Grid, Search, FileText, Calendar, Building2, Download, Eye } from "lucide-react";
import { useAnnualSchedule } from "@/hooks/useAnnualSchedule";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ViewMode = 'list' | 'mosaic';

export const ATALibrary = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    organType: 'all',
    period: 'all',
    status: 'all'
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const { toast } = useToast();
  const { schedule } = useAnnualSchedule();

  // Filter only meetings with generated ATAs
  const atasAvailable = schedule?.meetings.filter(m => 
    m.status === 'ATA Gerada' && m.minutes
  ) || [];

  // Apply filters
  const filteredATAs = atasAvailable.filter(ata => {
    if (filters.organType !== 'all') {
      if (filters.organType === 'conselho' && !ata.council.includes('Conselho')) return false;
      if (filters.organType === 'comite' && !ata.council.includes('Comitê')) return false;
      if (filters.organType === 'comissao' && !ata.council.includes('Comissão')) return false;
    }
    
    if (filters.period !== 'all') {
      const ataDate = new Date(ata.date);
      const currentDate = new Date();
      const monthDiff = (currentDate.getFullYear() - ataDate.getFullYear()) * 12 + 
                        (currentDate.getMonth() - ataDate.getMonth());
      
      if (filters.period === 'last-month' && monthDiff !== 1) return false;
      if (filters.period === 'last-3-months' && monthDiff > 3) return false;
      if (filters.period === 'last-6-months' && monthDiff > 6) return false;
    }
    
    return true;
  });

  const handleIntelligentSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Campo vazio",
        description: "Digite algo para buscar",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('secretariat-search', {
        body: { 
          question: searchTerm,
          meetings: atasAvailable,
          documents: [],
          searchScope: 'atas_only' // Only search in ATAs
        }
      });

      if (error) throw error;

      setSearchResults(data.results || []);
      
      toast({
        title: "Busca concluída",
        description: `Encontrados ${data.results?.length || 0} resultados`
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível realizar a busca",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getOrganColor = (council: string) => {
    if (council.includes('Conselho')) return 'bg-blue-100 text-blue-700 border-blue-300';
    if (council.includes('Comitê')) return 'bg-green-100 text-green-700 border-green-300';
    if (council.includes('Comissão')) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getOrganIcon = (council: string) => {
    if (council.includes('Conselho')) return '🏛️';
    if (council.includes('Comitê')) return '📊';
    if (council.includes('Comissão')) return '⚖️';
    return '📋';
  };

  const displayedATAs = searchResults.length > 0 
    ? searchResults.filter(r => r.type === 'ata').map(r => {
        return atasAvailable.find(ata => 
          ata.council === r.organ && ata.date === r.date
        );
      }).filter(Boolean)
    : filteredATAs;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Library className="h-5 w-5 text-primary" />
              Bibliotecas de ATAs
              <Badge variant="secondary">{displayedATAs.length}</Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              Pesquise e visualize todas as Atas de Reunião geradas
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'mosaic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mosaic')}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Busque por tema, assunto, pauta, decisão..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleIntelligentSearch()}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={handleIntelligentSearch}
            disabled={isSearching}
          >
            {isSearching ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select value={filters.organType} onValueChange={(value) => setFilters({...filters, organType: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Órgão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Órgãos</SelectItem>
              <SelectItem value="conselho">Conselhos</SelectItem>
              <SelectItem value="comite">Comitês</SelectItem>
              <SelectItem value="comissao">Comissões</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.period} onValueChange={(value) => setFilters({...filters, period: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Períodos</SelectItem>
              <SelectItem value="last-month">Último Mês</SelectItem>
              <SelectItem value="last-3-months">Últimos 3 Meses</SelectItem>
              <SelectItem value="last-6-months">Últimos 6 Meses</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={() => {
              setFilters({ organType: 'all', period: 'all', status: 'all' });
              setSearchTerm('');
              setSearchResults([]);
            }}
          >
            Limpar Filtros
          </Button>
        </div>

        {/* Results */}
        {displayedATAs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Nenhuma ATA encontrada</p>
            <p className="text-sm mt-1">
              {searchTerm ? 'Tente outros termos de busca' : 'ATAs aparecerão aqui quando reuniões forem finalizadas'}
            </p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-3">
            {displayedATAs.map((ata) => (
              <Card key={ata.id} className="border-l-4 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getOrganIcon(ata.council)}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{`Reunião ${ata.type}`}</h4>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              <span>{ata.council}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{format(new Date(ata.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {ata.minutes?.summary || 'Resumo não disponível'}
                      </p>
                      <div className="flex gap-2">
                        <Badge className={getOrganColor(ata.council)}>
                          {ata.organ_type === 'conselho' ? 'Conselho' : ata.organ_type === 'comite' ? 'Comitê' : 'Comissão'}
                        </Badge>
                        <Badge variant="outline">{ata.type}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="default">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver ATA
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedATAs.map((ata) => (
              <Card key={ata.id} className="hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-4xl">{getOrganIcon(ata.council)}</span>
                      <Badge className={getOrganColor(ata.council)} variant="outline">
                        {ata.organ_type === 'conselho' ? 'Conselho' : ata.organ_type === 'comite' ? 'Comitê' : 'Comissão'}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold text-base group-hover:text-primary transition-colors">
                        {`Reunião ${ata.type}`}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{ata.council}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(ata.date), "dd/MM/yyyy", { locale: ptBR })}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 min-h-[60px]">
                      {ata.minutes?.summary || 'Resumo não disponível'}
                    </p>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1" variant="default">
                        <Eye className="h-3 w-3 mr-1" />
                        Abrir
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
