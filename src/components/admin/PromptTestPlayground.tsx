import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIPrompt } from '@/hooks/usePrompts';

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

  // Fetch prompt details
  const { data: prompt } = useQuery({
    queryKey: ['prompt', promptId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('ai_prompt_library')
        .select('*')
        .eq('id', promptId)
        .single();
      
      if (error) throw error;
      return data as AIPrompt;
    },
    enabled: !!promptId && open
  });

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

      // Call edge function to test prompt
      const { data, error: fnError } = await supabase.functions.invoke('test-prompt', {
        body: {
          promptId,
          testInput: parsedInput,
          testContext
        }
      });

      if (fnError) throw fnError;

      setResult(data);
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
    
    try {
      await (supabase as any).from('prompt_test_executions').insert({
        prompt_id: promptId,
        test_input: JSON.parse(testInput),
        test_context: testContext || null,
        output: result?.output,
        success: result?.success || false,
        latency_ms: result?.latency_ms,
        tokens_used: result?.tokens_used,
        cost_usd: result?.cost_usd,
        quality_score: score,
        feedback: null
      });
      toast.success('Avaliação salva!');
    } catch (err) {
      console.error('Error saving test result:', err);
    }
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
