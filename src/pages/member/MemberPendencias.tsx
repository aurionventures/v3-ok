import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NotificationBell from "@/components/NotificationBell";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ClipboardList, CheckCircle, Loader2, ChevronRight } from "lucide-react";
import { useMemberPendencias, type Pendencia } from "@/hooks/useMemberPendencias";
import { useToast } from "@/hooks/use-toast";
import { concluirTarefa } from "@/services/gestaoReuniao";

const MemberPendencias = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [detalheAberto, setDetalheAberto] = useState<Pendencia | null>(null);
  const [resolvendoId, setResolvendoId] = useState<string | null>(null);

  const { data: pendencias = [], isLoading: carregando } = useMemberPendencias();

  const total = pendencias.length;
  const urgentes = useMemo(() => pendencias.filter((p) => p.prazo && new Date(p.prazo) <= new Date()).length, [pendencias]);

  const handleResolver = async (p: Pendencia) => {
    setResolvendoId(p.tarefaId);
    const { error } = await concluirTarefa(p.tarefaId);
    setResolvendoId(null);
    if (error) {
      toast({ title: "Erro ao resolver", description: error, variant: "destructive" });
      return;
    }
    setDetalheAberto(null);
    toast({ title: "Tarefa resolvida", description: "A tarefa foi marcada como concluída." });
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["member", "pendencias"] }),
      queryClient.invalidateQueries({ queryKey: ["member", "dashboard"] }),
      queryClient.invalidateQueries({ queryKey: ["secretariado", "indicadores"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard", "indicadores"] }),
      queryClient.invalidateQueries({ queryKey: ["secretariado", "tarefas", "pendentes"] }),
    ]);
  };

  const [resolvendoTodas, setResolvendoTodas] = useState(false);
  const handleResolverTodas = async () => {
    if (pendencias.length === 0) return;
    setResolvendoTodas(true);
    let ok = 0;
    let erros = 0;
    for (const p of pendencias) {
      const { error } = await concluirTarefa(p.tarefaId);
      if (error) erros++; else ok++;
    }
    setResolvendoTodas(false);
    setDetalheAberto(null);
    if (erros > 0) {
      toast({ title: "Parcialmente concluído", description: `${ok} resolvida(s), ${erros} erro(s).`, variant: "destructive" });
    } else {
      toast({ title: "Todas resolvidas", description: `${ok} tarefa(s) marcada(s) como concluída(s).` });
    }
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["member", "pendencias"] }),
      queryClient.invalidateQueries({ queryKey: ["member", "dashboard"] }),
      queryClient.invalidateQueries({ queryKey: ["secretariado", "indicadores"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard", "indicadores"] }),
      queryClient.invalidateQueries({ queryKey: ["secretariado", "tarefas", "pendentes"] }),
    ]);
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <ClipboardList className="h-5 w-5" /> Minhas Pendências
            </h1>
            <p className="text-sm text-muted-foreground">Tarefas atribuídas a você</p>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center relative">
                  <ClipboardList className="h-6 w-6 text-amber-600" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-500 text-white text-xs flex items-center justify-center font-medium">
                    {total}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">Tarefas Pendentes</h3>
                  <p className="text-sm text-gray-600">{total} tarefas pendentes</p>
                  <p className="text-sm text-red-600 font-medium">Acompanhe prazos e status</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  disabled={total === 0 || resolvendoTodas}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResolverTodas();
                  }}
                >
                  {resolvendoTodas ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  {resolvendoTodas
                    ? "Resolvendo..."
                    : total === 1
                      ? "Resolver pendência"
                      : "Resolver pendências"}
                </Button>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>
        {carregando ? (
          <div className="py-12 flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Carregando...
          </div>
        ) : pendencias.length === 0 ? null : (
          <div className="space-y-4">
            {pendencias.map((t) => (
              <Card
                key={t.id}
                className="border bg-card cursor-pointer transition-colors hover:bg-muted/30"
                onClick={() => setDetalheAberto(t)}
              >
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{t.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t.origem} • Prazo: {t.prazo ? new Date(t.prazo).toLocaleDateString("pt-BR") : "Não definido"}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      Tarefa e Combinado
                    </Badge>
                  </div>
                  <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResolver(t);
                      }}
                      disabled={resolvendoId === t.tarefaId}
                    >
                      {resolvendoId === t.tarefaId ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      {resolvendoId === t.tarefaId ? "Concluindo..." : "Concluir"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {urgentes > 0 && pendencias.length > 0 && (
          <p className="text-sm text-red-600 mt-4">{urgentes} pendência(s) urgente(s).</p>
        )}
      </div>

      <Dialog open={!!detalheAberto} onOpenChange={(open) => !open && setDetalheAberto(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Descrição da atividade</DialogTitle>
          </DialogHeader>
          {detalheAberto && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 text-sm">
                <p className="font-medium text-foreground">{detalheAberto.title}</p>
                <p className="mt-2 text-muted-foreground">
                  <span className="font-medium">Prazo:</span>{" "}
                  {detalheAberto.prazo
                    ? new Date(detalheAberto.prazo).toLocaleDateString("pt-BR")
                    : "Não definido"}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Origem:</span> {detalheAberto.origem}
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleResolver(detalheAberto)}
                  disabled={resolvendoId === detalheAberto.tarefaId}
                >
                  {resolvendoId === detalheAberto.tarefaId ? (
                    "Concluindo..."
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" /> Concluir
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setDetalheAberto(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemberPendencias;
