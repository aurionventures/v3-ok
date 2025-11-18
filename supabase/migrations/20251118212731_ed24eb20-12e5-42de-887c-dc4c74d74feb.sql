-- Create meeting_participants table
CREATE TABLE IF NOT EXISTS public.meeting_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  external_name TEXT,
  external_email TEXT,
  external_phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('MEMBRO', 'CONVIDADO', 'OBSERVADOR')),
  can_upload BOOLEAN DEFAULT false,
  can_view_materials BOOLEAN DEFAULT true,
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT participant_identity_check CHECK (
    (user_id IS NOT NULL AND external_name IS NULL AND external_email IS NULL) OR
    (user_id IS NULL AND external_name IS NOT NULL AND external_email IS NOT NULL)
  )
);

-- Create meeting_item_visibility table
CREATE TABLE IF NOT EXISTS public.meeting_item_visibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_item_id UUID NOT NULL REFERENCES public.meeting_items(id) ON DELETE CASCADE,
  meeting_participant_id UUID NOT NULL REFERENCES public.meeting_participants(id) ON DELETE CASCADE,
  can_view BOOLEAN DEFAULT true,
  can_comment BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(meeting_item_id, meeting_participant_id)
);

-- Create guest_tokens table
CREATE TABLE IF NOT EXISTS public.guest_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_participant_id UUID NOT NULL REFERENCES public.meeting_participants(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0,
  can_upload BOOLEAN DEFAULT false,
  can_view_materials BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create meeting_documents table
CREATE TABLE IF NOT EXISTS public.meeting_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  meeting_item_id UUID REFERENCES public.meeting_items(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by_user_id UUID REFERENCES auth.users(id),
  uploaded_by_guest_token TEXT,
  document_type TEXT CHECK (document_type IN ('ATA', 'RELATORIO', 'PROPOSTA', 'ANALISE', 'APRESENTACAO', 'OUTROS')),
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_meeting_participants_meeting ON public.meeting_participants(meeting_id);
CREATE INDEX idx_meeting_participants_user ON public.meeting_participants(user_id);
CREATE INDEX idx_guest_tokens_token ON public.guest_tokens(token);
CREATE INDEX idx_guest_tokens_participant ON public.guest_tokens(meeting_participant_id);
CREATE INDEX idx_meeting_documents_meeting ON public.meeting_documents(meeting_id);
CREATE INDEX idx_meeting_item_visibility_item ON public.meeting_item_visibility(meeting_item_id);

-- Enable RLS
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_item_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meeting_participants
CREATE POLICY "Admins can manage all meeting participants"
  ON public.meeting_participants FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view participants from their company meetings"
  ON public.meeting_participants FOR SELECT
  USING (
    meeting_id IN (
      SELECT m.id FROM public.meetings m
      WHERE m.company_id IN (
        SELECT company FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert participants to their company meetings"
  ON public.meeting_participants FOR INSERT
  WITH CHECK (
    meeting_id IN (
      SELECT m.id FROM public.meetings m
      WHERE m.company_id IN (
        SELECT company FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update participants from their company meetings"
  ON public.meeting_participants FOR UPDATE
  USING (
    meeting_id IN (
      SELECT m.id FROM public.meetings m
      WHERE m.company_id IN (
        SELECT company FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete participants from their company meetings"
  ON public.meeting_participants FOR DELETE
  USING (
    meeting_id IN (
      SELECT m.id FROM public.meetings m
      WHERE m.company_id IN (
        SELECT company FROM public.users WHERE id = auth.uid()
      )
    )
  );

-- RLS Policies for meeting_item_visibility
CREATE POLICY "Admins can manage all item visibility"
  ON public.meeting_item_visibility FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view item visibility from their company meetings"
  ON public.meeting_item_visibility FOR SELECT
  USING (
    meeting_item_id IN (
      SELECT mi.id FROM public.meeting_items mi
      JOIN public.meetings m ON mi.meeting_id = m.id
      WHERE m.company_id IN (
        SELECT company FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage item visibility for their company meetings"
  ON public.meeting_item_visibility FOR ALL
  USING (
    meeting_item_id IN (
      SELECT mi.id FROM public.meeting_items mi
      JOIN public.meetings m ON mi.meeting_id = m.id
      WHERE m.company_id IN (
        SELECT company FROM public.users WHERE id = auth.uid()
      )
    )
  );

-- RLS Policies for guest_tokens
CREATE POLICY "Admins can manage all guest tokens"
  ON public.guest_tokens FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view guest tokens from their company meetings"
  ON public.guest_tokens FOR SELECT
  USING (
    meeting_participant_id IN (
      SELECT mp.id FROM public.meeting_participants mp
      JOIN public.meetings m ON mp.meeting_id = m.id
      WHERE m.company_id IN (
        SELECT company FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create guest tokens for their company meetings"
  ON public.guest_tokens FOR INSERT
  WITH CHECK (
    meeting_participant_id IN (
      SELECT mp.id FROM public.meeting_participants mp
      JOIN public.meetings m ON mp.meeting_id = m.id
      WHERE m.company_id IN (
        SELECT company FROM public.users WHERE id = auth.uid()
      )
    )
  );

-- RLS Policies for meeting_documents
CREATE POLICY "Admins can manage all meeting documents"
  ON public.meeting_documents FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view documents from their company meetings"
  ON public.meeting_documents FOR SELECT
  USING (
    meeting_id IN (
      SELECT m.id FROM public.meetings m
      WHERE m.company_id IN (
        SELECT company FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can upload documents to their company meetings"
  ON public.meeting_documents FOR INSERT
  WITH CHECK (
    meeting_id IN (
      SELECT m.id FROM public.meetings m
      WHERE m.company_id IN (
        SELECT company FROM public.users WHERE id = auth.uid()
      )
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_meeting_participants_updated_at
  BEFORE UPDATE ON public.meeting_participants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for meeting documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('meeting-documents', 'meeting-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for meeting documents
CREATE POLICY "Users can view meeting documents from their company"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'meeting-documents' AND
    (storage.foldername(name))[1] IN (
      SELECT m.company_id FROM public.meetings m
      JOIN public.users u ON u.company = m.company_id
      WHERE u.id = auth.uid()
    )
  );

CREATE POLICY "Users can upload meeting documents to their company"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'meeting-documents' AND
    (storage.foldername(name))[1] IN (
      SELECT m.company_id FROM public.meetings m
      JOIN public.users u ON u.company = m.company_id
      WHERE u.id = auth.uid()
    )
  );