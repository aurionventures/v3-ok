import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, Trash2, TrendingUp, TrendingDown, Minus, Leaf, Users, Shield, Target } from 'lucide-react';
import { ESGAssessmentHistory } from '@/types/esgMaturity';
import { loadESGAssessmentHistory } from '@/utils/esgMaturityCalculator';
import { toast } from '@/hooks/use-toast';

interface ESGHistoryModalProps {
  onSelectAssessment?: (assessment: ESGAssessmentHistory) => void;
}

const ESGHistoryModal: React.FC<ESGHistoryModalProps> = ({ onSelectAssessment }) => {
  const [history, setHistory] = React.useState<ESGAssessmentHistory[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const assessmentHistory = loadESGAssessmentHistory();
      setHistory(assessmentHistory);
    }
  }, [isOpen]);

  const deleteAssessment = (id: string) => {
    const updatedHistory = history.filter(assessment => assessment.id !== id);
    localStorage.setItem('esg_assessment_history', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
    toast({
      title: "Avaliação excluída",
      description: "A avaliação foi removida do histórico.",
    });
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getPillarIcon = (pillarKey: string) => {
    switch (pillarKey) {
      case 'environmental':
        return <Leaf className="h-4 w-4 text-green-600" />;
      case 'social':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'governance':
        return <Shield className="h-4 w-4 text-purple-600" />;
      case 'strategy':
        return <Target className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <History className="h-5 w-5 mr-2" />
          Ver Histórico
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Avaliações ESG</DialogTitle>
          <DialogDescription>
            Visualize suas avaliações anteriores e acompanhe a evolução da maturidade ESG
          </DialogDescription>
        </DialogHeader>
        
        {history.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma avaliação encontrada no histórico.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((assessment, index) => {
              const previousAssessment = history[index + 1];
              return (
                <Card key={assessment.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Avaliação #{history.length - index}
                        </CardTitle>
                        <CardDescription>
                          {formatDate(assessment.timestamp)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${assessment.result.maturityLevel.color} text-white`}>
                          Nível {assessment.result.maturityLevel.level}: {assessment.result.maturityLevel.name}
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
                          {assessment.result.overallScore.toFixed(1)}
                          {previousAssessment && getTrendIcon(
                            assessment.result.overallScore,
                            previousAssessment.result.overallScore
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Score Geral</p>
                      </div>
                      
                      {Object.entries(assessment.result.pillarScores).map(([key, pillar]) => {
                        const previousPillar = previousAssessment?.result.pillarScores[key as keyof typeof assessment.result.pillarScores];
                        return (
                          <div key={key} className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              {getPillarIcon(key)}
                            </div>
                            <div className="text-lg font-semibold flex items-center justify-center gap-1">
                              {pillar.score.toFixed(1)}
                              {previousPillar && getTrendIcon(pillar.score, previousPillar.score)}
                            </div>
                            <p className="text-xs text-gray-600">{pillar.title}</p>
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

export default ESGHistoryModal;