import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchMembroByUserId } from "@/services/governance";
import {
  fetchAtasPendentesMembro,
  aprovarAta,
  assinarAta,
  reprovarAta,
  type AtaPendenteMembro,
} from "@/services/ataAprovacoes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NotificationBell from "@/components/NotificationBell";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Eye, Check, PenLine, Loader2, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const MemberAtasPendentes = () => {
  const [atas, setAtas] = useState<AtaPendenteMembro[]>([]);
  const [loading, setLoading] = useState(true);
  const [membroId, setMembroId] = useState<string | null>(null);
  const [viewAta, setViewAta] = useState<AtaPendenteMembro | null>(null);
  const [actionando, setActionando] = useState<string | null>(null);
  const [reprovacaoComentario, setReprovacaoComentario] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }
      const membro = await fetchMembroByUserId(session.user.id);
      if (!membro) {
        setLoading(false);
        return;
      }
      setMembroId(membro.id);
      const { data, error } = await fetchAtasPendentesMembro(membro.id);
      if (error) {
        toast({ title: "Erro ao carregar", description: error, variant: "destructive" });
      }
      setAtas(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const refetch = async () => {
    if (!membroId) return;
    const { data } = await fetchAtasPendentesMembro(membroId);
    setAtas(data ?? []);
  };

  const handleAprovar = async (ata: AtaPendenteMembro) => {
    if (!membroId) return;
    setActionando(ata.id);
    const { error } = await aprovarAta(ata.id, membroId);
    setActionando(null);
    if (error) {
      toast({ title: "Erro ao aprovar", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "ATA aprovada", description: "Aguardando as demais aprovações." });
    setViewAta(null);
    refetch();
  };

  const handleReprovar = async (ata: AtaPendenteMembro) => {
    if (!membroId) return;
    const comentario = reprovacaoComentario.trim();
    if (!comentario) {
      toast({ title: "Comentário obrigatório", description: "Informe o que não está de acordo para reprovar.", variant: "destructive" });
      return;
    }
    setActionando(ata.id);
    const { error } = await reprovarAta(ata.id, membroId, comentario);
    setActionando(null);
    if (error) {
      toast({ title: "Erro ao reprovar", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "ATA reprovada", description: "Sua objeção foi enviada para análise do Secretariado." });
    setReprovacaoComentario("");
    setViewAta(null);
    refetch();
  };

  const handleAssinar = async (ata: AtaPendenteMembro) => {
    if (!membroId) return;
    setActionando(ata.id);
    const { error } = await assinarAta(ata.id, membroId);
    setActionando(null);
    if (error) {
      toast({ title: "Erro ao assinar", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "ATA assinada", description: "Aguardando as demais assinaturas." });
    setViewAta(null);
    refetch();
  };

  const handleCloseViewAta = () => {
    setViewAta(null);
    setReprovacaoComentario("");
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" /> ATAs Pendentes
            </h1>
            <p className="text-sm text-muted-foreground">ATAs aguardando sua ação</p>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg">ATAs Pendentes de Ação</h2>
              {atas.length > 0 && (
                <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white"
              >
                {atas.length}
              </span>
              )}
            </div>
            {loading ? (
              <div className="py-12 flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Carregando...
              </div>
            ) : atas.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Nenhuma ATA pendente</p>
                <p className="text-sm mt-1">
                  Você não possui ATAs aguardando aprovação ou assinatura.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {atas.map((ata) => {
                  const isAprovacao = ata.acao === "aprovacao";
                  const statusText = isAprovacao
                    ? `Aguardando sua aprovação (${ata.concluidos}/${ata.totalMembros} aprovaram)`
                    : `Aguardando sua assinatura (${ata.concluidos}/${ata.totalMembros} assinaram)`;
                  return (
                    <Card key={ata.id} className="border bg-card">
                      <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${
                            isAprovacao ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold">{ata.reuniao_titulo ?? ata.titulo}</h3>
                          <p className="text-sm text-muted-foreground">
                            Reunião • {ata.data_reuniao ? format(new Date(ata.data_reuniao), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                          </p>
                          <Badge variant="secondary" className="mt-2">
                            {statusText}
                          </Badge>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewAta(ata)}
                          >
                            <Eye className="h-4 w-4 mr-2" /> Ver ATA
                          </Button>
                          <Button
                            size="sm"
                            disabled={!!actionando}
                            onClick={() =>
                              isAprovacao
                                ? handleAprovar(ata)
                                : handleAssinar(ata)
                            }
                          >
                            {actionando === ata.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : isAprovacao ? (
                              <Check className="h-4 w-4 mr-2" />
                            ) : (
                              <PenLine className="h-4 w-4 mr-2" />
                            )}
                            {isAprovacao ? "Aprovar" : "Assinar"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!viewAta} onOpenChange={(open) => !open && handleCloseViewAta()}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {viewAta?.reuniao_titulo ?? viewAta?.titulo} •{" "}
              {viewAta?.data_reuniao
                ? format(new Date(viewAta.data_reuniao), "dd/MM/yyyy", { locale: ptBR })
                : "—"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto rounded border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
            {viewAta?.conteudo ?? "Conteúdo não disponível."}
          </div>
          {viewAta?.acao === "aprovacao" && (
            <div className="pt-4 border-t space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Comentário (obrigatório ao reprovar)
                </label>
                <Textarea
                  placeholder="Descreva o que não está de acordo com esta ATA..."
                  value={reprovacaoComentario}
                  onChange={(e) => setReprovacaoComentario(e.target.value)}
                  className="mt-1 min-h-[80px] resize-none"
                  disabled={!!actionando}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCloseViewAta}>
                  Fechar
                </Button>
                <Button
                  variant="destructive"
                  disabled={!!actionando}
                  onClick={() => handleReprovar(viewAta)}
                >
                  {actionando === viewAta.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Reprovar
                </Button>
                <Button
                  disabled={!!actionando}
                  onClick={() => handleAprovar(viewAta)}
                >
                  {actionando === viewAta.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Aprovar
                </Button>
              </div>
            </div>
          )}
          {viewAta?.acao === "assinatura" && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleCloseViewAta}>
                Fechar
              </Button>
              <Button
                disabled={!!actionando}
                onClick={() => handleAssinar(viewAta)}
              >
                {actionando === viewAta.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <PenLine className="h-4 w-4 mr-2" />
                )}
                Assinar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemberAtasPendentes;
