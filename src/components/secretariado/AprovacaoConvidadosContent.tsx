import { FileText, Eye, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface DocumentoConvidado {
  id: string;
  nomeArquivo: string;
  tipoArquivo: "Excel" | "PowerPoint" | "PDF" | "Word";
  tamanho: string;
  enviadoPor: string;
  email: string;
  dataEnvio: string;
  reuniao: string;
  dataReuniao: string;
  status: "Aguardando aprovação";
}

const DOCUMENTOS_MOCK: DocumentoConvidado[] = [
  {
    id: "1",
    nomeArquivo: "Balanço Patrimonial Q4 2024.xlsx",
    tipoArquivo: "Excel",
    tamanho: "3.12 MB",
    enviadoPor: "Roberto Santos",
    email: "roberto.santos@auditoria.com",
    dataEnvio: "22/01/2025 às 14:45",
    reuniao: "Conselho Fiscal - Fevereiro/2025",
    dataReuniao: "15/02/2025",
    status: "Aguardando aprovação",
  },
  {
    id: "2",
    nomeArquivo: "Apresentação Estratégia 2025.pptx",
    tipoArquivo: "PowerPoint",
    tamanho: "5.00 MB",
    enviadoPor: "Ana Costa",
    email: "ana.costa@consultoria.com",
    dataEnvio: "23/01/2025 às 10:20",
    reuniao: "Conselho de Administração - Fevereiro/2025",
    dataReuniao: "18/02/2025",
    status: "Aguardando aprovação",
  },
];

export function AprovacaoConvidadosContent() {
  const handleVisualizar = (doc: DocumentoConvidado) => {
    // Integração futura: abrir visualizador ou download
  };

  const handleAprovar = (doc: DocumentoConvidado) => {
    // Integração futura: fluxo de aprovação
  };

  const handleRejeitar = (doc: DocumentoConvidado) => {
    // Integração futura: fluxo de rejeição
  };

  return (
    <div className="space-y-6 mt-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Aprovação de Documentos de Convidados
        </h2>
        <p className="text-sm text-gray-500">
          Revise e aprove materiais enviados por convidados para as reuniões.
        </p>
      </div>

      <div className="space-y-4">
        {DOCUMENTOS_MOCK.map((doc) => (
          <Card
            key={doc.id}
            className="border border-gray-200 overflow-hidden"
          >
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex gap-3 min-w-0 flex-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {doc.nomeArquivo}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Enviado por: {doc.enviadoPor}
                    </p>
                    <p className="text-sm text-gray-500">
                      {doc.dataEnvio}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <Badge
                        variant="secondary"
                        className="font-normal text-gray-600"
                      >
                        {doc.tipoArquivo}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="font-normal text-gray-600"
                      >
                        {doc.tamanho}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="font-normal border-amber-200 text-amber-800 bg-amber-50"
                      >
                        {doc.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="lg:w-64 shrink-0 text-sm text-gray-600 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-4">
                  <p className="font-medium text-gray-700">Reunião:</p>
                  <p className="text-gray-600">{doc.reuniao}</p>
                  <p className="text-gray-500 text-xs mt-1">{doc.dataReuniao}</p>
                  <p className="text-gray-500 text-xs mt-1 truncate" title={doc.email}>
                    {doc.email}
                  </p>
                </div>

                <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => handleVisualizar(doc)}
                  >
                    <Eye className="h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAprovar(doc)}
                  >
                    <Check className="h-4 w-4" />
                    Aprovar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => handleRejeitar(doc)}
                  >
                    <X className="h-4 w-4" />
                    Rejeitar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
