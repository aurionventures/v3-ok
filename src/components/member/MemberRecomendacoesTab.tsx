import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  BookOpen, 
  Brain, 
  ExternalLink, 
  Clock, 
  Star,
  Play,
  Sparkles,
  MessageSquare,
  Lightbulb,
  TrendingUp
} from "lucide-react";

// Mock recommendations data
const mockRecommendations = {
  courses: [
    {
      id: 1,
      title: "Governança Corporativa Avançada",
      provider: "IBGC",
      duration: "40 horas",
      priority: "Alta",
      relevance: "Baseado na sua meta de aprofundar conhecimento em governança",
      rating: 4.8,
      enrolled: false,
      link: "#"
    },
    {
      id: 2,
      title: "ESG para Conselheiros",
      provider: "FDC",
      duration: "24 horas",
      priority: "Alta",
      relevance: "Alinhado com sua meta de desenvolvimento em ESG",
      rating: 4.6,
      enrolled: true,
      progress: 35,
      link: "#"
    },
    {
      id: 3,
      title: "Gestão de Riscos Corporativos",
      provider: "Insper",
      duration: "32 horas",
      priority: "Média",
      relevance: "Recomendado para fortalecer sua atuação no comitê de riscos",
      rating: 4.7,
      enrolled: false,
      link: "#"
    },
    {
      id: 4,
      title: "Liderança em Tempos de Transformação",
      provider: "Stanford Online",
      duration: "20 horas",
      priority: "Média",
      relevance: "Para desenvolver competências de liderança estratégica",
      rating: 4.9,
      enrolled: false,
      link: "#"
    }
  ],
  readings: [
    {
      id: 1,
      title: "Código de Melhores Práticas de Governança Corporativa",
      author: "IBGC",
      type: "Manual",
      pages: 120,
      priority: "Alta",
      excerpt: "Referência fundamental para conselheiros. Atualização 2024 com novas diretrizes de ESG."
    },
    {
      id: 2,
      title: "The Board Game: How Smart Women Become Corporate Directors",
      author: "Betsy Berkhemer-Credaire",
      type: "Livro",
      pages: 280,
      priority: "Média",
      excerpt: "Insights práticos sobre como maximizar seu impacto como conselheiro."
    },
    {
      id: 3,
      title: "Relatório de Tendências em Governança 2026",
      author: "McKinsey & Company",
      type: "Relatório",
      pages: 45,
      priority: "Alta",
      excerpt: "Análise das principais tendências e desafios para conselhos em 2026."
    },
    {
      id: 4,
      title: "ESG e Valor de Longo Prazo",
      author: "Harvard Business Review",
      type: "Artigo",
      pages: 12,
      priority: "Média",
      excerpt: "Como integrar fatores ESG na estratégia corporativa de forma efetiva."
    }
  ],
  copilotPractices: [
    {
      id: 1,
      title: "Análise de Riscos Estratégicos",
      description: "Use o Copiloto para explorar cenários de risco antes das reuniões. Pergunte sobre tendências setoriais e ameaças emergentes.",
      prompt: "Quais são os principais riscos estratégicos para empresas do nosso setor em 2026?",
      frequency: "Antes de cada reunião"
    },
    {
      id: 2,
      title: "Preparação para Pautas",
      description: "Peça ao Copiloto para resumir documentos e destacar pontos-chave de cada pauta.",
      prompt: "Resuma os principais pontos da pauta sobre [tema] e sugira perguntas críticas.",
      frequency: "Antes de cada reunião"
    },
    {
      id: 3,
      title: "Benchmarking de Práticas",
      description: "Compare práticas da empresa com benchmarks do mercado usando o Copiloto.",
      prompt: "Como nossa política de [área] se compara com as melhores práticas do mercado?",
      frequency: "Mensal"
    },
    {
      id: 4,
      title: "Análise de Decisões Anteriores",
      description: "Revise decisões passadas e seus impactos para informar novas deliberações.",
      prompt: "Quais foram as principais decisões do conselho sobre [tema] nos últimos 2 anos?",
      frequency: "Conforme necessário"
    }
  ]
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Alta": return "bg-red-100 text-red-700 border-red-200";
    case "Média": return "bg-amber-100 text-amber-700 border-amber-200";
    case "Baixa": return "bg-green-100 text-green-700 border-green-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export function MemberRecomendacoesTab() {
  return (
    <div className="space-y-8">
      {/* Courses Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">Cursos Recomendados</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockRecommendations.courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{course.title}</h4>
                      <Badge variant="outline" className={getPriorityColor(course.priority)}>
                        {course.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{course.provider}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {course.rating}
                      </span>
                    </div>
                    <p className="text-xs text-primary/80 italic">{course.relevance}</p>
                  </div>
                </div>
                
                {course.enrolled ? (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progresso</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      <Play className="h-3 w-3 mr-1" />
                      Continuar
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Ver Curso
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Readings Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">Leituras Sugeridas</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockRecommendations.readings.map((reading) => (
            <Card key={reading.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm line-clamp-2">{reading.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{reading.author}</p>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="text-xs">{reading.type}</Badge>
                      <span className="text-xs text-muted-foreground">{reading.pages} páginas</span>
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(reading.priority)}`}>
                        {reading.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{reading.excerpt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Copilot Practices Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">Práticas com IA Copiloto</h3>
        </div>
        
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 mb-4">
          <CardContent className="p-4 flex items-center gap-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">Maximize seu uso do Copiloto de Governança</p>
              <p className="text-sm text-muted-foreground">
                Estas práticas foram personalizadas com base no seu perfil e metas de desenvolvimento.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {mockRecommendations.copilotPractices.map((practice) => (
            <Card key={practice.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{practice.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {practice.frequency}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{practice.description}</p>
                    <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm italic">"{practice.prompt}"</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TrendingUp className="h-10 w-10" />
            <div>
              <h4 className="font-bold text-lg">Acompanhe seu Progresso</h4>
              <p className="text-white/80">
                Complete cursos e leituras para melhorar seu score de desenvolvimento.
              </p>
            </div>
          </div>
          <Button variant="secondary" size="lg">
            Ver Meu PDI
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default MemberRecomendacoesTab;
