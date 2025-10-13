import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getMaturityHistory } from '@/utils/maturityStorage';
import { toast } from '@/hooks/use-toast';

interface IGBCHistoryModalProps {
  onSelectAssessment?: (assessment: any) => void;
}

const IGBCHistoryModal: React.FC<IGBCHistoryModalProps> = ({ onSelectAssessment }) => {
  const [history, setHistory] = React.useState<any[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const assessmentHistory = getMaturityHistory();
      setHistory(assessmentHistory);
    }
  }, [isOpen]);

  const deleteAssessment = (id: string) => {
    const updatedHistory = history.filter(assessment => assessment.id !== id);
    localStorage.setItem('maturity_history', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
    toast({
      title: "Avaliação excluída",
      description: "A avaliação IGBC foi removida do histórico.",
    });
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMaturityLevelInfo = (score: number) => {
    if (score >= 4.5) return { name: "Excelente", color: "bg-green-500", level: 5 };
    if (score >= 3.5) return { name: "Bom", color: "bg-blue-500", level: 4 };
    if (score >= 2.5) return { name: "Regular", color: "bg-yellow-500", level: 3 };
    if (score >= 1.5) return { name: "Fraco", color: "bg-orange-500", level: 2 };
    return { name: "Muito Fraco", color: "bg-red-500", level: 1 };
  };

  const getMainDimensions = (result: any) => {
    const dimensionNames = {
      'estrutura_formal': 'Estrutura',
      'processos_decisorios': 'Processos',
      'participacao_proprietarios': 'Participação',
      'sucessao': 'Sucessão',
      'prestacao_contas': 'Prestação',
      'cultura_governanca': 'Cultura'
    };

    return Object.entries(result.pontuacao_dimensoes || {})
      .slice(0, 4)
      .map(([key, score]) => ({
        name: dimensionNames[key as keyof typeof dimensionNames] || key,
        score: score as number
      }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="h-4 w-4 mr-2" />
          Ver Histórico
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Avaliações IGBC</DialogTitle>
          <DialogDescription>
            Visualize suas avaliações anteriores e acompanhe a evolução da maturidade de governança
          </DialogDescription>
        </DialogHeader>
        
        {history.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma avaliação IGBC encontrada no histórico.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((assessment, index) => {
              const previousAssessment = history[index + 1];
              const maturityInfo = getMaturityLevelInfo(assessment.result.pontuacao_total);
              const mainDimensions = getMainDimensions(assessment.result);
              
              return (
                <Card key={assessment.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Avaliação IGBC #{history.length - index}
                        </CardTitle>
                        <CardDescription>
                          {formatDate(assessment.timestamp)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${maturityInfo.color} text-white`}>
                          {assessment.result.estagio || maturityInfo.name}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAssessment(assessment.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                          {assessment.result.pontuacao_total.toFixed(1)}
                          {previousAssessment && getTrendIcon(
                            assessment.result.pontuacao_total,
                            previousAssessment.result.pontuacao_total
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Score Geral</p>
                      </div>
                      
                      {mainDimensions.map((dimension) => {
                        const previousDimension = previousAssessment?.result.pontuacao_dimensoes?.[dimension.name];
                        return (
                          <div key={dimension.name} className="text-center">
                            <div className="text-lg font-semibold flex items-center justify-center gap-1">
                              {dimension.score.toFixed(1)}
                              {previousDimension && getTrendIcon(dimension.score, previousDimension)}
                            </div>
                            <p className="text-xs text-gray-600">{dimension.name}</p>
                          </div>
                        );
                      })}
                    </div>
                    
                    {onSelectAssessment && (
                      <div className="mt-4 pt-4 border-t">
                        <Button
                          onClick={() => {
                            onSelectAssessment(assessment);
                            setIsOpen(false);
                          }}
                          className="w-full"
                        >
                          Visualizar Detalhes
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IGBCHistoryModal;