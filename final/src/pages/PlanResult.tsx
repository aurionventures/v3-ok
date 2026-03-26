import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Crown, 
  ArrowRight, 
  Sparkles,
  Building2,
  Users,
  Shield,
  BarChart3
} from 'lucide-react';
import { getRecommendedPlan, PLAN_DATA } from '@/utils/planRecommendation';
import legacyLogo from "@/assets/legacy-logo-new.png";
import { WhatsAppButton } from '@/components/WhatsAppButton';

export default function PlanResult() {
  const navigate = useNavigate();
  const [planId, setPlanId] = useState<string>('media');
  const [quizData, setQuizData] = useState<any>(null);

  useEffect(() => {
    const quizResult = localStorage.getItem('quiz_result');
    if (quizResult) {
      const data = JSON.parse(quizResult);
      setQuizData(data);
      
      // Calculate recommended plan
      const recommended = getRecommendedPlan({
        faturamentoFaixa: data.faturamentoFaixa,
        temConselho: data.temConselho,
        temSucessao: data.temSucessao,
        avaliacaoRiscosEsg: data.avaliacaoRiscosEsg,
        numeroColaboradores: 'ate_20'
      });
      setPlanId(recommended);
    }
  }, []);

  const plan = PLAN_DATA[planId] || PLAN_DATA['media'];
  
  const getIconForFeature = (index: number) => {
    const icons = [Building2, Users, Shield, BarChart3, Sparkles, Crown];
    const Icon = icons[index % icons.length];
    return <Icon className="h-4 w-4 text-primary" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <img src={legacyLogo} alt="Legacy" className="h-10 mx-auto mb-4" />
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full mb-4">
            <Check className="h-5 w-5" />
            <span className="font-medium">Análise Concluída!</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            O plano ideal para {quizData?.empresaNome || 'sua empresa'}
          </h1>
          <p className="text-base text-muted-foreground">
            Com base nas suas respostas, recomendamos:
          </p>
        </div>

        {/* Plan Card */}
        <Card className="border-2 border-primary shadow-lg mb-6">
          <CardHeader className="text-center pb-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="mb-2">Recomendado</Badge>
            <CardTitle className="text-2xl md:text-3xl">{plan.nome}</CardTitle>
            <p className="text-muted-foreground text-base">{plan.descricao}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price */}
            <div className="text-center py-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">A partir de</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-primary">
                  R$ {plan.precoMensal.toLocaleString('pt-BR')}
                </span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <p className="font-medium text-sm text-muted-foreground">INCLUSO NO PLANO:</p>
              <ul className="space-y-2">
                {plan.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {getIconForFeature(index)}
                    </div>
                    <span className="text-base">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => navigate('/checkout')}
            >
              Contratar Este Plano
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        {/* Secondary actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline"
            onClick={() => navigate('/plan-discovery')}
          >
            Refazer Quiz
          </Button>
          <WhatsAppButton variant="outline" />
          <Button 
            variant="ghost"
            onClick={() => navigate('/')}
          >
            Ver Todos os Planos
          </Button>
        </div>
      </div>
    </div>
  );
}
