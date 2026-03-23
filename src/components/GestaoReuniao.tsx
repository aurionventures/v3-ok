import React, { useEffect, useRef, useState } from "react";
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
  Pencil,
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
import { fetchMembrosPorReuniao } from "@/services/governance";
import {
  fetchPautas,
  insertPauta,
  deletePauta,
  fetchGestao,
  upsertGestao,
  fetchTarefas,
  insertTarefa,
  deleteTarefa,
} from "@/services/gestaoReuniao";
import { updateReuniaoStatus } from "@/services/agenda";
import { fetchPromptPautaAta } from "@/services/promptsConfig";
import { invokeEdgeFunction } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import AtaPrintDialog from "@/components/AtaPrintDialog";
import { fetchAtas, upsertAta } from "@/services/atas";

const CHECK_ITEMS: { key: keyof ReturnType<typeof deriveChecklist>; label: string }[] = [
  { key: "statusConcluido", label: "Status da reunião deve ser 'Realizada'" },
  { key: "temPauta", label: "Pauta da reunião" },
  { key: "temDocumentosPrevios", label: "Documentos prévios" },
  { key: "temGravacao", label: "Gravação da reunião" },
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
  dataPrazo: string;
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
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [agendaTitulo, setAgendaTitulo] = useState("");
  const [agendaDescricao, setAgendaDescricao] = useState("");
  const [agendaApresentador, setAgendaApresentador] = useState("");
  const [agendaDuracao, setAgendaDuracao] = useState(30);
  const [agendaTipo, setAgendaTipo] = useState("informativo");

  const [documentosCount, setDocumentosCount] = useState(0);
  const [gravacaoEnviada, setGravacaoEnviada] = useState(false);
  const [gravacaoArquivoNome, setGravacaoArquivoNome] = useState<string | null>(null);
  const [transcricaoTexto, setTranscricaoTexto] = useState("");
  const [gravacaoSalva, setGravacaoSalva] = useState(false);
  const [ataEnviada, setAtaEnviada] = useState(false);

  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [tarefaNome, setTarefaNome] = useState("");
  const [tarefaResponsavel, setTarefaResponsavel] = useState("");
  const [tarefaData, setTarefaData] = useState("");

  const [assuntosProxima, setAssuntosProxima] = useState("");
  const [assuntosSalvos, setAssuntosSalvos] = useState("");

  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [statusOverride, setStatusOverride] = useState<string | null>(null);
  const [ataGerando, setAtaGerando] = useState(false);
  const [ataGeradaTexto, setAtaGeradaTexto] = useState<string | null>(null);
  const [ataPrintOpen, setAtaPrintOpen] = useState(false);
  const [ataSalvando, setAtaSalvando] = useState(false);
  const [ataSalva, setAtaSalva] = useState(false);

  const inputDocumentosRef = useRef<HTMLInputElement>(null);
  const inputGravacaoRef = useRef<HTMLInputElement>(null);
  const inputAtaRef = useRef<HTMLInputElement>(null);

  const titulo = r?.titulo || (r as ReuniaoEnriquecida)?.conselho_nome || (r as ReuniaoEnriquecida)?.comite_nome || (r as ReuniaoEnriquecida)?.comissao_nome || "Reunião";
  const dataReuniao = r?.data_reuniao ? new Date(r.data_reuniao) : null;
  const horario = (r as ReuniaoEnriquecida)?.horario ? String((r as ReuniaoEnriquecida).horario).slice(0, 5) : null;
  const statusEfetivo = statusOverride ?? r?.status ?? "agendada";
  const status = statusEfetivo.toLowerCase().replace(/ /g, "_");
  const statusLabel = STATUS_LABEL[status] ?? statusEfetivo ?? "Agendada";
  const tipoRaw = (r as ReuniaoEnriquecida)?.tipo ?? "";
  const modalidade = MODALIDADE_LABEL[tipoRaw.toLowerCase()] ?? "Presencial";
  const diasRestantes = dataReuniao ? differenceInDays(dataReuniao, new Date()) : 0;

  useEffect(() => {
    if (!open || !empresaId || !r) return;
    const rr = r as ReuniaoEnriquecida;
    const temOrgao = rr.conselho_id || rr.comite_id || rr.comissao_id;
    if (!temOrgao) {
      setParticipantes([]);
      return;
    }
    fetchMembrosPorReuniao(empresaId, {
      conselho_id: rr.conselho_id,
      comite_id: rr.comite_id,
      comissao_id: rr.comissao_id,
    }).then((membros) => {
      setParticipantes(membros.map((m) => ({
        id: m.id,
        nome: m.nome,
        email: m.email?.trim() || `${m.nome.toLowerCase().replace(/\s/g, ".")}@empresa.com`,
        cargo: m.cargo ?? "Membro",
        confirmado: false,
      })));
    });
  }, [open, empresaId, r]);

  useEffect(() => {
    if (!open) {
      setAtaGeradaTexto(null);
      setAtaSalva(false);
      return;
    }
    if (!r?.id) return;
    fetchAtas(r.id).then(({ data: atasData }) => {
      if (atasData.length > 0) {
        setAtaSalva(true);
        setAtaGeradaTexto(atasData[0].conteudo ?? null);
      } else {
        setAtaSalva(false);
      }
    });
    fetchPautas(r.id).then(({ data }) => {
      setAgendaItems(
        data.map((p) => ({
          id: p.id,
          titulo: p.titulo,
          descricao: p.descricao ?? "",
          apresentador: p.apresentador ?? "",
          duracao: p.tempo_estimado_min ?? 30,
          tipo: p.tipo ?? "informativo",
        }))
      );
    });
    fetchTarefas(r.id).then(({ data }) => {
      setTarefas(
        data.map((t) => ({
          id: t.id,
          nome: t.nome,
          responsavel: t.responsavel,
          dataPrazo: t.data_prazo ?? t.data_conclusao ?? "",
          dataConclusao: t.data_conclusao ?? "",
        }))
      );
    });
    fetchGestao(r.id).then(({ data }) => {
      if (data) {
        setDocumentosCount(data.documentos_count);
        setTranscricaoTexto(data.transcricao_texto ?? "");
        setGravacaoArquivoNome(data.gravacao_arquivo_nome);
        setGravacaoEnviada(!!(data.transcricao_texto || data.gravacao_arquivo_nome));
        setGravacaoSalva(!!(data.transcricao_texto || data.gravacao_arquivo_nome));
        setAtaEnviada(data.ata_enviada);
        setAssuntosSalvos(data.assuntos_proxima ?? "");
      }
    });
  }, [open, r?.id]);

  const reuniaoParaChecklist: ReuniaoGestao = {
    id: r?.id ?? "",
    titulo,
    data_reuniao: dataReuniao ? format(dataReuniao, "dd/MM/yyyy") : undefined,
    tipo: (r as ReuniaoEnriquecida)?.tipo ?? undefined,
    status: statusEfetivo,
    pautas: agendaItems.length > 0 ? agendaItems.map((a) => ({ id: a.id, titulo: a.titulo })) : [],
    documentos_previos_count: documentosCount,
    gravacao_url: (gravacaoEnviada || transcricaoTexto.trim().length > 0) ? "ok" : undefined,
  };
  const checklist = r ? deriveChecklist(reuniaoParaChecklist) : null;
  const canGerar = checklist ? allChecksDone(checklist) : false;
  const pendentes = checklist ? CHECK_ITEMS.filter((c) => !checklist[c.key]).length : 5;

  const handleAdicionarItem = async () => {
    if (!agendaTitulo.trim()) {
      toast({ title: "Preencha o título do item", variant: "destructive" });
      return;
    }
    if (!r?.id) {
      toast({ title: "Reunião ainda não salva. Salve a reunião antes de adicionar itens.", variant: "destructive" });
      return;
    }
    const { data, error } = await insertPauta({
      reuniao_id: r.id,
      titulo: agendaTitulo,
      ordem: agendaItems.length,
      tempo_estimado_min: agendaDuracao,
      descricao: agendaDescricao || undefined,
      apresentador: agendaApresentador || undefined,
      tipo: agendaTipo,
    });
    if (error) {
      toast({ title: "Erro ao salvar item", description: error, variant: "destructive" });
      return;
    }
    if (data) {
      setAgendaItems((prev) => [
        ...prev,
        {
          id: data.id,
          titulo: data.titulo,
          descricao: data.descricao ?? "",
          apresentador: data.apresentador ?? "",
          duracao: data.tempo_estimado_min ?? 30,
          tipo: data.tipo ?? "informativo",
        },
      ]);
      toast({ title: "Item adicionado à pauta" });
    }
    setAgendaTitulo("");
    setAgendaDescricao("");
    setAgendaApresentador("");
    setAgendaDuracao(30);
    setAgendaTipo("informativo");
  };

  const handleSalvarTarefa = async () => {
    if (!tarefaNome.trim()) {
      toast({ title: "Preencha o nome da tarefa", variant: "destructive" });
      return;
    }
    if (!r?.id) {
      toast({ title: "Reunião não encontrada", variant: "destructive" });
      return;
    }
    const { data, error } = await insertTarefa({
      reuniao_id: r.id,
      nome: tarefaNome,
      responsavel: tarefaResponsavel,
      data_prazo: tarefaData || null,
    });
    if (error) {
      toast({ title: "Erro ao salvar tarefa", description: error, variant: "destructive" });
      return;
    }
    if (data) {
      setTarefas((prev) => [
        ...prev,
        {
          id: data.id,
          nome: data.nome,
          responsavel: data.responsavel,
          dataPrazo: data.data_prazo ?? "",
          dataConclusao: data.data_conclusao ?? "",
        },
      ]);
      setTarefaNome("");
      setTarefaResponsavel("");
      setTarefaData("");
      toast({ title: "Tarefa salva", description: tarefaNome });
    }
  };

  const handleSalvarAssuntos = async () => {
    if (!r?.id) return;
    const { error } = await upsertGestao(r.id, { assuntos_proxima: assuntosProxima });
    if (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
      return;
    }
    setAssuntosSalvos(assuntosProxima);
    toast({ title: "Assuntos salvos", description: "Assuntos para próxima reunião registrados." });
  };

  const handleFileDocumentos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      const count = documentosCount + files.length;
      setDocumentosCount(count);
      if (r?.id) {
        const { error } = await upsertGestao(r.id, { documentos_count: count });
        if (error) toast({ title: "Erro ao salvar", description: error, variant: "destructive" });
        else toast({ title: "Documentos enviados", description: `${files.length} arquivo(s) anexado(s) com sucesso.` });
      } else {
        toast({ title: "Documentos enviados", description: `${files.length} arquivo(s) anexado(s).` });
      }
    }
    e.target.value = "";
  };

  const handleFileGravacao = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGravacaoEnviada(true);
      setGravacaoArquivoNome(file.name);
      toast({ title: "Gravação enviada", description: `Arquivo "${file.name}" anexado com sucesso.` });
    }
    e.target.value = "";
  };

  const temGravacaoOuTranscricao = gravacaoEnviada || transcricaoTexto.trim().length > 0;

  const handleLimparGravacao = async () => {
    if (r?.id) {
      const { error } = await upsertGestao(r.id, { transcricao_texto: null, gravacao_arquivo_nome: null });
      if (error) {
        toast({ title: "Erro ao remover", variant: "destructive" });
        return;
      }
    }
    setGravacaoEnviada(false);
    setGravacaoArquivoNome(null);
    setTranscricaoTexto("");
    setGravacaoSalva(false);
    toast({ title: "Gravação/transcrição removida" });
  };

  const handleSalvarGravacao = async () => {
    if (!r?.id) return;
    const { error } = await upsertGestao(r.id, {
      transcricao_texto: transcricaoTexto.trim() || null,
      gravacao_arquivo_nome: gravacaoArquivoNome ?? null,
    });
    if (error) {
      toast({ title: "Erro ao salvar", description: error, variant: "destructive" });
      return;
    }
    setGravacaoSalva(true);
    toast({ title: "Gravação salva", description: transcricaoTexto.trim() ? "Transcrição e/ou arquivo salvos com sucesso." : "Arquivo salvo com sucesso." });
  };

  const handleEditarGravacao = () => {
    setGravacaoSalva(false);
  };

  const handleFileAta = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (r?.id) {
        const { error } = await upsertGestao(r.id, { ata_enviada: true });
        if (error) {
          toast({ title: "Erro ao salvar", variant: "destructive" });
          e.target.value = "";
          return;
        }
      }
      setAtaEnviada(true);
      toast({ title: "ATA enviada", description: `Arquivo "${file.name}" anexado com sucesso.` });
    }
    e.target.value = "";
  };

  const handleSalvarAta = async () => {
    if (!r?.id || !ataGeradaTexto) return;
    setAtaSalvando(true);
    const membroIds = participantes.map((p) => p.id);
    const { error } = await upsertAta(r.id, ataGeradaTexto, undefined, membroIds);
    setAtaSalvando(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error, variant: "destructive" });
      return;
    }
    setAtaSalva(true);
    toast({
      title: "ATA salva",
      description: membroIds.length > 0
        ? "Os membros receberão a ATA para aprovação em suas telas."
        : "Disponível em Secretariado > ATAs.",
    });
  };

  const handleMarcarRealizada = async () => {
    if (!r?.id) return;
    const { error } = await updateReuniaoStatus(r.id, "realizada");
    if (error) {
      toast({ title: "Erro ao atualizar status", variant: "destructive" });
      return;
    }
    setStatusOverride("realizada");
    toast({ title: "Status atualizado", description: "Reunião marcada como Realizada." });
  };

  const handleGerarPautaAtaIA = async () => {
    if (!r || !empresaId) return;
    setAtaGerando(true);
    setAtaGeradaTexto(null);
    try {
      const partes: string[] = [];
      partes.push(`REUNIÃO: ${titulo}`);
      partes.push(`Data: ${dataReuniao ? format(dataReuniao, "dd/MM/yyyy") : "—"}`);
      partes.push(`Horário: ${horario ?? "—"}`);
      partes.push(`Status: ${statusLabel}`);
      partes.push("");
      if (agendaItems.length > 0) {
        partes.push("PAUTA:");
        agendaItems.forEach((a, i) => {
          partes.push(`${i + 1}. ${a.titulo}${a.descricao ? ` - ${a.descricao}` : ""}`);
          if (a.apresentador) partes.push(`   Apresentador: ${a.apresentador}`);
          if (a.duracao) partes.push(`   Duração: ${a.duracao} min`);
          if (a.tipo) partes.push(`   Tipo: ${a.tipo}`);
        });
        partes.push("");
      }
      if (transcricaoTexto.trim()) {
        partes.push("TRANSCRIÇÃO / NOTAS:");
        partes.push(transcricaoTexto.trim());
        partes.push("");
      }
      if (tarefas.length > 0) {
        partes.push("TAREFAS E COMBINADOS:");
        tarefas.forEach((t) => {
          partes.push(`- ${t.nome} | Responsável: ${t.responsavel}${t.dataPrazo ? ` | Prazo: ${t.dataPrazo}` : ""}`);
        });
        partes.push("");
      }
      if (assuntosSalvos) {
        partes.push("ASSUNTOS PARA PRÓXIMA REUNIÃO:");
        partes.push(assuntosSalvos);
        partes.push("");
      }
      if (participantes.length > 0) {
        partes.push("PARTICIPANTES:");
        participantes.forEach((p) => partes.push(`- ${p.nome} (${p.cargo})`));
      }
      const input = partes.join("\n");

      const { prompt } = await fetchPromptPautaAta(empresaId);
      const { data, error } = await invokeEdgeFunction<{ textoCompleto?: string; error?: string }>(
        "agente-atas-reunioes",
        { input, systemPrompt: prompt }
      );
      if (error) {
        const msg = error.message || "Habilite a API da Open AI";
        console.error("[GestaoReuniao] agente-atas-reunioes:", error);
        toast({ title: "Erro ao gerar", description: msg, variant: "destructive" });
        return;
      }
      const payload = data as { textoCompleto?: string; error?: string };
      if (payload?.error) {
        toast({ title: "Erro ao gerar", description: payload.error || "Habilite a API da Open AI", variant: "destructive" });
        return;
      }
      const texto = payload?.textoCompleto;
      if (texto) {
        setAtaGeradaTexto(texto);
        setAtaPrintOpen(true);
        toast({ title: "Pauta/ATA gerada", description: "Visualize, imprima ou salve na biblioteca de ATAs." });
      } else {
        toast({ title: "Erro", description: "Resposta inesperada do servidor", variant: "destructive" });
      }
    } finally {
      setAtaGerando(false);
    }
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
                  <ul className="text-sm space-y-2 mt-2">
                    {agendaItems.map((item) => (
                      <li key={item.id} className="flex justify-between items-center py-2 px-3 rounded-lg bg-primary/5 border border-primary/20">
                        <span>{item.titulo}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            const { error } = await deletePauta(item.id);
                            if (error) {
                              toast({ title: "Erro ao remover item", description: error, variant: "destructive" });
                              return;
                            }
                            setAgendaItems((p) => p.filter((i) => i.id !== item.id));
                            toast({ title: "Item removido da pauta" });
                          }}
                        >
                          Remover
                        </Button>
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
                <input
                  ref={inputDocumentosRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                  onChange={handleFileDocumentos}
                />
                {documentosCount === 0 ? (
                  <div className="text-center py-6 border border-dashed rounded-lg">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Nenhum documento enviado</p>
                    <Button variant="outline" onClick={() => inputDocumentosRef.current?.click()}>Enviar Documentos</Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm">{documentosCount} documento(s) anexado(s)</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (!r?.id) return;
                        setDocumentosCount(0);
                        const { error } = await upsertGestao(r.id, { documentos_count: 0 });
                        if (error) toast({ title: "Erro ao remover", variant: "destructive" });
                        else toast({ title: "Documentos removidos" });
                      }}
                    >
                      Remover
                    </Button>
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
                <input
                  ref={inputGravacaoRef}
                  type="file"
                  accept="audio/*,video/*,.mp3,.mp4,.webm,.wav,.txt"
                  className="hidden"
                  onChange={handleFileGravacao}
                />
                {!temGravacaoOuTranscricao ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Cole a transcrição ou envie um arquivo de áudio/vídeo</p>
                    <div className="space-y-2">
                      <Label className="text-xs">Transcrição (cole o texto)</Label>
                      <Textarea
                        value={transcricaoTexto}
                        onChange={(e) => setTranscricaoTexto(e.target.value)}
                        placeholder="Cole aqui a transcrição da reunião..."
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">ou</p>
                    <Button variant="outline" className="w-full" onClick={() => inputGravacaoRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir arquivo da reunião
                    </Button>
                  </div>
                ) : gravacaoSalva ? (
                  <div className="space-y-2">
                    {gravacaoEnviada && gravacaoArquivoNome && (
                      <div className="rounded border p-2 text-sm bg-muted/30">
                        <span className="truncate">Arquivo: {gravacaoArquivoNome}</span>
                      </div>
                    )}
                    {transcricaoTexto.trim().length > 0 && (
                      <div className="rounded border p-2 text-sm max-h-32 overflow-y-auto bg-muted/30">
                        <p className="text-muted-foreground text-xs mb-1">Transcrição colada:</p>
                        <p className="text-xs break-words whitespace-pre-wrap">{transcricaoTexto.trim()}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleEditarGravacao}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleLimparGravacao}>Remover</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Transcrição (cole o texto)</Label>
                      <Textarea
                        value={transcricaoTexto}
                        onChange={(e) => setTranscricaoTexto(e.target.value)}
                        placeholder="Cole aqui a transcrição da reunião..."
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">ou</p>
                    <Button variant="outline" className="w-full" onClick={() => inputGravacaoRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir arquivo da reunião
                    </Button>
                    {gravacaoEnviada && gravacaoArquivoNome && (
                      <p className="text-xs text-muted-foreground">Arquivo anexado: {gravacaoArquivoNome}</p>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSalvarGravacao}>Salvar</Button>
                      <Button variant="outline" size="sm" onClick={handleLimparGravacao}>Remover</Button>
                    </div>
                  </div>
                )}
              </>
            )}
            {secao(
              <FileText className="h-4 w-4" />,
              "Ata da reunião",
              <>
                <input
                  ref={inputAtaRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileAta}
                />
                {!ataEnviada ? (
                  <div className="text-center py-6 border border-dashed rounded-lg">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Nenhum arquivo de ATA enviado</p>
                    <Button variant="outline" onClick={() => inputAtaRef.current?.click()}>Enviar Arquivo de ATA</Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm">ATA enviada</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (!r?.id) return;
                        const { error } = await upsertGestao(r.id, { ata_enviada: false });
                        if (error) {
                          toast({ title: "Erro ao remover", variant: "destructive" });
                          return;
                        }
                        setAtaEnviada(false);
                        toast({ title: "ATA removida" });
                      }}
                    >
                      Remover
                    </Button>
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
                  <Select value={tarefaResponsavel} onValueChange={setTarefaResponsavel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {participantes.length === 0 ? (
                        <SelectItem value="_loading" disabled>Carregando membros...</SelectItem>
                      ) : (
                        participantes.map((p) => (
                          <SelectItem key={p.id} value={p.nome}>{p.nome}{p.cargo ? ` (${p.cargo})` : ""}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data Conclusão</Label>
                  <Input type="date" value={tarefaData} onChange={(e) => setTarefaData(e.target.value)} />
                </div>
                <Button className="w-full" onClick={handleSalvarTarefa}>Salvar</Button>
                {tarefas.length > 0 && (
                  <ul className="text-sm space-y-2 mt-2">
                    {tarefas.map((t) => (
                      <li key={t.id} className="flex justify-between items-center py-2 px-3 rounded-lg bg-primary/5 border border-primary/20">
                        <span>{t.nome} — {t.responsavel}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            const { error } = await deleteTarefa(t.id);
                            if (error) {
                              toast({ title: "Erro ao remover", variant: "destructive" });
                              return;
                            }
                            setTarefas((p) => p.filter((x) => x.id !== t.id));
                            toast({ title: "Tarefa removida" });
                          }}
                        >
                          Remover
                        </Button>
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
                <Button className="w-full" onClick={handleSalvarAssuntos}>Salvar Assuntos</Button>
                {assuntosSalvos && <p className="text-sm text-muted-foreground py-2 px-3 rounded-lg bg-primary/5 border border-primary/20">Salvo.</p>}
              </>
            )}
          </div>

          {/* 8. Participantes */}
          {secao(
            <Users className="h-4 w-4" />,
            "Participantes da Reunião",
            <>
              <p className="text-sm text-muted-foreground">
                {participantes.length} participantes
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
                <div className="flex items-center gap-2">
                  <Badge>{statusLabel}</Badge>
                  {status === "agendada" && (
                    <Button variant="outline" size="sm" onClick={handleMarcarRealizada}>
                      Marcar como Realizada
                    </Button>
                  )}
                </div>
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
                <p className="text-xs text-muted-foreground mt-2">
                  Ao salvar a ATA, os participantes receberão para aprovação. Após todos aprovarem, cada um receberá novamente para assinatura. O status será atualizado em &quot;ATAS Pendentes de Aprovação/Assinatura&quot; no Secretariado.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    className="flex-1"
                    size="lg"
                    disabled={!canGerar || ataGerando || ataSalva}
                    onClick={() => canGerar && handleGerarPautaAtaIA()}
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    {ataGerando ? "Gerando..." : "Gerar ATA com IA"}
                  </Button>
                  {pendentes > 0 && <span className="text-sm text-muted-foreground">{pendentes} pendências</span>}
                </div>
                {ataGeradaTexto && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAtaPrintOpen(true)}
                  >
                    Ver ATA gerada
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
      <AtaPrintDialog
        open={ataPrintOpen}
        onOpenChange={setAtaPrintOpen}
        titulo={titulo}
        dataReuniao={dataReuniao}
        conteudo={ataGeradaTexto ?? ""}
        onSave={handleSalvarAta}
        saving={ataSalvando}
      />
    </Dialog>
  );
};

export default GestaoReuniao;
