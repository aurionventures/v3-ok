import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  MapPin,
  Upload,
  UserPlus,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  fetchConvidadoByUserId,
  fetchReuniaoById,
  uploadDocumentoConvidado,
  confirmarParticipacaoConvidado,
} from "@/services/agenda";
import type { ReuniaoEnriquecida } from "@/types/agenda";

const ACCEPTED_TYPES = ".doc,.docx,.pdf,.ppt,.pptx";
const MAX_SIZE_MB = 10;

function nomeConvidado(email: string): string {
  const part = email.split("@")[0];
  if (!part) return email;
  return part
    .split(/[._-]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join(" ");
}

const ConvidadoLanding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [convidado, setConvidado] = useState<{
    id: string;
    reuniao_id: string;
    email: string;
  } | null>(null);
  const [reuniao, setReuniao] = useState<ReuniaoEnriquecida | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        navigate("/login", { replace: true });
        return;
      }

      const { data: conv, error: errConv } = await fetchConvidadoByUserId(
        session.user.id
      );
      if (errConv || !conv) {
        toast({
          title: "Acesso não autorizado",
          description:
            errConv ||
            "Você não possui convite ativo para nenhuma reunião.",
          variant: "destructive",
        });
        navigate("/login", { replace: true });
        return;
      }

      setConvidado(conv);
      const { data: reun, error: errReun } = await fetchReuniaoById(
        conv.reuniao_id
      );
      if (errReun || !reun) {
        toast({
          title: "Reunião não encontrada",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      setReuniao(reun);
      setLoading(false);
    };
    load();
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase();
    const allowed = ["doc", "docx", "pdf", "ppt", "pptx"];
    if (!ext || !allowed.includes(ext)) {
      toast({
        title: "Formato inválido",
        description: "Apenas DOC, DOCX, PDF, PPT ou PPTX são permitidos.",
        variant: "destructive",
      });
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: `Tamanho máximo: ${MAX_SIZE_MB}MB`,
        variant: "destructive",
      });
      return;
    }
    setFile(f);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      const ext = f.name.split(".").pop()?.toLowerCase();
      const allowed = ["doc", "docx", "pdf", "ppt", "pptx"];
      if (ext && allowed.includes(ext) && f.size <= MAX_SIZE_MB * 1024 * 1024) {
        setFile(f);
      } else {
        toast({
          title: "Arquivo inválido",
          description: `Apenas DOC, DOCX, PDF, PPT ou PPTX. Máx ${MAX_SIZE_MB}MB.`,
          variant: "destructive",
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleEnviar = async () => {
    if (!convidado || !reuniao) return;
    if (!confirmed) {
      toast({
        title: "Confirme",
        description: "Marque a confirmação para enviar.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      if (file) {
        const { error } = await uploadDocumentoConvidado(
          convidado.reuniao_id,
          convidado.id,
          file
        );
        if (error) {
          toast({ title: "Erro ao enviar documento", description: error, variant: "destructive" });
          setUploading(false);
          return;
        }
      }
      const { error: errConfirm } = await confirmarParticipacaoConvidado(convidado.id);
      if (errConfirm) {
        toast({ title: "Erro ao confirmar", description: errConfirm, variant: "destructive" });
        setUploading(false);
        return;
      }
      setSubmitted(true);
      toast({
        title: "Enviado com sucesso",
        description: file ? "Seu documento foi recebido e sua participação confirmada." : "Sua participação foi confirmada.",
      });
    } finally {
      setUploading(false);
    }
  };

  const temPermissaoUpload = true; // Por enquanto todos convidados podem; depois pode vir de user_metadata

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!convidado || !reuniao) return null;

  const tituloReuniao =
    reuniao.titulo ||
    reuniao.conselho_nome ||
    reuniao.comite_nome ||
    reuniao.comissao_nome ||
    "Reunião";
  const dataFormatada = reuniao.data_reuniao
    ? format(new Date(reuniao.data_reuniao), "EEEE, dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      })
    : "—";
  const modalidade = (reuniao as { modalidade?: string }).modalidade
    ? String((reuniao as { modalidade?: string }).modalidade).charAt(0).toUpperCase() +
      String((reuniao as { modalidade?: string }).modalidade).slice(1).toLowerCase()
    : "Presencial";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho da reunião */}
      <header
        className="bg-gradient-to-b from-blue-600 to-blue-700 text-white px-4 py-8 sm:px-6"
        style={{ background: "linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{tituloReuniao}</h1>
              <p className="text-white/90 text-sm mt-1">
                Você foi convidado como: <strong>{nomeConvidado(convidado.email)}</strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <div className="rounded-lg bg-white/10 backdrop-blur px-4 py-3">
              <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                <Calendar className="h-4 w-4" />
                Data
              </div>
              <p className="font-semibold text-white">{dataFormatada}</p>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur px-4 py-3">
              <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                <Clock className="h-4 w-4" />
                Horário
              </div>
              <p className="font-semibold text-white">
                {reuniao.horario ? String(reuniao.horario).slice(0, 5) : "—"}
              </p>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur px-4 py-3">
              <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                <MapPin className="h-4 w-4" />
                Modalidade
              </div>
              <p className="font-semibold text-white">{modalidade}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {submitted ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-lg font-medium text-green-600">
                Obrigado! Sua participação foi registrada.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Aguarde a confirmação do secretariado.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {temPermissaoUpload && (
              <Card className="border-blue-200">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-blue-900">Enviar Documentos</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Você tem permissão para enviar documentos relacionados a esta reunião.
                  </p>

                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:bg-blue-50/50 transition-colors cursor-pointer"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      accept={ACCEPTED_TYPES}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Upload className="h-12 w-12 mx-auto text-blue-600 mb-3" />
                    <p className="font-medium text-blue-900">
                      Clique aqui ou arraste um arquivo
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tamanho máximo: {MAX_SIZE_MB}MB
                    </p>
                    {file && (
                      <p className="text-sm font-medium text-green-600 mt-2">
                        ✓ {file.name}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="confirm"
                    checked={confirmed}
                    onCheckedChange={(v) => setConfirmed(!!v)}
                  />
                  <Label
                    htmlFor="confirm"
                    className="text-sm cursor-pointer leading-tight"
                  >
                    Confirmo que li as informações da reunião e estou ciente da data, horário e modalidade.
                  </Label>
                </div>

                <Button
                  className="w-full"
                  onClick={handleEnviar}
                  disabled={!confirmed || uploading}
                >
                  {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {submitted ? "Enviado" : uploading ? "Enviando..." : "Confirmar participação"}
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default ConvidadoLanding;
