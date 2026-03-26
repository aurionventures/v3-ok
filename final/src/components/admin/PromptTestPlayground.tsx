import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Play, Loader2, Clock, Zap, DollarSign, Star } from 'lucide-react';
import { toast } from 'sonner';
import { usePrompts } from '@/hooks/usePrompts';

interface PromptTestPlaygroundProps {
  open: boolean;
  onClose: () => void;
  promptId: string;
}

interface TestResult {
  output: any;
  latency_ms: number;
  tokens_used: number;
  cost_usd: number;
  success: boolean;
}

export function PromptTestPlayground({ open, onClose, promptId }: PromptTestPlaygroundProps) {
  const [testInput, setTestInput] = useState('{\n  "company_name": "Acme Corp",\n  "sector": "Technology",\n  "context": "Q4 2025 board meeting preparation"\n}');
  const [testContext, setTestContext] = useState('');
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [qualityScore, setQualityScore] = useState<number | null>(null);

  const { prompts } = usePrompts();
  const prompt = prompts?.find(p => p.id === promptId);

  const runTest = async () => {
    setIsRunning(true);
    setError(null);
    setResult(null);
    setQualityScore(null);

    try {
      // Parse test input
      let parsedInput;
      try {
        parsedInput = JSON.parse(testInput);
      } catch (e) {
        throw new Error('Input JSON inválido. Verifique a sintaxe.');
      }

      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock response based on prompt category
      const mockOutput = generateMockOutput(prompt?.category || '', parsedInput);
      
      const mockResult: TestResult = {
        output: mockOutput,
        latency_ms: 1500 + Math.floor(Math.random() * 1500),
        tokens_used: 2000 + Math.floor(Math.random() * 2000),
        cost_usd: 0.01 + Math.random() * 0.02,
        success: true
      };

      setResult(mockResult);
      toast.success('Teste executado com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao executar teste');
      toast.error('Erro no teste');
    } finally {
      setIsRunning(false);
    }
  };

  const saveQualityScore = async (score: number) => {
    setQualityScore(score);
    toast.success('Avaliação salva!');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Test Playground
            {prompt && (
              <Badge variant="outline" className="ml-2">
                {prompt.name} v{prompt.version}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 h-[600px]">
          {/* Input Side */}
          <div className="space-y-4 flex flex-col">
            <div className="flex-1 space-y-2">
              <Label>Test Input (JSON)</Label>
              <Textarea
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder={`{
  "company_name": "Acme Corp",
  "sector": "Technology",
  "meeting_date": "2026-01-15"
}`}
                className="h-[280px] font-mono text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Contexto do Teste (Opcional)</Label>
              <Textarea
                value={testContext}
                onChange={(e) => setTestContext(e.target.value)}
                placeholder="Descreva o que você está testando..."
                rows={3}
              />
            </div>

            <Button
              onClick={runTest}
              disabled={isRunning || !testInput.trim()}
              className="w-full"
              size="lg"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Executando...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Executar Teste
                </>
              )}
            </Button>

            {prompt && (
              <div className="p-3 bg-muted rounded-lg text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modelo:</span>
                  <span>{prompt.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Temperature:</span>
                  <span>{prompt.temperature}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Tokens:</span>
                  <span>{prompt.max_tokens}</span>
                </div>
              </div>
            )}
          </div>

          {/* Output Side */}
          <div className="flex flex-col space-y-4 border-l pl-6">
            <Label>Output</Label>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result ? (
              <>
                <ScrollArea className="flex-1 border rounded-lg">
                  <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                    {typeof result.output === 'string' 
                      ? result.output 
                      : JSON.stringify(result.output, null, 2)}
                  </pre>
                </ScrollArea>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <MetricCard 
                    icon={<Clock className="h-4 w-4 text-blue-500" />}
                    label="Latência" 
                    value={`${result.latency_ms}ms`} 
                  />
                  <MetricCard 
                    icon={<Zap className="h-4 w-4 text-yellow-500" />}
                    label="Tokens" 
                    value={result.tokens_used?.toString() || '-'} 
                  />
                  <MetricCard 
                    icon={<DollarSign className="h-4 w-4 text-green-500" />}
                    label="Custo" 
                    value={result.cost_usd ? `$${result.cost_usd.toFixed(4)}` : '-'} 
                  />
                </div>

                {/* Quality Rating */}
                <div className="p-4 border rounded-lg space-y-2">
                  <Label>Avalie a qualidade da resposta</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        onClick={() => saveQualityScore(score)}
                        className={`p-2 rounded-lg border transition-colors ${
                          qualityScore === score
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent'
                        }`}
                      >
                        <Star className={`h-5 w-5 ${qualityScore && qualityScore >= score ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                  {qualityScore && (
                    <p className="text-xs text-muted-foreground">
                      Você avaliou: {qualityScore}/5 estrelas
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center border rounded-lg bg-muted/50">
                <p className="text-muted-foreground text-sm">
                  Execute um teste para ver o resultado
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 bg-muted rounded-lg">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

// Generate mock output based on prompt category
function generateMockOutput(category: string, input: any) {
  const companyName = input.company_name || 'Empresa';
  
  switch (category) {
    case 'agent_a_collector':
      return {
        signals: [
          {
            title: "Alta taxa Selic impacta custo de capital",
            source: "Banco Central do Brasil",
            date: "2026-01-08",
            category: "macroeconomic",
            theme: "interest_rates",
            impact: "high",
            relevance_score: 85,
            summary: `A manutenção da taxa Selic em patamares elevados afeta diretamente o custo de financiamento de ${companyName}.`,
            implications: ["Renegociar dívidas", "Avaliar alternativas de funding", "Revisar plano de investimentos"]
          },
          {
            title: "Nova regulamentação ESG para setor",
            source: "CVM",
            date: "2026-01-05",
            category: "regulatory",
            theme: "new_law",
            impact: "medium",
            relevance_score: 72,
            summary: "Novas exigências de disclosure ESG entram em vigor em março de 2026.",
            implications: ["Preparar relatório de sustentabilidade", "Adequar processos internos"]
          }
        ],
        metadata: {
          sources_consulted: 12,
          signals_found: 2,
          avg_relevance: 78.5
        }
      };

    case 'agent_b_analyzer':
      return {
        patterns: [
          {
            id: "pattern_001",
            type: "recurrence",
            description: "Tema de expansão internacional volta ao conselho pela 4ª vez em 12 meses",
            frequency: 4,
            root_cause: "Falta de definição estratégica clara",
            cost_of_non_decision: "R$ 15M em oportunidades perdidas",
            severity: "high"
          }
        ],
        recommendations: [
          "Agendar sessão estratégica dedicada ao tema de internacionalização",
          "Definir critérios objetivos de go/no-go"
        ],
        governance_health_score: 72
      };

    case 'agent_c_scorer':
      return {
        ranked_topics: [
          {
            topic: "Revisão orçamentária Q1 2026",
            priority_score: 92,
            urgency: 95,
            impact: 85,
            exposure: 80,
            governance: 90,
            strategy: 88,
            severity: "critical",
            recommended_time: 30,
            decision_type: "approval"
          },
          {
            topic: "Status projeto de transformação digital",
            priority_score: 78,
            urgency: 70,
            impact: 80,
            exposure: 65,
            governance: 75,
            strategy: 85,
            severity: "high",
            recommended_time: 25,
            decision_type: "information"
          }
        ]
      };

    case 'agent_d_agenda_generator':
      return {
        agenda: {
          meeting_date: input.meeting_date || "2026-01-15",
          duration_minutes: 180,
          topics: [
            {
              order: 1,
              title: "Abertura e aprovação de ata anterior",
              time_allocated: 10,
              type: "administrative",
              presenter: "Presidente do Conselho"
            },
            {
              order: 2,
              title: "Revisão orçamentária Q1 2026",
              time_allocated: 30,
              type: "decision",
              presenter: "CFO",
              critical_questions: [
                "Qual o impacto no fluxo de caixa?",
                "Há contingências suficientes?"
              ]
            }
          ]
        }
      };

    case 'agent_d_briefing_generator':
      return {
        briefing: {
          member_name: input.member_name || "Conselheiro",
          executive_summary: `Esta reunião é crítica para ${companyName} pois serão tomadas decisões sobre orçamento e estratégia de crescimento.`,
          your_focus: [
            "Sua expertise será fundamental na análise do impacto financeiro das propostas",
            "Considere questionar sobre riscos de execução"
          ],
          critical_questions: [
            "Qual o ROIC projetado para cada iniciativa?",
            "Como estamos em relação ao guidance do mercado?"
          ],
          preparation_time_minutes: 45
        }
      };

    default:
      return {
        message: `Teste executado com sucesso para categoria: ${category}`,
        input_received: input,
        timestamp: new Date().toISOString()
      };
  }
}
