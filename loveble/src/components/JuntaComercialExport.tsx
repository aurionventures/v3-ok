import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, FileSpreadsheet, AlertTriangle } from "lucide-react";
import { ShareholderData } from "@/hooks/useCapTable";
import { getQualificationName } from "@/data/governanceStandards";
import { Badge } from "@/components/ui/badge";

interface JuntaComercialExportProps {
  isOpen: boolean;
  onClose: () => void;
  shareholders: ShareholderData[];
  companyName: string;
}

export function JuntaComercialExport({ 
  isOpen, 
  onClose, 
  shareholders,
  companyName 
}: JuntaComercialExportProps) {
  
  const exportToCSV = () => {
    const headers = [
      "CPF/CNPJ",
      "Nome/Razão Social",
      "Código Qualificação",
      "Qualificação",
      "Participação (%)",
      "Data Entrada",
      "Tipo Entrada",
      "Classe Ações"
    ];
    
    const rows = shareholders.map(s => [
      s.document || "",
      s.name,
      s.official_qualification_code || "",
      s.official_qualification_code ? getQualificationName(s.official_qualification_code) : "",
      s.shareholding_percentage?.toFixed(2) || "0",
      s.investment_entry_date || "",
      s.investment_type || "",
      s.shareholding_class || ""
    ]);
    
    const csvContent = [
      headers.join(";"),
      ...rows.map(row => row.join(";"))
    ].join("\n");
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    const date = new Date().toISOString().split('T')[0];
    const fileName = `cap-table-${companyName.replace(/\s+/g, '-').toLowerCase()}-${date}.csv`;
    
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const shareholdersWithoutRFB = shareholders.filter(s => !s.official_qualification_code);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Exportar para Junta Comercial
          </DialogTitle>
          <DialogDescription>
            Gere arquivos compatíveis com os sistemas da Junta Comercial e Receita Federal
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Preview dos dados */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="text-sm font-medium mb-3">📊 Dados a serem exportados:</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total de sócios:</span>
                <Badge variant="secondary" className="ml-2">{shareholders.length}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Com qualificação RFB:</span>
                <Badge 
                  variant={shareholdersWithoutRFB.length === 0 ? "default" : "destructive"}
                  className="ml-2"
                >
                  {shareholders.filter(s => s.official_qualification_code).length}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Pessoa Física:</span>
                <Badge variant="outline" className="ml-2">
                  {shareholders.filter(s => s.document && s.document.length <= 14).length}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Pessoa Jurídica:</span>
                <Badge variant="outline" className="ml-2">
                  {shareholders.filter(s => s.document && s.document.length > 14).length}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Formato de exportação */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Formato de Exportação:</div>
            
            <Button 
              onClick={exportToCSV}
              className="w-full justify-start h-auto py-4"
              variant="outline"
            >
              <Download className="h-5 w-5 mr-3 flex-shrink-0" />
              <div className="text-left flex-1">
                <div className="font-medium">CSV - Junta Comercial</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Formato padrão (separado por ponto-e-vírgula) compatível com sistemas da Junta Comercial e Receita Federal
                </div>
              </div>
            </Button>
          </div>
          
          {/* Avisos */}
          {shareholdersWithoutRFB.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Atenção:</strong> {shareholdersWithoutRFB.length} sócio(s) sem qualificação RFB.
                É obrigatório atribuir códigos de qualificação antes de submeter à Junta Comercial.
                <div className="mt-2 space-y-1">
                  {shareholdersWithoutRFB.slice(0, 3).map(s => (
                    <div key={s.id}>• {s.name}</div>
                  ))}
                  {shareholdersWithoutRFB.length > 3 && (
                    <div>• ... e mais {shareholdersWithoutRFB.length - 3}</div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <Alert>
            <AlertDescription className="text-xs">
              <strong>Informações incluídas no arquivo:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>CPF/CNPJ dos sócios</li>
                <li>Código de qualificação RFB</li>
                <li>Percentual de participação</li>
                <li>Data e tipo de entrada no capital</li>
                <li>Classe de ações (quando aplicável)</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
}
