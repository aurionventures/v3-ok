import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Plus, Upload, Mail, History, ChevronDown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Prioridade = "Baixa" | "Média" | "Alta";
type StatusEntrevista = "pendente" | "agendada" | "realizada";

interface Entrevistado {
  id: string;
  nome: string;
  papel: string;
  prioridade: Prioridade;
  status: StatusEntrevista;
}

const PAPEIS = ["Conselheiro", "Diretor", "CEO", "CFO", "Secretário", "Outro"];
const PRIORIDADES: Prioridade[] = ["Baixa", "Média", "Alta"];

const Entrevistas = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("entrevistados");
  const [loading, setLoading] = useState(true);
  const [entrevistados, setEntrevistados] = useState<Entrevistado[]>([]);
  const [filtrosOpen, setFiltrosOpen] = useState(false);

  const [novoNome, setNovoNome] = useState("");
  const [novoPapel, setNovoPapel] = useState("");
  const [novaPrioridade, setNovaPrioridade] = useState<Prioridade>("Média");

  const [agendarEntrevistado, setAgendarEntrevistado] = useState("");
  const [agendarData, setAgendarData] = useState("25/02/2026");
  const [agendarHorario, setAgendarHorario] = useState("12:30");
  const [agendarEmail, setAgendarEmail] = useState("");

  const [transcricaoEntrevistado, setTranscricaoEntrevistado] = useState("");
  const [transcricaoTexto, setTranscricaoTexto] = useState("");

  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroPeriodo, setFiltroPeriodo] = useState("ultimo-mes");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroBusca, setFiltroBusca] = useState("");

  setTimeout(() => setLoading(false), 800);

  const realizadas = entrevistados.filter((e) => e.status === "realizada").length;
  const agendadas = entrevistados.filter((e) => e.status === "agendada").length;
  const pendentes = entrevistados.filter((e) => e.status === "pendente").length;

  const handleCriarEntrevista = () => {
    if (!novoNome.trim()) {
      toast({ title: "Preencha o nome do entrevistado", variant: "destructive" });
      return;
    }
    const novo: Entrevistado = {
      id: String(Date.now()),
      nome: novoNome.trim(),
      papel: novoPapel || PAPEIS[0],
      prioridade: novaPrioridade,
      status: "pendente",
    };
    setEntrevistados((prev) => [...prev, novo]);
    setNovoNome("");
    setNovoPapel("");
    setNovaPrioridade("Média");
    toast({ title: "Entrevista criada", description: `${novo.nome} adicionado à lista.` });
  };

  const handleAgendar = () => {
    if (!agendarEntrevistado) {
      toast({ title: "Selecione o entrevistado", variant: "destructive" });
      return;
    }
    setEntrevistados((prev) =>
      prev.map((e) =>
        e.id === agendarEntrevistado ? { ...e, status: "agendada" as StatusEntrevista } : e
      )
    );
    toast({ title: "Entrevista agendada", description: "Convite enviado por e-mail." });
    setAgendarEntrevistado("");
    setAgendarEmail("");
  };

  const handleSalvarTranscricao = () => {
    if (!transcricaoEntrevistado || !transcricaoTexto.trim()) {
      toast({ title: "Selecione o entrevistado e preencha a transcrição", variant: "destructive" });
      return;
    }
    toast({ title: "Transcrição salva", description: "Transcrição registrada com sucesso." });
    setTranscricaoEntrevistado("");
    setTranscricaoTexto("");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Entrevistas" />
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nova Entrevista
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Entrevistado</Label>
                  <Input
                    id="nome"
                    placeholder="Digite o nome"
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Papel/Cargo/Função</Label>
                  <Select value={novoPapel || undefined} onValueChange={setNovoPapel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAPEIS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select value={novaPrioridade} onValueChange={(v) => setNovaPrioridade(v as Prioridade)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORIDADES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="bg-legacy-500 hover:bg-legacy-600 text-white"
                  onClick={handleCriarEntrevista}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Entrevista
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 bg-muted">
              <TabsTrigger value="entrevistados" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                Entrevistados ({entrevistados.length})
              </TabsTrigger>
              <TabsTrigger value="agendar" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                Agendar
              </TabsTrigger>
              <TabsTrigger value="transcricoes" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                Transcrições
              </TabsTrigger>
              <TabsTrigger value="historico" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                <History className="h-4 w-4 mr-2" />
                Histórico
              </TabsTrigger>
            </TabsList>

            <TabsContent value="entrevistados" className="mt-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mb-3" />
                  <p>Carregando entrevistas...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">{realizadas}</p>
                        <p className="text-sm text-muted-foreground">Realizadas</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{agendadas}</p>
                        <p className="text-sm text-muted-foreground">Agendadas</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-orange-600">{pendentes}</p>
                        <p className="text-sm text-muted-foreground">Pendentes</p>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="agendar" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Agendar Entrevista</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Entrevistado</Label>
                      <Select value={agendarEntrevistado} onValueChange={setAgendarEntrevistado}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o entrevistado" />
                        </SelectTrigger>
                        <SelectContent>
                          {entrevistados
                            .filter((e) => e.status === "pendente")
                            .map((e) => (
                              <SelectItem key={e.id} value={e.id}>
                                {e.nome} – {e.papel}
                              </SelectItem>
                            ))}
                          {entrevistados.filter((e) => e.status === "pendente").length === 0 && (
                            <SelectItem value="_" disabled>
                              Nenhum entrevistado pendente
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agendar-data">Data</Label>
                      <Input
                        id="agendar-data"
                        value={agendarData}
                        onChange={(e) => setAgendarData(e.target.value)}
                        placeholder="DD/MM/AAAA"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agendar-horario">Horário</Label>
                      <Input
                        id="agendar-horario"
                        value={agendarHorario}
                        onChange={(e) => setAgendarHorario(e.target.value)}
                        placeholder="12:30"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="agendar-email">Email do Entrevistado</Label>
                      <Input
                        id="agendar-email"
                        type="email"
                        placeholder="email@exemplo.com"
                        value={agendarEmail}
                        onChange={(e) => setAgendarEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    className="mt-4 w-full md:w-auto bg-legacy-500 hover:bg-legacy-600 text-white"
                    onClick={handleAgendar}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Agendar e Enviar Convite
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transcricoes" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload de Transcrição
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Selecionar Entrevistado</Label>
                      <Select value={transcricaoEntrevistado} onValueChange={setTranscricaoEntrevistado}>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha o entrevistado" />
                        </SelectTrigger>
                        <SelectContent>
                          {entrevistados.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              {e.nome} – {e.papel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transcricao">Transcrição da Entrevista</Label>
                      <Textarea
                        id="transcricao"
                        placeholder="Cole ou digite a transcrição da entrevista aqui..."
                        value={transcricaoTexto}
                        onChange={(e) => setTranscricaoTexto(e.target.value)}
                        className="min-h-[200px] resize-y"
                      />
                    </div>
                    <Button
                      variant="secondary"
                      onClick={handleSalvarTranscricao}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Salvar Transcrição
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historico" className="mt-0">
              <Collapsible open={filtrosOpen} onOpenChange={setFiltrosOpen}>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-2 text-sm font-medium text-foreground mb-4">
                    Filtros
                    <ChevronDown className={cn("h-4 w-4 transition-transform", filtrosOpen && "rotate-180")} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Filtre o histórico por tipo, período, status ou busque por nome
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label>Tipo de Evento</Label>
                      <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os Eventos</SelectItem>
                          <SelectItem value="criada">Criada</SelectItem>
                          <SelectItem value="agendada">Agendada</SelectItem>
                          <SelectItem value="realizada">Realizada</SelectItem>
                          <SelectItem value="transcricao">Transcrição</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Período</Label>
                      <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ultimo-mes">Último Mês</SelectItem>
                          <SelectItem value="ultimos-3">Últimos 3 meses</SelectItem>
                          <SelectItem value="ultimo-ano">Último ano</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status Atual</Label>
                      <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os Status</SelectItem>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="agendada">Agendada</SelectItem>
                          <SelectItem value="realizada">Realizada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="busca">Buscar</Label>
                      <Input
                        id="busca"
                        placeholder="Nome ou cargo..."
                        value={filtroBusca}
                        onChange={(e) => setFiltroBusca(e.target.value)}
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Total de Eventos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-600">0</p>
                    <p className="text-xs text-muted-foreground">Criadas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">0</p>
                    <p className="text-xs text-muted-foreground">Agendadas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">0</p>
                    <p className="text-xs text-muted-foreground">Realizadas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">0</p>
                    <p className="text-xs text-muted-foreground">Transcrições</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border rounded-lg bg-muted/30">
                <History className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm">Nenhum evento encontrado com os filtros selecionados.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Entrevistas;
