import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Shield, AlertTriangle, TrendingUp, Calendar } from "lucide-react";
import { useMemo } from "react";

interface CorporateMember {
  id: string;
  name?: string;
  governance_category?: string;
  governance_subcategory?: string;
  official_qualification_code?: string;
  specific_role?: string;
  shareholding_percentage?: number;
  is_independent?: boolean;
  is_family_member?: boolean;
  generation?: string;
  term_end_date?: string;
  status?: string;
}

interface GovernanceDashboardProps {
  members: CorporateMember[];
}

export function GovernanceDashboard({ members }: GovernanceDashboardProps) {
  const metrics = useMemo(() => {
    const total = members.length;
    const activeMembers = members.filter(m => m.status === "Ativo").length;
    
    // Family structure
    const familyMembers = members.filter(m => m.is_family_member).length;
    const generations = new Set(members.filter(m => m.generation).map(m => m.generation)).size;
    
    // Board composition
    const boardMembers = members.filter(m => m.governance_category === "board");
    const independentDirectors = boardMembers.filter(m => m.is_independent).length;
    const executiveDirectors = boardMembers.filter(m => !m.is_independent).length;
    
    // Executive team
    const executives = members.filter(m => m.governance_category === "executive");
    const president = executives.find(m => 
      m.official_qualification_code === "16" || 
      m.specific_role?.toLowerCase().includes("presidente")
    );
    
    // Shareholding concentration
    const shareholders = members.filter(m => m.governance_category === "shareholders");
    const familyOwnership = shareholders
      .filter(m => m.is_family_member)
      .reduce((sum, m) => sum + (m.shareholding_percentage || 0), 0);
    const externalOwnership = 100 - familyOwnership;
    
    // Expiring mandates (next 90 days)
    const today = new Date();
    const ninetyDaysFromNow = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
    const expiringMandates = members.filter(m => {
      if (!m.term_end_date) return false;
      const endDate = new Date(m.term_end_date);
      return endDate > today && endDate <= ninetyDaysFromNow;
    }).length;
    
    // RFB Compliance
    const withRFBCode = members.filter(m => m.official_qualification_code).length;
    const rfbCompliance = total > 0 ? Math.round((withRFBCode / total) * 100) : 0;
    
    return {
      total,
      activeMembers,
      familyMembers,
      generations,
      boardMembers: boardMembers.length,
      independentDirectors,
      executiveDirectors,
      executives: executives.length,
      president: president?.name || "Não definido",
      familyOwnership: Math.round(familyOwnership * 10) / 10,
      externalOwnership: Math.round(externalOwnership * 10) / 10,
      expiringMandates,
      rfbCompliance,
    };
  }, [members]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      {/* Total Members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.total}</div>
          <p className="text-xs text-muted-foreground">
            {metrics.activeMembers} ativos
          </p>
        </CardContent>
      </Card>

      {/* Family Structure */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estrutura Familiar</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.familyMembers}</div>
          <p className="text-xs text-muted-foreground">
            {metrics.generations} gerações representadas
          </p>
        </CardContent>
      </Card>

      {/* Board Composition */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conselheiros</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.boardMembers}</div>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {metrics.independentDirectors} independentes
            </Badge>
            <Badge variant="outline" className="text-xs">
              {metrics.executiveDirectors} executivos
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Executive Team */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Diretoria Executiva</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.executives}</div>
          <p className="text-xs text-muted-foreground">
            Presidente: {metrics.president}
          </p>
        </CardContent>
      </Card>

      {/* Ownership Concentration */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Concentração de Capital</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Família:</span>
              <span className="font-bold">{metrics.familyOwnership}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Externos:</span>
              <span className="font-bold">{metrics.externalOwnership}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance & Alerts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conformidade</CardTitle>
          {metrics.expiringMandates > 0 ? (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          ) : (
            <Calendar className="h-4 w-4 text-green-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">RFB atualizado:</span>
              <Badge variant={metrics.rfbCompliance === 100 ? "default" : "secondary"}>
                {metrics.rfbCompliance}%
              </Badge>
            </div>
            {metrics.expiringMandates > 0 && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-yellow-600">
                  {metrics.expiringMandates} mandato(s) vencendo
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
