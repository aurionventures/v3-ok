import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMeetings } from '@/hooks/useMeetings';
import { ReuniaoResumo } from '@/components/reunioes/ReuniaoResumo';
import { ReuniaoPautas } from '@/components/reunioes/ReuniaoPautas';
import { ReuniaoPendencias } from '@/components/reunioes/ReuniaoPendencias';
import { ReuniaoParticipantes } from '@/components/reunioes/ReuniaoParticipantes';

const ReuniaoDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMeeting } = useMeetings();
  const [meeting, setMeeting] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeeting = async () => {
      if (!id) return;
      
      setLoading(true);
      const data = await getMeeting(id);
      setMeeting(data);
      setLoading(false);
    };

    loadMeeting();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Reunião não encontrada.</p>
          <Button onClick={() => navigate('/reunioes')} className="mt-4">
            Voltar para Reuniões
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/reunioes')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{meeting.title}</h1>
          <p className="text-muted-foreground">Detalhes e gestão da reunião</p>
        </div>
      </div>

      <Tabs defaultValue="resumo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="pautas">Pautas</TabsTrigger>
          <TabsTrigger value="pendencias">Pendências</TabsTrigger>
          <TabsTrigger value="participantes">Participantes</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo">
          <ReuniaoResumo meeting={meeting} />
        </TabsContent>

        <TabsContent value="pautas">
          <ReuniaoPautas meetingId={meeting.id} />
        </TabsContent>

        <TabsContent value="pendencias">
          <ReuniaoPendencias meetingId={meeting.id} />
        </TabsContent>

        <TabsContent value="participantes">
          <ReuniaoParticipantes meetingId={meeting.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReuniaoDetalhes;
