import { Calculator, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SimuladorCenarios() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="relative inline-block mb-6">
            <Calculator className="h-16 w-16 text-muted-foreground" />
            <div className="absolute -top-1 -right-1 bg-amber-100 rounded-full p-1">
              <Lock className="h-4 w-4 text-amber-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Simulador de Cenários</h1>
          
          <Badge variant="outline" className="mb-4 bg-amber-50 text-amber-700 border-amber-200">
            <Lock className="h-3 w-3 mr-1" />
            Módulo Premium
          </Badge>
          
          <p className="text-muted-foreground mb-4">
            Em breve: Simule cenários estratégicos com IA
          </p>
          
          <div className="text-sm text-muted-foreground/70">
            Funcionalidade em desenvolvimento
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
