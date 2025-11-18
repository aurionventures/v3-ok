import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Info } from 'lucide-react';

interface ReuniaoParticipantesProps {
  meetingId: string;
}

export const ReuniaoParticipantes = ({ meetingId }: ReuniaoParticipantesProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Participantes</h2>
          <p className="text-muted-foreground">Gerencie membros e convidados da reunião</p>
        </div>
        <Button disabled>
          <UserPlus className="h-4 w-4 mr-2" />
          Adicionar Participante
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Funcionalidade em Desenvolvimento
          </CardTitle>
          <CardDescription>
            Esta funcionalidade estará disponível na Sprint 2
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-dashed p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Gestão de Participantes</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Em breve você poderá:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
              <li>• Adicionar membros internos e convidados externos</li>
              <li>• Gerar links seguros de acesso para convidados</li>
              <li>• Controlar visibilidade de pautas por participante</li>
              <li>• Gerenciar permissões de upload de documentos</li>
            </ul>
            <Badge variant="outline" className="mt-4">Sprint 2</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
