-- Bucket para documentos do checklist
-- Em Supabase hospedado, o bucket pode precisar ser criado manualmente no Dashboard se esta migration falhar

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documentos',
  'documentos',
  true,
  10485760,
  ARRAY['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation','text/plain','image/jpeg','image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Políticas para permitir upload e leitura (ajuste conforme seu auth)
CREATE POLICY "Documentos: permitir upload anon"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'documentos');

CREATE POLICY "Documentos: permitir leitura anon"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'documentos');
