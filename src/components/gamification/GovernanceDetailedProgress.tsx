import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Shield, 
  Calendar, 
  TrendingUp, 
  FileText, 
  BarChart3, 
  Leaf, 
  AlertTriangle, 
  GraduationCap,
  Settings,
  PieChart,
  Bot,
  Cog,
  ArrowRight,
  CheckCircle,
  Clock,
  Database,
  Activity
} from "lucide-react";
import { useGovernanceProgress } from "@/hooks/useGovernanceProgress";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const iconMap = {
  Users,
  Shield,
  Calendar,
  TrendingUp,
  FileText,
  BarChart3,
  Leaf,
  AlertTriangle,
  GraduationCap,
  Settings,
  PieChart,
  Bot,
  Cog,
  Database,
  ActivitySquare: Activity,
  Play: Activity,
  Send: Activity,
  Landmark: Activity
};

export const GovernanceDetailedProgress = () => {
  const progress = useGovernanceProgress();
  const navigate = useNavigate();

  const handleModuleClick = (moduleId: string) => {
    const routeMap: Record<string, string> = {
      // PREPARAÇÃO
      'onboarding': '/onboarding',
      'document-checklist': '/document-checklist',
      'document-upload': '/document-upload',
      'interviews': '/interviews',
      'initial-report': '/initial-report',
      // FUNDAÇÃO
      'shareholder-structure': '/shareholder-structure',
      'documents': '/documents',
      'cap-table': '/cap-table',
      'maturity': '/maturity',
      // ESTRUTURAÇÃO
      'councils': '/councils',
      'rituals': '/rituals',
      'succession': '/succession',
      'submit-projects': '/submit-projects',
      // DESENVOLVIMENTO
      'people-development': '/people-development',
      'subsystems': '/subsystems',
      'legacy': '/legacy',
      // MONITORAMENTO
      'ibgc-risk-management': '/ibgc-risk-management',
      'esg': '/esg',
      'activities': '/activities',
      // CONFIGURAÇÃO
      'ai-config': '/ai-config',
      'settings': '/settings'
    };

    const route = routeMap[moduleId];
    if (route) {
      navigate(route);
    } else {
      toast("Esta funcionalidade estará disponível em breve");
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-emerald-500";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 50) return "bg-amber-500";
    if (percentage >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const sortedModules = [...progress.modules].sort((a, b) => {
    // Completed modules go to bottom
    if (a.isCompleted && !b.isCompleted) return 1;
    if (!a.isCompleted && b.isCompleted) return -1;
    
    // Sort by urgency (high first), then by completion percentage (low first)
    const urgencyOrder = { high: 0, medium: 1, low: 2 };
    if (urgencyOrder[a.urgency as keyof typeof urgencyOrder] !== urgencyOrder[b.urgency as keyof typeof urgencyOrder]) {
      return urgencyOrder[a.urgency as keyof typeof urgencyOrder] - urgencyOrder[b.urgency as keyof typeof urgencyOrder];
    }
    
    return a.completionPercentage - b.completionPercentage;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Progresso Detalhado por Módulo</span>
          <Badge variant="secondary">
            {progress.completedModules}/{progress.totalModules} completos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedModules.map((module) => {
          const IconComponent = iconMap[module.icon as keyof typeof iconMap] || FileText; // Fallback icon
          
          return (
            <div 
              key={module.id}
              className={`p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
                module.isCompleted 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-card border-border hover:border-primary/30'
              }`}
              onClick={() => handleModuleClick(module.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    module.isCompleted 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {module.isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : IconComponent ? (
                      <IconComponent className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      {module.name}
                      {module.isCompleted && (
                        <Badge variant="secondary" className="text-xs">
                          Completo
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!module.isCompleted && (
                    <Badge variant={getUrgencyColor(module.urgency)} className="text-xs">
                      {module.urgency === 'high' && 'Urgente'}
                      {module.urgency === 'medium' && 'Médio'}
                      {module.urgency === 'low' && 'Baixo'}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {module.completionPercentage}%
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Progress 
                  value={module.completionPercentage} 
                  className={`h-2 ${getProgressColor(module.completionPercentage)}`}
                />
                
                {!module.isCompleted && module.nextActions.length > 0 && (
                  <div className="bg-muted/50 rounded p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">
                        Próximas ações:
                      </span>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {module.nextActions.slice(0, 2).map((action, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Peso: {module.weight}%</span>
                  <span>
                    Valor estimado: R$ {(module.estimatedValue / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};