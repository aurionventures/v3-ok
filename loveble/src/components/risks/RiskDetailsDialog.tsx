import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GovernanceRisk } from "@/data/riskData";
import { Shield, AlertTriangle, Clock, User, Edit } from "lucide-react";

interface RiskDetailsDialogProps {
  risk: GovernanceRisk | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

export function RiskDetailsDialog({ risk, open, onOpenChange, onEdit }: RiskDetailsDialogProps) {
  if (!risk) return null;

  const getRiskLevel = (impact: number, probability: number) => {
    const score = impact * probability;
    if (score >= 16) return { level: "Crítico", color: "destructive" as const };
    if (score >= 12) return { level: "Alto", color: "destructive" as const };
    if (score >= 6) return { level: "Médio", color: "default" as const };
    return { level: "Baixo", color: "secondary" as const };
  };

  const riskLevel = getRiskLevel(risk.impact, risk.probability);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Detalhes do Risco
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cabeçalho do Risco */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{risk.title}</h3>
            <p className="text-muted-foreground text-sm">{risk.description}</p>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                Nível de Risco
              </div>
              <Badge variant={riskLevel.color} className="text-sm">
                {riskLevel.level}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                Responsável
              </div>
              <p className="text-sm font-medium">{risk.responsible}</p>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Impacto</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-6 w-6 rounded ${
                      i <= risk.impact ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Probabilidade</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-6 w-6 rounded ${
                      i <= risk.probability ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Controles */}
          {risk.controls.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Controles Implementados</h4>
              <ul className="space-y-1">
                {risk.controls.map((control, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {control}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Status e Prazo */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Status</div>
              <Badge variant={risk.status === "mitigated" ? "secondary" : "default"}>
                {risk.status === "mitigated" ? "Mitigado" : "Ativo"}
              </Badge>
            </div>

            {risk.deadline && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Prazo
                </div>
                <p className="text-sm font-medium">{risk.deadline}</p>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-2 pt-4">
            <Button onClick={onEdit} className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Editar Risco
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
