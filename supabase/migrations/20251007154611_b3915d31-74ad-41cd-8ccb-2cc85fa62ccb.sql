-- Create interviews table
CREATE TABLE public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'interviewed')),
  scheduled_date TIMESTAMPTZ,
  interview_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create interview_transcripts table
CREATE TABLE public.interview_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID REFERENCES public.interviews(id) ON DELETE CASCADE NOT NULL,
  transcript_text TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_transcripts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for interviews
CREATE POLICY "Users can view interviews from their company"
  ON public.interviews FOR SELECT
  USING (
    company_id IN (
      SELECT company FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create interviews for their company"
  ON public.interviews FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company FROM public.users WHERE id = auth.uid()
    )
    AND user_id = auth.uid()
  );

CREATE POLICY "Users can update interviews from their company"
  ON public.interviews FOR UPDATE
  USING (
    company_id IN (
      SELECT company FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete interviews from their company"
  ON public.interviews FOR DELETE
  USING (
    company_id IN (
      SELECT company FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all interviews"
  ON public.interviews FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for interview_transcripts
CREATE POLICY "Users can view transcripts from their company interviews"
  ON public.interview_transcripts FOR SELECT
  USING (
    interview_id IN (
      SELECT id FROM public.interviews
      WHERE company_id IN (
        SELECT company FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create transcripts for their company interviews"
  ON public.interview_transcripts FOR INSERT
  WITH CHECK (
    interview_id IN (
      SELECT id FROM public.interviews
      WHERE company_id IN (
        SELECT company FROM public.users WHERE id = auth.uid()
      )
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "Users can update transcripts from their company interviews"
  ON public.interview_transcripts FOR UPDATE
  USING (
    interview_id IN (
      SELECT id FROM public.interviews
      WHERE company_id IN (
        SELECT company FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can manage all transcripts"
  ON public.interview_transcripts FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at on interviews
CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON public.interviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();