import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GuiaLegacyButton from "@/components/GuiaLegacyButton";
import NotificationBell from "@/components/NotificationBell";
import { Shield, AlertTriangle, TrendingUp, RefreshCw, Loader2 } from "lucide-react";
import { useCurrentMembro } from "@/hooks/useCurrentMembro";
import { useInsightsEstrategicos } from "@/hooks/useInsightsEstrategicos";
import { InsightCard } from "@/components/copilot/InsightCard";

const MemberRiscos = () => {
  const { data: membro } = useCurrentMembro();
  const {
    riscos,
    ameacas,
    oportunidades,
    isLoading,
    error,
    hasEmpresa,
    refetch,
  } = useInsightsEstrategicos({
    empresaId: membro?.empresa_id ?? null,
    autoFetch: true,
  });

  const handleRefresh = () => {
    refetch();
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Gestão de Riscos</h1>
            <p className="text-sm text-muted-foreground">
              Riscos, ameaças e oportunidades identificados pela IA (replicados do Copiloto do ADM)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <GuiaLegacyButton />
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Atualizar
            </Button>
            <NotificationBell />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">Painel de Inteligência</h2>
        </div>

        {!hasEmpresa ? (
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Nenhuma empresa vinculada. Contacte o administrador.
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="pt-6 text-sm text-destructive">
              {error}
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : riscos.length === 0 && ameacas.length === 0 && oportunidades.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Não há insights disponíveis. O administrador pode gerar no Copiloto de Governança › Insights.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 border border-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                <span className="font-semibold text-red-800">Riscos Estratégicos</span>
                <Badge variant="secondary" className="ml-auto bg-red-200 text-red-800">
                  {riscos.length}
                </Badge>
              </div>
              <div className="space-y-4">
                {riscos.map((item) => (
                  <InsightCard key={item.id} item={item} borderColor="red" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 border border-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                <span className="font-semibold text-amber-800">Ameaças Operacionais</span>
                <Badge variant="secondary" className="ml-auto bg-amber-200 text-amber-800">
                  {ameacas.length}
                </Badge>
              </div>
              <div className="space-y-4">
                {ameacas.map((item) => (
                  <InsightCard key={item.id} item={item} borderColor="amber" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 border border-green-100">
                <TrendingUp className="h-5 w-5 text-green-600 shrink-0" />
                <span className="font-semibold text-green-800">Oportunidades Estratégicas</span>
                <Badge variant="secondary" className="ml-auto bg-green-200 text-green-800">
                  {oportunidades.length}
                </Badge>
              </div>
              <div className="space-y-4">
                {oportunidades.map((item) => (
                  <InsightCard key={item.id} item={item} borderColor="green" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MemberRiscos;
