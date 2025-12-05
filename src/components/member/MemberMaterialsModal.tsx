import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, FileSpreadsheet, Presentation, File, FolderOpen } from "lucide-react";
import { toast } from "sonner";

interface Material {
  id: string;
  name: string;
  type: "PDF" | "XLSX" | "PPTX" | "DOCX";
  size: string;
  agendaItem: string;
}

interface MemberMaterialsModalProps {
  open: boolean;
  onClose: () => void;
  meeting: {
    title: string;
    council: string;
    date: string;
  } | null;
}

const mockMaterials: Material[] = [
  { 
    id: "1",
    name: "Relatório Financeiro Q3 2024.pdf", 
    type: "PDF", 
    size: "2.4 MB", 
    agendaItem: "Análise de Resultados Q3 2024" 
  },
  { 
    id: "2",
    name: "Due Diligence - Empresa XYZ.pdf", 
    type: "PDF", 
    size: "5.8 MB", 
    agendaItem: "Proposta de Aquisição - Empresa XYZ" 
  },
  { 
    id: "3",
    name: "Valuation Empresa XYZ.xlsx", 
    type: "XLSX", 
    size: "1.2 MB", 
    agendaItem: "Proposta de Aquisição - Empresa XYZ" 
  },
  { 
    id: "4",
    name: "Apresentação Estratégica 2025.pptx", 
    type: "PPTX", 
    size: "8.5 MB", 
    agendaItem: "Plano Estratégico 2025" 
  },
  { 
    id: "5",
    name: "ATA Reunião Anterior - Out_2024.pdf", 
    type: "PDF", 
    size: "320 KB", 
    agendaItem: "Aprovação da ATA anterior" 
  },
  { 
    id: "6",
    name: "Parecer Jurídico M&A.docx", 
    type: "DOCX", 
    size: "890 KB", 
    agendaItem: "Proposta de Aquisição - Empresa XYZ" 
  }
];

const getFileIcon = (type: string) => {
  switch (type) {
    case "PDF": return <FileText className="h-5 w-5 text-red-500" />;
    case "XLSX": return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    case "PPTX": return <Presentation className="h-5 w-5 text-orange-500" />;
    case "DOCX": return <File className="h-5 w-5 text-blue-500" />;
    default: return <File className="h-5 w-5" />;
  }
};

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case "PDF": return "bg-red-100 text-red-700 border-red-200";
    case "XLSX": return "bg-green-100 text-green-700 border-green-200";
    case "PPTX": return "bg-orange-100 text-orange-700 border-orange-200";
    case "DOCX": return "bg-blue-100 text-blue-700 border-blue-200";
    default: return "";
  }
};

export function MemberMaterialsModal({ open, onClose, meeting }: MemberMaterialsModalProps) {
  const handleDownload = (material: Material) => {
    toast.success(`Download iniciado: ${material.name}`);
  };

  const handleDownloadAll = () => {
    toast.success("Download de todos os materiais iniciado");
  };

  // Group materials by agenda item
  const groupedMaterials = mockMaterials.reduce((acc, material) => {
    if (!acc[material.agendaItem]) {
      acc[material.agendaItem] = [];
    }
    acc[material.agendaItem].push(material);
    return acc;
  }, {} as Record<string, Material[]>);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            Materiais de Apoio
          </DialogTitle>
        </DialogHeader>

        {meeting && (
          <div className="space-y-4">
            {/* Meeting Info */}
            <div className="bg-muted/50 rounded-lg p-4 flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{meeting.title}</h3>
                <p className="text-sm text-muted-foreground">{meeting.council} • {meeting.date}</p>
              </div>
              <Button size="sm" onClick={handleDownloadAll}>
                <Download className="h-4 w-4 mr-2" />
                Baixar Todos
              </Button>
            </div>

            {/* Materials grouped by agenda item */}
            <div className="space-y-4">
              {Object.entries(groupedMaterials).map(([agendaItem, materials]) => (
                <div key={agendaItem} className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/30 px-4 py-2 border-b">
                    <h4 className="font-medium text-sm">{agendaItem}</h4>
                  </div>
                  <div className="divide-y">
                    {materials.map((material) => (
                      <div 
                        key={material.id}
                        className="flex items-center justify-between p-3 hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getFileIcon(material.type)}
                          <div>
                            <p className="font-medium text-sm">{material.name}</p>
                            <p className="text-xs text-muted-foreground">{material.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getTypeBadgeColor(material.type)}`}
                          >
                            {material.type}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDownload(material)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="text-center text-sm text-muted-foreground pt-2">
              {mockMaterials.length} documentos disponíveis
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
