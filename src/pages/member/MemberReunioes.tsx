import { Card, CardContent } from "@/components/ui/card";
import GuiaLegacyButton from "@/components/GuiaLegacyButton";
import NotificationBell from "@/components/NotificationBell";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fetchReunioes } from "@/services/agenda";
import { useCurrentMembro } from "@/hooks/useCurrentMembro";
import type { ReuniaoEnriquecida } from "@/types/agenda";

const MemberReunioes = () => {
  const { data: membro } = useCurrentMembro();
  const { data: reunioes = [] } = useQuery({
    queryKey: ["member", "reunioes", membro?.id, membro?.empresa_id],
    enabled: !!membro?.id && !!membro?.empresa_id,
    queryFn: async (): Promise<ReuniaoEnriquecida[]> => {
      if (!membro?.id || !membro.empresa_id || !supabase) return [];
      const { data: alocacoes } = await supabase
        .from("alocacoes_membros")
        .select("conselho_id, comite_id, comissao_id")
        .eq("membro_id", membro.id)
        .eq("ativo", true);
      const conselhoIds = new Set((alocacoes ?? []).map((a) => a.conselho_id).filter(Boolean));
      const comiteIds = new Set((alocacoes ?? []).map((a) => a.comite_id).filter(Boolean));
      const comissaoIds = new Set((alocacoes ?? []).map((a) => a.comissao_id).filter(Boolean));
      const { data } = await fetchReunioes(membro.empresa_id);
      return data
        .filter((r) =>
          (r.conselho_id && conselhoIds.has(r.conselho_id)) ||
          (r.comite_id && comiteIds.has(r.comite_id)) ||
          (r.comissao_id && comissaoIds.has(r.comissao_id))
        )
        .sort((a, b) => (a.data_reuniao ?? "").localeCompare(b.data_reuniao ?? ""));
    },
  });

  const futuras = useMemo(
    () => reunioes.filter((r) => !r.data_reuniao || new Date(r.data_reuniao) >= new Date()),
    [reunioes]
  );

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Próximas Reuniões</h1>
            <p className="text-sm text-muted-foreground">Reuniões agendadas para você</p>
          </div>
          <div className="flex items-center gap-2">
            <GuiaLegacyButton />
            <NotificationBell />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {futuras.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{r.titulo || r.conselho_nome || r.comite_nome || r.comissao_nome || "Reunião"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {r.data_reuniao ? format(new Date(r.data_reuniao), "dd/MM/yyyy", { locale: ptBR }) : "Data não definida"}
                    {" às "}
                    {r.horario ? String(r.horario).slice(0, 5) : "--:--"}
                    {" • "}
                    {r.tipo ?? "Ordinária"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          {futuras.length === 0 && (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Nenhuma reunião agendada para seus órgãos no momento.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default MemberReunioes;
