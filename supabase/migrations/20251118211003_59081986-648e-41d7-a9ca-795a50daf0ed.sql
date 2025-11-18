-- SPRINT 1: Criar tabelas para o módulo de reuniões, pautas e pendências

-- =====================================================
-- 1. Atualizar/Criar tabela meetings
-- =====================================================
CREATE TABLE IF NOT EXISTS public.meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id text NOT NULL,
  council_id uuid NOT NULL REFERENCES public.councils(id) ON DELETE CASCADE,
  date date NOT NULL,
  time text NOT NULL,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'Ordinária',
  status text NOT NULL DEFAULT 'AGENDADA',
  location text,
  modalidade text NOT NULL DEFAULT 'Presencial',
  attendees text[],
  minutes_full text,
  minutes_summary text,
  recording_url text,
  recording_type text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT meetings_type_check CHECK (type IN ('Ordinária', 'Extraordinária')),
  CONSTRAINT meetings_status_check CHECK (status IN ('AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA')),
  CONSTRAINT meetings_modalidade_check CHECK (modalidade IN ('Presencial', 'Online', 'Híbrida'))
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_meetings_company ON public.meetings(company_id);
CREATE INDEX IF NOT EXISTS idx_meetings_council ON public.meetings(council_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON public.meetings(date);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON public.meetings(status);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_meetings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS update_meetings_updated_at ON public.meetings;
CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_meetings_updated_at();

-- RLS Policies para meetings
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view meetings from their company" ON public.meetings;
CREATE POLICY "Users can view meetings from their company"
  ON public.meetings FOR SELECT
  TO authenticated
  USING (company_id IN (
    SELECT company FROM public.users WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert meetings for their company" ON public.meetings;
CREATE POLICY "Users can insert meetings for their company"
  ON public.meetings FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (SELECT company FROM public.users WHERE id = auth.uid())
    AND created_by = auth.uid()
  );

DROP POLICY IF EXISTS "Users can update meetings from their company" ON public.meetings;
CREATE POLICY "Users can update meetings from their company"
  ON public.meetings FOR UPDATE
  TO authenticated
  USING (company_id IN (
    SELECT company FROM public.users WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete meetings from their company" ON public.meetings;
CREATE POLICY "Users can delete meetings from their company"
  ON public.meetings FOR DELETE
  TO authenticated
  USING (company_id IN (
    SELECT company FROM public.users WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Admins can manage all meetings" ON public.meetings;
CREATE POLICY "Admins can manage all meetings"
  ON public.meetings FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- 2. Criar tabela meeting_items (Pautas)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.meeting_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  order_position integer NOT NULL DEFAULT 0,
  title text NOT NULL,
  description text,
  presenter text,
  duration_minutes integer,
  type text NOT NULL DEFAULT 'Informativo',
  is_sensitive boolean NOT NULL DEFAULT false,
  key_points jsonb DEFAULT '[]'::jsonb,
  detailed_script text,
  expected_outcome text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT meeting_items_type_check CHECK (type IN ('Deliberação', 'Informativo', 'Discussão'))
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_meeting_items_meeting ON public.meeting_items(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_items_order ON public.meeting_items(meeting_id, order_position);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_meeting_items_updated_at ON public.meeting_items;
CREATE TRIGGER update_meeting_items_updated_at
  BEFORE UPDATE ON public.meeting_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_meetings_updated_at();

-- RLS Policies para meeting_items
ALTER TABLE public.meeting_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view items from their company meetings" ON public.meeting_items;
CREATE POLICY "Users can view items from their company meetings"
  ON public.meeting_items FOR SELECT
  TO authenticated
  USING (meeting_id IN (
    SELECT id FROM public.meetings WHERE company_id IN (
      SELECT company FROM public.users WHERE id = auth.uid()
    )
  ));

DROP POLICY IF EXISTS "Users can insert items to their company meetings" ON public.meeting_items;
CREATE POLICY "Users can insert items to their company meetings"
  ON public.meeting_items FOR INSERT
  TO authenticated
  WITH CHECK (meeting_id IN (
    SELECT id FROM public.meetings WHERE company_id IN (
      SELECT company FROM public.users WHERE id = auth.uid()
    )
  ));

DROP POLICY IF EXISTS "Users can update items from their company meetings" ON public.meeting_items;
CREATE POLICY "Users can update items from their company meetings"
  ON public.meeting_items FOR UPDATE
  TO authenticated
  USING (meeting_id IN (
    SELECT id FROM public.meetings WHERE company_id IN (
      SELECT company FROM public.users WHERE id = auth.uid()
    )
  ));

DROP POLICY IF EXISTS "Users can delete items from their company meetings" ON public.meeting_items;
CREATE POLICY "Users can delete items from their company meetings"
  ON public.meeting_items FOR DELETE
  TO authenticated
  USING (meeting_id IN (
    SELECT id FROM public.meetings WHERE company_id IN (
      SELECT company FROM public.users WHERE id = auth.uid()
    )
  ));

DROP POLICY IF EXISTS "Admins can manage all meeting items" ON public.meeting_items;
CREATE POLICY "Admins can manage all meeting items"
  ON public.meeting_items FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- 3. Criar tabela meeting_actions (Combinados/Pendências)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.meeting_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  meeting_item_id uuid REFERENCES public.meeting_items(id) ON DELETE SET NULL,
  responsible_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  responsible_external_name text,
  responsible_external_email text,
  description text NOT NULL,
  due_date date NOT NULL,
  status text NOT NULL DEFAULT 'PENDENTE',
  priority text NOT NULL DEFAULT 'MEDIA',
  category text,
  notes text,
  completed_at timestamp with time zone,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT meeting_actions_status_check CHECK (status IN ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'ATRASADA')),
  CONSTRAINT meeting_actions_priority_check CHECK (priority IN ('BAIXA', 'MEDIA', 'ALTA'))
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_meeting_actions_meeting ON public.meeting_actions(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_actions_responsible ON public.meeting_actions(responsible_id);
CREATE INDEX IF NOT EXISTS idx_meeting_actions_status ON public.meeting_actions(status);
CREATE INDEX IF NOT EXISTS idx_meeting_actions_due_date ON public.meeting_actions(due_date);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_meeting_actions_updated_at ON public.meeting_actions;
CREATE TRIGGER update_meeting_actions_updated_at
  BEFORE UPDATE ON public.meeting_actions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_meetings_updated_at();

-- Trigger para calcular status ATRASADA automaticamente
CREATE OR REPLACE FUNCTION public.update_meeting_actions_overdue()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.due_date < CURRENT_DATE AND NEW.status != 'CONCLUIDA' THEN
    NEW.status = 'ATRASADA';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_meeting_actions_overdue ON public.meeting_actions;
CREATE TRIGGER check_meeting_actions_overdue
  BEFORE INSERT OR UPDATE ON public.meeting_actions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_meeting_actions_overdue();

-- Trigger para marcar completed_at quando status = CONCLUIDA
CREATE OR REPLACE FUNCTION public.set_meeting_actions_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'CONCLUIDA' AND OLD.status != 'CONCLUIDA' THEN
    NEW.completed_at = now();
  ELSIF NEW.status != 'CONCLUIDA' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_meeting_actions_completed ON public.meeting_actions;
CREATE TRIGGER set_meeting_actions_completed
  BEFORE UPDATE ON public.meeting_actions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_meeting_actions_completed_at();

-- RLS Policies para meeting_actions
ALTER TABLE public.meeting_actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view actions from their company meetings" ON public.meeting_actions;
CREATE POLICY "Users can view actions from their company meetings"
  ON public.meeting_actions FOR SELECT
  TO authenticated
  USING (meeting_id IN (
    SELECT id FROM public.meetings WHERE company_id IN (
      SELECT company FROM public.users WHERE id = auth.uid()
    )
  ));

DROP POLICY IF EXISTS "Responsible users can view their own actions" ON public.meeting_actions;
CREATE POLICY "Responsible users can view their own actions"
  ON public.meeting_actions FOR SELECT
  TO authenticated
  USING (responsible_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert actions to their company meetings" ON public.meeting_actions;
CREATE POLICY "Users can insert actions to their company meetings"
  ON public.meeting_actions FOR INSERT
  TO authenticated
  WITH CHECK (meeting_id IN (
    SELECT id FROM public.meetings WHERE company_id IN (
      SELECT company FROM public.users WHERE id = auth.uid()
    )
  ));

DROP POLICY IF EXISTS "Users can update actions from their company meetings" ON public.meeting_actions;
CREATE POLICY "Users can update actions from their company meetings"
  ON public.meeting_actions FOR UPDATE
  TO authenticated
  USING (meeting_id IN (
    SELECT id FROM public.meetings WHERE company_id IN (
      SELECT company FROM public.users WHERE id = auth.uid()
    )
  ) OR responsible_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete actions from their company meetings" ON public.meeting_actions;
CREATE POLICY "Users can delete actions from their company meetings"
  ON public.meeting_actions FOR DELETE
  TO authenticated
  USING (meeting_id IN (
    SELECT id FROM public.meetings WHERE company_id IN (
      SELECT company FROM public.users WHERE id = auth.uid()
    )
  ));

DROP POLICY IF EXISTS "Admins can manage all meeting actions" ON public.meeting_actions;
CREATE POLICY "Admins can manage all meeting actions"
  ON public.meeting_actions FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));