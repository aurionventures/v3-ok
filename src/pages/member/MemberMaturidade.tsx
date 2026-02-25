import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NotificationBell from "@/components/NotificationBell";
import { BarChart3, ChevronRight } from "lucide-react";

const MemberMaturidade = () => {
  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Maturidade</h1>
            <p className="text-sm text-muted-foreground">Score de maturidade da governança</p>
          </div>
          <NotificationBell />
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
                  <p className="text-2xl font-bold text-gray-900">4.0/5.0</p>
                  <p className="text-sm text-muted-foreground">Ver análise completa</p>
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
