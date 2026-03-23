import React, { useEffect, useState } from "react";
import {
  Check,
  X,
  Sparkles,
  List,
  ListTodo,
  MessageSquare,
  Upload,
  Mic,
  FileText,
  CheckCircle2,
  Users,
  Bot,
  Info,
  Calendar,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  deriveChecklist,
  allChecksDone,
  type ReuniaoGestao,
} from "@/types/gestaoReuniao";
import type { ReuniaoEnriquecida } from "@/types/agenda";
import { cn } from "@/lib/utils";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { fetchMembrosPorOrgao } from "@/services/governance";

const CHECK_ITEMS: { key: keyof ReturnType<typeof deriveChecklist>; label: string }[] = [
  { key: "statusConcluido", label: "Status da reunião deve ser 'Realizada'" },
  { key: "temPauta", label: "Pauta da reunião" },
  { key: "temDocumentosPrevios", label: "Documentos prévios" },
  { key: "temGravacao", label: "Gravação da reunião" },
  { key: "participantesConfirmados", label: "Participantes confirmados" },
];

const STATUS_LABEL: Record<string, string> = {
  agendada: "Agendada",
  pauta_definida: "Pauta Definida",
  docs_enviados: "Docs Enviados",
  realizada: "Realizada",
  ata_gerada: "ATA Gerada",
};

const MODALIDADE_LABEL: Record<string, string> = {
  presencial: "Presencial",
  hibrido: "Híbrida",
  hibrida: "Híbrida",
  remoto: "Online",
};

interface AgendaItem {
  id: string;
  titulo: string;
  descricao: string;
  apresentador: string;
  duracao: number;
  tipo: string;
}

interface Tarefa {
  id: string;
  nome: string;
  responsavel: string;
  dataConclusao: string;
}

interface Participante {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  confirmado: boolean;
}

interface GestaoReuniaoProps {
  reuniao: ReuniaoGestao | ReuniaoEnriquecida | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGerarAtaIA?: () => void;
  empresaId?: string | null;
}

const GestaoReuniao: React.FC<GestaoReuniaoProps> = ({
  reuniao,
  open,
  onOpenChange,
  onGerarAtaIA,
  empresaId,
}) => {
  const r = reuniao as ReuniaoEnriquecida | null;
  const titulo = r?.titulo || (r as ReuniaoEnriquecida)?.conselho_nome || (r as ReuniaoEnriquecida)?.comite_nome || (r as ReuniaoEnriquecida)?.comissao_nome || "Reunião";
  const dataReuniao = r?.data_reuniao ? new Date(r.data_reuniao) : null;
  const horario = (r as ReuniaoEnriquecida)?.horario ? String((r as ReuniaoEnriquecida).horario).slice(0, 5) : null;
  const status = (r?.status ?? "agendada").toLowerCase().replace(/ /g, "_");
  const statusLabel = STATUS_LABEL[status] ?? r?.status ?? "Agendada";
  const tipoRaw = (r as ReuniaoEnriquecida)?.tipo ?? "";
  const modalidade = MODALIDADE_LABEL[tipoRaw.toLowerCase()] ?? "Presencial";
  const diasRestantes = dataReuniao ? differenceInDays(dataReuniao, new Date()) : 0;

  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [agendaTitulo, setAgendaTitulo] = useState("");
  const [agendaDescricao, setAgendaDescricao] = useState("");
  const [agendaApresentador, setAgendaApresentador] = useState("");
  const [agendaDuracao, setAgendaDuracao] = useState(30);
  const [agendaTipo, setAgendaTipo] = useState("informativo");

  const [documentosCount, setDocumentosCount] = useState(0);
  const [gravacaoEnviada, setGravacaoEnviada] = useState(false);
  const [ataEnviada, setAtaEnviada] = useState(false);

  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [tarefaNome, setTarefaNome] = useState("");
  const [tarefaResponsavel, setTarefaResponsavel] = useState("");
  const [tarefaData, setTarefaData] = useState("");

  const [assuntosProxima, setAssuntosProxima] = useState("");
  const [assuntosSalvos, setAssuntosSalvos] = useState("");

  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [participantesConfirmados, setParticipantesConfirmados] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open || !empresaId || !r) return;
    const orgaoId = (r as ReuniaoEnriquecida).conselho_id || (r as ReuniaoEnriquecida).comite_id || (r as ReuniaoEnriquecida).comissao_id;
    const tipo = (r as ReuniaoEnriquecida).conselho_id ? "conselho" : (r as ReuniaoEnriquecida).comite_id ? "comite" : "comissao";
    if (!orgaoId) return;
    fetchMembrosPorOrgao(empresaId, tipo, orgaoId).then((membros) => {
      setParticipantes(membros.map((m) => ({
        id: m.id,
        nome: m.nome,
        email: `${m.nome.toLowerCase().replace(/\s/g, ".")}@empresa.com`,
        cargo: m.cargo ?? "Membro",
        confirmado: false,
      })));
    });
  }, [open, empresaId, r]);

  const reuniaoParaChecklist: ReuniaoGestao = {
    id: r?.id ?? "",
    titulo,
    data_reuniao: dataReuniao ? format(dataReuniao, "dd/MM/yyyy") : undefined,
    tipo: (r as ReuniaoEnriquecida)?.tipo ?? undefined,
    status: r?.status,
    pautas: agendaItems.length > 0 ? agendaItems.map((a) => ({ id: a.id, titulo: a.titulo })) : [],
    documentos_previos_count: documentosCount,
    gravacao_url: gravacaoEnviada ? "ok" : undefined,
    participantes_confirmados: participantes.filter((p) => participantesConfirmados.has(p.id)).map((p) => p.nome),
  };
  const checklist = r ? deriveChecklist(reuniaoParaChecklist) : null;
  const canGerar = checklist ? allChecksDone(checklist) : false;
  const pendentes = checklist ? CHECK_ITEMS.filter((c) => !checklist[c.key]).length : 5;

  const progresso = Math.round(
    ([
      agendaItems.length > 0,
      documentosCount > 0,
      gravacaoEnviada,
      ataEnviada,
      tarefas.length > 0,
      participantesConfirmados.size > 0,
    ].filter(Boolean).length / 6) * 100
  );

  const handleAdicionarItem = () => {
    if (!agendaTitulo.trim()) return;
    setAgendaItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        titulo: agendaTitulo,
        descricao: agendaDescricao,
        apresentador: agendaApresentador,
        duracao: agendaDuracao,
        tipo: agendaTipo,
      },
    ]);
    setAgendaTitulo("");
    setAgendaDescricao("");
    setAgendaApresentador("");
    setAgendaDuracao(30);
    setAgendaTipo("informativo");
  };

  const handleSalvarTarefa = () => {
    if (!tarefaNome.trim()) return;
    setTarefas((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        nome: tarefaNome,
        responsavel: tarefaResponsavel,
        dataConclusao: tarefaData || format(new Date(), "yyyy-MM-dd"),
      },
    ]);
    setTarefaNome("");
    setTarefaResponsavel("");
    setTarefaData("");
  };

  const toggleConfirmacao = (id: string) => {
    setParticipantesConfirmados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const secao = (icon: React.ReactNode, tituloSecao: string, children: React.ReactNode) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {icon}
          {tituloSecao}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-xl">
            Gestão da Reunião - {titulo}
          </DialogTitle>
          {dataReuniao && (
            <p className="text-sm text-muted-foreground font-normal">
              {format(dataReuniao, "dd/MM/yyyy", { locale: ptBR })} às {horario ?? "—"}
            </p>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
          {/* 1. Header da Reunião */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold">{titulo}</h2>
                <Badge className={cn(
                  status === "agendada" && "bg-blue-500",
                  status === "realizada" && "bg-purple-500",
                  status === "ata_gerada" && "bg-green-500"
                )}>
                  {statusLabel}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {dataReuniao ? format(dataReuniao, "dd/MM/yyyy") : "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {horario ?? "—"}
                </span>
                <span>{modalidade}</span>
              </div>
              {diasRestantes > 0 && (
                <p className="text-sm">
                  <strong>{diasRestantes} dias</strong> até a reunião
                </p>
              )}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progresso da Reunião</span>
                  <span>{progresso}%</span>
                </div>
                <Progress value={progresso} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* 2. Definição de Pauta & 3. Documentos Prévios */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {secao(
              <List className="h-4 w-4" />,
              "Definição de Pauta",
              <>
                <div className="space-y-2">
                  <Label>Título do item</Label>
                  <Input value={agendaTitulo} onChange={(e) => setAgendaTitulo(e.target.value)} placeholder="Título do item" />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea value={agendaDescricao} onChange={(e) => setAgendaDescricao(e.target.value)} placeholder="Descrição" rows={2} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label>Apresentador</Label>
                    <Input value={agendaApresentador} onChange={(e) => setAgendaApresentador(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Duração</Label>
                    <Input type="number" min={1} value={agendaDuracao} onChange={(e) => setAgendaDuracao(parseInt(e.target.value, 10) || 30)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Tipo</Label>
                    <Select value={agendaTipo} onValueChange={setAgendaTipo}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="informativo">Informativo</SelectItem>
                        <SelectItem value="decisorio">Decisório</SelectItem>
                        <SelectItem value="discussao">Discussão</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full" onClick={handleAdicionarItem}>
                  + Adicionar Item
                </Button>
                {agendaItems.length > 0 && (
                  <ul className="text-sm space-y-1 mt-2">
                    {agendaItems.map((item) => (
                      <li key={item.id} className="flex justify-between items-center py-1 border-b">
                        <span>{item.titulo}</span>
                        <Button variant="ghost" size="sm" onClick={() => setAgendaItems((p) => p.filter((i) => i.id !== item.id))}>Remover</Button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {secao(
              <Upload className="h-4 w-4" />,
              "Documentos Prévios",
              <>
                {documentosCount === 0 ? (
                  <div className="text-center py-6 border border-dashed rounded-lg">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Nenhum documento enviado</p>
                    <Button variant="outline" onClick={() => setDocumentosCount(1)}>Enviar Documentos</Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm">{documentosCount} documento(s) anexado(s)</p>
                    <Button variant="outline" size="sm" onClick={() => setDocumentosCount(0)}>Remover</Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 4. Gravação & 5. ATA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {secao(
              <Mic className="h-4 w-4" />,
              "Gravação da Reunião",
              <>
                {!gravacaoEnviada ? (
                  <div className="text-center py-6 border border-dashed rounded-lg">
                    <Mic className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Aguardando gravação da reunião</p>
                    <Button variant="outline" onClick={() => setGravacaoEnviada(true)}>Subir arquivo da reunião</Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Gravação enviada</p>
                    <Button variant="outline" size="sm" onClick={() => setGravacaoEnviada(false)}>Remover</Button>
                  </div>
                )}
              </>
            )}
            {secao(
              <FileText className="h-4 w-4" />,
              "Ata da reunião",
              <>
                {!ataEnviada ? (
                  <div className="text-center py-6 border border-dashed rounded-lg">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Nenhum arquivo de ATA enviado</p>
                    <Button variant="outline" onClick={() => setAtaEnviada(true)}>Enviar Arquivo de ATA</Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm">ATA enviada</p>
                    <Button variant="outline" size="sm" onClick={() => setAtaEnviada(false)}>Remover</Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 6. Tarefas & 7. Assuntos Próxima */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {secao(
              <ListTodo className="h-4 w-4" />,
              "Tarefas e Combinados",
              <>
                <div className="space-y-2">
                  <Label>Nome da Tarefa</Label>
                  <Input value={tarefaNome} onChange={(e) => setTarefaNome(e.target.value)} placeholder="Descreva a tarefa..." />
                </div>
                <div className="space-y-2">
                  <Label>Responsável</Label>
                  <Input value={tarefaResponsavel} onChange={(e) => setTarefaResponsavel(e.target.value)} placeholder="Nome do responsável" />
                </div>
                <div className="space-y-2">
                  <Label>Data Conclusão</Label>
                  <Input type="date" value={tarefaData} onChange={(e) => setTarefaData(e.target.value)} />
                </div>
                <Button className="w-full" onClick={handleSalvarTarefa}>Salvar</Button>
                {tarefas.length > 0 && (
                  <ul className="text-sm space-y-1 mt-2">
                    {tarefas.map((t) => (
                      <li key={t.id} className="flex justify-between py-1 border-b">
                        <span>{t.nome} — {t.responsavel}</span>
                        <Button variant="ghost" size="sm" onClick={() => setTarefas((p) => p.filter((x) => x.id !== t.id))}>Remover</Button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {secao(
              <MessageSquare className="h-4 w-4" />,
              "Assuntos para Próxima Reunião",
              <>
                <Textarea
                  value={assuntosProxima}
                  onChange={(e) => setAssuntosProxima(e.target.value)}
                  placeholder="Assuntos que não foram discutidos e devem ir para a próxima reunião..."
                  rows={4}
                />
                <Button className="w-full" onClick={() => setAssuntosSalvos(assuntosProxima)}>Salvar Assuntos</Button>
                {assuntosSalvos && <p className="text-sm text-muted-foreground">Salvo.</p>}
              </>
            )}
          </div>

          {/* 8. Participantes */}
          {secao(
            <Users className="h-4 w-4" />,
            "Participantes da Reunião",
            <>
              <p className="text-sm text-muted-foreground">
                {participantes.length} participantes • {participantesConfirmados.size} confirmados
              </p>
              <div className="space-y-2">
                {participantes.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">{p.nome[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.nome}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                    </div>
                    <Badge variant="outline">{p.cargo}</Badge>
                    <Button
                      variant={participantesConfirmados.has(p.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleConfirmacao(p.id)}
                    >
                      {participantesConfirmados.has(p.id) ? "Confirmado" : "Confirmar"}
                    </Button>
                  </div>
                ))}
                {participantes.length === 0 && <p className="text-sm text-muted-foreground">Carregando participantes...</p>}
              </div>
            </>
          )}

          {/* 9. Status Realização */}
          {secao(
            <CheckCircle2 className="h-4 w-4" />,
            "Realização da Reunião",
            <>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <span className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  Status da Reunião — {dataReuniao ? format(dataReuniao, "dd/MM/yyyy") : "—"} às {horario ?? "—"}
                </span>
                <Badge>{statusLabel}</Badge>
              </div>
              {status === "agendada" && dataReuniao && new Date() < dataReuniao && (
                <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4" />
                  Esta reunião ainda não aconteceu. A confirmação de realização ficará disponível após a data agendada.
                </p>
              )}
            </>
          )}

          {/* 10. Geração ATA com IA */}
          {secao(
            <Bot className="h-4 w-4" />,
            "Geração de ATA com IA",
            <>
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800 p-4">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Preencha todos os requisitos para gerar a ATA
                </p>
                <div className="flex flex-col gap-2">
                  {CHECK_ITEMS.map(({ key, label }) => {
                    const done = checklist?.[key] ?? false;
                    return (
                      <div key={key} className={cn("flex items-center gap-2 text-sm", done ? "text-green-700 dark:text-green-400" : "text-yellow-800 dark:text-yellow-300")}>
                        {done ? <Check className="h-4 w-4 shrink-0 text-green-600" /> : <X className="h-4 w-4 shrink-0 text-amber-600" />}
                        <span>{label}</span>
                        {done && <span className="ml-auto text-xs font-medium">Concluído</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  className="flex-1"
                  size="lg"
                  disabled={!canGerar}
                  onClick={() => canGerar && onGerarAtaIA?.()}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Gerar ATA com IA
                </Button>
                {pendentes > 0 && <span className="text-sm text-muted-foreground">{pendentes} pendências</span>}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GestaoReuniao;
