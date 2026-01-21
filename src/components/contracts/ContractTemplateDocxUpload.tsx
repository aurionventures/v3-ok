import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileUp } from "lucide-react";
import * as mammoth from "mammoth";

interface ContractTemplateDocxUploadProps {
  onHtmlReady: (html: string) => void;
  onError?: (error: Error) => void;
}

const DEFAULT_WRAPPER_START =
  "<div style=\"font-family: 'Times New Roman', Georgia, serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.7; color: #222;\">";
const DEFAULT_WRAPPER_END = "</div>";

export default function ContractTemplateDocxUpload({
  onHtmlReady,
  onError,
}: ContractTemplateDocxUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handlePick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".docx")) {
      toast.error("Selecione um arquivo .docx");
      event.target.value = "";
      return;
    }

    setIsImporting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { value: htmlBody } = await mammoth.convertToHtml(
        { arrayBuffer },
        {
          styleMap: [
            "p[style-name='Title'] => h1:fresh",
            "p[style-name='Heading 1'] => h2:fresh",
            "p[style-name='Heading 2'] => h3:fresh",
          ],
        }
      );

      const normalized = htmlBody?.trim();
      if (!normalized) {
        toast.error("Não foi possível extrair conteúdo do DOCX");
        return;
      }

      const wrappedHtml = `${DEFAULT_WRAPPER_START}${normalized}${DEFAULT_WRAPPER_END}`;
      onHtmlReady(wrappedHtml);
      toast.success("DOCX importado com sucesso");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erro ao importar DOCX");
      console.error("DOCX import error:", error);
      onError?.(error);
      toast.error("Erro ao importar DOCX");
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".docx"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button variant="outline" onClick={handlePick} disabled={isImporting}>
        <FileUp className="h-4 w-4 mr-2" />
        {isImporting ? "Importando..." : "Importar DOCX"}
      </Button>
    </>
  );
}
