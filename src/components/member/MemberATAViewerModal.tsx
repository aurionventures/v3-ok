import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Users, Calendar, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

interface MemberATAViewerModalProps {
  open: boolean;
  onClose: () => void;
  ata: {
    id: string;
    title: string;
    council: string;
    date: string;
    time?: string;
  } | null;
}

const mockATAContent = {
  location: "Sala de Reuniões - Sede Corporativa, São Paulo/SP",
  participants: [
    { name: "Roberto Alves", role: "Presidente", present: true },
    { name: "Maria Santos", role: "Conselheira", present: true },
    { name: "Carlos Mendes", role: "Conselheiro", present: true },
    { name: "Ana Paula Silva", role: "Conselheira", present: true },
    { name: "Pedro Costa", role: "Secretário", present: true },
  ],
  summary: `Aos quinze dias do mês de novembro de dois mil e vinte e quatro, às nove horas, reuniu-se ordinariamente o Conselho de Administração da Empresa Demo S.A., em sua sede social, com a presença dos conselheiros acima relacionados, verificado o quorum regimental para instalação e deliberação.

O Presidente declarou aberta a sessão, passando à análise dos pontos constantes da pauta previamente distribuída.`,
  decisions: [
    {
      item: "1. Aprovação da ATA anterior",
      decision: "APROVADA por unanimidade a ATA da reunião ordinária de outubro/2024."
    },
    {
      item: "2. Análise de Resultados Q3 2024",
      decision: "TOMADO CONHECIMENTO dos resultados do terceiro trimestre, que apresentou crescimento de 12% na receita líquida em relação ao mesmo período do ano anterior, com EBITDA de R$ 45 milhões."
    },
    {
      item: "3. Proposta de Aquisição - Empresa XYZ",
      decision: "APROVADA por maioria (4 votos favoráveis, 1 abstenção) a proposta de aquisição da Empresa XYZ pelo valor de R$ 120 milhões, condicionada à conclusão satisfatória do due diligence financeiro e jurídico."
    },
    {
      item: "4. Plano Estratégico 2025",
      decision: "APROVADAS as diretrizes estratégicas para 2025, incluindo meta de crescimento de 15% e investimentos de R$ 50 milhões em expansão."
    }
  ],
  tasks: [
    { responsible: "CFO Carlos Mendes", task: "Finalizar due diligence da Empresa XYZ", deadline: "15/12/2024" },
    { responsible: "CEO Ana Paula", task: "Apresentar plano de integração pós-aquisição", deadline: "20/12/2024" },
    { responsible: "Jurídico", task: "Elaborar contratos definitivos de M&A", deadline: "10/01/2025" },
  ],
  closing: `Nada mais havendo a tratar, o Presidente encerrou a sessão às doze horas e trinta minutos, da qual eu, Pedro Costa, Secretário, lavrei a presente ata que, lida e aprovada, será assinada por todos os presentes.`
};

export function MemberATAViewerModal({ open, onClose, ata }: MemberATAViewerModalProps) {
  const handleDownloadPDF = () => {
    toast.success("Download do PDF iniciado");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Visualização da ATA
          </DialogTitle>
        </DialogHeader>

        {ata && (
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold text-lg">{ata.title}</h3>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {ata.council}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {ata.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {ata.time || "09:00"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {mockATAContent.location}
                  </span>
                </div>
              </div>

              {/* Participants */}
              <div>
                <h4 className="font-semibold mb-2">Participantes</h4>
                <div className="flex flex-wrap gap-2">
                  {mockATAContent.participants.map((p, i) => (
                    <Badge key={i} variant="outline" className="py-1">
                      {p.name} ({p.role})
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="font-semibold mb-2">Abertura</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {mockATAContent.summary}
                </p>
              </div>

              {/* Decisions */}
              <div>
                <h4 className="font-semibold mb-3">Deliberações</h4>
                <div className="space-y-3">
                  {mockATAContent.decisions.map((d, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <p className="font-medium text-sm">{d.item}</p>
                      <p className="text-sm text-muted-foreground mt-1">{d.decision}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              <div>
                <h4 className="font-semibold mb-3">Pendências Atribuídas</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-2 font-medium">Responsável</th>
                        <th className="text-left p-2 font-medium">Tarefa</th>
                        <th className="text-left p-2 font-medium">Prazo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {mockATAContent.tasks.map((t, i) => (
                        <tr key={i}>
                          <td className="p-2">{t.responsible}</td>
                          <td className="p-2">{t.task}</td>
                          <td className="p-2">{t.deadline}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Closing */}
              <div>
                <h4 className="font-semibold mb-2">Encerramento</h4>
                <p className="text-sm text-muted-foreground">
                  {mockATAContent.closing}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
