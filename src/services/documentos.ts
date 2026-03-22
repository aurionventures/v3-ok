import { supabase } from "@/lib/supabase";
import type { Documento, DocumentoInsert, DocumentoRow } from "@/types/documentos";

const BUCKET = "documentos";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function rowToDocumento(row: DocumentoRow): Documento {
  const ext = row.titulo.split(".").pop()?.toUpperCase() ?? "FILE";
  return {
    id: row.id,
    name: row.titulo,
    category: row.categoria ?? null,
    uploadDate: new Date(row.created_at).toLocaleDateString("pt-BR"),
    size: row.tamanho != null ? formatSize(row.tamanho) : "—",
    type: ext,
    description: row.descricao ?? null,
    arquivoUrl: row.arquivo_url ?? null,
  };
}

export async function fetchDocumentos(empresaId: string): Promise<Documento[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("documentos")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[documentos] fetchDocumentos:", error);
    return [];
  }

  return (data ?? []).map((r) => rowToDocumento(r as DocumentoRow));
}

export async function uploadAndSaveDocumento(
  empresaId: string,
  file: File,
  categoria?: string
): Promise<{ data: Documento | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: "Supabase não configurado" };
  }

  const ext = file.name.split(".").pop() ?? "pdf";
  const path = `${empresaId}/${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) {
    console.error("[documentos] upload storage:", uploadError);
    return { data: null, error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { data: inserted, error: insertError } = await supabase
    .from("documentos")
    .insert({
      empresa_id: empresaId,
      titulo: file.name,
      tipo: ext,
      arquivo_url: publicUrl,
      tamanho: file.size,
      categoria: categoria ?? null,
    })
    .select()
    .single();

  if (insertError) {
    console.error("[documentos] insert:", insertError);
    return { data: null, error: insertError.message };
  }

  return { data: inserted ? rowToDocumento(inserted as DocumentoRow) : null, error: null };
}

export async function deleteDocumento(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase não configurado" };

  const { data: doc, error: fetchError } = await supabase
    .from("documentos")
    .select("arquivo_url")
    .eq("id", id)
    .single();

  if (fetchError || !doc?.arquivo_url) {
    const { error } = await supabase.from("documentos").delete().eq("id", id);
    return { error: error?.message ?? null };
  }

  // Extrair path do URL para deletar do storage (opcional - pode deixar no storage)
  const { error: delError } = await supabase.from("documentos").delete().eq("id", id);
  if (delError) return { error: delError.message };
  return { error: null };
}
