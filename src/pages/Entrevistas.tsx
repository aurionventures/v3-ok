import { useMemo, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Plus, Upload, Mail, History, ChevronDown, Loader2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useEntrevistas } from "@/hooks/useEntrevistas";
import type { Entrevista } from "@/types/entrevistas";

type Prioridade = "Baixa" | "Média" | "Alta";

const PAPEIS = ["Conselheiro", "Diretor", "CEO", "CFO", "Secretário", "Outro"];
const PRIORIDADES: Prioridade[] = ["Baixa", "Média", "Alta"];

const Entrevistas = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("entrevistados");
  const [filtrosOpen, setFiltrosOpen] = useState(false);
  const [transcricaoView, setTranscricaoView] = useState<Entrevista | null>(null);

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

  const { empresas, isLoading: loadingEmpresas, firstEmpresaId } = useEmpresas();
  const empresaId = firstEmpresaId;
  const {
    entrevistas,
    isLoading,
    insertEntrevista: doInsert,
    insertLoading,
    updateStatus,
    updateTranscricao,
    updateTranscricaoLoading,
  } = useEntrevistas(empresaId);

  const realizadas = entrevistas.filter((e) => e.status === "realizada").length;
  const agendadas = entrevistas.filter((e) => e.status === "agendada").length;
  const pendentes = entrevistas.filter((e) => e.status === "pendente").length;
  const comTranscricao = entrevistas.filter((e) => e.transcricao).length;

  const historicoFiltrado = useMemo(() => {
    let list = [...entrevistas];
    if (filtroStatus !== "todos") {
      list = list.filter((e) => e.status === filtroStatus);
    }
    if (filtroTipo === "transcricao") {
      list = list.filter((e) => !!e.transcricao);
    } else if (filtroTipo === "criada") {
      list = list.filter((e) => e.status === "pendente");
    } else if (filtroTipo !== "todos") {
      list = list.filter((e) => e.status === filtroTipo);
    }
    if (filtroBusca.trim()) {
      const q = filtroBusca.toLowerCase();
      list = list.filter(
        (e) =>
          e.nome.toLowerCase().includes(q) ||
          (e.papel ?? "").toLowerCase().includes(q)
      );
    }
    if (filtroPeriodo !== "ultimo-mes") {
      const now = new Date();
      let cutoff: Date;
      if (filtroPeriodo === "ultimos-3") {
        cutoff = new Date(now);
        cutoff.setMonth(cutoff.getMonth() - 3);
      } else {
        cutoff = new Date(now);
        cutoff.setFullYear(cutoff.getFullYear() - 1);
      }
      list = list.filter((e) => new Date(e.createdAt) >= cutoff);
    }
    return list;
  }, [entrevistas, filtroStatus, filtroTipo, filtroBusca, filtroPeriodo]);

  const handleCriarEntrevista = async () => {
    if (!novoNome.trim()) {
      toast({ title: "Preencha o nome do entrevistado", variant: "destructive" });
      return;
    }
    if (!empresaId) {
      toast({ title: "Cadastre uma empresa primeiro", variant: "destructive" });
      return;
    }
    const { data, error } = await doInsert({
      empresa_id: empresaId,
      nome_entrevistado: novoNome.trim(),
      papel: novoPapel || PAPEIS[0],
      prioridade: novaPrioridade,
      status: "pendente",
    });
    if (error) {
      toast({ title: "Erro ao criar entrevista", description: error, variant: "destructive" });
      return;
    }
    setNovoNome("");
    setNovoPapel("");
    setNovaPrioridade("Média");
    toast({ title: "Entrevista criada", description: `${novoNome.trim()} adicionado à lista.` });
  };

  const handleAgendar = async () => {
    if (!agendarEntrevistado || agendarEntrevistado === "_") {
      toast({ title: "Selecione o entrevistado", variant: "destructive" });
      return;
    }
    const { error } = await updateStatus({ id: agendarEntrevistado, status: "agendada" });
    if (error) {
      toast({ title: "Erro ao agendar", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Entrevista agendada", description: "Convite enviado por e-mail." });
    setAgendarEntrevistado("");
    setAgendarEmail("");
  };

  const handleSalvarTranscricao = async () => {
    if (!transcricaoEntrevistado || !transcricaoTexto.trim()) {
      toast({ title: "Selecione o entrevistado e preencha a transcrição", variant: "destructive" });
      return;
    }
    const { error } = await updateTranscricao({ id: transcricaoEntrevistado, transcricao: transcricaoTexto.trim() });
    if (error) {
      toast({ title: "Erro ao salvar transcrição", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Transcrição salva", description: "Transcrição registrada com sucesso." });
    setTranscricaoEntrevistado("");
    setTranscricaoTexto("");
  };

  const hasEmpresas = empresas.length > 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Entrevistas" />
        <div className="flex-1 overflow-y-auto p-6">
          {!hasEmpresas ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p className="font-medium">Nenhuma empresa cadastrada</p>
                <p className="text-sm mt-1">
                  Cadastre uma empresa para usar a área de Entrevistas.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
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
                      disabled={!empresaId || insertLoading}
                    >
                      {insertLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Criar Entrevista
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 bg-muted">
                  <TabsTrigger value="entrevistados" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                    Entrevistados ({entrevistas.length})
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
                  {isLoading ? (
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

                      {agendadas > 0 && (
                        <Card>
                          <CardContent className="p-4">
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Agendados</h3>
                            <ul className="space-y-1">
                              {entrevistas
                                .filter((e) => e.status === "agendada")
                                .map((e) => (
                                  <li key={e.id} className="flex items-center gap-2 text-sm">
                                    <span className="text-blue-600 font-medium">{e.nome}</span>
                                    {e.papel && (
                                      <span className="text-muted-foreground">– {e.papel}</span>
                                    )}
                                  </li>
                                ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
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
                              {entrevistas
                                .filter((e) => e.status === "pendente")
                                .map((e) => (
                                  <SelectItem key={e.id} value={e.id}>
                                    {e.nome} – {e.papel}
                                  </SelectItem>
                                ))}
                              {entrevistas.filter((e) => e.status === "pendente").length === 0 && (
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
                              {entrevistas.map((e) => (
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
                          disabled={updateTranscricaoLoading}
                        >
                          {updateTranscricaoLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
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
                        <p className="text-2xl font-bold text-foreground">{entrevistas.length}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-orange-600">{pendentes}</p>
                        <p className="text-xs text-muted-foreground">Pendentes</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{agendadas}</p>
                        <p className="text-xs text-muted-foreground">Agendadas</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">{realizadas}</p>
                        <p className="text-xs text-muted-foreground">Realizadas</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600">{comTranscricao}</p>
                        <p className="text-xs text-muted-foreground">Transcrições</p>
                      </CardContent>
                    </Card>
                  </div>

                  {historicoFiltrado.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border rounded-lg bg-muted/30">
                      <History className="h-12 w-12 mb-3 opacity-50" />
                      <p className="text-sm">Nenhum evento encontrado com os filtros selecionados.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {historicoFiltrado.map((e) => (
                        <Card
                          key={e.id}
                          className={cn(
                            "transition-colors",
                            e.transcricao && "cursor-pointer hover:bg-muted/50",
                            transcricaoView?.id === e.id && "ring-2 ring-legacy-500"
                          )}
                          onClick={() => e.transcricao && setTranscricaoView(e)}
                        >
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{e.nome}</p>
                                <p className="text-sm text-muted-foreground">
                                  {e.papel} • {e.status} • {new Date(e.createdAt).toLocaleDateString("pt-BR")}
                                </p>
                              </div>
                            </div>
                            {e.transcricao ? (
                              <span className="text-sm text-purple-600">Ver transcrição</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">Sem transcrição</span>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}

          {/* Dialog Transcrição */}
          <Dialog open={!!transcricaoView} onOpenChange={() => setTranscricaoView(null)}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {transcricaoView?.nome}
                </DialogTitle>
                <DialogDescription>
                  {transcricaoView?.papel} • {transcricaoView && new Date(transcricaoView.createdAt).toLocaleDateString("pt-BR")}
                </DialogDescription>
              </DialogHeader>
              {transcricaoView?.transcricao && (
                <div className="py-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Transcrição</p>
                  <div className="p-4 bg-muted/50 rounded-lg whitespace-pre-wrap text-sm max-h-[400px] overflow-y-auto">
                    {transcricaoView.transcricao}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Entrevistas;
