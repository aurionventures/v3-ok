import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Calendar, AlertCircle, Building2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TaskData {
  id: string;
  description: string;
  due_date: string;
  status: string;
  priority: string;
  category: string | null;
  notes: string | null;
  responsible_external_name: string | null;
  responsible_external_email: string | null;
  meeting: {
    title: string;
    council: {
      name: string;
      organ_type: string;
    };
  };
}

export default function TaskAccess() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [isResolved, setIsResolved] = useState(false);
  const [observations, setObservations] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    validateTokenAndLoadTask();
  }, [token]);

  const validateTokenAndLoadTask = async () => {
    if (!token) {
      setTokenValid(false);
      setLoading(false);
      return;
    }

    try {
      // Validar token do localStorage
      const tokenData = localStorage.getItem(`task_token_${token}`);
      
      if (!tokenData) {
        setTokenValid(false);
        setLoading(false);
        toast({
          title: "Token inválido",
          description: "Este link não é válido ou expirou.",
          variant: "destructive",
        });
        return;
      }

      const { actionId } = JSON.parse(tokenData);

      // Buscar dados da tarefa
      const { data, error } = await supabase
        .from('meeting_actions')
        .select(`
          id,
          description,
          due_date,
          status,
          priority,
          category,
          notes,
          responsible_external_name,
          responsible_external_email,
          meeting:meetings!meeting_actions_meeting_id_fkey (
            title,
            council:councils!meetings_council_id_fkey (
              name,
              organ_type
            )
          )
        `)
        .eq('id', actionId)
        .single();

      if (error) throw error;

      setTaskData(data as any);
      setIsResolved(data.status === 'CONCLUIDA');
    } catch (error) {
      console.error('Erro ao carregar tarefa:', error);
      setTokenValid(false);
      toast({
        title: "Erro ao carregar tarefa",
        description: "Não foi possível carregar os dados da tarefa.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResolveTask = async () => {
    if (!taskData || !token) return;

    setSubmitting(true);

    try {
      const updates: any = {
        status: 'CONCLUIDA',
        completed_at: new Date().toISOString(),
      };

      if (observations) {
        updates.notes = observations;
      }

      const { error } = await supabase
        .from('meeting_actions')
        .update(updates)
        .eq('id', taskData.id);

      if (error) throw error;

      toast({
        title: "Tarefa marcada como resolvida",
        description: "A tarefa foi atualizada com sucesso!",
      });

      setIsResolved(true);
      
      // Remover token do localStorage após uso
      localStorage.removeItem(`task_token_${token}`);
    } catch (error) {
      console.error('Erro ao resolver tarefa:', error);
      toast({
        title: "Erro ao resolver tarefa",
        description: "Não foi possível atualizar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando tarefa...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid || !taskData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Link Inválido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Este link não é válido ou já foi utilizado. Se você acredita que isso é um erro, entre em contato com o responsável.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPriorityBadge = () => {
    const variants = {
      ALTA: { label: 'Alta Prioridade', variant: 'destructive' as const },
      MEDIA: { label: 'Média Prioridade', variant: 'default' as const },
      BAIXA: { label: 'Baixa Prioridade', variant: 'secondary' as const },
    };
    const priority = taskData.priority.toUpperCase();
    return variants[priority as keyof typeof variants] || variants.MEDIA;
  };

  const getUrgencyInfo = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(taskData.due_date);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `Atrasada há ${Math.abs(diffDays)} dia(s)`, color: 'text-red-600', bgColor: 'bg-red-50' };
    if (diffDays === 0) return { text: 'Vence hoje!', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    if (diffDays <= 3) return { text: `Vence em ${diffDays} dia(s)`, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { text: `Vence em ${diffDays} dias`, color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  const urgency = getUrgencyInfo();
  const priorityBadge = getPriorityBadge();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">📋 Sua Tarefa Pendente</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {taskData.meeting?.council?.name} - {taskData.meeting?.title}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Urgency Banner */}
            {!isResolved && (
              <Card className={`${urgency.bgColor} border-0`}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className={`h-5 w-5 ${urgency.color}`} />
                    <span className={`font-semibold ${urgency.color}`}>{urgency.text}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Task Description */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Descrição da Tarefa</Label>
              <p className="text-lg">{taskData.description}</p>
            </div>

            <Separator />

            {/* Task Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Prazo
                </Label>
                <p className="font-semibold">
                  {format(new Date(taskData.due_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Prioridade
                </Label>
                <Badge variant={priorityBadge.variant}>{priorityBadge.label}</Badge>
              </div>

              <div className="space-y-2 col-span-2">
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Status Atual
                </Label>
                <Badge variant={isResolved ? "default" : "secondary"}>
                  {isResolved ? "✅ Resolvida" : "⏳ Pendente"}
                </Badge>
              </div>
            </div>

            {taskData.category && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Categoria</Label>
                  <p className="text-sm">{taskData.category}</p>
                </div>
              </>
            )}

            {!isResolved && (
              <>
                <Separator />

                {/* Resolution Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="resolved"
                      checked={isResolved}
                      onCheckedChange={(checked) => setIsResolved(checked as boolean)}
                    />
                    <Label
                      htmlFor="resolved"
                      className="text-base font-medium cursor-pointer"
                    >
                      ☑️ Marcar como resolvida
                    </Label>
                  </div>

                  {isResolved && (
                    <div className="space-y-2">
                      <Label htmlFor="observations">
                        Observações (opcional)
                      </Label>
                      <Textarea
                        id="observations"
                        placeholder="Adicione observações sobre a resolução da tarefa..."
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        rows={4}
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleResolveTask}
                    disabled={!isResolved || submitting}
                    className="w-full"
                    size="lg"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Confirmando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Confirmar Resolução
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            {isResolved && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">
                      Tarefa marcada como resolvida com sucesso!
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
