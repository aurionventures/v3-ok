-- Create councils table
CREATE TABLE IF NOT EXISTS public.councils (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'administrativo',
  description TEXT,
  quorum INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create council_members table
CREATE TABLE IF NOT EXISTS public.council_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  council_id UUID NOT NULL REFERENCES public.councils(id) ON DELETE CASCADE,
  user_id UUID,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.councils ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.council_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for councils
CREATE POLICY "Users can view councils from their company"
  ON public.councils
  FOR SELECT
  USING (
    company_id IN (
      SELECT company FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert councils for their company"
  ON public.councils
  FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update councils from their company"
  ON public.councils
  FOR UPDATE
  USING (
    company_id IN (
      SELECT company FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete councils from their company"
  ON public.councils
  FOR DELETE
  USING (
    company_id IN (
      SELECT company FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all councils"
  ON public.councils
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for council_members
CREATE POLICY "Users can view members from their company councils"
  ON public.council_members
  FOR SELECT
  USING (
    council_id IN (
      SELECT id FROM public.councils WHERE company_id IN (
        SELECT company FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert members to their company councils"
  ON public.council_members
  FOR INSERT
  WITH CHECK (
    council_id IN (
      SELECT id FROM public.councils WHERE company_id IN (
        SELECT company FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update members from their company councils"
  ON public.council_members
  FOR UPDATE
  USING (
    council_id IN (
      SELECT id FROM public.councils WHERE company_id IN (
        SELECT company FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete members from their company councils"
  ON public.council_members
  FOR DELETE
  USING (
    council_id IN (
      SELECT id FROM public.councils WHERE company_id IN (
        SELECT company FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can manage all council members"
  ON public.council_members
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_councils_updated_at
  BEFORE UPDATE ON public.councils
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_council_members_updated_at
  BEFORE UPDATE ON public.council_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert demonstration councils
INSERT INTO public.councils (company_id, name, type, description, quorum, status) VALUES
  ('Empresa Demo', 'Conselho de Administração', 'administrativo', 'Responsável pelas decisões estratégicas da empresa', 3, 'active'),
  ('Empresa Demo', 'Conselho Fiscal', 'fiscal', 'Supervisão e controle das atividades contábeis e financeiras', 2, 'active'),
  ('Empresa Demo', 'Comitê de Sustentabilidade e ESG', 'consultivo', 'Orientação em práticas sustentáveis e governança ambiental, social e corporativa', 3, 'active');

-- Insert demonstration council members
WITH council_ids AS (
  SELECT id, name FROM public.councils WHERE company_id = 'Empresa Demo'
)
INSERT INTO public.council_members (council_id, name, role, start_date, status)
SELECT 
  (SELECT id FROM council_ids WHERE name = 'Conselho de Administração'),
  member.name,
  member.role,
  member.start_date,
  'active'
FROM (VALUES
  ('Roberto Martins Silva', 'Presidente do Conselho', '2023-01-15'::date),
  ('Ana Paula Ferreira', 'Vice-Presidente', '2023-01-15'::date),
  ('Carlos Eduardo Santos', 'Conselheiro Independente', '2023-03-20'::date),
  ('Maria Helena Costa', 'Conselheira', '2023-06-10'::date),
  ('João Pedro Almeida', 'Conselheiro', '2024-01-08'::date)
) AS member(name, role, start_date)
UNION ALL
SELECT 
  (SELECT id FROM council_ids WHERE name = 'Conselho Fiscal'),
  member.name,
  member.role,
  member.start_date,
  'active'
FROM (VALUES
  ('Patricia Rodrigues Lima', 'Presidente do Conselho Fiscal', '2023-02-01'::date),
  ('Fernando José Oliveira', 'Conselheiro Fiscal', '2023-02-01'::date),
  ('Lucia Maria Souza', 'Conselheira Fiscal', '2023-08-15'::date)
) AS member(name, role, start_date)
UNION ALL
SELECT 
  (SELECT id FROM council_ids WHERE name = 'Comitê de Sustentabilidade e ESG'),
  member.name,
  member.role,
  member.start_date,
  'active'
FROM (VALUES
  ('Beatriz Camargo Dias', 'Coordenadora do Comitê', '2023-04-01'::date),
  ('Ricardo Mendes Pinto', 'Especialista em ESG', '2023-04-01'::date),
  ('Gabriela Torres Santos', 'Especialista em Sustentabilidade', '2023-07-10'::date),
  ('André Luiz Barbosa', 'Consultor de Governança Corporativa', '2024-02-15'::date)
) AS member(name, role, start_date);