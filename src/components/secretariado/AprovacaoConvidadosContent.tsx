import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Eye, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEmpresas } from "@/hooks/useEmpresas";
import {
  fetchDocumentosConvidadosParaSecretariado,
  atualizarStatusDocumentoConvidado,
} from "@/services/agenda";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const APROVACAO_CONVIDADOS_KEY = ["secretariado", "documentos-convidados"] as const;

function formatarTamanho(bytes: number | null): string {
  if (bytes == null || bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function tipoArquivoLabel(mime: string | null, nome: string): string {
  if (mime) {
    if (mime.includes("spreadsheet") || mime.includes("excel")) return "Excel";
    if (mime.includes("presentation") || mime.includes("powerpoint")) return "PowerPoint";
    if (mime.includes("pdf")) return "PDF";
    if (mime.includes("word") || mime.includes("document")) return "Word";
  }
  const ext = (nome.split(".").pop() ?? "").toLowerCase();
  const map: Record<string, string> = {
    xlsx: "Excel",
    xls: "Excel",
    pptx: "PowerPoint",
    ppt: "PowerPoint",
    pdf: "PDF",
    docx: "Word",
    doc: "Word",
  };
  return map[ext] ?? ext.toUpperCase();
}

export function AprovacaoConvidadosContent() {
  const queryClient = useQueryClient();
  const { firstEmpresaId } = useEmpresas();

  const { data: documentos, isLoading, error } = useQuery({
    queryKey: [...APROVACAO_CONVIDADOS_KEY, firstEmpresaId ?? "none"],
    queryFn: () => fetchDocumentosConvidadosParaSecretariado(firstEmpresaId),
    enabled: !!firstEmpresaId,
  });

  const [docEmAcao, setDocEmAcao] = useState<string | null>(null);

  const statusMutation = useMutation({
    mutationFn: ({ docId, status }: { docId: string; status: "aprovado" | "rejeitado" }) =>
      atualizarStatusDocumentoConvidado(docId, status),
    onMutate: ({ docId }) => setDocEmAcao(docId),
    onSettled: () => setDocEmAcao(null),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: APROVACAO_CONVIDADOS_KEY });
      toast({ title: status === "aprovado" ? "Documento aprovado" : "Documento rejeitado" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const handleVisualizar = (arquivoUrl: string | null, storagePath: string, nomeArquivo: string) => {
    if (arquivoUrl) {
      window.open(arquivoUrl, "_blank", "noopener,noreferrer");
    } else {
      toast({ title: "URL não disponível", variant: "destructive" });
    }
  };

  const handleAprovar = (docId: string) => {
    statusMutation.mutate({ docId, status: "aprovado" });
  };

  const handleRejeitar = (docId: string) => {
    statusMutation.mutate({ docId, status: "rejeitado" });
  };

  const lista = documentos?.data ?? [];

  return (
    <div className="space-y-6 mt-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Aprovação de Documentos de Convidados
        </h2>
        <p className="text-sm text-gray-500">
          Revise e aprove materiais enviados por convidados via magic link para as reuniões.
        </p>
      </div>

      {!firstEmpresaId ? (
        <p className="text-sm text-muted-foreground">Selecione uma empresa para visualizar os documentos.</p>
      ) : isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando documentos...</span>
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">Erro ao carregar documentos.</p>
      ) : lista.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum documento pendente de aprovação. Os arquivos enviados por convidados via magic link aparecerão aqui.
        </p>
      ) : (
        <div className="space-y-4">
          {lista.map((doc) => {
            const statusLabel =
              doc.status === "pendente"
                ? "Aguardando aprovação"
                : doc.status === "aprovado"
                  ? "Aprovado"
                  : "Rejeitado";
            const enviadoPor = doc.convidado_email
              ? doc.convidado_email.split("@")[0].replace(/[._]/g, " ")
              : "Convidado";

            return (
              <Card key={doc.id} className="border border-gray-200 overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex gap-3 min-w-0 flex-1">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">{doc.nome_arquivo}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Enviado por: {enviadoPor}
                        </p>
                        <p className="text-sm text-gray-500">
                          {doc.created_at
                            ? format(new Date(doc.created_at), "dd/MM/yyyy 'às' HH:mm", {
                                locale: ptBR,
                              })
                            : "—"}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <Badge variant="secondary" className="font-normal text-gray-600">
                            {tipoArquivoLabel(doc.mime_type, doc.nome_arquivo)}
                          </Badge>
                          <Badge variant="secondary" className="font-normal text-gray-600">
                            {formatarTamanho(doc.tamanho)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-normal",
                              doc.status === "pendente" &&
                                "border-amber-200 text-amber-800 bg-amber-50",
                              doc.status === "aprovado" &&
                                "border-green-200 text-green-800 bg-green-50",
                              doc.status === "rejeitado" &&
                                "border-red-200 text-red-800 bg-red-50"
                            )}
                          >
                            {statusLabel}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-64 shrink-0 text-sm text-gray-600 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-4">
                      <p className="font-medium text-gray-700">Reunião:</p>
                      <p className="text-gray-600">{doc.reuniao_titulo ?? "—"}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {doc.reuniao_data
                          ? format(new Date(doc.reuniao_data), "dd/MM/yyyy", { locale: ptBR })
                          : "—"}
                      </p>
                      {doc.convidado_email && (
                        <p className="text-gray-500 text-xs mt-1 truncate" title={doc.convidado_email}>
                          {doc.convidado_email}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() =>
                          handleVisualizar(doc.arquivo_url, doc.storage_path, doc.nome_arquivo)
                        }
                      >
                        <Eye className="h-4 w-4" />
                        Visualizar
                      </Button>
                      {doc.status === "pendente" && (
                        <>
                          <Button
                            size="sm"
                            className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleAprovar(doc.id)}
                            disabled={!!docEmAcao}
                          >
                            {docEmAcao === doc.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                            Aprovar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => handleRejeitar(doc.id)}
                            disabled={!!docEmAcao}
                          >
                            <X className="h-4 w-4" />
                            Rejeitar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
