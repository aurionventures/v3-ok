import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import GuiaLegacyButton from "@/components/GuiaLegacyButton";
import NotificationBell from "@/components/NotificationBell";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  BarChart3,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import MemberBriefing from "./MemberBriefing";
import MemberCopiloto from "./MemberCopiloto";
import { useCurrentMembro } from "@/hooks/useCurrentMembro";
import { useMaturidadeScore } from "@/hooks/useMaturidadeScore";
import { fetchReunioes } from "@/services/agenda";
import { fetchAtasPendentesMembro } from "@/services/ataAprovacoes";
import { supabase } from "@/lib/supabase";

function responsavelCoincideComMembro(responsavel: string, nomeMembro: string): boolean {
  const r = (responsavel ?? "").trim().toLowerCase();
  const n = (nomeMembro ?? "").trim().toLowerCase();
  if (!r || !n) return false;
  return r.includes(n) || n.includes(r) || n.split(/\s+/)[0] === r || r.split(/\s+/)[0] === n;
}

const MemberDashboard = () => {
  const { data: membro } = useCurrentMembro();
  const { score: maturidadeScore, fullMark: maturidadeFullMark, isLoading: maturidadeLoading } = useMaturidadeScore();

  const { data: dashboard } = useQuery({
    queryKey: ["member", "dashboard", membro?.id, membro?.empresa_id, membro?.nome],
    enabled: !!membro?.id && !!membro?.empresa_id,
    queryFn: async () => {
      if (!membro?.id || !membro.empresa_id || !supabase) return null;

      const todasReunioes = await fetchReunioes(membro.empresa_id);
      const { data: alocacoes } = await supabase
        .from("alocacoes_membros")
        .select("conselho_id, comite_id, comissao_id")
        .eq("membro_id", membro.id)
        .eq("ativo", true);
      const conselhoIds = new Set((alocacoes ?? []).map((a) => a.conselho_id).filter(Boolean));
      const comiteIds = new Set((alocacoes ?? []).map((a) => a.comite_id).filter(Boolean));
      const comissaoIds = new Set((alocacoes ?? []).map((a) => a.comissao_id).filter(Boolean));
      const temAlocacao = conselhoIds.size > 0 || comiteIds.size > 0 || comissaoIds.size > 0;

      const reunioes =
        temAlocacao
          ? todasReunioes.filter(
              (r) =>
                (r.conselho_id && conselhoIds.has(r.conselho_id)) ||
                (r.comite_id && comiteIds.has(r.comite_id)) ||
                (r.comissao_id && comissaoIds.has(r.comissao_id)) ||
                (!r.conselho_id && !r.comite_id && !r.comissao_id)
            )
          : todasReunioes;

      const proximas = reunioes
        .filter((r) => r.data_reuniao && new Date(r.data_reuniao) >= new Date())
        .sort((a, b) => (a.data_reuniao ?? "").localeCompare(b.data_reuniao ?? ""));
      const proxima = proximas[0] ?? null;
      const reuniaoIds = reunioes.map((r) => r.id);

      const { data: atasPendentes } = await fetchAtasPendentesMembro(membro.id);

      let tarefasPendentes = 0;
      if (reuniaoIds.length > 0) {
        const { data: tarefas } = await supabase
          .from("reuniao_tarefas")
          .select("id, responsavel")
          .in("reuniao_id", reuniaoIds)
          .is("data_conclusao", null);
        tarefasPendentes = (tarefas ?? []).filter((t) =>
          responsavelCoincideComMembro(t.responsavel ?? "", membro.nome ?? "")
        ).length;
      }

      return {
        proxima,
        reunioesCount: proximas.length,
        atasPendentes: atasPendentes.length,
        tarefasPendentes,
      };
    },
  });

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Bem-vindo, {membro?.nome ?? "Membro"}</h1>
            <p className="text-sm text-muted-foreground">Portal do Membro de Governança</p>
          </div>
          <div className="flex items-center gap-2">
            <GuiaLegacyButton />
            <NotificationBell />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <Card className="mb-6 bg-legacy-500 border-legacy-600 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Próxima Reunião</h2>
                  <p className="text-white/90 text-sm">
                    {dashboard?.proxima?.data_reuniao
                      ? format(new Date(dashboard.proxima.data_reuniao), "EEEE, dd 'de' MMMM", { locale: ptBR })
                      : "Sem reunião agendada"}
                    {dashboard?.proxima?.horario ? ` às ${String(dashboard.proxima.horario).slice(0, 5)}` : ""}
                  </p>
                  <p className="text-white/80 text-sm">
                    {dashboard?.proxima?.titulo ?? dashboard?.proxima?.conselho_nome ?? dashboard?.proxima?.comite_nome ?? dashboard?.proxima?.comissao_nome ?? "—"}
                  </p>
                  <div className="mt-3">
                    <p className="text-xs text-white/80 mb-1">Progresso do Briefing</p>
                    <Progress value={45} className="h-2 bg-white/20" />
                  </div>
                </div>
              </div>
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <p className="font-semibold">{dashboard?.reunioesCount ?? 0}</p>
                  <p className="text-white/80">reuniões futuras</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">45%</p>
                  <p className="text-white/80">preparação</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-muted p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background">
              <LayoutDashboard className="h-4 w-4 mr-2" /> Visão Geral
            </TabsTrigger>
            <TabsTrigger value="briefing">
              <FileText className="h-4 w-4 mr-2" /> Meu Briefing
            </TabsTrigger>
            <TabsTrigger value="copiloto">
              <LayoutDashboard className="h-4 w-4 mr-2" /> Copiloto IA
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/member/maturidade">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Maturidade</h3>
                        <p className="text-2xl font-bold text-gray-900">
                          {maturidadeLoading ? "--" : maturidadeScore != null ? `${maturidadeScore.toFixed(1)}/${maturidadeFullMark}` : "--"}
                        </p>
                        <p className="text-sm text-muted-foreground">Ver análise completa</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>

              <Link to="/member/reunioes">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Próximas Reuniões</h3>
                        <p className="text-sm text-gray-600">{dashboard?.reunioesCount ?? 0} reuniões agendadas</p>
                        <p className="text-sm text-muted-foreground">
                          Próxima: {dashboard?.proxima?.data_reuniao ? format(new Date(dashboard.proxima.data_reuniao), "dd/MM", { locale: ptBR }) : "--/--"}
                          {dashboard?.proxima?.horario ? ` às ${String(dashboard.proxima.horario).slice(0, 5)}` : ""}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>

              <Link to="/member/atas-pendentes">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center relative">
                        <FileText className="h-6 w-6 text-orange-600" />
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">{dashboard?.atasPendentes ?? 0}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">ATAs Pendentes</h3>
                        <p className="text-sm text-gray-600">{dashboard?.atasPendentes ?? 0} aguardando sua ação</p>
                        <p className="text-sm text-red-600 font-medium">Priorize as mais recentes</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>

              <Link to="/member/pendencias">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center relative">
                        <ClipboardList className="h-6 w-6 text-amber-600" />
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-500 text-white text-xs flex items-center justify-center font-medium">{dashboard?.tarefasPendentes ?? 0}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Tarefas Pendentes</h3>
                        <p className="text-sm text-gray-600">{dashboard?.tarefasPendentes ?? 0} tarefas pendentes</p>
                        <p className="text-sm text-red-600 font-medium">Acompanhe prazos e status</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="briefing">
            <MemberBriefing />
          </TabsContent>

          <TabsContent value="copiloto">
            <MemberCopiloto />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default MemberDashboard;
