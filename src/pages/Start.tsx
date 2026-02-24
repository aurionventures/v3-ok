import { useNavigate } from "react-router-dom";
import { Play, Target, BookOpen, Users, FileText, BarChart3, ChevronRight, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { GovernanceDetailedProgress } from "@/components/gamification/GovernanceDetailedProgress";
import { useGovernanceProgress } from "@/hooks/useGovernanceProgress";

const Start = () => {
  const navigate = useNavigate();
  const governanceProgress = useGovernanceProgress();

  const quickActions = [
    {
      title: "Avaliar Maturidade",
      description: "Comece medindo o nível atual de governança",
      icon: <BarChart3 className="h-6 w-6" />,
      href: "/maturity",
      priority: true
    },
    {
      title: "Cadastrar Família",
      description: "Mapeie a estrutura familiar",
      icon: <Users className="h-6 w-6" />,
      href: "/family-structure",
      priority: true
    },
    {
      title: "Documentos Básicos",
      description: "Configure documentos essenciais",
      icon: <FileText className="h-6 w-6" />,
      href: "/documents",
      priority: false
    },
    {
      title: "Ver Dashboard",
      description: "Acesse métricas e relatórios",
      icon: <Target className="h-6 w-6" />,
      href: "/dashboard",
      priority: false
    }
  ];

  const guideCards = [
    {
      title: "Como Começar",
      description: "Guia passo a passo para configurar sua governança familiar",
      icon: <Play className="h-5 w-5" />,
      action: "Ver Guia"
    },
    {
      title: "Boas Práticas",
      description: "Aprenda as melhores práticas de governança familiar",
      icon: <Award className="h-5 w-5" />,
      action: "Explorar"
    },
    {
      title: "Central de Ajuda",
      description: "Encontre respostas para suas dúvidas",
      icon: <BookOpen className="h-5 w-5" />,
      action: "Acessar"
    }
  ];

  const handleQuickAction = (href: string) => {
    navigate(href);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Comece Aqui" />
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Welcome Section */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-legacy-500 to-legacy-600 text-white border-0">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Target className="h-8 w-8" />
                      <h1 className="text-3xl font-bold">Bem-vindo ao Legacy</h1>
                    </div>
                    <p className="text-xl text-white/90 max-w-2xl">
                      Sua plataforma completa para estruturar e gerenciar a governança familiar.
                      Configure seu sistema passo a passo e fortaleça o legado da sua família.
                    </p>
                  </div>
                  <div className="hidden lg:block">
                    <div className="text-right space-y-2">
                      <div className="text-4xl font-bold">{governanceProgress.overallPercentage}%</div>
                      <div className="text-white/90">Progresso Geral</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="space-y-3">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-legacy-500">
                      {governanceProgress.completedModules}/{governanceProgress.totalModules}
                    </div>
                    <div className="text-sm text-gray-500">Módulos Completos</div>
                  </div>
                  <Progress value={governanceProgress.overallPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="space-y-3">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-legacy-500">
                      R$ {governanceProgress.estimatedTotalValue.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-sm text-gray-500">Valor Estimado</div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Em crescimento
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="space-y-3">
                  <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <Target className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-legacy-500">
                      {governanceProgress.nextRecommendations?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Próximas Ações</div>
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    Pendente
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-legacy-500">
                <Play className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`h-auto p-4 flex flex-col items-start gap-3 hover:bg-gray-50 ${
                      action.priority ? 'border-orange-300 bg-orange-50' : ''
                    }`}
                    onClick={() => handleQuickAction(action.href)}
                  >
                    <div className="flex items-center justify-between w-full">
                      {action.icon}
                      {action.priority && (
                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-700 text-xs">
                          !
                        </Badge>
                      )}
                    </div>
                    <div className="text-left space-y-1">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Progress Section */}
          <div className="mb-8">
            <GovernanceDetailedProgress />
          </div>

          {/* Guide Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-legacy-500">
                <BookOpen className="h-5 w-5" />
                Guias e Documentação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {guideCards.map((guide, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-legacy-100 rounded-lg flex items-center justify-center">
                        {guide.icon}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-medium text-legacy-500">{guide.title}</h3>
                        <p className="text-sm text-gray-600">{guide.description}</p>
                        <Button variant="ghost" size="sm" className="p-0 h-auto text-legacy-purple-500">
                          {guide.action} <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Start;