import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Target, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Award,
  TrendingUp,
  ChevronRight,
  Flag
} from "lucide-react";
import { useState } from "react";

// Mock PDI data
const mockPDIData = {
  overallProgress: 65,
  currentCycle: "2025-2026",
  goals: [
    {
      id: 1,
      title: "Aprofundar conhecimento em ESG",
      description: "Desenvolver expertise em questões ambientais, sociais e de governança para contribuir de forma mais efetiva nas discussões do conselho.",
      category: "Conhecimento Técnico",
      priority: "Alta",
      progress: 75,
      deadline: "Jun 2026",
      actions: [
        { id: 1, text: "Concluir curso de ESG para Conselheiros (FDC)", completed: true },
        { id: 2, text: "Participar de 2 eventos sobre sustentabilidade corporativa", completed: true },
        { id: 3, text: "Ler 3 relatórios de referência sobre práticas ESG", completed: false },
        { id: 4, text: "Liderar discussão sobre ESG em reunião do conselho", completed: false },
      ]
    },
    {
      id: 2,
      title: "Fortalecer atuação em gestão de riscos",
      description: "Desenvolver visão mais abrangente sobre riscos corporativos e participar ativamente do comitê de riscos.",
      category: "Competência Estratégica",
      priority: "Média",
      progress: 50,
      deadline: "Dez 2026",
      actions: [
        { id: 5, text: "Participar de todas as reuniões do Comitê de Riscos", completed: true },
        { id: 6, text: "Estudar metodologia COSO ERM", completed: true },
        { id: 7, text: "Propor melhorias no mapa de riscos da empresa", completed: false },
        { id: 8, text: "Avaliar implementação de risk appetite framework", completed: false },
      ]
    },
    {
      id: 3,
      title: "Aumentar engajamento com stakeholders",
      description: "Desenvolver maior proximidade com executivos e outros stakeholders da organização.",
      category: "Relacionamento",
      priority: "Média",
      progress: 60,
      deadline: "Mar 2026",
      actions: [
        { id: 9, text: "Participar de 4 reuniões one-on-one com diretores", completed: true },
        { id: 10, text: "Visitar 2 unidades operacionais da empresa", completed: true },
        { id: 11, text: "Conhecer principais clientes e fornecedores", completed: false },
      ]
    }
  ],
  achievements: [
    { title: "Certificação IBGC", date: "Ago 2025", icon: "🏆" },
    { title: "100% de presença em reuniões", date: "2025", icon: "⭐" },
    { title: "Mentor de novo conselheiro", date: "Out 2025", icon: "🎯" },
  ]
};

export function MemberPDITab() {
  const [expandedGoal, setExpandedGoal] = useState<number | null>(1);
  const [checkedActions, setCheckedActions] = useState<number[]>(
    mockPDIData.goals.flatMap(g => g.actions.filter(a => a.completed).map(a => a.id))
  );

  const toggleAction = (actionId: number) => {
    setCheckedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-red-100 text-red-700 border-red-200";
      case "Média": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Baixa": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Progresso do PDI</p>
                <p className="text-4xl font-bold text-primary">{mockPDIData.overallProgress}%</p>
                <p className="text-sm text-muted-foreground">Ciclo {mockPDIData.currentCycle}</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-full">
                <Target className="h-10 w-10 text-primary" />
              </div>
            </div>
            <Progress value={mockPDIData.overallProgress} className="h-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conquistas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockPDIData.achievements.map((achievement, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Development Goals */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Flag className="h-5 w-5 text-primary" />
          Metas de Desenvolvimento
        </h3>

        {mockPDIData.goals.map((goal) => (
          <Card key={goal.id} className="overflow-hidden">
            <div 
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{goal.title}</h4>
                    <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{goal.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary">{goal.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Prazo: {goal.deadline}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{goal.progress}%</div>
                    <Progress value={goal.progress} className="h-2 w-24" />
                  </div>
                  <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${
                    expandedGoal === goal.id ? 'rotate-90' : ''
                  }`} />
                </div>
              </div>
            </div>

            {expandedGoal === goal.id && (
              <div className="border-t bg-muted/30 p-4">
                <p className="text-sm font-medium mb-3">Ações para esta meta:</p>
                <div className="space-y-3">
                  {goal.actions.map((action) => (
                    <div 
                      key={action.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-background transition-colors"
                    >
                      <Checkbox
                        id={`action-${action.id}`}
                        checked={checkedActions.includes(action.id)}
                        onCheckedChange={() => toggleAction(action.id)}
                      />
                      <label 
                        htmlFor={`action-${action.id}`}
                        className={`text-sm cursor-pointer flex-1 ${
                          checkedActions.includes(action.id) 
                            ? 'line-through text-muted-foreground' 
                            : ''
                        }`}
                      >
                        {action.text}
                      </label>
                      {checkedActions.includes(action.id) && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{mockPDIData.goals.length}</p>
            <p className="text-sm text-muted-foreground">Metas Ativas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">
              {checkedActions.length}
            </p>
            <p className="text-sm text-muted-foreground">Ações Concluídas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-amber-600" />
            <p className="text-2xl font-bold">
              {mockPDIData.goals.flatMap(g => g.actions).length - checkedActions.length}
            </p>
            <p className="text-sm text-muted-foreground">Ações Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold">{mockPDIData.achievements.length}</p>
            <p className="text-sm text-muted-foreground">Conquistas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MemberPDITab;
