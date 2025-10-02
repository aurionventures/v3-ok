import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Zap,
  TrendingUp,
  Target
} from "lucide-react";
import { useGovernanceProgress } from "@/hooks/useGovernanceProgress";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const GovernanceAlerts = () => {
  const progress = useGovernanceProgress();
  const navigate = useNavigate();

  const urgentModules = progress.modules
    .filter(module => !module.isCompleted && module.urgency === 'high')
    .sort((a, b) => a.completionPercentage - b.completionPercentage);

  const quickWins = progress.modules
    .filter(module => !module.isCompleted && module.completionPercentage >= 70)
    .sort((a, b) => b.completionPercentage - a.completionPercentage);

  const handleModuleClick = (moduleId: string) => {
    const routeMap: Record<string, string> = {
      'shareholder-structure': '/shareholder-structure',
      'councils': '/councils',
      'rituals': '/rituals',
      'succession': '/succession',
      'documents': '/documents',
      'maturity': '/maturity',
      'esg': '/esg',
      'systemic-risks': '/systemic-risks',
      'people-development': '/people-development',
      'subsystems': '/subsystems',
      'cap-table': '/cap-table',
      'ai-config': '/ai-config',
      'settings': '/settings'
    };

    const route = routeMap[moduleId];
    if (route) {
      navigate(route);
    } else {
      toast({
        title: "Redirecionamento",
        description: "Esta funcionalidade estará disponível em breve",
      });
    }
  };

  if (progress.overallPercentage >= 90) {
    return (
      <Alert className="border-emerald-200 bg-emerald-50">
        <CheckCircle className="h-4 w-4 text-emerald-600" />
        <AlertDescription className="text-emerald-800">
          <strong>Parabéns!</strong> Sua governança está quase completa! Você está no caminho certo para a excelência.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      {/* Urgent Actions */}
      {urgentModules.length > 0 && (
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="font-medium text-sm text-amber-800">Ações Urgentes</span>
          </div>
          <div className="space-y-2">
            {urgentModules.slice(0, 1).map((module) => (
              <div key={module.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-amber-900">
                      {module.name}
                    </span>
                    <Badge variant="destructive" className="text-xs px-1 py-0">
                      {module.completionPercentage}%
                    </Badge>
                  </div>
                  <p className="text-xs text-amber-700">
                    {module.nextActions[0]}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-2 h-6 w-6 p-0 border-amber-500 text-amber-700 hover:bg-amber-100"
                  onClick={() => handleModuleClick(module.id)}
                >
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Wins */}
      {quickWins.length > 0 && (
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm text-blue-800">Vitórias Rápidas</span>
          </div>
          <div className="space-y-2">
            {quickWins.slice(0, 1).map((module) => (
              <div key={module.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-blue-900">
                      {module.name}
                    </span>
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      Quase completo!
                    </Badge>
                  </div>
                  <p className="text-xs text-blue-700">
                    Aumente seu score rapidamente
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-2 h-6 w-6 p-0 border-blue-500 text-blue-700 hover:bg-blue-100"
                  onClick={() => handleModuleClick(module.id)}
                >
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Recommendations */}
      {progress.nextRecommendations.length > 0 && (
        <div className="border border-primary/20 bg-primary/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm text-primary">Próximos Passos</span>
          </div>
          <div className="space-y-1">
            {progress.nextRecommendations.slice(0, 2).map((recommendation, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                <span className="text-primary/80">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Message */}
      {progress.overallPercentage < 50 && (
        <Alert className="border-purple-200 bg-purple-50 p-3">
          <TrendingUp className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800 text-xs">
            <strong>Continue assim!</strong> Empresas com boa governança têm valorização 25% superior.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};