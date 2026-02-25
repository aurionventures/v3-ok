import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import NotificationBell from "@/components/NotificationBell";
import { Award, CheckCircle2, Target, Star, ThumbsUp, Sparkles } from "lucide-react";

const DIMENSOES = [
  { nome: "Presença", valor: 85, media: 78 },
  { nome: "Contribuição", valor: 88, media: 75 },
  { nome: "Liderança", valor: 75, media: 72 },
  { nome: "Colaboração", valor: 90, media: 80 },
  { nome: "Visão Estratégica", valor: 80, media: 77 },
  { nome: "Comunicação", valor: 78, media: 74 },
];

const MemberDesempenho = () => {
  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Award className="h-5 w-5" /> Meu Desempenho
            </h1>
            <p className="text-sm text-muted-foreground">Avaliação 360° e Autoavaliação</p>
          </div>
          <NotificationBell />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5" /> Avaliações 360°
            </h3>
            <div className="flex flex-wrap items-center gap-8">
              <div>
                <p className="text-4xl font-bold">82</p>
                <p className="text-muted-foreground">/100</p>
                <Badge className="mt-2 bg-blue-100 text-blue-800">Excelente</Badge>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50">
                <span className="text-2xl font-bold text-green-600">+5pts</span>
                <p className="text-xs text-muted-foreground">vs avaliação anterior</p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Última Avaliação</p>
                <p>Dezembro 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5" /> Autoavaliação Rápida
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Realize sua autoavaliação para comparar com a avaliação 360° e identificar gaps de percepção
            </p>
            <Button className="w-full sm:w-auto">
              <Sparkles className="h-4 w-4 mr-2" /> Iniciar Autoavaliação
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Target className="h-5 w-5" /> Análise por Dimensão
              </h3>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg mb-4">
                <p className="text-sm text-muted-foreground">Gráfico de radar (Você vs Média do Conselho)</p>
              </div>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-primary" /> Você
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-muted-foreground/50" /> Média do Conselho
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Star className="h-5 w-5" /> Detalhamento por Dimensão
              </h3>
              <div className="space-y-4">
                {DIMENSOES.map((d) => (
                  <div key={d.nome}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{d.nome}</span>
                      <span>{d.valor} (média: {d.media})</span>
                    </div>
                    <Progress value={(d.valor / 100) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <ThumbsUp className="h-5 w-5 text-green-600" /> Pontos Fortes
              </h3>
              <ul className="space-y-2 text-sm text-green-800 list-disc pl-4">
                <li>Excelente capacidade de síntese e análise crítica</li>
                <li>Boa comunicação com pares e gestão</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-orange-600" /> Oportunidades de Melhoria
              </h3>
              <ul className="space-y-2 text-sm text-orange-800 list-disc pl-4">
                <li>Poderia participar mais ativamente das reuniões de comitês</li>
                <li>Aprimorar pontualidade na entrega de pareceres</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MemberDesempenho;
