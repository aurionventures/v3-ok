import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import GuiaLegacyButton from "@/components/GuiaLegacyButton";
import NotificationBell from "@/components/NotificationBell";
import { BarChart3, ChevronRight, Loader2 } from "lucide-react";
import { useMaturidadeScore } from "@/hooks/useMaturidadeScore";

const MemberMaturidade = () => {
  const { score, fullMark, isLoading } = useMaturidadeScore();

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Maturidade</h1>
            <p className="text-sm text-muted-foreground">Score de maturidade da governança</p>
          </div>
          <div className="flex items-center gap-2">
            <GuiaLegacyButton />
            <NotificationBell />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <Link to="/member/dashboard">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Score atual</h3>
                  {isLoading ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                      <span className="text-sm text-muted-foreground">Carregando...</span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {score !== null ? `${score}/${fullMark}` : "—"}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {score !== null ? "Ver análise completa" : "Aguardando diagnóstico do ADM"}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
};

export default MemberMaturidade;
