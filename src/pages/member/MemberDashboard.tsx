import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MemberLayout } from "@/components/member/MemberLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  FileText, 
  AlertTriangle, 
  Building2,
  ChevronRight,
  BarChart3,
  Shield
} from "lucide-react";

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
      id: 'riscos',
      path: '/member-portal/riscos',
      icon: Shield,
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-500',
      title: 'Riscos',
      subtitle: `${mockCounts.totalRisks} riscos mapeados`,
      detail: `${mockCounts.criticalRisks} críticos`,
      badge: mockCounts.criticalRisks,
      badgeVariant: 'destructive' as const
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
    },
    {
      id: 'orgaos',
      path: '/member-portal/orgaos',
      icon: Building2,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      title: 'Meus Conselhos',
      subtitle: `${mockCounts.organs} órgãos de governança`,
      detail: 'Conselho de Administração +1',
      badge: null
    }
  ];

  return (
    <MemberLayout 
      title={`Bem-vindo, ${user?.name?.split(' ')[0]}`}
      subtitle="Portal do Membro de Governança"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((tile) => (
          <Link key={tile.id} to={tile.path} className="block">
            <Card className="h-[150px] p-5 hover:bg-accent/50 transition-all active:scale-[0.98] cursor-pointer border-2 hover:border-primary/30">
              <div className="flex items-center gap-4">
                {/* Icon Container */}
                <div className={`h-14 w-14 rounded-xl ${tile.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <tile.icon className={`h-8 w-8 ${tile.iconColor}`} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold truncate">{tile.title}</h3>
                    {tile.badge && (
                      <Badge variant={tile.badgeVariant} className="text-sm px-2 py-0.5">
                        {tile.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{tile.subtitle}</p>
                  {tile.detail && (
                    <p className={`text-xs mt-1 truncate ${
                      tile.id === 'atas' || tile.id === 'pendencias' || tile.id === 'riscos'
                        ? 'text-red-500 font-medium' 
                        : 'text-muted-foreground'
                    }`}>
                      {tile.detail}
                    </p>
                  )}
                </div>
                
                {/* Arrow */}
                <ChevronRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </MemberLayout>
  );
};

export default MemberDashboard;
