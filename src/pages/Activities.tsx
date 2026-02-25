import React, { useState, useMemo } from "react";
import {
  Send,
  Search,
  Clock,
  Cpu,
  CheckCircle,
  Eye,
  Sparkles,
  ClipboardList,
} from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  projetosParaVotacao,
  type ProjetoParaVotacao,
  type StatusProjeto,
  type PrioridadeProjeto,
} from "@/data/activitiesData";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: StatusProjeto }) {
  const config: Record<
    StatusProjeto,
    { label: string; className: string; icon: React.ReactNode }
  > = {
    "Aguardando Análise": {
      label: "Aguardando Análise",
      className: "bg-amber-100 text-amber-800 border-amber-200",
      icon: <Clock className="h-3.5 w-3.5" />,
    },
    "Analisado por IA": {
      label: "Analisado por IA",
      className: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <Cpu className="h-3.5 w-3.5" />,
    },
    Aprovado: {
      label: "Aprovado",
      className: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: <CheckCircle className="h-3.5 w-3.5" />,
    },
    Rejeitado: {
      label: "Rejeitado",
      className: "bg-red-100 text-red-800 border-red-200",
      icon: <Clock className="h-3.5 w-3.5" />,
    },
  };
  const { label, className, icon } = config[status];
  return (
    <Badge variant="outline" className={cn("gap-1", className)}>
      {icon}
      {label}
    </Badge>
  );
}

function PrioridadeBadge({ prioridade }: { prioridade: PrioridadeProjeto }) {
  const map: Record<PrioridadeProjeto, string> = {
    Alta: "bg-red-100 text-red-800 border-red-200",
    Média: "bg-amber-100 text-amber-800 border-amber-200",
    Baixa: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <Badge variant="outline" className={map[prioridade]}>
      {prioridade}
    </Badge>
  );
}

const ActivitiesPage = () => {
  const [busca, setBusca] = useState("");
  const [tab, setTab] = useState("votacao");

  const projetosFiltrados = useMemo(() => {
    const lista = tab === "votacao" ? projetosParaVotacao : [];
    if (!busca.trim()) return lista;
    const q = busca.toLowerCase();
    return lista.filter(
      (p) =>
        p.titulo.toLowerCase().includes(q) ||
        p.descricao.toLowerCase().includes(q) ||
        p.conselho.toLowerCase().includes(q) ||
        p.submetidoPor.toLowerCase().includes(q)
    );
  }, [busca, tab]);

  const handleSubmeterProjeto = () => {
    toast({
      title: "Submeter projeto",
      description: "Formulário de submissão será aberto em breve.",
    });
  };

  const handleVerDetalhes = (projeto: ProjetoParaVotacao) => {
    toast({
      title: "Detalhes do projeto",
      description: projeto.titulo,
    });
  };

  const handleEnriquecerIA = (projeto: ProjetoParaVotacao) => {
    toast({
      title: "Enriquecer com IA",
      description: `Análise IA para: ${projeto.titulo}`,
    });
  };

  const handleSubmeterVotacao = (projeto: ProjetoParaVotacao) => {
    toast({
      title: "Submeter à votação",
      description: projeto.titulo,
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Submeter Projetos" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-legacy-500">
              Submeter Projetos
            </h2>
            <p className="text-muted-foreground mt-1">
              Gerencie projetos para análise e votação dos conselhos
            </p>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="space-y-4">
            <TabsList className="bg-white border">
              <TabsTrigger value="votacao">Projetos para Votação</TabsTrigger>
              <TabsTrigger value="historico">Histórico de Projetos</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <Input
                placeholder="Buscar projetos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="max-w-sm"
              />
              <Button
                onClick={handleSubmeterProjeto}
                className="bg-legacy-500 hover:bg-legacy-600 text-white gap-2"
              >
                <Send className="h-4 w-4" />
                Submeter Projeto
              </Button>
            </div>

            <TabsContent value="votacao" className="mt-4">
              <div className="rounded-md border bg-white">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[28%]">Projeto</TableHead>
                      <TableHead>Conselho</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Análise IA</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projetosFiltrados.map((projeto) => (
                      <TableRow key={projeto.id}>
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="font-medium text-foreground">
                              {projeto.titulo}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {projeto.descricao}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Submetido por {projeto.submetidoPor} em{" "}
                              {projeto.dataSubmissao}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{projeto.conselho}</TableCell>
                        <TableCell>
                          <PrioridadeBadge prioridade={projeto.prioridade} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={projeto.status} />
                        </TableCell>
                        <TableCell>
                          {projeto.analiseIAProgresso != null ? (
                            <div className="space-y-1 min-w-[100px]">
                              <Progress value={projeto.analiseIAProgresso} />
                              <p className="text-xs text-muted-foreground">
                                Risco{" "}
                                {projeto.analiseIANivelRisco ?? "Não definido"}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Não analisado
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-wrap gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVerDetalhes(projeto)}
                              className="gap-1"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Ver Detalhes
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEnriquecerIA(projeto)}
                              className="gap-1"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                              Enriquecer com IA
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSubmeterVotacao(projeto)}
                              className="gap-1 bg-legacy-500 hover:bg-legacy-600"
                            >
                              <ClipboardList className="h-3.5 w-3.5" />
                              Submeter Votação
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {projetosFiltrados.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum projeto encontrado.
                </p>
              )}
            </TabsContent>

            <TabsContent value="historico" className="mt-4">
              <div className="rounded-md border bg-white p-6">
                <p className="text-muted-foreground text-center py-8">
                  Histórico de projetos submetidos e votados será exibido aqui.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;
