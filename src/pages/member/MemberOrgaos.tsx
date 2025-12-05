import { MemberLayout } from "@/components/member/MemberLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Calendar, Shield } from "lucide-react";

const mockMemberOrgans = [
  {
    id: 'organ-1',
    name: 'Conselho de Administração',
    type: 'Conselho',
    role: 'Conselheiro',
    membersCount: 5,
    nextMeeting: '10/12/2024 às 14:00',
    status: 'Ativo',
    description: 'Órgão responsável pela orientação geral dos negócios da empresa, definição de estratégias de longo prazo e supervisão da gestão.'
  },
  {
    id: 'organ-2',
    name: 'Comitê de Auditoria',
    type: 'Comitê',
    role: 'Membro',
    membersCount: 3,
    nextMeeting: '14/12/2024 às 09:00',
    status: 'Ativo',
    description: 'Comitê responsável por supervisionar os processos de auditoria interna e externa, gestão de riscos e controles internos.'
  }
];

const MemberOrgaos = () => {
  return (
    <MemberLayout 
      title="Meus Órgãos"
      subtitle="Órgãos de governança dos quais você participa"
    >
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Building2 className="h-7 w-7 text-blue-500" />
            Órgãos de Governança
            <Badge variant="secondary" className="ml-2 text-base px-3 py-1">
              {mockMemberOrgans.length} órgãos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {mockMemberOrgans.map((organ) => (
            <div 
              key={organ.id} 
              className="p-6 rounded-xl border-2 bg-card"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                <div className="flex items-start gap-5">
                  <div className="h-16 w-16 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold">{organ.name}</h3>
                      <Badge variant="outline" className="text-sm px-3 py-1">{organ.type}</Badge>
                      <Badge variant="secondary" className="text-sm px-3 py-1">{organ.status}</Badge>
                    </div>
                    <p className="text-base text-muted-foreground mt-2">{organ.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="text-base font-medium">{organ.role}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="text-base text-muted-foreground">{organ.membersCount} membros</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="text-base text-muted-foreground">Próxima: {organ.nextMeeting}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </MemberLayout>
  );
};

export default MemberOrgaos;
