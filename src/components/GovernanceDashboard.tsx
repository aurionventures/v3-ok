import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Shield, TrendingUp } from "lucide-react";
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
    
    // Shareholding concentration
    const shareholders = members.filter(m => m.governance_category === "shareholders");
    const familyOwnership = shareholders
      .filter(m => m.is_family_member)
      .reduce((sum, m) => sum + (m.shareholding_percentage || 0), 0);
    const externalOwnership = 100 - familyOwnership;
    
    return {
      total,
      activeMembers,
      familyMembers,
      generations,
      boardMembers: boardMembers.length,
      independentDirectors,
      executiveDirectors,
      familyOwnership: Math.round(familyOwnership * 10) / 10,
      externalOwnership: Math.round(externalOwnership * 10) / 10,
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

    </div>
  );
}
