import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MemberLayout } from "@/components/member/MemberLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarDays, 
  FileText, 
  AlertTriangle, 
  ChevronRight,
  BarChart3,
  Brain,
  Calendar
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BriefingPreview } from "@/components/member/BriefingPreview";
import { CopilotChat } from "@/components/member/CopilotChat";
import { useMemberBriefing, useUpcomingMeetings } from "@/hooks/useMockCopilot";

// Mock data for dashboard counts
const mockCounts = {
  meetings: 3,
  nextMeetingDate: "10/12 às 14:00",
  pendingATAs: 2,
  urgentATAs: 1,
  pendingTasks: 3,
  overdueTasks: 1,
  organs: 2,
  maturityScore: "4.0/5.0",
  totalRisks: 6,
  criticalRisks: 3
};

const MemberDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const { meetings, nextMeeting } = useUpcomingMeetings();
  const { briefing, markAsRead, updateProgress } = useMemberBriefing("member-1", nextMeeting?.id);

  const daysUntilMeeting = nextMeeting 
    ? differenceInDays(new Date(nextMeeting.date), new Date())
    : null;

  const tiles = [
    {
      id: 'maturidade',
      path: '/member-portal/maturidade',
      icon: BarChart3,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
      title: 'Maturidade',
      subtitle: `Score: ${mockCounts.maturityScore}`,
      detail: 'Ver análise completa',
      badge: null
    },
    {
      id: 'reunioes',
      path: '/member-portal/reunioes',
      icon: CalendarDays,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      title: 'Próximas Reuniões',
      subtitle: `${mockCounts.meetings} reuniões agendadas`,
      detail: `Próxima: ${mockCounts.nextMeetingDate}`,
      badge: null
    },
    {
      id: 'atas',
      path: '/member-portal/atas',
      icon: FileText,
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-500',
      title: 'ATAs Pendentes',
      subtitle: `${mockCounts.pendingATAs} aguardando sua ação`,
      detail: mockCounts.urgentATAs > 0 ? `${mockCounts.urgentATAs} urgente` : null,
      badge: mockCounts.pendingATAs,
      badgeVariant: 'destructive' as const
    },
    {
      id: 'pendencias',
      path: '/member-portal/pendencias',
      icon: AlertTriangle,
      iconBg: 'bg-yellow-500/10',
      iconColor: 'text-yellow-500',
      title: 'Tarefas Pendentes',
      subtitle: `${mockCounts.pendingTasks} tarefas pendentes`,
      detail: mockCounts.overdueTasks > 0 ? `${mockCounts.overdueTasks} atrasada` : null,
      badge: mockCounts.pendingTasks,
      badgeVariant: 'secondary' as const
    }
  ];

  return (
    <MemberLayout 
      title={`Bem-vindo, ${user?.name?.split(' ')[0] || 'Conselheiro'}`}
      subtitle="Portal do Membro de Governança"
    >
      <div className="space-y-6">
        {/* Hero Section - Next Meeting */}
        {nextMeeting && (
          <Card className="bg-[#1a2942] text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-1">Próxima Reunião</h2>
                    <p className="text-white/80">
                      {format(new Date(nextMeeting.date), "EEEE, dd 'de' MMMM", { locale: ptBR })} às {nextMeeting.time}
                    </p>
                    <p className="text-sm text-white/60">{nextMeeting.councilName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{daysUntilMeeting}</div>
                    <div className="text-xs text-white/80">
                      {daysUntilMeeting === 1 ? 'dia restante' : 'dias restantes'}
                    </div>
                  </div>
                  
                  {briefing && (
                    <div className="text-center border-l border-white/20 pl-4">
                      <div className="text-3xl font-bold">{briefing.preparationProgress}%</div>
                      <div className="text-xs text-white/80">preparação</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Progress Bar */}
              {briefing && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-white/80 mb-1">
                    <span>Progresso do Briefing</span>
                    <span>{briefing.preparationProgress}%</span>
                  </div>
                  <Progress value={briefing.preparationProgress} className="h-2 bg-white/20" />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="briefing" className="gap-2">
              <FileText className="h-4 w-4" />
              Meu Briefing
            </TabsTrigger>
            <TabsTrigger value="copilot" className="gap-2">
              <Brain className="h-4 w-4" />
              Copiloto IA
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {tiles.map((tile) => (
                <Link key={tile.id} to={tile.path} className="block">
                  <Card className="h-[180px] p-6 hover:bg-accent/50 transition-all active:scale-[0.98] cursor-pointer border-2 hover:border-primary/30">
                    <div className="flex items-center gap-5">
                      {/* Icon Container */}
                      <div className={`h-16 w-16 rounded-xl ${tile.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <tile.icon className={`h-10 w-10 ${tile.iconColor}`} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-2xl font-bold truncate">{tile.title}</h3>
                          {tile.badge && (
                            <Badge variant={tile.badgeVariant} className="text-base px-3 py-1">
                              {tile.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-lg text-muted-foreground truncate">{tile.subtitle}</p>
                        {tile.detail && (
                          <p className={`text-base mt-1 truncate ${
                            tile.id === 'atas' || tile.id === 'pendencias' || tile.id === 'riscos'
                              ? 'text-red-500 font-medium' 
                              : 'text-muted-foreground'
                          }`}>
                            {tile.detail}
                          </p>
                        )}
                      </div>
                      
                      {/* Arrow */}
                      <ChevronRight className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          {/* Briefing Tab */}

          </TabsContent>

          {/* Copilot Tab */}
          <TabsContent value="copilot" className="m-0">
            <CopilotChat meetingId={nextMeeting?.id} />
          </TabsContent>
        </Tabs>
      </div>
    </MemberLayout>
  );
};

export default MemberDashboard;
