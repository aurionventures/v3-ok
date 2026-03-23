import { Card, CardContent } from "@/components/ui/card";
import GuiaLegacyButton from "@/components/GuiaLegacyButton";
import NotificationBell from "@/components/NotificationBell";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fetchReunioes } from "@/services/agenda";
import { useCurrentMembro } from "@/hooks/useCurrentMembro";

const MemberPautas = () => {
  const { data: membro } = useCurrentMembro();
  const { data: pautas = [] } = useQuery({
    queryKey: ["member", "pautas", membro?.id, membro?.empresa_id],
    enabled: !!membro?.id && !!membro?.empresa_id,
    queryFn: async (): Promise<Array<{ id: string; titulo: string; data: string | null }>> => {
      if (!membro?.id || !membro.empresa_id || !supabase) return [];
      const { data: alocacoes } = await supabase
        .from("alocacoes_membros")
        .select("conselho_id, comite_id, comissao_id")
        .eq("membro_id", membro.id)
        .eq("ativo", true);
      const conselhoIds = new Set((alocacoes ?? []).map((a) => a.conselho_id).filter(Boolean));
      const comiteIds = new Set((alocacoes ?? []).map((a) => a.comite_id).filter(Boolean));
      const comissaoIds = new Set((alocacoes ?? []).map((a) => a.comissao_id).filter(Boolean));

      const { data: reunioes } = await fetchReunioes(membro.empresa_id);
      const reunioesMembro = reunioes.filter((r) => {
        const isVirtual = !r.conselho_id && !r.comite_id && !r.comissao_id;
        if (isVirtual) {
          const vt = (r as { virtual_tipo?: string | null }).virtual_tipo;
          if (!vt) return true; // Legacy: virtual sem tipo → todos os membros
          if (vt === "conselho") return conselhoIds.size > 0;
          if (vt === "comite") return comiteIds.size > 0;
          if (vt === "comissao") return comissaoIds.size > 0;
          return false;
        }
        return (
          (r.conselho_id && conselhoIds.has(r.conselho_id)) ||
          (r.comite_id && comiteIds.has(r.comite_id)) ||
          (r.comissao_id && comissaoIds.has(r.comissao_id))
        );
      });
      const reuniaoIds = reunioesMembro.map((r) => r.id);
      if (reuniaoIds.length === 0) return [];

      const { data: rows } = await supabase
        .from("pautas")
        .select("id, titulo, reuniao_id")
        .in("reuniao_id", reuniaoIds)
        .order("created_at", { ascending: false });
      const reuniaoMap = new Map(reunioesMembro.map((r) => [r.id, r]));
      return (rows ?? []).map((p) => ({
        id: p.id,
        titulo: p.titulo,
        data: reuniaoMap.get(p.reuniao_id)?.data_reuniao ?? null,
      }));
    },
  });

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Pautas Virtuais</h1>
            <p className="text-sm text-muted-foreground">Pautas das reuniões disponíveis</p>
          </div>
          <div className="flex items-center gap-2">
            <GuiaLegacyButton />
            <NotificationBell />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {pautas.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{p.titulo}</h3>
                  <p className="text-sm text-muted-foreground">
                    Disponível em {p.data ? format(new Date(p.data), "dd/MM/yyyy", { locale: ptBR }) : "data não definida"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          {pautas.length === 0 && (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Nenhuma pauta disponível para seus órgãos.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default MemberPautas;
