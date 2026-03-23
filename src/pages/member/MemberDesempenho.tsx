import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NotificationBell from "@/components/NotificationBell";
import { useQuery } from "@tanstack/react-query";
import { Award, CheckCircle2, Target } from "lucide-react";
import { useCurrentMembro } from "@/hooks/useCurrentMembro";
import { fetchAtasPendentesMembro } from "@/services/ataAprovacoes";
import { fetchReunioes } from "@/services/agenda";
import { supabase } from "@/lib/supabase";

const MemberDesempenho = () => {
  const { data: membro } = useCurrentMembro();
  const { data: stats } = useQuery({
    queryKey: ["member", "desempenho", membro?.id, membro?.empresa_id],
    enabled: !!membro?.id && !!membro?.empresa_id,
    queryFn: async () => {
      if (!membro?.id || !membro.empresa_id || !supabase) return null;
      const { data: atas } = await fetchAtasPendentesMembro(membro.id);
      const { data: tarefas } = await supabase
        .from("reuniao_tarefas")
        .select("id, data_conclusao")
        .ilike("responsavel", membro.nome);
      const { data: reunioes } = await fetchReunioes(membro.empresa_id);
      const totalTarefas = (tarefas ?? []).length;
      const concluidas = (tarefas ?? []).filter((t) => !!t.data_conclusao).length;
      const taxa = totalTarefas > 0 ? Math.round((concluidas / totalTarefas) * 100) : 0;
      return {
        atasPendentes: atas.length,
        totalTarefas,
        concluidas,
        taxa,
        reunioesNoAno: reunioes.length,
      };
    },
  });

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Award className="h-5 w-5" /> Meu Desempenho
            </h1>
            <p className="text-sm text-muted-foreground">Avaliação 360° e Autoavaliação</p>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5" /> Avaliações 360°
            </h3>
            <div className="flex flex-wrap items-center gap-8">
              <div>
                <p className="text-4xl font-bold">{stats?.taxa ?? 0}</p>
                <p className="text-muted-foreground">/100</p>
                <Badge className="mt-2 bg-blue-100 text-blue-800">Baseado em entregas reais</Badge>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50">
                <span className="text-2xl font-bold text-green-600">{stats?.concluidas ?? 0}</span>
                <p className="text-xs text-muted-foreground">tarefas concluídas</p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Última Avaliação</p>
                <p>Dados em tempo real</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5" /> Indicadores de Participação
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">ATAs pendentes</p>
                <p className="text-2xl font-semibold">{stats?.atasPendentes ?? 0}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Tarefas totais</p>
                <p className="text-2xl font-semibold">{stats?.totalTarefas ?? 0}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Reuniões no ano</p>
                <p className="text-2xl font-semibold">{stats?.reunioesNoAno ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Target className="h-5 w-5" /> Evolução de Desempenho
            </h3>
            <p className="text-sm text-muted-foreground">
              A visão detalhada 360° será exibida automaticamente quando houver dados avaliativos cadastrados para seu perfil.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MemberDesempenho;
