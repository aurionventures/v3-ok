import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, User, FileText, MessageSquare, Vote } from "lucide-react";

interface AgendaItem {
  order: number;
  title: string;
  presenter: string;
  duration: number;
  type: "Deliberação" | "Informativo" | "Discussão";
  description?: string;
}

interface MemberAgendaModalProps {
  open: boolean;
  onClose: () => void;
  meeting: {
    title: string;
    council: string;
    date: string;
    time: string;
  } | null;
}

const mockAgendaItems: AgendaItem[] = [
  { 
    order: 1, 
    title: "Abertura e Verificação de Quorum", 
    presenter: "Presidente do Conselho", 
    duration: 10, 
    type: "Informativo",
    description: "Verificação da presença dos membros e confirmação do quorum mínimo para deliberações."
  },
  { 
    order: 2, 
    title: "Aprovação da ATA anterior", 
    presenter: "Secretário", 
    duration: 15, 
    type: "Deliberação",
    description: "Leitura e aprovação da ATA da reunião ordinária de outubro/2024."
  },
  { 
    order: 3, 
    title: "Análise de Resultados Q3 2024", 
    presenter: "CFO - Carlos Mendes", 
    duration: 45, 
    type: "Informativo",
    description: "Apresentação dos resultados financeiros do terceiro trimestre, incluindo receita, EBITDA, margem líquida e comparativo com orçamento."
  },
  { 
    order: 4, 
    title: "Proposta de Aquisição - Empresa XYZ", 
    presenter: "CEO - Ana Paula Silva", 
    duration: 60, 
    type: "Deliberação",
    description: "Análise da proposta de M&A, due diligence realizada, valuation e recomendação da diretoria para aprovação do Conselho."
  },
  { 
    order: 5, 
    title: "Plano Estratégico 2025", 
    presenter: "CEO - Ana Paula Silva", 
    duration: 30, 
    type: "Discussão",
    description: "Discussão das diretrizes estratégicas para o próximo exercício, incluindo metas de crescimento e investimentos previstos."
  },
  { 
    order: 6, 
    title: "Encerramento", 
    presenter: "Presidente do Conselho", 
    duration: 10, 
    type: "Informativo",
    description: "Informes gerais e encerramento da sessão."
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Deliberação": return <Vote className="h-4 w-4" />;
    case "Discussão": return <MessageSquare className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

const getTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "Deliberação": return "bg-purple-100 text-purple-700 border-purple-200";
    case "Discussão": return "bg-blue-100 text-blue-700 border-blue-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export function MemberAgendaModal({ open, onClose, meeting }: MemberAgendaModalProps) {
  const totalDuration = mockAgendaItems.reduce((acc, item) => acc + item.duration, 0);
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Pauta da Reunião
          </DialogTitle>
        </DialogHeader>

        {meeting && (
          <div className="space-y-4">
            {/* Meeting Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold text-lg">{meeting.title}</h3>
              <p className="text-sm text-muted-foreground">{meeting.council}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span>{meeting.date} às {meeting.time}</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {hours}h{minutes > 0 ? ` ${minutes}min` : ""} estimado
                </Badge>
              </div>
            </div>

            {/* Agenda Items */}
            <div className="space-y-3">
              {mockAgendaItems.map((item) => (
                <div 
                  key={item.order}
                  className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {item.order}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{item.presenter}</span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge 
                        variant="outline" 
                        className={`flex items-center gap-1 ${getTypeBadgeVariant(item.type)}`}
                      >
                        {getTypeIcon(item.type)}
                        {item.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.duration} min
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
